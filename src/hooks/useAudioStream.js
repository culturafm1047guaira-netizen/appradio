import { useState, useEffect, useRef, useCallback } from 'react';
import { track } from '@vercel/analytics';
import { readIcyTitle, splitArtistTitle } from '../lib/icy';

// Endereço final do stream (sem redirecionamento), usado no áudio e nos metadados ICY.
const STREAM_URL =
  import.meta.env.VITE_STREAM_URL || 'https://ice-br.fabricahost.com.br/play/radioculturaguaira';
const METADATA_INTERVAL_MS = 15000;

const DEFAULT_VOLUME = 0.8;
const RECONNECT_DELAY_MS = 5000;
const RAMP_MS = 600;

export function useAudioStream() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({ title: '', artist: '' });

  const audioRef = useRef(null);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const wantPlayingRef = useRef(false); // usuário quer ouvir (base da reconexão)
  const reconnectTimerRef = useRef(null);
  const rampTimerRef = useRef(null);

  const clearTimers = () => {
    clearTimeout(reconnectTimerRef.current);
    clearInterval(rampTimerRef.current);
  };

  // Rampa suave de 0 até o volume escolhido
  const rampUp = () => {
    const audio = audioRef.current;
    if (!audio) return;
    clearInterval(rampTimerRef.current);
    const target = volumeRef.current;
    const steps = 12;
    let i = 0;
    audio.volume = 0;
    rampTimerRef.current = setInterval(() => {
      i += 1;
      audio.volume = Math.min(target, (target * i) / steps);
      if (i >= steps) clearInterval(rampTimerRef.current);
    }, RAMP_MS / steps);
  };

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    clearTimeout(reconnectTimerRef.current);
    wantPlayingRef.current = true;
    setError(null);
    setIsLoading(true);

    // Recarrega o stream para garantir que seja ao vivo
    audio.src = STREAM_URL;
    rampUp();

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao reproduzir:', err);
        track('erro_reproducao', { motivo: err?.name || 'desconhecido' });
        setIsPlaying(false);
        setIsLoading(false);
        if (err?.name === 'AbortError') return; // interrompido por pause/novo play
        setError('Falha ao iniciar áudio. Verifique sua conexão.');
      });
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    wantPlayingRef.current = false;
    clearTimers();
    if (audio) {
      audio.pause();
      audio.removeAttribute('src'); // libera a conexão com o stream
      audio.load();
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = DEFAULT_VOLUME;
    audioRef.current = audio;

    const scheduleReconnect = () => {
      if (!wantPlayingRef.current) return;
      setIsLoading(true);
      setError('Conexão perdida. Reconectando...');
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = setTimeout(() => {
        if (wantPlayingRef.current) play();
      }, RECONNECT_DELAY_MS);
    };

    // readyState >= 3 (HAVE_FUTURE_DATA) = pronto; abaixo disso, mostrar carregando
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleWaiting = () => {
      if (wantPlayingRef.current && audio.readyState < 3) setIsLoading(true);
    };
    const handleError = (e) => {
      if (!wantPlayingRef.current) return; // erro ao limpar src após pausar
      console.error('Erro no áudio:', e);
      track('erro_stream');
      setIsPlaying(false);
      scheduleReconnect();
    };
    const handleStalledOrEnded = () => {
      if (wantPlayingRef.current) {
        setIsPlaying(false);
        scheduleReconnect();
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleStalledOrEnded);

    const handleOffline = () => {
      if (wantPlayingRef.current) setError('Sem internet. Vamos retomar quando voltar.');
    };
    const handleOnline = () => {
      if (wantPlayingRef.current) {
        clearTimeout(reconnectTimerRef.current);
        play();
      }
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Media Session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Rádio Cultura FM 104.7',
        artist: 'Ao Vivo',
        album: 'Guaíra/Barretos',
        artwork: [{ src: '/assets/logo-cultura-fm.png', sizes: '512x512', type: 'image/png' }],
      });
      navigator.mediaSession.setActionHandler('play', play);
      navigator.mediaSession.setActionHandler('pause', pause);
    }

    // Metadados via ICY (título enviado dentro do stream)
    let cancelled = false;
    let controller = null;
    const fetchMetadata = async () => {
      controller?.abort();
      controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const raw = await readIcyTitle(STREAM_URL, controller.signal);
        if (cancelled) return;

        const { artist, title } = splitArtistTitle(raw);
        // Título vazio = rádio sem informação no momento (programa falado, vinheta etc.)
        setMetadata({ title, artist });

        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: title || 'Rádio Cultura FM 104.7',
            artist: artist || 'Ao Vivo',
            album: 'Guaíra/Barretos',
            artwork: [{ src: '/assets/logo-cultura-fm.png', sizes: '512x512', type: 'image/png' }],
          });
        }
      } catch {
        // Falha de rede/CORS ou abortado: mantém o último metadado conhecido
      } finally {
        clearTimeout(timeout);
      }
    };

    const interval = setInterval(fetchMetadata, METADATA_INTERVAL_MS);
    fetchMetadata();

    return () => {
      cancelled = true;
      controller?.abort();
      wantPlayingRef.current = false;
      clearInterval(interval);
      clearTimeout(reconnectTimerRef.current);
      clearInterval(rampTimerRef.current);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleStalledOrEnded);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, [play, pause]);

  const togglePlay = () => (isPlaying || wantPlayingRef.current ? pause() : play());

  const setVolume = (value) => {
    volumeRef.current = value;
    clearInterval(rampTimerRef.current);
    if (audioRef.current) audioRef.current.volume = value;
  };

  return { isPlaying, isLoading, error, metadata, togglePlay, pause, setVolume };
}
