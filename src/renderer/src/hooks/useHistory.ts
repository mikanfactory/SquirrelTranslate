import { useState, useCallback, useRef, useEffect } from 'react'
import { useApi } from './useApi'
import { TranslationRecord } from '../types'

export const useHistory = () => {
  const [history, setHistory] = useState<TranslationRecord[]>([])
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<TranslationRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const api = useApi()
  const mounted = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  const loadHistory = useCallback(async () => {
    if (!mounted.current) return

    setIsLoading(true)
    try {
      const result = await api.getTranslationLogs()
      if (!mounted.current) return

      if (result.success && result.logs) {
        // Convert database records to TranslationRecord format
        const formattedLogs: TranslationRecord[] = result.logs.map((log) => ({
          id: log.id.toString(),
          timestamp: new Date(log.created_at).toLocaleString('ja-JP'),
          sourceText: log.source_text,
          translatedText: log.translated_text
        }))
        setHistory(formattedLogs)
      } else {
        console.error('Failed to load translation logs:', result.error)
        setHistory([])
      }
    } catch (error) {
      if (!mounted.current) return

      console.error('Error loading translation logs:', error)
      setHistory([])
    } finally {
      if (mounted.current) {
        setIsLoading(false)
      }
    }
  }, [api.getTranslationLogs])

  const addToHistory = useCallback((record: TranslationRecord) => {
    setHistory((prev) => [record, ...prev])
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    setSelectedHistoryItem(null)
  }, [])

  const selectHistoryItem = useCallback((item: TranslationRecord | null) => {
    setSelectedHistoryItem(item)
  }, [])

  return {
    history,
    selectedHistoryItem,
    isLoading,
    loadHistory,
    addToHistory,
    clearHistory,
    selectHistoryItem
  }
}
