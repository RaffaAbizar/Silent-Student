import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BrainCircuit, 
  Calendar, 
  UserCheck, 
  Heart, 
  MessageSquare, 
  UserMinus, 
  Smile, 
  AlertCircle,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  Check,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Student, Intervention } from '../types';
import { calculateGradeDrop } from '../mockData';

interface StudentDetailViewProps {
  student: Student;
  onBack: () => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export default function StudentDetailView({
  student,
  onBack,
  onUpdateStudent
}: StudentDetailViewProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedReflectionIdx, setSelectedReflectionIdx] = useState<number>(student.reflectionAnswers.length - 1);

  const gradeDrop = calculateGradeDrop(student.prevCurGrade, student.curGrade);
  const currentReflection = student.reflectionAnswers[selectedReflectionIdx];

  const months = ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

  // Handle addition of standard intervention actions
  const triggerIntervention = (type: string, notes: string) => {
    const newIntervention: Intervention = {
      id: `int-${Date.now()}`,
      type,
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Scheduled',
      notes
    };

    const updatedStudent: Student = {
      ...student,
      interventions: [newIntervention, ...student.interventions]
    };

    onUpdateStudent(updatedStudent);
    
    setSuccessMessage(`Berhasil menjadwalkan: "${type}" untuk ${student.name}. Log diarsipkan.`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // Translate Feeling Score to emoji/text
  const getFeelingBadge = (score: number) => {
    switch(score) {
      case 5: return { emoji: "🥰", text: "Sangat Bahagia (5/5)", bg: "bg-emerald-50 border-emerald-200 text-emerald-800" };
      case 4: return { emoji: "😊", text: "Stabil / Cukup Baik (4/5)", bg: "bg-teal-50 border-teal-200 text-teal-800" };
      case 3: return { emoji: "😐", text: "Kurang Bersemangat (3/5)", bg: "bg-amber-50 border-amber-200 text-amber-800" };
      case 2: return { emoji: "🙁", text: "Cemas / Sedih (2/5)", bg: "bg-rose-50 border-rose-200 text-rose-800" };
      case 1: return { emoji: "😭", text: "Krisis Emosional (1/5)", bg: "bg-red-50 border-red-300 text-red-900 animate-pulse" };
      default: return { emoji: "😐", text: "Netral", bg: "bg-slate-50 border-slate-200 text-slate-800" };
    }
  };

  return (
    <div id="student-detail-profile" className="space-y-6">
      {/* Top action back button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Database Guru</span>
        </button>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Header Profile Summary Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {student.photoUrl ? (
            <img 
              src={student.photoUrl} 
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200/80 shadow-xs flex-none"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                const sibling = (e.target as HTMLElement).nextElementSibling;
                if (sibling) sibling.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className="hidden w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl uppercase shadow-xs flex-none">
            {student.name.substring(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{student.name}</h2>
              <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-md font-mono px-2 py-0.5">
                {student.studentId}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">Kelas: {student.className} • Wali Kelas: Budi Utomo, M.Pd.</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                student.riskLevel === 'High' 
                  ? 'text-red-700 bg-red-50 border-red-200' 
                  : student.riskLevel === 'Medium' 
                    ? 'text-amber-700 bg-amber-50 border-amber-200' 
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}>
                ● {student.riskLevel === 'High' ? 'Prioritas Tinggi (Kritis)' : student.riskLevel === 'Medium' ? 'Prioritas Sedang (Waspada)' : 'Stabil / Risiko Rendah'}
              </span>
            </div>
          </div>
        </div>

        {/* Rapid Stats */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-3 text-center min-w-[120px]">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Nilai Rapor</p>
            <p className="text-xl font-bold text-slate-800 font-mono mt-0.5">{student.curGrade}</p>
            {gradeDrop > 0 ? (
              <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Turun -{gradeDrop}%</p>
            ) : (
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Stabil</p>
            )}
          </div>
          <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-3 text-center min-w-[120px]">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Kehadiran</p>
            <p className="text-xl font-bold text-slate-800 font-mono mt-0.5">{student.attendanceRate}%</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${
              student.attendanceRate < 85 ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {student.attendanceRate < 85 ? 'Butuh Presensi' : 'Sangat Terjaga'}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-side performance graphs using custom raw Tailwind bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Trends Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-4 font-display tracking-tight">Tren Nilai Akademis Rata-rata Ujian (6 Bulan Terakhir)</h3>
          
          <div className="h-44 flex items-end gap-5 justify-between px-2 pt-6 relative border-b border-slate-200">
            {/* Grid helper lines */}
            <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-slate-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-slate-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-3/2 border-t border-dashed border-slate-100 pointer-events-none" />

            {student.monthlyGrades.map((grade, idx) => {
              // Scale height percentage max representing 100
              const barHeight = `${grade}%`;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative z-5">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 absolute -top-5 bg-slate-900 text-white rounded-sm px-1 py-0.5 text-center transition-opacity">
                    {grade}
                  </div>
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                      grade < 70 
                        ? 'bg-rose-500 hover:bg-rose-600 shadow-sm' 
                        : grade < 80 
                          ? 'bg-amber-500 hover:bg-amber-600 shadow-sm' 
                          : 'bg-indigo-500 hover:bg-indigo-600 shadow-sm'
                    }`}
                    style={{ height: barHeight }}
                  />
                  <div className="text-[11px] font-semibold text-slate-500 mt-2">{months[idx]}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-450 text-slate-400">
            <span>* Skala % nilai ketuntasan (0 - 100)</span>
            <span className="font-medium text-slate-600">Nilai Akhir: {student.curGrade}</span>
          </div>
        </div>

        {/* Attendance Rate Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-4 font-display tracking-tight">Tren Persentase Kehadiran Fisik di Kelas</h3>
          
          <div className="h-44 flex items-end gap-5 justify-between px-2 pt-6 relative border-b border-slate-200">
            {/* Grid helper lines */}
            <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-slate-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-slate-100 pointer-events-none" />

            {student.monthlyAttendance.map((att, idx) => {
              const barHeight = `${att}%`;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative z-5">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 absolute -top-5 bg-slate-900 text-white rounded-sm px-1 py-0.5 text-center transition-opacity">
                    {att}%
                  </div>
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                      att < 85 
                        ? 'bg-rose-450 bg-rose-400 hover:bg-rose-500' 
                        : 'bg-emerald-500 hover:bg-emerald-600'
                    }`}
                    style={{ height: barHeight }}
                  />
                  <div className="text-[11px] font-semibold text-slate-500 mt-2">{months[idx]}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>* Persentase kehadiran kelas wajib</span>
            <span className="font-medium text-slate-600">Rasio Kumulatif: {student.attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* CORE DIAGNOSTIC ENGINE COMPONENT: Dark/Neon display for Gemini Simulation */}
      <div id="ai-cognitive-diagnostic-card" className="bg-slate-950 text-slate-200 rounded-2xl border border-indigo-500/30 p-6 shadow-lg relative overflow-hidden">
        {/* Cyberpunk ambient decorations */}
        <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-44 h-44 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg animate-pulse">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest">Cognitive Core 2.5</span>
                <span className="text-[10px] text-slate-500 font-mono">Disinkronkan 2026</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">AI Cognitive Diagnostic Summary</h3>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-indigo-300 bg-indigo-950 border border-indigo-800/80 rounded-md px-2.5 py-1 font-bold">
              Simulasi AI Gemini (SDG 4 Optimized)
            </span>
          </div>
        </div>

        {/* Diagnostic Fields */}
        {student.diagnosticSummary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-xs">
            {/* Gap Kognitif */}
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <h4 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                Achievement Gap Kognitif
              </h4>
              <p className="leading-relaxed text-slate-300 text-[11px]">
                {student.diagnosticSummary.cognitiveAchievementGap}
              </p>
            </div>

            {/* Indikator Withdrawal */}
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                Indikator Penarikan Diri (Withdrawal)
              </h4>
              <p className="leading-relaxed text-slate-300 text-[11px]">
                {student.diagnosticSummary.withdrawalIndicators}
              </p>
            </div>

            {/* Inferensi Emosi */}
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <h4 className="font-bold text-rose-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                Inferensi Kognisi-Emosional
              </h4>
              <p className="leading-relaxed text-slate-300 text-[11px]">
                {student.diagnosticSummary.emotionalInference}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-550 text-slate-400">
            Dugaan analisis kognitif gagal memproses parameter siswa ini.
          </div>
        )}
      </div>

      {/* AI Sentiment Analysis / Reflection Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reflection Sentiments Feed - col-span-2 */}
        <div id="ai-reflection-feed" className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-display tracking-tight">AI Reflection Form Analysis</h3>
              <p className="text-xs text-slate-500 mt-1">Status ekstraksi emosi & jurnal keluhan mingguan siswa.</p>
            </div>
            
            {/* Timeline selector tabs */}
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-[11px] shrink-0 self-start sm:self-auto select-none">
              {student.reflectionAnswers.map((ref, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedReflectionIdx(idx)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    selectedReflectionIdx === idx 
                      ? 'bg-white text-indigo-700 shadow-3xs' 
                      : 'text-slate-500 hover:text-slate-850'
                  }`}
                >
                  R-{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {currentReflection ? (
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Terbit Jurnal Refleksi:</span>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200/50 px-2.5 py-0.5 rounded-full">
                    {currentReflection.date}
                  </span>
                </div>
                {/* Score badge with specific styling */}
                <div className={`text-xs px-2.5 py-1 rounded-md border font-bold ${getFeelingBadge(currentReflection.feelingScore).bg}`}>
                  <span className="mr-1">{getFeelingBadge(currentReflection.feelingScore).emoji}</span>
                  {getFeelingBadge(currentReflection.feelingScore).text}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Raw Sentiment Message */}
                <div className="space-y-1 bg-white p-3.5 border border-slate-200/80 rounded-lg flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-slate-500 uppercase tracking-wide text-[10px] flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      Ekstrak Sentimen Terkunci (Siswa)
                    </h5>
                    <p className="italic text-slate-700 leading-relaxed text-[11.5px] mt-2">
                      "{currentReflection.weeklySentiment}"
                    </p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-2 block font-medium">Auto-parsed by Natural Language Pipeline</span>
                </div>

                {/* Analytical breakdown */}
                <div className="space-y-3.5">
                  <div className="bg-white p-3.5 border border-slate-200/80 rounded-lg">
                    <h5 className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                      Hambatan Akademis Terbesar (Kurikulum)
                    </h5>
                    <p className="text-slate-800 font-semibold text-xs mt-1.5 leading-relaxed bg-rose-50 border border-rose-100 rounded px-2.5 py-1 inline-block">
                      📚 {currentReflection.learningDifficulty}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 border border-slate-200/80 rounded-lg">
                    <h5 className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                      Status Relasi Sosial & Teman Sebaya
                    </h5>
                    <p className="text-slate-800 text-xs mt-1.5 leading-relaxed">
                      🤝 {currentReflection.peerConnection}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 border border-dashed text-slate-400 text-center text-xs">
              Siswa belum pernah mengirimkan lembar refleksi mingguan.
            </div>
          )}
        </div>

        {/* Quick Action Interventions Recommendation panel */}
        <div id="ai-smart-interventions" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs bg-indigo-50 border border-indigo-150 rounded px-2 py-1 max-w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-bounce" />
              <span>Rekomendasi Pintar AI</span>
            </div>
            
            <h3 className="font-bold text-slate-900 text-sm font-display tracking-tight">Smart Intervention Suggestions</h3>
            <p className="text-xs text-slate-500 mt-1">Intervensi mitigasi risiko spesifik yang aman.</p>

            {/* List of recommended guidelines (from generated diagnostics) */}
            <div className="space-y-2 mt-4">
              {student.diagnosticSummary?.recommendedIntervention.map((rec, idx) => (
                <div key={idx} className="flex gap-2 text-xs leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-slate-200/50 text-slate-700 font-bold inline-flex items-center justify-center text-[10px] flex-none">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700 font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action triggers */}
          <div className="space-y-2 mt-5 border-t border-slate-100 pt-4">
            <button
              onClick={() => triggerIntervention(
                'Jadwalkan Konsultasi 1-on-1 BK',
                'Sesi konseling individual tertutup untuk mengeksplorasi stress akademik dan penurunan nilai.'
              )}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs pointer-events-auto"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Komunikasi 1-on-1 (Guru BK)</span>
            </button>
            <button
              onClick={() => triggerIntervention(
                'Hubungi Wali Siswa (Panggilan)',
                'Koordinasi telepon langsung atau kunjungan orang tua guna menyampaikan pola kehadiran dan asupan nutrisi emosi di rumah.'
              )}
              className="w-full bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs pointer-events-auto"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hubungi Orang Tua / Wali Siswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* History log of executed / scheduled interventions for this student */}
      <div id="intervention-history" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-4 font-display tracking-tight">Riwayat Logging & Penanganan Konseling Siswa ({student.interventions.length})</h3>

        {student.interventions.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl py-8 text-center text-slate-400 text-xs">
            Belum ada dokumentasi intervensi formal untuk {student.name}. Gunakan panel intervensi di atas untuk mengambil tindakan.
          </div>
        ) : (
          <div className="space-y-4">
            {student.interventions.map((int) => (
              <div 
                key={int.id} 
                className="border border-slate-150 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-slate-50/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-800 text-xs md:text-sm">{int.type}</h4>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {int.date}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed mt-1">
                    {int.notes || 'Rincian sesi penguatan psikososial siswa.'}
                  </p>
                </div>

                <div className="flex-none self-start sm:self-auto">
                  <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold border ${
                    int.status === 'Completed' 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                      : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                    {int.status === 'Completed' ? 'Selesai Dilaksanakan' : 'Dijadwalkan / Terkirim'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
