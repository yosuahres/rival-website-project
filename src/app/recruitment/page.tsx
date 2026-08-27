"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/FadeIn";
import { type TranslationKey, useTranslation } from "@/i18n";
import { BUTTON_PRIMARY } from "@/lib/button";

const APPLY_FORM_URL = "https://forms.gle/";

const GENERAL_REQUIREMENTS = [
  "recruitment.requirements.r1",
  "recruitment.requirements.r2",
  "recruitment.requirements.r3",
  "recruitment.requirements.r4",
  "recruitment.requirements.r5",
] as const satisfies readonly TranslationKey[];

const TIMELINE = [
  "recruitment.timeline.openRegistration",
  "recruitment.timeline.closeRegistration",
  "recruitment.timeline.announcement",
  "recruitment.timeline.interview",
  "recruitment.timeline.interviewResult",
  "recruitment.timeline.internshipStart",
] as const;

type Division = {
  /** Stable id — the React key and the icon's accessible name are built on it. */
  id: string;
  name: TranslationKey;
  /** Technical divisions lead with mission + focus; non-technical ones with a blurb. */
  mission?: TranslationKey;
  focus?: TranslationKey;
  desc?: TranslationKey;
  /** Responsibilities for technical divisions, requirements for non-technical ones. */
  points: readonly TranslationKey[];
  /** Chips pinned to the bottom of the card — technical divisions only. */
  skills?: readonly TranslationKey[];
  // Single 24x24 outline path drawn inside the card's icon badge.
  icon: string;
};

const TECHNICAL_DIVISIONS: readonly Division[] = [
  {
    id: "mechanical",
    name: "recruitment.divisions.mechanical.name",
    icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
    mission: "recruitment.divisions.mechanical.mission",
    focus: "recruitment.divisions.mechanical.focus",
    points: [
      "recruitment.divisions.mechanical.resp1",
      "recruitment.divisions.mechanical.resp2",
      "recruitment.divisions.mechanical.resp3",
      "recruitment.divisions.mechanical.resp4",
    ],
    skills: [
      "recruitment.divisions.mechanical.skill1",
      "recruitment.divisions.mechanical.skill2",
    ],
  },
  {
    id: "electrical",
    name: "recruitment.divisions.electrical.name",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    mission: "recruitment.divisions.electrical.mission",
    focus: "recruitment.divisions.electrical.focus",
    points: [
      "recruitment.divisions.electrical.resp1",
      "recruitment.divisions.electrical.resp2",
      "recruitment.divisions.electrical.resp3",
      "recruitment.divisions.electrical.resp4",
    ],
    skills: [
      "recruitment.divisions.electrical.skill1",
      "recruitment.divisions.electrical.skill2",
      "recruitment.divisions.electrical.skill3",
      "recruitment.divisions.electrical.skill4",
    ],
  },
  {
    id: "programming",
    name: "recruitment.divisions.programming.name",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    mission: "recruitment.divisions.programming.mission",
    focus: "recruitment.divisions.programming.focus",
    points: [
      "recruitment.divisions.programming.resp1",
      "recruitment.divisions.programming.resp2",
      "recruitment.divisions.programming.resp3",
      "recruitment.divisions.programming.resp4",
    ],
    skills: [
      "recruitment.divisions.programming.skill1",
      "recruitment.divisions.programming.skill2",
      "recruitment.divisions.programming.skill3",
      "recruitment.divisions.programming.skill4",
      "recruitment.divisions.programming.skill5",
    ],
  },
];

