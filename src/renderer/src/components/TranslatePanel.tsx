import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { Send, Loader2 } from 'lucide-react'

type TranslatePanelProps = {
  inputText: string
  translatedText: string
  onInputChange: (value: string) => void
  onTranslate: () => Promise<void>
  isLoading?: boolean
}

export function TranslatePanel({
  inputText,
  translatedText,
  onInputChange,
  onTranslate,
  isLoading = false
}: TranslatePanelProps) {
  const handleTranslateClick = async () => {
    if (!inputText.trim() || isLoading) return
    await onTranslate()
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0">
        <Textarea
          placeholder="テキストを入力してください"
          className="flex-1 resize-none text-lg p-4 rounded-none border-r border-t-0 border-l-0 border-b-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <Textarea
          readOnly
          placeholder="翻訳結果がここに表示されます"
          className="flex-1 resize-none text-lg p-4 rounded-none border-t-0 border-r-0 border-b-0 bg-muted/10 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={translatedText}
        />
      </div>
      <div className="flex justify-end p-4 border-t">
        <Button
          onClick={handleTranslateClick}
          className="px-8"
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <>
              翻訳中
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              翻訳
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
