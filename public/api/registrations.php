<?php
// Khusus admin. GET = daftar | POST = tambah manual | PATCH = ubah status | DELETE = hapus
require __DIR__ . '/config.php';
require_admin();

$pdo = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $pdo->query('SELECT * FROM ppdb_registrations ORDER BY created_at DESC, id DESC')->fetchAll();
    respond(['registrations' => array_map('row_to_reg', $rows)]);
}

$b = body();

if ($method === 'POST') {
    foreach (['studentName', 'nik', 'parentName', 'parentPhone', 'path'] as $k) {
        if (trim((string)($b[$k] ?? '')) === '') respond(['error' => "Kolom \"$k\" wajib diisi."], 422);
    }
    $nik = trim((string)$b['nik']);
    if (!preg_match('/^\d{16}$/', $nik)) respond(['error' => 'NIK harus 16 digit angka.'], 422);
    $parentNik = trim((string)($b['parentNik'] ?? ''));
    if ($parentNik !== '' && !preg_match('/^\d{16}$/', $parentNik)) respond(['error' => 'NIK orang tua harus 16 digit angka.'], 422);
    $birthDate = trim((string)($b['birthDate'] ?? ''));
    if (!valid_date($birthDate)) respond(['error' => 'Tanggal lahir tidak valid.'], 422);
    $gender = (string)($b['gender'] ?? 'Laki-laki');
    if (!in_array($gender, ['Laki-laki', 'Perempuan'], true)) respond(['error' => 'Jenis kelamin tidak valid.'], 422);
    $path = (string)$b['path'];
    if (!in_array($path, ['Zonasi', 'Afirmasi', 'Prestasi', 'Pindah Tugas'], true)) respond(['error' => 'Jalur tidak valid.'], 422);

    $dup = $pdo->prepare('SELECT 1 FROM ppdb_registrations WHERE nik = ?');
    $dup->execute([$nik]);
    if ($dup->fetch()) respond(['error' => 'NIK sudah terdaftar.'], 409);

    try {
        $ins = $pdo->prepare(
            'INSERT INTO ppdb_registrations
             (registration_no, student_name, nik, birth_place, birth_date, gender, religion, address, rt, rw, kelurahan,
              previous_school, parent_name, parent_nik, parent_phone, parent_job, path, distance_km, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        );
        $ins->execute([
            'TMP' . bin2hex(random_bytes(8)), clip($b['studentName'], 120), $nik, clip($b['birthPlace'] ?? '', 80), $birthDate,
            $gender, clip($b['religion'] ?? 'Islam', 40), clip($b['address'] ?? '', 255), clip($b['rt'] ?? '', 5), clip($b['rw'] ?? '', 5),
            clip($b['kelurahan'] ?? 'Lubang Buaya', 80), clip($b['previousSchool'] ?? '', 120), clip($b['parentName'], 120), $parentNik,
            clip($b['parentPhone'], 20), clip($b['parentJob'] ?? '', 80), $path, (float)($b['distanceKm'] ?? 0),
            in_array($b['status'] ?? '', ['Menunggu Verifikasi', 'Diverifikasi', 'Diterima', 'Ditolak'], true) ? $b['status'] : 'Menunggu Verifikasi',
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') respond(['error' => 'NIK sudah terdaftar.'], 409);
        throw $e;
    }
    $id = (int)$pdo->lastInsertId();
    $pdo->prepare('UPDATE ppdb_registrations SET registration_no = ? WHERE id = ?')
        ->execute([sprintf('PPDB-LB04-%s-%04d', date('Y'), $id), $id]);
    $q = $pdo->prepare('SELECT * FROM ppdb_registrations WHERE id = ?');
    $q->execute([$id]);
    respond(['registration' => row_to_reg($q->fetch())], 201);
}

$id = (int)($b['id'] ?? $_GET['id'] ?? 0);
if ($id <= 0) respond(['error' => 'ID tidak valid.'], 422);

if ($method === 'PATCH') {
    $status = $b['status'] ?? '';
    if (!in_array($status, ['Menunggu Verifikasi', 'Diverifikasi', 'Diterima', 'Ditolak'], true)) {
        respond(['error' => 'Status tidak valid.'], 422);
    }
    $notes = isset($b['notes']) && trim((string)$b['notes']) !== '' ? clip($b['notes'], 500) : null;
    $pdo->prepare('UPDATE ppdb_registrations SET status = ?, verifier_notes = ?, verified_at = NOW() WHERE id = ?')
        ->execute([$status, $notes, $id]);
    $q = $pdo->prepare('SELECT * FROM ppdb_registrations WHERE id = ?');
    $q->execute([$id]);
    $row = $q->fetch();
    if (!$row) respond(['error' => 'Data tidak ditemukan.'], 404);
    respond(['registration' => row_to_reg($row)]);
}

if ($method === 'DELETE') {
    $q = $pdo->prepare('SELECT doc_kk, doc_akta, doc_foto FROM ppdb_registrations WHERE id = ?');
    $q->execute([$id]);
    if ($row = $q->fetch()) {
        foreach ($row as $f) {
            if ($f && is_file(UPLOAD_DIR . $f)) @unlink(UPLOAD_DIR . $f);
        }
    }
    $pdo->prepare('DELETE FROM ppdb_registrations WHERE id = ?')->execute([$id]);
    respond(['ok' => true]);
}

respond(['error' => 'Method tidak diizinkan.'], 405);
