# Decisões de Produto

Registro consolidado da sessão grill-me (25 perguntas). Referência complementar ao [PRD](../prd/bolao.md) e para implementação.

## Escopo do produto

| # | Tema | Decisão |
|---|------|---------|
| 1 | Tipos de palpite | **A + B + C** — placar exato, vencedor/empate, campeão e artilheiro |
| 2 | Combinação de modos | **B** — criador ativa múltiplos modos no mesmo bolão |
| 3 | Fonte de jogos | **A se API gratuita existir; senão B** — catálogo automático com fallback manual |
| 4 | Identidade | **A** — conta obrigatória (e-mail/senha) |
| 5 | Convite | **A** — link aberto; quem tem conta entra automaticamente |
| 6 | Início do bolão | **D sem fallback** — criador clica "Iniciar"; regras travam manualmente |
| 7 | Regras configuráveis | **B** — pontos por tipo de acerto + quais modos ativar |
| 8 | Visibilidade de palpites | **C** — ocultos até bolão iniciar; depois ocultos até kickoff de cada jogo |
| 9 | Prazo de palpite | **A** — até kickoff; vazio = 0 pts na partida; participante continua no bolão |
| 10 | Dinheiro | **A** — sem valor financeiro no app |
| 11 | Competições por bolão | **A** — uma competição por bolão |
| 12 | Desempate | **E + B** — configurável pelo criador; padrão = mais placares exatos |
| 13 | Jogo adiado/cancelado | **C** — adiamento reabre janela; cancelamento anula a partida |
| 14 | Notificações | **A** — sem notificações na v1 |
| 15 | Saída/remoção | **D** — pode sair antes de iniciar; depois composição trava |
| 16 | Pós-torneio | **A** — arquivado automaticamente; ranking congelado, só leitura |
| 17 | Campeão/artilheiro | **A** — uma resposta por categoria; deadline = kickoff do 1º jogo; acerto cheio ou zero |
| 18 | Plataforma | **A** — web responsiva (navegador) |
| 19 | Idioma | **B** — pt-BR na v1, arquitetura i18n-ready |
| 20 | Cálculo de pontos (jogos) | **C** — automático com API; manual sem API |
| 21 | Login | **A** — só e-mail e senha |
| 22 | Validação campeão/artilheiro | **B** — criador informa manualmente; sistema pontua |
| 23 | Exclusão de bolão | **A** — livre antes de iniciar |
| 24 | Limite de participantes | **A** — sem limite |
| 25 | Descoberta | **A** — só por link; sem listagem pública |

## Esclarecimentos pós-revisão

Decisões implícitas que estavam ambíguas na primeira versão do PRD e foram consolidadas:

| Tema | Resolução |
|------|-----------|
| Modo C — escopo v1 | Apenas **campeão** e **artilheiro**. Palpites de fases eliminatórias ficam **fora do escopo v1** (mencionados na Q1, nunca detalhados). |
| "Palpite único" (Q17) | Uma resposta por categoria (campeão, artilheiro), **editável até o kickoff do 1º jogo** — alinhado à Q9. Não significa "enviar uma vez na criação do bolão". |
| Visibilidade modo C (Q8) | Campeão/artilheiro seguem a Q8 com adaptação: ocultos até o bolão iniciar; após iniciar, revelados no **kickoff do 1º jogo** (mesmo momento do deadline). |
| Modos A + B na mesma partida | Pontuação **mutuamente exclusiva**: placar exato pontua só modo A; se errou placar mas acertou resultado, pontua modo B. |
| Status RASCUNHO → ABERTO | **ABERTO** ao concluir o wizard de criação (primeiro save completo). **RASCUNHO** apenas para criação incompleta (wizard abandonado). |
| Criador no bolão | Criador é **participante automático** e pode palpitar como qualquer membro. |
| Palpites antes de "Iniciar" | **Permitidos** em status ABERTO (ficam ocultos). Regras ainda podem mudar até o criador iniciar — participante assume esse risco. |
| Arquivamento vs modo C (Q16 + Q22) | Bolão só vai para **ARQUIVADO** quando: (1) todos os jogos estão finalizados/cancelados **e** (2) se modo C ativo, criador registrou campeão e artilheiro. Até lá permanece **EM_ANDAMENTO**. |
| Escopo API na v1 | Competições do catálogo API = P0. Fallback manual = P0 **somente** quando criador escolhe competição sem API. |

## Regras derivadas

- Apenas o **criador** define regras; após iniciar, **ninguém** altera (nem o criador).
- Bolão **privado** — link é a única porta de entrada.
- Participante que não palpita uma partida **permanece** no bolão com 0 pts naquela partida.
