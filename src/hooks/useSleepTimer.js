import { useState, useEffect, useRef, useCallback } from 'react';

export const SLEEP_OPTIONS = [0, 15, 30, 60]; // minutos; 0 = desligado

/** Próxima opção do ciclo: desligado -> 15 -> 30 -> 60 -> desligado. */
export function nextSleepOption(current) {
  const idx = SLEEP_OPTIONS.indexOf(current);
  return SLEEP_OPTIONS[(idx + 1) % SLEEP_OPTIONS.length];
}

/** Timer para dormir: chama onExpire quando o tempo acaba. */
export function useSleepTimer(onExpire) {
  const [choice, setChoice] = useState(0); // opção escolhida, em minutos
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
        setChoice(0);
        onExpireRef.current?.();
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [endAt]);

  const cycle = useCallback(() => {
    const next = nextSleepOption(choice);
    setChoice(next);
    setNow(Date.now());
    setEndAt(next ? Date.now() + next * 60000 : null);
  }, [choice]);

  const minutesLeft = endAt ? Math.max(1, Math.ceil((endAt - now) / 60000)) : 0;
  return { minutesLeft, cycle };
}
