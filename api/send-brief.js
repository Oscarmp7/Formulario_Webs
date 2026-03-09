import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const CLIENT_TYPE_LABELS = {
    personal: "Profesional independiente",
    creative: "Creativo / Artista",
    business: "Empresa o negocio",
    agency: "Agencia o estudio",
    other: "Otro",
};

function generateEmailHTML(data) {
    const typeLabel = CLIENT_TYPE_LABELS[data.clientType] || "—";
    const date = new Date().toLocaleDateString("es-DO", {
        year: "numeric", month: "long", day: "numeric",
    });

    const sections = [
        { title: "Negocio", color: "#007AFF", rows: [["Nombre", data.businessName], ["Tagline", data.tagline], ["Email", data.email], ["WhatsApp", data.whatsapp], ["Ubicación", data.location], ["Idioma", data.language], ["URL actual", data.currentUrl]] },
        { title: "Objetivos", color: "#FF9500", rows: [["Metas", Array.isArray(data.goals) ? data.goals.join(", ") : data.goals], ["CTA principal", data.mainCta], ["Éxito", data.successMetric], ["Competidores", data.competitors]] },
        { title: "Audiencia", color: "#AF52DE", rows: [["Tipos", Array.isArray(data.targetTypes) ? data.targetTypes.join(", ") : data.targetTypes], ["Cliente ideal", data.idealClient], ["Mercados", Array.isArray(data.markets) ? data.markets.join(", ") : data.markets], ["Emoción", data.feeling]] },
        { title: "Identidad Visual", color: "#FF2D55", rows: [["Assets", Array.isArray(data.existingAssets) ? data.existingAssets.join(", ") : data.existingAssets], ["Colores", data.colors], ["Tipografías", data.fonts], ["Refs +", data.refLikes], ["Refs −", data.refDislikes]] },
        { title: "Servicios", color: "#5856D6", rows: [["Lista", data.services], ["Presentación", data.servicePresentation], ["CTA", data.servicesCta], ["Credibilidad", Array.isArray(data.credSections) ? data.credSections.join(", ") : data.credSections]] },
        { title: "Contenido / Trabajos", color: "#FF3B30", rows: [["Plataforma", data.videoPlatform], ["Hero video", data.heroVideo], ["Destacados", data.featuredCount], ["Top proyectos", data.topProjects], ["Casos", data.cases]] },
        { title: "Historia", color: "#34C759", rows: [["Statement", data.statement], ["Bio corta", data.shortBio], ["Bio larga", data.longBio], ["Años exp.", data.yearsExp], ["Proyectos", data.projectCount], ["Países", data.countries], ["Premios", data.awards], ["Valores", data.values]] },
        { title: "Diseño UX/UI", color: "#007AFF", rows: [["Visual", data.visualLevel], ["Tema", data.theme], ["Animaciones", data.animationLevel], ["Secciones", Array.isArray(data.sections) ? data.sections.join(", ") : data.sections], ["No quiero", data.dontWant], ["Impacto", data.impactLevel]] },
        { title: "Técnico", color: "#8E8E93", rows: [["Dominio", data.domain], ["Hosting", data.hosting], ["Integraciones", Array.isArray(data.integrations) ? data.integrations.join(", ") : data.integrations], ["Requerimientos", Array.isArray(data.technicalReqs) ? data.technicalReqs.join(", ") : data.technicalReqs], ["Notas", data.technicalNotes]] },
        { title: "Entrega", color: "#FF9500", rows: [["Lanzamiento", data.launchDate], ["Contenido deadline", data.contentDeadline], ["Aprobador", data.designApprover], ["Revisiones", data.revisionCycles], ["Redes", data.socialLinks], ["Notas finales", data.finalNotes]] },
    ];

    const fileGroups = [
        { label: "Logo", files: data.logoFiles || [] },
        { label: "Brand assets", files: data.brandFiles || [] },
        { label: "Portfolio", files: data.portfolioFiles || [] },
        { label: "Fotos perfil", files: data.profileFiles || [] },
    ];
    const hasFiles = fileGroups.some(g => g.files.length > 0);

    const filesHTML = hasFiles ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-radius:12px;overflow:hidden;border:1px solid #f0f0f5;">
        <tr><td style="background:#1d1d1f;padding:12px 18px;">
            <span style="color:#fff;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Archivos Adjuntos</span>
        </td></tr>
        ${fileGroups.filter(g => g.files.length > 0).map(g => g.files.map(f => `
        <tr><td style="padding:10px 18px;border-bottom:1px solid #f5f5f7;font-family:'Helvetica Neue',Arial,sans-serif;">
            <span style="font-size:12px;color:#8e8e93;font-weight:600;display:inline-block;width:120px;vertical-align:top;">${g.label}</span>
            <a href="${f.url}" style="font-size:13px;color:#007AFF;text-decoration:none;" target="_blank">${f.name}</a>
        </td></tr>`).join("")).join("")}
    </table>` : "";

    const sectionHTML = sections.map(s => {
        const rows = s.rows.filter(([, v]) => v && String(v).trim());
        if (!rows.length) return "";
        return `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-radius:12px;overflow:hidden;border:1px solid #f0f0f5;">
            <tr><td style="background:${s.color};padding:12px 18px;">
                <span style="color:#fff;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">${s.title}</span>
            </td></tr>
            ${rows.map(([k, v]) => `
            <tr><td style="padding:10px 18px;border-bottom:1px solid #f5f5f7;font-family:'Helvetica Neue',Arial,sans-serif;">
                <span style="font-size:12px;color:#8e8e93;font-weight:600;display:inline-block;width:120px;vertical-align:top;">${k}</span>
                <span style="font-size:13px;color:#1d1d1f;line-height:1.5;">${String(v).replace(/\n/g, '<br>')}</span>
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
                    <tr><td style="background:linear-gradient(135deg,#1d1d1f,#2c2c2e);border-radius:16px;padding:28px 24px;margin-bottom:24px;">
                        <p style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px;">Nuevo Brief Recibido</p>
                        <p style="font-size:12px;color:rgba(255,255,255,0.4);margin:0 0 12px;">${typeLabel} · ${date}</p>
                        <p style="font-size:24px;font-weight:700;color:#fff;margin:0;letter-spacing:-0.02em;">${data.businessName || "Sin nombre"}</p>
                        ${data.tagline ? `<p style="font-size:14px;color:rgba(255,255,255,0.6);font-style:italic;margin:6px 0 0;">${data.tagline}</p>` : ""}
                        ${data.email ? `<p style="font-size:13px;color:rgba(255,255,255,0.5);margin:10px 0 0;">${data.email}${data.whatsapp ? ` · ${data.whatsapp}` : ""}</p>` : ""}
                    </td></tr>
                    <tr><td style="height:20px;"></td></tr>
                    <tr><td>${sectionHTML}</td></tr>
                    ${hasFiles ? `<tr><td>${filesHTML}</td></tr>` : ""}
                    <tr><td style="padding:24px 0;text-align:center;">
                        <p style="font-size:12px;color:#8e8e93;margin:0;">Brief adjunto como archivo .md</p>
                    </td></tr>
                </table>
            </td></tr>
        </table>
    </body></html>`;
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { data, markdown } = req.body;

        if (!data || !data.businessName || !data.email || !data.clientType) {
            return res.status(400).json({ error: "Missing required fields: businessName, email, clientType" });
        }

        const html = generateEmailHTML(data);
        const mdBuffer = Buffer.from(markdown, "utf-8");

        const { error } = await resend.emails.send({
            from: "Brief Form <onboarding@resend.dev>",
            to: ["omatosperez851@gmail.com"],
            subject: `Nuevo Brief — ${data.businessName}`,
            html,
            attachments: [
                {
                    filename: `brief-${(data.businessName || "client").toLowerCase().replace(/\s+/g, "-")}.md`,
                    content: mdBuffer,
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
