/**
 * Fill EN/AR legal pages only (kvkk, gizlilik, kullanım koşulları).
 * Never writes blog/, urunler/, or root TR legal HTML.
 * Usage: node scripts/fill-locale-legal.js
 */
const fs = require('fs');
const path = require('path');
const { siteHeader, siteFooter } = require('./site-layout');
const { renderHeadAssets, renderBodyScripts } = require('./head-assets');
const { renderSeoHead } = require('./seo-meta');
const { localePaths } = require('./i18n');

const ROOT = path.join(__dirname, '..');
const DEFAULT_OG = 'assets/img/products/duru-hd50-01.webp';

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

function writePage(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
  console.log('wrote', rel.replace(/\\/g, '/'));
}

function loadKurumsal() {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/urunler.json'), 'utf8'));
  return data.kurumsal_bilgiler;
}

function h2(text) {
  return `<h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--color-primary);margin:2rem 0 0.75rem">${esc(text)}</h2>`;
}

function kvkkBody(locale, k) {
  if (locale === 'en') {
    return `
          <p><strong>Last updated:</strong> 30 June 2026</p>
          <p>This notice is issued by <strong>${esc(k.firma_adi)}</strong> (“Data Controller”) under Turkish Law No. 6698 on the Protection of Personal Data (“KVKK”).</p>

          ${h2('1. Data Controller')}
          <ul style="padding-left:1.25rem;margin:0">
            <li><strong>Company:</strong> ${esc(k.firma_adi)}</li>
            <li><strong>Address:</strong> ${esc(k.adres.satir1)}, ${esc(k.adres.satir2)}</li>
            <li><strong>Phone:</strong> ${esc(k.telefon)}</li>
            <li><strong>Email:</strong> ${mailLink(k.email)}</li>
            <li><strong>Website:</strong> duruulvteknoloji.com.tr</li>
          </ul>

          ${h2('2. Personal Data Processed')}
          <p>Through our website and communication channels, the following personal data may be processed:</p>
          <ul style="padding-left:1.25rem">
            <li>Identity and contact details (name, title, organization, phone, email, city/district)</li>
            <li>Request and message content (quote requests, product preferences, application area, message text)</li>
            <li>Transaction security data (IP address, browser information, session logs, cookies)</li>
            <li>Marketing preferences (newsletter and informational preferences, where explicit consent is given)</li>
          </ul>

          ${h2('3. Purposes of Processing')}
          <ul style="padding-left:1.25rem">
            <li>Running quote, sales, and after-sales support processes</li>
            <li>Responding to contact requests and managing customer relationships</li>
            <li>Fulfilling contracts and legal obligations</li>
            <li>Securing the website and preventing misuse</li>
            <li>Informing about our products and services (with explicit consent or legitimate interest)</li>
            <li>Statistical analysis and service quality improvement</li>
          </ul>

          ${h2('4. Legal Bases')}
          <p>Your personal data is processed based on the grounds set out in Articles 5 and 6 of the KVKK, including:</p>
          <ul style="padding-left:1.25rem">
            <li>Necessity for establishing or performing a contract,</li>
            <li>Ability of the data controller to comply with a legal obligation,</li>
            <li>Necessity for our legitimate interests (responding to contact requests, security),</li>
            <li>Your explicit consent (for example marketing communications)</li>
          </ul>

          ${h2('5. Transfer of Personal Data')}
          <p>Your personal data may be transferred only for the stated purposes and in accordance with the KVKK to:</p>
          <ul style="padding-left:1.25rem">
            <li>Hosting, email, and communications infrastructure providers,</li>
            <li>Competent public authorities where legally required,</li>
            <li>Audit, accounting, and legal advisory parties (to the extent necessary)</li>
          </ul>
          <p>Where cross-border transfer applies, the conditions in Article 9 of the KVKK are observed.</p>

          ${h2('6. Retention Period')}
          <p>Personal data is retained for as long as required by the processing purpose and applicable limitation periods; it is then deleted, destroyed, or anonymized.</p>

          ${h2('7. Your Rights under the KVKK')}
          <p>Under Article 11 of the KVKK, you may apply to the data controller to:</p>
          <ul style="padding-left:1.25rem">
            <li>Learn whether your personal data is processed,</li>
            <li>Request information if it has been processed,</li>
            <li>Learn the purpose of processing and whether it is used accordingly,</li>
            <li>Know the third parties to whom data is transferred domestically or abroad,</li>
            <li>Request correction if data is incomplete or inaccurate,</li>
            <li>Request deletion or destruction under the conditions in Article 7 of the KVKK,</li>
            <li>Object to outcomes against you arising from analysis by automated systems,</li>
            <li>Claim compensation if you suffer damage due to unlawful processing</li>
          </ul>
          <p>You may send requests to ${mailLink(k.email)} or in writing to the postal address above. Requests are concluded within 30 days at the latest.</p>

          ${h2('8. Updates')}
          <p>This notice may be updated to reflect legal or operational changes. The current version is always published on this page.</p>`;
  }

  return `
          <p><strong>آخر تحديث:</strong> 30 حزيران/يونيو 2026</p>
          <p>أُعدّ هذا البيان من قبل <strong>${esc(k.firma_adi)}</strong> («المتحكم بالبيانات») بموجب القانون التركي رقم 6698 بشأن حماية البيانات الشخصية («KVKK»).</p>

          ${h2('1. المتحكم بالبيانات')}
          <ul style="padding-left:1.25rem;margin:0">
            <li><strong>الاسم:</strong> ${esc(k.firma_adi)}</li>
            <li><strong>العنوان:</strong> ${esc(k.adres.satir1)}, ${esc(k.adres.satir2)}</li>
            <li><strong>الهاتف:</strong> ${esc(k.telefon)}</li>
            <li><strong>البريد الإلكتروني:</strong> ${mailLink(k.email)}</li>
            <li><strong>الموقع:</strong> duruulvteknoloji.com.tr</li>
          </ul>

          ${h2('2. البيانات الشخصية المُعالجة')}
          <p>قد تُعالَج البيانات الشخصية التالية عبر موقعنا وقنوات الاتصال:</p>
          <ul style="padding-left:1.25rem">
            <li>بيانات الهوية والاتصال (الاسم، المسمى الوظيفي، الجهة، الهاتف، البريد، المدينة/المنطقة)</li>
            <li>محتوى الطلب والرسالة (طلب عرض سعر، تفضيل المنتج، مجال التطبيق، نص الرسالة)</li>
            <li>بيانات أمن المعاملة (عنوان IP، معلومات المتصفح، سجلات الجلسة، ملفات تعريف الارتباط)</li>
            <li>تفضيلات التسويق (النشرة والتواصل الإعلامي عند وجود موافقة صريحة)</li>
          </ul>

          ${h2('3. أغراض المعالجة')}
          <ul style="padding-left:1.25rem">
            <li>إدارة عمليات العروض والمبيعات والدعم بعد البيع</li>
            <li>الرد على طلبات الاتصال وإدارة علاقات العملاء</li>
            <li>تنفيذ العقود والالتزامات القانونية</li>
            <li>تأمين الموقع ومنع إساءة الاستخدام</li>
            <li>الإعلام عن منتجاتنا وخدماتنا (بموافقة صريحة أو مصلحة مشروعة)</li>
            <li>التحليل الإحصائي وتحسين جودة الخدمة</li>
          </ul>

          ${h2('4. الأسس القانونية')}
          <p>تُعالَج بياناتك الشخصية استناداً إلى الأسس الواردة في المادتين 5 و6 من قانون KVKK، بما في ذلك:</p>
          <ul style="padding-left:1.25rem">
            <li>الضرورة لإبرام عقد أو تنفيذه،</li>
            <li>تمكين المتحكم من الوفاء بالتزام قانوني،</li>
            <li>الضرورة لمصالحنا المشروعة (الرد على طلبات الاتصال، الأمن)،</li>
            <li>وجود موافقتك الصريحة (مثل التواصل التسويقي)</li>
          </ul>

          ${h2('5. نقل البيانات الشخصية')}
          <p>قد تُنقَل بياناتك الشخصية فقط للأغراض المذكورة وبما يتوافق مع قانون KVKK إلى:</p>
          <ul style="padding-left:1.25rem">
            <li>مزودي الاستضافة والبريد والبنية التحتية للاتصالات،</li>
            <li>الجهات العامة المختصة عند الاقتضاء قانوناً،</li>
            <li>أطراف التدقيق والمحاسبة والاستشارة القانونية (بالقدر اللازم)</li>
          </ul>
          <p>عند النقل عبر الحدود تُراعى شروط المادة 9 من قانون KVKK.</p>

          ${h2('6. مدة الاحتفاظ')}
          <p>تُحفظ البيانات الشخصية طوال المدة التي تقتضيها أغراض المعالجة وفترات التقادم القانونية؛ ثم تُحذف أو تُتلف أو تُجعل مجهولة الهوية.</p>

          ${h2('7. حقوقك بموجب قانون KVKK')}
          <p>بموجب المادة 11 من قانون KVKK يمكنك التقدم إلى المتحكم بالبيانات لـ:</p>
          <ul style="padding-left:1.25rem">
            <li>معرفة ما إذا كانت بياناتك تُعالَج،</li>
            <li>طلب معلومات إن كانت قد عُولجت،</li>
            <li>معرفة غرض المعالجة وما إذا استُخدمت وفقاً له،</li>
            <li>معرفة الأطراف الثالثة التي نُقلت إليها داخلياً أو خارجياً،</li>
            <li>طلب التصحيح إن كانت ناقصة أو غير دقيقة،</li>
            <li>طلب الحذف أو الإتلاف وفق شروط المادة 7،</li>
            <li>الاعتراض على نتائج ضدك ناتجة عن تحليل أنظمة آلية،</li>
            <li>المطالبة بالتعويض عند الضرر بسبب معالجة غير قانونية</li>
          </ul>
          <p>يمكنك إرسال طلباتك إلى ${mailLink(k.email)} أو كتابياً إلى العنوان البريدي أعلاه. تُنجَز الطلبات خلال 30 يوماً كحد أقصى.</p>

          ${h2('8. التحديثات')}
          <p>قد يُحدَّث هذا البيان وفقاً للتغييرات القانونية أو التشغيلية. النسخة الحالية تُنشر دائماً على هذه الصفحة.</p>`;
}

