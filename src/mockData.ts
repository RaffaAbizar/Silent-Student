import { Student, DiagnosticSummary, ActivityLog, AttendanceTrendPoint } from './types';

export function calculateGradeDrop(prev: number, cur: number): number {
  if (prev <= 0) return 0;
  const drop = ((prev - cur) / prev) * 100;
  return Math.max(0, parseFloat(drop.toFixed(1)));
}

export function determineRiskAndDiagnostic(prevGrade: number, curGrade: number, attendance: number): {
  riskLevel: 'High' | 'Medium' | 'Low';
  diagnosticSummary: DiagnosticSummary;
} {
  const gradeDrop = calculateGradeDrop(prevGrade, curGrade);
  
  // Rule Engine:
  // - High Risk: Grade Drop > 15% OR Attendance < 85%
  // - Medium Risk: Grade Drop 5-15% OR Attendance 85-90%
  // - Low Risk: Else
  
  let riskLevel: 'High' | 'Medium' | 'Low' = 'Low';
  if (gradeDrop > 15 || attendance < 85) {
    riskLevel = 'High';
  } else if ((gradeDrop >= 5 && gradeDrop <= 15) || (attendance >= 85 && attendance <= 90)) {
    riskLevel = 'Medium';
  }

  // Diagnostic content matched by risk
  let diagnosticSummary: DiagnosticSummary;
  if (riskLevel === 'High') {
    diagnosticSummary = {
      cognitiveAchievementGap: "Analisis diagnostik menunjukkan siswa mengalami kesenjangan pencapaian kognitif kritis. Penurunan tajam nilai kumulatif (" + gradeDrop + "%) mengindikasikan ketidakpahaman mendasar pada mata pelajaran inti. Siswa tidak mengajukan pertanyaan di kelas dan menunjukkan gejala penarikan diri kognitif.",
      withdrawalIndicators: "Siswa menunjukkan penarikan diri sosial dan fisik yang parah. Berdasarkan pengamatan, siswa selalu mengalihkan pandangan saat ditanya, jarang berinteraksi dengan teman sebaya di luar kelas, dan berlokasi di baris paling belakang dengan posisi tubuh membungkuk/mengisolasi diri.",
      emotionalInference: "Dugaan kuat stres akademik tingkat tinggi (academic burnout). Refleksi mingguan menunjukkan perasaan tidak berdaya, kecemasan akut menjelang ujian, dan krisis kepercayaan diri yang berat.",
      recommendedIntervention: [
        "Jadwalkan Konsultasi 1-on-1 Akademis secara Empatis dan Tertutup",
        "Buat Rencana Belajar Individual (Individualized Learning Plan) dengan target moderat",
        "Rujuk ke Guru BK (Bimbingan Konseling) untuk penanganan emosional intensif",
        "Hubungi Orang Tua/Wali untuk sinkronisasi dukungan moral di rumah"
      ]
    };
  } else if (riskLevel === 'Medium') {
    diagnosticSummary = {
      cognitiveAchievementGap: "Siswa berada di area transisi risiko kognitif. Terdapat fluktuasi nilai sekitar " + gradeDrop + "% yang disebabkan oleh kelelahan fokal pada topik eksakta tertentu, didukung oleh kehadiran yang mulai tidak konsisten (" + attendance + "%).",
      withdrawalIndicators: "Perilaku defensif tenang (silent performance). Siswa tidak pernah mengganggu pelajaran, patuh, namun sepenuhnya pasif dalam kerja kelompok. Berpotensi 'tidak terlihat' di tengah dinamika kelas.",
      emotionalInference: "Terindikasi memiliki kecemasan sosial ringan hingga sedang. Siswa sangat takut membuat kesalahan di depan umum, kecemasan tersebut menghambat kemampuan mengungkapkan kesulitan belajarnya.",
      recommendedIntervention: [
        "Sertakan dalam Kelompok Belajar Kecil Berkelanjutan (Peer Support Tutor)",
        "Berikan Tanggapan / Feedback Tertulis yang positif di lembar jawaban siswa",
        "Lakukan Check-in Informal singkat di sela pergantian jam pelajaran",
        "Koordinasi preventif dengan orang tua terkait manajemen waktu belajar di rumah"
      ]
    };
  } else {
    diagnosticSummary = {
      cognitiveAchievementGap: "Siswa mempertahankan posisi akademis yang solid dan aman. Fluktuasi nilai (" + gradeDrop + "%) merupakan variasi minor wajar. Pemahaman konseptual berjalan lancar selaras dengan standar ketuntasan minimum.",
      withdrawalIndicators: "Siswa bertipe tenang (introvert produktif). Meskipun minim kontribusi lisan spontan, siswa aktif mendengarkan dengan penuh perhatian dan sangat responsif saat diajak diskusi interaktif terarah.",
      emotionalInference: "Kesejahteraan psikososial stabil. Memiliki motivasi intrinsik tinggi dan mekanisme koping (coping mechanism) yang matang serta adaptif terhadap tekanan tugas.",
      recommendedIntervention: [
        "Berikan apresiasi verbal atas loyalitas belajarnya yang luar biasa",
        "Libatkan dalam program pengayaan (enrichment) mandiri untuk mengoptimalkan potensi",
        "Berdayakan siswa sebagai asisten kelompok kecil secara sukarela untuk melatih kepemimpinan"
      ]
    };
  }

  return { riskLevel, diagnosticSummary };
}

