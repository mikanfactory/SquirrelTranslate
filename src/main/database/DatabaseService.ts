import { ConnectionPool } from './ConnectionPool'
import { up as createTranslationLogsTable } from './migrations/001_create_translation_logs'

export interface TranslationLog {
  id: number
  source_text: string
  translated_text: string
  created_at: string
}

export class DatabaseService {
  private connectionPool: ConnectionPool
  private initialized = false

  constructor() {
    this.connectionPool = new ConnectionPool()
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Check if the translation_logs table exists
      const tables = await this.connectionPool.executeQuery<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='translation_logs'"
      )

      // If the table doesn't exist, run the migration
      if (tables.length === 0) {
        console.log('translation_logs table does not exist. Running migrations...')

        await this.connectionPool.executeRun(createTranslationLogsTable)
        console.log('Migration completed successfully')
      } else {
        console.log('translation_logs table already exists. Skipping migrations.')
      }

      this.initialized = true
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  }

  async saveTranslationLog(sourceText: string, translatedText: string): Promise<number> {
    if (!this.initialized) {
      await this.initialize()
    }

    try {
      const result = await this.connectionPool.executeRun(
        'INSERT INTO translation_logs (source_text, translated_text) VALUES (?, ?)',
        [sourceText, translatedText]
      )

      return result.lastID
    } catch (error) {
      console.error('Error saving translation log:', error)
      throw error
    }
  }

  async getTranslationLogs(limit = 100, offset = 0): Promise<TranslationLog[]> {
    if (!this.initialized) {
      await this.initialize()
    }

    try {
      const logs = await this.connectionPool.executeQuery<TranslationLog>(
        'SELECT * FROM translation_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      )

      return logs
    } catch (error) {
      console.error('Error getting translation logs:', error)
      throw error
    }
  }

  async getTranslationLogById(id: number): Promise<TranslationLog | null> {
    if (!this.initialized) {
      await this.initialize()
    }

    try {
      const logs = await this.connectionPool.executeQuery<TranslationLog>(
        'SELECT * FROM translation_logs WHERE id = ?',
        [id]
      )

      return logs.length > 0 ? logs[0] : null
    } catch (error) {
      console.error('Error getting translation log by ID:', error)
      throw error
    }
  }

  async deleteTranslationLog(id: number): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize()
    }

    try {
      const result = await this.connectionPool.executeRun(
        'DELETE FROM translation_logs WHERE id = ?',
        [id]
      )

      return result.changes > 0
    } catch (error) {
      console.error('Error deleting translation log:', error)
      throw error
    }
  }

  async clearAllTranslationLogs(): Promise<number> {
    if (!this.initialized) {
      await this.initialize()
    }

    try {
      const result = await this.connectionPool.executeRun('DELETE FROM translation_logs')

      return result.changes
    } catch (error) {
      console.error('Error clearing translation logs:', error)
      throw error
    }
  }

  async getTranslationLogCount(): Promise<number> {
    if (!this.initialized) {
      await this.initialize()
    }

    try {
      const result = await this.connectionPool.executeQuery<{ count: number }>(
        'SELECT COUNT(*) as count FROM translation_logs'
      )

      return result[0]?.count || 0
    } catch (error) {
      console.error('Error getting translation log count:', error)
      throw error
    }
  }

  async searchTranslationLogs(
    searchTerm: string,
    limit = 50,
    offset = 0
  ): Promise<TranslationLog[]> {
    if (!this.initialized) {
      await this.initialize()
    }

    try {
      const logs = await this.connectionPool.executeQuery<TranslationLog>(
        `SELECT * FROM translation_logs 
         WHERE source_text LIKE ? OR translated_text LIKE ? 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
      )

      return logs
    } catch (error) {
      console.error('Error searching translation logs:', error)
      throw error
    }
  }

  getPoolStatus() {
    return this.connectionPool.getPoolStatus()
  }

  async close(): Promise<void> {
    await this.connectionPool.closeAll()
    this.initialized = false
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()
