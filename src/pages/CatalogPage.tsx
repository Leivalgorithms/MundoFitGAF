import { useState, useMemo } from "react";
import { useProductos } from "../lib/useProductos";
import ProductCard from "../components/layout/ProductCard";
import Pagination from "../components/ui/Pagination";
import { Search, SlidersHorizontal, LayoutGrid, LayoutList } from "lucide-react";

const PRODUCTOS_POR_PAGINA = 12;

const tipos = ["Todos", "Máquinas", "Pesas", "Suplementos", "Accesorios"];

export default function CatalogPage() {
  const { productos, loading, error } = useProductos();
  const [busqueda, setBusqueda] = useState("");
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  const [tipoActivo, setTipoActivo] = useState("Todos");
  const [ordenPrecio, setOrdenPrecio] = useState<"asc" | "desc" | null>(null);
  const [vista, setVista] = useState<"grid" | "list">("grid");
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtrar y ordenar
  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) => {
        const q = busqueda.toLowerCase();
        const coincideBusqueda =
          p.fields.nombre?.toLowerCase()?.includes(q) ||
          p.fields.marca?.toLowerCase()?.includes(q) ||
          p.fields.categoria?.toLowerCase()?.includes(q);
        const coincideTipo = tipoActivo === "Todos" || p.fields.categoria === tipoActivo;
        return coincideBusqueda && coincideTipo;
      })
      .sort((a, b) => {
        if (ordenPrecio === "asc") return a.fields.nombre?.localeCompare(b.fields.nombre) ?? 0;
        if (ordenPrecio === "desc") return b.fields.nombre?.localeCompare(a.fields.nombre) ?? 0;
        return 0;
      });
  }, [productos, busqueda, tipoActivo, ordenPrecio]);

  // Paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    paginaActual * PRODUCTOS_POR_PAGINA
  );

  // Handlers que resetean la página al cambiar filtros
  const handleBusqueda = (valor: string) => { setBusqueda(valor); setPaginaActual(1); };
  const handleTipo = (tipo: string) => { setTipoActivo(tipo); setPaginaActual(1); };
  const handleOrden = (orden: "asc" | "desc") => { setOrdenPrecio(orden); setPaginaActual(1); };
  const handleLimpiar = () => { setTipoActivo("Todos"); setOrdenPrecio(null); setPaginaActual(1); };

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">Cargando productos...</p>
    </div>
  );

  if (error) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-xl">Error al cargar productos.</p>
    </div>
  );

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

      {/* ── BUSCADOR + VISTA + FILTRO ── */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4 relative">

          {/* Barra de búsqueda */}
          <div className="bg-neutral-800 rounded-xl flex items-center px-6 gap-4 h-16 flex-1">
            <Search size={24} className="text-white" />
            <input
              type="text"
              placeholder="Busca productos..."
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              className="bg-transparent text-white placeholder-neutral-400 font-light text-lg outline-none w-full"
            />
          </div>

          {/* Botón vista grid */}
          <button
            onClick={() => setVista("grid")}
            className={`h-16 w-16 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              vista === "grid" ? "bg-red-600" : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            <LayoutGrid size={22} className="text-white" />
          </button>

          {/* Botón vista lista */}
          <button
            onClick={() => setVista("list")}
            className={`h-16 w-16 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              vista === "list" ? "bg-red-600" : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            <LayoutList size={22} className="text-white" />
          </button>

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
              <div>
                <p className="text-white text-sm font-bold mb-2">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  {tipos.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTipo(t)}
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
              <div>
                <p className="text-white text-sm font-bold mb-2">Orden</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOrden("asc")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors duration-200 ${
                      ordenPrecio === "asc"
                        ? "bg-red-600 text-white"
                        : "bg-neutral-700 text-white hover:bg-neutral-600"
                    }`}
                  >
                    Nombre: A → Z
                  </button>
                  <button
                    onClick={() => handleOrden("desc")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors duration-200 ${
                      ordenPrecio === "desc"
                        ? "bg-red-600 text-white"
                        : "bg-neutral-700 text-white hover:bg-neutral-600"
                    }`}
                  >
                    Nombre: Z → A
                  </button>
                </div>
              </div>
              <button
                onClick={handleLimpiar}
                className="text-red-500 text-xs font-semibold hover:text-red-400 text-left"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUCTOS ── */}
      <section className="px-6 pb-20">
        <div className={
          vista === "grid"
            ? "max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
            : "max-w-7xl mx-auto flex flex-col gap-4"
        }>
          {productosPagina.map((p) => (
            <ProductCard key={p.sys.id} producto={p} vista={vista} />
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <p className="text-neutral-500 text-center mt-20 text-lg">
            No se encontraron productos.
          </p>
        )}

        <div className="max-w-7xl mx-auto">
          <Pagination
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={setPaginaActual}
          />
        </div>
      </section>

    </div>
  );
}