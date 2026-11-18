import { useState, useEffect, useRef, useCallback } from 'react';

const OPTIONS = [0, 15, 30, 60]; // 0 = desligado

/** Timer para dormir: chama onExpire quando o tempo acaba. */
export function useSleepTimer(onExpire) {
  const [endAt, setEndAt] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!endAt) return undefined;
    const tick = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endAt) {
        setEndAt(null);
        onExpireRef.current?.();
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [endAt]);

  // Alterna: desligado -> 15 -> 30 -> 60 -> desligado
  const cycle = useCallback(() => {
    const current = endAt ? Math.max(1, Math.ceil((endAt - Date.now()) / 60000)) : 0;
    const idx = endAt ? OPTIONS.findIndex((m) => m >= current) : -1;
    const next = OPTIONS[(idx + 1) % OPTIONS.length];
    setNow(Date.now());
    setEndAt(next ? Date.now() + next * 60000 : null);
  }, [endAt]);

  const minutesLeft = endAt ? Math.max(1, Math.ceil((endAt - now) / 60000)) : 0;
  return { minutesLeft, cycle };
}