const NON_TECHNICAL_DIVISIONS: readonly Division[] = [
  {
    id: "creative",
    name: "recruitment.divisions.creative.name",
    icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
    desc: "recruitment.divisions.creative.desc",
    points: [
      "recruitment.divisions.creative.req1",
      "recruitment.divisions.creative.req2",
      "recruitment.divisions.creative.req3",
      "recruitment.divisions.creative.req4",
    ],
  },
  {
    id: "external",
    name: "recruitment.divisions.external.name",
    icon: "M20.25 14.15v4.073a2.25 2.25 0 01-1.907 2.222c-2.088.324-4.227.492-6.405.492s-4.317-.168-6.405-.492A2.25 2.25 0 013.75 18.223V14.15M12 12.75h.008v.008H12v-.008zM3.75 8.25h16.5c.621 0 1.125.504 1.125 1.125v2.023a2.25 2.25 0 01-1.907 2.222A48.208 48.208 0 0112 14.25c-2.716 0-5.4-.226-8.018-.659a2.25 2.25 0 01-1.907-2.222V9.375c0-.621.504-1.125 1.125-1.125zM15 8.25V6a2.25 2.25 0 00-2.25-2.25h-1.5A2.25 2.25 0 009 6v2.25",
    desc: "recruitment.divisions.external.desc",
    points: [
      "recruitment.divisions.external.req1",
      "recruitment.divisions.external.req2",
      "recruitment.divisions.external.req3",
      "recruitment.divisions.external.req4",
    ],
  },
  {
    id: "administration",
    name: "recruitment.divisions.administration.name",
    icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z",
    desc: "recruitment.divisions.administration.desc",
    points: [
      "recruitment.divisions.administration.req1",
      "recruitment.divisions.administration.req2",
      "recruitment.divisions.administration.req3",
      "recruitment.divisions.administration.req4",
    ],
  },
];

const APPLICATION_DOCUMENTS: readonly {
  title: TranslationKey;
  items?: readonly TranslationKey[];
}[] = [
  { title: "recruitment.documents.cv" },
  {
    title: "recruitment.documents.motivation",
    items: [
      "recruitment.documents.motivation1",
      "recruitment.documents.motivation2",
      "recruitment.documents.motivation3",
      "recruitment.documents.motivation4",
    ],
  },
  { title: "recruitment.documents.portfolio" },
];

const FAQS = [
  "recruitment.faq.q1",
  "recruitment.faq.q2",
  "recruitment.faq.q3",
  "recruitment.faq.q4",
  "recruitment.faq.q5",
] as const;

// Section anchors surfaced as jump links in the hero. The id is what the URL
// fragment and the scroll spy work on, so it stays put across locales.
const sections = [
  { id: "requirements", label: "recruitment.nav.requirements" },
  { id: "timeline", label: "recruitment.nav.timeline" },
  { id: "divisions", label: "recruitment.nav.divisions" },
  { id: "documents", label: "recruitment.nav.documents" },
  { id: "apply", label: "recruitment.nav.apply" },
  { id: "faq", label: "recruitment.nav.faq" },
] as const satisfies readonly { id: string; label: TranslationKey }[];

const DIVISION_LABEL =
  "text-white/60 font-semibold text-xs uppercase tracking-[0.12em] mb-2";

