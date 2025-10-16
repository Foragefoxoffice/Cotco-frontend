import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";
import { getFiberPage } from "../../Api/api";

// 🔹 Accordion Icon
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

// 🔹 Member Card (modern look)
function MemberCard({ name, role, phone, email }) {
  return (
    <li className="relative rounded-xl border border-slate-200 bg-white p-5 pl-6 shadow-sm transition hover:shadow-md">
      {/* Blue accent bar */}
      <span className="absolute left-2 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b from-indigo-400 to-sky-400" />

      {/* Name */}
      <div className="text-[15px] font-extrabold uppercase tracking-wide text-slate-800">
        {name || "Unnamed Member"}
      </div>

      {/* Role */}
      {role && (
        <div className="mt-1 text-[14px] font-semibold uppercase tracking-wide text-slate-500">
          {role}
        </div>
      )}

      {/* Phone */}
      {phone && (
        <div className="mt-2 text-[14px] font-medium text-slate-600">
          {phone}
        </div>
      )}

      {/* Email */}
      {email && (
        <div className="mt-2 text-[14px] leading-relaxed text-sky-600">
          <a href={`mailto:${email}`} className="hover:underline">
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
  const [loading, setLoading] = useState(true);

  // 🌐 Detect site language (.vi-mode from body class)
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

  // 🌐 Helper for picking correct translation
  const pick = (obj) =>
    typeof obj === "object" && obj !== null
      ? obj?.[activeLang] || obj?.en || obj?.vi || ""
      : obj || "";

  // ✅ Fetch fiber team data
  useEffect(() => {
    setLoading(true);
    getFiberPage()
      .then((res) => {
        if (res.data?.fiberTeam) {
          setFiberTeam(res.data.fiberTeam);
        } else {
          console.warn("No fiberTeam found in response.");
        }
      })
      .catch((err) => console.error("❌ Failed to load fiber team:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🕓 Loading state
  if (loading) {
    return (
      <section className="py-20 text-center text-slate-500">
        Loading team data...
      </section>
    );
  }

  // 🚫 No data fallback
  if (!fiberTeam) {
    return (
      <section className="py-20 text-center text-slate-500">
        No team information available.
      </section>
    );
  }

  const intro = fiberTeam.aboutTeamIntro || {};
  const groups = fiberTeam.aboutTeam || {};
  const hasTeams = Object.keys(groups).length > 0;

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
        {hasTeams ? (
          <div className="mx-auto mt-8 max-w-4xl space-y-6">
            {Object.entries(groups).map(([key, group], idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={key} className="rounded-2xl">
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className={`flex w-full items-center justify-between rounded-xl border border-slate-200 px-5 py-4 text-left transition-all ${
                      isOpen
                        ? "bg-white shadow-md border-sky-200"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span className="text-[20px] font-bold uppercase tracking-wide text-slate-700">
                      {pick(group.teamLabel) || "Unnamed Team"}
                    </span>
                    <PlusIcon open={isOpen} />
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-[1000px] py-3" : "max-h-0"
                    }`}
                  >
                    {group.members?.length > 0 ? (
                      <ul className="space-y-3 rounded-xl bg-slate-50/50 p-1">
                        {group.members.map((m, i) => (
                          <MemberCard
                            key={i}
                            name={pick(m.teamName)}
                            role={pick(m.teamDesgn)}
                            phone={m.teamPhone}
                            email={m.teamEmail}
                          />
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-slate-500 italic">
                        No members in this team yet.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-500 italic">
            No team groups available.
          </p>
        )}
      </div>
    </section>
  );
}
