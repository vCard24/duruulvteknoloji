import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Factory, Wrench, Users, Hammer } from 'lucide-react';

const CERTS = [
  { code: 'CE', label: 'Avrupa Uyum İşareti' },
  { code: 'TSE', label: 'Türk Standartları Enstitüsü' },
  { code: 'ISO 9001', label: 'Kalite Yönetim Sistemi' },
  { code: 'ISO 14001', label: 'Çevre Yönetim Sistemi' },
  { code: 'ISO 45001', label: 'İş Sağlığı &amp; Güvenliği' },
  { code: 'Gıda Tarım', label: 'T.C. Gıda Tarım ve Hayvancılık Bakanlığı Onayı' },
  { code: 'Sanayi', label: 'T.C. Sanayi ve Teknoloji Bakanlığı Onayı' },
];

const PILLARS = [
  { icon: Factory, title: 'Yerli üretim', text: 'Tüm makineler Kayseri\'deki tesisimizde tasarlanır ve üretilir. Tedarik zinciri ağırlıklı olarak yerli, kritik komponentler Amerikan menşelidir.' },
  { icon: Hammer, title: 'Saha kanıtlı tasarım', text: 'Belediye sivrisinek mücadelelerinden hastane dezenfeksiyonuna, sera ilaçlamasından fabrika operasyonuna kadar gerçek saha geri bildirimleriyle olgunlaştırılmış ürünler.' },
  { icon: Wrench, title: 'Servis sürekliliği', text: '36 yıllık üretim mirası, yedek parça temininde uzun ömürlü bir altyapı sağlar. Eski model makineler için bile servis ve parça desteği devam eder.' },
  { icon: Users, title: 'Mühendislik desteği', text: 'İhale teknik şartname hazırlığı, kapasite hesabı ve operasyon planlaması konusunda mühendis ekibimiz proje bazlı destek verir.' },
];

const About = () => {
  return (
    <div data-testid="about-page">
      <section className="bg-white py-16 lg:py-24 border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">Hakkımızda</div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight leading-[1.1]">
              1990'dan beri Türkiye'nin ULV mühendisliği.
            </h1>
            <div className="mt-6 space-y-5 text-base text-[#2B2E33]/80 leading-relaxed">
              <p>
                Duru ULV Teknoloji Sistemleri; 1990 yılında Kayseri'de kurulmuş, 36 yıllık üretim
                tecrübesi ile dezenfeksiyon, haşere kontrolü ve tarımsal ilaçlama için Ultra Low Volume
                (ULV) makineleri üreten bir mühendislik firmasıdır.
              </p>
              <p>
                Belediyelerin sivrisinek mücadelesinden büyük ölçekli serada biyolojik mücadeleye,
                hastanelerin dezenfeksiyonundan fabrikaların haşere kontrolüne kadar geniş bir
                kullanım yelpazesinde tercih edilen bir markayız. Ürünlerimiz CE, TSE ve ISO 9001 /
                14001 / 45001 sertifikalarının yanı sıra T.C. Gıda Tarım ve Hayvancılık Bakanlığı ile
                T.C. Sanayi ve Teknoloji Bakanlığı onaylarına sahiptir.
              </p>
              <p>
                Üç kuşaktır süregelen üretim mirası, sahanın gerçek ihtiyaçlarına odaklanan bir
                mühendislik kültürü ve uzun ömürlü servis desteği — bunlar bizi rakiplerimizden
                ayıran üç temel ilkemizdir.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/fiyat-teklifi" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] rounded-sm">
                Teklif Al <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-px bg-[#2B2E33]/10 border border-[#2B2E33]/10">
              {[
                ['36+', 'yıl tecrübe'],
                ['17', 'aktif model'],
                ['4', 'ana kategori'],
                ['7', 'sertifika &amp; onay'],
              ].map(([v, l]) => (
                <div key={l} className="bg-white p-6">
                  <div className="font-display text-4xl font-bold text-[#1F3D2B]">{v}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.14em] text-[#2B2E33]/60" dangerouslySetInnerHTML={{ __html: l }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-[#F3F4F5] py-16 lg:py-20 border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">Değerlerimiz</div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1F3D2B] tracking-tight mb-10">Neden Duru ULV?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2B2E33]/10 border border-[#2B2E33]/10">
            {PILLARS.map(p => (
              <div key={p.title} className="bg-white p-8">
                <p.icon className="w-7 h-7 text-[#1F3D2B] mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold text-[#1F3D2B] mb-2">{p.title}</h3>
                <p className="text-sm text-[#2B2E33]/75 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">Kalite Politikamız</div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1F3D2B] tracking-tight mb-10">Sertifikalar &amp; Onaylar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2B2E33]/10 border border-[#2B2E33]/10">
            {CERTS.map(c => (
              <div key={c.code} className="bg-white p-6 flex flex-col gap-3" data-testid={`about-cert-${c.code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                <div className="w-12 h-12 flex items-center justify-center border border-[#1F3D2B]/15 text-[#1F3D2B]">
                  <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-display font-semibold text-[#1F3D2B]">{c.code}</div>
                  <div className="text-xs text-[#2B2E33]/65 mt-1" dangerouslySetInnerHTML={{ __html: c.label }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