function gizlilikBody(locale, k, kvkkHref) {
  if (locale === 'en') {
    return `
          <p><strong>Last updated:</strong> 30 June 2026</p>
          <p>This privacy policy explains how personal data of visitors to <strong>duruulvteknoloji.com.tr</strong> and people contacting ${esc(k.firma_adi)} is collected, used, and protected.</p>

          ${h2('1. Information We Collect')}
          <p>When you use our site, the following information may be collected:</p>
          <ul style="padding-left:1.25rem">
            <li><strong>Information you provide:</strong> name, organization, phone, email, and message content shared via quote forms, contact forms, or email.</li>
            <li><strong>Automatically collected information:</strong> IP address, device and browser type, pages visited, session duration, and referral sources.</li>
            <li><strong>Cookies:</strong> cookies for site functionality and (with your consent) analytics. You can manage details in your browser settings.</li>
          </ul>

          ${h2('2. How We Use Information')}
          <ul style="padding-left:1.25rem">
            <li>Respond to quote and information requests</li>
            <li>Run product sales, delivery, and technical support</li>
            <li>Secure the website and prevent misuse</li>
            <li>Meet our legal obligations</li>
            <li>Measure and improve service quality</li>
          </ul>

          ${h2('3. Information Sharing')}
          <p>Personal information is not sold to third parties. Limited sharing may occur only to deliver the service (hosting, email), meet legal requirements, or with your explicit consent.</p>

          ${h2('4. Data Security')}
          <p>Technical and organizational measures are applied to protect your data against unauthorized access, loss, or disclosure. Contact forms are transmitted over a secure connection (HTTPS).</p>

          ${h2('5. Retention')}
          <p>Data is kept for as long as required by the processing purpose and legal retention duties, then deleted or anonymized.</p>

          ${h2('6. Your Rights')}
          <p>For your rights under the KVKK, see our <a href="${esc(kvkkHref)}" style="color:var(--color-primary);font-weight:600">KVKK Privacy Notice</a> or contact ${mailLink(k.email)}.</p>

          ${h2('7. Contact')}
          <p>For privacy questions: ${esc(k.firma_adi)}, ${esc(k.adres.satir1)}, ${esc(k.adres.satir2)} — ${mailLink(k.email)}</p>`;
  }

  return `
          <p><strong>آخر تحديث:</strong> 30 حزيران/يونيو 2026</p>
          <p>توضح سياسة الخصوصية هذه كيفية جمع بيانات زوار <strong>duruulvteknoloji.com.tr</strong> والأشخاص الذين يتواصلون مع ${esc(k.firma_adi)} واستخدامها وحمايتها.</p>

          ${h2('1. المعلومات التي نجمعها')}
          <p>عند استخدام موقعنا قد تُجمع المعلومات التالية:</p>
          <ul style="padding-left:1.25rem">
            <li><strong>المعلومات التي تقدمها:</strong> الاسم والجهة والهاتف والبريد ومحتوى الرسالة عبر نماذج العرض أو الاتصال أو البريد.</li>
            <li><strong>المعلومات المجمعة تلقائياً:</strong> عنوان IP ونوع الجهاز والمتصفح والصفحات المزارة ومدة الجلسة ومصادر الإحالة.</li>
            <li><strong>ملفات تعريف الارتباط:</strong> لوظائف الموقع ولأغراض التحليل (بموافقتك). يمكنك إدارتها من إعدادات المتصفح.</li>
          </ul>

          ${h2('2. أغراض الاستخدام')}
          <ul style="padding-left:1.25rem">
            <li>الرد على طلبات العرض والمعلومات</li>
            <li>إدارة المبيعات والتسليم والدعم الفني</li>
            <li>تأمين الموقع ومنع إساءة الاستخدام</li>
            <li>الوفاء بالالتزامات القانونية</li>
            <li>قياس جودة الخدمة وتحسينها</li>
          </ul>

          ${h2('3. مشاركة المعلومات')}
          <p>لا تُباع معلوماتك الشخصية لأطراف ثالثة. قد يحدث مشاركة محدودة فقط لتقديم الخدمة (الاستضافة، البريد)، أو لالتزام قانوني، أو بموافقتك الصريحة.</p>

          ${h2('4. أمن البيانات')}
          <p>تُطبَّق تدابير تقنية وإدارية لحماية بياناتك من الوصول غير المصرح أو الفقدان أو الإفشاء. تُرسل نماذج الاتصال عبر اتصال آمن (HTTPS).</p>

          ${h2('5. مدة الاحتفاظ')}
          <p>تُحفظ البيانات طوال مدة الغرض والالتزامات القانونية للاحتفاظ، ثم تُحذف أو تُجعل مجهولة الهوية.</p>

          ${h2('6. حقوقك')}
          <p>لحقوقك بموجب قانون KVKK راجع <a href="${esc(kvkkHref)}" style="color:var(--color-primary);font-weight:600">بيان حماية البيانات (KVKK)</a> أو تواصل عبر ${mailLink(k.email)}.</p>

          ${h2('7. التواصل')}
          <p>لأسئلة الخصوصية: ${esc(k.firma_adi)}, ${esc(k.adres.satir1)}, ${esc(k.adres.satir2)} — ${mailLink(k.email)}</p>`;
}

