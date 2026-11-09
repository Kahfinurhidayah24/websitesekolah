import React, { useEffect, useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useContent, SiteContent } from '../lib/content';
import { getPPDBState, stateMessage, todayWIB } from '../lib/ppdb';
import { PPDBAnnouncement, PPDBScheduleItem } from '../types';
import { ListEditor, SaveBar, inputCls, labelCls, uid } from './ContentManager';

export type PPDBTab = 'settings' | 'schedule' | 'announcements';

/** Draf lokal satu bagian konten; ikut data server selama belum ada perubahan. */
function useDraft<K extends keyof SiteContent>(key: K) {
  const { content, save } = useContent();
  const [draft, setDraft] = useState<SiteContent[K]>(content[key]);
  const [base, setBase] = useState<SiteContent[K]>(content[key]);

  // Bila data server berubah (mis. baru selesai dimuat) dan admin belum mengedit, ikuti data server.
  useEffect(() => {
    setDraft((d) => (JSON.stringify(d) === JSON.stringify(base) ? content[key] : d));
    setBase(content[key]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content[key]]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(content[key]);
  return { draft, setDraft, dirty, save: () => save(key, draft) };
}

export const PPDBManager: React.FC<{ tab: PPDBTab }> = ({ tab }) => {
  const settings = useDraft('ppdbSettings');
  const schedule = useDraft('ppdbSchedule');
  const announcements = useDraft('ppdbAnnouncements');

  if (tab === 'settings') {
    const s = settings.draft;
    const st = getPPDBState(s);
    const set = (patch: Partial<typeof s>) => settings.setDraft({ ...s, ...patch });

    const validateAndSave = async () => {
      if (!s.academicYear.trim()) throw new Error('Tahun ajaran wajib diisi.');
      if (s.startDate && s.endDate && s.startDate > s.endDate) throw new Error('Tanggal buka tidak boleh setelah tanggal tutup.');
      if (!Number.isFinite(s.quota) || s.quota < 0) throw new Error('Kuota tidak valid.');
      await settings.save();
    };

    return (
      <div className="max-w-3xl space-y-6">
        {/* Saklar Buka / Tutup */}
        <div
          className={`flex items-center justify-between gap-4 rounded-2xl border p-5 ${
            st.open ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${st.open ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
              {st.open ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </span>
            <div>
              <p className="font-['Outfit'] text-sm font-extrabold text-slate-900">
                Status saat ini: {st.open ? 'PENDAFTARAN DIBUKA' : 'PENDAFTARAN DITUTUP'}
              </p>
              <p className="text-xs text-slate-600">{stateMessage(s, st)}</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={s.isOpen}
            onClick={() => set({ isOpen: !s.isOpen })}
            className={`relative h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors ${s.isOpen ? 'bg-emerald-600' : 'bg-slate-400'}`}
            title={s.isOpen ? 'Klik untuk menutup pendaftaran' : 'Klik untuk membuka pendaftaran'}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${s.isOpen ? 'left-[30px]' : 'left-0.5'}`} />
          </button>
        </div>
        <p className="-mt-3 text-[11px] text-slate-500">
          Saklar = kontrol manual. Jika tanggal buka/tutup diisi, pendaftaran otomatis hanya terbuka di dalam rentang tanggal tersebut.
          Saat ditutup, formulir tidak bisa dikirim (dicek juga di server).
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Tahun Ajaran</label>
            <input className={inputCls} value={s.academicYear} onChange={(e) => set({ academicYear: e.target.value })} placeholder="2026/2027" />
          </div>
          <div>
            <label className={labelCls}>Kuota Penerimaan (siswa)</label>
            <input type="number" min={0} className={inputCls} value={s.quota} onChange={(e) => set({ quota: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelCls}>Tanggal Pendaftaran Dibuka (opsional)</label>
            <input type="date" className={inputCls} value={s.startDate} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Batas Akhir Pendaftaran (opsional)</label>
            <input type="date" className={inputCls} value={s.endDate} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Pesan yang Ditampilkan Saat Pendaftaran Ditutup</label>
            <textarea rows={3} className={inputCls} value={s.closedMessage} onChange={(e) => set({ closedMessage: e.target.value })} />
          </div>
        </div>
        <SaveBar dirty={settings.dirty} onSave={validateAndSave} />
      </div>
    );
  }

  if (tab === 'schedule') {
    return (
      <ListEditor<PPDBScheduleItem>
        items={schedule.draft}
        setItems={schedule.setDraft}
        titleKey="title"
        addLabel="Tambah Tahapan Jadwal"
        fields={[
          { key: 'title', label: 'Nama Tahapan', type: 'text' },
          { key: 'startDate', label: 'Tanggal Mulai', type: 'date', half: true },
          { key: 'endDate', label: 'Tanggal Selesai', type: 'date', half: true },
          { key: 'desc', label: 'Keterangan', type: 'textarea' },
        ]}
        makeNew={() => ({ id: uid('sch'), title: 'Tahapan Baru', startDate: '', endDate: '', desc: '' })}
        onSave={async () => {
          const bad = schedule.draft.find((i) => i.startDate && i.endDate && i.startDate > i.endDate);
          if (bad) throw new Error(`Tanggal mulai "${bad.title}" tidak boleh setelah tanggal selesai.`);
          await schedule.save();
        }}
        dirty={schedule.dirty}
      />
    );
  }

  return (
    <ListEditor<PPDBAnnouncement>
      items={announcements.draft}
      setItems={announcements.setDraft}
      titleKey="title"
      addLabel="Tambah Pengumuman"
      fields={[
        { key: 'title', label: 'Judul Pengumuman', type: 'text' },
        { key: 'date', label: 'Tanggal', type: 'date', half: true },
        { key: 'pinned', label: 'Sematkan di atas', type: 'checkbox', half: true },
        { key: 'content', label: 'Isi Pengumuman', type: 'textarea' },
      ]}
      makeNew={() => ({ id: uid('ann'), title: 'Pengumuman Baru', content: '', date: todayWIB(), pinned: false })}
      onSave={announcements.save}
      dirty={announcements.dirty}
    />
  );
};
