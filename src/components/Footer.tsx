import { hrefFor } from '../lib/router';
import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp, 
  ExternalLink,
  Instagram,
  Youtube,
  Facebook,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Logo } from './Logo';
import { SCHOOL_INFO } from '../data/schoolData';
import { useContent } from '../lib/content';
import { safeHttpUrl } from '../lib/maps';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const { content } = useContent();
  const c = content.contact;
  const menu = content.menu.filter((m) => m.visible);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-forest-950 text-slate-300 pt-16 pb-10 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-forest-800/80">
          
          {/* Col 1: Identity & About (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <Logo className="w-14 h-14" />
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  {SCHOOL_INFO.name}
                </h3>
                <p className="text-xs text-green-300">
                  NPSN: {SCHOOL_INFO.npsn} &bull; Akreditasi {SCHOOL_INFO.accreditation}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-2">
              Sekolah Dasar Negeri di bawah binaan Suku Dinas Pendidikan Wilayah II Kota Administrasi Jakarta Timur, Provinsi DKI Jakarta. Mewujudkan peserta didik yang berakhlak mulia, cerdas, mandiri, dan berbudaya lingkungan.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-400 mr-2">Media Sosial:</span>
              <a
                href="#kontak"
                className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-green-600 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#kontak"
                className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#kontak"
                className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-green-800 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
              Navigasi Halaman
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {menu.map((m) => (
                <li key={m.id}>
                  {m.id === 'ppdb' ? (
                    <a href={hrefFor('/pendaftaran')} className="text-amber-400 font-bold hover:underline cursor-pointer text-left">
                      &bull; {m.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => onNavigate(m.id)}
                      className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                    >
                      &bull; {m.label}
                    </button>
                  )}
                </li>
              ))}
              <li className="pt-1">
                <a href={hrefFor('/admin')}
                  className="text-green-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  {isAdminLoggedIn ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isAdminLoggedIn ? 'Dashboard Admin (Masuk)' : 'Login Admin PPDB'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Location Info (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
              Kontak & Alamat Sekolah
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{c.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{c.phone}{c.whatsapp ? <> &bull; WA: {c.whatsapp}</> : null}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <span>{c.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{c.hours}</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={safeHttpUrl(c.mapsLink, 'https://maps.google.com/')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-900 border border-forest-800 text-[11px] text-green-400 hover:text-white hover:bg-forest-800 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Buka Petunjuk Arah Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} <strong>{SCHOOL_INFO.name}</strong>. Hak Cipta Dilindungi.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">Dinas Pendidikan DKI Jakarta</span>
            <span>&bull;</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-forest-900 border border-forest-800 text-slate-400 hover:text-white hover:bg-green-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[11px]">Ke Atas</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
