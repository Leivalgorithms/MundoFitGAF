import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const productos = [
  { id: 1, nombre: "Producto 1", tipo: "Máquinas", precio: 100 },
  { id: 2, nombre: "Producto 2", tipo: "Máquinas", precio: 200 },
  { id: 3, nombre: "Producto 3", tipo: "Pesas", precio: 50 },
  { id: 4, nombre: "Producto 4", tipo: "Pesas", precio: 150 },
  { id: 5, nombre: "Producto 5", tipo: "Suplementos", precio: 30 },
  { id: 6, nombre: "Producto 6", tipo: "Suplementos", precio: 80 },
  { id: 7, nombre: "Producto 7", tipo: "Accesorios", precio: 20 },
  { id: 8, nombre: "Producto 8", tipo: "Accesorios", precio: 60 },
];

const tipos = ["Todos", "Máquinas", "Pesas", "Suplementos", "Accesorios"];

export default function CatalogPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  const [tipoActivo, setTipoActivo] = useState("Todos");
  const [ordenPrecio, setOrdenPrecio] = useState<"asc" | "desc" | null>(null);

  const productosFiltrados = productos
    .filter((p) => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = tipoActivo === "Todos" || p.tipo === tipoActivo;
      return coincideBusqueda && coincideTipo;
    })
    .sort((a, b) => {
      if (ordenPrecio === "asc") return a.precio - b.precio;
      if (ordenPrecio === "desc") return b.precio - a.precio;
      return 0;
    });

  return (
    <div className="bg-black min-h-screen flex flex-col">

      {/* ── HEADER ── */}
      <section className="bg-black pt-16 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-5xl font-black">Catálogo de Productos</h1>
          <p className="text-white font-light text-xl mt-3">
            Descubre nuestro catálogo completo de equipamiento profesional
          </p>
        </div>
      </section>

      {/* ── BUSCADOR + FILTRO ── */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4 relative">

          {/* Barra de búsqueda */}
          <div className="bg-neutral-800 rounded-xl flex items-center px-6 gap-4 h-16 flex-1">
            <Search size={24} className="text-white" />
            <input
              type="text"
              placeholder="Busca productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-transparent text-white placeholder-neutral-400 font-light text-lg outline-none w-full"
            />
          </div>

          {/* Botón filtro */}
          <button
            onClick={() => setFiltroAbierto(!filtroAbierto)}
            className={`h-16 w-16 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              filtroAbierto ? "bg-red-600" : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            <SlidersHorizontal size={22} className="text-white" />
          </button>

          {/* Dropdown filtros */}
          {filtroAbierto && (
            <div className="absolute top-20 right-0 bg-neutral-800 rounded-xl p-5 z-50 w-64 flex flex-col gap-4 shadow-xl">

              {/* Tipo */}
              <div>
                <p className="text-white text-sm font-bold mb-2">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  {tipos.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTipoActivo(t)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ${
                        tipoActivo === t
                          ? "bg-red-600 text-white"
                          : "bg-neutral-700 text-white hover:bg-neutral-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <p className="text-white text-sm font-bold mb-2">Precio</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setOrdenPrecio("asc")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors duration-200 ${
                      ordenPrecio === "asc"
                        ? "bg-red-600 text-white"
                        : "bg-neutral-700 text-white hover:bg-neutral-600"
                    }`}
                  >
                    Precio: Menor a Mayor
                  </button>
                  <button
                    onClick={() => setOrdenPrecio("desc")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors duration-200 ${
                      ordenPrecio === "desc"
                        ? "bg-red-600 text-white"
                        : "bg-neutral-700 text-white hover:bg-neutral-600"
                    }`}
                  >
                    Precio: Mayor a Menor
                  </button>
                </div>
              </div>

              {/* Limpiar filtros */}
              <button
                onClick={() => { setTipoActivo("Todos"); setOrdenPrecio(null); }}
                className="text-red-500 text-xs font-semibold hover:text-red-400 text-left"
              >
                Limpiar filtros
              </button>

            </div>
          )}
        </div>
      </section>

      {/* ── GRID DE PRODUCTOS ── */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {productosFiltrados.map((p) => (
            <div key={p.id} className="bg-neutral-800 rounded-xl overflow-hidden">
              <div className="bg-neutral-300 h-56 flex items-center justify-center">
                <span className="text-black font-black text-2xl">Imagen</span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-red-500 text-sm font-semibold">{p.tipo}</span>
                <span className="text-white text-base font-light">{p.nombre}</span>
                <span className="text-white text-sm font-bold">${p.precio}</span>
              </div>
            </div>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <p className="text-neutral-500 text-center mt-20 text-lg">
            No se encontraron productos.
          </p>
        )}
      </section>

    </div>
  );
}