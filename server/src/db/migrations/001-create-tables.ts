import db from '../config';

export async function createTables() {
  console.log('Creating tables...');

  // Create users table
  await db.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.enum('role', ['student', 'instructor', 'admin']).notNullable();
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
  });
  console.log('✓ Users table created');

  // Create courses table
  await db.schema.createTable('courses', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('license_type', 50).notNullable();
    table.decimal('total_required_hours', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
  });
  console.log('✓ Courses table created');

  // Create enrollments table
  await db.schema.createTable('enrollments', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('student_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.uuid('course_id').notNullable()
      .references('id').inTable('courses').onDelete('RESTRICT');
    table.date('start_date').notNullable();
    table.enum('status', ['active', 'completed', 'dropped']).notNullable().defaultTo('active');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
    
    table.index('student_id');
    table.index('course_id');
  });
  console.log('✓ Enrollments table created');

  // Create epr_records table
  await db.schema.createTable('epr_records', (table) => {
    table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    table.uuid('person_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.uuid('evaluator_id').notNullable()
      .references('id').inTable('users').onDelete('RESTRICT');
    table.enum('role_type', ['student', 'instructor']).notNullable();
    table.date('period_start').notNullable();
    table.date('period_end').notNullable();
    table.integer('overall_rating').notNullable().checkBetween([1, 5]);
    table.integer('technical_skills_rating').notNullable().checkBetween([1, 5]);
    table.integer('non_technical_skills_rating').notNullable().checkBetween([1, 5]);
    table.text('remarks');
    table.enum('status', ['draft', 'submitted', 'archived']).notNullable().defaultTo('draft');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());
    
    table.index('person_id');
    table.index('evaluator_id');
    table.index('period_start');
    table.index('period_end');
  });
  console.log('✓ EPR Records table created');

  console.log('All tables created successfully!');
}

export async function dropTables() {
  console.log('Dropping tables...');
  
  await db.schema.dropTableIfExists('epr_records');
  await db.schema.dropTableIfExists('enrollments');
  await db.schema.dropTableIfExists('courses');
  await db.schema.dropTableIfExists('users');
  
  console.log('All tables dropped successfully!');
}