// Rectangular buttons. Cero rounded radius > 2px. Cero gradientes.
// Primary: signal fill + paper text. Secondary: transparent + ink border.

const baseStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    fontWeight: 500,
    letterSpacing: "-0.005em",
    lineHeight: 1,
    padding: "16px 28px",
    cursor: "pointer",
    border: "1px solid transparent",
    borderRadius: "2px",
    transition:
        "background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    minHeight: "48px",
};

export function PrimaryButton({ children, onClick, disabled, type = "button", style, icon, ...rest }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                ...baseStyle,
                background: disabled ? "var(--ink-faint)" : "var(--signal-gradient)",
                color: "#ffffff",
                borderColor: "transparent",
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                ...style,
            }}
            onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
                if (!disabled) e.currentTarget.style.opacity = "1";
            }}
            {...rest}
        >
            {children}
            {icon && <span style={{ display: "flex" }}>{icon}</span>}
        </button>
    );
}

export function SecondaryButton({ children, onClick, disabled, type = "button", style, icon, ...rest }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                ...baseStyle,
                background: "var(--paper-card)",
                color: "var(--ink)",
                borderColor: "var(--rule)",
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                ...style,
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = "var(--paper-tint)";
                    e.currentTarget.style.borderColor = "var(--ink-faint)";
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = "var(--paper-card)";
                    e.currentTarget.style.borderColor = "var(--rule)";
                }
            }}
            {...rest}
        >
            {icon && <span style={{ display: "flex" }}>{icon}</span>}
            {children}
        </button>
    );
}

export function GhostButton({ children, onClick, disabled, type = "button", style, ...rest }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--ink-soft)",
                background: "transparent",
                border: 0,
                cursor: disabled ? "not-allowed" : "pointer",
                padding: "8px 4px",
                opacity: disabled ? 0.4 : 1,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                transition: "color var(--duration-fast) var(--ease-out)",
                ...style,
            }}
            onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
                if (!disabled) e.currentTarget.style.color = "var(--ink-soft)";
            }}
            {...rest}
        >
            {children}
        </button>
    );
}
