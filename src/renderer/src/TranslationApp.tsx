'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { TranslatePanel } from './components/TranslatePanel'
import { HistoryPanel, TranslationRecord } from './components/HistoryPanel'
import { SettingsPanel } from './components/SettingsPanel'

export default function TranslationApp() {
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'settings'>('translate')
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [history, setHistory] = useState<TranslationRecord[]>([])
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<TranslationRecord | null>(null)
  const [apiKey, setApiKey] = useState<string>('')
  const [prompt, setPrompt] = useState<string>(
    'あなたは翻訳アシスタントです。日本語か英語を与えます。英語の場合は日本語に、日本語の場合は英語に翻訳してください。翻訳のみを返してください。'
  )
  const [isLoading, setIsLoading] = useState(false)

  // 環境変数の取得
  useEffect(() => {
    // Electron環境の場合はpreloadスクリプトから環境変数を取得
    if (import.meta.env.RENDERER_VITE_OPENAI_API_KEY) {
      setApiKey(import.meta.env.RENDERER_VITE_OPENAI_API_KEY)
    } else {
      // ブラウザ環境の場合は通常の環境変数を使用
      setApiKey(import.meta.env.RENDERER_VITE_OPENAI_API_KEY || '')
    }
  }, [])

  // 履歴タブが選択されたときに翻訳履歴を読み込む
  useEffect(() => {
    if (activeTab === 'history') {
      loadTranslationLogs()
    }
  }, [activeTab])

  // データベースから翻訳履歴を読み込む
  const loadTranslationLogs = async () => {
    setIsLoading(true)
    try {
      const result = await window.api.getTranslationLogs()
      if (result.success && result.logs) {
        // データベースのレコードをTranslationRecord形式に変換
        const formattedLogs: TranslationRecord[] = result.logs.map((log) => ({
          id: log.id.toString(),
          timestamp: new Date(log.created_at).toLocaleString('ja-JP'),
          sourceText: log.source_text,
          translatedText: log.translated_text
        }))
        setHistory(formattedLogs)
      } else {
        console.error('Failed to load translation logs:', result.error)
      }
    } catch (error) {
      console.error('Error loading translation logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    try {
      // メインプロセス経由でOpenAI APIを使用して翻訳
      const result = await window.api.translateText(
        inputText,
        prompt,
        apiKey || import.meta.env.RENDERER_VITE_OPENAI_API_KEY
      )

      if (result.success) {
        setTranslatedText(result.translatedText)

        // データベースに翻訳結果を保存
        try {
          await window.api.saveTranslationLog(inputText, result.translatedText)
        } catch (dbError) {
          console.error('Failed to save translation to database:', dbError)
        }

        // 履歴に追加
        const newRecord: TranslationRecord = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString('ja-JP'),
          sourceText: inputText,
          translatedText: result.translatedText
        }
        setHistory([newRecord, ...history])
      } else {
        console.error('翻訳エラー:', result.error)
        setTranslatedText(
          result.translatedText ||
            '翻訳中にエラーが発生しました。APIキーが設定されているか確認してください。'
        )
      }
    } catch (error) {
      console.error('翻訳エラー:', error)
      setTranslatedText('翻訳中にエラーが発生しました。APIキーが設定されているか確認してください。')
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          {activeTab === 'translate' ? (
            <TranslatePanel
              inputText={inputText}
              translatedText={translatedText}
              onInputChange={setInputText}
              onTranslate={handleTranslate}
            />
          ) : activeTab === 'history' ? (
            <HistoryPanel
              history={history}
              selectedHistoryItem={selectedHistoryItem}
              onSelectHistoryItem={setSelectedHistoryItem}
              isLoading={isLoading}
            />
          ) : activeTab === 'settings' ? (
            <SettingsPanel
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              prompt={prompt}
              onPromptChange={setPrompt}
            />
          ) : null}
        </main>
      </div>
    </div>
  )
}
