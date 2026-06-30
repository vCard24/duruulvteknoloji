import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { CATEGORIES, getCategoryBySlug, getProductsByCategory } from '../data/products';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const products = getProductsByCategory(slug);

  if (!category) return <Navigate to="/urunler" replace />;

  return (
    <div data-testid={`category-page-${slug}`}>
      {/* Breadcrumb */}
      <div className="bg-[#F3F4F5] border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-xs text-[#2B2E33]/60 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#1F3D2B]">Anasayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/urunler" className="hover:text-[#1F3D2B]">Ürünler</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1F3D2B] font-medium">{category.short}</span>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white py-14 lg:py-20 border-b border-[#2B2E33]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
              Kategori
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight leading-tight">
              {category.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[#2B2E33]/75 leading-relaxed">
              {category.description}
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <div className="inline-flex items-baseline gap-3">
              <span className="font-display text-5xl font-bold text-[#1F3D2B]">{products.length}</span>
              <span className="text-sm text-[#2B2E33]/65 uppercase tracking-[0.16em]">aktif model</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[#F3F4F5] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="bg-white border border-[#2B2E33]/10 p-12 text-center">
              <p className="text-[#2B2E33]/70">Bu kategoride henüz ürün bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Other categories */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
            Diğer Kategoriler
          </div>
          <h3 className="font-display text-2xl font-bold text-[#1F3D2B] mb-8">İhtiyacınıza göre kategoriler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2B2E33]/10 border border-[#2B2E33]/10">
            {CATEGORIES.filter(c => c.slug !== slug).map(c => (
              <Link key={c.slug} to={`/kategori/${c.slug}`} className="bg-white p-6 hover:bg-[#F3F4F5] transition-colors">
                <div className="font-display font-semibold text-[#1F3D2B]">{c.short}</div>
                <div className="text-sm text-[#2B2E33]/65 mt-1 line-clamp-2">{c.description}</div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/urunler" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F3D2B]">
              <ArrowLeft className="w-4 h-4" /> Tüm ürünlere dön
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
