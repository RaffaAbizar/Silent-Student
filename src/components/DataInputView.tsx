import React, { useState } from 'react';
import { 
  UploadCloud, 
  Database, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Trash2,
  FileText,
  Clock,
  RefreshCw,
  TrendingDown
} from 'lucide-react';
import { Student } from '../types';
import { determineRiskAndDiagnostic } from '../mockData';

export interface NewStudentInput {
  name: string;
  studentId: string;
  className: string;
  prevCurGrade: number;
  curGrade: number;
  attendanceRate: number;
  photoUrl: string;
}

export interface BulkStudentInput {
  name: string;
  studentId: string;
  className: string;
  prevCurGrade: number;
  curGrade: number;
  attendanceRate: number;
}

interface DataInputViewProps {
  onAddStudent: (student: NewStudentInput) => void;
  onBulkAddStudents: (students: BulkStudentInput[]) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function DataInputView({
  onAddStudent,
  onBulkAddStudents,
  onNavigateToTab
}: DataInputViewProps) {
  // Manual Entry States
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    className: '11-IPA-2',
    prevGrade: '',
    curGrade: '',
    attendanceRate: '',
    photoUrl: ''
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Bulk Upload States
  const [isDragging, setIsDragging] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [uploadReport, setUploadReport] = useState<{
    total: number;
    success: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    records: { name: string; id: string; risk: string }[];
  } | null>(null);

  // Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit Manual Entry
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const { name, studentId, className, prevGrade, curGrade, attendanceRate, photoUrl } = formData;

    // Validation
    if (!name.trim()) return setFormError("Nama lengkap siswa wajib diisi.");
    if (!studentId.trim()) return setFormError("Nomor Induk Siswa (NISN) wajib diisi.");
    
    const prev = parseFloat(prevGrade);
    const cur = parseFloat(curGrade);
    const att = parseFloat(attendanceRate);

    if (isNaN(prev) || prev < 0 || prev > 100) {
      return setFormError("Nilai rapor semester lalu harus berupa angka antara 0 - 100.");
    }
    if (isNaN(cur) || cur < 0 || cur > 100) {
      return setFormError("Nilai rata-rata berjalan ujian wajib diisi antara 0 - 100.");
    }
    if (isNaN(att) || att < 0 || att > 100) {
      return setFormError("Tingkat kehadiran kelas wajib berupa persentase antara 0 - 100.");
    }

    // Evaluate Risk Levels via standard rule engine
    const { riskLevel } = determineRiskAndDiagnostic(prev, cur, att);

    onAddStudent({
      name: name.trim(),
      studentId: studentId.trim(),
      className,
      prevCurGrade: prev,
      curGrade: cur,
      attendanceRate: att,
      photoUrl: photoUrl.trim() || `https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200&h=200`
    });

    setFormSuccess(`Siswa "${name}" berhasil didaftarkan! Risiko belajar terhitung otomatis: ${riskLevel === 'High' ? 'Kritis 🔴' : riskLevel === 'Medium' ? 'Waspada 🟡' : 'Aman 🟢'}`);
    
    // Reset Data
    setFormData({
      name: '',
      studentId: '',
      className: '11-IPA-2',
      prevGrade: '',
      curGrade: '',
      attendanceRate: '',
      photoUrl: ''
    });

    setTimeout(() => {
      setFormSuccess(null);
    }, 5000);
  };

