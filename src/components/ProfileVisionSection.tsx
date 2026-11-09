import React, { useState } from 'react';
import { 
  Target, 
  Compass, 
  Sparkles, 
  Award, 
  Quote,
  GraduationCap,
  Calendar,
  Building2,
  Users,
  CheckCircle2
} from 'lucide-react';
import { PersonPhoto } from './PersonPhoto';
import { SCHOOL_INFO, VISION_MISSION } from '../data/schoolData';
import { useContent } from '../lib/content';
import { assetUrl } from '../lib/router';

export const ProfileVisionSection: React.FC = () => {
  const { content } = useContent();
  const principalPhoto = content.principal.photo || content.teachers.find((t) => t.role === 'Kepala Sekolah')?.photo || '';
  const [activeTab, setActiveTab] = useState<'visi-misi' | 'sambutan' | 'guru' | 'sejarah'>('visi-misi');

  return (
    <section id="profil" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <GraduationCap className="w-3.5 h-3.5 text-green-600" />
            <span>Profil Resmi Sekolah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Profil & Visi Misi Sekolah
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Mengenal komitmen SDN Lubang Buaya 04 Pagi dalam membina budi pekerti, kecerdasan intelektual, dan keteladanan lingkungan peserta didik.
          </p>

          {/* Clean Tab Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 bg-slate-200/90 rounded-2xl max-w-xl mx-auto">
            <button
              onClick={() => setActiveTab('visi-misi')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'visi-misi'
                  ? 'bg-white text-green-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visi & Misi
            </button>
            <button
              onClick={() => setActiveTab('sambutan')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'sambutan'
                  ? 'bg-white text-green-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sambutan Kepala Sekolah
            </button>
            <button
              onClick={() => setActiveTab('guru')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'guru'
                  ? 'bg-white text-green-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dewan Guru & Staf
            </button>
            <button
              onClick={() => setActiveTab('sejarah')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'sejarah'
                  ? 'bg-white text-green-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Identitas & Sejarah
            </button>
          </div>
        </div>

        {/* Tab 1: Visi, Misi & Nilai Karakter */}
        {activeTab === 'visi-misi' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Vision Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-green-900 to-forest-900 rounded-3xl p-7 text-white shadow-lg flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mb-5">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">
                    Visi Sekolah
                  </span>
                  <h3 className="text-xl font-black text-white font-['Outfit'] mt-1 mb-4">
                    Tunas Bangsa Berkarakter Unggul
                  </h3>
                  <div className="bg-green-950/60 p-5 rounded-2xl border border-green-800/60 text-green-100 text-xs sm:text-sm leading-relaxed italic">
                    "{VISION_MISSION.vision}"
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-green-800/80 flex items-center justify-between text-xs text-green-200">
                  <span>SK Akreditasi: {SCHOOL_INFO.skAccreditation}</span>
                  <span className="font-bold text-amber-300">Akreditasi A</span>
                </div>
              </div>

              {/* Missions List */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-7 shadow-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="w-5 h-5 text-green-700" />
                    <span className="text-xs font-extrabold text-green-700 uppercase tracking-widest">
                      Misi Pendidikan
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mb-4">
                    5 Pilar Pelaksanaan Misi Sekolah
                  </h3>

                  <ul className="space-y-3">
                    {VISION_MISSION.missions.map((misi, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-6 h-6 rounded-lg bg-green-100 text-green-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {misi}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div>
              <div className="text-center mb-5">
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  4 Nilai Utama Profil Pelajar Pancasila
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {VISION_MISSION.coreValues.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">{val.title}</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sambutan Kepala Sekolah */}
        {activeTab === 'sambutan' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-slate-200 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 text-center">
                <div className="w-44 h-52 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 mx-auto">
                  <PersonPhoto src={principalPhoto} name={SCHOOL_INFO.headmaster} className="w-full h-full object-cover object-top" />
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-4 font-['Outfit']">
                  {SCHOOL_INFO.headmaster}
                </h4>
                <p className="text-xs text-green-700 font-semibold">Kepala Sekolah SDN Lubang Buaya 04 Pagi</p>
              </div>

              <div className="md:col-span-7 space-y-3.5 text-slate-700 text-xs sm:text-sm leading-relaxed">
                <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-wider">
                  <Quote className="w-4 h-4" />
                  <span>Pesan & Sambutan</span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit']">
                  Membangun Generasi Cerdas dan Berbudi Pekerti Luhur
                </h3>

                <p>
                  <em>Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera untuk kita semua.</em>
                </p>
                <p>
                  Selamat datang di website resmi <strong>SDN Lubang Buaya 04 Pagi</strong>. Portal ini kami hadirkan sebagai wujud transparansi, pelayanan informasi sekolah, serta integrasi pendaftaran PPDB online yang akuntabel dan nyaman bagi seluruh orang tua murid.
                </p>
                <p>
                  Kami berkomitmen mendidik setiap anak dengan kasih sayang, menumbuhkan integritas, rasa ingin tahu ilmiah, dan kecintaan pada lingkungan sekolah Adiwiyata.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dewan Guru */}
        {activeTab === 'guru' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Dewan Guru & Tenaga Kependidikan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tenaga pendidik profesional tersertifikasi Kemendikbudristek
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <PersonPhoto src={teacher.photo} name={teacher.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                          {teacher.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] truncate">
                        {teacher.name}
                      </h4>
                      <p className="text-xs text-green-700 font-medium">{teacher.subject}</p>
                      {teacher.nip && <p className="text-[11px] text-slate-500 font-mono">NIP: {teacher.nip}</p>}
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {teacher.education}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Identitas & Sejarah */}
        {activeTab === 'sejarah' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                <Building2 className="w-5 h-5 text-amber-500" />
                <span>Identitas Resmi Sekolah</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Nama Sekolah:</span>
                  <span className="font-bold">{SCHOOL_INFO.name}</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">NPSN:</span>
                  <span className="font-mono font-bold text-green-700">{SCHOOL_INFO.npsn}</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Akreditasi:</span>
                  <span className="font-bold text-emerald-600">A (Unggul)</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Kurikulum:</span>
                  <span className="font-bold">Kurikulum Merdeka</span>
                </li>
                <li className="flex justify-between py-1.5">
                  <span className="text-slate-500">Kecamatan:</span>
                  <span className="font-bold">Cipayung, Jakarta Timur</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span>Sejarah Singkat</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {content.identity.history}
              </p>
              {content.identity.photo && (
                <img
                  src={assetUrl(content.identity.photo)}
                  alt="Gedung SDN Lubang Buaya 04 Pagi"
                  className="w-full rounded-2xl object-cover aspect-[16/9] border border-slate-200"
                />
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
