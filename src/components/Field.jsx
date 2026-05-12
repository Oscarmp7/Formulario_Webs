// Field wrapper: label (optional) + control + note + error.
// Inputs: white bg + full border. Focus = signal blue border.

export function Field({ label, hint, error, required, htmlFor, children, style }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", ...style }}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--ink)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.3,
                    }}
                >
                    {label}
                    {required && (
                        <span
                            aria-hidden="true"
                            style={{
                                color: "var(--signal)",
                                marginLeft: "4px",
                            }}
                        >
                            *
                        </span>
                    )}
                </label>
            )}
            {hint && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        color: "var(--ink-faint)",
                        lineHeight: 1.5,
                        margin: 0,
                    }}
                >
                    {hint}
                </p>
            )}
            {children}
            {error && (
                <p
                    role="alert"
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: "var(--danger)",
                        margin: 0,
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export function TextInput({ value, onChange, placeholder, type = "text", id, error, autoFocus, ...rest }) {
    return (
        <input
            id={id}
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            style={{
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 400,
                color: "var(--ink)",
                letterSpacing: "-0.005em",
                padding: "11px 14px",
                background: "var(--paper-card)",
                border: `1px solid ${error ? "var(--danger)" : "var(--rule)"}`,
                outline: "none",
                borderRadius: "6px",
                transition: "border-color var(--duration-fast) var(--ease-out)",
            }}
            onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = "var(--signal)";
            }}
            onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = "var(--rule)";
            }}
            {...rest}
        />
    );
}

export function TextArea({ value, onChange, placeholder, rows = 4, id, error, ...rest }) {
    return (
        <textarea
            id={id}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            style={{
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 400,
                color: "var(--ink)",
                letterSpacing: "-0.005em",
                lineHeight: 1.5,
                padding: "11px 14px",
                background: "var(--paper-card)",
                border: `1px solid ${error ? "var(--danger)" : "var(--rule)"}`,
                outline: "none",
                borderRadius: "6px",
                resize: "vertical",
                minHeight: "100px",
                transition: "border-color var(--duration-fast) var(--ease-out)",
            }}
            onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = "var(--signal)";
            }}
            onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = "var(--rule)";
            }}
            {...rest}
        />
    );
}
