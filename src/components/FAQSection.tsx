import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircleQuestion, HelpCircle } from 'lucide-react';
import { useFAQ } from '../lib/useFAQ.ts';
import type { FAQCategoryMapped, FAQItemMapped } from '../lib/useFAQ.ts';

const CATEGORY_COLORS = ['#3b82f6', '#f59e0b', '#22c55e', '#a855f7', '#ef4444', '#06b6d4'];

function FAQItemComponent({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItemMapped;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: '1px solid #262626' }}>
      <button
        aria-expanded={isOpen}
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '16px 0',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: isOpen ? '#ffffff' : '#d4d4d4',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'color 0.2s',
        }}
      >
        <span>{item.pregunta}</span>
        <ChevronDown
          size={18}
          color="#ef4444"
          style={{
            flexShrink: 0,
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {isOpen && (
        <p
          style={{
            paddingBottom: '16px',
            color: '#737373',
            fontSize: '13px',
            lineHeight: '1.7',
            margin: 0,
          }}
        >
          {item.respuesta}
        </p>
      )}
    </div>
  );
}

function CategorySection({
  category,
  colorIndex,
  openId,
  onToggle,
}: {
  category: FAQCategoryMapped;
  colorIndex: number;
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  const color = CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length];

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MessageCircleQuestion size={15} color="#ffffff" />
        </div>
        <h3 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, margin: 0 }}>
          {category.titulo}
        </h3>
      </div>

      <div style={{ backgroundColor: '#171717', borderRadius: '10px', padding: '0 20px' }}>
        {category.items.map((item) => (
          <FAQItemComponent
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { categories, loading, error } = useFAQ();
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section style={{ padding: '60px 16px', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: 800, margin: '0 0 8px' }}>
            Preguntas Frecuentes
          </h2>
          <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>
            Encuentra respuestas a las preguntas más comunes sobre nuestros
            <br />
            productos y servicios.
          </p>
        </div>

        {/* States */}
        {loading && (
          <p style={{ textAlign: 'center', color: '#737373', fontSize: '14px' }}>
            Cargando preguntas...
          </p>
        )}
        {error && (
          <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '14px' }}>
            Error al cargar las preguntas.
          </p>
        )}

        {/* Categories */}
        {!loading && !error && (
          <div>
            {categories.map((category, index) => (
              <CategorySection
                key={category.id}
                category={category}
                colorIndex={index}
                openId={openId}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: '32px',
            backgroundColor: '#171717',
            borderRadius: '12px',
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <HelpCircle size={20} color="#ffffff" />
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>
            ¿No encontraste tu respuesta?
          </h3>
          <p style={{ color: '#737373', fontSize: '13px', margin: '0 0 20px' }}>
            Nuestro equipo está listo para ayudarte con cualquier duda que tengas.
          </p>
          <Link
            to="/contacto"
            style={{
              display: 'inline-block',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
          >
            Contáctanos Ahora
          </Link>
        </div>

      </div>
    </section>
  );
}