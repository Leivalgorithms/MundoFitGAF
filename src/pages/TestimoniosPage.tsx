import { Helmet } from "react-helmet-async";
import TestimoniosSection from "../components/TestimoniosSection";

export default function TestimoniosPage() {
  return (
    <>
      <Helmet>
        <title>Testimonios | Mundo Fit</title>
        <meta name="description" content="Lee las opiniones de nuestros clientes sobre equipos de gimnasio en Mundo Fit. Calidad, servicio y experiencia comprobada en Costa Rica." />
        <meta property="og:title" content="Testimonios | Mundo Fit" />
        <meta property="og:description" content="Lee las opiniones de nuestros clientes sobre equipos de gimnasio en Mundo Fit. Calidad, servicio y experiencia comprobada en Costa Rica." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>
      <main className="min-h-screen bg-neutral-900">
        <TestimoniosSection />
      </main>
    </>
  );
}