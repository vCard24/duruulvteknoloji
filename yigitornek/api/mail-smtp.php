<?php
declare(strict_types=1);

/**
 * Hostinger SMTP ile HTML mail (PHPMailer gerektirmez)
 */
function yck_send_quote_mail(array $config, string $to, string $subject, string $html, string $replyTo): bool
{
    $smtp = $config['smtp'] ?? [];
    if (!empty($smtp['enabled']) && !empty($smtp['pass'])) {
        return yck_smtp_send_mail($config, $to, $subject, $html, $replyTo);
    }

    return yck_php_mail_send($config, $to, $subject, $html, $replyTo);
}

function yck_php_mail_send(array $config, string $to, string $subject, string $html, string $replyTo): bool
{
    $fromEmail = trim((string) ($config['from_email'] ?? ''));
    $fromName = trim((string) ($config['from_name'] ?? 'Yiğit Çelik Kapı'));

    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $replyTo,
    ];

    @ini_set('sendmail_from', $fromEmail);

    return @mail(
        $to,
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        $html,
        implode("\r\n", $headers),
        '-f' . $fromEmail
    );
}

function yck_smtp_send_mail(array $config, string $to, string $subject, string $html, string $replyTo): bool
{
    $smtp = $config['smtp'];
    $host = trim((string) ($smtp['host'] ?? 'smtp.hostinger.com'));
    $port = (int) ($smtp['port'] ?? 465);
    $user = trim((string) ($smtp['user'] ?? $config['from_email'] ?? ''));
    $pass = (string) ($smtp['pass'] ?? '');
    $secure = strtolower(trim((string) ($smtp['secure'] ?? 'ssl')));
    $fromEmail = trim((string) ($config['from_email'] ?? $user));
    $fromName = trim((string) ($config['from_name'] ?? 'Yiğit Çelik Kapı'));

    if ($host === '' || $user === '' || $pass === '' || $fromEmail === '') {
        return false;
    }

    $remote = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
    $socket = @stream_socket_client($remote, $errno, $errstr, 30, STREAM_CLIENT_CONNECT);
    if (!$socket) {
        yck_mail_log("SMTP connect failed ({$remote}): {$errno} {$errstr}");
        return false;
    }

    stream_set_timeout($socket, 45);

    try {
        yck_smtp_expect(yck_smtp_read($socket), [220]);
        yck_smtp_cmd($socket, 'EHLO yigitcelikkapi.com.tr', [250]);

        if ($secure === 'tls') {
            yck_smtp_cmd($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('STARTTLS failed');
            }
            yck_smtp_cmd($socket, 'EHLO yigitcelikkapi.com.tr', [250]);
        }

        yck_smtp_cmd($socket, 'AUTH LOGIN', [334]);
        yck_smtp_cmd($socket, base64_encode($user), [334]);
        yck_smtp_cmd($socket, base64_encode($pass), [235]);
        yck_smtp_cmd($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
        yck_smtp_cmd($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        yck_smtp_cmd($socket, 'DATA', [354]);

        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
        $message =
            'From: ' . $encodedName . ' <' . $fromEmail . ">\r\n" .
            'To: <' . $to . ">\r\n" .
            'Reply-To: ' . $replyTo . "\r\n" .
            'MIME-Version: 1.0' . "\r\n" .
            'Content-Type: text/html; charset=UTF-8' . "\r\n" .
            'Content-Transfer-Encoding: 8bit' . "\r\n" .
            'Subject: ' . $encodedSubject . "\r\n" .
            "\r\n" .
            $html . "\r\n";

        fwrite($socket, $message . "\r\n.\r\n");
        yck_smtp_expect(yck_smtp_read($socket), [250]);
        yck_smtp_cmd($socket, 'QUIT', [221]);

        return true;
    } catch (Throwable $e) {
        @fwrite($socket, "QUIT\r\n");
        yck_mail_log('SMTP: ' . $e->getMessage());
        return false;
    } finally {
        @fclose($socket);
    }
}

function yck_smtp_cmd($socket, string $cmd, array $okCodes): void
{
    fwrite($socket, $cmd . "\r\n");
    yck_smtp_expect(yck_smtp_read($socket), $okCodes);
}

function yck_smtp_read($socket): string
{
    $data = '';
    while ($line = fgets($socket, 515)) {
        $data .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function yck_smtp_expect(string $response, array $okCodes): void
{
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $okCodes, true)) {
        throw new RuntimeException('SMTP error: ' . trim($response));
    }
}

function yck_mail_log(string $message): void
{
    @file_put_contents(__DIR__ . '/mail-error.log', date('c') . ' ' . $message . "\n", FILE_APPEND);
}
