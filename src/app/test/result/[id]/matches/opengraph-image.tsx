import { ImageResponse } from "next/og";
import { computeMatches } from "@/lib/match";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { planA } = await computeMatches(id, { persist: false });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, display: "flex" }}>Belongo</div>

        {planA ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 28, opacity: 0.85, display: "flex" }}>
              Mijn perfecte plek-match:
            </div>
            <div style={{ fontSize: 76, fontWeight: 700, display: "flex" }}>
              {planA.name}
              {planA.parentName ? `, ${planA.parentName}` : ""}
            </div>
            <div style={{ fontSize: 44, fontWeight: 600, opacity: 0.9, display: "flex" }}>
              {planA.matchPercent}% match
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 48, fontWeight: 700, display: "flex" }}>
            Ontdek jouw perfecte plek
          </div>
        )}

        <div style={{ fontSize: 24, opacity: 0.7, display: "flex" }}>
          Doe de test op belongo
        </div>
      </div>
    ),
    { ...size }
  );
}
