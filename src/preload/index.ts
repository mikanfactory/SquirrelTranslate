import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  translateText: (text: string, prompt: string) =>
    ipcRenderer.invoke('translate-text', text, prompt),
  saveTranslationLog: (sourceText: string, translatedText: string) =>
    ipcRenderer.invoke('save-translation-log', sourceText, translatedText),
  getTranslationLogs: () => ipcRenderer.invoke('get-translation-logs'),
  saveApiKey: (apiKey: string) => ipcRenderer.invoke('save-api-key', apiKey),
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  searchWord: (japaneseWord: string) => ipcRenderer.invoke('search-word', japaneseWord),
  getWordSearchLogs: () => ipcRenderer.invoke('get-word-search-logs')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
