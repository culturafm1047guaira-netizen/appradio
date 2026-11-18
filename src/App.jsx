import { useState } from 'react';
import { useAudioStream } from './hooks/useAudioStream';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { motion, AnimatePresence } from 'framer-motion';

const iconProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const RadioIcon = () => (
  <svg {...iconProps}>
    <path d="M4 9h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
    <path d="m7 9 9-5" />
    <circle cx="8" cy="14.5" r="2.5" />
    <path d="M14 13h4M14 16h4" />
  </svg>
);
const ContactIcon = () => (
  <svg {...iconProps}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);

const tabs = [
  { id: 'home', label: 'Rádio', icon: RadioIcon },
  { id: 'contact', label: 'Contato', icon: ContactIcon },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { isPlaying, isLoading, error, metadata, togglePlay, pause, setVolume } = useAudioStream();

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            isPlaying={isPlaying}
            isLoading={isLoading}
            error={error}
            metadata={metadata}
            togglePlay={togglePlay}
            pause={pause}
            setVolume={setVolume}
          />
        );
      case 'contact':
        return <Contact metadata={metadata} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-dvh flex flex-col text-ink">
      <div className="dial-glow pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <main className="flex-1 w-full max-w-md mx-auto px-6 pt-5 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
        className="sticky bottom-0 z-50 bg-night-2 border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
        aria-label="Navegação principal"
      >
        <div className="max-w-md mx-auto grid grid-cols-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center gap-1 pt-3 pb-2.5 text-sm font-semibold transition-colors ${
                  active ? 'text-dial' : 'text-mute'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute top-0 h-[3px] w-12 rounded-b bg-dial"
                    aria-hidden="true"
                  />
                )}
                <tab.icon />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;
