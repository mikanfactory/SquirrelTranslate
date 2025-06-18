import { useState, useCallback, useRef, useEffect } from 'react'
import { useApi } from './useApi'
import { WordSearchResult, WordSearchRecord } from '../types'

export const useWordSearch = () => {
  const [inputWord, setInputWord] = useState('')
  const [searchResults, setSearchResults] = useState<WordSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const api = useApi()
  const mounted = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  const searchWord = useCallback(
    async (japaneseWord: string): Promise<WordSearchRecord | null> => {
      if (!japaneseWord.trim() || !mounted.current) return null

      setIsSearching(true)
      setError(null)

      try {
        const result = await api.searchWord(japaneseWord)
        if (!mounted.current) return null

        if (result.success && result.results) {
          setSearchResults(result.results)

          // Return the new record
          const newRecord: WordSearchRecord = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString('ja-JP'),
            japaneseWord: japaneseWord,
            results: result.results
          }

          return newRecord
        } else {
          console.error('Word search error:', result.error)
          const errorMessage = result.error || '単語検索中にエラーが発生しました。'
          if (mounted.current) {
            setError(errorMessage)
            setSearchResults([])
          }
          return null
        }
      } catch (error) {
        if (!mounted.current) return null

        console.error('Word search error:', error)
        const errorMessage =
          '単語検索中にエラーが発生しました。APIキーが設定されているか確認してください。'
        setError(errorMessage)
        setSearchResults([])
        return null
      } finally {
        if (mounted.current) {
          setIsSearching(false)
        }
      }
    },
    [api]
  )

  const clearSearch = useCallback(() => {
    setInputWord('')
    setSearchResults([])
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    inputWord,
    setInputWord,
    searchResults,
    setSearchResults,
    isSearching,
    error,
    searchWord,
    clearSearch,
    clearError
  }
}
