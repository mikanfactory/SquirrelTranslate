import { cn } from '../lib/utils'

export type TranslationRecord = {
  id: string
  timestamp: string
  sourceText: string
  translatedText: string
}

type HistoryPanelProps = {
  history: TranslationRecord[]
  selectedHistoryItem: TranslationRecord | null
  onSelectHistoryItem: (item: TranslationRecord) => void
  isLoading?: boolean
}

export function HistoryPanel({
  history,
  selectedHistoryItem,
  onSelectHistoryItem,
  isLoading = false
}: HistoryPanelProps) {
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2">
      <div className="border-r overflow-auto">
        <h2 className="text-lg font-medium p-4 border-b sticky top-0 bg-background">履歴</h2>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">読み込み中...</div>
          ) : history.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">履歴がありません</div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                className={cn(
                  'w-full text-left p-4 hover:bg-muted/50 transition-colors',
                  selectedHistoryItem?.id === item.id && 'bg-muted'
                )}
                onClick={() => onSelectHistoryItem(item)}
              >
                <div className="font-medium">{item.timestamp}</div>
                <div className="truncate text-sm text-muted-foreground mt-1">{item.sourceText}</div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="p-6 overflow-auto">
        {selectedHistoryItem ? (
          <div className="h-full flex flex-col space-y-4">
            <div className="flex-1 overflow-auto">{selectedHistoryItem.sourceText}</div>
            <div className="flex-1 overflow-auto">{selectedHistoryItem.translatedText}</div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            履歴から項目を選択してください
          </div>
        )}
      </div>
    </div>
  )
}
