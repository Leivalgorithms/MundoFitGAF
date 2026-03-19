import { useState } from 'react';
import { Link } from "react-router-dom";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Hacen envíos a todo Costa Rica?',
    answer:
      'Sí, realizamos envíos a todo el territorio nacional. El costo y tiempo de entrega varía según la zona. Para zonas alejadas coordinamos el envío con transportistas de confianza.',
  },
  {
    id: 'faq-2',
    question: '¿Los equipos incluyen garantía?',
    answer:
      'Todos nuestros equipos cuentan con garantía del fabricante. El período depende de cada producto y marca. Ante cualquier problema, nos encargamos de gestionar la garantía directamente con el proveedor.',
  },
  {
    id: 'faq-3',
    question: '¿Ofrecen servicio de instalación?',
    answer:
      'Sí, contamos con servicio de entrega armada. Nuestro equipo lleva el equipo a tu gimnasio, lo arma y lo deja listo para usar. Este servicio tiene un costo adicional según la cantidad y tipo de equipos.',
  },
  {
    id: 'faq-4',
    question: '¿Puedo apartar un producto?',
    answer:
      'Sí, ofrecemos servicio de apartado. Con un porcentaje del valor total podés reservar el equipo mientras gestionás el pago completo. Contactanos por WhatsApp para coordinar.',
  },
  {
    id: 'faq-5',
    question: '¿Tienen sala de exhibición?',
    answer:
      'Sí, nuestra sala de exhibición está ubicada en San Francisco de Dos Ríos, San José. Podés visitarnos y ver los equipos en persona antes de comprar. Consultá nuestro horario de atención en la sección "Sobre nosotros".',
  },
  {
    id: 'faq-6',
    question: '¿Cómo puedo solicitar una cotización?',
    answer:
      'Podés solicitar cotización de tres formas: desde la ficha de cualquier producto usando el botón "Solicitar cotización", agregando productos al carrito y enviando la lista por WhatsApp, o llenando el formulario de contacto general.',
  },
];

function FAQItem({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-neutral-700 last:border-b-0">
      <h3>
        <button
          id={`${item.id}-btn`}
          aria-expanded={isOpen}
          aria-controls={`${item.id}-panel`}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 py-5 text-left text-white text-sm font-semibold hover:text-red-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded"
        >
          <span>{item.question}</span>
          <svg
            className={`w-5 h-5 flex-shrink-0 text-red-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>

      <div
        id={`${item.id}-panel`}
        role="region"
        aria-labelledby={`${item.id}-btn`}
        hidden={!isOpen}
      >
        <p className="pb-5 text-neutral-400 text-sm leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="py-16 px-4"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-white text-3xl font-bold mb-3"
          >
            Preguntas frecuentes
          </h2>
          <p className="text-neutral-400 text-sm">
            Resolvemos las dudas más comunes sobre nuestros productos y servicios.
          </p>
        </div>

        {/* Accordion */}
        <div
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-6"
          role="list"
        >
          {FAQ_DATA.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <p className="text-center text-neutral-500 text-sm mt-8">
          ¿No encontrás lo que buscás?{' '}
          <Link
            to="/contacto"
            className="text-red-500 hover:text-red-400 transition-colors underline">
            Contactanos directamente
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
