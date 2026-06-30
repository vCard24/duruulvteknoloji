/**
 * Yasal sayfa HTML içerikleri — generate-site-pages.js tarafından kullanılır.
 * Avukat onayı önerilir; metinler KVKK ve web sitesi kullanımına uygun şablon niteliğindedir.
 */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mailLink(email) {
  return `<a href="mailto:${esc(email)}" style="color:var(--color-primary);font-weight:600">${esc(email)}</a>`;
}

function kvkkHtml(k) {
  const today = '30 Haziran 2026';
  return `
          <p><strong>Son güncelleme:</strong> ${today}</p>
          <p>Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında <strong>${esc(k.firma_adi)}</strong> (“Veri Sorumlusu”) tarafından hazırlanmıştır.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">1. Veri Sorumlusu</h2>
          <ul style="padding-left:1.25rem;margin:0">
            <li><strong>Unvan:</strong> ${esc(k.firma_adi)}</li>
            <li><strong>Adres:</strong> ${esc(k.adres.satir1)}, ${esc(k.adres.satir2)}</li>
            <li><strong>Telefon:</strong> ${esc(k.telefon)}</li>
            <li><strong>E-posta:</strong> ${mailLink(k.email)}</li>
            <li><strong>Web:</strong> duruulvteknoloji.com.tr</li>
          </ul>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">2. İşlenen Kişisel Veriler</h2>
          <p>Web sitemiz ve iletişim kanallarımız aracılığıyla aşağıdaki kişisel verileriniz işlenebilir:</p>
          <ul style="padding-left:1.25rem">
            <li>Kimlik ve iletişim bilgileri (ad-soyad, unvan, kurum adı, telefon, e-posta, şehir/ilçe)</li>
            <li>Talep ve mesaj içeriği (teklif talebi, ürün tercihi, uygulama alanı, mesaj metni)</li>
            <li>İşlem güvenliği verileri (IP adresi, tarayıcı bilgisi, oturum kayıtları, çerez verileri)</li>
            <li>Pazarlama tercihleri (açık rıza vermeniz halinde bülten ve bilgilendirme tercihleri)</li>
          </ul>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul style="padding-left:1.25rem">
            <li>Teklif, satış ve satış sonrası destek süreçlerinin yürütülmesi</li>
            <li>İletişim taleplerinin yanıtlanması ve müşteri ilişkileri yönetimi</li>
            <li>Sözleşme ve yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Web sitesi güvenliğinin sağlanması ve kötüye kullanımın önlenmesi</li>
            <li>Ürün ve hizmetlerimiz hakkında bilgilendirme (açık rıza veya meşru menfaat kapsamında)</li>
            <li>İstatistiksel analiz ve hizmet kalitesinin iyileştirilmesi</li>
          </ul>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">4. Hukuki Sebepler</h2>
          <p>Kişisel verileriniz KVKK’nın 5. ve 6. maddelerinde belirtilen;</p>
          <ul style="padding-left:1.25rem">
            <li>Bir sözleşmenin kurulması veya ifası için gerekli olması,</li>
            <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi,</li>
            <li>Meşru menfaatlerimiz (iletişim talebinin yanıtlanması, güvenlik) için zorunlu olması,</li>
            <li>Açık rızanızın bulunması (pazarlama iletişimi gibi)</li>
          </ul>
          <p>hukuki sebeplerine dayanılarak işlenmektedir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">5. Kişisel Verilerin Aktarılması</h2>
          <p>Kişisel verileriniz; yalnızca belirtilen amaçlarla ve KVKK’ya uygun şekilde;</p>
          <ul style="padding-left:1.25rem">
            <li>Barındırma, e-posta ve iletişim altyapısı hizmet sağlayıcılarına,</li>
            <li>Yasal zorunluluk halinde yetkili kamu kurum ve kuruluşlarına,</li>
            <li>Denetim, mali müşavirlik ve hukuki danışmanlık hizmeti alınan taraflara (gerekli ölçüde)</li>
          </ul>
          <p>aktarılabilir. Yurt dışına aktarım söz konusu olduğunda KVKK’nın 9. maddesindeki şartlara uyulur.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">6. Saklama Süresi</h2>
          <p>Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri kadar saklanır; süre sonunda silinir, yok edilir veya anonim hale getirilir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">7. KVKK Kapsamındaki Haklarınız</h2>
          <p>KVKK’nın 11. maddesi uyarınca veri sorumlusuna başvurarak;</p>
          <ul style="padding-left:1.25rem">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>KVKK’nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
            <li>Otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
            <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde tazminat talep etme</li>
          </ul>
          <p>haklarına sahipsiniz.</p>
          <p>Başvurularınızı ${mailLink(k.email)} adresine veya yukarıdaki posta adresimize yazılı olarak iletebilirsiniz. Talebiniz en geç 30 gün içinde sonuçlandırılır.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">8. Güncellemeler</h2>
          <p>Bu metin yasal düzenlemeler veya faaliyetlerimizdeki değişiklikler doğrultusunda güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.</p>`;
}

