# UI/UX Standards: Rádio Cultura FM 104.7

## Conceito
O símbolo de uma rádio FM é o **dial**. A Home gira em torno do número 104.7 e de uma escala de sintonia com a agulha vermelha; ao abrir o app, a escala "sintoniza" 104.7 (único movimento não disparado pelo usuário). O resto da interface fica quieto.

## Paleta (derivada do logo: azul, amarelo, vermelho)
| Token | Hex | Uso |
| --- | --- | --- |
| `night` | #0A1633 | Fundo |
| `night-2` | #14244F | Barra de navegação |
| `dial` | #FFC21A | Frequência, botão de play, item ativo |
| `signal` | #FF4538 | Agulha, indicador "Ao vivo", erros |
| `ink` | #EEF2FF | Texto principal |
| `mute` | #A3AFCB | Texto secundário |

Sem gradientes decorativos e sem cartões de vidro. O único brilho é o do dial aceso atrás do número.

## Tipografia
- **Big Shoulders Display** (700/800): número da frequência, títulos de página e da escala, como a numeração de um dial.
- **Figtree** (400/600/700): todo o restante.
- Textos em minúsculas com inicial maiúscula (sem caixa alta). Tamanho mínimo 14 px, pensando em ouvintes mais velhos.

## Layout
- Mobile-first: botão de play, volume e ações cabem na primeira tela de um celular de 375×812 sem rolar.
- Navegação: barra fixa no rodapé, de largura total, com 2 itens (Rádio e Contato).
- Contato: listas separadas por linhas finas, sem cartões repetidos.

## Movimento
- Entrada da escala (sintonia) e transição de páginas apenas com fade curto.
- Respostas a ações: anel pulsante enquanto toca, giro durante a conexão.
- `prefers-reduced-motion` é respeitado.

## Acessibilidade
- Foco visível (contorno amarelo), `aria-label` nos botões de ícone, `aria-live` no nome da música, `role="alert"` nos erros.
- Contraste mínimo AA em todos os textos.
