import { useEffect } from "react";

export function ConfirmModal({ title, body, confirmLabel = "Confirmar", onConfirm, onCancel }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onCancel(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onCancel]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
            }}
        >
            {/* Backdrop */}
            <div
                aria-hidden="true"
                onClick={onCancel}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.52)",
                }}
            />

            {/* Panel */}
            <div
                style={{
                    position: "relative",
                    background: "var(--paper-card)",
                    border: "1px solid var(--rule)",
                    padding: "36px 32px 28px",
                    maxWidth: "420px",
                    width: "100%",
                    zIndex: 1,
                }}
            >
                {/* Eyebrow rule */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "var(--danger)",
                    }}
                />

                <h2
                    id="confirm-modal-title"
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "var(--ink)",
                        margin: "0 0 10px",
                    }}
                >
                    {title}
                </h2>

                {body && (
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9375rem",
                            color: "var(--ink-soft)",
                            lineHeight: 1.55,
                            margin: "0 0 28px",
                        }}
                    >
                        {body}
                    </p>
                )}

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        autoFocus
                        style={{
                            padding: "10px 22px",
                            border: "1px solid var(--rule)",
                            background: "transparent",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9375rem",
                            fontWeight: 500,
                            color: "var(--ink)",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-tint)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        style={{
                            padding: "10px 22px",
                            border: "none",
                            background: "var(--danger)",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9375rem",
                            fontWeight: 500,
                            color: "#fff",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
