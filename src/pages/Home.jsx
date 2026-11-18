import { useState } from 'react';
import { Dial } from '../components/Dial';
import { useSleepTimer } from '../hooks/useSleepTimer';

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const MoonIcon = () => (
  <svg {...iconProps}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
);
const ShareIcon = () => (
  <svg {...iconProps}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);
const VolumeLowIcon = () => (
  <svg {...iconProps}><path d="M11 5 6 9H3v6h3l5 4z" /></svg>
);
const VolumeHighIcon = () => (
  <svg {...iconProps}><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
);

function PlayButton({ isPlaying, isLoading, onClick }) {
  const label = isLoading ? 'Conectando' : isPlaying ? 'Pausar' : 'Tocar';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative grid place-items-center">
        {isPlaying && !isLoading && (
          <span className="absolute inset-0 rounded-full bg-dial/30 animate-ping" aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={onClick}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pausar a rádio' : 'Tocar a rádio ao vivo'}
          aria-busy={isLoading}
          className="relative grid place-items-center size-24 rounded-full bg-dial text-night shadow-[0_10px_34px_rgba(255,194,26,0.35)] transition-transform active:scale-95 disabled:opacity-80"
        >
          {isLoading ? (
            <svg className="animate-spin" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : isPlaying ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" />
            </svg>
          ) : (
            <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z" />
            </svg>
          )}
        </button>
      </div>
      <span className="text-sm font-semibold text-mute" aria-hidden="true">{label}</span>
    </div>
  );
}

export function Home({ isPlaying, isLoading, error, metadata, togglePlay, setVolume, pause }) {
  const [shareMsg, setShareMsg] = useState('');
  const { minutesLeft, cycle } = useSleepTimer(pause);

  const share = async () => {
    const data = {
      title: 'Rádio Cultura FM 104.7',
      text: 'Ouça a Rádio Cultura FM 104.7 ao vivo!',
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
        setShareMsg('Link copiado');
        setTimeout(() => setShareMsg(''), 2500);
      }
    } catch {
      // usuário cancelou o compartilhamento
    }
  };

  const pill =
    'inline-flex items-center gap-2 h-11 px-4 rounded-full border text-sm font-semibold transition-colors active:scale-95';

  return (
    <div className="h-full flex flex-col items-center justify-between gap-5">
      {/* Identificação da estação */}
      <header className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo-cultura-fm.png"
            alt="Cultura FM"
            className="size-11 rounded-full object-cover ring-2 ring-white/10"
          />
          <span className="font-semibold leading-tight">
            Cultura FM
            <span className="block text-sm font-normal text-mute">Guaíra e Barretos</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className={`size-2.5 rounded-full bg-signal ${isPlaying ? 'animate-pulse' : ''}`} aria-hidden="true" />
          Ao vivo
        </span>
      </header>

      {/* Frequência e escala de sintonia */}
      <section className="w-full flex flex-col items-center gap-3" aria-label="Rádio Cultura FM 104.7">
        <h1 className="font-display font-extrabold leading-[0.85] text-dial text-[clamp(96px,20vh,152px)] tracking-tight">
          104.7
          <span className="ml-2 align-top text-[0.26em] font-bold text-ink">FM</span>
        </h1>
        <Dial playing={isPlaying && !isLoading} />
        <div className="text-center min-h-[4.25rem] px-2" aria-live="polite">
          <p className="text-xl font-bold leading-snug line-clamp-2">
            {metadata.title || 'Cultura FM, Guaíra e Barretos'}
          </p>
          {metadata.title && metadata.artist && <p className="text-mute mt-0.5">{metadata.artist}</p>}
        </div>
      </section>

      {/* Controles */}
      <section className="w-full flex flex-col items-center gap-5">
        <PlayButton isPlaying={isPlaying} isLoading={isLoading} onClick={togglePlay} />

        {error && (
          <p
            role="alert"
            className="text-sm font-semibold text-center bg-signal/15 border border-signal/40 text-ink px-4 py-2.5 rounded-xl"
          >
            {error}
          </p>
        )}

        <div className="w-full max-w-xs flex items-center gap-3 text-mute">
          <VolumeLowIcon />
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.8"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-8 cursor-pointer"
            aria-label="Volume"
          />
          <VolumeHighIcon />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={cycle}
            aria-label={
              minutesLeft
                ? `Timer para dormir: faltam ${minutesLeft} minutos. Toque para alterar`
                : 'Ativar timer para dormir'
            }
            className={`${pill} ${minutesLeft ? 'border-dial text-dial' : 'border-white/20 text-ink'}`}
          >
            <MoonIcon />
            {minutesLeft ? `Dormir em ${minutesLeft} min` : 'Timer'}
          </button>
          <button type="button" onClick={share} className={`${pill} border-white/20 text-ink`}>
            <ShareIcon />
            {shareMsg || 'Compartilhar'}
          </button>
        </div>
      </section>
    </div>
  );
}
