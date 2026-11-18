import { useState, useEffect, useRef, useCallback } from 'react';

const STREAM_URL =
  import.meta.env.VITE_STREAM_URL || 'https://ice.fabricahost.com.br/radioculturaguaira';
// Endereço final (sem redirecionamento): o preflight CORS do fetch não segue redirects.
const ICY_URL =
  import.meta.env.VITE_ICY_URL || 'https://ice-br.fabricahost.com.br/play/radioculturaguaira';
const METADATA_INTERVAL_MS = 15000;
const DEFAULT_METAINT = 16000;

const DEFAULT_VOLUME = 0.8;
const RECONNECT_DELAY_MS = 5000;
const RAMP_MS = 600;

// Lê o título atual direto do stream (ICY): pede metadados, lê até o primeiro bloco e aborta.
async function readIcyTitle(signal) {
  const response = await fetch(ICY_URL, { headers: { 'Icy-MetaData': '1' }, signal });
  if (!response.ok || !response.body) return '';
  const metaInt = parseInt(response.headers.get('icy-metaint'), 10) || DEFAULT_METAINT;
  const reader = response.body.getReader();

  let buf = new Uint8Array(0);
  const need = async (total) => {
    while (buf.length < total) {
      const { done, value } = await reader.read();
      if (done) return false;
      const next = new Uint8Array(buf.length + value.length);
      next.set(buf);
      next.set(value, buf.length);
      buf = next;
    }
    return true;
  };

  try {
    if (!(await need(metaInt + 1))) return '';
    const metaLen = buf[metaInt] * 16;
    if (metaLen === 0) return '';
    if (!(await need(metaInt + 1 + metaLen))) return '';
    const raw = buf.slice(metaInt + 1, metaInt + 1 + metaLen);
    // Tenta UTF-8 e cai para latin1 se vier com caracteres inválidos
    let text = new TextDecoder('utf-8').decode(raw);
    if (text.includes('�')) text = new TextDecoder('latin1').decode(raw);
    const match = text.match(/StreamTitle='(.*?)';/s);
    return match ? match[1].trim() : '';
  } finally {
    reader.cancel().catch(() => {});
  }
}

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
        const raw = await readIcyTitle(controller.signal);
        if (cancelled) return;

        const idx = raw.indexOf(' - ');
        const artist = idx > -1 ? raw.slice(0, idx) : '';
        const title = idx > -1 ? raw.slice(idx + 3) : raw;
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

  return { isPlaying, isLoading, error, metadata, togglePlay, setVolume };
}
