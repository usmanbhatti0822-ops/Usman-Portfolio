import React, { useEffect, useRef, useState, useCallback } from "react";
import { Github, Mail, Phone, Menu, X, Sparkles, ArrowUp } from "lucide-react";
import "./App.css";

/* ----------------------------------------------------------------
   DATA — ported from the original Flutter source (lib/main.dart)
---------------------------------------------------------------- */

const PROFILE = {
  name: "Muhammad Usman Bhatti",
  role: "Full-stack Flutter developer",
  location: "Lahore, Pakistan",
  email: "usmanbhatti0822@gmail.com",
  phone: "+92 301 4414894",
  phoneHref: "+923014414894",
  github: "github.com/usmanbhatti0822-ops",
  githubHref: "https://github.com/usmanbhatti0822-ops",
};

const ROLE_COLORS = {
  customer: { fg: "var(--role-customer)", bg: "var(--role-customer-bg)", label: "Customer" },
  staff: { fg: "var(--role-staff)", bg: "var(--role-staff-bg)", label: "Staff / Partner" },
  admin: { fg: "var(--role-admin)", bg: "var(--role-admin-bg)", label: "Admin" },
  api: { fg: "var(--ink-soft)", bg: "var(--panel-2)", label: "Backend / API" },
};

function roleOf(part) {
  const p = part.toLowerCase();
  if (p.includes("customer") || p.includes("patient")) return "customer";
  if (p.includes("staff") || p.includes("doctor") || p.includes("partner")) return "staff";
  if (p.includes("admin")) return "admin";
  return "api";
}

const FACTS = [
  { num: 5, suffix: "+ yrs", label: "Full-stack Flutter development" },
  { num: 3, suffix: "", label: "Multi-role platforms shipped (Customer / Staff / Admin)" },
  { num: 159, suffix: "", label: "Dart files across 80 screens — Go Trimzy alone" },
];

const HERO_CHIPS = ["Flutter", "Dart", "Riverpod", "GoRouter", "Material 3", "Clean Architecture", "NestJS", "PostgreSQL", "React Native"];

const MARQUEE_ITEMS = ["Flutter", "Dart", "Riverpod", "GoRouter", "NestJS", "PostgreSQL", "Prisma", "TypeORM", "Socket.io", "Redis", "React", "React Native", "Material 3", "Clean Architecture", "JWT · OAuth"];

const SKILLS = {
  "Mobile / frontend": ["Flutter · Dart", "Material 3", "Riverpod", "GoRouter", "React Native"],
  "Backend / data": ["NestJS", "PostgreSQL", "REST APIs", "Auth & payments", "React JS (admin panels)"],
  Architecture: ["Clean Architecture", "Feature-first structure", "Multi-role app design", "Real-time chat & tracking", "Push notifications"],
};

