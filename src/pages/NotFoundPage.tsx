import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Página no encontrada | Mundo Fit</title>
        <meta name="description" content="La página que buscas no existe. Regresa al inicio de Mundo Fit y encuentra el equipo de gimnasio que necesitas." />
        <meta property="og:title" content="Página no encontrada | Mundo Fit" />
        <meta property="og:description" content="La página que buscas no existe. Regresa al inicio de Mundo Fit y encuentra el equipo de gimnasio que necesitas." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>
      <div className="text-white text-center py-20">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-neutral-400 mt-2">Página no encontrada</p>
      </div>
    </>
  );
}