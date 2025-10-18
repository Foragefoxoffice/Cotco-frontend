import React, { useEffect, useState } from "react";
import { getContactPage } from "../../Api/api";

const ContactMap = () => {
  const [contactMap, setContactMap] = useState(null);
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Detect language dynamically from body class
  useEffect(() => {
    const checkLang = () => {
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    };
    checkLang();

    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch contact map data
  useEffect(() => {
    getContactPage().then((res) => {
      if (res.data?.contactMap) {
        setContactMap(res.data.contactMap);
      }
    });
  }, []);

  // ✅ Helper function for translation
  const t = (en, vi) => (isVietnamese ? vi || en : en);

  return (
    <section className="bg-white">
      <div className="mx-auto page-width md:py-20 py-6">
        <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-6 md:p-8 [box-shadow:rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.06)_0px_1px_2px_0px]">
          <h3 className="text-lg font-semibold text-slate-900">
            {t(
              contactMap?.contactMapTitle?.en,
              contactMap?.contactMapTitle?.vi
            ) || t("Our Location", "Vị trí của chúng tôi")}
          </h3>

          <div className="mt-4 overflow-hidden rounded-lg ring-1 ring-slate-200">
            {contactMap?.contactMapMap ? (
              <iframe
                title={t("Our Location Map", "Bản đồ vị trí của chúng tôi")}
                src={contactMap.contactMapMap}
                className="w-full h-[360px] md:h-[420px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <p className="text-slate-500 text-sm p-6 text-center">
                {t("No map provided yet.", "Chưa có bản đồ.")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
