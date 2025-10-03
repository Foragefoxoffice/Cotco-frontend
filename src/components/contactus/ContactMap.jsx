import React, { useEffect, useState } from "react";
import { getContactPage } from "../../Api/api";

const ContactMap = () => {
  const [contactMap, setContactMap] = useState(null);

  useEffect(() => {
    getContactPage().then((res) => {
      if (res.data?.contactMap) {
        setContactMap(res.data.contactMap);
      }
    });
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto page-width md:py-20 py-6">
        <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-6 md:p-8 [box-shadow:rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.06)_0px_1px_2px_0px]">
          <h3 className="text-lg font-semibold text-slate-900">
            {contactMap?.contactMapTitle?.en || "Our Location"}
          </h3>

          <div className="mt-4 overflow-hidden rounded-lg ring-1 ring-slate-200">
            {contactMap?.contactMapMap ? (
              <iframe
                title="Our Location Map"
                src={contactMap.contactMapMap}
                className="w-full h-[360px] md:h-[420px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <p className="text-slate-500 text-sm p-6 text-center">
                No map provided yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
