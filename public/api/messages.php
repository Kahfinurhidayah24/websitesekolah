<?php
// Pesan Kontak.
// POST (publik)        => kirim pesan dari form di bagian Kontak
// GET / PATCH / DELETE => khusus admin (daftar, tandai dibaca, hapus)
require __DIR__ . '/config.php';

db()->exec('CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL DEFAULT \'\',
  `phone` VARCHAR(30) NOT NULL DEFAULT \'\',
  `subject` VARCHAR(150) NOT NULL DEFAULT \'\',
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');

function row_to_msg(array $r): array {
    return [
        'id' => (string)$r['id'],
        'name' => $r['name'],
        'email' => $r['email'],
        'phone' => $r['phone'],
        'subject' => $r['subject'],
        'message' => $r['message'],
        'isRead' => (bool)$r['is_read'],
        'createdAt' => $r['created_at'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo = db();

if ($method === 'POST') {
    $b = body();
    // Jebakan bot: kolom "website" disembunyikan di form, manusia tidak mengisinya.
    if (trim((string)($b['website'] ?? '')) !== '') respond(['ok' => true]);

    // Batasi kiriman beruntun dari sesi yang sama.
    $last = (int)($_SESSION['last_msg_at'] ?? 0);
    if (time() - $last < 20) respond(['error' => 'Mohon tunggu beberapa detik sebelum mengirim pesan lagi.'], 429);

    $name = clip($b['name'] ?? '', 100);
    $email = clip($b['email'] ?? '', 120);
    $phone = clip($b['phone'] ?? '', 30);
    $subject = clip($b['subject'] ?? '', 150);
    $message = clip($b['message'] ?? '', 3000);
    if ($name === '' || $message === '') respond(['error' => 'Nama dan isi pesan wajib diisi.'], 422);
    if ($email === '' && $phone === '') respond(['error' => 'Isi email atau nomor telepon agar kami bisa membalas.'], 422);
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) respond(['error' => 'Format email tidak valid.'], 422);

    $pdo->prepare('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?,?,?,?,?)')
        ->execute([$name, $email, $phone, $subject, $message]);
    $_SESSION['last_msg_at'] = time();
    respond(['ok' => true], 201);
}

require_admin();

if ($method === 'GET') {
    $rows = $pdo->query('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC LIMIT 500')->fetchAll();
    respond(['messages' => array_map('row_to_msg', $rows)]);
}

$b = body();
$id = (int)($b['id'] ?? $_GET['id'] ?? 0);
if ($id <= 0) respond(['error' => 'ID tidak valid.'], 422);

if ($method === 'PATCH') {
    $pdo->prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?')->execute([!empty($b['isRead']) ? 1 : 0, $id]);
    respond(['ok' => true]);
}
if ($method === 'DELETE') {
    $pdo->prepare('DELETE FROM contact_messages WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}
respond(['error' => 'Method tidak diizinkan.'], 405);
