import { useState } from 'react';
import { useAudioStream } from './hooks/useAudioStream';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { News } from './pages/News';
import { Schedule } from './pages/Schedule';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Icons to avoid Lucide resolution issues
const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ContactIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const NewsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>;
const ScheduleIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>;

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { isPlaying, isLoading, error, metadata, togglePlay, setVolume } = useAudioStream();

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home isPlaying={isPlaying} isLoading={isLoading} error={error} metadata={metadata} togglePlay={togglePlay} setVolume={setVolume} />;
      case 'schedule': return <Schedule />;
      case 'news': return <News />;
      case 'contact': return <Contact />;
      default: return <Home />;
    }
  };

  const tabs = [
    { id: 'home', label: 'Início', icon: HomeIcon },
    { id: 'schedule', label: 'Horários', icon: ScheduleIcon },
    { id: 'news', label: 'Notícias', icon: NewsIcon },
    { id: 'contact', label: 'Contato', icon: ContactIcon },
  ];

  return (
    <div className="relative min-h-screen text-white flex flex-col justify-center">
      <div className="mesh-gradient" />
      
      <main className="pb-32 pt-12 px-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-8 left-0 w-full flex justify-center px-6 z-50">
        <nav className="w-full max-w-xs glass border border-white/10 px-8 py-4 flex justify-around items-center rounded-[40px] shadow-2xl shadow-black/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all relative ${
                activeTab === tab.id ? 'text-grad-mid scale-110' : 'text-white/30'
              }`}
            >
              <tab.icon />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-2 w-1.5 h-1.5 bg-grad-mid rounded-full shadow-[0_0_12px_rgba(232,48,74,1)]" 
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default App;
