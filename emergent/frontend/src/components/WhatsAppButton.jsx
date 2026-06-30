import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a
      data-testid="whatsapp-floating-btn"
      href="https://wa.me/905320659117?text=Merhaba%2C%20Duru%20ULV%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
      target="_blank"
      rel="noreferrer"
      className="no-print fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 wa-pulse rounded-full"
      aria-label="WhatsApp ile iletişime geç"
    >
      <span className="flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 hover:scale-[1.04] active:scale-95 transition-transform">
        <MessageCircle className="w-7 h-7" strokeWidth={2.2} />
      </span>
    </a>
  );
};

export default WhatsAppButton;
