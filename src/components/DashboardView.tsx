import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Activity,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { Student, ActivityLog, AttendanceTrendPoint } from '../types';
import { calculateGradeDrop } from '../mockData';

interface DashboardViewProps {
  students: Student[];
  activityLogs: ActivityLog[];
  onSelectStudent: (studentId: string) => void;
  onNavigateToTab: (tab: string) => void;
  attendanceTrends: AttendanceTrendPoint[];
}

export default function DashboardView({
  students,
  activityLogs,
  onSelectStudent,
  onNavigateToTab,
  attendanceTrends
}: DashboardViewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Calculate dynamic metrics
  const totalStudentsInClass = 40; // Total cohort size representation
  const analyzedCount = students.length;
  
  const highRiskStudents = students.filter(s => s.riskLevel === 'High');
  const mediumRiskStudents = students.filter(s => s.riskLevel === 'Medium');
  const lowRiskStudents = students.filter(s => s.riskLevel === 'Low');

  // SVG dimensions for attendance trend graph
  const width = 600;
  const height = 180;
  const padding = 35;

  const minRating = 80; // focus on 80-100% ranges
  const maxRating = 100;
  
  const points = attendanceTrends.map((t, index) => {
    const x = padding + (index * (width - padding * 2)) / (attendanceTrends.length - 1);
    // Inverse scale for SVG coordinate system (y grows downwards)
    const y = height - padding - ((t.attendanceRate - minRating) * (height - padding * 2)) / (maxRating - minRating);
    return { x, y, trend: t };
  });

  // SVG Line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  // SVG Area path for fill gradient
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div id="dashboard-container" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Dasbor</h1>
          <p className="text-slate-500 text-sm mt-1">
            Status deteksi dini risiko dan kesejahteraan emosional siswa kognitif kelas 11-IPA-2.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 text-indigo-700 text-xs font-semibold self-start md:self-auto">
          <Activity className="h-4 w-4 animate-pulse text-indigo-600" />
          <span>Deteksi AI Aktif — Respons Cepat Wilayah</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students Card */}
        <div id="card-total-students" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all hover:bg-slate-50/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-550 text-slate-500 uppercase tracking-wider font-display">Total Siswa</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 font-display">{totalStudentsInClass}</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">({analyzedCount} profil dipantau intensif)</p>
            </div>
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* High Risk Card */}
        <button 
          id="card-high-risk"
          onClick={() => onNavigateToTab('database')}
          className="bg-white rounded-2xl border border-red-150 border-red-100 p-5 shadow-sm transition-all hover:bg-red-50/30 text-left cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider font-display">Risiko Tinggi</p>
              <h3 className="text-3xl font-bold text-red-700 mt-2 font-display">{highRiskStudents.length}</h3>
              <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold mt-1 transition-all group-hover:text-red-700">
                <span>Butuh tindakan segera</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="p-3 bg-red-50 text-red-650 text-red-600 border border-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </button>

        {/* Medium Risk Card */}
        <button 
          id="card-medium-risk"
          onClick={() => onNavigateToTab('database')}
          className="bg-white rounded-2xl border border-amber-150 border-amber-100 p-5 shadow-sm transition-all hover:bg-amber-50/30 text-left cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider font-display">Risiko Sedang</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-2 font-display">{mediumRiskStudents.length}</h3>
              <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold mt-1 transition-all group-hover:text-amber-700">
                <span>Perlu pendampingan</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-650 text-amber-600 border border-amber-100 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </button>

        {/* Low Risk Card */}
        <button 
          id="card-low-risk"
          onClick={() => onNavigateToTab('database')}
          className="bg-white rounded-2xl border border-emerald-150 border-emerald-100 p-5 shadow-sm transition-all hover:bg-emerald-50/30 text-left cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider font-display">Risiko Rendah</p>
              <h3 className="text-3xl font-bold text-emerald-700 mt-2 font-display">{lowRiskStudents.length}</h3>
              <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold mt-1 transition-all group-hover:text-emerald-700">
                <span>Kondisi belajar stabil</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-650 text-emerald-600 border border-emerald-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </button>
      </div>

      {/* Main Grid: Graph + Realtime Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Attendance trend Graph - col-span-3 */}
        <div id="attendance-graph-section" className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-display tracking-tight">Tren Kehadiran Kelas Bulanan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Rata-rata persentase presensi kolektif kelas (Desember - Mei)</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-md font-medium">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>Turun -3.2% Bulan Ini</span>
              </div>
            </div>

            {/* Custom SVG Graph */}
            <div className="relative border border-slate-100 rounded-lg p-2 bg-slate-50/30 mt-3 flex items-center justify-center">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                <defs>
                  {/* Fill Gradient */}
                  <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[80, 85, 90, 95, 100].map((val, idx) => {
                  const y = height - padding - ((val - minRating) * (height - padding * 2)) / (maxRating - minRating);
                  return (
                    <g key={val} className="opacity-40">
                      <line 
                        x1={padding} 
                        y1={y} 
                        x2={width - padding} 
                        y2={y} 
                        stroke="#cbd5e1" 
                        strokeWidth="1" 
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={padding - 8} 
                        y={y + 4} 
                        textAnchor="end" 
                        className="text-[10px] font-mono fill-slate-400"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Area under the curve */}
                <path d={areaPath} fill="url(#gradient-area)" />

                {/* Main line curve */}
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Data Points on the line */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={hoveredPoint === idx ? '6' : '4'} 
                      className={`fill-white stroke-indigo-600 stroke-2 cursor-pointer transition-all duration-150`}
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text 
                      x={p.x} 
                      y={height - 8} 
                      textAnchor="middle" 
                      className="text-[10px] font-medium fill-slate-500"
                    >
                      {p.trend.month}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Tooltip HTML */}
              {hoveredPoint !== null && (
                <div 
                  className="absolute bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg font-medium pointer-events-none z-10"
                  style={{
                    left: `${(points[hoveredPoint].x / width) * 94}%`,
                    top: `${(points[hoveredPoint].y / height) * 65}%`,
                  }}
                >
                  <p className="font-semibold text-indigo-200">{attendanceTrends[hoveredPoint].month}</p>
                  <p className="font-mono mt-0.5">{attendanceTrends[hoveredPoint].attendanceRate}% Kehadiran</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3.5">
            <span>Grafik di-generate real-time berdasarkan input presensi harian.</span>
            <span className="font-mono text-[10px]">Indikator Min: 80% • Max: 100%</span>
          </div>
        </div>

        {/* Realtime Activity Feed - col-span-2 */}
        <div id="activity-feed-section" className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm font-display tracking-tight">Aktivitas & Log Baru</h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">Live Feed</span>
            </div>

            {/* Logs List scroll container */}
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {activityLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Belum ada aktivitas terekam.
                </div>
              ) : (
                activityLogs.map((log) => {
                  let badgeColor = "bg-blue-50 border-blue-100 text-blue-600";
                  if (log.type === 'submit_reflection') {
                    if (log.message.includes('Krisis') || log.message.includes('1/5') || log.message.includes('2/5')) {
                      badgeColor = "bg-rose-50 border-rose-200 text-rose-600";
                    } else if (log.message.includes('Cemas') || log.message.includes('3/5')) {
                      badgeColor = "bg-amber-50 border-amber-200 text-amber-600";
                    } else {
                      badgeColor = "bg-emerald-50 border-emerald-100 text-emerald-600";
                    }
                  } else if (log.type === 'attendance_drop' || log.type === 'grade_update') {
                    badgeColor = "bg-rose-50 border-rose-100 text-rose-600";
                  } else if (log.type === 'intervention_completed') {
                    badgeColor = "bg-emerald-50 border-emerald-100 text-emerald-600";
                  }

                  return (
                    <div key={log.id} className="flex gap-3 text-xs leading-relaxed border-b border-dashed border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div className="mt-0.5 flex-none">
                        <div className={`w-2.5 h-2.5 rounded-full border-2 ${badgeColor.split(" ")[2]} mt-1`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 font-medium">{log.message}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {log.studentId && (
                            <button 
                              onClick={() => onSelectStudent(log.studentId)}
                              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold cursor-pointer text-[11px]"
                            >
                              Lihat Analisis &rarr;
                            </button>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3.5 flex justify-end">
            <button 
              onClick={() => onNavigateToTab('reflect')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer inline-flex items-center gap-1 hover:underline"
            >
              <span>Uji Portal Refleksi Murid</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Guidance Section aligning with UN SDG 4 info */}
      <div id="sdg-guiding-card" className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 font-semibold text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5">
              <span>UN SDG 4 — Quality Education</span>
            </div>
            <h4 className="text-lg font-bold tracking-tight font-display">Deteksi Dini Mengatasi Masalah "Silent Students"</h4>
            <p className="text-slate-350 text-slate-300 text-xs max-w-2xl leading-relaxed">
              Siswa berisiko tinggi sering luput dari perhatian karena mereka tidak disruptif di kelas. Mereka diam-diam jatuh secara akademis dan emosional. Platform Silent Student menganalisis anomali nilai ujian dan rasa cemas di kuesioner refleksi emosi mingguan guna memicu intervensi personal sebelum terlambat.
            </p>
          </div>
          <button 
            onClick={() => onNavigateToTab('database')}
            className="flex-none bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Analisis Siswa Sekarang</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
