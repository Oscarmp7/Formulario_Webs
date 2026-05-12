// Form configuration. Single source of truth for client types, steps, and option lists.
// Output generation lives in src/output/*.js; this file is data-only (no JSX, no DOM).

export const CLIENT_TYPES = [
    {
        id: "personal",
        label: "Profesional independiente",
        desc: "Consultor, coach, médico, abogado, fotógrafo, terapeuta, trainer.",
        iconName: "IconProfessional",
    },
    {
        id: "creative",
        label: "Creativo / Artista",
        desc: "Filmmaker, músico, artista visual, fotógrafo, creador de contenido.",
        iconName: "IconCreative",
    },
    {
        id: "business",
        label: "Empresa o negocio",
        desc: "Restaurante, tienda, startup, clínica, inmobiliaria, firma contable.",
        iconName: "IconBusiness",
    },
    {
        id: "agency",
        label: "Agencia o estudio",
        desc: "Marketing, branding, diseño, publicidad, tecnología, producción.",
        iconName: "IconAgency",
    },
    {
        id: "other",
        label: "Otro",
        desc: "ONG, proyecto personal, portafolio académico, evento, comunidad.",
        iconName: "IconOther",
    },
];

// 10 steps fijos para TODOS los clientes (vs 9-11 condicionales del form anterior).
// Cada step es un capítulo. Las preguntas condicionales se manejan dentro del step.
export const STEPS = [
    { id: "intro", label: "Inicio", iconName: "IconIntro" },
    { id: "business", label: "Negocio", iconName: "IconBusinessStep" },
    { id: "audience", label: "Audiencia", iconName: "IconAudience" },
    { id: "goals", label: "Objetivos", iconName: "IconGoals" },
    { id: "voice", label: "Voz", iconName: "IconVoice" },
    { id: "visual", label: "Visual", iconName: "IconVisual" },
    { id: "identity", label: "Identidad", iconName: "IconIdentity" },
    { id: "work", label: "Trabajo", iconName: "IconPortfolio" },
    { id: "structure", label: "Estructura", iconName: "IconStructure" },
    { id: "technical", label: "Técnico", iconName: "IconTechnical" },
];

// Options for multi-select chip groups. Curated, not exhaustive.
export const OPTIONS = {
    goals: [
        "Conseguir clientes",
        "Mostrar portfolio",
        "Vender servicios",
        "Agendar reuniones",
        "Posicionamiento",
        "Vender productos",
        "Generar leads",
        "Educar audiencia",
        "Mejorar SEO",
        "Presencia profesional",
    ],
    targetTypes: [
        "Consumidores (B2C)",
        "Empresas (B2B)",
        "Startups",
        "Grandes marcas",
        "Pequeños negocios",
        "Profesionales del sector",
        "Comunidad / nicho",
        "Audiencia internacional",
    ],
    markets: [
        "República Dominicana",
        "Latinoamérica",
        "USA hispano",
        "USA general",
        "Europa",
        "Global",
        "Mercado local",
    ],
    existingAssets: [
        "Logo SVG",
        "Logo PNG / JPG",
        "Favicon",
        "Guía de marca",
        "Paleta de colores definida",
        "Tipografías licenciadas",
        "Brand kit completo",
        "Banco de fotos propio",
        "Sin assets aún",
    ],
    sections: [
        "Hero",
        "Reel / Video destacado",
        "Portfolio",
        "Sobre mí / Nosotros",
        "Servicios",
        "Testimonios",
        "Logos de clientes",
        "Proceso de trabajo",
        "Estadísticas / Logros",
        "Contacto",
        "FAQs",
        "Blog / Notas",
        "Footer cargado",
    ],
    integrations: [
        "Google Analytics",
        "Meta Pixel",
        "CRM (HubSpot, Salesforce)",
        "Calendly / agendamiento",
        "Pagos online",
        "Chat (Intercom, Crisp)",
        "Newsletter (Mailchimp, Substack)",
        "WhatsApp Business",
    ],
    technicalReqs: [
        "SEO avanzado",
        "Bilingüe / multilingual",
        "Panel admin",
        "Blog gestionable",
        "Core Web Vitals optimizado",
        "Accesibilidad WCAG AA",
        "One-page",
        "Multi-página",
    ],
    credibility: [
        "Logos de clientes",
        "Testimonios escritos",
        "Testimonios en video",
        "Casos de estudio",
        "Estadísticas / métricas",
        "Premios y reconocimientos",
        "Certificaciones",
        "Apariciones en prensa",
    ],
    usageContext: [
        "Desktop en oficina (decisión seria)",
        "Móvil en movimiento (recordar luego)",
        "Móvil en cama / casa (research nocturno)",
        "Recomendado por amigo (validación rápida)",
        "En reunión con cliente (referencia)",
        "Buscando alternativas (comparando)",
    ],
    imageryDirection: [
        "Fotografía documental",
        "Fotografía editorial",
        "Fotografía cinematográfica",
        "Ilustración custom",
        "Renders 3D",
        "Abstract / geométrico",
        "Cero imagery (tipografía-only)",
        "Mix híbrido",
    ],
};

