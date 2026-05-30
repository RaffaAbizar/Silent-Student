import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Trash2, 
  GraduationCap 
} from 'lucide-react';
import { Student } from '../types';
import { calculateGradeDrop } from '../mockData';

interface StudentDatabaseViewProps {
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onDeleteStudent?: (studentId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function StudentDatabaseView({
  students,
  onSelectStudent,
  onDeleteStudent,
  onNavigateToTab
}: StudentDatabaseViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // Filter and search students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.includes(searchQuery) ||
      student.className.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'All') {
      return matchesSearch;
    } else {
      return matchesSearch && student.riskLevel === selectedFilter;
    }
  });

  return (
    <div id="student-database-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Database Siswa</h1>
          <p className="text-slate-500 text-sm mt-1">
            Analisis kondisi akademik, presensi, dan status kerentanan siswa secara komprehensif.
          </p>
        </div>
        <button 
          onClick={() => onNavigateToTab('input')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all pointer-events-auto self-start md:self-auto cursor-pointer"
        >
          + Tambah Profil Siswa
        </button>
      </div>

      {/* Query Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama siswa, nomor induk (NISN), atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-sans"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mr-2 font-display">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            Filter Status Risiko:
          </span>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            {(['All', 'High', 'Medium', 'Low'] as const).map((filter) => {
              let label = "Semua";
              if (filter === 'High') label = "Tinggi 🔴";
              else if (filter === 'Medium') label = "Sedang 🟡";
              else if (filter === 'Low') label = "Rendah 🟢";

              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Database Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Siswa</th>
                <th className="py-3.5 px-4 text-center">Kelas / NISN</th>
                <th className="py-3.5 px-4 text-center">Nilai Rapor (Ujian)</th>
                <th className="py-3.5 px-4 text-center">Tren Drop Nilai</th>
                <th className="py-3.5 px-4 text-center">Tingkat Kehadiran</th>
                <th className="py-3.5 px-4 text-center">Status Kerentanan</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    Tidak ada siswa berisiko {selectedFilter !== 'All' ? `"${selectedFilter}"` : ''} yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const gradeDrop = calculateGradeDrop(student.prevCurGrade, student.curGrade);
                  
                  // Traffic light colors according to specifications
                  let badgeStyles = "text-emerald-700 bg-emerald-50 border-emerald-200";
                  let Icon = CheckCircle2;
                  let levelLabel = "Berisiko Rendah";
                  if (student.riskLevel === 'High') {
                    badgeStyles = "text-red-700 bg-red-50 border-red-200";
                    Icon = AlertCircle;
                    levelLabel = "Berisiko Tinggi";
                  } else if (student.riskLevel === 'Medium') {
                    badgeStyles = "text-amber-700 bg-amber-50 border-amber-200";
                    Icon = AlertTriangle;
                    levelLabel = "Berisiko Sedang";
                  }

                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* Photo + Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {student.photoUrl ? (
                            <img 
                              src={student.photoUrl} 
                              alt={student.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-3xs"
                              onError={(e) => {
                                // Fallback to initial circle
                                (e.target as HTMLElement).style.display = 'none';
                                const sibling = (e.target as HTMLElement).nextElementSibling;
                                if (sibling) sibling.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          {/* Fallback initial circle */}
                          <div className={`hidden w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shadow-3xs`}>
                            {student.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Silent Student Profile</p>
                          </div>
                        </div>
                      </td>

                      {/* Class / ID */}
                      <td className="py-4 px-4 text-center">
                        <p className="font-medium text-slate-700">{student.className}</p>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{student.studentId}</p>
                      </td>

                      {/* Current Grade */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <p className={`font-mono font-bold text-base ${
                            student.curGrade < 70 ? 'text-rose-600' : student.curGrade < 80 ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {student.curGrade}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Sebelumnya: {student.prevCurGrade}</p>
                        </div>
                      </td>

                      {/* Grade Drop Tendency */}
                      <td className="py-4 px-4 text-center">
                        {gradeDrop > 0 ? (
                          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            gradeDrop > 15 ? 'text-rose-700 bg-rose-50' : gradeDrop >= 5 ? 'text-amber-700 bg-amber-50' : 'text-slate-600 bg-slate-50'
                          }`}>
                            <span>-{gradeDrop}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Stabil</span>
                        )}
                      </td>

                      {/* Attendance Rate */}
                      <td className="py-4 px-4 text-center">
                        <p className="font-semibold text-slate-700 font-mono">{student.attendanceRate}%</p>
                        {/* Attendance visual indicator line */}
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mx-auto mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              student.attendanceRate < 85 ? 'bg-rose-500' : student.attendanceRate < 90 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                      </td>

                      {/* Risk Level Badge */}
                      <td className="py-4 px-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyles}`}>
                          <Icon className="h-3.5 w-3.5 flex-none" />
                          <span>{levelLabel}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onSelectStudent(student.id)}
                            className="bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-indigo-700 text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Deep Dive Analysis &rarr;</span>
                          </button>
                          
                          {onDeleteStudent && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus data ${student.name} dari sistem?`)) {
                                  onDeleteStudent(student.id);
                                }
                              }}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-md transition-all cursor-pointer"
                              title="Hapus profil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
