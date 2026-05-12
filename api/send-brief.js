import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CLIENT_TYPE_LABELS = {
    personal: "Profesional independiente",
    creative: "Creativo / Artista",
    business: "Empresa o negocio",
    agency: "Agencia o estudio",
    other: "Otro",
};

// ── PRODUCT.md generator ──────────────────────────────────────────
function generateProductMd(data) {
    const date = new Date().toLocaleDateString("es-DO", {
        year: "numeric", month: "long", day: "numeric",
    });
    const typeLabel = CLIENT_TYPE_LABELS[data.clientType] || "—";
    const lines = [];

    lines.push(`<!-- Generado por el Brief Form de Oscar Matos · ${date} -->`);
    lines.push(`<!-- Tipo: ${typeLabel} -->`);
    lines.push(``);
    lines.push(`---`);
    lines.push(`name: ${q(data.businessName)}`);
    lines.push(`tagline: ${q(data.tagline)}`);
    lines.push(`type: ${data.clientType || "—"}`);
    if (data.language) lines.push(`language: ${data.language}`);
    if (data.location) lines.push(`location: ${data.location}`);
    lines.push(`date: ${date}`);
    lines.push(`---`);
    lines.push(``);
    lines.push(`# Product Brief — ${data.businessName || "Sin nombre"}`);
    lines.push(``);

    // Identity
    section(lines, "Identity");
    kv(lines, "Name", data.businessName);
    kv(lines, "Tagline", data.tagline);
    kv(lines, "Language", data.language);
    kv(lines, "Location", data.location);
    kv(lines, "Years active", data.yearsRunning);
    lines.push(``);
    lines.push(`**Contact:**`);
    if (data.email) lines.push(`- Email: ${data.email}`);
    if (data.whatsapp) lines.push(`- WhatsApp: ${data.whatsapp}`);
    if (data.currentUrl) lines.push(`- Current URL: ${data.currentUrl}`);
    lines.push(``);

    // Audience
    section(lines, "Audience");
    chipList(lines, "Primary types", data.targetTypes);
    block(lines, "Ideal client", data.idealClient);
    inline(lines, "Markets", data.markets);
    chipList(lines, "Usage context", data.usageContext);
    block(lines, "How they decide", data.decisionDrivers);

    // Goals
    section(lines, "Goals");
    chipList(lines, "Primary objectives", data.goals);
    kv(lines, "Primary CTA", data.mainCta);
    kv(lines, "Success in 30 days", data.success30d);
    kv(lines, "Success in 90 days", data.success90d);
    block(lines, "Problem solved", data.problemSolved);
    block(lines, "Current frustration", data.currentFrustration);
    block(lines, "Competitors", data.competitors);

    // Voice
    section(lines, "Voice");
    kv(lines, "3 brand words", data.personalityWords);
    kv(lines, "Elevator pitch", data.elevatorPitch);
    block(lines, "How the brand speaks", data.voiceDescription);
    block(lines, "Anti-voice", data.antiVoice);
    block(lines, "Values", data.values);

    // Work & Services (conditional)
    const hasWork = data.statement || data.shortBio || data.services || data.topProjects ||
        (data.credibility || []).length || data.yearsExp || data.awards;
    if (hasWork) {
        section(lines, "Work");
        kv(lines, "Hero statement", data.statement);
        block(lines, "Bio", data.shortBio);
        block(lines, "Services", data.services);
        if (data.servicePresentation) kv(lines, "Service presentation", data.servicePresentation);
        block(lines, "Top projects", data.topProjects);
        inline(lines, "Credibility elements", data.credibility);
        const stats = [
            data.yearsExp && `${data.yearsExp} años de experiencia`,
            data.projectCount && `${data.projectCount} proyectos`,
            data.countries && `${data.countries} países`,
        ].filter(Boolean);
        if (stats.length) kv(lines, "Stats", stats.join(" · "));
        kv(lines, "Awards", data.awards);
        if (data.videoPlatform) kv(lines, "Video platform", data.videoPlatform);
        if (data.heroVideo) kv(lines, "Hero video", data.heroVideo);
    }

    // Structure
    if ((data.sections || []).length) {
        section(lines, "Structure");
        chipList(lines, "Sections needed", data.sections);
    }

    // Technical
    section(lines, "Technical");
    kv(lines, "Domain", data.domain);
    kv(lines, "Hosting", data.hosting);
    inline(lines, "Integrations", data.integrations);
    inline(lines, "Requirements", data.technicalReqs);
    kv(lines, "Accessibility", data.accessibilityNeeds);
    kv(lines, "Launch date", data.launchDate);
    kv(lines, "Content deadline", data.contentDeadline);
    block(lines, "Social", data.socialLinks);
    block(lines, "Technical notes", data.technicalNotes);
    block(lines, "Final notes", data.finalNotes);

    return lines.join("\n");
}

