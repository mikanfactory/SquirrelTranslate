import { app } from 'electron';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import { up as createTranslationLogsTable } from './migrations/001_create_translation_logs';

// Get the user data path for the app
const USER_DATA_PATH = app.getPath('userData');
const DB_PATH = path.join(USER_DATA_PATH, 'squirrel_translate.db');

// Create a new database connection
export function getDbConnection(): sqlite3.Database {
  return new sqlite3.Database(DB_PATH);
}

// Initialize the database and run migrations if needed
export async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Check if the database file exists
      const dbExists = fs.existsSync(DB_PATH);
      
      // Get database connection
      const db = getDbConnection();
      
      // If the database doesn't exist, run migrations
      if (!dbExists) {
        console.log('Database file does not exist. Running migrations...');
        
        // Run the migration to create the translation_logs table
        db.exec(createTranslationLogsTable, (err) => {
          if (err) {
            console.error('Error running migration:', err);
            db.close();
            reject(err);
            return;
          }
          
          console.log('Migration completed successfully');
          db.close();
          resolve();
        });
      } else {
        console.log('Database already exists. Skipping migrations.');
        db.close();
        resolve();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      reject(error);
    }
  });
}

// Close the database connection
export function closeDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
