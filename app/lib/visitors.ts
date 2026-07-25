// ---------------------------------------------------------------------------
// Visitor map configuration
//
// Fill these in with your free Supabase project (no credit card required):
//   1. Create a project at https://supabase.com
//   2. Table editor → create table "visits" with columns:
//        id (int8, identity, primary key)   [default]
//        created_at (timestamptz, default now())   [default]
//        lat (float8)
//        lng (float8)
//        city (text)
//        country (text)
//   3. Authentication → Policies → enable RLS on "visits" and add:
//        - INSERT policy for role "anon"  (using: true, with check: true)
//        - SELECT policy for role "anon"  (using: true)
//   4. Project Settings → API → copy the values below
//
// The anon key is safe to expose in a public site — access is limited by the
// row-level-security policies above.
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

// Round coordinates so we only ever store/show coarse (~city-level) locations.
const coarse = (n: number) => Math.round(n * 10) / 10;

// Look up the visitor's approximate location from a free, keyless geo-IP API.
async function geolocate(): Promise<Visit | null> {
  try {
    const res = await fetch("https://ipwho.is/", { cache: "no-store" });
    const data = await res.json();
    if (!data || data.success === false) return null;
    return {
      lat: coarse(data.latitude),
      lng: coarse(data.longitude),
      city: data.city ?? "",
      country: data.country ?? "",
    };
  } catch {
    return null;
  }
}

// Record the current visit — at most once per browser per day.
export async function recordVisit(): Promise<void> {
  if (!isConfigured()) return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem("zz_visit_day") === today) return;

    const visit = await geolocate();
    if (!visit) return;

    await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(visit),
    });

    localStorage.setItem("zz_visit_day", today);
  } catch {
    // Silently ignore — the map should never break the page.
  }
}

// Fetch all stored visits.
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
