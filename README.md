# Velvet Academy

Laboratório de estudo de Persona em português, sem roteiro de história. React + TypeScript + Vite. Temas próprios para Persona 5 Royal, Persona 3 Reload, Persona 4 Golden e Persona 2 (IS/EP).

## Executar

Use Node.js 22.12+ (validado com Node 24) e npm.

```sh
npm ci
npm run dev
```

A aplicação usa a porta 3000. Não precisa de conta, chave de API, Firebase ou servidor de banco de dados. Artes e fontes são servidas localmente. Equipe, jogo selecionado, opção de movimento e conceitos estudados ficam no localStorage do navegador. O progresso é separado por jogo; não há sincronização entre dispositivos.

## Verificar

```sh
npm run lint
npm test
npm run build
npm run test:e2e
```

Os testes de navegador usam Chromium em `/usr/bin/chromium`. Em outra máquina, informe `CHROMIUM_PATH` com o caminho de um Chromium instalado. Testes incluem fraquezas, resistência, custos, fim da batalha, temas, artes, salvamento, rotina e layout móvel.

## Trilha de aprendizado v2

Comece em **Começar do zero**. Cada etapa apresenta objetivo, regra curta, decisões e revisão de erros. O formato 20/80 representa uma explicação para quatro decisões, não uma medição de tempo. Aprovação depende de evidência, não de marcar um texto como lido.

- Quatro identidades de interface: recortes/contraste em Royal, diagonais/ciano e navegação à direita em Reload, molduras de TV/fundo amarelo em Golden, janelas clássicas em Persona 2.
- Quatro encontros táticos progressivos por jogo moderno, com adversários ilustrados, afinidades por edição, intenção de ataque, HP/SP, troca de Persona, cura, defesa, suporte, sono, 1 More e All-Out Attack. Royal tem transferência com bônus didático e Technical; Reload tem Shift sem esse bônus; Golden não tem transferência.
- Prova avançada exige vitória em até oito rodadas, HP mínimo, fraqueza, defesa e debuff. Os testes executam estratégias que demonstram que os critérios são alcançáveis nas três edições.
- Quatro decisões comentadas em cada prova de equipe, fusão, rotina e Confidants. São necessários três acertos iniciais; errar exige corrigir e depois revisar. Progresso salvo separadamente por edição.
- Conversas de treino com retratos de Chie/Yukiko (Golden) e Aigis (laboratório de Reload com retrato clássico identificado). As cenas são originais, sem falas do jogo, e não simulam os ranks/pontos reais dos personagens. Royal tem uma prova de decisões de Confidants sem retrato específico.
- Fichas de quatro Personas com habilidades, nível e afinidades de P3R/P4G/P5R; comparação de equipe e exercícios livres de herança/rotina.
- Persona 2 tem provas conceituais próprias de compatibilidade, contatos, cartas e sequência. Não usa 1 More ou Social Links.
- Fontes consultadas, créditos das artes e buscas externas claramente identificadas. Fontes e artes carregam localmente.

## Limites explícitos

O motor é didático e determinístico, não uma emulação completa. Dano, custo, duração, precisão e HP são normalizados; os kits de treino não são uma ficha de habilidades naturais. O guia dentro da arena descreve os detalhes: grupo simplificado, sono garantido, Technical em condição específica e efeito coletivo didático de Tarunda. Theurgy, críticos aleatórios, itens, negociação e Shuffle Time não estão implementados.

Não há calculadora completa de fusão/herança legal, calendário de história, simulador completo de batalhas de IS/EP nem catálogo de todos os inimigos. Os cenários são ilustrações em CSS inspiradas na direção visual dos jogos, não capturas de masmorras. As imagens dos adversários são modelos de Personas: não indicam a forma ou ocorrência de Shadows numa área real.

Não foram incluídos spoilers de enredo, chefes ou eventos de vínculos. Artes, nomes e Arcanas das figuras selecionadas são visíveis. Links externos podem conter spoilers. YouTube e Reddit são buscas complementares não auditadas; não foram apresentados como vídeos assistidos ou discussões revisadas.

## Estrutura e verificação

`src/training/engine.ts` contém as regras determinísticas. `Training.tsx`, `Social.tsx` e `curriculum.ts` implementam a trilha e seus exercícios. `training.css` contém as quatro identidades visuais. `tests/training-engine.test.ts` verifica regras e estratégias; os testes de navegador verificam fluxo, pontuação, persistência, retratos, temas e telas de 320/390/1440 px. `tests/find-strategy.ts` é uma ferramenta de desenvolvimento para encontrar caminhos de vitória, fora da suíte padrão.

## Código recebido

Os componentes e dados antigos foram preservados em `reference/original-src/`, fora da aplicação e da checagem TypeScript. O ZIP recebido referenciava módulos de exportação/configuração que não estavam no arquivo. A nova aplicação é local e não depende dessas integrações. O conflito original entre Vite 8 e esbuild 0.25 foi corrigido com uma versão compatível e um lockfile.
