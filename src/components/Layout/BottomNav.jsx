import { Home, Calendar, Newspaper, MessageCircle } from 'lucide-react';

export function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'schedule', icon: Calendar, label: 'Grade' },
    { id: 'news', icon: Newspaper, label: 'Notícias' },
    { id: 'contact', icon: MessageCircle, label: 'Contato' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full glass border-t border-white/10 px-6 py-3 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id 
              ? 'text-grad-mid scale-110' 
              : 'text-white/50 hover:text-white'
          }`}
        >
          <tab.icon size={24} className={activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          {activeTab === tab.id && (
            <div className="absolute -bottom-3 w-1 h-1 bg-grad-mid rounded-full shadow-[0_0_8px_rgba(232,48,74,0.8)]" />
          )}
        </button>
      ))}
    </nav>
  );
}
