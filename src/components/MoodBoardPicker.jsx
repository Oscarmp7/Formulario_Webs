import { useState } from "react";

// ── CSS fallback thumbnails (only used when real screenshot is unavailable) ──

function ObysThumb() {
    return (
        <div style={{ position: "absolute", inset: 0, background: "#0C0C0C", overflow: "hidden" }}>
            <div style={{
                position: "absolute", top: "8%", left: "-4%",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 900, fontSize: 44, lineHeight: 0.88,
                color: "#FFFFFF", letterSpacing: "-0.03em",
                userSelect: "none", transform: "rotate(-6deg)", whiteSpace: "nowrap",
            }}>
                OBYS
            </div>
            <div style={{ position: "absolute", bottom: "24%", right: "8%", left: "30%", height: 2, background: "#CCFF00" }} />
            <div style={{
                position: "absolute", bottom: "11%", right: "8%",
                fontFamily: "monospace", fontSize: 7, color: "#CCFF00",
                letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
                AGENCY
            </div>
        </div>
    );
}

function LusionThumb() {
    return (
        <div style={{ position: "absolute", inset: 0, background: "#080808", overflow: "hidden" }}>
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -56%)",
                width: "60%", aspectRatio: "1", borderRadius: "50%",
                background: "radial-gradient(circle at 38% 38%, #2DF4D0 0%, #0EA5E9 30%, #6366F1 62%, transparent 78%)",
                filter: "blur(8px)", opacity: 0.65,
            }} />
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -56%)",
                width: "14%", aspectRatio: "1", borderRadius: "50%",
                background: "radial-gradient(circle, #E8FDF8 0%, #2DF4D0 55%, transparent 80%)",
                opacity: 0.95,
            }} />
            <div style={{
                position: "absolute", bottom: 7, left: 0, right: 0, textAlign: "center",
                fontFamily: "system-ui, sans-serif", fontWeight: 300, fontSize: 8,
                color: "rgba(255,255,255,0.32)", letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
                lusion
            </div>
        </div>
    );
}

// ── Site definitions ──────────────────────────────────────────────────────────

const SITES = [
    {
        id: "buck",
        name: "buck.co",
        desc: "Cinematic · Bold type",
        url: "https://buck.co",
        CssFallback: null,
    },
    {
        id: "linear",
        name: "linear.app",
        desc: "Precision · Dark UI",
        url: "https://linear.app",
        CssFallback: null,
    },
    {
        id: "stripe",
        name: "stripe.com",
        desc: "Clean · Professional",
        url: "https://stripe.com",
        CssFallback: null,
    },
    {
        id: "obys",
        name: "obys.agency",
        desc: "Experimental · Agency",
        url: "https://obys.agency",
        CssFallback: ObysThumb,
    },
    {
        id: "lusion",
        name: "lusion.co",
        desc: "Immersive · 3D",
        url: "https://lusion.co",
        CssFallback: LusionThumb,
    },
    {
        id: "cosmos",
        name: "cosmos.so",
        desc: "Curated · Editorial",
        url: "https://cosmos.so",
        CssFallback: null,
    },
];

// ── External link icon ────────────────────────────────────────────────────────

function IconExternal() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 10L10 2M10 2H4.5M10 2V7.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── SiteThumbnail ─────────────────────────────────────────────────────────────
// Structure: outer <div> with border + selection state.
// Inner <button> for selection toggle (image area).
// <a> in label row for external navigation — avoids <a> inside <button>.

function SiteThumbnail({ site, selected, onToggle }) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(!!site.CssFallback);
    const { CssFallback } = site;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                border: `1.5px solid ${selected ? "var(--signal)" : hovered ? "var(--ink-soft)" : "var(--rule)"}`,
                display: "flex",
                flexDirection: "column",
                transition: "border-color var(--duration-fast) var(--ease-out)",
            }}
        >
            {/* Thumbnail — click toggles selection */}
            <button
                type="button"
                onClick={onToggle}
                aria-pressed={selected}
                style={{
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    position: "relative",
                    aspectRatio: "3/2",
                    overflow: "hidden",
                    flexShrink: 0,
                }}
            >
                {!imgError ? (
                    <img
                        src={`/mood-board/${site.id}.png`}
                        alt={`Captura de ${site.name}`}
                        onError={() => setImgError(true)}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top center",
                            display: "block",
                        }}
                    />
                ) : (
                    <CssFallback />
                )}

                {selected && (
                    <div style={{
                        position: "absolute", top: 6, right: 6,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "var(--signal)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: 11, fontWeight: 700,
                        fontFamily: "system-ui, sans-serif", lineHeight: 1,
                    }}>
                        ✓
                    </div>
                )}
            </button>

            {/* Label row — name + external link */}
            <div style={{
                padding: "7px 8px 6px",
                display: "flex",
                alignItems: "flex-start",
                gap: "6px",
                cursor: "pointer",
            }}
                onClick={onToggle}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: selected ? "var(--signal)" : "var(--ink)",
                        marginBottom: 2,
                        transition: "color var(--duration-fast) var(--ease-out)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                        {site.name}
                    </div>
                    <div style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.6875rem",
                        color: "var(--ink-soft)",
                        lineHeight: 1.3,
                    }}>
                        {site.desc}
                    </div>
                </div>

                {/* External link — outside the inner button, valid HTML */}
                <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Ver ${site.name} en una nueva pestaña`}
                    style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 22,
                        height: 22,
                        color: hovered ? "var(--ink)" : "var(--ink-faint)",
                        transition: "color var(--duration-fast) var(--ease-out)",
                        marginTop: 1,
                        textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        e.currentTarget.style.color = "var(--signal)";
                    }}
                    onMouseLeave={(e) => {
                        e.stopPropagation();
                        e.currentTarget.style.color = hovered ? "var(--ink)" : "var(--ink-faint)";
                    }}
                >
                    <IconExternal />
                </a>
            </div>
        </div>
    );
}

// ── MoodBoardPicker (public) ──────────────────────────────────────────────────

export function MoodBoardPicker({ value = [], onChange }) {
    const MAX = 2;

    const toggle = (id) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else if (value.length < MAX) {
            onChange([...value, id]);
        } else {
            onChange([value[1], id]);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {SITES.map((site) => (
                    <SiteThumbnail
                        key={site.id}
                        site={site}
                        selected={value.includes(site.id)}
                        onToggle={() => toggle(site.id)}
                    />
                ))}
            </div>
            {value.length > 0 && (
                <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--ink-soft)",
                }}>
                    {value.length === MAX
                        ? "Elige hasta 2. Haz clic en una para cambiarla."
                        : "Puedes elegir hasta 2."}
                </div>
            )}
        </div>
    );
}
