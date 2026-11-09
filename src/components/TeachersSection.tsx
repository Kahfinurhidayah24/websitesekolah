import React from 'react';
import { PersonPhoto } from './PersonPhoto';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Quote, Award } from 'lucide-react';
import { useContent } from '../lib/content';

interface TeachersSectionProps {
  reducedMotion: boolean;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({ reducedMotion }) => {
  const { content } = useContent();
  const teachers = content.teachers;
  return (
    <section id="guru" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-green-600" />
            <span>Pendidik Berdedikasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Dewan Guru & Tenaga Kependidikan
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Didukung oleh tenaga pendidik profesional, bersertifikasi pendidik nasional, lulusan perguruan tinggi terkemuka, dan berkomitmen menumbuhkan potensi terbaik setiap murid.
          </p>
        </div>

        {/* Teachers Grid with Hover Lift & Staggered Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.5 }}
              whileHover={reducedMotion ? {} : { y: -8 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:border-green-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Role Tag */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <PersonPhoto src={teacher.photo} name={teacher.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                      {teacher.role}
                    </span>
                    <h3 className="text-lg font-bold text-white font-['Outfit'] mt-1 truncate">
                      {teacher.name}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-green-700 font-semibold">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>{teacher.subject}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono">
                    {teacher.nip ? `NIP: ${teacher.nip}` : 'Kepala Sekolah'}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{teacher.education}</span>
                  </div>

                  {teacher.quote && (
                    <div className="relative pl-3 border-l-2 border-amber-400 text-xs italic text-slate-600 pt-1">
                      "{teacher.quote}"
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="w-full py-2 rounded-xl text-center text-[11px] font-semibold text-slate-500 bg-slate-50 group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                  Tersertifikasi Pendidik Kemendikbudristek
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
