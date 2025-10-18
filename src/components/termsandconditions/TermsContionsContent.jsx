import React, { useEffect, useState } from "react";
import { getTermsPage } from "../../Api/api";

export default function TermsConditionsContent() {
  const [content, setContent] = useState("");
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Language detection
  useEffect(() => {
    const checkLang = () =>
      setIsVietnamese(document.body.classList.contains("vi-mode"));
    checkLang();

    const observer = new MutationObserver(checkLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch Terms content
  useEffect(() => {
    getTermsPage().then((res) => {
      const data = res.data?.terms || res.data;
      if (data?.termsConditionsContent) {
        setContent(
          isVietnamese
            ? data.termsConditionsContent.vi || data.termsConditionsContent.en
            : data.termsConditionsContent.en
        );
      }
    });
  }, [isVietnamese]); // Re-run when language changes

  return (
    <div className="mx-auto px-6 py-12 md:ml-20 md:mr-20 terms-conditions">
      {/* ✅ Inline styling */}
      <style>{`
        .terms-conditions h2 {
          font-size: 30px !important;
          margin-bottom: 1rem;
        }
        .terms-conditions p {
          line-height: 1.7;
          font-size: 17px;
          color: #374151;
        }

        @media(max-width:600px){
          .terms-conditions h2 {
            font-size: 24px !important;
            margin-bottom: 1rem;
          }
          .terms-conditions p {
            line-height: 1.7;
            font-size: 16px !important;
          }
        }
      `}</style>

      {/* ✅ Render Terms HTML */}
      <div
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html:
            content ||
            (isVietnamese
              ? "<p>Không có nội dung nào được cung cấp.</p>"
              : "<p>No content available.</p>"),
        }}
      />
    </div>
  );
}
