import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
    CLIENT_TYPES,
    STEPS,
    OPTIONS,
    COLOR_PALETTES,
    TYPOGRAPHY_LANES,
    ANTI_PATTERNS,
    REQUIRED_BY_STEP,
    INITIAL_DATA,
    getClientTypeLabel,
} from "./config.js";
import * as Icons from "./components/icons.jsx";
import { MotionStep, Reveal } from "./components/MotionStep.jsx";
import { Chip, ChipGroup } from "./components/Chip.jsx";
import { Field, TextInput, TextArea } from "./components/Field.jsx";
import { ImpactSlider } from "./components/Slider.jsx";
import { FileUpload } from "./components/FileUpload.jsx";
import { PrimaryButton, SecondaryButton, GhostButton } from "./components/Button.jsx";
import { MoodBoardPicker } from "./components/MoodBoardPicker.jsx";
import { ConfirmModal } from "./components/ConfirmModal.jsx";

const STORAGE_KEY = "clients-form-draft-v2";

function getIcon(name) {
    return Icons[name] || Icons.IconIntro;
}

function emailValid(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

function urlValid(v) {
    if (!v) return true;
    try {
        new URL(String(v).startsWith("http") ? v : `https://${v}`);
        return true;
    } catch {
        return false;
    }
}

// ── Validation per step ───────────────────────────────────────────
function getStepErrors(stepId, data) {
    const required = REQUIRED_BY_STEP[stepId] || [];
    const errors = {};
    required.forEach((field) => {
        const v = data[field];
        if (!v || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && v.length === 0)) {
            errors[field] = "Requerido.";
        }
    });
    if (stepId === "business" && data.email && !emailValid(data.email)) {
        errors.email = "Email no parece válido.";
    }
    if (stepId === "business" && data.currentUrl && !urlValid(data.currentUrl)) {
        errors.currentUrl = "URL no parece válida.";
    }
    return errors;
}

