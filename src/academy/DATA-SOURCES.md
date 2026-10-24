Fonte: https://github.com/aqiu384/megaten-fusion-tool
Commit: 0b207612f6cdcff092e62af16f5c355271a1d892

Recorte ilustrado até nível 35. Fusão normal dupla, níveis base, sem DLC/especiais/Treasure Demons. Uma herança compatível por fusão é limite didático.

## Revisão didática — 24/10/2026

- Conferidos `src/app/{p3r,p4,p5}/data/skill-data.json` no checkout da referência: alvos de Dia (um aliado), Media (todos os aliados), Rakukaja (um aliado), Tarunda (um inimigo). Corrigidos os alvos de Media e Tarunda no modo livre. Custos, potências e ordem de respostas seguem simplificados.
- Consultada a implementação `src/app/compendium/fusions/per-nonelem-fusions.ts` para distinguir categoria/nível da simples soma de materiais.
- Aulas e cenas de vínculos são textos didáticos originais. Não são transcrições de guias, diálogos oficiais ou tabelas de afinidade de personagens. Cada correção de diálogo avalia o pedido explícito da cena fictícia.
- YouTube, Fandom, Atlus, GameFAQs, wikiwiki.jp e Gamewith ficaram inacessíveis na rede desta revisão. Nenhum vídeo foi assistido ou usado como citação verificada. As buscas por assunto e edição na página de fontes são sugestões de estudo externo, não referências auditadas.
- Os multiplicadores de dificuldade já presentes no projeto foram preservados; as fontes externas deles não puderam ser revalidadas nesta revisão. Não equivalem à fórmula completa de combate.

## Referência enviada pelo usuário e preservação visual

Recebido o link `https://www.youtube.com/watch?v=oOxHjaNohFM`, atribuído pelo usuário ao canal CritZy, junto a um resumo parcial. A consulta ao vídeo foi bloqueada (403); título, autoria e transcrição ainda não foram conferidos. O trecho termina antes da tabela de prioridades; os outros dois vídeos citados não foram recebidos. Não foi possível afirmar que houve extração completa.

A adaptação não incorpora informações de finais, datas de desbloqueio de conteúdo narrativo ou dungeons ligadas à história. “Concluir em um dia” foi tratado como estratégia de economia de períodos, não requisito universal ou garantia de maximização. A atribuição de disponibilidade e regras específicas ainda precisa de evidência por edição.

A biblioteca voltou aos cartões com ícones; as aulas complementares usam os componentes existentes. O elenco social voltou aos botões com retratos e à cena de diálogo já existente. O CSS de aprendizado que afetava componentes globais foi removido.

## Dossiê completo e motor livre — 24/10/2026

O documento completo foi lido. A análise por seção está publicada, sem reproduzir spoilers, em `public/REVISAO-DOSSIE.md`. Os três vídeos retornaram bloqueio de rede; nenhum foi apresentado como assistido. Recomendações absolutas foram qualificadas e tabelas não verificadas não viraram dados factuais do simulador.

`combat-skills.json` foi extraído por `scripts/import-combat-skills.py` da mesma revisão `0b207612f6cdcff092e62af16f5c355271a1d892` de aqiu384/megaten-fusion-tool. Usa skill-data + complementos Golden/Royal, selecionando habilidades de dano, cura e um subconjunto de suporte. O custo codificado >=1000 foi convertido em SP; custos físicos em percentuais de HP máximo. Os alvos individuais/grupo e elementos são preservados. O motor não replica efeitos secundários, multi-hit, precisão, críticos e todas as passivas. Potência importada serve de referência para uma fórmula normalizada de treino, não a fórmula original. Charge usa multiplicador didático; suporte dura três fases inimigas neste motor.

Conferidos separadamente níveis e aprendizados de Ame-no-Uzume, Taotie e Black Frost em Golden, além dos metadados de Invigorate 1 e Revolution. Não é suficiente para afirmar uma receita completa, disponibilidade de história ou probabilidade de cartas.

As seleções Portable e IS/EP são modos de estudo com exercícios explícitos. Não foram anunciadas como motores de batalha equivalentes a essas edições. Os laboratórios de tempo, orçamento, cartas e contatos usam números/ações fictícios para ensinar decisões e deixam esses limites visíveis.
