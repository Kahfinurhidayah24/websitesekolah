import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Navigation, ExternalLink, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useContent } from '../lib/content';
import { mapEmbedSrc, safeHttpUrl, telLink, waLink } from '../lib/maps';

/** Formulir "Kirim Pesan": tersimpan di database dan tampil di Admin > Pesan Kontak. */
const MessageForm: React.FC = () => {
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await api.sendMessage(f);
      setState('ok');
      setMsg('Pesan terkirim. Terima kasih, kami akan menghubungi Anda secepatnya.');
      setF({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
    } catch (err) {
      setState('error');
      setMsg(err instanceof Error ? err.message : 'Pesan gagal dikirim.');
    }
  };

  const cls =
    'w-full rounded-xl bg-white border border-green-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-500';

  return (
    <form onSubmit={submit} className="mt-6 rounded-3xl bg-white border border-green-100 shadow-sm p-5 sm:p-7">
      <h3 className="font-['Outfit'] text-lg font-extrabold text-slate-900">Kirim Pesan ke Sekolah</h3>
      <p className="text-xs text-slate-500 mt-0.5 mb-5">Pertanyaan, saran, atau pengaduan? Tulis di sini dan panitia akan membalas.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className={cls} placeholder="Nama lengkap *" value={f.name} onChange={set('name')} maxLength={100} required />
        <input className={cls} placeholder="Email" type="email" value={f.email} onChange={set('email')} maxLength={120} />
        <input className={cls} placeholder="No. telepon / WhatsApp" value={f.phone} onChange={set('phone')} maxLength={30} />
        <input className={cls} placeholder="Subjek" value={f.subject} onChange={set('subject')} maxLength={150} />
        {/* Jebakan bot: disembunyikan dari manusia */}
        <input
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          name="website"
          value={f.website}
          onChange={set('website')}
        />
        <textarea className={`${cls} sm:col-span-2`} rows={4} placeholder="Isi pesan *" value={f.message} onChange={set('message')} maxLength={3000} required />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p
          className={`flex items-center gap-1.5 text-xs ${state === 'error' ? 'text-rose-600' : 'text-emerald-700'}`}
          role="status"
        >
          {state === 'ok' && <CheckCircle2 className="w-4 h-4" />}
          {state === 'error' && <AlertCircle className="w-4 h-4" />}
          {(state === 'ok' || state === 'error') && msg}
        </p>
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20 disabled:opacity-60 cursor-pointer"
        >
          {state === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Kirim Pesan
        </button>
      </div>
    </form>
  );
};

export const ContactSection: React.FC = () => {
  const { content } = useContent();
  const c = content.contact;
  const wa = waLink(c.whatsapp);
  const tel = telLink(c.phone);

  const rows = [
    { icon: MapPin, color: 'bg-amber-100 text-amber-700', label: 'Alamat Sekolah', value: c.address },
    { icon: Phone, color: 'bg-green-100 text-green-700', label: 'Telepon', value: c.phone, href: tel },
    { icon: MessageCircle, color: 'bg-emerald-100 text-emerald-700', label: 'WhatsApp', value: c.whatsapp, href: wa, external: true },
    { icon: Mail, color: 'bg-sky-100 text-sky-700', label: 'Email', value: c.email, href: c.email ? `mailto:${c.email}` : '' },
    { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'Jam Layanan', value: c.hours },
  ].filter((r) => r.value && r.value.trim());

  return (
    <section id="kontak" className="py-20 bg-green-50/70 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-green-600" />
            <span>Hubungi Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">Kontak & Alamat Sekolah</h2>
          <p className="mt-1 text-slate-600 text-xs sm:text-sm max-w-xl">
            Datang langsung atau hubungi panitia untuk informasi sekolah dan PPDB. Peta di samping menunjukkan lokasi sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Info kontak */}
          <div className="lg:col-span-2 space-y-3">
            {rows.map((r) => {
              const Icon = r.icon;
              const body = (
                <>
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{r.label}</span>
                    <span className="block text-sm text-slate-900 font-medium leading-snug break-words">{r.value}</span>
                  </span>
                </>
              );
              const cls = 'flex items-start gap-3 p-4 rounded-2xl bg-white border border-green-100 shadow-sm';
              return r.href ? (
                <a
                  key={r.label}
                  href={r.href}
                  {...(r.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className={`${cls} hover:border-green-400 hover:shadow-md transition-all`}
                >
                  {body}
                </a>
              ) : (
                <div key={r.label} className={cls}>
                  {body}
                </div>
              );
            })}

            <a
              href={safeHttpUrl(c.mapsLink, 'https://maps.google.com/')}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Buka Petunjuk Arah Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Peta */}
          <div className="lg:col-span-3">
            <div className="h-full min-h-[320px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-green-200 shadow-lg bg-white">
              <iframe
                title="Lokasi SDN Lubang Buaya 04 Pagi"
                src={mapEmbedSrc(c.mapsQuery, c.address)}
                className="w-full h-full min-h-[320px] sm:min-h-[420px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <MessageForm />
      </div>
    </section>
  );
};
