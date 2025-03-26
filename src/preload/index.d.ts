import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveTranslationLog: (
        sourceText: string,
        translatedText: string
      ) => Promise<{ success: boolean; id?: number; error?: string }>
      getTranslationLogs: () => Promise<{ success: boolean; logs?: any[]; error?: string }>
    }
  }
}
