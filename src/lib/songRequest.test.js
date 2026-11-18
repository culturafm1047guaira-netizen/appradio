import { describe, it, expect } from 'vitest';
import { buildRequestMessage, buildWhatsAppUrl } from './songRequest';

const base = { name: ' Maria  Silva ', song: 'Evidências - Chitãozinho e Xororó', city: 'Guaíra' };

describe('buildRequestMessage', () => {
  it('inclui campos obrigatórios e limpa espaços', () => {
    const msg = buildRequestMessage(base);
    expect(msg).toContain('Nome: Maria Silva');
    expect(msg).toContain('Música: Evidências - Chitãozinho e Xororó');
    expect(msg).toContain('Cidade: Guaíra');
    expect(msg).not.toContain('Bairro');
    expect(msg).not.toContain('Dedicatória');
  });

  it('inclui bairro, dedicatória e música atual quando informados', () => {
    const msg = buildRequestMessage(
      { ...base, neighborhood: 'Centro', dedication: 'Para minha mãe, com carinho' },
      'Artista - Faixa',
    );
    expect(msg).toContain('Bairro: Centro');
    expect(msg).toContain('Dedicatória: Para minha mãe, com carinho');
    expect(msg).toContain('(Ouvindo agora: Artista - Faixa)');
  });
});

describe('buildWhatsAppUrl', () => {
  it('aponta para o número da rádio com o texto codificado', () => {
    const url = buildWhatsAppUrl(base);
    expect(url.startsWith('https://wa.me/551733311155?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toContain('Nome: Maria Silva');
  });
});
