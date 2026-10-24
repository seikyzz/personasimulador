import { chapters, type Decision } from "../academy/learning";
import type { Game } from "../academy/content";
export type Answer = { text: string; why: string; correct?: boolean };
export type Question = { title: string; situation: string; answers: Answer[] };
export type Lab = "team" | "fusion" | "calendar" | "classic" | "social";
export const labNames: Record<Lab, string> = {
  team: "Prepare uma equipe de verdade",
  fusion: "Decida o que vale fundir",
  calendar: "Planeje sem seguir um roteiro",
  classic: "Domine os fundamentos de Persona 2",
  social: "Decida como desenvolver seus Confidants",
};
export const theory: Record<Lab, string> = {
  team: "Não existe uma tipagem única de masmorra. Registre os inimigos encontrados, cubra suas fraquezas e mantenha cura e suporte. Trocar de Persona também muda a sua defesa.",
  fusion:
    "Fusão é uma decisão de função, custo e herança. Registre materiais, confira a prévia e preserve habilidades essenciais. Um nível maior não compensa uma equipe que perdeu sua única cura.",
  calendar:
    "Priorize prazo real, disponibilidade e requisitos. Pontos de afinidade não são ranks. A atividade ideal depende do que está faltando, não de uma rotina universal.",
  classic:
    "IS e EP usam contatos, cartas, compatibilidade e combinações de habilidades. Não importam o calendário escolar, Social Links ou 1 More dos jogos modernos.",
  social:
    "Em Royal, Confidants têm benefícios próprios. Compare o próximo benefício com sua necessidade, confira requisitos e disponibilidade e diferencie pontos de afinidade de rank. Não há uma ordem obrigatória para toda partida.",
};
const a = (text: string, why: string, correct = false): Answer => ({
  text,
  why,
  correct,
});
export function questions(lab: Lab, game: Game): Question[] {
  if (game !== "p2" && lab !== "classic") {
    const course = chapters(game);
    const id = {team:"reserve",fusion:"fusion",calendar:"day",social:"social"}[lab];
    const chapter = course.find(c => c.id === id)!;
    const extra: Record<string, Decision[]> = {
      team: [
        {prompt:"Um aliado já cobre vento, mas tem pouco SP. O próximo trecho contém vários alvos fracos a vento. Qual redundância tem função clara?",options:["Outra fonte de vento com recurso disponível.","Um terceiro ataque do elemento já abundante.","Uma habilidade cara que ninguém consegue pagar."],correct:0,feedback:["Redundância pode ser reserva de recursos; não é sempre desperdício.","Pode ajudar em outro trecho, mas não sustenta a resposta observada aqui.","Cobertura na ficha sem recurso disponível não é uma ação utilizável."]},
        {prompt:"A luta é longa e o alvo causa muito dano, sem fraqueza conhecida. Você já tem ataque e cura. Qual função vale testar?",options:["Outro ataque igual para o mesmo personagem.","Redução de ataque ou proteção bem aplicada.","Troca para maior nível sem ler habilidades."],correct:1,feedback:["Não cria uma função nova nem reduz a pressão por si só.","Suporte pode reduzir o gasto de cura. Confira alvo, duração e a ação necessária para mantê-lo.","Nível sem função e defesa não explica como sobreviver melhor."]}
      ],
      fusion: [
        {prompt:"Você já tem cura em dois integrantes, mas falta vento. O resultado aceita Dia ou Garu e não começa com nenhum dos dois. Qual herança atende à lacuna?",options:["Dia, para repetir a recomendação anterior.","Nenhuma, para liberar todos os espaços.","Garu, para criar uma resposta de vento."],correct:2,feedback:["Cura é valiosa, mas o contexto já mudou: há duas fontes.","Deixar espaço não fornece a resposta ausente.","Escolha pelo problema atual. Herança de cura não é uma regra universal."]},
        {prompt:"Você registrou um material antes de fundir. Depois quer usá-lo de novo. Qual passo ainda precisa considerar?",options:["Invocação pelo compêndio e seu custo.","Retorno automático ao terminar a luta.","Troca da Persona equipada para desfazer fusão."],correct:0,feedback:["Registro preserva uma possibilidade de recuperação; não mantém o material carregado nem elimina o custo.","A fusão consumiu o material. Registro não é retorno automático.","Trocar a equipada não desfaz uma fusão confirmada."]}
      ],
      calendar: [
        {prompt:"Hoje há bônus de estudo, mas o atributo já atende seu objetivo. Um vínculo raro também está pronto para avançar; não há urgência de exploração. Qual comparação é mais útil?",options:["Quantidade de bônus, sem olhar requisitos.","Valor do próximo avanço e raridade da ocasião.","Nível de combate de quem aparece no mapa."],correct:1,feedback:["Bônus não é objetivo por si só; compare o que ele libera.","Você considera utilidade e oportunidade. Estudar continua possível, mas precisa de uma razão.","Nível de combate não mede o valor desse período social."]},
        {prompt:"O calendário do cenário ainda tem espaço, mas faltam recursos para a incursão. Prepará-los custa um período aqui. O que precisa caber no plano?",options:["Só os horários de exploração.","Só a atividade de preparação.","Preparação antes da incursão e ambos os horários."],correct:2,feedback:["Um horário reservado sem recurso não permite executar o plano.","Recursos prontos não concluem a exploração sozinhos.","Você planeja uma dependência: primeiro viabilizar, depois executar."]}
      ],
      social: [
        {prompt:"Um Confidant oferece um benefício que reduz seu problema recorrente de recursos; outro melhora uma atividade que você não utiliza. Ambos estão disponíveis, sem prazo. O que comparar?",options:["Benefício próximo e uso real na sua rotina.","Rank mais alto sem conferir o próximo efeito.","Nível da Persona da Arcana correspondente."],correct:0,feedback:["O efeito que você consegue usar agora tem valor concreto; confira condições e custo de avançar.","O número do rank não explica a utilidade do benefício.","Nível da Persona não define o serviço do Confidant."]},
        {prompt:"Você levou a Arcana correspondente e ganhou pontos, mas não avançou. Qual verificação evita gastar outro período pelo motivo errado?",options:["Trocar por outra Persona de nível maior.","Ler o aviso de avanço e os requisitos restantes.","Confirmar de novo sem consultar as condições."],correct:1,feedback:["O bônus depende da correspondência quando aplicável, não desse aumento de nível.","Pontos, acesso e rank são diferentes. O aviso orienta o próximo passo.","Repetir pode ajudar afinidade, mas não resolve qualquer tipo de bloqueio."]}
      ]
    };
    return [...chapter.decisions, ...extra[lab]].map((d,i)=>({title:`Aplicação ${i+1} · ${chapter.goal}`,situation:d.prompt,answers:d.options.map((text,n)=>({text,why:d.feedback[n],correct:n===d.correct}))}));
  }

  if (game === "p2" || lab === "classic")
    return [
      {
        title: "O grupo não está funcionando",
        situation:
          "Uma Persona de nível alto custa muito SP no personagem que a equipou. Você tem uma alternativa de nível menor com boa compatibilidade.",
        answers: [
          a(
            "Manter o maior nível sempre",
            "Nível não elimina os efeitos de compatibilidade e custo.",
          ),
          a(
            "Comparar compatibilidade, habilidades e custo",
            "Boa decisão. Em P2, a escolha também depende de quem equipa a Persona.",
            true,
          ),
          a(
            "Procurar o Social Link dessa Arcana",
            "P2 não possui Social Links. Isso pertence aos jogos posteriores.",
          ),
        ],
      },
      {
        title: "Prepare a invocação",
        situation:
          "Você quer obter uma Persona nova, mas não tem as cartas necessárias.",
        answers: [
          a(
            "Fundir duas Personas como em Royal",
            "A invocação de P2 não usa o sistema moderno de duas Personas.",
          ),
          a(
            "Treinar o calendário escolar",
            "Não há calendário escolar de slots em P2.",
          ),
          a(
            "Investigar contatos e cartas da Arcana exigida",
            "Contatos, cartas e requisitos da invocação fazem parte deste ciclo. Confira a edição IS ou EP.",
            true,
          ),
        ],
      },
      {
        title: "A combinação não saiu",
        situation:
          "O grupo conhece as habilidades de uma combinação, mas a execução não corresponde à receita.",
        answers: [
          a(
            "Conferir ordem, participantes e condições da receita",
            "Conhecer as habilidades não basta: a sequência e as condições da combinação importam.",
            true,
          ),
          a("Usar Baton Pass", "Baton Pass não existe em P2."),
          a(
            "Subir nível até ativar automaticamente",
            "Nível não corrige uma sequência de ações incompatível.",
          ),
        ],
      },
      {
        title: "Transferir conhecimento entre edições",
        situation:
          "Você encontrou uma tabela de uma das versões de Persona 2. Pode usar todos os números na outra?",
        answers: [
          a(
            "Sim, IS e EP são o mesmo sistema em todos os detalhes",
            "Os jogos compartilham fundamentos, mas possuem diferenças de dados e regras.",
          ),
          a(
            "Usar o conceito e conferir os dados na edição correta",
            "Essa é a forma segura de transferir aprendizado sem inventar equivalências.",
            true,
          ),
          a(
            "Usar a tabela de Persona 5 Royal",
            "A estrutura de invocação e combate é diferente.",
          ),
        ],
      },
    ];
  return [];
}

