const { UI } = require('./i18n');

const WA_MESSAGE_FALLBACK = {
  tr: 'Merhaba, Duru ULV ürünleri hakkında bilgi almak istiyorum.',
  en: "Hello, I'd like to get a quote for Duru ULV products.",
  ar: 'مرحباً، أود الحصول على عرض سعر لـ منتجات Duru ULV.',
};

function whatsappButton(prefix, phone, locale = 'tr') {
  const ui = UI[locale] || UI.tr;
  const message = ui.whatsappMessage || WA_MESSAGE_FALLBACK[locale] || WA_MESSAGE_FALLBACK.tr;
  const aria = String(ui.whatsappAria || 'WhatsApp ile iletişime geç')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
  const text = encodeURIComponent(message);
  return `  <a href="https://wa.me/${phone}?text=${text}" class="whatsapp-btn wa-pulse no-print" target="_blank" rel="noopener" aria-label="${aria}"><span class="whatsapp-btn__inner"><img src="${prefix}assets/img/whatsapp-icon.svg" alt="" width="28" height="28" class="whatsapp-btn__icon"></span></a>`;
}

module.exports = { whatsappButton };
