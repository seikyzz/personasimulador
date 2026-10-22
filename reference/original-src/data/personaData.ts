export type GameId = 'p5r' | 'p3r' | 'p4g' | 'p2';

export interface GameConfig {
  id: GameId;
  title: string;
  shortTitle: string;
  subtitle: string;
  releaseEra: string;
  accentHex: string;
  accentTextClass: string;
  accentBgClass: string;
  accentBorderClass: string;
  accentSoftBgClass: string;
  canvasBgHex: string;
  terms: {
    socialSystem: string;
    dungeonSystem: string;
    combatChain: string;
    socialStatsCount: string;
    timeUnit: string;
  };
  corePhilosophy: string;
}

export const GAMES: Record<GameId, GameConfig> = {
  p5r: {
    id: 'p5r',
    title: 'Persona 5 Royal',
    shortTitle: 'P5 Royal',
    subtitle: 'Confidants, Palácios, Baton Pass & Dano Technical',
    releaseEra: 'Trilogia Moderna',
    accentHex: '#E11D48',
    accentTextClass: 'text-rose-400',
    accentBgClass: 'bg-rose-600 hover:bg-rose-500 text-white',
    accentBorderClass: 'border-rose-500/40',
    accentSoftBgClass: 'bg-rose-950/30',
    canvasBgHex: '#090B10',
    terms: {
      socialSystem: 'Confidants (Habilidades + Fusão)',
      dungeonSystem: 'Palácios & Mementos',
      combatChain: '1 More → Baton Pass & Technical',
      socialStatsCount: '5 Atributos Sociais (Rank 1–5)',
      timeUnit: 'Manhã · Pós-Aula · Noite',
    },
    corePhilosophy:
      'Em P5R, todo Confidant concede habilidades passivas de jogo (não apenas EXP de fusão). Dominar o jogo significa priorizar os Confidants que destravam mais ações no calendário (Temperance e Fortune) e usar Dano Technical para derrubar inimigos sem fraqueza elemental.',
  },
  p3r: {
    id: 'p3r',
    title: 'Persona 3 Reload',
    shortTitle: 'P3 Reload',
    subtitle: 'Social Links Escolares, Tartarus, Shift & Theurgy',
    releaseEra: 'Trilogia Moderna',
    accentHex: '#0EA5E9',
    accentTextClass: 'text-sky-400',
    accentBgClass: 'bg-sky-600 hover:bg-sky-500 text-white',
    accentBorderClass: 'border-sky-500/40',
    accentSoftBgClass: 'bg-sky-950/30',
    canvasBgHex: '#070D19',
    terms: {
      socialSystem: 'Social Links & Episódios de Link',
      dungeonSystem: 'Tartarus (264 Andares) & Lua Cheia',
      combatChain: '1 More → Shift & Theurgy',
      socialStatsCount: '3 Atributos Sociais (Rank 1–6)',
      timeUnit: 'Pós-Aula · Noite (Hora Sombria)',
    },
    corePhilosophy:
      'Em P3R, a grande armadilha para iniciantes é que quase todos os Social Links acontecem à tarde na escola. Se você gastar as tardes com Social Links de fora da escola ou subindo status sociais, ficará sem nada para fazer durante as férias escolares.',
  },
  p4g: {
    id: 'p4g',
    title: 'Persona 4 Golden',
    shortTitle: 'P4 Golden',
    subtitle: 'Canal da Meia-Noite, Clima de Inaba & Shuffle Time',
    releaseEra: 'Trilogia Moderna',
    accentHex: '#F59E0B',
    accentTextClass: 'text-amber-400',
    accentBgClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    accentBorderClass: 'border-amber-500/40',
    accentSoftBgClass: 'bg-amber-950/30',
    canvasBgHex: '#11100C',
    terms: {
      socialSystem: 'Social Links & Passeios de Moto',
      dungeonSystem: 'Masmorras da TV (Neblina)',
      combatChain: '1 More → All-Out & Shuffle Time',
      socialStatsCount: '5 Atributos Sociais (Rank 1–5)',
      timeUnit: 'Pós-Aula · Noite (Previsão do Tempo)',
    },
    corePhilosophy:
      'Em P4G, o calendário gira em torno da Previsão do Tempo (Chuva e Neblina). Em dias de chuva, quase nenhum Social Link aparece, mas o Desafio do Mega Beef Bowl no Aiya sobe 3 ou 4 status sociais de uma só vez. Além disso, o "Sweep Bonus" no Shuffle Time garante sustentabilidade infinita nas masmorras.',
  },
  p2: {
    id: 'p2',
    title: 'Persona 2 (IS & EP)',
    shortTitle: 'Persona 2 Duology',
    subtitle: 'Sistema de Rumores, Contratos de Tarot & Fusion Spells',
    releaseEra: 'Era Clássica (Tadashi Satomi)',
    accentHex: '#A855F7',
    accentTextClass: 'text-purple-400',
    accentBgClass: 'bg-purple-600 hover:bg-purple-500 text-white',
    accentBorderClass: 'border-purple-500/40',
    accentSoftBgClass: 'bg-purple-950/30',
    canvasBgHex: '#0E0916',
    terms: {
      socialSystem: 'Agência de Rumores & Contatos de Demônios',
      dungeonSystem: 'Sumaru City & Masmorras Urbanas',
      combatChain: 'Ordem de Turno → Fusion Spells',
      socialStatsCount: 'Afinidade de Arcana por Personagem',
      timeUnit: 'Progressão por Eventos (Sem Calendário)',
    },
    corePhilosophy:
      'Diferente de P3/P4/P5, Persona 2 não tem calendário escolar nem Social Links. Todos os membros do grupo podem trocar de Persona! O segredo para ficar absurdo em P2 é manipular a realidade espalhando Rumores na Agência Kuzunoha, fazer Pactos emocionais com Demônios para ganhar Free Tarot Cards e alinhar a ordem de ações para disparar Fusion Spells.',
  },
};

export interface CalendarScenario {
  id: string;
  gameId: GameId;
  title: string;
  dateContext: string;
  weather: string;
  activeObjectives: string[];
  options: {
    id: string;
    label: string;
    timeCost: string;
    efficiencyRating: 'Ótima (Rank S)' | 'Aceitável (Rank B)' | 'Armadilha (Rank D)';
    score: number;
    mechanicalExplanation: string;
    hiddenRuleLearned: string;
  }[];
}

