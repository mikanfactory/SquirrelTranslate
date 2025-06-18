import { Languages, History, Settings, Search, BookOpen } from 'lucide-react'
import iconImage from '../assets/icon.png'
import { Button } from '../components/ui/button'
import { TabType } from '../types'

type SidebarProps = {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-16 border-r bg-muted/30 flex flex-col items-center">
      <div className="p-2 mt-2">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <img src={iconImage} alt="SquirrelTranslate" className="w-10 h-10" />
        </div>
      </div>
      <nav className="flex flex-col items-center gap-2 mt-8">
        <Button
          variant={activeTab === 'translate' ? 'secondary' : 'ghost'}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange('translate')}
        >
          <Languages className="h-5 w-5" />
          <span className="sr-only">Translate</span>
        </Button>
        <Button
          variant={activeTab === 'history' ? 'secondary' : 'ghost'}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange('history')}
        >
          <History className="h-5 w-5" />
          <span className="sr-only">History</span>
        </Button>
        <Button
          variant={activeTab === 'word-search' ? 'secondary' : 'ghost'}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange('word-search')}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Word Search</span>
        </Button>
        <Button
          variant={activeTab === 'word-history' ? 'secondary' : 'ghost'}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange('word-history')}
        >
          <BookOpen className="h-5 w-5" />
          <span className="sr-only">Word History</span>
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
          size="icon"
          className="w-12 h-12"
          onClick={() => onTabChange('settings')}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </nav>
    </div>
  )
}