// Curated palettes for the ColorPicker (preset mode).
// Cliente puede elegir una paleta como punto de partida en lugar de tipear HEX.
export const COLOR_PALETTES = [
    {
        id: "ink-paper",
        name: "Ink & Paper",
        desc: "Monocromo cálido con un acento. Editorial maduro.",
        colors: ["#1F1B14", "#F5F2EB", "#B85A39"],
    },
    {
        id: "noir-signal",
        name: "Noir & Signal",
        desc: "Negro tinta + acento dorado. Cinematográfico oscuro.",
        colors: ["#0E0D0B", "#F4F1EC", "#C9A84C"],
    },
    {
        id: "deakins",
        name: "Deakins",
        desc: "Tonos warm desaturados. Bladerunner 2049.",
        colors: ["#262119", "#D7C5A3", "#A04B2B", "#F4EFE6"],
    },
    {
        id: "muted-clinical",
        name: "Muted Clinical",
        desc: "Off-white frío + neutrales tech. Linear/Vercel.",
        colors: ["#0A0A0A", "#FAFAF9", "#525052", "#6E6CFF"],
    },
    {
        id: "consumer-warm",
        name: "Consumer Warm",
        desc: "Cream + browns + warm orange. Aesop / Le Labo.",
        colors: ["#2D1F12", "#EDE3D0", "#C77A38", "#7A4A2B"],
    },
    {
        id: "studio-bold",
        name: "Studio Bold",
        desc: "Black + white + un acento saturado. Buck / studio.",
        colors: ["#000000", "#FFFFFF", "#FF4500"],
    },
];

// Typography lane specimens (for the typography picker).
// Cliente ve specimens visuales en lugar de "Cormorant + DM Sans".
export const TYPOGRAPHY_LANES = [
    {
        id: "editorial-serif",
        name: "Editorial Serif",
        desc: "Display serif clásico + sans neutral. Magazine luxury.",
        display: { family: "'Cormorant Garamond', 'Times New Roman', serif", weight: 400 },
        body: { family: "system-ui, sans-serif", weight: 400 },
        sample: "Studio Atlas",
    },
    {
        id: "geometric-display",
        name: "Geometric Display",
        desc: "Sans geométrico con personalidad. Type-driven cinematográfico.",
        display: { family: "'Cabinet Grotesk', system-ui, sans-serif", weight: 800 },
        body: { family: "'Satoshi', system-ui, sans-serif", weight: 400 },
        sample: "STUDIO ATLAS",
    },
    {
        id: "neo-grotesque",
        name: "Neo Grotesque",
        desc: "Sans neutral preciso. Software con alma.",
        display: { family: "system-ui, sans-serif", weight: 600 },
        body: { family: "system-ui, sans-serif", weight: 400 },
        sample: "Studio Atlas",
    },
    {
        id: "brutalist-mono",
        name: "Brutalist Mono",
        desc: "Sans + mono mixed. Editorial con peso técnico.",
        display: { family: "'JetBrains Mono', monospace", weight: 700 },
        body: { family: "system-ui, sans-serif", weight: 400 },
        sample: "STUDIO ATLAS",
    },
    {
        id: "humanist-warm",
        name: "Humanist Warm",
        desc: "Serif cálido + sans humanista. Consumer sofisticado.",
        display: { family: "Georgia, 'Times New Roman', serif", weight: 400 },
        body: { family: "system-ui, sans-serif", weight: 400 },
        sample: "Studio Atlas",
    },
    {
        id: "minimal-system",
        name: "Minimal System",
        desc: "Una sola familia, weight contrast brutal. Apple-precise.",
        display: { family: "system-ui, -apple-system, sans-serif", weight: 700 },
        body: { family: "system-ui, -apple-system, sans-serif", weight: 300 },
        sample: "Studio Atlas",
    },
];