// ── Main App ──────────────────────────────────────────────────────
export default function Form() {
    const [data, setData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? { ...INITIAL_DATA, ...JSON.parse(saved) } : INITIAL_DATA;
        } catch {
            return INITIAL_DATA;
        }
    });
    const [started, setStarted] = useState(false);
    const [stepIdx, setStepIdx] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState("");
    const [errors, setErrors] = useState({});
    const [showResetModal, setShowResetModal] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {}
    }, [data]);

    const currentStep = STEPS[stepIdx];
    const totalSteps = STEPS.length;

    const update = (k, v) => setData((d) => ({ ...d, [k]: v }));
    const updateMany = (patch) => setData((d) => ({ ...d, ...patch }));

    const tryNext = () => {
        const errs = getStepErrors(currentStep.id, data);
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setErrors({});
        if (stepIdx < totalSteps - 1) {
            setStepIdx(stepIdx + 1);
            window.scrollTo({ top: 0, behavior: "instant" });
        } else {
            setShowSummary(true);
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    };

    const goBack = () => {
        setErrors({});
        if (showSummary) {
            setShowSummary(false);
        } else if (stepIdx > 0) {
            setStepIdx(stepIdx - 1);
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    };

    const jumpTo = (idx) => {
        setErrors({});
        setShowSummary(false);
        setStepIdx(idx);
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    const reset = () => setShowResetModal(true);

    const confirmReset = () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        setData(INITIAL_DATA);
        setStepIdx(0);
        setShowSummary(false);
        setSent(false);
        setSendError("");
        setErrors({});
        setShowResetModal(false);
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    const submit = async () => {
        setSending(true);
        setSendError("");
        try {
            const res = await fetch("/api/send-brief", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data }),
            });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Error ${res.status}`);
            }
            setSent(true);
            try { localStorage.removeItem(STORAGE_KEY); } catch {}
        } catch (err) {
            setSendError(err.message || "No se pudo enviar.");
        } finally {
            setSending(false);
        }
    };

    if (sent) return <ThankYou data={data} />;
    if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;

    return (
        <div style={{ minHeight: "100dvh", background: "var(--paper)", color: "var(--ink)" }}>
            {showResetModal && (
                <ConfirmModal
                    title="¿Reiniciar el formulario?"
                    body="Se borrará todo lo ingresado. Esta acción no se puede deshacer."
                    confirmLabel="Sí, reiniciar"
                    onConfirm={confirmReset}
                    onCancel={() => setShowResetModal(false)}
                />
            )}
            <Header
                stepIdx={stepIdx}
                totalSteps={totalSteps}
                showSummary={showSummary}
                onReset={reset}
            />

            <main
                style={{
                    maxWidth: "720px",
                    margin: "0 auto",
                    padding: "32px clamp(16px, 5vw, 40px) 160px",
                }}
            >
                {!showSummary && (
                    <StepNav
                        currentIdx={stepIdx}
                        onJump={jumpTo}
                        completedSteps={getCompletedSteps(data)}
                    />
                )}

                <div style={{ marginTop: "48px" }}>
                    {showSummary ? (
                        <Summary
                            data={data}
                            onEdit={jumpTo}
                            onSubmit={submit}
                            sending={sending}
                            sendError={sendError}
                        />
                    ) : (
                        <MotionStep stepId={currentStep.id}>
                            <StepRenderer
                                step={currentStep}
                                data={data}
                                update={update}
                                updateMany={updateMany}
                                errors={errors}
                            />
                        </MotionStep>
                    )}
                </div>
            </main>

            {!sent && (
                <BottomNav
                    canBack={stepIdx > 0 || showSummary}
                    onBack={goBack}
                    onNext={showSummary ? undefined : tryNext}
                    isLast={stepIdx === totalSteps - 1}
                    showSummary={showSummary}
                />
            )}
        </div>
    );
}

// ── Header ─────────────────────────────────────────────────────────
function Header({ stepIdx, totalSteps, showSummary, onReset }) {
    const label = showSummary ? "Resumen" : `${String(stepIdx + 1).padStart(2, "0")} / ${String(totalSteps).padStart(2, "0")}`;
    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "var(--paper)",
                borderBottom: "1px solid var(--rule)",
                padding: "14px clamp(16px, 5vw, 40px)",
            }}
        >
            <div
                style={{
                    maxWidth: "1080px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1.125rem",
                        letterSpacing: "-0.03em",
                        color: "var(--ink)",
                    }}
                >
                    Brief
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8125rem",
                            color: "var(--ink-soft)",
                            fontFeatureSettings: '"tnum" 1',
                        }}
                    >
                        {label}
                    </span>
                    <GhostButton onClick={onReset} style={{ fontSize: "0.8125rem" }}>
                        Reiniciar
                    </GhostButton>
                </div>
            </div>
        </header>
    );
}

// ── Step Nav (pills) ──────────────────────────────────────────────
function StepNav({ currentIdx, onJump, completedSteps }) {
    const activeRef = useRef(null);

    useEffect(() => {
        activeRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }, [currentIdx]);

    return (
        <nav
            aria-label="Pasos del formulario"
            style={{
                display: "flex",
                gap: "0",
                overflowX: "auto",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                margin: "0 clamp(-16px, -5vw, -40px)",
                padding: "0 clamp(16px, 5vw, 40px)",
            }}
        >
            {STEPS.map((step, idx) => {
                const isActive = idx === currentIdx;
                const isCompleted = completedSteps.includes(step.id);
                return (
                    <button
                        key={step.id}
                        ref={isActive ? activeRef : null}
                        type="button"
                        onClick={() => onJump(idx)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "12px 16px",
                            background: "transparent",
                            border: 0,
                            borderBottom: isActive ? "2px solid var(--signal)" : "2px solid transparent",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "border-color var(--duration-fast) var(--ease-out)",
                            minHeight: "44px",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8125rem",
                                fontWeight: isActive ? 500 : 400,
                                color: isActive
                                    ? "var(--signal)"
                                    : isCompleted
                                    ? "var(--ink-soft)"
                                    : "var(--ink-faint)",
                                letterSpacing: "0",
                                textTransform: "lowercase",
                            }}
                        >
                            {step.label}
                        </span>
                        {isCompleted && !isActive && (
                            <span style={{ color: "var(--signal)", display: "flex" }}>
                                <Icons.IconCheck width="11" height="11" />
                            </span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
}

function getCompletedSteps(data) {
    const completed = [];
    for (const step of STEPS) {
        const errs = getStepErrors(step.id, data);
        if (Object.keys(errs).length === 0) {
            // Heuristic: si el step tiene al menos un campo no-vacío fuera de los requeridos, está "tocado".
            const hasContent = stepHasContent(step.id, data);
            if (hasContent) completed.push(step.id);
        }
    }
    return completed;
}

function stepHasContent(stepId, data) {
    const map = {
        intro: !!data.clientType,
        business: !!(data.businessName || data.email),
        audience: !!(data.idealClient || (data.targetTypes || []).length),
        goals: !!((data.goals || []).length || data.mainCta),
        voice: !!(data.personalityWords || data.voiceDescription),
        visual: !!(data.moodAdjectives || data.theme),
        identity: !!(data.refLikes || (data.existingAssets || []).length || (data.logoFiles || []).length || (data.brandFiles || []).length),
        work: !!(data.services || data.statement || (data.portfolioFiles || []).length),
        structure: !!((data.sections || []).length),
        technical: !!(data.domain || (data.integrations || []).length),
    };
    return map[stepId] || false;
}

// ── Step Renderer ─────────────────────────────────────────────────
function StepRenderer({ step, data, update, updateMany, errors }) {
    const Icon = getIcon(step.iconName);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <Reveal>
                <StepHeader step={step} Icon={Icon} />
            </Reveal>

            <Reveal>
                <StepContent step={step} data={data} update={update} updateMany={updateMany} errors={errors} />
            </Reveal>
        </div>
    );
}

function StepHeader({ step, Icon }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "var(--ink-soft)",
                }}
            >
                <Icon width="18" height="18" />
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--ink-faint)",
                        textTransform: "lowercase",
                        letterSpacing: "0.02em",
                    }}
                >
                    {step.label}
                </span>
            </div>
            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    margin: 0,
                }}
            >
                {STEP_TITLES[step.id]?.title}
            </h1>
            {STEP_TITLES[step.id]?.subtitle && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1.0625rem",
                        lineHeight: 1.5,
                        color: "var(--ink-soft)",
                        maxWidth: "60ch",
                    }}
                >
                    {STEP_TITLES[step.id].subtitle}
                </p>
            )}
        </div>
    );
}

const STEP_TITLES = {
    intro: {
        title: "Empecemos por lo esencial.",
        subtitle: "Una pregunta antes de adentrarnos. Esto define las siguientes preguntas.",
    },
    business: {
        title: "¿Quién es el negocio?",
        subtitle: "Lo básico: nombre, contacto, dónde operas.",
    },
    audience: {
        title: "¿Para quién es esta web?",
        subtitle: "Cuanto más concreto el perfil, más precisas las decisiones de diseño.",
    },
    goals: {
        title: "¿Qué define el éxito?",
        subtitle: "Lo que la web debe lograr en los próximos 30 a 90 días.",
    },
    voice: {
        title: "¿Cómo suena tu marca?",
        subtitle: "Voz, valores, personalidad. Lo que diferencia a un párrafo tuyo de uno genérico.",
    },
    visual: {
        title: "¿Cómo se siente?",
        subtitle: "Mood, dirección visual, qué no quieres ver.",
    },
    identity: {
        title: "¿Qué traes ya?",
        subtitle: "Assets existentes, paleta direccional, referencias.",
    },
    work: {
        title: "Tu trabajo.",
        subtitle: "Lo que muestras, lo que vendes, lo que cuenta tu historia.",
    },
    structure: {
        title: "¿Qué necesita la web?",
        subtitle: "Secciones, animación, impacto general.",
    },
    technical: {
        title: "Detalles técnicos.",
        subtitle: "Dominio, integraciones, accesibilidad, fechas.",
    },
};

// ── Step Content (per step) ───────────────────────────────────────
function StepContent({ step, data, update, updateMany, errors }) {
    switch (step.id) {
        case "intro":
            return <IntroStep data={data} update={update} errors={errors} />;
        case "business":
            return <BusinessStep data={data} update={update} errors={errors} />;
        case "audience":
            return <AudienceStep data={data} update={update} />;
        case "goals":
            return <GoalsStep data={data} update={update} />;
        case "voice":
            return <VoiceStep data={data} update={update} />;
        case "visual":
            return <VisualStep data={data} update={update} updateMany={updateMany} />;
        case "identity":
            return <IdentityStep data={data} update={update} updateMany={updateMany} />;
        case "work":
            return <WorkStep data={data} update={update} />;
        case "structure":
            return <StructureStep data={data} update={update} />;
        case "technical":
            return <TechnicalStep data={data} update={update} />;
        default:
            return null;
    }
}

// ── Step: Intro ───────────────────────────────────────────────────
function IntroStep({ data, update, errors }) {
    return (
        <Field
            label="¿Cómo describirías mejor lo que haces?"
            hint="Adapta las siguientes preguntas al perfil correcto."
            error={errors.clientType}
            required
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                {CLIENT_TYPES.map((ct) => {
                    const Icon = getIcon(ct.iconName);
                    const isSelected = data.clientType === ct.id;
                    return (
                        <button
                            key={ct.id}
                            type="button"
                            onClick={() => update("clientType", ct.id)}
                            aria-pressed={isSelected}
                            style={{
                                appearance: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                padding: "20px 18px",
                                background: isSelected ? "var(--signal)" : "transparent",
                                color: isSelected ? "#ffffff" : "var(--ink)",
                                border: `1px solid ${isSelected ? "var(--signal)" : "var(--rule)"}`,
                                borderRadius: "2px",
                                textAlign: "left",
                                cursor: "pointer",
                                transition:
                                    "background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)",
                                minHeight: "72px",
                            }}
                            onMouseEnter={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = "var(--paper-tint)";
                                    e.currentTarget.style.borderColor = "var(--ink)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.borderColor = "var(--rule)";
                                }
                            }}
                        >
                            <Icon width="22" height="22" />
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "1rem",
                                        fontWeight: 500,
                                        marginBottom: "4px",
                                    }}
                                >
                                    {ct.label}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.875rem",
                                        lineHeight: 1.4,
                                        opacity: 0.7,
                                    }}
                                >
                                    {ct.desc}
                                </div>
                            </div>
                            {isSelected && <Icons.IconCheck width="16" height="16" />}
                        </button>
                    );
                })}
            </div>
        </Field>
    );
}

// ── Step: Business ────────────────────────────────────────────────
function BusinessStep({ data, update, errors }) {
    return (
        <Stack>
            <Field label="Nombre del negocio o tu nombre" required error={errors.businessName} htmlFor="businessName">
                <TextInput
                    id="businessName"
                    value={data.businessName}
                    onChange={(v) => update("businessName", v)}
                    placeholder="Ej: Estudio Atlas"
                />
            </Field>
            <Field label="Tagline o subtítulo" hint="Una línea. Lo que dices cuando alguien pregunta qué haces.">
                <TextInput
                    value={data.tagline}
                    onChange={(v) => update("tagline", v)}
                    placeholder="Ej: Storytelling visual para marcas"
                />
            </Field>
            <Field label="Email" required error={errors.email} htmlFor="email">
                <TextInput
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(v) => update("email", v)}
                    placeholder="hola@ejemplo.com"
                />
            </Field>
            <Field label="WhatsApp" hint="Opcional. Para que coordinemos rápido si hace falta.">
                <TextInput
                    value={data.whatsapp}
                    onChange={(v) => update("whatsapp", v)}
                    placeholder="+1 (809) 000-0000"
                />
            </Field>
            <Field label="Ubicación" hint="Ciudad, país. Define horario y mercado primario.">
                <TextInput
                    value={data.location}
                    onChange={(v) => update("location", v)}
                    placeholder="Santo Domingo, RD"
                />
            </Field>
            <Field label="Idioma del sitio" hint="¿Español, inglés, ambos?">
                <TextInput
                    value={data.language}
                    onChange={(v) => update("language", v)}
                    placeholder="Español + inglés"
                />
            </Field>
            <Field label="URL actual" error={errors.currentUrl} hint="Si ya tienes sitio, pégalo.">
                <TextInput
                    value={data.currentUrl}
                    onChange={(v) => update("currentUrl", v)}
                    placeholder="https://..."
                />
            </Field>
            <Field label="Años activo" hint="Para entender el contexto de marca.">
                <TextInput
                    value={data.yearsRunning}
                    onChange={(v) => update("yearsRunning", v)}
                    placeholder="Ej: 8 años / Recién empezando"
                />
            </Field>
        </Stack>
    );
}

// ── Step: Audience ────────────────────────────────────────────────
function AudienceStep({ data, update }) {
    return (
        <Stack>
            <Field label="¿A quién le hablas?" hint="Elige los que aplican. Tu mejor cliente real, no aspiracional.">
                <ChipGroup
                    options={OPTIONS.targetTypes}
                    value={data.targetTypes || []}
                    onChange={(v) => update("targetTypes", v)}
                    multi
                />
            </Field>
            <Field label="Cliente ideal en concreto" hint="Si pudieras clonar a un cliente perfecto, ¿quién sería? Edad, contexto, lo que valora.">
                <TextArea
                    value={data.idealClient}
                    onChange={(v) => update("idealClient", v)}
                    placeholder="Ej: Dueña de un estudio de yoga, 38, valora la curaduría sobre el marketing agresivo. Encuentra negocios por referidos."
                    rows={3}
                />
            </Field>
            <Field label="Mercado(s)">
                <ChipGroup
                    options={OPTIONS.markets}
                    value={data.markets || []}
                    onChange={(v) => update("markets", v)}
                    multi
                />
            </Field>
            <Field label="¿Cómo te encuentran y deciden?" hint="¿Por referido? ¿Búsqueda? ¿Qué los hace pasar de visitante a cliente?">
                <TextArea
                    value={data.decisionDrivers}
                    onChange={(v) => update("decisionDrivers", v)}
                    placeholder="Ej: Casi todo es referido. Cuando llegan al sitio ya saben que somos buenos, vienen a confirmar."
                    rows={3}
                />
            </Field>
            <Field label="Contexto típico de uso" hint="¿Dónde está tu visitante cuando entra al sitio? Define jerarquía y density.">
                <ChipGroup
                    options={OPTIONS.usageContext}
                    value={data.usageContext || []}
                    onChange={(v) => update("usageContext", v)}
                    multi
                />
            </Field>
        </Stack>
    );
}

// ── Step: Goals ───────────────────────────────────────────────────
function GoalsStep({ data, update }) {
    const hasDepth = !!(data.success30d || data.success90d || data.problemSolved || data.currentFrustration || data.competitors);
    const [expanded, setExpanded] = useState(hasDepth);

    return (
        <Stack>
            <Field label="Objetivos principales" hint="Elige los 3 más importantes.">
                <ChipGroup
                    options={OPTIONS.goals}
                    value={data.goals || []}
                    onChange={(v) => update("goals", v)}
                    multi
                    max={3}
                />
            </Field>
            <Field label="Acción primaria del sitio" hint="El único botón que importa. Si solo pudieras tener uno, ¿cuál sería?">
                <TextInput
                    value={data.mainCta}
                    onChange={(v) => update("mainCta", v)}
                    placeholder="Ej: Solicitar presupuesto / Agendar llamada / Ver proyecto"
                />
            </Field>

            {/* Accordion — campos opcionales de profundidad estratégica */}
            <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "4px" }}>
                <button
                    type="button"
                    onClick={() => setExpanded((x) => !x)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        background: "transparent",
                        border: 0,
                        padding: "12px 0",
                        cursor: "pointer",
                        textAlign: "left",
                    }}
                >
                    <span style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--ink-soft)",
                        flex: 1,
                    }}>
                        Profundizar en objetivos
                    </span>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8125rem",
                        color: "var(--ink-faint)",
                        lineHeight: 1,
                        userSelect: "none",
                    }}>
                        {expanded ? "−" : "+"}
                    </span>
                </button>

                {expanded && (
                    <Stack style={{ paddingBottom: "4px" }}>
                        <Field label="Éxito en 30 días" hint="Concreto. Métrica observable.">
                            <TextInput
                                value={data.success30d}
                                onChange={(v) => update("success30d", v)}
                                placeholder="Ej: 3 leads cualificados por semana"
                            />
                        </Field>
                        <Field label="Éxito en 90 días">
                            <TextInput
                                value={data.success90d}
                                onChange={(v) => update("success90d", v)}
                                placeholder="Ej: 2 proyectos cerrados, 1 propuesta alta en negociación"
                            />
                        </Field>
                        <Field label="Problema real que resuelves" hint="Sin marketing speak. ¿Qué frustración tiene tu cliente que tu negocio resuelve?">
                            <TextArea
                                value={data.problemSolved}
                                onChange={(v) => update("problemSolved", v)}
                                placeholder="Ej: La mayoría de productoras venden velocidad sobre calidad. Nosotros hacemos obras que combinan ambas sin sacrificar ninguna."
                                rows={3}
                            />
                        </Field>
                        <Field label="Mayor frustración con la presencia actual" hint="¿Qué te molesta de cómo te ven hoy online?">
                            <TextArea
                                value={data.currentFrustration}
                                onChange={(v) => update("currentFrustration", v)}
                                placeholder="Ej: El sitio actual nos hace ver más chicos de lo que somos."
                                rows={2}
                            />
                        </Field>
                        <Field label="Competidores que miras" hint="2 o 3 URLs, con una frase sobre qué hacen bien o mal.">
                            <TextArea
                                value={data.competitors}
                                onChange={(v) => update("competitors", v)}
                                placeholder="estudiox.com — portfolio limpio pero copy genérico"
                                rows={3}
                            />
                        </Field>
                    </Stack>
                )}
            </div>
        </Stack>
    );
}

// ── Step: Voice ───────────────────────────────────────────────────
function VoiceStep({ data, update }) {
    return (
        <Stack>
            <Field label="Tres palabras concretas que describen tu marca" hint='Físicas, no abstractas. "Cinematográfico, confiado, hecho a mano" — NO "innovador, moderno, profesional".'>
                <TextInput
                    value={data.personalityWords}
                    onChange={(v) => update("personalityWords", v)}
                    placeholder="Ej: cinematográfico, confiado, hecho a mano"
                />
            </Field>
            <Field label="Cómo habla tu marca" hint="¿En primera persona? ¿Plural? ¿Formal? Escribe una frase de ejemplo si ayuda.">
                <TextArea
                    value={data.voiceDescription}
                    onChange={(v) => update("voiceDescription", v)}
                    placeholder='Ej: Hablamos en plural. Directos, sin jerga. "Hacemos webs que importan." NO "Empoderamos negocios disruptivos".'
                    rows={3}
                />
            </Field>
            <Field label="Cómo NO debe sonar" hint="Definir por negación a veces es más claro.">
                <TextArea
                    value={data.antiVoice}
                    onChange={(v) => update("antiVoice", v)}
                    placeholder="Ej: Sin jerga corporativa, sin entusiasmo forzado, sin emojis."
                    rows={2}
                />
            </Field>
            <Field label="Valores que guían tu trabajo" hint="3-5. Lo que te hace decir 'no' a un cliente o proyecto.">
                <TextArea
                    value={data.values}
                    onChange={(v) => update("values", v)}
                    placeholder="Ej: Curaduría sobre completitud. Honestidad de timeline. Calidad sobre velocidad."
                    rows={3}
                />
            </Field>
            <Field label="Elevator pitch" hint="Una frase para que recordemos quién sos cuando releamos esto en 2 semanas.">
                <TextArea
                    value={data.elevatorPitch}
                    onChange={(v) => update("elevatorPitch", v)}
                    placeholder="Ej: Producimos contenido cinematográfico para marcas que no quieren parecer publicidad."
                    rows={2}
                />
            </Field>
        </Stack>
    );
}

// ── Step: Visual ──────────────────────────────────────────────────
function VisualStep({ data, update }) {
    return (
        <Stack>
            <Field
                label="Mood physical"
                hint="Si el sitio fuera un lugar real, ¿cómo se sentiría caminar por ahí?"
            >
                <TextArea
                    value={data.moodAdjectives}
                    onChange={(v) => update("moodAdjectives", v)}
                    placeholder="Ej: Un estudio de fotografía amplio con paredes de cemento crudo, luz natural pero filtrada, piso de madera vieja."
                    rows={3}
                />
            </Field>

            <Field
                label="Mood board"
                hint="Elige hasta 2 sitios que se acerquen al estilo visual que quieres. Son referencias, no el destino."
            >
                <MoodBoardPicker
                    value={data.moodBoardPicks || []}
                    onChange={(v) => update("moodBoardPicks", v)}
                />
            </Field>

            <Field label="Nivel de impacto" hint="1 sobrio (Stripe). 10 cinematográfico-bold (Buck).">
                <ImpactSlider value={data.impactLevel ?? 5} onChange={(v) => update("impactLevel", v)} />
            </Field>

            <Field label="Tema visual">
                <ChipGroup
                    options={["Light", "Dark", "Mixto"]}
                    value={data.theme}
                    onChange={(v) => update("theme", v)}
                />
            </Field>

            <Field label="Nivel de animación">
                <ChipGroup
                    options={["Cero / minimal", "Sutil / funcional", "Generoso / scroll-driven", "Cinematográfico / hero-driven"]}
                    value={data.animationLevel}
                    onChange={(v) => update("animationLevel", v)}
                />
            </Field>

            <Field label="Dirección de imagery">
                <ChipGroup
                    options={OPTIONS.imageryDirection}
                    value={data.imageryDirection || []}
                    onChange={(v) => update("imageryDirection", v)}
                    multi
                />
            </Field>

            <Field label="Anti-patrones explícitos" hint="Lo que NO quieres ver en tu sitio.">
                <ChipGroup
                    options={ANTI_PATTERNS.map((a) => a.label)}
                    value={data.antiPatterns || []}
                    onChange={(v) => update("antiPatterns", v)}
                    multi
                />
            </Field>

            <Field label="Cualquier otra cosa que NO quieres" hint="Texto libre. Sé específico.">
                <TextArea
                    value={data.dontWant}
                    onChange={(v) => update("dontWant", v)}
                    placeholder="Ej: Nada de carruseles. Sin sliders. Sin newsletter modal al cargar."
                    rows={2}
                />
            </Field>
        </Stack>
    );
}

// ── Step: Identity ────────────────────────────────────────────────
function IdentityStep({ data, update, updateMany }) {
    return (
        <Stack>
            <Field label="Assets que ya tienes">
                <ChipGroup
                    options={OPTIONS.existingAssets}
                    value={data.existingAssets || []}
                    onChange={(v) => update("existingAssets", v)}
                    multi
                />
            </Field>

            <Field label="Logo en alta resolución" hint="SVG preferido. PNG con fondo transparente sirve. Si tienes .ai también.">
                <FileUpload
                    files={data.logoFiles || []}
                    onChange={(v) => update("logoFiles", v)}
                    accept="logo"
                    maxFiles={3}
                    label="Subir logo"
                    hint="SVG / PNG / AI · máx 3 archivos · 500 MB"
                />
            </Field>

            <Field label="Brandbook o guía de marca" hint="PDF si lo tienes. Paleta, manual, guía de uso. Opcional.">
                <FileUpload
                    files={data.brandFiles || []}
                    onChange={(v) => update("brandFiles", v)}
                    accept="document"
                    maxFiles={2}
                    label="Subir brandbook"
                    hint="PDF · máx 2 archivos · 500 MB"
                />
            </Field>

            <Field label="Referencias de webs que admiran" hint="2-4 URLs. Una línea sobre QUÉ les gusta de cada una.">
                <TextArea
                    value={data.refLikes}
                    onChange={(v) => update("refLikes", v)}
                    placeholder={"buck.co — la pauta de motion y tipografía a escala\nstudio.design — la densidad y el uso del whitespace"}
                    rows={4}
                />
            </Field>

            <Field label="Paleta o imágenes de referencia de color" hint="Capturas, fotos, moodboard — lo que represente la dirección de color. Opcional.">
                <FileUpload
                    files={data.colorRefFiles || []}
                    onChange={(v) => update("colorRefFiles", v)}
                    accept="image"
                    maxFiles={5}
                    label="Subir imágenes de referencia"
                    hint="PNG / JPG / WebP · máx 5 archivos · 500 MB"
                />
            </Field>

            <Field
                label="Paleta direccional en HEX"
                hint="Si tienes colores definidos, pégalos acá. HEX o descripción libre."
            >
                <TextInput
                    value={data.colorPalette?.custom?.[0] || ""}
                    onChange={(v) =>
                        updateMany({ colorPalette: { ...data.colorPalette, custom: [v], mode: "manual" } })
                    }
                    placeholder="Ej: #0A0A0A negro tinta + #F7F4EE crema + #C9A84C dorado"
                />
            </Field>

            <Field
                label="Tipografía direccional"
                hint="Nombra fuentes que admiras o el estilo tipográfico que quieres. NO Inter."
            >
                <TextInput
                    value={data.fontsLiked}
                    onChange={(v) => update("fontsLiked", v)}
                    placeholder="Ej: GT Sectra display + Söhne body / algo muy distinto a Inter"
                />
            </Field>

            <Field label="Anclas de identidad" hint="¿Qué de cómo te presentas hoy definitivamente NO quieres cambiar?">
                <TextArea
                    value={data.identityAnchors}
                    onChange={(v) => update("identityAnchors", v)}
                    placeholder="Ej: El logotipo y la paleta son intocables. El tono también."
                    rows={2}
                />
            </Field>

            <Field label="Anti-referencias" hint="2-4 URLs que NO quieres parecer. Una línea sobre POR QUÉ.">
                <TextArea
                    value={data.refDislikes}
                    onChange={(v) => update("refDislikes", v)}
                    placeholder="ejemplosaas.com — todo Inter + gradientes morados, look genérico"
                    rows={3}
                />
            </Field>
        </Stack>
    );
}

// ── Step: Work ────────────────────────────────────────────────────
function WorkStep({ data, update }) {
    const t = data.clientType;
    return (
        <Stack>
            {(t === "creative" || t === "agency") && (
                <Field label="Plataforma de video" hint="Para hero / portfolio video.">
                    <ChipGroup
                        options={["Vimeo", "YouTube", "Self-hosted", "Mux", "No aplica"]}
                        value={data.videoPlatform}
                        onChange={(v) => update("videoPlatform", v)}
                    />
                </Field>
            )}

            {(t === "creative" || t === "agency" || t === "business") && (
                <Field label="Top proyectos a destacar" hint="3-6 piezas. Una línea por proyecto: nombre · cliente · año · URL.">
                    <TextArea
                        value={data.topProjects}
                        onChange={(v) => update("topProjects", v)}
                        placeholder={"Nike Verano 2024 · Nike RD · 2024 · vimeo.com/xxx\nRebrand La Plaza · Restaurant XYZ · 2023 · /work/laplaza"}
                        rows={5}
                    />
                </Field>
            )}

            {(t === "creative" || t === "agency" || t === "business") && (
                <Field label="Imágenes de portfolio">
                    <FileUpload
                        files={data.portfolioFiles || []}
                        onChange={(v) => update("portfolioFiles", v)}
                        accept="image"
                        maxFiles={6}
                        label="Subir imágenes"
                        hint="Máx 6 archivos · 10 MB cada uno"
                    />
                </Field>
            )}

            {(t === "personal" || t === "business" || t === "agency") && (
                <Field label="Servicios" hint="Una línea por servicio. Lo más concreto posible.">
                    <TextArea
                        value={data.services}
                        onChange={(v) => update("services", v)}
                        placeholder={"Diseño web custom\nIdentidad de marca\nFotografía editorial"}
                        rows={4}
                    />
                </Field>
            )}

            {(t === "personal" || t === "business" || t === "agency") && (
                <Field label="Cómo presentas cada servicio">
                    <ChipGroup
                        options={["Solo nombre y descripción corta", "Descripción detallada con beneficios", "Paquetes con precio público", "Procesos paso a paso"]}
                        value={data.servicePresentation}
                        onChange={(v) => update("servicePresentation", v)}
                    />
                </Field>
            )}

            {(t === "personal" || t === "business" || t === "agency") && (
                <Field label="Elementos de credibilidad a mostrar">
                    <ChipGroup
                        options={OPTIONS.credibility}
                        value={data.credibility || []}
                        onChange={(v) => update("credibility", v)}
                        multi
                    />
                </Field>
            )}

            <Field label="Statement / hero phrase" hint="Una frase que captura quién sos. Va en el hero si funciona.">
                <TextArea
                    value={data.statement}
                    onChange={(v) => update("statement", v)}
                    placeholder="Ej: Hacemos que las marcas parezcan lo que ya son: extraordinarias."
                    rows={2}
                />
            </Field>

            <Field label="Bio corta" hint="2-3 líneas. La que usan en pitch decks.">
                <TextArea
                    value={data.shortBio}
                    onChange={(v) => update("shortBio", v)}
                    placeholder="Ej: Equipo de 4 con 8 años haciendo branding para restaurantes en LATAM."
                    rows={3}
                />
            </Field>

            <Field label="Foto / retratos del equipo">
                <FileUpload
                    files={data.profileFiles || []}
                    onChange={(v) => update("profileFiles", v)}
                    accept="image"
                    maxFiles={4}
                    label="Subir fotos"
                    hint="Máx 4 archivos · 10 MB"
                />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
                <Field label="Años de experiencia">
                    <TextInput value={data.yearsExp} onChange={(v) => update("yearsExp", v)} placeholder="8+" />
                </Field>
                <Field label="Proyectos">
                    <TextInput value={data.projectCount} onChange={(v) => update("projectCount", v)} placeholder="150+" />
                </Field>
                <Field label="Países / mercados">
                    <TextInput value={data.countries} onChange={(v) => update("countries", v)} placeholder="5" />
                </Field>
            </div>

            <Field label="Premios o reconocimientos">
                <TextInput
                    value={data.awards}
                    onChange={(v) => update("awards", v)}
                    placeholder="Ej: Best of Behance 2023, Premio Latinoamericano de Diseño"
                />
            </Field>
        </Stack>
    );
}

// ── Step: Structure ───────────────────────────────────────────────
function StructureStep({ data, update }) {
    return (
        <Stack>
            <Field label="Secciones que quieres" hint="Marca las que aplican. Podemos quitar después.">
                <ChipGroup
                    options={OPTIONS.sections}
                    value={data.sections || []}
                    onChange={(v) => update("sections", v)}
                    multi
                />
            </Field>
        </Stack>
    );
}

// ── Step: Technical ───────────────────────────────────────────────
function TechnicalStep({ data, update }) {
    return (
        <Stack>
            <Field label="Dominio" hint="El que tienes o el que vas a usar.">
                <TextInput value={data.domain} onChange={(v) => update("domain", v)} placeholder="estudioatlas.com" />
            </Field>
            <Field label="Hosting" hint="Si ya tienes contratado. Si no, lo recomendamos.">
                <TextInput
                    value={data.hosting}
                    onChange={(v) => update("hosting", v)}
                    placeholder="Ej: Vercel / Netlify / Hostinger / No tengo"
                />
            </Field>
            <Field label="Integraciones">
                <ChipGroup
                    options={OPTIONS.integrations}
                    value={data.integrations || []}
                    onChange={(v) => update("integrations", v)}
                    multi
                />
            </Field>
            <Field label="Requerimientos técnicos">
                <ChipGroup
                    options={OPTIONS.technicalReqs}
                    value={data.technicalReqs || []}
                    onChange={(v) => update("technicalReqs", v)}
                    multi
                />
            </Field>
            <Field label="Accesibilidad" hint="¿Conoces alguna necesidad específica de tu audiencia?">
                <TextArea
                    value={data.accessibilityNeeds}
                    onChange={(v) => update("accessibilityNeeds", v)}
                    placeholder="Ej: Audiencia mayor 60+, prioridad legibilidad y tamaño de texto."
                    rows={2}
                />
            </Field>
            <Field label="Notas técnicas" hint="Restricciones, integraciones complejas, anything else.">
                <TextArea
                    value={data.technicalNotes}
                    onChange={(v) => update("technicalNotes", v)}
                    placeholder="Ej: Necesitamos conectar con un CRM en Salesforce."
                    rows={3}
                />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                <Field label="Fecha de lanzamiento ideal">
                    <TextInput
                        type="date"
                        value={data.launchDate}
                        onChange={(v) => update("launchDate", v)}
                    />
                </Field>
                <Field label="Deadline de contenido">
                    <TextInput
                        type="date"
                        value={data.contentDeadline}
                        onChange={(v) => update("contentDeadline", v)}
                    />
                </Field>
            </div>
            <Field label="Redes sociales" hint="Para footer + cross-promotion.">
                <TextArea
                    value={data.socialLinks}
                    onChange={(v) => update("socialLinks", v)}
                    placeholder={"Instagram: @estudioatlas\nLinkedIn: linkedin.com/company/atlas"}
                    rows={3}
                />
            </Field>
            <Field label="Notas finales" hint="Cualquier cosa que no preguntamos pero quieres decir.">
                <TextArea
                    value={data.finalNotes}
                    onChange={(v) => update("finalNotes", v)}
                    placeholder="Ej: Tengo un video de 30s listo para hero."
                    rows={3}
                />
            </Field>
        </Stack>
    );
}

// ── Summary ───────────────────────────────────────────────────────
function Summary({ data, onEdit, onSubmit, sending, sendError }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <Reveal>
                <div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--ink-faint)",
                            textTransform: "lowercase",
                            letterSpacing: "0.02em",
                            marginBottom: "12px",
                        }}
                    >
                        resumen
                    </div>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: "-0.04em",
                            color: "var(--ink)",
                            margin: 0,
                        }}
                    >
                        {data.businessName || "Tu brief"}
                    </h1>
                    {data.tagline && (
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "1.0625rem",
                                color: "var(--ink-soft)",
                                marginTop: "12px",
                            }}
                        >
                            {data.tagline}
                        </p>
                    )}
                </div>
            </Reveal>

            <Reveal>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        padding: "20px 0",
                        borderTop: "1px solid var(--rule)",
                        borderBottom: "1px solid var(--rule)",
                    }}
                >
                    <SummaryRow label="Tipo" value={getClientTypeLabel(data.clientType)} />
                    <SummaryRow label="Audiencia" value={(data.targetTypes || []).join(", ") || "—"} />
                    <SummaryRow label="Objetivos" value={(data.goals || []).join(", ") || "—"} />
                    <SummaryRow label="Mood" value={data.moodAdjectives || "—"} />
                    <SummaryRow label="Referencias" value={(data.moodBoardPicks || []).join(", ") || "—"} />
                    <SummaryRow label="Voz" value={data.personalityWords || "—"} />
                </div>
            </Reveal>

            <Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {STEPS.map((step, idx) => (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => onEdit(idx)}
                            style={{
                                appearance: "none",
                                background: "transparent",
                                border: 0,
                                borderBottom: "1px solid var(--rule)",
                                padding: "16px 0",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                textAlign: "left",
                                transition: "color var(--duration-fast) var(--ease-out)",
                                color: "var(--ink)",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, letterSpacing: "-0.02em" }}>{STEP_TITLES[step.id]?.title}</span>
                            </span>
                            <span style={{ color: "var(--ink-soft)", display: "flex" }}>
                                <Icons.IconArrowRight width="16" height="16" />
                            </span>
                        </button>
                    ))}
                </div>
            </Reveal>

            <Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {sendError && (
                        <div
                            role="alert"
                            style={{
                                padding: "16px 20px",
                                border: "1px solid var(--danger)",
                                background: "#fff1f0",
                                color: "var(--danger)",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.9375rem",
                            }}
                        >
                            {sendError}
                        </div>
                    )}
                    <PrimaryButton
                        onClick={onSubmit}
                        disabled={sending}
                        icon={sending ? <Icons.IconLoading width="16" height="16" /> : <Icons.IconSend width="16" height="16" />}
                        style={{ alignSelf: "flex-start" }}
                    >
                        {sending ? "Enviando..." : "Enviar brief"}
                    </PrimaryButton>
                </div>
            </Reveal>
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
            <span
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--ink-faint)",
                    textTransform: "lowercase",
                    letterSpacing: "0.02em",
                    minWidth: "100px",
                }}
            >
                {label}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--ink)" }}>{value}</span>
        </div>
    );
}

// ── Thank You ─────────────────────────────────────────────────────
// ── Welcome Screen ────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1];

function WelcomeScreen({ onStart }) {
    return (
        <div
            style={{
                minHeight: "100dvh",
                background: "var(--paper)",
                color: "var(--ink)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px",
                textAlign: "center",
            }}
        >
            <div style={{ maxWidth: "560px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>

                {/* Eyebrow */}
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease, delay: 0.05 }}
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--ink-faint)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}
                >
                    Brief
                </motion.span>

                {/* Name — blur dissolve + reflejo sweep */}
                <div style={{ position: "relative", overflow: "hidden", padding: "0.15em 0.1em", margin: "-0.15em -0.1em" }}>
                    <motion.h1
                        initial={{ opacity: 0, filter: "blur(14px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.85, ease, delay: 0.12 }}
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2.75rem, 8vw, 5rem)",
                            fontWeight: 800,
                            lineHeight: 0.95,
                            letterSpacing: "-0.045em",
                            color: "var(--ink)",
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        Oscar Matos
                    </motion.h1>

                    {/* Reflejo — sweep de izquierda a derecha */}
                    <motion.div
                        initial={{ x: "-115%" }}
                        animate={{ x: "115%" }}
                        transition={{ duration: 0.72, ease: [0.4, 0, 0.2, 1], delay: 0.32 }}
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.38) 50%, transparent 85%)",
                            pointerEvents: "none",
                        }}
                    />
                </div>

                {/* Tagline + separator + description — grupo unificado */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease, delay: 0.72 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}
                >
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "1.0625rem",
                            color: "var(--ink-soft)",
                            lineHeight: 1.5,
                            margin: 0,
                        }}
                    >
                        Diseño y desarrollo web
                    </p>

                    {/* Separator — draw from left */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, ease, delay: 0.9 }}
                        style={{
                            width: "40px",
                            height: "1px",
                            background: "var(--rule)",
                            transformOrigin: "left center",
                        }}
                    />

                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "1rem",
                            color: "var(--ink-soft)",
                            lineHeight: 1.6,
                            margin: 0,
                            maxWidth: "380px",
                        }}
                    >
                        Antes de empezar a trabajar juntos, necesito entender tu proyecto. Toma unos 10 minutos.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease, delay: 1.0 }}
                >
                    <PrimaryButton
                        onClick={onStart}
                        icon={<Icons.IconArrowRight width="14" height="14" />}
                        style={{ minWidth: "180px" }}
                    >
                        Comenzar
                    </PrimaryButton>
                </motion.div>

            </div>
        </div>
    );
}

// ── Thank You Screen ──────────────────────────────────────────────
function ThankYou({ data }) {
    return (
        <div
            style={{
                minHeight: "100dvh",
                background: "var(--paper)",
                color: "var(--ink)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px clamp(16px, 5vw, 40px)",
                textAlign: "center",
            }}
        >
            <div style={{ maxWidth: "560px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
                <Reveal>
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--ink-faint)",
                            textTransform: "lowercase",
                            letterSpacing: "0.02em",
                        }}
                    >
                        enviado
                    </span>
                </Reveal>

                <Reveal>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                            fontWeight: 800,
                            lineHeight: 0.95,
                            letterSpacing: "-0.045em",
                            color: "var(--ink)",
                            margin: 0,
                        }}
                    >
                        Gracias{data.businessName ? `, ${data.businessName}` : ""}.
                    </h1>
                </Reveal>

                <Reveal>
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "1.0625rem",
                            color: "var(--ink-soft)",
                            lineHeight: 1.5,
                            margin: 0,
                            maxWidth: "420px",
                        }}
                    >
                        Recibí tu brief. Te escribo en las próximas 48 horas con un plan inicial.
                    </p>
                </Reveal>

                <Reveal>
                    <div
                        style={{
                            marginTop: "16px",
                            paddingTop: "32px",
                            borderTop: "1px solid var(--rule)",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.25rem",
                                fontWeight: 700,
                                letterSpacing: "-0.03em",
                                color: "var(--ink)",
                            }}
                        >
                            Oscar Matos
                        </span>
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "var(--ink-faint)",
                                letterSpacing: "0.02em",
                                textTransform: "lowercase",
                            }}
                        >
                            diseño y desarrollo web
                        </span>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}

// ── Bottom Nav ────────────────────────────────────────────────────
function BottomNav({ canBack, onBack, onNext, isLast, showSummary }) {
    return (
        <nav
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "var(--paper)",
                borderTop: "1px solid var(--rule)",
                padding: "16px 24px",
                zIndex: 10,
            }}
        >
            <div
                style={{
                    maxWidth: "720px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                }}
            >
                {canBack ? (
                    <SecondaryButton onClick={onBack} icon={<Icons.IconArrowLeft width="14" height="14" />}>
                        Volver
                    </SecondaryButton>
                ) : (
                    <span />
                )}
                {onNext && (
                    <PrimaryButton onClick={onNext} icon={<Icons.IconArrowRight width="14" height="14" />}>
                        {isLast ? "Ver resumen" : "Siguiente"}
                    </PrimaryButton>
                )}
            </div>
        </nav>
    );
}

// ── Helpers ───────────────────────────────────────────────────────
function Stack({ children, gap = "32px" }) {
    return <div style={{ display: "flex", flexDirection: "column", gap }}>{children}</div>;
}

function Placeholder({ children }) {
    return (
        <div
            style={{
                padding: "12px 16px",
                border: "1px dashed var(--rule)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--ink-faint)",
                marginBottom: "8px",
            }}
        >
            ◐ {children}
        </div>
    );
}

