-- ==========================================================
--  Database PPDB Online - SDN Lubang Buaya 04 Pagi
--  Cara pakai: phpMyAdmin -> tab "Import" -> pilih file ini -> Kirim
--  (database akan dibuat otomatis)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `sdn_lubang_buaya_04`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sdn_lubang_buaya_04`;

-- ---------- Tabel admin / panitia PPDB ----------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Login awal:  username = admin   |   password = Sdn04@2026   (segera ganti!)
INSERT INTO `admins` (`username`, `password_hash`, `full_name`) VALUES
('admin', '$2y$10$nkow6R8S8pL6a6V86kWlMub4wjWw0bOdoXM2IYPkyg2jwd4Ua/1Fu', 'Panitia PPDB SDN Lubang Buaya 04 Pagi')
ON DUPLICATE KEY UPDATE `username` = `username`;

-- ---------- Tabel pendaftaran PPDB ----------
CREATE TABLE IF NOT EXISTS `ppdb_registrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `registration_no` VARCHAR(30) NOT NULL,
  `student_name` VARCHAR(120) NOT NULL,
  `nik` CHAR(16) NOT NULL,
  `birth_place` VARCHAR(80) NOT NULL DEFAULT '',
  `birth_date` DATE NOT NULL,
  `gender` ENUM('Laki-laki','Perempuan') NOT NULL,
  `religion` VARCHAR(40) NOT NULL DEFAULT 'Islam',
  `address` VARCHAR(255) NOT NULL DEFAULT '',
  `rt` VARCHAR(5) NOT NULL DEFAULT '',
  `rw` VARCHAR(5) NOT NULL DEFAULT '',
  `kelurahan` VARCHAR(80) NOT NULL DEFAULT '',
  `previous_school` VARCHAR(120) NOT NULL DEFAULT '',
  `parent_name` VARCHAR(120) NOT NULL,
  `parent_nik` VARCHAR(16) NOT NULL DEFAULT '',
  `parent_phone` VARCHAR(20) NOT NULL,
  `parent_job` VARCHAR(80) NOT NULL DEFAULT '',
  `path` ENUM('Zonasi','Afirmasi','Prestasi','Pindah Tugas') NOT NULL,
  `distance_km` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `doc_kk` VARCHAR(100) DEFAULT NULL,
  `doc_akta` VARCHAR(100) DEFAULT NULL,
  `doc_foto` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('Menunggu Verifikasi','Diverifikasi','Diterima','Ditolak') NOT NULL DEFAULT 'Menunggu Verifikasi',
  `verifier_notes` VARCHAR(500) DEFAULT NULL,
  `verified_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reg_no` (`registration_no`),
  UNIQUE KEY `uq_nik` (`nik`),
  KEY `idx_status` (`status`),
  KEY `idx_path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Tabel pesan kontak (juga dibuat otomatis oleh api/messages.php) ----------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL DEFAULT '',
  `phone` VARCHAR(30) NOT NULL DEFAULT '',
  `subject` VARCHAR(150) NOT NULL DEFAULT '',
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
