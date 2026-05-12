# Form Output Spec

Contrato del output que el clients-form genera para Oscar. Reemplaza el `brief.md` plano actual por dos archivos listos para consumir directamente con IMPECCABLE y otros skills.

## Filosofía del output

El formulario captura **decisiones estratégicas y de gusto** que solo el cliente puede definir con criterio. Oscar refina después en el proyecto corriendo `/impeccable teach`, `/impeccable document` y otros comandos para tokens exactos, scale ratios, component specs y motion timings.

**Lo que el form captura del cliente:**
- Información de negocio (quién, qué, por qué)
- Estrategia (audiencia, objetivos, métricas)
- Brand personality y voz
- Gusto visual (referencias positivas, anti-references, paleta direccional, fuentes admiradas)
- Contexto técnico y de entrega

**Lo que Oscar refina después (NO va al form):**
- Register classification del sitio (brand vs product)
- OKLCH values exactos, scale ratios precisos
- Component specs detallados
- Motion timings y easing curves
- Frontmatter YAML del DESIGN.md (machine-readable tokens)
- Accessibility implementation details

---

## Output 1: `PRODUCT.md` (completo)

Generado en formato exacto que IMPECCABLE consume. Sin marker SEED (es definitivo).

```markdown
# Product

## Register

[NOTA AL DESIGNER: decidir entre brand/product al iniciar el proyecto. Default brand si no es product UI dashboard.]

## Users

### Audiencia primaria
[De `targetTypes[]` + `idealClient` + `markets[]`]

Ejemplo: "Profesionales latinoamericanos entre 28 y 45 años, dueños de pequeñas y medianas empresas creativas (estudios de fotografía, agencias boutique, productoras independientes). Toman decisiones B2B y se mueven entre español e inglés."

### Contexto de uso
[De pregunta nueva: contexto físico y mental cuando visitan el sitio]

Ejemplo: "Probablemente desktop en oficina, en momento de evaluación seria (buscando contratar un servicio). Pueden volver desde móvil a referirse."

### Job to be done
[De `goals[]` + `mainCta` + `idealClient`]

Ejemplo: "Evaluar si la productora es la correcta para su próximo proyecto. Quieren ver portfolio + confiar en el equipo + entender el proceso de trabajo + agendar una primera reunión."

## Product Purpose

### Qué es
[De `businessName` + `tagline` + descripción del negocio]

### Por qué existe
[De pregunta nueva: problema que resuelve / propuesta de valor real]

Ejemplo: "Las marcas que invierten en video producción a menudo no saben distinguir calidad técnica de calidad narrativa. Studio XYZ existe para hacer obras que combinan ambas, sin sacrificar ninguna por velocidad o presupuesto."

### Qué define éxito
[De `successMetric` + pregunta nueva: éxito en 30/90 días]

- **30 días:** 5 leads cualificados por mes
- **90 días:** 2 proyectos cerrados, 1 propuesta high-ticket en negociación
- **Métrica primaria:** [del cliente]

### CTA principal
[De `mainCta`]

## Brand Personality

### Tres palabras
[De pregunta nueva: 3 adjetivos físicos/concretos]

Ejemplo: "Cinematográfico. Confiado. Hecho a mano."

### Voz
[De pregunta nueva: cómo habla el negocio + ejemplos de frases]

### Tono emocional
[De `feeling` + pregunta nueva: qué emoción al salir]

Ejemplo: "Confianza profunda. El visitante debe sentir 'estoy en buenas manos' al final del scroll."

### Cómo NO debe sonar
[De pregunta nueva: anti-voz]

## Anti-references

[De `refDislikes` + pregunta nueva sobre patrones a evitar]

Ejemplo:
1. **SaaS genérico:** No queremos verse como una landing de software (Inter, gradients, nested cards).
2. **Sitio de fotografía tradicional:** Las galerías infinitas tipo `fotografos.com` se sienten poco curadas.
3. **Burocrático corporativo:** Sitios con stock photos sonrientes y "Nuestra Misión" headers.

Sitios concretos a evitar:
- [URLs del cliente]

## Design Principles

[Destilado por Oscar/IMPECCABLE de las respuestas. NO se pregunta directamente al cliente — se infiere de combinación de personality + values + anti-references.]

Ejemplo (destilado):
1. **Show, don't list.** Demostrar craft con piezas reales en lugar de listar capacidades.
2. **Curation over completeness.** Mostrar 6 piezas excelentes, no 60 medianas.
3. **Honest about timeline.** Si toma 8 semanas, decir 8 semanas — no prometer 4.

[NOTA AL DESIGNER: este sección debe enriquecerse después con /impeccable teach. El form aporta el insumo crudo (values, voz, anti-references) — los principios se destilan.]

## Accessibility & Inclusion

[De `technicalReqs[]` + pregunta nueva: needs específicos]

- WCAG 2.2 AA mínimo (default)
- [Necesidades específicas del cliente]
- [Idiomas del sitio]
- [Consideraciones especiales]
```