export const sources = [
  {
    title: "How To MAX Your Persona’s Stats in Persona 4 Golden · Tiller Bric",
    url: "https://www.youtube.com/watch?v=m50xMSJpgv4",
    kind: "DOSSIÊ DO USUÁRIO · VÍDEO NÃO ACESSÍVEL",
    detail: "O resumo fornecido descreve otimização de atributos por cartas. O laboratório ensina escolha, penalidades e ordem; não promete recuperação infinita nem reproduz uma transcrição auditada do vídeo.",
  },
  {
    title: "PERSONA 4 GOLDEN FOR BEGINNERS · SuperButterBuns",
    url: "https://www.youtube.com/watch?v=G0rJafN26c8",
    kind: "DOSSIÊ DO USUÁRIO · VÍDEO NÃO ACESSÍVEL",
    detail: "Referência enviada para fundamentos e preparação. Título e atribuição vêm do dossiê. Conteúdo narrativo e instruções de finais foram omitidos da adaptação do site.",
  },
  {
    title: "Persona 4 Golden: The Ultimate Beginner Tips (Do This First) · CritZy",
    url: "https://www.youtube.com/watch?v=oOxHjaNohFM",
    kind: "ENVIADO PELO USUÁRIO · VÍDEO NÃO VERIFICADO",
    detail: "Link e resumo fornecidos pelo usuário. O vídeo não pôde ser acessado nesta rede; a atribuição e a transcrição não foram conferidas. O resumo mistura estratégia de otimização com informações de história. O site aproveita apenas princípios sem spoilers e não apresenta terminar toda dungeon em um dia como obrigação.",
  },
  {
    title: "Alvos das habilidades · dados por edição",
    url: "https://github.com/aqiu384/megaten-fusion-tool/tree/0b207612f6cdcff092e62af16f5c355271a1d892/src/app",
    kind: "CONSULTADO · DADOS",
    detail: "Conferidos os arquivos skill-data.json de p3r, p4 e p5: Media tem alvo All allies, Tarunda 1 foe, Rakukaja 1 ally. O modo livre agora respeita esses alvos; custos e potências continuam didáticos. Isso não valida uma reprodução completa do combate.",
  },
  {
    title: "Fusão de mesma Arcana · implementação de referência",
    url: "https://github.com/aqiu384/megaten-fusion-tool/blob/0b207612f6cdcff092e62af16f5c355271a1d892/src/app/compendium/fusions/per-nonelem-fusions.ts",
    kind: "CONSULTADO · CÓDIGO",
    detail: "Referência de seleção de resultados por níveis e categoria. O catálogo do site é um recorte até nível 35, sem todas as exceções, DLC ou fusões especiais. Use a prévia do seu jogo para confirmar.",
  },
  {
    title: "Dados por edição · Megaten Fusion Tool",
    url: "https://github.com/aqiu384/megaten-fusion-tool",
    kind: "CONSULTADO",
    detail:
      "Fonte dos níveis, habilidades e afinidades das fichas P3R/P4G/P5R. Dados de comunidade; a prévia do seu jogo prevalece.",
  },
  {
    title: "P5 / Royal · calculadora de fusão",
    url: "https://github.com/chinhodado/persona5_calculator",
    kind: "CONSULTADO",
    detail:
      "Referência de estrutura de receitas e diferenças de Royal. Catálogos externos podem revelar Personas.",
  },
  {
    title: "Retratos · Persona 4 Dialogue Generator",
    url: "https://github.com/opennoise1/p4-dialogue-generator",
    kind: "CONSULTADO",
    detail:
      "Acervo de retratos de Chie e Yukiko. Só selecionamos roupas e expressões comuns. O acervo completo contém spoilers.",
  },
  {
    title: "Retratos · P3 Dialogue Maker",
    url: "https://github.com/Gosh42/p3-dialogue-maker",
    kind: "CONSULTADO",
    detail:
      "Retrato de Aigis da era clássica, identificado na interface. Não é uma captura de Reload.",
  },
  {
    title: "YouTube · estratégias de combate sem spoilers",
    url: "https://www.youtube.com/results?search_query=Persona+5+Royal+combat+mechanics+beginner+no+spoilers",
    kind: "BUSCA EXTERNA",
    detail:
      "Busca complementar, não vídeo assistido ou validado. Títulos, miniaturas e comentários podem conter spoilers.",
  },
  {
    title: "Comunidade · dúvidas de mecânicas",
    url: "https://www.reddit.com/r/persona/search/?q=beginner%20combat%20mechanics&restrict_sr=1",
    kind: "BUSCA EXTERNA",
    detail:
      "Discussões não auditadas. Confira edição, data e demonstração no jogo; evite tópicos de história.",
  },
];
