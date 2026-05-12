import { useEffect, useRef } from "react";
import { animate } from "motion";

// Slider 1-10 con valor teatral en Cabinet Grotesk display.
// Cuando el valor cruza el threshold 5→6, el número anima a Signal terracotta.
// Anchors "Sobrio" y "Impacto" en mono face en los extremos.

export function ImpactSlider({ value = 5, onChange, min = 1, max = 10, anchorLow = "Sobrio", anchorHigh = "Impacto" }) {
    const valueRef = useRef(null);
    const prevValue = useRef(value);

    useEffect(() => {
        if (!valueRef.current) return;
        const wasLow = prevValue.current <= 5;
        const nowLow = value <= 5;
        if (wasLow !== nowLow) {
            // Teatro de pulse cuando cruza el threshold
            animate(
                valueRef.current,
                { scale: [1, 1.06, 1] },
                { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
            );
        }
        prevValue.current = value;
    }, [value]);

    const isHigh = value > 5;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
                <div
                    ref={valueRef}
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "4.5rem",
                        fontWeight: 800,
                        lineHeight: 1,
                        letterSpacing: "-0.045em",
                        color: isHigh ? "var(--signal)" : "var(--ink)",
                        transition: "color 220ms var(--ease-out)",
                        fontFeatureSettings: '"tnum" 1',
                        willChange: "transform, color",
                    }}
                >
                    {String(value).padStart(2, "0")}
                </div>
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8125rem",
                        color: "var(--ink-soft)",
                        textTransform: "lowercase",
                    }}
                >
                    de {max}
                </div>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ width: "100%" }}
                aria-label={`Impacto visual de ${min} a ${max}`}
            />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--ink-faint)",
                    textTransform: "lowercase",
                    letterSpacing: "0.02em",
                }}
            >
                <span>{anchorLow}</span>
                <span>{anchorHigh}</span>
            </div>
        </div>
    );
}