// Initial Mock Students
export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'Andi Saputra',
    studentId: 'NISN00921045',
    className: '11-IPA-2',
    prevCurGrade: 86,
    curGrade: 68, // drop = 20.9% -> High Risk
    attendanceRate: 83, // < 85% -> High Risk
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200&h=200',
    monthlyGrades: [85, 83, 79, 75, 71, 68],
    monthlyAttendance: [96, 92, 89, 87, 85, 83],
    reflectionAnswers: [
      {
        date: '2026-05-12',
        feelingScore: 3,
        weeklySentiment: 'Tugas-tugas terasa berat minggu ini, beberapa materi matematika peminatan saya tidak paham.',
        learningDifficulty: 'Matematika Peminatan (limit fungsi aljabar)',
        peerConnection: 'Baik, mengobrol sewajarnya saja di jam istirahat.'
      },
      {
        date: '2026-05-19',
        feelingScore: 2,
        weeklySentiment: 'Saya merasa sangat lelah dan takut datang ke kelas karena belum menyelesaikan tugas kelompok. Saya merasa tertinggal.',
        learningDifficulty: 'Fisika (termodinamika) dan Matematika',
        peerConnection: 'Kurang baik, saya sering berada di pojok kelas sendirian.'
      },
      {
        date: '2026-05-26',
        feelingScore: 1,
        weeklySentiment: 'Saya bingung dan merasa cemas terus-menerus. Saya merasa tidak memiliki teman diskusi yang mengerti kondisi saya. Saya tidak ingin menyusahkan guru.',
        learningDifficulty: 'Hampir semua pelajaran eksakta terasa sangat berat sekarang',
        peerConnection: 'Saya merasa terisolasi, teman-teman lain sudah memiliki kelompok belajarnya sendiri.'
      }
    ],
    interventions: [
      {
        id: 'int-1',
        type: 'Konseling Akademik BK',
        date: '2026-05-28',
        status: 'Completed',
        notes: 'Sesi perkenalan kritis. Andi mengakui menyembunyikan masalah belajar dari orang tua karena takut mengecewakan. Sangat pendiam di awal, namun mulai terbuka di akhir.'
      }
    ]
  },
  {
    id: 'student-2',
    name: 'Siti Rahma',
    studentId: 'NISN00921072',
    className: '11-IPA-2',
    prevCurGrade: 82,
    curGrade: 73, // drop = 11.0% -> Medium Risk
    attendanceRate: 88, // 85-90% -> Medium Risk
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    monthlyGrades: [81, 80, 82, 78, 76, 73],
    monthlyAttendance: [95, 94, 91, 89, 88, 88],
    reflectionAnswers: [
      {
        date: '2026-05-12',
        feelingScore: 4,
        weeklySentiment: 'Semuanya berjalan baik, hanya sedikit lelah karena ada kegiatan ekstrakurikuler Pramuka.',
        learningDifficulty: 'Tidak ada kesulitan berarti, hanya manajemen waktu harian.',
        peerConnection: 'Sangat baik, aktif berdiskusi.'
      },
      {
        date: '2026-05-19',
        feelingScore: 3,
        weeklySentiment: 'Ada beberapa bab Kimia yang membingungkan. Saya ingin bertanya di kelas tapi merasa malu karena suasananya sangat formal.',
        learningDifficulty: 'Kimia (hidrolisis garam)',
        peerConnection: 'Cukup lancar, sering belajar berdua dengan teman sebangku.'
      },
      {
        date: '2026-05-26',
        feelingScore: 3,
        weeklySentiment: 'Saya merasa cemas nilai saya turun. Saya belajar keras di malam hari tapi saat ujian mendadak buntu. Saya lebih nyaman diam daripada jawab salah.',
        learningDifficulty: 'Kimia (titrasi asam basa)',
        peerConnection: 'Baik, tapi terkadang saya merasa minder dibandingkan kelompok ranking di depan.'
      }
    ],
    interventions: []
  },
  {
    id: 'student-3',
    name: 'Budi Hartono',
    studentId: 'NISN00921105',
    className: '11-IPA-2',
    prevCurGrade: 88,
    curGrade: 87, // drop = 1.1% -> Low Risk
    attendanceRate: 98, // > 90% -> Low Risk
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200',
    monthlyGrades: [86, 88, 87, 89, 87, 87],
    monthlyAttendance: [100, 98, 98, 99, 98, 98],
    reflectionAnswers: [
      {
        date: '2026-05-12',
        feelingScore: 5,
        weeklySentiment: 'Sangat menyukgai topik biologi minggu ini. Senang bisa menyelesaikan tugas proyek lebih cepat.',
        learningDifficulty: 'Tidak ada hambatan',
        peerConnection: 'Sangat baik, sering membantu tutor sebaya.'
      },
      {
        date: '2026-05-19',
        feelingScore: 4,
        weeklySentiment: 'Semua lancar meskipun saya tipe yang lebih senang membaca buku di perpustakaan daripada mengobrol ramai di kantin.',
        learningDifficulty: 'Bahasa Inggris (Passive Voice)',
        peerConnection: 'Mengobrol akrab bersama teman-teman sehobi komputer.'
      },
      {
        date: '2026-05-26',
        feelingScore: 4,
        weeklySentiment: 'Segalanya sesuai jadwal. Saya menjaga nilai agar tetap stabil untuk seleksi rapor SNMPTN mendatang.',
        learningDifficulty: 'Fisika (latihan soal dinamika rotasi)',
        peerConnection: 'Lancar dan hangat.'
      }
    ],
    interventions: []
  }
];

