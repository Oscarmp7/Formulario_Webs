<div align="center">

<br>

<img src="public/favicon.svg" alt="Brief Logo" width="64" height="64">

<br>

# Brief — Client Intake Form

**Intelligent, adaptive web brief collection system for freelance web designers.**

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://formulario-webs.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Resend](https://img.shields.io/badge/Email-Resend-000?style=flat-square)](https://resend.com)

<br>

[Live Demo](https://formulario-webs.vercel.app) · [Docs](#documentation) · [Setup](#quick-start)

<br>

</div>

---

## The Problem

Gathering requirements from clients for web projects is messy. Long email chains, missing information, repeated questions, and unclear expectations. Every project starts with friction instead of clarity.

## The Solution

**Brief** is a multi-step, adaptive form that collects everything you need to build a client's website — from business goals to visual identity to technical requirements — in one clean, guided session. When the client hits "Send", you receive a beautifully formatted email with the complete brief attached as a `.md` file, ready for your workflow.

---

## Features

### Adaptive Flow
The form adapts its questions based on client type. A filmmaker sees portfolio and video content steps. A business sees services and credibility sections. No irrelevant questions.

```
personal  → 10 steps (services-focused)
creative  → 11 steps (portfolio + content)
business  → 11 steps (services + portfolio)
agency    → 11 steps (services + portfolio)
other     →  9 steps (essentials only)
```

### Client Personalization
Send each client a unique URL that greets them by name and pre-selects their category:

```
https://formulario-webs.vercel.app?client=Jeremy&type=creative
https://formulario-webs.vercel.app?client=Aydile&type=business
https://formulario-webs.vercel.app?client=Gio&type=agency
```

### Email Delivery
When the client submits, you receive:
- **HTML email** — Styled brief with color-coded sections, dark header card, and clean typography
- **Markdown attachment** — `.md` file with the complete brief, ready for AI-assisted development workflows

### Session Persistence
Form data saves to `localStorage` on every step change. If the client closes the browser and returns later, they pick up exactly where they left off.

### Validation
Required fields (business name, email, client type) are validated before advancing. Inline error messages guide the client without blocking their flow.

### Accessibility
- `aria-pressed` on toggle buttons
- `aria-progressbar` on progress indicator
- `focus-visible` outlines for keyboard navigation
- `prefers-reduced-motion` support
- Minimum 44px touch targets

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLIENT BROWSER                 │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Form.jsx │→ │config.js │→ │ localStorage │  │
│  │ (UI +    │  │ (shared  │  │ (persistence)│  │
│  │  steps)  │  │  config) │  │              │  │
│  └────┬─────┘  └──────────┘  └──────────────┘  │
│       │                                          │
│       │ POST /api/send-brief                     │
└───────┼──────────────────────────────────────────┘
        │
        ▼
┌───────────────────┐     ┌─────────────┐
│  Vercel Serverless │ ──→ │   Resend    │ ──→ Email
│  api/send-brief.js │     │   (SMTP)    │     to you
└───────────────────┘     └─────────────┘
```

### Project Structure

```
.
├── api/
│   └── send-brief.js        # Vercel serverless function (Resend integration)
├── public/
│   └── favicon.svg           # "B" logo favicon
├── src/
│   ├── config.js             # Shared constants, brief sections, markdown generator
│   ├── Form.jsx              # All UI components: primitives, steps, summary, app
│   └── main.jsx              # React entry point
├── docs/
│   └── plans/                # Implementation plans
├── index.html                # Entry HTML with fonts, global styles, a11y
├── vercel.json               # Vercel deployment config
├── vite.config.js            # Vite build config
└── package.json
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | Component UI with hooks |
| **Build** | Vite 6 | Fast dev server and optimized builds |
| **Backend** | Vercel Serverless Functions | API endpoint for email sending |
| **Email** | Resend | Transactional email delivery |
| **Hosting** | Vercel | Edge deployment with automatic SSL |
| **Styling** | Inline CSS-in-JS | Apple-inspired design system |

---

## Quick Start

### Prerequisites

- Node.js 18+
- A [Resend](https://resend.com) account (free tier: 100 emails/day)
- A [Vercel](https://vercel.com) account (free hobby tier)

### 1. Clone & Install

```bash
git clone https://github.com/Oscarmp7/Formulario_Webs.git
cd Formulario_Webs
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
RESEND_API_KEY=re_your_api_key_here
```

### 3. Update Email Recipient

In `api/send-brief.js`, change the recipient email:

```javascript
to: ["your-email@example.com"],
```

### 4. Run Locally

```bash
# Frontend only (no email sending)
npm run dev

# Full stack with serverless functions
npx vercel dev
```

### 5. Deploy

```bash
# Link to Vercel
npx vercel link

# Add environment variable
echo "re_your_key" | npx vercel env add RESEND_API_KEY production

# Deploy
npx vercel --prod
```

---

## Documentation

### Form Steps

Each step collects a specific category of information:

| # | Step | ID | Collects |
|---|------|----|----------|
| 1 | **Perfil** | `tipo` | Client type selection (personal, creative, business, agency, other) |
| 2 | **Negocio** | `negocio` | Business name, tagline, contact info, language, current URL |
| 3 | **Objetivos** | `objetivos` | Goals, primary CTA, success metrics, competitors |
| 4 | **Audiencia** | `audiencia` | Target types (B2B/B2C), ideal client, markets, desired feeling |
| 5 | **Marca** | `identidad` | Existing assets, colors, fonts, visual references |
| 6 | **Contenido** | `contenido` | Video platform, hero video, portfolio categories *(creative only)* |
| 7 | **Trabajos** | `portfolio` | Case studies, project elements, filters *(creative/business/agency)* |
| 8 | **Servicios** | `servicios` | Service list, presentation style, credibility sections *(not creative/other)* |
| 9 | **Historia** | `about` | Statement, bios, stats, awards, values |
| 10 | **Diseno** | `ux` | Visual style, theme, animations, sections, impact level |
| 11 | **Tecnico** | `tecnico` | Domain, hosting, integrations, special requirements |
| 12 | **Entrega** | `entrega` | Launch date, content deadline, approver, revision cycles |

### Component Architecture

```
Form.jsx
│
├── Primitives
│   ├── SectionCard      Card wrapper with title/subtitle
│   ├── FieldGroup       Grouped fields with label separator
│   ├── Field            Label + note + children wrapper
│   ├── TextInput        Input/textarea with focus states
│   ├── Chips            Single/multi-select toggle buttons
│   └── Sep              Visual separator line
│
├── Step Components (12)
│   ├── StepTipo         Client type selection
│   ├── StepNegocio      Business information
│   ├── StepObjetivos    Goals and objectives
│   ├── StepAudiencia    Target audience
│   ├── StepIdentidad    Visual identity
│   ├── StepContenido    Audio/video content
│   ├── StepPortfolio    Portfolio/case studies
│   ├── StepServicios    Services listing
│   ├── StepAbout        Company story
│   ├── StepUX           Design direction
│   ├── StepTecnico      Technical requirements
│   └── StepEntrega      Delivery/timeline
│
├── StepWrapper          Fade animation on step transitions
├── Summary              Review all collected data
├── ThankYou             Post-submission confirmation
└── App                  Main controller (state, nav, validation, send)
```

### Data Flow

```
1. Client opens form
   ↓
2. URL params read → pre-fill clientType + clientName
   ↓
3. localStorage checked → restore previous session (if any)
   ↓
4. Client fills steps → data saved to state + localStorage on each change
   ↓
5. Validation runs on "Next" → blocks if required fields missing
   ↓
6. Summary screen → client reviews all data
   ↓
7. "Enviar brief" clicked
   ↓
8. POST /api/send-brief { data, markdown }
   ↓
9. Serverless function:
   ├── Generates HTML email (color-coded sections)
   ├── Creates .md attachment from markdown string
   └── Sends via Resend API
   ↓
10. Success → ThankYou screen + localStorage cleared
    Error  → Error message + retry button
```

### API Reference

#### `POST /api/send-brief`

Sends the completed brief via email.

**Request Body:**

```json
{
  "data": {
    "clientType": "creative",
    "businessName": "Studio XYZ",
    "email": "client@example.com",
    "tagline": "Visual storytelling",
    ...
  },
  "markdown": "# Brief — Studio XYZ\n**Tipo**: Creativo...\n\n## PERFIL\n..."
}
```

**Required fields in `data`:** `businessName`, `email`, `clientType`

**Responses:**

| Status | Body | Meaning |
|--------|------|---------|
| `200` | `{ "success": true }` | Email sent successfully |
| `400` | `{ "error": "Missing required fields..." }` | Validation failed |
| `405` | `{ "error": "Method not allowed" }` | Not a POST request |
| `500` | `{ "error": "Failed to send email" }` | Resend API error |

### Configuration

#### `src/config.js`

Single source of truth for all form configuration:

| Export | Type | Purpose |
|--------|------|---------|
| `CLIENT_TYPES` | `Array` | Client type options with id, label, description, icon |
| `STEPS_CONFIG` | `Object` | Step sequence per client type |
| `STEP_LABELS` | `Object` | Display labels for each step |
| `STEP_ICONS` | `Object` | Emoji icons for each step |
| `getBriefSections(data)` | `Function` | Returns structured sections array from form data |
| `generateMarkdown(data)` | `Function` | Generates markdown string from form data |

#### Validation Rules

Defined in `REQUIRED_FIELDS` inside `Form.jsx`:

```javascript
const REQUIRED_FIELDS = {
    tipo:    { clientType: "Selecciona un tipo de proyecto" },
    negocio: { businessName: "El nombre es obligatorio",
               email: "El email es obligatorio" },
};
```

To add validation to other steps, add the step key with field-message pairs.

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | Resend API key (starts with `re_`) |

### Customization

#### Change recipient email

Edit `api/send-brief.js` line:
```javascript
to: ["your-email@example.com"],
```

#### Change sender name

Edit `api/send-brief.js` line:
```javascript
from: "Your Brand <onboarding@resend.dev>",
```

> **Note:** To use a custom sender domain (e.g., `brief@yourdomain.com`), add and verify your domain in the [Resend dashboard](https://resend.com/domains).

#### Add a new form step

1. Create the step component in `Form.jsx` following existing patterns
2. Add it to `STEP_COMPS` map
3. Add its key to `STEPS_CONFIG` for relevant client types
4. Add label in `STEP_LABELS` and icon in `STEP_ICONS` (in `config.js`)
5. Add any new fields to `getBriefSections()` and `generateMarkdown()`

#### Add required fields to a step

Add the step key to `REQUIRED_FIELDS` in `Form.jsx`:

```javascript
const REQUIRED_FIELDS = {
    tipo:    { clientType: "Selecciona un tipo de proyecto" },
    negocio: { businessName: "El nombre es obligatorio", email: "El email es obligatorio" },
    // Add more:
    entrega: { launchDate: "La fecha de lanzamiento es obligatoria" },
};
```

---

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Text | `#1d1d1f` | Headings, body text |
| Secondary Text | `#8e8e93` | Labels, notes, muted text |
| Placeholder | `#adadb8` | Input placeholders |
| Blue Accent | `#007AFF` | CTAs, focus states, active pills |
| Purple Accent | `#5856D6` | Gradient endpoints |
| Green Success | `#34C759` | Completed states, success |
| Red Error | `#FF3B30` | Validation errors |
| Background | `#f2f2f7` | Page background |
| Card | `#ffffff` | Card backgrounds |
| Input BG | `#f8f8fa` | Input resting state |
| Border | `#e8e8ed` | Input borders, separators |

### Typography

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Card Title | 24px | 700 | Inter |
| Field Label | 13px | 600 | Inter |
| Field Note | 12px | 400 | Inter |
| Input Text | 14px | 400 | Inter |
| Chip | 13px | 450/600 | Inter |
| Step Pill | 11px | 400-600 | Inter |
| Group Label | 10px | 700 | Inter (uppercase) |

### Spacing

| Element | Value |
|---------|-------|
| Card padding | 28px 24px |
| Card radius | 20px |
| Input radius | 12px |
| Chip radius | 24px |
| Button radius | 14px |
| Field gap | 8px |
| Section gap | 16-18px |
| Max content width | 560px |

---

## License

Private project. All rights reserved.

---

<div align="center">

Built with precision by **Oscar**

</div>
