# Bolão entre Amigos

App web para bolões privados de futebol entre amigos — ranking e diversão, sem dinheiro e sem casa de apostas.

## Language

### Pessoas e acesso

**Usuário**:
Pessoa com conta autenticada (e-mail/senha) no app.
_Avoid_: User (em copy de UI), account holder

**Criador**:
Usuário que criou um bolão; também é participante automático.
_Avoid_: Owner, admin, organizer

**Participante**:
Usuário membro de um bolão, incluindo o criador.
_Avoid_: Player, member (em copy de UI)

### Bolão e ciclo de vida

**Bolão**:
Grupo privado de palpites vinculado a uma competição, com regras de pontuação e ranking.
_Avoid_: Pool (em copy de UI), liga, campeonato (quando se refere ao grupo de amigos)

**Status do bolão**:
Estado do ciclo de vida: `DRAFT`, `OPEN`, `IN_PROGRESS`, `ARCHIVED`.
_Avoid_: Rascunho/Aberto/Em andamento/Arquivado como identificadores de código (usar enums em inglês no schema)

**DRAFT**:
Wizard de criação incompleto; bolão ainda não configurado.
_Avoid_: Rascunho (como valor de enum)

**OPEN**:
Wizard concluído; bolão aceita participantes e palpites ocultos; regras ainda editáveis pelo criador.
_Avoid_: Aberto (como valor de enum)

**IN_PROGRESS**:
Bolão iniciado pelo criador; regras e membros travados; palpites seguem deadlines por partida.
_Avoid_: Active, started, em andamento (como valor de enum)

**ARCHIVED**:
Bolão encerrado; ranking congelado; somente leitura.
_Avoid_: Closed, finished

**Iniciar bolão**:
Ação do criador que transiciona de `OPEN` para `IN_PROGRESS`, travando regras e composição do grupo.
_Avoid_: Start game, kick off (para o bolão)

### Competição e partidas

**Competição**:
Torneio de futebol ao qual um bolão está vinculado (ex.: Brasileirão, Copa do Mundo). Um bolão tem exatamente uma competição.
_Avoid_: Championship, tournament (em copy de UI)

**Partida**:
Jogo individual dentro de uma competição, com mandante, visitante, horário de kickoff e resultado oficial.
_Avoid_: Match (em copy de UI), fixture (em copy de UI)

**Kickoff**:
Horário oficial de início da partida; deadline padrão para palpites de placar e resultado.
_Avoid_: Start time, game time

**Fonte da competição**:
`api` (dados sincronizados via football-data.org) ou `manual` (cadastro e resultados pelo criador).
_Avoid_: automatic/manual como sinônimos vagos

### Palpites e modos

**Palpite**:
Previsão de um participante para uma partida ou extra de torneio, com tipo e valor estruturado.
_Avoid_: Bet, wager, guess (em copy de UI)

**Modo A (placar exato)**:
Palpite do placar completo (gols mandante × visitante).
_Avoid_: Exact score mode, modo placar

**Modo B (resultado)**:
Palpite de vitória do mandante, empate ou vitória do visitante.
_Avoid_: Result-only mode, 1X2

**Modo C (extras de torneio)**:
Palpites de campeão e artilheiro do torneio; uma resposta por categoria.
_Avoid_: Tournament extras, props

**Deadline**:
Momento após o qual um palpite não pode mais ser editado (kickoff da partida ou do primeiro jogo, para modo C).
_Avoid_: Lock time, cutoff (em copy de UI)

### Pontuação e ranking

**Pontuação**:
Pontos atribuídos automaticamente (com API) ou após entrada manual de resultados, conforme regras do bolão.
_Avoid_: Score (quando se refere a pontos do ranking), betting odds

**Ranking**:
Ordenação dos participantes por pontos totais, com desempate configurável (padrão: mais placares exatos).
_Avoid_: Leaderboard (em copy de UI), standings (em código pode ser `Standing`)

**Desempate**:
Regra que ordena participantes empatados em pontos totais.
_Avoid_: Tie-break, tiebreaker rule (em copy de UI)

### Convite e privacidade

**Link de convite**:
URL única com token não sequencial (`/b/{token}`) para entrar em um bolão `OPEN`.
_Avoid_: Share link, referral URL

**Visibilidade de palpites**:
Palpites ocultos até o bolão iniciar; depois ocultos até o kickoff de cada partida (e do primeiro jogo para modo C).
_Avoid_: Spoiler mode, privacy setting
