import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import { api } from '../lib/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } },
};

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const fail = (msg: string) => {
    setErrorMessage(msg);
    setShakeKey((k) => k + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      fail('Silakan isi username dan password.');
      return;
    }

    setIsLoading(true);
    try {
      await api.login(username.trim(), password);
      setSuccess(true);
      // beri waktu animasi centang sebelum masuk dashboard
      await new Promise((r) => setTimeout(r, 900));
      setUsername('');
      setPassword('');
      setSuccess(false);
      onLoginSuccess();
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full pl-10 pr-4 py-2.5 rounded-xl bg-green-50/60 border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-green-950/70 backdrop-blur-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Gelembung hijau melayang di latar */}
          {[
            { s: 260, x: '-35vw', y: '-25vh', d: 9 },
            { s: 340, x: '35vw', y: '25vh', d: 12 },
            { s: 180, x: '30vw', y: '-30vh', d: 7 },
          ].map((b, i) => (
            <motion.div
              key={i}
              aria-hidden
              className="absolute rounded-full bg-green-400/20 blur-2xl"
              style={{ width: b.s, height: b.s, left: `calc(50% + ${b.x})`, top: `calc(50% + ${b.y})` }}
              animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          <motion.div
            key={shakeKey}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={
              shakeKey > 0
                ? { opacity: 1, scale: 1, y: 0, x: [0, -12, 10, -8, 6, 0] }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={shakeKey > 0 ? { duration: 0.45 } : { type: 'spring', stiffness: 240, damping: 22 }}
            className="relative w-full max-w-md bg-white border border-green-100 rounded-3xl shadow-2xl shadow-green-950/40 overflow-hidden"
          >
            {/* Header hijau */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-900 px-6 py-7">
              <motion.div
                aria-hidden
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="absolute top-4 right-4 p-2 rounded-xl text-green-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
                className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-green-700 shadow-lg"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-2xl border-2 border-white/70"
                  animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
                <ShieldCheck className="w-7 h-7" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold font-['Outfit'] text-white"
              >
                Login Portal Admin & Panitia
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-xs text-green-100 mt-1"
              >
                {SCHOOL_INFO.name} &bull; TA 2026/2027
              </motion.p>
            </div>

            {/* Form */}
            <div className="p-6 relative">
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.25, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-green-600"
                    >
                      <CheckCircle2 className="h-16 w-16" />
                    </motion.div>
                    <p className="font-['Outfit'] text-sm font-bold text-slate-900">Login berhasil, membuka dashboard...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form variants={container} initial="hidden" animate="show" onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={item}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username / NIP / Email Operator</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin atau nip panitia"
                      className={inputCls}
                    />
                    <User className="w-4 h-4 text-green-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputCls} pr-10`}
                    />
                    <Lock className="w-4 h-4 text-green-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                      className="p-1 text-slate-400 hover:text-green-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.p variants={item} className="text-center text-[11px] text-slate-400 pt-1">
                  Khusus Petugas Panitia PPDB
                </motion.p>

                <motion.button
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full overflow-hidden py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-600/30 disabled:opacity-70"
                >
                  {/* kilau bergerak */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 w-10 -skew-x-12 bg-white/25"
                    animate={{ left: ['-20%', '120%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
                  />
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Masuk ke Dashboard Admin</span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
