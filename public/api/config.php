<?php
/**
 * Konfigurasi koneksi database (phpMyAdmin / MySQL / MariaDB).
 * Default XAMPP: user "root", password kosong.
 * Sesuaikan jika hosting Anda berbeda.
 */
const DB_HOST = 'localhost';
const DB_NAME = 'sdn_lubang_buaya_04';
const DB_USER = 'root';
const DB_PASS = '';

const UPLOAD_DIR = __DIR__ . '/uploads/';
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3 MB per berkas

// Jangan pernah menampilkan error PHP (HTML) ke browser; selalu balas JSON.
ini_set('display_errors', '0');
error_reporting(E_ALL);
set_exception_handler(function (Throwable $e) {
    error_log('[SDN04] ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
    http_response_code(500);
    echo json_encode(['error' => 'Terjadi kesalahan pada server. Silakan coba lagi.'], JSON_UNESCAPED_UNICODE);
});

session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            error_log('[SDN04] DB: ' . $e->getMessage());
            $code = (int)$e->getCode();
            if ($code === 1049) {
                $msg = 'Database "' . DB_NAME . '" belum ada. Import database.sql lewat phpMyAdmin.';
            } elseif ($code === 1045) {
                $msg = 'Username/password MySQL salah. Sesuaikan DB_USER dan DB_PASS di api/config.php.';
            } else {
                $msg = 'Tidak bisa terhubung ke MySQL. Pastikan MySQL di XAMPP sudah Start.';
            }
            respond(['error' => $msg], 500);
        }
    }
    return $pdo;
}

/** Potong teks sesuai panjang kolom database (aman untuk UTF-8). */
function clip(?string $s, int $max): string {
    $s = trim((string)$s);
    return function_exists('mb_substr') ? mb_substr($s, 0, $max) : substr($s, 0, $max);
}

function valid_date(string $d): bool {
    $x = DateTime::createFromFormat('Y-m-d', $d);
    return $x !== false && $x->format('Y-m-d') === $d;
}

/** Berkas yang sudah tersimpan di request ini; dihapus lagi jika pendaftaran gagal disimpan ke database. */
$GLOBALS['uploaded_files'] = [];
$GLOBALS['keep_uploads'] = false;
register_shutdown_function(function () {
    if (!$GLOBALS['keep_uploads']) {
        foreach ($GLOBALS['uploaded_files'] as $f) {
            if (is_file($f)) @unlink($f);
        }
    }
});

function respond(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function body(): array {
    $raw = file_get_contents('php://input');
    $json = json_decode($raw ?: '', true);
    return is_array($json) ? $json : [];
}

function require_admin(): void {
    if (empty($_SESSION['admin_id'])) {
        respond(['error' => 'Sesi admin tidak valid. Silakan login kembali.'], 401);
    }
}

/** Ubah baris DB menjadi format yang dipakai front-end (camelCase). */
function row_to_reg(array $r): array {
    $file = fn($v) => $v ? 'api/uploads/' . $v : '';
    return [
        'id' => (string)$r['id'],
        'registrationNo' => $r['registration_no'],
        'studentName' => $r['student_name'],
        'nik' => $r['nik'],
        'birthPlace' => $r['birth_place'],
        'birthDate' => $r['birth_date'],
        'gender' => $r['gender'],
        'religion' => $r['religion'],
        'address' => $r['address'],
        'rt' => $r['rt'],
        'rw' => $r['rw'],
        'kelurahan' => $r['kelurahan'],
        'previousSchool' => $r['previous_school'],
        'parentName' => $r['parent_name'],
        'parentNik' => $r['parent_nik'],
        'parentPhone' => $r['parent_phone'],
        'parentJob' => $r['parent_job'],
        'path' => $r['path'],
        'distanceKm' => (float)$r['distance_km'],
        'documents' => [
            'kk' => $file($r['doc_kk']),
            'akta' => $file($r['doc_akta']),
            'foto' => $file($r['doc_foto']),
        ],
        'status' => $r['status'],
        'createdAt' => $r['created_at'],
        'verifiedAt' => $r['verified_at'],
        'verifierNotes' => $r['verifier_notes'],
    ];
}

/** Simpan satu berkas upload; kembalikan nama file atau null. */
function save_upload(string $field): ?string {
    if (empty($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    $f = $_FILES[$field];
    if ($f['error'] !== UPLOAD_ERR_OK || $f['size'] > MAX_UPLOAD_BYTES) {
        respond(['error' => 'Berkas ' . strtoupper($field) . ' gagal diunggah atau lebih dari 3 MB.'], 422);
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'application/pdf' => 'pdf'];
    if (!isset($allowed[$mime])) {
        respond(['error' => 'Format berkas ' . strtoupper($field) . ' harus JPG, PNG, WEBP, atau PDF.'], 422);
    }
    $name = $field . '_' . bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($f['tmp_name'], UPLOAD_DIR . $name)) {
        respond(['error' => 'Tidak bisa menyimpan berkas. Cek izin folder api/uploads.'], 500);
    }
    $GLOBALS['uploaded_files'][] = UPLOAD_DIR . $name;
    return $name;
}

date_default_timezone_set('Asia/Jakarta');

/** Pastikan tabel konten situs ada (dipakai content.php dan pengecekan status PPDB). */
function ensure_site_content_table(): void {
    db()->exec('CREATE TABLE IF NOT EXISTS `site_content` (
      `content_key` VARCHAR(50) NOT NULL,
      `content_json` LONGTEXT NOT NULL,
      `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`content_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
}

/** Ambil satu bagian konten (JSON) dari site_content; null jika belum pernah disimpan. */
function get_site_content(string $key) {
    ensure_site_content_table();
    $stmt = db()->prepare('SELECT content_json FROM site_content WHERE content_key = ?');
    $stmt->execute([$key]);
    $raw = $stmt->fetchColumn();
    return $raw === false ? null : json_decode($raw, true);
}

/**
 * Status pendaftaran PPDB menurut Pengaturan PPDB di panel admin.
 * Terbuka bila saklar "Buka" aktif DAN hari ini (WIB) berada di antara tanggal buka & tutup (jika diisi).
 * Mengembalikan [bool terbuka, string pesan].
 */
function ppdb_open_state(): array {
    $s = get_site_content('ppdbSettings');
    if (!is_array($s)) return [true, ''];           // belum pernah diatur => dianggap buka
    $today = date('Y-m-d');
    $start = (string)($s['startDate'] ?? '');
    $end = (string)($s['endDate'] ?? '');
    if (array_key_exists('isOpen', $s) && !$s['isOpen']) {
        $msg = trim((string)($s['closedMessage'] ?? ''));
        return [false, $msg !== '' ? $msg : 'Pendaftaran PPDB sedang ditutup.'];
    }
    if ($start !== '' && $today < $start) return [false, 'Pendaftaran PPDB belum dibuka. Dibuka mulai ' . $start . '.'];
    if ($end !== '' && $today > $end) return [false, 'Pendaftaran PPDB sudah ditutup sejak ' . $end . '.'];
    return [true, ''];
}
