import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Unveiled — The story behind every chapter.";
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
          backgroundColor: "#0F0B08",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial glow behind the mark */}
        <div
          style={{
            position: "absolute",
            top: 180,
            left: 100,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,123,26,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Main content row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
            padding: "0 100px",
            flex: 1,
          }}
        >
          {/* Logo mark */}
          <svg width="110" height="110" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="7" fill="#1C1410" />
            <path
              d="M6 5 L15 16 L6 27"
              stroke="#C97B1A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26 5 L17 16 L26 27"
              stroke="#C97B1A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="16" r="3" fill="#C97B1A" />
          </svg>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span
              style={{
                fontSize: 88,
                fontWeight: 700,
                color: "#F5F0EA",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              Unveiled
            </span>
            <span
              style={{
                fontSize: 30,
                color: "#9A8A78",
                fontWeight: 400,
                letterSpacing: "0px",
              }}
            >
              The story behind every chapter.
            </span>
          </div>
        </div>

        {/* Amber bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "#C97B1A",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
