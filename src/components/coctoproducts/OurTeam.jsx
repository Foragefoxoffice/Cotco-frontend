// src/components/MeetOurTeam.jsx
import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";

const TEAM_SECTIONS = [
  {
    title: { en: "Machine", vi: "MÁY MÓC" },
    members: [
      {
        name: { en: "Cris", vi: "Cris" },
        role: { en: "Sales Manager", vi: "Quản lý kinh doanh" },
        phone: "+84 93 712 7025",
        email: "hoang@cotco-vn.com",
      },
      {
        name: { en: "Nam", vi: "Nam" },
        role: { en: "Technical Manager", vi: "Quản lý kỹ thuật" },
        phone: "+84 96 282 4098",
        email: "nam@cotco-vn.com",
      },
      {
        name: { en: "David", vi: "David" },
        role: { en: "Technician", vi: "Kỹ thuật viên" },
        phone: "+84 90 318 9969",
        email: "tien@cotco-vn.com",
      },
      {
        name: { en: "Eric", vi: "Eric" },
        role: { en: "Logistics Executive", vi: "Điều hành hậu cần" },
        phone: "+84 90 919 9383",
        email: "eric@cotco-vn.com",
      },
      {
        name: { en: "Luna", vi: "Luna" },
        role: { en: "Sales Admin", vi: "Nhân viên hành chính kinh doanh" },
        phone: "+84 93 238 7592",
        email: "luna@cotco-vn.com",
      },
    ],
  },
];

function PlusIcon({ open }) {
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600"
      aria-hidden="true"
    >
      <FiPlus
        className={`transition-transform duration-300 ${
          open ? "rotate-45" : ""
        }`}
      />
    </span>
  );
}

function MemberCard({ name, role, phone, email, activeLang }) {
  return (
    <li className="relative rounded-xl border border-slate-200 bg-white p-4 pl-6 shadow-sm">
      <span className="pointer-events-none absolute left-2 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-indigo-400 to-sky-400" />
      <div className="text-[16px] font-black uppercase tracking-wide text-slate-800">
        {name[activeLang] || name.en}
      </div>
      <div className="mt-1 text-[16px] font-semibold uppercase tracking-wide text-slate-500">
        {role[activeLang] || role.en}
      </div>
      <div className="mt-2 space-y-0.5 text-[16px] leading-relaxed text-slate-600">
        <div>{phone}</div>
        <a href={`mailto:${email}`} className="text-sky-600 hover:underline">
          {email}
        </a>
      </div>
    </li>
  );
}

export default function MeetOurTeam() {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect language from body class or localStorage
  useEffect(() => {
    const detectLang = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const saved = localStorage.getItem("preferred_lang");
    if (saved === "vi" || saved === "en") {
      setActiveLang(saved);
      document.body.classList.toggle("vi-mode", saved === "vi");
    } else {
      setActiveLang(detectLang());
    }

    const observer = new MutationObserver(() =>
      setActiveLang(detectLang())
    );
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="pb-6 md:pb-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          <span className="mx-auto mb-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
            {activeLang === "en" ? "Contact" : "Liên hệ"}
          </span>

          <TitleAnimation
            text={activeLang === "en" ? "OUR TEAM" : "ĐỘI NGŨ CỦA CHÚNG TÔI"}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-relaxed text-slate-500 md:text-[16px]">
            {activeLang === "en"
              ? "Our experienced professionals combine deep textile industry knowledge with international trade expertise, ensuring seamless transactions and technical support for our clients."
              : "Đội ngũ chuyên gia giàu kinh nghiệm của chúng tôi kết hợp kiến thức sâu rộng về ngành dệt may với chuyên môn thương mại quốc tế, đảm bảo các giao dịch suôn sẻ và hỗ trợ kỹ thuật hiệu quả cho khách hàng."}
          </p>
        </div>

        {/* Accordions */}
        <div className="mx-auto mt-8 max-w-4xl space-y-6">
          {TEAM_SECTIONS.map((section, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={section.title.en} className="rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                  aria-expanded={isOpen}
                >
                  <span className="text-[20px] font-bold uppercase tracking-wide text-slate-700">
                    {section.title[activeLang] || section.title.en}
                  </span>
                  <PlusIcon open={isOpen} />
                </button>

                {/* Collapsible content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[1000px] py-3" : "max-h-0"
                  }`}
                >
                  {section.members.length > 0 && (
                    <ul className="space-y-3 rounded-xl bg-slate-50/50 p-1">
                      {section.members.map((m, i) => (
                        <MemberCard key={i} {...m} activeLang={activeLang} />
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
