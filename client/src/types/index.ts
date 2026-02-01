export interface Person {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  course_name?: string;
  enrollment_status?: string;
  total_eprs_written?: number;
}

export interface EPR {
  id: string;
  person_id: string;
  person_name: string;
  person_role?: string;
  evaluator_id: string;
  evaluator_name: string;
  role_type: 'student' | 'instructor';
  period_start: string;
  period_end: string;
  overall_rating: number;
  technical_skills_rating: number;
  non_technical_skills_rating: number;
  remarks: string;
  status: 'draft' | 'submitted' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CreateEPRData {
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

export interface UpdateEPRData {
  overallRating?: number;
  technicalSkillsRating?: number;
  nonTechnicalSkillsRating?: number;
  remarks?: string;
  status?: 'draft' | 'submitted' | 'archived';
}
