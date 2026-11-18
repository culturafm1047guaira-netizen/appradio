# Rádio Cultura FM 104.7

PWA da Rádio Cultura FM 104.7 (Guaíra/Barretos-SP): player ao vivo com metadados da música e página de contato.

**Stack:** React 19, Vite 8, Tailwind CSS 4, Framer Motion, vite-plugin-pwa.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (dist/)
npm run lint
```

## Configuração (`.env`)

| Variável | Descrição |
| --- | --- |
| `VITE_STREAM_URL` | URL do stream Icecast |
| `VITE_ICY_URL` | URL final do stream (sem redirecionamento) usada para ler o título ICY |

Se não definidas, usa os valores padrão da Cultura FM.

## Estrutura

- `src/hooks/useAudioStream.js` – áudio, reconexão (5 s), rampa de volume, metadados ICY (título lido do próprio stream) e Media Session
- `src/pages/` – Home (player) e Contact
- `directives/` e `execution/` – especificações e scripts de verificação do stream
- `.github/workflows/` – CI (lint e build) e monitor do stream a cada 30 min
- `.env.example` – modelo de variáveis; `.env` não vai para o git
