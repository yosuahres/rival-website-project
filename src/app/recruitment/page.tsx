"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/FadeIn";

const APPLY_FORM_URL = "https://forms.gle/";

const generalRequirements = [
  "Incoming undergraduate student (S1/D4) at Institut Teknologi Sepuluh Nopember (ITS), Class of 2026.",
  "Demonstrate a strong willingness to learn and embrace new challenges.",
  "Able to work collaboratively in a team and perform well under pressure.",
  "Committed, responsible, and dedicated to contributing to RIVAL ITS.",
  "Willing to participate in all recruitment stages and internship programs.",
];

const timeline = [
  { title: "Open Registration", date: "19 September 2026" },
  { title: "Close Registration", date: "24 September 2026" },
  { title: "Administration Announcement", date: "28 September 2026" },
  { title: "Interview", date: "30 September – 5 October 2026" },
  { title: "Interview Result", date: "9 October 2026" },
  { title: "Internship Start", date: "12 October 2026" },
];

type Division = {
  name: string;
  // One bullet per entry in the card's responsibilities list.
  desc: string[];
  skills: string[];
  // Single 24x24 outline path drawn inside the card's icon badge.
  icon: string;
};

const technicalDivisions: Division[] = [
  {
    name: "Mechanical",
    icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
    desc: [
      "Designs and manufactures the robot's chassis, drivetrain, and manipulator so it survives the field and the competition rules.",
    ],
    skills: [
      "SolidWorks / Autodesk Inventor",
      "Static & dynamic structural analysis",
      "Manufacturing process (machining, 3D printing)",
      "Material selection",
    ],
  },
  {
    name: "Electrical",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    desc: [
      "Builds the power system, wiring, sensors, and control electronics that keep every subsystem of the robot alive.",
    ],
    skills: [
      "PCB design (KiCad / Altium / EAGLE)",
      "Microcontrollers (STM32, ESP32, Arduino)",
      "Power & battery management systems",
      "Sensor integration and troubleshooting",
    ],
  },
  {
    name: "Programming",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    desc: [
      "Develops the robot's brain — autonomy, computer vision, communication, and the interface the drivers use during a run.",
    ],
    skills: [
      "C/C++ and Python",
      "ROS / ROS2",
      "Computer vision (OpenCV)",
      "Control systems & path planning",
    ],
  },
];

const nonTechnicalDivisions: Division[] = [
  {
    name: "Creative & Branding",
    icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
    desc: [
      "Shapes how RIVAL ITS looks and sounds — from social media content to competition documentation and team identity.",
    ],
    skills: [
      "Figma / Adobe Illustrator / Photoshop",
      "Video editing (Premiere Pro, CapCut)",
      "Copywriting & social media strategy",
      "Photography and videography",
    ],
  },
  {
    name: "External Relations & Sponsorship",
    icon: "M20.25 14.15v4.073a2.25 2.25 0 01-1.907 2.222c-2.088.324-4.227.492-6.405.492s-4.317-.168-6.405-.492A2.25 2.25 0 013.75 18.223V14.15M12 12.75h.008v.008H12v-.008zM3.75 8.25h16.5c.621 0 1.125.504 1.125 1.125v2.023a2.25 2.25 0 01-1.907 2.222A48.208 48.208 0 0112 14.25c-2.716 0-5.4-.226-8.018-.659a2.25 2.25 0 01-1.907-2.222V9.375c0-.621.504-1.125 1.125-1.125zM15 8.25V6a2.25 2.25 0 00-2.25-2.25h-1.5A2.25 2.25 0 009 6v2.25",
    desc: [
      "Opens doors for the team — sponsorship proposals, partner relations, and collaborations with industry and institutions.",
    ],
    skills: [
      "Proposal writing & pitching",
      "Negotiation and public speaking",
      "Partner relationship management",
      "Business correspondence",
    ],
  },
  {
    name: "Administration & Finance",
    icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z",
    desc: [
      "Keeps the team running behind the scenes: budgeting, procurement, letters, logistics, and competition accommodation.",
    ],
    skills: [
      "Spreadsheet & bookkeeping",
      "Document and letter administration",
      "Procurement and logistics planning",
      "Time and event management",
    ],
  },
];

const applicationDocuments: { title: string; items?: string[] }[] = [
  { title: "Curriculum Vitae (CV) (ATS or Creative Format)." },
  {
    title: "Motivation Letter (minimum 500 words) containing:",
    items: [
      "Self-introduction",
      "What you know about RIVAL ITS",
      "Your motivation for joining RIVAL ITS",
      "The contributions and innovations you can bring to your chosen division",
    ],
  },
  { title: "Portfolio (Optional but Recommended)" },
];

