interface ProductCardProps {
  id: number;
  nombre: string;
  tipo: string;
  precio?: number;
  imagen?: string;
}

export default function ProductCard({ nombre, tipo, precio, imagen }: ProductCardProps) {
  return (
    <div className="bg-neutral-800 rounded-xl overflow-hidden border-2 border-transparent hover:border-red-600 transition-colors duration-200 cursor-pointer">

      {/* imagen */}
      <div className="bg-neutral-700 h-56 flex items-center justify-center overflow-hidden">
        {imagen ? (
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-700 animate-pulse" />
        )}
      </div>

      {/* info */}
      <div className="p-4 flex flex-col gap-1">
        <span className="text-red-500 text-sm font-semibold">{tipo}</span>
        <span className="text-white text-base font-light">{nombre}</span>
        {precio !== undefined && precio > 0 && (
          <span className="text-white text-sm font-bold">${precio}</span>
        )}
      </div>

    </div>
  );
}