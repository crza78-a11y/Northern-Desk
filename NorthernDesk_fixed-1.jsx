import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ArrowRight, CheckCircle2, Mail, Phone, MapPin,
  Calendar, Inbox, Plane, Briefcase, Home, FolderKanban,
  Users, Shield, Clock, Star, ChevronLeft, ChevronRight,
  Zap, BookOpen, FileText, Layers, Send, ExternalLink,
  TrendingUp, Award, Heart
} from "lucide-react";

/* ─── DESIGN TOKENS ─────────────────────────────────────── */
const C = {
  teal:       "#1e4d45",
  tealMid:    "#2d6b61",
  tealLight:  "#3d8a7d",
  sage:       "#6bada0",
  mist:       "#e8f2f0",
  slate:      "#4a5568",
  slateLight: "#718096",
  parchment:  "#faf9f7",
  white:      "#ffffff",
  ink:        "#1a202c",
  stone:      "#e2e8f0",
  warmGray:   "#f7f6f4",
};

/* ─── FONT INJECTION ────────────────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: ${C.parchment}; color: ${C.ink}; }
    .font-display { font-family: 'Playfair Display', serif; }
    .animate-fade-up { animation: fadeUp 0.7s ease forwards; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    .delay-1 { animation-delay: 0.1s; opacity: 0; }
    .delay-2 { animation-delay: 0.25s; opacity: 0; }
    .delay-3 { animation-delay: 0.4s; opacity: 0; }
    .delay-4 { animation-delay: 0.55s; opacity: 0; }
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(30,77,69,0.12); }
    ::-webkit-scrollbar { width: 6px; } 
    ::-webkit-scrollbar-track { background: ${C.warmGray}; }
    ::-webkit-scrollbar-thumb { background: ${C.sage}; border-radius: 3px; }
    input, textarea, select { outline: none; }
    input:focus, textarea:focus { border-color: ${C.teal} !important; }
  `}</style>
);

/* ─── SCROLL REVEAL HOOK ────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─── NAV ───────────────────────────────────────────────── */
function Nav({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services & Pricing" },
    { id: "contact", label: "Contact" },
  ];

  const go = (id) => { setPage(id); setOpen(false); window.scrollTo(0, 0); };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(250,249,247,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.stone}` : "none",
      transition: "all 0.35s ease",
      padding: scrolled ? "0.9rem 2.5rem" : "1.4rem 2.5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ width: 32, height: 32, background: C.teal, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: 13, fontFamily: "'Playfair Display',serif", fontWeight: 500 }}>N</span>
        </div>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", color: C.ink, fontWeight: 500 }}>Northern<span style={{ color: C.teal }}>Desk</span></span>
      </button>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-nav">
        {links.slice(0, -1).map(l => (
          <button key={l.id} onClick={() => go(l.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.06em",
            color: page === l.id ? C.teal : C.slate,
            borderBottom: page === l.id ? `2px solid ${C.teal}` : "2px solid transparent",
            paddingBottom: "2px", transition: "all 0.2s",
            fontFamily: "'DM Sans',sans-serif",
          }}>{l.label}</button>
        ))}
        <button onClick={() => go("contact")} style={{
          background: C.teal, color: "white", border: "none", cursor: "pointer",
          padding: "0.6rem 1.4rem", borderRadius: 6,
          fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.05em",
          fontFamily: "'DM Sans',sans-serif", transition: "background 0.2s",
        }}
          onMouseEnter={e => e.target.style.background = C.tealMid}
          onMouseLeave={e => e.target.style.background = C.teal}
        >Book Free Call</button>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", cursor: "pointer" }} className="mobile-menu-btn">
        {open ? <X size={22} color={C.ink} /> : <Menu size={22} color={C.ink} />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, bottom: 0,
          background: C.parchment, zIndex: 999, padding: "2rem",
          display: "flex", flexDirection: "column", gap: "1.5rem",
        }}>
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              fontSize: "1.2rem", fontFamily: "'Playfair Display',serif",
              color: page === l.id ? C.teal : C.ink,
            }}>{l.label}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

/* ─── HOME PAGE ─────────────────────────────────────────── */
function HomePage({ setPage }) {
  useReveal();

  const services = [
    { icon: <Inbox size={22} />, title: "Diary & Inbox Management", desc: "Scheduling, triage, prioritisation and lead management. Your inbox under control, your time protected." },
    { icon: <Plane size={22} />, title: "Travel Planning", desc: "End-to-end itineraries, logistics, and contingency planning. Travel that works flawlessly around you." },
    { icon: <Briefcase size={22} />, title: "Business Support", desc: "Documents, research, admin, and social media scheduling. The behind-the-scenes work, done properly." },
    { icon: <Home size={22} />, title: "Lifestyle Management", desc: "Reservations, personal scheduling, home admin, and private PA support for your whole life." },
    { icon: <Users size={22} />, title: "Event Management", desc: "Planning, budgeting, and delivering events - from intimate dinners to high-profile corporate occasions." },
    { icon: <FolderKanban size={22} />, title: "Project Support", desc: "Timelines, coordination, and tracking. Complex projects managed with PRINCE2-level rigour." },
  ];

  const caseStudies = [
    {
      tag: "Case Study 01",
      title: "Founder Diary Overhaul",
      challenge: "Overloaded schedule and constant context switching were costing the founder 2+ hours a day.",
      approach: "Rebuilt diary structure, added buffer zones, created a lead management triage system.",
      result: "Founder reclaimed 10 hours per week and eliminated context-switching anxiety.",
      icon: <Calendar size={28} />,
    },
    {
      tag: "Case Study 02",
      title: "Multi-City Travel Planning",
      challenge: "A complex, shifting itinerary with last-minute client commitments and accommodation gaps.",
      approach: "Created a dynamic itinerary with real-time contingency, coordinated all transport and stays.",
      result: "Zero missed connections. Client arrived to every meeting calm and prepared.",
      icon: <Plane size={28} />,
    },
    {
      tag: "Case Study 03",
      title: "Inbox Management",
      challenge: "300+ daily emails, missed opportunities, and an executive paralysed by their own inbox.",
      approach: "Implemented a triage system, response templates, and priority flags with daily reports.",
      result: "Inbox reduced to under 20 relevant items per day. Three warm leads recovered in week one.",
      icon: <Inbox size={28} />,
    },
  ];

  const [activeCase, setActiveCase] = useState(0);

  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: "100vh", paddingTop: 80,
        background: `linear-gradient(135deg, ${C.teal} 0%, ${C.tealMid} 50%, #1a3d37 100%)`,
        display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Background texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        {/* Decorative circle */}
        <div style={{
          position: "absolute", right: "-10%", top: "10%",
          width: "60vw", height: "60vw", maxWidth: 700,
          borderRadius: "50%", border: `1px solid rgba(255,255,255,0.07)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: "-5%", top: "20%",
          width: "40vw", height: "40vw", maxWidth: 480,
          borderRadius: "50%", border: `1px solid rgba(255,255,255,0.05)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2.5rem", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            <div className="animate-fade-up delay-1" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 20, padding: "0.35rem 1rem", marginBottom: "2rem",
            }}>
              <MapPin size={12} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", fontWeight: 500 }}>MANCHESTER, UK · REMOTE UK-WIDE</span>
            </div>

            <h1 className="animate-fade-up delay-2 font-display" style={{
              fontSize: "clamp(2.8rem,5.5vw,5rem)", fontWeight: 400,
              color: "white", lineHeight: 1.1, marginBottom: "1.5rem",
            }}>
              Hardworking help<br />
              <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.75)" }}>for busy people.</span>
            </h1>

            <p className="animate-fade-up delay-3" style={{
              fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8,
              maxWidth: 520, marginBottom: "2.5rem", fontWeight: 300,
            }}>
              Free up your time. Reduce the admin. Focus on what really matters. Northern Desk provides calm, capable virtual assistance for founders, executives, and high-net-worth individuals.
            </p>

            <div className="animate-fade-up delay-4" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button onClick={() => { setPage("contact"); window.scrollTo(0, 0); }} style={{
                background: "white", color: C.teal, border: "none", cursor: "pointer",
                padding: "0.9rem 2rem", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: "0.5rem",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.mist}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                Book a Free Consultation <ArrowRight size={16} />
              </button>
              <button onClick={() => { setPage("services"); window.scrollTo(0, 0); }} style={{
                background: "transparent", color: "white",
                border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
                padding: "0.9rem 2rem", borderRadius: 8, fontSize: "0.9rem", fontWeight: 500,
                fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                View Services & Pricing
              </button>
            </div>

            {/* Trust bar */}
            <div style={{ display: "flex", gap: "2rem", marginTop: "3.5rem", flexWrap: "wrap" }}>
              {[["20+", "Years Experience"], ["PRINCE2", "Practitioner"], ["5yr", "HNWI Support"]].map(([v, l]) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", color: "white", fontWeight: 500 }}>{v}</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHAOS VS CLARITY */}
      <section style={{ background: C.warmGray, padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>Sound Familiar?</span>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 400, marginTop: "0.75rem", color: C.ink }}>
              From <span style={{ fontStyle: "italic", color: C.teal }}>reactive</span> to <span style={{ fontStyle: "italic", color: C.teal }}>proactive.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="chaos-grid">
            {/* CHAOS */}
            <div className="reveal" style={{
              background: "white", borderRadius: 16, padding: "2.5rem",
              border: `1px solid ${C.stone}`, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#ef4444" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={18} color="#ef4444" />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#ef4444", textTransform: "uppercase", fontWeight: 600 }}>Before Northern Desk</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", fontWeight: 500 }}>The Reactive Morning</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  "60+ unread emails before you've had your first coffee.",
                  "20 minutes of back-and-forth just to book one 30-minute call.",
                  "Sitting in a meeting, distracted: 'Did I book that hotel for tomorrow?'",
                  "It's 6PM and you haven't touched a single meaningful task.",
                  "Evenings lost to formatting reports and chasing invoices.",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fca5a5", marginTop: 7, flexShrink: 0 }} />
                    <p style={{ fontSize: "0.88rem", color: C.slate, lineHeight: 1.65 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CLARITY */}
            <div className="reveal" style={{
              background: C.teal, borderRadius: 16, padding: "2.5rem",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: C.sage }} />
              <div style={{
                position: "absolute", bottom: -40, right: -40,
                width: 180, height: 180, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.07)",
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", fontWeight: 600 }}>With Northern Desk</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", fontWeight: 400, color: "white" }}>The Proactive Day</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
                {[
                  "Wake up to a curated triage report - only what truly needs you.",
                  "Diary blocked, buffered, and protected. No more double-booking.",
                  "Travel fully mapped: check-in links and contingency plans included.",
                  "Deep work uninterrupted. Your calendar works for you, not against you.",
                  "Every recurring process documented in your Northern Desk Vault.",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <CheckCircle2 size={15} color={C.sage} style={{ marginTop: 3, flexShrink: 0 }} />
                    <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.65 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style>{`@media(max-width:768px){.chaos-grid{grid-template-columns:1fr !important;}}`}</style>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={{ background: C.parchment, padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>What I Do</span>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 400, marginTop: "0.75rem", color: C.ink }}>
              Services built around <span style={{ fontStyle: "italic", color: C.teal }}>your day.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="reveal hover-lift" style={{
                background: "white", borderRadius: 12, padding: "2rem",
                border: `1px solid ${C.stone}`, cursor: "default",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: C.mist,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.2rem", color: C.teal,
                }}>{s.icon}</div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.6rem", color: C.ink }}>{s.title}</h3>
                <p style={{ fontSize: "0.85rem", color: C.slateLight, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:1024px){.services-grid{grid-template-columns:repeat(2,1fr) !important;}}@media(max-width:640px){.services-grid{grid-template-columns:1fr !important;}}`}</style>

          <div className="reveal" style={{ textAlign: "center", marginTop: "3rem" }}>
            <button onClick={() => { setPage("services"); window.scrollTo(0, 0); }} style={{
              background: "transparent", color: C.teal, border: `1.5px solid ${C.teal}`,
              cursor: "pointer", padding: "0.85rem 2rem", borderRadius: 8,
              fontSize: "0.88rem", fontWeight: 600, fontFamily: "'DM Sans',sans-serif",
              display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.teal; }}
            >
              View Pricing & Packages <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{ background: C.warmGray, padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>Portfolio Highlights</span>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 400, marginTop: "0.75rem", color: C.ink }}>
              Work in <span style={{ fontStyle: "italic", color: C.teal }}>action.</span>
            </h2>
          </div>

          <div className="reveal" style={{
            background: "white", borderRadius: 16, border: `1px solid ${C.stone}`, overflow: "hidden",
            display: "grid", gridTemplateColumns: "1fr 2fr",
          }} className="case-study-card">

            {/* Tabs */}
            <div style={{ borderRight: `1px solid ${C.stone}`, padding: "2rem 0" }}>
              {caseStudies.map((cs, i) => (
                <button key={i} onClick={() => setActiveCase(i)} style={{
                  width: "100%", textAlign: "left", padding: "1.2rem 2rem",
                  background: activeCase === i ? C.mist : "transparent",
                  border: "none", borderLeft: activeCase === i ? `3px solid ${C.teal}` : "3px solid transparent",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: activeCase === i ? C.teal : C.slateLight, textTransform: "uppercase", fontWeight: 600, marginBottom: "0.3rem" }}>{cs.tag}</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: activeCase === i ? C.teal : C.ink }}>{cs.title}</div>
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ padding: "3rem" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, background: C.mist,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.teal, marginBottom: "1.5rem",
              }}>{caseStudies[activeCase].icon}</div>
              <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.5rem", color: C.ink }}>{caseStudies[activeCase].title}</h3>

              {[
                { label: "Challenge", value: caseStudies[activeCase].challenge, color: "#ef4444" },
                { label: "Approach", value: caseStudies[activeCase].approach, color: C.sage },
                { label: "Result", value: caseStudies[activeCase].result, color: C.teal },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ marginBottom: "1.2rem" }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color, marginBottom: "0.3rem" }}>{label}</div>
                  <p style={{ fontSize: "0.9rem", color: C.slate, lineHeight: 1.7 }}>{value}</p>
                </div>
              ))}
            </div>

            <style>{`@media(max-width:768px){.case-study-card{grid-template-columns:1fr !important;}}`}</style>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ background: C.teal, padding: "5rem 2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <h2 className="font-display reveal" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 400, color: "white", marginBottom: "1rem" }}>
            Ready to make your<br /><span style={{ fontStyle: "italic" }}>workday lighter?</span>
          </h2>
          <p className="reveal" style={{ color: "rgba(255,255,255,0.65)", marginBottom: "2rem", lineHeight: 1.7 }}>Book a free, no-obligation discovery call. Tell me about your day, and I'll tell you exactly how I can help.</p>
          <button className="reveal" onClick={() => { setPage("contact"); window.scrollTo(0, 0); }} style={{
            background: "white", color: C.teal, border: "none", cursor: "pointer",
            padding: "1rem 2.5rem", borderRadius: 8, fontSize: "0.95rem", fontWeight: 600,
            fontFamily: "'DM Sans',sans-serif", display: "inline-flex", alignItems: "center", gap: "0.5rem",
          }}>
            Book Your Free Call <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── ABOUT PAGE ────────────────────────────────────────── */
function AboutPage({ setPage }) {
  useReveal();

  const values = [
    { icon: <Shield size={20} />, title: "Integrity & Discretion", desc: "Trusted with sensitive, high-level information for HNWI clients and C-suite executives." },
    { icon: <Clock size={20} />, title: "Calm Under Pressure", desc: "A steady, unflappable presence that absorbs complexity so you can focus on what matters." },
    { icon: <Star size={20} />, title: "Meticulous Detail", desc: "Every itinerary, document, and process executed with precision and genuine care." },
    { icon: <Heart size={20} />, title: "Genuine Partnership", desc: "I build trust at the pace that suits each client - this is a long-term relationship." },
  ];

  const credentials = [
    { icon: <Award size={18} />, label: "PRINCE2 Practitioner" },
    { icon: <BookOpen size={18} />, label: "BA (Hons) Business Administration" },
    { icon: <Users size={18} />, label: "High Sheriff of Cheshire - Office Management" },
    { icon: <TrendingUp size={18} />, label: "Major renovation project oversight" },
    { icon: <Plane size={18} />, label: "International luxury travel coordination" },
    { icon: <FileText size={18} />, label: "Wellcome Trust - Leadership Research" },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* ABOUT HERO */}
      <section style={{ background: C.warmGray, padding: "5rem 2.5rem 4rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="about-hero-grid">
          <div>
            <span className="reveal" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>About Debbie</span>
            <h1 className="reveal font-display" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.15, marginTop: "0.75rem", marginBottom: "1.5rem", color: C.ink }}>
              Two decades of experience.<br /><span style={{ fontStyle: "italic", color: C.teal }}>One trusted partner.</span>
            </h1>
            <p className="reveal" style={{ fontSize: "1rem", color: C.slate, lineHeight: 1.8, marginBottom: "1.2rem" }}>
              I'm Debbie Jones, the founder of Northern Desk. Based in Didsbury, Manchester, I bring over 20 years of experience across business administration, executive support, project management, event delivery and property management.
            </p>
            <p className="reveal" style={{ fontSize: "1rem", color: C.slate, lineHeight: 1.8, marginBottom: "1.5rem" }}>
              For the past five years I've supported high-net-worth clients with discreet, high-level personal assistance. My background includes managing the High Sheriff of Cheshire's office, coordinating luxury international travel, and overseeing major renovation projects across the UK.
            </p>
            <p className="reveal" style={{ fontSize: "0.9rem", color: C.slateLight, lineHeight: 1.7 }}>
              Outside of work, I'm a wife, mum to two beautiful girls, and owner of one very cherished kitty.
            </p>
          </div>

          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[["20+", "Years of experience"], ["PRINCE2", "Practitioner certified"], ["5yr", "HNWI support"], ["BA Hons", "Business Admin"]].map(([v, l]) => (
                <div key={l} style={{ background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.stone}` }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 500, color: C.teal }}>{v}</div>
                  <div style={{ fontSize: "0.78rem", color: C.slateLight, marginTop: "0.3rem" }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div style={{ background: C.teal, borderRadius: 12, padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, left: 16, fontFamily: "'Playfair Display',serif", fontSize: "5rem", color: "rgba(255,255,255,0.1)", lineHeight: 1 }}>"</div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "1rem", color: "white", lineHeight: 1.7, position: "relative" }}>
                Calm, structured, proactive and intuitive - able to translate vague ideas into clear actions and work independently or collaboratively.
              </p>
            </div>
          </div>

          <style>{`@media(max-width:768px){.about-hero-grid{grid-template-columns:1fr !important; gap:2.5rem !important;}}`}</style>
        </div>
      </section>

      {/* WORKING STYLE */}
      <section style={{ background: C.parchment, padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>Working Style</span>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem,3vw,2.8rem)", fontWeight: 400, marginTop: "0.75rem", color: C.ink }}>
              Why clients <span style={{ fontStyle: "italic", color: C.teal }}>trust me.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem" }} className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="reveal hover-lift" style={{ background: "white", borderRadius: 12, padding: "2rem", border: `1px solid ${C.stone}` }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, marginBottom: "1.2rem" }}>{v.icon}</div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.6rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.83rem", color: C.slateLight, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:1024px){.values-grid{grid-template-columns:repeat(2,1fr) !important;}}@media(max-width:640px){.values-grid{grid-template-columns:1fr !important;}}`}</style>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section style={{ background: C.warmGray, padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="cred-grid">
          <div className="reveal">
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>Background</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 400, marginTop: "0.75rem", marginBottom: "1.5rem", color: C.ink }}>
              A career built on <span style={{ fontStyle: "italic", color: C.teal }}>trust.</span>
            </h2>
            <p style={{ fontSize: "0.95rem", color: C.slate, lineHeight: 1.8 }}>
              Debbie Jones brings a uniquely broad skill set - from managing high-profile county events for the High Sheriff of Cheshire, to overseeing international property portfolios and supporting a Wellcome Trust leadership research initiative. Her PRINCE2 Practitioner qualification underpins a rigorous, structured approach to every project.
            </p>
          </div>
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {credentials.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "1rem",
                background: "white", borderRadius: 10, padding: "1rem 1.5rem",
                border: `1px solid ${C.stone}`,
              }}>
                <div style={{ color: C.teal, flexShrink: 0 }}>{c.icon}</div>
                <span style={{ fontSize: "0.88rem", color: C.slate }}>{c.label}</span>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:768px){.cred-grid{grid-template-columns:1fr !important; gap:2.5rem !important;}}`}</style>
        </div>
      </section>
    </div>
  );
}

/* ─── SERVICES & PRICING PAGE ───────────────────────────── */
function ServicesPage({ setPage }) {
  useReveal();

  const retainers = [
    {
      label: "Starter", hours: "10 hrs/month", price: "£300",
      desc: "Light-touch support for founders and executives who need the basics covered without committing to more.",
      features: ["Inbox triage & prioritisation", "Calendar management", "Email templates setup", "Weekly check-in call"],
      popular: false,
    },
    {
      label: "Partnership", hours: "20 hrs/month · ~1 hr/day", price: "£600",
      desc: "Consistent weekly partnership. Inbox, diary, and admin fully handled - a real operational difference every day.",
      features: ["Everything in Starter", "Travel planning", "Meeting coordination & notes", "Document preparation", "Daily triage report", "SOP documentation"],
      popular: true,
    },
    {
      label: "Embedded", hours: "40 hrs/month · ~2 hrs/day", price: "£1,200",
      desc: "Full embedded support. Northern Desk becomes an integral part of how your operation runs, every single day.",
      features: ["Everything in Partnership", "Board & C-suite support", "Project coordination", "Event management", "Property management", "Personal/lifestyle support", "Full Northern Desk Vault"],
      popular: false,
    },
  ];

  const oneoffs = [
    { name: "Inbox Reset", price: "£250", desc: "2-3 day deep-clean, triage system setup, and email templates configured.", icon: <Inbox size={20} /> },
    { name: "Calendar Rebuild", price: "£150", desc: "Diary structure overhauled, buffer zones added, scheduling optimised.", icon: <Calendar size={20} /> },
    { name: "Travel Package", price: "£100", desc: "Full itinerary, transport, accommodation, and contingency planning.", icon: <Plane size={20} /> },
    { name: "Meeting Pack", price: "£100", desc: "Agenda, notes, and follow-up action list for any key meeting.", icon: <FileText size={20} /> },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* HEADER */}
      <section style={{ background: C.warmGray, padding: "5rem 2.5rem 4rem", textAlign: "center" }}>
        <span className="reveal" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>Services & Pricing</span>
        <h1 className="reveal font-display" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", fontWeight: 400, marginTop: "0.75rem", marginBottom: "1rem", color: C.ink }}>
          Transparent pricing.<br /><span style={{ fontStyle: "italic", color: C.teal }}>No surprises.</span>
        </h1>
        <p className="reveal" style={{ fontSize: "1rem", color: C.slateLight, maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
          Hourly rates from £35/hr (general EA) or £45/hr (C-suite). Minimum 5-hour booking per month. On-site Manchester support: £250/day + travel. Urgent/weekend work: +25%.
        </p>
      </section>

      {/* RETAINERS */}
      <section style={{ background: C.parchment, padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>Monthly Retainers</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 400, marginTop: "0.75rem", color: C.ink }}>
              Best for <span style={{ fontStyle: "italic", color: C.teal }}>ongoing support.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="pricing-grid">
            {retainers.map((r, i) => (
              <div key={i} className="reveal hover-lift" style={{
                borderRadius: 16, padding: "2.5rem",
                border: r.popular ? `2px solid ${C.teal}` : `1px solid ${C.stone}`,
                background: r.popular ? C.teal : "white",
                position: "relative",
              }}>
                {r.popular && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: C.sage, color: "white", fontSize: "0.7rem", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.3rem 1rem", borderRadius: 20,
                  }}>Most Popular</div>
                )}
                <div style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: r.popular ? "rgba(255,255,255,0.6)" : C.sage, marginBottom: "0.5rem" }}>{r.label}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "3rem", fontWeight: 400, color: r.popular ? "white" : C.ink, lineHeight: 1, marginBottom: "0.3rem" }}>{r.price}</div>
                <div style={{ fontSize: "0.8rem", color: r.popular ? "rgba(255,255,255,0.6)" : C.slateLight, marginBottom: "1.2rem" }}>{r.hours}</div>
                <div style={{ height: 1, background: r.popular ? "rgba(255,255,255,0.15)" : C.stone, marginBottom: "1.2rem" }} />
                <p style={{ fontSize: "0.85rem", color: r.popular ? "rgba(255,255,255,0.75)" : C.slate, lineHeight: 1.7, marginBottom: "1.5rem" }}>{r.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
                  {r.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                      <CheckCircle2 size={14} color={r.popular ? C.sage : C.teal} />
                      <span style={{ fontSize: "0.83rem", color: r.popular ? "rgba(255,255,255,0.8)" : C.slate }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setPage("contact"); window.scrollTo(0, 0); }} style={{
                  width: "100%", padding: "0.85rem",
                  background: r.popular ? "white" : C.teal,
                  color: r.popular ? C.teal : "white",
                  border: "none", borderRadius: 8, cursor: "pointer",
                  fontSize: "0.85rem", fontWeight: 600, fontFamily: "'DM Sans',sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                }}>
                  Get Started <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:900px){.pricing-grid{grid-template-columns:1fr !important;}}`}</style>
        </div>
      </section>

      {/* ONE-OFFS */}
      <section style={{ background: C.warmGray, padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>One-Off Services</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 400, marginTop: "0.75rem", color: C.ink }}>
              Need a <span style={{ fontStyle: "italic", color: C.teal }}>quick win?</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem" }} className="oneoff-grid">
            {oneoffs.map((o, i) => (
              <div key={i} className="reveal hover-lift" style={{ background: "white", borderRadius: 12, padding: "2rem", border: `1px solid ${C.stone}` }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, marginBottom: "1rem" }}>{o.icon}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", color: C.teal, fontWeight: 400, marginBottom: "0.3rem" }}>{o.price}</div>
                <h3 style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.5rem" }}>{o.name}</h3>
                <p style={{ fontSize: "0.82rem", color: C.slateLight, lineHeight: 1.7 }}>{o.desc}</p>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:1024px){.oneoff-grid{grid-template-columns:repeat(2,1fr) !important;}}@media(max-width:580px){.oneoff-grid{grid-template-columns:1fr !important;}}`}</style>
        </div>
      </section>

      {/* SOP VAULT */}
      <section style={{ background: C.parchment, padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="vault-grid">
          <div className="reveal">
            <div style={{ width: 52, height: 52, borderRadius: 12, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, marginBottom: "1.5rem" }}>
              <Layers size={26} />
            </div>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>The Northern Desk Vault</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 400, marginTop: "0.75rem", marginBottom: "1.2rem", color: C.ink }}>
              We don't just <em style={{ fontStyle: "italic", color: C.teal }}>do</em> tasks.<br />We <em style={{ fontStyle: "italic", color: C.teal }}>document</em> them.
            </h2>
            <p style={{ fontSize: "0.95rem", color: C.slate, lineHeight: 1.8, marginBottom: "1rem" }}>
              Most busy leaders carry their business processes in their heads - creating a bottleneck where the business can't function without them. Northern Desk doesn't just execute tasks; we document them into your Vault.
            </p>
            <p style={{ fontSize: "0.95rem", color: C.slate, lineHeight: 1.8 }}>
              Every recurring process - from how you like your travel booked to how invoices are raised - becomes a Standard Operating Procedure, stored securely and ready to scale.
            </p>
          </div>
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {[
              { step: "01", title: "Process Audit", desc: "In the first 30 days, we identify the 5 most frequent recurring tasks in your professional life." },
              { step: "02", title: "Step-by-Step Documentation", desc: "Using Notion and Scribe, we map out the gold standard for how each task should be completed." },
              { step: "03", title: "Your Northern Desk Vault", desc: "All SOPs stored in a secure, shared folder - your operation's brain, on paper and ready to scale." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "1.2rem", background: "white", borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.stone}` }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: C.sage, fontWeight: 400, lineHeight: 1, minWidth: "2.5rem" }}>{s.step}</div>
                <div>
                  <h4 style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.3rem" }}>{s.title}</h4>
                  <p style={{ fontSize: "0.82rem", color: C.slateLight, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:768px){.vault-grid{grid-template-columns:1fr !important; gap:2.5rem !important;}}`}</style>
        </div>
      </section>
    </div>
  );
}

/* ─── CONTACT PAGE ──────────────────────────────────────── */
function ContactPage() {
  useReveal();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", interest: "", message: "" });

  const steps = [
    { num: "01", title: "Discovery Call", desc: "A free, no-obligation call to understand your needs and working style." },
    { num: "02", title: "Tools & Access Setup", desc: "Platforms and communication agreed - everything fits your existing workflow." },
    { num: "03", title: "Trial Week", desc: "A low-risk week to test the partnership and ensure the fit is right." },
    { num: "04", title: "Workflow Refinement", desc: "Review, fine-tune, and document your preferences into clear SOPs." },
    { num: "05", title: "Ongoing Support", desc: "Settled into a rhythm that protects your time - daily or weekly check-ins." },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ background: C.warmGray, padding: "5rem 2.5rem 4rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span className="reveal" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>Get In Touch</span>
          <h1 className="reveal font-display" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", fontWeight: 400, marginTop: "0.75rem", marginBottom: "0.5rem", color: C.ink }}>
            Let's make your workday <span style={{ fontStyle: "italic", color: C.teal }}>lighter.</span>
          </h1>
          <p className="reveal" style={{ fontSize: "1rem", color: C.slateLight, maxWidth: 520, lineHeight: 1.8 }}>
            Book a free, no-commitment consultation. Tell me about your day, and I'll show you exactly how I can help.
          </p>
        </div>
      </section>

      {/* ONBOARDING PROCESS */}
      <section style={{ background: C.parchment, padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 600 }}>How It Works</span>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 400, marginTop: "0.75rem", color: C.ink }}>
              Getting started is <span style={{ fontStyle: "italic", color: C.teal }}>simple.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "1rem", position: "relative" }} className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="reveal" style={{ position: "relative" }}>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: 20, left: "60%", right: "-40%", height: 1, background: C.stone, zIndex: 0 }} className="step-connector" />
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.85rem", color: "white" }}>{s.num}</span>
                  </div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>{s.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: C.slateLight, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:900px){.steps-grid{grid-template-columns:1fr !important;}.step-connector{display:none !important;}}`}</style>
        </div>
      </section>

      {/* FORM + DETAILS */}
      <section style={{ background: C.warmGray, padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "5rem", alignItems: "start" }} className="contact-grid">

          {/* Contact details */}
          <div className="reveal">
            <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "2rem", color: C.ink }}>Contact Details</h3>
            {[
              { icon: <Mail size={18} />, label: "Email", value: "hello@northerndesk.co.uk", href: "mailto:hello@northerndesk.co.uk" },
              { icon: <Phone size={18} />, label: "Phone", value: "07500 008828", href: "tel:07500008828" },
              { icon: <MapPin size={18} />, label: "Location", value: "Didsbury, Manchester · Remote UK-wide" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.slateLight, fontWeight: 600, marginBottom: "0.2rem" }}>{c.label}</div>
                  {c.href
                    ? <a href={c.href} style={{ fontSize: "0.92rem", color: C.teal, textDecoration: "none", fontWeight: 500 }}>{c.value}</a>
                    : <span style={{ fontSize: "0.92rem", color: C.slate }}>{c.value}</span>
                  }
                </div>
              </div>
            ))}

            <div style={{ background: C.teal, borderRadius: 12, padding: "1.5rem", marginTop: "2rem" }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "white", fontSize: "0.95rem", lineHeight: 1.7 }}>
                "Free, no-commitment consultation - tell me about your day and I'll show you how I can help."
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="reveal" style={{ background: "white", borderRadius: 16, padding: "2.5rem", border: `1px solid ${C.stone}` }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: C.teal }}>
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "0.75rem", color: C.ink }}>Message sent!</h3>
                <p style={{ color: C.slateLight, fontSize: "0.9rem", lineHeight: 1.7 }}>Thank you for reaching out. Debbie will be in touch shortly to arrange your free discovery call.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 400, marginBottom: "1.8rem", color: C.ink }}>Send a message</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  {[
                    { label: "Your Name", key: "name", placeholder: "Firstname Lastname", type: "text" },
                    { label: "Email Address", key: "email", placeholder: "you@company.com", type: "email" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.slateLight, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>{f.label}</label>
                      <input
                        type={f.type} placeholder={f.placeholder} value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: "100%", padding: "0.75rem 1rem", border: `1px solid ${C.stone}`, borderRadius: 8, fontSize: "0.9rem", fontFamily: "'DM Sans',sans-serif", background: C.parchment, color: C.ink, transition: "border-color 0.2s" }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.slateLight, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>I'm Interested In</label>
                  <select value={form.interest} onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem 1rem", border: `1px solid ${C.stone}`, borderRadius: 8, fontSize: "0.9rem", fontFamily: "'DM Sans',sans-serif", background: C.parchment, color: form.interest ? C.ink : C.slateLight }}>
                    <option value="">Select a service...</option>
                    <option>Monthly Retainer - Starter (£300/10hrs)</option>
                    <option>Monthly Retainer - Partnership (£600/20hrs)</option>
                    <option>Monthly Retainer - Embedded (£1200/40hrs)</option>
                    <option>Inbox Reset (£250)</option>
                    <option>Calendar Rebuild (£150)</option>
                    <option>Travel Planning Package (£100)</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.slateLight, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Tell me about your situation</label>
                  <textarea rows={4} placeholder="What's taking up most of your time right now?" value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem 1rem", border: `1px solid ${C.stone}`, borderRadius: 8, fontSize: "0.9rem", fontFamily: "'DM Sans',sans-serif", background: C.parchment, color: C.ink, resize: "none", transition: "border-color 0.2s" }} />
                </div>
                <button onClick={() => setSent(true)} style={{
                  width: "100%", padding: "1rem", background: C.teal, color: "white",
                  border: "none", borderRadius: 8, fontSize: "0.95rem", fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif", cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = C.tealMid}
                  onMouseLeave={e => e.currentTarget.style.background = C.teal}
                >
                  Send Message <Send size={16} />
                </button>
              </>
            )}
          </div>
          <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr !important; gap:2.5rem !important;}}`}</style>
        </div>
      </section>
    </div>
  );
}

