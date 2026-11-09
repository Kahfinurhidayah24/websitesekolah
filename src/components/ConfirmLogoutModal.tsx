import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmLogoutModal: React.FC<Props> = ({ isOpen, onConfirm, onCancel }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-green-950/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border border-green-100"
        >
          <motion.div
            initial={{ rotate: -20, scale: 0.6 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700"
          >
            <LogOut className="h-7 w-7" />
          </motion.div>
          <h3 id="logout-title" className="font-['Outfit'] text-lg font-bold text-slate-900">
            Keluar dari akun admin?
          </h3>
          <p className="mt-1.5 text-xs text-slate-500">
            Sesi admin akan ditutup. Perubahan yang belum disimpan akan hilang.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              autoFocus
              onClick={onCancel}
              className="cursor-pointer rounded-xl border border-green-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-green-50 transition-colors"
            >
              Tidak
            </button>
            <button
              onClick={onConfirm}
              className="cursor-pointer rounded-xl bg-green-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-green-600/30 hover:bg-green-700 transition-colors"
            >
              Ya, Keluar
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