export const CALENDAR_SCENARIOS: CalendarScenario[] = [
  {
    id: 'p5r-rainy-tuesday',
    gameId: 'p5r',
    title: 'Terça-Feira Chuvosa com Palácio Ativo',
    dateContext: 'Terça-feira · Pós-Aula · Clima: Chuva Forte',
    weather: 'Chuva Forte (+Bônus em Estudo e Casa de Banhos)',
    activeObjectives: [
      'Palácio atual já teve a rota até o Tesouro garantida em 1 dia',
      'Ryuji (Chariot) quer sair, mas ainda não vai subir de Rank hoje',
      'Makoto (Priestess) exige Conhecimento Nível 3 (você está no 2)',
    ],
    options: [
      {
        id: 'opt-1',
        label: 'Ir à Cartomante (Chihaya - Sem gastar tempo) para dar Affinity Reading no Ryuji + Estudar no Diner na chuva',
        timeCost: '0 Turnos (Chihaya) + 1 Turno (Diner na Chuva)',
        efficiencyRating: 'Ótima (Rank S)',
        score: 100,
        mechanicalExplanation:
          'Você usa uma ação gratuita de tempo (Leitura de Afinidade da Chihaya por ¥5.000) para dar os pontos que faltavam ao Ryuji sem precisar gastar a tarde com ele quando não haveria Rank-Up. Em seguida, aproveita o multiplicador de chuva no Diner de Shibuya (+3 notas de Conhecimento +1 de Coragem pelo café).',
        hiddenRuleLearned:
          'Regra da Afinidade sem Rank-Up: Nunca gaste um período de tempo inteiro em um encontro que "ainda não vai aprofundar o laço" se você puder gerar esses pontos com ações que não passam o tempo (Chihaya, Cartão Postal ou Santuário Meiji).',
      },
      {
        id: 'opt-2',
        label: 'Sair com o Ryuji mesmo sem subir de Rank para ganhar notas musicais',
        timeCost: '1 Turno Completo (Pós-Aula)',
        efficiencyRating: 'Aceitável (Rank B)',
        score: 55,
        mechanicalExplanation:
          'Você ganha pontos de afinidade com o Ryuji, mas desperdiça um turno valioso de pós-aula e perde o bônus climático da chuva para subir Conhecimento.',
        hiddenRuleLearned:
          'Turnos de Pós-Aula são o recurso mais escasso do jogo. Gastar uma tarde inteira apenas para preencher pontos intermediários atrasa sua agenda em até 15 dias ao longo do ano.',
      },
      {
        id: 'opt-3',
        label: 'Entrar no Mementos por causa de apenas 1 requisição nova',
        timeCost: '1 Turno (Tarde) + Trava a Noite se não tiver Kawakami Max',
        efficiencyRating: 'Armadilha (Rank D)',
        score: 20,
        mechanicalExplanation:
          'Entrar no Metaverso para resolver apenas 1 pedido custa o turno da tarde E deixa o protagonista cansado à noite (a menos que Temperance esteja no Rank 10). O correto é acumular de 4 a 7 requisições de Mementos e limpar todas em uma única viagem.',
        hiddenRuleLearned:
          'Regra do Lote (Batching): Masmorras e Mementos devem ser feitos em lotes máximos. Cada entrada no Metaverso tem custo duplo de oportunidade (Tarde + Noite).',
      },
    ],
  },
  {
    id: 'p5r-sunday-optimization',
    gameId: 'p5r',
    title: 'Domingo de Sol — A Sequência Perfeita de Ações Gratuitas',
    dateContext: 'Domingo · Dia Inteiro · Clima: Ensolarado',
    weather: 'Ensolarado (Feira de Domingo e Suco de Aojiru ativos)',
    activeObjectives: [
      'Planta do quarto está seca no Leblanc',
      'Banca de Suco de Aojiru na passagem subterrânea está aberta',
      'Yoshida (Sun) disponível apenas aos domingos à noite',
    ],
    options: [
      {
        id: 'opt-sun-1',
        label: 'Nutrir Planta (Mega Fertilizer) → Comprar Suco Aojiru → Passar a Tarde com Confidant Escolar → Noite com Yoshida (Sun)',
        timeCost: '2 Ações Gratuitas + 1 Tarde + 1 Noite',
        efficiencyRating: 'Ótima (Rank S)',
        score: 100,
        mechanicalExplanation:
          'Você extrai +3 notas de Gentileza (Mega Fertilizer de Shinjuku) e +1 nota de Status Social (Aojiru de ¥5.000) SEM avançar o relógio! Depois usa a tarde para um Confidant e a noite para o Yoshida (que sempre sobe de Rank a cada encontro, independente de pontos).',
        hiddenRuleLearned:
          'O Suco de Domingo (Underground Walkway) só avança na fila de atributos se você comprar! Se pular um domingo, a rotação trava. E o Confidant Sun (Yoshida) tem prazo limite em novembro e nunca exige pontos intermediários.',
      },
      {
        id: 'opt-sun-2',
        label: 'Ir trabalhar no Beef Bowl ou Flower Shop no domingo à tarde',
        timeCost: '1 Turno Completo (Tarde)',
        efficiencyRating: 'Armadilha (Rank D)',
        score: 25,
        mechanicalExplanation:
          'Trabalhar em empregos de meio período sem uma requisição de Mementos ativa ou sem necessidade urgente de destravar Yoshida/Mishima desperdiça um turno onde Confidants estão livres.',
        hiddenRuleLearned:
          'Dinheiro nunca deve ser farmado trabalhando no calendário humano: farme ienes no Mementos/Palácios com o bônus da Chihaya + Jose + Insta-Kill do Ryuji.',
      },
    ],
  },
  {
    id: 'p3r-school-vs-outside',
    gameId: 'p3r',
    title: 'Quarta-Feira Letiva vs. Véspera de Férias em P3 Reload',
    dateContext: 'Quarta-feira · Pós-Aula · Escola Gekkoukan',
    weather: 'Limpo (Aulas normais)',
    activeObjectives: [
      'Kenji (Magician / Colega de Classe) disponível na sala de aula',
      'Casal de Idosos (Hierophant / Livraria) disponível na tira comercial',
      'Faltam 5 dias para a semana de provas e férias',
    ],
    options: [
      {
        id: 'opt-p3-1',
        label: 'Priorizar SEMPRE o Social Link de dentro da Escola (Colegas/Clubes) em dias de aula',
        timeCost: '1 Turno Pós-Aula',
        efficiencyRating: 'Ótima (Rank S)',
        score: 100,
        mechanicalExplanation:
          'Em Persona 3 Reload, os Social Links escolares (Chariot, Magician, Emperor, Justice, Priestess, Lovers, Temperance, Fortune, Art/Music) ficam TOTALMENTE BLOQUEADOS na semana antes das provas, nos feriados e nas férias de verão/inverno.',
        hiddenRuleLearned:
          'A Regra de Ouro de P3R: Guarde os Social Links de fora da escola (Hierophant, Hanged Man, Moon, Star, Hermit, Sun) exclusivamente para feriados, domingos e semanas pré-prova!',
      },
      {
        id: 'opt-p3-2',
        label: 'Visitar a Livraria (Hierophant) ou jogar no Arcade durante um dia letivo comum',
        timeCost: '1 Turno Pós-Aula',
        efficiencyRating: 'Armadilha (Rank D)',
        score: 30,
        mechanicalExplanation:
          'Embora Hierophant suba seu rank, quando chegarem as férias ou a semana pré-exame você ficará com vários dias livres sem nenhum Social Link disponível porque já esgotou os Links externos.',
        hiddenRuleLearned:
          'Em P3R, quase todos os status sociais (Academics, Charm, Courage) podem e devem ser upados À NOITE (Wakatsu, Hagakure, Arcade noturno), deixando 100% das tardes para Social Links.',
      },
    ],
  },
  {
    id: 'p4g-rainy-beef-bowl',
    gameId: 'p4g',
    title: 'Dia de Chuva em Inaba — O Segredo do Restaurante Aiya',
    dateContext: 'Quinta-feira · Pós-Aula · Clima: Chuva',
    weather: 'Chuva Contínua (Canal da Meia-Noite próximo)',
    activeObjectives: [
      'Quase todos os amigos de escola cancelaram encontros por causa da chuva',
      'Apenas Hermit (Raposa) e Sun (Drama/Música em certos dias) aparecem na chuva',
      'Seus atributos de Coragem, Conhecimento, Diligência e Expressão precisam subir',
    ],
    options: [
      {
        id: 'opt-p4-1',
        label: 'Aceitar o Rainy Day Mega Beef Bowl Challenge no Restaurante Aiya (ou entregar Quest da Raposa)',
        timeCost: '1 Turno de Tarde Chuvosa',
        efficiencyRating: 'Ótima (Rank S)',
        score: 100,
        mechanicalExplanation:
          'Em dias de chuva em P4G, o restaurante chinês Aiya serve a tigela gigante que aumenta TRÊS ou QUATRO atributos sociais simultaneamente (Conhecimento, Coragem, Diligência e Compreensão) pelo preço de um único turno onde Social Links normais nem sequer estão no mapa!',
        hiddenRuleLearned:
          'Em Persona 4 Golden, dias de chuva são o seu motor de Status Sociais (Aiya à tarde + Estudo na chuva à noite), liberando os dias de sol exclusivamente para Social Links.',
      },
      {
        id: 'opt-p4-2',
        label: 'Entrar na TV no primeiro dia de sol logo após o sequestro aparecer na tela',
        timeCost: 'Consome Tarde + Noite de um dia de Sol',
        efficiencyRating: 'Aceitável (Rank B)',
        score: 60,
        mechanicalExplanation:
          'Garante o resgate cedo, mas se naquele dia de sol havia Social Links importantes do grupo (que ficam indisponíveis se houver alguém preso na TV por muito tempo), verifique primeiro a agenda da semana.',
        hiddenRuleLearned:
          'Complete a Masmorra da TV em exatamente 1 visita usando o Sweep Bonus do Shuffle Time (cartas de Copas curam SP) para nunca precisar pagar o preço alto da Raposa no início do jogo.',
      },
    ],
  },
  {
    id: 'p2-rumor-manipulation',
    gameId: 'p2',
    title: 'Chegada a um Novo Distrito em Sumaru City (Persona 2)',
    dateContext: 'Progressão de Capítulo · Agência de Detetives Kuzunoha',
    weather: 'Rumores ativos na cidade',
    activeObjectives: [
      'Novos Rumores coletados com os Rumormongers (Chikarin, Toro, Toku)',
      'Lojas de armas do distrito vendem apenas equipamentos básicos',
      'Grupo precisa de Personas de nível mais alto antes da próxima masmorra',
    ],
    options: [
      {
        id: 'opt-p2-1',
        label: 'Espalhar Rumores de Loja (Qualidade Alta + Preço Alto) na Agência Kuzunoha + Farmar Free Tarot via Pactos',
        timeCost: 'Apenas Ienes (Sem gasto de calendário)',
        efficiencyRating: 'Ótima (Rank S)',
        score: 100,
        mechanicalExplanation:
          'Em Persona 2, rumores se tornam realidade física! Ao pagar o Detetive Todoroki para espalhar que uma loja vende armas secretas de alta qualidade, o estoque real do jogo muda permanentemente. Além disso, fazer Pactos com demônios dá Free Tarot Cards que podem ser convertidos em QUALQUER Arcana na Velvet Room.',
        hiddenRuleLearned:
          'Sempre espalhe a versão "Cara mas Poderosa" dos rumores de loja — dinheiro é fácil de conseguir, mas o equipamento exclusivo de rumor não pode ser obtido de outra forma.',
      },
      {
        id: 'opt-p2-2',
        label: 'Ignorar a Agência de Detetives e tentar passar a masmorra apenas subindo Level bruto',
        timeCost: 'Alto risco de bloqueio de dano nos chefes',
        efficiencyRating: 'Armadilha (Rank D)',
        score: 20,
        mechanicalExplanation:
          'Em Persona 2, os status vêm muito mais da evolução de Rank das Personas (usando Fusion Spells em combate) e dos equipamentos desbloqueados por Rumores do que do nível bruto do personagem.',
        hiddenRuleLearned:
          'Finalizar batalhas com um Fusion Spell dá chance de mutação de Persona (+2 em todos os atributos, novas magias ou evolução para uma Persona secreta)!',
      },
    ],
  },
];

