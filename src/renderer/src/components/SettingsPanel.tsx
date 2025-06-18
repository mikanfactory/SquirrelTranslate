import { useState, useRef, useEffect } from 'react'
import { Textarea } from './ui/textarea'

// APIキー入力用のカスタムコンポーネント
function MaskedApiKeyInput({
  value,
  onChange,
  placeholder
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const [isFocused, setIsFocused] = useState(false)

  // APIキーをマスクする関数
  const maskApiKey = (key: string) => {
    if (!key || key.length <= 7) return key

    const firstThree = key.substring(0, 3)
    const lastFour = key.substring(key.length - 4)
    return `${firstThree}...${lastFour}`
  }

  const [displayValue, setDisplayValue] = useState(() => maskApiKey(value))
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 実際の値が変更されたときに表示用の値を更新
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(maskApiKey(value))
    }
  }, [value, isFocused])

  const handleFocus = () => {
    setIsFocused(true)
    setDisplayValue(value) // フォーカス時に実際の値を表示
  }

  const handleBlur = () => {
    setIsFocused(false)
    setDisplayValue(maskApiKey(value)) // フォーカスが外れたらマスク
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value) // 親コンポーネントに実際の値を通知
    setDisplayValue(e.target.value) // 表示用の値も更新
  }

  return (
    <Textarea
      ref={inputRef}
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}

// メインのSettingsPanelコンポーネント
type SettingsPanelProps = {
  apiKey: string
  onApiKeyChange: (value: string) => void
  prompt: string
  onPromptChange: (value: string) => void
}

export function SettingsPanel({
  apiKey,
  onApiKeyChange,
  prompt,
  onPromptChange
}: SettingsPanelProps) {
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">OpenAI APIキー</h2>
          <MaskedApiKeyInput
            value={apiKey}
            onChange={onApiKeyChange}
            placeholder="OpenAI APIキーを入力してください"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">翻訳用のプロンプト</h2>
          <Textarea
            placeholder="翻訳用のプロンプトを入力してください"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
      </div>
    </div>
  )
}
