<?php
// POST {action:"login",username,password} | {action:"logout"} | {action:"change_password",currentPassword,newPassword} | GET => cek sesi
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    respond(['loggedIn' => !empty($_SESSION['admin_id']), 'name' => $_SESSION['admin_name'] ?? null]);
}

$b = body();
if (($b['action'] ?? '') === 'logout') {
    $_SESSION = [];
    session_destroy();
    respond(['ok' => true]);
}

if (($b['action'] ?? '') === 'change_password') {
    require_admin();
    $current = (string)($b['currentPassword'] ?? '');
    $new = (string)($b['newPassword'] ?? '');
    if ($current === '' || $new === '') respond(['error' => 'Isi kata sandi lama dan kata sandi baru.'], 422);
    if (strlen($new) < 8) respond(['error' => 'Kata sandi baru minimal 8 karakter.'], 422);
    if (strlen($new) > 72) respond(['error' => 'Kata sandi baru maksimal 72 karakter.'], 422);
    if ($new === $current) respond(['error' => 'Kata sandi baru harus berbeda dari yang lama.'], 422);

    $stmt = db()->prepare('SELECT password_hash FROM admins WHERE id = ?');
    $stmt->execute([(int)$_SESSION['admin_id']]);
    $hash = $stmt->fetchColumn();
    if (!$hash || !password_verify($current, $hash)) {
        usleep(400000);
        respond(['error' => 'Kata sandi lama salah.'], 403);
    }
    db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
        ->execute([password_hash($new, PASSWORD_DEFAULT), (int)$_SESSION['admin_id']]);
    session_regenerate_id(true);
    respond(['ok' => true]);
}

$user = trim((string)($b['username'] ?? ''));
$pass = (string)($b['password'] ?? '');
if ($user === '' || $pass === '') respond(['error' => 'Silakan isi username dan password.'], 422);

$stmt = db()->prepare('SELECT id, full_name, password_hash FROM admins WHERE username = ?');
$stmt->execute([$user]);
$admin = $stmt->fetch();
if (!$admin || !password_verify($pass, $admin['password_hash'])) {
    usleep(400000); // perlambat tebakan password
    respond(['error' => 'Username atau kata sandi salah.'], 401);
}
session_regenerate_id(true);
$_SESSION['admin_id'] = (int)$admin['id'];
$_SESSION['admin_name'] = $admin['full_name'];
respond(['loggedIn' => true, 'name' => $admin['full_name']]);
