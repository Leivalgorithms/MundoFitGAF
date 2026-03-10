import { useState, useEffect } from "react";
import { useProductos } from './lib/useProductos';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Page = "home" | "services" | "about" | "catalog" | "contact";

interface NavItem {
  label: string;
  page: Page;
}

interface BreadcrumbItem {
  label: string;
  page?: Page;
}

interface ServiceItem {
  emoji: string;
  title: string;
  desc: string;
  tag: string;
}

interface SocialLink {
  icon: string;
  label: string;
  url: string;
}

interface ValueItem {
  icon: string;
  title: string;
  desc: string;
}

// ─── THEME & TOKENS ───────────────────────────────────────────────────────────
const THEME = {
  primary: "#ba0202",      // rojo Mundo Fit
  primaryDark: "#C02A12",
  secondary: "#111111",    // negro profundo
  accent: "#ba0202",       // rojo como acento también
  bg: "#0A0A0A",           // negro base
  surface: "#141414",      // negro superficie
  surfaceLight: "#1F1F1F", // negro claro
  text: "#F5F5F5",         // blanco suave
  textMuted: "#888888",    // gris medio
  border: "#2A2A2A",       // borde oscuro
  white: "#FFFFFF",
  whatsapp: "#25D366",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: ${THEME.primary};
    --primary-dark: ${THEME.primaryDark};
    --secondary: ${THEME.secondary};
    --accent: ${THEME.accent};
    --bg: ${THEME.bg};
    --surface: ${THEME.surface};
    --surface-light: ${THEME.surfaceLight};
    --text: ${THEME.text};
    --text-muted: ${THEME.textMuted};
    --border: ${THEME.border};
    --white: ${THEME.white};
    --whatsapp: ${THEME.whatsapp};
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text);
    font-size: 16px;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 3px; }

  /* ── NAVBAR ── */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transition: var(--transition);
  }
  .navbar.scrolled {
    background: rgba(10,10,10,0.98);
    box-shadow: 0 2px 24px rgba(0,0,0,0.6);
  }
  .nav-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
    height: 68px;
  }
  .logo {
    font-family: var(--font-display);
    font-size: 28px; letter-spacing: 2px;
    color: var(--white); text-decoration: none;
    display: flex; align-items: center; gap: 8px;
    cursor: pointer;
  }
  .logo span { color: var(--primary); }
  .logo-icon {
    width: 36px; height: 36px;
    background: var(--primary);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .nav-links {
    display: flex; align-items: center; gap: 4px;
    list-style: none;
  }
  .nav-links a, .nav-links button {
    font-family: var(--font-body);
    font-size: 14px; font-weight: 500; letter-spacing: 0.5px;
    color: var(--text-muted);
    text-decoration: none; background: none; border: none; cursor: pointer;
    padding: 8px 14px; border-radius: var(--radius);
    transition: var(--transition);
  }
  .nav-links a:hover, .nav-links button:hover,
  .nav-links a.active, .nav-links button.active {
    color: var(--white);
    background: var(--surface-light);
  }
  .nav-cta {
    background: var(--primary) !important;
    color: var(--white) !important;
    font-weight: 600 !important;
    padding: 8px 20px !important;
  }
  .nav-cta:hover { background: var(--primary-dark) !important; }

  .hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    background: none; border: none; padding: 8px;
  }
  .hamburger span {
    display: block; width: 24px; height: 2px;
    background: var(--text); border-radius: 2px;
    transition: var(--transition);
  }
  .mobile-menu {
    display: none; flex-direction: column; gap: 2px;
    padding: 12px 24px 20px;
    border-top: 1px solid var(--border);
    background: rgba(10,10,10,0.98);
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a, .mobile-menu button {
    font-size: 15px; font-weight: 500;
    color: var(--text-muted); text-decoration: none;
    background: none; border: none; cursor: pointer; text-align: left;
    padding: 12px 16px; border-radius: var(--radius);
    transition: var(--transition);
  }
  .mobile-menu a:hover, .mobile-menu button:hover { color: var(--white); background: var(--surface-light); }

  /* ── BREADCRUMB ── */
  .breadcrumb {
    max-width: 1200px; margin: 0 auto;
    padding: 14px 24px;
    display: flex; align-items: center; gap: 8px;
    font-size: 14px; color: var(--text-muted);
  }
  .breadcrumb a, .breadcrumb button {
    color: var(--text-muted); text-decoration: none; background: none; border: none; cursor: pointer;
    font-size: 14px; padding: 0;
    transition: var(--transition);
  }
  .breadcrumb a:hover, .breadcrumb button:hover { color: var(--primary); }
  .breadcrumb .sep { color: var(--border); }
  .breadcrumb .current { color: var(--text); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #0A0A0A 0%, #141414 50%, #0A0A0A 100%);
    padding-top: 68px;
  }
  .hero-bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(232,53,26,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232,53,26,0.06) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridMove 20s linear infinite;
  }
  @keyframes gridMove {
    0% { transform: translate(0,0); }
    100% { transform: translate(60px,60px); }
  }
  .hero-glow {
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(232,53,26,0.15) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .hero-content {
    position: relative; z-index: 2;
    max-width: 1200px; margin: 0 auto;
    padding: 80px 24px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,53,26,0.1); border: 1px solid rgba(232,53,26,0.3);
    border-radius: 100px; padding: 6px 16px;
    font-size: 13px; font-weight: 500; color: var(--primary);
    margin-bottom: 24px;
    animation: fadeUp 0.6s ease forwards;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(52px, 7vw, 88px);
    line-height: 0.95; letter-spacing: 2px;
    color: var(--white);
    animation: fadeUp 0.7s ease forwards;
  }
  .hero-title .highlight {
    color: var(--primary);
    display: block;
  }
  .hero-sub {
    font-size: 18px; line-height: 1.6;
    color: var(--text-muted);
    margin: 24px 0 36px;
    max-width: 480px;
    animation: fadeUp 0.8s ease forwards;
  }
  .hero-actions {
    display: flex; gap: 16px; flex-wrap: wrap;
    animation: fadeUp 0.9s ease forwards;
  }
  .btn-primary {
    background: var(--primary);
    color: var(--white);
    border: none; cursor: pointer;
    padding: 14px 32px; border-radius: var(--radius);
    font-family: var(--font-body);
    font-size: 15px; font-weight: 600;
    letter-spacing: 0.5px;
    transition: var(--transition);
    display: flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,53,26,0.4); }
  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border); cursor: pointer;
    padding: 14px 32px; border-radius: var(--radius);
    font-family: var(--font-body);
    font-size: 15px; font-weight: 500;
    transition: var(--transition);
  }
  .btn-outline:hover { border-color: var(--text); background: rgba(255,255,255,0.05); }

  .hero-visual {
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .hero-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    animation: fadeIn 1s ease forwards;
  }
  .hero-stats {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;
  }
  .stat-box {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    text-align: center;
  }
  .stat-num {
    font-family: var(--font-display);
    font-size: 36px; color: var(--primary);
    letter-spacing: 1px;
  }
  .stat-label {
    font-size: 13px; color: var(--text-muted);
    margin-top: 4px;
  }
  .hero-brands {
    border-top: 1px solid var(--border); padding-top: 20px;
    text-align: center;
  }
  .hero-brands p { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
  .brand-pills {
    display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
  }
  .brand-pill {
    background: var(--surface-light);
    border: 1px solid var(--border);
    border-radius: 100px; padding: 4px 14px;
    font-size: 13px; font-weight: 500; color: var(--text-muted);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ── SHOWROOM SECTION ── */
  .showroom {
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 80px 24px;
  }
  .showroom-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  .section-label {
    font-size: 12px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
    color: var(--primary); margin-bottom: 12px;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 4vw, 54px);
    line-height: 1; letter-spacing: 1px;
    color: var(--white); margin-bottom: 20px;
  }
  .section-desc {
    font-size: 16px; line-height: 1.7; color: var(--text-muted);
    margin-bottom: 32px;
  }
  .info-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .info-card-header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    padding: 20px 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .info-card-header h3 {
    font-family: var(--font-display);
    font-size: 22px; letter-spacing: 1px; color: var(--white);
  }
  .info-card-body { padding: 0; }
  .info-row {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    transition: var(--transition);
  }
  .info-row:last-child { border-bottom: none; }
  .info-row:hover { background: rgba(255,255,255,0.02); }
  .info-icon {
    width: 40px; height: 40px; flex-shrink: 0;
    background: rgba(232,53,26,0.12);
    border: 1px solid rgba(232,53,26,0.2);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .info-text h4 {
    font-size: 13px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  .info-text p { font-size: 15px; color: var(--text); line-height: 1.5; }

  .map-placeholder {
    background: var(--surface-light);
    border: 1px solid var(--border);
    border-radius: 12px;
    height: 280px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; color: var(--text-muted);
    position: relative; overflow: hidden;
    margin-top: 20px;
  }
  .map-pin { font-size: 40px; animation: bounce 2s ease infinite; }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .map-label { font-size: 14px; font-weight: 500; }
  .map-sub { font-size: 13px; color: var(--text-muted); }

  /* ── SERVICES ── */
  .services { padding: 80px 24px; background: var(--bg); }
  .services-inner { max-width: 1200px; margin: 0 auto; }
  .section-header { text-align: center; margin-bottom: 56px; }
  .services-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
    gap: 20px;
  }
  .service-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 32px;
    transition: var(--transition);
    position: relative; overflow: hidden;
    cursor: default;
  }
  .service-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    transform: scaleX(0); transition: var(--transition);
    transform-origin: left;
  }
  .service-card:hover { border-color: rgba(232,53,26,0.3); transform: translateY(-4px); box-shadow: var(--shadow); }
  .service-card:hover::before { transform: scaleX(1); }
  .service-emoji { font-size: 40px; margin-bottom: 20px; display: block; }
  .service-card h3 {
    font-family: var(--font-display);
    font-size: 22px; letter-spacing: 0.5px; color: var(--white);
    margin-bottom: 12px;
  }
  .service-card p { font-size: 15px; line-height: 1.6; color: var(--text-muted); }
  .service-tag {
    display: inline-block; margin-top: 16px;
    background: rgba(232,53,26,0.1);
    border: 1px solid rgba(232,53,26,0.2);
    border-radius: 100px; padding: 4px 12px;
    font-size: 12px; color: var(--primary); font-weight: 500;
  }

  /* ── ABOUT ── */
  .about { padding: 80px 24px; background: var(--surface); }
  .about-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  .about-values { display: flex; flex-direction: column; gap: 16px; margin-top: 32px; }
  .value-item {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 20px; background: var(--bg);
    border: 1px solid var(--border); border-radius: var(--radius);
    transition: var(--transition);
  }
  .value-item:hover { border-color: rgba(232,53,26,0.3); }
  .value-icon {
    width: 44px; height: 44px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .value-item h4 { font-size: 15px; font-weight: 600; color: var(--white); margin-bottom: 4px; }
  .value-item p { font-size: 14px; color: var(--text-muted); line-height: 1.5; }

  .team-card {
    background: var(--bg);
    border: 1px solid var(--border); border-radius: 16px;
    overflow: hidden;
  }
  .team-header {
    background: linear-gradient(135deg, #1F1F1F 0%, #0A0A0A 100%);
    padding: 40px; text-align: center;
    position: relative;
  }
  .team-logo-big {
    width: 80px; height: 80px; margin: 0 auto 16px;
    background: var(--primary);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
    box-shadow: 0 8px 32px rgba(232,53,26,0.4);
  }
  .team-header h3 {
    font-family: var(--font-display);
    font-size: 28px; color: var(--white); letter-spacing: 2px;
  }
  .team-header p { font-size: 14px; color: var(--text-muted); margin-top: 6px; }
  .team-body { padding: 24px; }
  .team-stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .team-stat {
    text-align: center; padding: 16px;
    background: var(--surface); border-radius: var(--radius);
  }
  .team-stat .num {
    font-family: var(--font-display);
    font-size: 28px; color: var(--primary); letter-spacing: 1px;
  }
  .team-stat .lbl { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  /* ── SOCIAL BAR ── */
  .social-bar {
    background: var(--bg);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 20px 24px;
  }
  .social-bar-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
  }
  .social-bar p { font-size: 14px; color: var(--text-muted); }
  .social-links { display: flex; gap: 8px; }
  .social-btn {
    width: 40px; height: 40px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; text-decoration: none;
    transition: var(--transition);
    color: var(--text-muted);
  }
  .social-btn:hover { background: var(--primary); border-color: var(--primary); color: var(--white); }

  /* ── FOOTER ── */
  .footer {
    background: #050505;
    border-top: 1px solid var(--border);
    padding: 60px 24px 24px;
  }
  .footer-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid var(--border);
  }
  .footer-brand p {
    font-size: 15px; line-height: 1.7; color: var(--text-muted);
    margin-top: 16px; max-width: 280px;
  }
  .footer-col h4 {
    font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 20px;
  }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-col ul li a, .footer-col ul li button {
    font-size: 14px; color: var(--text-muted);
    text-decoration: none; background: none; border: none; cursor: pointer; padding: 0;
    transition: var(--transition);
  }
  .footer-col ul li a:hover, .footer-col ul li button:hover { color: var(--white); }
  .footer-bottom {
    max-width: 1200px; margin: 24px auto 0;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
    font-size: 13px; color: var(--text-muted);
  }
  .footer-bottom a { color: var(--text-muted); text-decoration: none; }
  .footer-bottom a:hover { color: var(--primary); }

  /* ── WHATSAPP FLOAT ── */
  .wa-float {
    position: fixed; bottom: 28px; right: 28px; z-index: 200;
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
  }
  .wa-tooltip {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 14px;
    font-size: 13px; color: var(--text);
    white-space: nowrap;
    animation: fadeIn 0.3s ease;
    box-shadow: var(--shadow);
  }
  .wa-btn {
    width: 58px; height: 58px;
    background: var(--whatsapp);
    border-radius: 50%; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    box-shadow: 0 4px 20px rgba(37,211,102,0.4);
    transition: var(--transition);
    animation: pulse 3s ease infinite;
  }
  .wa-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.6); }
  @keyframes pulse {
    0%,100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
    50% { box-shadow: 0 4px 32px rgba(37,211,102,0.7); }
  }

  /* ── PAGE WRAPPER ── */
  .page { padding-top: 68px; min-height: 100vh; }
  .page-hero {
    background: linear-gradient(135deg, #1F1F1F 0%, #0A0A0A 100%);
    padding: 60px 24px;
    border-bottom: 1px solid var(--border);
  }
  .page-hero-inner {
    max-width: 1200px; margin: 0 auto;
  }
  .page-hero h1 {
    font-family: var(--font-display);
    font-size: clamp(40px, 5vw, 64px);
    color: var(--white); letter-spacing: 2px;
  }
  .page-hero h1 span { color: var(--primary); }
  .page-hero p {
    font-size: 17px; color: var(--text-muted);
    margin-top: 12px; max-width: 600px; line-height: 1.6;
  }
  .page-body { max-width: 1200px; margin: 0 auto; padding: 60px 24px; }

  /* ── ABOUT PAGE ── */
  .about-full { max-width: 1200px; margin: 0 auto; padding: 60px 24px; }
  .about-intro-grid {
    display: grid; grid-template-columns: 3fr 2fr; gap: 48px;
    margin-bottom: 64px; align-items: start;
  }
  .about-intro-text h2 {
    font-family: var(--font-display);
    font-size: 36px; color: var(--white); letter-spacing: 1px; margin-bottom: 20px;
  }
  .about-intro-text p {
    font-size: 16px; line-height: 1.8; color: var(--text-muted);
    margin-bottom: 16px;
  }
  .highlight-box {
    background: linear-gradient(135deg, rgba(232,53,26,0.1), rgba(232,53,26,0.05));
    border: 1px solid rgba(232,53,26,0.2);
    border-radius: 12px; padding: 28px;
  }
  .highlight-box h3 {
    font-family: var(--font-display);
    font-size: 20px; color: var(--primary); letter-spacing: 1px;
    margin-bottom: 16px;
  }
  .highlight-box ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .highlight-box ul li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 15px; color: var(--text);
  }
  .highlight-box ul li::before {
    content: '▸'; color: var(--primary); flex-shrink: 0; margin-top: 1px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .hero-content { grid-template-columns: 1fr; gap: 40px; }
    .hero-visual { display: none; }
    .showroom-inner { grid-template-columns: 1fr; gap: 40px; }
    .about-inner { grid-template-columns: 1fr; gap: 40px; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .about-intro-grid { grid-template-columns: 1fr; }
    .services-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .hero-title { font-size: 46px; }
    .footer-grid { grid-template-columns: 1fr; }
    .hero-stats { grid-template-columns: 1fr 1fr; }
    .services-grid { grid-template-columns: 1fr; }
    .team-stat-row { grid-template-columns: 1fr; }
    .hero-actions { flex-direction: column; }
    .btn-primary, .btn-outline { width: 100%; justify-content: center; }
    .wa-float { bottom: 16px; right: 16px; }
  }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV_LINKS: NavItem[] = [
  { label: "Inicio", page: "home" },
  { label: "Catálogo", page: "catalog" },
  { label: "Servicios", page: "services" },
  { label: "Sobre Nosotros", page: "about" },
  { label: "Contacto", page: "contact" },
];

const SERVICES: ServiceItem[] = [
  { emoji: "🏋️", title: "VENTA DE EQUIPOS", desc: "Contamos con una amplia gama de equipos de gimnasio profesionales y para uso doméstico, de las mejores marcas del mercado.", tag: "Catálogo disponible" },
  { emoji: "🚚", title: "TRANSPORTE", desc: "Servicio de transporte especializado para equipos de gimnasio a todo Costa Rica, con personal capacitado para el manejo de carga.", tag: "Todo el país" },
  { emoji: "🔧", title: "ENTREGA ARMADA", desc: "Nuestro equipo técnico instala y arma los equipos en el lugar indicado, garantizando un montaje correcto y seguro.", tag: "Incluye instalación" },
  { emoji: "📦", title: "SERVICIO DE APARTADO", desc: "¿No tienes el total del monto? Reserva el equipo que deseas con un abono inicial y págalo en cómodas cuotas.", tag: "Facilidades de pago" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { icon: "📘", label: "Facebook", url: "#" },
  { icon: "📷", label: "Instagram", url: "#" },
  { icon: "▶️", label: "YouTube", url: "#" },
  { icon: "🐦", label: "TikTok", url: "#" },
];

const FOOTER_LINKS: Record<string, string[]> = {
  "Empresa": ["Sobre Nosotros", "Servicios", "Sala de Exhibición", "Blog"],
  "Catálogo": ["Cardio", "Pesas y Fuerza", "Accesorios", "Máquinas Multifunción"],
  "Soporte": ["Contacto", "Preguntas Frecuentes", "Garantías", "Cotizaciones"],
};

const VALUES: ValueItem[] = [
  { icon: "🏆", title: "Calidad garantizada", desc: "Todos nuestros equipos pasan por un riguroso control de calidad antes de llegar a tus manos." },
  { icon: "💪", title: "Experiencia comprobada", desc: "Más de 10 años equipando gimnasios y hogares en Costa Rica." },
  { icon: "🤝", title: "Atención personalizada", desc: "Te asesoramos para encontrar el equipo perfecto según tus necesidades y presupuesto." },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ currentPage, setPage }: { currentPage: Page; setPage: (page: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="logo" onClick={() => setPage("home")}>
          MUNDO<span>FIT</span>
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map(l => (
            <li key={l.page}>
              <button
                className={currentPage === l.page ? "active" : ""}
                onClick={() => setPage(l.page)}
              >{l.label}</button>
            </li>
          ))}
          <li>
            <button className="nav-cta" onClick={() => setPage("catalog")}>Ver Catálogo</button>
          </li>
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map(l => (
          <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }}>{l.label}</button>
        ))}
      </div>
    </nav>
  );
}

