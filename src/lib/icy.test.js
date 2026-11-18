import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseStreamTitle, splitArtistTitle, readIcyTitle } from './icy';

const METAINT = 16000;

function fakeStream(metaText) {
  const raw = new TextEncoder().encode(metaText);
  const padded = new Uint8Array(Math.ceil(raw.length / 16) * 16);
  padded.set(raw);
  const lenByte = metaText ? padded.length / 16 : 0;
  const body = new Uint8Array(METAINT + 1 + (lenByte ? padded.length : 0) + 50);
  body[METAINT] = lenByte;
  if (lenByte) body.set(padded, METAINT + 1);
  return new Response(body, { headers: { 'icy-metaint': String(METAINT) } });
}

afterEach(() => vi.restoreAllMocks());

describe('parseStreamTitle', () => {
  it('extrai o título', () => {
    expect(parseStreamTitle("StreamTitle='Artista - Música';")).toBe('Artista - Música');
  });
  it('retorna vazio quando não há título', () => {
    expect(parseStreamTitle("StreamTitle='';")).toBe('');
    expect(parseStreamTitle('')).toBe('');
  });
});

describe('splitArtistTitle', () => {
  it('separa artista e música', () => {
    expect(splitArtistTitle('Legião Urbana - Pais e Filhos')).toEqual({
      artist: 'Legião Urbana',
      title: 'Pais e Filhos',
    });
  });
  it('mantém hífens extras no título', () => {
    expect(splitArtistTitle('A - B - C')).toEqual({ artist: 'A', title: 'B - C' });
  });
  it('sem separador, tudo é título', () => {
    expect(splitArtistTitle('Jornal 104')).toEqual({ artist: '', title: 'Jornal 104' });
  });
});

describe('readIcyTitle', () => {
  it('lê o título do primeiro bloco de metadados', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeStream("StreamTitle='Artista - Música';")));
    await expect(readIcyTitle('http://x')).resolves.toBe('Artista - Música');
  });
  it('retorna vazio quando o bloco é vazio', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeStream('')));
    await expect(readIcyTitle('http://x')).resolves.toBe('');
  });
  it('retorna vazio quando a resposta não é ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
    await expect(readIcyTitle('http://x')).resolves.toBe('');
  });
});
