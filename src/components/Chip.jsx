// Rectangular chip — NO scale on selected (rejecting Typeform bounce).
// Solid background swap on state change, 150ms ease-out-quart.

export function Chip({ children, selected, onClick, disabled, ariaPressed, style, ...rest }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={ariaPressed ?? selected}
            style={{
                appearance: "none",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: selected ? 500 : 400,
                lineHeight: 1.4,
                letterSpacing: "-0.005em",
                color: selected ? "#ffffff" : "var(--ink-soft)",
                background: selected ? "var(--signal)" : "transparent",
                border: `1px solid ${selected ? "var(--signal)" : "var(--rule)"}`,
                borderRadius: "2px",
                padding: "10px 16px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.4 : 1,
                transition:
                    "background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)",
                minHeight: "44px",
                whiteSpace: "nowrap",
                ...style,
            }}
            onMouseEnter={(e) => {
                if (!selected && !disabled) {
                    e.currentTarget.style.background = "var(--paper-tint)";
                    e.currentTarget.style.color = "var(--ink)";
                }
            }}
            onMouseLeave={(e) => {
                if (!selected && !disabled) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--ink-soft)";
                }
            }}
            {...rest}
        >
            {children}
        </button>
    );
}

// Group of chips that share selection state. Single or multi mode.
export function ChipGroup({ options, value, onChange, multi, max, columns = "auto" }) {
    const selected = multi ? (value || []) : value;
    const isSelected = (opt) =>
        multi ? selected.includes(opt) : selected === opt;

    const toggle = (opt) => {
        if (multi) {
            const arr = selected.includes(opt)
                ? selected.filter((v) => v !== opt)
                : [...selected, opt];
            if (max && arr.length > max) return;
            onChange(arr);
        } else {
            onChange(opt);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                gridTemplateColumns: columns,
            }}
        >
            {options.map((opt) => (
                <Chip
                    key={opt}
                    selected={isSelected(opt)}
                    onClick={() => toggle(opt)}
                >
                    {opt}
                </Chip>
            ))}
        </div>
    );
}
