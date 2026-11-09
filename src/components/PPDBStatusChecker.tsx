import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { PPDBRegistration } from '../types';
import { api } from '../lib/api';

interface PPDBStatusCheckerProps {
  initialSearchQuery?: string;
  onGoToPPDBForm?: () => void;
}

export const PPDBStatusChecker: React.FC<PPDBStatusCheckerProps> = ({
  initialSearchQuery = '',
  onGoToPPDBForm,
}) => {
  const [query, setQuery] = useState(initialSearchQuery);
  const [searchResult, setSearchResult] = useState<PPDBRegistration | null | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError('');
    try {
      const found = await api.checkStatus(query.trim());
      setSearchResult(found || null);
    } catch (err) {
      setSearchResult(undefined);
      setSearchError(err instanceof Error ? err.message : 'Gagal memeriksa status.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: PPDBRegistration['status']) => {
    switch (status) {
      case 'Diterima':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Diterima / Lolos Seleksi</span>
          </span>
        );
      case 'Diverifikasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Dokumen Terverifikasi</span>
          </span>
        );
      case 'Menunggu Verifikasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Menunggu Pemeriksaan Panitia</span>
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Berkas Belum Memenuhi Syarat</span>
          </span>
        );
    }
  };

  return (
    <section id="cek-status" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>Layanan Informasi Terbuka</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Cek Status Pendaftaran PPDB
          </h2>
          <p className="mt-1 text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            Masukkan Nomor Registrasi (contoh: <span className="font-mono text-green-700 font-bold">PPDB-LB04-2026-001</span>) atau NIK 16 digit siswa untuk mengecek status seleksi.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik Nomor Registrasi atau NIK Siswa..."
              className="w-full pl-11 pr-28 py-3 rounded-2xl bg-white border border-slate-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 text-xs sm:text-sm font-medium text-slate-900 outline-none shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {isSearching ? 'Memeriksa...' : 'Cek Status'}
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <span>Contoh No. Registrasi:</span>
            <button
              type="button"
              onClick={() => setQuery('PPDB-LB04-2026-001')}
              className="font-mono text-green-600 hover:underline cursor-pointer font-bold"
            >
              001
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setQuery('PPDB-LB04-2026-002')}
              className="font-mono text-green-600 hover:underline cursor-pointer font-bold"
            >
              002
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setQuery('PPDB-LB04-2026-003')}
              className="font-mono text-green-600 hover:underline cursor-pointer font-bold"
            >
              003
            </button>
          </div>
        </form>

        {/* Result Card */}
        {searchResult && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hasil Verifikasi Data
                </span>
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  {searchResult.studentName}
                </h3>
                <p className="text-xs font-mono text-green-700 font-bold">
                  {searchResult.registrationNo}
                </p>
              </div>

              <div>
                {getStatusBadge(searchResult.status)}
              </div>
            </div>

            {/* Stepper Status */}
            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1 text-[11px] font-bold">
                    ✓
                  </div>
                  <p className="font-bold text-slate-800">1. Terdaftar</p>
                  <p className="text-[10px] text-slate-500">{searchResult.createdAt.substring(0, 10)}</p>
                </div>

                <div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-1 text-[11px] font-bold ${
                    searchResult.status !== 'Menunggu Verifikasi'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-400 text-slate-950 font-bold'
                  }`}>
                    {searchResult.status !== 'Menunggu Verifikasi' ? '✓' : '•'}
                  </div>
                  <p className="font-bold text-slate-800">2. Verifikasi</p>
                  <p className="text-[10px] text-slate-500">
                    {searchResult.status === 'Menunggu Verifikasi' ? 'Dalam Antrean' : 'Selesai'}
                  </p>
                </div>

                <div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-1 text-[11px] font-bold ${
                    searchResult.status === 'Diterima'
                      ? 'bg-emerald-500 text-white'
                      : searchResult.status === 'Ditolak'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-300 text-slate-600'
                  }`}>
                    {searchResult.status === 'Diterima' ? '✓' : searchResult.status === 'Ditolak' ? '✕' : '3'}
                  </div>
                  <p className="font-bold text-slate-800">3. Pengumuman</p>
                  <p className="text-[10px] text-slate-500">
                    {searchResult.status === 'Diterima' ? 'Lolos Seleksi' : searchResult.status === 'Ditolak' ? 'Belum Lolos' : 'Menunggu'}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Jalur Pendaftaran:</span>
                <p className="font-bold text-slate-900 mt-0.5">Jalur {searchResult.path}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Nama Orang Tua / Wali:</span>
                <p className="font-bold text-slate-900 mt-0.5">{searchResult.parentName}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-500">Catatan Panitia PPDB:</span>
                <p className="font-medium text-slate-800 mt-0.5 italic">
                  {searchResult.verifierNotes || 'Dokumen sedang dalam tahapan pemeriksaan panitia PPDB sekolah.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {searchError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center text-rose-800 text-xs font-medium" role="alert">
            {searchError}
          </div>
        )}

        {searchResult === null && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-center text-rose-800 text-xs">
            <AlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-1.5" />
            <p className="font-bold">Nomor Registrasi atau NIK "{query}" tidak ditemukan.</p>
            <p className="text-slate-600 mt-1">
              Silakan pastikan nomor yang dimasukkan sudah benar atau daftarkan calon siswa melalui formulir di bawah ini.
            </p>
            {onGoToPPDBForm && (
              <button
                type="button"
                onClick={onGoToPPDBForm}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              >
                Buka Formulir Pendaftaran PPDB
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
