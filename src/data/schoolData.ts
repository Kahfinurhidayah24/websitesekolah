import { PPDBRegistration, Teacher, Facility, Extracurricular, NewsItem, GalleryItem, SchoolStat } from '../types';

export const SCHOOL_INFO = {
  name: 'SDN Lubang Buaya 04 Pagi',
  shortName: 'SDN LB 04',
  tagline: 'Mewujudkan Generasi Cerdas, Berakhlak Mulia & Berprestasi',
  npsn: '20104185',
  accreditation: 'A (Unggul)',
  skAccreditation: '1347/BAN-SM/SK/2021',
  headmaster: 'Dwi Febrina Ihsanti, M.Pd.',
  address: 'Jl. Monumen Pancasila Sakti No.12, RT.1/RW.2, Lubang Buaya, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13810',
  phone: '(021) 840-2819',
  whatsapp: '+62 812-9840-0404',
  email: 'sdnlubangbuaya04pagi@gmail.com',
  website: 'https://sdnlubangbuaya04pagi.sch.id',
  operatingHours: 'Senin - Jumat: 06.30 - 15.00 WIB',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8123456789!2d106.9012345!3d-6.2891234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f31a23456789%3A0x123456789abcdef!2sSDN%20Lubang%20Buaya%2004%20Pagi!5e0!3m2!1sid!2sid!4v1700000000000',
  socials: {
    instagram: '@sdnlubangbuaya04pagi',
    youtube: 'SDN Lubang Buaya 04 Pagi Official',
    facebook: 'SD Negeri Lubang Buaya 04 Pagi',
  }
};

export const SCHOOL_STATS: SchoolStat[] = [
  { label: 'Peserta Didik Aktif', value: 486, suffix: '+', subtext: 'Tahun Ajaran 2025/2026', iconName: 'Users' },
  { label: 'Tenaga Pendidik & Staf', value: 26, suffix: ' Guru', subtext: '100% Tersertifikasi & S1/S2', iconName: 'GraduationCap' },
  { label: 'Ruang Kelas Nyaman', value: 16, suffix: ' Rombel', subtext: 'Dilengkapi Proyektor & AC', iconName: 'School' },
  { label: 'Prestasi Juara Tingkat', value: 34, suffix: '+', subtext: 'Kota, Provinsi & Nasional', iconName: 'Trophy' },
];

