import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, GitCompareArrows, ChevronDown } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from './ui/dropdown-menu';

const NAV = [
  { to: '/', label: 'Anasayfa' },
  { to: '/urunler', label: 'Ürünler' },
  { to: '/urun-karsilastirma', label: 'Karşılaştır' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/iletisim', label: 'İletişim' },
];

const LANGS = ['TR', 'EN', 'AR'];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('TR');
  const { slugs } = useCompare();
  const navigate = useNavigate();

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-[#2B2E33]/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" data-testid="site-logo" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-sm bg-[#1F3D2B] flex items-center justify-center">
              <span className="font-display text-white font-bold text-sm leading-none">D</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-[15px] text-[#1F3D2B] tracking-tight">DURU ULV</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#2B2E33]/60">Teknoloji Sistemleri</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                data-testid={`nav-${item.to.replace(/\//g, '') || 'home'}`}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-[#1F3D2B]' : 'text-[#2B2E33]/75 hover:text-[#1F3D2B]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {item.to === '/urun-karsilastirma' && slugs.length > 0 && (
                      <span data-testid="nav-compare-count" className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-sm bg-[#3E8E5C] text-white text-[10px] font-semibold">
                        {slugs.length}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] bg-[#1F3D2B]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            {/* Language switcher (placeholder) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="lang-switcher"
                  className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#2B2E33]/75 hover:text-[#1F3D2B] border border-[#2B2E33]/15 rounded-sm transition-colors"
                >
                  {lang} <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[100px]">
                {LANGS.map(l => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => setLang(l)}
                    data-testid={`lang-option-${l.toLowerCase()}`}
                    className="text-xs font-medium cursor-pointer"
                  >
                    {l}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Compare quick icon (mobile-friendly) */}
            <button
              onClick={() => navigate('/urun-karsilastirma')}
              data-testid="header-compare-btn"
              className="lg:hidden relative p-2 text-[#2B2E33]/75 hover:text-[#1F3D2B]"
              aria-label="Karşılaştır"
            >
              <GitCompareArrows className="w-5 h-5" />
              {slugs.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-sm bg-[#3E8E5C] text-white text-[10px] font-semibold flex items-center justify-center">
                  {slugs.length}
                </span>
              )}
            </button>

            {/* Primary CTA */}
            <Link
              to="/fiyat-teklifi"
              data-testid="header-quote-cta"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] transition-colors rounded-sm"
            >
              Teklif Al
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(v => !v)}
              data-testid="mobile-menu-toggle"
              className="lg:hidden p-2 text-[#2B2E33]"
              aria-label="Menüyü aç/kapat"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div data-testid="mobile-menu" className="lg:hidden border-t border-[#2B2E33]/10 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${item.to.replace(/\//g, '') || 'home'}`}
                className={({ isActive }) =>
                  `py-3 text-sm font-medium border-b border-[#2B2E33]/5 ${
                    isActive ? 'text-[#1F3D2B]' : 'text-[#2B2E33]/80'
                  }`
                }
              >
                {item.label}
                {item.to === '/urun-karsilastirma' && slugs.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-sm bg-[#3E8E5C] text-white text-[10px] font-semibold">
                    {slugs.length}
                  </span>
                )}
              </NavLink>
            ))}
            <Link
              to="/fiyat-teklifi"
              onClick={() => setOpen(false)}
              data-testid="mobile-quote-cta"
              className="mt-3 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold bg-[#1F3D2B] text-white rounded-sm"
            >
              Teklif Al
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
