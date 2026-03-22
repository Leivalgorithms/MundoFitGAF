import { Helmet } from "react-helmet-async";
import { Star, UserCheck, Handshake, Lightbulb } from "lucide-react";
import heroImage from "../assets/Gym About.png";
import historyImage from "../assets/Gym Equipment.jpg";

const values = [
  {
    icon: <Star size={28} strokeWidth={1.8} />,
    title: "Calidad Premium",
    description: "Trabajamos únicamente con equipos de alta calidad, garantizando durabilidad y rendimiento para gimnasios profesionales.",
  },
  {
    icon: <UserCheck size={28} strokeWidth={1.8} />,
    title: "Atención Personalizada",
    description: "Cada cliente es único. Te asesoramos según tus necesidades específicas para encontrar la solución ideal.",
  },
  {
    icon: <Handshake size={28} strokeWidth={1.8} />,
    title: "Compromiso",
    description: "Nos comprometemos con cada cliente a lo largo de todo el proceso, desde la consulta hasta la instalación final.",
  },
  {
    icon: <Lightbulb size={28} strokeWidth={1.8} />,
    title: "Innovación",
    description: "Estamos siempre al tanto de las últimas tendencias en equipamiento fitness para ofrecerte lo mejor del mercado.",
  },
];

const stats = [
  { value: "X +", label: "Años de experiencia" },
  { value: "500 +", label: "Proyectos completados" },
  { value: "98%", label: "Clientes satisfechos" },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Nosotros | Mundo Fit</title>
        <meta name="description" content="Conoce la historia de Mundo Fit, empresa costarricense dedicada a la venta de equipos de gimnasio profesional para hogares y negocios." />
        <meta property="og:title" content="Nosotros | Mundo Fit" />
        <meta property="og:description" content="Conoce la historia de Mundo Fit, empresa costarricense dedicada a la venta de equipos de gimnasio profesional para hogares y negocios." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>
    <div className="flex flex-col bg-black">

      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-56 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/90 to-transparent" />
        <div className="relative z-10 text-center px-6 py-16">
          <h1 className="text-white text-2xl md:text-4xl font-extrabold">Sobre Nosotros</h1>
          <p className="text-neutral-300 text-sm mt-2 max-w-sm mx-auto">
            Más de 10 años transformando espacios en verdaderos centros de entrenamiento profesionales.
          </p>
        </div>
      </section>

      {/* ── NUESTRA HISTORIA ── */}
      <section className="bg-black px-6 py-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          <h2 className="text-white text-xl font-extrabold">Nuestra Historia</h2>

          {/* texto | imagen */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                Mundo Fit es una empresa costarricense dedicada a la comercialización de equipos para
                gimnasio, con sede principal en San Pedro, Montes de Oca. Nacimos con el propósito de
                acercar equipamiento profesional de alta calidad a gimnasios, entrenadores personales
                y personas que desean crear su propio espacio de entrenamiento en casa.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                A lo largo de los años hemos construido una amplia sala de exhibición ubicada en San
                Francisco de Dos Ríos, donde nuestros clientes pueden ver, tocar y evaluar los equipos
                antes de tomar una decisión. Comercializamos máquinas de ejercicio, mobiliario
                especializado, pesas, discos y accesorios fitness, tanto nuevos como de segunda.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Nos distinguimos por ofrecer un servicio integral: desde la asesoría personalizada
                hasta el transporte y la entrega armada directamente en el local o domicilio del
                cliente, todo a cargo de nuestro propio equipo de trabajo.
              </p>
            </div>

            {/* imagen */}
            <div className="w-full md:w-[40%] shrink-0 h-52 md:h-72 rounded-xl overflow-hidden bg-neutral-800">
              <img
                src={historyImage}
                alt="Mundo Fit"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Misión y Visión */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 rounded-xl p-5 bg-red-950">
              <p className="text-white font-bold text-sm mb-2">Misión</p>
              <p className="text-red-200 text-xs leading-relaxed">
                Ofrecer equipamiento profesional para gimnasio de la más alta calidad, brindando una
                experiencia de compra personalizada y un servicio integral que acompaña al cliente
                desde la consulta hasta la instalación final.
              </p>
            </div>
            <div className="flex-1 rounded-xl p-5 bg-red-950">
              <p className="text-white font-bold text-sm mb-2">Visión</p>
              <p className="text-red-200 text-xs leading-relaxed">
                Ser la empresa líder en Costa Rica en la comercialización y distribución de equipos
                para gimnasio, reconocida por la calidad de sus productos, la excelencia en el
                servicio y el respaldo que ofrece a cada cliente.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── NUESTROS VALORES ── */}
      <section className="bg-black px-6 py-14 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl font-extrabold">Nuestros Valores</h2>
            <p className="text-neutral-400 text-sm mt-2">
              Los principios que guían nuestra labor diaria.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                  {v.icon}
                </div>
                <p className="text-white font-bold text-sm">{v.title}</p>
                <p className="text-neutral-400 text-xs leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESTADÍSTICAS ── */}
      <section className="bg-red-600 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-1">
              <span className="text-white text-4xl sm:text-5xl font-extrabold">{s.value}</span>
              <span className="text-red-100 text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
    </>
  );
}