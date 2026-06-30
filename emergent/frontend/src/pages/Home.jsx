import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Flower2, Backpack, Wrench, ShieldCheck, Factory, Hospital, Sprout, Building2, Cog } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';

const ICON_MAP = { Truck, Flower2, Backpack, Wrench };

const SECTORS = [
  { icon: Building2, label: 'Belediyeler' },
  { icon: Hospital, label: 'Hastaneler' },
  { icon: Sprout, label: 'Seralar' },
  { icon: Factory, label: 'Fabrikalar' },
  { icon: Cog, label: 'Endüstri' },
  { icon: ShieldCheck, label: 'Kamu Kurumları' },
];

const STATS = [
  { value: '36+', label: 'yıl mühendislik tecrübesi' },
  { value: '17', label: 'aktif ULV modeli' },
  { value: '4', label: 'kategori: araç, sera, sırt, el' },
  { value: '7', label: 'akredite sertifika & onay' },
];

const CERTS = ['CE', 'TSE', 'ISO 9001', 'ISO 14001', 'ISO 45001', 'Gıda Tarım Bakanlığı', 'Sanayi Bakanlığı'];

const Home = () => {
  const featured = [
    PRODUCTS.find(p => p.slug === 'entosis-mist-blower-500l'),
    PRODUCTS.find(p => p.slug === 'entosis-50'),
    PRODUCTS.find(p => p.slug === 'duru-x20'),
  ].filter(Boolean);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white border-b border-[#2B2E33]/10">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-70" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#1F3D2B] font-semibold mb-6 px-3 py-1.5 border border-[#1F3D2B]/20 rounded-sm bg-white">
              <span className="w-1.5 h-1.5 bg-[#3E8E5C] rounded-full" /> 1990'dan beri Türk mühendisliği
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F3D2B] tracking-tight leading-[1.05] text-balance">
              Belediyeler, kamu ve sanayi için <span className="text-[#3E8E5C]">profesyonel ULV</span> ilaçlama sistemleri.
            </h1>
            <p className="mt-6 max-w-xl text-base lg:text-lg text-[#2B2E33]/75 leading-relaxed">
              Duru ULV; dezenfeksiyon, haşere kontrolü ve tarımsal ilaçlama için ultra düşük hacimli (ULV)
              makineler tasarlar ve üretir. 36 yıllık mühendislik birikimi, CE, TSE ve ISO sertifikalarıyla
              sahada kanıtlanmış güvenilirlik.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/fiyat-teklifi"
                data-testid="hero-quote-cta"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] transition-colors rounded-sm"
              >
                Teklif Al <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/urunler"
                data-testid="hero-explore-cta"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border border-[#2B2E33]/25 text-[#2B2E33] hover:border-[#1F3D2B] hover:text-[#1F3D2B] transition-colors rounded-sm"
              >
                Ürünleri Keşfet
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#2B2E33]/60">
              {CERTS.slice(0, 5).map(c => (
                <span key={c} className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#3E8E5C]" />{c}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-[4/5] bg-[#F3F4F5] border border-[#2B2E33]/10 overflow-hidden">
                <img
                  src={PRODUCTS[1].images[0]}
                  alt="Entosis Mist Blower"
                  className="w-full h-full object-contain p-6"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white border border-[#2B2E33]/15 p-4 shadow-sm max-w-[220px] hidden md:block">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#2B2E33]/55 font-semibold">Öne çıkan model</div>
                <div className="font-display font-semibold text-[#1F3D2B] mt-1 leading-tight">Entosis Mist Blower 500L</div>
                <div className="text-xs text-[#2B2E33]/65 mt-1">35 mikron ULV · 6+1 nozul</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
                Ürün Kategorileri
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1F3D2B] tracking-tight">
                Her saha için doğru ULV makinesi.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#2B2E33]/70 leading-relaxed">
              17 model · 4 ana kategori. Araç üzeri yüksek kapasiteli sistemlerden, el tipi kompakt
              cihazlara kadar geniş bir ürün ailesi sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2B2E33]/10 border border-[#2B2E33]/10">
            {CATEGORIES.map(cat => {
              const Icon = ICON_MAP[cat.icon] || Wrench;
              const count = PRODUCTS.filter(p => p.category === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  to={`/kategori/${cat.slug}`}
                  data-testid={`category-card-${cat.slug}`}
                  className="group bg-white p-8 hover:bg-[#F3F4F5] transition-colors flex flex-col"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-[#1F3D2B]/15 text-[#1F3D2B] mb-6 group-hover:bg-[#1F3D2B] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#1F3D2B] leading-snug">
                    {cat.short}
                  </h3>
                  <p className="mt-2 text-sm text-[#2B2E33]/70 leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between text-xs">
                    <span className="text-[#2B2E33]/55 font-medium">{count} model</span>
                    <span className="text-[#1F3D2B] font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Keşfet <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY DURU — stats band */}
      <section className="bg-[#1F3D2B] text-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#7FD89E] font-semibold mb-3">
                Neden Duru ULV
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-balance">
                Sahada 36 yıl, mühendislikte üç kuşak.
              </h2>
              <p className="mt-5 text-white/75 text-base leading-relaxed">
                1990'dan bu yana Kayseri'de tasarlanan ve üretilen Duru ULV makineleri; belediyelerin
                sivrisinek mücadelesinden hastanelerin dezenfeksiyonuna, seraların biyolojik mücadelesinden
                fabrikaların haşere kontrolüne kadar her ölçekte profesyonel saha çalışmalarına çözüm sunar.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/15">
                {STATS.map(s => (
                  <div key={s.label} className="bg-[#1F3D2B] p-8">
                    <div className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight">{s.value}</div>
                    <div className="mt-2 text-sm text-white/70 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {CERTS.map(c => (
                  <span key={c} className="inline-flex items-center px-3 py-1.5 text-[11px] font-semibold border border-white/20 text-white/85 rounded-sm">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
              Kullanım Alanları
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1F3D2B] tracking-tight">
              Kamu, sağlık, tarım ve sanayide tercih ediliyoruz.
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#2B2E33]/10 border border-[#2B2E33]/10">
            {SECTORS.map(s => (
              <div key={s.label} data-testid={`sector-${s.label}`} className="bg-white p-6 flex flex-col items-center text-center gap-3">
                <s.icon className="w-7 h-7 text-[#1F3D2B]" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#2B2E33]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-[#F3F4F5] py-20 lg:py-24 border-y border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
                Öne Çıkan Modeller
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1F3D2B] tracking-tight">
                Sahada en çok tercih edilen üç model.
              </h2>
            </div>
            <Link to="/urunler" className="text-sm font-semibold text-[#1F3D2B] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
              Tüm ürünleri görüntüle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="border border-[#1F3D2B]/15 p-10 lg:p-14 bg-white">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8">
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-[#1F3D2B] tracking-tight">
                  İhalenize veya operasyonunuza özel teklif alın.
                </h3>
                <p className="mt-3 text-[#2B2E33]/70 leading-relaxed">
                  Birden fazla model seçip karşılaştırabilir, tek bir form ile özel teklif talep edebilirsiniz.
                  Ekibimiz aynı iş günü içinde size geri döner.
                </p>
              </div>
              <div className="md:col-span-4 flex md:justify-end gap-3 flex-wrap">
                <Link
                  to="/fiyat-teklifi"
                  data-testid="cta-quote"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] rounded-sm transition-colors"
                >
                  Teklif Al <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/iletisim"
                  className="inline-flex items-center px-5 py-3 text-sm font-semibold border border-[#2B2E33]/20 text-[#2B2E33] hover:border-[#1F3D2B] hover:text-[#1F3D2B] rounded-sm transition-colors"
                >
                  Bizi Arayın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