function gizlilikHtml(k) {
  const today = '30 Haziran 2026';
  return `
          <p><strong>Son güncelleme:</strong> ${today}</p>
          <p>Bu gizlilik politikası, <strong>duruulvteknoloji.com.tr</strong> web sitesini ziyaret eden ve ${esc(k.firma_adi)} ile iletişime geçen kişilerin kişisel verilerinin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">1. Toplanan Bilgiler</h2>
          <p>Sitemizi kullanırken aşağıdaki bilgiler toplanabilir:</p>
          <ul style="padding-left:1.25rem">
            <li><strong>Doğrudan sağladığınız bilgiler:</strong> teklif formu, iletişim formu ve e-posta yoluyla paylaştığınız ad, kurum, telefon, e-posta ve mesaj içeriği.</li>
            <li><strong>Otomatik toplanan bilgiler:</strong> IP adresi, cihaz ve tarayıcı türü, ziyaret edilen sayfalar, oturum süresi ve yönlendirme kaynakları.</li>
            <li><strong>Çerezler:</strong> site işlevselliği ve (onay vermeniz halinde) analitik amaçlı çerezler. Ayrıntılar için tarayıcı ayarlarınızı kullanabilirsiniz.</li>
          </ul>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">2. Bilgilerin Kullanım Amaçları</h2>
          <ul style="padding-left:1.25rem">
            <li>Teklif ve bilgi taleplerinize yanıt vermek</li>
            <li>Ürün satışı, teslimat ve teknik destek süreçlerini yürütmek</li>
            <li>Web sitesinin güvenliğini sağlamak ve kötüye kullanımı önlemek</li>
            <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            <li>Hizmet kalitemizi ölçmek ve geliştirmek</li>
          </ul>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">3. Bilgi Paylaşımı</h2>
          <p>Kişisel bilgileriniz üçüncü taraflara satılmaz. Yalnızca hizmetin sunulması (hosting, e-posta), yasal zorunluluk veya açık rızanız kapsamında sınırlı paylaşım yapılabilir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">4. Veri Güvenliği</h2>
          <p>Verilerinizi yetkisiz erişim, kayıp veya ifşaya karşı korumak için teknik ve idari tedbirler uygulanmaktadır. İletişim formları güvenli bağlantı (HTTPS) üzerinden iletilir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">5. Saklama Süresi</h2>
          <p>Veriler, işleme amacının gerektirdiği süre ve yasal saklama yükümlülükleri boyunca muhafaza edilir; ardından silinir veya anonimleştirilir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">6. Haklarınız</h2>
          <p>KVKK kapsamındaki haklarınız için <a href="../kvkk/index.html" style="color:var(--color-primary);font-weight:600">KVKK Aydınlatma Metni</a> sayfamıza bakabilir veya ${mailLink(k.email)} adresine başvurabilirsiniz.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">7. İletişim</h2>
          <p>Gizlilik ile ilgili sorularınız için: ${esc(k.firma_adi)}, ${esc(k.adres.satir1)}, ${esc(k.adres.satir2)} — ${mailLink(k.email)}</p>`;
}

function kullanimKosullariHtml(k) {
  const today = '30 Haziran 2026';
  return `
          <p><strong>Son güncelleme:</strong> ${today}</p>
          <p><strong>duruulvteknoloji.com.tr</strong> web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Site, ${esc(k.firma_adi)} (“Şirket”) tarafından işletilmektedir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">1. Site Kapsamı</h2>
          <p>Bu web sitesi; ULV ilaçlama makineleri, mist blower ve ilgili ekipmanlar hakkında bilgilendirme, ürün tanıtımı ve teklif talebi toplama amacıyla sunulmaktadır. Sitede yer alan teknik bilgiler genel bilgilendirme niteliğindedir; nihai özellikler sipariş ve sözleşme aşamasında teyit edilir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">2. Fiyat ve Teklif Politikası</h2>
          <p>${esc(k.fiyat_politikasi || 'Sitede ürün fiyatı gösterilmez; satış yalnızca teklif formu veya doğrudan iletişim yoluyla gerçekleştirilir.')}</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">3. Fikri Mülkiyet</h2>
          <p>Sitedeki metin, görsel, logo, ürün fotoğrafları, teknik çizimler ve tasarım unsurları Şirket’e veya lisans verenlerine aittir. Yazılı izin olmaksızın kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">4. Kullanıcı Yükümlülükleri</h2>
          <ul style="padding-left:1.25rem">
            <li>Siteyi yalnızca yasal ve meşru amaçlarla kullanmak</li>
            <li>İletişim formlarında doğru ve güncel bilgi vermek</li>
            <li>Site güvenliğini tehdit edecek girişimlerde bulunmamak</li>
            <li>Üçüncü kişilerin haklarını ihlal edecek içerik paylaşmamak</li>
          </ul>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">5. Sorumluluk Sınırı</h2>
          <p>Site “olduğu gibi” sunulmaktadır. Şirket, site içeriğinin kesintisiz veya hatasız olacağını taahhüt etmez. Ürünlerin doğru kullanımı, ilaçlama mevzuatına uygunluk ve saha uygulamaları kullanıcının sorumluluğundadır. Dolaylı zararlardan Şirket sorumlu tutulamaz.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">6. Dış Bağlantılar</h2>
          <p>Sitede üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu sitelerin içerik ve gizlilik uygulamalarından Şirket sorumlu değildir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">7. Değişiklikler</h2>
          <p>Şirket, bu koşulları önceden bildirmeksizin güncelleme hakkını saklı tutar. Güncel metin yayımlandığı tarihten itibaren geçerlidir.</p>

          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">8. Uygulanacak Hukuk ve İletişim</h2>
          <p>Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda Kayseri mahkeme ve icra daireleri yetkilidir. Sorularınız için: ${mailLink(k.email)} — ${esc(k.telefon)}</p>`;
}

module.exports = { kvkkHtml, gizlilikHtml, kullanimKosullariHtml };
