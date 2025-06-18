import { useState, useEffect, useCallback } from 'react'
import { useApi } from './useApi'

const DEFAULT_PROMPT =
  'あなたは翻訳アシスタントです。日本語か英語を与えます。英語の場合は日本語に、日本語の場合は英語に翻訳してください。翻訳のみを返してください。'

export const useSettings = () => {
  const [apiKey, setApiKey] = useState<string>('')
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const api = useApi()

  // Load saved API key on mount
  useEffect(() => {
    const loadApiKey = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await api.getApiKey()
        if (result.success && result.apiKey) {
          setApiKey(result.apiKey)
        } else if (import.meta.env.RENDERER_VITE_OPENAI_API_KEY) {
          // Fallback to environment variable
          setApiKey(import.meta.env.RENDERER_VITE_OPENAI_API_KEY)
        }
      } catch (error) {
        console.error('Failed to load API key:', error)
        setError('APIキーの読み込みに失敗しました')
        // Try environment variable as fallback
        if (import.meta.env.RENDERER_VITE_OPENAI_API_KEY) {
          setApiKey(import.meta.env.RENDERER_VITE_OPENAI_API_KEY)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadApiKey()
  }, [api])

  // Save API key when it changes
  const saveApiKey = useCallback(
    async (newApiKey: string) => {
      if (!newApiKey) return

      setIsLoading(true)
      setError(null)
      try {
        const result = await api.saveApiKey(newApiKey)
        if (!result.success) {
          setError(result.error || 'APIキーの保存に失敗しました')
        }
      } catch (error) {
        console.error('Failed to save API key:', error)
        setError('APIキーの保存に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [api]
  )

  const updateApiKey = useCallback(
    (newApiKey: string) => {
      setApiKey(newApiKey)
      if (newApiKey) {
        saveApiKey(newApiKey)
      }
    },
    [saveApiKey]
  )

  const updatePrompt = useCallback((newPrompt: string) => {
    setPrompt(newPrompt)
  }, [])

  const resetPrompt = useCallback(() => {
    setPrompt(DEFAULT_PROMPT)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    apiKey,
    prompt,
    isLoading,
    error,
    updateApiKey,
    updatePrompt,
    resetPrompt,
    clearError
  }
}