function termsBody(locale, k) {
  if (locale === 'en') {
    return `
          <p><strong>Last updated:</strong> 30 June 2026</p>
          <p>By using <strong>duruulvteknoloji.com.tr</strong> you accept the following terms. The site is operated by ${esc(k.firma_adi)} (“Company”).</p>

          ${h2('1. Scope of the Site')}
          <p>This website provides information about ULV spraying machines, mist blowers, and related equipment, product introductions, and quote collection. Technical information on the site is general; final specifications are confirmed at the order and contract stage.</p>

          ${h2('2. Pricing and Quotes')}
          <p>No product prices are shown on the site. Sales are made only via the quote form or direct contact.</p>

          ${h2('3. Intellectual Property')}
          <p>Texts, images, logos, product photos, technical drawings, and design elements on the site belong to the Company or its licensors. They may not be copied, reproduced, or used commercially without written permission.</p>

          ${h2('4. User Obligations')}
          <ul style="padding-left:1.25rem">
            <li>Use the site only for lawful and legitimate purposes</li>
            <li>Provide accurate and up-to-date information in contact forms</li>
            <li>Do not attempt actions that threaten site security</li>
            <li>Do not share content that infringes third-party rights</li>
          </ul>

          ${h2('5. Limitation of Liability')}
          <p>The site is provided “as is.” The Company does not warrant uninterrupted or error-free content. Correct use of products, compliance with spraying regulations, and field applications are the user’s responsibility. The Company is not liable for indirect damages.</p>

          ${h2('6. External Links')}
          <p>The site may contain links to third-party websites. The Company is not responsible for their content or privacy practices.</p>

          ${h2('7. Changes')}
          <p>The Company reserves the right to update these terms without prior notice. The current text is effective from the date of publication.</p>

          ${h2('8. Governing Law and Contact')}
          <p>These terms are governed by the laws of the Republic of Türkiye. Courts and enforcement offices of Kayseri have jurisdiction. Questions: ${mailLink(k.email)} — ${esc(k.telefon)}</p>`;
  }

  return `
          <p><strong>آخر تحديث:</strong> 30 حزيران/يونيو 2026</p>
          <p>باستخدامك موقع <strong>duruulvteknoloji.com.tr</strong> تُعدّ موافقاً على الشروط التالية. يُشغَّل الموقع من قبل ${esc(k.firma_adi)} («الشركة»).</p>

          ${h2('1. نطاق الموقع')}
          <p>يقدّم هذا الموقع معلومات عن آلات الرش ULV وأجهزة Mist Blower والمعدات ذات الصلة، وتعريفاً بالمنتجات، وجمع طلبات العروض. المعلومات التقنية عامة؛ المواصفات النهائية تُؤكَّد عند الطلب والعقد.</p>

          ${h2('2. الأسعار والعروض')}
          <p>لا تُعرض أسعار للمنتجات على الموقع. تتم المبيعات فقط عبر نموذج العرض أو التواصل المباشر.</p>

          ${h2('3. الملكية الفكرية')}
          <p>النصوص والصور والشعارات وصور المنتجات والرسومات التقنية وعناصر التصميم ملك للشركة أو مانحي التراخيص. لا يجوز نسخها أو إعادة إنتاجها أو استخدامها تجارياً دون إذن كتابي.</p>

          ${h2('4. التزامات المستخدم')}
          <ul style="padding-left:1.25rem">
            <li>استخدام الموقع لأغراض قانونية ومشروعة فقط</li>
            <li>تقديم معلومات صحيحة ومحدثة في نماذج الاتصال</li>
            <li>عدم القيام بما يهدد أمن الموقع</li>
            <li>عدم مشاركة محتوى ينتهك حقوق الغير</li>
          </ul>

          ${h2('5. حدود المسؤولية')}
          <p>يُقدَّم الموقع «كما هو». لا تضمن الشركة محتوى بلا انقطاع أو بلا أخطاء. الاستخدام الصحيح للمنتجات والامتثال لأنظمة الرش والتطبيقات الميدانية مسؤولية المستخدم. لا تُسأل الشركة عن الأضرار غير المباشرة.</p>

          ${h2('6. الروابط الخارجية')}
          <p>قد يحتوي الموقع على روابط لمواقع طرف ثالث. الشركة غير مسؤولة عن محتواها أو ممارسات الخصوصية لديها.</p>

          ${h2('7. التعديلات')}
          <p>تحتفظ الشركة بحق تحديث هذه الشروط دون إشعار مسبق. يسري النص الحالي من تاريخ نشره.</p>

          ${h2('8. القانون الواجب التطبيق والتواصل')}
          <p>تخضع هذه الشروط لقوانين الجمهورية التركية. تختص محاكم ودوائر التنفيذ في قيصري. للاستفسار: ${mailLink(k.email)} — ${esc(k.telefon)}</p>`;
}

