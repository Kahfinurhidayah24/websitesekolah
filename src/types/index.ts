export type RegistrationStatus = 'Menunggu Verifikasi' | 'Diverifikasi' | 'Diterima' | 'Ditolak';

export type RegistrationPath = 'Zonasi' | 'Afirmasi' | 'Prestasi' | 'Pindah Tugas';

export interface PPDBRegistration {
  id: string;
  registrationNo: string;
  studentName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  religion: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  previousSchool: string;
  parentName: string;
  parentNik: string;
  parentPhone: string;
  parentJob: string;
  path: RegistrationPath;
  distanceKm: number;
  documents: {
    kk: string;
    akta: string;
    foto: string;
  };
  status: RegistrationStatus;
  createdAt: string;
  verifiedAt?: string;
  verifierNotes?: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip?: string;
  role: string;
  subject: string;
  education: string;
  photo: string;
  quote?: string;
}

export interface Facility {
  id: string;
  title: string;
  desc: string;
  category: 'Akademik' | 'Olahraga' | 'Ibadah' | 'Kesehatan' | 'Lingkungan';
  icon: string;
  image: string;
  specs: string[];
}

export interface Extracurricular {
  id: string;
  name: string;
  day: string;
  time: string;
  desc: string;
  coach: string;
  icon: string;
  badge: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Prestasi' | 'Akademik' | 'Kegiatan' | 'Pengumuman';
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Kegiatan' | 'Prestasi' | 'Fasilitas' | 'Seni Budaya';
  date: string;
  image: string;
  caption: string;
}

export interface SchoolStat {
  label: string;
  value: number;
  suffix: string;
  subtext: string;
  iconName: string;
}

/* ---------- Konten tambahan yang dikelola dari Panel Admin ---------- */
export interface HeroContent {
  image: string;
  ctaText: string;
  ctaUrl: string;
  minHeight: number;
}

export interface AcademicProgram {
  id: string;
  title: string;
  level: string;
  desc: string;
  highlights: string[];
}

export interface Achievement {
  id: string;
  title: string;
  level: 'Sekolah' | 'Kecamatan' | 'Kota' | 'Provinsi' | 'Nasional' | 'Internasional';
  date: string;
  student: string;
  desc: string;
  image: string;
}

export interface PPDBSettings {
  isOpen: boolean;
  academicYear: string;
  /** Format YYYY-MM-DD; kosong = tanpa batas. */
  startDate: string;
  endDate: string;
  quota: number;
  closedMessage: string;
}

export interface PPDBScheduleItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  desc: string;
}

export interface PPDBAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
