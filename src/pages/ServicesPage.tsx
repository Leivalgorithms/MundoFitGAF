import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  PenTool,
  UserCheck,
  Truck,
  Wrench,
  RefreshCw,
  Headphones,
} from "lucide-react";
import heroImage from "../assets/Gym service.png";

const services = [
  {
    icon: <PenTool size={22} strokeWidth={1.8} />,
    title: "Venta de Equipos",
    description:
      "Contamos con una amplia selección de máquinas de ejercicio, mobiliario especializado y accesorios fitness, tanto nuevos como de segunda. Las pesas y discos se venden por libra; las máquinas como unidad completa.",
  },
  {
    icon: <UserCheck size={22} strokeWidth={1.8} />,
    title: "Asesoría Personalizada",
    description:
      "Nuestro equipo te orienta para elegir los equipos más adecuados según el espacio disponible, el tipo de entrenamiento y tu presupuesto. Atendemos gimnasios, entrenadores personales y espacios en casa.",
  },
  {
    icon: <Truck size={22} strokeWidth={1.8} />,
    title: "Transporte y Entrega Armada",
    description:
      "Nos encargamos del traslado e instalación de los equipos directamente en tu local o domicilio. El servicio de armado y montaje está a cargo del personal de mantenimiento de Mundo Fit.",
  },
  {
    icon: <Wrench size={22} strokeWidth={1.8} />,
    title: "Servicio de Apartado",
    description:
      "¿Encontraste el equipo que querés pero aún no estás listo para comprarlo? Con nuestro servicio de apartado podés reservar la máquina de tu interés para asegurarla mientras gestionás tu compra.",
  },
  {
    icon: <RefreshCw size={22} strokeWidth={1.8} />,
    title: "Equipos de Segunda",
    description:
      "Ofrecemos equipos usados en buen estado como una alternativa accesible para quienes buscan calidad a menor costo. Estos equipos están disponibles de forma esporádica en nuestro catálogo.",
  },
  {
    icon: <Headphones size={22} strokeWidth={1.8} />,
    title: "Atención en Sala de Exhibición",
    description:
      "Visitá nuestra sala de exhibición en San Francisco de Dos Ríos y conocé los equipos en persona antes de decidir. Nuestro equipo estará disponible para atenderte y resolver cualquier consulta.",
  },
];

const process = [
  {
    number: "01",
    title: "Consulta Inicial",
    description:
      "Nos contactás por WhatsApp, formulario o visitando la sala. Nos contás qué tipo de equipo necesitás y para qué espacio.",
  },
  {
    number: "02",
    title: "Cotización",
    description:
      "Revisamos tu solicitud y te enviamos una cotización personalizada con los equipos disponibles, precios y opciones de entrega.",
  },
  {
    number: "03",
    title: "Aprobación",
    description:
      "Confirmás los equipos que te interesan. Si necesitás reservarlos antes de concretar la compra, activamos el servicio de apartado.",
  },
  {
    number: "04",
    title: "Coordinación de Entrega",
    description:
      "Acordamos fecha, hora y lugar de entrega. Nuestro equipo se encarga del transporte y la logística del traslado.",
  },
  {
    number: "05",
    title: "Instalación",
    description:
      "El personal de Mundo Fit arma e instala los equipos en el lugar indicado, asegurándose de que todo quede correctamente montado.",
  },
  {
    number: "06",
    title: "Seguimiento",
    description:
      "Una vez entregado el equipo, estamos disponibles para atender cualquier consulta o inconveniente que pueda surgir.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Servicios | Mundo Fit</title>
        <meta name="description" content="Mundo Fit ofrece venta, transporte y armado de equipos de gimnasio en Costa Rica. Descubre todos nuestros servicios." />
        <meta property="og:title" content="Servicios | Mundo Fit" />
        <meta property="og:description" content="Mundo Fit ofrece venta, transporte y armado de equipos de gimnasio en Costa Rica. Descubre todos nuestros servicios." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-64 flex items-center justify-center bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/90 to-transparent" />
        <div className="relative z-10 text-center px-6 py-16">
          <h1 className="text-white text-2xl md:text-4xl font-extrabold">Nuestros Servicios</h1>
          <p className="text-neutral-300 text-sm mt-3">
            Soluciones integrales para tu espacio de entrenamiento, de inicio a fin.
          </p>
        </div>
      </section>

      {/* ── SERVICIOS GRID ── */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-neutral-900 rounded-xl p-6 flex flex-col gap-4 hover:bg-neutral-800 transition-colors duration-200"
            >
              {/* red square with icon */}
              <div className="w-11 h-11 bg-red-600 rounded-md flex items-center justify-center text-white">
                {s.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{s.title}</h3>
                <p className="text-neutral-400 text-sm mt-1 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESO DE TRABAJO ── */}
      <section className="bg-black py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl font-extrabold">Proceso de Trabajo</h2>
            <p className="text-neutral-400 text-sm mt-3">
              Un proceso claro y ordenado de principio a fin.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {process.map((step, index) => (
              <div key={step.title} className="relative flex flex-col gap-3 bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition-colors duration-200">

                {/* connector line to next step (not on last of each row) */}
                {index % 3 !== 2 && (
                  <div className="hidden lg:block absolute top-8 -right-2.5 w-5 h-px bg-red-800/50 z-10" />
                )}

                {/* number */}
                <span className="text-red-700/60 text-4xl font-extrabold leading-none">
                  {step.number}
                </span>

                <div>
                  <h3 className="text-white font-bold text-sm">{step.title}</h3>
                  <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-red-600 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-5">
          <h2 className="text-white text-3xl font-extrabold">
            ¿Listo para comenzar tu proyecto?
          </h2>
          <p className="text-red-100 text-sm max-w-md">
            Contáctanos hoy y descubrí cómo podemos ayudarte a crear el espacio de tus sueños.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/contacto"
              className="bg-white text-red-600 hover:bg-red-50 text-sm font-semibold px-6 py-2.5 rounded transition-colors duration-200"
            >
              Habla con nosotros
            </Link>
            <Link
              to="/catalogo"
              className="border border-white text-white hover:bg-white hover:text-red-600 text-sm font-semibold px-6 py-2.5 rounded transition-colors duration-200"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}