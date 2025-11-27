import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";
import { getAboutPage } from "../../Api/api";

/* ---------- Plus icon ---------- */
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

/* ---------- Single team member card ---------- */
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

/* ---------- Main Component ---------- */
export default function MeetOurTeam() {
  const [openIndex, setOpenIndex] = useState(null);
  const [aboutTeam, setAboutTeam] = useState(null);
  const [aboutTeamIntro, setAboutTeamIntro] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  // ✅ Detect language dynamically
  useEffect(() => {
    const detectLanguage = () => {
      if (typeof document === "undefined") return "en";
      return document.body.classList.contains("vi-mode") ? "vi" : "en";
    };

    setActiveLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setActiveLang(detectLanguage());
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

// ✅ Fetch team data from API
useEffect(() => {
  getAboutPage()
    .then((res) => {
      // Handle both wrapped and flat response styles
      const data = res.data?.about || res.data || {};

      console.log("✅ About Page Data:", data); // helpful debug

      // ✅ Extract team data safely
      let teamData = {};

      if (data.aboutTeam) {
        const teams = data.aboutTeam.dynamicTeams;

        if (teams && typeof teams === "object" && !Array.isArray(teams)) {
          teamData = teams;
        } else if (typeof data.aboutTeam === "object") {
          // fallback: aboutTeam itself might already be the map
          teamData = data.aboutTeam;
        }
      }

      setAboutTeam(teamData || {});

      // ✅ Set intro section (safe fallback)
      setAboutTeamIntro(
        data.aboutTeamIntro || {
          tag: { en: "", vi: "" },
          heading: { en: "", vi: "" },
          description: { en: "", vi: "" },
        }
      );
    })
    .catch((err) => {
      console.error("❌ Failed to load team:", err);
      setAboutTeam({});
    });
}, []);


  // ✅ Safe bilingual helper
  const pick = (obj) =>
    typeof obj === "object" ? obj?.[activeLang] ?? obj?.en ?? obj?.vi ?? "" : obj ?? "";

  if (!aboutTeam || !aboutTeamIntro) return null;

  // ✅ Extract bilingual text
  const sectionTag = pick(aboutTeamIntro.tag);
  const sectionHeading = pick(aboutTeamIntro.heading);
  const sectionDescription = pick(aboutTeamIntro.description);

  // ✅ Convert team object into array
  const teamSections = Object.entries(aboutTeam || {}).map(([key, value]) => ({
    key,
    title: pick(value.teamLabel),
    members: (value.members || []).map((m) => ({
      name: pick(m.teamName),
      role: pick(m.teamDesgn),
      email: m.teamEmail || "",
      phone: m.teamPhone || "",
    })),
  }));

  return (
    <section className="pt-6 md:pt-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* ---------- Header ---------- */}
        <div className="text-center">
          {sectionTag && (
            <span className="mx-auto mb-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[13px] font-medium text-slate-600">
              {sectionTag}
            </span>
          )}

          <TitleAnimation
            text={sectionHeading}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />

          {sectionDescription && (
            <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-relaxed text-slate-500 md:text-[16px]">
              {sectionDescription}
            </p>
          )}
        </div>

        {/* ---------- Accordion ---------- */}
        <div className="mx-auto mt-8 max-w-4xl space-y-6">
          {teamSections.map((section, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={section.key} className="rounded-2xl">
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

                {/* Collapsible Members */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "h-fit py-3" : "max-h-0"
                  }`}
                >
                  {section.members.length > 0 ? (
                    <ul className="space-y-3 rounded-xl bg-slate-50/50 p-1">
                      {section.members.map((m, i) => (
                        <MemberCard key={i} {...m} />
                      ))}
                    </ul>
                  ) : (
                    <p className="p-4 text-center text-sm text-slate-500">
                      {activeLang === "vi"
                        ? "Chưa có thành viên nào trong nhóm này."
                        : "No members in this team yet."}
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
