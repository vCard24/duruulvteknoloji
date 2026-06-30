import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '@/components/Layout';
import { CompareProvider } from '@/contexts/CompareContext';

import Home from '@/pages/Home';
import ProductsIndex from '@/pages/ProductsIndex';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetail from '@/pages/ProductDetail';
import Compare from '@/pages/Compare';
import Quote from '@/pages/Quote';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import { Privacy, KVKK, Terms } from '@/pages/Legal';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CompareProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/urunler" element={<ProductsIndex />} />
              <Route path="/kategori/:slug" element={<CategoryPage />} />
              <Route path="/urun/:slug" element={<ProductDetail />} />
              <Route path="/urun-karsilastirma" element={<Compare />} />
              <Route path="/fiyat-teklifi" element={<Quote />} />
              <Route path="/hakkimizda" element={<About />} />
              <Route path="/iletisim" element={<Contact />} />
              <Route path="/gizlilik" element={<Privacy />} />
              <Route path="/kvkk" element={<KVKK />} />
              <Route path="/kosullar" element={<Terms />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </CompareProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
