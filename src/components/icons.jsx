// Custom SVG icon system — mono-line, 1.25px stroke, geometric, ink/currentColor.
// Reemplaza los emojis (👤🎨🏢🚀✨) que el critique flagged como Typeform anti-pattern.
// Cada icon es 20x20 base, escala con font-size del parent.

const baseProps = {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.25",
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

// Client type icons (5)
export const IconProfessional = (props) => (
    <svg {...baseProps} {...props}>
        <circle cx="10" cy="7" r="3.25" />
        <path d="M3.5 16.5c1.4-2.8 3.7-4 6.5-4s5.1 1.2 6.5 4" />
    </svg>
);

export const IconCreative = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M3.5 16.5L8 12l2 2 6.5-6.5" />
        <path d="M3.5 16.5h13" />
        <circle cx="7" cy="6" r="1.25" />
    </svg>
);

export const IconBusiness = (props) => (
    <svg {...baseProps} {...props}>
        <rect x="3.5" y="6.5" width="13" height="10" />
        <path d="M7 6.5V4.5h6v2" />
        <path d="M3.5 11h13" />
    </svg>
);

export const IconAgency = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M10 3.5L13 8h-2v6h-2V8H7l3-4.5z" />
        <path d="M5 16.5h10" />
    </svg>
);

export const IconOther = (props) => (
    <svg {...baseProps} {...props}>
        <circle cx="10" cy="10" r="6.5" />
        <path d="M10 7.5v2.5l1.5 1.5" />
    </svg>
);

// Step icons (10)
export const IconIntro = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M3.5 10h13M11 5.5l5 4.5-5 4.5" />
    </svg>
);

export const IconBusinessStep = IconBusiness;

export const IconAudience = (props) => (
    <svg {...baseProps} {...props}>
        <circle cx="7" cy="8" r="2.5" />
        <circle cx="13" cy="8" r="2.5" />
        <path d="M2.5 16c.8-2 2.5-3 4.5-3s3.7 1 4.5 3" />
        <path d="M8.5 16c.8-2 2.5-3 4.5-3s3.7 1 4.5 3" />
    </svg>
);

export const IconGoals = (props) => (
    <svg {...baseProps} {...props}>
        <circle cx="10" cy="10" r="6.5" />
        <circle cx="10" cy="10" r="3.5" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
);

export const IconVoice = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M5 8v4M8 6v8M11 4v12M14 7v6M17 9v2" />
    </svg>
);

export const IconVisual = (props) => (
    <svg {...baseProps} {...props}>
        <rect x="3.5" y="3.5" width="13" height="13" />
        <path d="M3.5 13l4-4 3 3 5-5 1 1" />
    </svg>
);

export const IconIdentity = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M10 3.5l5.5 3v7L10 16.5l-5.5-3v-7L10 3.5z" />
        <path d="M10 3.5v13M4.5 6.5l11 7M15.5 6.5l-11 7" />
    </svg>
);

export const IconPortfolio = (props) => (
    <svg {...baseProps} {...props}>
        <rect x="3" y="6" width="14" height="9" />
        <path d="M7 6V4.5h6V6" />
    </svg>
);

export const IconStructure = (props) => (
    <svg {...baseProps} {...props}>
        <rect x="3.5" y="3.5" width="13" height="4" />
        <rect x="3.5" y="9.5" width="6" height="7" />
        <rect x="11.5" y="9.5" width="5" height="7" />
    </svg>
);

export const IconTechnical = (props) => (
    <svg {...baseProps} {...props}>
        <circle cx="10" cy="10" r="2.5" />
        <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" />
    </svg>
);

// Functional icons
export const IconArrowRight = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M3.5 10h13M11 5.5l5 4.5-5 4.5" />
    </svg>
);

export const IconArrowLeft = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M16.5 10h-13M9 5.5L4 10l5 4.5" />
    </svg>
);

export const IconCheck = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M3.5 10.5l4 4 9-9" />
    </svg>
);

export const IconClose = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M5 5l10 10M15 5L5 15" />
    </svg>
);

export const IconUpload = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M10 13.5V3.5M6 7.5L10 3.5l4 4M3.5 16.5h13" />
    </svg>
);

export const IconFile = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M4.5 2.5h7l4 4v11h-11v-15z" />
        <path d="M11.5 2.5v4h4" />
    </svg>
);

export const IconImage = (props) => (
    <svg {...baseProps} {...props}>
        <rect x="3" y="3.5" width="14" height="13" />
        <circle cx="7" cy="7.5" r="1.5" />
        <path d="M3 14.5l4.5-4.5 4 4 2-2 3.5 3" />
    </svg>
);

export const IconSend = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M17 3.5L9 11M17 3.5l-5 13.5-3-6-6-3 14-4.5z" />
    </svg>
);

export const IconRestart = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M3.5 10a6.5 6.5 0 1 1 1.9 4.6" />
        <path d="M3.5 14.5v-4.5h4.5" />
    </svg>
);

export const IconExternal = (props) => (
    <svg {...baseProps} {...props}>
        <path d="M11.5 4.5h4v4M15.5 4.5L9 11M14 11v4.5h-9.5V6h4.5" />
    </svg>
);

export const IconLoading = (props) => (
    <svg
        {...baseProps}
        {...props}
        style={{
            animation: "spin 1.2s linear infinite",
            ...(props.style || {}),
        }}
    >
        <path d="M10 3.5v3" />
        <path d="M10 13.5v3" />
        <path d="M3.5 10h3" />
        <path d="M13.5 10h3" />
        <path d="M5.4 5.4l2.1 2.1" />
        <path d="M12.5 12.5l2.1 2.1" />
        <path d="M5.4 14.6l2.1-2.1" />
        <path d="M12.5 7.5l2.1-2.1" />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
);
