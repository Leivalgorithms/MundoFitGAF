import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import logo from "../../assets/logo.png";
import { useCartStore } from "../../store/cartStore";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Servicios", to: "/servicios" },
  { label: "Galería", to: "/galeria" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <nav className="bg-black w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/">
          <img src={logo} alt="Mundo Fit" className="h-10 w-auto" />
        </NavLink>

        {/* Desktop links + cart */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive
                      ? "text-red-600 font-semibold text-sm tracking-wide"
                      : "text-white font-semibold text-sm tracking-wide hover:text-red-500 transition-colors duration-200"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Cart icon desktop */}
          <NavLink to="/carrito" aria-label="Ver carrito">
            <div className="relative">
              <ShoppingCart size={22} className="text-white hover:text-red-500 transition-colors duration-200" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </NavLink>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <NavLink to="/carrito" aria-label="Ver carrito">
            <div className="relative">
              <ShoppingCart size={22} className="text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </NavLink>

          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-neutral-800 px-6 pb-4">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-red-600 font-semibold text-sm tracking-wide"
                      : "text-white font-semibold text-sm tracking-wide hover:text-red-500 transition-colors duration-200"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/carrito"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-semibold text-sm tracking-wide"
                    : "text-white font-semibold text-sm tracking-wide hover:text-red-500 transition-colors duration-200"
                }
              >
                Carrito {totalItems > 0 ? `(${totalItems})` : ""}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
