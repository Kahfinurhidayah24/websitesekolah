import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Music, 
  Cpu, 
  Compass, 
  Clock, 
  User, 
  Monitor, 
  BookOpen, 
  Trophy, 
  HeartPulse, 
  Sun, 
  Sprout, 
  CheckCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { useContent } from '../lib/content';
import { Facility } from '../types';
import { assetUrl } from '../lib/router';

export const ProgramsFacilitiesSection: React.FC = () => {
  const { content } = useContent();
  const facilities = content.facilities;
  const extracurriculars = content.extracurriculars;
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const getExtraIcon = (iconName: string) => {
    const cls = "w-5 h-5 text-amber-500";
    switch (iconName) {
      case 'Compass': return <Compass className={cls} />;
      case 'Sparkles': return <Sparkles className={cls} />;
      case 'Activity': return <Activity className={cls} />;
      case 'ShieldAlert': return <ShieldAlert className={cls} />;
      case 'Music': return <Music className={cls} />;
      case 'Cpu': return <Cpu className={cls} />;
      default: return <Sparkles className={cls} />;
    }
  };

  const getFacilityIcon = (iconName: string) => {
    const cls = "w-5 h-5 text-green-600";
    switch (iconName) {
      case 'Monitor': return <Monitor className={cls} />;
      case 'BookOpen': return <BookOpen className={cls} />;
      case 'Trophy': return <Trophy className={cls} />;
      case 'HeartPulse': return <HeartPulse className={cls} />;
      case 'Sun': return <Sun className={cls} />;
      case 'Sprout': return <Sprout className={cls} />;
      default: return <Monitor className={cls} />;
    }
  };

  return (
    <section id="program" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Ekstrakurikuler Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pengembangan Minat & Bakat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Program Ekstrakurikuler Siswa
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Menumbuhkan jiwa kepemimpinan, kecintaan pada seni budaya, kebugaran jasmani, dan kecakapan teknologi sejak usia dini di SDN Lubang Buaya 04 Pagi.
          </p>
        </div>

        {/* Ekstrakurikuler Grid - Tidy 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {extracurriculars.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-green-400 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    {getExtraIcon(item.icon)}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/70 text-amber-950">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-['Outfit']">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span>{item.day}, {item.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Pelatih: {item.coach}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Fasilitas Penunjang Header */}
        <div id="fasilitas" className="pt-6 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Monitor className="w-3.5 h-3.5 text-green-600" />
              <span>Sarana & Prasarana</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Fasilitas Penunjang Pembelajaran
            </h2>
            <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Fasilitas fisik yang bersih, nyaman, berteknologi, dan ramah anak untuk mendukung proses belajar mengajar optimal.
            </p>
          </div>

          {/* Facilities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-green-400 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={assetUrl(fac.image)}
                      alt={fac.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-forest-900/80 text-white">
                      {fac.category}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      {getFacilityIcon(fac.icon)}
                      <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                        {fac.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {fac.desc}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-green-600 pt-2 border-t border-slate-100">
                    <span>Lihat Spesifikasi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Facility Detail Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative aspect-[16/9]">
              <img
                src={assetUrl(selectedFacility.image)}
                alt={selectedFacility.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-forest-900/80 text-white hover:bg-forest-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                {selectedFacility.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] mt-1">
                {selectedFacility.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedFacility.desc}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-800 uppercase">Spesifikasi Fasilitas:</p>
                {selectedFacility.specs.map((sp, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{sp}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-forest-900 text-white hover:bg-forest-800 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