function DivisionSection({
  id,
  title,
  items,
  pointsLabel,
}: {
  id: string;
  title: TranslationKey;
  items: readonly Division[];
  /** Heads the bullet list: responsibilities here, requirements there. */
  pointsLabel: TranslationKey;
}) {
  const { t } = useTranslation();

  return (
    <section id={id} className="py-16 md:py-24 scroll-mt-24">
      <div className="w-full px-6 md:px-12">
        <FadeIn>
          <div className="border-t-2 border-white mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            {t(title)}
          </h2>
          <div className="border-b-2 border-white mb-12"></div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((division) => (
            <FadeIn key={division.id} className="h-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full hover:border-white/30 hover:bg-white/10 transition-colors">
                <span className="w-12 h-12 mb-5 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby={`icon-${division.id}`}
                  >
                    <title id={`icon-${division.id}`}>{t(division.name)}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={division.icon}
                    />
                  </svg>
                </span>
                <h4 className="text-white font-bold text-2xl">
                  {t(division.name)}
                </h4>
                <div className="border-t border-white/15 my-6"></div>
                {/* last:mb-0 — non-technical cards end here, with no chip row below. */}
                <div className="mb-8 last:mb-0 space-y-5 text-gray-300 text-base leading-relaxed">
                  {division.mission && (
                    <div>
                      <h5 className={DIVISION_LABEL}>
                        {t("recruitment.divisionLabels.mission")}
                      </h5>
                      <p>{t(division.mission)}</p>
                    </div>
                  )}
                  {division.focus && (
                    <div>
                      <h5 className={DIVISION_LABEL}>
                        {t("recruitment.divisionLabels.focus")}
                      </h5>
                      <p>{t(division.focus)}</p>
                    </div>
                  )}
                  {division.desc && <p>{t(division.desc)}</p>}
                  <div>
                    <h5 className={DIVISION_LABEL}>{t(pointsLabel)}</h5>
                    <ul className="list-disc pl-5 space-y-2 marker:text-white/40">
                      {division.points.map((point) => (
                        <li key={point}>{t(point)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Pinned to the bottom so the chip rows line up across the
                    three cards however long the bullets above run. */}
                {division.skills && (
                  <div className="mt-auto border-t border-white/15 pt-6">
                    <h5 className={DIVISION_LABEL}>
                      {t("recruitment.divisionLabels.skills")}
                    </h5>
                    <ul className="flex flex-wrap gap-2">
                      {division.skills.map((skill) => (
                        <li
                          key={skill}
                          className="bg-[#398561] text-white font-medium text-sm rounded-md px-3 py-1.5"
                        >
                          {t(skill)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [navEdges, setNavEdges] = useState({ start: false, end: false });
  const [siteNavHeight, setSiteNavHeight] = useState(0);
  const [siteNavHidden, setSiteNavHidden] = useState(false);
  const navListRef = useRef<HTMLUListElement>(null);

  // Where the bar comes to rest: flush against the top while the site navbar
  // is away, one row down while it is on screen. The site bar slides out on the
  // way down and back on the way up, so this offset moves with it — safely,
  // because sticky positioning clamps rather than switches: the bar renders at
  // whichever is lower of its own place in the page and this offset. Both
  // inputs to that are continuous, so the offset can animate straight through
  // the moment the bar takes hold and it still never jumps. Matching the site
  // bar's own transition below is what makes the two read as one movement.
  const stuckTop = siteNavHidden ? 12 : siteNavHeight + 12;

  // The two things about the site navbar that the offset above is built from.
  // Its height is measured rather than hard-coded because it follows the bar's
  // own contents, and it is read whether or not the bar is currently on screen:
  // hiding slides it out of the way, which leaves its height untouched.
  useEffect(() => {
    // Scoped to the nav element: the state flag lives on the body as
    // data-site-navbar-state, and a bare [data-site-navbar] would match it too.
    const siteNav = document.querySelector<HTMLElement>(
      "nav[data-site-navbar]",
    );
    if (!siteNav) return;

    const measure = () => setSiteNavHeight(siteNav.offsetHeight);
    const readState = () =>
      setSiteNavHidden(document.body.dataset.siteNavbarState === "hidden");

    measure();
    readState();
    const sizeObserver = new ResizeObserver(measure);
    sizeObserver.observe(siteNav);
    const stateObserver = new MutationObserver(readState);
    stateObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-site-navbar-state"],
    });
    return () => {
      sizeObserver.disconnect();
      stateObserver.disconnect();
    };
  }, []);

  // Scroll spy for the jump bar: the active link is the last section whose top
  // has passed under the pinned bar — and none of them until the first one
  // does, since a pill lit up while its section is still further down the page
  // is pointing at where you are not. The final section is force-selected at
  // the bottom of the page, since a short last section can never reach the
  // line.
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
      let current: string | null = null;
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
    if (!activeSection) return;
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
            alt={t("recruitment.heroAlt")}
            fill
            sizes="100vw"
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
            {t("recruitment.title")}
          </h1>
        </div>
      </section>

      {/* Intro — sits above the section jump links, and owns the gap down to
          them: the bar is sticky, so spacing left on the bar itself would feed
          into where it comes to rest rather than staying in the flow. */}
      <section className="pt-4 md:pt-8 pb-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              {t("recruitment.introTitle")}
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
              {t("recruitment.introBody1")}
            </p>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              {t("recruitment.introBody2")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Section jump links — stick to the top once scrolled past. Sticky
          rather than swapping to a fixed bar at a measured line: the browser
          takes hold at exactly the point the bar's two positions meet, so there
          is no seam to line up by hand and no spacer to hold the page still.
          The transition is for stuckTop, and is timed to the site navbar's own
          so the two bars move as one. */}
      <nav
        aria-label={t("recruitment.nav.label")}
        className="sticky z-50 px-6 transition-[top] duration-300 ease-out"
        style={{ top: stuckTop }}
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
                    {t(section.label)}
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
              {t("recruitment.requirementsTitle")}
            </h2>
          </FadeIn>

          <ol className="max-w-3xl mx-auto space-y-8 md:space-y-10">
            {GENERAL_REQUIREMENTS.map((req, index) => (
              <FadeIn key={req}>
                <li className="flex items-start gap-5 md:gap-7">
                  <span className="mt-0.5 flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#398561] text-white flex items-center justify-center font-bold text-base md:text-lg">
                    {index + 1}
                  </span>
                  <p className="text-white font-semibold text-lg md:text-xl leading-relaxed">
                    {t(req)}
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
                {t("recruitment.timelineTitle")}
              </h2>
            </div>
          </FadeIn>

          {/* Below md the list is one narrow column centred on the page: the rail
              and its labels stay left-aligned as a group, but the group itself
              sits in the middle. The width cap is what makes the longer titles
              wrap instead of stretching the column off-centre. */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-y-14 md:gap-y-20 mx-auto w-fit max-w-[17rem] md:w-auto md:max-w-none">
            {TIMELINE.map((item, index) => (
              <FadeIn key={item}>
                <li className="relative flex items-start gap-4 text-left md:flex-col md:items-center md:gap-0 md:px-2 md:text-center">
                  {/* Phones read the timeline as one column, so the nodes are
                      strung on a rail down the left instead of the horizontal
                      one the grid uses. 3.5rem is the row gap, which is what
                      the line has to cross to reach the next node's centre. */}
                  {index < TIMELINE.length - 1 && (
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
                      {t(`${item}.title` as const)}
                    </h3>
                    <p className="text-gray-400 text-base">
                      {t(`${item}.date` as const)}
                    </p>
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
        title="recruitment.technicalTitle"
        items={TECHNICAL_DIVISIONS}
        pointsLabel="recruitment.divisionLabels.responsibilities"
      />

      {/* Non-technical divisions */}
      <DivisionSection
        id="non-technical-divisions"
        title="recruitment.nonTechnicalTitle"
        items={NON_TECHNICAL_DIVISIONS}
        pointsLabel="recruitment.divisionLabels.requirements"
      />

      {/* Required documents */}
      <section id="documents" className="py-16 md:py-24 scroll-mt-24">
        <div className="w-full px-6 md:px-12">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-10">
              {t("recruitment.documentsTitle")}
            </h2>
          </FadeIn>

          <ul className="border-t border-white/15">
            {APPLICATION_DOCUMENTS.map((doc) => (
              <FadeIn key={doc.title}>
                <li className="border-b border-white/15 py-6">
                  <p className="text-white text-lg md:text-xl">
                    {t(doc.title)}
                  </p>
                  {doc.items && (
                    <ol className="mt-4 ml-1 space-y-2">
                      {doc.items.map((item, index) => (
                        <li
                          key={item}
                          className="flex gap-3 text-gray-300 text-base md:text-lg"
                        >
                          <span className="text-white/50">{index + 1}.</span>
                          <span>{t(item)}</span>
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
                  {t("recruitment.applyTitle")}
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                  {t("recruitment.applyBody")}
                </p>

                <div className="mt-12 flex md:justify-end">
                  <a
                    href={APPLY_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={BUTTON_PRIMARY}
                  >
                    {t("recruitment.applyCta")}
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
              {t("recruitment.faqTitle")}
            </h2>
          </FadeIn>

          <div className="border-t border-white/15">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq} className="border-b border-white/15">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-6 text-left py-6"
                  >
                    <span className="text-white text-lg md:text-xl">
                      {t(`${faq}.q` as const)}
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
                      <title id={`faq-icon-${index}`}>
                        {t("recruitment.faqToggle")}
                      </title>
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
                        {t(`${faq}.a` as const)}
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
