import { useState, useCallback, useRef, useEffect } from 'react'
import { useApi } from './useApi'
import { WordSearchRecord } from '../types'

export const useWordSearchHistory = () => {
  const [history, setHistory] = useState<WordSearchRecord[]>([])
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<WordSearchRecord | null>(null)
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
      const result = await api.getWordSearchLogs()
      if (!mounted.current) return

      if (result.success && result.logs) {
        // Convert database records to WordSearchRecord format
        const formattedLogs: WordSearchRecord[] = result.logs.map((log) => ({
          id: log.id.toString(),
          timestamp: new Date(log.created_at).toLocaleString('ja-JP'),
          japaneseWord: log.japanese_word,
          results: JSON.parse(log.search_result) // Parse the JSON stored in database
        }))
        setHistory(formattedLogs)
      } else {
        console.error('Failed to load word search logs:', result.error)
        setHistory([])
      }
    } catch (error) {
      if (!mounted.current) return

      console.error('Error loading word search logs:', error)
      setHistory([])
    } finally {
      if (mounted.current) {
        setIsLoading(false)
      }
    }
  }, [api])

  const addToHistory = useCallback((record: WordSearchRecord) => {
    setHistory((prev) => [record, ...prev])
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    setSelectedHistoryItem(null)
  }, [])

  const selectHistoryItem = useCallback((item: WordSearchRecord | null) => {
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
