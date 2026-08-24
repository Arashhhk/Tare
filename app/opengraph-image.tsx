import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "تره‌بار | خرید آنلاین میوه و سبزیجات تازه"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #f59e0b 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "rgba(255,255,255,0.15)",
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          ت
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, display: "flex" }}>تره‌بار</div>
        <div style={{ fontSize: 32, marginTop: 16, opacity: 0.9, display: "flex" }}>
          خرید آنلاین میوه و سبزیجات تازه
        </div>
      </div>
    ),
    { ...size }
  )
}
