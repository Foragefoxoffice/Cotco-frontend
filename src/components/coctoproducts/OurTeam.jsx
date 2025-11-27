// src/components/MeetOurTeam.jsx
import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";
import { getMachineCMSPage } from "../../Api/api";
 // ✅ import your API

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
        {name?.[activeLang] || name?.en || ""}
      </div>
      <div className="mt-1 text-[16px] font-semibold uppercase tracking-wide text-slate-500">
        {role?.[activeLang] || role?.en || ""}
      </div>
      <div className="mt-2 space-y-0.5 text-[16px] leading-relaxed text-slate-600">
        {phone && <div>{phone}</div>}
        {email && (
          <a href={`mailto:${email}`} className="text-sky-600 hover:underline">
            {email}
          </a>
        )}
      </div>
    </li>
  );
}

export default function MeetOurTeam() {
  const [openIndex, setOpenIndex] = useState(-1);
  const [activeLang, setActiveLang] = useState("en");
  const [teamSection, setTeamSection] = useState(null);

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

    const observer = new MutationObserver(() => setActiveLang(detectLang()));
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Fetch team data from backend
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await getMachineCMSPage();
        if (res.data?.machinePage?.machineTeamSection) {
          setTeamSection(res.data.machinePage.machineTeamSection);
        }
      } catch (error) {
        console.error("❌ Failed to load machine team section:", error);
      }
    }
    fetchTeam();
  }, []);

  if (!teamSection) return null;

  const intro = teamSection.aboutTeamIntro || {};
  const teams = teamSection.aboutTeam || {};

  return (
    <section className="pb-6 md:pb-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          {intro.tag?.[activeLang] && (
            <span className="mx-auto mb-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
              {intro.tag?.[activeLang]}
            </span>
          )}

          <TitleAnimation
            text={intro.heading?.[activeLang] || "OUR TEAM"}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          {intro.description?.[activeLang] && (
            <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-relaxed text-slate-500 md:text-[16px]">
              {intro.description?.[activeLang]}
            </p>
          )}
        </div>

        {/* Accordions */}
        <div className="mx-auto mt-8 max-w-4xl space-y-6">
          {Object.entries(teams).map(([key, section], idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={key} className="rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                  aria-expanded={isOpen}
                >
                  <span className="text-[20px] font-bold uppercase tracking-wide text-slate-700">
                    {section.teamLabel?.[activeLang] || section.teamLabel?.en}
                  </span>
                  <PlusIcon open={isOpen} />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[1000px] py-3" : "max-h-0"
                  }`}
                >
                  {section.members?.length > 0 && (
                    <ul className="space-y-3 rounded-xl bg-slate-50/50 p-1">
                      {section.members.map((m, i) => (
                        <MemberCard
                          key={i}
                          name={m.teamName}
                          role={m.teamDesgn}
                          phone={m.teamPhone}
                          email={m.teamEmail}
                          activeLang={activeLang}
                        />
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
