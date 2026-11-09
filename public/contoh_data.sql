-- OPSIONAL: data contoh agar dashboard admin tidak kosong saat uji coba.
-- Import setelah database.sql. Hapus lewat dashboard / phpMyAdmin sebelum dipakai sungguhan.
USE `sdn_lubang_buaya_04`;
INSERT INTO `ppdb_registrations`
(`registration_no`,`student_name`,`nik`,`birth_place`,`birth_date`,`gender`,`religion`,`address`,`rt`,`rw`,`kelurahan`,`previous_school`,`parent_name`,`parent_nik`,`parent_phone`,`parent_job`,`path`,`distance_km`,`status`,`verifier_notes`,`verified_at`,`created_at`) VALUES
('PPDB-LB04-2026-9001','Muhammad Arkan Pratama','3175061205180001','Jakarta','2018-05-12','Laki-laki','Islam','Jl. Rawa Binong RT 03/RW 04','03','04','Lubang Buaya','TK Islam Al-Ikhlas','Hendri Gunawan','3175062408840003','081287654321','Karyawan Swasta','Zonasi',0.35,'Diterima','Berkas lengkap dan sesuai domisili.',NOW(),NOW()),
('PPDB-LB04-2026-9002','Aisyah Putri Azzahra','3175065409180002','Jakarta','2018-09-14','Perempuan','Islam','Jl. Al-Baidho II No. 18 RT 05/RW 06','05','06','Lubang Buaya','PAUD Melati Indah','Siti Rohani','3175066010860002','085712345678','Wiraswasta','Afirmasi',0.42,'Diverifikasi','Dokumen KJP Plus telah divalidasi.',NOW(),NOW()),
('PPDB-LB04-2026-9003','Kevin Nathaniel Siregar','3175061907180005','Medan','2018-07-19','Laki-laki','Kristen Protestan','Komplek Griya Cipayung Asri Blok C3','02','08','Lubang Buaya','TK Bintang Timur','Robert Siregar','1271011403820004','081399887766','PNS / ASN','Prestasi',0.85,'Menunggu Verifikasi',NULL,NULL,NOW());
