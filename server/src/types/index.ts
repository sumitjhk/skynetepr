export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: string;
  name: string;
  license_type: string;
  total_required_hours: number;
  created_at: Date;
  updated_at: Date;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  start_date: Date;
  status: 'active' | 'completed' | 'dropped';
  created_at: Date;
  updated_at: Date;
}

export interface EPRRecord {
  id: string;
  person_id: string;
  evaluator_id: string;
  role_type: 'student' | 'instructor';
  period_start: Date;
  period_end: Date;
  overall_rating: number;
  technical_skills_rating: number;
  non_technical_skills_rating: number;
  remarks: string;
  status: 'draft' | 'submitted' | 'archived';
  created_at: Date;
  updated_at: Date;
}

export interface PersonListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  course_name?: string;
  enrollment_status?: string;
  total_eprs_written?: number;
}

export interface CreateEPRRequest {
  personId: string;
  evaluatorId: string;
  roleType: 'student' | 'instructor';
  periodStart: string;
  periodEnd: string;
  overallRating: number;
  technicalSkillsRating: number;
  nonTechnicalSkillsRating: number;
  remarks: string;
  status: 'draft' | 'submitted' | 'archived';
}

export interface UpdateEPRRequest {
  overallRating?: number;
  technicalSkillsRating?: number;
  nonTechnicalSkillsRating?: number;
  remarks?: string;
  status?: 'draft' | 'submitted' | 'archived';
}

export interface AssistRequest {
  overallRating: number;
  technicalSkillsRating: number;
  nonTechnicalSkillsRating: number;
}

export interface AssistResponse {
  suggestedRemarks: string;
}