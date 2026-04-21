import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import ContactForm from "../components/ContactForm";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const SHOWROOM_COORDS: [number, number] = [9.9111271, -84.0592574];

const contactInfo = [
  {
    icon: <Phone size={20} strokeWidth={1.8} />,
    label: "Teléfono / WhatsApp",
    value: "+506 0000-0000",
    href: "https://wa.me/50600000000",
  },
  {
    icon: <Mail size={20} strokeWidth={1.8} />,
    label: "Correo electrónico",
    value: "info@mundofit.cr",
    href: "mailto:info@mundofit.cr",
  },
  {
    icon: <MapPin size={20} strokeWidth={1.8} />,
    label: "Dirección",
    value: "San Francisco de Dos Ríos, San José, Costa Rica",
    href: null,
  },
  {
    icon: <Clock size={20} strokeWidth={1.8} />,
    label: "Horario de atención",
    value: "Lunes a Viernes: 8 am – 6 pm · Sábados: 9 am – 2 pm",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contacto | Mundo Fit</title>
        <meta name="description" content="Contáctanos en Mundo Fit. Llena nuestro formulario o escríbenos por WhatsApp. Estamos en San Pedro, Montes de Oca, Costa Rica." />
        <meta property="og:title" content="Contacto | Mundo Fit" />
        <meta property="og:description" content="Contáctanos en Mundo Fit. Llena nuestro formulario o escríbenos por WhatsApp. Estamos en San Pedro, Montes de Oca, Costa Rica." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>
      <div className="bg-black min-h-screen">

        {/* ── PAGE HEADER ── */}
        <section className="bg-neutral-900 border-b border-neutral-800 py-14">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-3">
            <h1 className="text-white text-2xl md:text-4xl font-extrabold">
              Ponete en{" "}
              <span className="text-red-600">Contacto</span>
            </h1>
            <p className="text-neutral-400 text-sm max-w-lg leading-relaxed">
              Tenés consultas sobre equipos, cotizaciones o instalaciones?
              Completá el formulario o escribinos directamente, te respondemos a
              la brevedad.
            </p>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── LEFT: Info + map ── */}
            <div className="lg:col-span-2 flex flex-col gap-8">

              {/* Contact info cards */}
              <div className="bg-neutral-900 rounded-xl p-6 flex flex-col gap-5">
                <h2 className="text-white text-lg font-bold flex items-center gap-2">
                  <MessageCircle size={20} className="text-red-500" />
                  Información de contacto
                </h2>
                <ul className="flex flex-col gap-4">
                  {contactInfo.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-neutral-500 text-xs uppercase tracking-wide font-semibold">
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-sm hover:text-red-400 transition-colors duration-200"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-white text-sm">{item.value}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/50600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors duration-200"
              >
                {/* WhatsApp icon inline SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.27a.75.75 0 0 0 .921.921l5.422-1.47A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.658-.513-5.176-1.411l-.371-.22-3.858 1.045 1.045-3.858-.22-.371A9.959 9.959 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
                Escribinos por WhatsApp
              </a>

              {/* Map */}
              <div className="rounded-xl overflow-hidden h-52 border border-neutral-800">
                <MapContainer
                  attributionControl={false}
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
                    <Popup>
                      Mundo Fit — San Francisco de Dos Ríos <br />
                      <a href="https://maps.app.goo.gl/LGRfK1BL9z8N5VAr9" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Google Maps
                      </a>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="lg:col-span-3">
              <div className="bg-neutral-900 rounded-xl p-4 md:p-8">
                <h2 className="text-white text-lg font-bold mb-6">
                  Envianos un mensaje
                </h2>
                <ContactForm />
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
