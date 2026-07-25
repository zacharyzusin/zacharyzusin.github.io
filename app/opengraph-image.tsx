import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Zach Zusin — ML Engineer & Researcher";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 25% 30%, #14213d 0%, #0a0f1e 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              border: "3px solid #3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3b82f6",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            ZZ
          </div>
          <div style={{ color: "#3b82f6", fontSize: 26, fontWeight: 600 }}>
            zacharyzusin.github.io
          </div>
        </div>

        <div
          style={{
            color: "#f1f5f9",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Zach Zusin
        </div>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 40,
            fontWeight: 500,
            marginTop: 16,
          }}
        >
          Columbia CS graduate · Machine learning researcher
        </div>
      </div>
    ),
    { ...size }
  );
}