const PROJECTS = [
  {
    name: "Tripme",
    tagline: "End-to-end travel platform for Pakistan — 5-part system",
    description:
      "Rides, verified stays, guided tours, and local meal experiences — booked across a customer app, a partner (driver/guide) app, an internal ops dashboard, and a public marketing site, all on one production-hardened API. Built to demonstrate a complete system, not a single-screen demo.",
    status: "Completed build",
    flagship: true,
    stack: ["Expo · React Native", "React · Vite", "Next.js 15", "NestJS", "PostgreSQL · Prisma", "Redis", "Socket.io"],
    highlights: ["100 automated backend tests", "2 real dispatch race conditions found & fixed", "v1.0.0 — zero paid third-party services"],
    parts: ["Customer app", "Staff app", "Admin panel", "Marketing site", "NestJS API"],
    features: {
      "Customer app": ["Book rides, hotels, tours & meals", "Live trip tracking, in-app payments, support chat"],
      "Staff app": ["Drivers/guides go online and accept jobs", "KYC, earnings tracking, SOS trigger"],
      "Admin panel": ["Bookings, inventory, KYC review", "SOS handling, complaints, reports"],
      Backend: [
        "Real-time dispatch over Socket.io + Redis",
        "JWT auth, refresh-token revocation, OTP + lockout handling",
        "Every paid integration (Stripe/Twilio/Maps/S3) replaced by a documented free/mock equivalent",
      ],
    },
  },
  {
    name: "AutoHub",
    tagline: "Car marketplace & rental platform — Pakistan",
    description:
      "A full-stack car marketplace and rental platform — buy or sell cars, rent vehicles by the day, and manage bookings end-to-end against a real backend and database. Paid third-party integrations (SMS, JazzCash/Easypaisa, Firebase push) are mocked behind the exact same service boundaries a real integration would use.",
    status: "Completed build",
    stack: ["Flutter · Riverpod", "GoRouter", "Dio", "NestJS", "TypeORM", "PostgreSQL", "JWT · bcrypt"],
    highlights: ["One-tap demo login", "Real booking-conflict prevention", "Modular NestJS backend"],
    parts: ["Flutter Web/Mobile client", "NestJS API"],
    features: {
      "Marketplace (buy/sell)": [
        "Browse, search & filter by make, model, city, category, transmission, fuel, price",
        "Listing detail with photo gallery, specs, seller info & rating",
        'Post-a-car flow that goes to "pending" until admin approval',
      ],
      Rentals: [
        "Date-range availability picker with real overlap/conflict prevention",
        "Full booking flow: summary → payment method → confirmation",
        "My Bookings — Upcoming/Active/Completed/Cancelled, cancellation, post-rental reviews",
      ],
      "Auth & profile": [
        "Phone + OTP or email + password login, JWT sessions",
        "Wallet balance (owner payouts ledger)",
        "Ratings & reviews between renters/buyers and owners/sellers",
      ],
    },
  },
  {
    name: "Seventh",
    tagline: "Flutter e-commerce platform — premium streetwear storefront",
    description:
      "A single Flutter codebase powering a customer storefront and an admin web panel, backed by NestJS + PostgreSQL. Built dropshipping-first but designed to evolve into own-inventory selling without a rewrite — ships with a full in-memory mock backend so every flow runs standalone, no server required.",
    status: "Completed build",
    stack: ["Flutter · Material 3", "Riverpod", "GoRouter", "fl_chart", "NestJS", "TypeORM", "PostgreSQL"],
    highlights: ["Customer app + Admin panel, one codebase", "Fully interactive offline (mock backend)", "Role-based admin access"],
    parts: ["Customer app", "Admin web panel", "NestJS API"],
    features: {
      "Customer app": [
        "Phone/OTP + social login",
        "Home hero, spotlight & featured grid, search with filters/sort",
        "Product detail with gallery, variants, live reviews",
        "4-step checkout: address → delivery → payment → review",
        "Order tracking, wishlist, coupons, notifications",
      ],
      "Admin web panel": [
        "Dashboard — revenue/orders/customer trend charts, low-stock alerts",
        "Product CRUD + CSV bulk import, inventory, orders, customers",
        "Promotions, suppliers, staff, reports",
        "Role-based menu: Owner / Manager / Support / Catalog Editor",
      ],
      "Design system": ["Editorial streetwear look — Anton display + Archivo body", "Centralized tokens: colors, radii, spacing, motion durations"],
    },
  },
  {
    name: "CarePoint Hospital Network",
    tagline: "Multi-branch hospital appointment & clinic management",
    description:
      "A shared NestJS backend plus three Flutter apps — Patient, Doctor, and Admin Panel — for appointment booking, live per-branch queues, and network analytics across multiple hospital branches. All four pieces built and verified end-to-end in a real browser session before being committed.",
    status: "Completed build",
    stack: ["Flutter · Material 3", "NestJS", "Prisma", "PostgreSQL", "WebSockets", "JWT · OTP"],
    highlights: ["49 backend unit tests", "Live WebSocket queue per branch", "Security pass found & fixed 2 real gaps"],
    parts: ["Patient app", "Doctor app", "Admin panel", "NestJS API"],
    features: {
      Backend: [
        "JWT + patient OTP auth, doctor/staff email+password — both rate-limited",
        "Branches, doctors + per-branch schedules, specialties, services, lab tests",
        "Appointments: slot generation, booking, reschedule/cancel, no-show automation",
        "Authenticated, ownership-checked patient document uploads",
      ],
      "Patient app": ["OTP login, branch/doctor browsing (list & map)", "Specialty/service/lab-test discovery with booking", "Reschedule/cancel, appointment history, document upload"],
      "Doctor app": ["Today's + upcoming schedule across branches", "Live per-branch patient queue, synced over WebSockets", "Consultation notes, patient visit history, availability management"],
      "Admin panel": ["Role-aware staff login — super-admin vs branch-admin", "Branch/doctor/staff + specialties/services CRUD", "Walk-in booking flow, analytics dashboard with network map"],
    },
  },
  {
    name: "Go Trimzy",
    tagline: "Premium salon & home-service booking — UI Foundation milestone",
    description:
      "A complete Flutter UI for Customer, Staff, and Admin — 159 files across 80 screens — built feature-first with Clean Architecture and Riverpod. This milestone is UI-only: every screen runs on realistic mock data with no backend wired up yet.",
    status: "In development",
    stack: ["Flutter · Material 3", "Riverpod", "GoRouter", "Clean Architecture"],
    highlights: ["159 files · 80 screens", "All 3 role apps, one codebase", "Mock-data layer ready to swap for a real API"],
    parts: ["Customer app", "Staff app", "Admin panel"],
    features: {
      Architecture: [
        "Feature-first Clean Architecture: domain / data / presentation per feature",
        "go_router StatefulShellRoute for each of the three role shells",
        "Every repository reads from a mock datasource — swap internals for Dio calls to go live",
      ],
      Preview: ['"Preview this milestone" panel jumps straight into the Customer, Staff, or Admin shell', "Full-looking login form included for when the backend lands"],
    },
  },
  {
    name: "GroomGo",
    tagline: "Premium salon & home-service booking — earlier platform",
    description:
      "The predecessor to Go Trimzy — a salon/home-service booking app featuring an in-app AI assistant, Uber-style live tracking, real-time chat, and push notification overlays across all three roles.",
    status: "Earlier build",
    stack: ["Flutter · Material 3", "Riverpod", "Live tracking", "Real-time chat", "Push notifications"],
    parts: ["Customer app", "Staff app", "Admin panel"],
    features: {
      Highlights: ["In-app AI assistant", "Uber-style live staff tracking", "Real-time chat", "Push notification overlays across all three roles"],
    },
  },
];

