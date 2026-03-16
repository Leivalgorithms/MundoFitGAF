import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const quickLinks = [
  { label: "Contáctanos", to: "/contacto" },
  { label: "FAQ", to: "/faq" },
];

const contactLinks = [
  { label: "WhatsApp", href: "https://wa.me/50600000000" },
  { label: "Correo", href: "mailto:info@mundofit.cr" },
  { label: "Facebook", href: "https://www.facebook.com/maquinasaccesoriosgym" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t-4 border-red-600">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Col 1 — Logo + tagline */}
        <div className="flex flex-col gap-3">
          <Link to="/">
            <img src={logo} alt="Mundo Fit" className="h-10 w-auto" />
          </Link>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Equipamiento profesional para gimnasios y espacios deportivos.
            Calidad garantizada.
          </p>
        </div>

        {/* Col 2 — Enlaces Rápidos */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase">
            Enlaces Rápidos
          </h4>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-neutral-400 text-sm hover:text-red-500 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Contactos */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase">
            Contactos
          </h4>
          <ul className="flex flex-col gap-2">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 text-sm hover:text-red-500 transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-neutral-500 text-xs text-center">
            © 2026 Mundo Fit. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
