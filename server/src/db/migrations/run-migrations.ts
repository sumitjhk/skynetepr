import db from '../config';
import { createTables, dropTables } from './001-create-tables';

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    // Drop existing tables (optional - comment out if you want to preserve data)
     await dropTables();
    
    // Create tables
    await createTables();
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations();