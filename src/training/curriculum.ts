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
  if (lab === "social" && game === "p5r")
    return [
      {
        title: "Escolha pelo problema que precisa resolver",
        situation:
          "Você tem duas oportunidades de encontro. Um próximo benefício facilita sua rotina; o outro ajuda numa atividade que você quase não usa. Não há urgência de calendário.",
        answers: [
          a(
            "Escolher apenas o rank mais alto",
            "O rank sozinho não diz qual benefício atende sua situação.",
          ),
          a(
            "Comparar o benefício próximo com o que está limitando sua partida",
            "Você está avaliando utilidade, disponibilidade e custo de oportunidade.",
            true,
          ),
          a(
            "Ignorar os benefícios: todo Confidant faz a mesma coisa",
            "Royal dá benefícios próprios a diferentes Confidants; eles não são equivalentes.",
          ),
        ],
      },
      {
        title: "Afinidade não é avanço automático",
        situation:
          "Você leva uma Persona da Arcana correspondente, mas o jogo indica que o vínculo não vai aprofundar ainda.",
        answers: [
          a(
            "Ler os requisitos e avaliar se vale preparar afinidade",
            "A Arcana pode ajudar nos pontos relevantes; não elimina todas as condições para avançar.",
            true,
          ),
          a(
            "Confirmar porque a Arcana garante rank",
            "O bônus não garante automaticamente um avanço.",
          ),
          a(
            "Concluir que a Persona foi equipada errado",
            "A existência de um bônus não implica que o limiar ou requisito já foi atendido.",
          ),
        ],
      },
      {
        title: "Um encontro bloqueado",
        situation:
          "A opção disponível informa um requisito de atributo social que você ainda não alcançou.",
        answers: [
          a(
            "Aumentar o nível do protagonista no combate",
            "Nível de combate não é atributo social.",
          ),
          a(
            "Gastar encontros sem olhar o bloqueio",
            "Pontos de afinidade podem não resolver esse requisito.",
          ),
          a(
            "Preparar o atributo exigido com uma atividade adequada",
            "Você usa a informação do jogo para criar uma prioridade concreta.",
            true,
          ),
        ],
      },
      {
        title: "Aproveitar um benefício",
        situation:
          "Você desbloqueou uma habilidade de Confidant, mas continua seguindo uma rotina antiga que não a utiliza.",
        answers: [
          a(
            "Não mudar nada: um benefício sempre se aplica sozinho",
            "Alguns benefícios exigem uso ou mudam suas opções; leia suas condições.",
          ),
          a(
            "Rever o planejamento à luz do efeito e das condições",
            "Aprender o sistema inclui atualizar a estratégia quando suas possibilidades mudam.",
            true,
          ),
          a(
            "Procurar uma agenda universal e obedecer",
            "Uma agenda fixa pode ignorar seus recursos, objetivos e benefícios atuais.",
          ),
        ],
      },
    ];
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
  if (lab === "team")
    return [
      {
        title: "Diagnóstico da próxima incursão",
        situation:
          "Em três encontros você observou: um alvo fraco a fogo, um que anula gelo e outro sem fraqueza conhecida. O cenário tem aparência azul. O que preparar?",
        answers: [
          a(
            "Somente fogo: azul significa gelo",
            "A aparência da área não define a afinidade de todos os inimigos.",
          ),
          a(
            "Fogo, análise e uma alternativa de dano/suporte",
            "Você usa evidência dos encontros, mantém cobertura e não depende de uma fraqueza presumida.",
            true,
          ),
          a(
            "Somente gelo para combinar com o cenário",
            "O alvo que anula gelo desperdiçaria seu SP. A masmorra não é um tipo único.",
          ),
        ],
      },
      {
        title: "O custo invisível da troca",
        situation:
          "Sua Persona de fogo derruba o alvo. Mas o inimigo restante vai usar gelo, ao qual ela é fraca. Seu HP está baixo e não há ação extra.",
        answers: [
          a(
            "Ignorar a defesa e escolher só pelo maior dano",
            "Trocar de Persona altera sua defesa. O próximo ataque pode encerrar a luta.",
          ),
          a(
            "Reavaliar a Persona equipada, cura e defesa",
            "Considere sobreviver à resposta. Uma alternativa com resistência adequada pode valer mais que dano imediato.",
            true,
          ),
          a(
            "Trocar sem conferir a afinidade",
            "Uma troca sem análise pode manter ou piorar a mesma vulnerabilidade.",
          ),
        ],
      },
      {
        title: "Está na hora de trocar?",
        situation:
          "Sua Persona favorita tem boa cobertura, mas suas habilidades já rendem pouco e as próximas não resolvem lacunas da equipe. Há uma fusão que mantém a cura e melhora a defesa.",
        answers: [
          a(
            "Comparar resultado, herança e custo de recuperar os materiais",
            "Você troca por ganho de função e segurança, não apenas por idade ou nível.",
            true,
          ),
          a(
            "Trocar sempre a cada três níveis",
            "Não existe esse intervalo universal.",
          ),
          a(
            "Nunca fundir uma Persona favorita",
            "Você pode registrar e recuperar materiais. Apego não precisa impedir o desenvolvimento da equipe.",
          ),
        ],
      },
      {
        title: "Qual ataque compensa?",
        situation:
          "Restam 8 SP e há mais encontros. Um ataque barato explora a mesma fraqueza que uma magia muito mais cara; ambos derrubariam o alvo.",
        answers: [
          a(
            "Sempre usar a habilidade mais cara",
            "Pode desperdiçar o recurso necessário para continuar explorando.",
          ),
          a(
            "Escolher pelo nome mais impressionante",
            "O nome não informa o custo de oportunidade.",
          ),
          a(
            "Usar a opção eficiente e guardar recursos",
            "Se o resultado tático é o mesmo, conservar SP melhora a sustentabilidade. Se houver risco de não derrotar, reavalie.",
            true,
          ),
        ],
      },
    ];
  if (lab === "fusion")
    return [
      {
        title: "Antes de confirmar",
        situation:
          "Você melhorou as habilidades de uma Persona e vai usá-la como material. O registro no compêndio está desatualizado.",
        answers: [
          a(
            "Registrar a versão atual e revisar a prévia",
            "Assim você preserva o estado que pretende recuperar. A recuperação ainda pode custar dinheiro.",
            true,
          ),
          a(
            "Fundir: o registro sempre se atualiza sozinho",
            "Não conte com registro automático das melhorias.",
          ),
          a(
            "Apagar o registro para baratear",
            "Isso não é uma estratégia válida para preservar habilidades.",
          ),
        ],
      },
      {
        title: "A armadilha do número maior",
        situation:
          "O resultado da fusão tem nível maior, mas você perderia sua única cura. A herança permite preservar uma habilidade útil.",
        answers: [
          a(
            "Trocar cura por um terceiro ataque redundante",
            "Você deixa a equipe sem recuperação para ganhar redundância.",
          ),
          a(
            "Preservar cura ou garantir outra fonte antes de fundir",
            "Avalie a equipe inteira. A melhor escolha depende do papel que falta.",
            true,
          ),
          a(
            "Ignorar: o nível maior cura automaticamente",
            "Nível não substitui uma habilidade ou item de recuperação.",
          ),
        ],
      },
      {
        title: "A receita do vídeo não bate",
        situation:
          "Uma receita encontrada online dá um resultado diferente na prévia do seu jogo.",
        answers: [
          a(
            "Confirmar e esperar que vire o resultado do vídeo",
            "A prévia do seu jogo prevalece.",
          ),
          a(
            "Concluir que qualquer fusão é aleatória",
            "Fusões normais seguem regras; há exceções e eventos específicos.",
          ),
          a(
            "Conferir edição, DLC e categoria de fusão",
            "Tabelas e disponibilidade mudam entre edições. Receitas especiais e outras exceções não seguem uma fórmula universal.",
            true,
          ),
        ],
      },
      {
        title: "Herança com propósito",
        situation:
          "Você já tem cobertura de fogo e gelo. Está montando um Persona de suporte para encontros longos. Qual prioridade é mais coerente?",
        answers: [
          a(
            "Cura e suporte permitidos pela herança",
            "Confira as restrições na prévia. Você está preenchendo uma função ausente em vez de repetir ataques.",
            true,
          ),
          a(
            "Mais duas magias do mesmo elemento já coberto",
            "Pode ser útil em casos específicos, mas não atende ao objetivo de suporte proposto.",
          ),
          a(
            "Qualquer habilidade rara, sem olhar custo",
            "Raridade não garante sinergia nem SP para usar.",
          ),
        ],
      },
    ];
  return [
    {
      title: "Existe uma prioridade urgente?",
      situation:
        "O prazo para concluir uma exploração obrigatória está próximo. Você tem recursos e ainda não concluiu o objetivo.",
      answers: [
        a(
          "Ignorar o prazo para maximizar um atributo",
          "Melhorar atributos não elimina a obrigação de concluir o objetivo.",
        ),
        a(
          game === "p3r"
            ? "Planejar a exploração noturna e aproveitar a tarde disponível"
            : "Reservar tempo para concluir a exploração com margem",
          game === "p3r"
            ? "Em Reload, explorar acontece à noite. Preserve a distinção de horários."
            : "Criar margem reduz o risco de faltar tempo ou recursos.",
          true,
        ),
        a(
          "Esperar o último momento para descobrir os requisitos",
          "Alguns objetivos exigem preparação ou etapas adicionais. Não presuma que tudo cabe num único slot.",
        ),
      ],
    },
    {
      title: "Encontro não é rank garantido",
      situation:
        "O jogo indica que o vínculo ainda não vai subir. Você tem uma Persona da Arcana correspondente.",
      answers: [
        a(
          "O encontro é inútil porque não sobe rank",
          "Pontos de afinidade podem preparar o próximo avanço.",
        ),
        a(
          "A Arcana correspondente garante rank imediato",
          "Ela pode aumentar os pontos relevantes, mas não ignora requisitos ou limiares.",
        ),
        a(
          "Avaliar se os pontos preparam um avanço e comparar outras opções",
          "Você distingue afinidade de rank e considera o custo de oportunidade.",
          true,
        ),
      ],
    },
    {
      title: "Cinema, estudo ou exploração?",
      situation:
        "Não há prazo urgente. Um vínculo está bloqueado por um atributo. Há uma atividade disponível que melhora esse atributo.",
      answers: [
        a(
          "Treinar esse requisito e conferir o custo de tempo",
          "Você conecta a atividade a uma necessidade concreta. O bônus depende da edição e da atividade.",
          true,
        ),
        a(
          "Ir à dungeon porque subir nível resolve o requisito social",
          "Nível de combate não substitui atributos sociais.",
        ),
        a(
          "Repetir encontros sem conferir o bloqueio",
          "Pontos de afinidade não resolvem necessariamente um requisito de atributo.",
        ),
      ],
    },
    {
      title: "A chuva é uma regra universal?",
      situation:
        "Está chovendo. Um conselho online diz que sempre é obrigatório estudar nesse clima.",
      answers: [
        a(
          "Seguir sem olhar objetivos ou atividade",
          "Isso transforma uma possibilidade em regra universal.",
        ),
        a(
          "Conferir bônus, disponibilidade e objetivo atual",
          "Algumas atividades ganham benefícios. A decisão depende do contexto, não apenas do clima.",
          true,
        ),
        a(
          "Concluir que nenhum vínculo pode existir na chuva",
          "Não generalize a disponibilidade de todos os vínculos e edições.",
        ),
      ],
    },
  ];
}
export const sources = [
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
