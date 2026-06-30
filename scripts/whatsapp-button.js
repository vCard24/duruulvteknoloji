const WA_MESSAGE =
  'Merhaba%2C%20Duru%20ULV%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.';

function whatsappButton(prefix, phone) {
  return `  <a href="https://wa.me/${phone}?text=${WA_MESSAGE}" class="whatsapp-btn wa-pulse no-print" target="_blank" rel="noopener" aria-label="WhatsApp ile iletişime geç"><span class="whatsapp-btn__inner"><img src="${prefix}assets/img/whatsapp-icon.svg" alt="" width="28" height="28" class="whatsapp-btn__icon"></span></a>`;
}

module.exports = { whatsappButton };
