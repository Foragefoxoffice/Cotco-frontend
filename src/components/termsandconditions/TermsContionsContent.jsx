import React, { useEffect, useState } from "react";
import { getTermsPage } from "../../Api/api";

export default function TermsConditionsContent() {
    const [content, setContent] = useState("");

    useEffect(() => {
        getTermsPage().then((res) => {
            const data = res.data?.terms || res.data;
            if (data?.termsConditionsContent?.en) {
                setContent(data.termsConditionsContent.en); // ✅ Always show EN
            }
        });
    }, []);

    return (
        <div className="mx-auto px-6 py-12 md:ml-20 md:mr-20 terms-conditions">
            {/* ✅ Inline style inside JSX */}
            <style>{`
        .terms-conditions h2 {
          font-size: 30px !important;
          margin-bottom: 1rem;
        }
        .terms-conditions p {
          line-height: 1.7;
        }

        @media(max-width:600px){
                .terms-conditions h2 {
          font-size: 24px !important;
          margin-bottom: 1rem;
        }
        .terms-conditions p {
          line-height: 1.7;
          font-size:16px !important;
        }
        }
      `}</style>

            <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                    __html: content || "<p>No content available</p>",
                }}
            />
        </div>
    );
}
