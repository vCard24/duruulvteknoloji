import React, { useState } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { ChevronRight, Check, GitCompareArrows, ArrowRight, Building2, Hospital, Sprout, Factory, ShieldCheck, Cog } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { getProductBySlug, getCategoryBySlug, getRelated } from '../data/products';
import { useCompare } from '../contexts/CompareContext';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';

const USAGE = [
  { icon: Building2, label: 'Belediye' },
  { icon: Hospital, label: 'Hastane' },
  { icon: Sprout, label: 'Sera' },
  { icon: Factory, label: 'Fabrika' },
  { icon: ShieldCheck, label: 'Askeriye' },
  { icon: Cog, label: 'Çiftlik' },
];

const FAQS = [
  { q: 'ULV nedir, Pulverizatörden farkı nedir?', a: 'ULV (Ultra Low Volume), çok düşük hacimde ilacın 0–50 mikron arası damlalara parçalanarak havaya dağıtılması esasına dayanır. Klasik pulverizatöre göre çok daha az ilaçla, çok daha geniş bir alanı, havada askıda kalan damlalarla kaplar.' },
  { q: 'Hangi solüsyonlarla uyumludur?', a: 'Duru ULV ailesindeki tüm modeller sc, ec ve wp formülasyonlu profesyonel pestisit ve dezenfektanlarla uyumludur. Yağ veya su bazlı solüsyonlar fark etmeksizin kullanılabilir.' },
  { q: 'Garanti süresi ve servis ağı nasıl?', a: 'Tüm makineler fabrikadan 2 yıl garantili çıkar. Türkiye genelinde yetkili servis ağımız mevcuttur; yedek parçalar Kayseri merkezdeki üretim tesisimizden temin edilir.' },
  { q: 'İhalelerde teknik şartname desteği veriyor musunuz?', a: 'Evet, kamu ihalelerinde teknik şartname yazımına destek sağlıyor, ihaleye özel teklif ve teknik dokümantasyon hazırlıyoruz. İletişim formundan veya WhatsApp üzerinden ulaşmanız yeterlidir.' },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const { has, toggle, isFull } = useCompare();
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return <Navigate to="/urunler" replace />;

  const category = getCategoryBySlug(product.category);
  const related = getRelated(product.slug, 3);
  const inCompare = has(product.slug);

  const handleCompare = () => {
    if (!inCompare && isFull) {
      toast.error('Karşılaştırmaya en fazla 4 ürün eklenebilir.');
      return;
    }
    toggle(product.slug);
    if (!inCompare) toast.success(`${product.name} karşılaştırmaya eklendi.`);
  };

  const handleQuote = () => {
    navigate(`/fiyat-teklifi?products=${product.slug}`);
  };

  return (
    <div data-testid={`product-detail-${product.slug}`}>
      {/* Breadcrumb */}
      <div className="bg-[#F3F4F5] border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-xs text-[#2B2E33]/60 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#1F3D2B]">Anasayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/urunler" className="hover:text-[#1F3D2B]">Ürünler</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/kategori/${category.slug}`} className="hover:text-[#1F3D2B]">{category.short}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1F3D2B] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Gallery + action bar */}
      <section className="bg-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="bg-[#F3F4F5] border border-[#2B2E33]/10 aspect-[4/3] overflow-hidden">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-opacity duration-300"
                data-testid="product-main-image"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  data-testid={`product-thumb-${i}`}
                  className={`aspect-square bg-[#F3F4F5] border overflow-hidden transition-all ${
                    activeImg === i ? 'border-[#1F3D2B]' : 'border-[#2B2E33]/10 hover:border-[#2B2E33]/30'
                  }`}
                  aria-label={`Görsel ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Info & actions */}
          <div className="lg:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-2">
              {category.short} · Model {product.model}
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-[#1F3D2B] tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="mt-4 text-base text-[#2B2E33]/75 leading-relaxed">
              {product.summary}
            </p>

            {/* Highlights chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.specs.slice(0, 4).map(([k, v]) => (
                <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#2B2E33]/15 text-[#2B2E33]/80 rounded-sm bg-white">
                  <span className="text-[#3E8E5C] font-semibold">{k}:</span> {v}
                </span>
              ))}
            </div>

            {/* Action bar */}
            <div className="mt-8 p-5 border border-[#2B2E33]/15 bg-white">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#2B2E33]/55 font-semibold">Talep edin</div>
                  <div className="font-display font-semibold text-[#1F3D2B] mt-0.5">Özel teklif &amp; teknik bilgi</div>
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#2B2E33]/45 mt-1">Aynı iş günü dönüş</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleQuote}
                  data-testid="product-quote-btn"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] transition-colors rounded-sm"
                >
                  Teklif Al <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCompare}
                  data-testid="product-compare-btn"
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold border rounded-sm transition-colors ${
                    inCompare
                      ? 'border-[#3E8E5C] text-[#1F3D2B] bg-[#3E8E5C]/10'
                      : 'border-[#2B2E33]/25 text-[#2B2E33] hover:border-[#1F3D2B] hover:text-[#1F3D2B]'
                  }`}
                >
                  {inCompare ? <Check className="w-4 h-4" /> : <GitCompareArrows className="w-4 h-4" />}
                  {inCompare ? 'Karşılaştırmadan çıkar' : 'Karşılaştır'}
                </button>
              </div>
              <a
                href="https://wa.me/905320659117"
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-center text-xs font-medium text-[#2B2E33]/65 hover:text-[#1F3D2B]"
              >
                veya WhatsApp ile hızlıca yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Specs table */}
      <section className="bg-[#F3F4F5] py-14 lg:py-20 border-y border-[#2B2E33]/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
            Teknik Özellikler
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1F3D2B] mb-8">{product.name} — teknik tablo</h2>
          <div className="bg-white border border-[#2B2E33]/15 overflow-x-auto">
            <table data-testid="product-specs-table" className="w-full text-sm">
              <tbody>
                {product.specs.map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F3F4F5]'}>
                    <th scope="row" className="text-left font-semibold text-[#1F3D2B] py-3 px-5 w-1/2 align-top border-r border-[#2B2E33]/10">
                      {key}
                    </th>
                    <td className="py-3 px-5 text-[#2B2E33]/85 align-top">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
            Neden bu model
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1F3D2B] mb-6">Detaylı açıklama</h2>
          <div className="prose prose-neutral max-w-none">
            {product.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#2B2E33]/80 leading-relaxed mb-5 text-base">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Usage areas */}
      <section className="bg-[#F3F4F5] py-14 lg:py-20 border-y border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
            Kullanım Alanları
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1F3D2B] mb-8">Bu model nerede tercih ediliyor?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#2B2E33]/10 border border-[#2B2E33]/10">
            {USAGE.map(u => (
              <div key={u.label} className="bg-white p-6 flex flex-col items-center gap-3 text-center">
                <u.icon className="w-7 h-7 text-[#1F3D2B]" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#2B2E33]">{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
            Sıkça Sorulan Sorular
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1F3D2B] mb-8">Hızlı yanıtlar</h2>
          <Accordion type="single" collapsible className="border border-[#2B2E33]/15 bg-white" data-testid="product-faq">
            {FAQS.map((f, i) => (
              <AccordionItem value={`faq-${i}`} key={i} className="border-b border-[#2B2E33]/10 last:border-b-0 px-5">
                <AccordionTrigger data-testid={`faq-trigger-${i}`} className="text-left font-display font-semibold text-[#1F3D2B] hover:no-underline py-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#2B2E33]/80 leading-relaxed pb-4 text-sm">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[#F3F4F5] py-14 lg:py-20 border-t border-[#2B2E33]/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
              İlgili Ürünler
            </div>
            <h2 className="font-display text-3xl font-bold text-[#1F3D2B] mb-8">Aynı kategoride incelenebilecek modeller</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
