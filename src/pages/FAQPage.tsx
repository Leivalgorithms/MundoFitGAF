import { Helmet } from "react-helmet-async";
import FAQSection from "../components/FAQSection";

export default function FAQPage() {
  return (
    <>
      <Helmet>
        <title>Preguntas frecuentes | Mundo Fit</title>
        <meta name="description" content="Resuelve tus dudas sobre los productos, entrega, armado y cotización de equipos de gimnasio en Mundo Fit." />
        <meta property="og:title" content="Preguntas frecuentes | Mundo Fit" />
        <meta property="og:description" content="Resuelve tus dudas sobre los productos, entrega, armado y cotización de equipos de gimnasio en Mundo Fit." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>
      <main className="min-h-screen bg-neutral-900">
        <FAQSection />
      </main>
    </>
  );
}