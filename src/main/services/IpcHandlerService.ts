import { ipcMain } from 'electron'
import { ApiKeyService } from './ApiKeyService'
import { TranslationService } from './TranslationService'
import { saveTranslationLog, getTranslationLogs } from '../database/db'

export class IpcHandlerService {
  constructor(
    private apiKeyService: ApiKeyService,
    private translationService: TranslationService
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
  }
}