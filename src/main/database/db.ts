import { app } from 'electron'
import * as sqlite3 from 'sqlite3'
import * as path from 'path'
import { up as createTranslationLogsTable } from './migrations/001_create_translation_logs'

// Get the user data path for the app
const USER_DATA_PATH = app.getPath('userData')
const DB_PATH = path.join(USER_DATA_PATH, 'squirrel_translate.db')

// Create a new database connection
export function getDbConnection(): sqlite3.Database {
  return new sqlite3.Database(DB_PATH)
}

// Add a function to save a translation log
export function saveTranslationLog(sourceText: string, translatedText: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const db = getDbConnection()
    const stmt = db.prepare(
      'INSERT INTO translation_logs (source_text, translated_text) VALUES (?, ?)'
    )

    stmt.run([sourceText, translatedText], function (err) {
      if (err) {
        db.close()
        reject(err)
        return
      }

      // Return the ID of the inserted record
      const lastID = this.lastID
      db.close()
      resolve(lastID)
    })

    stmt.finalize()
  })
}

// Add a function to get all translation logs
export function getTranslationLogs(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const db = getDbConnection()

    db.all('SELECT * FROM translation_logs ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        db.close()
        reject(err)
        return
      }

      db.close()
      resolve(rows)
    })
  })
}

// Initialize the database and run migrations if needed
export async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Get database connection
      const db = getDbConnection()

      // Check if the translation_logs table exists
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='translation_logs'",
        (err, row) => {
          if (err) {
            console.error('Error checking for table:', err)
            db.close()
            reject(err)
            return
          }

          // If the table doesn't exist, run the migration
          if (!row) {
            console.log('translation_logs table does not exist. Running migrations...')

            db.exec(createTranslationLogsTable, (err) => {
              if (err) {
                console.error('Error running migration:', err)
                db.close()
                reject(err)
                return
              }

              console.log('Migration completed successfully')
              db.close()
              resolve()
            })
          } else {
            console.log('translation_logs table already exists. Skipping migrations.')
            db.close()
            resolve()
          }
        }
      )
    } catch (error) {
      console.error('Error initializing database:', error)
      reject(error)
    }
  })
}

// Close the database connection
export function closeDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
