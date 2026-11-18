import { describe, it, expect } from 'vitest';
import { nextSleepOption } from './useSleepTimer';

describe('nextSleepOption', () => {
  it('desligado vai para 15 min (primeiro toque ativa o timer)', () => {
    expect(nextSleepOption(0)).toBe(15);
  });
  it('percorre 15 -> 30 -> 60 -> desligado', () => {
    expect(nextSleepOption(15)).toBe(30);
    expect(nextSleepOption(30)).toBe(60);
    expect(nextSleepOption(60)).toBe(0);
  });
});
