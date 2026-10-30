import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const whatsappNumber = '918397858496';
  const defaultMessage = encodeURIComponent(
    'Hello Baby Honey Farms! I would like to inquire about your pure raw honey collection.'
  );

  return (
    <aside aria-label="Direct Customer Support" className="fixed bottom-6 right-6 z-40">
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Baby Honey Farms"
        className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="font-semibold text-xs tracking-wide hidden sm:inline-block">
          Order via WhatsApp
        </span>
      </a>
    </aside>
  );
};
