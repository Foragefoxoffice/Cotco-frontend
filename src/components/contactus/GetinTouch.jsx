import React, { useEffect, useState } from "react";
import { getContactPage } from "../../Api/api";

const API_BASE = import.meta.env.VITE_API_URL;

/* ---------- ICON COMPONENTS ---------- */
const IconBox = ({ children }) => (
  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
    <div className="text-blue-600">{children}</div>
  </div>
);

const PinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s7-5.33 7-11a7 7 0 10-14 0c0 5.67 7 11 7 11z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.5" fill="currentColor" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- MAIN COMPONENT ---------- */
const GetinTouch = () => {
  const [contactLocation, setContactLocation] = useState(null);
  const [contactHours, setContactHours] = useState(null);
  const [isVietnamese, setIsVietnamese] = useState(false);

  // ✅ Detect language dynamically
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

  // ✅ Fetch contact data
  useEffect(() => {
    getContactPage().then((res) => {
      if (res.data?.contactLocation) setContactLocation(res.data.contactLocation);
      if (res.data?.contactHours) setContactHours(res.data.contactHours);
    });
  }, []);

  // ✅ Helper: text based on language
  const t = (en, vi) => (isVietnamese ? vi || en : en);

  return (
    <section className="bg-white">
      <div className="mx-auto page-width md:pt-20 pt-6">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-5xl m-auto gap-6 lg:gap-8">
          {/* Our Office */}
          <div className="rounded-2xl bg-white shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <IconBox>
                <PinIcon />
              </IconBox>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t(
                    contactLocation?.contactLocationTitle?.en,
                    contactLocation?.contactLocationTitle?.vi
                  ) || t("Our Office", "Văn phòng của chúng tôi")}
                </h3>
                <p className="mt-2 text-slate-600 leading-7">
                  {t(
                    contactLocation?.contactLocationDes?.en,
                    contactLocation?.contactLocationDes?.vi
                  ) || t("Office address here", "Địa chỉ văn phòng tại đây")}
                </p>

                {contactLocation?.contactLocationButtonLink && (
                  <a
                    href={contactLocation.contactLocationButtonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {t(
                      contactLocation?.contactLocationButtonText?.en,
                      contactLocation?.contactLocationButtonText?.vi
                    ) || t("Get Directions", "Xem chỉ đường")}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="rounded-2xl bg-white shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <IconBox>
                <ClockIcon />
              </IconBox>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t(
                    contactHours?.contactHoursTitle?.en,
                    contactHours?.contactHoursTitle?.vi
                  ) || t("Business Hours", "Giờ làm việc")}
                </h3>

                <ul className="mt-3 space-y-3">
                  {contactHours?.contactHoursList?.length ? (
                    contactHours.contactHoursList.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#DBEAFE]" />
                        <div className="text-slate-600">
                          {t(item?.en, item?.vi)}
                        </div>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="text-slate-600">
                        {t("Monday – Friday: 8:00 AM – 6:00 PM", "Thứ Hai – Thứ Sáu: 8:00 – 18:00")}
                      </li>
                      <li className="text-slate-600">
                        {t("Saturday: 8:00 AM – 12:00 PM", "Thứ Bảy: 8:00 – 12:00")}
                      </li>
                      <li className="text-slate-600">
                        {t("Sunday: Closed", "Chủ nhật: Nghỉ")}
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetinTouch;
