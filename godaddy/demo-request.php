<?php
/**
 * Orb — demo request mailer
 * Deploy to GoDaddy shared hosting at:  https://api.orbintelligence.co/demo-request.php
 *
 * The marketing site is a static build on GitHub Pages and cannot send mail.
 * It POSTs the demo form here as JSON; this script emails it to SUPPORT_INBOX.
 *
 * See README.md in this folder for the (short) setup steps.
 */

// ─── Config ───────────────────────────────────────────────────────────────
const SUPPORT_INBOX = 'support@orbintelligence.co';
// The From: address MUST be on your own domain or GoDaddy/SPF will reject or
// spam-bin the message. It does not need to be a real mailbox.
const FROM_ADDRESS  = 'noreply@orbintelligence.co';
const ALLOWED_ORIGINS = [
    'https://orbintelligence.co',
    'https://www.orbintelligence.co',
];

// ─── CORS ─────────────────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

function fail(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail(405, 'Method not allowed.');

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) fail(400, 'Invalid payload.');

// Honeypot: real users never fill this hidden field. Accept silently so bots
// think they succeeded and do not retry.
if (!empty($data['website'])) { echo json_encode(['ok' => true]); exit; }

$name    = trim((string)($data['name'] ?? ''));
$email   = trim((string)($data['email'] ?? ''));
$company = trim((string)($data['company'] ?? ''));
$purpose = trim((string)($data['purpose'] ?? ''));

if ($name === '' || $email === '' || $company === '' || $purpose === '') {
    fail(422, 'All fields are required.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(422, 'Please enter a valid email address.');
}

// Strip CR/LF from anything that touches a mail header — prevents header
// injection (an attacker adding Bcc: via a newline in their name).
$noBreaks = static fn(string $s): string => trim(preg_replace('/[\r\n]+/', ' ', $s));
$name    = mb_substr($noBreaks($name), 0, 200);
$email   = mb_substr($noBreaks($email), 0, 200);
$company = mb_substr($noBreaks($company), 0, 200);
$purpose = mb_substr($purpose, 0, 4000); // body only — newlines are fine here

$subject = 'Demo request — ' . $company;
$body = "New demo request from orbintelligence.co\n\n"
      . "Name:    {$name}\n"
      . "Email:   {$email}\n"
      . "Company: {$company}\n\n"
      . "What they're exploring:\n{$purpose}\n\n"
      . "----\n"
      . 'Submitted: ' . gmdate('Y-m-d H:i:s') . " UTC\n"
      . 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers = implode("\r\n", [
    'From: Orb Website <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $name . ' <' . $email . '>', // hitting Reply answers the requester
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
]);

$sent = @mail(SUPPORT_INBOX, $subject, $body, $headers, '-f' . FROM_ADDRESS);

if (!$sent) {
    fail(500, 'Could not send right now. Please email ' . SUPPORT_INBOX . ' directly.');
}

echo json_encode(['ok' => true]);
