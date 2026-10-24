# Velvet Academy

Academia de Persona em português, em React + TypeScript + Vite. Mantém quatro temas para **Persona 5 Royal**, **Persona 3 Reload**, **Persona 4 Golden** e **Persona 2 IS/EP**, sem cenas ou chefes da história.

## Executar

Node.js 22.12+ e npm:

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Não precisa de conta, API ou banco de dados. Artes e fontes são locais. A reserva, companheiros, objetivo e histórico usam `localStorage`, separados por edição. Não há sincronização entre dispositivos.

## Jornada conectada

1. **Minha equipe:** catálogo ilustrado com busca/filtros, habilidades iniciais/futuras, afinidades, reserva do protagonista e três companheiros selecionáveis por edição. São 53 fichas em Royal, 64 em Reload e 48 em Golden, até nível base 35.
2. **Velvet Room:** escolha dois materiais da reserva e veja imagem, nível, Arcana e habilidades do resultado. Compare cobertura antes/depois, escolha uma herança compatível e confirme. Os materiais são registrados e consumidos; o resultado entra na mesma reserva usada na equipe e na batalha.
3. **Modo livre:** configure 1–3 adversários, dificuldade e formação solo/grupo. Dê comandos individuais, cure um aliado, proteja o grupo, explore fraquezas e transfira 1 More em Royal/Reload. Use o histórico para revisar causas. A reserva é fotografada no início de cada encontro.
4. **Planejador:** cenário de até três dias com prazo, recursos, exploração, atributo e afinidade. Cada escolha pede uma intenção e apresenta consequência/custo de oportunidade. Os registros entram no histórico compartilhado.
5. **Oficina de vínculos:** seis casos com escolha e justificativa, alternativas plausíveis, diagnóstico e revisão. O critério de domínio exige cinco casos integralmente corretos; não se ganha aprovação só clicando até acertar.

O curso guiado de combate conserva os quatro encontros anteriores, com **kit emprestado**, para que o aprendizado básico não dependa de uma reserva previamente montada. A oficina de equipe/fusão e a prova de planejamento ficam como exercícios complementares. Persona 2 mantém seus exercícios conceituais próprios, sem fusão dupla moderna, calendário escolar, Social Links ou 1 More.

## Dados e limites

- Catálogo e receitas derivados de [aqiu384/megaten-fusion-tool](https://github.com/aqiu384/megaten-fusion-tool), domínio público. Commit e recorte em `src/academy/DATA-SOURCES.md`.
- `scripts/import-personas.py DATA_REPO ART_DIRECTORY` regenera o catálogo e as receitas ilustradas. Calcula usando a tabela completa de candidatos, depois restringe resultados ao recorte; não troca um resultado ausente por outro disponível.
- Fusão normal dupla, níveis base, sem DLC, especiais, Treasure Demons ou acidentes. Resultado fora do recorte é identificado. Herança limita-se a **uma** habilidade conhecida e compatível por fusão; é um limite pedagógico, não a contagem de vagas dos jogos. Bônus de experiência, Traits e evolução de nível não são simulados.
- Capacidade de 12 e recuperação gratuita são escolhas do laboratório. Não representam dinheiro, aquisição ou progressão de capacidade da partida.
- Companheiros usam kits de função e atributos normalizados, não suas fichas naturais de um nível específico. O modo livre executa um subconjunto das habilidades visíveis no compêndio. Ataques elementais simples, cura e suporte têm custos e potência de treino; Media funciona como cura individual neste recorte.
- Dificuldade usa parâmetros por edição, documentados no manual da arena. Para Royal foi adotada a tabela japonesa (Merciless: dano 0,64; fraqueza 1,25 × 3), que diverge de números arredondados de outros guias. Reload e Golden têm tabelas próprias. HP base não aumenta ao trocar dificuldade.
- A batalha não emula a fórmula completa de atributos/níveis, IA, precisão, críticos, Technical no modo livre, Theurgy, itens, recompensas ou efeitos sociais. Inimigos respondem ao fim da rodada aliada, não recebem 1 More e gastam a ação ao levantar; drenar/repelir na defesa do jogador anulam dano. O guia explica essas diferenças.
- Planejamento e encontros são cenários novos. Seus contadores e limiares não representam datas, pontos ou ranks reais de personagens. A identidade visual é inspirada nos jogos, não uma réplica da interface oficial.

Artes © ATLUS / SEGA. Origens e limites em `public/ART-CREDITS.md`. Links externos podem conter spoilers.

## Verificar

```sh
npm run lint
npm test
npm run build
npm run test:e2e
```

Playwright usa `CHROMIUM_PATH` quando informado; caso contrário usa `/usr/bin/chromium` se disponível ou o Chromium instalado pelo Playwright. Exemplo: `CHROMIUM_PATH=/caminho/para/chrome npm run test:e2e`.

Testes verificam contratos de fusão/herança, catálogo e artes, persistência por edição, turnos individuais, restrições de comandos, dificuldade, curso guiado, oficina de vínculos, consequências do planejamento e layout em 320/390/1440 px.

## Publicação

`.github/workflows/pages.yml` testa e publica pushes na branch `main` no GitHub Pages. Endereço esperado: https://seikyzz.github.io/personasimulador/. Build do Pages: `npm run build -- --base=/personasimulador/`. O build padrão funciona na raiz de outros hosts.

Nenhuma publicação é necessária para testar localmente. O código original de uma versão anterior permanece em `reference/original-src/`, fora da aplicação e do TypeScript.

## Aprendizado para quem está começando

“Começar do zero” abre seis aulas nos jogos modernos (e uma introdução própria para Persona 2): termos em português, explicação, exemplo resolvido, previsão com correção e aplicação no simulador. O progresso de previsões fica em `va-foundations-v1-<edição>` e não substitui a aprovação dos exercícios de combate. O glossário também pode ser aberto nas telas de prática.

Vínculos oferecem dois ensaios com condições diferentes e cenas inéditas para Chie/Yukiko (Golden), Aigis (Reload, retrato clássico) e interlocutor fictício em Royal. As respostas ficam travadas depois da avaliação: errar não pode ser apagado escolhendo todas as alternativas. A correção explica a decisão e o motivo. Não há pontuação oficial dos personagens nem garantia de maximização no jogo.

O planejador calcula horários compatíveis restantes e alerta quando adiar a exploração torna o prazo impossível. O modo livre oferece previsão opcional de afinidade e feedback contextual. Media agora cura aliados vivos em grupo; Tarunda afeta somente o inimigo selecionado. Os demais limites do motor continuam explícitos.

A página de fontes contém buscas de vídeos por assunto e edição e um método para estudar ativamente. Essas buscas não equivalem a vídeos assistidos: consulte `src/academy/DATA-SOURCES.md` para o registro de evidências e limitações desta revisão.
