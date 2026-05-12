import { motion, AnimatePresence } from "motion/react";

// Cinematic step transition: el step saliente hace exit-left + fade,
// el entrante hace enter-from-right + fade. Children dentro
// pueden tener stagger reveal usando MotionReveal abajo.

const STEP_DURATION = 0.65;
const REVEAL_DURATION = 0.5;
const REVEAL_STAGGER = 0.07;

const stepVariants = {
    enter: {
        opacity: 0,
        x: 32,
        filter: "blur(2px)",
    },
    active: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
            duration: STEP_DURATION,
            ease: [0.16, 1, 0.3, 1],
            when: "beforeChildren",
            staggerChildren: REVEAL_STAGGER,
        },
    },
    exit: {
        opacity: 0,
        x: -24,
        filter: "blur(1px)",
        transition: {
            duration: 0.32,
            ease: [0.36, 0, 0.66, -0.56],
        },
    },
};

export function MotionStep({ stepId, children }) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={stepId}
                variants={stepVariants}
                initial="enter"
                animate="active"
                exit="exit"
                style={{ willChange: "transform, opacity" }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Drop-in reveal item: usar como wrapper de elementos que deben aparecer
// secuencialmente dentro de un MotionStep.
const revealVariants = {
    enter: { opacity: 0, y: 14 },
    active: {
        opacity: 1,
        y: 0,
        transition: {
            duration: REVEAL_DURATION,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export function Reveal({ children, as: As = "div", style, ...rest }) {
    return (
        <motion.div variants={revealVariants} style={style} {...rest}>
            {children}
        </motion.div>
    );
}
