// Leitura do título atual direto do stream (metadados ICY).
const DEFAULT_METAINT = 16000;

/** Extrai o StreamTitle de um bloco de metadados ICY já decodificado. */
export function parseStreamTitle(text) {
  const match = text.match(/StreamTitle='(.*?)';/s);
  return match ? match[1].trim() : '';
}

/** Separa "Artista - Música". Sem separador, tudo vira título. */
export function splitArtistTitle(raw) {
  const idx = raw.indexOf(' - ');
  return idx > -1
    ? { artist: raw.slice(0, idx), title: raw.slice(idx + 3) }
    : { artist: '', title: raw };
}

/** Pede metadados ao stream, lê até o primeiro bloco e fecha a conexão. */
export async function readIcyTitle(url, signal) {
  const response = await fetch(url, { headers: { 'Icy-MetaData': '1' }, signal });
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
    let text = new TextDecoder('utf-8').decode(raw);
    if (text.includes('�')) text = new TextDecoder('latin1').decode(raw);
    return parseStreamTitle(text);
  } finally {
    reader.cancel().catch(() => {});
  }
}