export interface FreeTimeAction {
  id: string;
  gameId: GameId;
  name: string;
  frequency: string;
  location: string;
  reward: string;
  strategicNote: string;
}

export const FREE_TIME_ACTIONS: FreeTimeAction[] = [
  {
    id: 'ft-1',
    gameId: 'p5r',
    name: 'Suco de Aojiru de Domingo',
    frequency: 'Todo Domingo',
    location: 'Underground Walkway (Shibuya)',
    reward: '+1 Nota em um Status Social (Rotação fixa por ¥5.000)',
    strategicNote: 'Você PRECISA comprar para a fila girar para o próximo atributo no domingo seguinte.',
  },
  {
    id: 'ft-2',
    gameId: 'p5r',
    name: 'Nutrir a Planta do Quarto',
    frequency: 'A cada 16 dias',
    location: 'Sótão do Leblanc',
    reward: '+1 a +3 Notas de Gentileza (Kindness)',
    strategicNote: 'Compre o Mega Fertilizer na floricultura de Shinjuku à noite para ganhar +3 notas sempre.',
  },
  {
    id: 'ft-3',
    gameId: 'p5r',
    name: 'Palavras-Cruzadas & Quiz da TV',
    frequency: 'Noites específicas no Leblanc',
    location: 'Mesa do balcão / TV do Leblanc',
    reward: '+1 Nota de Conhecimento (Knowledge) grátis',
    strategicNote: 'Sempre cheque a mesa com lupa antes de sair à noite; não gasta o período noturno!',
  },
  {
    id: 'ft-4',
    gameId: 'p5r',
    name: 'Leituras da Chihaya (Fortune Rank 1, 5, 8)',
    frequency: 'Diariamente (Uma de cada tipo por dia)',
    location: 'Shinjuku (Dia ou Noite)',
    reward: '+50% em um Status Social no dia + Afinidade em 1 Confidant + Fusão Celestial',
    strategicNote: 'A mecânica mais quebrada de P5R: transforma dinheiro diretamente em tempo economizado.',
  },
  {
    id: 'ft-5',
    gameId: 'p5r',
    name: 'Leitura no Metrô + Speed Reading',
    frequency: 'Manhãs com assento livre no trem',
    location: 'Trajeto para a Academia Shujin',
    reward: '2 capítulos lidos em 1 viagem (com o livro Speed Reading da Biblioteca)',
    strategicNote: 'Em 1º de julho, pegue emprestado "Speed Reading" na biblioteca da escola imediatamente.',
  },
  {
    id: 'ft-6',
    gameId: 'p3r',
    name: 'Software de Computador da Sala de Comando',
    frequency: 'Qualquer noite (URLs compradas no Club Escapade)',
    location: 'Computador compartilhado do Dormitório Iwatodai',
    reward: 'Consome a noite, mas certas notas de informantes revelam fraquezas e rotas sem gastar exploração',
    strategicNote: 'Mais importante ainda: o software "Ambush" e o de "Social Link URL" dão pontos sem precisar encontrar a pessoa durante o dia!',
  },
  {
    id: 'ft-7',
    gameId: 'p3r',
    name: 'Ficar Acordado na Aula (Stay Awake)',
    frequency: 'Aulas com sono',
    location: 'Sala de Aula Gekkoukan',
    reward: '+Academics (Se ficar acordado) ou +Courage (Se dormir)',
    strategicNote: 'Academics exige 230 pontos até o Rank 6 (Genius) para liberar Mitsuru; sempre escolha ficar acordado até maximizar Academics!',
  },
  {
    id: 'ft-8',
    gameId: 'p4g',
    name: 'Geladeira de Casa em Noites Específicas',
    frequency: 'Noites com ingredientes vencidos',
    location: 'Cozinha da Casa dos Dojima',
    reward: '+Coragem ao comer comida suspeita (Cuidado: em dias sem chuva pode passar o tempo se passar mal)',
    strategicNote: 'Cheque a geladeira sempre que chegar em casa à noite.',
  },
  {
    id: 'ft-9',
    gameId: 'p4g',
    name: 'Plantio de Vegetais com Nanako',
    frequency: 'Ciclos de colheita',
    location: 'Quintal da Casa dos Dojima',
    reward: 'Tomates e Trigo que recuperam SP no Mundo da TV + Diligência/Afinidade',
    strategicNote: 'Verificar e colher mudas prontas não consome o período de tempo.',
  },
  {
    id: 'ft-10',
    gameId: 'p2',
    name: 'Trifecta de Rumormongers',
    frequency: 'A cada avanço de masmorra',
    location: 'Restaurantes e Cafés de Sumaru City',
    reward: 'Desbloqueia novos Rumores na Agência Kuzunoha',
    strategicNote: 'Converse com Toro (Gatten Sushi), Chikarin (Peace Diner) e Toku (Honmaru Park) sempre que um chefe cair.',
  },
];

