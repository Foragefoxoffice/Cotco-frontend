// components/animations/SlideIn.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const AXIS = { left: "x", right: "x", up: "y", down: "y" };

export default function SlideIn({
  direction = "left",
  offset = 100,
  children,
  className = "",       // applied to wrapper
  innerClassName = "",  // applied to motion div
  once = true,
  amount = 0.3,
  duration = 0.6,
  ease = "easeOut",
  clip = true,          // clip overflow by default (fixes scrollbars)
}) {
  const prefersReduced = useReducedMotion();
  const axis = AXIS[direction] || "x";

  const initial = prefersReduced
    ? { opacity: 1, x: 0, y: 0 }
    : direction === "left"
    ? { opacity: 0, x: -offset }
    : direction === "right"
    ? { opacity: 0, x: offset }
    : direction === "up"
    ? { opacity: 0, y: offset }
    : direction === "down"
    ? { opacity: 0, y: -offset }
    : { opacity: 0 };

  // Only clip the axis we animate so shadows/other axis are unaffected
  const wrapperStyle = {};
  if (clip) {
    if (axis === "x") wrapperStyle.overflowX = "hidden";
    if (axis === "y") wrapperStyle.overflowY = "hidden";
  }

  return (
    <div className={className} style={{ display: "block", ...wrapperStyle }}>
      <motion.div
        className={innerClassName}
        initial={initial}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once, amount }}
        transition={{ duration, ease }}
        style={{ willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
