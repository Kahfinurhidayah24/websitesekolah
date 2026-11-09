<?php
// Konten situs yang bisa diedit admin (fasilitas, galeri, berita, guru, sambutan, identitas).
// GET  => semua konten (publik)
// POST {key, data} => simpan satu bagian (khusus admin)
require __DIR__ . '/config.php';

const CONTENT_KEYS = [
    'facilities', 'extracurriculars', 'gallery', 'news', 'teachers', 'principal', 'identity', 'contact', 'menu',
    'hero', 'programs', 'achievements', 'ppdbSettings', 'ppdbSchedule', 'ppdbAnnouncements',
];

ensure_site_content_table();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $out = [];
    foreach (db()->query('SELECT content_key, content_json FROM site_content') as $r) {
        $decoded = json_decode($r['content_json'], true);
        if ($decoded !== null) $out[$r['content_key']] = $decoded;
    }
    respond(['content' => (object)$out]);
}

require_admin();
$b = body();
$key = (string)($b['key'] ?? '');
if (!in_array($key, CONTENT_KEYS, true) || !array_key_exists('data', $b)) {
    respond(['error' => 'Permintaan tidak valid.'], 422);
}
$json = json_encode($b['data'], JSON_UNESCAPED_UNICODE);
if ($json === false || strlen($json) > 4 * 1024 * 1024) {
    respond(['error' => 'Data terlalu besar atau tidak valid.'], 422);
}
$stmt = db()->prepare('REPLACE INTO site_content (content_key, content_json) VALUES (?, ?)');
$stmt->execute([$key, $json]);
respond(['ok' => true]);