export const VISION_MISSION = {
  vision: 'Terwujudnya peserta didik yang beriman dan bertakwa kepada Tuhan Yang Maha Esa, berkarakter luhur, berprestasi unggul dalam ilmu pengetahuan dan teknologi, mandiri, serta peduli lingkungan hidup berlandaskan Profil Pelajar Pancasila.',
  missions: [
    'Menumbuhkembangkan keimanan, ketaqwaan, dan budi pekerti luhur melalui pembiasaan ibadah rutin, senyum sapa salam, dan literasi keagamaan.',
    'Menyelenggarakan pembelajaran Kurikulum Merdeka yang inovatif, berdiferensiasi, ramah anak, dan berbasis teknologi informasi modern.',
    'Mengembangkan minat, bakat, dan potensi kepemimpinan peserta didik melalui program ekstrakurikuler serta kompetisi akademik dan non-akademik.',
    'Mewujudkan lingkungan sekolah yang asri, bersih, aman, sehat, dan berbudaya lingkungan (Sekolah Adiwiyata Ramah Anak).',
    'Menjalin kemitraan kolaboratif yang harmonis dengan orang tua siswa, komite sekolah, masyarakat, dan instansi pendidikan terkait.'
  ],
  coreValues: [
    { title: 'Beriman & Berakhlak', desc: 'Pembiasaan sholat dhuha, tadarus, dan nilai toleransi kebinekaan sejak dini.' },
    { title: 'Bernalar Kritis & Kreatif', desc: 'Metode pembelajaran berbasis proyek (P5) dan eksplorasi sains interaktif.' },
    { title: 'Gotong Royong & Mandiri', desc: 'Membangun kepekaan sosial, kejujuran, dan kemandirian belajar.' },
    { title: 'Peduli Lingkungan (Adiwiyata)', desc: 'Pengurangan sampah plastik, hidroponik sekolah, dan pilah sampah mandiri.' }
  ]
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    name: 'Dwi Febrina Ihsanti, M.Pd.',
    nip: '',
    role: 'Kepala Sekolah',
    subject: 'Pimpinan Sekolah',
    education: 'Magister Pendidikan (M.Pd.)',
    photo: '',
    quote: 'Mendidik anak dengan hati dan teladan untuk melahirkan tunas bangsa yang berakhlak mulia.'
  },
  {
    id: 't-2',
    name: 'Ahmad Fauzi, S.Pd., Gr.',
    nip: '19840215 200801 1 009',
    role: 'Wakil Bidang Kurikulum & Guru Kelas VI',
    subject: 'Tematik & Koordinator Kurikulum Merdeka',
    education: 'S1 PGSD - Universitas Terbuka Jakarta',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    quote: 'Setiap anak memiliki potensi unik. Tugas kita adalah menyalakan lentera kecerdasan mereka.'
  },
  {
    id: 't-3',
    name: 'Rina Kusuma Dewi, S.Pd.',
    nip: '19890924 201402 2 003',
    role: 'Guru Kelas I & Koordinator Transisi PAUD-SD',
    subject: 'Tematik Kelas Awal & Literasi Membaca',
    education: 'S1 PGSD - Universitas Negeri Jakarta',
    photo: 'https://images.unsplash.com/photo-1580894732483-81b372688001?auto=format&fit=crop&q=80&w=600',
    quote: 'Menciptakan suasana kelas yang ceria dan penuh kasih sayang agar anak senang ke sekolah.'
  },
  {
    id: 't-4',
    name: 'Bambang Sugeng, S.Pd.I.',
    nip: '19790410 200501 1 012',
    role: 'Guru Pendidikan Agama Islam & Budi Pekerti',
    subject: 'PAI & Koordinator Pembiasaan Religi',
    education: 'S1 Tarbiyah - UIN Syarif Hidayatullah Jakarta',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    quote: 'Pondasi akhlak dan adab adalah bekal kehidupan terpenting bagi generasi penerus.'
  },
  {
    id: 't-5',
    name: 'Dewi Anggraeni, S.Kom., Gr.',
    nip: '19921108 201903 2 018',
    role: 'Guru Informatika / TIK & Admin Operator Sekolah',
    subject: 'TIK, Robotika Cilik & Operator Dapodik',
    education: 'S1 Ilmu Komputer - Universitas Bina Nusantara',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    quote: 'Literasi digital yang bertanggung jawab mempersiapkan generasi emas menghadapi era modern.'
  },
  {
    id: 't-6',
    name: 'Yogi Prasetyo, S.Pd.',
    nip: '19950314 202012 1 007',
    role: 'Guru PJOK & Pembina Pramuka',
    subject: 'Pendidikan Jasmani, Olahraga & Kesehatan',
    education: 'S1 Ilmu Keolahragaan - FIK UNJ',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    quote: 'Di dalam tubuh yang sehat dan bugar, terdapat jiwa pantang menyerah dan sportif.'
  }
];

