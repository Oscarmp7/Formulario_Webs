# Product

## Register

brand

## Users

Clientes potenciales de Oscar Matos: profesionales independientes, creativos y artistas, empresas y negocios, agencias y estudios, y proyectos personales que buscan construir su presencia digital. Llegan al formulario después de una conversación inicial con Oscar (referido, recomendación, contacto directo) y lo llenan en un momento donde están listos para invertir en su web — con atención plena, en computadora, en contexto profesional.

Están evaluando si Oscar es el diseñador y desarrollador correcto para su proyecto. El formulario es la primera prueba concreta del craft de Oscar antes de comprometerse.

## Product Purpose

Capturar las decisiones **estratégicas y de gusto** del cliente — aquellas que solo el cliente puede definir con criterio — y transformarlas en archivos `PRODUCT.md` y `DESIGN.md` (este último en seed mode) listos para que Oscar arranque el workflow de diseño en el proyecto del cliente usando IMPECCABLE, INTENT y otros skills.

División de responsabilidades:

- **El formulario captura del cliente:** users, propósito, brand personality, voz y tono, references positivas y anti-references, color preferences, fuentes admiradas, sites que rechaza, contexto de uso, audiencia, objetivos, métricas de éxito, principios del negocio.
- **Oscar refina después con IMPECCABLE:** register classification del sitio, OKLCH values exactos, scale ratios, component specs detallados, motion timings, frontmatter YAML del DESIGN.md, accessibility implementation, naming conventions y tokens.

El formulario tiene un rol doble:
1. **Funcional:** intake estructurado de las decisiones que solo el cliente puede tomar.
2. **Vitrina:** primera impresión concreta del nivel de craft de Oscar.

Si el formulario se siente común, el resto del trabajo va a sentirse común. Éxito = el cliente termina con la sensación "este tipo va a hacer algo especial".

## Brand Personality

**Tres palabras:** Cinemático. Confiado. Hecho a mano.

Voz: directa pero respetuosa, sin condescendencia ni jerga de marketing. No vende — demuestra. Palabras concretas en lugar de abstracciones. Habla al cliente como un adulto que sabe qué quiere pero necesita ayuda articulándolo.

Tono emocional al terminar: profesionalismo respetado. El cliente debe sentir que está trabajando con alguien de nivel, no con un freelancer más.

## Anti-references

Lo que el formulario NO debe sentir, en orden de prioridad:

1. **SaaS genérico (saturado en 2025):** Inter como fuente default, gradientes morado-azul, nested cards, sombras decorativas, primary buttons azules. La estética que cualquier AI genera por reflejo. Si alguien puede mirar el form y decir "esto lo hizo una AI" sin dudar, ya falló.

2. **Typeform o survey alegre:** uppercase chunky, transiciones con bounce o elastic, emojis grandes, animaciones decorativas, tono "let's go, awesome, exciting". El form como entretenimiento.

3. **Burocrático y corporativo:** inputs cuadrados grises, labels que repiten el placeholder, sin personalidad, formal sin gracia. El form como trámite obligatorio.

4. **Editorial pretencioso sin razón:** Cormorant italic en todos los headers, drop caps, columnas de revista, ruled separators decorativos. Editorial es una lane específica del diseño, no la default.

**Lane correcta (referencias positivas):** Estudios cinematográficos como Buck (buck.co), Tendril (tendril.ca) y ManvsMachine (mvsm.com). Motion-first, reveal sequences con pacing intencional, hero pieces que respiran, sensación de obra producida con detalle.

## Design Principles

1. **Practice what you preach.** Si Oscar diseña webs distinctivas, su formulario de intake debe ser igual de distinctiva. El form es la prueba número uno del craft.

2. **Show, don't tell.** Nunca prometer calidad con copy. Demostrarla con la pieza misma. Cada decisión visual y de motion es un argumento concreto sobre cómo trabaja Oscar.

3. **Earned simplicity.** Aparente simplicidad construida sobre decisiones complejas. Cada pregunta, animación, transición y elemento debe haberse ganado su lugar.

4. **Respeto al tiempo del cliente.** El cliente está prestando atención completa al llenarlo. Cada pregunta debe nutrir directamente el brief generado. Si no aporta, se elimina. El form no es para Oscar — es para captura útil.

5. **First impression is the work.** El cliente está evaluando si Oscar es el correcto para su proyecto. El form es la primera demostración concreta. No hay segunda oportunidad para la primera impresión.

## Accessibility & Inclusion

- **WCAG 2.2 AA mínimo:** contraste de colores, focus visible, keyboard navigation completa, jerarquía semántica correcta.
- **Touch targets ≥ 44px:** el formulario se llena tanto en desktop como en móvil.
- **`prefers-reduced-motion` respetado:** animaciones decorativas se eliminan o reducen drásticamente; transiciones funcionales se mantienen instantáneas.
- **Idiomas:** español como primary, inglés como segunda opción para clientes internacionales.
- **Latencia tolerante:** el formulario se persiste en localStorage; conexiones inestables (clientes en otros países, móvil) no destruyen el progreso.
- **Subida de archivos resiliente:** los uploads no bloquean el flujo si fallan; el cliente puede continuar y reintentar.
