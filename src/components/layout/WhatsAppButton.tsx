import { MessageCircle } from "lucide-react";

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER as string;

export default function WhatsAppButton() {
  return (
    <a
      href={"https://wa.me/" + whatsappNumber}
      target="_blank"
      rel="noopener noreferrer"
      className="md:hidden fixed bottom-6 right-6 z-[9999] bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} strokeWidth={1.8} />
    </a>
  );
}