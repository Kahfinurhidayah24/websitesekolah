import { PPDBRegistration } from '../types';

export interface ExportMeta {
  /** Keterangan filter yang sedang aktif, mis. "Status: Diterima • Jalur: Semua". */
  filterLabel: string;
}

const SCHOOL = 'SDN Lubang Buaya 04 Pagi';
const TITLE = `Data Pendaftar PPDB ${SCHOOL}`;

const fmtDate = (d?: string) => {
  if (!d) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : d;
};

const stamp = () => {
  const n = new Date();
  const p = (v: number) => String(v).padStart(2, '0');
  return {
    file: `${n.getFullYear()}${p(n.getMonth() + 1)}${p(n.getDate())}-${p(n.getHours())}${p(n.getMinutes())}`,
    human: n.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
  };
};

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Baris Excel. Semua kolom angka-panjang (NIK, HP) sengaja ditulis sebagai TEKS agar tidak berubah jadi 3,1751E+15. */
export async function buildExcelBlob(rows: PPDBRegistration[]): Promise<Blob> {
  const { default: writeExcelFile } = await import('write-excel-file/universal');

  const head = [
    'No', 'No. Registrasi', 'Nama Calon Siswa', 'NIK Siswa', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Agama',
    'Alamat', 'RT', 'RW', 'Kelurahan', 'Asal Sekolah', 'Nama Orang Tua/Wali', 'NIK Orang Tua', 'No. HP/WhatsApp',
    'Pekerjaan Orang Tua', 'Jalur', 'Jarak (km)', 'Status', 'Catatan Verifikator', 'Tanggal Daftar',
  ];
  const widths = [5, 24, 30, 20, 16, 14, 14, 16, 36, 6, 6, 18, 24, 28, 20, 17, 22, 14, 11, 20, 34, 20];

  const header = head.map((h) => ({ value: h, fontWeight: 'bold' as const, backgroundColor: '#15803d', textColor: '#ffffff' }));
  const txt = (v: unknown) => ({ value: String(v ?? ''), type: String });

  const body = rows.map((r, i) => [
    { value: i + 1, type: Number },
    txt(r.registrationNo), txt(r.studentName), txt(r.nik), txt(r.birthPlace), txt(fmtDate(r.birthDate)), txt(r.gender), txt(r.religion),
    txt(r.address), txt(r.rt), txt(r.rw), txt(r.kelurahan), txt(r.previousSchool), txt(r.parentName), txt(r.parentNik), txt(r.parentPhone),
    txt(r.parentJob), txt(r.path), { value: Number(r.distanceKm) || 0, type: Number, format: '0.00' }, txt(r.status),
    txt(r.verifierNotes), txt(r.createdAt),
  ]);

  return writeExcelFile([header, ...body], {
    sheet: 'Data PPDB',
    columns: widths.map((width) => ({ width })),
    stickyRowsCount: 1,
  } as any).toBlob();
}

export async function exportExcel(rows: PPDBRegistration[]) {
  const blob = await buildExcelBlob(rows);
  saveBlob(blob, `data-ppdb-sdn04-${stamp().file}.xlsx`);
}

export async function buildPdfDoc(rows: PPDBRegistration[], meta: ExportMeta) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const { human } = stamp();

  const count = (s: string) => rows.filter((r) => r.status === s).length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(TITLE.toUpperCase(), 10, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Tahun Ajaran 2026/2027  |  Dicetak: ${human}  |  Filter: ${meta.filterLabel}`, 10, 19);
  doc.text(
    `Total ${rows.length} pendaftar  |  Menunggu: ${count('Menunggu Verifikasi')}  |  Diverifikasi: ${count('Diverifikasi')}  |  Diterima: ${count('Diterima')}  |  Ditolak: ${count('Ditolak')}`,
    10, 24,
  );

  autoTable(doc, {
    startY: 28,
    margin: { left: 10, right: 10, bottom: 14 },
    head: [['No', 'No. Registrasi', 'Nama Calon Siswa', 'NIK', 'L/P', 'Tgl Lahir', 'Orang Tua/Wali', 'No. HP', 'Jalur', 'Status']],
    body: rows.map((r, i) => [
      String(i + 1), r.registrationNo, r.studentName, r.nik, r.gender === 'Perempuan' ? 'P' : 'L', fmtDate(r.birthDate),
      r.parentName, r.parentPhone, r.path, r.status,
    ]),
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 1.6, overflow: 'linebreak' },
    headStyles: { fillColor: [21, 128, 61], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' }, 1: { cellWidth: 36 }, 2: { cellWidth: 48 }, 3: { cellWidth: 33 },
      4: { cellWidth: 9, halign: 'center' }, 5: { cellWidth: 22 }, 6: { cellWidth: 38 }, 7: { cellWidth: 26 },
      8: { cellWidth: 20 }, 9: { cellWidth: 'auto' },
    },
    didDrawPage: () => {
      const w = doc.internal.pageSize.getWidth();
      const h = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(`${SCHOOL} - Dokumen rahasia, hanya untuk panitia PPDB`, 10, h - 6);
      doc.text(`Halaman ${doc.getCurrentPageInfo().pageNumber}`, w - 10, h - 6, { align: 'right' });
      doc.setTextColor(0);
    },
  });

  if (rows.length === 0) {
    doc.setFontSize(10);
    doc.text('Tidak ada data pada filter ini.', 10, 40);
  }
  return doc;
}

export async function exportPdf(rows: PPDBRegistration[], meta: ExportMeta) {
  const doc = await buildPdfDoc(rows, meta);
  doc.save(`data-ppdb-sdn04-${stamp().file}.pdf`);
}