/* ─── FOOTER ────────────────────────────────────────────── */
function Footer({ setPage }) {
  return (
    <footer style={{ background: C.ink, color: "rgba(255,255,255,0.45)", padding: "3rem 2.5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
              <div style={{ width: 28, height: 28, background: C.teal, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 11, fontFamily: "'Playfair Display',serif" }}>N</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", color: "rgba(255,255,255,0.8)" }}>NorthernDesk</span>
            </div>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.7, maxWidth: 260 }}>Clarity. Calm. Reliable support for founders, executives, and high-net-worth individuals.</p>
          </div>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem", fontWeight: 600 }}>Pages</div>
              {["home", "about", "services", "contact"].map(p => (
                <button key={p} onClick={() => { setPage(p); window.scrollTo(0, 0); }} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem", fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize", padding: 0, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "white"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{p === "services" ? "Services & Pricing" : p.charAt(0).toUpperCase() + p.slice(1)}</button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem", fontWeight: 600 }}>Contact</div>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>hello@northerndesk.co.uk</p>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>07500 008828</p>
              <p style={{ fontSize: "0.85rem" }}>Didsbury, Manchester</p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.78rem" }}>© 2025 Northern Desk · All rights reserved.</span>
          <span style={{ fontSize: "0.78rem" }}>Clarity. Calm. Reliable support.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ───────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <FontStyle />
      <Nav page={page} setPage={setPage} />
      {page === "home"     && <HomePage setPage={setPage} />}
      {page === "about"    && <AboutPage setPage={setPage} />}
      {page === "services" && <ServicesPage setPage={setPage} />}
      {page === "contact"  && <ContactPage />}
      <Footer setPage={setPage} />
    </>
  );
}