export const DEFAULT_ATTENDANCE_TRENDS: AttendanceTrendPoint[] = [
  { month: 'Des', attendanceRate: 95.8 },
  { month: 'Jan', attendanceRate: 94.2 },
  { month: 'Feb', attendanceRate: 92.5 },
  { month: 'Mar', attendanceRate: 91.0 },
  { month: 'Apr', attendanceRate: 89.6 },
  { month: 'Mei', attendanceRate: 88.0 }
];

export const DEFAULT_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    studentId: 'student-1',
    studentName: 'Andi Saputra',
    type: 'submit_reflection',
    message: 'Andi Saputra mengirimkan jurnal refleksi mingguan ke-3 (Skor Emosi: 1/5 - Krisis)',
    timeAgo: '4 jam yang lalu',
    timestamp: '2026-05-30T03:50:00Z'
  },
  {
    id: 'log-2',
    studentId: 'student-2',
    studentName: 'Siti Rahma',
    type: 'submit_reflection',
    message: 'Siti Rahma menyelesaikan refleksi emosi mingguan (Skor Emosi: 3/5 - Cemas)',
    timeAgo: '1 hari yang lalu',
    timestamp: '2026-05-29T07:15:00Z'
  },
  {
    id: 'log-3',
    studentId: 'student-1',
    studentName: 'Andi Saputra',
    type: 'intervention_scheduled',
    message: 'Pertemuan BK 1-on-1 dijadwal ulang oleh Guru BK',
    timeAgo: '2 hari yang lalu',
    timestamp: '2026-05-28T09:00:00Z'
  },
  {
    id: 'log-4',
    studentId: 'student-3',
    studentName: 'Budi Hartono',
    type: 'submit_reflection',
    message: 'Budi Hartono menyelesaikan refleksi emosi mingguan (Skor Emosi: 4/5 - Stabil)',
    timeAgo: '3 hari yang lalu',
    timestamp: '2026-05-27T08:00:00Z'
  },
  {
    id: 'log-5',
    studentId: 'student-1',
    studentName: 'Andi Saputra',
    type: 'grade_update',
    message: 'Nilai ujian Fisika Andi turun drastis ke 55 (Penurunan kumulatif 20.9%)',
    timeAgo: '4 hari yang lalu',
    timestamp: '2026-05-26T10:00:00Z'
  }
];

export function getProcessedStudents(students: Student[]): Student[] {
  return students.map(student => {
    const { riskLevel, diagnosticSummary } = determineRiskAndDiagnostic(
      student.prevCurGrade,
      student.curGrade,
      student.attendanceRate
    );
    return {
      ...student,
      riskLevel,
      diagnosticSummary
    };
  });
}

// LocalStorage helpers
export function loadStudents(): Student[] {
  const data = localStorage.getItem('silent_student_db');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return getProcessedStudents(parsed);
    } catch (e) {
      console.error("Error parsing localstorage data, fallback to defaults", e);
    }
  }
  // If not present, save and return processed defaults
  const processed = getProcessedStudents(DEFAULT_STUDENTS);
  localStorage.setItem('silent_student_db', JSON.stringify(processed));
  return processed;
}

export function saveStudents(students: Student[]) {
  localStorage.setItem('silent_student_db', JSON.stringify(students));
}

export function loadActivityLogs(): ActivityLog[] {
  const data = localStorage.getItem('silent_student_logs');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing logs, fallback", e);
    }
  }
  localStorage.setItem('silent_student_logs', JSON.stringify(DEFAULT_ACTIVITY_LOGS));
  return DEFAULT_ACTIVITY_LOGS;
}

export function saveActivityLogs(logs: ActivityLog[]) {
  localStorage.setItem('silent_student_logs', JSON.stringify(logs));
}

export function addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp' | 'timeAgo'>) {
  const logs = loadActivityLogs();
  const newLog: ActivityLog = {
    ...log,
    id: `log-${Date.now()}`,
    timeAgo: 'Baru saja',
    timestamp: new Date().toISOString()
  };
  const updated = [newLog, ...logs];
  saveActivityLogs(updated);
  return updated;
}
