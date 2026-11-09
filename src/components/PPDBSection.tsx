import React, { useState } from 'react';
import { useContent } from '../lib/content';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  User, 
  Users, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  AlertCircle, 
  Loader2, 
  Printer, 
  Download, 
  QrCode, 
  ShieldCheck,
  Calendar,
  MapPin,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { PPDBRegistration, RegistrationPath } from '../types';
import { api } from '../lib/api';

interface PPDBSectionProps {
  onRegistrationSubmitted: (reg: PPDBRegistration) => void;
  reducedMotion?: boolean;
  onGoToChecker: (regNo: string) => void;
}

export const PPDBSection: React.FC<PPDBSectionProps> = ({
  onRegistrationSubmitted,
  reducedMotion = false,
  onGoToChecker,
}) => {
  const { content } = useContent();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<PPDBRegistration | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    // Step 1: Calon Siswa
    studentName: '',
    nik: '',
    birthPlace: 'Jakarta',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    religion: 'Islam',
    address: '',
    rt: '',
    rw: '',
    kelurahan: '',
    previousSchool: '',

    // Step 2: Data Orang Tua
    parentName: '',
    parentNik: '',
    parentPhone: '',
    parentJob: 'Karyawan Swasta',

    // Step 3: Jalur & Berkas
    path: 'Zonasi' as RegistrationPath,
    distanceKm: 0.5,
    agreeTerms: false,
  });

  // Document Upload Mock Preview States
  const [uploadedFiles, setUploadedFiles] = useState<{
    kk: { name: string; url: string; progress: number; file: File } | null;
    akta: { name: string; url: string; progress: number; file: File } | null;
    foto: { name: string; url: string; progress: number; file: File } | null;
  }>({
    kk: null,
    akta: null,
    foto: null,
  });

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleFileUpload = (type: 'kk' | 'akta' | 'foto', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [type]: 'Ukuran berkas maksimal 3 MB' }));
      e.target.value = '';
      return;
    }

    const mockUrl = URL.createObjectURL(file);
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: { name: file.name, url: mockUrl, progress: 30, file }
    }));

    setTimeout(() => {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: prev[type] ? { ...prev[type]!, progress: 100 } : null
      }));
    }, 400);

    if (errors[type]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[type];
        return copy;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.studentName.trim()) newErrors.studentName = 'Nama calon siswa wajib diisi';
      if (!formData.nik.trim()) {
        newErrors.nik = 'NIK calon siswa wajib diisi';
      } else if (formData.nik.trim().length !== 16) {
        newErrors.nik = 'NIK harus 16 digit angka sesuai Kartu Keluarga';
      }
      if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi';
      if (!formData.address.trim()) newErrors.address = 'Alamat tempat tinggal wajib diisi';
      if (!formData.rt.trim()) newErrors.rt = 'RT wajib diisi';
      if (!formData.rw.trim()) newErrors.rw = 'RW wajib diisi';
      if (!formData.kelurahan.trim()) newErrors.kelurahan = 'Kelurahan / zonasi wajib diisi';
    } else if (step === 2) {
      if (!formData.parentName.trim()) newErrors.parentName = 'Nama orang tua/wali wajib diisi';
      if (!formData.parentNik.trim()) {
        newErrors.parentNik = 'NIK orang tua wajib diisi';
      } else if (formData.parentNik.trim().length !== 16) {
        newErrors.parentNik = 'NIK harus 16 digit';
      }
      if (!formData.parentPhone.trim()) {
        newErrors.parentPhone = 'Nomor telepon/WhatsApp aktif wajib diisi';
      } else if (formData.parentPhone.trim().length < 9) {
        newErrors.parentPhone = 'Nomor telepon tidak valid';
      }
    } else if (step === 3) {
      if (!uploadedFiles.kk) newErrors.kk = 'Kartu Keluarga (KK) wajib diunggah';
      if (!uploadedFiles.akta) newErrors.akta = 'Akta Kelahiran wajib diunggah';
      if (!uploadedFiles.foto) newErrors.foto = 'Pas foto 3x4 wajib diunggah';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'Anda harus menyetujui pernyataan kebenaran data';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSlideDirection('forward');
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setSlideDirection('backward');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit

    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const saved = await api.register(
        {
          studentName: formData.studentName.trim(),
          nik: formData.nik.trim(),
          birthPlace: formData.birthPlace,
          birthDate: formData.birthDate,
          gender: formData.gender,
          religion: formData.religion,
          address: formData.address.trim(),
          rt: formData.rt.trim(),
          rw: formData.rw.trim(),
          kelurahan: formData.kelurahan,
          previousSchool: formData.previousSchool,
          parentName: formData.parentName.trim(),
          parentNik: formData.parentNik.trim(),
          parentPhone: formData.parentPhone.trim(),
          parentJob: formData.parentJob,
          path: formData.path,
        },
        {
          kk: uploadedFiles.kk?.file,
          akta: uploadedFiles.akta?.file,
          foto: uploadedFiles.foto?.file,
        }
      );

      onRegistrationSubmitted(saved);
      setSubmittedData(saved);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#f59e0b', '#22c55e', '#facc15'],
        });
      } catch {
        // abaikan bila animasi tidak didukung
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Pendaftaran gagal dikirim. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsMeta = [
    { num: 1, title: 'Data Calon Siswa', icon: User },
    { num: 2, title: 'Data Orang Tua/Wali', icon: Users },
    { num: 3, title: 'Jalur & Dokumen', icon: FileText },
    { num: 4, title: 'Konfirmasi Akhir', icon: CheckCircle2 },
  ];

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'forward' ? (reducedMotion ? 0 : 50) : (reducedMotion ? 0 : -50),
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'forward' ? (reducedMotion ? 0 : -50) : (reducedMotion ? 0 : 50),
      opacity: 0,
    }),
  };

  const resetForm = () => {
    setSubmittedData(null);
    setCurrentStep(1);
    setFormData({
      studentName: '',
      nik: '',
      birthPlace: 'Jakarta',
      birthDate: '',
      gender: 'Laki-laki',
      religion: 'Islam',
      address: '',
      rt: '',
      rw: '',
      kelurahan: '',
      previousSchool: '',
      parentName: '',
      parentNik: '',
      parentPhone: '',
      parentJob: 'Karyawan Swasta',
      path: 'Zonasi',
      distanceKm: 0.5,
      agreeTerms: false,
    });
    setUploadedFiles({ kk: null, akta: null, foto: null });
  };

  return (
    <section id="ppdb" className="py-24 bg-white text-slate-900 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pendaftaran Resmi Online</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Formulir PPDB Online TA {content.ppdbSettings.academicYear}
          </h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Daftarkan putra-putri Anda secara mudah dan transparan. Ikuti 4 tahapan formulir berikut dan siapkan berkas digital untuk verifikasi.
          </p>
        </div>

        {/* If successfully registered, show Proof Card */}
        {submittedData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100"
          >
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Pendaftaran Berhasil Dikirim
              </span>
              <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-2">
                Tanda Bukti Pendaftaran PPDB
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Simpan atau cetak nomor registrasi ini untuk pengecekan status verifikasi sekolah.
              </p>
            </div>

            {/* Registration Card Specs */}
            <div className="my-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Nomor Registrasi Resmi</p>
                <p className="text-xl font-mono font-black text-green-700 tracking-wide mt-0.5">
                  {submittedData.registrationNo}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Jalur Pendaftaran</p>
                <p className="text-base font-bold text-slate-800 mt-0.5">
                  Jalur {submittedData.path}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Nama Calon Siswa</p>
                <p className="text-base font-bold text-slate-800 mt-0.5">
                  {submittedData.studentName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">NIK Calon Siswa</p>
                <p className="text-base font-mono text-slate-700 mt-0.5">
                  {submittedData.nik}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Nama Orang Tua / Wali</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {submittedData.parentName} ({submittedData.parentPhone})
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Status Saat Ini</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mt-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  {submittedData.status}
                </span>
              </div>
            </div>

            {/* Actions: Print, Check Status, Register Another */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Tanda Terima</span>
              </button>

              <button
                onClick={() => onGoToChecker(submittedData.registrationNo)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Lacak Status Verifikasi</span>
              </button>

              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Daftar Siswa Lain &rarr;
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            
            {/* Progress Stepper Bar */}
            <div className="mb-10">
              <div className="grid grid-cols-4 gap-2">
                {stepsMeta.map((s) => {
                  const Icon = s.icon;
                  const isDone = s.num < currentStep;
                  const isActive = s.num === currentStep;

                  return (
                    <div key={s.num} className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : isActive
                            ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 shadow-lg shadow-amber-400/25 scale-105'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isDone ? <Check className="w-5 h-5 font-black" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-semibold mt-2.5 line-clamp-1 ${
                        isActive ? 'text-amber-700' : isDone ? 'text-emerald-700' : 'text-slate-500'
                      }`}>
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400"
                  initial={false}
                  animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step Content with Slide Transitions */}
            <form onSubmit={handleSubmit}>
              {submitError && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              <AnimatePresence custom={slideDirection} mode="wait">
                
                {/* STEP 1: Data Calon Siswa */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-200 pb-3 mb-4">
                      <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                        <User className="w-5 h-5 text-amber-500" />
                        <span>Langkah 1: Identitas Calon Siswa</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Masukkan identitas anak sesuai data pada Akta Kelahiran dan Kartu Keluarga (KK).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Nama Lengkap Calon Siswa <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          placeholder="Contoh: Muhammad Rizky Pratama"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all"
                        />
                        {errors.studentName && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.studentName}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          NIK Calon Siswa (16 Digit) <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="nik"
                          maxLength={16}
                          value={formData.nik}
                          onChange={handleInputChange}
                          placeholder="317506xxxxxxxxxx"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-mono text-sm transition-all"
                        />
                        {errors.nik && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.nik}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Jenis Kelamin <span className="text-rose-600">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Tempat Lahir <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="birthPlace"
                          value={formData.birthPlace}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Tanggal Lahir <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all"
                        />
                        {errors.birthDate && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.birthDate}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Agama <span className="text-rose-600">*</span>
                        </label>
                        <select
                          name="religion"
                          value={formData.religion}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all"
                        >
                          <option value="Islam">Islam</option>
                          <option value="Kristen Protestan">Kristen Protestan</option>
                          <option value="Katolik">Katolik</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Konghucu">Konghucu</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Asal TK / PAUD Sebelumnya (Opsional)
                        </label>
                        <input
                          type="text"
                          name="previousSchool"
                          value={formData.previousSchool}
                          onChange={handleInputChange}
                          placeholder="Nama TK atau PAUD asal"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Alamat Domisili Sesuai KK <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Jl. Monumen Pancasila Sakti No. ..."
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                        />
                        {errors.address && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.address}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          RT / RW <span className="text-rose-600">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="rt"
                            value={formData.rt}
                            onChange={handleInputChange}
                            placeholder="RT (04)"
                            maxLength={3}
                            className="w-1/2 px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-center text-sm focus:ring-2 focus:ring-amber-400"
                          />
                          <input
                            type="text"
                            name="rw"
                            value={formData.rw}
                            onChange={handleInputChange}
                            placeholder="RW (06)"
                            maxLength={3}
                            className="w-1/2 px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-center text-sm focus:ring-2 focus:ring-amber-400"
                          />
                        </div>
                        {(errors.rt || errors.rw) && (
                          <p className="text-xs text-rose-600 mt-1">RT dan RW wajib diisi.</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Kelurahan / Zonasi Sekolah <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="kelurahan"
                          value={formData.kelurahan}
                          onChange={handleInputChange}
                          placeholder="Contoh: Lubang Buaya"
                          maxLength={80}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all"
                        />
                        {errors.kelurahan && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.kelurahan}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Data Orang Tua / Wali */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-200 pb-3 mb-4">
                      <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-400" />
                        <span>Langkah 2: Data Orang Tua / Wali Siswa</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Digunakan untuk konfirmasi pemanggilan wawancara zonasi dan notifikasi kelulusan via WhatsApp/SMS.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Nama Lengkap Ayah / Ibu / Wali <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          placeholder="Nama lengkap sesuai KTP"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                        />
                        {errors.parentName && (
                          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.parentName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          NIK Orang Tua / Wali <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="parentNik"
                          maxLength={16}
                          value={formData.parentNik}
                          onChange={handleInputChange}
                          placeholder="317506xxxxxxxxxx"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 font-mono text-sm focus:ring-2 focus:ring-amber-400"
                        />
                        {errors.parentNik && (
                          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.parentNik}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          No. WhatsApp / Telepon Aktif <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="tel"
                          name="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleInputChange}
                          placeholder="0812xxxxxxxx"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 font-mono text-sm focus:ring-2 focus:ring-amber-400"
                        />
                        {errors.parentPhone && (
                          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.parentPhone}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Pekerjaan Orang Tua / Wali
                        </label>
                        <select
                          name="parentJob"
                          value={formData.parentJob}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-400"
                        >
                          <option value="Karyawan Swasta">Karyawan Swasta</option>
                          <option value="Wiraswasta / Pedagang">Wiraswasta / Pedagang</option>
                          <option value="PNS / TNI / Polri">PNS / TNI / Polri</option>
                          <option value="Pegawai BUMN / BUMD">Pegawai BUMN / BUMD</option>
                          <option value="Buruh Harian Lepas">Buruh Harian Lepas</option>
                          <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Jalur & Unggah Dokumen */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <span>Langkah 3: Jalur Seleksi & Berkas Pendukung</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pilih jalur PPDB dan unggah foto/scan berkas asli dengan jelas (format JPG, PNG, atau PDF).
                      </p>
                    </div>

                    {/* Jalur Selection Radio Cards */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Pilih Jalur Pendaftaran PPDB <span className="text-rose-600">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { path: 'Zonasi' as RegistrationPath, title: 'Jalur Zonasi Domisili', desc: 'Prioritas jarak RT/RW terdekat sekolah di Lubang Buaya' },
                          { path: 'Afirmasi' as RegistrationPath, title: 'Jalur Afirmasi', desc: 'Pemegang KJP Plus, PIP, atau keluarga pra-sejahtera' },
                          { path: 'Prestasi' as RegistrationPath, title: 'Jalur Prestasi', desc: 'Sertifikat juara akademik / seni / olahraga minimal tingkat kota' },
                          { path: 'Pindah Tugas' as RegistrationPath, title: 'Pindah Tugas Orang Tua', desc: 'Surat penugasan resmi instansi / kedinasan orang tua' },
                        ].map((j) => (
                          <div
                            key={j.path}
                            onClick={() => setFormData(prev => ({ ...prev, path: j.path }))}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              formData.path === j.path
                                ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                                : 'bg-slate-50 border-slate-200 hover:border-green-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{j.title}</span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                formData.path === j.path ? 'border-amber-400 bg-amber-400' : 'border-slate-400'
                              }`}>
                                {formData.path === j.path && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">{j.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upload Inputs with Preview & Simulated Progress */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Unggah Berkas Persyaratan (Wajib):
                      </h4>

                      {/* 1. Kartu Keluarga */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Kartu Keluarga (KK) Asli</p>
                              <p className="text-[11px] text-slate-500">Pastikan NIK dan nama calon siswa terbaca jelas</p>
                            </div>
                          </div>

                          <label className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer flex items-center justify-center gap-1.5 transition-colors shrink-0">
                            <Upload className="w-3.5 h-3.5 text-white" />
                            <span>{uploadedFiles.kk ? 'Ganti Berkas' : 'Pilih File KK'}</span>
                            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload('kk', e)} />
                          </label>
                        </div>

                        {uploadedFiles.kk && (
                          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-emerald-700">
                            <span className="truncate max-w-xs">{uploadedFiles.kk.name}</span>
                            <span className="font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil Diunggah
                            </span>
                          </div>
                        )}
                        {errors.kk && <p className="text-xs text-rose-600 mt-1">{errors.kk}</p>}
                      </div>

                      {/* 2. Akta Kelahiran */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Akta Kelahiran Siswa</p>
                              <p className="text-[11px] text-slate-500">Bukti tanggal lahir dan orang tua kandung</p>
                            </div>
                          </div>

                          <label className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer flex items-center justify-center gap-1.5 transition-colors shrink-0">
                            <Upload className="w-3.5 h-3.5 text-white" />
                            <span>{uploadedFiles.akta ? 'Ganti Berkas' : 'Pilih File Akta'}</span>
                            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload('akta', e)} />
                          </label>
                        </div>

                        {uploadedFiles.akta && (
                          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-emerald-700">
                            <span className="truncate max-w-xs">{uploadedFiles.akta.name}</span>
                            <span className="font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil Diunggah
                            </span>
                          </div>
                        )}
                        {errors.akta && <p className="text-xs text-rose-600 mt-1">{errors.akta}</p>}
                      </div>

                      {/* 3. Pas Foto 3x4 */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Pas Foto Calon Siswa (3x4)</p>
                              <p className="text-[11px] text-slate-500">Latar merah/biru, berpakaian rapi / seragam TK</p>
                            </div>
                          </div>

                          <label className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer flex items-center justify-center gap-1.5 transition-colors shrink-0">
                            <Upload className="w-3.5 h-3.5 text-white" />
                            <span>{uploadedFiles.foto ? 'Ganti Foto' : 'Pilih Pas Foto'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('foto', e)} />
                          </label>
                        </div>

                        {uploadedFiles.foto && (
                          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-emerald-700">
                            <span className="truncate max-w-xs">{uploadedFiles.foto.name}</span>
                            <span className="font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil Diunggah
                            </span>
                          </div>
                        )}
                        {errors.foto && <p className="text-xs text-rose-600 mt-1">{errors.foto}</p>}
                      </div>
                    </div>

                    {/* Agreement terms */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }));
                            if (errors.agreeTerms) setErrors(prev => ({ ...prev, agreeTerms: '' }));
                          }}
                          className="mt-0.5 w-4 h-4 rounded text-green-600 focus:ring-amber-400 border-slate-400 bg-white"
                        />
                        <span className="text-xs text-slate-700 leading-relaxed">
                          Saya menyatakan dengan sebenar-benarnya bahwa seluruh data dan dokumen yang saya unggah adalah sah, benar, dan dapat dipertanggungjawabkan sesuai ketentuan panitia PPDB SDN Lubang Buaya 04 Pagi.
                        </span>
                      </label>
                      {errors.agreeTerms && (
                        <p className="text-xs text-rose-600 mt-1">{errors.agreeTerms}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Konfirmasi Ringkasan Data */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-200 pb-3 mb-4">
                      <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Langkah 4: Konfirmasi & Kirim Pendaftaran</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Periksa kembali kebenaran seluruh data sebelum mengirimkan pendaftaran ke basis data sekolah.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">Jalur Pendaftaran:</span>
                        <span className="font-bold text-amber-700">Jalur {formData.path}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">Nama Calon Siswa:</span>
                        <span className="font-bold text-slate-900">{formData.studentName}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">NIK Siswa:</span>
                        <span className="font-mono text-slate-900">{formData.nik}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">Tempat, Tgl Lahir:</span>
                        <span className="text-slate-900">{formData.birthPlace}, {formData.birthDate}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">Alamat Domisili:</span>
                        <span className="text-slate-900 text-right max-w-xs">{formData.address} RT {formData.rt}/RW {formData.rw}, {formData.kelurahan}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">Nama Orang Tua/Wali:</span>
                        <span className="text-slate-900">{formData.parentName}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">No. WhatsApp:</span>
                        <span className="font-mono text-emerald-700">{formData.parentPhone}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Kelengkapan Berkas:</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 3 Dokumen Terunggah
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Navigation Actions */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Lanjutkan Tahap {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kirim Formulir Pendaftaran</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

          </div>
        )}

      </div>
    </section>
  );
};
