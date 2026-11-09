<?php
// POST multipart/form-data: pendaftaran PPDB dari halaman publik.
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error' => 'Method tidak diizinkan.'], 405);

// Pendaftaran bisa ditutup dari Panel Admin > Pengaturan PPDB (atau otomatis lewat tanggal batas).
[$ppdbOpen, $ppdbMsg] = ppdb_open_state();
if (!$ppdbOpen) respond(['error' => $ppdbMsg], 403);

// Jika total unggahan melebihi post_max_size PHP, $_POST kosong sama sekali.
if (empty($_POST) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    respond(['error' => 'Total ukuran berkas terlalu besar. Kecilkan ukuran KK/Akta/Foto (maks. 3 MB per berkas).'], 413);
}

$in = fn(string $k) => trim((string)($_POST[$k] ?? ''));
$required = ['studentName', 'nik', 'birthPlace', 'birthDate', 'gender', 'religion', 'address', 'kelurahan', 'parentName', 'parentNik', 'parentPhone', 'path'];
foreach ($required as $k) {
    if ($in($k) === '') respond(['error' => "Kolom \"$k\" wajib diisi."], 422);
}
if (!preg_match('/^\d{16}$/', $in('nik')) || !preg_match('/^\d{16}$/', $in('parentNik'))) {
    respond(['error' => 'NIK harus 16 digit angka.'], 422);
}
if (!valid_date($in('birthDate'))) respond(['error' => 'Tanggal lahir tidak valid.'], 422);
if (!in_array($in('gender'), ['Laki-laki', 'Perempuan'], true)) respond(['error' => 'Jenis kelamin tidak valid.'], 422);
if (!in_array($in('path'), ['Zonasi', 'Afirmasi', 'Prestasi', 'Pindah Tugas'], true)) respond(['error' => 'Jalur tidak valid.'], 422);

$pdo = db();
$dup = $pdo->prepare('SELECT registration_no FROM ppdb_registrations WHERE nik = ?');
$dup->execute([$in('nik')]);
if ($row = $dup->fetch()) {
    respond(['error' => 'NIK ini sudah terdaftar dengan nomor ' . $row['registration_no'] . '.'], 409);
}

$kk = save_upload('kk');
$akta = save_upload('akta');
$foto = save_upload('foto');

$distance = $in('path') === 'Zonasi' ? 0.45 : 1.2;
try {
    $ins = $pdo->prepare(
        'INSERT INTO ppdb_registrations
         (registration_no, student_name, nik, birth_place, birth_date, gender, religion, address, rt, rw, kelurahan,
          previous_school, parent_name, parent_nik, parent_phone, parent_job, path, distance_km, doc_kk, doc_akta, doc_foto)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    );
    $ins->execute([
        'TMP' . bin2hex(random_bytes(8)), // nomor sementara unik; diganti setelah id diketahui
        clip($in('studentName'), 120), $in('nik'), clip($in('birthPlace'), 80), $in('birthDate'), $in('gender'),
        clip($in('religion'), 40), clip($in('address'), 255), clip($in('rt'), 5), clip($in('rw'), 5),
        clip($in('kelurahan'), 80), clip($in('previousSchool'), 120) ?: 'PAUD/TK Sekitar',
        clip($in('parentName'), 120), $in('parentNik'), clip($in('parentPhone'), 20), clip($in('parentJob'), 80),
        $in('path'), $distance, $kk, $akta, $foto,
    ]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') { // NIK ganda (dua pengiriman bersamaan)
        respond(['error' => 'NIK ini sudah terdaftar.'], 409);
    }
    throw $e;
}
$id = (int)$pdo->lastInsertId();
$regNo = sprintf('PPDB-LB04-%s-%04d', date('Y'), $id);
$pdo->prepare('UPDATE ppdb_registrations SET registration_no = ? WHERE id = ?')->execute([$regNo, $id]);
$GLOBALS['keep_uploads'] = true; // data sudah tersimpan, berkas jangan dihapus

$q = $pdo->prepare('SELECT * FROM ppdb_registrations WHERE id = ?');
$q->execute([$id]);
respond(['registration' => row_to_reg($q->fetch())], 201);