export interface ArcanaArchetype {
  arcanaNumber: string;
  name: string;
  portugueseName: string;
  psychologicalProfile: string;
  howToAnswerWithoutGuide: string;
  examplesByGame: Record<GameId, string>;
  calendarPriority: 'Crítica (Economiza Tempo)' | 'Alta (Combate & Grupo)' | 'Média (Bônus & Fusão)';
}

export const ARCANA_ARCHETYPES: ArcanaArchetype[] = [
  {
    arcanaNumber: 'I',
    name: 'Magician',
    portugueseName: 'O Mago',
    psychologicalProfile:
      'Personagens jovens, enérgicos, impulsivos e que buscam validação rápida ou sofrem com insegurança mascarada de autoconfiança.',
    howToAnswerWithoutGuide:
      'Apoie os planos deles com entusiasmo, valide a amizade de igual para igual e faça piadas leves sem diminuí-los quando estiverem vulneráveis.',
    examplesByGame: {
      p5r: 'Morgana (Automático pela história)',
      p3r: 'Kenji Tomochika (Colega de classe)',
      p4g: 'Yosuke Hanamura (Parceiro de grupo)',
      p2: 'Afinidade ótima para Tatsuya / Yuka',
    },
    calendarPriority: 'Alta (Combate & Grupo)',
  },
  {
    arcanaNumber: 'II',
    name: 'Priestess',
    portugueseName: 'A Sacerdotisa',
    psychologicalProfile:
      'Intelectuais, reservadas, estudiosas e que carregam forte pressão familiar ou institucional nas costas.',
    howToAnswerWithoutGuide:
      'Seja ponderado, gentil, demonstre seriedade nos estudos e incentive-as a ouvirem seus próprios desejos além das expectativas alheias.',
    examplesByGame: {
      p5r: 'Makoto Niijima (Exige Conhecimento 3 → Charme 5)',
      p3r: 'Fuuka Yamagishi (Exige Coragem 6 / Badass)',
      p4g: 'Yukiko Amagi (Membro do grupo)',
      p2: 'Maki / Personas de Suporte e Cura',
    },
    calendarPriority: 'Alta (Combate & Grupo)',
  },
  {
    arcanaNumber: 'III',
    name: 'Empress',
    portugueseName: 'A Imperatriz',
    psychologicalProfile:
      'Figuras de autoridade refinada, herdeiras ou líderes que parecem distantes, mas têm um lado maternal e curioso pelo mundo comum.',
    howToAnswerWithoutGuide:
      'Trate-as como pessoas normais (não como chefes intocáveis), apoie seus hobbies simples (jardinagem, hambúrgueres) e mostre maturidade.',
    examplesByGame: {
      p5r: 'Haru Okumura (Exige Destreza 5 — suba rápido em Outubro!)',
      p3r: 'Mitsuru Kirijo (Exige Conhecimento 6 — disponível no fim do ano)',
      p4g: 'Margaret (Velvet Room — suba via pedidos de Fusão sem gastar tempo!)',
      p2: 'Yukino Mayuzumi (Alta compatibilidade)',
    },
    calendarPriority: 'Alta (Combate & Grupo)',
  },
  {
    arcanaNumber: 'IV',
    name: 'Emperor',
    portugueseName: 'O Imperador',
    psychologicalProfile:
      'Artistas excêntricos, presidentes de conselho ou rebeldes de bom coração que buscam encontrar seu próprio código de honra.',
    howToAnswerWithoutGuide:
      'Em P3R (Odagiri), apoie a disciplina mas questione abusos; em P5R (Yusuke), entre na onda artística dele e elogie sua paixão sincera pela arte.',
    examplesByGame: {
      p5r: 'Yusuke Kitagawa (Duplicação de Skill Cards grátis!)',
      p3r: 'Hidetoshi Odagiri (Conselho Estudantil)',
      p4g: 'Kanji Tatsumi (Aceite o lado sensível dele sem julgar)',
      p2: 'Kei Nanjo / Baofu',
    },
    calendarPriority: 'Alta (Combate & Grupo)',
  },
  {
    arcanaNumber: 'V',
    name: 'Hierophant',
    portugueseName: 'O Hierofante',
    psychologicalProfile:
      'Mentores mais velhos, guardiões paternos e figuras tradicionais que lidam com luto, família e legado.',
    howToAnswerWithoutGuide:
      'Demonstre respeito, gratidão pela hospitalidade, valorize laços familiares e seja prestativo no trabalho/casa.',
    examplesByGame: {
      p5r: 'Sojiro Sakura (Café/Curry que recupera SP da equipe — trava no Rank 4 até agosto)',
      p3r: 'Bunkichi & Mitsuko (Livraria — faça em dias sem aula!)',
      p4g: 'Ryotaro Dojima (Noturno em casa — exige Expressão alta)',
      p2: 'Personas defensivas e de Luz',
    },
    calendarPriority: 'Alta (Combate & Grupo)',
  },
  {
    arcanaNumber: 'VII',
    name: 'Chariot',
    portugueseName: 'A Carruagem',
    psychologicalProfile:
      'Atletas determinados, impulsivos e focados em superação física, lealdade aos amigos e vitória.',
    howToAnswerWithoutGuide:
      'Sempre escolha as respostas mais diretas, competitivas, cheias de garra e que incentivem o treino e a superação.',
    examplesByGame: {
      p5r: 'Ryuji Sakamoto (Rank 7 = INSTA-KILL: atropela Sombras fracas ganhando EXP, Dinheiro e Persona sem lutar!)',
      p3r: 'Kazushi Miyamoto (Clube de Atletismo)',
      p4g: 'Chie Satonaka (Membro do grupo)',
      p2: 'Lisa "Ginko" Silverman / Ataques Físicos',
    },
    calendarPriority: 'Crítica (Economiza Tempo)',
  },
  {
    arcanaNumber: 'VIII / XI',
    name: 'Strength',
    portugueseName: 'A Força',
    psychologicalProfile:
      'Domínio da força interior, disciplina e superação de desafios técnicos.',
    howToAnswerWithoutGuide:
      'Em P5R (Caroline & Justine), este Confidant NÃO gasta tempo no calendário! Ele sobe trazendo Personas fundidas com habilidades específicas.',
    examplesByGame: {
      p5r: 'Caroline & Justine (Rank 5 permite fundir Personas ACIMA do seu nível atual!)',
      p3r: 'Yuko Nishiwaki (Gerente do clube esportivo)',
      p4g: 'Kou & Daisuke (Clube de Basquete ou Futebol)',
      p2: 'Personas de alto ataque físico',
    },
    calendarPriority: 'Crítica (Economiza Tempo)',
  },
  {
    arcanaNumber: 'IX',
    name: 'Hermit',
    portugueseName: 'O Eremita',
    psychologicalProfile:
      'Solitários brilhantes, observadores ocultos ou aliados de suporte que operam nos bastidores.',
    howToAnswerWithoutGuide:
      'Em P5R (Futaba), seja paciente, acolhedor e encoraje pequenos passos sociais sem forçá-la. Em P4G (Raposa), entregue missões em dias de chuva.',
    examplesByGame: {
      p5r: 'Futaba Sakura (Buffs automáticos na batalha, mapeamento de Mementos e proteção contra golpe fatal)',
      p3r: 'Maya (MMORPG aos Domingos e Feriados — nunca gaste dia letivo!)',
      p4g: 'Raposa do Santuário (Reduz o preço de cura de SP dentro da TV)',
      p2: 'Ulala Serizawa / Personas de Status',
    },
    calendarPriority: 'Crítica (Economiza Tempo)',
  },
  {
    arcanaNumber: 'X',
    name: 'Fortune',
    portugueseName: 'A Roda da Fortuna',
    psychologicalProfile:
      'Pessoas presas à ideia de "destino inevitável" que precisam descobrir que nossas escolhas mudam o futuro.',
    howToAnswerWithoutGuide:
      'Sempre reforce que o destino NÃO é imutável e que temos o poder de mudar o futuro com nossas próprias mãos.',
    examplesByGame: {
      p5r: 'Chihaya Mifune (PRIORIDADE MÁXIMA: dá bônus de Status Social e Afinidade de Confidant SEM GASTAR TEMPO!)',
      p3r: 'Keisuke Hiraga (Clube Cultural)',
      p4g: 'Naoto Shirogane (Exige Conhecimento 5 e Coragem 5)',
      p2: 'Jun Kurosu (Arcana assinatura)',
    },
    calendarPriority: 'Crítica (Economiza Tempo)',
  },
  {
    arcanaNumber: 'XIV',
    name: 'Temperance',
    portugueseName: 'A Temperança',
    psychologicalProfile:
      'Pessoas tentando equilibrar duas vidas opostas ou exaustas pelas responsabilidades adultas.',
    howToAnswerWithoutGuide:
      'Mostre empatia pelo cansaço delas, apoie sua vocação verdadeira e mostre que o esforço delas tem valor.',
    examplesByGame: {
      p5r: 'Sadayo Kawakami (PRIORIDADE #1 DO JOGO: dá tempo livre na aula, faz café/lavanderia de graça e no Rank 10 libera a NOITE após ir ao Palácio/Mementos!)',
      p3r: 'Bebe (Estudante de intercâmbio francês)',
      p4g: 'Eri Minami (Trabalho de meio período na creche)',
      p2: 'Equilíbrio elemental multi-tipo',
    },
    calendarPriority: 'Crítica (Economiza Tempo)',
  },
  {
    arcanaNumber: 'XVII',
    name: 'Star',
    portugueseName: 'A Estrela',
    psychologicalProfile:
      'Estrategistas prodígios, atletas de elite ou rivais que mantêm a esperança mesmo sob pressão extrema.',
    howToAnswerWithoutGuide:
      'Reconheça a habilidade tática deles, seja humilde para aprender estratégias e apoie sua independência.',
    examplesByGame: {
      p5r: 'Hifumi Togo (Permite TROCAR membros do grupo no meio do seu turno em batalha e dobrar dinheiro em emboscadas!)',
      p3r: 'Mamoru Hayase (Atleta rival — disponível em dias sem aula)',
      p4g: 'Teddie (Automático pela história)',
      p2: 'Personas de velocidade e magia estelar',
    },
    calendarPriority: 'Alta (Combate & Grupo)',
  },
  {
    arcanaNumber: 'XVIII',
    name: 'Moon',
    portugueseName: 'A Lua',
    psychologicalProfile:
      'Personagens inseguros que projetam grandes expectativas ou se deslumbram facilmente com fama e reconhecimento.',
    howToAnswerWithoutGuide:
      'Em P5R (Mishima), apoie o trabalho dele quando for genuíno, mas seja firme (sem ser cruel) quando o ego subir à cabeça. Em P3R (Nozomi), entre na brincadeira gastronômica dele.',
    examplesByGame: {
      p5r: 'Yuuki Mishima (Sobe automaticamente ao concluir pedidos do Mementos — dá 100% da EXP para membros da reserva!)',
      p3r: 'Nozomi Suemitsu (Disponível em feriados e dias sem aula)',
      p4g: 'Ai Ebihara (Cuidado: tem rota de reversão se tomar decisões impulsivas!)',
      p2: 'Maya Amano (Arcana principal da protagonista!)',
    },
    calendarPriority: 'Crítica (Economiza Tempo)',
  },
  {
    arcanaNumber: 'XIX',
    name: 'Sun',
    portugueseName: 'O Sol',
    psychologicalProfile:
      'Pessoas que superaram grandes fracassos ou tragédias e agora transmitem sabedoria, otimismo e propósito.',
    howToAnswerWithoutGuide:
      'Escute com atenção sincera, faça perguntas reflexivas sobre os ideais deles e valorize a honestidade acima da aparência.',
    examplesByGame: {
      p5r: 'Toranosuke Yoshida (Domingos à noite — sobe de Rank SEMPRE sem exigir pontos extras e destrava negociação avançada de dinheiro/itens!)',
      p3r: 'Akinari Kamiki (Domingos no Santuário — o melhor Social Link da franquia, também sobe sempre sem exigir pontos!)',
      p4g: 'Yumi Ozawa ou Ayane Matsunaga (Clube de Teatro/Música)',
      p2: 'Tatsuya Suou (Apollo — Arcana suprema de Fogo)',
    },
    calendarPriority: 'Crítica (Economiza Tempo)',
  },
  {
    arcanaNumber: 'Royal',
    name: 'Councillor / Faith / Justice',
    portugueseName: 'A Trindade do 3º Semestre (P5R)',
    psychologicalProfile:
      'O trio essencial que destrava o conteúdo verdadeiro e o Terceiro Semestre de Persona 5 Royal.',
    howToAnswerWithoutGuide:
      'Maruki (Councillor): mostre interesse científico pela pesquisa dele sobre dor emocional. Akechi (Justice): trate-o como um rival à sua altura (aceite desafios e provocações com inteligência). Yoshizawa (Faith): apoie a dedicação dela à ginástica.',
    examplesByGame: {
      p5r: 'OBRIGATÓRIO para o 3º Semestre: Maruki até Rank 9 antes de 17/Nov! (Akechi até Rank 8 antes de 17/Nov e Yoshizawa até Rank 5 antes de 18/Dez dão cenas e evoluções extras)',
      p3r: 'Aeon (Aigis — Disponível em Janeiro, priorize todas as tardes de Janeiro para ela!)',
      p4g: 'Aeon (Marie — OBRIGATÓRIO maximizar antes de derrotar o chefe de Dezembro para destravar a masmorra Hollow Forest!)',
      p2: 'Philemon & Nyarlathotep (Dualidade da consciência humana)',
    },
    calendarPriority: 'Crítica (Economiza Tempo)',
  },
];

