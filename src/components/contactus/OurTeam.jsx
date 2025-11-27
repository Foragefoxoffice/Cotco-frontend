import React, { useState, useEffect } from "react";
import { getContactPage } from "../../Api/api";
import { FiPlus } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";

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

export default function ContactTeam() {
  const [openIndex, setOpenIndex] = useState(null);
  const [contactTeam, setContactTeam] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // 🌐 Detect language
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

  // 🌍 Fetch Contact Page data
  useEffect(() => {
    getContactPage()
      .then((res) => {
        if (res.data?.contactTeam) {
          setContactTeam(res.data.contactTeam);
        }
      })
      .catch((err) => console.error("❌ Failed to load Contact Team:", err));
  }, []);

  if (!contactTeam) return null;

  const { teamIntro, teamList } = contactTeam;
  const pick = (obj) => obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "";

  const tag = pick(teamIntro?.tag) || "Our People";
  const heading = pick(teamIntro?.heading) || "Meet Our Team";
  const description =
    pick(teamIntro?.description) || "Our team is ready to support you.";

  const TEAM_SECTIONS = Object.entries(teamList || {}).map(([key, team]) => ({
    title: pick(team.teamLabel) || "Unnamed Team",
    members: (team.members || []).map((m) => ({
      name: pick(m.teamName),
      role: pick(m.teamDesgn),
      phone: m.teamPhone || "",
      email: m.teamEmail || "",
    })),
  }));

  return (
    <section className="pt-6 md:pt-10 pb-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          {tag && (
            <span className="mx-auto mb-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[13px] font-medium text-slate-600">
              {tag}
            </span>
          )}
          <TitleAnimation
            text={heading}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          {description && (
            <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-relaxed text-slate-500 md:text-[16px]">
              {description}
            </p>
          )}
        </div>

        {/* Accordion Layout */}
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
                  {section.members.length > 0 ? (
                    <ul className="space-y-3 rounded-xl bg-slate-50/50 p-1">
                      {section.members.map((m, i) => (
                        <MemberCard key={i} {...m} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-slate-400 py-3">
                      No members found
                    </p>
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
