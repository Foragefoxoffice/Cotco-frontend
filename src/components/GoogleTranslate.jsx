import { useEffect, useRef } from "react";

export default function GoogleTranslate({ defaultLang = "en" }) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // ---- helpers -----------------------------------------------------------
    const setHtmlLang = (lng) => {
      try { document.documentElement.lang = lng; } catch {}
    };

    const setCookie = (name, value, opts = {}) => {
      const parts = [`${name}=${value}`, "path=/", "SameSite=Lax", `max-age=${60 * 60 * 24 * 365}`];
      if (opts.domain) parts.push(`domain=${opts.domain}`);
      document.cookie = parts.join("; ");
    };

    const setGoogTransCookies = (pair) => {
      // pair format: "/en/vi" or "/auto/en"
      const host = window.location.hostname;
      // for localhost, omit domain; for real hosts, set both bare + dot-domain
      const domains = [null];
      if (host.includes(".")) domains.push(`.${host}`);

      domains.forEach((d) => {
        setCookie("googtrans", pair, d ? { domain: d } : {});
        setCookie("googtrans", pair); // ensure default cookie too
      });
    };

    const trySelectChange = (lng) => {
      const sel = document.querySelector("select.goog-te-combo");
      if (!sel) return false;
      sel.value = lng;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      sel.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    };

    // Expose a robust setter the toggle can call
    window.__setTranslateLanguage = (lng, { reloadIfNeeded = true } = {}) => {
      if (!lng) return;
      try { localStorage.setItem("preferred_lang", lng); } catch {}
      setHtmlLang(lng);

      // set cookie Google uses
      const pair = lng === "en" ? "/auto/en" : "/en/vi";
      setGoogTransCookies(pair);

      // try the hidden select with retries (up to ~4s)
      let attempts = 0;
      const tick = () => {
        attempts += 1;
        const ok = trySelectChange(lng);
        if (ok) return;
        if (attempts < 40) {
          setTimeout(tick, 100);
        } else if (reloadIfNeeded) {
          // final fallback: soft reload so widget reads cookie and applies
          window.location.reload();
        }
      };
      tick();
    };

    // ---- init Google widget -----------------------------------------------
    const init = () => {
      if (window._gtInited) return;
      window._gtInited = true;

      /* global google */
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,vi",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_container"
      );

      // apply saved/default language
      const saved = localStorage.getItem("preferred_lang") || defaultLang || "en";
      if (saved && saved !== "en") {
        setTimeout(() => {
          window.__setTranslateLanguage && window.__setTranslateLanguage(saved, { reloadIfNeeded: false });
        }, 200);
      } else {
        setHtmlLang("en");
      }

      // re-apply on SPA route changes (best-effort)
      const reapply = () => {
        const lng = localStorage.getItem("preferred_lang") || "en";
        window.__setTranslateLanguage && window.__setTranslateLanguage(lng, { reloadIfNeeded: false });
      };
      window.addEventListener("popstate", reapply);
      window.addEventListener("hashchange", reapply);
    };

    // load Google script once
    if (!window.google || !window.google.translate) {
      window.googleTranslateElementInit = init;
      const s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      s.onerror = () => console.error("[i18n] Google Translate script failed to load");
      document.body.appendChild(s);
    } else {
      init();
    }
  }, [defaultLang]);

  // NOTE: Do not use display:none; the widget must render the <select>.
  return (
    <div
      id="google_translate_container"
      aria-hidden="true"
      style={{
        position: "fixed",
        width: 1,
        height: 1,
        overflow: "hidden",
        bottom: -10,
        right: -10,
        opacity: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
