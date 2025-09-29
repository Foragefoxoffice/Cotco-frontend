"use client";
import React, { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * TitleAnimation
 * Animates words instead of splitting letters
 */
export default function TitleAnimation({
  text,
  as: Tag = "h2",
  align = "left",
  mdAlign,
  lgAlign,
  xlAlign,
  delay = 0,
  stagger = 0.06,
  once = true,
  direction = "ltr",
  offsetY = 30,
  offsetX = 8,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  // Normalize to array of lines
  const lines = useMemo(
    () => (Array.isArray(text) ? text : String(text).split("\n")).filter(Boolean),
    [text]
  );

  // map "left|center|right" or pass-through Tailwind text-* classes
  const mapAlign = (val, pref = "") => {
    if (!val) return "";
    if (typeof val === "string" && /text-(left|center|right)/.test(val)) return val;
    const map = { left: "text-left", center: "text-center", right: "text-right" };
    return pref + (map[val] || "text-left");
  };

  const alignClasses = [
    mapAlign(align),
    mdAlign && mapAlign(mdAlign, "md:"),
    lgAlign && mapAlign(lgAlign, "lg:"),
    xlAlign && mapAlign(xlAlign, "xl:"),
  ]
    .filter(Boolean)
    .join(" ");

  const baseTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] };

  // Flatten all words into a list so we can assign staggered indices
  const words = useMemo(() => {
    const out = [];
    lines.forEach((line, li) => {
      const tokens = line.split(/(\s+)/); // keep spaces
      tokens.forEach((tok, ti) => {
        if (/^\s+$/.test(tok)) {
          out.push({ type: "space", key: `${li}-sp-${ti}` });
        } else {
          out.push({ type: "word", word: tok, key: `${li}-${ti}`, li, ti });
        }
      });
    });
    return out;
  }, [lines]);

  // Assign sequence index for staggered animation
  const indexedWords = useMemo(() => {
    const onlyWords = words.filter((w) => w.type === "word");
    const total = onlyWords.length;
    let running = 0;
    return words.map((w) => {
      if (w.type === "space") return { ...w, seq: null };
      const seq = direction === "rtl" ? total - 1 - running : running;
      running++;
      return { ...w, seq };
    });
  }, [words, direction]);

  return (
    <Tag
      ref={ref}
      className={[
        "font-semibold leading-[1.05] tracking-tight",
        "motion-reduce:transform-none motion-reduce:transition-none",
        alignClasses,
        className,
      ].join(" ")}
    >
      {lines.map((line, li) => {
        const tokens = indexedWords.filter((w) => w.li === li || w.type === "space");

        return (
          <span key={li} className="block">
            {tokens.map((w) => {
              if (w.type === "space") {
                return <span key={w.key}>&nbsp;</span>;
              }

              const startX = direction === "rtl" ? offsetX : 0;

              return (
                <span key={w.key} className="inline-block overflow-hidden align-baseline">
                  <motion.span
                    initial={{
                      y: `${offsetY}%`,
                      x: startX,
                      opacity: 0,
                      filter: "blur(3px)",
                    }}
                    animate={
                      inView
                        ? { y: "0%", x: 0, opacity: 1, filter: "blur(0px)" }
                        : { y: `${offsetY}%`, x: startX, opacity: 0, filter: "blur(3px)" }
                    }
                    transition={{
                      ...baseTransition,
                      delay: delay + (w.seq ?? 0) * stagger,
                    }}
                    className="inline-block will-change-transform"
                  >
                    {w.word}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
