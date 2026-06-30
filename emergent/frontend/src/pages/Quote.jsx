import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, CheckCircle2, X, Phone, MessageCircle, Mail } from 'lucide-react';
import { getProductBySlug } from '../data/products';
import { useCompare } from '../contexts/CompareContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initial = {
  full_name: '',
  company: '',
  phone: '',
  email: '',
  city: '',
  message: '',
  kvkk_accepted: false,
};

const Quote = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { slugs: compareSlugs, clear: clearCompare } = useCompare();

  const initialSelectedSlugs = useMemo(() => {
    const params = new URLSearchParams(search);
    const fromUrl = params.get('products');
    if (fromUrl) {
      return fromUrl.split(',').map(s => s.trim()).filter(Boolean);
    }
    return compareSlugs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedSlugs, setSelectedSlugs] = useState(initialSelectedSlugs);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = 'Teklif Al · Duru ULV';
  }, []);

  const selectedProducts = selectedSlugs.map(s => getProductBySlug(s)).filter(Boolean);

  const removeSlug = (slug) => setSelectedSlugs(prev => prev.filter(s => s !== slug));

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Ad Soyad zorunludur.';
    if (!form.phone.trim()) e.phone = 'Telefon zorunludur.';
    if (!form.email.trim()) e.email = 'E-posta zorunludur.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Geçerli bir e-posta giriniz.';
    if (!form.kvkk_accepted) e.kvkk_accepted = 'KVKK onayı zorunludur.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error('Lütfen zorunlu alanları kontrol edin.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/quotes`, {
        ...form,
        products: selectedProducts.map(p => p.slug),
      });
      setDone(true);
      clearCompare();
      toast.success('Teklif talebiniz alındı.');
    } catch (err) {
      console.error(err);
      toast.error('Gönderim başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (key) =>
    `w-full px-4 py-3 bg-white border text-[#2B2E33] placeholder:text-[#2B2E33]/40 text-sm rounded-sm focus:outline-none focus:ring-1 transition-colors ${
      errors[key]
        ? 'border-[#D63B2F] focus:border-[#D63B2F] focus:ring-[#D63B2F]'
        : 'border-[#2B2E33]/20 focus:border-[#1F3D2B] focus:ring-[#1F3D2B]'
    }`;

  if (done) {
    return (
      <div data-testid="quote-success" className="bg-[#F3F4F5] py-20 min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-[#2B2E33]/10 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#3E8E5C]/10 text-[#3E8E5C] rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-[#1F3D2B] mb-4">Teşekkürler!</h1>
            <p className="text-[#2B2E33]/75 leading-relaxed max-w-md mx-auto mb-8">
              Teklif talebiniz tarafımıza ulaştı. Satış mühendisimiz aynı iş günü içinde size dönüş yapacak.
              Acil durumlar için WhatsApp veya telefon ile de ulaşabilirsiniz.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:+903523202086" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-[#2B2E33]/20 text-[#2B2E33] hover:border-[#1F3D2B] hover:text-[#1F3D2B] rounded-sm">
                <Phone className="w-4 h-4" /> +90 352 320 20 86
              </a>
              <a href="https://wa.me/905320659117" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#25D366] text-white rounded-sm">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
            <div className="mt-8">
              <Link to="/" className="text-sm font-semibold text-[#1F3D2B] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                Anasayfaya dön <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="quote-page">
      <section className="bg-white py-14 lg:py-20 border-b border-[#2B2E33]/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">
            Fiyat Teklifi
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight">
            Operasyonunuza özel teklif alın.
          </h1>
          <p className="mt-5 text-[#2B2E33]/75 leading-relaxed">
            Formu doldurmanız yeterli. Satış mühendisimiz aynı iş günü içinde detaylı teknik teklif ve
            uygulanabilirlik bilgisi ile size geri dönecek.
          </p>
        </div>
      </section>

      <section className="bg-[#F3F4F5] py-14">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <form onSubmit={handleSubmit} data-testid="quote-form" noValidate className="bg-white border border-[#2B2E33]/10 p-6 lg:p-10">
            {/* Selected products */}
            <div className="mb-8">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#2B2E33]/55 font-semibold mb-3">
                Seçili Ürünler ({selectedProducts.length})
              </div>
              {selectedProducts.length === 0 ? (
                <div className="text-sm text-[#2B2E33]/65 border border-dashed border-[#2B2E33]/20 p-4 bg-[#F3F4F5]">
                  Henüz ürün seçilmedi. Form üzerinden genel bir bilgi talebi de gönderebilirsiniz; ya da
                  <Link to="/urunler" className="text-[#1F3D2B] font-semibold ml-1 underline">ürünleri keşfedin</Link>.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map(p => (
                    <span
                      key={p.slug}
                      data-testid={`quote-product-${p.slug}`}
                      className="inline-flex items-center gap-2 pl-3 pr-1 py-1.5 text-xs font-semibold border border-[#1F3D2B]/20 text-[#1F3D2B] bg-[#3E8E5C]/10 rounded-sm"
                    >
                      {p.name}
                      <button type="button" onClick={() => removeSlug(p.slug)} aria-label="Kaldır" className="ml-1 p-1 hover:text-[#D63B2F]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#2B2E33]/70 mb-2">Ad Soyad *</label>
                <input
                  data-testid="quote-input-name"
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  className={inputCls('full_name')}
                  placeholder="Adınız Soyadınız"
                />
                {errors.full_name && <p className="mt-1 text-xs text-[#D63B2F]">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#2B2E33]/70 mb-2">Firma / Kurum</label>
                <input
                  data-testid="quote-input-company"
                  type="text"
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  className={inputCls('company')}
                  placeholder="Belediye, kurum veya şirket adı"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#2B2E33]/70 mb-2">İl / İlçe</label>
                <input
                  data-testid="quote-input-city"
                  type="text"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className={inputCls('city')}
                  placeholder="Örn. Kayseri / Melikgazi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#2B2E33]/70 mb-2">Telefon *</label>
                <input
                  data-testid="quote-input-phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className={inputCls('phone')}
                  placeholder="+90 5XX XXX XX XX"
                />
                {errors.phone && <p className="mt-1 text-xs text-[#D63B2F]">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#2B2E33]/70 mb-2">E-posta *</label>
                <input
                  data-testid="quote-input-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={inputCls('email')}
                  placeholder="ornek@firma.com"
                />
                {errors.email && <p className="mt-1 text-xs text-[#D63B2F]">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#2B2E33]/70 mb-2">Mesaj</label>
                <textarea
                  data-testid="quote-input-message"
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className={inputCls('message')}
                  placeholder="Uygulama alanı, kapasite, miktar, ihale bilgisi gibi detayları paylaşabilirsiniz."
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    data-testid="quote-input-kvkk"
                    type="checkbox"
                    checked={form.kvkk_accepted}
                    onChange={e => setForm(f => ({ ...f, kvkk_accepted: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 accent-[#1F3D2B]"
                  />
                  <span className="text-sm text-[#2B2E33]/80 leading-relaxed">
                    <Link to="/kvkk" className="underline font-semibold">KVKK aydınlatma metnini</Link> okudum,
                    iletişim amacıyla kişisel verilerimin işlenmesine onay veriyorum.
                  </span>
                </label>
                {errors.kvkk_accepted && <p className="mt-2 text-xs text-[#D63B2F]">{errors.kvkk_accepted}</p>}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-xs text-[#2B2E33]/60 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Talebiniz tarafımıza ulaştığında bir kopyasını e-postanıza iletiriz.
              </div>
              <button
                type="submit"
                data-testid="quote-submit-btn"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-[#1F3D2B] text-white hover:bg-[#2B5239] rounded-sm transition-colors disabled:opacity-60"
              >
                {submitting ? 'Gönderiliyor…' : (<>Teklif Talebini Gönder <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Quote;
