import React, { useState } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Database, 
  HelpCircle,
  BrainCircuit, 
  Clock, 
  ExternalLink,
  GraduationCap,
  Sparkles,
  Menu,
  ChevronRight,
  Info
} from 'lucide-react';

// Types and helper data files
import { Student, ActivityLog, ReflectionAnswer } from './types';
import { 
  loadStudents, 
  saveStudents, 
  loadActivityLogs, 
  saveActivityLogs, 
  addActivityLog,
  getProcessedStudents,
  DEFAULT_ATTENDANCE_TRENDS,
  determineRiskAndDiagnostic
} from './mockData';

// Modular Child Components
import DashboardView from './components/DashboardView';
import StudentDatabaseView from './components/StudentDatabaseView';
import StudentDetailView from './components/StudentDetailView';
import DataInputView from './components/DataInputView';
import StudentPortalView from './components/StudentPortalView';

export default function App() {
  // Main states
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadActivityLogs());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  // Mobile sidebar layout drawer control
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync state functions
  const handleUpdateStudentState = (updatedStudent: Student) => {
    const updatedList = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    const processedList = getProcessedStudents(updatedList);
    setStudents(processedList);
    saveStudents(processedList);

    // If an intervention was added, lets add a nice log!
    const newestIntervention = updatedStudent.interventions[0];
    const prevInterventionCount = students.find(s => s.id === updatedStudent.id)?.interventions.length || 0;
    
    if (newestIntervention && updatedStudent.interventions.length > prevInterventionCount) {
      const typeLabel = newestIntervention.type;
      const message = `Tindakan Terverifikasi: "${typeLabel}" berhasil dijadwalkan untuk ${updatedStudent.name}.`;
      const updatedLogs = addActivityLog({
        studentId: updatedStudent.id,
        studentName: updatedStudent.name,
        type: 'intervention_scheduled',
        message
      });
      setActivityLogs(updatedLogs);
    }
  };

  const handleAddStudent = (newStudentData: {
    name: string;
    studentId: string;
    className: string;
    prevCurGrade: number;
    curGrade: number;
    attendanceRate: number;
    photoUrl: string;
  }) => {
    const step = (newStudentData.curGrade - newStudentData.prevCurGrade) / 5;
    const monthlyGrades = Array.from({ length: 6 }, (_, idx) => 
      Math.round(newStudentData.prevCurGrade + step * idx)
    );

    const monthlyAttendance = Array.from({ length: 6 }, (_, idx) => {
      const fluc = (idx % 2 === 0 ? 1 : -1) * (idx % 3);
      return Math.min(100, Math.max(0, Math.round(newStudentData.attendanceRate + fluc)));
    });

    const newStudent: Student = {
      ...newStudentData,
      id: `student-${Date.now()}`,
      monthlyGrades,
      monthlyAttendance,
      reflectionAnswers: [],
      interventions: []
    };

    const updatedList = [...students, newStudent];
    const processedList = getProcessedStudents(updatedList);
    setStudents(processedList);
    saveStudents(processedList);

    // Log the event
    const message = `Profil baru dibuat: ${newStudent.name} (${newStudent.studentId}) ditambahkan ke kelas Budi Utomo.`;
    const updatedLogs = addActivityLog({
      studentId: newStudent.id,
      studentName: newStudent.name,
      type: 'grade_update',
      message
    });
    setActivityLogs(updatedLogs);
  };

  const handleBulkAddStudents = (bulkInput: {
    name: string;
    studentId: string;
    className: string;
    prevCurGrade: number;
    curGrade: number;
    attendanceRate: number;
  }[]) => {
    const newStudents: Student[] = bulkInput.map((it, idx) => {
      const step = (it.curGrade - it.prevCurGrade) / 5;
      const monthlyGrades = Array.from({ length: 6 }, (_, idX) => 
        Math.round(it.prevCurGrade + step * idX)
      );

      const monthlyAttendance = Array.from({ length: 6 }, (_, idX) => {
        const fluc = (idX % 2 === 0 ? 1 : -1) * (idX % 3);
        const calcVal = Math.round(it.attendanceRate + fluc);
        return Math.min(100, Math.max(0, calcVal));
      });

      return {
        ...it,
        id: `student-bulk-${Date.now()}-${idx}`,
        photoUrl: `https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200&h=200`,
        monthlyGrades,
        monthlyAttendance,
        reflectionAnswers: [],
        interventions: []
      };
    });

    const updatedList = [...students, ...newStudents];
    const processedList = getProcessedStudents(updatedList);
    setStudents(processedList);
    saveStudents(processedList);

    // Log the event
    const message = `Unggah CSV Berhasil: ${newStudents.length} siswa baru diimpor dan dievaluasi secara kognitif.`;
    const updatedLogs = addActivityLog({
      studentId: '',
      studentName: 'Mass Impor',
      type: 'intervention_completed',
      message
    });
    setActivityLogs(updatedLogs);
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updatedList = students.filter(s => s.id !== studentId);
    setStudents(updatedList);
    saveStudents(updatedList);

    const message = `Data siswa ${student.name} berhasil dihapus dari arsip kels.`;
    const updatedLogs = addActivityLog({
      studentId: '',
      studentName: '',
      type: 'attendance_drop',
      message
    });
    setActivityLogs(updatedLogs);

    if (selectedStudentId === studentId) {
      setSelectedStudentId(null);
    }
  };

  // Student portal check-in submission handler
  const handleAddReflection = (studentId: string, answer: ReflectionAnswer) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    const updatedStudent: Student = {
      ...targetStudent,
      reflectionAnswers: [...targetStudent.reflectionAnswers, answer]
    };

    // Calculate risk
    const updatedList = students.map(s => s.id === studentId ? updatedStudent : s);
    const processedList = getProcessedStudents(updatedList);
    setStudents(processedList);
    saveStudents(processedList);

    // Feeling emoji label
    let feelingLabel = "Biasa Saja";
    if (answer.feelingScore === 5) feelingLabel = "Sangat Bahagia (Kondusif)";
    else if (answer.feelingScore === 4) feelingLabel = "Stabil";
    else if (answer.feelingScore === 3) feelingLabel = "Kurang Bersemangat";
    else if (answer.feelingScore === 2) feelingLabel = "Cemas / Sedih";
    else if (answer.feelingScore === 1) feelingLabel = "Krisis Mental";

    // Create system notification inside activity log
    const message = `${targetStudent.name} mengirimkan jurnal refleksi emosi mingguan (Skor Emosi: ${feelingLabel})`;
    const updatedLogs = addActivityLog({
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      type: 'submit_reflection',
      message
    });
    setActivityLogs(updatedLogs);
  };

  // Nav helper
  const navigateToStudentDetail = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab('database');
  };

  // Isolated template route check for student portal (reflect)
  if (activeTab === 'reflect') {
    return (
      <StudentPortalView 
        students={students}
        onAddReflection={handleAddReflection}
        onExitPortal={() => {
          setActiveTab('dashboard');
          setSelectedStudentId(null);
        }}
      />
    );
  }

  // Find currently selected student if in deep dive view
  const activeStudent = selectedStudentId ? students.find(s => s.id === selectedStudentId) : null;

  return (
    <div id="silent-student-app-root" className="min-h-screen bg-slate-50 flex text-slate-800 antialiased font-sans">
      
      {/* Sidebar Navigation - Desktop view */}
      <aside 
        id="app-sidebar"
        className={`bg-slate-900 text-slate-300 w-64 flex flex-col justify-between shrink-0 border-r border-slate-800 transition-all z-20 md:flex fixed md:static inset-y-0 left-0 transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 md:p-6 space-y-6 select-none">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <h2 className="font-bold tracking-tight text-white text-base">Silent Student</h2>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-widest mt-0.5 inline-block font-mono">
                SDG 4 MVP
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2.5 pb-2">Halaman Utama</p>
            
            {/* Dashboard Overview */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedStudentId(null);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-450 text-slate-400 hover:text-slate-105 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5 shrink-0 opacity-80" />
              <span>Dasbor Ringkasan</span>
            </button>

            {/* Student Database */}
            <button
              onClick={() => {
                setActiveTab('database');
                setSelectedStudentId(null);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'database'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-450 text-slate-400 hover:text-slate-105 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Database className="h-4.5 w-4.5 shrink-0 opacity-80" />
              <span>Database Siswa</span>
              {students.filter(s => s.riskLevel === 'High').length > 0 && (
                <span className="ml-auto w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Input Data */}
            <button
              onClick={() => {
                setActiveTab('input');
                setSelectedStudentId(null);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'input'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-450 text-slate-400 hover:text-slate-105 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Users className="h-4.5 w-4.5 shrink-0 opacity-80" />
              <span>Input Data</span>
            </button>
          </nav>

          <nav className="space-y-1">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2.5 pb-2">Uji Kelayakan</p>
            {/* Simulation of student-facing portal */}
            <button
              onClick={() => {
                setActiveTab('reflect');
                setMobileSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-400 hover:text-white hover:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <ExternalLink className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:translate-y-[-1px] group-hover:translate-x-[1px]" />
              <span>Refleksi Mandiri</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Details for SDG4 alignment context */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-indigo-600/10 p-4 rounded-xl border border-indigo-500/20">
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">SDG 4: Quality Education</p>
            <p className="text-xs text-slate-400 leading-relaxed italic">"No student should remain invisible."</p>
          </div>
        </div>
      </aside>

      {/* Background scrim for mobile side drawer */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/50 z-10 md:hidden transition-all duration-200" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Viewport Content block */}
      <div className="flex-1 flex flex-col min-w-0 max-w-7xl mx-auto md:px-4 lg:px-6">
        
        {/* Topbar Layout Display with teacher details */}
        <header id="app-topbar" className="bg-white border-b border-slate-200/80 px-4 py-3.5 flex items-center justify-between pointer-events-auto h-16 shrink-0 md:rounded-b-xl md:shadow-xs mt-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle button */}
            <button 
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-1.5 hover:bg-slate-100 text-slate-650 rounded-lg md:hidden cursor-pointer shrink-0"
              title="Menu navigasi"
            >
              <Menu className="h-6 w-6 text-slate-700" />
            </button>
            
            {/* Current route contextual indicator */}
            <div className="flex items-center gap-1 text-xs select-none">
              <span className="font-bold text-indigo-650 capitalize text-slate-500">Silent Student</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-slate-800 capitalize">
                {activeStudent ? 'Profil Analitis' : activeTab === 'dashboard' ? 'Ringkasan Dasbor' : activeTab === 'database' ? 'Database Kelas' : 'Pendaftaran Siswa'}
              </span>
            </div>
          </div>

          {/* Wali Kelas details display */}
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800">Budi Utomo, M.Pd.</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Wali Kelas 11-IPA-2</p>
            </div>
            {/* Circle badge */}
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
              BU
            </div>
          </div>
        </header>

        {/* Responsive Content Router */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {(() => {
            if (activeTab === 'dashboard') {
              return (
                <DashboardView 
                  students={students}
                  activityLogs={activityLogs}
                  onSelectStudent={navigateToStudentDetail}
                  onNavigateToTab={setActiveTab}
                  attendanceTrends={DEFAULT_ATTENDANCE_TRENDS}
                />
              );
            }
            
            if (activeTab === 'database') {
              // Deep dive view check
              if (activeStudent) {
                return (
                  <StudentDetailView 
                    student={activeStudent}
                    onBack={() => setSelectedStudentId(null)}
                    onUpdateStudent={handleUpdateStudentState}
                  />
                );
              }

              // Default database grid list
              return (
                <StudentDatabaseView 
                  students={students}
                  onSelectStudent={(id) => setSelectedStudentId(id)}
                  onDeleteStudent={handleDeleteStudent}
                  onNavigateToTab={setActiveTab}
                />
              );
            }

            if (activeTab === 'input') {
              return (
                <DataInputView 
                  onAddStudent={handleAddStudent}
                  onBulkAddStudents={handleBulkAddStudents}
                  onNavigateToTab={setActiveTab}
                />
              );
            }

            return null;
          })()}
        </main>
      </div>

    </div>
  );
}
