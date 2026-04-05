import { useState } from "react";
import { useGaleria } from "../lib/useGaleria";

const categorias = ["Todos", "Gimnasios", "Casas", "Maquinaria", "Corporativo"];

export default function GalleryPage() {
  const { proyectos, loading, error } = useGaleria();
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modalItem, setModalItem] = useState<any | null>(null);

  const proyectosFiltrados =
    categoriaActiva === "Todos"
      ? proyectos
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        proyectos.filter(
          (p: any) =>
            String(p.fields.categoria ?? "").toLowerCase() ===
            categoriaActiva.toLowerCase(),
        );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenModal = (item: any) => {
    setModalItem(item);
    setModalOpen(true);
  };

  if (loading)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Cargando galería...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Error al cargar la galería.</p>
      </div>
    );

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-white text-4xl font-extrabold">
            Galería de Proyectos
          </h1>
          <p className="text-neutral-400 text-sm mt-3">
            Conoce algunos de los proyectos que hemos realizado para nuestros
            clientes
          </p>
        </div>

        {/* Filtros de categoría */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={
                "px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 " +
                (categoriaActiva === cat
                  ? "bg-red-600 text-white"
                  : "bg-neutral-800 text-white hover:bg-neutral-700")
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de imágenes */}
        {proyectosFiltrados.length === 0 ? (
          <p className="text-neutral-500 text-center mt-20 text-lg">
            No hay proyectos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {proyectosFiltrados.map((item: any) => {
              const imagenUrl = item.fields.imagen?.fields?.file?.url;
              const imagen = imagenUrl ? "https:" + String(imagenUrl) : null;
              const titulo = item.fields.titulo
                ? String(item.fields.titulo)
                : null;
              const descripcion = item.fields.descripcion
                ? String(item.fields.descripcion)
                : null;

              return (
                <div
                  key={item.sys.id}
                  className="relative group rounded-xl overflow-hidden cursor-pointer aspect-video bg-neutral-900 border-2 border-transparent hover:border-red-600 transition-colors duration-200"
                  onClick={() => handleOpenModal(item)}
                >
                  {imagen && (
                    <img
                      src={imagen}
                      alt={titulo ?? "Proyecto"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    {titulo && (
                      <p className="text-white font-bold text-sm">{titulo}</p>
                    )}
                    {descripcion && (
                      <p className="text-neutral-300 text-xs mt-1">
                        {descripcion}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal lightbox */}
      {modalOpen && modalItem && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center px-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-w-4xl w-full flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {modalItem.fields.imagen?.fields?.file?.url && (
              <img
                src={"https:" + String(modalItem.fields.imagen.fields.file.url)}
                alt={
                  modalItem.fields.titulo
                    ? String(modalItem.fields.titulo)
                    : "Proyecto"
                }
                className="w-full rounded-xl object-contain max-h-[75vh]"
              />
            )}

            <div className="flex flex-col gap-1 items-center text-center">
              {modalItem.fields.categoria && (
                <p className="text-red-500 text-sm font-semibold">
                  {String(modalItem.fields.categoria)}
                </p>
              )}
              {modalItem.fields.titulo && (
                <p className="text-white font-bold text-lg">
                  {String(modalItem.fields.titulo)}
                </p>
              )}
              {modalItem.fields.descripcion && (
                <p className="text-neutral-400 text-sm">
                  {String(modalItem.fields.descripcion)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
