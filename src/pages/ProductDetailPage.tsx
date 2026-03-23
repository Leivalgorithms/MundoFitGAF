import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useProductoPorSlug } from "../lib/useProductoPorSlug";
import { useProductos } from "../lib/useProductos";
import { useCartStore } from "../store/cartStore";
import ProductCard from "../components/layout/ProductCard";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { producto, loading, error } = useProductoPorSlug(slug);
  const { productos } = useProductos();
  const { items, agregarItem } = useCartStore();

  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImgIndex, setModalImgIndex] = useState(0);

  const enCarrito = producto ? items.some((i) => i.id === producto.sys.id) : false;

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setModalOpen(false);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [modalOpen, handleEscape]);

  const handleAgregarCarrito = () => {
    if (!producto) return;
    const imagenes = producto.fields.imagenes ?? [];
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

  const handleCotizar = () => {
    if (!producto) return;
    const numero = import.meta.env.VITE_WHATSAPP_NUMBER;
    const link = `${window.location.origin}/catalogo/${producto.fields.slug}`;
    const mensaje = `Hola, me interesa cotizar el siguiente producto:\n\n*${producto.fields.nombre}*\nMarca: ${producto.fields.marca}\n${link}\n\nPor favor bríndeme más información.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Cargando producto...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl">Producto no encontrado</p>
        <button
          onClick={() => navigate("/catalogo")}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const imagenes: { fields: { file: { url: string } } }[] =
    producto.fields.imagenes ?? [];
  const tieneMultiplesImagenes = imagenes.length > 1;

  // Productos relacionados: misma categoría, sin el actual
  const relacionados = productos
    .filter(
      (p) =>
        p.fields.categoria === producto.fields.categoria &&
        p.sys.id !== producto.sys.id
    )
    .slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{producto.fields.nombre} | Mundo Fit</title>
        <meta
          name="description"
          content={`Cotiza ${producto.fields.nombre} de ${producto.fields.marca} en Mundo Fit. ${producto.fields.categoria} disponible en Costa Rica. Contáctanos por WhatsApp para más información.`}
        />
        <meta property="og:title" content={`${producto.fields.nombre} | Mundo Fit`} />
        <meta
          property="og:description"
          content={`Cotiza ${producto.fields.nombre} de ${producto.fields.marca} en Mundo Fit. ${producto.fields.categoria} disponible en Costa Rica.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>

      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Layout principal: galería + info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Galería de imágenes */}
            <div className="flex flex-col gap-4">
              {/* Swiper principal */}
              <div className="bg-black rounded-xl overflow-hidden">
                {imagenes.length === 0 ? (
                  <div className="h-96 flex items-center justify-center">
                    <span className="text-neutral-400">Sin imagen</span>
                  </div>
                ) : (
                  <Swiper
                    modules={tieneMultiplesImagenes ? [Navigation, Pagination] : []}
                    navigation={tieneMultiplesImagenes}
                    pagination={tieneMultiplesImagenes ? { clickable: true } : false}
                    onSwiper={setMainSwiper}
                    onSlideChange={(s) => setActiveIndex(s.activeIndex)}
                    style={
                      {
                        "--swiper-navigation-color": "#DC2626",
                        "--swiper-pagination-color": "#DC2626",
                      } as React.CSSProperties
                    }
                    className="h-96 w-full"
                  >
                    {imagenes.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div
                          className="w-full h-full flex items-center justify-center bg-black cursor-zoom-in"
                          onClick={() => {
                            setModalImgIndex(i);
                            setModalOpen(true);
                          }}
                        >
                          <img
                            src={`https:${img.fields.file.url}`}
                            alt={`${producto.fields.nombre} - imagen ${i + 1}`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* Thumbnails */}
              {tieneMultiplesImagenes && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {imagenes.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => { mainSwiper?.slideTo(i); setActiveIndex(i); }}
                      className={`w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-black rounded-lg overflow-hidden cursor-pointer border-2 transition-colors duration-200 ${
                        activeIndex === i ? "border-red-600" : "border-transparent hover:border-neutral-500"
                      }`}
                    >
                      <img
                        src={`https:${img.fields.file.url}`}
                        alt={`Miniatura ${i + 1}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-red-500 text-sm font-semibold">
                  {producto.fields.categoria}
                </span>
                <h1 className="text-white text-3xl font-bold">
                  {producto.fields.nombre}
                </h1>
                <span className="text-neutral-400 text-base">
                  {producto.fields.marca}
                </span>
              </div>

              {producto.fields.descripcion &&
                typeof producto.fields.descripcion === "string" && (
                  <p className="text-white font-light text-base leading-relaxed">
                    {producto.fields.descripcion}
                  </p>
                )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAgregarCarrito}
                  className={`w-full font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ${
                    enCarrito
                      ? "bg-neutral-700 text-white cursor-default"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {enCarrito ? "Agregado al carrito ✓" : "Agregar al carrito"}
                </button>
                <button
                  onClick={handleCotizar}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Solicitar cotización por WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Especificaciones técnicas */}
          {producto.fields.especificaciones && (
            <div className="mt-12 bg-neutral-800 rounded-xl p-6">
              <h2 className="text-red-500 text-lg font-semibold mb-4">
                Especificaciones técnicas
              </h2>
              <div className="border-t border-neutral-700 pt-4">
                <p className="text-white text-sm leading-relaxed whitespace-pre-line">
                  {producto.fields.especificaciones}
                </p>
              </div>
            </div>
          )}

          {/* Productos relacionados */}
          {relacionados.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-white text-2xl font-bold">
                  Productos relacionados
                </h2>
                <div className="flex-1 h-0.5 bg-red-600" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relacionados.map((p) => (
                  <ProductCard key={p.sys.id} producto={p} vista="grid" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal lightbox */}
      {modalOpen && imagenes.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <img
            src={`https:${imagenes[modalImgIndex].fields.file.url}`}
            alt={`${producto.fields.nombre} - ampliado`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
