import db from '../config';

async function seed() {
  try {
    console.log('Starting seed...');

    // Insert Instructors (2-3)
    const instructors = await db('users').insert([
      {
        name: 'Captain James Wilson',
        email: 'james.wilson@airman.com',
        role: 'instructor'
      },
      {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@airman.com',
        role: 'instructor'
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@airman.com',
        role: 'instructor'
      }
    ]).returning('*');
    console.log(`✓ Created ${instructors.length} instructors`);

    // Insert Students (6-10)
    const students = await db('users').insert([
      {
        name: 'Emma Thompson',
        email: 'emma.thompson@student.com',
        role: 'student'
      },
      {
        name: 'Liam Parker',
        email: 'liam.parker@student.com',
        role: 'student'
      },
      {
        name: 'Olivia Martinez',
        email: 'olivia.martinez@student.com',
        role: 'student'
      },
      {
        name: 'Noah Anderson',
        email: 'noah.anderson@student.com',
        role: 'student'
      },
      {
        name: 'Sophia White',
        email: 'sophia.white@student.com',
        role: 'student'
      },
      {
        name: 'Ethan Brown',
        email: 'ethan.brown@student.com',
        role: 'student'
      },
      {
        name: 'Ava Davis',
        email: 'ava.davis@student.com',
        role: 'student'
      },
      {
        name: 'Mason Taylor',
        email: 'mason.taylor@student.com',
        role: 'student'
      }
    ]).returning('*');
    console.log(`✓ Created ${students.length} students`);

    // Insert Admin
    const admin = await db('users').insert([
      {
        name: 'Admin User',
        email: 'admin@airman.com',
        role: 'admin'
      }
    ]).returning('*');
    console.log(`✓ Created admin user`);

    // Insert Courses (1-2)
    const courses = await db('courses').insert([
      {
        name: 'Private Pilot License (PPL)',
        license_type: 'PPL',
        total_required_hours: 45
      },
      {
        name: 'Commercial Pilot License (CPL) Integrated',
        license_type: 'CPL',
        total_required_hours: 200
      },
      {
        name: 'Airline Transport Pilot License (ATPL)',
        license_type: 'ATPL',
        total_required_hours: 1500
      }
    ]).returning('*');
    console.log(`✓ Created ${courses.length} courses`);

    // Create Enrollments
    const enrollments = await db('enrollments').insert([
      {
        student_id: students[0].id,
        course_id: courses[0].id,
        start_date: '2024-01-15',
        status: 'active'
      },
      {
        student_id: students[1].id,
        course_id: courses[1].id,
        start_date: '2024-02-01',
        status: 'active'
      },
      {
        student_id: students[2].id,
        course_id: courses[0].id,
        start_date: '2023-11-10',
        status: 'completed'
      },
      {
        student_id: students[3].id,
        course_id: courses[1].id,
        start_date: '2024-03-01',
        status: 'active'
      },
      {
        student_id: students[4].id,
        course_id: courses[2].id,
        start_date: '2023-09-01',
        status: 'active'
      },
      {
        student_id: students[5].id,
        course_id: courses[0].id,
        start_date: '2024-01-20',
        status: 'dropped'
      },
      {
        student_id: students[6].id,
        course_id: courses[1].id,
        start_date: '2023-12-01',
        status: 'active'
      },
      {
        student_id: students[7].id,
        course_id: courses[0].id,
        start_date: '2024-02-15',
        status: 'active'
      }
    ]).returning('*');
    console.log(`✓ Created ${enrollments.length} enrollments`);

    // Create EPR Records
    const eprRecords = await db('epr_records').insert([
      // Student EPRs
      {
        person_id: students[0].id,
        evaluator_id: instructors[0].id,
        role_type: 'student',
        period_start: '2024-01-15',
        period_end: '2024-04-15',
        overall_rating: 4,
        technical_skills_rating: 4,
        non_technical_skills_rating: 4,
        remarks: 'Emma shows excellent understanding of flight principles and demonstrates good situational awareness. Continue to work on radio communications.',
        status: 'submitted'
      },
      {
        person_id: students[0].id,
        evaluator_id: instructors[1].id,
        role_type: 'student',
        period_start: '2024-04-16',
        period_end: '2024-07-16',
        overall_rating: 5,
        technical_skills_rating: 5,
        non_technical_skills_rating: 4,
        remarks: 'Outstanding progress. Emma has mastered all basic maneuvers and is ready for solo cross-country flights. Excellent checklist discipline.',
        status: 'submitted'
      },
      {
        person_id: students[1].id,
        evaluator_id: instructors[0].id,
        role_type: 'student',
        period_start: '2024-02-01',
        period_end: '2024-05-01',
        overall_rating: 3,
        technical_skills_rating: 3,
        non_technical_skills_rating: 4,
        remarks: 'Liam shows good potential but needs more practice with emergency procedures. Communication skills are strong. Recommend additional simulator time.',
        status: 'submitted'
      },
      {
        person_id: students[2].id,
        evaluator_id: instructors[2].id,
        role_type: 'student',
        period_start: '2023-11-10',
        period_end: '2024-02-10',
        overall_rating: 5,
        technical_skills_rating: 5,
        non_technical_skills_rating: 5,
        remarks: 'Olivia completed all requirements with excellence. Exceptional airmanship and decision-making skills. Ready for checkride.',
        status: 'submitted'
      },
      {
        person_id: students[3].id,
        evaluator_id: instructors[1].id,
        role_type: 'student',
        period_start: '2024-03-01',
        period_end: '2024-06-01',
        overall_rating: 4,
        technical_skills_rating: 4,
        non_technical_skills_rating: 3,
        remarks: 'Noah demonstrates solid technical skills. Work on CRM and crew coordination. Good progress overall.',
        status: 'draft'
      },
      // Instructor EPRs
      {
        person_id: instructors[1].id,
        evaluator_id: admin[0].id,
        role_type: 'instructor',
        period_start: '2024-01-01',
        period_end: '2024-06-30',
        overall_rating: 5,
        technical_skills_rating: 5,
        non_technical_skills_rating: 5,
        remarks: 'Sarah continues to be an exemplary instructor. Student feedback is consistently positive. Excellent safety culture promotion.',
        status: 'submitted'
      },
      {
        person_id: instructors[0].id,
        evaluator_id: admin[0].id,
        role_type: 'instructor',
        period_start: '2024-01-01',
        period_end: '2024-06-30',
        overall_rating: 4,
        technical_skills_rating: 5,
        non_technical_skills_rating: 4,
        remarks: 'Captain Wilson maintains high standards and produces well-trained students. Recommend working on time management for ground briefings.',
        status: 'submitted'
      }
    ]).returning('*');
    console.log(`✓ Created ${eprRecords.length} EPR records`);

    console.log('\n✅ Seed completed successfully!');
    console.log(`Total users: ${instructors.length + students.length + admin.length}`);
    console.log(`Total courses: ${courses.length}`);
    console.log(`Total enrollments: ${enrollments.length}`);
    console.log(`Total EPR records: ${eprRecords.length}`);

  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

seed();