function Breadcrumb({ items, setPage }: { items: BreadcrumbItem[]; setPage: (page: Page) => void }) {
  return (
    <div className="breadcrumb">
      <button onClick={() => setPage("home")}>Inicio</button>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="sep">›</span>
          {item.page
            ? <button onClick={() => setPage(item.page as Page)}>{item.label}</button>
            : <span className="current">{item.label}</span>
          }
        </span>
      ))}
    </div>
  );
}

function WhatsAppFloat() {
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShowTip(true), 2500);
    const t2 = setTimeout(() => setShowTip(false), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className="wa-float">
      {showTip && <div className="wa-tooltip">💬 ¡Contáctanos por WhatsApp!</div>}
      <button
        className="wa-btn"
        onClick={() => window.open("https://wa.me/50600000000?text=Hola%2C%20me%20interesa%20conocer%20sus%20equipos%20de%20gimnasio.", "_blank")}
        title="Contactar por WhatsApp"
      >💬</button>
    </div>
  );
}

function SocialBar() {
  return (
    <div className="social-bar">
      <div className="social-bar-inner">
        <p>Síguenos en redes sociales</p>
        <div className="social-links">
          {SOCIAL_LINKS.map(s => (
            <a key={s.label} href={s.url} className="social-btn" title={s.label}>{s.icon}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo" style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
            MUNDO<span style={{ color: THEME.primary }}>FIT</span>
          </div>
          <p>Tu destino en Costa Rica para equipos de gimnasio de alta calidad. Venta, transporte, entrega armada y servicio de apartado.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.url} className="social-btn">{s.icon}</a>
            ))}
          </div>
        </div>
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div className="footer-col" key={heading}>
            <h4>{heading}</h4>
            <ul>
              {links.map(link => (
                <li key={link}><button onClick={() => {}}>{link}</button></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2026 Mundo Fit. Todos los derechos reservados.</span>
        <span style={{ display: "flex", gap: 20 }}>
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos y Condiciones</a>
        </span>
      </div>
    </footer>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function HomePage({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div>
            <div className="hero-badge">
              <span>🇨🇷</span> Costa Rica #1 en Equipos de Gimnasio
            </div>
            <h1 className="hero-title">
              EQUIPA TU
              <span className="highlight">GIM&shy;NA&shy;SIO</span>
            </h1>
            <p className="hero-sub">
              Los mejores equipos de fitness para uso comercial y doméstico.
              Venta, transporte, entrega armada y servicio de apartado en todo Costa Rica.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setPage("catalog")}>
                Ver Catálogo
              </button>
              <button className="btn-outline" onClick={() => setPage("contact")}>
                Solicitar Cotización
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-stats">
                {([["500+", "Productos"], ["10+", "Años"], ["98%", "Satisfacción"], ["CR", "Cobertura"]] as [string, string][]).map(([n, l]) => (
                  <div className="stat-box" key={l}>
                    <div className="stat-num">{n}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </div>
              <div className="hero-brands">
                <p>MARCAS DISPONIBLES</p>
                <div className="brand-pills">
                  {["Body-Solid", "Life Fitness", "TechnoGym", "Precor", "Matrix"].map(b => (
                    <span className="brand-pill" key={b}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="showroom">
        <div className="showroom-inner">
          <div>
            <div className="section-label">📍 Sala de Exhibición</div>
            <h2 className="section-title">VISÍTANOS EN PERSONA</h2>
            <p className="section-desc">
              Contamos con una sala de exhibición donde puedes ver, tocar y probar los equipos antes de comprar.
              Nuestro equipo de asesores está listo para guiarte.
            </p>
            <div className="info-card">
              <div className="info-card-header">
                <span style={{ fontSize: 22 }}>🏬</span>
                <h3>MUNDO FIT — EXHIBICIÓN</h3>
              </div>
              <div className="info-card-body">
                <div className="info-row">
                  <div className="info-icon">📍</div>
                  <div className="info-text">
                    <h4>Ubicación</h4>
                    <p>San Francisco de Dos Ríos, San José, Costa Rica</p>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">🕐</div>
                  <div className="info-text">
                    <h4>Horario de Atención</h4>
                    <p>Lunes a Viernes: 8:00 am – 6:00 pm<br />Sábados: 8:00 am – 2:00 pm</p>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">📞</div>
                  <div className="info-text">
                    <h4>Contacto Directo</h4>
                    <p>WhatsApp: +506 0000-0000<br />info@mundofit.cr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="map-placeholder">
              <div className="map-pin">📍</div>
              <div className="map-label" style={{ fontWeight: 600, color: THEME.text }}>San Francisco de Dos Ríos</div>
              <div className="map-sub">San José, Costa Rica</div>
              <div style={{ marginTop: 8 }}>
                <button
                  className="btn-primary"
                  style={{ fontSize: 13, padding: "10px 20px" }}
                  onClick={() => window.open("https://maps.google.com/?q=San+Francisco+de+Dos+Rios+San+Jose+Costa+Rica", "_blank")}
                >Ver en Google Maps 🗺️</button>
              </div>
              <div style={{
                position: "absolute", inset: 0, opacity: 0.04,
                backgroundImage: "radial-gradient(circle, #E8351A 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="services">
        <div className="services-inner">
          <div className="section-header">
            <div className="section-label">Lo que ofrecemos</div>
            <h2 className="section-title">NUESTROS SERVICIOS</h2>
            <p style={{ fontSize: 16, color: THEME.textMuted, marginTop: 12 }}>
              Más que vender equipos, ofrecemos una experiencia completa para equipar tu espacio de entrenamiento.
            </p>
          </div>
          <div className="services-grid">
            {SERVICES.map(s => (
              <div className="service-card" key={s.title}>
                <span className="service-emoji">{s.emoji}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="service-tag">{s.tag}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button className="btn-primary" onClick={() => setPage("services")}>Ver todos los servicios</button>
          </div>
        </div>
      </section>

      <SocialBar />
    </>
  );
}

function ServicesPage({ setPage }: { setPage: (page: Page) => void }) {
  const details: Record<string, string> = {
    "VENTA DE EQUIPOS": "Trabajamos con las mejores marcas del mercado, con garantía respaldada y repuestos disponibles en Costa Rica.",
    "TRANSPORTE": "Contamos con flotilla de vehículos propios para garantizar la entrega segura y puntual a cualquier punto del país.",
    "ENTREGA ARMADA": "Nuestros técnicos certificados realizan el montaje completo del equipo e incluyen una revisión funcional antes de retirarse.",
    "SERVICIO DE APARTADO": "Con un 30% de anticipo puedes reservar tu equipo. El saldo restante puede cancelarse en cuotas según acuerdo con el cliente.",
  };

  return (
    <div className="page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <Breadcrumb items={[{ label: "Servicios" }]} setPage={setPage} />
          <h1>NUESTROS <span>SERVICIOS</span></h1>
          <p>Conoce todo lo que Mundo Fit tiene para ti: desde la venta hasta la instalación final de tu equipo.</p>
        </div>
      </div>
      <div className="page-body">
        <div className="services-grid" style={{ marginBottom: 60 }}>
          {SERVICES.map(s => (
            <div className="service-card" key={s.title} style={{ padding: 36 }}>
              <span className="service-emoji" style={{ fontSize: 52 }}>{s.emoji}</span>
              <h3>{s.title}</h3>
              <p style={{ fontSize: 15, marginBottom: 8 }}>{s.desc}</p>
              <p style={{ fontSize: 14, color: THEME.textMuted, lineHeight: 1.6 }}>{details[s.title]}</p>
              <span className="service-tag">{s.tag}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${THEME.surface}, ${THEME.bg})`,
          border: `1px solid ${THEME.border}`,
          borderRadius: 16, padding: "48px", textAlign: "center"
        }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: THEME.white, letterSpacing: 2, marginBottom: 16 }}>
            ¿LISTO PARA EQUIPAR TU GIMNASIO?
          </h2>
          <p style={{ fontSize: 16, color: THEME.textMuted, marginBottom: 28 }}>
            Contáctanos hoy y recibe asesoría personalizada sin compromiso.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => window.open("https://wa.me/50600000000", "_blank")}>
              Contactar por WhatsApp 💬
            </button>
            <button className="btn-outline" onClick={() => setPage("contact")}>Formulario de Contacto</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <div className="page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <Breadcrumb items={[{ label: "Sobre Nosotros" }]} setPage={setPage} />
          <h1>SOBRE <span>NOSOTROS</span></h1>
          <p>Conoce la historia, misión y valores de la empresa costarricense líder en equipos de gimnasio.</p>
        </div>
      </div>

      <div className="about-full">
        <div className="about-intro-grid">
          <div className="about-intro-text">
            <h2>¿QUIÉNES SOMOS?</h2>
            <p>
              Mundo Fit es una empresa costarricense con más de 10 años de experiencia en la venta y distribución de equipos para gimnasio, tanto para uso comercial como doméstico.
            </p>
            <p>
              Nacimos con la misión de hacer accesible el fitness de calidad en Costa Rica, ofreciendo productos de marcas reconocidas internacionalmente con el respaldo de un servicio postventa comprometido y profesional.
            </p>
            <p>
              Hoy contamos con una amplia sala de exhibición en San Francisco de Dos Ríos, donde nuestros clientes pueden vivir la experiencia de ver y probar los equipos antes de tomar su decisión.
            </p>
            <div style={{ marginTop: 28 }}>
              {VALUES.map(v => (
                <div className="value-item" key={v.title} style={{ marginBottom: 12 }}>
                  <div className="value-icon">{v.icon}</div>
                  <div>
                    <h4>{v.title}</h4>
                    <p>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="team-card">
              <div className="team-header">
                <div className="team-logo-big">💪</div>
                <h3>MUNDO FIT</h3>
                <p>San Francisco de Dos Ríos, San José</p>
              </div>
              <div className="team-body">
                <div className="team-stat-row">
                  {([["10+", "Años"], ["500+", "Equipos"], ["98%", "Clientes"]] as [string, string][]).map(([n, l]) => (
                    <div className="team-stat" key={l}>
                      <div className="num">{n}</div>
                      <div className="lbl">{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20 }}>
                  <div className="info-row" style={{ padding: "16px 0", borderBottom: `1px solid ${THEME.border}` }}>
                    <div className="info-icon">📍</div>
                    <div className="info-text">
                      <h4>Sala de Exhibición</h4>
                      <p>San Francisco de Dos Ríos, San José</p>
                    </div>
                  </div>
                  <div className="info-row" style={{ padding: "16px 0" }}>
                    <div className="info-icon">🕐</div>
                    <div className="info-text">
                      <h4>Horario</h4>
                      <p>L–V: 8am–6pm | Sáb: 8am–2pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="highlight-box" style={{ marginTop: 20 }}>
              <h3>NUESTRA MISIÓN</h3>
              <ul>
                <li>Brindar equipos de alta calidad a precios competitivos</li>
                <li>Ofrecer asesoría técnica especializada</li>
                <li>Garantizar satisfacción total en cada compra</li>
                <li>Impulsar el desarrollo del fitness en Costa Rica</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Showroom prominente — RF-31 */}
        <div style={{
          background: `linear-gradient(135deg, ${THEME.primary}18, ${THEME.surface})`,
          border: `1px solid rgba(232,53,26,0.2)`,
          borderRadius: 16, padding: "40px",
          marginBottom: 40,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px" }}>
              <div className="section-label">📍 Visítanos</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: THEME.white, letterSpacing: 1, marginBottom: 12 }}>
                SALA DE EXHIBICIÓN
              </h2>
              <p style={{ fontSize: 15, color: THEME.textMuted, lineHeight: 1.7 }}>
                Ven a conocer nuestras instalaciones en San Francisco de Dos Ríos.
                Tenemos más de 100 equipos en exhibición para que puedas probarlos y elegir con total confianza.
              </p>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <div className="info-row" style={{ padding: "12px 0", borderBottom: `1px solid ${THEME.border}` }}>
                <div className="info-icon">📍</div>
                <div className="info-text">
                  <h4>Dirección</h4>
                  <p>San Francisco de Dos Ríos, San José, Costa Rica</p>
                </div>
              </div>
              <div className="info-row" style={{ padding: "12px 0", borderBottom: `1px solid ${THEME.border}` }}>
                <div className="info-icon">🕐</div>
                <div className="info-text">
                  <h4>Horario</h4>
                  <p>Lun–Vie: 8:00–18:00 | Sáb: 8:00–14:00</p>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn-primary"
                  style={{ fontSize: 13 }}
                  onClick={() => window.open("https://maps.google.com/?q=San+Francisco+de+Dos+Rios+San+Jose+Costa+Rica", "_blank")}
                >Ver cómo llegar 🗺️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, setPage }: { title: string; page: Page; setPage: (page: Page) => void }) {
  return (
    <div className="page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <Breadcrumb items={[{ label: title }]} setPage={setPage} />
          <h1>{title.toUpperCase().split(" ").map((w, i) =>
            i === 0 ? w : <span key={i}> <span style={{ color: THEME.primary }}>{w}</span></span>
          )}</h1>
          <p>Esta sección estará disponible en los próximos sprints del proyecto.</p>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <div style={{
          background: THEME.surface, border: `1px solid ${THEME.border}`,
          borderRadius: 16, padding: "64px 40px"
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🚧</div>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: THEME.white, letterSpacing: 2, marginBottom: 12 }}>
            PRÓXIMAMENTE
          </h2>
          <p style={{ fontSize: 16, color: THEME.textMuted, marginBottom: 28 }}>
            Esta sección se desarrollará en el <strong style={{ color: THEME.accent }}>Sprint 2</strong> del proyecto.
          </p>
          <button className="btn-primary" onClick={() => setPage("home")}>← Volver al Inicio</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const { productos, loading, error } = useProductos(); 
  console.log({ productos, loading, error }); 

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const renderPage = () => {
    switch (page) {
      case "home":     return <HomePage setPage={setPage} />;
      case "services": return <ServicesPage setPage={setPage} />;
      case "about":    return <AboutPage setPage={setPage} />;
      case "catalog":  return <PlaceholderPage title="Catálogo de Productos" page="catalog" setPage={setPage} />;
      case "contact":  return <PlaceholderPage title="Formulario de Contacto" page="contact" setPage={setPage} />;
      default:         return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Navbar currentPage={page} setPage={setPage} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
      <WhatsAppFloat />
    </>
  );
}