  // Drag over handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    triggerSimulation();
  };

  // Simulate CSV Upload function
  const triggerSimulation = () => {
    setIsSimulating(true);
    setUploadReport(null);

    // Dynamic timeout to mimic file parse
    setTimeout(() => {
      const simulatedRawData = [
        {
          name: 'Rangga Wijaya',
          studentId: 'NISN00921118',
          className: '11-IPA-2',
          prevCurGrade: 89,
          curGrade: 70, // drop = 21.3% -> High Risk
          attendanceRate: 81 // < 85% -> High Risk
        },
        {
          name: 'Larasati Putri',
          studentId: 'NISN00921142',
          className: '11-IPA-2',
          prevCurGrade: 80,
          curGrade: 72, // drop = 10.0% -> Medium Risk
          attendanceRate: 87 // 85-90% -> Medium Risk
        },
        {
          name: 'Dimas Setiawan',
          studentId: 'NISN00921190',
          className: '11-IPA-2',
          prevCurGrade: 78,
          curGrade: 77, // drop = 1.3 -> Low Risk
          attendanceRate: 97 // > 90% -> Low Risk
        },
        {
          name: 'Amalia Lestari',
          studentId: 'NISN00921205',
          className: '11-IPA-2',
          prevCurGrade: 94,
          curGrade: 71, // drop = 24.4% -> High Risk
          attendanceRate: 91 // > 90% but drop is severe -> High Risk
        }
      ];

      // Add to main state
      onBulkAddStudents(simulatedRawData);

      // Group for reports
      const auditRecords: { name: string; id: string; risk: string }[] = [];
      let high = 0, med = 0, low = 0;

      simulatedRawData.forEach(item => {
        const { riskLevel } = determineRiskAndDiagnostic(item.prevCurGrade, item.curGrade, item.attendanceRate);
        if (riskLevel === 'High') high++;
        else if (riskLevel === 'Medium') med++;
        else low++;

        auditRecords.push({
          name: item.name,
          id: item.studentId,
          risk: riskLevel === 'High' ? 'Kritis' : riskLevel === 'Medium' ? 'Waspada' : 'Aman'
        });
      });

      setUploadReport({
        total: simulatedRawData.length,
        success: simulatedRawData.length,
        highRisk: high,
        mediumRisk: med,
        lowRisk: low,
        records: auditRecords
      });

      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div id="data-input-container" className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Input & Unggah Data</h1>
        <p className="text-slate-500 text-sm mt-1">
          Daftarkan siswa secara manual atau gunakan fitur unggah CSV massal unuk analisis risiko otomatis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Manual registration form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Database className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base font-display tracking-tight">Registrasi Profil Siswa Manual</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-lg text-[11px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-[11px] flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-slate-600">Nama Lengkap Siswa</label>
              <input 
                type="text" 
                name="name"
                placeholder="Contoh: Andi Saputra"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* NISN & Kelas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-600">Nomor Induk / NISN</label>
                <input 
                  type="text" 
                  name="studentId"
                  placeholder="Contoh: NISN00921000"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-medium font-mono placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600">Kelas Wali</label>
                <select 
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="11-IPA-1">11-IPA-1</option>
                  <option value="11-IPA-2">11-IPA-2</option>
                  <option value="11-IPA-3">11-IPA-3</option>
                  <option value="11-IPS-1">11-IPS-1</option>
                </select>
              </div>
            </div>

            {/* Previous grade + Current Grade + Attendance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-600">Nilai Rapor Lalu (%)</label>
                <input 
                  type="number" 
                  name="prevGrade"
                  placeholder="E.g. 85"
                  min="0"
                  max="100"
                  value={formData.prevGrade}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-medium font-mono placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600">Nilai Berjalan (%)</label>
                <input 
                  type="number" 
                  name="curGrade"
                  placeholder="E.g. 68"
                  min="0"
                  max="100"
                  value={formData.curGrade}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-medium font-mono placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 font-semibold">Kehadiran (%)</label>
                <input 
                  type="number" 
                  name="attendanceRate"
                  placeholder="E.g. 83"
                  min="0"
                  max="100"
                  value={formData.attendanceRate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-medium font-mono placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Photo URL (Optional) */}
            <div className="space-y-1.5">
              <label className="text-slate-600">URL Foto Siswa (Opsional)</label>
              <input 
                type="text" 
                name="photoUrl"
                placeholder="https://example.com/photo.jpg"
                value={formData.photoUrl}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer text-xs pointer-events-auto"
            >
              Simpan & Evaluasi Risiko Belajar
            </button>
          </form>
        </div>

        {/* Drag and drop Bulk Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-h-[352px]">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <UploadCloud className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base font-display tracking-tight">Bulk CSV / Excel Upload Portal</h3>
              </div>
              <p className="text-xs text-slate-500">
                Punya data excel absensi guru BK? Unggah dokumen format (.csv, .xlsx) untuk melakukan import data kelas secara massal dalam hitungan detik.
              </p>

              {/* Upload Dashed Zone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-indigo-600 bg-indigo-50/10' 
                    : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50/50'
                }`}
                onClick={triggerSimulation}
              >
                {isSimulating ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
                    <p className="text-xs font-semibold text-indigo-700">Menganalisis Kolom CSV & Menghitung Kesenjangan Kognitif...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-slate-455 text-slate-400" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">Tarik berkas excel ke sini, atau klik untuk memilih berkas</p>
                      <p className="text-[10px] text-slate-400">Mendukung berkas ekstensi CSV atau Excel (.csv, .xls, .xlsx)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <span className="text-[10px] text-slate-400 font-medium">Demo Mode: Siswa baru otomatis di-assign ke Wali Kelas 11-IPA-2</span>
              <button
                onClick={triggerSimulation}
                className="bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 font-bold text-xs text-indigo-700 px-4 py-2 rounded-lg transition-colors cursor-pointer pointer-events-auto shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 animate-bounce" />
                <span>Simulasikan Unggah Contoh CSV</span>
              </button>
            </div>
          </div>

          {/* Import report results if available */}
          {uploadReport && (
            <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl p-6 shadow-lg animate-fade-in text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-3 h-3 bg-emerald-500 rounded-full" />
                  <h4 className="font-bold text-white text-xs md:text-sm">Laporan Audit Hasil Impor CSV</h4>
                </div>
                <button 
                  onClick={() => onNavigateToTab('database')}
                  className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
                >
                  Buka Database &rarr;
                </button>
              </div>

              {/* Status grid summary */}
              <div className="grid grid-cols-4 gap-2 text-center font-mono py-1 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="py-2">
                  <p className="text-slate-500 text-[10px]">TOTAL ROW</p>
                  <p className="text-base font-bold text-white mt-0.5">{uploadReport.total}</p>
                </div>
                <div className="py-2 border-l border-slate-800">
                  <p className="text-rose-455 text-rose-400 text-[10px]">KRITIS 🔴</p>
                  <p className="text-base font-bold text-white mt-0.5">{uploadReport.highRisk}</p>
                </div>
                <div className="py-2 border-l border-slate-800">
                  <p className="text-amber-455 text-amber-400 text-[10px]">WASPADA 🟡</p>
                  <p className="text-base font-bold text-white mt-0.5">{uploadReport.mediumRisk}</p>
                </div>
                <div className="py-2 border-l border-slate-800">
                  <p className="text-emerald-455 text-emerald-400 text-[10px]">AMAN 🟢</p>
                  <p className="text-base font-bold text-white mt-0.5">{uploadReport.lowRisk}</p>
                </div>
              </div>

              {/* Micro tables review */}
              <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {uploadReport.records.map((r, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded border border-slate-800/50">
                    <span className="font-semibold text-slate-300">{r.name} ({r.id})</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      r.risk === 'Kritis' 
                        ? 'bg-rose-950 text-rose-400' 
                        : r.risk === 'Waspada' 
                          ? 'bg-amber-950 text-amber-400' 
                          : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      {r.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
