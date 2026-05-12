# Clients-Form v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the existing client brief form into a production-ready tool that sends beautifully formatted email briefs via Resend, with validation, localStorage persistence, query param personalization, and a polished thank-you screen — while keeping the existing Apple-like aesthetic.

**Architecture:** Vite + React 18 frontend with a Vercel Serverless Function (`api/send-brief.js`) that receives form data via POST and sends email using Resend (HTML + .md attachment). Form reads `?client=Name&type=creative` query params for personalization. localStorage syncs form state on every step change.

**Tech Stack:** React 18, Vite, Vercel Serverless Functions, Resend SDK, Inline CSS (existing pattern)

---

## Task 1: Project Setup — .gitignore, Resend dependency, Vercel config

**Files:**
- Create: `.gitignore`
- Create: `vercel.json`
- Modify: `package.json`

**Step 1: Create .gitignore**

```gitignore
node_modules
dist
.env
.env.local
.vercel
```

**Step 2: Create vercel.json for serverless function routing**

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

**Step 3: Install Resend**

Run: `npm install resend`

**Step 4: Verify project runs**

Run: `npm run dev`
Expected: Vite dev server starts, form renders at localhost:5173

**Step 5: Commit**

```bash
git init
git add .gitignore vercel.json package.json package-lock.json
git commit -m "chore: add gitignore, vercel config, resend dependency"
```

---

## Task 2: Serverless Function — `/api/send-brief.js`

**Files:**
- Create: `api/send-brief.js`

**Step 1: Create the Vercel serverless function**

This function:
1. Receives POST with `{ data, markdown }` body
2. Generates an HTML email with all brief sections styled
3. Attaches the markdown as a `.md` file
4. Sends via Resend to omatosperez851@gmail.com

```javascript
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
                    <!-- Header -->
                    <tr><td style="background:linear-gradient(135deg,#1d1d1f,#2c2c2e);border-radius:16px;padding:28px 24px;margin-bottom:24px;">
                        <p style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px;">Nuevo Brief Recibido</p>
                        <p style="font-size:12px;color:rgba(255,255,255,0.4);margin:0 0 12px;">${typeLabel} · ${date}</p>
                        <p style="font-size:24px;font-weight:700;color:#fff;margin:0;letter-spacing:-0.02em;">${data.businessName || "Sin nombre"}</p>
                        ${data.tagline ? `<p style="font-size:14px;color:rgba(255,255,255,0.6);font-style:italic;margin:6px 0 0;">${data.tagline}</p>` : ""}
                        ${data.email ? `<p style="font-size:13px;color:rgba(255,255,255,0.5);margin:10px 0 0;">${data.email} ${data.whatsapp ? `· ${data.whatsapp}` : ""}</p>` : ""}
                    </td></tr>
                    <tr><td style="height:20px;"></td></tr>
                    <!-- Sections -->
                    <tr><td>${sectionHTML}</td></tr>
                    <!-- Footer -->
                    <tr><td style="padding:24px 0;text-align:center;">
                        <p style="font-size:12px;color:#8e8e93;margin:0;">Brief adjunto como archivo .md para Claude Code</p>
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
```

**Step 2: Test locally with Vercel CLI**

Run: `npx vercel dev`
Expected: Dev server starts with serverless function available at `localhost:3000/api/send-brief`

**Step 3: Commit**

```bash
git add api/send-brief.js
git commit -m "feat: add serverless function for email brief via Resend"
```

---

## Task 3: Extract Shared Data Config — Single Source of Truth

**Files:**
- Create: `src/config.js`
- Modify: `src/Form.jsx` — extract constants, remove duplication between Summary and exportBrief

**Step 1: Create src/config.js with all shared constants**

Extract from Form.jsx: `CLIENT_TYPES`, `STEPS_CONFIG`, `STEP_LABELS`, `STEP_ICONS`, and a new `BRIEF_SECTIONS` config that both Summary and the markdown generator use.

```javascript
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

// Single source of truth for brief sections — used by Summary, markdown export, and email
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
```

**Step 2: Update Form.jsx imports to use config.js**

Remove the duplicated constants from Form.jsx and import from config.js. Replace the hardcoded sections in Summary and exportBrief with `getBriefSections()` and `generateMarkdown()`.

**Step 3: Verify form still renders correctly**

Run: `npm run dev`
Expected: Form works identically

**Step 4: Commit**

```bash
git add src/config.js src/Form.jsx
git commit -m "refactor: extract shared config, single source of truth for brief sections"
```

---

## Task 4: Query Param Personalization

**Files:**
- Modify: `src/Form.jsx` — read `?client=Name&type=creative` from URL

**Step 1: Add URL param reading to App component**