const faqs = [
  {
    q: "Can I register for more than one division?",
    a: "No. Each applicant may only choose one division so that the assessment stays focused. Choose the division that best matches your interest and skills.",
  },
  {
    q: "Do I need previous robotics experience?",
    a: "Not at all. Most of our members started with zero competition experience. What matters is your willingness to learn, your commitment, and your consistency during the internship period.",
  },
  {
    q: "Will I get to join the competition directly?",
    a: "Accepted members start as interns. Those who show strong performance and commitment during the internship will be selected for the competition roster of KRI or the Australian Rover Challenge.",
  },
  {
    q: "How intense are the activities?",
    a: "It varies by period. Outside the competition season there are weekly meetings and division work. Approaching a competition, the intensity increases significantly, including work in the lab on weekends.",
  },
  {
    q: "What do I get from this internship?",
    a: "Hands-on experience building a real competition robot, mentoring from senior members, an active team member certificate, a strong portfolio, and a network across ITS and our industry partners.",
  },
];

// Section anchors surfaced as jump links in the hero.
const sections = [
  { id: "requirements", label: "General Requirements" },
  { id: "timeline", label: "Timeline" },
  { id: "divisions", label: "Divisions" },
  { id: "documents", label: "Required Documents" },
  { id: "apply", label: "Apply Now" },
  { id: "faq", label: "FAQ" },
];

