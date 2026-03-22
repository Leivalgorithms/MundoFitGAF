import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, quitarItem, incrementar, decrementar, limpiarCarrito, totalItems } =
    useCartStore();
  const [confirmarQuitarId, setConfirmarQuitarId] = useState<string | null>(null);
  const [confirmarLimpiar, setConfirmarLimpiar] = useState(false);

  const handleCotizar = () => {
    const numero = import.meta.env.VITE_WHATSAPP_NUMBER;
    const base = window.location.origin;
    const lineas = items.map(
      (item) =>
        `• ${item.nombre}${item.cantidad > 1 ? ` x${item.cantidad}` : ""}\n  ${base}/catalogo/${item.slug}`
    );
    const mensaje =
      `Hola, me gustaría cotizar los siguientes productos:\n\n` +
      lineas.join("\n\n") +
      `\n\nPor favor bríndeme información sobre disponibilidad y precios.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Helmet>
        <title>Mi carrito | Mundo Fit</title>
        <meta
          name="description"
          content="Revisa los productos que seleccionaste y solicita tu cotización directamente por WhatsApp con Mundo Fit."
        />
        <meta property="og:title" content="Mi carrito | Mundo Fit" />
        <meta
          property="og:description"
          content="Revisa los productos que seleccionaste y solicita tu cotización directamente por WhatsApp con Mundo Fit."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>

      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-white text-4xl font-black mb-8">Mi carrito</h1>

          {items.length === 0 ? (
            /* Estado vacío */
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <ShoppingCart size={80} className="text-neutral-600" />
              <h2 className="text-white text-2xl font-semibold">
                Tu carrito está vacío
              </h2>
              <p className="text-neutral-400 text-center max-w-md">
                Agrega productos desde el catálogo para solicitar una cotización.
              </p>
              <button
                onClick={() => navigate("/catalogo")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
              >
                Ir al catálogo
              </button>
            </div>
          ) : (
            /* Carrito con productos */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de productos */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
                  >
                    {/* Imagen */}
                    <div className="w-20 h-20 flex-shrink-0 bg-black rounded-lg overflow-hidden">
                      {item.imagen ? (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart size={24} className="text-neutral-600" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {item.nombre}
                      </p>
                      <p className="text-neutral-400 text-xs mt-0.5">
                        {item.marca} · {item.categoria}
                      </p>
                    </div>

                    {/* Controles cantidad + quitar */}
                    {confirmarQuitarId === item.id ? (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-white text-sm">¿Quitar este producto?</span>
                        <button
                          onClick={() => setConfirmarQuitarId(null)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => { quitarItem(item.id); setConfirmarQuitarId(null); }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                        >
                          Sí, quitar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrementar(item.id)}
                            disabled={item.cantidad === 1}
                            className="w-8 h-8 rounded-lg bg-neutral-700 text-white font-bold disabled:opacity-40 hover:bg-neutral-600 transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="text-white font-semibold w-6 text-center">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => incrementar(item.id)}
                            className="w-8 h-8 rounded-lg bg-neutral-700 text-white font-bold hover:bg-neutral-600 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => setConfirmarQuitarId(item.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          aria-label="Quitar producto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Limpiar carrito */}
                {confirmarLimpiar ? (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-white text-sm">¿Vaciar todo el carrito?</span>
                    <button
                      onClick={() => setConfirmarLimpiar(false)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => { limpiarCarrito(); setConfirmarLimpiar(false); }}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                    >
                      Sí, vaciar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmarLimpiar(true)}
                    className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors self-start mt-2"
                  >
                    Limpiar carrito
                  </button>
                )}
              </div>

              {/* Resumen */}
              <div className="lg:col-span-1">
                <div className="bg-neutral-800 rounded-xl p-6 flex flex-col gap-4 sticky top-24">
                  <h2 className="text-white text-xl font-bold">Resumen</h2>
                  <div className="border-t border-neutral-700 pt-4 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-400 text-sm">
                        Total de productos
                      </span>
                      <span className="text-white font-semibold">
                        {items.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400 text-sm">
                        Ítems seleccionados
                      </span>
                      <span className="text-white font-semibold">
                        {totalItems()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCotizar}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
                  >
                    Solicitar cotización por WhatsApp ↗
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
