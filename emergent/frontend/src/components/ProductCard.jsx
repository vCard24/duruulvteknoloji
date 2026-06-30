import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, GitCompareArrows, ArrowRight } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { has, toggle, isFull } = useCompare();
  const inCompare = has(product.slug);
  const [flash, setFlash] = useState(false);

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCompare && isFull) {
      toast.error('Karşılaştırmaya en fazla 4 ürün eklenebilir.');
      return;
    }
    toggle(product.slug);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
    if (!inCompare) toast.success(`${product.name} karşılaştırmaya eklendi.`);
  };

  return (
    <article
      data-testid={`product-card-${product.slug}`}
      className={`group lift-card bg-white border border-[#2B2E33]/10 flex flex-col ${flash ? 'compare-flash' : ''}`}
    >
      <Link to={`/urun/${product.slug}`} className="block">
        <div className="aspect-[4/3] bg-[#F3F4F5] overflow-hidden border-b border-[#2B2E33]/10">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#2B2E33]/55 font-semibold">
            {product.model}
          </span>
        </div>
        <Link to={`/urun/${product.slug}`} className="block">
          <h3 className="font-display text-lg font-semibold text-[#1F3D2B] leading-snug mb-1.5">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-[#2B2E33]/70 leading-relaxed mb-5 flex-1">
          {product.summary}
        </p>

        <div className="flex gap-2 mt-auto">
          <Link
            to={`/urun/${product.slug}`}
            data-testid={`product-card-view-${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] transition-colors rounded-sm"
          >
            İncele <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleCompare}
            data-testid={`product-card-compare-${product.slug}`}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold border rounded-sm transition-colors ${
              inCompare
                ? 'border-[#3E8E5C] text-[#1F3D2B] bg-[#3E8E5C]/10'
                : 'border-[#2B2E33]/20 text-[#2B2E33] hover:border-[#1F3D2B] hover:text-[#1F3D2B]'
            }`}
            aria-label={inCompare ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}
          >
            {inCompare ? <Check className="w-4 h-4" /> : <GitCompareArrows className="w-4 h-4" />}
            <span className="hidden sm:inline">{inCompare ? 'Eklendi' : 'Karşılaştır'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
