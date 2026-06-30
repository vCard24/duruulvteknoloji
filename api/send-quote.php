<?php
/**
 * Duru ULV — Fiyat teklifi formu (HTML e-posta)
 */
declare(strict_types=1);

@ini_set('display_errors', '0');
@set_time_limit(120);
error_reporting(E_ALL);

if (ob_get_level() === 0) {
    ob_start();
}

register_shutdown_function(static function (): void {
    $error = error_get_last();
    if (!$error || !in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        return;
    }
    if (ob_get_length()) {
        ob_clean();
    }
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode([
        'ok'    => false,
        'error' => 'Sunucu hatası (PHP). api/mail-error.log dosyasını kontrol edin.',
    ], JSON_UNESCAPED_UNICODE);
});

function duru_json_response(int $code, array $payload): void
{
    if (ob_get_length()) {
        ob_clean();
    }
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    duru_json_response(204, ['ok' => true]);
}

require_once __DIR__ . '/mail-smtp.php';
require_once __DIR__ . '/quote-email-builder.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    duru_json_response(405, ['ok' => false, 'error' => 'Yalnızca POST istekleri kabul edilir.']);
}

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    duru_json_response(503, [
        'ok'    => false,
        'error' => 'Sunucu yapılandırması eksik. api/config.php dosyasını oluşturun.',
    ]);
}

/** @var array<string,mixed> $config */
$config = require $configPath;

$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$isLocalHost = (bool) preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/', $host);
$smtpPass = trim((string) ($config['smtp']['pass'] ?? ''));
// SMTP şifresi yoksa localhost'ta outbox'a kaydet; şifre varsa gerçek mail gönder
$devSaveOnly = !empty($config['dev_save_only']) || ($isLocalHost && $smtpPass === '');

$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '', true);
if (!is_array($payload)) {
    duru_json_response(400, ['ok' => false, 'error' => 'Geçersiz istek gövdesi.']);
}

if (!empty($payload['honey'])) {
    duru_json_response(400, ['ok' => false, 'error' => 'Spam algılandı.']);
}

$formData = $payload['data'] ?? null;
if (!is_array($formData)) {
    duru_json_response(422, ['ok' => false, 'error' => 'Form verisi eksik.']);
}

$name  = trim((string) ($formData['name'] ?? $payload['name'] ?? ''));
$email = trim((string) ($formData['email'] ?? $payload['email'] ?? ''));
$phone = trim((string) ($formData['phone'] ?? $payload['phone'] ?? ''));
$formData['name']  = $name;
$formData['email'] = $email;
$formData['phone'] = $phone;

if (empty($formData['kvkk'])) {
    duru_json_response(422, ['ok' => false, 'error' => 'KVKK onayı zorunludur.']);
}

$html = duru_build_quote_email_html($formData, $config);

if ($name === '' || $email === '' || $phone === '') {
    duru_json_response(422, ['ok' => false, 'error' => 'Zorunlu alanlar eksik.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    duru_json_response(422, ['ok' => false, 'error' => 'Geçersiz e-posta adresi.']);
}

$to = trim((string) ($config['to_email'] ?? ''));
$fromEmail = trim((string) ($config['from_email'] ?? ''));
$subjectName = preg_replace('/[\r\n\t]/', ' ', $name) ?: 'Müşteri';

if ($to === '' || $fromEmail === '') {
    duru_json_response(503, ['ok' => false, 'error' => 'E-posta yapılandırması eksik.']);
}

if ($devSaveOnly) {
    $outbox = __DIR__ . '/outbox';
    if (!is_dir($outbox) && !mkdir($outbox, 0755, true) && !is_dir($outbox)) {
        duru_json_response(500, ['ok' => false, 'error' => 'Yerel outbox klasörü oluşturulamadı.']);
    }
    $safeName = preg_replace('/[^a-z0-9_-]+/i', '-', $subjectName) ?: 'musteri';
    $filename = 'quote-' . date('Y-m-d-His') . '-' . $safeName . '.html';
    if (file_put_contents($outbox . '/' . $filename, $html) === false) {
        duru_json_response(500, ['ok' => false, 'error' => 'Yerel HTML dosyası kaydedilemedi.']);
    }
    duru_json_response(200, [
        'ok'      => true,
        'dev'     => true,
        'saved'   => $filename,
        'message' => 'Yerel test: e-posta gönderilmedi, HTML outbox klasörüne kaydedildi.',
    ]);
}

$subject = 'Duru ULV — Fiyat teklifi: ' . $subjectName;
$sent = duru_send_quote_mail($config, $to, $subject, $html, $email);

if (!$sent) {
    $backupDir = __DIR__ . '/outbox';
    if (!is_dir($backupDir)) {
        @mkdir($backupDir, 0755, true);
    }
    @file_put_contents($backupDir . '/failed-' . date('Y-m-d-His') . '.html', $html);
    @file_put_contents(__DIR__ . '/mail-error.log', date('c') . " send failed for {$email}\n", FILE_APPEND);

    duru_json_response(500, [
        'ok'    => false,
        'error' => 'E-posta gönderilemedi. api/config.php içinde SMTP şifresini kontrol edin.',
    ]);
}

duru_json_response(200, ['ok' => true, 'via' => 'smtp']);
