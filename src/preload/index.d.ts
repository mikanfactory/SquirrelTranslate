import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      translateText: (
        text: string,
        prompt: string
      ) => Promise<{ success: boolean; translatedText: string; error?: string }>
      saveTranslationLog: (
        sourceText: string,
        translatedText: string
      ) => Promise<{ success: boolean; id?: number; error?: string }>
      getTranslationLogs: () => Promise<{ success: boolean; logs?: any[]; error?: string }>
      saveApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>
      getApiKey: () => Promise<{ success: boolean; apiKey?: string; error?: string }>
    }
  }
}
