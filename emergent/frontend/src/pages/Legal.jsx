import React from 'react';

const LegalPage = ({ title, intro }) => (
  <div data-testid={`legal-${title.toLowerCase()}`}>
    <section className="bg-white py-14 lg:py-20 border-b border-[#2B2E33]/10">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#3E8E5C] font-semibold mb-3">Yasal</div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight">{title}</h1>
        <p className="mt-5 text-[#2B2E33]/75 leading-relaxed">{intro}</p>
      </div>
    </section>
    <section className="bg-[#F3F4F5] py-14">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="bg-white border border-[#2B2E33]/10 p-8 lg:p-10 prose prose-neutral max-w-none">
          <p className="text-[#2B2E33]/70 leading-relaxed">
            Bu sayfa MVP aşamasında placeholder olarak yayında. Tam metin Cursor'da hazırlanıp burada
            yayına alınacak. Bu süreçte sorularınız için <a href="mailto:takcan@gmail.com" className="text-[#1F3D2B] font-semibold underline">takcan@gmail.com</a>
            adresine yazabilirsiniz.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export const Privacy = () => <LegalPage title="Gizlilik Politikası" intro="Kişisel verilerinizin nasıl işlendiğine ilişkin politika metni." />;
export const KVKK = () => <LegalPage title="KVKK Aydınlatma Metni" intro="6698 sayılı KVKK kapsamında aydınlatma metni." />;
export const Terms = () => <LegalPage title="Kullanım Koşulları" intro="duruulvteknoloji.com.tr kullanım koşulları." />;
