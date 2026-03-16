import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  catalogo: "Catálogo",
  nosotros: "Nosotros",
  servicios: "Servicios",
  contacto: "Contacto",
  carrito: "Carrito",
  blog: "Blog",
  galeria: "Galería",
  faq: "FAQ",
  comparar: "Comparar",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const label = routeLabels[segment] ?? decodeURIComponent(segment);
    const isLast = index === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <div className="bg-red-600 w-full py-1.5 px-6">
      <ol className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap">

        {/* Home siempre presente */}
        <li>
          <Link
            to="/"
            className="text-white/80 hover:text-white transition-colors duration-200 flex items-center"
          >
            <Home size={13} />
          </Link>
        </li>

        {crumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-white/60" />
            {crumb.isLast ? (
              <span className="text-white text-xs font-semibold">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-white/80 hover:text-white text-xs transition-colors duration-200"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}

      </ol>
    </div>
  );
}