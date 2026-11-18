import { motion } from 'framer-motion';

const Visualizer = ({ isPlaying }) => {
  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={isPlaying ? {
            height: [8, 24, 12, 32, 16, 24, 8][(i % 7)],
            opacity: [0.3, 1, 0.5, 1, 0.4, 0.8, 0.3][(i % 7)]
          } : { height: 4, opacity: 0.2 }}
          transition={{
            duration: 0.8 + (i * 0.1),
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-1.5 bg-grad-mid rounded-full shadow-[0_0_10px_rgba(232,48,74,0.5)]"
        />
      ))}
    </div>
  );
};

export function Home({ isPlaying, isLoading, error, metadata, togglePlay, setVolume }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-12 py-10">
      {/* Logo com anel animado - Tamanho aumentado para preencher melhor o espaço */}
      <div className="relative">
        <motion.div
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-6 rounded-full bg-gradient-to-tr from-grad-start via-grad-mid to-grad-end opacity-60 blur-md"
        />
        <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white/5 shadow-2xl shadow-black/50">
          <img 
            src="/assets/logo-cultura-fm.png" 
            alt="Logo Cultura FM" 
            className="w-full h-full object-cover scale-110"
          />
        </div>
      </div>

      {/* Info da Música - Espaço dedicado */}
      <div className="text-center space-y-3 min-h-[80px] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <div className="flex flex-col items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 mb-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
              <span className="text-xs font-black uppercase tracking-widest text-red-500">Ao Vivo</span>
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl uppercase italic tracking-tighter leading-tight line-clamp-2 px-4 max-w-md">
              {metadata.title || 'Cultura FM 104.7'}
            </h1>
          </div>
          <p className="text-white/65 font-black text-xs uppercase tracking-[0.3em]">
            {metadata.title ? metadata.artist : 'Guaíra / Barretos'}
          </p>
        </motion.div>
        <div className="flex justify-center mt-4">
          <Visualizer isPlaying={isPlaying && !isLoading} />
        </div>
      </div>

      {/* Controles - Botão maior e espaçamento generoso */}
      <div className="w-full max-w-sm flex flex-col items-center gap-12">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pausar a rádio' : 'Tocar a rádio ao vivo'}
          aria-busy={isLoading}
          className={`btn-primary w-32 h-32 flex items-center justify-center rounded-full transition-all active:scale-90 shadow-[0_20px_50px_rgba(232,48,74,0.4)] ${isLoading ? 'opacity-50 grayscale' : ''}`}
        >
          <span className="flex flex-col items-center gap-1 text-white font-black text-sm tracking-widest" aria-hidden="true">
            {isLoading ? (
              <span className="text-2xl leading-none">…</span>
            ) : isPlaying ? (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z" /></svg>
            )}
            {isLoading ? 'CARREGANDO' : isPlaying ? 'PAUSE' : 'PLAY'}
          </span>
        </button>

        {error && (
          <motion.p 
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-xs font-black uppercase tracking-widest text-center bg-red-500/10 px-6 py-3 rounded-2xl border border-red-500/20"
          >
            {error}
          </motion.p>
        )}

        {/* Volume - Slider mais elegante */}
        <div className="w-full flex flex-col items-center gap-3 px-10">
          <label htmlFor="volume-slider" className="flex justify-between w-full text-[11px] font-black uppercase tracking-[0.2em] text-white/60 cursor-pointer">
            <span>Silêncio</span>
            <span>Volume</span>
            <span>Máximo</span>
          </label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.8"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-grad-mid h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer hover:bg-white/10 transition-colors"
            aria-label="Ajustar volume"
          />
        </div>
      </div>
    </div>
  );
}
