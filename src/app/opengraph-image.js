import { ImageResponse } from "next/og";
import { siteUrl } from "@/lib/site";

// Drop the "www." for display: the share card is branding, not a URL bar.
const siteHost = new URL(siteUrl).host.replace(/^www\./, "");

export const alt = "Justine Jude Cuevas | Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            "radial-gradient(900px circle at 78% 18%, rgba(59,130,246,0.20), transparent 45%), #0a0a0a",
          color: "#e5e5e5",
        }}
      >
        <div style={{ display: "flex", color: "#7c8794", fontSize: 30, marginBottom: 18 }}>
          {"// full-stack developer · philippines"}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          <span style={{ color: "#fafafa" }}>Justine Jude Cuevas</span>
          <span style={{ color: "#a8adb2" }}>Full Stack Developer</span>
        </div>
        <div style={{ display: "flex", color: "#7c8794", fontSize: 28, marginTop: 30 }}>
          I build web apps, front to back, and ship my own on the side.
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 54 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(22,163,74,0.18)",
              padding: "10px 20px",
              borderRadius: 999,
              marginRight: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#22c55e",
                marginRight: 10,
              }}
            />
            <span style={{ color: "#22c55e", fontSize: 24, fontWeight: 700 }}>
              Open for new projects
            </span>
          </div>
          <span style={{ color: "#a8adb2", fontSize: 26 }}>Philippines</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 64,
            color: "#525a63",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          {siteHost}
        </div>
      </div>
    ),
    { ...size }
  );
}
