<?php
/**
 * YEREL TEST — Gmail ile takcan@gmail.com
 *
 * 1) Bu dosyayı config.php olarak kopyalayın VEYA
 *    config.php içindeki smtp bölümünü aşağıdakiyle değiştirin.
 * 2) Google Hesap → Güvenlik → 2 Adımlı Doğrulama AÇIK
 * 3) Uygulama şifreleri → "Duru ULV test" → 16 haneli şifreyi smtp.pass'e yapıştırın
 * 4) php -S localhost:8080 ile siteyi açın
 */
return [
  'to_email'   => 'takcan@gmail.com',
  'from_email' => 'takcan@gmail.com',
  'from_name'  => 'Duru ULV — Web Formu (Test)',
  'site_url'   => 'http://localhost:8080',
  'dev_save_only' => false,
  'smtp' => [
    'enabled' => true,
    'host'    => 'smtp.gmail.com',
    'port'    => 465,
    'secure'  => 'ssl',
    'user'    => 'takcan@gmail.com',
    'pass'    => 'BURAYA_GMAIL_UYGULAMA_SIFRESI_16_HANE',
  ],
];