const PAGES = {
  kvkk: {
    rel: 'kvkk/index.html',
    trRel: 'kvkk/index.html',
    en: {
      title: 'KVKK Privacy Notice — Duru ULV',
      description:
        'Data controller notice under Turkish Law No. 6698 on the Protection of Personal Data (KVKK).',
      eyebrow: 'Legal',
      h1: 'KVKK Privacy Notice',
      intro:
        'Data controller notice under Turkish Law No. 6698 on the Protection of Personal Data (KVKK).',
    },
    ar: {
      title: 'بيان حماية البيانات (KVKK) — Duru ULV',
      description: 'بيان المتحكم بالبيانات بموجب القانون التركي رقم 6698 بشأن حماية البيانات الشخصية (KVKK).',
      eyebrow: 'قانوني',
      h1: 'بيان حماية البيانات (KVKK)',
      intro: 'بيان المتحكم بالبيانات بموجب القانون التركي رقم 6698 بشأن حماية البيانات الشخصية (KVKK).',
    },
    body: (locale, k) => kvkkBody(locale, k),
  },
  privacy: {
    rel: 'gizlilik-politikasi/index.html',
    trRel: 'gizlilik-politikasi/index.html',
    en: {
      title: 'Privacy Policy — Duru ULV',
      description: 'How your personal data is collected, used, and protected.',
      eyebrow: 'Legal',
      h1: 'Privacy Policy',
      intro: 'How your personal data is collected, used, and protected.',
    },
    ar: {
      title: 'سياسة الخصوصية — Duru ULV',
      description: 'كيف تُجمع بياناتك الشخصية وتُستخدم وتُحمى.',
      eyebrow: 'قانوني',
      h1: 'سياسة الخصوصية',
      intro: 'كيف تُجمع بياناتك الشخصية وتُستخدم وتُحمى.',
    },
    body: (locale, k) => gizlilikBody(locale, k, '../kvkk/index.html'),
  },
  terms: {
    rel: 'kullanim-kosullari/index.html',
    trRel: 'kullanim-kosullari/index.html',
    en: {
      title: 'Terms of Use — Duru ULV',
      description: 'Terms and liability limits for using duruulvteknoloji.com.tr.',
      eyebrow: 'Legal',
      h1: 'Terms of Use',
      intro: 'Terms and liability limits for using duruulvteknoloji.com.tr.',
    },
    ar: {
      title: 'شروط الاستخدام — Duru ULV',
      description: 'شروط وحدود المسؤولية لاستخدام موقع duruulvteknoloji.com.tr.',
      eyebrow: 'قانوني',
      h1: 'شروط الاستخدام',
      intro: 'شروط وحدود المسؤولية لاستخدام موقع duruulvteknoloji.com.tr.',
    },
    body: (locale, k) => termsBody(locale, k),
  },
};

