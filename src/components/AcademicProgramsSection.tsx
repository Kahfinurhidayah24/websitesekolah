import React from 'react';
import { BookOpenCheck, CheckCircle2 } from 'lucide-react';
import { useContent } from '../lib/content';

export const AcademicProgramsSection: React.FC = () => {
  const { content } = useContent();
  const programs = content.programs;
  if (programs.length === 0) return null;
  return (
    <section id="program-akademik" className="py-20 bg-green-50/60 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <BookOpenCheck className="w-3.5 h-3.5" /> <span>Akademik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">Program Akademik</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((p) => (
            <article key={p.id} className="rounded-3xl bg-white border border-green-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              {p.level && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-600">{p.level}</span>}
              <h3 className="mt-1 font-['Outfit'] text-lg font-extrabold text-slate-900 leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              {p.highlights.filter((h) => h.trim()).length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {p.highlights.filter((h) => h.trim()).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /> <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
