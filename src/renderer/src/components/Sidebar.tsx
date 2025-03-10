// components/Sidebar.tsx
import { Home, Clock } from "lucide-react";
import { Button } from "../components/ui/button";

type SidebarProps = {
  activeTab: "translate" | "history";
  onTabChange: (tab: "translate" | "history") => void;
};

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-16 border-r bg-muted/30 flex flex-col items-center">
      <div className="p-2 mt-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
      <nav className="flex flex-col items-center gap-2 mt-8">
        <Button
          variant={activeTab === "translate" ? "secondary" : "ghost"}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange("translate")}
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Translate</span>
        </Button>
        <Button
          variant={activeTab === "history" ? "secondary" : "ghost"}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange("history")}
        >
          <Clock className="h-5 w-5" />
          <span className="sr-only">History</span>
        </Button>
      </nav>
    </div>
  );
}