export const FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    title: 'Laboratorium Komputer & TIK Terpadu',
    desc: 'Ruang lab dengan 32 unit komputer all-in-one, jaringan fiber optic kecepatan tinggi, proyektor interaktif, dan berpendingin ruangan.',
    category: 'Akademik',
    icon: 'Monitor',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    specs: ['32 Unit PC All-in-One', 'AC & Audio Visual Interaktif', 'Jaringan Fiber Optic 100 Mbps', 'Digunakan untuk ANBK & Literasi Digital']
  },
  {
    id: 'fac-2',
    title: 'Perpustakaan Ramah Anak "Pustaka Cendekia"',
    desc: 'Ruang baca berkarpet nyaman dengan ribuan koleksi buku fiksi, ensiklopedia sains anak, pojok dongeng, dan sudut e-library.',
    category: 'Akademik',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    specs: ['3.500+ Judul Buku Terverifikasi', 'Pojok Baca Lesehan Ber-AC', 'Katalog Digital Online', 'Ruang Story Telling']
  },
  {
    id: 'fac-3',
    title: 'Lapangan Olahraga Multifungsi',
    desc: 'Lapangan terbuka dengan lantai sintetis berkualitas untuk upacara bendera, senam bersama, futsal, bulu tangkis, dan bola voli.',
    category: 'Olahraga',
    icon: 'Trophy',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&q=80&w=800',
    specs: ['Standar Luas Aman Siswa SD', 'Pagar Pengaman Bersih', 'Ring Basket & Gawang Mini Futsal', 'Tribun Penonton Teduh']
  },
  {
    id: 'fac-4',
    title: 'Ruang UKS Terstandar Nasional',
    desc: 'Fasilitas kesehatan lengkap dengan ranjang periksa, obat-obatan P3K, alat ukur tinggi/berat badan digital, dan pembinaan Dokter Kecil.',
    category: 'Kesehatan',
    icon: 'HeartPulse',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    specs: ['Kerja Sama Puskesmas Cipayung', '4 Ranjang Istirahat Nyaman', 'Ruang Isolasi Ringan', 'Pemeriksaan Berkala Dokter Gigi']
  },
  {
    id: 'fac-5',
    title: 'Musholla Al-Hikmah Sekolah',
    desc: 'Tempat ibadah yang bersih, wudhu terpisah putra-putri, digunakan untuk sholat dhuha berjamaah dan praktik manasik haji.',
    category: 'Ibadah',
    icon: 'Sun',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    specs: ['Kapasitas 180 Jamaah', 'Area Wudhu Bersih & Higienis', 'Sound System Masjid Berkualitas', 'Program Tahfidz Juz 30']
  },
  {
    id: 'fac-6',
    title: 'Greenhouse & Taman Hidroponik Adiwiyata',
    desc: 'Area edukasi pelestarian lingkungan bagi siswa untuk bercocok tanam sayuran organik, pengomposan, dan budidaya tanaman obat keluarga (TOGA).',
    category: 'Lingkungan',
    icon: 'Sprout',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
    specs: ['Instalasi Hidroponik Vertikal', 'Kebun Tanaman Obat Keluarga', 'Sentra Kompos Organik Daun', 'Mitra Gerakan Peduli Lingkungan Hidup']
  }
];

