import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Plus, Save, Trash2, Check, AlertCircle, Upload } from 'lucide-react';
import { api } from '../lib/api';
import { useContent, SiteContent, DEFAULT_CONTACT, DEFAULT_MENU, DEFAULT_HERO } from '../lib/content';
import { mapEmbedSrc } from '../lib/maps';
import { Achievement, AcademicProgram, Extracurricular, Facility, GalleryItem, NewsItem, Teacher } from '../types';
import { assetUrl } from '../lib/router';

/* ---------- Kompres foto di browser (maks 1600px) sebelum diunggah ---------- */
async function shrinkImage(file: File, maxSide = 1600, quality = 0.85): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    return blob ? new File([blob], 'foto.jpg', { type: 'image/jpeg' }) : file;
  } catch {
    return file;
  }
}

export const inputCls =
  'w-full rounded-lg bg-white border border-green-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-500';
export const labelCls = 'block text-[11px] font-semibold text-slate-500 mb-1';

/* ---------- Kolom foto: pratinjau + tombol upload ---------- */
export const ImageField: React.FC<{
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string;
}> = ({ value, onChange, label = 'Foto', aspect = 'aspect-[4/3]' }) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await api.uploadImage(await shrinkImage(file)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Foto gagal diunggah.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className={`relative ${aspect} w-full rounded-xl overflow-hidden bg-white border border-dashed border-green-200`}>
        {value ? (
          <img src={assetUrl(value)} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-500">
            <ImagePlus className="h-6 w-6" />
            <span className="text-[11px]">Belum ada foto</span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
          </div>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" />
          {value ? 'Ganti Foto' : 'Upload Foto'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="cursor-pointer rounded-lg border border-green-200 px-3 py-2 text-xs text-slate-600 hover:bg-green-50"
          >
            Hapus
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pick} />
      {error && <p className="mt-1.5 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
};

/* ---------- Penyimpanan + status ---------- */
export const SaveBar: React.FC<{ dirty: boolean; onSave: () => Promise<void> }> = ({ dirty, onSave }) => {
  const [state, setState] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const run = async () => {
    setState('saving');
    try {
      await onSave();
      setState('ok');
      setMsg('Tersimpan. Perubahan sudah tampil di website.');
    } catch (err) {
      setState('error');
      setMsg(err instanceof Error ? err.message : 'Gagal menyimpan.');
    }
  };

  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-6 flex items-center justify-between gap-3 border-t border-green-100 bg-white/95 px-6 py-3 backdrop-blur">
      <p
        className={`flex items-center gap-1.5 text-xs ${
          state === 'error' ? 'text-rose-600' : state === 'ok' && !dirty ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        {state === 'error' ? <AlertCircle className="h-3.5 w-3.5" /> : state === 'ok' && !dirty ? <Check className="h-3.5 w-3.5" /> : null}
        {dirty ? 'Ada perubahan yang belum disimpan.' : state === 'idle' ? 'Belum ada perubahan.' : msg}
        {dirty && state === 'error' ? ` ${msg}` : ''}
      </p>
      <button
        onClick={run}
        disabled={state === 'saving' || !dirty}
        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === 'saving' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        Simpan Perubahan
      </button>
    </div>
  );
};

/* ---------- Editor daftar generik ---------- */
type FieldDef<T> = {
  key: keyof T & string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'lines' | 'date' | 'checkbox';
  options?: string[];
  half?: boolean;
};

export function ListEditor<T extends { id: string }>({
  items,
  setItems,
  fields,
  imageKey,
  imageAspect,
  makeNew,
  addLabel,
  titleKey,
  onSave,
  dirty,
}: {
  items: T[];
  setItems: (v: T[]) => void;
  fields: FieldDef<T>[];
  imageKey?: keyof T & string;
  imageAspect?: string;
  makeNew: () => T;
  addLabel: string;
  titleKey: keyof T & string;
  onSave: () => Promise<void>;
  dirty: boolean;
}) {
  const update = (id: string, patch: Partial<T>) => setItems(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className={`grid grid-cols-1 gap-4 ${imageKey ? 'sm:grid-cols-[170px_1fr]' : ''}`}>
              {imageKey && (
                <ImageField
                  value={String(item[imageKey] ?? '')}
                  onChange={(url) => update(item.id, { [imageKey]: url } as Partial<T>)}
                  aspect={imageAspect}
                />
              )}
              <div className="grid grid-cols-2 gap-3">
                {fields.map((f) => {
                  const raw = item[f.key] as unknown;
                  const span = f.half ? '' : 'col-span-2';
                  return (
                    <div key={f.key} className={span}>
                      {f.type === 'checkbox' ? (
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-green-600"
                            checked={Boolean(raw)}
                            onChange={(e) => update(item.id, { [f.key]: e.target.checked } as Partial<T>)}
                          />
                          {f.label}
                        </label>
                      ) : (
                        <label className={labelCls}>{f.label}</label>
                      )}
                      {f.type === 'checkbox' ? null : f.type === 'textarea' || f.type === 'lines' ? (
                        <textarea
                          rows={f.type === 'lines' ? 3 : 3}
                          className={inputCls}
                          value={f.type === 'lines' ? ((raw as string[]) ?? []).join('\n') : String(raw ?? '')}
                          placeholder={f.type === 'lines' ? 'Satu poin per baris' : ''}
                          onChange={(e) =>
                            update(item.id, {
                              [f.key]: f.type === 'lines' ? e.target.value.split('\n') : e.target.value,
                            } as Partial<T>)
                          }
                        />
                      ) : f.type === 'select' ? (
                        <select
                          className={inputCls}
                          value={String(raw ?? '')}
                          onChange={(e) => update(item.id, { [f.key]: e.target.value } as Partial<T>)}
                        >
                          {f.options!.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type === 'date' ? 'date' : 'text'}
                          className={inputCls}
                          value={String(raw ?? '')}
                          onChange={(e) => update(item.id, { [f.key]: e.target.value } as Partial<T>)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  if (window.confirm(`Hapus "${String(item[titleKey] || 'item ini')}"?`)) setItems(items.filter((it) => it.id !== item.id));
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setItems([makeNew(), ...items])}
        className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-green-500/60 px-4 py-2.5 text-xs font-bold text-green-700 hover:bg-green-500/10"
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </button>

      <SaveBar dirty={dirty} onSave={onSave} />
    </div>
  );
}

/* ---------- Halaman pengelola konten ---------- */
export type SectionId = 'hero' | 'programs' | 'achievements' | 'extracurriculars' | 'facilities' | 'gallery' | 'news' | 'principal' | 'teachers' | 'identity' | 'contact' | 'menu';

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'programs', label: 'Program Akademik' },
  { id: 'achievements', label: 'Prestasi' },
  { id: 'extracurriculars', label: 'Program Ekstrakurikuler Siswa' },
  { id: 'facilities', label: 'Fasilitas Penunjang' },
  { id: 'gallery', label: 'Galeri Foto Kegiatan' },
  { id: 'news', label: 'Berita & Prestasi' },
  { id: 'principal', label: 'Sambutan Kepala Sekolah' },
  { id: 'teachers', label: 'Dewan Guru & Staf' },
  { id: 'identity', label: 'Identitas & Sejarah' },
  { id: 'contact', label: 'Kontak, Alamat & Peta' },
  { id: 'menu', label: 'Menu Footer' },
];

export const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const ContentManager: React.FC<{ section?: SectionId }> = ({ section: forced }) => {
  const { content, save } = useContent();
  const [tab, setSection] = useState<SectionId>('extracurriculars');
  // Dari sidebar admin, bagian yang dibuka ditentukan menu; tanpa prop, tampil sebagai tab biasa.
  const section = forced ?? tab;

  // Draf lokal tiap bagian; disimpan ke server lewat tombol "Simpan Perubahan".
  const [draft, setDraft] = useState<SiteContent>(content);
  const [base, setBase] = useState<SiteContent>(content);

  // Bila data server baru tiba setelah panel dibuka (dan belum ada edit), ikuti data server.
  React.useEffect(() => {
    setDraft((d) => (JSON.stringify(d) === JSON.stringify(base) ? content : d));
    setBase(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const isDirty = (k: keyof SiteContent) => JSON.stringify(draft[k]) !== JSON.stringify(content[k]);
  const setKey = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const saver = <K extends keyof SiteContent>(k: K) => () => save(k, draft[k]);

  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6">
      {!forced && <div className="mb-5">
        <h3 className="font-['Outfit'] text-sm font-bold text-slate-900">Kelola Foto & Konten Website</h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Pilih bagian, edit teks atau klik <b>Upload Foto</b> pada kartu yang ingin diganti, lalu tekan <b>Simpan Perubahan</b>.
        </p>
      </div>}

      {!forced && <div className="mb-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
              section === s.id ? 'bg-green-600 text-white' : 'bg-green-50 text-slate-600 hover:bg-green-100'
            }`}
          >
            {s.label}
            {isDirty(s.id) && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />}
          </button>
        ))}
      </div>}

      {section === 'hero' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <ImageField
              label="Banner / Gambar Utama Hero (kosongkan untuk memakai slideshow Galeri)"
              aspect="aspect-[16/9]"
              value={draft.hero.image}
              onChange={(url) => setKey('hero', { ...draft.hero, image: url })}
            />
            {draft.hero.image && (
              <button
                onClick={() => setKey('hero', { ...draft.hero, image: '' })}
                className="mt-2 cursor-pointer text-xs font-semibold text-rose-500 hover:underline"
              >
                Hapus banner (kembali ke slideshow Galeri)
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Teks Tombol CTA</label>
              <input
                className={inputCls}
                value={draft.hero.ctaText}
                placeholder={DEFAULT_HERO.ctaText}
                onChange={(e) => setKey('hero', { ...draft.hero, ctaText: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>URL Tombol CTA</label>
              <input
                className={inputCls}
                value={draft.hero.ctaUrl}
                placeholder={DEFAULT_HERO.ctaUrl}
                onChange={(e) => setKey('hero', { ...draft.hero, ctaUrl: e.target.value })}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Bawaan <b>/pendaftaran</b> (pindah ke halaman formulir). Boleh juga alamat penuh seperti https://...
              </p>
            </div>
            <div>
              <label className={labelCls}>Tinggi Minimum Hero Section (px)</label>
              <input
                type="number"
                min={300}
                max={1400}
                step={10}
                className={inputCls}
                value={draft.hero.minHeight}
                onChange={(e) => setKey('hero', { ...draft.hero, minHeight: Number(e.target.value) })}
              />
              <p className="mt-1 text-[11px] text-slate-500">Bawaan 600. Isi antara 300 - 1400.</p>
            </div>
            <button
              onClick={() => setKey('hero', { ...DEFAULT_HERO, image: draft.hero.image })}
              className="cursor-pointer text-xs font-semibold text-green-700 hover:underline"
            >
              Kembalikan teks, URL & tinggi ke bawaan
            </button>
          </div>
          <div className="lg:col-span-2">
            <SaveBar
              dirty={isDirty('hero')}
              onSave={async () => {
                const h = draft.hero;
                const mh = Math.round(Number(h.minHeight));
                if (!Number.isFinite(mh) || mh < 300 || mh > 1400) throw new Error('Tinggi minimum harus antara 300 dan 1400 px.');
                if (!h.ctaText.trim() || !h.ctaUrl.trim()) throw new Error('Teks dan URL tombol CTA wajib diisi.');
                await save('hero', { ...h, ctaText: h.ctaText.trim(), ctaUrl: h.ctaUrl.trim(), minHeight: mh });
              }}
            />
          </div>
        </div>
      )}

      {section === 'programs' && (
        <ListEditor<AcademicProgram>
          items={draft.programs}
          setItems={(v) => setKey('programs', v)}
          titleKey="title"
          addLabel="Tambah Program Akademik"
          fields={[
            { key: 'title', label: 'Nama Program', type: 'text' },
            { key: 'level', label: 'Jenjang / Kelas', type: 'text', half: true },
            { key: 'desc', label: 'Deskripsi', type: 'textarea' },
            { key: 'highlights', label: 'Poin Unggulan', type: 'lines' },
          ]}
          makeNew={() => ({ id: uid('prog'), title: 'Program Baru', level: 'Kelas I - VI', desc: '', highlights: [] })}
          onSave={saver('programs')}
          dirty={isDirty('programs')}
        />
      )}

      {section === 'achievements' && (
        <ListEditor<Achievement>
          items={draft.achievements}
          setItems={(v) => setKey('achievements', v)}
          imageKey="image"
          titleKey="title"
          addLabel="Tambah Prestasi"
          fields={[
            { key: 'title', label: 'Nama Prestasi / Lomba', type: 'text' },
            { key: 'level', label: 'Tingkat', type: 'select', options: ['Sekolah', 'Kecamatan', 'Kota', 'Provinsi', 'Nasional', 'Internasional'], half: true },
            { key: 'date', label: 'Waktu (mis. Mei 2026)', type: 'text', half: true },
            { key: 'student', label: 'Nama Siswa / Tim', type: 'text' },
            { key: 'desc', label: 'Keterangan', type: 'textarea' },
          ]}
          makeNew={() => ({ id: uid('ach'), title: 'Prestasi Baru', level: 'Sekolah', date: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }), student: '', desc: '', image: '' })}
          onSave={saver('achievements')}
          dirty={isDirty('achievements')}
        />
      )}

      {section === 'extracurriculars' && (
        <ListEditor<Extracurricular>
          items={draft.extracurriculars}
          setItems={(v) => setKey('extracurriculars', v)}
          titleKey="name"
          addLabel="Tambah Ekstrakurikuler"
          fields={[
            { key: 'name', label: 'Nama Ekstrakurikuler', type: 'text' },
            { key: 'badge', label: 'Label / Badge (mis. Wajib, Gudep 04.185)', type: 'text', half: true },
            { key: 'icon', label: 'Ikon', type: 'select', options: ['Compass', 'Sparkles', 'Activity', 'ShieldAlert', 'Music', 'Cpu'], half: true },
            { key: 'day', label: 'Hari', type: 'text', half: true },
            { key: 'time', label: 'Jam', type: 'text', half: true },
            { key: 'coach', label: 'Pelatih', type: 'text' },
            { key: 'desc', label: 'Deskripsi', type: 'textarea' },
          ]}
          makeNew={() => ({ id: uid('extra'), name: 'Ekstrakurikuler Baru', day: 'Sabtu', time: '08.00 - 10.00 WIB', desc: '', coach: '', icon: 'Sparkles', badge: 'Pilihan' })}
          onSave={saver('extracurriculars')}
          dirty={isDirty('extracurriculars')}
        />
      )}

      {section === 'facilities' && (
        <ListEditor<Facility>
          items={draft.facilities}
          setItems={(v) => setKey('facilities', v)}
          imageKey="image"
          titleKey="title"
          addLabel="Tambah Fasilitas"
          fields={[
            { key: 'title', label: 'Nama Fasilitas', type: 'text' },
            { key: 'category', label: 'Kategori', type: 'select', options: ['Akademik', 'Olahraga', 'Ibadah', 'Kesehatan', 'Lingkungan'], half: true },
            { key: 'desc', label: 'Deskripsi', type: 'textarea' },
            { key: 'specs', label: 'Spesifikasi / Keunggulan', type: 'lines' },
          ]}
          makeNew={() => ({ id: uid('fac'), title: 'Fasilitas Baru', desc: '', category: 'Akademik', icon: 'Monitor', image: '', specs: [] })}
          onSave={saver('facilities')}
          dirty={isDirty('facilities')}
        />
      )}

      {section === 'gallery' && (
        <ListEditor<GalleryItem>
          items={draft.gallery}
          setItems={(v) => setKey('gallery', v)}
          imageKey="image"
          titleKey="title"
          addLabel="Tambah Foto Galeri"
          fields={[
            { key: 'title', label: 'Judul Kegiatan', type: 'text' },
            { key: 'category', label: 'Kategori', type: 'select', options: ['Kegiatan', 'Prestasi', 'Fasilitas', 'Seni Budaya'], half: true },
            { key: 'date', label: 'Tanggal / Bulan', type: 'text', half: true },
            { key: 'caption', label: 'Keterangan', type: 'textarea' },
          ]}
          makeNew={() => ({ id: uid('gal'), title: 'Kegiatan Baru', category: 'Kegiatan', date: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }), image: '', caption: '' })}
          onSave={saver('gallery')}
          dirty={isDirty('gallery')}
        />
      )}

      {section === 'news' && (
        <ListEditor<NewsItem>
          items={draft.news}
          setItems={(v) => setKey('news', v)}
          imageKey="image"
          titleKey="title"
          addLabel="Tambah Berita"
          fields={[
            { key: 'title', label: 'Judul Berita', type: 'text' },
            { key: 'category', label: 'Kategori', type: 'select', options: ['Prestasi', 'Akademik', 'Kegiatan', 'Pengumuman'], half: true },
            { key: 'date', label: 'Tanggal', type: 'text', half: true },
            { key: 'excerpt', label: 'Ringkasan', type: 'textarea' },
            { key: 'content', label: 'Isi Berita', type: 'textarea' },
            { key: 'author', label: 'Penulis', type: 'text', half: true },
            { key: 'readTime', label: 'Waktu Baca', type: 'text', half: true },
          ]}
          makeNew={() => ({
            id: uid('news'),
            title: 'Berita Baru',
            category: 'Kegiatan',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            readTime: '2 Menit',
            excerpt: '',
            content: '',
            image: '',
            author: 'Tim Humas SDN LB 04',
          })}
          onSave={saver('news')}
          dirty={isDirty('news')}
        />
      )}

      {section === 'teachers' && (
        <ListEditor<Teacher>
          items={draft.teachers}
          setItems={(v) => setKey('teachers', v)}
          imageKey="photo"
          titleKey="name"
          addLabel="Tambah Guru / Staf"
          fields={[
            { key: 'name', label: 'Nama Lengkap & Gelar', type: 'text' },
            { key: 'role', label: 'Jabatan', type: 'text' },
            { key: 'subject', label: 'Mata Pelajaran / Tugas', type: 'text' },
            { key: 'education', label: 'Pendidikan', type: 'text', half: true },
            { key: 'nip', label: 'NIP (opsional)', type: 'text', half: true },
          ]}
          makeNew={() => ({ id: uid('t'), name: 'Nama Guru', nip: '', role: 'Guru Kelas', subject: '', education: '', photo: '' })}
          onSave={saver('teachers')}
          dirty={isDirty('teachers')}
        />
      )}

      {section === 'principal' && (
        <div className="max-w-xs">
          <ImageField
            label="Foto Kepala Sekolah (tampil di Sambutan)"
            aspect="aspect-[3/4]"
            value={draft.principal.photo}
            onChange={(url) => setKey('principal', { ...draft.principal, photo: url })}
          />
          <SaveBar dirty={isDirty('principal')} onSave={saver('principal')} />
        </div>
      )}

      {section === 'identity' && (
        <div className="max-w-2xl space-y-4">
          <ImageField
            label="Foto Gedung / Lingkungan Sekolah (tampil di Sejarah Singkat)"
            aspect="aspect-[16/9]"
            value={draft.identity.photo}
            onChange={(url) => setKey('identity', { ...draft.identity, photo: url })}
          />
          <div>
            <label className={labelCls}>Sejarah Singkat</label>
            <textarea
              rows={6}
              className={inputCls}
              value={draft.identity.history}
              onChange={(e) => setKey('identity', { ...draft.identity, history: e.target.value })}
            />
          </div>
          <SaveBar dirty={isDirty('identity')} onSave={saver('identity')} />
        </div>
      )}
      {section === 'contact' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Alamat Sekolah</label>
              <textarea
                rows={3}
                className={inputCls}
                value={draft.contact.address}
                onChange={(e) => setKey('contact', { ...draft.contact, address: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Telepon</label>
                <input
                  className={inputCls}
                  value={draft.contact.phone}
                  onChange={(e) => setKey('contact', { ...draft.contact, phone: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>WhatsApp</label>
                <input
                  className={inputCls}
                  placeholder="+62 812-xxxx-xxxx"
                  value={draft.contact.whatsapp}
                  onChange={(e) => setKey('contact', { ...draft.contact, whatsapp: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                className={inputCls}
                value={draft.contact.email}
                onChange={(e) => setKey('contact', { ...draft.contact, email: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Jam Layanan</label>
              <input
                className={inputCls}
                value={draft.contact.hours}
                onChange={(e) => setKey('contact', { ...draft.contact, hours: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Tautan tombol "Buka Petunjuk Arah Google Maps"</label>
              <input
                className={inputCls}
                placeholder="https://maps.google.com/?q=..."
                value={draft.contact.mapsLink}
                onChange={(e) => setKey('contact', { ...draft.contact, mapsLink: e.target.value })}
              />
              <p className="mt-1 text-[11px] text-slate-500">Buka Google Maps, cari sekolah, klik Bagikan, lalu salin tautannya ke sini.</p>
            </div>
            <div>
              <label className={labelCls}>Lokasi di peta (nama tempat ATAU kode sematan)</label>
              <textarea
                rows={3}
                className={inputCls}
                placeholder="SDN Lubang Buaya 04 Pagi, Cipayung, Jakarta Timur"
                value={draft.contact.mapsQuery}
                onChange={(e) => setKey('contact', { ...draft.contact, mapsQuery: e.target.value })}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Cara termudah: tulis nama tempat + kota. Untuk titik yang lebih tepat: di Google Maps pilih <b>Bagikan → Sematkan peta → Salin HTML</b>, lalu tempel di sini.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setKey('contact', DEFAULT_CONTACT)}
              className="cursor-pointer text-[11px] font-semibold text-slate-500 underline hover:text-slate-800"
            >
              Kembalikan ke data bawaan
            </button>
          </div>

          <div>
            <span className={labelCls}>Pratinjau peta</span>
            <div className="overflow-hidden rounded-2xl border border-green-200 bg-green-50">
              <iframe
                title="Pratinjau peta"
                src={mapEmbedSrc(draft.contact.mapsQuery, draft.contact.address)}
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <SaveBar dirty={isDirty('contact')} onSave={saver('contact')} />
          </div>
        </div>
      )}

      {section === 'menu' && (
        <div className="max-w-2xl space-y-3">
          <p className="text-[11px] text-slate-500">
            Ubah tulisan menu pada bagian <b>Navigasi Halaman</b> di footer. Hilangkan centang untuk menyembunyikan menu. Tujuan tiap menu tetap
            ke bagian halamannya.
          </p>
          {draft.menu.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50/50 p-3">
              <input
                type="checkbox"
                checked={m.visible}
                title="Tampilkan di footer"
                onChange={(e) => setKey('menu', draft.menu.map((x, j) => (j === i ? { ...x, visible: e.target.checked } : x)))}
                className="h-4 w-4 cursor-pointer accent-green-600"
              />
              <input
                className={inputCls}
                value={m.label}
                onChange={(e) => setKey('menu', draft.menu.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              />
              <span className="hidden shrink-0 rounded-md bg-white px-2 py-1 font-mono text-[10px] text-slate-500 sm:inline">#{m.id}</span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setKey('menu', DEFAULT_MENU)}
            className="cursor-pointer text-[11px] font-semibold text-slate-500 underline hover:text-slate-800"
          >
            Kembalikan ke menu bawaan
          </button>
          <SaveBar dirty={isDirty('menu')} onSave={saver('menu')} />
        </div>
      )}
    </div>
  );
};
