'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { TranslatePanel } from './components/TranslatePanel'
import { HistoryPanel } from './components/HistoryPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { useTranslation } from './hooks/useTranslation'
import { useHistory } from './hooks/useHistory'
import { useSettings } from './hooks/useSettings'
import { TabType } from './types'

export default function TranslationApp() {
  const [activeTab, setActiveTab] = useState<TabType>('translate')

  // Custom hooks for state management
  const translation = useTranslation()
  const history = useHistory()
  const settings = useSettings()

  // Load history when history tab is selected
  useEffect(() => {
    if (activeTab === 'history') {
      history.loadHistory()
    }
  }, [activeTab, history])

  const handleTranslate = async () => {
    const newRecord = await translation.translate(translation.inputText, settings.prompt)
    if (newRecord) {
      history.addToHistory(newRecord)
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
          ) : null}
        </main>
      </div>
    </div>
  )
}