// ── DESIGN.md seed generator ──────────────────────────────────────
function generateDesignMd(data) {
    const date = new Date().toLocaleDateString("es-DO", {
        year: "numeric", month: "long", day: "numeric",
    });
    const lines = [];

    lines.push(`<!-- SEED: generado automáticamente por el Brief Form de Oscar Matos · ${date} -->`);
    lines.push(`<!-- Correr /impeccable teach y /impeccable document para enriquecer con tokens reales. -->`);
    lines.push(``);
    lines.push(`---`);
    lines.push(`name: ${q(data.businessName)}`);
    lines.push(`description: ${q(data.tagline || data.elevatorPitch)}`);
    if (data.impactLevel != null) lines.push(`impact_level: ${data.impactLevel}`);
    if (data.theme) lines.push(`theme: ${data.theme.toLowerCase()}`);
    if (data.animationLevel) lines.push(`animation: ${q(data.animationLevel)}`);
    lines.push(`---`);
    lines.push(``);
    lines.push(`# Design System Seed — ${data.businessName || "Sin nombre"}`);
    lines.push(``);

    // Creative direction
    section(lines, "Creative Direction");
    block(lines, "Mood physical", data.moodAdjectives);
    inline(lines, "Mood board references", data.moodBoardPicks);
    kv(lines, "Impact level", `${data.impactLevel ?? 5}/10 — 1 sobrio (Stripe), 10 cinematográfico (Buck)`);
    kv(lines, "Theme", data.theme);
    kv(lines, "Animation", data.animationLevel);
    inline(lines, "Imagery", data.imageryDirection);

    // Color direction
    section(lines, "Color Direction");
    const palette = data.colorPalette?.custom?.[0];
    if (palette) {
        block(lines, "Directional palette", palette);
    } else {
        lines.push(`<!-- No color palette specified. Run /impeccable colorize to generate. -->`);
        lines.push(``);
    }
    if ((data.colorRefFiles || []).length) {
        lines.push(`**Color reference images:**`);
        (data.colorRefFiles || []).forEach((f) => lines.push(`- [${f.filename}](${f.url})`));
        lines.push(``);
    }

    // Typography
    section(lines, "Typography Direction");
    if (data.fontsLiked) {
        block(lines, "Fonts admired", data.fontsLiked);
    } else {
        lines.push(`<!-- No typography specified. Run /impeccable typeset to generate. -->`);
        lines.push(``);
    }
    if (data.typographyLane) kv(lines, "Lane selected", data.typographyLane);

    // Anti-patterns
    if ((data.antiPatterns || []).length || data.dontWant) {
        section(lines, "Anti-Patterns");
        chipList(lines, "Explicit anti-patterns", data.antiPatterns);
        block(lines, "Additional no's", data.dontWant);
    }

    // References
    section(lines, "References");
    if (data.refLikes) {
        lines.push(`### Positive references`);
        lines.push(data.refLikes);
        lines.push(``);
    }
    if (data.refDislikes) {
        lines.push(`### Anti-references`);
        lines.push(data.refDislikes);
        lines.push(``);
    }

    // Identity assets
    const hasAssets = (data.logoFiles || []).length || (data.brandFiles || []).length;
    if (hasAssets) {
        section(lines, "Identity Assets");
        if ((data.existingAssets || []).length) {
            lines.push(`**Assets confirmed:** ${data.existingAssets.join(", ")}`);
            lines.push(``);
        }
        if ((data.logoFiles || []).length) {
            lines.push(`**Logo files:**`);
            (data.logoFiles || []).forEach((f) => lines.push(`- [${f.filename}](${f.url})`));
            lines.push(``);
        }
        if ((data.brandFiles || []).length) {
            lines.push(`**Brandbook:**`);
            (data.brandFiles || []).forEach((f) => lines.push(`- [${f.filename}](${f.url})`));
            lines.push(``);
        }
    }

    return lines.join("\n");
}

// ── Markdown helpers ──────────────────────────────────────────────
function q(v) { return v ? String(v).replace(/\n/g, " ") : "—"; }
function section(lines, title) { lines.push(`## ${title}`, ``); }
function kv(lines, key, value) {
    if (!value && value !== 0) return;
    lines.push(`**${key}:** ${String(value)}`);
    lines.push(``);
}
function block(lines, key, value) {
    if (!value || !String(value).trim()) return;
    lines.push(`**${key}:**`);
    lines.push(String(value));
    lines.push(``);
}
function inline(lines, key, arr) {
    if (!(arr || []).length) return;
    lines.push(`**${key}:** ${arr.join(", ")}`);
    lines.push(``);
}
function chipList(lines, key, arr) {
    if (!(arr || []).length) return;
    lines.push(`**${key}:**`);
    arr.forEach((item) => lines.push(`- ${item}`));
    lines.push(``);
}

