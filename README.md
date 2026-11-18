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
| `VITE_METADATA_URL` | `status-json.xsl` do Icecast |

Se não definidas, usa os valores padrão da Cultura FM.

## Estrutura

- `src/hooks/useAudioStream.js` – áudio, reconexão (5 s), rampa de volume, metadados e Media Session
- `src/pages/` – Home (player) e Contact
- `directives/` e `execution/` – especificações e scripts de verificação do stream
- `_arquivo-antigo/` – arquivos legados movidos da raiz (podem ser apagados)
