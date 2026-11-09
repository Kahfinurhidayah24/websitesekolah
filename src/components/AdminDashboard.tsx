import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  FileSpreadsheet, 
  RefreshCw, 
  X, 
  Check, 
  FileText, 
  Printer, 
  LayoutDashboard, 
  UserCheck, 
  Bell, 
  ArrowUpRight, 
  Settings,
  GraduationCap,
  Image as ImageIcon,
  LogOut,
  KeyRound,
  Download,
  Loader2,
  Newspaper,
  Inbox,
  ClipboardList,
  SlidersHorizontal,
  CalendarDays,
  Megaphone,
  BookOpenCheck,
  Building2,
  Dumbbell,
  Trophy,
  PanelTop,
} from 'lucide-react';
import { ContentManager, SectionId } from './ContentManager';
import { MessagesPanel } from './MessagesPanel';
import { PPDBManager, PPDBTab } from './PPDBManager';
import { useContent } from '../lib/content';
import { api } from '../lib/api';
import { ChangePasswordModal } from './ChangePasswordModal';
import { exportExcel, exportPdf } from '../lib/exportData';
import { PPDBRegistration, RegistrationPath, RegistrationStatus } from '../types';
import { assetUrl } from '../lib/router';

type AdminPageId =
  | 'dashboard' | 'berita' | 'pesan' | 'pendaftaran'
  | 'ppdb-pengaturan' | 'ppdb-jadwal' | 'ppdb-pengumuman' | 'daftar-pendaftar'
  | 'hero' | 'program-akademik' | 'fasilitas' | 'ekstrakurikuler' | 'galeri' | 'prestasi';

const NAV_GROUPS: { heading: string; items: { id: AdminPageId; label: string; icon: React.ElementType }[] }[] = [
  {
    heading: 'Menu',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'berita', label: 'Berita', icon: Newspaper },
      { id: 'pesan', label: 'Pesan Kontak', icon: Inbox },
      { id: 'pendaftaran', label: 'Pendaftaran', icon: ClipboardList },
    ],
  },
  {
    heading: 'PPDB Management',
    items: [
      { id: 'ppdb-pengaturan', label: 'Pengaturan PPDB', icon: SlidersHorizontal },
      { id: 'ppdb-jadwal', label: 'Jadwal PPDB', icon: CalendarDays },
      { id: 'ppdb-pengumuman', label: 'Pengumuman PPDB', icon: Megaphone },
      { id: 'daftar-pendaftar', label: 'Daftar Pendaftar', icon: Users },
    ],
  },
  {
    heading: 'Content Management',
    items: [
      { id: 'hero', label: 'Hero Section', icon: PanelTop },
      { id: 'program-akademik', label: 'Program Akademik', icon: BookOpenCheck },
      { id: 'fasilitas', label: 'Fasilitas', icon: Building2 },
      { id: 'ekstrakurikuler', label: 'Ekstrakurikuler', icon: Dumbbell },
      { id: 'galeri', label: 'Galeri', icon: ImageIcon },
      { id: 'prestasi', label: 'Prestasi', icon: Trophy },
    ],
  },
];

const PAGE_TITLES: Record<AdminPageId, string> = {
  dashboard: 'Dashboard - Ringkasan Statistik',
  berita: 'Kelola Berita',
  pesan: 'Pesan Kontak',
  pendaftaran: 'Pendaftaran - Statistik & Distribusi Jalur',
  'ppdb-pengaturan': 'Pengaturan PPDB',
  'ppdb-jadwal': 'Jadwal PPDB',
  'ppdb-pengumuman': 'Pengumuman PPDB',
  'daftar-pendaftar': 'Daftar Pendaftar & Verifikasi Berkas',
  hero: 'Hero Section',
  'program-akademik': 'Program Akademik',
  fasilitas: 'Fasilitas',
  ekstrakurikuler: 'Ekstrakurikuler',
  galeri: 'Galeri',
  prestasi: 'Prestasi',
};

