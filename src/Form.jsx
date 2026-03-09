import { useState, useEffect, useRef } from "react";
import { CLIENT_TYPES, STEPS_CONFIG, STEP_LABELS, STEP_ICONS, getBriefSections, generateMarkdown } from "./config.js";

// ─── PRIMITIVES ───────────────────────────────────────────────────

const SectionCard = ({ children, title, subtitle }) => (
    <div style={{
        background: "#fff", borderRadius: 20, padding: "28px 24px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
    }}>
        {title && (
            <div style={{ marginBottom: 24 }}>
                <h2 style={{
                    fontSize: 24, fontWeight: 700, color: "#0a0a0a",
                    letterSpacing: "-0.03em", lineHeight: 1.2,
                    fontFamily: "'Inter', sans-serif",
                }}>{title}</h2>
                {subtitle && (
                    <p style={{
                        fontSize: 14, color: "#8e8e93", marginTop: 8, lineHeight: 1.5,
                        fontFamily: "'Inter', sans-serif",
                    }}>{subtitle}</p>
                )}
            </div>
        )}
        {children}
    </div>
);

const FieldGroup = ({ label, children }) => (
    <div style={{
        display: "flex", flexDirection: "column", gap: 16,
        padding: "20px 0", borderTop: "1px solid #f2f2f7",
    }}>
        {label && (
            <span style={{
                fontSize: 10, fontWeight: 700, color: "#8e8e93",
                textTransform: "uppercase", letterSpacing: "0.1em",
                fontFamily: "'Inter', sans-serif",
            }}>{label}</span>
        )}
        {children}
    </div>
);

const Field = ({ label, note, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
            <label style={{
                fontSize: 13, fontWeight: 600, color: "#1d1d1f",
                letterSpacing: "-0.01em", fontFamily: "'Inter', sans-serif",
            }}>{label}</label>
            {note && (
                <p style={{
                    fontSize: 12, color: "#8e8e93", marginTop: 3,
                    fontFamily: "'Inter', sans-serif",
                }}>{note}</p>
            )}
        </div>
        {children}
    </div>
);

const inputStyle = {
    width: "100%", background: "#f8f8fa", border: "1.5px solid #e8e8ed",
    borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#1d1d1f",
    outline: "none", fontFamily: "'Inter', sans-serif", resize: "none",
    transition: "all 0.2s ease",
};

const TextInput = ({ value, onChange, placeholder, multiline, rows = 3 }) => {
    const [focus, setFocus] = useState(false);
    const style = {
        ...inputStyle,
        borderColor: focus ? "#007AFF" : "#e8e8ed",
        background: focus ? "#fff" : "#f8f8fa",
        boxShadow: focus ? "0 0 0 4px rgba(0,122,255,0.12)" : "none",
    };
    return multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            rows={rows} style={style} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={style} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />;
};

const Chips = ({ options, selected, onChange, single }) => {
    const toggle = val => {
        if (single) { onChange(val === selected ? "" : val); return; }
        selected.includes(val) ? onChange(selected.filter(v => v !== val)) : onChange([...selected, val]);
    };
    const isSelected = val => single ? selected === val : (selected || []).includes(val);
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {options.map(o => {
                const sel = isSelected(o);
                return (
                    <button key={o} onClick={() => toggle(o)} style={{
                        background: sel ? "linear-gradient(135deg, #1d1d1f 0%, #3a3a3c 100%)" : "#f2f2f7",
                        color: sel ? "#fff" : "#3a3a3c",
                        border: sel ? "1.5px solid transparent" : "1.5px solid #e5e5ea",
                        borderRadius: 24, padding: "8px 16px",
                        fontSize: 13, fontWeight: sel ? 600 : 450, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                        boxShadow: sel ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                        transform: sel ? "scale(1.02)" : "scale(1)",
                    }}>
                        {o}
                    </button>
                );
            })}
        </div>
    );
};

const Sep = () => <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #e5e5ea, transparent)", margin: "4px 0" }} />;

// ─── STEP WRAPPER WITH FADE ANIMATION ─────────────────────────────

const StepWrapper = ({ children, stepKey }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        setVisible(false);
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, [stepKey]);

    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
            {children}
        </div>
    );
};

// ─── STEPS ────────────────────────────────────────────────────────

