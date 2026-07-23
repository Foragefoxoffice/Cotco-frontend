import React, { useEffect, useState } from "react";
import { Title, Meta } from "react-head";

export default function SEO({ seoMeta, defaultTitle }) {
  const [activeLang, setActiveLang] = useState("en");

  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const savedLang = localStorage.getItem("preferred_lang");
    if (savedLang === "vi" || savedLang === "en") {
      setActiveLang(savedLang);
    } else {
      setActiveLang(detectLanguage());
    }

    const observer = new MutationObserver(() => setActiveLang(detectLanguage()));
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!seoMeta) return <Title>{defaultTitle || "COTCO Vietnam | Trusted Partner in Global Trade & Export Solutions"}</Title>;

  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  const title = pick(seoMeta.metaTitle) || defaultTitle || "COTCO Vietnam | Trusted Partner in Global Trade & Export Solutions";
  const description = pick(seoMeta.metaDescription) || "";
  const keywordsStr = Array.isArray(seoMeta.keywords)
    ? seoMeta.keywords.join(", ")
    : (pick(seoMeta.keywords) || seoMeta.keywords || "");

  return (
    <>
      <Title>{title}</Title>
      {description && <Meta name="description" content={description} />}
      {keywordsStr && <Meta name="keywords" content={keywordsStr} />}
      <Meta property="og:title" content={title} />
      {description && <Meta property="og:description" content={description} />}
      <Meta name="twitter:title" content={title} />
      {description && <Meta name="twitter:description" content={description} />}
    </>
  );
}
