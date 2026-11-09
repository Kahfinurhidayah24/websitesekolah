import React from 'react';
import { ArrowLeft, Loader2, Lock, Search } from 'lucide-react';
import { Logo } from '../components/Logo';
import { PPDBSection } from '../components/PPDBSection';
import { PPDBInfoSection } from '../components/PPDBInfoSection';
import { ToastContainer } from '../components/Toast';
import { useContent } from '../lib/content';
import { useToasts } from '../lib/useToasts';
import { getPPDBState, stateMessage } from '../lib/ppdb';
import { hrefFor } from '../lib/router';
import { PPDBRegistration } from '../types';

/** Halaman khusus Formulir Pendaftaran PPDB Online (/pendaftaran). */
export default function RegistrationPage() {
  const { content, loaded } = useContent();
  const { toasts, showToast, dismissToast } = useToasts();
  const s = content.ppdbSettings;
  const st = getPPDBState(s);

  const onSubmitted = (reg: PPDBRegistration) =>
    showToast('success', 'Pendaftaran Berhasil!', `Nomor Registrasi ${reg.registrationNo} atas nama ${reg.studentName} berhasil tersimpan.`);

  // Setelah mendaftar, "Lacak Status" membuka beranda di bagian Cek Status dengan nomor terisi.
  const goToChecker = (regNo: string) => {
    window.location.assign(`${hrefFor('/')}?reg=${encodeURIComponent(regNo)}#cek-status`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <a href={hrefFor('/')} className="flex items-center gap-3 min-w-0">
            <Logo className="w-10 h-10 shrink-0" />
            <span className="text-sm font-black tracking-tight text-slate-900 font-['Outfit'] truncate">
              SDN LUBANG BUAYA 04 <span className="text-amber-500">PAGI</span>
            </span>
          </a>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`${hrefFor('/')}#cek-status`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-green-700 hover:text-green-800 hover:bg-green-50"
            >
              <Search className="w-3.5 h-3.5" /> Cek Status
            </a>
            <a
              href={hrefFor('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Beranda
            </a>
          </div>
        </div>
      </header>

      {!loaded ? (
        <div className="py-32 flex justify-center text-green-600">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : st.open ? (
        <PPDBSection onRegistrationSubmitted={onSubmitted} onGoToChecker={goToChecker} reducedMotion={false} />
      ) : (
        <div className="py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-200">
              <div className="mx-auto w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="font-['Outfit'] text-2xl font-extrabold text-slate-900">Pendaftaran Sedang Ditutup</h1>
              <p className="mt-2 text-sm text-slate-600">{stateMessage(s, st)}</p>
              <a
                href={hrefFor('/')}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
              </a>
            </div>
          </div>
          <PPDBInfoSection showCta={false} id="info-ppdb" />
        </div>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
