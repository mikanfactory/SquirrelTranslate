"use client";

import { useState, useEffect } from "react";
import OpenAI from "openai";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { TranslatePanel } from "./components/TranslatePanel";
import { HistoryPanel, TranslationRecord } from "./components/HistoryPanel";

export default function TranslationApp() {
  const [activeTab, setActiveTab] = useState<"translate" | "history">("translate");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<TranslationRecord | null>(null);
  const [apiKey, setApiKey] = useState<string>("");

  // 環境変数の取得
  useEffect(() => {
    // Electron環境の場合はpreloadスクリプトから環境変数を取得
    if (import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      setApiKey(import.meta.env.EXT_PUBLIC_OPENAI_API_KEY);
    } else {
      // ブラウザ環境の場合は通常の環境変数を使用
      setApiKey(import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY || '');
    }
  }, []);

  // OpenAI クライアントの初期化
  const openai = new OpenAI({
    apiKey: apiKey || import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true // クライアントサイドでの使用を許可
  });

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    try {
      // OpenAI APIを使用して翻訳
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "あなたは翻訳アシスタントです。テキストを日本語に翻訳してください。元の言語は自動的に検出してください。翻訳のみを返してください。"
          },
          {
            role: "user",
            content: inputText
          }
        ],
        temperature: 0.3,
      });

      const translatedContent = response.choices[0]?.message?.content || "翻訳エラーが発生しました";
      setTranslatedText(translatedContent);

      // 履歴に追加
      const newRecord: TranslationRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString("ja-JP"),
        sourceText: inputText,
        translatedText: translatedContent,
      };
      setHistory([newRecord, ...history]);
    } catch (error) {
      console.error("翻訳エラー:", error);
      setTranslatedText("翻訳中にエラーが発生しました。APIキーが設定されているか確認してください。");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          {activeTab === "translate" ? (
            <TranslatePanel
              inputText={inputText}
              translatedText={translatedText}
              onInputChange={setInputText}
              onTranslate={handleTranslate}
            />
          ) : (
            <HistoryPanel
              history={history}
              selectedHistoryItem={selectedHistoryItem}
              onSelectHistoryItem={setSelectedHistoryItem}
            />
          )}
        </main>
      </div>
    </div>
  );
}
