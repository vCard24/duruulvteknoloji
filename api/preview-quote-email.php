<?php
/**
 * Teklif e-postası HTML önizleme (gönderim yok)
 */
declare(strict_types=1);

@ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Yalnızca POST'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/quote-email-builder.php';

$configPath = __DIR__ . '/config.php';
$config = is_readable($configPath) ? require $configPath : ['site_url' => 'http://localhost:8080'];

$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Geçersiz istek'], JSON_UNESCAPED_UNICODE);
    exit;
}

$formData = $payload['data'] ?? $payload;
if (!is_array($formData)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Form verisi eksik'], JSON_UNESCAPED_UNICODE);
    exit;
}

$formData['name'] = trim((string) ($formData['name'] ?? $payload['name'] ?? 'Örnek Müşteri'));
$formData['email'] = trim((string) ($formData['email'] ?? $payload['email'] ?? 'ornek@firma.com'));
$formData['phone'] = trim((string) ($formData['phone'] ?? $payload['phone'] ?? '+90 5XX XXX XX XX'));

$html = duru_build_quote_email_html($formData, $config);

$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$isLocalHost = (bool) preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/', $host);

$filename = null;
if ($isLocalHost) {
    $outbox = __DIR__ . '/outbox';
    if (!is_dir($outbox)) {
        mkdir($outbox, 0755, true);
    }
    $safeName = preg_replace('/[^a-z0-9_-]+/i', '-', $formData['name']) ?: 'onizleme';
    $filename = 'preview-' . date('Y-m-d-His') . '-' . $safeName . '.html';
    file_put_contents($outbox . '/' . $filename, $html);
}

echo json_encode([
    'ok'       => true,
    'preview'  => true,
    'html'     => $html,
    'saved'    => $filename ?? null,
], JSON_UNESCAPED_UNICODE);
