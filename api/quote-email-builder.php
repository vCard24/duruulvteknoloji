<?php
declare(strict_types=1);

/**
 * Duru ULV teklif formu — HTML e-posta şablonu
 *
 * @param array<string,mixed> $data
 * @param array<string,mixed> $config
 */
function duru_build_quote_email_html(array $data, array $config = []): string
{
    $siteUrl = rtrim((string) ($config['site_url'] ?? 'https://www.duruulvteknoloji.com.tr'), '/');
    $accent = '#1F3D2B';
    $accentLight = '#3E8E5C';
    $accentBg = '#EEF6F0';
    $dateStr = date('d.m.Y H:i');
    $logoSrc = $siteUrl . '/assets/img/duru-hd-logo.svg';

    $products = $data['products'] ?? [];
    $productCount = is_array($products) ? count($products) : 0;

    $contactHtml = duru_quote_field_table([
        ['Ad Soyad', (string) ($data['name'] ?? '')],
        ['Telefon', (string) ($data['phone'] ?? '')],
        ['E-posta', (string) ($data['email'] ?? '')],
        ['Firma / Kurum', (string) ($data['company'] ?? '')],
        ['İl / İlçe', (string) ($data['city'] ?? '')],
    ]);

    $message = trim((string) ($data['message'] ?? ''));
    $messageBlock = $message !== ''
        ? duru_quote_email_section(
            'Talep detayı',
            '<p style="margin:0;padding:12px 14px;background:#F3F4F5;border-left:4px solid ' . $accentLight . ';border-radius:0 6px 6px 0;line-height:1.65;color:#2B2E33;">'
            . nl2br(duru_quote_h($message))
            . '</p>',
            $accent
        )
        : '';

    $summaryBanner = '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;border-radius:8px;overflow:hidden;">'
        . '<tr><td style="padding:12px 16px;background:' . $accent . ';font-family:Arial,Helvetica,sans-serif;">'
        . '<p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;">'
        . ($productCount > 0
            ? duru_quote_h((string) $productCount) . ' ürün için teklif talebi'
            : 'Genel bilgi / teklif talebi')
        . '</p>'
        . '<p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.85);">Duru ULV satış ekibi bu talebe yanıt verecektir.</p>'
        . '</td></tr></table>';

    $certs = ['CE', 'TSE', 'ISO 9001', 'ISO 14001', 'ISO 45001'];
    $certBadges = '';
    foreach ($certs as $cert) {
        $certBadges .= '<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 8px;background:#F3F4F5;border:1px solid #e5e7eb;border-radius:4px;font-size:9px;font-weight:700;color:#1F3D2B;letter-spacing:0.06em;">'
            . duru_quote_h($cert) . '</span>';
    }

    $replyEmail = trim((string) ($data['email'] ?? ''));
    $ctaBlock = $replyEmail !== '' && filter_var($replyEmail, FILTER_VALIDATE_EMAIL)
        ? '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;"><tr><td align="center">'
        . '<a href="mailto:' . duru_quote_h($replyEmail) . '?subject='
        . rawurlencode('Duru ULV Teklif Talebi — ' . (string) ($data['name'] ?? ''))
        . '" style="display:inline-block;padding:12px 24px;background:' . $accentLight . ';color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;text-decoration:none;border-radius:6px;">Müşteriye Yanıtla</a>'
        . '</td></tr></table>'
        : '';

    return '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>Duru ULV — Fiyat Teklifi</title></head>'
        . '<body style="margin:0;padding:0;background:#F3F4F5;">'
        . '<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Duru ULV teklif talebi — '
        . duru_quote_h((string) ($data['name'] ?? 'Müşteri'))
        . ($productCount ? ' · ' . $productCount . ' ürün' : '')
        . '</div>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F3F4F5;padding:24px 12px;">'
        . '<tr><td align="center">'
        . '<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(31,61,43,0.08);">'
        . '<tr><td style="height:4px;background:linear-gradient(90deg,' . $accent . ',' . $accentLight . ');font-size:0;line-height:0;">&nbsp;</td></tr>'
        . '<tr><td style="padding:24px 28px 18px;font-family:Arial,Helvetica,sans-serif;">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>'
        . '<td style="width:160px;vertical-align:middle;">'
        . '<img src="' . duru_quote_h($logoSrc) . '" alt="Duru ULV" width="160" style="display:block;width:160px;max-width:160px;height:auto;" />'
        . '</td><td style="vertical-align:middle;padding-left:16px;">'
        . '<p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:' . $accentLight . ';">Web Formu</p>'
        . '<h1 style="margin:0 0 6px;font-size:22px;line-height:1.25;color:#2B2E33;">Fiyat Teklifi Talebi</h1>'
        . '<p style="margin:0;font-size:11px;color:#6b7280;">' . duru_quote_h($dateStr) . '</p>'
        . '</td></tr></table></td></tr>'
        . '<tr><td style="padding:0 28px 20px;">'
        . $summaryBanner
        . $ctaBlock
        . duru_quote_email_section('Seçilen ürünler', duru_quote_product_cards($data, $siteUrl, $accent, $accentLight, $accentBg), $accent)
        . duru_quote_email_section('İletişim bilgileri', $contactHtml, $accent)
        . $messageBlock
        . '</td></tr>'
        . '<tr><td style="padding:16px 28px 20px;background:#F9FAFB;border-top:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;">'
        . '<p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280;">Sertifikalar</p>'
        . '<p style="margin:0 0 14px;line-height:1.8;">' . $certBadges . '</p>'
        . '<p style="margin:0 0 4px;font-size:12px;line-height:1.6;color:#2B2E33;"><strong>Duru ULV Teknoloji Sistemleri</strong></p>'
        . '<p style="margin:0 0 4px;font-size:11px;color:#6b7280;">'
        . '<a href="' . duru_quote_h($siteUrl) . '" style="color:' . $accentLight . ';text-decoration:none;">' . duru_quote_h($siteUrl) . '</a>'
        . ' · +90 352 320 20 86 · info@entosis.com.tr</p>'
        . '<p style="margin:8px 0 0;font-size:10px;color:#9ca3af;">Bu belge müşteri talep formunun özetidir; bağlayıcı fiyat teklifi niteliği taşımaz.</p>'
        . '</td></tr></table></td></tr></table></body></html>';
}

