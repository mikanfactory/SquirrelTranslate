import { Squirrel, Languages, History } from "lucide-react";
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
          <Squirrel />
        </div>
      </div>
      <nav className="flex flex-col items-center gap-2 mt-8">
        <Button
          variant={activeTab === "translate" ? "secondary" : "ghost"}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange("translate")}
        >
          <Languages className="h-5 w-5" />
          <span className="sr-only">Translate</span>
        </Button>
        <Button
          variant={activeTab === "history" ? "secondary" : "ghost"}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange("history")}
        >
          <History className="h-5 w-5" />
          <span className="sr-only">History</span>
        </Button>
      </nav>
    </div>
  );
}
