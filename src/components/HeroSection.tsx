import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../lib/content';
import { resolveUrl, assetUrl } from '../lib/router';

interface HeroSectionProps {
  onSearch: (sectionId: string) => void;
}

/** Kata kunci pencarian -> id section di halaman. */
const SEARCH_MAP: { id: string; keywords: string[] }[] = [
  { id: 'info-ppdb', keywords: ['ppdb', 'daftar', 'pendaftaran', 'formulir', 'siswa baru', 'jadwal'] },
  { id: 'cek-status', keywords: ['status', 'cek', 'lacak', 'hasil'] },
  { id: 'profil', keywords: ['profil', 'visi', 'misi', 'guru', 'kepala sekolah', 'sejarah', 'sambutan'] },
  { id: 'program', keywords: ['ekstra', 'ekskul', 'program', 'fasilitas', 'urban', 'farming', 'hidroponik'] },
  { id: 'galeri', keywords: ['galeri', 'foto', 'video', 'gambar'] },
  { id: 'berita', keywords: ['berita', 'prestasi', 'info', 'pengumuman', 'lomba'] },
  { id: 'kontak', keywords: ['kontak', 'alamat', 'telepon', 'lokasi', 'peta', 'hubungi'] },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const { content } = useContent();
  const hero = content.hero;
  // Jika admin mengunggah banner utama, itu yang dipakai; jika tidak, slideshow Galeri.
  const slides = hero.image
    ? [{ id: 'hero-banner', title: 'SDN Lubang Buaya 04 Pagi', image: hero.image }]
    : content.gallery.filter((g) => g.image);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;
  const go = (i: number) => total > 0 && setCurrent(((i % total) + total) % total);

  // Geser otomatis tiap 5 detik
  useEffect(() => {
    if (total < 2 || paused) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total, paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = SEARCH_MAP.find((s) => s.keywords.some((k) => q.includes(k) || k.includes(q)));
    onSearch(match ? match.id : 'profil');
  };

  return (
    <section
      id="beranda"
      className="relative h-screen w-full overflow-hidden bg-forest-950 text-white"
      style={{ minHeight: `${hero.minHeight}px` }}
    >
      {/* Slideshow latar: foto Galeri Kegiatan & Prestasi */}
      <div
        className="absolute inset-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((item, i) => (
          <img
            key={item.id}
            src={assetUrl(item.image)}
            alt={item.title}
            loading={i === 0 ? 'eager' : 'lazy'}
            aria-hidden={i !== current}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Overlay agar teks & navbar tetap terbaca */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/55" />

      {/* Konten tengah */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1
          className="font-['Outfit'] text-4xl font-extrabold uppercase tracking-wide text-white sm:text-5xl md:text-6xl"
          style={{ textShadow: '0 2px 18px rgba(0,0,0,0.55)' }}
        >
          SDN Lubang Buaya 04 <span className="text-amber-400">Pagi</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          role="search"
          className="mt-8 flex w-full max-w-3xl items-center rounded-full bg-white p-1.5 shadow-2xl ring-4 ring-white/25"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Apa yang ingin anda cari?"
            aria-label="Cari informasi sekolah"
            className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none sm:px-6"
          />
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-full bg-amber-400 px-7 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-amber-300"
          >
            Cari
          </button>
        </form>

        {/* Tombol CTA: teks & URL diatur dari Admin > Hero Section (bawaan: Daftar Sekarang -> /pendaftaran) */}
        <a
          href={resolveUrl(hero.ctaUrl)}
          {...(/^https?:/i.test(hero.ctaUrl) ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-black/30 transition-all hover:from-amber-300 hover:to-yellow-300 hover:scale-[1.03]"
        >
          {hero.ctaText}
        </a>
      </div>

      {total > 1 && (
        <>
          <button
            onClick={() => go(current - 1)}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/35 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:block"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => go(current + 1)}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/35 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:block"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {slides.map((item, i) => (
              <button
                key={item.id}
                onClick={() => go(i)}
                aria-label={`Foto ${i + 1}`}
                className={`h-2 cursor-pointer rounded-full transition-all ${
                  i === current ? 'w-6 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
          <p className="absolute bottom-6 left-4 z-10 hidden max-w-xs text-left text-xs text-white/80 md:block">
            {slides[current]?.title}
          </p>
        </>
      )}

      <button
        onClick={() => onSearch('profil')}
        aria-label="Gulir ke bawah"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 cursor-pointer text-white/80 hover:text-white"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </button>
    </section>
  );
};
