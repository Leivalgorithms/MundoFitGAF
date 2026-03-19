import { useTestimonios } from '../lib/useTestimonios';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4" aria-label={`Calificación: ${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-red-500' : 'text-neutral-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonioCard({ testimonio }: { testimonio: any }) {
  const { name, role, quote, rating, avatar } = testimonio.fields;
  const avatarUrl = avatar?.fields?.file?.url;

  return (
    <article className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 flex flex-col gap-4">
      <StarRating rating={rating ?? 5} />

      <blockquote>
        <p className="text-neutral-300 text-sm leading-relaxed">
          "{quote}"
        </p>
      </blockquote>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-neutral-700">
        {avatarUrl ? (
          <img
            src={`https:${avatarUrl}`}
            alt={`Foto de ${name}`}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            aria-hidden="true"
          >
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-white text-sm font-semibold">{name}</p>
          {role && (
            <p className="text-neutral-400 text-xs">{role}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function TestimoniosSection() {
  const { testimonios, loading, error } = useTestimonios();

  return (
    <section
      className="py-16 px-4"
      aria-labelledby="testimonios-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2
            id="testimonios-heading"
            className="text-white text-3xl font-bold mb-3"
          >
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Empresas y gimnasios de todo Costa Rica confían en Mundo Fit para
            equipar sus instalaciones.
          </p>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-busy="true"
            aria-label="Cargando testimonios"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-neutral-800 rounded-xl p-6 h-52 animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="text-center text-red-400 text-sm"
          >
            No se pudieron cargar los testimonios. Por favor intentá más tarde.
          </p>
        )}

        {/* Testimonios */}
        {!loading && !error && testimonios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonios.map((t) => (
              <TestimonioCard key={t.sys.id} testimonio={t} />
            ))}
          </div>
        )}

        {/* Sin datos */}
        {!loading && !error && testimonios.length === 0 && (
          <p className="text-center text-neutral-500 text-sm">
            Aún no hay testimonios publicados.
          </p>
        )}
      </div>
    </section>
  );
}
