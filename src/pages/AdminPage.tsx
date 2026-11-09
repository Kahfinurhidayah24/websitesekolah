import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminDashboard } from '../components/AdminDashboard';
import { AdminLoginModal } from '../components/AdminLoginModal';
import { ConfirmLogoutModal } from '../components/ConfirmLogoutModal';
import { ToastContainer } from '../components/Toast';
import { api } from '../lib/api';
import { goTo } from '../lib/router';
import { useToasts } from '../lib/useToasts';
import { PPDBRegistration, RegistrationStatus } from '../types';

/** Panel Admin (/admin): login dulu, lalu dashboard dengan sidebar navigasi. */
export default function AdminPage() {
  const { toasts, showToast, dismissToast } = useToasts();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [registrations, setRegistrations] = useState<PPDBRegistration[]>([]);

  const loadRegistrations = async () => {
    try {
      setRegistrations(await api.listRegistrations());
    } catch (err) {
      showToast('error', 'Gagal Memuat Data', err instanceof Error ? err.message : 'Tidak dapat mengambil data pendaftar.');
    }
  };

  useEffect(() => {
    api
      .session()
      .then((s) => setIsLoggedIn(s.loggedIn))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadRegistrations();
    else setRegistrations([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const doLogout = async () => {
    setIsLogoutConfirmOpen(false);
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(false);
    showToast('info', 'Logout Berhasil', 'Sesi admin telah ditutup dengan aman.');
  };

  const handleUpdateStatus = async (id: string, newStatus: RegistrationStatus, notes?: string) => {
    try {
      const updated = await api.updateStatus(id, newStatus, notes);
      setRegistrations((prev) => prev.map((item) => (item.id === id ? updated : item)));
      showToast('info', 'Status PPDB Diperbarui', `Data pendaftar diubah menjadi "${newStatus}".`);
    } catch (err) {
      showToast('error', 'Gagal Memperbarui', err instanceof Error ? err.message : 'Status tidak dapat diubah.');
    }
  };

  const handleAddRegistration = async (reg: PPDBRegistration): Promise<boolean> => {
    try {
      const saved = await api.addRegistration(reg);
      setRegistrations((prev) => [saved, ...prev]);
      showToast('success', 'Data Ditambahkan', `${saved.studentName} (${saved.registrationNo}) berhasil ditambahkan.`);
      return true;
    } catch (err) {
      showToast('error', 'Gagal Menambahkan', err instanceof Error ? err.message : 'Data tidak dapat disimpan.');
      return false;
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    try {
      await api.deleteRegistration(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      showToast('info', 'Data Dihapus', 'Data pendaftar berhasil dihapus dari sistem.');
    } catch (err) {
      showToast('error', 'Gagal Menghapus', err instanceof Error ? err.message : 'Data tidak dapat dihapus.');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center text-green-300">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-950">
      {isLoggedIn ? (
        <AdminDashboard
          isOpen
          onClose={() => goTo('/')}
          registrations={registrations}
          onUpdateStatus={handleUpdateStatus}
          onAddRegistration={handleAddRegistration}
          onDeleteRegistration={handleDeleteRegistration}
          onLogout={() => setIsLogoutConfirmOpen(true)}
        />
      ) : (
        <AdminLoginModal
          isOpen
          onClose={() => goTo('/')}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            showToast('success', 'Login Berhasil', 'Selamat datang di Panel Admin SDN Lubang Buaya 04 Pagi.');
          }}
        />
      )}

      <ConfirmLogoutModal isOpen={isLogoutConfirmOpen} onConfirm={doLogout} onCancel={() => setIsLogoutConfirmOpen(false)} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