/** Menu sidebar -> editor konten yang dibuka. */
const CONTENT_SECTION: Partial<Record<AdminPageId, SectionId>> = {
  berita: 'news',
  hero: 'hero',
  'program-akademik': 'programs',
  fasilitas: 'facilities',
  ekstrakurikuler: 'extracurriculars',
  galeri: 'gallery',
  prestasi: 'achievements',
};
const PPDB_TAB: Partial<Record<AdminPageId, PPDBTab>> = {
  'ppdb-pengaturan': 'settings',
  'ppdb-jadwal': 'schedule',
  'ppdb-pengumuman': 'announcements',
};

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: PPDBRegistration[];
  onUpdateStatus: (id: string, status: RegistrationStatus, notes?: string) => void;
  onAddRegistration: (reg: PPDBRegistration) => Promise<boolean> | boolean;
  onDeleteRegistration: (id: string) => void;
  onLogout?: () => void;
}

const DocPreview: React.FC<{ url: string; alt: string }> = ({ url, alt }) => {
  const [failed, setFailed] = useState(false);
  if (!url) {
    return (
      <div className="aspect-[4/3] rounded-lg bg-green-50 flex items-center justify-center text-[10px] text-slate-500">
        Tidak ada berkas
      </div>
    );
  }
  const href = assetUrl(url);
  const isPdf = url.toLowerCase().endsWith('.pdf');
  return (
    <a href={href} target="_blank" rel="noreferrer" className="block aspect-[4/3] rounded-lg overflow-hidden bg-green-50">
      {isPdf || failed ? (
        <div className="w-full h-full flex items-center justify-center px-2 text-center text-[11px] font-bold text-amber-700">
          {isPdf ? 'Buka PDF' : (
            <span>
              Gambar gagal dimuat
              <span className="block mt-1 font-mono text-[9px] font-normal text-slate-500 break-all">{href}</span>
            </span>
          )}
        </div>
      ) : (
        <img src={href} alt={alt} onError={() => setFailed(true)} className="w-full h-full object-cover" />
      )}
    </a>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  registrations,
  onUpdateStatus,
  onAddRegistration,
  onDeleteRegistration,
  onLogout,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 1024);
  const [activeTab, setActiveTab] = useState<AdminPageId>('dashboard');
  const { content } = useContent();
  const [unreadMessages, setUnreadMessages] = useState(0);
  useEffect(() => {
    api.listMessages().then((l) => setUnreadMessages(l.filter((m) => !m.isRead).length)).catch(() => {});
  }, []);
  const showStats = activeTab === 'dashboard' || activeTab === 'pendaftaran' || activeTab === 'daftar-pendaftar';
  const showStudentTable = activeTab === 'dashboard' || activeTab === 'daftar-pendaftar';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [pathFilter, setPathFilter] = useState<string>('All');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Modal States
  const [selectedReg, setSelectedReg] = useState<PPDBRegistration | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Unduh data
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);
  const [exportError, setExportError] = useState('');

  // New Registration Form State
  const [newRegForm, setNewRegForm] = useState({
    studentName: '',
    nik: '',
    birthPlace: 'Jakarta',
    birthDate: '2018-05-10',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    religion: 'Islam',
    address: 'Jl. Lubang Buaya RT 02/05',
    rt: '02',
    rw: '05',
    kelurahan: 'Lubang Buaya',
    previousSchool: 'TK Melati',
    parentName: '',
    parentNik: '',
    parentPhone: '',
    parentJob: 'Karyawan Swasta',
    path: 'Zonasi' as RegistrationPath,
  });

  // Verifier notes state for detail modal
  const [tempNotes, setTempNotes] = useState('');

  // Simulate refresh table with skeleton loading state
  const handleRefresh = () => {
    setIsLoadingData(true);
    setTimeout(() => {
      setIsLoadingData(false);
    }, 600);
  };

  const totalCount = registrations.length;
  const verifiedCount = registrations.filter(r => r.status === 'Diverifikasi').length;
  const acceptedCount = registrations.filter(r => r.status === 'Diterima').length;
  const pendingCount = registrations.filter(r => r.status === 'Menunggu Verifikasi').length;
  const rejectedCount = registrations.filter(r => r.status === 'Ditolak').length;

  // Path counts
  const zonasiCount = registrations.filter(r => r.path === 'Zonasi').length;
  const afirmasiCount = registrations.filter(r => r.path === 'Afirmasi').length;
  const prestasiCount = registrations.filter(r => r.path === 'Prestasi').length;
  const pindahCount = registrations.filter(r => r.path === 'Pindah Tugas').length;

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nik.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesPath = pathFilter === 'All' || r.path === pathFilter;

    return matchesSearch && matchesStatus && matchesPath;
  });

  const filterLabel = `Status: ${statusFilter === 'All' ? 'Semua' : statusFilter} | Jalur: ${pathFilter === 'All' ? 'Semua' : pathFilter}${searchQuery.trim() ? ` | Cari: "${searchQuery.trim()}"` : ''}`;

  const handleExport = async (kind: 'excel' | 'pdf') => {
    if (exporting || filteredRegistrations.length === 0) return;
    setExporting(kind);
    setExportError('');
    try {
      if (kind === 'excel') await exportExcel(filteredRegistrations);
      else await exportPdf(filteredRegistrations, { filterLabel });
    } catch (err) {
      console.error(err);
      setExportError('Gagal membuat berkas unduhan. Coba lagi atau muat ulang halaman.');
    } finally {
      setExporting(null);
    }
  };

  const handleOpenDetail = (reg: PPDBRegistration) => {
    setSelectedReg(reg);
    setTempNotes(reg.verifierNotes || '');
    setIsDetailModalOpen(true);
  };

  const handleSaveStatus = (newStatus: RegistrationStatus) => {
    if (selectedReg) {
      onUpdateStatus(selectedReg.id, newStatus, tempNotes);
      setSelectedReg(prev => prev ? { ...prev, status: newStatus, verifierNotes: tempNotes } : null);
    }
  };

  const handleCreateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegForm.studentName || !newRegForm.nik) return;

    const newId = `reg-${Date.now()}`;
    const randomNo = Math.floor(100 + Math.random() * 900);
    const created: PPDBRegistration = {
      id: newId,
      registrationNo: `PPDB-LB04-2026-${randomNo}`,
      studentName: newRegForm.studentName,
      nik: newRegForm.nik,
      birthPlace: newRegForm.birthPlace,
      birthDate: newRegForm.birthDate,
      gender: newRegForm.gender,
      religion: newRegForm.religion,
      address: newRegForm.address,
      rt: newRegForm.rt,
      rw: newRegForm.rw,
      kelurahan: newRegForm.kelurahan,
      previousSchool: newRegForm.previousSchool,
      parentName: newRegForm.parentName || 'Orang Tua Calon Siswa',
      parentNik: newRegForm.parentNik || '3175060000000000',
      parentPhone: newRegForm.parentPhone || '081200000000',
      parentJob: newRegForm.parentJob,
      path: newRegForm.path,
      distanceKm: 0.45,
      documents: {
        kk: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
        akta: 'https://images.unsplash.com/photo-1554415707-9e49fe83083f?auto=format&fit=crop&q=80&w=400',
        foto: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=400',
      },
      status: 'Menunggu Verifikasi',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    const ok = await onAddRegistration(created);
    if (ok === false) return;
    setIsAddModalOpen(false);
    // Reset
    setNewRegForm({
      studentName: '',
      nik: '',
      birthPlace: 'Jakarta',
      birthDate: '2018-05-10',
      gender: 'Laki-laki',
      religion: 'Islam',
      address: 'Jl. Lubang Buaya RT 02/05',
      rt: '02',
      rw: '05',
      kelurahan: 'Lubang Buaya',
      previousSchool: 'TK Melati',
      parentName: '',
      parentNik: '',
      parentPhone: '',
      parentJob: 'Karyawan Swasta',
      path: 'Zonasi',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-green-950/50 backdrop-blur-md overflow-hidden animate-fadeIn">
      {/* Admin Container */}
      <div className="w-full h-full bg-white text-slate-800 flex overflow-hidden">
        
        {/* Animated Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? '72px' : '260px' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-b from-green-700 to-green-900 border-r border-green-800 flex flex-col justify-between shrink-0 relative z-20"
        >
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/15 flex items-center justify-between shrink-0">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-600 to-amber-400 p-0.5 shrink-0">
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-black text-white font-['Outfit']">PANEL ADMIN</p>
                    <p className="text-[10px] text-green-100">SDN Lubang Buaya 04</p>
                  </div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="mx-auto w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
              )}
              {!sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1.5 rounded-lg text-green-100 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  title="Persempit Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="mx-auto mt-2 p-1.5 rounded-lg text-green-100 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                title="Perluas Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Nav Menu (dikelompokkan) */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.heading}>
                  {!sidebarCollapsed ? (
                    <p className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-green-200/70">{group.heading}</p>
                  ) : (
                    <div className="mx-3 mb-1.5 border-t border-white/15" />
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive ? 'bg-white text-green-800 shadow-md font-bold' : 'text-green-100 hover:text-white hover:bg-white/10'
                          }`}
                          title={sidebarCollapsed ? item.label : undefined}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                          {item.id === 'pesan' && unreadMessages > 0 && (
                            <span
                              className={`${sidebarCollapsed ? 'ml-0 -mt-4 -mr-1' : 'ml-auto'} min-w-[18px] rounded-full bg-amber-400 px-1.5 text-center text-[10px] font-extrabold text-slate-950`}
                            >
                              {unreadMessages}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* ACCOUNT */}
          <div className="p-3 border-t border-white/15 shrink-0">
            {!sidebarCollapsed && (
              <p className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-green-200/70">Account</p>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-200 hover:bg-white/10 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            )}
          </div>
        </motion.aside>

        {/* Main Admin Content Area */}
        <main className="flex-1 h-full overflow-y-auto flex flex-col bg-green-50/60">
          
          {/* Top Admin Bar */}
          <header className="h-16 border-b border-green-100 px-6 flex items-center justify-between shrink-0 bg-white backdrop-blur-md">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
                {PAGE_TITLES[activeTab]}
              </h2>
              <p className="text-[11px] text-slate-500">
                Tahun Ajaran {content.ppdbSettings.academicYear} &bull; Kuota Total: {content.ppdbSettings.quota} Siswa
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                title="Muat Ulang Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-amber-600' : ''}`} />
                <span className="hidden sm:inline">Segarkan</span>
              </button>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                title="Ganti kata sandi"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Kata Sandi</span>
              </button>

              {showStudentTable && <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Siswa</span>
              </button>}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-green-600/20"
                  title="Keluar dari akun admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-green-50 transition-colors cursor-pointer ml-1"
                title="Lihat Website"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Content Body */}
          <div className="p-6 space-y-6 flex-1">
            
            {CONTENT_SECTION[activeTab] && <ContentManager key={activeTab} section={CONTENT_SECTION[activeTab]} />}

            {PPDB_TAB[activeTab] && (
              <div className="rounded-3xl border border-green-100 bg-white p-6">
                <PPDBManager tab={PPDB_TAB[activeTab]!} />
              </div>
            )}

            {activeTab === 'pesan' && <MessagesPanel onUnreadChange={setUnreadMessages} />}

            {/* Stat Cards */}
            {showStats && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className="p-5 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500">Total Pendaftar</p>
                  <p className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">{totalCount}</p>
                  <span className="text-[11px] text-green-600">Target Kuota: 64 siswa</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-600/20 text-green-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div
                className="p-5 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500">Diterima / Lolos</p>
                  <p className="text-2xl font-black text-emerald-600 font-['Outfit'] mt-1">{acceptedCount}</p>
                  <span className="text-[11px] text-emerald-500 font-medium">{Math.round((acceptedCount / 64) * 100)}% kuota terpenuhi</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div
                className="p-5 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500">Menunggu Verifikasi</p>
                  <p className="text-2xl font-black text-amber-600 font-['Outfit'] mt-1">{pendingCount}</p>
                  <span className="text-[11px] text-amber-700">Perlu tindakan panitia</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div
                className="p-5 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500">Berkas Ditolak</p>
                  <p className="text-2xl font-black text-rose-600 font-['Outfit'] mt-1">{rejectedCount}</p>
                  <span className="text-[11px] text-rose-600">Tidak sesuai syarat</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>
            </div>)}

            {/* TAB 1: OVERVIEW / QUICK TABLE */}
            {showStudentTable && (
              <div className="bg-white rounded-3xl border border-green-100 p-6 space-y-4">
                
                {/* Search & Filter Controls */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama siswa, no registrasi, atau NIK..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-green-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-green-200 text-xs text-slate-700 focus:border-amber-400"
                    >
                      <option value="All">Semua Status</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Diverifikasi">Diverifikasi</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>

                    <select
                      value={pathFilter}
                      onChange={(e) => setPathFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-green-200 text-xs text-slate-700 focus:border-amber-400"
                    >
                      <option value="All">Semua Jalur</option>
                      <option value="Zonasi">Zonasi</option>
                      <option value="Afirmasi">Afirmasi</option>
                      <option value="Prestasi">Prestasi</option>
                      <option value="Pindah Tugas">Pindah Tugas</option>
                    </select>

                    <div className="flex items-center gap-2 md:ml-2 md:pl-3 md:border-l md:border-green-200">
                      <button
                        onClick={() => handleExport('excel')}
                        disabled={!!exporting || filteredRegistrations.length === 0}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Unduh data yang tampil sebagai Excel (.xlsx)"
                      >
                        {exporting === 'excel' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
                        <span>Excel</span>
                      </button>
                      <button
                        onClick={() => handleExport('pdf')}
                        disabled={!!exporting || filteredRegistrations.length === 0}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Unduh data yang tampil sebagai PDF"
                      >
                        {exporting === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Download className="w-3 h-3" />
                    Unduhan memuat <b className="text-slate-700">{filteredRegistrations.length}</b> data sesuai pencarian &amp; filter saat ini.
                  </span>
                  {exportError && <span className="text-rose-600 font-semibold">{exportError}</span>}
                </div>

                {/* Table with Loading State */}
                <div className="overflow-x-auto rounded-2xl border border-green-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-green-100">
                      <tr>
                        <th className="py-3.5 px-4">No. Registrasi</th>
                        <th className="py-3.5 px-4">Nama Calon Siswa</th>
                        <th className="py-3.5 px-4">NIK</th>
                        <th className="py-3.5 px-4">Jalur</th>
                        <th className="py-3.5 px-4">Domisili (RT/RW)</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-100 font-medium">
                      {isLoadingData ? (
                        // Skeleton Loader
                        [1, 2, 3, 4].map((n) => (
                          <tr key={n} className="animate-pulse">
                            <td className="py-4 px-4"><div className="h-4 bg-green-50 rounded w-28" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-green-50 rounded w-40" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-green-50 rounded w-24" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-green-50 rounded w-16" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-green-50 rounded w-24" /></td>
                            <td className="py-4 px-4"><div className="h-6 bg-green-50 rounded-full w-20" /></td>
                            <td className="py-4 px-4 text-right"><div className="h-6 bg-green-50 rounded w-16 ml-auto" /></td>
                          </tr>
                        ))
                      ) : filteredRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-500">
                            Tidak ada data pendaftaran yang cocok dengan filter atau kata kunci.
                          </td>
                        </tr>
                      ) : (
                        filteredRegistrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-green-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                              {reg.registrationNo}
                            </td>
                            <td className="py-3.5 px-4 text-slate-900 font-semibold">
                              {reg.studentName}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-500">
                              {reg.nik}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700">
                                {reg.path}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              RT {reg.rt}/RW {reg.rw}, {reg.kelurahan}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                reg.status === 'Diterima'
                                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
                                  : reg.status === 'Diverifikasi'
                                  ? 'bg-green-500/20 text-green-700 border border-green-500/40'
                                  : reg.status === 'Ditolak'
                                  ? 'bg-rose-500/20 text-rose-600 border border-rose-500/40'
                                  : 'bg-amber-400/20 text-amber-700 border border-amber-400/40'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenDetail(reg)}
                                  className="p-1.5 rounded-lg bg-green-600/30 text-green-700 hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                                  title="Lihat Berkas & Verifikasi"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteRegistration(reg.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/20 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                                  title="Hapus Data"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between items-center pt-2">
                  <span>Menampilkan {filteredRegistrations.length} dari {totalCount} data</span>
                  <span>Basis Data SDN Lubang Buaya 04 Pagi</span>
                </div>
              </div>
            )}

            {/* TAB 2: ANALYTICS & GRAPH */}
            {activeTab === 'pendaftaran' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distribution per Jalur Bar Chart */}
                <div className="p-6 rounded-3xl bg-white border border-green-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <span>Distribusi Pendaftar Per Jalur Masuk</span>
                  </h3>

                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Jalur Zonasi Domisili (70% Kuota)</span>
                        <span className="text-amber-600">{zonasiCount} Siswa</span>
                      </div>
                      <div className="h-3 w-full bg-green-50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((zonasiCount / Math.max(totalCount, 1)) * 100, 100)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-amber-400 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Jalur Afirmasi / KJP Plus (20% Kuota)</span>
                        <span className="text-green-600">{afirmasiCount} Siswa</span>
                      </div>
                      <div className="h-3 w-full bg-green-50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((afirmasiCount / Math.max(totalCount, 1)) * 100, 100)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-green-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Jalur Prestasi Akademik/Non (5% Kuota)</span>
                        <span className="text-emerald-600">{prestasiCount} Siswa</span>
                      </div>
                      <div className="h-3 w-full bg-green-50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((prestasiCount / Math.max(totalCount, 1)) * 100, 100)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Jalur Pindah Tugas Orang Tua (5% Kuota)</span>
                        <span className="text-emerald-600">{pindahCount} Siswa</span>
                      </div>
                      <div className="h-3 w-full bg-green-50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((pindahCount / Math.max(totalCount, 1)) * 100, 100)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Ringkasan */}
                <div className="p-6 rounded-3xl bg-white border border-green-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                    Kapasitas Daya Tampung 2 Rombongan Belajar
                  </h3>
                  <div className="p-4 rounded-2xl bg-white border border-green-100 space-y-2 text-xs">
                    <p className="text-slate-500">Total Kuota Maksimal: <strong className="text-slate-900">64 Peserta Didik Baru</strong></p>
                    <p className="text-slate-500">Jumlah Rombel: <strong className="text-slate-900">2 Kelas (Kelas 1-A & 1-B)</strong></p>
                    <p className="text-slate-500">Siswa per Rombel: <strong className="text-slate-900">Maksimal 32 Siswa</strong></p>
                    <p className="text-slate-500">Status Sisa Kursi Tersedia: <strong className="text-emerald-600">{Math.max(64 - acceptedCount, 0)} Kursi</strong></p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-100">
                    <button
                      onClick={() => window.print()}
                      className="w-full py-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Laporan Rekapitulasi PPDB</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAL 1: Detail & Verifikasi Pendaftar */}
      <AnimatePresence>
        {isDetailModalOpen && selectedReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-green-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-green-200 text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-4 border-b border-green-100">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider font-mono">
                    {selectedReg.registrationNo}
                  </span>
                  <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 mt-0.5">
                    {selectedReg.studentName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    NIK: {selectedReg.nik} &bull; Jalur: {selectedReg.path}
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-green-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Data Detail Content */}
              <div className="my-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-green-50 rounded-2xl border border-green-100">
                  <div>
                    <span className="text-slate-500">Orang Tua/Wali:</span>
                    <p className="font-semibold text-slate-900">{selectedReg.parentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Kontak WhatsApp:</span>
                    <p className="font-semibold text-emerald-600 font-mono">{selectedReg.parentPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Tempat, Tgl Lahir:</span>
                    <p className="font-semibold text-slate-900">{selectedReg.birthPlace}, {selectedReg.birthDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Alamat Zonasi:</span>
                    <p className="font-semibold text-slate-900">{selectedReg.address} RT {selectedReg.rt}/RW {selectedReg.rw}</p>
                  </div>
                </div>

                {/* Documents Thumbnail preview */}
                <div>
                  <h4 className="font-bold text-slate-600 uppercase tracking-wider text-[11px] mb-2">
                    Dokumen Berkas Terunggah:
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 rounded-xl bg-white border border-green-100 text-center">
                      <p className="text-[10px] text-slate-500 mb-1">Kartu Keluarga (KK)</p>
                      <DocPreview url={selectedReg.documents.kk} alt="KK" />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-green-100 text-center">
                      <p className="text-[10px] text-slate-500 mb-1">Akta Kelahiran</p>
                      <DocPreview url={selectedReg.documents.akta} alt="Akta" />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-green-100 text-center">
                      <p className="text-[10px] text-slate-500 mb-1">Pas Foto Siswa</p>
                      <DocPreview url={selectedReg.documents.foto} alt="Foto" />
                    </div>
                  </div>
                </div>

                {/* Notes by verifier */}
                <div>
                  <label className="block font-bold text-slate-600 text-[11px] mb-1">
                    Catatan Tim Verifikator Panitia:
                  </label>
                  <textarea
                    rows={2}
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    placeholder="Contoh: Dokumen KK dan Akta sah sesuai kependudukan RT 04."
                    className="w-full p-2.5 rounded-xl bg-white border border-green-200 text-slate-900 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* Status Update Action Buttons */}
              <div className="pt-4 border-t border-green-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                  Status Saat Ini: <strong className="text-amber-700">{selectedReg.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveStatus('Ditolak')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                  >
                    Tolak Berkas
                  </button>

                  <button
                    onClick={() => handleSaveStatus('Diverifikasi')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600/30 text-green-700 hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                  >
                    Verifikasi Berkas
                  </button>

                  <button
                    onClick={() => handleSaveStatus('Diterima')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer shadow-md"
                  >
                    Terima / Lolos
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Tambah Data Pendaftar Manual */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-green-950/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-green-200 text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-4 border-b border-green-100">
                <div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-slate-900">
                    Tambah Data Calon Siswa (Manual)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input pendaftaran langsung oleh panitia sekolah untuk pendaftar offline.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRegistration} className="my-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nama Siswa *</label>
                  <input
                    type="text"
                    required
                    value={newRegForm.studentName}
                    onChange={(e) => setNewRegForm({ ...newRegForm, studentName: e.target.value })}
                    placeholder="Nama calon siswa"
                    className="w-full p-2.5 rounded-xl bg-white border border-green-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">NIK (16 Digit) *</label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={newRegForm.nik}
                      onChange={(e) => setNewRegForm({ ...newRegForm, nik: e.target.value })}
                      placeholder="3175xxxxxxxxxxxx"
                      className="w-full p-2.5 rounded-xl bg-white border border-green-200 text-slate-900 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Jalur Pendaftaran</label>
                    <select
                      value={newRegForm.path}
                      onChange={(e) => setNewRegForm({ ...newRegForm, path: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-white border border-green-200 text-slate-900 text-xs"
                    >
                      <option value="Zonasi">Zonasi</option>
                      <option value="Afirmasi">Afirmasi</option>
                      <option value="Prestasi">Prestasi</option>
                      <option value="Pindah Tugas">Pindah Tugas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nama Orang Tua</label>
                    <input
                      type="text"
                      value={newRegForm.parentName}
                      onChange={(e) => setNewRegForm({ ...newRegForm, parentName: e.target.value })}
                      placeholder="Nama orang tua/wali"
                      className="w-full p-2.5 rounded-xl bg-white border border-green-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">No. WhatsApp</label>
                    <input
                      type="text"
                      value={newRegForm.parentPhone}
                      onChange={(e) => setNewRegForm({ ...newRegForm, parentPhone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full p-2.5 rounded-xl bg-white border border-green-200 text-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-green-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
                  >
                    Simpan Siswa
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  );
};
