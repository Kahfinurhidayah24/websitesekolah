import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api';
import { FACILITIES, GALLERY_ITEMS, NEWS_ITEMS, INITIAL_TEACHERS, EXTRACURRICULARS, SCHOOL_INFO } from '../data/schoolData';
import {
  Achievement,
  AcademicProgram,
  Extracurricular,
  Facility,
  GalleryItem,
  HeroContent,
  NewsItem,
  PPDBAnnouncement,
  PPDBScheduleItem,
  PPDBSettings,
  Teacher,
} from '../types';

export interface PrincipalContent {
  photo: string;
}
export interface IdentityContent {
  photo: string;
  history: string;
}

export interface ContactContent {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  /** Tautan tombol "Buka Petunjuk Arah Google Maps". */
  mapsLink: string;
  /** Kata pencarian lokasi ATAU kode embed Google Maps untuk peta di website. */
  mapsQuery: string;
}
export interface MenuItem {
  id: string;
  label: string;
  visible: boolean;
}

export interface SiteContent {
  facilities: Facility[];
  extracurriculars: Extracurricular[];
  gallery: GalleryItem[];
  news: NewsItem[];
  teachers: Teacher[];
  principal: PrincipalContent;
  identity: IdentityContent;
  contact: ContactContent;
  menu: MenuItem[];
  hero: HeroContent;
  programs: AcademicProgram[];
  achievements: Achievement[];
  ppdbSettings: PPDBSettings;
  ppdbSchedule: PPDBScheduleItem[];
  ppdbAnnouncements: PPDBAnnouncement[];
}

export const DEFAULT_HERO: HeroContent = {
  image: '',
  ctaText: 'Daftar Sekarang',
  ctaUrl: '/pendaftaran',
  minHeight: 600,
};

export const DEFAULT_PROGRAMS: AcademicProgram[] = [
  {
    id: 'prog-1',
    title: 'Kurikulum Merdeka',
    level: 'Kelas I - VI',
    desc: 'Pembelajaran berpusat pada murid dengan penguatan kompetensi dasar dan karakter sesuai Kurikulum Merdeka.',
    highlights: ['Pembelajaran berdiferensiasi', 'Asesmen formatif berkelanjutan'],
  },
  {
    id: 'prog-2',
    title: 'Literasi & Numerasi',
    level: 'Kelas I - VI',
    desc: 'Pembiasaan membaca, menulis, dan berpikir logis sebagai fondasi seluruh mata pelajaran.',
    highlights: ['Gerakan literasi pagi', 'Latihan numerasi rutin'],
  },
  {
    id: 'prog-3',
    title: 'Projek Penguatan Profil Pelajar Pancasila (P5)',
    level: 'Kelas I - VI',
    desc: 'Projek tematik lintas mata pelajaran untuk menumbuhkan karakter, kreativitas, dan kepedulian lingkungan.',
    highlights: ['Gelar karya tiap semester', 'Kolaborasi antar kelas'],
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Medali Perak OSN IPA',
    level: 'Kota',
    date: 'September 2025',
    student: 'Muhammad Rizky Pratama (Kelas V-A)',
    desc: 'Meraih medali perak Olimpiade Sains Nasional bidang IPA tingkat Jakarta Timur.',
    image: '',
  },
];

export const DEFAULT_PPDB_SETTINGS: PPDBSettings = {
  isOpen: true,
  academicYear: '2026/2027',
  startDate: '',
  endDate: '',
  quota: 64,
  closedMessage: 'Pendaftaran PPDB sedang ditutup. Silakan pantau jadwal dan pengumuman di halaman ini.',
};

export const DEFAULT_PPDB_SCHEDULE: PPDBScheduleItem[] = [
  { id: 'sch-1', title: 'Pendaftaran Online', startDate: '', endDate: '', desc: 'Isi formulir dan unggah berkas melalui halaman Pendaftaran.' },
  { id: 'sch-2', title: 'Verifikasi Berkas', startDate: '', endDate: '', desc: 'Panitia memeriksa kelengkapan dan kebenaran berkas.' },
  { id: 'sch-3', title: 'Pengumuman Hasil Seleksi', startDate: '', endDate: '', desc: 'Hasil dapat dicek lewat menu Cek Status PPDB.' },
  { id: 'sch-4', title: 'Daftar Ulang', startDate: '', endDate: '', desc: 'Calon siswa yang diterima melakukan daftar ulang di sekolah.' },
];

export const DEFAULT_CONTACT: ContactContent = {
  address: SCHOOL_INFO.address,
  phone: SCHOOL_INFO.phone,
  whatsapp: SCHOOL_INFO.whatsapp,
  email: SCHOOL_INFO.email,
  hours: SCHOOL_INFO.operatingHours,
  mapsLink: 'https://maps.google.com/?q=SDN+Lubang+Buaya+04+Pagi',
  mapsQuery: 'SDN Lubang Buaya 04 Pagi, Lubang Buaya, Cipayung, Jakarta Timur',
};

/** Menu footer. `id` = bagian halaman yang dituju (tidak bisa diubah), `label` bisa diedit. */
export const DEFAULT_MENU: MenuItem[] = [
  { id: 'beranda', label: 'Beranda', visible: true },
  { id: 'profil', label: 'Profil Sekolah', visible: true },
  { id: 'program', label: 'Ekstrakurikuler & Fasilitas', visible: true },
  { id: 'galeri', label: 'Galeri Foto', visible: true },
  { id: 'berita', label: 'Berita & Prestasi', visible: true },
  { id: 'cek-status', label: 'Cek Status PPDB', visible: true },
  { id: 'ppdb', label: 'Daftar PPDB (Formulir Online)', visible: true },
];

