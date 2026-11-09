import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Eye, EyeOff, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const inputCls =
  'w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-green-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100';

const PasswordField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  hint?: string;
}> = ({ label, value, onChange, autoComplete, hint }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
        <KeyRound className="w-4 h-4 text-green-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
};

export const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrent('');
      setNext('');
      setConfirm('');
      setError('');
      setDone(false);
      setLoading(false);
    }
  }, [isOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    if (next.length < 8) return setError('Kata sandi baru minimal 8 karakter.');
    if (next !== confirm) return setError('Konfirmasi kata sandi baru tidak sama.');
    if (next === current) return setError('Kata sandi baru harus berbeda dari yang lama.');

    setLoading(true);
    try {
      await api.changePassword(current, next);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengganti kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-green-950/60 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100"
          >
            <div className="bg-gradient-to-br from-green-600 to-green-800 px-6 py-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white text-green-700 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">Ganti Kata Sandi</h3>
                  <p className="text-xs text-green-100">Akun admin / panitia PPDB</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="p-2 rounded-xl text-green-100 hover:text-white hover:bg-white/15 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto" />
                <p className="font-bold text-slate-900 font-['Outfit']">Kata sandi berhasil diganti</p>
                <p className="text-xs text-slate-500">Gunakan kata sandi baru saat login berikutnya.</p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <PasswordField label="Kata sandi lama" value={current} onChange={setCurrent} autoComplete="current-password" />
                <PasswordField
                  label="Kata sandi baru"
                  value={next}
                  onChange={setNext}
                  autoComplete="new-password"
                  hint="Minimal 8 karakter. Campurkan huruf, angka, dan simbol agar lebih aman."
                />
                <PasswordField label="Ulangi kata sandi baru" value={confirm} onChange={setConfirm} autoComplete="new-password" />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-bold cursor-pointer flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Simpan Kata Sandi
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
