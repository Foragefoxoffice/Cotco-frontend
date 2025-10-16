import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";
import { getCottonPage } from "../../Api/api";

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

function MemberCard({ name, role, phone, email }) {
  return (
    <li className="relative rounded-xl border border-slate-200 bg-white p-4 pl-6 shadow-sm">
      <span className="pointer-events-none absolute left-2 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-indigo-400 to-sky-400" />
      <div className="text-[16px] font-black uppercase tracking-wide text-slate-800">
        {name}
      </div>
      <div className="mt-1 text-[16px] font-semibold uppercase tracking-wide text-slate-500">
        {role}
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
  const [openIndex, setOpenIndex] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // Detect & sync language
  useEffect(() => {
    const detectLanguage = () =>
      document.body.classList.contains("vi-mode") ? "vi" : "en";

    const saved = localStorage.getItem("preferred_lang");
    if (saved === "vi" || saved === "en") {
      setActiveLang(saved);
      document.body.classList.toggle("vi-mode", saved === "vi");
    } else {
      setActiveLang(detectLanguage());
    }

    const observer = new MutationObserver(() =>
      setActiveLang(detectLanguage())
    );
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  // ✅ Fetch Team Data
  useEffect(() => {
    getCottonPage()
      .then((res) => {
        if (res.data?.cottonTeam) setTeamData(res.data.cottonTeam);
      })
      .catch((err) => console.error("Failed to load cotton team:", err));
  }, []);

  if (!teamData) return null;

  // ✅ Convert object -> array for rendering
  const TEAM_SECTIONS = Object.keys(teamData.aboutTeam || {}).map((key) => {
    const team = teamData.aboutTeam[key];
    return {
      title: pick(team.teamLabel),
      members: (team.members || []).map((m) => ({
        name: pick(m.teamName),
        role: pick(m.teamDesgn),
        phone: m.teamPhone || "",
        email: m.teamEmail || "",
      })),
    };
  });

  return (
    <section className="pt-6 mb-20 md:pt-10 relative">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          {teamData?.aboutTeamIntro?.tag?.[activeLang] && (
            <span className="mx-auto mb-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[13px] font-medium text-slate-600">
              {pick(teamData.aboutTeamIntro.tag)}
            </span>
          )}

          <TitleAnimation
            text={pick(teamData.aboutTeamIntro.heading) || "Our Team"}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          {teamData?.aboutTeamIntro?.description?.[activeLang] && (
            <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-relaxed text-slate-500 md:text-[16px]">
              {pick(teamData.aboutTeamIntro.description)}
            </p>
          )}
        </div>

        {/* Accordions */}
        <div className="mx-auto mt-8 max-w-4xl space-y-6">
          {TEAM_SECTIONS.map((section, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={section.title} className="rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                  aria-expanded={isOpen}
                >
                  <span className="text-[20px] font-bold uppercase tracking-wide text-slate-700">
                    {section.title}
                  </span>
                  <PlusIcon open={isOpen} />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[1000px] py-3" : "max-h-0"
                  }`}
                >
                  {section.members.length > 0 && (
                    <ul className="space-y-3 rounded-xl bg-slate-50/50 p-1">
                      {section.members.map((m, i) => (
                        <MemberCard key={i} {...m} />
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
