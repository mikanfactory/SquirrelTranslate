import { cn } from '../lib/utils'
import { WordSearchRecord } from '../types'
import { Loader2, Search } from 'lucide-react'

type WordSearchHistoryPanelProps = {
  history: WordSearchRecord[]
  selectedHistoryItem: WordSearchRecord | null
  onSelectHistoryItem: (item: WordSearchRecord) => void
  isLoading?: boolean
}

export function WordSearchHistoryPanel({
  history,
  selectedHistoryItem,
  onSelectHistoryItem,
  isLoading = false
}: WordSearchHistoryPanelProps) {
  return (
    <div className="h-full flex">
      {/* History List */}
      <div className="w-1/3 border-r overflow-auto">
        <div className="p-4 border-b bg-muted/20">
          <h2 className="font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            単語検索履歴
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">読み込み中...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="p-4 text-center text-gray-500">検索履歴がありません</div>
        ) : (
          <div className="divide-y">
            {history.map((record) => (
              <div
                key={record.id}
                className={cn(
                  'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                  selectedHistoryItem?.id === record.id && 'bg-muted'
                )}
                onClick={() => onSelectHistoryItem(record)}
              >
                <div className="font-medium text-blue-600 mb-1">{record.japaneseWord}</div>
                <div className="text-sm text-gray-500">{record.timestamp}</div>
                <div className="text-sm text-gray-600 mt-1">{record.results.length}件の結果</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Item Detail */}
      <div className="flex-1 overflow-auto">
        {selectedHistoryItem ? (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">
                {selectedHistoryItem.japaneseWord}
              </h1>
              <p className="text-sm text-gray-500">検索日時: {selectedHistoryItem.timestamp}</p>
            </div>

            <div className="space-y-6">
              {selectedHistoryItem.results.map((result, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-green-600">{result.englishWord}</h3>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">意味:</h4>
                    <p className="text-gray-800">{result.meaning}</p>
                  </div>

                  {result.examples && result.examples.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">例文:</h4>
                      <ul className="space-y-2">
                        {result.examples.map((example, exampleIndex) => (
                          <li
                            key={exampleIndex}
                            className="text-sm text-gray-700 bg-gray-50 p-3 rounded"
                          >
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            履歴項目を選択してください
          </div>
        )}
      </div>
    </div>
  )
}
