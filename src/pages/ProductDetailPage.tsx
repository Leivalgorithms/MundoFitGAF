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
  const [copiado, setCopiado] = useState(false);

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
      ? "https:" + imagenes[0].fields.file.url
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
    const link = window.location.origin + "/catalogo/" + producto.fields.slug;
    const mensaje =
      "Hola, me interesa cotizar el siguiente producto:\n\n*" +
      producto.fields.nombre +
      "*\nMarca: " +
      producto.fields.marca +
      "\n" +
      link +
      "\n\nPor favor bríndeme más información.";
    const url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCompartirWhatsApp = () => {
    if (!producto) return;
    const texto = producto.fields.nombre + " | Mundo Fit\n" + window.location.href;
    const url = "https://wa.me/?text=" + encodeURIComponent(texto);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCompartirTwitter = () => {
    const texto = producto.fields.nombre + " | Mundo Fit";
    const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(texto) + "&url=" + encodeURIComponent(window.location.href);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopiarEnlace = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
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
          content={"Cotiza " + producto.fields.nombre + " de " + producto.fields.marca + " en Mundo Fit. " + producto.fields.categoria + " disponible en Costa Rica. Contáctanos por WhatsApp para más información."}
        />
        <meta property="og:title" content={producto.fields.nombre + " | Mundo Fit"} />
        <meta
          property="og:description"
          content={"Cotiza " + producto.fields.nombre + " de " + producto.fields.marca + " en Mundo Fit. " + producto.fields.categoria + " disponible en Costa Rica."}
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
                            src={"https:" + img.fields.file.url}
                            alt={producto.fields.nombre + " - imagen " + (i + 1)}
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
                      className={"w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-black rounded-lg overflow-hidden cursor-pointer border-2 transition-colors duration-200 " + (activeIndex === i ? "border-red-600" : "border-transparent hover:border-neutral-500")}
                    >
                      <img
                        src={"https:" + img.fields.file.url}
                        alt={"Miniatura " + (i + 1)}
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
                  className={"w-full font-semibold px-6 py-3 rounded-xl transition-colors duration-200 " + (enCarrito ? "bg-neutral-700 text-white cursor-default" : "bg-red-600 hover:bg-red-700 text-white")}
                >
                  {enCarrito ? "Agregado al carrito ✓" : "Agregar al carrito"}
                </button>

                <button
                  onClick={handleCotizar}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Solicitar cotización por WhatsApp
                </button>

                {/* Compartir */}
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">
                    Compartir producto
                  </p>
                  <div className="flex gap-2">

                    <button
                      onClick={handleCompartirWhatsApp}
                      className="flex-1 bg-neutral-800 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </button>

                    <button
                      onClick={handleCompartirTwitter}
                      className="flex-1 bg-neutral-800 hover:bg-sky-500 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Twitter
                    </button>

                    <button
                      onClick={handleCopiarEnlace}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-600 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      {copiado ? "¡Copiado!" : "Copiar"}
                    </button>

                  </div>
                </div>
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
            src={"https:" + imagenes[modalImgIndex].fields.file.url}
            alt={producto.fields.nombre + " - ampliado"}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}