export interface SocialStatInfo {
  id: string;
  gameId: GameId;
  name: string;
  ranks: { rank: number; title: string; pointsRequired: string }[];
  bestTimeFreeMethods: string[];
  bestTimeSlotMethods: string[];
  keyUnlocks: string[];
}

export const SOCIAL_STATS_DATA: SocialStatInfo[] = [
  {
    id: 'p5r-knowledge',
    gameId: 'p5r',
    name: 'Conhecimento (Knowledge)',
    ranks: [
      { rank: 1, title: 'Oblivious', pointsRequired: '0 pts' },
      { rank: 2, title: 'Learned', pointsRequired: '34 pts' },
      { rank: 3, title: 'Scholarly', pointsRequired: '82 pts' },
      { rank: 4, title: 'Encyclopedic', pointsRequired: '126 pts' },
      { rank: 5, title: 'Erudite', pointsRequired: '192 pts' },
    ],
    bestTimeFreeMethods: [
      'Acertar todas as perguntas dos professores em sala (+2 pts cada)',
      'Palavras-cruzadas na mesa do Leblanc (+2 pts sem gastar a noite)',
      'Quiz de Quinta-feira na TV do Leblanc (+2 pts)',
    ],
    bestTimeSlotMethods: [
      'Estudar no Diner de Shibuya em dias de CHUVA (+5 pts +1 de outro atributo)',
      'Estudar em grupo com amigos antes das provas (+5 pts + Afinidade)',
    ],
    keyUnlocks: [
      'Rank 3: Inicia Makoto (Priestess)',
      'Rank 4 + Top 10 nas Provas: Bônus permanente de +20% em TODOS os Confidants escolares e Sojiro!',
      'Rank 5: Inicia Hifumi (Star Rank 8+)',
    ],
  },
  {
    id: 'p5r-guts',
    gameId: 'p5r',
    name: 'Coragem (Guts)',
    ranks: [
      { rank: 1, title: 'Milquetoast', pointsRequired: '0 pts' },
      { rank: 2, title: 'Bold', pointsRequired: '11 pts' },
      { rank: 3, title: 'Staunch', pointsRequired: '38 pts' },
      { rank: 4, title: 'Dauntless', pointsRequired: '68 pts' },
      { rank: 5, title: 'Lionhearted', pointsRequired: '113 pts' },
    ],
    bestTimeFreeMethods: [
      'Suco Aojiru de Domingo quando estiver na vez de Coragem (+2 pts)',
      'Ler livros de terror/aventura nos assentos livres do metrô',
    ],
    bestTimeSlotMethods: [
      'Desafio do Big Bang Burger à noite (+2 a +6 pts + Destreza, Charme e Conhecimento se vencer!)',
      'Testes clínicos com Takemi (Death) (+2 pts + avança o Confidant ao mesmo tempo!)',
    ],
    keyUnlocks: [
      'Rank 2: Continua Takemi (Death Rank 2)',
      'Rank 3: Permite ligar para Kawakami (Temperance) pelo telefone do Leblanc!',
      'Rank 4: Inicia Iwai (Hanged Man)',
    ],
  },
  {
    id: 'p5r-proficiency',
    gameId: 'p5r',
    name: 'Destreza (Proficiency)',
    ranks: [
      { rank: 1, title: 'Bumbling', pointsRequired: '0 pts' },
      { rank: 2, title: 'Decent', pointsRequired: '12 pts' },
      { rank: 3, title: 'Skilled', pointsRequired: '34 pts' },
      { rank: 4, title: 'Masterful', pointsRequired: '60 pts' },
      { rank: 5, title: 'Transcendent', pointsRequired: '87 pts' },
    ],
    bestTimeFreeMethods: [
      'Rebater na gaiola de Baseball quando destravar o livro "Batting Science"',
      'Fabricar gazuas (Lockpicks) na noite obrigatória antes de enviar Calling Card',
    ],
    bestTimeSlotMethods: [
      'Jogar Dardos no Penguin Sniper em Kichijoji (Sobe Baton Pass do grupo + dá +3 a +5 pts de Destreza)',
      'Trabalhar no Beef Bowl à noite quando houver alta demanda (+5 pts)',
    ],
    keyUnlocks: [
      'Rank 4: Continua Yusuke (Emperor Rank 6)',
      'Rank 5: OBRIGATÓRIO para avançar Haru (Empress Rank 2) em Outubro!',
    ],
  },
  {
    id: 'p5r-kindness',
    gameId: 'p5r',
    name: 'Gentileza (Kindness)',
    ranks: [
      { rank: 1, title: 'Inoffensive', pointsRequired: '0 pts' },
      { rank: 2, title: 'Considerate', pointsRequired: '14 pts' },
      { rank: 3, title: 'Empathetic', pointsRequired: '44 pts' },
      { rank: 4, title: 'Selfless', pointsRequired: '91 pts' },
      { rank: 5, title: 'Angelic', pointsRequired: '136 pts' },
    ],
    bestTimeFreeMethods: [
      'Mega Fertilizer na planta do quarto a cada 16 dias (+5 pts SEMPRE sem gastar tempo!)',
      'Suco Aojiru de Domingo na rotação de Gentileza (+2 pts)',
    ],
    bestTimeSlotMethods: [
      'Limpar o Leblanc à noite (+2 pts +1 ponto de afinidade com Sojiro)',
      'Trabalhar na Floricultura (Rafflesia) em dias de encomenda especial (+5 pts)',
      'Passar tempo com Shinya (Tower) e Sojiro (Hierophant) dá Gentileza de bônus!',
    ],
    keyUnlocks: [
      'Rank 2: Continua Ann (Lovers Rank 2)',
      'Rank 4: OBRIGATÓRIO em 1º de Setembro para iniciar Futaba (Hermit)!',
      'Rank 5: Avança Sojiro (Hierophant Rank 7)',
    ],
  },
  {
    id: 'p5r-charm',
    gameId: 'p5r',
    name: 'Charme (Charm)',
    ranks: [
      { rank: 1, title: 'Existent', pointsRequired: '0 pts' },
      { rank: 2, title: 'Head-turning', pointsRequired: '6 pts' },
      { rank: 3, title: 'Suave', pointsRequired: '52 pts' },
      { rank: 4, title: 'Charismatic', pointsRequired: '92 pts' },
      { rank: 5, title: 'Debonair', pointsRequired: '132 pts' },
    ],
    bestTimeFreeMethods: [
      'Esquivar do giz do professor Ushimaru (Exige Destreza alta → dá +3 pts de Charme)',
      'Tirar 1º Lugar nas Provas Escolares (+5 pts de Charme)',
    ],
    bestTimeSlotMethods: [
      'Casa de Banhos (Bathhouse) em segundas e quintas-feiras ou dias de CHUVA (+5 pts)',
      'Passar tempo com Yoshida (Sun) e Ohya (Devil) sobe Charme automaticamente!',
    ],
    keyUnlocks: [
      'Rank 3: Inicia Hifumi (Star) e avança Takemi',
      'Rank 5: Avança Makoto (Priestess Rank 6)',
    ],
  },
  {
    id: 'p3r-stats',
    gameId: 'p3r',
    name: 'Os 3 Atributos de Persona 3 Reload (Academics, Charm, Courage)',
    ranks: [
      { rank: 1, title: 'Rank 1 (Base)', pointsRequired: '0 pts' },
      { rank: 2, title: 'Rank 2', pointsRequired: 'Coragem 15 / Charme 15 / Acad. 20' },
      { rank: 3, title: 'Rank 3', pointsRequired: 'Coragem 30 / Charme 30 / Acad. 55' },
      { rank: 4, title: 'Rank 4', pointsRequired: 'Coragem 45 / Charme 45 / Acad. 100' },
      { rank: 5, title: 'Rank 5', pointsRequired: 'Coragem 65 / Charme 70 / Acad. 155' },
      { rank: 6, title: 'Rank 6 (Max)', pointsRequired: 'Coragem 80 / Charme 100 / Acad. 230' },
    ],
    bestTimeFreeMethods: [
      'Ficar acordado na aula SEMPRE até Academics atingir 230 pts (Rank 6)',
      'Beber a poção da enfermaria do Sr. Edogawa no dia seguinte a uma ida ao Tartarus (+Coragem SEM gastar tempo!)',
    ],
    bestTimeSlotMethods: [
      'Usar APENAS as noites: Wakatsu Kitchen Special (Acad.), Hagakure Ramen (Charme), Wilduck Burger (Coragem) e jogos do Arcade',
      'Atividades de Dormitório com colegas à noite (dão Status Social + passivas de combate pros aliados!)',
    ],
    keyUnlocks: [
      'Courage Rank 6 (80 pts): Inicia Fuuka (Priestess) — é o mais rápido de maximizar',
      'Charm Rank 6 (100 pts): Inicia Yukari (Lovers)',
      'Academics Rank 6 (230 pts): Inicia Mitsuru (Empress) em Novembro — exige foco constante à noite!',
    ],
  },
  {
    id: 'p4g-stats',
    gameId: 'p4g',
    name: 'Os 5 Atributos de Persona 4 Golden (Knowledge, Courage, Diligence, Understanding, Expression)',
    ranks: [
      { rank: 1, title: 'Rank 1', pointsRequired: '0 pts' },
      { rank: 2, title: 'Rank 2', pointsRequired: '16–30 pts' },
      { rank: 3, title: 'Rank 3', pointsRequired: '40–80 pts' },
      { rank: 4, title: 'Rank 4', pointsRequired: '80–150 pts' },
      { rank: 5, title: 'Rank 5 (Max)', pointsRequired: '140–240 pts' },
    ],
    bestTimeFreeMethods: [
      'Responder perguntas dos colegas e professores na aula (+Knowledge ou +Expression)',
      'Comer ingredientes suspeitos da geladeira em noites específicas (+Courage)',
    ],
    bestTimeSlotMethods: [
      'Desafio Mega Beef Bowl no Aiya em DIAS DE CHUVA (+3 ou +4 atributos de uma só vez!)',
      'Trabalhos noturnos no Hospital (Faxineiro = Courage + Inicia Devil) e Tutoria (Understanding + Inicia Tower)',
    ],
    keyUnlocks: [
      'Expression 4 & Understanding 5: Necessários para completar os Social Links de Dojima e Nanako antes de Novembro!',
      'Knowledge 5 & Courage 5: Necessários para iniciar Naoto (Fortune)',
    ],
  },
];