In the App component, read query params on mount:
- `client` → show "Hola {name}" in header, store in data
- `type` → pre-select clientType and auto-advance past step 0

```javascript
// Inside App component, after state declarations:
useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientName = params.get("client");
    const clientTypeParam = params.get("type");
    if (clientName || clientTypeParam) {
        setData(prev => ({
            ...prev,
            ...(clientName && { clientName }),
            ...(clientTypeParam && STEPS_CONFIG[clientTypeParam] && { clientType: clientTypeParam }),
        }));
        // If type is pre-set, skip the type selection step
        if (clientTypeParam && STEPS_CONFIG[clientTypeParam]) {
            setStepIndex(1);
        }
    }
}, []);
```

**Step 2: Update header to show personalized greeting**

When `data.clientName` exists, show "Hola {name}" next to the "Brief" title.

**Step 3: Verify with query params**

Run: Open `http://localhost:5173/?client=Jeremy&type=creative`
Expected: Shows "Hola Jeremy", starts on step 2, clientType=creative

**Step 4: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: personalize form via URL query params (?client=Name&type=creative)"
```

---

## Task 5: localStorage Persistence

**Files:**
- Modify: `src/Form.jsx`

**Step 1: Add save/load to localStorage**

```javascript
const STORAGE_KEY = "clients-form-draft";

// Load on mount (inside App, replace initial useState):
const [data, setData] = useState(() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { clientType: "", impactLevel: 5 };
    } catch { return { clientType: "", impactLevel: 5 }; }
});

const [stepIndex, setStepIndex] = useState(() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY + "-step");
        return saved ? parseInt(saved, 10) : 0;
    } catch { return 0; }
});

// Save on change:
useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}, [data]);

useEffect(() => {
    localStorage.setItem(STORAGE_KEY + "-step", String(stepIndex));
}, [stepIndex]);
```

**Step 2: Add "Empezar de nuevo" button**

Small, discrete text button in the header. Clears localStorage + resets state.

```javascript
const resetForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + "-step");
    setData({ clientType: "", impactLevel: 5 });
    setStepIndex(0);
    setShowSummary(false);
};
```

**Step 3: Test persistence**

1. Fill some fields, close tab, reopen → data is preserved
2. Click "Empezar de nuevo" → everything resets

**Step 4: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: persist form data in localStorage, add reset button"
```

---

## Task 6: Form Validation

**Files:**
- Modify: `src/Form.jsx`

**Step 1: Define required fields per step**

```javascript
const REQUIRED_FIELDS = {
    tipo: { clientType: "Selecciona un tipo de proyecto" },
    negocio: { businessName: "El nombre es obligatorio", email: "El email es obligatorio" },
};
```

**Step 2: Add validation logic to goNext()**

Before advancing, check if current step has required fields. If missing, show inline error messages below the field. Do NOT advance.

```javascript
const [errors, setErrors] = useState({});

const validate = () => {
    const reqs = REQUIRED_FIELDS[currentStep];
    if (!reqs) return true;
    const newErrors = {};
    for (const [field, msg] of Object.entries(reqs)) {
        const val = data[field];
        if (!val || (typeof val === "string" && !val.trim())) {
            newErrors[field] = msg;
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const goNext = () => {
    if (!validate()) return;
    if (isLast) { setShowSummary(true); return; }
    setStepIndex(i => i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
};
```

**Step 3: Pass errors to step components, show inline error text**

Add a subtle red error message under required fields when validation fails. Style: `fontSize: 12, color: "#FF3B30", marginTop: 4`.

Pass `errors` prop to each step component. In TextInput or below Field, conditionally render error text.

**Step 4: Clear errors when user starts typing**

```javascript
// In the field update helper, clear the error for that field:
const f = k => v => {
    setData({ ...data, [k]: v });
    if (errors[k]) setErrors(prev => { const next = { ...prev }; delete next[k]; return next; });
};
```

**Step 5: Add visual indicator for required fields**

Add a subtle `*` after the label text for fields defined in REQUIRED_FIELDS.

**Step 6: Verify validation works**

1. Try advancing without selecting clientType → error shows
2. Try advancing without businessName → error shows
3. Fill the field → error clears
4. Advance → works

**Step 7: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: add validation for required fields with inline error messages"
```

---

## Task 7: Replace "Copiar brief" with "Enviar Brief" + Email Integration

**Files:**
- Modify: `src/Form.jsx`

**Step 1: Replace exportBrief with sendBrief**

Remove the clipboard copy logic. Replace with a fetch POST to `/api/send-brief`.

```javascript
const [sending, setSending] = useState(false);
const [sent, setSent] = useState(false);
const [sendError, setSendError] = useState("");