const STATUS_CLASS = {
  "Completed build": "badge-status--done",
  "In development": "badge-status--dev",
  "Earlier build": "badge-status--earlier",
};

/* ----------------------------------------------------------------
   HOOKS
---------------------------------------------------------------- */

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={`reveal ${shown ? "reveal--shown" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Counter({ target, suffix }) {
  const [ref, shown] = useReveal(0.4);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!shown) return;
    const dur = 1100;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// magnetic pull toward cursor, resets on leave
function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, [strength]);
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  }, []);
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

// subtle 3D tilt following the cursor
function useTilt(max = 7) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
  }, [max]);
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "rotateY(0deg) rotateX(0deg)";
  }, []);
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

/* ----------------------------------------------------------------
   SMALL UI PIECES
---------------------------------------------------------------- */

function RolePill({ text }) {
  const role = roleOf(text);
  const c = ROLE_COLORS[role];
  return (
    <span className="role-pill" style={{ background: c.bg, color: c.fg }}>
      <span className="role-pill__dot" style={{ background: c.fg }} />
      {text}
    </span>
  );
}

function StackChip({ label }) {
  return <span className="highlight-tag">{label}</span>;
}

function StatusBadge({ status }) {
  return <span className={`badge-status ${STATUS_CLASS[status] || "badge-status--earlier"}`}>{status}</span>;
}

/* ----------------------------------------------------------------
   NAV
---------------------------------------------------------------- */

function NavBar({ scrolled, onNav }) {
  const [open, setOpen] = useState(false);
  const hireMag = useMagnetic(0.25);
  const links = [["About", "about"], ["Projects", "projects"], ["Skills", "skills"], ["Contact", "contact"]];
  return (
    <div className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <button onClick={() => onNav("top")} className="nav__logo">Usman<span>.</span>Bhatti</button>
        <div className="nav__links">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => onNav(id)} className="nav__link">{label}</button>
          ))}
          <div className="btn-magnetic" ref={hireMag.ref} onMouseMove={hireMag.onMouseMove} onMouseLeave={hireMag.onMouseLeave}>
            <button onClick={() => onNav("hire")} className="nav__hire">Hire me</button>
          </div>
        </div>
        <button className="nav__burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="nav__mobile">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => { onNav(id); setOpen(false); }} className="nav__mobile-link">{label}</button>
          ))}
          <button onClick={() => { onNav("hire"); setOpen(false); }} className="nav__hire" style={{ textAlign: "center" }}>Hire me</button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   MARQUEE
---------------------------------------------------------------- */

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee">
      <div className="marquee__track">
        {doubled.map((item, i) => (
          <span className="marquee__item" key={i}><span className="marquee__dot" />{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   HERO
---------------------------------------------------------------- */

function RoleStack() {
  const cards = [
    { key: "customer", top: 0, rotate: -7, x: -60 },
    { key: "staff", top: 40, rotate: 3, x: 0 },
    { key: "admin", top: 80, rotate: 10, x: 60 },
  ];
  return (
    <div className="role-stack">
      {cards.map((c, i) => {
        const col = ROLE_COLORS[c.key];
        return (
          <div
            key={c.key}
            className="role-card"
            style={{
              top: `${c.top + 20}px`,
              transform: `translate(calc(-50% + ${c.x}px), 0) rotate(${c.rotate}deg)`,
              zIndex: i,
              animationDelay: `${i * 0.18}s, ${i * 0.5}s`,
            }}
          >
            <div className="role-card__head">
              <span className="role-card__dot" style={{ background: col.fg }} />
              <span className="role-card__label" style={{ color: col.fg }}>{col.label.toUpperCase()}</span>
            </div>
            <div className="role-card__bar" style={{ width: "76%" }} />
            <div className="role-card__bar" style={{ width: "48%" }} />
            <div className="role-card__pill" style={{ background: col.bg }} />
          </div>
        );
      })}
    </div>
  );
}

function Hero({ onNav }) {
  const heroRef = useRef(null);
  const spotRef = useRef(null);
  const magPrimary = useMagnetic(0.2);

  useEffect(() => {
    const el = heroRef.current;
    const spot = spotRef.current;
    if (!el || !spot) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      spot.style.setProperty("--sx", `${e.clientX - r.left}px`);
      spot.style.setProperty("--sy", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="spotlight" ref={spotRef} />
      <div className="hero__inner">
        <div>
          <div className="badge">
            <span className="badge__dot"><span /><span style={{ position: "relative", background: "var(--blue)", borderRadius: "50%", width: 8, height: 8, display: "block" }} /></span>
            <span className="badge__text">Available for full-stack Flutter projects</span>
          </div>

          <h1 className="headline">
            <span className="headline__word" style={{ animationDelay: "0.15s" }}>Building</span>{" "}
            <span className="headline__word headline__gradient" style={{ animationDelay: "0.30s" }}>multi-role</span>{" "}
            <span className="headline__word headline__gradient" style={{ animationDelay: "0.42s" }}>booking</span>{" "}
            <span className="headline__word headline__gradient" style={{ animationDelay: "0.54s" }}>platforms</span>{" "}
            <span className="headline__word" style={{ animationDelay: "0.66s" }}>—</span>{" "}
            <span className="headline__word" style={{ animationDelay: "0.74s" }}>one</span>{" "}
            <span className="headline__word" style={{ animationDelay: "0.82s" }}>Flutter</span>{" "}
            <span className="headline__word" style={{ animationDelay: "0.90s" }}>codebase,</span>{" "}
            <span className="headline__word" style={{ animationDelay: "0.98s" }}>three</span>{" "}
            <span className="headline__word" style={{ animationDelay: "1.06s" }}>apps</span>{" "}
            <span className="headline__word" style={{ animationDelay: "1.14s" }}>every</span>{" "}
            <span className="headline__word" style={{ animationDelay: "1.22s" }}>time.</span>
          </h1>

          <p className="subtext">
            I'm Muhammad Usman Bhatti, a full-stack Flutter developer with 5+ years of experience shipping Customer, Staff &amp; Admin apps on a single feature-first architecture, backed by NestJS + PostgreSQL — built for the Pakistani &amp; South Asian market.
          </p>

          <div className="hero__actions">
            <div className="btn-magnetic" ref={magPrimary.ref} onMouseMove={magPrimary.onMouseMove} onMouseLeave={magPrimary.onMouseLeave}>
              <button onClick={() => onNav("projects")} className="btn-primary">View projects</button>
            </div>
            <a href={`mailto:${PROFILE.email}`} className="btn-ghost">{PROFILE.email}</a>
          </div>

          <div className="chips">
            {HERO_CHIPS.map((c) => <span className="chip" key={c}>{c}</span>)}
          </div>
        </div>

        <RoleStack />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   SHARED SECTION HEAD
---------------------------------------------------------------- */

function SectionHead({ title, subtitle }) {
  return (
    <div className="section-head">
      <h2 className="section-head__title">{title}</h2>
      {subtitle && <p className="section-head__sub">{subtitle}</p>}
    </div>
  );
}

/* ----------------------------------------------------------------
   ABOUT
---------------------------------------------------------------- */

function About() {
  return (
    <section id="about" className="section">
      <SectionHead title="Full-stack, feature-first, role-based." />
      <div className="about">
        <div className="about__text">
          <p>Over the last 5 years I've specialised in a specific kind of hard problem: booking platforms that need to work identically well for three different people — the customer requesting a service, the staff member fulfilling it, and the admin running the business behind it.</p>
          <p>My stack of choice is Flutter with Material 3, Riverpod for state, GoRouter for navigation, and a strict feature-first Clean Architecture — paired with a NestJS + PostgreSQL backend. That combination lets me take a platform from a single Dart codebase to production across Android, iOS and web without splitting logic three ways.</p>
        </div>
        <div className="about__facts">
          {FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 100}>
              <div className="fact">
                <div className="fact__num"><Counter target={f.num} suffix={f.suffix} /></div>
                <div className="fact__label">{f.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   PROJECTS
---------------------------------------------------------------- */

function ProjectCard({ project, delay }) {
  const [open, setOpen] = useState(false);
  const tilt = useTilt(4);

  return (
    <Reveal delay={delay} className="project">
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className={`project__card ${project.flagship ? "project__card--flagship" : ""}`}
        style={{ position: "relative" }}
      >
        <div className="project__glow" />
        <button onClick={() => setOpen((o) => !o)} className="project__trigger">
          <div className="project__top">
            <div>
              <div className="project__title-row">
                <span className="project__name">{project.name}</span>
                {project.flagship && <span className="badge-flagship"><Sparkles size={11} /> FLAGSHIP</span>}
                <StatusBadge status={project.status} />
              </div>
              <p className="project__tagline">{project.tagline}</p>
            </div>
            <div className="project__expand-icon" style={{ transform: open ? "rotate(135deg)" : "rotate(0deg)" }}>+</div>
          </div>

          <p className="project__desc">{project.description}</p>

          <div className="role-pills">
            {project.parts.map((p) => <RolePill key={p} text={p} />)}
          </div>
        </button>

        <div className="project__body-wrap" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
          <div className="project__body">
            <div className="project__body-inner">
              {project.highlights?.length > 0 && (
                <div className="highlight-row">
                  {project.highlights.map((h) => <span className="highlight-tag" key={h}>{h}</span>)}
                </div>
              )}
              <div className="features-grid">
                {Object.entries(project.features).map(([group, items]) => (
                  <div className="feature-group" key={group}>
                    <h4>{group}</h4>
                    <ul>{items.map((it) => <li key={it}>{it}</li>)}</ul>
                  </div>
                ))}
              </div>
              <div className="stack-row">
                {project.stack.map((s) => <StackChip key={s} label={s} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Projects() {
  return (
    <section id="projects" className="section">
      <SectionHead title="Projects" subtitle="Every platform below ships as coordinated apps sharing one backend — the pattern I keep refining project over project." />
      <div style={{ paddingBottom: 16 }}>
        {PROJECTS.map((p, i) => <ProjectCard project={p} key={p.name} delay={Math.min(i, 3) * 70} />)}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   SKILLS
---------------------------------------------------------------- */

function Skills() {
  return (
    <section id="skills" className="section">
      <SectionHead title="Skills" />
      <div className="skills-grid">
        {Object.entries(SKILLS).map(([title, items], i) => (
          <Reveal key={title} delay={i * 90}>
            <div className="skill-col">
              <h3>{title}</h3>
              {items.map((it) => <div className="skill-row" key={it}>{it}</div>)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   FOOTER
---------------------------------------------------------------- */

function Footer() {
  return (
    <section id="contact" className="footer">
      <div className="footer__glow" />
      <div className="footer__inner">
        <Reveal>
          <div className="footer__top">
            <h2 className="footer__title">Have a booking platform in mind? Let's build it in Flutter.</h2>
            <div className="footer__links">
              <a href={`mailto:${PROFILE.email}`} className="footer__link"><Mail size={15} color="var(--ink-faint)" /> {PROFILE.email}</a>
              <a href={`tel:${PROFILE.phoneHref}`} className="footer__link"><Phone size={15} color="var(--ink-faint)" /> {PROFILE.phone}</a>
              <a href={PROFILE.githubHref} target="_blank" rel="noreferrer" className="footer__link"><Github size={15} color="var(--ink-faint)" /> {PROFILE.github}</a>
            </div>
          </div>
          <div className="footer__bottom">
            <span>{PROFILE.name} — {PROFILE.role}</span>
            <span>{PROFILE.location}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   APP ROOT
---------------------------------------------------------------- */

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setShowTop(window.scrollY > 480);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onNav = useCallback((id) => {
    if (id === "top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (id === "hire") { window.location.href = `mailto:${PROFILE.email}`; return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="app">
      <div className="mesh">
        <div className="mesh__blob mesh__blob--1" />
        <div className="mesh__blob mesh__blob--2" />
        <div className="mesh__blob mesh__blob--3" />
      </div>
      <div className="noise" />

      <NavBar scrolled={scrolled} onNav={onNav} />
      <Marquee />
      <Hero onNav={onNav} />
      <About />
      <Projects />
      <Skills />
      <Footer />

      <button
        onClick={() => onNav("top")}
        aria-label="Back to top"
        className="back-top"
        style={{ opacity: showTop ? 1 : 0, pointerEvents: showTop ? "auto" : "none" }}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
