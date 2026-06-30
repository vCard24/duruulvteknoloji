import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';

const CERTS = [
  'CE', 'TSE', 'ISO 9001', 'ISO 14001', 'ISO 45001',
  'T.C. Gıda Tarım ve Hayvancılık Bakanlığı',
  'T.C. Sanayi ve Teknoloji Bakanlığı',
];

const Footer = () => {
  return (
    <footer data-testid="site-footer" className="bg-[#1F3D2B] text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 bg-white text-[#1F3D2B] flex items-center justify-center rounded-sm font-display font-bold">D</div>
              <div className="leading-none">
                <div className="font-display font-bold tracking-tight">DURU ULV</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Teknoloji Sistemleri</div>
              </div>
            </div>
            <p className="text-sm text-white/75 leading-relaxed">
              1990'dan beri dezenfeksiyon, haşere kontrolü ve tarımsal ilaçlama için Ultra Low Volume (ULV)
              makineleri üreten Türkiye merkezli kurumsal bir mühendislik firmasıyız.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs text-white/70">
              <ShieldCheck className="w-4 h-4 text-[#7FD89E]" />
              <span>36+ yıl mühendislik tecrübesi</span>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h4 className="font-display text-xs uppercase tracking-[0.18em] text-white/60 mb-4">Site</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Anasayfa', '/'],
                ['Ürünler', '/urunler'],
                ['Karşılaştır', '/urun-karsilastirma'],
                ['Hakkımızda', '/hakkimizda'],
                ['İletişim', '/iletisim'],
                ['Teklif Al', '/fiyat-teklifi'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-white/75 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-5">
            <h4 className="font-display text-xs uppercase tracking-[0.18em] text-white/60 mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#7FD89E] mt-0.5 shrink-0" />
                <a href="tel:+903523202086" className="text-white/85 hover:text-white">+90 352 320 20 86</a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-[#7FD89E] mt-0.5 shrink-0" />
                <a href="https://wa.me/905320659117" target="_blank" rel="noreferrer" className="text-white/85 hover:text-white">
                  WhatsApp: +90 532 065 91 17
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#7FD89E] mt-0.5 shrink-0" />
                <a href="mailto:takcan@gmail.com" className="text-white/85 hover:text-white">takcan@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#7FD89E] mt-0.5 shrink-0" />
                <span className="text-white/85">
                  Osman Kavuncu Mah. Emirhan Cad. No: 4/C<br />
                  Melikgazi / Kayseri / Türkiye
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cert strip */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="font-display text-xs uppercase tracking-[0.18em] text-white/60 mb-4">Sertifikalar &amp; Onaylar</h4>
          <div className="flex flex-wrap gap-2">
            {CERTS.map(c => (
              <span
                key={c}
                data-testid={`footer-cert-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="inline-flex items-center px-3 py-1.5 text-[11px] font-semibold border border-white/20 text-white/85 rounded-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4 md:items-center justify-between text-xs text-white/60">
          <div>© {new Date().getFullYear()} Duru ULV Teknoloji Sistemleri. Tüm hakları saklıdır.</div>
          <div className="flex gap-4">
            <Link to="/gizlilik" className="hover:text-white">Gizlilik</Link>
            <Link to="/kvkk" className="hover:text-white">KVKK</Link>
            <Link to="/kosullar" className="hover:text-white">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
