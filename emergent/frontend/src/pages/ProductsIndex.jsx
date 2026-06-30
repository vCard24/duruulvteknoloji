import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';

const ProductsIndex = () => {
  return (
    <div data-testid="products-index">
      <div className="bg-[#F3F4F5] border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-xs text-[#2B2E33]/60 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#1F3D2B]">Anasayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1F3D2B] font-medium">Ürünler</span>
        </div>
      </div>

      <section className="bg-white py-14 lg:py-20 border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">Tüm Ürünler</div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight">
            Duru ULV ürün ailesi.
          </h1>
          <p className="mt-5 max-w-2xl text-[#2B2E33]/75 leading-relaxed">
            17 model, 4 kategori. Araç üzeri yüksek kapasiteli mist blower'lardan el tipi kompakt ULV
            cihazlarına kadar, her uygulamaya uygun bir model bulabilirsiniz.
          </p>
        </div>
      </section>

      {CATEGORIES.map(cat => {
        const items = PRODUCTS.filter(p => p.category === cat.slug);
        return (
          <section key={cat.slug} className="bg-[#F3F4F5] py-14 border-b border-[#2B2E33]/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-2">
                    Kategori · {items.length} model
                  </div>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#1F3D2B]">{cat.short}</h2>
                </div>
                <Link to={`/kategori/${cat.slug}`} className="text-sm font-semibold text-[#1F3D2B] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                  Kategori sayfasına git <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(p => <ProductCard key={p.slug} product={p} />)}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductsIndex;
