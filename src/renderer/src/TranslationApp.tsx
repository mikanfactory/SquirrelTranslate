'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { TranslatePanel } from './components/TranslatePanel'
import { HistoryPanel } from './components/HistoryPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { WordSearchPanel } from './components/WordSearchPanel'
import { WordSearchHistoryPanel } from './components/WordSearchHistoryPanel'
import { useTranslation } from './hooks/useTranslation'
import { useHistory } from './hooks/useHistory'
import { useSettings } from './hooks/useSettings'
import { useWordSearch } from './hooks/useWordSearch'
import { useWordSearchHistory } from './hooks/useWordSearchHistory'
import { TabType } from './types'

export default function TranslationApp() {
  const [activeTab, setActiveTab] = useState<TabType>('translate')

  // Custom hooks for state management
  const translation = useTranslation()
  const history = useHistory()
  const settings = useSettings()
  const wordSearch = useWordSearch()
  const wordSearchHistory = useWordSearchHistory()

  // Load history when history tab is selected
  useEffect(() => {
    if (activeTab === 'history') {
      history.loadHistory()
    }
  }, [activeTab, history.loadHistory])

  // Load word search history when word history tab is selected
  useEffect(() => {
    if (activeTab === 'word-history') {
      wordSearchHistory.loadHistory()
    }
  }, [activeTab, wordSearchHistory.loadHistory])

  const handleTranslate = async () => {
    const newRecord = await translation.translate(translation.inputText, settings.prompt)
    if (newRecord) {
      history.addToHistory(newRecord)
    }
  }

  const handleWordSearch = async () => {
    const newRecord = await wordSearch.searchWord(wordSearch.inputWord)
    if (newRecord) {
      wordSearchHistory.addToHistory(newRecord)
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
              inputText={translation.inputText}
              translatedText={translation.translatedText}
              onInputChange={translation.setInputText}
              onTranslate={handleTranslate}
              isLoading={translation.isTranslating}
            />
          ) : activeTab === 'history' ? (
            <HistoryPanel
              history={history.history}
              selectedHistoryItem={history.selectedHistoryItem}
              onSelectHistoryItem={history.selectHistoryItem}
              isLoading={history.isLoading}
            />
          ) : activeTab === 'settings' ? (
            <SettingsPanel
              apiKey={settings.apiKey}
              onApiKeyChange={settings.updateApiKey}
              prompt={settings.prompt}
              onPromptChange={settings.updatePrompt}
              isLoading={settings.isLoading}
              error={settings.error}
              onClearError={settings.clearError}
            />
          ) : activeTab === 'word-search' ? (
            <WordSearchPanel
              inputWord={wordSearch.inputWord}
              searchResults={wordSearch.searchResults}
              onInputChange={wordSearch.setInputWord}
              onSearch={handleWordSearch}
              isLoading={wordSearch.isSearching}
              error={wordSearch.error}
              onClearError={wordSearch.clearError}
            />
          ) : activeTab === 'word-history' ? (
            <WordSearchHistoryPanel
              history={wordSearchHistory.history}
              selectedHistoryItem={wordSearchHistory.selectedHistoryItem}
              onSelectHistoryItem={wordSearchHistory.selectHistoryItem}
              isLoading={wordSearchHistory.isLoading}
            />
          ) : null}
        </main>
      </div>
    </div>
  )
}
