# Duru ULV Teknoloji Sistemleri — PRD

## Problem Statement
MVP/skeleton website for **Duru ULV Teknoloji Sistemleri** — a Turkish manufacturer (since 1990, 36 yrs) of ULV (Ultra Low Volume) machines for disinfection, pest control and agricultural spraying. Corporate/technical B2B/B2G site for municipalities, public institutions, hospitals, greenhouses/farms, factories. NO prices, NO add-to-cart. All content to be polished later in Cursor.

## Architecture
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn UI + Sonner (toasts) + Lucide icons. Fonts: Space Grotesk (headings) + IBM Plex Sans (body). Brand palette: #1F3D2B (dark green), #3E8E5C (accent), #2B2E33 (ink), #F3F4F5 (bg), #D63B2F (error only).
- **Backend**: FastAPI + Motor (MongoDB). Mock quote endpoint stores in MongoDB.
- **Routes**: `/`, `/urunler`, `/kategori/:slug`, `/urun/:slug`, `/urun-karsilastirma`, `/fiyat-teklifi`, `/hakkimizda`, `/iletisim`, `/gizlilik`, `/kvkk`, `/kosullar`.
- **State**: Compare list — localStorage + URL `?compare=slug1,slug2` (max 4, shareable).

## Implemented (Feb 2026)
- Homepage: hero + grid bg, 4-category bento grid, dark-green trust band with stats, 6-sector strip, featured products, CTA, footer.
- 17 products across 4 categories (Araç Üzeri 5 / Sera Tipi 5 / Sırt Tipi 1 / El Tipi 7). Real spec tables for Entosis Mist Blower 500L, Entosis 50, Duru X20 from brand catalog.
- Category page (`/kategori/el-tipi` etc.) with breadcrumb + card grid.
- Product detail: gallery (main + 4 thumbs), title/model/summary, action bar (Teklif Al + Karşılaştır), highlight chips, two-column specs `<table>` with alternating rows, 2-paragraph description, 6-icon usage grid, 4-item FAQ accordion, related products.
- Comparison page: empty state + populated side-by-side table (max 4), URL sync, localStorage persistence, remove/clear/print/quote-all actions.
- Quote form: validation, KVKK gate, selected-products chips, axios POST `/api/quotes`, success screen.
- About + Contact (Google map iframe) pages with real address (Osman Kavuncu Mah. Emirhan Cad. No: 4/C, Melikgazi/Kayseri) and phones (+90 352 320 20 86, +90 532 065 91 17, takcan@gmail.com).
- Header: logo, nav, TR/EN/AR language switcher (UI placeholder), Teklif Al CTA, mobile hamburger drawer.
- Footer: contact, 7 cert badges, legal links.
- Floating WhatsApp button (bottom-left, pulse ring, wa.me/905320659117).

## P1 Backlog (next phase / Cursor)
- Multilingual content (EN, AR).
- Real product photography (replace placeholders for Sera/Sırt/El categories — currently rotate 4 user images + 2 stock).
- Real spec tables for remaining 14 products.
- Email send + PDF generation for quote submissions.
- City/district SEO landing pages (81 il + ilçeler).
- Blog system.
- Logo redesign / actual cert logos (currently text badges).

## P2 Backlog
- CMS backend for editing products without code.
- Admin dashboard for quote requests.
- Analytics + conversion tracking.

## Personas
- Belediye satınalma müdürü (procurement) — ihale şartnamesi ve teknik karşılaştırma odaklı.
- Hastane teknik birim sorumlusu — dezenfeksiyon kapasitesi ve sertifika odaklı.
- Sera/çiftlik işletme sahibi — kapasite (dönüm) ve solüsyon uyumu odaklı.
- Fabrika HSE sorumlusu — saha güvenliği ve servis sürekliliği odaklı.