/** Gabungkan menu tersimpan dengan bawaan: urutan tersimpan dipakai, id yang hilang ditambahkan kembali. */
function mergeMenu(saved: unknown): MenuItem[] {
  if (!Array.isArray(saved)) return DEFAULT_MENU;
  const known = new Map(DEFAULT_MENU.map((m) => [m.id, m]));
  const out: MenuItem[] = [];
  for (const m of saved) {
    const base = m && known.get(m.id);
    if (!base) continue;
    known.delete(m.id);
    out.push({ id: base.id, label: typeof m.label === 'string' && m.label.trim() ? m.label : base.label, visible: m.visible !== false });
  }
  known.forEach((m) => out.push(m));
  return out;
}

export const DEFAULT_HISTORY =
  'SDN Lubang Buaya 04 Pagi didirikan sejak tahun 1982 di Kelurahan Lubang Buaya, Cipayung, Jakarta Timur. Sekolah terus berkembang dengan fasilitas ruang kelas ber-AC, laboratorium TIK, dan lingkungan Adiwiyata yang asri untuk mendukung pendidikan dasar berkualitas.';

export const DEFAULT_CONTENT: SiteContent = {
  facilities: FACILITIES,
  extracurriculars: EXTRACURRICULARS,
  gallery: GALLERY_ITEMS,
  news: NEWS_ITEMS,
  teachers: INITIAL_TEACHERS,
  principal: { photo: '' },
  identity: { photo: '', history: DEFAULT_HISTORY },
  contact: DEFAULT_CONTACT,
  menu: DEFAULT_MENU,
  hero: DEFAULT_HERO,
  programs: DEFAULT_PROGRAMS,
  achievements: DEFAULT_ACHIEVEMENTS,
  ppdbSettings: DEFAULT_PPDB_SETTINGS,
  ppdbSchedule: DEFAULT_PPDB_SCHEDULE,
  ppdbAnnouncements: [],
};

function mergeHero(saved: any): HeroContent {
  const h = saved && typeof saved === 'object' ? saved : {};
  const mh = Number(h.minHeight);
  return {
    image: typeof h.image === 'string' ? h.image : '',
    ctaText: typeof h.ctaText === 'string' && h.ctaText.trim() ? h.ctaText : DEFAULT_HERO.ctaText,
    ctaUrl: typeof h.ctaUrl === 'string' && h.ctaUrl.trim() ? h.ctaUrl : DEFAULT_HERO.ctaUrl,
    minHeight: Number.isFinite(mh) && mh >= 300 && mh <= 1400 ? Math.round(mh) : DEFAULT_HERO.minHeight,
  };
}

interface Ctx {
  content: SiteContent;
  /** false sampai data dari server selesai dimuat (berhasil atau gagal). */
  loaded: boolean;
  /** Simpan satu bagian ke server lalu perbarui tampilan. */
  save: <K extends keyof SiteContent>(key: K, data: SiteContent[K]) => Promise<void>;
}

const ContentContext = createContext<Ctx>({ content: DEFAULT_CONTENT, loaded: true, save: async () => {} });

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .getContent()
      .then((remote) => {
        // Bagian yang belum pernah diedit admin tetap memakai data bawaan.
        setContent((prev) => ({
          ...prev,
          ...(Array.isArray(remote.facilities) ? { facilities: remote.facilities } : {}),
          ...(Array.isArray(remote.extracurriculars) ? { extracurriculars: remote.extracurriculars } : {}),
          ...(Array.isArray(remote.gallery) ? { gallery: remote.gallery } : {}),
          ...(Array.isArray(remote.news) ? { news: remote.news } : {}),
          ...(Array.isArray(remote.teachers) ? { teachers: remote.teachers } : {}),
          ...(remote.principal ? { principal: { ...prev.principal, ...remote.principal } } : {}),
          ...(remote.identity ? { identity: { ...prev.identity, ...remote.identity } } : {}),
          ...(remote.contact ? { contact: { ...prev.contact, ...remote.contact } } : {}),
          ...(remote.menu ? { menu: mergeMenu(remote.menu) } : {}),
          ...(remote.hero ? { hero: mergeHero(remote.hero) } : {}),
          ...(Array.isArray(remote.programs) ? { programs: remote.programs } : {}),
          ...(Array.isArray(remote.achievements) ? { achievements: remote.achievements } : {}),
          ...(remote.ppdbSettings ? { ppdbSettings: { ...DEFAULT_PPDB_SETTINGS, ...remote.ppdbSettings } } : {}),
          ...(Array.isArray(remote.ppdbSchedule) ? { ppdbSchedule: remote.ppdbSchedule } : {}),
          ...(Array.isArray(remote.ppdbAnnouncements) ? { ppdbAnnouncements: remote.ppdbAnnouncements } : {}),
        }));
      })
      .catch(() => {
        /* server belum aktif: pakai data bawaan */
      })
      .finally(() => setLoaded(true));
  }, []);

  const save = useCallback(async <K extends keyof SiteContent>(key: K, data: SiteContent[K]) => {
    await api.saveContent(key, data);
    setContent((prev) => ({ ...prev, [key]: data }));
  }, []);

  return <ContentContext.Provider value={{ content, loaded, save }}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);
