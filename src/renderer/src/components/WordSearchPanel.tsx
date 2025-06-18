import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Search, Loader2 } from 'lucide-react'
import { WordSearchResult } from '../types'

type WordSearchPanelProps = {
  inputWord: string
  searchResults: WordSearchResult[]
  onInputChange: (value: string) => void
  onSearch: () => Promise<void>
  isLoading?: boolean
  error?: string | null
  onClearError?: () => void
}

export function WordSearchPanel({
  inputWord,
  searchResults,
  onInputChange,
  onSearch,
  isLoading = false,
  error = null,
  onClearError
}: WordSearchPanelProps) {
  const handleSearchClick = async () => {
    if (!inputWord.trim() || isLoading) return
    await onSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearchClick()
    }
  }

  const handleErrorClick = () => {
    if (onClearError) {
      onClearError()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Input Area */}
        <div className="flex flex-col border-r">
          <Textarea
            placeholder="日本語の単語を入力してください (Enterで検索、Shift+Enterで改行)"
            className="flex-1 resize-none text-lg p-4 rounded-none border-t-0 border-l-0 border-b-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={inputWord}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Results Area */}
        <div className="flex flex-col bg-muted/10">
          <div className="flex-1 p-4 overflow-auto">
            {error ? (
              <div
                className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                onClick={handleErrorClick}
                title="クリックしてエラーを消去"
              >
                エラー: {error}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((result, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-blue-600">{result.englishWord}</h3>
                    </div>

                    <div className="mb-3">
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
                              className="text-sm text-gray-700 bg-gray-50 p-2 rounded"
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
            ) : (
              <div className="text-gray-500 text-center mt-8">検索結果がここに表示されます</div>
            )}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-end p-4 border-t">
        <Button
          onClick={handleSearchClick}
          className="px-8"
          disabled={isLoading || !inputWord.trim()}
        >
          {isLoading ? (
            <>
              検索中
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              検索
              <Search className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
