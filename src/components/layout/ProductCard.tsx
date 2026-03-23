import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";

interface ContentfulImage {
  fields: {
    file: {
      url: string;
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ producto, vista }: { producto: any; vista: "grid" | "list" }) {
  const imagenes: ContentfulImage[] = producto.fields.imagenes ?? [];
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const { items, agregarItem } = useCartStore();
  const enCarrito = items.some((i) => i.id === producto.sys.id);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % imagenes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [imagenes.length]);

  const handleNavigate = () => {
    navigate(`/catalogo/${producto.fields.slug}`);
  };

  const handleAgregarCarrito = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imagen = imagenes[0]?.fields?.file?.url
      ? `https:${imagenes[0].fields.file.url}`
      : "";
    agregarItem({
      id: producto.sys.id,
      slug: producto.fields.slug,
      nombre: producto.fields.nombre,
      categoria: producto.fields.categoria,
      marca: producto.fields.marca,
      imagen,
    });
  };

  const handleCotizar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const numero = import.meta.env.VITE_WHATSAPP_NUMBER;
    const link = `${window.location.origin}/catalogo/${producto.fields.slug}`;
    const mensaje = `Hola, me interesa cotizar el siguiente producto:\n\n*${producto.fields.nombre}*\n${link}\n\nPor favor bríndeme más información.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (vista === "list") {
    return (
      <div
        className="bg-neutral-800 rounded-xl overflow-hidden border-2 border-transparent hover:border-red-600 transition-colors duration-200 cursor-pointer flex flex-row w-full"
        onClick={handleNavigate}
      >
        {/* Image */}
        <div className="bg-black flex items-center justify-center overflow-hidden w-24 h-24 sm:w-36 sm:h-36 flex-shrink-0">
          <div className="relative w-full h-full">
            {imagenes.map((img, i) => (
              <img
                key={i}
                src={`https:${img?.fields?.file?.url}`}
                alt={producto.fields.nombre}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-1 items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-red-500 text-sm font-semibold">{producto.fields.categoria}</span>
            <span className="text-white text-base font-light">{producto.fields.nombre}</span>
            <span className="text-neutral-400 text-sm">{producto.fields.marca}</span>
          </div>

          {/* Botones en columna para vista list */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={handleAgregarCarrito}
              className={`text-white font-semibold px-4 py-2 rounded-xl transition-colors duration-200 text-sm ${
                enCarrito
                  ? "bg-neutral-700 cursor-default"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {enCarrito ? "Agregado ✓" : "+ Agregar"}
            </button>
            <button
              onClick={handleCotizar}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold px-4 py-2 rounded-xl transition-colors duration-200 text-sm"
            >
              Cotizar WA
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista grid
  return (
    <div
      className="bg-neutral-800 rounded-xl overflow-hidden border-2 border-transparent hover:border-red-600 transition-colors duration-200 cursor-pointer flex flex-col"
      onClick={handleNavigate}
    >
      {/* Image */}
      <div className="bg-black flex items-center justify-center overflow-hidden h-44 sm:h-56 w-full">
        <div className="relative w-full h-full">
          {imagenes.map((img, i) => (
            <img
              key={i}
              src={`https:${img?.fields?.file?.url}`}
              alt={producto.fields.nombre}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-red-500 text-sm font-semibold truncate">{producto.fields.categoria}</span>
        <span className="text-white text-base font-light line-clamp-2">{producto.fields.nombre}</span>
        <span className="text-neutral-400 text-sm">{producto.fields.marca}</span>
      </div>

      {/* Botones en fila para vista grid */}
      <div className="px-4 pb-4 flex flex-row gap-2">
        <button
          onClick={handleAgregarCarrito}
          className={`flex-1 text-white font-semibold px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
            enCarrito
              ? "bg-neutral-700 cursor-default"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {enCarrito ? "Agregado ✓" : "+ Agregar"}
        </button>
        <button
          onClick={handleCotizar}
          className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold px-3 py-2 rounded-xl transition-colors duration-200 text-sm"
        >
          Cotizar WA
        </button>
      </div>
    </div>
  );
}