// ── Email HTML ─────────────────────────────────────────────────────
function generateEmailHTML(data) {
    const typeLabel = CLIENT_TYPE_LABELS[data.clientType] || "—";
    const date = new Date().toLocaleDateString("es-DO", {
        year: "numeric", month: "long", day: "numeric",
    });

    const sections = [
        { title: "Negocio", color: "#007AFF", rows: [
            ["Tipo", typeLabel], ["Nombre", data.businessName], ["Tagline", data.tagline],
            ["Email", data.email], ["WhatsApp", data.whatsapp], ["Ubicación", data.location],
            ["Idioma", data.language], ["URL actual", data.currentUrl], ["Años activo", data.yearsRunning],
        ]},
        { title: "Audiencia", color: "#AF52DE", rows: [
            ["Tipos", (data.targetTypes || []).join(", ")], ["Cliente ideal", data.idealClient],
            ["Mercados", (data.markets || []).join(", ")], ["Contexto uso", (data.usageContext || []).join(", ")],
            ["Cómo deciden", data.decisionDrivers],
        ]},
        { title: "Objetivos", color: "#FF9500", rows: [
            ["Metas", (data.goals || []).join(", ")], ["CTA principal", data.mainCta],
            ["Éxito 30d", data.success30d], ["Éxito 90d", data.success90d],
            ["Problema resuelto", data.problemSolved], ["Frustración actual", data.currentFrustration],
            ["Competidores", data.competitors],
        ]},
        { title: "Voz", color: "#34C759", rows: [
            ["3 palabras", data.personalityWords], ["Pitch", data.elevatorPitch],
            ["Tono", data.voiceDescription], ["Anti-voz", data.antiVoice], ["Valores", data.values],
        ]},
        { title: "Visual", color: "#5856D6", rows: [
            ["Mood", data.moodAdjectives],
            ["Referencias", (data.moodBoardPicks || []).join(", ") || null],
            ["Impacto", data.impactLevel ? `${data.impactLevel}/10` : null],
            ["Tema", data.theme], ["Animación", data.animationLevel],
            ["Imagery", (data.imageryDirection || []).join(", ")],
            ["Anti-patrones", (data.antiPatterns || []).join(", ")], ["No quiero", data.dontWant],
        ]},
        { title: "Identidad", color: "#FF2D55", rows: [
            ["Assets", (data.existingAssets || []).join(", ")],
            ["Paleta HEX", data.colorPalette?.custom?.[0]],
            ["Tipografía", data.fontsLiked], ["Anclas", data.identityAnchors],
            ["Refs +", data.refLikes], ["Refs −", data.refDislikes],
        ]},
        { title: "Trabajo", color: "#FF3B30", rows: [
            ["Statement", data.statement], ["Bio", data.shortBio],
            ["Servicios", data.services], ["Presentación", data.servicePresentation],
            ["Credibilidad", (data.credibility || []).join(", ")], ["Top proyectos", data.topProjects],
            ["Plataforma", data.videoPlatform], ["Años exp.", data.yearsExp],
            ["Proyectos", data.projectCount], ["Países", data.countries], ["Premios", data.awards],
        ]},
        { title: "Estructura", color: "#007AFF", rows: [
            ["Secciones", (data.sections || []).join(", ")],
        ]},
        { title: "Técnico", color: "#8E8E93", rows: [
            ["Dominio", data.domain], ["Hosting", data.hosting],
            ["Integraciones", (data.integrations || []).join(", ")],
            ["Requerimientos", (data.technicalReqs || []).join(", ")],
            ["Accesibilidad", data.accessibilityNeeds], ["Lanzamiento", data.launchDate],
            ["Deadline contenido", data.contentDeadline], ["Redes", data.socialLinks],
            ["Notas técnicas", data.technicalNotes], ["Notas finales", data.finalNotes],
        ]},
    ];

    const fileGroups = [
        { label: "Logo", files: data.logoFiles || [] },
        { label: "Brandbook", files: data.brandFiles || [] },
        { label: "Refs de color", files: data.colorRefFiles || [] },
        { label: "Portfolio", files: data.portfolioFiles || [] },
        { label: "Fotos perfil", files: data.profileFiles || [] },
    ];
    const hasFiles = fileGroups.some((g) => g.files.length > 0);

    const filesHTML = hasFiles ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;overflow:hidden;border:1px solid #f0f0f5;">
        <tr><td style="background:#1d1d1f;padding:12px 18px;">
            <span style="color:#fff;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Archivos</span>
        </td></tr>
        ${fileGroups.filter((g) => g.files.length > 0).map((g) =>
            g.files.map((f) => `
        <tr><td style="padding:10px 18px;border-bottom:1px solid #f5f5f7;font-family:'Helvetica Neue',Arial,sans-serif;">
            <span style="font-size:12px;color:#8e8e93;font-weight:600;display:inline-block;width:120px;vertical-align:top;">${g.label}</span>
            <a href="${f.url}" style="font-size:13px;color:#007AFF;text-decoration:none;" target="_blank">${f.filename}</a>
        </td></tr>`).join("")
        ).join("")}
    </table>` : "";

    const sectionHTML = sections.map((s) => {
        const rows = s.rows.filter(([, v]) => v && String(v).trim());
        if (!rows.length) return "";
        return `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;overflow:hidden;border:1px solid #f0f0f5;">
            <tr><td style="background:${s.color};padding:12px 18px;">
                <span style="color:#fff;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">${s.title}</span>
            </td></tr>
            ${rows.map(([k, v]) => `
            <tr><td style="padding:10px 18px;border-bottom:1px solid #f5f5f7;font-family:'Helvetica Neue',Arial,sans-serif;">
                <span style="font-size:12px;color:#8e8e93;font-weight:600;display:inline-block;width:120px;vertical-align:top;">${k}</span>
                <span style="font-size:13px;color:#1d1d1f;line-height:1.5;">${String(v).replace(/\n/g, "<br>")}</span>
            </td></tr>`).join("")}
        </table>`;
    }).filter(Boolean).join("");

    return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f2f2f7;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f7;padding:32px 16px;">
            <tr><td align="center">
                <table width="560" cellpadding="0" cellspacing="0">
                    <tr><td style="background:linear-gradient(135deg,#1d1d1f,#2c2c2e);padding:28px 24px;margin-bottom:24px;">
                        <p style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px;">Nuevo Brief Recibido</p>
                        <p style="font-size:12px;color:rgba(255,255,255,0.4);margin:0 0 12px;">${typeLabel} · ${date}</p>
                        <p style="font-size:24px;font-weight:700;color:#fff;margin:0;letter-spacing:-0.02em;">${data.businessName || "Sin nombre"}</p>
                        ${data.tagline ? `<p style="font-size:14px;color:rgba(255,255,255,0.6);font-style:italic;margin:6px 0 0;">${data.tagline}</p>` : ""}
                        ${data.email ? `<p style="font-size:13px;color:rgba(255,255,255,0.5);margin:10px 0 0;">${data.email}${data.whatsapp ? ` · ${data.whatsapp}` : ""}</p>` : ""}
                    </td></tr>
                    <tr><td style="height:20px;"></td></tr>
                    <tr><td>${sectionHTML}</td></tr>
                    ${hasFiles ? `<tr><td>${filesHTML}</td></tr>` : ""}
                    <tr><td style="padding:24px 0;text-align:center;border-top:1px solid #e5e5ea;">
                        <p style="font-size:12px;color:#8e8e93;margin:0;">Se adjuntan <strong>PRODUCT.md</strong> + <strong>DESIGN.md</strong> — listos para <code>/impeccable shape</code></p>
                    </td></tr>
                </table>
            </td></tr>
        </table>
    </body></html>`;
}

// ── Handler ───────────────────────────────────────────────────────
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { data } = req.body;

        if (!data || !data.businessName || !data.email || !data.clientType) {
            return res.status(400).json({ error: "Missing required fields: businessName, email, clientType" });
        }

        const html = generateEmailHTML(data);
        const productMd = generateProductMd(data);
        const designMd = generateDesignMd(data);
        const slug = (data.businessName || "client").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

        const { error } = await resend.emails.send({
            from: "Brief Form <onboarding@resend.dev>",
            to: ["omatosperez851@gmail.com"],
            subject: `Nuevo Brief — ${data.businessName}`,
            html,
            attachments: [
                {
                    filename: `${slug}-PRODUCT.md`,
                    content: Buffer.from(productMd, "utf-8"),
                },
                {
                    filename: `${slug}-DESIGN.md`,
                    content: Buffer.from(designMd, "utf-8"),
                },
            ],
        });

        if (error) {
            console.error("Resend error:", error);
            return res.status(500).json({ error: "Failed to send email" });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
