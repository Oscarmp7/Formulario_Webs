export const CLIENT_TYPES = [
    { id: "personal", label: "Profesional independiente", desc: "Consultor, coach, médico, abogado, diseñador, fotógrafo, terapeuta, trainer…", icon: "👤" },
    { id: "creative", label: "Creativo / Artista", desc: "Filmmaker, músico, artista visual, fotógrafo, creador de contenido, DJ…", icon: "🎨" },
    { id: "business", label: "Empresa o negocio", desc: "Restaurante, tienda, startup, clínica, inmobiliaria, firma contable, constructora…", icon: "🏢" },
    { id: "agency", label: "Agencia o estudio", desc: "Marketing, branding, diseño, publicidad, tecnología, producción…", icon: "🚀" },
    { id: "other", label: "Otro", desc: "ONG, proyecto personal, portafolio académico, evento, comunidad…", icon: "✨" },
];

export const STEPS_CONFIG = {
    personal: ["tipo", "negocio", "objetivos", "audiencia", "identidad", "servicios", "about", "ux", "tecnico", "entrega"],
    creative: ["tipo", "negocio", "objetivos", "audiencia", "identidad", "contenido", "portfolio", "about", "ux", "tecnico", "entrega"],
    business: ["tipo", "negocio", "objetivos", "audiencia", "identidad", "servicios", "portfolio", "about", "ux", "tecnico", "entrega"],
    agency: ["tipo", "negocio", "objetivos", "audiencia", "identidad", "servicios", "portfolio", "about", "ux", "tecnico", "entrega"],
    other: ["tipo", "negocio", "objetivos", "audiencia", "identidad", "about", "ux", "tecnico", "entrega"],
};

export const STEP_LABELS = {
    tipo: "Perfil", negocio: "Negocio", objetivos: "Objetivos", audiencia: "Audiencia",
    identidad: "Marca", contenido: "Contenido", portfolio: "Trabajos", servicios: "Servicios",
    about: "Historia", ux: "Diseño", tecnico: "Técnico", entrega: "Entrega",
};

export const STEP_ICONS = {
    tipo: "👤", negocio: "💼", objetivos: "🎯", audiencia: "👥",
    identidad: "🎨", contenido: "🎬", portfolio: "📁", servicios: "⚡",
    about: "📖", ux: "✨", tecnico: "⚙️", entrega: "📦",
};

// Single source of truth for brief sections
export function getBriefSections(data) {
    const type = CLIENT_TYPES.find(c => c.id === data.clientType);
    return [
        { key: "PERFIL", title: "Perfil", icon: "👤", rows: [["Tipo", type?.label], ["Nombre", data.businessName], ["Tagline", data.tagline], ["Email", data.email], ["WhatsApp", data.whatsapp], ["Ubicación", data.location], ["Idioma", data.language], ["URL actual", data.currentUrl]] },
        { key: "OBJETIVOS", title: "Objetivos", icon: "🎯", rows: [["Metas", (data.goals || []).join(", ")], ["CTA principal", data.mainCta], ["Éxito", data.successMetric], ["Competidores", data.competitors]] },
        { key: "AUDIENCIA", title: "Audiencia", icon: "👥", rows: [["Tipos", (data.targetTypes || []).join(", ")], ["Cliente ideal", data.idealClient], ["Mercados", (data.markets || []).join(", ")], ["Emoción", data.feeling]] },
        { key: "IDENTIDAD", title: "Identidad", icon: "🎨", rows: [["Assets", (data.existingAssets || []).join(", ")], ["Colores", data.colors], ["Tipografías", data.fonts], ["Refs. +", data.refLikes], ["Refs. –", data.refDislikes]] },
        { key: "SERVICIOS", title: "Servicios", icon: "⚡", rows: [["Lista", data.services], ["Presentación", data.servicePresentation], ["CTA", data.servicesCta], ["Credibilidad", (data.credSections || []).join(", ")]] },
        { key: "CONTENIDO", title: "Contenido / Trabajos", icon: "🎬", rows: [["Plataforma", data.videoPlatform], ["Hero video", data.heroVideo], ["Destacados", data.featuredCount], ["Top proyectos", data.topProjects], ["Casos", data.cases]] },
        { key: "HISTORIA", title: "Historia", icon: "📖", rows: [["Statement", data.statement], ["Bio corta", data.shortBio], ["Bio larga", data.longBio], ["Años exp.", data.yearsExp], ["Proyectos", data.projectCount], ["Países", data.countries], ["Premios", data.awards], ["Valores", data.values]] },
        { key: "DISEÑO", title: "Diseño UX/UI", icon: "✨", rows: [["Visual", data.visualLevel], ["Tema", data.theme], ["Animaciones", data.animationLevel], ["Secciones", (data.sections || []).join(", ")], ["No quiero", data.dontWant], ["Impacto", data.impactLevel]] },
        { key: "TÉCNICO", title: "Técnico", icon: "⚙️", rows: [["Dominio", data.domain], ["Hosting", data.hosting], ["Integraciones", (data.integrations || []).join(", ")], ["Requerimientos", (data.technicalReqs || []).join(", ")], ["Notas", data.technicalNotes]] },
        { key: "ENTREGA", title: "Entrega", icon: "📦", rows: [["Lanzamiento", data.launchDate], ["Contenido", data.contentDeadline], ["Aprobador", data.designApprover], ["Revisiones", data.revisionCycles], ["Redes", data.socialLinks], ["Notas finales", data.finalNotes]] },
    ];
}

export function generateMarkdown(data) {
    const type = CLIENT_TYPES.find(c => c.id === data.clientType);
    let md = `# Brief — ${data.businessName || "Sin nombre"}\n**Tipo**: ${type?.label || "—"}  |  **Fecha**: ${new Date().toLocaleDateString("es-DO")}\n\n`;
    const sections = getBriefSections(data);
    sections.forEach(s => {
        const rows = s.rows.filter(([, v]) => v && String(v).trim());
        if (!rows.length) return;
        md += `## ${s.key}\n`;
        rows.forEach(([k, v]) => { md += `- **${k}**: ${v}\n`; });
        md += "\n";
    });
    return md;
}
