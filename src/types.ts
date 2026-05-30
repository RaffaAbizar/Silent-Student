export interface DiagnosticSummary {
  cognitiveAchievementGap: string;
  withdrawalIndicators: string;
  emotionalInference: string;
  recommendedIntervention: string[];
}

export interface ReflectionAnswer {
  date: string;
  feelingScore: number; // 1-5 scale (1: Sangat Buruk, 5: Sangat Baik)
  weeklySentiment: string;
  learningDifficulty: string;
  peerConnection: string;
}

export interface Intervention {
  id: string;
  type: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Pending';
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  className: string;
  curGrade: number;
  prevCurGrade: number; // to calculate Grade Drop
  attendanceRate: number; // e.g. 82 for 82%
  photoUrl: string;
  monthlyGrades: number[]; // Grades for last 6 months (numbers representing percentages)
  monthlyAttendance: number[]; // Attendance rate for last 6 months
  reflectionAnswers: ReflectionAnswer[];
  interventions: Intervention[];
  riskLevel?: 'High' | 'Medium' | 'Low'; // dynamically calculated or overridden
  diagnosticSummary?: DiagnosticSummary; // dynamically generated based on risk
}

export interface ActivityLog {
  id: string;
  studentId: string;
  studentName: string;
  type: 'submit_reflection' | 'grade_update' | 'attendance_drop' | 'intervention_scheduled' | 'intervention_completed';
  message: string;
  timeAgo: string;
  timestamp: string; // ISO string for sorting
}

export interface AttendanceTrendPoint {
  month: string;
  attendanceRate: number;
}