---

## Output 2: `DESIGN.md` (seed mode)

Generado con marker `<!-- SEED -->` para que IMPECCABLE entienda que es semilla. Captura solo las decisiones de gusto del cliente. Oscar enriquece con tokens reales después corriendo `/impeccable document` una vez que haya código.

```markdown
<!-- SEED: generado desde clients-form intake. Re-correr `npx impeccable document` post-implementación para enriquecer con tokens reales extraídos del código. -->

---
name: [businessName]
description: [tagline]
colors:
  # Seed — solo direcciones del cliente, no tokens finales
  primary-direction: "[HEX o nombre conceptual]"
  neutral-direction: "[HEX o nombre]"
  accent-direction: "[HEX o nombre]"
typography:
  # Seed — solo direcciones admiradas
  display-direction: "[familia o tipo de fuente]"
  body-direction: "[familia o tipo de fuente]"
---

# Design System: [businessName]

## 1. Overview

### Creative Direction (cliente)

**Mood / atmosphere:** [De pregunta nueva: 3-5 adjetivos del mood]

**Visual lane:** [De `visualLevel` mejorado con mood board picker]

**Theme stance:** [De `theme`: dark / light / mixed con razón]

**Impact level:** [De `impactLevel` slider 1-10, contextualizado]
- 1-3: Sobrio (Stripe, Vercel)
- 4-6: Balanceado (Linear, Apple)
- 7-10: Impacto (Buck, Tendril)

### Anti-references (visual)

[De `refDislikes` con contexto del POR QUÉ se rechaza]

## 2. Colors

### Cliente especificó (direccional)

[De `colors` (HEX) + nuevo color picker]

[NOTA AL DESIGNER: paleta seed. Re-extraer con /impeccable document post-implementación para tokens precisos en OKLCH.]

### Color strategy (inferida)

[Inferida de impactLevel + theme]:
- impactLevel 1-3 + light theme → Restrained
- impactLevel 4-6 + cualquier theme → Committed
- impactLevel 7-10 → Full palette o Drenched

## 3. Typography

### Fuentes admiradas / direccionales

[De `fonts` actualizado con nuevo selector visual de fuentes]

### Sites de referencia con typography destacable

[De `refLikes` filtrado por menciones tipográficas]

## 4. Elevation

[NOTA AL DESIGNER: cliente no decide esto. Default a Flat-by-default a menos que `visualLevel` y `impactLevel` indiquen lo contrario.]

## 5. Components

[NOTA AL DESIGNER: vacío en seed. Oscar refina después con /impeccable document scan mode.]

### Sections deseadas por el cliente
[De `sections[]`]

### Funcionalidad/integraciones
[De `integrations[]` + `technicalReqs[]`]

## 6. Do's and Don'ts

### Do (extraído del cliente)
[De `refLikes` con razón positiva]
- Lo que el cliente admira y quiere que el sitio evoque

### Don't (extraído del cliente)
[De `refDislikes` + `dontWant`]
- Patrones explícitamente rechazados
```

---

## Mapeo: campos del form → output

### Campos que se mantienen (con ajustes mínimos)

