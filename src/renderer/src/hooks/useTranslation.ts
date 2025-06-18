import { useState, useCallback, useRef, useEffect } from 'react'
import { useApi } from './useApi'
import { TranslationRecord } from '../types'

export const useTranslation = () => {
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const api = useApi()
  const mounted = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  const translate = useCallback(
    async (text: string, prompt: string): Promise<TranslationRecord | null> => {
      if (!text.trim() || !mounted.current) return null

      setIsTranslating(true)
      try {
        const result = await api.translateText(text, prompt)
        if (!mounted.current) return null

        if (result.success && result.translatedText) {
          setTranslatedText(result.translatedText)

          // Save to database
          try {
            await api.saveTranslationLog(text, result.translatedText)
          } catch (dbError) {
            console.error('Failed to save translation to database:', dbError)
          }

          // Return the new record
          const newRecord: TranslationRecord = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString('ja-JP'),
            sourceText: text,
            translatedText: result.translatedText
          }

          return newRecord
        } else {
          console.error('Translation error:', result.error)
          if (mounted.current) {
            setTranslatedText(
              result.translatedText ||
                '翻訳中にエラーが発生しました。APIキーが設定されているか確認してください。'
            )
          }
          return null
        }
      } catch (error) {
        if (!mounted.current) return null

        console.error('Translation error:', error)
        setTranslatedText(
          '翻訳中にエラーが発生しました。APIキーが設定されているか確認してください。'
        )
        return null
      } finally {
        if (mounted.current) {
          setIsTranslating(false)
        }
      }
    },
    [api]
  )

  const clearTranslation = useCallback(() => {
    setInputText('')
    setTranslatedText('')
  }, [])

  return {
    inputText,
    setInputText,
    translatedText,
    setTranslatedText,
    isTranslating,
    translate,
    clearTranslation
  }
}
