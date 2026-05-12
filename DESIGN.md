<!-- SEED: este DESIGN.md es aspiracional, fue escrito antes del redesign. Re-correr `npx impeccable document` después de implementar el redesign para enriquecer con tokens reales extraídos del código. -->

---
name: clients-form
description: Intake form cinemático que demuestra el craft de Oscar antes de la primera línea de código del proyecto del cliente.
colors:
  paper: "#f2f2f7"
  paper-tint: "#e8e8ed"
  paper-card: "#ffffff"
  ink: "#1d1d1f"
  ink-soft: "#6e6e73"
  ink-faint: "#8e8e93"
  rule: "#d1d1d6"
  signal: "#007AFF"
  signal-deep: "#0055CC"
  signal-purple: "#5856D6"
  success: "#34C759"
  danger: "#FF3B30"
typography:
  display-xl:
    fontFamily: "'Cabinet Grotesk', system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 8vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  display:
    fontFamily: "'Cabinet Grotesk', system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Cabinet Grotesk', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Satoshi', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Satoshi', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.005em"
  label:
    fontFamily: "'Satoshi', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  mono:
    fontFamily: "'JetBrains Mono', 'Geist Mono', monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  none: "0"
  hairline: "2px"
  sm: "4px"
spacing:
  micro: "4px"
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
  xxl: "96px"
components:
  button-primary:
    background: "linear-gradient(135deg, {colors.signal}, {colors.signal-purple})"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "16px 32px"
    typography: "{typography.title}"
  button-primary-hover:
    opacity: 0.88
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
    typography: "{typography.title}"
  input-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 0"
    typography: "{typography.body}"
  chip-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    typography: "{typography.label}"
  chip-selected:
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    typography: "{typography.label}"
---

# Design System: clients-form

## 1. Overview

**Creative North Star: "The First Cut"**

Este sistema captura el momento del *first cut* — la primera escena del proyecto del cliente, la primera versión de la edición que un director arma con cuidado antes de mostrar a nadie. El form no es un trámite ni una herramienta de productividad; es un set de filmación. Cada step es un *shot* compuesto con intención. Cada transición es un *edit*. El cliente no llena un formulario — narra su proyecto.

La estética rechaza explícitamente las cuatro lanes saturadas de 2025: SaaS genérico (Inter + gradientes), Typeform alegre (emojis + bounce), burocrático corporativo (inputs grises), y editorial pretencioso sin razón (Cormorant italic everywhere). En su lugar, opta por una identidad monocroma cálida con un acento terracota cinematográfico, tipografía con personalidad sin caer en display-serif default, y motion que se siente como ediciones de película — no como UI transitions.

La densidad es alta cuando lo amerita, pero cada elemento se gana su lugar. Cada decisión visual debe responder a la pregunta: *"¿esto haría que un cliente sofisticado piense que está trabajando con alguien de craft?"* Si no, fuera.

**Key Characteristics:**
- Paleta Apple-inspired: grises fríos limpios + azul `#007AFF` como acento principal
- Tipografía one-family-per-role: Cabinet Grotesk display + Satoshi body
- Iconography custom (cero emojis)
- Flat-by-default: sin shadows decorativas, sin nested cards
- Motion cinemático con Motion.dev, no transitions React genéricas
- Hairline rules como separadores, no backgrounds diferenciados
- Whitespace generoso como sistema, no margen residual

## 2. Colors: The Clean Apple Palette

Paleta inspirada en el sistema de diseño de Apple: grises fríos precisos + un azul `#007AFF` de alto contraste. Limpia, familiar, sin fricciones visuales — el cliente llena el form sin distracciones de color.

### Primary
- **Signal (Blue)** (`#007AFF`): el único acento committed. Aparece en: CTA primario (button fill), focus underline de inputs, chips seleccionados, threshold del slider (valor 6-10), step activo. El gradiente `linear-gradient(135deg, #007AFF, #5856D6)` se usa en el CTA primary para darle carácter.
- **Signal Deep** (`#0055CC`): variante hover/active del Signal. Solo para states, no para superficies estáticas.
- **Signal Purple** (`#5856D6`): partner del gradiente. No aparece solo — solo como parte del gradient con Signal Blue.

### Neutral
- **Paper** (`#f2f2f7`): background base de la pieza. Gris frío muy suave, estilo iOS systemBackground.
- **Paper Card** (`#ffffff`): superficies elevadas — cards, dropzones, inputs con background.
- **Paper Tint** (`#e8e8ed`): hover states de elementos sin background, separadores sutiles.
- **Ink** (`#1d1d1f`): foreground principal. El near-black de Apple — casi puro, sin sesgo de temperatura.
- **Ink Soft** (`#6e6e73`): texto secundario, labels, hints, body de bajo énfasis.
- **Ink Faint** (`#8e8e93`): meta info, contadores, placeholders. Mínima legibilidad.
- **Rule** (`#d1d1d6`): hairline rules entre secciones. La única "borde" visible en el sistema.
- **Success** (`#34C759`): confirmaciones y uploads exitosos.
- **Danger** (`#FF3B30`): errores de validación y destructive states.