function pageShell(locale, opts) {
  const loc = localePaths(locale);
  const ui = loc.ui;
  const outRel = `${locale}/${opts.rel}`;
  const depth = outRel.split('/').filter(Boolean).length - 1;
  const prefix = '../'.repeat(depth);
  const seo = renderSeoHead({
    title: opts.title,
    description: opts.description,
    canonicalPathRel: outRel,
    hreflangSourceRel: opts.trRel,
    ogImage: DEFAULT_OG,
    ogImageAlt: opts.h1,
    locale: ui.ogLocale,
  });
  const header = siteHeader({
    prefix,
    locale,
    trPathRel: opts.trRel,
    homeHref: loc.homeHref(prefix),
    productsHref: loc.productsHref(prefix),
    catalogHref: loc.catalogHref(prefix),
    blogHref: loc.blogHref(prefix),
    compareHref: loc.compareHref(prefix),
    aboutHref: loc.aboutHref(prefix),
    contactHref: loc.contactHref(prefix),
    quoteHref: loc.quoteHref(prefix),
  });
  const footer = siteFooter({
    prefix,
    locale,
    homeHref: loc.homeHref(prefix),
    productsHref: loc.productsHref(prefix),
    catalogHref: loc.catalogHref(prefix),
    blogHref: loc.blogHref(prefix),
    compareHref: loc.compareHref(prefix),
    aboutHref: loc.aboutHref(prefix),
    qualityHref: loc.qualityHref(prefix),
    contactHref: loc.contactHref(prefix),
    privacyHref: loc.privacyHref(prefix),
    kvkkHref: loc.kvkkHref(prefix),
    termsHref: loc.termsHref(prefix),
  });
  const extra = locale === 'ar' ? ['assets/css/rtl.css'] : [];

  return `<!DOCTYPE html>
<html ${loc.htmlLangAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(opts.description)}">
  <title>${esc(opts.title)}</title>
${seo}
  <link rel="icon" href="${prefix}assets/img/duru-icon.svg" type="image/svg+xml">
${renderHeadAssets(prefix, { extraStylesheets: extra })}
</head>
<body>

${header}
  <main>
${opts.main}
  </main>
${footer}

${renderBodyScripts(prefix)}
</body>
</html>
`;
}

function writeLegal(locale, key) {
  const page = PAGES[key];
  const copy = page[locale];
  const k = loadKurumsal();
  const bodyHtml = page.body(locale, k);
  const main = `    <section class="section bg-white border-y">
      <div class="container container--text">
        <div class="eyebrow">${esc(copy.eyebrow)}</div>
        <h1 class="section-title">${esc(copy.h1)}</h1>
        <p style="margin-top:1rem;color:rgba(43,46,51,0.75);line-height:1.65">${esc(copy.intro)}</p>
      </div>
    </section>
    <section class="section bg-muted">
      <div class="container container--text">
        <div class="legal-content">
${bodyHtml}
        </div>
      </div>
    </section>`;

  const html = pageShell(locale, {
    rel: page.rel,
    trRel: page.trRel,
    title: copy.title,
    description: copy.description,
    h1: copy.h1,
    main,
  });
  writePage(`${locale}/${page.rel}`, html);
}

const k = loadKurumsal();
['en', 'ar'].forEach((locale) => {
  ['kvkk', 'privacy', 'terms'].forEach((key) => writeLegal(locale, key));
});
console.log('done; firm=', k.firma_adi);
