// src/components/FiberMeetOurTeam.jsx
import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";
import { getFiberPage } from "../../Api/api";

function PlusIcon({ open }) {
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600"
      aria-hidden="true"
    >
      <FiPlus
        className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}
      />
    </span>
  );
}

function MemberCard({ name, role, email }) {
  return (
    <li className="relative rounded-xl border border-slate-200 bg-white p-4 pl-6 shadow-sm">
      <span className="pointer-events-none absolute left-2 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-indigo-400 to-sky-400" />
      <div className="text-[16px] font-black uppercase tracking-wide text-slate-800">
        {name}
      </div>
      <div className="mt-1 text-[16px] font-semibold uppercase tracking-wide text-slate-500">
        {role}
      </div>
      {email && (
        <div className="mt-2 text-[16px] leading-relaxed text-slate-600">
          <a href={`mailto:${email}`} className="text-sky-600 hover:underline">
            {email}
          </a>
        </div>
      )}
    </li>
  );
}

export default function FiberMeetOurTeam() {
  const [openIndex, setOpenIndex] = useState(null);
  const [fiberTeam, setFiberTeam] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // 🌐 Detect active language (auto sync with header toggle)
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

  // 🌐 Helper to pick correct translation
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch Fiber Team data
  useEffect(() => {
    getFiberPage()
      .then((res) => {
        if (res.data?.fiberTeam) {
          setFiberTeam(res.data.fiberTeam);
        }
      })
      .catch((err) => console.error("Failed to load fiber team:", err));
  }, []);

  if (!fiberTeam) return null;

  const intro = fiberTeam.aboutTeamIntro || {};
  const groups = fiberTeam.aboutTeam || {};

  return (
    <section className="pt-10 md:pt-16 mb-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* ---------- HEADER ---------- */}
        <div className="text-center mb-10">
          {intro.tag?.[activeLang] && (
            <span className="mx-auto mb-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[13px] font-medium text-slate-600">
              {pick(intro.tag)}
            </span>
          )}

          <TitleAnimation
            text={pick(intro.heading) || "Meet our team"}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          {intro.description?.[activeLang] && (
            <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-relaxed text-slate-500 md:text-[16px]">
              {pick(intro.description)}
            </p>
          )}
        </div>

        {/* ---------- TEAM ACCORDIONS ---------- */}
        <div className="mx-auto mt-8 max-w-4xl space-y-6">
          {Object.entries(groups).map(([key, group], idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={key} className="rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                  aria-expanded={isOpen}
                >
                  <span className="text-[20px] font-bold uppercase tracking-wide text-slate-700">
                    {pick(group.teamLabel) || "Unnamed Team"}
                  </span>
                  <PlusIcon open={isOpen} />
                </button>

                {/* COLLAPSIBLE CONTENT */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[1000px] py-3" : "max-h-0"
                  }`}
                >
                  {group.members?.length > 0 && (
                    <ul className="space-y-3 rounded-xl bg-slate-50/50 p-1">
                      {group.members.map((m, i) => (
                        <MemberCard
                          key={i}
                          name={pick(m.teamName)}
                          role={pick(m.teamDesgn)}
                          email={m.teamEmail}
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