| Campo actual | Va a | Nota |
|---|---|---|
| `clientType` | PRODUCT.md.Users (contexto) | Oscar usa para decidir register |
| `businessName` | PRODUCT.md.title + DESIGN.md.frontmatter.name | |
| `tagline` | PRODUCT.md.Purpose.Qué es + DESIGN.md.frontmatter.description | |
| `email`, `whatsapp` | Metadata del email a Oscar (no al output) | |
| `location` | PRODUCT.md.Users.contexto | |
| `language` | PRODUCT.md.Accessibility + DESIGN.md.localization | |
| `currentUrl` | Metadata (referencia para Oscar) | |
| `goals[]` | PRODUCT.md.Purpose | |
| `mainCta` | PRODUCT.md.Purpose.CTA | |
| `successMetric` | PRODUCT.md.Purpose (qué define éxito) | |
| `competitors` | PRODUCT.md.Anti-references (competidores que el cliente NO quiere parecer) | |
| `targetTypes[]`, `idealClient`, `markets[]` | PRODUCT.md.Users | Combinar en prosa, no bullet list |
| `feeling` | PRODUCT.md.Brand Personality.tono | |
| `existingAssets[]`, `logoFiles[]`, `brandFiles[]` | DESIGN.md.assets (separados) | |
| `colors` | DESIGN.md.frontmatter.colors (direction) | Reemplazar input HEX por color picker visual |
| `fonts` | DESIGN.md.Typography.direction | Reemplazar texto libre por selector visual |
| `refLikes` | DESIGN.md.Do's + Overview.references | Capturar también el POR QUÉ |
| `refDislikes` | PRODUCT.md.Anti-references + DESIGN.md.Don'ts | Capturar también el POR QUÉ |
| `services` | PRODUCT.md.Purpose (qué vende el negocio) | |
| `servicePresentation`, `servicesCta`, `credSections[]` | DESIGN.md.Sections.servicios subsection | |
| `videoPlatform`, `heroVideo`, `featuredCount`, `topProjects`, `cases` | DESIGN.md.Sections.portfolio + DESIGN.md.Components.video | |
| `portfolioFiles[]` | DESIGN.md.assets.portfolio | |
| `statement`, `shortBio`, `longBio` | PRODUCT.md.Purpose (storytelling) | |
| `profileFiles[]` | DESIGN.md.assets.profile | |
| `yearsExp`, `projectCount`, `countries`, `awards` | PRODUCT.md.Purpose.credibility | |
| `values` | PRODUCT.md.Design Principles.insumo | |
| `visualLevel` | DESIGN.md.Overview.lane | **Reemplazar labels abstractas por mood board picker visual** |
| `theme` | DESIGN.md.Overview.theme stance | |
| `animationLevel` | DESIGN.md.Motion.stance | |
| `sections[]` | DESIGN.md.Sections | |
| `dontWant` | DESIGN.md.Don'ts | |
| `impactLevel` (1-10) | DESIGN.md.Overview.impact | |
| `domain`, `hosting`, `integrations[]`, `technicalReqs[]`, `technicalNotes` | DESIGN.md.Components.functional (handover a Oscar) | |
| `launchDate`, `contentDeadline`, `designApprover`, `revisionCycles`, `socialLinks`, `finalNotes` | Metadata del email (no va a PRODUCT.md/DESIGN.md) | Para gestión de proyecto, no para AI agent |

### Preguntas NUEVAS a agregar (gaps identificados)

**Para PRODUCT.md:**

1. **Contexto de uso del sitio** (step Audiencia)
   - "Cuando alguien visita tu sitio, ¿dónde está físicamente y en qué momento?"
   - Opciones: Escritorio en oficina (decisión seria), Móvil en movimiento (recordatorio), Recomendado por amigo (validación), En reunión con cliente (referencia), Other
   - **Por qué:** define theme/density. Un sitio que se ve en proyector en reunión necesita diferente jerarquía que uno que se ve en móvil en bus.

2. **Problema que resuelve** (step Objetivos)
   - "¿Qué frustración tiene tu cliente potencial que tu negocio resuelve?"
   - Textarea con placeholder con ejemplos concretos
   - **Por qué:** captura propuesta de valor REAL, no genérica. Insumo para Design Principles.

3. **Éxito en 30/60/90 días** (step Objetivos, expandiendo successMetric)
   - "Define éxito en horizontes:"
   - 30 días: [texto corto]
   - 90 días: [texto corto]
   - **Por qué:** obliga al cliente a ser concreto sobre métricas. Oscar puede priorizar features.

4. **Brand personality concreta** (step Identidad, nuevo sub-step)
   - "Describe el negocio en 3 palabras CONCRETAS (físicas, no abstractas)"
   - Placeholder: "Ej: 'cinematográfico, confiado, hecho a mano'. NO: 'innovador, moderno, profesional'."
   - **Por qué:** anti-cliché. Captura voz real.

5. **Anti-voz** (step Identidad)
   - "¿Cómo NO debe sonar el sitio?"
   - Placeholder: "Ej: 'sin jerga corporativa', 'sin entusiasmo forzado', 'sin disclaimers legales largos'."
   - **Por qué:** define voz por negación. Más útil que solo definirla en positivo.

6. **Mayor frustración con presencia actual** (step Objetivos)
   - "¿Qué te frustra de cómo tu negocio se ve online HOY?"
   - **Por qué:** identifica what's broken. Insumo para priorizar fixes.

7. **Qué hace que un cliente te elija a vos** (step Audiencia)
   - "Cuando un cliente te elige sobre la competencia, ¿qué le dijiste o hiciste que cerró la decisión?"
   - **Por qué:** captura propuesta de valor real (no la del marketing). Insumo para hero copy.

8. **Anclas de identidad** (step Identidad)
   - "¿Qué de cómo te presentás HOY definitivamente NO querés cambiar?"
   - **Por qué:** identifica brand equity existente que el rediseño debe preservar.

