import { PPDBSettings } from '../types';

/** Tanggal hari ini (YYYY-MM-DD) menurut WIB. */
export function todayWIB(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

export function formatDateID(iso: string): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export interface PPDBState {
  open: boolean;
  reason: 'open' | 'manual' | 'not-started' | 'ended';
}

/** Pendaftaran dianggap buka bila saklar Buka aktif DAN hari ini berada dalam rentang tanggal (jika diisi). */
export function getPPDBState(s: PPDBSettings, today = todayWIB()): PPDBState {
  if (!s.isOpen) return { open: false, reason: 'manual' };
  if (s.startDate && today < s.startDate) return { open: false, reason: 'not-started' };
  if (s.endDate && today > s.endDate) return { open: false, reason: 'ended' };
  return { open: true, reason: 'open' };
}

export function stateMessage(s: PPDBSettings, st: PPDBState): string {
  if (st.open) return 'Pendaftaran PPDB sedang dibuka.';
  if (st.reason === 'not-started') return `Pendaftaran belum dibuka. Dibuka mulai ${formatDateID(s.startDate)}.`;
  if (st.reason === 'ended') return `Pendaftaran sudah ditutup sejak ${formatDateID(s.endDate)}.`;
  return s.closedMessage || 'Pendaftaran PPDB sedang ditutup.';
}