export const EXTRACURRICULARS: Extracurricular[] = [
  {
    id: 'extra-1',
    name: 'Pramuka Siaga & Penggalang (Wajib)',
    day: 'Jumat',
    time: '13.30 - 15.00 WIB',
    desc: 'Membentuk watak tangguh, disiplin, keterampilan kepanduan, sandi morse, pioneering, dan kemandirian berkemah.',
    coach: 'Kak Yogi Prasetyo & Kak Rina',
    icon: 'Compass',
    badge: 'Gudep 04.185'
  },
  {
    id: 'extra-2',
    name: 'Seni Tari Tradisional Betawi & Nusantara',
    day: 'Rabu',
    time: '14.00 - 15.30 WIB',
    desc: 'Melestarikan warisan budaya Indonesia melalui gerak tari Sirih Kuning, Ondel-ondel, dan Tari Saman.',
    coach: 'Ibu Nurlaila, S.Sn.',
    icon: 'Sparkles',
    badge: 'Juara 1 Tingkat Kecamatan'
  },
  {
    id: 'extra-3',
    name: 'Futsal & Atletik Junior',
    day: 'Selasa & Kamis',
    time: '15.30 - 17.00 WIB',
    desc: 'Pelatihan teknik dasar menggiring, mengoper bola, kekompakan tim olahraga, dan kebugaran jasmani anak.',
    coach: 'Coach Doni Irawan',
    icon: 'Activity',
    badge: 'Turnamen O2SN'
  },
  {
    id: 'extra-4',
    name: 'Dokter Kecil & PMR Mula',
    day: 'Sabtu',
    time: '08.00 - 09.30 WIB',
    desc: 'Membekali siswa dengan pemahaman hidup sehat, pertolongan pertama kecelakaan ringan, dan sanitasi sekolah.',
    coach: 'drg. Tri Wahyuni (Puskesmas Cipayung)',
    icon: 'ShieldAlert',
    badge: 'Duta UKS Kota'
  },
  {
    id: 'extra-5',
    name: 'Seni Marawis & Hadroh Religi',
    day: 'Senin',
    time: '14.00 - 15.30 WIB',
    desc: 'Pengembangan seni musik Islami, pukulan rebana, hafalan sholawat dan penampilan peringatan hari besar Islam.',
    coach: 'Ustadz Bambang Sugeng, S.Pd.I.',
    icon: 'Music',
    badge: 'Festival Muharram'
  },
  {
    id: 'extra-6',
    name: 'Klub Sains & Robotika Dasar',
    day: 'Kamis',
    time: '14.00 - 15.30 WIB',
    desc: 'Eksperimen sains sederhana, pemahaman coding blok visual (Scratch Jr), dan logika logika kreatif anak.',
    coach: 'Dewi Anggraeni, S.Kom.',
    icon: 'Cpu',
    badge: 'Olimpiade Sains (OSN)'
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Siswa SDN Lubang Buaya 04 Pagi Raih Medali Perak OSN IPA Tingkat Jakarta Timur',
    category: 'Prestasi',
    date: '28 September 2025',
    readTime: '3 Menit',
    excerpt: 'Ananda Muhammad Rizky Pratama kelas V membanggakan sekolah dengan meraih medali perak pada Olimpiade Sains Nasional (OSN) Tingkat Jakarta Timur.',
    content: 'Prestasi gemilang kembali ditorehkan oleh siswa berbakat SDN Lubang Buaya 04 Pagi. Ananda Muhammad Rizky Pratama dari kelas V-A berhasil mempersembahkan Medali Perak dalam ajang bergengsi Olimpiade Sains Nasional (OSN) Bidang Ilmu Pengetahuan Alam tingkat Suku Dinas Pendidikan Wilayah II Jakarta Timur.\n\nKepala Sekolah, Dwi Febrina Ihsanti, M.Pd., menyampaikan apresiasi setinggi-tingginya kepada para guru pembimbing dan orang tua yang tak kenal lelah mendampingi. "Kemenangan ini adalah buah kerja keras, disiplin, dan rasa ingin tahu yang tinggi. Semoga memicu semangat seluruh siswa untuk terus berprestasi," ungkap beliau.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    author: 'Tim Humas SDN LB 04'
  },
  {
    id: 'news-2',
    title: 'Gelar Karya Proyek Penguatan Profil Pelajar Pancasila (P5) Bertema Gaya Hidup Berkelanjutan',
    category: 'Kegiatan',
    date: '15 September 2025',
    readTime: '4 Menit',
    excerpt: 'Ratusan siswa memamerkan kerajinan daur ulang plastik, tanaman hidroponik, dan pertunjukan seni dalam panggung Gelar Karya P5 yang meriah.',
    content: 'Suasana lapangan SDN Lubang Buaya 04 Pagi tampak semarak pada Kamis pagi dalam rangka Gelar Karya P5 Kurikulum Merdeka. Bertajuk "Bumiku Rumahku: Gaya Hidup Berkelanjutan", para siswa dari kelas I hingga VI bergotong-royong menampilkan kreasi inovatif hasil daur ulang limbah rumah tangga.\n\nSelain pameran produk, acara diisi dengan bazar makanan tradisional sehat olahan orang tua siswa komite dan pementasan drama musikal lingkungan oleh siswa kelas IV.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    author: 'Ahmad Fauzi, S.Pd.'
  },
  {
    id: 'news-3',
    title: 'Informasi Resmi & Jadwal Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027',
    category: 'Pengumuman',
    date: '02 Oktober 2025',
    readTime: '5 Menit',
    excerpt: 'Simak alur resmi, persyaratan berkas, dan tahapan verifikasi PPDB Online SDN Lubang Buaya 04 Pagi untuk jalur Zonasi, Afirmasi, dan Prestasi.',
    content: 'Pendaftaran Peserta Didik Baru (PPDB) SDN Lubang Buaya 04 Pagi Tahun Ajaran 2026/2027 telah resmi dibuka. Seluruh proses pendaftaran dilakukan secara transparan dan terintegrasi melalui portal resmi ini.\n\nJalur yang dibuka meliputi:\n1. Jalur Zonasi Domisili (prioritas RT/RW sekitar sekolah di Kelurahan Lubang Buaya)\n2. Jalur Afirmasi (KJP Plus/PIP/Disabilitas)\n3. Jalur Prestasi Akademik dan Non-Akademik\n4. Jalur Pindah Tugas Orang Tua.\n\nOrang tua diimbau menyiapkan berkas digital seperti Kartu Keluarga, Akta Kelahiran, dan Pas Foto ukuran 3x4 sebelum mengisi formulir online.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    author: 'Panitia PPDB 2026'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Upacara Bendera Hari Senin & Penghargaan Siswa Berprestasi',
    category: 'Kegiatan',
    date: 'Oktober 2025',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    caption: 'Pembiasaan upacara bendera melatih kedisiplinan dan rasa cinta tanah air pada setiap siswa.'
  },
  {
    id: 'gal-2',
    title: 'Praktik Pembelajaran Sains Interaktif di Laboratorium',
    category: 'Fasilitas',
    date: 'September 2025',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    caption: 'Siswa antusias belajar mengenal mikroskop dan struktur tumbuhan bersama guru IPA.'
  },
  {
    id: 'gal-3',
    title: 'Pertunjukan Tari Sirih Kuning pada Festival Seni Budaya',
    category: 'Seni Budaya',
    date: 'Agustus 2025',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    caption: 'Penampilan memukau anggota ekstrakurikuler seni tari dalam balutan busana adat Betawi.'
  },
  {
    id: 'gal-4',
    title: 'Penyerahan Piala Juara Umum Futsal Antar SD Cipayung',
    category: 'Prestasi',
    date: 'Juli 2025',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    caption: 'Tim Futsal Junior SDN LB 04 berhasil merebut Juara 1 dalam turnamen tahunan se-Kecamatan.'
  },
  {
    id: 'gal-5',
    title: 'Kegiatan Panen Sayur Hidroponik Program Adiwiyata',
    category: 'Kegiatan',
    date: 'September 2025',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800',
    caption: 'Siswa kelas IV belajar memanen pakcoy dan selada segar hasil budidaya kebun sekolah.'
  },
  {
    id: 'gal-6',
    title: 'Pojok Baca Literasi Pustaka Cendekia',
    category: 'Fasilitas',
    date: 'Oktober 2025',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    caption: 'Membiasakan membaca 15 menit setiap pagi sebelum jam pelajaran dimulai.'
  }
];

