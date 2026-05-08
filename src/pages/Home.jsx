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
        {metadata.title ? (
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
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Ao Vivo</span>
              </motion.div>
              <h1 className="font-display text-3xl md:text-4xl uppercase italic tracking-tighter leading-tight line-clamp-2 px-4 max-w-md">
                {metadata.title}
              </h1>
            </div>
            <p className="text-white/40 font-black text-xs uppercase tracking-[0.3em]">
              {metadata.artist}
            </p>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
              Aguardando sinal...
            </p>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Visualizer isPlaying={isPlaying && !isLoading} />
        </div>
      </div>

      {/* Controles - Botão maior e espaçamento generoso */}
      <div className="w-full max-w-sm flex flex-col items-center gap-12">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`btn-primary w-32 h-32 flex items-center justify-center rounded-full transition-all active:scale-90 shadow-[0_20px_50px_rgba(232,48,74,0.4)] ${isLoading ? 'opacity-50 grayscale' : ''}`}
        >
          <span className="text-white font-black text-sm tracking-widest">
            {isLoading ? '...' : (isPlaying ? 'PAUSE' : 'PLAY')}
          </span>
        </button>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center bg-red-500/10 px-6 py-3 rounded-2xl border border-red-500/20"
          >
            {error}
          </motion.p>
        )}

        {/* Volume - Slider mais elegante */}
        <div className="w-full flex flex-col items-center gap-3 px-10">
          <label htmlFor="volume-slider" className="flex justify-between w-full text-[8px] font-black uppercase tracking-[0.2em] text-white/30 cursor-pointer">
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
