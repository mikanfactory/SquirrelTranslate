// Legacy compatibility layer - delegates to DatabaseService
import { databaseService, TranslationLog } from './DatabaseService'

export async function initializeDatabase(): Promise<void> {
  await databaseService.initialize()
}

export async function saveTranslationLog(
  sourceText: string,
  translatedText: string
): Promise<number> {
  return await databaseService.saveTranslationLog(sourceText, translatedText)
}

export async function getTranslationLogs(): Promise<TranslationLog[]> {
  return await databaseService.getTranslationLogs()
}

// Export the service for direct access
export { databaseService }