export const INITIAL_REGISTRATIONS: PPDBRegistration[] = [
  {
    id: 'reg-001',
    registrationNo: 'PPDB-LB04-2026-001',
    studentName: 'Muhammad Arkan Pratama',
    nik: '3175061205180001',
    birthPlace: 'Jakarta',
    birthDate: '2018-05-12',
    gender: 'Laki-laki',
    religion: 'Islam',
    address: 'Jl. Rawa Binong RT 03/RW 04',
    rt: '03',
    rw: '04',
    kelurahan: 'Lubang Buaya',
    previousSchool: 'TK Islam Al-Ikhlas',
    parentName: 'Hendri Gunawan',
    parentNik: '3175062408840003',
    parentPhone: '081287654321',
    parentJob: 'Karyawan Swasta',
    path: 'Zonasi',
    distanceKm: 0.35,
    documents: {
      kk: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
      akta: 'https://images.unsplash.com/photo-1554415707-9e49fe83083f?auto=format&fit=crop&q=80&w=400',
      foto: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=400',
    },
    status: 'Diterima',
    createdAt: '2025-10-02 08:30:15',
    verifiedAt: '2025-10-02 11:20:00',
    verifierNotes: 'Berkas lengkap dan sesuai domisili RT ring 1 sekolah.'
  },
  {
    id: 'reg-002',
    registrationNo: 'PPDB-LB04-2026-002',
    studentName: 'Aisyah Putri Azzahra',
    nik: '3175065409180002',
    birthPlace: 'Jakarta',
    birthDate: '2018-09-14',
    gender: 'Perempuan',
    religion: 'Islam',
    address: 'Jl. Al-Baidho II No. 18 RT 05/RW 06',
    rt: '05',
    rw: '06',
    kelurahan: 'Lubang Buaya',
    previousSchool: 'PAUD Melati Indah',
    parentName: 'Siti Rohani',
    parentNik: '3175066010860002',
    parentPhone: '085712345678',
    parentJob: 'Wiraswasta',
    path: 'Afirmasi',
    distanceKm: 0.42,
    documents: {
      kk: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
      akta: 'https://images.unsplash.com/photo-1554415707-9e49fe83083f?auto=format&fit=crop&q=80&w=400',
      foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    },
    status: 'Diverifikasi',
    createdAt: '2025-10-03 09:15:20',
    verifiedAt: '2025-10-03 14:00:10',
    verifierNotes: 'Dokumen KJP Plus telah divalidasi dinas.'
  },
  {
    id: 'reg-003',
    registrationNo: 'PPDB-LB04-2026-003',
    studentName: 'Kevin Nathaniel Siregar',
    nik: '3175061907180005',
    birthPlace: 'Medan',
    birthDate: '2018-07-19',
    gender: 'Laki-laki',
    religion: 'Kristen Protestan',
    address: 'Komplek Griya Cipayung Asri Blok C3',
    rt: '02',
    rw: '08',
    kelurahan: 'Lubang Buaya',
    previousSchool: 'TK Bintang Timur',
    parentName: 'Robert Siregar',
    parentNik: '1271011403820004',
    parentPhone: '081399887766',
    parentJob: 'PNS / ASN',
    path: 'Prestasi',
    distanceKm: 0.85,
    documents: {
      kk: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
      akta: 'https://images.unsplash.com/photo-1554415707-9e49fe83083f?auto=format&fit=crop&q=80&w=400',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
    status: 'Menunggu Verifikasi',
    createdAt: '2025-10-05 10:45:00',
  },
  {
    id: 'reg-004',
    registrationNo: 'PPDB-LB04-2026-004',
    studentName: 'Zaskia Nur Fadhilah',
    nik: '3175066112180007',
    birthPlace: 'Jakarta',
    birthDate: '2018-12-21',
    gender: 'Perempuan',
    religion: 'Islam',
    address: 'Jl. Kramat RT 01/RW 03',
    rt: '01',
    rw: '03',
    kelurahan: 'Lubang Buaya',
    previousSchool: 'TK Aisyiyah Bustanul Athfal',
    parentName: 'Fajar Hidayat',
    parentNik: '3175061502800008',
    parentPhone: '087811223344',
    parentJob: 'Pegawai BUMN',
    path: 'Zonasi',
    distanceKm: 0.6,
    documents: {
      kk: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
      akta: 'https://images.unsplash.com/photo-1554415707-9e49fe83083f?auto=format&fit=crop&q=80&w=400',
      foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    },
    status: 'Diterima',
    createdAt: '2025-10-06 14:10:30',
    verifiedAt: '2025-10-06 16:30:00',
    verifierNotes: 'Memenuhi syarat umur dan zonasi primer.'
  }
];
