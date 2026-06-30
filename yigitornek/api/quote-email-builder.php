<?php
declare(strict_types=1);

/**
 * Teklif formu — yapılandırılmış JSON'dan HTML e-posta üretir (küçük POST gövdesi).
 */
function yck_quote_h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function yck_quote_email_section(string $title, string $bodyHtml): string
{
    return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;overflow:hidden;background:#ffffff;">'
        . '<tr><td style="padding:8px 14px;background:#f3f4f6;border-bottom:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#374151;">'
        . yck_quote_h($title)
        . '</td></tr><tr><td style="padding:14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#111827;">'
        . $bodyHtml
        . '</td></tr></table>';
}

/** @param array<int,array{0:string,1:string}> $fields */
function yck_quote_field_table(array $fields): string
{
    $rows = '';
    foreach ($fields as $row) {
        $label = trim((string) ($row[0] ?? ''));
        $value = trim((string) ($row[1] ?? ''));
        if ($value === '') {
            continue;
        }
        $rows .= '<tr><td style="padding:6px 10px 6px 0;width:38%;vertical-align:top;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;">'
            . yck_quote_h($label)
            . '</td><td style="padding:6px 0;vertical-align:top;font-size:13px;color:#111827;">'
            . yck_quote_h($value)
            . '</td></tr>';
    }
    if ($rows === '') {
        return '<p style="margin:0;color:#6b7280;">—</p>';
    }
    return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">' . $rows . '</table>';
}

/** @param array<string,mixed> $data */
function yck_quote_product_cards(array $data): string
{
    $slots = $data['slots'] ?? [];
    if (!is_array($slots)) {
        return '<p style="margin:0;color:#6b7280;">Ürün seçilmedi</p>';
    }

    $cards = [];
    $n = 0;
    foreach ($slots as $slot) {
        if (!is_array($slot)) {
            continue;
        }
        $code = trim((string) ($slot['code'] ?? ''));
        $series = trim((string) ($slot['seriesName'] ?? ''));
        if ($code === '' && $series === '') {
            continue;
        }
        $n++;
        $qty = (int) ($slot['qty'] ?? 1);
        if ($qty < 1) {
            $qty = 1;
        }
        $openRight = !empty($slot['openRight']);
        $openLeft = !empty($slot['openLeft']);
        if ($openRight) {
            $openDir = 'Sağa açılır';
        } elseif ($openLeft) {
            $openDir = 'Sola açılır';
        } else {
            $openDir = 'Belirtilmedi';
        }

        $imgUrl = trim((string) ($slot['imageUrl'] ?? ''));
        if ($imgUrl !== '' && preg_match('#^https?://#i', $imgUrl)) {
            $imgCell = '<img src="' . yck_quote_h($imgUrl) . '" alt="" width="120" style="display:block;width:120px;max-width:120px;height:auto;border-radius:6px;border:1px solid #e5e7eb;" />';
        } else {
            $imgCell = '<div style="width:120px;height:90px;border:1px dashed #d1d5db;border-radius:6px;background:#f9fafb;color:#9ca3af;font-size:11px;line-height:90px;text-align:center;">Görsel yok</div>';
        }

        $cards[] = '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 10px;border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;overflow:hidden;">'
            . '<tr><td colspan="2" style="padding:6px 12px;background:#fef2f2;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#dc2626;">Ürün '
            . $n
            . '</td></tr><tr><td style="padding:12px;width:132px;vertical-align:top;background:#fff;">'
            . $imgCell
            . '</td><td style="padding:12px;vertical-align:top;background:#fff;font-family:Arial,Helvetica,sans-serif;">'
            . '<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#111827;">'
            . yck_quote_h($code !== '' ? $code : '—')
            . '</p><p style="margin:0 0 10px;font-size:12px;color:#6b7280;">'
            . yck_quote_h($series)
            . '</p><table role="presentation" cellspacing="0" cellpadding="0" style="font-size:12px;color:#374151;">'
            . '<tr><td style="padding:2px 12px 2px 0;color:#6b7280;">Adet</td><td style="padding:2px 0;font-weight:600;">'
            . yck_quote_h((string) $qty)
            . '</td></tr><tr><td style="padding:2px 12px 2px 0;color:#6b7280;">Açılım</td><td style="padding:2px 0;font-weight:600;">'
            . yck_quote_h($openDir)
            . '</td></tr></table></td></tr></table>';
    }

    return $cards !== [] ? implode('', $cards) : '<p style="margin:0;color:#6b7280;">Ürün seçilmedi</p>';
}

