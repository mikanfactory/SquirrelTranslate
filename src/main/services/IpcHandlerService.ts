import { ipcMain } from 'electron'
import { ApiKeyService } from './ApiKeyService'
import { TranslationService } from './TranslationService'
import { WordSearchService } from './WordSearchService'
import { saveTranslationLog, getTranslationLogs, databaseService } from '../database/db'

export class IpcHandlerService {
  constructor(
    private apiKeyService: ApiKeyService,
    private translationService: TranslationService,
    private wordSearchService: WordSearchService
  ) {}

  registerHandlers(): void {
    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

    // API key management handlers
    ipcMain.handle('save-api-key', async (_, apiKey) => {
      const result = await this.apiKeyService.saveApiKey(apiKey)
      return result
    })

    ipcMain.handle('get-api-key', async () => {
      const result = this.apiKeyService.getApiKey()
      return result
    })

    // Translation handler
    ipcMain.handle('translate-text', async (_, text, prompt) => {
      return await this.translationService.translateText(text, prompt)
    })

    // Translation logs handlers
    ipcMain.handle('save-translation-log', async (_, sourceText, translatedText) => {
      try {
        const id = await saveTranslationLog(sourceText, translatedText)
        return { success: true, id }
      } catch (error) {
        console.error('Error saving translation log:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    ipcMain.handle('get-translation-logs', async () => {
      try {
        const logs = await getTranslationLogs()
        return { success: true, logs }
      } catch (error) {
        console.error('Error getting translation logs:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    // Word search handlers
    ipcMain.handle('search-word', async (_, japaneseWord) => {
      const result = await this.wordSearchService.searchWord(japaneseWord)

      // If search was successful, save to database
      if (result.success && result.results) {
        try {
          await databaseService.saveWordSearchLog(japaneseWord, JSON.stringify(result.results))
        } catch (dbError) {
          console.error('Failed to save word search log:', dbError)
        }
      }

      return result
    })

    ipcMain.handle('get-word-search-logs', async () => {
      console.log('IPC: get-word-search-logs called')
      try {
        console.log('IPC: Calling databaseService.getWordSearchLogs()')
        const logs = await databaseService.getWordSearchLogs()
        console.log('IPC: Database query completed, logs count:', logs?.length || 0)
        return { success: true, logs }
      } catch (error) {
        console.error('Error getting word search logs:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
  }
}
