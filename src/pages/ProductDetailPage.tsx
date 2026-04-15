import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ShoppingCart, Truck, Shield, Award } from "lucide-react";
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
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { SimilarProductsComparison } from "../components/SimilarProductsComparison";
import { crearSolicitud } from "../lib/solicitudes";

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
  const [quantity, setQuantity] = useState(1);
  const [copiado, setCopiado] = useState(false);

  const enCarrito = producto
    ? items.some((i) => i.id === producto.sys.id)
    : false;

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
    const mensajeWA =
      "Hola, me interesa cotizar el siguiente producto:\n\n*" +
      producto.fields.nombre +
      "*\nMarca: " +
      producto.fields.marca +
      "\n" +
      link +
      "\n\nPor favor bríndeme más información.";

    crearSolicitud({
      nombre:   "Anónimo",
      correo:   "-",
      asunto:   "Solicitud de cotización vía WhatsApp",
      mensaje:  `Producto: ${producto.fields.nombre} | Marca: ${producto.fields.marca} | URL: ${link}`,
      tipo:     "cotizacion",
      producto: producto.fields.nombre,
    }).catch((err) => console.error("[Web3Forms] Error al guardar cotización del producto:", err));
    
    const url =
      "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensajeWA);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCompartirWhatsApp = () => {
    if (!producto) return;
    const texto =
      producto.fields.nombre + " | Mundo Fit\n" + window.location.href;
    const url = "https://wa.me/?text=" + encodeURIComponent(texto);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCompartirTwitter = () => {
    const texto = producto?.fields.nombre + " | Mundo Fit";
    const url =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(texto) +
      "&url=" +
      encodeURIComponent(window.location.href);
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

  // Parse especificaciones string into key-value pairs for table display
  const especificacionesLineas: { label: string; value: string }[] = producto
    .fields.especificaciones
    ? producto.fields.especificaciones
        .split("\n")
        .filter((line: string) => line.includes(":"))
        .map((line: string) => {
          const idx = line.indexOf(":");
          return {
            label: line.slice(0, idx).trim(),
            value: line.slice(idx + 1).trim(),
          };
        })
    : [];

  const garantia =
    especificacionesLineas.find(
      (s) =>
        s.label.toLowerCase().includes("garantía") ||
        s.label.toLowerCase().includes("garantia"),
    )?.value ?? "sin garantia";

  const relacionados = productos
    .filter(
      (p) =>
        p.fields.categoria === producto.fields.categoria &&
        p.sys.id !== producto.sys.id,
    )
    .slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{producto.fields.nombre} | Mundo Fit</title>
        <meta
          name="description"
          content={
            "Cotiza " +
            producto.fields.nombre +
            " de " +
            producto.fields.marca +
            " en Mundo Fit. " +
            producto.fields.categoria +
            " disponible en Costa Rica. Contáctanos por WhatsApp para más información."
          }
        />
        <meta
          property="og:title"
          content={producto.fields.nombre + " | Mundo Fit"}
        />
        <meta
          property="og:description"
          content={
            "Cotiza " +
            producto.fields.nombre +
            " de " +
            producto.fields.marca +
            " en Mundo Fit. " +
            producto.fields.categoria +
            " disponible en Costa Rica."
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>

      <div className="bg-black min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            to="/catalogo"
            className="inline-flex items-center text-gray-400 hover:text-red-500 mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver al catálogo
          </Link>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ── Left: Image Gallery ── */}
            <div>
              {/* Main image */}
              <div className="aspect-square bg-zinc-900 rounded-lg overflow-hidden mb-4">
                {imagenes.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-neutral-400">Sin imagen</span>
                  </div>
                ) : (
                  <Swiper
                    modules={
                      tieneMultiplesImagenes ? [Navigation, Pagination] : []
                    }
                    navigation={tieneMultiplesImagenes}
                    pagination={false}
                    onSwiper={setMainSwiper}
                    onSlideChange={(s) => setActiveIndex(s.activeIndex)}
                    style={
                      {
                        "--swiper-navigation-color": "#DC2626",
                        "--swiper-pagination-color": "#DC2626",
                      } as React.CSSProperties
                    }
                    className="w-full h-full"
                  >
                    {imagenes.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div
                          className="w-full h-full flex items-center justify-center bg-zinc-900 cursor-zoom-in"
                          onClick={() => {
                            setModalImgIndex(i);
                            setModalOpen(true);
                          }}
                        >
                          <img
                            src={"https:" + img.fields.file.url}
                            alt={
                              producto.fields.nombre + " - imagen " + (i + 1)
                            }
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* Thumbnails grid — 3 columns like the mockup */}
              {tieneMultiplesImagenes && (
                <div className="grid grid-cols-3 gap-4">
                  {imagenes.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        mainSwiper?.slideTo(i);
                        setActiveIndex(i);
                      }}
                      className={
                        "aspect-square bg-zinc-900 rounded-lg overflow-hidden transition-all duration-200 " +
                        (activeIndex === i
                          ? "ring-2 ring-red-600"
                          : "ring-0 hover:ring-2 hover:ring-neutral-500")
                      }
                    >
                      <img
                        src={"https:" + img.fields.file.url}
                        alt={"Miniatura " + (i + 1)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product Info ── */}
            <div>
              {/* Category + Name + Brand */}
              <p className="text-red-500 font-semibold mb-2">
                {producto.fields.categoria}
              </p>
              <h1 className="text-white text-4xl font-bold mb-2">
                {producto.fields.nombre}
              </h1>
              {producto.fields.marca && (
                <p className="text-gray-400 text-base mb-4">
                  {producto.fields.marca}
                </p>
              )}

              {/* Description */}
              {producto.fields.descripcion && (
                <div className="text-gray-400 mb-8 leading-relaxed">
                  {documentToReactComponents(producto.fields.descripcion)}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors font-semibold"
                  >
                    -
                  </button>
                  <span className="text-white text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAgregarCarrito}
                  className={
                    "flex-1 px-8 py-4 rounded-md font-semibold transition-colors inline-flex items-center justify-center " +
                    (enCarrito
                      ? "bg-neutral-700 text-white cursor-default"
                      : "bg-red-600 hover:bg-red-700 text-white")
                  }
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {enCarrito ? "Agregado al carrito" : "Agregar al Carrito"}
                </button>
                <button
                  onClick={handleCotizar}
                  className="flex-1 border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-md font-semibold transition-colors"
                >
                  Contactar Asesor
                </button>
              </div>

              {/* Benefits row */}
              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-zinc-800">
                <div className="text-center">
                  <Truck size={24} className="mx-auto mb-2 text-red-500" />
                  <p className="text-xs text-gray-400">Envío incluido</p>
                </div>
                <div className="text-center">
                  <Shield size={24} className="mx-auto mb-2 text-red-500" />
                  <p className="text-xs text-gray-400">
                    {garantia === "sin garantia"
                      ? "Sin garantia"
                      : `Garantia ${garantia}`}
                  </p>
                </div>
                <div className="text-center">
                  <Award size={24} className="mx-auto mb-2 text-red-500" />
                  <p className="text-xs text-gray-400">Calidad premium</p>
                </div>
              </div>

              {/* Features — rendered from descripcion or a dedicated field */}
              {producto.fields.caracteristicas &&
                Array.isArray(producto.fields.caracteristicas) && (
                  <div className="mb-8">
                    <h3 className="text-white text-xl font-semibold mb-4">
                      Características
                    </h3>
                    <ul className="space-y-2">
                      {producto.fields.caracteristicas.map(
                        (feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {/* Specifications table */}
              {especificacionesLineas.length > 0 && (
                <div>
                  <h3 className="text-white text-xl font-semibold mb-4">
                    Especificaciones
                  </h3>
                  <div className="bg-zinc-900 rounded-lg p-6">
                    <dl className="space-y-3">
                      {especificacionesLineas.map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between py-2 border-b border-zinc-800 last:border-0"
                        >
                          <dt className="text-gray-400">{spec.label}</dt>
                          <dd className="font-semibold text-white text-right">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}

              {/* Share buttons */}
              <div className="flex flex-col gap-2 mt-8">
                <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">
                  Compartir producto
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCompartirWhatsApp}
                    className="flex-1 bg-neutral-800 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={handleCompartirTwitter}
                    className="flex-1 bg-neutral-800 hover:bg-sky-500 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter
                  </button>
                  <button
                    onClick={handleCopiarEnlace}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-600 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    {copiado ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <SimilarProductsComparison productoActual={producto} />

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
