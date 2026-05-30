import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  UserCheck, 
  MessageSquare, 
  BookOpen, 
  Users, 
  ArrowLeft,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Lock,
  AlertCircle
} from 'lucide-react';
import { Student, ReflectionAnswer } from '../types';

interface StudentPortalViewProps {
  students: Student[];
  onAddReflection: (studentId: string, answer: ReflectionAnswer) => void;
  onExitPortal: () => void;
}

export default function StudentPortalView({
  students,
  onAddReflection,
  onExitPortal
}: StudentPortalViewProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feelingScore, setFeelingScore] = useState<number>(3);
  const [weeklySentiment, setWeeklySentiment] = useState('');
  const [learningDifficulty, setLearningDifficulty] = useState('');
  const [peerConnection, setPeerConnection] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Feeling choice emoticons data
  const feelings = [
    { value: 1, label: 'Krisis', emoji: '😭', color: 'border-red-300 text-red-655 text-red-600 bg-red-50' },
    { value: 2, label: 'Cemas', emoji: '🙁', color: 'border-rose-300 text-rose-655 text-rose-500 bg-rose-50' },
    { value: 3, label: 'Biasa', emoji: '😐', color: 'border-amber-300 text-amber-655 text-amber-500 bg-amber-50' },
    { value: 4, label: 'Stabil', emoji: '😊', color: 'border-teal-300 text-teal-655 text-teal-600 bg-teal-50' },
    { value: 5, label: 'Bahagia', emoji: '🥰', color: 'border-emerald-300 text-emerald-655 text-emerald-600 bg-emerald-50' }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedStudentId) {
      setErrorMsg("Silakan pilih nama Anda terlebih dahulu.");
      return;
    }
    if (!weeklySentiment.trim()) {
      setErrorMsg("Harap ceritakan sedikit perasaan Anda minggu ini pada kolom keluh kesah.");
      return;
    }
    if (!learningDifficulty.trim()) {
      setErrorMsg("Tuliskan materi pelajaran terberat Anda minggu ini.");
      return;
    }
    if (!peerConnection.trim()) {
      setErrorMsg("Tuliskan gambaran interaksi sosial Anda di kelas.");
      return;
    }

    // Capture response object
    const newReflection: ReflectionAnswer = {
      date: new Date().toISOString().split('T')[0],
      feelingScore,
      weeklySentiment: weeklySentiment.trim(),
      learningDifficulty: learningDifficulty.trim(),
      peerConnection: peerConnection.trim()
    };

    onAddReflection(selectedStudentId, newReflection);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setSelectedStudentId('');
    setFeelingScore(3);
    setWeeklySentiment('');
    setLearningDifficulty('');
    setPeerConnection('');
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 select-none">
      
      {/* Header Banner Mode with Escape Button for teacher testing */}
      <div className="max-w-xl w-full mx-auto bg-slate-900 text-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
          <div>
            <p className="text-xs font-bold text-white tracking-wide">Portal Refleksi Murid — Terisolasi</p>
            <p className="text-[10px] text-slate-400">Gunakan ini untuk simulasi pengisian check-in siswa.</p>
          </div>
        </div>
        <button 
          onClick={onExitPortal}
          className="bg-indigo-600 hover:bg-indigo-505 bg-indigo-650 hover:bg-indigo-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 pointer-events-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Guru</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="max-w-xl w-full mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 md:p-8 mt-6">
        
        {isSubmitted ? (
          /* Confirmation Success Screen */
          <div className="text-center py-8 space-y-6 animate-fade-in flex flex-col items-center">
            <div className="p-4 bg-emerald-50 rounded-full border border-emerald-100 inline-flex">
              <CheckCircle className="h-16 w-16 text-emerald-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">Terima Kasih atas Kejujuranmu!</h2>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                Refleksi emosi mingguanmu berhasil dikirimkan dengan aman dan terenkripsi. Ceritamu berharga untuk membantu mendukung produktivitas belajarmu secara membanggakan.
              </p>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-[11px] text-indigo-800 leading-relaxed max-w-sm flex gap-2">
              <Lock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>Jaminan Privasi:</strong> Curahan hatimu hanya dibagikan secara privat kepada Guru Wali Kelas Anda demi asistensi akademis psikososial murni (Anti SARA / Anti Cyber-Bully).
              </span>
            </div>

            <button
              onClick={handleResetForm}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-xs cursor-pointer pointer-events-auto font-display"
            >
              Kirim Jurnal Refleksi Baru
            </button>
          </div>
        ) : (
          /* Main check-in form details */
          <form onSubmit={handleFormSubmit} className="space-y-6 text-xs font-semibold">
            <div className="text-center space-y-1 select-none">
              <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-bold">
                Check-in Emosi Mingguan
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 font-display">Bagaimana Kabarmu Minggu Ini?</h2>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Ambil waktu 1 menit untuk menceritakan kondisi emosional dan dinamika sosial Anda secara terbuka.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-lg text-[11px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Select Student Name */}
            <div className="space-y-1.5">
              <label className="text-slate-655 text-slate-600 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>1. Pilih Nama Lengkap Anda</span>
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium font-sans focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              >
                <option value="" disabled>-- Pilih Nama Sesuai Absensi Kelas --</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Rate Feeling Score with Smiley buttons */}
            <div className="space-y-2.5">
              <label className="text-slate-655 text-slate-600 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>2. Ekspresi Emosi Terkini</span>
              </label>

              <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                {feelings.map((feel) => {
                  const isChecked = feelingScore === feel.value;
                  return (
                    <button
                      key={feel.value}
                      type="button"
                      onClick={() => setFeelingScore(feel.value)}
                      className={`border-2 rounded-xl p-3.5 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                        isChecked 
                          ? `${feel.color} scale-105 border-indigo-600 ring-2 ring-indigo-600/20` 
                          : 'border-slate-200 text-slate-500 hover:border-slate-350'
                      }`}
                    >
                      <span className="text-2xl">{feel.emoji}</span>
                      <span className="font-bold tracking-tight">{feel.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Sentiment open message */}
            <div className="space-y-1.5">
              <label className="text-slate-655 text-slate-600 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>3. Keluh Kesah Belajarmu Minggu Ini</span>
              </label>
              <textarea
                placeholder="Ceritakan mengapa kamu memberikan skor emosi tersebut? Apa yang membuatmu cemas, lelah, jenuh, atau bahagia minggu ini? Ceritamu aman dan rahasia..."
                value={weeklySentiment}
                onChange={(e) => setWeeklySentiment(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs resize-none"
              />
            </div>

            {/* Step 4: Academic obstacles */}
            <div className="space-y-1.5">
              <label className="text-slate-655 text-slate-600 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>4. Materi Pelajaran Terberat Saat Ini</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Matematika Peminatan (limit fungsi aljabar) / Kimia hidrolisis"
                value={learningDifficulty}
                onChange={(e) => setLearningDifficulty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              />
              <p className="text-[9px] text-slate-400 font-medium">Bantu Guru-mu mengerti topik kognitif spesifik yang masih membosankan / rumit untukmu.</p>
            </div>

            {/* Step 5: Social integration */}
            <div className="space-y-1.5">
              <label className="text-slate-655 text-slate-600 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>5. Keadaan Teman & Diskusi Sosial</span>
              </label>
              <input
                type="text"
                placeholder="Bagaimana hubunganmu dengan teman sekelas? (E.g. Sering menyendiri/Kompak)"
                value={peerConnection}
                onChange={(e) => setPeerConnection(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              />
            </div>

            {/* Submit button wrapper */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-750 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer pointer-events-auto"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Refleksi Aman &rarr;</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Portal Footer credit aligning with SDG 4 goals */}
      <footer className="text-center text-[10px] text-slate-400 mt-6 max-w-sm mx-auto">
        <p>© 2026 Silent Student Platform. Bekerja sama dengan sistem Penjamin Mutu Pendidikan dan Konseling Pendidikan Dasar Berkelanjutan Unsur Terpadu.</p>
      </footer>

    </div>
  );
}