### Named Rules
**The One Signal Rule.** El azul Signal aparece en ≤10% del viewport en cualquier momento. Su rareza es lo que le da peso. Si dos elementos Signal compiten en la misma pantalla, uno está mal.

**The Gradient-Only-on-CTA Rule.** El gradiente azul-púrpura aparece únicamente en el botón CTA primario. Cero gradientes decorativos en backgrounds, cards, o separadores.

## 3. Typography: The Cinematic Type Pair

**Display Font:** Cabinet Grotesk (Fontshare, free para uso comercial) — geometric grotesque con detalles teatrales, weight contrast brutal, presencia cinematográfica.
**Body Font:** Satoshi (Fontshare, free para uso comercial) — geometric clean, distinctivo sin gritar, lee bien en inputs y prosa larga.
**Mono Font:** JetBrains Mono o Geist Mono (free) — para URLs, emails, file names, números técnicos.

**Character:** El pair es deliberadamente NO editorial. Ninguno es serif. Ambos son geometric pero con personalidad — Cabinet aporta el teatro cinematográfico en headlines y números grandes, Satoshi aporta la confianza neutral en body. Tracking negativo agresivo (-0.04em en displays) refuerza la sensación de title sequences de cine.

### Hierarchy
- **Display XL** (Cabinet Grotesk 800, clamp(3.5rem, 8vw, 6rem), 0.95 line-height, -0.045em): step titles principales en pantalla introductoria y hero sections. Aparece raramente (1-2 veces en el flow). Su escala extrema marca momentos teatrales.
- **Display** (Cabinet Grotesk 700, clamp(2rem, 5vw, 3.5rem), 1.05 line-height, -0.04em): título de cada step en su pantalla. Aparece una vez por step.
- **Headline** (Cabinet Grotesk 600, 1.5rem, 1.2 line-height, -0.025em): sub-secciones dentro de un step si las hay. Uso conservador.
- **Title** (Satoshi 500, 1.125rem, 1.3 line-height, -0.015em): labels destacados de fields que requieren énfasis, button text.
- **Body** (Satoshi 400, 1rem, 1.5 line-height, -0.005em): texto general, hints, descriptions, input text. Max line length 65–75ch para prose.
- **Label** (Satoshi 500, 0.8125rem, 1.4 line-height, 0.02em letter-spacing): mini labels minoritarios. Sin uppercase decorative (no "FIELD LABEL" tracked uppercase — eso es SaaS dashboard cliché).
- **Mono** (JetBrains/Geist Mono 400, 0.875rem): URLs, file names, contadores numéricos en step pills, hex values en color displays.

### Named Rules
**The Numeric Display Rule.** Todos los números visibles al usuario que tengan peso semántico (step counter "01 de 12", file size, count, percentage) usan Cabinet Grotesk en display weight, no Satoshi. Los números son momentos tipográficos, no metadata.

**The No-Uppercase-Tracking Rule.** Sin labels uppercase con letter-spacing > 0.1em. Esa es la signature del SaaS dashboard (Stripe, Linear, Vercel) y queremos diferenciarnos. Si necesitás emphasis en un label, usalo en weight contrast (500 vs 400), no en case ni tracking.

## 4. Elevation

**Flat-By-Default.** El sistema usa cero box-shadows decorativas. Toda la depth se conveya mediante:

1. **Hairline rules** (`1px solid rule`) entre secciones — el único divisor visual permitido
2. **Whitespace generoso** — separación es ausencia, no background diferenciado
3. **Type contrast** — display vs body como jerarquía
4. **Background variants** sutiles solo en states (`paper-tint` para drop zones, sticky header)

### Shadow Vocabulary
Ninguna. Por diseño. Si necesitás elevation, repensá la estructura.

### Named Rules
**The Hairline-Only Rule.** El único borde permitido tiene 1px de width. Cero `border: 2px`, cero `border-width: thick`. Si necesitás emphasis, usá weight tipográfico o color, no border.

**The No-Shadow Rule.** Cero `box-shadow` excepto en estados de focus accesible (mínima `0 0 0 2px var(--signal)` para keyboard focus rings, no decorativa). Cualquier shadow decorativa es un bug.

**The Whitespace-as-System Rule.** Spacing entre elementos es modular (4/8/12/20/32/56/96px). No hay valores arbitrarios. Whitespace es la herramienta principal de jerarquía.

## 5. Components

### Buttons
- **Shape:** rectangular. Border-radius máximo 2px (`hairline`). Cero rounded buttons grandes.
- **Primary:** gradiente Signal (azul→púrpura) background + blanco puro text. Padding 16px / 32px. Hover: opacity 0.88.
- **Secondary:** transparent background + Ink text + 1px Ink rule border. Hover: Paper Tint background.
- **Tertiary:** transparent + Ink Soft text, underline on hover.
- **States:** todos los buttons tienen default / hover / focus / active / disabled / loading. Focus = 2px Signal outline (no inner shadow).