function StepTipo({ data, setData }) {
    return (
        <SectionCard title="¿Cómo describes tu proyecto?" subtitle="Elige la opción que mejor te represente. Esto adapta las preguntas a lo que realmente necesitas.">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {CLIENT_TYPES.map(ct => {
                    const sel = data.clientType === ct.id;
                    return (
                        <button key={ct.id} onClick={() => setData({ ...data, clientType: ct.id })}
                            style={{
                                background: sel
                                    ? "linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%)"
                                    : "#f8f8fa",
                                border: sel ? "1.5px solid transparent" : "1.5px solid #e8e8ed",
                                borderRadius: 16, padding: "16px 18px",
                                textAlign: "left", cursor: "pointer", width: "100%",
                                display: "flex", alignItems: "center", gap: 14,
                                transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                                fontFamily: "'Inter', sans-serif",
                                boxShadow: sel ? "0 4px 16px rgba(0,0,0,0.12)" : "0 1px 2px rgba(0,0,0,0.04)",
                                transform: sel ? "scale(1.01)" : "scale(1)",
                            }}>
                            <span style={{
                                fontSize: 24, width: 44, height: 44, display: "flex",
                                alignItems: "center", justifyContent: "center",
                                background: sel ? "rgba(255,255,255,0.12)" : "#fff",
                                borderRadius: 12, flexShrink: 0,
                                border: sel ? "none" : "1px solid #f0f0f5",
                            }}>{ct.icon}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    fontSize: 15, fontWeight: 600,
                                    color: sel ? "#fff" : "#1d1d1f", lineHeight: 1.3,
                                }}>{ct.label}</p>
                                <p style={{
                                    fontSize: 12,
                                    color: sel ? "rgba(255,255,255,0.55)" : "#8e8e93",
                                    marginTop: 3, lineHeight: 1.4,
                                }}>{ct.desc}</p>
                            </div>
                            <div style={{
                                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                                background: sel ? "#007AFF" : "transparent",
                                border: sel ? "none" : "2px solid #d1d1d6",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s ease",
                            }}>
                                {sel && <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </SectionCard>
    );
}

function StepNegocio({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Cuéntame sobre el negocio" subtitle="Información esencial para construir la web correcta.">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Nombre del negocio o marca"><TextInput value={data.businessName || ""} onChange={f("businessName")} placeholder="Ej: Laura Pérez Consulting" /></Field>
                <Field label="Tagline o frase de posicionamiento" note="Opcional — la línea que define lo que haces"><TextInput value={data.tagline || ""} onChange={f("tagline")} placeholder="Ej: Impuestos sin complicaciones." /></Field>
            </div>
            <FieldGroup label="Contacto">
                <Field label="Email de contacto"><TextInput value={data.email || ""} onChange={f("email")} placeholder="hola@tudominio.com" /></Field>
                <Field label="WhatsApp / teléfono"><TextInput value={data.whatsapp || ""} onChange={f("whatsapp")} placeholder="+1 (809) 000-0000" /></Field>
                <Field label="Ciudad y país"><TextInput value={data.location || ""} onChange={f("location")} placeholder="Santo Domingo, República Dominicana" /></Field>
            </FieldGroup>
            <FieldGroup label="Web">
                <Field label="Idioma del sitio"><Chips single options={["Solo español", "Solo inglés", "Español + inglés", "Otro"]} selected={data.language || ""} onChange={f("language")} /></Field>
                <Field label="Web actual (si existe)"><TextInput value={data.currentUrl || ""} onChange={f("currentUrl")} placeholder="https://" /></Field>
            </FieldGroup>
        </SectionCard>
    );
}

function StepObjetivos({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="¿Para qué es la web?" subtitle="El objetivo define la estructura, el diseño y los textos.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Objetivo principal" note="Selecciona hasta 3">
                    <Chips options={["Conseguir clientes", "Mostrar portfolio", "Vender servicios", "Agendar reuniones", "Posicionamiento / credibilidad", "Vender productos", "Generar leads", "Mostrar precios", "Educar al cliente", "SEO / visibilidad"]} selected={data.goals || []} onChange={f("goals")} />
                </Field>
                <Field label="Acción principal que quieres que haga el visitante" note="El único botón que importa — el CTA #1">
                    <TextInput value={data.mainCta || ""} onChange={f("mainCta")} placeholder="Ej: Agenda una llamada, Solicita una cotización, Escríbeme por WhatsApp" />
                </Field>
                <Field label="¿Cómo medimos éxito?">
                    <TextInput value={data.successMetric || ""} onChange={f("successMetric")} placeholder="Ej: 5 leads por semana, 10 reservas al mes" />
                </Field>
                <Field label="Competidores o referentes" note="URLs o nombres — qué te gusta y qué no de ellos">
                    <TextInput value={data.competitors || ""} onChange={f("competitors")} multiline placeholder={"studioXYZ.com — me gusta su portfolio limpio\nagenciaABC.com — muy genérica, parece de 2015"} />
                </Field>
            </div>
        </SectionCard>
    );
}

function StepAudiencia({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="¿A quién va dirigida?" subtitle="Mientras más claro el target, mejor el diseño y los textos.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Tipo de cliente ideal">
                    <Chips options={["Personas (B2C)", "Empresas (B2B)", "PYMEs", "Grandes marcas", "Startups", "Creadores / artistas", "Agencias", "Gobierno / institucional", "ONGs"]} selected={data.targetTypes || []} onChange={f("targetTypes")} />
                </Field>
                <Field label="Describe a tu cliente ideal en detalle">
                    <TextInput value={data.idealClient || ""} onChange={f("idealClient")} multiline placeholder="Ej: Dueños de negocios entre 35-55 años que quieren formalizarse y delegar la contabilidad. Ya tienen ingresos pero no llevan cuentas claras." />
                </Field>
                <Field label="Mercados objetivo">
                    <Chips options={["Local (RD)", "Latinoamérica", "España", "USA (hispano)", "USA (inglés)", "Europa", "Global"]} selected={data.markets || []} onChange={f("markets")} />
                </Field>
                <Field label="¿Qué debe sentir el visitante al entrar?" note="Primera impresión, emoción, confianza">
                    <TextInput value={data.feeling || ""} onChange={f("feeling")} multiline placeholder="Ej: Confianza inmediata. Moderno pero accesible. No frío ni corporativo." />
                </Field>
            </div>
        </SectionCard>
    );
}

function StepIdentidad({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Identidad visual" subtitle="Lo que ya tienes y lo que necesitaremos crear.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Activos que ya tienes">
                    <Chips options={["Logo SVG", "Logo PNG", "Favicon", "Guía de marca", "Paleta de colores", "Tipografías", "Brand kit completo", "Fotos profesionales", "Sin activos todavía"]} selected={data.existingAssets || []} onChange={f("existingAssets")} />
                </Field>
                <Field label="Colores principales" note="En HEX si los tienes — sino describe: 'azul marino + blanco roto'">
                    <TextInput value={data.colors || ""} onChange={f("colors")} placeholder="Ej: #0A0A0A, #F7F4EE, acento #C9A84C" />
                </Field>
                <Field label="Tipografías" note="Si tienes, escribe los nombres. Si no, describe el estilo.">
                    <TextInput value={data.fonts || ""} onChange={f("fonts")} placeholder="Ej: Cormorant + DM Sans. O: 'algo elegante y moderno, sin serifa'" />
                </Field>
            </div>
            <FieldGroup label="Referencias visuales">
                <Field label="Referencias que te gustan" note="Links de webs, Behance, Dribbble, Instagram">
                    <TextInput value={data.refLikes || ""} onChange={f("refLikes")} multiline placeholder={"https://ejemplo.com — me gusta el espacio y la tipografía grande\nhttps://otro.com — paleta oscura con detalles dorados"} />
                </Field>
                <Field label="Referencias que NO te gustan">
                    <TextInput value={data.refDislikes || ""} onChange={f("refDislikes")} multiline placeholder="Ej: muy genérico, colores pasteles, carruseles, stock photos" />
                </Field>
            </FieldGroup>
        </SectionCard>
    );
}

function StepContenido({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Contenido audiovisual" subtitle="Videos, reels y proyectos a mostrar.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Plataforma de videos">
                    <Chips single options={["YouTube", "Vimeo", "Ambas", "No tengo videos"]} selected={data.videoPlatform || ""} onChange={f("videoPlatform")} />
                </Field>
                <Field label="¿Video en el Hero?">
                    <Chips single options={["Sí, autoplay de fondo", "Sí, con play manual", "No, prefiero imagen", "No decidido"]} selected={data.heroVideo || ""} onChange={f("heroVideo")} />
                </Field>
            </div>
            <FieldGroup label="Portfolio">
                <Field label="Proyectos destacados en portada"><TextInput value={data.featuredCount || ""} onChange={f("featuredCount")} placeholder="Ej: 4 a 6" /></Field>
                <Field label="Total de proyectos en portfolio"><TextInput value={data.totalProjects || ""} onChange={f("totalProjects")} placeholder="Ej: 20 a 30" /></Field>
                <Field label="Categorías o filtros">
                    <Chips options={["Comercial", "Film / Ficción", "Documental", "Music Video", "Brand Film", "Fotografía", "Social Content", "Animación", "Otro"]} selected={data.projectFilters || []} onChange={f("projectFilters")} />
                </Field>
                <Field label="Top proyectos a mostrar" note="Título · Cliente · Tipo · Año · URL — uno por línea">
                    <TextInput value={data.topProjects || ""} onChange={f("topProjects")} multiline rows={4} placeholder={"Nike Verano 2024 · Nike RD · Comercial · 2024 · vimeo.com/xxx\nFestival Doc · Indie · Documental · 2023 · youtu.be/xxx"} />
                </Field>
            </FieldGroup>
        </SectionCard>
    );
}

function StepPortfolio({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Trabajos y casos" subtitle="Los proyectos que demuestran lo que haces.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="¿Cuántos casos quieres mostrar?"><TextInput value={data.caseCount || ""} onChange={f("caseCount")} placeholder="Ej: 6 destacados + galería adicional" /></Field>
                <Field label="¿Qué incluyes en cada proyecto?">
                    <Chips options={["Imagen / foto", "Video", "Descripción del reto", "Proceso creativo", "Resultado / métricas", "Testimonio del cliente", "Tags / categoría"]} selected={data.caseElements || []} onChange={f("caseElements")} />
                </Field>
                <Field label="Proyectos a destacar" note="Nombre · Cliente · Tipo · Resultado — uno por línea">
                    <TextInput value={data.cases || ""} onChange={f("cases")} multiline rows={4} placeholder={"Rebrand La Plaza · Restaurante XYZ · Branding + Web · +40% reservas\nCampaña Q1 · Marca ABC · Social Media · 2.5M alcance"} />
                </Field>
                <Field label="Filtros del portfolio">
                    <Chips options={["Por industria", "Por servicio", "Por año", "Por resultado", "Por cliente"]} selected={data.portfolioFilters || []} onChange={f("portfolioFilters")} />
                </Field>
            </div>
        </SectionCard>
    );
}

function StepServicios({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Servicios" subtitle="Qué ofreces y cómo quieres presentarlo.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Lista de servicios" note="Uno por línea — usa el nombre exacto que quieres en la web">
                    <TextInput value={data.services || ""} onChange={f("services")} multiline rows={5} placeholder={"Declaraciones de Impuestos\nContabilidad Mensual\nGestión de Alquileres\nConstitución de Empresas\nAsesoría Legal Corporativa"} />
                </Field>
                <Field label="¿Cómo presentar los servicios?">
                    <Chips single options={["Solo nombre e ícono", "Nombre + descripción corta", "Descripción detallada", "Paquetes con precio", "Sin precio (cotización)"]} selected={data.servicePresentation || ""} onChange={f("servicePresentation")} />
                </Field>
                <Field label="CTA de servicios"><TextInput value={data.servicesCta || ""} onChange={f("servicesCta")} placeholder="Ej: Solicita una cotización, Agenda tu consulta gratis" /></Field>
                <Field label="Secciones de credibilidad">
                    <Chips options={["Logos de clientes", "Estadísticas / números", "Testimonios", "Premios / certificaciones", "Proceso de trabajo", "FAQs"]} selected={data.credSections || []} onChange={f("credSections")} />
                </Field>
            </div>
        </SectionCard>
    );
}

function StepAbout({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Historia y equipo" subtitle="La historia detrás del negocio.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Statement principal" note="Una sola frase que define por qué existes">
                    <TextInput value={data.statement || ""} onChange={f("statement")} placeholder="Ej: Hacemos que las empresas parezcan lo que ya son: extraordinarias." />
                </Field>
                <Field label="Bio corta (2–3 líneas)"><TextInput value={data.shortBio || ""} onChange={f("shortBio")} multiline rows={2} placeholder="Resumen rápido de quién eres y qué haces." /></Field>
                <Field label="Bio larga (1–2 párrafos)"><TextInput value={data.longBio || ""} onChange={f("longBio")} multiline placeholder="Historia, origen, misión, por qué haces lo que haces." /></Field>
            </div>
            <FieldGroup label="Números">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <Field label="Años de exp."><TextInput value={data.yearsExp || ""} onChange={f("yearsExp")} placeholder="10+" /></Field>
                    <Field label="Proyectos"><TextInput value={data.projectCount || ""} onChange={f("projectCount")} placeholder="200+" /></Field>
                    <Field label="Países"><TextInput value={data.countries || ""} onChange={f("countries")} placeholder="5" /></Field>
                </div>
            </FieldGroup>
            <FieldGroup label="Logros">
                <Field label="Premios o certificaciones"><TextInput value={data.awards || ""} onChange={f("awards")} multiline rows={2} placeholder={"CPA Certificado 2018\nPremio Contabilidad RD 2023"} /></Field>
                <Field label="Valores o enfoque"><TextInput value={data.values || ""} onChange={f("values")} multiline rows={2} placeholder="Ej: transparencia, trato humano, tecnología, resultados medibles" /></Field>
            </FieldGroup>
        </SectionCard>
    );
}

function StepUX({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Diseño y experiencia" subtitle="La dirección visual del sitio.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Estilo visual">
                    <Chips single options={["Minimalista", "Editorial", "Cinematográfico", "Corporativo moderno", "Bold / Maximalista", "Experimental"]} selected={data.visualLevel || ""} onChange={f("visualLevel")} />
                </Field>
                <Field label="Tema de color">
                    <Chips single options={["Dark (oscuro)", "Light (claro)", "Mixto"]} selected={data.theme || ""} onChange={f("theme")} />
                </Field>
                <Field label="Nivel de animaciones">
                    <Chips single options={["Casi ninguna", "Sutiles", "Scroll animations", "Full cinematic"]} selected={data.animationLevel || ""} onChange={f("animationLevel")} />
                </Field>
                <Field label="Secciones que quieres">
                    <Chips options={["Hero con video", "Reel / showreel", "Portfolio / trabajos", "About / historia", "Servicios", "Testimonios", "Logos de clientes", "Proceso de trabajo", "Estadísticas", "Contacto", "FAQs", "Blog", "Footer + redes"]} selected={data.sections || []} onChange={f("sections")} />
                </Field>
                <Field label="¿Qué NO quieres?">
                    <TextInput value={data.dontWant || ""} onChange={f("dontWant")} multiline rows={2} placeholder="Ej: sin carruseles, sin stock photos, sin colores pasteles" />
                </Field>
                <Field label="Sobriedad vs Impacto">
                    <div style={{
                        display: "flex", alignItems: "center", gap: 14, paddingTop: 4,
                        background: "#f8f8fa", borderRadius: 12, padding: "14px 16px",
                        border: "1px solid #e8e8ed",
                    }}>
                        <span style={{ fontSize: 12, color: "#8e8e93", width: 50, fontFamily: "'Inter', sans-serif" }}>Sobrio</span>
                        <input type="range" min={1} max={10} value={data.impactLevel || 5}
                            onChange={e => f("impactLevel")(parseInt(e.target.value))}
                            style={{ flex: 1, accentColor: "#007AFF" }} />
                        <span style={{ fontSize: 12, color: "#8e8e93", width: 50, textAlign: "right", fontFamily: "'Inter', sans-serif" }}>Impacto</span>
                        <span style={{
                            fontSize: 16, fontWeight: 700, color: "#007AFF", width: 24,
                            textAlign: "center", fontFamily: "'Inter', sans-serif",
                        }}>{data.impactLevel || 5}</span>
                    </div>
                </Field>
            </div>
        </SectionCard>
    );
}

function StepTecnico({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Requisitos técnicos" subtitle="Infraestructura y necesidades de desarrollo.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Dominio"><TextInput value={data.domain || ""} onChange={f("domain")} placeholder="tudominio.com" /></Field>
                <Field label="Hosting actual"><TextInput value={data.hosting || ""} onChange={f("hosting")} placeholder="Ej: Vercel, Netlify, Hostinger, sin hosting aún" /></Field>
            </div>
            <FieldGroup label="Integraciones">
                <Field label="Integraciones necesarias">
                    <Chips options={["Google Analytics", "Meta Pixel", "Tag Manager", "WhatsApp flotante", "CRM", "Calendly / booking", "Pasarela de pagos", "Chat en vivo", "Newsletter"]} selected={data.integrations || []} onChange={f("integrations")} />
                </Field>
                <Field label="Requerimientos especiales">
                    <Chips options={["SEO básico", "SEO avanzado", "Bilingüe", "Panel de gestión", "Blog editable", "Core Web Vitals", "One-page", "Multipage"]} selected={data.technicalReqs || []} onChange={f("technicalReqs")} />
                </Field>
                <Field label="Notas técnicas"><TextInput value={data.technicalNotes || ""} onChange={f("technicalNotes")} multiline rows={2} placeholder="Ej: conectar con sistema de reservas en Acuity" /></Field>
            </FieldGroup>
        </SectionCard>
    );
}

function StepEntrega({ data, setData }) {
    const f = k => v => setData({ ...data, [k]: v });
    return (
        <SectionCard title="Entrega" subtitle="Fechas, aprobaciones y lo que falta por definir.">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Fecha objetivo de lanzamiento"><TextInput value={data.launchDate || ""} onChange={f("launchDate")} placeholder="Ej: 1 de mayo 2026" /></Field>
                <Field label="Fecha límite para entregar el contenido"><TextInput value={data.contentDeadline || ""} onChange={f("contentDeadline")} placeholder="Ej: 15 de abril 2026" /></Field>
                <Field label="¿Quién aprueba el diseño final?"><TextInput value={data.designApprover || ""} onChange={f("designApprover")} placeholder="Ej: yo mismo / mi socia / el equipo de marketing" /></Field>
                <Field label="Ciclos de revisión">
                    <Chips single options={["1 revisión", "2 revisiones", "3 revisiones", "+3 revisiones"]} selected={data.revisionCycles || ""} onChange={f("revisionCycles")} />
                </Field>
            </div>
            <FieldGroup label="Social & notas">
                <Field label="Redes sociales a enlazar"><TextInput value={data.socialLinks || ""} onChange={f("socialLinks")} multiline rows={3} placeholder={"Instagram: @usuario\nYouTube: youtube.com/c/usuario\nLinkedIn: linkedin.com/in/usuario"} /></Field>
                <Field label="Notas finales" note="Todo lo que no cupiera arriba">
                    <TextInput value={data.finalNotes || ""} onChange={f("finalNotes")} multiline placeholder="Ej: tengo un video de 30s para el hero. Los colores son negro y dorado." />
                </Field>
            </FieldGroup>
        </SectionCard>
    );
}

const STEP_COMPS = {
    tipo: StepTipo, negocio: StepNegocio, objetivos: StepObjetivos, audiencia: StepAudiencia,
    identidad: StepIdentidad, contenido: StepContenido, portfolio: StepPortfolio,
    servicios: StepServicios, about: StepAbout, ux: StepUX, tecnico: StepTecnico, entrega: StepEntrega,
};

// ─── SUMMARY ─────────────────────────────────────────────────────

function Summary({ data }) {
    const type = CLIENT_TYPES.find(c => c.id === data.clientType);
    const sections = getBriefSections(data);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Hero card */}
            <div style={{
                background: "linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%)",
                borderRadius: 20, padding: "28px 24px", color: "#fff",
            }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Resumen del Brief</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>{type?.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "'Inter', sans-serif" }}>{data.businessName || "—"}</p>
                {data.tagline && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginTop: 6 }}>{data.tagline}</p>}
            </div>

            {/* Section cards */}
            {sections.map(s => {
                const rows = s.rows.filter(([, v]) => v);
                if (!rows.length) return null;
                return (
                    <div key={s.title} style={{
                        background: "#fff", borderRadius: 16, padding: "20px 22px",
                        border: "1px solid #f0f0f5",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <span style={{ fontSize: 18 }}>{s.icon}</span>
                            <p style={{
                                fontSize: 12, fontWeight: 700, color: "#8e8e93",
                                textTransform: "uppercase", letterSpacing: "0.08em",
                                fontFamily: "'Inter', sans-serif",
                            }}>{s.title}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {rows.map(([k, v]) => (
                                <div key={k} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10 }}>
                                    <span style={{ fontSize: 12, color: "#8e8e93", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{k}</span>
                                    <span style={{ fontSize: 13, color: "#1d1d1f", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{String(v)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── APP ──────────────────────────────────────────────────────────

export default function App() {
    const [data, setData] = useState({ clientType: "", impactLevel: 5 });
    const [stepIndex, setStepIndex] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [sendError, setSendError] = useState("");
    const pillsRef = useRef(null);

    const clientType = data.clientType || "personal";
    const steps = STEPS_CONFIG[clientType] || STEPS_CONFIG.personal;
    const currentStep = steps[stepIndex];
    const StepComp = STEP_COMPS[currentStep];
    const progress = ((stepIndex + 1) / steps.length) * 100;
    const isLast = stepIndex === steps.length - 1;

    // Auto-scroll pills to show active step
    useEffect(() => {
        if (pillsRef.current) {
            const activeBtn = pillsRef.current.children[stepIndex];
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
        }
    }, [stepIndex, showSummary]);

    const goNext = () => {
        if (isLast) { setShowSummary(true); return; }
        setStepIndex(i => i + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const goBack = () => {
        if (showSummary) { setShowSummary(false); return; }
        if (stepIndex > 0) { setStepIndex(i => i - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    };

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
            localStorage.removeItem("clients-form-draft");
            localStorage.removeItem("clients-form-draft-step");
        } catch (err) {
            setSendError("No se pudo enviar. Intenta de nuevo.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(180deg, #f2f2f7 0%, #e8e8ed 100%)",
            fontFamily: "'Inter', -apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
        }}>
            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&display=swap" rel="stylesheet" />

            <style>{`
                *{box-sizing:border-box;margin:0;padding:0;}
                body{background:#f2f2f7;-webkit-font-smoothing:antialiased;}
                ::-webkit-scrollbar{display:none;}
                textarea,input{-webkit-font-smoothing:antialiased;}
                input[type=range]{-webkit-appearance:none;height:4px;background:#e5e5ea;border-radius:2px;outline:none;width:100%;}
                input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#007AFF;cursor:pointer;box-shadow:0 2px 8px rgba(0,122,255,0.3);}
                ::placeholder{color:#adadb8;}
                textarea:focus,input:focus{outline:none;}
                @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
            `}</style>

            {/* Header */}
            <div style={{
                position: "sticky", top: 0, zIndex: 20,
                background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                padding: "16px 20px 0",
            }}>
                <div style={{ maxWidth: 560, margin: "0 auto" }}>
                    {/* Title row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: "linear-gradient(135deg, #1d1d1f, #3a3a3c)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <span style={{ fontSize: 13, color: "#fff", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>B</span>
                            </div>
                            <span style={{
                                fontSize: 14, fontWeight: 700, color: "#1d1d1f",
                                letterSpacing: "-0.01em", fontFamily: "'Inter', sans-serif",
                            }}>Brief</span>
                        </div>
                        <div style={{
                            background: showSummary ? "linear-gradient(135deg, #34C759, #30D158)" : "#f2f2f7",
                            borderRadius: 20, padding: "4px 12px",
                        }}>
                            <span style={{
                                fontSize: 12, fontWeight: 600,
                                color: showSummary ? "#fff" : "#8e8e93",
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                {showSummary ? "✓ Completo" : `${stepIndex + 1} de ${steps.length}`}
                            </span>
                        </div>
                    </div>

                    {/* Progress track */}
                    <div style={{
                        height: 4, background: "#e5e5ea", borderRadius: 2,
                        overflow: "hidden", marginBottom: 14,
                    }}>
                        <div style={{
                            width: showSummary ? "100%" : `${progress}%`,
                            background: showSummary
                                ? "linear-gradient(90deg, #34C759, #30D158)"
                                : "linear-gradient(90deg, #007AFF, #5856D6)",
                            height: "100%", borderRadius: 2,
                            transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
                        }} />
                    </div>

                    {/* Step pills */}
                    <div ref={pillsRef} style={{
                        display: "flex", gap: 6, overflowX: "auto",
                        paddingBottom: 14, scrollbarWidth: "none",
                    }}>
                        {steps.map((s, i) => {
                            const active = !showSummary && i === stepIndex;
                            const done = showSummary || i < stepIndex;
                            return (
                                <button key={s} onClick={() => { if (!showSummary) setStepIndex(i); }}
                                    style={{
                                        flexShrink: 0, fontSize: 11, fontWeight: active ? 600 : done ? 500 : 400,
                                        padding: "6px 14px", borderRadius: 20,
                                        border: active ? "none" : done ? "1px solid #d1d1d6" : "1px solid #e5e5ea",
                                        cursor: showSummary ? "default" : "pointer",
                                        background: active ? "linear-gradient(135deg, #007AFF, #5856D6)" : done ? "#fff" : "#f8f8fa",
                                        color: active ? "#fff" : done ? "#1d1d1f" : "#adadb8",
                                        transition: "all 0.2s ease", fontFamily: "'Inter', sans-serif",
                                        letterSpacing: "0.01em",
                                        boxShadow: active ? "0 2px 8px rgba(0,122,255,0.25)" : "none",
                                        display: "flex", alignItems: "center", gap: 4,
                                    }}>
                                    {done && !active && <span style={{ fontSize: 10 }}>✓</span>}
                                    {STEP_LABELS[s]}
                                </button>
                            );
                        })}
                        {showSummary && (
                            <div style={{
                                flexShrink: 0, fontSize: 11, fontWeight: 600,
                                padding: "6px 14px", borderRadius: 20,
                                background: "linear-gradient(135deg, #34C759, #30D158)",
                                color: "#fff", fontFamily: "'Inter', sans-serif",
                                boxShadow: "0 2px 8px rgba(52,199,89,0.25)",
                                display: "flex", alignItems: "center", gap: 4,
                            }}>
                                📋 Resumen
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 140px" }}>
                <StepWrapper stepKey={showSummary ? "summary" : currentStep}>
                    {showSummary ? <Summary data={data} /> : StepComp && <StepComp data={data} setData={setData} />}
                </StepWrapper>
            </div>

            {/* Bottom nav */}
            <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20,
                background: "rgba(255,255,255,0.9)", backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                padding: "14px 20px 24px",
            }}>
                <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", gap: 10 }}>
                    {(stepIndex > 0 || showSummary) && (
                        <button onClick={goBack}
                            style={{
                                background: "#fff", border: "1px solid #e5e5ea",
                                color: "#1d1d1f", fontSize: 14, fontWeight: 600,
                                padding: "14px 20px", borderRadius: 14, cursor: "pointer",
                                fontFamily: "'Inter', sans-serif",
                                transition: "all 0.15s",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            }}>
                            ←
                        </button>
                    )}
                    {showSummary ? (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                            {sendError && <p style={{ fontSize: 13, color: "#FF3B30", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>{sendError}</p>}
                            <button onClick={sendBrief} disabled={sending}
                                style={{
                                    width: "100%",
                                    background: sending
                                        ? "linear-gradient(135deg, #8e8e93, #aeaeb2)"
                                        : "linear-gradient(135deg, #1d1d1f, #2c2c2e)",
                                    border: "none", color: "#fff", fontSize: 15, fontWeight: 600,
                                    padding: "14px 24px", borderRadius: 14,
                                    cursor: sending ? "not-allowed" : "pointer",
                                    fontFamily: "'Inter', sans-serif",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                    opacity: sending ? 0.7 : 1,
                                }}
                            >
                                {sending ? "Enviando..." : "Enviar brief →"}
                            </button>
                        </div>
                    ) : (
                        <button onClick={goNext}
                            style={{
                                flex: 1,
                                background: "linear-gradient(135deg, #007AFF, #5856D6)",
                                border: "none", color: "#fff", fontSize: 15, fontWeight: 600,
                                padding: "14px 24px", borderRadius: 14, cursor: "pointer",
                                fontFamily: "'Inter', sans-serif",
                                transition: "all 0.2s ease",
                                boxShadow: "0 4px 16px rgba(0,122,255,0.25)",
                            }}
                        >
                            {isLast ? "Ver resumen →" : "Siguiente →"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}