function duru_quote_h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function duru_quote_email_section(string $title, string $bodyHtml, string $accent): string
{
    return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;overflow:hidden;background:#ffffff;">'
        . '<tr><td style="padding:9px 14px;background:#F3F4F5;border-bottom:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'
        . duru_quote_h($accent)
        . ';">'
        . duru_quote_h($title)
        . '</td></tr><tr><td style="padding:14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#2B2E33;">'
        . $bodyHtml
        . '</td></tr></table>';
}

/** @param array<int,array{0:string,1:string}> $fields */
function duru_quote_field_table(array $fields): string
{
    $rows = '';
    foreach ($fields as $row) {
        $label = trim((string) ($row[0] ?? ''));
        $value = trim((string) ($row[1] ?? ''));
        if ($value === '') {
            continue;
        }
        $rows .= '<tr><td style="padding:8px 12px 8px 0;width:36%;vertical-align:top;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">'
            . duru_quote_h($label)
            . '</td><td style="padding:8px 0;vertical-align:top;font-size:14px;font-weight:500;color:#2B2E33;">'
            . duru_quote_h($value)
            . '</td></tr>';
    }
    if ($rows === '') {
        return '<p style="margin:0;color:#6b7280;">—</p>';
    }
    return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">' . $rows . '</table>';
}

/** @param array<string,mixed> $data */
function duru_quote_product_cards(array $data, string $siteUrl, string $accent, string $accentLight, string $accentBg): string
{
    $products = $data['products'] ?? [];
    if (!is_array($products) || $products === []) {
        return '<p style="margin:0;color:#6b7280;font-size:13px;">Genel bilgi talebi — belirli bir ürün seçilmedi.</p>';
    }

    $cards = [];
    $n = 0;
    foreach ($products as $product) {
        if (!is_array($product)) {
            continue;
        }
        $card = duru_quote_single_product_card($product, $siteUrl, $accent, $accentLight, $accentBg, ++$n);
        if ($card !== '') {
            $cards[] = $card;
        }
    }

    return $cards !== [] ? duru_quote_products_grid($cards) : '<p style="margin:0;color:#6b7280;">Genel bilgi talebi</p>';
}

/**
 * @param array<string,mixed> $product
 */
