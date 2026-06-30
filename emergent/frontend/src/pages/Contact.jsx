import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div data-testid="contact-page">
      <section className="bg-white py-14 lg:py-20 border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">İletişim</div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight">
            Bize ulaşın, projenizi konuşalım.
          </h1>
          <p className="mt-5 max-w-2xl text-[#2B2E33]/75 leading-relaxed">
            Belediye sivrisinek mücadelesinden ihale teknik şartname desteğine, sera ilaçlamasından
            hastane dezenfeksiyonuna kadar her ölçekteki ihtiyacınız için ekibimiz ulaşılabilir
            durumda.
          </p>
        </div>
      </section>

      <section className="bg-[#F3F4F5] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          <div className="bg-white border border-[#2B2E33]/10 p-8 lg:p-10">
            <h2 className="font-display text-2xl font-bold text-[#1F3D2B] mb-6">Doğrudan iletişim</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#1F3D2B] mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#2B2E33]/55 font-semibold">Telefon</div>
                  <a href="tel:+903523202086" data-testid="contact-phone" className="block text-base font-semibold text-[#1F3D2B] mt-1">+90 352 320 20 86</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MessageCircle className="w-5 h-5 text-[#1F3D2B] mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#2B2E33]/55 font-semibold">WhatsApp</div>
                  <a href="https://wa.me/905320659117" target="_blank" rel="noreferrer" data-testid="contact-whatsapp" className="block text-base font-semibold text-[#1F3D2B] mt-1">+90 532 065 91 17</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#1F3D2B] mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#2B2E33]/55 font-semibold">E-posta</div>
                  <a href="mailto:takcan@gmail.com" data-testid="contact-email" className="block text-base font-semibold text-[#1F3D2B] mt-1">takcan@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#1F3D2B] mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#2B2E33]/55 font-semibold">Adres</div>
                  <div className="text-sm text-[#2B2E33]/80 mt-1 leading-relaxed">
                    Osman Kavuncu Mah. Emirhan Cad. No: 4/C<br />
                    Melikgazi / Kayseri / Türkiye
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#1F3D2B] mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#2B2E33]/55 font-semibold">Çalışma Saatleri</div>
                  <div className="text-sm text-[#2B2E33]/80 mt-1 leading-relaxed">
                    Pazartesi – Cumartesi: 08:30 – 18:00<br />
                    Pazar: Kapalı
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/fiyat-teklifi" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] rounded-sm">
                Teklif Al <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/905320659117" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[#25D366] text-white rounded-sm">
                <MessageCircle className="w-4 h-4" /> WhatsApp ile yaz
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#2B2E33]/10 overflow-hidden">
            <div className="aspect-[4/3] bg-[#F3F4F5] relative">
              <iframe
                title="Duru ULV konumu"
                src="https://www.google.com/maps?q=Osman+Kavuncu+Mah.+Emirhan+Cad.+No+4%2FC+Melikgazi+Kayseri&output=embed"
                className="absolute inset-0 w-full h-full grayscale-[40%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-6 border-t border-[#2B2E33]/10">
              <div className="font-display font-semibold text-[#1F3D2B]">Üretim Tesisi &amp; Merkez Ofis</div>
              <p className="text-sm text-[#2B2E33]/70 mt-1 leading-relaxed">
                Kayseri Melikgazi'deki tesisimizde tasarım, üretim ve teknik servis bir arada yürütülmektedir.
                Önceden randevu alarak fabrika ziyaretinde bulunabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
