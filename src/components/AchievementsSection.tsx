import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { useContent } from '../lib/content';
import { assetUrl } from '../lib/router';

export const AchievementsSection: React.FC = () => {
  const { content } = useContent();
  const items = content.achievements;
  if (items.length === 0) return null;
  return (
    <section id="prestasi" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Trophy className="w-3.5 h-3.5" /> <span>Kebanggaan Sekolah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">Prestasi Siswa</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((a) => (
            <article key={a.id} className="rounded-3xl overflow-hidden border border-amber-100 bg-amber-50/40 shadow-sm">
              {a.image ? (
                <img src={assetUrl(a.image)} alt={a.title} loading="lazy" className="h-44 w-full object-cover" />
              ) : (
                <div className="h-24 flex items-center justify-center bg-gradient-to-r from-amber-100 to-yellow-50">
                  <Medal className="w-10 h-10 text-amber-500" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 uppercase">Tingkat {a.level}</span>
                  <span className="text-slate-500">{a.date}</span>
                </div>
                <h3 className="mt-2 font-['Outfit'] font-extrabold text-slate-900 leading-snug">{a.title}</h3>
                {a.student && <p className="text-xs font-semibold text-green-700 mt-1">{a.student}</p>}
                {a.desc && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{a.desc}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
