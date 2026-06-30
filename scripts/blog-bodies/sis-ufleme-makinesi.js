/** Zengin HTML gövde — sis-ufleme-makinesi-mist-blower-nedir-rehber (Emergent stili) */
const { blogIcon } = require('../blog-icons');

module.exports = function sisUflemeMakinesiBody(prefix, esc) {
  const p = prefix;
  const slug = 'sis-ufleme-makinesi-mist-blower-nedir-rehber';
  const cover = `${p}assets/img/blog/${slug}-cover.png`;
  const alimRehberi = `${p}assets/img/blog/${slug}-alim-rehberi.png`;
  const duruImg = `${p}assets/img/products/duru-mist-blower-15hp-01.webp`;
  const entosisImg = `${p}assets/img/products/entosis-mist-blower-500l-01.webp`;
  const i = blogIcon;

  return `<h2 id="nedir">Sis Üfleme Makinesi (Mist Blower) Nedir ve Nasıl Çalışır?</h2>
<p>Geniş alanlarda, tarım arazilerinde veya şehir içi sokaklarda zararlılarla mücadele etmek, doğru teknoloji olmadan hem zaman hem de bütçe israfına dönüşebilir. İşte tam bu noktada <strong>sis üfleme makinesi</strong> (sektörel adıyla mist blower) devreye girer.</p>
<p>Sivrisinek, karasinek, kene ve pire gibi halk sağlığını doğrudan tehdit eden vektörlere karşı en etkili silah olan bu cihazlar; güçlü bir fan sistemi yardımıyla yüksek hızda hava akımı yaratarak sıvı formdaki kimyasal ilaçları (insektisit, larvasit veya dezenfektan) çok uzak mesafelere püskürten profesyonel ilaçlama makineleridir.</p>

<h2 id="fark">Mist Blower ile Standart Pülverizatör Arasındaki Fark Nedir?</h2>
<p>Basit su pompalarından veya standart pülverizatörlerden en büyük farkı, ilacı sadece su basıncıyla değil, yüksek debili hava akımıyla hedefe ulaştırmasıdır. Bu devrim niteliğindeki çalışma prensibi sayesinde sıvı damlacıklar hedeflenen 35 mikron seviyesine kadar küçültülür ve adeta bir sis bulutuna dönüştürülür.</p>

<div class="blog-compare-grid">
  <div class="blog-compare-card blog-compare-card--mist">
    <div class="blog-compare-card__icon-wrap">${i('wind', 'blog-icon blog-icon--lg')}</div>
    <span class="blog-compare-card__label">Mist Blower</span>
    <h3 class="blog-compare-card__title">Hava akımı ile taşıma</h3>
    <ul class="blog-compare-card__list">
      <li>Güçlü fan ve yüksek debili hava akımı</li>
      <li>Yoğun sis bulutu — geniş alan kaplaması</li>
      <li>Sokak araları, ağaç tepeleri, bina üst katları</li>
      <li>35 mikron hedef damlacık boyutu</li>
    </ul>
  </div>
  <div class="blog-compare-card blog-compare-card--pulv">
    <div class="blog-compare-card__icon-wrap">${i('droplets', 'blog-icon blog-icon--lg')}</div>
    <span class="blog-compare-card__label">Standart Pülverizatör</span>
    <h3 class="blog-compare-card__title">Su basıncı ile püskürtme</h3>
    <ul class="blog-compare-card__list">
      <li>Pompa basıncına dayalı dağılım</li>
      <li>Daha iri damlacıklar — hızlı çökme eğilimi</li>
      <li>Kısa menzil, sınırlı havada asılı kalma</li>
      <li>Uçan haşere temasında düşük verim</li>
    </ul>
  </div>
</div>

<figure class="blog-trust-banner blog-trust-banner--full">
  <img src="${cover}" alt="Mist blower nasıl çalışır - teknik inceleme, 35 mikron mikronizasyon ve hava akım kanalı şeması" class="blog-trust-banner__img" loading="lazy">
  <figcaption class="blog-trust-banner__caption">Mist blower nasıl çalışır — 15 HP motor, nozul mikronizasyon noktası ve 35 mikron damlacık dönüşümü</figcaption>
</figure>

<div class="blog-micron-highlight">
  <div class="blog-micron-highlight__value">35 <span class="blog-micron-highlight__unit">μm</span></div>
  <div class="blog-micron-highlight__body">
    <h3 class="blog-micron-highlight__title">Optimum damlacık boyutu</h3>
    <ul class="blog-micron-highlight__list">
      <li>${i('check', 'blog-icon blog-icon--sm')} Havada uzun süre asılı kalır</li>
      <li>${i('check', 'blog-icon blog-icon--sm')} Uçan haşere temas olasılığını artırır</li>
      <li>${i('check', 'blog-icon blog-icon--sm')} Geniş alanlara homojen dağılım sağlar</li>
    </ul>
  </div>
</div>

<div class="blog-feature-band">
  <div class="blog-feature-band__item">
    <span class="blog-feature-band__stat">35<span class="blog-feature-band__unit">μm</span></span>
    <span class="blog-feature-band__label">Optimum Damlacık</span>
    <p>Sivrisinek mücadelede hedef mikron çapı</p>
  </div>
  <div class="blog-feature-band__item blog-feature-band__item--accent">
    <div class="blog-feature-band__icon-row">
      ${i('arrowUp', 'blog-icon blog-icon--lg')}
      ${i('mosquito', 'blog-icon blog-icon--lg blog-icon--muted')}
    </div>
    <span class="blog-feature-band__label">% Temas Verimliliği</span>
    <p>İlacın havada asılı kalması ile maksimum temas</p>
  </div>
  <div class="blog-feature-band__item">
    <span class="blog-feature-band__stat">15–18<span class="blog-feature-band__unit">HP</span></span>
    <span class="blog-feature-band__label">Motor Gücü</span>
    <p>Amerikan motor ile kesintisiz saha performansı</p>
  </div>
</div>

<h2 id="mikron">Damlacık Boyutu Neden Bu Kadar Önemlidir?</h2>
<p>Bir sis üfleme makinesi kullanırken en kritik parametre mikron çapıdır. Sivrisinek gibi uçan haşerelerle mücadelede ilacın yere hemen düşmemesi hayati önem taşır.</p>

<div class="blog-metric-grid">
  <div class="blog-metric-card">
    <span class="blog-metric-card__icon" aria-hidden="true">${i('arrowUp', 'blog-icon')}</span>
    <h3 class="blog-metric-card__title">Havada Asılı Kalma</h3>
    <p>35 mikron boyutundaki bir damlacık havada uzun süre asılı kalır.</p>
  </div>
  <div class="blog-metric-card">
    <span class="blog-metric-card__icon" aria-hidden="true">${i('target', 'blog-icon')}</span>
    <h3 class="blog-metric-card__title">Maksimum Temas</h3>
    <p>Uçan haşerenin ilaçla temas etme olasılığı maksimize edilir.</p>
  </div>
  <div class="blog-metric-card">
    <span class="blog-metric-card__icon" aria-hidden="true">${i('expand', 'blog-icon')}</span>
    <h3 class="blog-metric-card__title">Geniş Alan Kaplaması</h3>
    <p>Güçlü Amerikan motorları sayesinde sis bulutu; sokak aralarında binaların üst katlarına, ağaçların tepe noktalarına ve rüzgarın yardımıyla çok geniş dönümlere ulaşır.</p>
  </div>
</div>

<h2 id="modeller">Sahada Fark Yaratan Teknolojiler: Profesyonel Mist Blower Modelleri</h2>
<p>Kullanıcıların yüksek performans, dayanıklılık ve kullanım kolaylığı beklentilerini karşılamak üzere tasarlanan <a href="${p}urunler/arac-uzeri-ilaclama/index.html">araç üstü profesyonel mist blower</a> modellerini detaylıca inceleyelim. Aşağıdaki her iki cihaz da pick-up veya kamyonet kasalarına kolayca entegre edilebilir; Mist Blower, ULV ve Pulverizatör özelliklerini tek bir kasada birleştirir.</p>

<div class="blog-product-block" id="duru-15hp">
  <div class="blog-product-block__head">
    <span class="blog-product-block__badge">01 · Model İnceleme</span>
    <h3 class="blog-product-block__title">Duru Mist Blower 15HP (400L) İncelemesi</h3>
  </div>
  <div class="blog-product-block__split">
    <div class="blog-product-block__media">
      <img src="${duruImg}" alt="Araç üstü sisleme makinesi - Duru Mist Blower 15HP pick-up kasasına monte edilmiş" class="blog-product-block__img" loading="lazy">
    </div>
    <div class="blog-product-block__copy">
      <p>Kompakt yapısı, güçlü 15 HP Amerikan motoru ve 400 litrelik ideal tank kapasitesiyle <a href="${p}urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html">Duru Mist Blower 15HP (400L)</a>, özellikle dar sokaklara sahip ilçeler, orta ölçekli belediyeler ve büyük tatil köyleri için biçilmiş kaftandır.</p>
      <p>Cihazın en büyük avantajı, 3 farklı püskürtme sistemini (Mist blower – ULV – Pulverizatör) bünyesinde barındırmasıdır. 30 metrelik holder hortumu, aracın giremediği park içlerine, bina bodrumlarına veya çöp toplama alanlarına yaya olarak müdahale etme şansı tanır.</p>
    </div>
  </div>
  <div class="blog-spec-table-wrap">
    <table class="blog-spec-table">
      <caption class="blog-spec-table__caption">Duru Mist Blower 15HP (400L) — Teknik Özellikler</caption>
      <tbody>
        <tr><th scope="row">Kullanım Tipi</th><td>Araç Üzeri (Model DMB-15HP-400)</td></tr>
        <tr><th scope="row">Motor</th><td>15 Hp Amerikan Motor</td></tr>
        <tr><th scope="row">Batarya</th><td>12 V DC – 60 Ah</td></tr>
        <tr><th scope="row">İlaç Tank Kapasitesi</th><td>400 Litre</td></tr>
        <tr><th scope="row">Püskürtme Sistemleri</th><td>Mist blower – ULV – Pulverizatör</td></tr>
        <tr><th scope="row">Pompa</th><td>14 Litre / Dakika, 150 Bar Basınç</td></tr>
        <tr><th scope="row">ULV Mikron Değeri</th><td>35 Mikron (Sabit)</td></tr>
        <tr><th scope="row">Holder Hortum</th><td>30 Metre</td></tr>
        <tr><th scope="row">Ağırlık</th><td>340 kg</td></tr>
      </tbody>
    </table>
  </div>
  <div class="blog-callout blog-callout--tip">
    <div class="blog-callout__head">${i('sparkles', 'blog-icon blog-icon--accent')}<strong>Neden Bu Modeli Seçmelisiniz?</strong></div>
    <p>Eğer manevra kabiliyeti yüksek standart bir pick-up kullanacaksanız ve araç üzerindeki ağırlık dengesini korumak istiyorsanız, 340 kg boş ağırlığı ile bu cihaz en ergonomik ve güvenli çözümdür.</p>
  </div>
  <div class="blog-product-block__actions">
    <a href="${p}urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html" class="btn btn--secondary btn--sm">Ürün sayfası</a>
    <a href="${p}fiyat-teklifi/index.html" class="btn btn--primary btn--sm">Teklif al ${i('chevronRight', 'blog-icon blog-icon--btn')}</a>
  </div>
</div>

<div class="blog-product-block" id="entosis-500l">
  <div class="blog-product-block__head">
    <span class="blog-product-block__badge">02 · Model İnceleme</span>
    <h3 class="blog-product-block__title">Entosis Mist Blower (500L) İncelemesi</h3>
  </div>
  <div class="blog-product-block__split">
    <div class="blog-product-block__media">
      <img src="${entosisImg}" alt="Yüksek kapasiteli araç üstü sisleme makinesi - Entosis Mist Blower 500L" class="blog-product-block__img" loading="lazy">
    </div>
    <div class="blog-product-block__copy">
      <p>Geniş bulvarlar, büyükşehir belediyelerinin sorumluluk alanları ve devasa tarım arazileri için tasarlanmış tam bir güç merkezidir. <a href="${p}urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html">Entosis Mist Blower (500L)</a> modeli, 500 litrelik devasa tankı ve hayat kurtaran joystick kumanda paneli ile öne çıkar.</p>
      <p>Operatör, araç kabininden hiç çıkmadan elindeki joystick ile makinenin başlığını sağa-sola 340 derece, yukarı-aşağı 210 derece yönlendirebilir. 6+1 nozul sistemi, atılan ilacın mükemmel bir homojenlikle dağılmasını sağlar.</p>
    </div>
  </div>
  <div class="blog-spec-table-wrap">
    <table class="blog-spec-table">
      <caption class="blog-spec-table__caption">Entosis Mist Blower (500L) — Teknik Özellikler</caption>
      <tbody>
        <tr><th scope="row">Kullanım Tipi</th><td>Araç Üzeri (Model EMB-500)</td></tr>
        <tr><th scope="row">Motor</th><td>15 Hp – 18 Hp Amerikan Motor</td></tr>
        <tr><th scope="row">Kumanda Sistemi</th><td>Joystick Hareketli (Kabin içinden kontrol)</td></tr>
        <tr><th scope="row">Başlık Hareketi</th><td>340° Sağa-Sola, 210° Yukarı-Aşağı</td></tr>
        <tr><th scope="row">İlaç Tank Kapasitesi</th><td>500 Litre</td></tr>
        <tr><th scope="row">Yakıt Tüketimi / Depo</th><td>4 Litre/Saat – 30 Litre Yakıt Deposu</td></tr>
        <tr><th scope="row">Pompa</th><td>14 Litre / Dakika, 150 Bar</td></tr>
        <tr><th scope="row">Püskürtme Sistemleri</th><td>Mist blower – ULV – Pulverizatör</td></tr>
        <tr><th scope="row">İlaç Formülasyonu</th><td>SC – EC – WP Uyumlu</td></tr>
        <tr><th scope="row">Nozul Sayısı</th><td>6+1 Adet</td></tr>
        <tr><th scope="row">ULV Mikron Değeri</th><td>35 Mikron</td></tr>
        <tr><th scope="row">Holder Hortum / Ağırlık</th><td>30 Metre (İsteğe bağlı 50 m) / 400 kg</td></tr>
        <tr><th scope="row">Ekstra Donanımlar</th><td>15 Litre El Yıkama Tankı</td></tr>
      </tbody>
    </table>
  </div>
  <div class="blog-callout blog-callout--tip">
    <div class="blog-callout__head">${i('sparkles', 'blog-icon blog-icon--accent')}<strong>Neden Bu Modeli Seçmelisiniz?</strong></div>
    <p>Maksimum ilaçlama kapasitesi ve minimum personel eforu hedefleniyorsa Entosis en iyi alternatiftir. Kabin içi joystick sistemi operatör güvenliğini sağlarken, 15 litrelik el yıkama tankı İSG standartlarını karşılar.</p>
  </div>
  <div class="blog-product-block__actions">
    <a href="${p}urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html" class="btn btn--secondary btn--sm">Ürün sayfası</a>
    <a href="${p}fiyat-teklifi/index.html" class="btn btn--primary btn--sm">Teklif al ${i('chevronRight', 'blog-icon blog-icon--btn')}</a>
  </div>
</div>

<div class="blog-vs-table-wrap">
  <h3 class="blog-vs-table__heading">Hızlı Model Karşılaştırması</h3>
  <div class="blog-spec-table-wrap">
    <table class="blog-spec-table blog-vs-table">
      <thead>
        <tr>
          <th scope="col">Özellik</th>
          <th scope="col">Duru Mist Blower 15HP</th>
          <th scope="col">Entosis Mist Blower 500L</th>
        </tr>
      </thead>
      <tbody>
        <tr><th scope="row">Tank</th><td>400 L</td><td>500 L</td></tr>
        <tr><th scope="row">Ağırlık</th><td>340 kg</td><td>400 kg</td></tr>
        <tr><th scope="row">Kumanda</th><td>Manuel / sabit başlık</td><td>Joystick (340° / 210°)</td></tr>
        <tr><th scope="row">İdeal Kullanım</th><td>Dar sokak, pick-up</td><td>Geniş bulvar, büyükşehir</td></tr>
        <tr><th scope="row">Ekstra</th><td>30 m holder hortum</td><td>15 L el yıkama tankı</td></tr>
      </tbody>
    </table>
  </div>
</div>

<h2 id="alim">Profesyonel Bir Sis Üfleme Makinesi Alırken Nelere Dikkat Edilmeli?</h2>
<p>İhale şartnamesi hazırlayan kamu görevlileri, belediye satın alma birimleri veya özel tarım işletmeleri için doğru sis üfleme makinesi seçimi hayati önem taşır. İşte uzmanlardan dikkat etmeniz gereken 5 temel kriter:</p>

<div class="blog-criteria-grid">
  <div class="blog-criteria-card">
    <div class="blog-criteria-card__icon">${i('engine', 'blog-icon')}</div>
    <h3 class="blog-criteria-card__title">Motor Menşei ve Gücü</h3>
    <p>Uzun saatler süren saha mesailerinde motorun performans kaybetmemesi kritiktir. 15–18 HP Amerikan motorlar en zorlu sıcaklıklarda bile kesintisiz güç sağlar.</p>
    <span class="blog-criteria-card__index">01</span>
  </div>
  <div class="blog-criteria-card">
    <div class="blog-criteria-card__icon">${i('gauge', 'blog-icon')}</div>
    <h3 class="blog-criteria-card__title">Pompa Basıncı (Bar)</h3>
    <p>150 bar yüksek basınçlı pompalar, nozullardan geçerken mikronizasyon kalitesini belirler ve pülverizatör modunda tazyik kaybını önler.</p>
    <span class="blog-criteria-card__index">02</span>
  </div>
  <div class="blog-criteria-card">
    <div class="blog-criteria-card__icon">${i('battery', 'blog-icon')}</div>
    <h3 class="blog-criteria-card__title">Bağımsız Elektrik Sistemi</h3>
    <p>Makinenin aracın aküsünü bitirmemesi için kendi 12 V DC – 60 Ah bataryası bulunmalıdır.</p>
    <span class="blog-criteria-card__index">03</span>
  </div>
  <div class="blog-criteria-card">
    <div class="blog-criteria-card__icon">${i('flask', 'blog-icon')}</div>
    <h3 class="blog-criteria-card__title">Formülasyon Uyumluluğu</h3>
    <p>EC, SC ve WP gibi farklı kimyasal formlarla tıkanıklık yapmadan çalışabilmesi, tek makine ile hem larvasit hem ergin mücadelesi yapılabilmesini sağlar.</p>
    <span class="blog-criteria-card__index">04</span>
  </div>
  <div class="blog-criteria-card">
    <div class="blog-criteria-card__icon">${i('wrench', 'blog-icon')}</div>
    <h3 class="blog-criteria-card__title">Servis ve Yedek Parça</h3>
    <p>Sezonun en yoğun döneminde yaşanacak basit bir hortum yırtılması operasyonu durdurabilir. Yerli üretim, hızlı teknik destek ve yedek parça temini birinci tercih olmalıdır.</p>
    <span class="blog-criteria-card__index">05</span>
  </div>
</div>

<figure class="blog-trust-banner blog-trust-banner--full">
  <img src="${alimRehberi}" alt="Sis üfleme makinesi alırken nelere dikkat edilmeli - motor gücü, pompa basıncı, batarya ve servis kriterleri infografiği" class="blog-trust-banner__img" loading="lazy">
  <figcaption class="blog-trust-banner__caption">Profesyonel sis üfleme makinesi alımında 5 temel kriter — motor, pompa, batarya, formülasyon ve servis</figcaption>
</figure>

<h2 id="uygulama">Mist Blower ile Doğru İlaçlama Uygulaması İçin Pratik Bilgiler</h2>
<p>Makinenizin donanımı ne kadar üstün olursa olsun, sahada uygulamanın doğruluğu başarı oranını doğrudan etkiler. Sis üfleme makinesi ile maksimum verim almak için şu kurallara dikkat etmelisiniz:</p>

<ul class="blog-tip-list">
  <li class="blog-tip-list__item">
    <span class="blog-tip-list__icon">${i('checkSquare', 'blog-icon')}</span>
    <div>
      <strong>Doğru Zamanlama</strong>
      <p>Sivrisinek mücadelesi için en etkili saatler, sıcaklık invertajının yaşandığı akşam gün batımı saatleri ve sabahın ilk ışıklarıdır. Rüzgarın sakin (1–15 km/s) olduğu zaman dilimleri seçilmelidir.</p>
    </div>
  </li>
  <li class="blog-tip-list__item">
    <span class="blog-tip-list__icon">${i('checkSquare', 'blog-icon')}</span>
    <div>
      <strong>Sabit Araç Hızı</strong>
      <p>Uygulama sırasında araç hızının saatte ortalama 10–15 km civarında sabit tutulması, atılan sis bulutunun metrekare başına eşit ve homojen düşmesini sağlar.</p>
    </div>
  </li>
  <li class="blog-tip-list__item">
    <span class="blog-tip-list__icon">${i('checkSquare', 'blog-icon')}</span>
    <div>
      <strong>Günlük Bakım ve Temizlik</strong>
      <p>İlaçlama bittikten sonra tankta asla kimyasallı su bırakılmamalıdır. Sistem temiz su devridaimi ile yıkanmalıdır. (Özellikle Entosis modelindeki temiz su tankı bu işlemi saniyeler içinde halletmenizi sağlar).</p>
    </div>
  </li>
</ul>

<h2 id="sonuc">Sonuç: Uzun Vadeli ve Kesin Çözüm İçin Harekete Geçin</h2>
<p>Şehirlerde veya tarım alanlarında vektörlerle mücadele etmek tek seferlik bir işlem değil, doğru teknoloji ile sürdürülebilir bir strateji gerektirir. Güçlü Amerikan motorları, 35 mikron teknolojisi ve çok fonksiyonlu püskürtme sistemleri (Mist, ULV, Pülverizatör) ile <a href="${p}urunler/arac-uzeri-ilaclama/duru-mist-blower-15hp/index.html">Duru Mist Blower 15HP (400L)</a> ve <a href="${p}urunler/arac-uzeri-ilaclama/entosis-mist-blower-500l/index.html">Entosis Mist Blower (500L)</a> modelleri sahada en büyük güvenceniz olacaktır.</p>
<p>Mevcut sorunlarınıza en uygun sis üfleme makinesi modelini belirlemek, detaylı teknik özellik karşılaştırması yapmak ve kurumunuza özel fiyat bilgisini öğrenmek için hemen üreticiyle iletişime geçebilir; iş sağlığı ve çevre standartlarına uygun, yıllarca sorunsuz kullanacağınız bir alım gerçekleştirebilirsiniz.</p>

<div class="blog-cta-bar blog-cta-bar--hero">
  <div class="blog-cta-bar__content">
    <h3 class="blog-cta-bar__heading">Operasyonunuza özel teklif alın</h3>
    <p class="blog-cta-bar__text">Duru Mist Blower 15HP ve Entosis Mist Blower 500L modellerini karşılaştırın; kurumunuza özel fiyat ve teknik destek için bizimle iletişime geçin.</p>
  </div>
  <div class="blog-cta-bar__actions">
    <a href="${p}fiyat-teklifi/index.html" class="btn btn--white btn--sm">Teklif Al</a>
    <a href="${p}urun-karsilastirma/index.html" class="btn btn--outline-white btn--sm">Modelleri Karşılaştır</a>
  </div>
</div>`;
};
