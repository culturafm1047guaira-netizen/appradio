import { useState, useEffect, useRef } from 'react';

const STREAM_URL = "https://ice.fabricahost.com.br/radioculturaguaira";
const METADATA_URL = "https://ice.fabricahost.com.br/status-json.xsl";

export function useAudioStream() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({ title: '', artist: '' });
  const audioRef = useRef(null);

  const play = () => {
    if (audioRef.current) {
      setError(null);
      setIsLoading(true);
      
      // Reiniciar o stream para garantir que seja ao vivo
      audioRef.current.src = STREAM_URL;
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Erro ao reproduzir:", err);
          setError("Falha ao iniciar áudio. Verifique sua conexão.");
          setIsLoading(false);
          setIsPlaying(false);
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audio.src = STREAM_URL;
    // Removendo crossOrigin para testar compatibilidade direta
    // audio.crossOrigin = "anonymous"; 
    
    audioRef.current = audio;

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handleError = (e) => {
      console.error("Erro no áudio:", e);
      setError("Não foi possível carregar o áudio. Tente novamente.");
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    // Media Session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Rádio Cultura FM 104.7',
        artist: 'Ao Vivo',
        album: 'Guaíra/Barretos',
        artwork: [
          { src: '/assets/logo-cultura-fm.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', play);
      navigator.mediaSession.setActionHandler('pause', pause);
    }

    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        const data = await response.json();
        const source = data.icestats.source.find(s => s.listenurl.includes('radioculturaguaira'));
        if (source && source.title) {
          const [artist, title] = source.title.split(' - ');
          setMetadata({ 
            title: title || source.title, 
            artist: artist || '' 
          });
        }
      } catch (err) {
        console.error("Erro ao buscar metadados:", err);
      }
    };

    const interval = setInterval(fetchMetadata, 10000);
    fetchMetadata();

    return () => {
      clearInterval(interval);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);


  const togglePlay = () => isPlaying ? pause() : play();

  const setVolume = (value) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  return { isPlaying, isLoading, error, metadata, togglePlay, setVolume };
}
