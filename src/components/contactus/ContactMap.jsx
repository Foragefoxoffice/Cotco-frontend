import React from "react";

const ContactMap = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto page-width md:py-20 py-6">
        <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-6 md:p-8 [box-shadow:rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.06)_0px_1px_2px_0px]">
          <h3 className="text-lg font-semibold text-slate-900">Our Location</h3>

          <div className="mt-4 overflow-hidden rounded-lg ring-1 ring-slate-200">
            <iframe
              title="Our Location Map"
              src="https://www.google.com/maps?q=Thu%20Duc%20City%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam&output=embed"
              className="w-full h-[360px] md:h-[420px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <p className="mt-3 text-sm text-slate-600">
            Landmarks: Near Khang Dien Residential Area, Thu Duc City
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
