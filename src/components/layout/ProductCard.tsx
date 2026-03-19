import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % imagenes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [imagenes.length]);

  return (
    <div className={`bg-neutral-800 rounded-xl overflow-hidden border-2 border-transparent hover:border-red-600 transition-colors duration-200 cursor-pointer ${vista === "list" ? "flex flex-row w-96" : ""}`}>
      <div className={`bg-black flex items-center justify-center overflow-hidden ${vista === "list" ? "w-48 h-36 flex-shrink-0" : "h-56 w-full"}`}>
        <div className="relative w-full h-full">
          {imagenes.map((img, i) => (
            <img
              key={i}
              src={`https:${img?.fields?.file?.url}`}
              alt={producto.fields.nombre}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
      <div className={`p-4 flex flex-col gap-1 ${vista === "list" ? "justify-center" : ""}`}>
        <span className="text-red-500 text-sm font-semibold">{producto.fields.categoria}</span>
        <span className="text-white text-base font-light">{producto.fields.nombre}</span>
        <span className="text-neutral-400 text-sm">{producto.fields.marca}</span>
      </div>
    </div>
  );
}