9. **Accessibility specifics** (step Técnico, expandir)
   - "¿Conoces alguna necesidad específica de tu audiencia? (visual, motora, cognitiva, conexión limitada)"
   - **Por qué:** previene WCAG-as-afterthought.

**Para DESIGN.md:**

10. **Mood adjectives** (step Diseño, reemplazando "feeling")
    - "Si el sitio fuera un lugar físico, ¿cómo se sentiría caminar por ahí?"
    - Placeholder: "Ej: 'un estudio fotográfico amplio con paredes de cemento crudo y luz natural', 'una boutique de libros raros con piso de madera vieja'"
    - **Por qué:** physical-object language. Obliga concreción.

11. **Color picker visual** (step Identidad, reemplazando texto libre HEX)
    - Componente con 3 modos: paletas predefinidas curadas + HEX manual + extraer de imagen subida
    - **Por qué:** clientes no-diseñadores no saben HEX. Y "rojo" tiene infinitas variantes.

12. **Mood board picker** (step Diseño, reemplazando `visualLevel` labels)
    - 6 stills curados de webs reales (Oscar provee). Cliente arrastra 2 favoritos a un dock.
    - **Por qué:** input visual real > tags abstractas como "minimalista" o "cinematográfico" que el cliente no entiende igual que Oscar.

13. **Typography lane visual** (step Identidad, reemplazando texto libre)
    - 6 specimens visuales de pares tipográficos. Cliente elige 2 que más le gustan.
    - **Por qué:** "Cormorant + DM Sans" significa cero al cliente. Specimens visuales sí.

14. **Imagery direction** (step Diseño, nuevo)
    - "¿Qué tipo de imagery se imagina el sitio?"
    - Opciones: Fotografía documental, Fotografía editorial, Ilustración custom, Renders 3D, Abstract/geometric, Cero imagery (tipografía-only), Mix
    - **Por qué:** define art direction core.

15. **Elevation philosophy** (step Diseño, nuevo)
    - "¿Cómo se siente la profundidad del sitio?"
    - Opciones: Plana (tipo Vercel/Stripe), Layered (tipo iOS), Editorial (tipo NYT)
    - **Por qué:** define shadows/borders/depth desde el inicio.

### Preguntas a ELIMINAR (no aportan al output o son redundantes)

| Campo actual | Razón para eliminar |
|---|---|
| `whatsapp` | Información de contacto, no de brief. Va a email metadata. |
| `revisionCycles` | Negociación de proyecto, no input de diseño. Va a email metadata. |
| `designApprover` | Operativo, no diseño. Va a email metadata. |
| `featuredCount`, `totalProjects`, `caseCount`, `caseElements` | Demasiado granular. Inferible de portfolio uploads. |
| `portfolioFilters` | Decisión técnica de Oscar, no del cliente. |

### Preguntas a REORDENAR

Nuevo orden de steps (10 steps unified vs 9-11 actual):

1. **Bienvenida + Tipo de cliente** (combinado, una sola pantalla con teatro)
2. **Negocio** (qué hace, dónde, contacto) — corto
3. **Audiencia** (quién, contexto, propuesta de valor)
4. **Objetivos** (qué se busca, problema que resuelve, éxito 30/90)
5. **Voz** (personality, anti-voz, valores) — nuevo standalone
6. **Visual** (mood físico, paleta visual, fuentes visuales, mood board) — el momento teatral
7. **Identidad existente** (assets actuales, logo, anclas a preservar)
8. **Portfolio / Servicios** (condicional por clientType, integrado)
9. **Estructura** (sections, animation level, theme, impact slider)
10. **Técnico + Entrega** (combinado: dominio, hosting, integrations, deadlines)

Esto reduce a 10 steps fijos (vs 9-11 condicionales actuales), pero cada step es más profundo y memorable.

---

## Generación del email + adjuntos

Reemplazar contenido del email actual:

**Email body:** Resumen ejecutivo curado del brief, NO el dump completo. Solo:
- Nombre del cliente + tagline
- 3 puntos clave (audiencia, propuesta, mood)
- Link a archivos adjuntos
- Botón "Iniciar proyecto" (link a notion/template de Oscar opcional)

**Adjuntos:**
1. `PRODUCT.md` (texto plano, listo para IMPECCABLE)
2. `DESIGN.md` (texto plano con seed marker, listo para IMPECCABLE)
3. `metadata.json` con info operativa (contacto, fechas, links a uploads, revisión cycles)
4. `assets.zip` (opcional): logo + brand files + portfolio + profile photos comprimidos

Esto separa cleanly: **lo que va al AI agent** (1 + 2) vs **lo que va a Oscar como humano** (3 + 4 + email body).