export interface TechnicalCombo {
  id: string;
  ailmentCategory: 'Elemental' | 'Físico' | 'Mental';
  ailmentName: string;
  ailmentEffect: string;
  baseTriggers: string[];
  bookExpandedTriggers: string[];
  guaranteedKnockdownNote: string;
}

export const TECHNICAL_COMBOS: TechnicalCombo[] = [
  {
    id: 'tech-burn',
    ailmentCategory: 'Elemental',
    ailmentName: 'Queimadura (Burn)',
    ailmentEffect: 'Causa 5% de dano máximo por turno no inimigo',
    baseTriggers: ['Vento (Garula/Magarudyne)', 'Nuclear (Freila/Mafreidyne)'],
    bookExpandedTriggers: ['Vento', 'Nuclear'],
    guaranteedKnockdownNote: 'Ótimo combo: Ann (Dormina/Agidyne) → Morgana (Vento) ou Makoto (Nuclear).',
  },
  {
    id: 'tech-freeze',
    ailmentCategory: 'Elemental',
    ailmentName: 'Congelamento (Freeze)',
    ailmentEffect: 'Impede esquiva e remove resistência a Físico/Tiro!',
    baseTriggers: ['Físico (Qualquer golpe)', 'Tiro (Gun)'],
    bookExpandedTriggers: ['Físico', 'Tiro'],
    guaranteedKnockdownNote: 'Congelar um inimigo que tem Resistência/Nulo a Físico força ele a tomar dano Físico Technical crítico!',
  },
  {
    id: 'tech-shock',
    ailmentCategory: 'Elemental',
    ailmentName: 'Choque (Shock)',
    ailmentEffect: 'Inimigo perde o turno e pode espalhar choque ao receber golpe físico',
    baseTriggers: ['Físico', 'Tiro', 'Nuclear'],
    bookExpandedTriggers: ['Físico', 'Tiro', 'Nuclear'],
    guaranteedKnockdownNote: 'Contra chefes ou mini-bosses imunes a elementos, Choque + Tiro (Multi-hit) derrete HP.',
  },
  {
    id: 'tech-sleep',
    ailmentCategory: 'Mental',
    ailmentName: 'Sono (Sleep)',
    ailmentEffect: 'Inimigo dorme (recupera um pouco de HP/SP se ninguém bater)',
    baseTriggers: ['TODOS os Elementos e Físico (Exceto Bless/Curse)'],
    bookExpandedTriggers: ['QUALQUER ataque (Universal)'],
    guaranteedKnockdownNote: 'A ferramenta mais versátil de P5R: Dormina/Lullaby transforma qualquer ataque da equipe em Technical!',
  },
  {
    id: 'tech-dizzy',
    ailmentCategory: 'Físico',
    ailmentName: 'Tontura (Dizzy)',
    ailmentEffect: 'Reduz drasticamente a precisão dos ataques do inimigo',
    baseTriggers: ['TODOS os Elementos e Físico (Universal)'],
    bookExpandedTriggers: ['QUALQUER ataque (Universal)'],
    guaranteedKnockdownNote: 'Fácil de aplicar com Nocturnal Flash e ativa Technical com qualquer aliado.',
  },
  {
    id: 'tech-mental-psy',
    ailmentCategory: 'Mental',
    ailmentName: 'Confusão, Medo, Fúria, Desespero, Lavagem Cerebral & Esquecimento',
    ailmentEffect: 'Desativa magias, reduz defesa em 50% (Rage) ou faz o inimigo jogar dinheiro',
    baseTriggers: ['Psíquico (Psi / Mapsiodyne)'],
    bookExpandedTriggers: [
      'Psíquico (Sempre)',
      'Com o livro "Knowing the Heart": Confusão → Vento/Tiro | Medo → Gelo | Fúria → Fogo | Desespero → Maldição | Lavagem → Bênção',
    ],
    guaranteedKnockdownNote: 'Haru (Mapsiodyne) é a rainha dos Technicals Mentais. Leia o livro "Knowing the Heart" (comprado em Jinbocho) e jogue Bilhar até Rank 4 para 100% de Down garantido!',
  },
];