// Anti-pattern categories the cliente can explicitly reject.
export const ANTI_PATTERNS = [
    { id: "stock-photos", label: "Stock photos genéricas", desc: "Sonrisas forzadas, gente posando." },
    { id: "saas-template", label: "Look 'SaaS template'", desc: "Hero gradients, nested cards, Inter." },
    { id: "carousels", label: "Carruseles automáticos", desc: "Sliders que se mueven solos." },
    { id: "modal-popups", label: "Pop-ups invasivos", desc: "Newsletter modal al cargar." },
    { id: "corporate-jargon", label: "Jerga corporativa", desc: "'Innovador', 'líderes en el mercado'." },
    { id: "loud-colors", label: "Colores estridentes", desc: "Saturación excesiva, contrastes agresivos." },
    { id: "skeuomorphism", label: "Skeuomorfismo / 3D ornamental", desc: "Glossy buttons, shadows excesivas." },
    { id: "emoji-heavy", label: "Emojis decorativos", desc: "✨🚀✅ como sistema visual." },
];

// Required field config per step. Used for validation gating.
export const REQUIRED_BY_STEP = {
    intro: ["clientType"],
    business: ["businessName", "email"],
    audience: [],
    goals: [],
    voice: [],
    visual: [],
    identity: [],
    work: [],
    structure: [],
    technical: [],
};

// Initial empty state for the form data.
export const INITIAL_DATA = {
    // intro
    clientType: "",

    // business
    businessName: "",
    tagline: "",
    email: "",
    whatsapp: "",
    location: "",
    language: "",
    currentUrl: "",
    yearsRunning: "",

    // audience
    targetTypes: [],
    idealClient: "",
    markets: [],
    usageContext: [],
    decisionDrivers: "",

    // goals
    goals: [],
    mainCta: "",
    successMetric: "",
    success30d: "",
    success90d: "",
    problemSolved: "",
    competitors: "",
    currentFrustration: "",

    // voice
    personalityWords: "",
    voiceDescription: "",
    antiVoice: "",
    values: "",
    elevatorPitch: "",

    // visual
    moodAdjectives: "",
    moodBoardPicks: [],
    impactLevel: 5,
    theme: "",
    animationLevel: "",
    imageryDirection: [],
    dontWant: "",
    antiPatterns: [],

    // identity
    existingAssets: [],
    logoFiles: [],
    brandFiles: [],
    colorRefFiles: [],
    colorPalette: { mode: "preset", presetId: "", custom: [] },
    typographyLane: "",
    fontsLiked: "",
    identityAnchors: "",
    refLikes: "",
    refDislikes: "",

    // work (portfolio / services depending on type)
    services: "",
    servicePresentation: "",
    servicesCta: "",
    credibility: [],
    topProjects: "",
    cases: "",
    portfolioFiles: [],
    videoPlatform: "",
    heroVideo: "",
    profileFiles: [],
    statement: "",
    shortBio: "",
    longBio: "",
    yearsExp: "",
    projectCount: "",
    countries: "",
    awards: "",

    // structure
    sections: [],

    // technical
    domain: "",
    hosting: "",
    integrations: [],
    technicalReqs: [],
    accessibilityNeeds: "",
    technicalNotes: "",
    launchDate: "",
    contentDeadline: "",
    socialLinks: "",
    finalNotes: "",
};

// Helper to derive step icon by id
export function getStepIconName(stepId) {
    return STEPS.find((s) => s.id === stepId)?.iconName || "IconIntro";
}

// Helper to get human label for a client type
export function getClientTypeLabel(id) {
    return CLIENT_TYPES.find((c) => c.id === id)?.label || "—";
}
