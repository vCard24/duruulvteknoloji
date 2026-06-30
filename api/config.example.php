<?php
/**
 * Kopyalayın: config.example.php → config.php
 * Sunucu: public_html/api/config.php
 *
 * TASARIM / TEST: to_email → takcan@gmail.com (şu anki ayar)
 * CANLI: to_email satırını info@entosis.com.tr yapın
 *
 * SMTP: Hostinger → E-postalar → info@entosis.com.tr şifresi
 * (Tasarım aşamasında Gmail uygulama şifresi de kullanılabilir — smtp bölümüne bakın)
 */
return [
  // Alıcı — test: takcan@gmail.com | canlı: info@entosis.com.tr
  'to_email'   => 'takcan@gmail.com',
  'from_email' => 'info@entosis.com.tr',
  'from_name'  => 'Duru ULV — Web Formu',
  'site_url'   => 'https://www.duruulvteknoloji.com.tr',
  'dev_save_only' => false,
  'smtp' => [
    'enabled' => true,
    'host'    => 'smtp.hostinger.com',
    'port'    => 465,
    'secure'  => 'ssl',
    'user'    => 'info@entosis.com.tr',
    'pass'    => 'EPOSTA_SIFRENIZ_BURAYA',
  ],
];
