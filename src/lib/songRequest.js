export const WHATSAPP_NUMBER = '551733311155';

const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();

/** Monta a mensagem do pedido; campos vazios ficam de fora. */
export function buildRequestMessage({ name, song, city, neighborhood, dedication }, nowPlaying = '') {
  const lines = [
    'Pedido de música - Cultura FM 104.7',
    '',
    `Nome: ${clean(name)}`,
    `Música: ${clean(song)}`,
    `Cidade: ${clean(city)}`,
  ];
  if (clean(neighborhood)) lines.push(`Bairro: ${clean(neighborhood)}`);
  if (clean(dedication)) lines.push(`Dedicatória: ${clean(dedication)}`);
  if (clean(nowPlaying)) lines.push('', `(Ouvindo agora: ${clean(nowPlaying)})`);
  return lines.join('\n');
}

export function buildWhatsAppUrl(fields, nowPlaying) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildRequestMessage(fields, nowPlaying))}`;
}
