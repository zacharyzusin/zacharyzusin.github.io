// ---------------------------------------------------------------------------
// Visitor analytics configuration
//
// Uses a free Supabase project (no credit card required):
//   1. Create a project at https://supabase.com
//   2. SQL Editor → run:
//
//        create table if not exists visits (
//          id bigint generated always as identity primary key,
//          created_at timestamptz not null default now(),
//          visitor_id text,
//          session_id text,
//          lat float8,
//          lng float8,
//          city text,
//          country text,
//          referrer text,
//          user_agent text,
//          geo jsonb,
//          time_on_page_seconds int4,
//          max_scroll_pct int4,
//          sections_viewed text[]
//        );
//
//        alter table visits enable row level security;
//
//        create policy "anon insert" on visits for insert to anon with check (true);
//        create policy "anon select" on visits for select to anon using (true);
//
//        -- Engagement fields get filled in after the initial insert (once the
//        -- visitor leaves), so anon also needs UPDATE — but scoped to just
//        -- those 3 columns via a column-level grant, so the location/referrer/
//        -- UA/geo data stays permanently write-once.
//        grant update (time_on_page_seconds, max_scroll_pct, sections_viewed) on visits to anon;
//        create policy "anon update engagement" on visits for update to anon using (true) with check (true);
//
//   3. Project Settings → API → copy the values below
//
// The anon key is safe to expose in a public site — access is limited by the
// row-level-security policies above. Note that those policies make the table
// publicly *readable* too (required so the globe can render markers without a
// backend) — anyone with the anon key (visible in the site's JS bundle) can
// query the raw rows, not just what's drawn on the globe. The UPDATE policy
// also means anyone can overwrite the 3 engagement columns on any row (e.g.
// zero out someone's time-on-page) since there's no per-session ownership
// check possible with a shared anon key — low stakes for a personal site,
// but worth knowing.
// ---------------------------------------------------------------------------

export const SUPABASE_URL = "https://cfbizoohzgqvexcymmjt.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYml6b29oemdxdmV4Y3ltbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNTI3OTEsImV4cCI6MjA5OTgyODc5MX0.tKOG4hnpZXU6kEWHd8kEg1liZ1sWNr9_6nZf7oyNNtg";

export const isConfigured = () =>
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

export interface Visit {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface EngagementSnapshot {
  timeOnPageSeconds: number;
  maxScrollPct: number;
  sectionsViewed: string[];
}

function getOrCreateId(storage: Storage, key: string): string {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

// Stable per-browser id (persists across visits) — lets you tell unique
// visitors apart from repeat ones (e.g. a recruiter coming back a second time).
export const getVisitorId = () => getOrCreateId(localStorage, "zz_visitor_id");

// Stable per-tab id (cleared when the tab closes) — identifies which visits
// row to attach engagement data to later in the same tab session.
export const getSessionId = () => getOrCreateId(sessionStorage, "zz_session_id");

interface GeoLookup {
  lat: number;
  lng: number;
  city: string;
  country: string;
  raw: Record<string, unknown>;
}

// Look up the visitor's location from a free, keyless geo-IP API. Coordinates
// are stored at full precision — note this is still only as accurate as
// IP-based geolocation gets (typically the visitor's ISP/network node, not a
// GPS fix), so it doesn't reveal an exact address.
// `raw` is the full response (ISP/org, timezone, region, postal code, ASN,
// etc.) — stored as-is in the `geo` column for anything not broken out above.
async function geolocate(): Promise<GeoLookup | null> {
  try {
    const res = await fetch("https://ipwho.is/", { cache: "no-store" });
    const data = await res.json();
    if (!data || data.success === false) return null;
    return {
      lat: data.latitude,
      lng: data.longitude,
      city: data.city ?? "",
      country: data.country ?? "",
      raw: data,
    };
  } catch {
    return null;
  }
}

// Record the current visit — at most once per browser tab session.
export async function recordVisit(): Promise<void> {
  if (!isConfigured()) return;
  try {
    if (sessionStorage.getItem("zz_visit_recorded")) return;

    const geo = await geolocate();
    if (!geo) return;

    await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        lat: geo.lat,
        lng: geo.lng,
        city: geo.city,
        country: geo.country,
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        geo: geo.raw,
      }),
    });

    sessionStorage.setItem("zz_visit_recorded", "1");
  } catch {
    // Silently ignore — analytics should never break the page.
  }
}

// Update engagement for the current session's visits row (time on page,
// scroll depth, which sections were actually seen). Called on tab-hide/
// unload, so this uses `keepalive` to let the request finish after the page
// starts closing. May fire more than once per session (e.g. switching tabs
// back and forth) — each call overwrites with a fresh cumulative snapshot.
export function recordEngagement(snapshot: EngagementSnapshot): void {
  if (!isConfigured()) return;
  try {
    fetch(
      `${SUPABASE_URL}/rest/v1/visits?session_id=eq.${encodeURIComponent(getSessionId())}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          time_on_page_seconds: snapshot.timeOnPageSeconds,
          max_scroll_pct: snapshot.maxScrollPct,
          sections_viewed: snapshot.sectionsViewed,
        }),
        keepalive: true,
      }
    );
  } catch {
    // Silently ignore — analytics should never break the page.
  }
}

// Fetch all stored visits (used only to render markers on the globe).
export async function fetchVisits(): Promise<Visit[]> {
  if (!isConfigured()) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/visits?select=lat,lng,city,country`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as Visit[];
  } catch {
    return [];
  }
}

// A few seeded points so the globe looks alive before any real data arrives
// (and as a fallback if Supabase isn't configured yet).
export const SEED_VISITS: Visit[] = [
  { lat: 40.7, lng: -74.0, city: "New York", country: "United States" },
  { lat: 37.8, lng: -122.4, city: "San Francisco", country: "United States" },
  { lat: 51.5, lng: -0.1, city: "London", country: "United Kingdom" },
  { lat: 48.9, lng: 2.4, city: "Paris", country: "France" },
  { lat: 55.8, lng: 37.6, city: "Moscow", country: "Russia" },
  { lat: 35.7, lng: 139.7, city: "Tokyo", country: "Japan" },
  { lat: 1.4, lng: 103.8, city: "Singapore", country: "Singapore" },
  { lat: -33.9, lng: 151.2, city: "Sydney", country: "Australia" },
];
