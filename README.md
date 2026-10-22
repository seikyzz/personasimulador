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

## Incluído

- Interface responsiva com fundos animados diferentes por jogo, animação opcional e respeito a reduced-motion.
- Combate de treino com dois alvos fictícios, análise de afinidade, magia, cura, defesa, 1 More, All-Out Attack, HP/SP e histórico.
- Laboratório de função e herança: avalia prioridades de uma seleção, explica perdas e registro de materiais.
- Fichas iniciais de quatro Personas com artes originais locais, habilidades, nível e afinidades por edição (P3R/P4G/P5R); grupo de estudo limitado a três.
- Planejador de um dia fictício: prazo, recursos, clima, disponibilidade e explicação do custo de oportunidade.
- Biblioteca de conceitos com progresso local, diferenças de edição e sem informações de enredo.
- P2 tem exercícios conceituais separados de ordem de ações, preparação e invocação por cartas.

## Limites explícitos

Não é uma emulação completa dos jogos. Valores de dano/HP/SP são didáticos. Baton Pass, Shift, Technical, Theurgy, negociação e Shuffle Time são explicados, mas não reproduzidos no motor de combate. A fusão não calcula receitas ou heranças legais; um link de consulta externa por edição fica identificado. P2 não implementa receitas de Fusion Spells nem diferenças completas entre IS e EP. O calendário não reproduz eventos, datas ou todos os custos de atividades. Não há spoilers de história, chefes ou locais; as fichas exibem nomes e artes de algumas Personas.

O acervo completo de habilidades/Personas não está incluído. As fichas são um conjunto inicial verificável, com as fontes em `public/ART-CREDITS.md`. As artes podem representar uma edição visual diferente da selecionada. Marcas e artes pertencem à ATLUS/SEGA; não são artes geradas.

## Código recebido

Os componentes e dados antigos foram preservados em `reference/original-src/`, fora da aplicação e da checagem TypeScript. O ZIP recebido referenciava módulos de exportação/configuração que não estavam no arquivo. A nova aplicação é local e não depende dessas integrações. O conflito original entre Vite 8 e esbuild 0.25 foi corrigido com uma versão compatível e um lockfile.
