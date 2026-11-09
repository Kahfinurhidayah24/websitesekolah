<?php
// POST multipart "image" => {url}. Khusus admin. Foto disimpan di api/uploads/site/
require __DIR__ . '/config.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error' => 'Metode tidak didukung.'], 405);

$f = $_FILES['image'] ?? null;
if (!$f || $f['error'] === UPLOAD_ERR_NO_FILE) respond(['error' => 'Pilih foto terlebih dahulu.'], 422);
if ($f['error'] !== UPLOAD_ERR_OK || $f['size'] > 8 * 1024 * 1024) {
    respond(['error' => 'Foto gagal diunggah atau lebih dari 8 MB.'], 422);
}
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
if (!isset($allowed[$mime])) respond(['error' => 'Format foto harus JPG, PNG, atau WEBP.'], 422);

$dir = UPLOAD_DIR . 'site/';
if (!is_dir($dir) && !mkdir($dir, 0775, true)) respond(['error' => 'Tidak bisa membuat folder api/uploads/site.'], 500);

$name = 'img_' . date('Ymd') . '_' . bin2hex(random_bytes(6)) . '.' . $allowed[$mime];
if (!move_uploaded_file($f['tmp_name'], $dir . $name)) {
    respond(['error' => 'Tidak bisa menyimpan foto. Cek izin folder api/uploads.'], 500);
}
respond(['url' => 'api/uploads/site/' . $name]);
