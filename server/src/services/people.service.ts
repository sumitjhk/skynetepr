import db from '../db/config';
import { PersonListItem } from '../types/index';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EnrollmentRow {
  student_id: string;
  course_name: string;
  enrollment_status: string;
}

interface EPRCountRow {
  evaluator_id: string;
  total_eprs_written: string | number;
}

export class PeopleService {
  async getPeopleList(role?: string, search?: string): Promise<PersonListItem[]> {
    let query = db('users')
      .select(
        'users.id',
        'users.name',
        'users.email',
        'users.role'
      );

    // Filter by role if provided
    if (role && (role === 'student' || role === 'instructor')) {
      query = query.where('users.role', role);
    }

    // Search by name or email if provided
    if (search) {
      query = query.where(function() {
        this.where('users.name', 'ilike', `%${search}%`)
          .orWhere('users.email', 'ilike', `%${search}%`);
      });
    }

    const users = await query as UserRow[];

    // Get additional data for students
    const studentIds = users
      .filter(u => u.role === 'student')
      .map(u => u.id);
    
    let enrollments: EnrollmentRow[] = [];
    
    if (studentIds.length > 0) {
      enrollments = await db('enrollments')
        .select(
          'enrollments.student_id',
          'courses.name as course_name',
          'enrollments.status as enrollment_status'
        )
        .join('courses', 'enrollments.course_id', 'courses.id')
        .whereIn('enrollments.student_id', studentIds) as EnrollmentRow[];
    }

    // Get additional data for instructors
    const instructorIds = users
      .filter(u => u.role === 'instructor')
      .map(u => u.id);
    
    let instructorEPRCounts: EPRCountRow[] = [];
    
    if (instructorIds.length > 0) {
      instructorEPRCounts = await db('epr_records')
        .select('evaluator_id')
        .count('* as total_eprs_written')
        .whereIn('evaluator_id', instructorIds)
        .groupBy('evaluator_id') as EPRCountRow[];
    }

    // Combine the data
    const result: PersonListItem[] = users.map(user => {
      const baseData: PersonListItem = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      if (user.role === 'student') {
        const enrollment = enrollments.find(e => e.student_id === user.id);
        if (enrollment) {
          baseData.course_name = enrollment.course_name;
          baseData.enrollment_status = enrollment.enrollment_status;
        }
      } else if (user.role === 'instructor') {
        const eprCount = instructorEPRCounts.find(e => e.evaluator_id === user.id);
        baseData.total_eprs_written = eprCount ? parseInt(String(eprCount.total_eprs_written)) : 0;
      }

      return baseData;
    });

    return result;
  }

  async getPersonById(id: string) {
    const user = await db('users').where({ id }).first();
    return user;
  }
}

export default new PeopleService();