const sendBrief = async () => {
    setSending(true);
    setSendError("");
    try {
        const markdown = generateMarkdown(data);
        const res = await fetch("/api/send-brief", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data, markdown }),
        });
        if (!res.ok) throw new Error("Error al enviar");
        setSent(true);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY + "-step");
    } catch (err) {
        setSendError("No se pudo enviar. Intenta de nuevo.");
    } finally {
        setSending(false);
    }
};
```

**Step 2: Update the bottom button in summary view**

Replace "Copiar brief para Claude Code" with:
- Default: "Enviar brief →"
- Sending: "Enviando..." (disabled, subtle pulse animation)
- Error: Show error message above button

**Step 3: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: replace clipboard copy with email send via serverless function"
```

---

## Task 8: Thank You Screen

**Files:**
- Modify: `src/Form.jsx`

**Step 1: Add ThankYou component**

When `sent === true`, render a clean confirmation screen instead of the form. No mention of Claude, no mention of internal workflow.

```jsx
function ThankYou({ clientName }) {
    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(180deg, #f2f2f7 0%, #e8e8ed 100%)",
            fontFamily: "'Inter', -apple-system, sans-serif", padding: 24,
        }}>
            <div style={{
                background: "#fff", borderRadius: 24, padding: "48px 32px",
                textAlign: "center", maxWidth: 440, width: "100%",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
                    background: "linear-gradient(135deg, #34C759, #30D158)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.03em", marginBottom: 8 }}>
                    {clientName ? `Gracias, ${clientName}` : "Gracias"}
                </h1>
                <p style={{ fontSize: 15, color: "#8e8e93", lineHeight: 1.6, marginBottom: 0 }}>
                    Recibimos toda tu información. Nos pondremos en contacto contigo pronto para comenzar a trabajar en tu web.
                </p>
            </div>
        </div>
    );
}
```

**Step 2: Conditionally render ThankYou in App**

```javascript
if (sent) return <ThankYou clientName={data.clientName || data.businessName} />;
```

**Step 3: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: add thank you screen after successful brief submission"
```

---

## Task 9: UX/UI Polish — Apply UI/UX Pro Max Rules

**Files:**
- Modify: `src/Form.jsx`
- Modify: `index.html`

**Step 1: Move Google Fonts link and global styles to index.html**

Remove the `<link>` and `<style>` tags from inside the React component (lines 632-644). Put them in `index.html` `<head>`.

**Step 2: Accessibility improvements**

- Add `aria-pressed` to Chips buttons
- Add `aria-required="true"` to required inputs
- Add `aria-invalid` when validation errors exist
- Add `role="progressbar"` to progress bar
- Wrap form sections in `<fieldset>` where semantic

**Step 3: Add prefers-reduced-motion support**

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

**Step 4: Touch targets**

Ensure all buttons (Chips, nav buttons) are minimum 44x44px. Current Chips have `padding: 8px 16px` — increase to `padding: 10px 18px` for touch compliance.

**Step 5: Focus states for keyboard navigation**

Add visible focus-visible outlines to all interactive elements:
```css
button:focus-visible { outline: 2px solid #007AFF; outline-offset: 2px; }
input:focus-visible, textarea:focus-visible { border-color: #007AFF; box-shadow: 0 0 0 4px rgba(0,122,255,0.12); }
```

**Step 6: Commit**

```bash
git add src/Form.jsx index.html
git commit -m "fix: UX polish — a11y, touch targets, reduced motion, move styles to index.html"
```

---

## Task 10: Build, Test & Deploy

**Step 1: Build locally**

Run: `npm run build`
Expected: Builds to `dist/` without errors

**Step 2: Test with Vercel dev**

Run: `npx vercel dev`
Expected: Full app with serverless function works locally

**Step 3: Test full flow**

1. Open form → fill required fields → advance through steps
2. Reach summary → click "Enviar brief"
3. Check omatosperez851@gmail.com for the email with HTML + .md attachment
4. Verify thank you screen appears
5. Test localStorage persistence (close and reopen)
6. Test query params: `?client=Jeremy&type=creative`
7. Test validation: try advancing without required fields
8. Test "Empezar de nuevo" button

**Step 4: Deploy to Vercel**

Run: `npx vercel --prod`

Add environment variable on Vercel:
Run: `npx vercel env add RESEND_API_KEY`
Enter the key from .env when prompted.

Then redeploy: `npx vercel --prod`

**Step 5: Set custom domain**

Go to Vercel dashboard → Project Settings → Domains → Add `formulario.vercel.app`

**Step 6: Final commit**

```bash
git add -A
git commit -m "chore: production build verified, ready for deploy"
```