### Inputs
- **Shape:** rectangular. Solo `border-bottom: 1px solid rule`. Sin full borders, sin rounded corners, sin background fills.
- **Behavior:** focus → border-bottom cambia a 2px Signal. Animation: 200ms ease-out-quart en el width del underline (transform scale).
- **Padding:** 12px vertical, 0 horizontal (full-bleed dentro del container).
- **Placeholder:** Ink Faint. Body face. Estado vacío.
- **Error:** border-bottom Danger (`#FF3B30`) + small error text below en Label face.

### Chips (multi-select)
- **Shape:** rectangular con border-radius `sm` (4px). NO scale on selected (cero `transform: scale(1.02)`).
- **Default:** transparent + Ink Soft text + 1px rule border. Padding 10px / 16px.
- **Selected:** Signal blue background + blanco text.
- **Hover (default):** Paper Tint background, Ink text.
- **Behavior:** click instantaneo, sin bounce. Solid bg cambio en 150ms ease-out-quart.

### File Upload Zone
- **Shape:** rectangular full-bleed, `border: 1px dashed rule`. NO rounded corners.
- **Idle state:** Paper Tint background sutil, Ink Soft helper text en body face, ícono custom SVG mono-line (NOT emoji 📎).
- **Drag-over:** border solid Signal + paper background. Subtle inner glow no.
- **Upload state:** mini progress bar Signal width-anim usando `transform: scaleX()` (NUNCA `width` transition por anti-pattern detector).
- **Success:** filename en Mono face + remove button (×) en Ink Soft.

### Step Pills (navegación entre steps)
- **Default:** Body face, Ink Faint text. Padding 8px / 14px.
- **Active:** Body face, Ink text + 1px rule underline (Signal). NO solid background.
- **Completed:** Mono face para el número, Ink Soft text. Tiny checkmark custom SVG (NOT ✓ unicode).
- **Behavior:** horizontal scroll snap. Click anywhere = jump to step (con confirmación si hay cambios sin guardar).

### Range Slider (1-10 "Sobrio vs Impacto")
- **Track:** 1px Ink Soft line, full width.
- **Thumb:** 16x16 square (NOT circle), Signal background, NO box-shadow.
- **Value display:** Cabinet Grotesk display weight, 4rem size, animated to/from value with GSAP odometer-style snap.
- **Behavior:** threshold change at 5 → 6 triggers color transition Ink→Signal en value display + subtle haptic-feeling animation (scale 1→1.04→1 en 200ms con ease-out-quart).
- **Anchors:** "Sobrio" (1) y "Impacto" (10) en Mono face en los extremos.

### Color Picker (nuevo)
Reemplaza el "HEX si los tienes" actual. Tres modos:
1. **Paleta predefinida:** swatches de paletas cinematográficas tipo Deakins/Hoytema (no "Material colors").
2. **HEX directo:** input mono face con preview adjacent.
3. **Subir imagen de referencia:** image upload + auto-extract dominant colors.

### Mood Board Picker (nuevo, reemplaza "estilo visual: Minimalista/Editorial/...")
6 stills de webs reales (curadas por Oscar). Cliente arrastra 2 que más le gusten. UI: 6 thumbnails en grid 3×2, drag-and-drop hacia un "your picks" dock. Cada pick muestra el nombre de la web (en mono face) y un tag describing the lane.

## 6. Do's and Don'ts

### Do
- Usa whitespace modular (4/8/12/20/32/56/96px) como sistema de jerarquía
- Reserva Signal azul (`#007AFF`) para CTA primary, focus de inputs activos, chips seleccionados. Máximo ≤10% del viewport
- Usa el gradiente azul-púrpura exclusivamente en el botón CTA primary
- Tipografía display en números semánticos ("01 de 12", file sizes, contadores)
- Motion.dev timelines para step transitions: reveal por chunks con stagger 60-80ms
- Custom SVG icons mono-line: 1.25px stroke, esquinas vivas, sin fills decorativos
- Mono face para metadata técnica (URLs, emails, hex values, file names)
- Hairline rules como separadores (`1px solid rule`)
- `prefers-reduced-motion`: reducir todas las anims decorativas, mantener funcionales instantáneas
- `transform: scaleX()` para progress bars (NUNCA `width` transition)

### Don't
- NO Inter, NO Arial, NO Roboto, NO Open Sans (anti-pattern detector lo flag)
- NO gradientes decorativos fuera del CTA primary
- NO nested cards, NO card grids idénticas
- NO box-shadows decorativas (solo focus rings accesibles)
- NO emojis como iconography system (👤🎨🏢🚀✨ están vedados)
- NO bounce/elastic easing; cubic-bezier(0.16, 1, 0.3, 1) por default
- NO rounded buttons grandes (radius > 2px)
- NO `transform: scale(1.02)` en chips selected (cero feedback Typeform-style)
- NO uppercase labels con `letter-spacing > 0.1em`
- NO backdrop-filter blur como decoración (glassmorphism vedado)
- NO `width: 100%` transition en progress bars (anti-pattern del detector)
