import React from 'react';
import { CalendarDays, Megaphone, Pin, Lock, Unlock, ArrowRight } from 'lucide-react';
import { useContent } from '../lib/content';
import { formatDateID, getPPDBState, stateMessage } from '../lib/ppdb';
import { hrefFor } from '../lib/router';

interface Props {
  /** Tampilkan tombol "Daftar Sekarang" (dimatikan di halaman /pendaftaran). */
  showCta?: boolean;
  id?: string;
  dark?: boolean;
}

/** Status Buka/Tutup, Jadwal, dan Pengumuman PPDB: semua diatur dari Admin > PPDB Management. */
export const PPDBInfoSection: React.FC<Props> = ({ showCta = true, id = 'info-ppdb', dark = false }) => {
  const { content } = useContent();
  const s = content.ppdbSettings;
  const st = getPPDBState(s);
  const schedule = content.ppdbSchedule;
  const announcements = [...content.ppdbAnnouncements].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const range = (a: string, b: string) => {
    if (a && b && a !== b) return `${formatDateID(a)} - ${formatDateID(b)}`;
    if (a || b) return formatDateID(a || b);
    return 'Jadwal menyusul';
  };

  const card = dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-green-100 text-slate-900';
  const sub = dark ? 'text-slate-300' : 'text-slate-500';

  return (
    <section id={id} className={dark ? 'py-12' : 'py-20 bg-white border-b border-slate-200'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2.5 ${
                st.open ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {st.open ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>PPDB {s.academicYear} &bull; {st.open ? 'Dibuka' : 'Ditutup'}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${dark ? 'text-white' : 'text-slate-900'}`}>
              Informasi Penerimaan Peserta Didik Baru
            </h2>
            <p className={`mt-1 text-xs sm:text-sm max-w-2xl ${sub}`}>
              {stateMessage(s, st)} Kuota penerimaan: {s.quota} siswa.
            </p>
          </div>
          {showCta && (
            <a
              href={hrefFor('/pendaftaran')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shrink-0"
            >
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jadwal */}
          <div className={`rounded-3xl border p-6 ${card}`}>
            <h3 className="flex items-center gap-2 font-['Outfit'] font-bold mb-4">
              <CalendarDays className="w-5 h-5 text-amber-500" /> Jadwal PPDB
            </h3>
            {schedule.length === 0 ? (
              <p className={`text-sm ${sub}`}>Jadwal belum dipublikasikan.</p>
            ) : (
              <ol className="relative border-l-2 border-green-200 ml-2 space-y-5">
                {schedule.map((it) => (
                  <li key={it.id} className="pl-5 relative">
                    <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100" />
                    <p className="text-sm font-bold">{it.title}</p>
                    <p className="text-xs font-semibold text-green-600">{range(it.startDate, it.endDate)}</p>
                    {it.desc && <p className={`text-xs mt-0.5 ${sub}`}>{it.desc}</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Pengumuman */}
          <div className={`rounded-3xl border p-6 ${card}`}>
            <h3 className="flex items-center gap-2 font-['Outfit'] font-bold mb-4">
              <Megaphone className="w-5 h-5 text-amber-500" /> Pengumuman PPDB
            </h3>
            {announcements.length === 0 ? (
              <p className={`text-sm ${sub}`}>Belum ada pengumuman.</p>
            ) : (
              <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {announcements.map((a) => (
                  <li key={a.id} className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-white/5' : 'border-green-100 bg-green-50/60'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold">{a.title}</p>
                      {a.pinned && <Pin className="w-4 h-4 text-amber-500 shrink-0" aria-label="Disematkan" />}
                    </div>
                    {a.date && <p className="text-[11px] text-green-600 font-semibold">{formatDateID(a.date)}</p>}
                    <p className={`text-xs mt-1 whitespace-pre-line ${sub}`}>{a.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
