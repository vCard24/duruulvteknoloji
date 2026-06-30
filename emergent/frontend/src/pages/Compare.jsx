import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Printer, Trash2, ArrowRight, GitCompareArrows } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';
import { getProductBySlug } from '../data/products';

const Compare = () => {
  const { slugs, remove, clear } = useCompare();
  const navigate = useNavigate();

  const products = useMemo(
    () => slugs.map(s => getProductBySlug(s)).filter(Boolean),
    [slugs]
  );

  // Build a unified spec key set, preserving the first occurrence order
  const allKeys = useMemo(() => {
    const seen = new Set();
    const keys = [];
    products.forEach(p => p.specs.forEach(([k]) => {
      if (!seen.has(k)) { seen.add(k); keys.push(k); }
    }));
    return keys;
  }, [products]);

  const getValue = (p, key) => {
    const found = p.specs.find(([k]) => k === key);
    return found ? found[1] : '—';
  };

  const handleQuote = () => {
    if (!products.length) return;
    navigate(`/fiyat-teklifi?products=${products.map(p => p.slug).join(',')}`);
  };

  return (
    <div data-testid="compare-page">
      <section className="bg-white py-14 lg:py-20 border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
              Ürün Karşılaştırma
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight">
              Seçili ürünlerinizi yan yana inceleyin.
            </h1>
            <p className="mt-4 max-w-xl text-[#2B2E33]/70 leading-relaxed">
              En fazla 4 modeli aynı anda karşılaştırabilir, tek bir adımda hepsi için teklif talep edebilirsiniz.
              Karşılaştırma linki tarayıcınızda saklanır ve URL üzerinden paylaşılabilir.
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-baseline gap-3">
              <span className="font-display text-5xl font-bold text-[#1F3D2B]">{products.length}</span>
              <span className="text-sm text-[#2B2E33]/65 uppercase tracking-[0.16em]">/ 4 seçili</span>
            </div>
          </div>
        </div>
      </section>

      {products.length === 0 ? (
        <section className="bg-[#F3F4F5] py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div data-testid="compare-empty-state" className="bg-white border border-[#2B2E33]/10 p-12 text-center">
              <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-[#1F3D2B]/15 text-[#1F3D2B]">
                <GitCompareArrows className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1F3D2B] mb-3">Henüz ürün seçmediniz</h2>
              <p className="text-[#2B2E33]/70 mb-8 max-w-md mx-auto leading-relaxed">
                Karşılaştırmak istediğiniz ürünleri "Karşılaştır" butonu ile listeye ekleyin. Maksimum 4 ürün
                aynı anda karşılaştırılabilir.
              </p>
              <Link
                to="/urunler"
                data-testid="compare-empty-cta"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] rounded-sm transition-colors"
              >
                Ürünleri Keşfet <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#F3F4F5] py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Actions bar */}
            <div className="no-print flex flex-wrap gap-3 mb-6 items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={clear}
                  data-testid="compare-clear-all"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-[#2B2E33]/20 text-[#2B2E33] hover:border-[#D63B2F] hover:text-[#D63B2F] rounded-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Tümünü temizle
                </button>
                <button
                  onClick={() => window.print()}
                  data-testid="compare-print"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-[#2B2E33]/20 text-[#2B2E33] hover:border-[#1F3D2B] hover:text-[#1F3D2B] rounded-sm transition-colors"
                >
                  <Printer className="w-4 h-4" /> Yazdır
                </button>
              </div>
              <button
                onClick={handleQuote}
                data-testid="compare-quote-all"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] rounded-sm transition-colors"
              >
                Seçili ürünler için teklif al <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#2B2E33]/15 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2B2E33]/10">
                    <th className="w-44 lg:w-56 p-4 text-left align-top bg-[#1F3D2B] text-white font-display font-semibold text-xs uppercase tracking-[0.16em]">
                      Özellik
                    </th>
                    {products.map(p => (
                      <th key={p.slug} className="p-4 align-top bg-white border-l border-[#2B2E33]/10 min-w-[200px]">
                        <div className="relative">
                          <button
                            onClick={() => remove(p.slug)}
                            data-testid={`compare-remove-${p.slug}`}
                            className="no-print absolute -top-1 -right-1 w-7 h-7 flex items-center justify-center border border-[#2B2E33]/15 text-[#2B2E33]/60 hover:text-[#D63B2F] hover:border-[#D63B2F] bg-white rounded-sm"
                            aria-label="Kaldır"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="aspect-square bg-[#F3F4F5] border border-[#2B2E33]/10 mb-3 overflow-hidden">
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-3" />
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.16em] text-[#2B2E33]/55 font-semibold">{p.model}</div>
                          <Link to={`/urun/${p.slug}`} className="block font-display font-semibold text-[#1F3D2B] mt-1 hover:underline leading-snug">
                            {p.name}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allKeys.map((key, i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F3F4F5]'}>
                      <th scope="row" className="text-left font-semibold text-[#1F3D2B] py-3 px-4 align-top border-r border-[#2B2E33]/10">
                        {key}
                      </th>
                      {products.map(p => (
                        <td key={p.slug} className="py-3 px-4 text-[#2B2E33]/85 align-top border-l border-[#2B2E33]/10">
                          {getValue(p, key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="no-print">
                    <th className="bg-[#1F3D2B] text-white p-4 font-display font-semibold text-xs uppercase tracking-[0.16em] text-left">Aksiyon</th>
                    {products.map(p => (
                      <td key={p.slug} className="p-4 border-l border-[#2B2E33]/10 bg-white">
                        <div className="flex flex-col gap-2">
                          <Link
                            to={`/urun/${p.slug}`}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-[#2B2E33]/20 text-[#2B2E33] hover:border-[#1F3D2B] hover:text-[#1F3D2B] rounded-sm"
                          >
                            İncele
                          </Link>
                          <button
                            onClick={() => navigate(`/fiyat-teklifi?products=${p.slug}`)}
                            data-testid={`compare-quote-${p.slug}`}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] rounded-sm"
                          >
                            Teklif Al
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Compare;
