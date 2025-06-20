export interface TranslationRecord {
  id: string
  timestamp: string
  sourceText: string
  translatedText: string
}

export interface ApiResult {
  success: boolean
  error?: string
  [key: string]: any
}

export interface TranslationResult extends ApiResult {
  translatedText?: string
}

export interface ApiKeyResult extends ApiResult {
  apiKey?: string
}

export interface TranslationLogsResult extends ApiResult {
  logs?: Array<{
    id: number
    source_text: string
    translated_text: string
    created_at: string
  }>
}

export interface WordSearchResult {
  englishWord: string
  meaning: string
  examples: string[]
}

export interface WordSearchRecord {
  id: string
  timestamp: string
  japaneseWord: string
  results: WordSearchResult[]
}

export interface WordSearchLogsResult extends ApiResult {
  logs?: Array<{
    id: number
    japanese_word: string
    search_result: string
    created_at: string
  }>
}

export type TabType = 'translate' | 'history' | 'settings' | 'word-search' | 'word-history'
