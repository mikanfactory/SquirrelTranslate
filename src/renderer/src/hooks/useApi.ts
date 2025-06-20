import { useCallback } from 'react'
import {
  TranslationResult,
  ApiKeyResult,
  TranslationLogsResult,
  WordSearchLogsResult,
  ApiResult
} from '../types'

export const useApi = () => {
  const translateText = useCallback(
    async (text: string, prompt: string): Promise<TranslationResult> => {
      try {
        return await window.api.translateText(text, prompt)
      } catch (error) {
        console.error('Translation API error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          translatedText: '翻訳中にエラーが発生しました。'
        }
      }
    },
    []
  )

  const saveApiKey = useCallback(async (apiKey: string): Promise<ApiResult> => {
    try {
      return await window.api.saveApiKey(apiKey)
    } catch (error) {
      console.error('Save API key error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }, [])

  const getApiKey = useCallback(async (): Promise<ApiKeyResult> => {
    try {
      return await window.api.getApiKey()
    } catch (error) {
      console.error('Get API key error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }, [])

  const saveTranslationLog = useCallback(
    async (sourceText: string, translatedText: string): Promise<ApiResult & { id?: number }> => {
      try {
        return await window.api.saveTranslationLog(sourceText, translatedText)
      } catch (error) {
        console.error('Save translation log error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },
    []
  )

  const getTranslationLogs = useCallback(async (): Promise<TranslationLogsResult> => {
    try {
      return await window.api.getTranslationLogs()
    } catch (error) {
      console.error('Get translation logs error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }, [])

  const searchWord = useCallback(
    async (
      japaneseWord: string
    ): Promise<{
      success: boolean
      results?: Array<{
        englishWord: string
        meaning: string
        examples: string[]
      }>
      error?: string
    }> => {
      try {
        return await window.api.searchWord(japaneseWord)
      } catch (error) {
        console.error('Word search error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    },
    []
  )

  const getWordSearchLogs = useCallback(async (): Promise<WordSearchLogsResult> => {
    try {
      return await window.api.getWordSearchLogs()
    } catch (error) {
      console.error('Get word search logs error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }, [])

  return {
    translateText,
    saveApiKey,
    getApiKey,
    saveTranslationLog,
    getTranslationLogs,
    searchWord,
    getWordSearchLogs
  }
}
