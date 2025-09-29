// src/components/MeetOurTeam.jsx
import { useState } from "react";
import { FiPlus} from "react-icons/fi";
import TitleAnimation from "../common/AnimatedTitle";
const TEAM_SECTIONS = [
    {
    title: "Cotton",
    members: [
      {
        email: "cotton@cotco-vn.com",
      },
      {
        email: "trading@cotco-vn.com",
      },
    ],
  },
  {
    title: "Machine",
    members: [
       {
        name: "Cris Hoang",
        role: "Sales Manager",
        phone: "+84 39 712 7025",
        email: "machine@cotco-vn.com",
      },
      {
        name: "Nam",
        role: "Technical Manager",
        phone: "+84 96 282 4098",
        email: "nam@cotco-vn.com",
      },
      {
        name: "David",
        role: "Technican",
        phone: "+84 90 318 9969",
        email: "tien@cotco-vn.com",
      },
      {
        name: "Eric",
        role: "Logistics Executive",
        phone: "+84 90 919 9383",
        email: "eric@cotco-vn.com",
      },
      {
        name: "Luna",
        role: "Sales Admin",
        phone: "+84 93 238 7592",
        email: "luna@cotco-vn.com",
      },
    ],
  },
   {
    title: "Fiber",
    members: [
      {
        name: "Sophie ",
        email: "fiber@cotco-vn.com",
        phone: "+84 96 900 3600",
      },
      {
        email: "trading@cotco-vn.com",
      },
    ],
  },
  {
    title: "Marketing",
    members: [
      {
        name: "Tracy",
        role: "Marketing Associate",
        phone: "+1 408 422 9871",
        email: "tuong@cotco-vn.com",
      },
      {
        name: "Mei",
        role: "Marketing Executive",
        phone: "+84 93 620 6974",
        email: "tram@cotco-vn.com",
      },
    ],
  },
  {
    title: "Other Inquiries or Recruitment",
    members: [
      { phone: "+84 936 206 974", email: "info@cotco-vn.com" },
      {  phone: "+84 028 3 589 9978", email: "trading@cotco-vn.com",
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
     <FiPlus className={`transition-transform duration-300 ${
          open ? "rotate-45" : ""
        }`} />
    </span>
  );
}

function MemberCard({ name, role, phone, email, taxCode }) {
  return (
    <li className="relative rounded-xl border border-slate-200 bg-white p-4 pl-6 shadow-sm">
      {/* vertical accent */}
      <span className="pointer-events-none absolute left-2 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-indigo-400 to-sky-400" />
      <div className="text-[16px] font-black uppercase tracking-wide text-slate-800">
        {name}
      </div>
      <div className="mt-1 text-[16px] font-semibold uppercase tracking-wide text-slate-500">
        {role}
      </div>
      <div className="mt-2 space-y-0.5 text-[16px] leading-relaxed text-slate-600">
        <div>{phone}</div>
        <a href={`mailto:${email}`} className="text-sky-600 hover:underline">
          {email}
        </a>
      </div>
      <div className="mt-1 text-[16px] font-semibold uppercase tracking-wide text-slate-500">{taxCode}</div>
    </li>
  );
}

export default function MeetOurTeam() {
  // Open "Machine" by default to match the screenshot
  const [openIndex, setOpenIndex] = useState();

  return (
    <section className="pt-6 md:pt-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          <span className="mx-auto mb-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
           Contact
          </span>
          <TitleAnimation
            text={"Get In Touch"}
            className="heading uppercase"
            align="center"
            delay={0.05}
            stagger={0.05}
            once={true}
          />
          <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-relaxed text-slate-500 md:text-[16px]">
           We're here to assist you with any inquiries about our cotton, fiber, or
machinery products.
          </p>
        </div>

        {/* Accordions */}
        <div className="mx-auto mt-8 max-w-4xl space-y-6">
          {TEAM_SECTIONS.map((section, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={section.title} className="rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                  aria-expanded={isOpen}
                >
                  <span className="text-[20px] font-bold uppercase tracking-wide text-slate-700">
                    {section.title}
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
