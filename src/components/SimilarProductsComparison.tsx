import { useProductos } from "../lib/useProductos";
import { useNavigate } from "react-router-dom";

interface Props {
  productoActual: {
    sys: { id: string };
    fields: {
      nombre?: string;
      marca?: string;
      categoria?: string;
      especificaciones?: string;
      imagenes?: { fields: { file: { url: string } } }[];
    };
  };
}

function parseEspecificaciones(texto: string | undefined): Record<string, string> {
  if (!texto) return {};
  const result: Record<string, string> = {};
  texto.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      if (key) result[key] = val;
    }
  });
  return result;
}

function scoreSimilitud(
  actual: Record<string, string>,
  similar: Record<string, string>
): number {
  let score = 0;
  Object.keys(similar).forEach((key) => {
    if (!actual[key]) {
      score += 1;
    } else {
      const numActual = parseFloat(actual[key]);
      const numSimilar = parseFloat(similar[key]);
      if (!isNaN(numActual) && !isNaN(numSimilar) && numSimilar > numActual) {
        score += 2;
      }
    }
  });
  return score;
}

export function SimilarProductsComparison({ productoActual }: Props) {
  const { productos } = useProductos();
  const navigate = useNavigate();

  const specsActual = parseEspecificaciones(productoActual.fields.especificaciones);

  const similares = productos
    .filter(
      (p) =>
        p.fields.categoria === productoActual.fields.categoria &&
        p.sys.id !== productoActual.sys.id &&
        p.fields.especificaciones
    )
    .map((p) => ({
      ...p,
      _score: scoreSimilitud(
        specsActual,
        parseEspecificaciones(p.fields.especificaciones)
      ),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 3);

  if (similares.length === 0) return null;

  const todos = [productoActual, ...similares];

  const allKeys = Array.from(
    new Set(
      todos.flatMap((p) =>
        Object.keys(parseEspecificaciones(p.fields.especificaciones))
      )
    )
  );

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-white text-2xl font-bold">Comparar con similares</h2>
        <div className="flex-1 h-0.5 bg-red-600" />
      </div>
      <p className="text-neutral-400 text-sm mb-6">
        Compara las especificaciones técnicas de productos en la categoría{" "}
        {productoActual.fields.categoria}
      </p>

      {/* ── DESKTOP: tabla ── */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr>
              <td className="bg-neutral-900 w-36 p-3" />
              {todos.map((p, i) => {
                const imagen = p.fields.imagenes?.[0]?.fields?.file?.url;
                const isActual = i === 0;
                return (
                  <th
                    key={p.sys.id}
                    className={
                      "p-4 text-center align-top " +
                      (isActual
                        ? "bg-red-600/10 border-t-2 border-red-600"
                        : "bg-neutral-900 border-t-2 border-neutral-700")
                    }
                  >
                    <div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-neutral-800">
                      {imagen ? (
                        <img
                          src={"https:" + imagen}
                          alt={p.fields.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-neutral-600 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    {isActual && (
                      <span className="inline-block text-xs text-red-500 font-bold uppercase tracking-wide mb-1">
                        Producto actual
                      </span>
                    )}
                    {p.fields.marca && (
                      <p className="text-red-400 text-xs font-semibold mb-0.5">
                        {p.fields.marca}
                      </p>
                    )}
                    <p className="text-white text-sm font-bold leading-snug mb-1">
                      {p.fields.nombre}
                    </p>
                    <p className="text-neutral-400 text-xs mb-3">
                      {p.fields.categoria}
                    </p>
                    {!isActual && p.fields.slug && (
                      <button
                        onClick={() => navigate("/catalogo/" + p.fields.slug)}
                        className="text-xs text-white bg-neutral-700 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors duration-200 font-semibold"
                      >
                        Ver producto →
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key, rowIdx) => (
              <tr
                key={key}
                className={rowIdx % 2 === 0 ? "bg-neutral-900" : "bg-neutral-800/50"}
              >
                <td className="p-4 text-neutral-400 text-sm font-medium whitespace-nowrap">
                  {key}
                </td>
                {todos.map((p, i) => {
                  const specs = parseEspecificaciones(p.fields.especificaciones);
                  const val = specs[key];
                  const isActual = i === 0;
                  const numActual = parseFloat(specsActual[key] ?? "");
                  const numVal = parseFloat(val ?? "");
                  const isBetter =
                    !isActual &&
                    !isNaN(numActual) &&
                    !isNaN(numVal) &&
                    numVal > numActual;
                  return (
                    <td
                      key={p.sys.id}
                      className={
                        "p-4 text-sm text-center " +
                        (isActual
                          ? "bg-red-600/5 text-white font-semibold"
                          : isBetter
                          ? "text-green-400 font-semibold"
                          : "text-neutral-200")
                      }
                    >
                      {val ?? <span className="text-neutral-600">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MÓVIL: cards apiladas ── */}
      <div className="md:hidden flex flex-col gap-4">
        {todos.map((p, i) => {
          const imagen = p.fields.imagenes?.[0]?.fields?.file?.url;
          const isActual = i === 0;
          const specs = parseEspecificaciones(p.fields.especificaciones);

          return (
            <div
              key={p.sys.id}
              className={
                "rounded-xl overflow-hidden border " +
                (isActual
                  ? "border-red-600 bg-red-600/5"
                  : "border-neutral-700 bg-neutral-900")
              }
            >
              {/* Card header */}
              <div
                className={
                  "flex items-center gap-4 p-4 border-b " +
                  (isActual ? "border-red-600/30" : "border-neutral-700")
                }
              >
                {/* Imagen */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800">
                  {imagen ? (
                    <img
                      src={"https:" + imagen}
                      alt={p.fields.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-neutral-600 text-xs">—</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {isActual && (
                    <span className="inline-block text-xs text-red-500 font-bold uppercase tracking-wide mb-0.5">
                      Producto actual
                    </span>
                  )}
                  {p.fields.marca && (
                    <p className="text-red-400 text-xs font-semibold">
                      {p.fields.marca}
                    </p>
                  )}
                  <p className="text-white text-sm font-bold leading-snug truncate">
                    {p.fields.nombre}
                  </p>
                </div>

                {/* Botón ver */}
                {!isActual && p.fields.slug && (
                  <button
                    onClick={() => navigate("/catalogo/" + p.fields.slug)}
                    className="flex-shrink-0 text-xs text-white bg-neutral-700 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors duration-200 font-semibold"
                  >
                    Ver →
                  </button>
                )}
              </div>

              {/* Specs */}
              <div className="divide-y divide-neutral-800">
                {allKeys.map((key) => {
                  const val = specs[key];
                  const numActual = parseFloat(specsActual[key] ?? "");
                  const numVal = parseFloat(val ?? "");
                  const isBetter =
                    !isActual &&
                    !isNaN(numActual) &&
                    !isNaN(numVal) &&
                    numVal > numActual;

                  return (
                    <div key={key} className="flex justify-between items-center px-4 py-2.5">
                      <span className="text-neutral-400 text-xs">{key}</span>
                      <span
                        className={
                          "text-xs font-semibold " +
                          (isActual
                            ? "text-white"
                            : isBetter
                            ? "text-green-400"
                            : "text-neutral-200")
                        }
                      >
                        {val ?? <span className="text-neutral-600">—</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}