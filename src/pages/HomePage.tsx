import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Dumbbell,
  Truck,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

// Fix Leaflet default marker icon (known Vite issue)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import heroImage from "../assets/Gym structure.png";
import logo from "../assets/logo.png";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// San Francisco de Dos Ríos, San José, Costa Rica
const SHOWROOM_COORDS: [number, number] = [9.9066, -84.0403];

const features = [
  {
    icon: <Dumbbell size={28} strokeWidth={1.8} />,
    title: "Equipamiento Premium",
    description: "Productos de la más alta calidad para espacios profesionales.",
  },
  {
    icon: <Truck size={28} strokeWidth={1.8} />,
    title: "Envío e Instalación",
    description: "Servicio completo de entrega y montaje profesional.",
  },
  {
    icon: <UserCheck size={28} strokeWidth={1.8} />,
    title: "Asesoría Personalizada",
    description: "Te ayudamos a equipar tu espacio según tus necesidades.",
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.8} />,
    title: "Garantía Extendida",
    description: "Respaldo y garantía en todos nuestros productos.",
  },
];

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Mundo Fit — Equipos de Gimnasio en Costa Rica</title>
        <meta name="description" content="Mundo Fit es tu tienda de equipos de gimnasio en Costa Rica. Máquinas de cardio, fuerza, pesas y accesorios profesionales. Cotiza por WhatsApp." />
        <meta property="og:title" content="Mundo Fit — Equipos de Gimnasio en Costa Rica" />
        <meta property="og:description" content="Mundo Fit es tu tienda de equipos de gimnasio en Costa Rica. Máquinas de cardio, fuerza, pesas y accesorios profesionales. Cotiza por WhatsApp." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-[480px] flex items-center bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* dark overlay so text is readable over the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/90 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-lg">
            <p className="text-white text-2xl font-bold tracking-widest uppercase mb-1">
              <img src={logo} alt="Mundo Fit" className="h-25 w-auto" />
            </p>
            <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight">
              Equipa tu
              <br />
              <span className="text-red-600">Gimnasio</span>
            </h1>
            <p className="text-neutral-300 text-sm mt-4 leading-relaxed">
              Equipamiento profesional de la más alta calidad.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                to="/catalogo"
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors duration-200"
              >
                Ver Catálogo →
              </Link>
              <Link
                to="/contacto"
                className="border border-white text-white hover:bg-white hover:text-black text-sm font-semibold px-5 py-2.5 rounded transition-colors duration-200"
              >
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-neutral-900 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-3">
              {/* red circle with icon */}
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white">
                {f.icon}
              </div>
              <h3 className="text-white text-sm font-bold">{f.title}</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-red-600 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-5">
          <h2 className="text-white text-3xl font-extrabold">
            ¿Listo para equipar tu gimnasio?
          </h2>
          <p className="text-red-100 text-sm">
            Contáctanos hoy y recibe una cotización personalizada para tu proyecto
          </p>
          <Link
            to="/contacto"
            className="border border-white text-white hover:bg-white hover:text-red-600 text-sm font-semibold px-7 py-2.5 rounded transition-colors duration-200"
          >
            Contactar Ahora
          </Link>
        </div>
      </section>

      {/* ── SHOWROOM / MAP ── */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-neutral-900 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-start">

            {/* Left — text */}
            <div className="flex flex-col gap-3 md:w-1/3">
              <h2 className="text-white text-2xl font-bold">Nuestro Local</h2>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Nuestro local está en San Francisco de Dos Ríos, San José.
                ¡Visítanos y conoce nuestros equipos en persona!
              </p>
            </div>

            {/* Right — Leaflet map */}
            <div className="md:w-2/3 w-full h-64 rounded-lg overflow-hidden">
              <MapContainer
                center={SHOWROOM_COORDS}
                zoom={15}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={SHOWROOM_COORDS}>
                  <Popup>Mundo Fit — San Francisco de Dos Ríos</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}