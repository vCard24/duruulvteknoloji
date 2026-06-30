import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'duru_compare_v1';
const MAX_ITEMS = 4;
const CompareContext = createContext(null);

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export const CompareProvider = ({ children }) => {
  const [slugs, setSlugs] = useState(() => readStorage());
  const location = useLocation();
  const navigate = useNavigate();

  // On first mount, hydrate from URL ?compare= if present (overrides storage when shared)
  useEffect(() => {
    if (location.pathname.startsWith('/urun-karsilastirma')) {
      const params = new URLSearchParams(location.search);
      const raw = params.get('compare');
      if (raw) {
        const urlSlugs = raw.split(',').map(s => s.trim()).filter(Boolean).slice(0, MAX_ITEMS);
        if (urlSlugs.length) {
          setSlugs(urlSlugs);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to storage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs)); } catch { /* ignore */ }
  }, [slugs]);

  // Keep URL in sync when on comparison page
  useEffect(() => {
    if (location.pathname.startsWith('/urun-karsilastirma')) {
      const params = new URLSearchParams(location.search);
      const next = slugs.length ? slugs.join(',') : '';
      const current = params.get('compare') || '';
      if (next !== current) {
        if (next) params.set('compare', next); else params.delete('compare');
        navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs, location.pathname]);

  const add = (slug) => {
    setSlugs(prev => {
      if (prev.includes(slug)) return prev;
      if (prev.length >= MAX_ITEMS) return prev;
      return [...prev, slug];
    });
  };
  const remove = (slug) => setSlugs(prev => prev.filter(s => s !== slug));
  const toggle = (slug) => {
    if (slugs.includes(slug)) remove(slug);
    else add(slug);
  };
  const clear = () => setSlugs([]);
  const has = (slug) => slugs.includes(slug);
  const isFull = slugs.length >= MAX_ITEMS;

  const value = useMemo(() => ({ slugs, add, remove, toggle, clear, has, isFull, max: MAX_ITEMS }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slugs]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return ctx;
};