function DivisionSection({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: Division[];
}) {
  return (
    <section id={id} className="py-16 md:py-24 scroll-mt-24">
      <div className="w-full px-6 md:px-12">
        <FadeIn>
          <div className="border-t-2 border-white mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            {title}
          </h2>
          <div className="border-b-2 border-white mb-12"></div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((division) => (
            <FadeIn key={division.name} className="h-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full hover:border-white/30 hover:bg-white/10 transition-colors">
                <span className="w-12 h-12 mb-5 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby={`icon-${division.name}`}
                  >
                    <title id={`icon-${division.name}`}>{division.name}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={division.icon}
                    />
                  </svg>
                </span>
                <h4 className="text-white font-bold text-2xl">
                  {division.name}
                </h4>
                <div className="border-t border-white/15 my-6"></div>
                <ul className="list-disc pl-5 mb-8 space-y-4 marker:text-white/40 text-gray-300 text-base leading-relaxed">
                  {division.desc.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {/* Pinned to the bottom so the chip rows line up across the
                    three cards however long the bullets above run. */}
                <div className="mt-auto border-t border-white/15 pt-6">
                  <ul className="flex flex-wrap gap-2">
                    {division.skills.map((skill) => (
                      <li
                        key={skill}
                        className="bg-[#398561] text-white font-medium text-sm rounded-md px-3 py-1.5"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Width of the fade at whichever end of the jump bar still has links behind
// it — wide enough to cut through a word, narrow enough to leave the pill it
// sits over readable.
const NAV_FADE = "2rem";

export default function Recruitment() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [navStuck, setNavStuck] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [navHeight, setNavHeight] = useState(0);
  const [navEdges, setNavEdges] = useState({ start: false, end: false });
  const [siteNavHeight, setSiteNavHeight] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);

  // The site navbar slides away on the way down and comes back on the way up,
  // on this page as on every other one. While our bar is pinned it therefore
  // has to sit below whatever the site bar is currently taking up: the site
  // bar's height while it is on screen, nothing once it has slid away.
  // The bar publishes its own state onto the body, so read it from there
  // instead of second-guessing the same scroll direction a second time.
  const pinnedTop = siteNavHeight + 12;

  useEffect(() => {
    // Scoped to the nav element: the state flag below lives on the body as
    // data-site-navbar-state, and a bare [data-site-navbar] would match it too.
    const siteNav = document.querySelector<HTMLElement>(
      "nav[data-site-navbar]",
    );
    if (!siteNav) return;

    const update = () => {
      const hidden = document.body.dataset.siteNavbarState === "hidden";
      setSiteNavHeight(hidden ? 0 : siteNav.offsetHeight);
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-site-navbar-state"],
    });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // The sentinel sits directly above the jump bar and marks where the bar
  // normally sits. Pin the bar once that point reaches the height the pinned
  // bar rests at, and release it the moment we scroll back above it again —
  // handing over exactly where the two positions meet, so nothing jumps.
  // Measured on scroll rather than with an IntersectionObserver: the sentinel
  // is zero-height, and an observer can miss the crossing on a zero-area
  // target, which leaves the bar pinned when it should have been released.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setNavStuck(sentinel.getBoundingClientRect().top <= pinnedTop);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinnedTop]);

  // Scroll spy for the jump bar: the active link is the last section whose top
  // has passed under the pinned bar. The final section is force-selected at the
  // bottom of the page, since a short last section can never reach the line.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 140;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }
      let current = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= line) current = section.id;
      }
      setActiveSection(current);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // On phones the bar is one scrolling row rather than three wrapped ones, so
  // the pill the scroll spy just lit up can be off to one side. Bring it back
  // to the middle of the strip. Done by nudging the strip's own scrollLeft
  // rather than with scrollIntoView, which would also scroll the page — and
  // the page is what moved us here in the first place.
  useEffect(() => {
    const list = navListRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const active = list.querySelector<HTMLElement>(
      `[href="#${activeSection}"]`,
    );
    if (!active) return;

    const listBox = list.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    const delta =
      activeBox.left + activeBox.width / 2 - (listBox.left + listBox.width / 2);
    list.scrollTo({ left: list.scrollLeft + delta, behavior: "smooth" });
  }, [activeSection]);

  // Which way the strip can still be swiped. A row that happens to end on the
  // gap between two pills looks finished; slicing a label with a fade on the
  // side that has more to show is what tells the reader it moves.
  useEffect(() => {
    const list = navListRef.current;
    if (!list) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = list.scrollWidth - list.clientWidth;
      setNavEdges({
        start: list.scrollLeft > 4,
        end: list.scrollLeft < max - 4,
      });
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    list.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Remember the bar's in-flow height so pinning it (which takes it out of the
  // document flow) doesn't make the rest of the page jump upwards.
  useEffect(() => {
    if (navStuck) return;
    const el = navRef.current;
    if (!el) return;
    const measure = () => setNavHeight(el.offsetHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [navStuck]);

  const fadeStop = `calc(100% - ${NAV_FADE})`;
  const edgeFade = navEdges.start
    ? navEdges.end
      ? `linear-gradient(to right, transparent, #000 ${NAV_FADE}, #000 ${fadeStop}, transparent)`
      : `linear-gradient(to right, transparent, #000 ${NAV_FADE})`
    : navEdges.end
      ? `linear-gradient(to right, #000 ${fadeStop}, transparent)`
      : undefined;

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <section className="relative mx-3 md:mx-4 flex min-h-[60vh] items-center justify-center overflow-hidden rounded-4xl px-8 py-20">
        <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
          <Image
            src="/images/recruitment/hero-background.webp"
            alt="RIVAL ITS team"
            fill
            className="object-cover object-center grayscale"
            priority
          />
          {/* Keeps the title legible over the brightest part of the photo and
              blends the frame's bottom edge into the black section beneath it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"
          ></div>
        </div>

        <div className="relative z-[1] max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Recruitment
          </h1>
        </div>
      </section>

      {/* Intro — sits above the section jump links */}
      <section className="pt-4 md:pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Come and Join Us!
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
              Join RIVAL ITS and become part of a multidisciplinary team that
              builds world class competition robots through innovation,
              collaboration, and strong engineering culture.
            </p>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Through this internship recruitment, you will gain hands-on
              experience, practical knowledge, and exposure to real competition
              projects while growing your technical and professional skills.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Section jump links — pin to the top once scrolled past */}
      <div ref={sentinelRef} aria-hidden="true" />
      {navStuck && <div aria-hidden="true" style={{ height: navHeight }} />}
      <nav
        ref={navRef}
        aria-label="Page sections"
        className={
          navStuck
            ? "fixed left-0 z-50 w-full px-6 transition-[top] duration-300 ease-out"
            : "px-6 pt-10"
        }
        style={navStuck ? { top: pinnedTop } : undefined}
      >
        <div className="w-fit max-w-full mx-auto overflow-hidden rounded-full border border-white/10 bg-[#121317] p-2">
          <ul
            ref={navListRef}
            style={{ maskImage: edgeFade, WebkitMaskImage: edgeFade }}
            className="scrollbar-hide flex flex-nowrap overflow-x-auto md:flex-wrap md:overflow-visible items-center justify-start md:justify-center gap-x-0 sm:gap-x-2 gap-y-1"
          >
            {sections.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`block rounded-full px-3 sm:px-5 py-2 whitespace-nowrap text-sm transition-colors ${
                      isActive
                        ? "bg-[#398561] text-white font-medium"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* General requirements */}
      <section id="requirements" className="py-16 md:py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
              GENERAL REQUIREMENTS
            </h2>
          </FadeIn>

          <ol className="max-w-3xl mx-auto space-y-8 md:space-y-10">
            {generalRequirements.map((req, index) => (
              <FadeIn key={req}>
                <li className="flex items-start gap-5 md:gap-7">
                  <span className="mt-0.5 flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#398561] text-white flex items-center justify-center font-bold text-base md:text-lg">
                    {index + 1}
                  </span>
                  <p className="text-white font-semibold text-lg md:text-xl leading-relaxed">
                    {req}
                  </p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="py-16 md:py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="flex justify-center mb-16 md:mb-20">
              <h2 className="bg-[#398561] text-white text-3xl md:text-4xl font-bold px-6 py-2 rounded-sm">
                Timeline
              </h2>
            </div>
          </FadeIn>

          {/* Below md the list is one narrow column centred on the page: the rail
              and its labels stay left-aligned as a group, but the group itself
              sits in the middle. The width cap is what makes the longer titles
              wrap instead of stretching the column off-centre. */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-y-14 md:gap-y-20 mx-auto w-fit max-w-[17rem] md:w-auto md:max-w-none">
            {timeline.map((item, index) => (
              <FadeIn key={item.title}>
                <li className="relative flex items-start gap-4 text-left md:flex-col md:items-center md:gap-0 md:px-2 md:text-center">
                  {/* Phones read the timeline as one column, so the nodes are
                      strung on a rail down the left instead of the horizontal
                      one the grid uses. 3.5rem is the row gap, which is what
                      the line has to cross to reach the next node's centre. */}
                  {index < timeline.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-4 top-4 h-[calc(100%+3.5rem)] w-px bg-[#398561]/60 md:hidden"
                    ></span>
                  )}
                  {/* Rail to the next node in the row, dropped for the last
                      of every three — the grid is three across. */}
                  <span
                    aria-hidden="true"
                    className={`absolute md:top-5 left-1/2 w-full h-px bg-[#398561]/60 hidden ${
                      index % 3 === 2 ? "md:hidden" : "md:block"
                    }`}
                  ></span>
                  <span
                    aria-hidden="true"
                    className="relative z-[1] flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border-[3px] border-[#398561] bg-[#121317]"
                  ></span>
                  <div>
                    <h3 className="text-white font-bold text-xl md:text-2xl mb-1 md:mt-6 md:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-base">{item.date}</p>
                  </div>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* Technical divisions */}
      <DivisionSection
        id="divisions"
        title="TECHNICAL DIVISIONS"
        items={technicalDivisions}
      />

      {/* Non-technical divisions */}
      <DivisionSection
        id="non-technical-divisions"
        title="NON-TECHNICAL DIVISIONS"
        items={nonTechnicalDivisions}
      />

      {/* Required documents */}
      <section id="documents" className="py-16 md:py-24 scroll-mt-24">
        <div className="w-full px-6 md:px-12">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-10">
              Required Documents
            </h2>
          </FadeIn>

          <ul className="border-t border-white/15">
            {applicationDocuments.map((doc) => (
              <FadeIn key={doc.title}>
                <li className="border-b border-white/15 py-6">
                  <p className="text-white text-lg md:text-xl">{doc.title}</p>
                  {doc.items && (
                    <ol className="mt-4 ml-1 space-y-2">
                      {doc.items.map((item, index) => (
                        <li
                          key={item}
                          className="flex gap-3 text-gray-300 text-base md:text-lg"
                        >
                          <span className="text-white/50">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* Apply now */}
      <section id="apply" className="py-16 md:py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 py-12 md:px-14 md:py-16">
              {/* Soft accent glows, echoing the card's edge lighting. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#398561]/25 blur-3xl"
              ></div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-[#398561]/15 blur-3xl"
              ></div>

              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Ready to Build the Future? Join Us.
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                  Take your first step with RIVAL ITS. Submit your documents,
                  choose your division, and grow with a team that turns ideas
                  into real competition robots. Registration closes 24 September
                  2026.
                </p>

                <div className="mt-12 flex md:justify-end">
                  <a
                    href={APPLY_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg bg-[#398561] px-10 py-4 font-bold text-white hover:bg-[#021507] transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] gap-10 md:gap-16">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white md:max-w-[8em] leading-tight md:sticky md:top-28">
              Frequently Asked Questions
            </h2>
          </FadeIn>

          <div className="border-t border-white/15">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q} className="border-b border-white/15">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-6 text-left py-6"
                  >
                    <span className="text-white text-lg md:text-xl">
                      {faq.q}
                    </span>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 text-white/60 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      role="img"
                      aria-labelledby={`faq-icon-${index}`}
                    >
                      <title id={`faq-icon-${index}`}>Toggle answer</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed pb-6 pr-10">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