function duru_quote_single_product_card(array $product, string $siteUrl, string $accent, string $accentLight, string $accentBg, int $n): string
{
    $name = trim((string) ($product['name'] ?? ''));
    $model = trim((string) ($product['model'] ?? ''));
    $category = trim((string) ($product['category'] ?? ''));
    $slug = trim((string) ($product['slug'] ?? ''));
    if ($name === '' && $model === '') {
        return '';
    }

    $imgUrl = trim((string) ($product['imageUrl'] ?? ''));
    if ($imgUrl === '' && $slug !== '') {
        $imgUrl = $siteUrl . '/assets/img/products/' . rawurlencode($slug) . '-01.webp';
    }
    if ($imgUrl !== '' && preg_match('#^https?://#i', $imgUrl)) {
        $imgCell = '<img src="' . duru_quote_h($imgUrl) . '" alt="" width="120" height="80" style="display:block;width:100%;max-width:120px;height:auto;max-height:80px;margin:0 auto;object-fit:contain;border-radius:6px;border:1px solid #e5e7eb;background:#fff;" />';
    } else {
        $imgCell = '<div style="width:100%;max-width:120px;height:72px;margin:0 auto;border:1px dashed #d1d5db;border-radius:6px;background:#F9FAFB;color:#9ca3af;font-size:10px;line-height:72px;text-align:center;">Görsel</div>';
    }

    $specsHtml = '';
    $specs = $product['specs'] ?? [];
    if (is_array($specs) && $specs !== []) {
        $specRows = '';
        foreach (array_slice($specs, 0, 3) as $spec) {
            if (!is_array($spec)) {
                continue;
            }
            $label = trim((string) ($spec['label'] ?? $spec['ozellik'] ?? ''));
            $value = trim((string) ($spec['value'] ?? $spec['deger'] ?? ''));
            if ($label === '' || $value === '') {
                continue;
            }
            $specRows .= '<tr><td style="padding:2px 8px 2px 0;color:#6b7280;font-size:10px;">'
                . duru_quote_h($label)
                . '</td><td style="padding:2px 0;font-size:10px;font-weight:600;color:#2B2E33;">'
                . duru_quote_h($value)
                . '</td></tr>';
        }
        if ($specRows !== '') {
            $specsHtml = '<table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:8px;width:100%;">'
                . $specRows . '</table>';
        }
    }

    $productLink = $slug !== ''
        ? $siteUrl . '/urunler/' . rawurlencode((string) ($product['categorySlug'] ?? '')) . '/' . rawurlencode($slug) . '/index.html'
        : '';

    $titleHtml = $productLink !== ''
        ? '<a href="' . duru_quote_h($productLink) . '" style="font-size:13px;font-weight:700;color:' . $accent . ';text-decoration:none;line-height:1.35;">' . duru_quote_h($name) . '</a>'
        : '<span style="font-size:13px;font-weight:700;color:#2B2E33;line-height:1.35;">' . duru_quote_h($name) . '</span>';

    return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;overflow:hidden;height:100%;">'
        . '<tr><td style="padding:6px 10px;background:' . $accentBg . ';font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:'
        . duru_quote_h($accentLight)
        . ';">Ürün ' . $n . ' · ' . duru_quote_h($model !== '' ? $model : 'Model')
        . '</td></tr><tr><td style="padding:10px;text-align:center;background:#fff;">'
        . $imgCell
        . '</td></tr><tr><td style="padding:0 10px 10px;background:#fff;font-family:Arial,Helvetica,sans-serif;vertical-align:top;">'
        . '<p style="margin:0 0 4px;">' . $titleHtml . '</p>'
        . '<p style="margin:0;font-size:11px;color:#6b7280;">' . duru_quote_h($category) . '</p>'
        . $specsHtml
        . '</td></tr></table>';
}

/** @param array<int,string> $cards */
function duru_quote_products_grid(array $cards): string
{
    $html = '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">';
    $count = count($cards);
    for ($i = 0; $i < $count; $i += 2) {
        $html .= '<tr>';
        $html .= '<td width="50%" valign="top" style="width:50%;padding:0 6px 12px 0;vertical-align:top;">' . $cards[$i] . '</td>';
        if (isset($cards[$i + 1])) {
            $html .= '<td width="50%" valign="top" style="width:50%;padding:0 0 12px 6px;vertical-align:top;">' . $cards[$i + 1] . '</td>';
        } else {
            $html .= '<td width="50%" style="width:50%;padding:0 0 12px 6px;"></td>';
        }
        $html .= '</tr>';
    }
    $html .= '</table>';
    return $html;
}

function duru_strip_data_urls_from_html(string $html): string
{
    return (string) preg_replace('/src=(["\'])data:[^"\']+\1/i', 'src=$1$1', $html);
}
