import React, { useEffect, useState } from "react";

/* ---------- Inline SVGs (round flags) ---------- */
const FlagGB = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <clipPath id="gb_clip"><circle cx="12" cy="12" r="12" /></clipPath>
    </defs>
    <g clipPath="url(#gb_clip)">
      <rect width="24" height="24" fill="#012169" />
      {/* Diagonals - white then red */}
      <line x1="0" y1="0" x2="24" y2="24" stroke="#FFF" strokeWidth="6" />
      <line x1="24" y1="0" x2="0" y2="24" stroke="#FFF" strokeWidth="6" />
      <line x1="0" y1="0" x2="24" y2="24" stroke="#C8102E" strokeWidth="3" />
      <line x1="24" y1="0" x2="0" y2="24" stroke="#C8102E" strokeWidth="3" />
      {/* Cross - white then red */}
      <line x1="12" y1="0" x2="12" y2="24" stroke="#FFF" strokeWidth="6" />
      <line x1="0" y1="12" x2="24" y2="12" stroke="#FFF" strokeWidth="6" />
      <line x1="12" y1="0" x2="12" y2="24" stroke="#C8102E" strokeWidth="4" />
      <line x1="0" y1="12" x2="24" y2="12" stroke="#C8102E" strokeWidth="4" />
    </g>
  </svg>
);

const FlagVN = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <clipPath id="vn_clip"><circle cx="12" cy="12" r="12" /></clipPath>
    </defs>
    <g clipPath="url(#vn_clip)">
      <rect width="24" height="24" fill="#DA251D" />
      {/* 5-point star */}
      <polygon
        fill="#FFCE00"
        points="
          12.000,4.500 13.763,9.573 19.133,9.682 14.853,12.927
          16.408,18.068 12.000,15.000 7.592,18.068 9.147,12.927
          4.867,9.682 10.237,9.573
        "
      />
    </g>
  </svg>
);

/* ---------- Toggle Component ---------- */
export default function TranslateToggle() {
  const [active, setActive] = useState(() => {
    try { return localStorage.getItem("preferred_lang") || "en"; } catch { return "en"; }
  });

  const setLang = (lng) => {
    setActive(lng);
    if (typeof window !== "undefined") {
      try { localStorage.setItem("preferred_lang", lng); } catch {}
      document.body.classList.toggle("vi-mode", lng === "vi");
      window.dispatchEvent(new CustomEvent("languageChange", { detail: { lang: lng } }));
      if (window.__setTranslateLanguage) {
        window.__setTranslateLanguage(lng);
      } else {
        setTimeout(() => window.__setTranslateLanguage && window.__setTranslateLanguage(lng), 400);
      }
    }
  };

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("preferred_lang")) || "en";
    setActive(saved);
    if (typeof window !== "undefined") {
      document.body.classList.toggle("vi-mode", saved === "vi");
    }
    const onStorage = (e) => {
      if (e.key === "preferred_lang") {
        const newLang = e.newValue || "en";
        setActive(newLang);
        document.body.classList.toggle("vi-mode", newLang === "vi");
        window.dispatchEvent(new CustomEvent("languageChange", { detail: { lang: newLang } }));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const LANGS = [
    { id: "en", label: "English", Icon: FlagGB }, // swap to US: make a FlagUS and use here
    { id: "vi", label: "Tiếng Việt", Icon: FlagVN },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
      {LANGS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setLang(id)}
            aria-pressed={isActive}
            title={label}
            className={[
              "h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center",
              "transition ring-1 ring-black/5",
              isActive ? "bg-white shadow scale-[1.06]" : "hover:bg-white/70"
            ].join(" ")}
          >
            <Icon size={20} />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
