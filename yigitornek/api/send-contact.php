<?php
/**
 * Hızlı iletişim formları — HTML e-posta (footer + iletişim sayfası)
 */
declare(strict_types=1);

@ini_set('display_errors', '0');
error_reporting(E_ALL);

if (ob_get_level() === 0) {
    ob_start();
}

function yck_json_response(int $code, array $payload): void
{
    if (ob_get_length()) {
        ob_clean();
    }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/mail-smtp.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    yck_json_response(405, ['ok' => false, 'error' => 'Yalnızca POST istekleri kabul edilir.']);
}

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    yck_json_response(503, ['ok' => false, 'error' => 'Sunucu yapılandırması eksik.']);
}

/** @var array<string,mixed> $config */
$config = require $configPath;

$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$isLocalHost = (bool) preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/', $host);
$devSaveOnly = !empty($config['dev_save_only']) || $isLocalHost;

$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '', true);
if (!is_array($payload)) {
    yck_json_response(400, ['ok' => false, 'error' => 'Geçersiz istek gövdesi.']);
}

if (!empty($payload['honey'])) {
    yck_json_response(400, ['ok' => false, 'error' => 'Spam algılandı.']);
}

$name    = trim((string) ($payload['name'] ?? ''));
$email   = trim((string) ($payload['email'] ?? ''));
$phone   = trim((string) ($payload['phone'] ?? ''));
$message = trim((string) ($payload['message'] ?? ''));
$source  = trim((string) ($payload['source'] ?? 'web'));

if ($name === '' || $email === '') {
    yck_json_response(422, ['ok' => false, 'error' => 'Zorunlu alanlar eksik.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    yck_json_response(422, ['ok' => false, 'error' => 'Geçersiz e-posta adresi.']);
}

if (strlen($message) > 10000) {
    yck_json_response(413, ['ok' => false, 'error' => 'Mesaj çok uzun.']);
}

$to = trim((string) ($config['to_email'] ?? ''));
$fromEmail = trim((string) ($config['from_email'] ?? ''));
$subjectName = preg_replace('/[\r\n\t]/', ' ', $name) ?: 'Ziyaretçi';

if ($to === '' || $fromEmail === '') {
    yck_json_response(503, ['ok' => false, 'error' => 'E-posta yapılandırması eksik.']);
}

$sourceLabel = yck_contact_source_label($source);
$html = yck_build_contact_email_html($name, $email, $phone, $message, $sourceLabel);

if ($devSaveOnly) {
    $outbox = __DIR__ . '/outbox';
    if (!is_dir($outbox) && !mkdir($outbox, 0755, true) && !is_dir($outbox)) {
        yck_json_response(500, ['ok' => false, 'error' => 'Yerel outbox klasörü oluşturulamadı.']);
    }
    $safeName = preg_replace('/[^a-z0-9_-]+/i', '-', $subjectName) ?: 'ziyaretci';
    $filename = 'contact-' . date('Y-m-d-His') . '-' . $safeName . '.html';
    if (file_put_contents($outbox . '/' . $filename, $html) === false) {
        yck_json_response(500, ['ok' => false, 'error' => 'Yerel HTML dosyası kaydedilemedi.']);
    }
    yck_json_response(200, [
        'ok'    => true,
        'dev'   => true,
        'saved' => $filename,
    ]);
}

$subject = 'Yiğit Çelik Kapı — ' . $sourceLabel . ': ' . $subjectName;
$sent = yck_send_quote_mail($config, $to, $subject, $html, $email);

if (!$sent) {
    @file_put_contents(__DIR__ . '/mail-error.log', date('c') . " contact send failed for {$email}\n", FILE_APPEND);
    yck_json_response(500, ['ok' => false, 'error' => 'E-posta gönderilemedi. SMTP ayarlarını kontrol edin.']);
}

yck_json_response(200, ['ok' => true, 'via' => 'smtp']);

function yck_contact_source_label(string $source): string
{
    return match ($source) {
        'footer'  => 'Footer hızlı form',
        'contact' => 'İletişim sayfası',
        default   => 'Web formu',
    };
}

function yck_esc(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function yck_build_contact_email_html(
    string $name,
    string $email,
    string $phone,
    string $message,
    string $sourceLabel
): string {
    $dateStr = date('d.m.Y');
    $logoUrl = 'https://www.yigitcelikkapi.com.tr/assets/img/yigit_logo.svg';
    $phoneRow = $phone !== ''
        ? '<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:130px;">Telefon</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">' . yck_esc($phone) . '</td></tr>'
        : '';

    $rows =
        '<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:130px;">Ad soyad</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">' . yck_esc($name) . '</td></tr>' .
        '<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">E-posta</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">' . yck_esc($email) . '</td></tr>' .
        $phoneRow .
        '<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;vertical-align:top;">Mesaj</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;white-space:pre-wrap;">' .
        ($message !== '' ? nl2br(yck_esc($message)) : '—') .
        '</td></tr>' .
        '<tr><td style="padding:8px 12px;color:#6b7280;">Kaynak</td><td style="padding:8px 12px;color:#111827;">' . yck_esc($sourceLabel) . '</td></tr>';

    return '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>İletişim Formu</title></head>' .
        '<body style="margin:0;padding:0;background:#f3f4f6;">' .
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">' .
        '<tr><td align="center">' .
        '<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">' .
        '<tr><td style="padding:24px 28px 16px;border-bottom:2px solid #dc2626;font-family:Arial,Helvetica,sans-serif;">' .
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>' .
        '<td style="width:170px;vertical-align:middle;">' .
        '<img src="' . yck_esc($logoUrl) . '" alt="Yiğit Çelik Kapı" width="160" style="display:block;width:160px;max-width:160px;height:auto;" />' .
        '</td><td style="vertical-align:middle;padding-left:16px;">' .
        '<h1 style="margin:0 0 4px;font-size:21px;line-height:1.25;color:#111827;">İletişim Formu</h1>' .
        '<p style="margin:0;font-size:11px;color:#6b7280;">Talep tarihi: ' . yck_esc($dateStr) . '</p>' .
        '</td></tr></table></td></tr>' .
        '<tr><td style="padding:20px 28px 8px;font-family:Arial,Helvetica,sans-serif;">' .
        '<h2 style="margin:0 0 12px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#dc2626;">Mesaj detayları</h2>' .
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-size:14px;">' .
        $rows .
        '</table></td></tr>' .
        '<tr><td style="padding:0 28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#6b7280;border-top:1px solid #e5e7eb;">' .
        '<p style="margin:16px 0 6px;"><strong style="color:#111827;">Yiğit Çelik Kapı</strong><br />www.yigitcelikkapi.com.tr · +90 352 311 55 41 · info@yigitcelikkapi.com.tr</p>' .
        '</td></tr></table></td></tr></table></body></html>';
}
