<?php
// GET ?q=...  Cek status pendaftaran (nomor registrasi / NIK / nama lengkap).
require __DIR__ . '/config.php';

$q = trim((string)($_GET['q'] ?? ''));
if ($q === '') respond(['error' => 'Masukkan nomor registrasi, NIK, atau nama.'], 422);

// Catatan: dengan prepared statement asli, nama parameter TIDAK boleh dipakai dua kali.
$stmt = db()->prepare(
    'SELECT * FROM ppdb_registrations
     WHERE registration_no = :q1 OR nik = :q2 OR student_name LIKE :like
     ORDER BY created_at DESC, id DESC LIMIT 1'
);
$stmt->execute(['q1' => $q, 'q2' => $q, 'like' => '%' . addcslashes($q, '%_\\') . '%']);
$row = $stmt->fetch();
respond(['registration' => $row ? row_to_reg($row) : null]);
