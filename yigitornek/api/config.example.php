<?php
/**
 * Kopyalayın: config.example.php → config.php
 * Hostinger: public_html/api/config.php
 *
 * ÖNEMLİ: Canlıda mail gitmesi için SMTP şifresini doldurun.
 * Hostinger → E-postalar → info@yigitcelikkapi.com.tr → şifre
 */
return [
    'to_email'   => 'info@yigitcelikkapi.com.tr',
    'from_email' => 'info@yigitcelikkapi.com.tr',
    'from_name'  => 'Yiğit Çelik Kapı — Web Formu',
    'dev_save_only' => false,
    'smtp' => [
        'enabled' => true,
        'host'    => 'smtp.hostinger.com',
        'port'    => 465,
        'secure'  => 'ssl',
        'user'    => 'info@yigitcelikkapi.com.tr',
        'pass'    => 'EPOSTA_SIFRENIZ_BURAYA',
    ],
];
