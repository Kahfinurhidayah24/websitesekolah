import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  KeyRound,
  Lock,
  LogOut
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import { Logo } from './Logo';
import { hrefFor } from '../lib/router';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
  onLogoutAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenAdmin,
  isAdminLoggedIn,
  onLogoutAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil Sekolah' },
    { id: 'program', label: 'Ekstrakurikuler' },
    { id: 'galeri', label: 'Galeri Foto' },
    { id: 'berita', label: 'Berita & Prestasi' },
    { id: 'cek-status', label: 'Cek Status PPDB' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        isScrolled
          ? 'bg-forest-900/98 backdrop-blur-md shadow-lg shadow-forest-950/20 py-2.5 border-b border-green-900/40'
          : 'bg-transparent py-3.5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & School Name */}
          <button
            onClick={() => handleLinkClick('beranda')}
            className="flex items-center gap-3 text-left cursor-pointer focus:outline-none shrink-0"
          >
            <Logo className="w-11 h-11 sm:w-12 sm:h-12" />

            <div>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-sm sm:text-base font-black tracking-tight text-white font-['Outfit']">
                  SDN LUBANG BUAYA 04
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  PAGI
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden 2xl:block">
                NPSN: {SCHOOL_INFO.npsn} &bull; Akreditasi {SCHOOL_INFO.accreditation} &bull; Jakarta Timur
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-0.5">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`px-2.5 py-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors cursor-pointer relative drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] ${
                    isActive
                      ? 'text-amber-300'
                      : 'text-white hover:text-amber-300'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs: Daftar PPDB, then Key icon on the right */}
          <div className="hidden sm:flex items-center gap-2">
            {/* PPDB Online CTA */}
            <a href={hrefFor('/pendaftaran')}
              className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Daftar PPDB</span>
            </a>

            {/* Login Admin as Key Icon Only, on the right */}
            <a href={hrefFor('/admin')}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-forest-800 border-forest-700 text-amber-400 hover:bg-forest-700 hover:text-amber-300'
              }`}
              title={isAdminLoggedIn ? "Dashboard Admin PPDB (Sesi Aktif)" : "Login Admin PPDB"}
              aria-label="Login Admin"
            >
              <KeyRound className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Buttons */}
          <div className="flex sm:hidden items-center gap-1.5">
            <a href={hrefFor('/pendaftaran')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-950 bg-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>PPDB</span>
            </a>

            {/* Mobile Key Icon Button */}
            <a href={hrefFor('/admin')}
              className={`p-1.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-forest-800 border-forest-700 text-amber-400'
              }`}
              title="Login Admin"
              aria-label="Login Admin"
            >
              <KeyRound className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-forest-800 text-slate-200 hover:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-forest-950 border-b border-forest-800 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-green-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-forest-900 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-forest-800 mt-2 space-y-2">
                <a href={hrefFor('/admin')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-forest-900 text-green-300 border border-forest-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{isAdminLoggedIn ? 'Buka Dashboard Admin' : 'Login Admin PPDB'}</span>
                </a>

                <a href={hrefFor('/pendaftaran')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Daftar PPDB (Formulir Online)</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