/** @param array<string,mixed> $data */
function yck_build_quote_email_html(array $data): string
{
    $dateStr = date('d.m.Y');
    $logoSrc = 'https://www.yigitcelikkapi.com.tr/assets/img/yigit_logo.svg';
    $logoHtml = '<img src="' . yck_quote_h($logoSrc) . '" alt="Yiğit Çelik Kapı" width="160" style="display:block;width:160px;max-width:160px;height:auto;" />';

    $contactHtml = yck_quote_field_table([
        ['Ad soyad', (string) ($data['name'] ?? '')],
        ['Telefon', (string) ($data['phone'] ?? '')],
        ['E-posta', (string) ($data['email'] ?? '')],
        ['Firma', (string) ($data['company'] ?? '')],
        ['Ülke', (string) ($data['country'] ?? '')],
        ['Konum', (string) ($data['location'] ?? '')],
    ]);

    $customHtml = yck_quote_field_table([
        ['Renk', (string) ($data['color'] ?? '')],
        ['Desen', (string) ($data['pattern'] ?? '')],
        ['Ölçü', (string) ($data['size'] ?? '')],
        ['Kasa tipi', (string) ($data['frame'] ?? '')],
        ['Panel tipi', (string) ($data['panel'] ?? '')],
        ['Kol', (string) ($data['handle'] ?? '')],
        ['Kilit', (string) ($data['lock'] ?? '')],
        ['Dürbün', (string) ($data['peephole'] ?? '')],
        ['Menteşe', (string) ($data['hinge'] ?? '')],
        ['Yangın dayanımı', (string) ($data['fire'] ?? '')],
        ['Özel istekler', (string) ($data['message'] ?? '')],
    ]);

    $customBlock = str_contains($customHtml, '<tr>') ? yck_quote_email_section('Kişiselleştirme', $customHtml) : '';

    return '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fiyat Teklifi Talep Formu</title></head>'
        . '<body style="margin:0;padding:0;background:#f3f4f6;">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">'
        . '<tr><td align="center">'
        . '<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">'
        . '<tr><td style="padding:24px 28px 16px;border-bottom:2px solid #dc2626;font-family:Arial,Helvetica,sans-serif;">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>'
        . '<td style="width:170px;vertical-align:middle;">' . $logoHtml . '</td>'
        . '<td style="vertical-align:middle;padding-left:16px;">'
        . '<h1 style="margin:0 0 4px;font-size:21px;line-height:1.25;color:#111827;">Fiyat Teklifi Talep Formu</h1>'
        . '<p style="margin:0;font-size:11px;color:#6b7280;">Talep tarihi: ' . yck_quote_h($dateStr) . '</p>'
        . '</td></tr></table></td></tr>'
        . '<tr><td style="padding:20px 28px 8px;">'
        . yck_quote_email_section('Seçilen ürünler', yck_quote_product_cards($data))
        . yck_quote_email_section('İletişim bilgileri', $contactHtml)
        . $customBlock
        . '</td></tr>'
        . '<tr><td style="padding:0 28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#6b7280;border-top:1px solid #e5e7eb;">'
        . '<p style="margin:16px 0 6px;"><strong style="color:#111827;">Yiğit Çelik Kapı</strong><br />www.yigitcelikkapi.com.tr · +90 352 311 55 41 · info@yigitcelikkapi.com.tr</p>'
        . '<p style="margin:0;font-size:10px;">Bu belge müşteri talep formunun özetidir; bağlayıcı fiyat teklifi niteliği taşımaz.</p>'
        . '</td></tr></table></td></tr></table></body></html>';
}

function yck_strip_data_urls_from_html(string $html): string
{
    return (string) preg_replace('/src=(["\'])data:[^"\']+\1/i', 'src=$1$1', $html);
}
