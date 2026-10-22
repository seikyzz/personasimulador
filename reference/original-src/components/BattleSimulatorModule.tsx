import React, { useState, useEffect } from 'react';
import { GAMES, GameId } from '../data/personaData';
import {
  ElementKey,
  ELEMENT_LABELS,
  SHADOW_ENEMIES,
  ShadowEnemy,
} from '../data/shadowCompendiumData';
import { PersonaSpriteArt } from './PersonaSpriteArt';
import {
  Swords,
  Crosshair,
  Flame,
  Sparkles,
  Users,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

interface BattleSimulatorModuleProps {
  activeGame: GameId;
  initialTargetShadowId?: string | null;
  onRecruitShadow?: (shadowId: string) => void;
}

type AilmentState = 'NONE' | 'SLEEP' | 'SHOCK' | 'FREEZE' | 'FORGET';

interface PartyMember {
  id: string;
  codename: string;
  name: string;
  persona: string;
  sp: number;
  maxSp: number;
  specialtyElement: ElementKey;
  ailmentSkill: { name: string; ailment: AilmentState; desc: string };
}

const PARTY_MEMBERS: PartyMember[] = [
  {
    id: 'joker',
    codename: 'JOKER (Wild Card)',
    name: 'Protagonista',
    persona: 'Arsène / Shiki-Ouji',
    sp: 120,
    maxSp: 120,
    specialtyElement: 'curse',
    ailmentSkill: {
      name: 'Dormina (Sono)',
      ailment: 'SLEEP',
      desc: 'Coloca o inimigo para dormir (Qualquer ataque vira Technical!)',
    },
  },
  {
    id: 'ann',
    codename: 'PANTHER',
    name: 'Ann / Yukari / Yukiko',
    persona: 'Carmen / Io / Konohana',
    sp: 110,
    maxSp: 110,
    specialtyElement: 'fire',
    ailmentSkill: {
      name: 'Dormina (Sono)',
      ailment: 'SLEEP',
      desc: 'Coloca o inimigo para dormir para preparar Technical',
    },
  },
  {
    id: 'ryuji',
    codename: 'SKULL',
    name: 'Ryuji / Akihiko / Kanji',
    persona: 'Captain Kidd / Polydeuces',
    sp: 85,
    maxSp: 85,
    specialtyElement: 'elec',
    ailmentSkill: {
      name: 'Mazio (Choque)',
      ailment: 'SHOCK',
      desc: 'Eletrocuta o alvo (Físico, Tiro e Nuclear viram Technical!)',
    },
  },
  {
    id: 'makoto',
    codename: 'QUEEN',
    name: 'Makoto / Mitsuru / Naoto',
    persona: 'Johanna / Penthesilea',
    sp: 105,
    maxSp: 105,
    specialtyElement: 'nuke',
    ailmentSkill: {
      name: 'Makajam (Esquecimento)',
      ailment: 'FORGET',
      desc: 'Bloqueia magias inimigas (Psíquico vira Technical!)',
    },
  },
  {
    id: 'haru',
    codename: 'NOIR',
    name: 'Haru / Junpei / Chie',
    persona: 'Milady / Hermes / Tomoe',
    sp: 100,
    maxSp: 100,
    specialtyElement: 'psy',
    ailmentSkill: {
      name: 'Bufu (Congelar)',
      ailment: 'FREEZE',
      desc: 'Congela o alvo (Remove resistência a Físico/Tiro e ativa Technical!)',
    },
  },
];

const NEGOTIATION_QUESTIONS: Record<
  ShadowEnemy['personality'],
  {
    question: string;
    choices: {
      text: string;
      tone: 'Bondosa (Kind)' | 'Séria (Serious)' | 'Engraçada (Funny)' | 'Vaga (Vague)';
      result: 'SUCCESS' | 'NEUTRAL' | 'FAIL';
      explanation: string;
    }[];
  }
> = {
  'Tímida (Timid)': {
    question: '"P-Por favor, não me ataque mais! O que você vai fazer comigo?!"',
    choices: [
      {
        text: '"Calma, não vou te machucar. Venha ser minha força."',
        tone: 'Bondosa (Kind)',
        result: 'SUCCESS',
        explanation: 'Perfeito! Sombras TÍMIDAS respondem com notas musicais a respostas Bondosas/Acolhedoras.',
      },
      {
        text: '"Cale a boca e me entregue seu poder agora!"',
        tone: 'Séria (Serious)',
        result: 'FAIL',
        explanation: 'Sombras Tímidas entram em pânico e fogem ou contra-atacam se você for agressivo/sério.',
      },
      {
        text: '"O destino é uma névoa indecifrável..."',
        tone: 'Vaga (Vague)',
        result: 'FAIL',
        explanation: 'Sombras Tímidas detestam respostas vagas pois acham que você está enganando elas.',
      },
    ],
  },
  'Irritada (Irritable)': {
    question: '"Grrr! Você acha que me venceu só porque me derrubou, seu pirralho?!"',
    choices: [
      {
        text: '"Eu venci porque minha estratégia foi superior. Junte-se a mim."',
        tone: 'Séria (Serious)',
        result: 'SUCCESS',
        explanation: 'Exato! Sombras IRRITADAS respeitam respostas Sérias, diretas e firmes.',
      },
      {
        text: '"Tadinho de você, está machucado? Deixa eu ajudar..."',
        tone: 'Bondosa (Kind)',
        result: 'FAIL',
        explanation: 'Sombras Irritadas odeiam respostas bondosas (acham que você está tendo pena delas).',
      },
      {
        text: '"Hahaha, você fica engraçado caído no chão!"',
        tone: 'Engraçada (Funny)',
        result: 'FAIL',
        explanation: 'Fazer piada com uma Sombra Irritada faz ela levantar furiosa na hora.',
      },
    ],
  },
  'Alegre (Upbeat)': {
    question: '"Caramba, que pancada maneira! Qual é o segredo do seu estilo?!"',
    choices: [
      {
        text: '"É puro charme e improviso! Quer entrar na dança com a gente?"',
        tone: 'Engraçada (Funny)',
        result: 'SUCCESS',
        explanation: 'Perfeito! Sombras ALEGRES adoram humor, brincadeiras e alto astral.',
      },
      {
        text: '"Isso não é brincadeira. Estamos em uma missão de vida ou morte."',
        tone: 'Séria (Serious)',
        result: 'FAIL',
        explanation: 'Ser sério corta o clima de uma Sombra Alegre e faz a negociação falhar.',
      },
      {
        text: '"Quem sabe? Talvez sim, talvez não."',
        tone: 'Vaga (Vague)',
        result: 'FAIL',
        explanation: 'Sombras Alegres ficam entediadas com respostas vagas.',
      },
    ],
  },
  'Sombria (Gloomy)': {
    question: '"De que adianta lutar... no fim tudo retorna ao vazio, não acha?"',
    choices: [
      {
        text: '"Talvez o vazio seja apenas o começo de outra sombra..."',
        tone: 'Vaga (Vague)',
        result: 'SUCCESS',
        explanation: 'Na mosca! Sombras SOMBRIAS adoram respostas Vagas, filosóficas e misteriosas.',
      },
      {
        text: '"Levanta a cabeça, campeão! Vamos sorrir e vencer juntos!"',
        tone: 'Engraçada (Funny)',
        result: 'FAIL',
        explanation: 'Sombras Sombrias detestam otimismo forçado ou piadas.',
      },
      {
        text: '"Eu vou cuidar de você, vai ficar tudo bem!"',
        tone: 'Bondosa (Kind)',
        result: 'FAIL',
        explanation: 'Sombras Sombrias rejeitam consolo direto; prefira sempre o tom Vago.',
      },
    ],
  },
};

export const BattleSimulatorModule: React.FC<BattleSimulatorModuleProps> = ({
  activeGame,
  initialTargetShadowId,
  onRecruitShadow,
}) => {
  const gameConfig = GAMES[activeGame];

  // Select target shadow
  const [targetShadowId, setTargetShadowId] = useState<string>(
    initialTargetShadowId || 'p5r-anubis'
  );

  useEffect(() => {
    if (initialTargetShadowId) {
      setTargetShadowId(initialTargetShadowId);
    }
  }, [initialTargetShadowId]);

  const targetShadow =
    SHADOW_ENEMIES.find((s) => s.id === targetShadowId) || SHADOW_ENEMIES[0];

  // Battle State Machine
  const maxHp = targetShadow.level * 18 + 180;
  const [enemyHp, setEnemyHp] = useState<number>(maxHp);
  const [isEnemyDown, setIsEnemyDown] = useState<boolean>(false);
  const [enemyAilment, setEnemyAilment] = useState<AilmentState>('NONE');
  const [oneMoreActive, setOneMoreActive] = useState<boolean>(false);
  const [batonPassRank, setBatonPassRank] = useState<number>(0);
  const [activeMemberIndex, setActiveMemberIndex] = useState<number>(0);
  const [passedMembers, setPassedMembers] = useState<string[]>(['joker']);
  const [battleBanner, setBattleBanner] = useState<{
    text: string;
    subtext: string;
    color: 'weak' | 'tech' | 'reflect' | 'holdup' | 'victory' | 'neutral';
  } | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([
    `Emboscada iniciada contra ${targetShadow.personaName}! Escolha sua ação para derrubar o inimigo.`,
  ]);
  const [showNegotiationModal, setShowNegotiationModal] = useState<boolean>(false);
  const [negotiationResult, setNegotiationResult] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showElementPicker, setShowElementPicker] = useState<boolean>(false);

  const activeMember = PARTY_MEMBERS[activeMemberIndex];

  // Reset battle when changing target shadow
  useEffect(() => {
    const newMax = targetShadow.level * 18 + 180;
    setEnemyHp(newMax);
    setIsEnemyDown(false);
    setEnemyAilment('NONE');
    setOneMoreActive(false);
    setBatonPassRank(0);
    setActiveMemberIndex(0);
    setPassedMembers(['joker']);
    setShowNegotiationModal(false);
    setNegotiationResult(null);
    setBattleBanner(null);
    setCombatLog([
      `Alvo carregado: ${targetShadow.personaName} (${targetShadow.shadowDisguiseName}). Dica: ${targetShadow.tacticalTip}`,
    ]);
  }, [targetShadowId, targetShadow]);

  // Synthesized Web Audio FX
  const playSound = (type: 'weak' | 'hit' | 'block' | 'allout' | 'baton') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'weak' || type === 'baton') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.14);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'allout') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'block') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // Ignore audio errors if blocked
    }
  };

  const resetBattle = () => {
    setEnemyHp(maxHp);
    setIsEnemyDown(false);
    setEnemyAilment('NONE');
    setOneMoreActive(false);
    setBatonPassRank(0);
    setActiveMemberIndex(0);
    setPassedMembers(['joker']);
    setShowNegotiationModal(false);
    setNegotiationResult(null);
    setBattleBanner(null);
    setCombatLog([`Combate reiniciado contra ${targetShadow.personaName}.`]);
  };

  // Check if an element triggers Technical Damage on current Ailment
  const checkTechnicalTrigger = (element: ElementKey, ailment: AilmentState): boolean => {
    if (ailment === 'NONE') return false;
    if (ailment === 'SLEEP') return true; // Universal technical
    if (ailment === 'FREEZE') return element === 'phys' || element === 'gun';
    if (ailment === 'SHOCK') return element === 'phys' || element === 'gun' || element === 'nuke';
    if (ailment === 'FORGET') return element === 'psy';
    return false;
  };

  const handleExecuteAttack = (element: ElementKey) => {
    if (enemyHp <= 0) return;
    setShowElementPicker(false);

    const elLabel = ELEMENT_LABELS.find((e) => e.key === element)?.label || element;
    let affinity = targetShadow.affinities[element];

    // Special Persona 5 Royal Mechanic: Freeze removes Physical/Gun Null/Repel/Resist!
    if (enemyAilment === 'FREEZE' && (element === 'phys' || element === 'gun')) {
      affinity = '-';
    }

    const batonMult =
      batonPassRank === 0 ? 1 : batonPassRank === 1 ? 1.25 : batonPassRank === 2 ? 1.5 : 1.75;

    if (affinity === 'NULO' || affinity === 'REFLETE' || affinity === 'DRENA') {
      playSound('block');
      setOneMoreActive(false);
      setBattleBanner({
        text: `${affinity}! ATAQUE BLOQUEADO!`,
        subtext: `${targetShadow.personaName} tem ${affinity} contra ${elLabel}. Dica: Use Status Negativo + Technical ou cheque a matriz!`,
        color: 'reflect',
      });
      setCombatLog((prev) => [
        `[${activeMember.codename}] usou ${elLabel} → ${affinity}! O turno foi perdido.`,
        ...prev,
      ]);
      return;
    }

    const isWeak = affinity === 'FRACO';
    const isTechnical = checkTechnicalTrigger(element, enemyAilment);

    let baseDmg = Math.round((targetShadow.level * 3.5 + 45) * batonMult);
    if (affinity === 'RESISTE' && !isTechnical) {
      baseDmg = Math.round(baseDmg * 0.45);
    }

    if (isWeak || isTechnical) {
      playSound('weak');
      const mult = isWeak && isTechnical ? 2.6 : isTechnical ? 2.1 : 1.7;
      const finalDmg = Math.round(baseDmg * mult);
      const nextHp = Math.max(1, enemyHp - finalDmg); // Leave at 1 HP on knockdown so player can test Hold Up!
      setEnemyHp(nextHp);
      setIsEnemyDown(true);
      setOneMoreActive(true);
      setEnemyAilment('NONE');

      const triggerType = isTechnical ? 'DANO TECHNICAL!' : 'FRAQUEZA ATINGIDA (WEAK)!';
      setBattleBanner({
        text: `${triggerType} → 1 MORE!`,
        subtext: `Causou ${finalDmg} de dano (Baton Pass ×${batonMult.toFixed(2)}) e DERRUBOU a Sombra! Faça Baton Pass ou inicie o HOLD UP!`,
        color: isTechnical ? 'tech' : 'weak',
      });
      setCombatLog((prev) => [
        `[${activeMember.codename}] acertou ${elLabel} → ${triggerType} (${finalDmg} dano). Inimigo DERRUBADO (DOWN)!`,
        ...prev,
      ]);
    } else {
      playSound('hit');
      const nextHp = Math.max(0, enemyHp - baseDmg);
      setEnemyHp(nextHp);
      setOneMoreActive(false);
      setBattleBanner({
        text: `Dano Normal: ${baseDmg} HP`,
        subtext: `Sem fraqueza ou Technical ativado. Para conseguir 1 More, mire em uma Fraqueza ou aplique Status Negativo antes!`,
        color: 'neutral',
      });
      setCombatLog((prev) => [
        `[${activeMember.codename}] usou ${elLabel} causando ${baseDmg} de dano.`,
        ...prev,
      ]);
    }
  };

  const handleApplyAilment = (ailment: AilmentState, skillName: string) => {
    playSound('weak');
    setEnemyAilment(ailment);
    const techHint =
      ailment === 'SLEEP'
        ? 'QUALQUER ataque agora causará DANO TECHNICAL e derrubará o inimigo!'
        : ailment === 'FREEZE'
        ? 'FÍSICO ou TIRO agora quebram imunidades e causam DANO TECHNICAL!'
        : ailment === 'SHOCK'
        ? 'FÍSICO, TIRO ou NUCLEAR agora causam DANO TECHNICAL!'
        : 'PSÍQUICO (Psi) agora causará DANO TECHNICAL e derrubará o inimigo!';

    setBattleBanner({
      text: `STATUS APLICADO: ${skillName.toUpperCase()}`,
      subtext: techHint,
      color: 'tech',
    });
    setCombatLog((prev) => [
      `[${activeMember.codename}] aplicou ${skillName} em ${targetShadow.personaName}! Prepare o golpe Technical!`,
      ...prev,
    ]);
  };

  const handleBatonPass = (targetIndex: number) => {
    const targetMember = PARTY_MEMBERS[targetIndex];
    playSound('baton');
    const nextRank = Math.min(3, batonPassRank + 1);
    setBatonPassRank(nextRank);
    setActiveMemberIndex(targetIndex);
    setPassedMembers((prev) => [...prev, targetMember.id]);
    setOneMoreActive(false); // Passed the 1 More to ally

    const mult = nextRank === 1 ? '×1.25' : nextRank === 2 ? '×1.50' : '×1.75 + 0 Custo de SP!';
    setBattleBanner({
      text: `BATON PASS NÍVEL ${nextRank}! (${targetMember.codename})`,
      subtext: `Poder de ataque aumentado em ${mult}!`,
      color: 'weak',
    });
    setCombatLog((prev) => [
      `Baton Pass para ${targetMember.codename}! Multiplicador subiu para Nível ${nextRank} (${mult}).`,
      ...prev,
    ]);
  };

  const handleAllOutAttack = () => {
    playSound('allout');
    setEnemyHp(0);
    setOneMoreActive(false);
    setShowNegotiationModal(false);
    setBattleBanner({
      text: 'ALL-OUT ATTACK! ("THE SHOW IS OVER!")',
      subtext: `Vitória implacável! ${targetShadow.personaName} foi pulverizado pelo ataque em conjunto.`,
      color: 'victory',
    });
    setCombatLog((prev) => [
      `ALL-OUT ATTACK executado! ${targetShadow.personaName} eliminado com sucesso!`,
      ...prev,
    ]);
  };

  const handleAnswerNegotiation = (
    result: 'SUCCESS' | 'NEUTRAL' | 'FAIL',
    explanation: string
  ) => {
    if (result === 'SUCCESS') {
      playSound('allout');
      setEnemyHp(0);
      setNegotiationResult(`MÁSCARA OBTIDA! ("I am thou, thou art I...") — ${explanation}`);
      if (onRecruitShadow) {
        onRecruitShadow(targetShadow.id);
      }
      setCombatLog((prev) => [
        `NEGOCIAÇÃO PERFEITA! Você recrutou a Persona ${targetShadow.personaName} (${targetShadow.arcana})!`,
        ...prev,
      ]);
    } else {
      playSound('block');
      setNegotiationResult(`NEGOCIAÇÃO FALHOU: ${explanation}`);
    }
  };

  const negotiationData = NEGOTIATION_QUESTIONS[targetShadow.personality];

  return (
    <div className="space-y-6">
      {/* MISSION / TRAINING PRESET SELECTOR */}
      <section className="bg-slate-950/90 border-2 border-slate-800 rounded-xl p-5 space-y-4 shadow-[4px_4px_0px_rgba(0,0,0,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <span className={`text-xs font-mono font-bold uppercase ${gameConfig.accentTextClass}`}>
              Passo 01 · Arena de Prática Interativa
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Simulador de Combate: Aprenda Fazendo (1 More, Technical, Baton Pass & Hold Up)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {soundEnabled ? 'Som Ativo' : 'Mudo'}
            </button>
            <button
              onClick={resetBattle}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 ${gameConfig.accentBgClass}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Luta
            </button>
          </div>
        </div>

        {/* Guided Practical Lessons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => setTargetShadowId('p5r-pixie')}
            className={`p-3 rounded-lg border text-left transition-all ${
              targetShadow.id === 'p5r-pixie'
                ? `${gameConfig.accentBorderClass} ${gameConfig.accentSoftBgClass}`
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-mono text-emerald-400 font-bold block">
              Lição Prática 01 · Básico
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              Economia de SP com Arma (Pixie)
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Derrube usando TIRO sem gastar SP e teste a Negociação Tímida.
            </span>
          </button>

          <button
            onClick={() => setTargetShadowId('p5r-anubis')}
            className={`p-3 rounded-lg border text-left transition-all ${
              targetShadow.id === 'p5r-anubis'
                ? `${gameConfig.accentBorderClass} ${gameConfig.accentSoftBgClass}`
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-mono text-sky-400 font-bold block">
              Lição Prática 02 · Intermediário
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              Inimigo SEM Fraqueza (Anubis)
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Aplique SONO ou ESQUECIMENTO e acerte Psíquico/Físico para Technical!
            </span>
          </button>

          <button
            onClick={() => setTargetShadowId('p5r-arahabaki')}
            className={`p-3 rounded-lg border text-left transition-all ${
              targetShadow.id === 'p5r-arahabaki'
                ? `${gameConfig.accentBorderClass} ${gameConfig.accentSoftBgClass}`
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-mono text-amber-400 font-bold block">
              Lição Prática 03 · Avançado
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              Quebrar Reflexo Físico (Arahabaki)
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Reflete Físico/Tiro! Use Psíquico/Nuclear ou Congele antes de bater.
            </span>
          </button>

          <button
            onClick={() => setTargetShadowId('p5r-okumura-MDL')}
            className={`p-3 rounded-lg border text-left transition-all ${
              targetShadow.id === 'p5r-okumura-MDL'
                ? `${gameConfig.accentBorderClass} ${gameConfig.accentSoftBgClass}`
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] font-mono text-rose-400 font-bold block">
              Lição Prática 04 · Mestre
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              Cadeia Baton Pass Nv. 3 (Okumura)
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Derrube e passe o bastão 3 vezes para atingir ×1.75 de dano!
            </span>
          </button>
        </div>

        {/* Full Shadow Selector Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900 text-xs">
          <div className="flex items-center gap-2">
            <label htmlFor="shadow-select" className="text-slate-400 font-medium">
              Ou escolha qualquer Sombra do Compêndio para treinar:
            </label>
            <select
              id="shadow-select"
              value={targetShadow.id}
              onChange={(e) => setTargetShadowId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none"
            >
              {SHADOW_ENEMIES.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.gameId.toUpperCase()}] Nv.{s.level} {s.personaName} — {s.shadowDisguiseName}
                </option>
              ))}
            </select>
          </div>
          <span className="text-slate-400">
            Personalidade desta Sombra: <strong className="text-white">{targetShadow.personality}</strong>
          </span>
        </div>
      </section>

      {/* ACTIVE BATTLE STAGE + COMMAND DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* BATTLE ARENA VIEWPORT (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border-2 border-slate-800 rounded-xl p-6 space-y-6 relative overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,0.75)]">
          {/* Dynamic Banner Callout (1 MORE / TECHNICAL / HOLD UP) */}
          {battleBanner && (
            <div
              className={`p-3.5 rounded-lg border-2 transition-all ${
                battleBanner.color === 'weak'
                  ? 'bg-rose-950/90 border-rose-500 text-white'
                  : battleBanner.color === 'tech'
                  ? 'bg-sky-950/90 border-sky-400 text-white'
                  : battleBanner.color === 'victory'
                  ? 'bg-emerald-950/90 border-emerald-400 text-white'
                  : battleBanner.color === 'reflect'
                  ? 'bg-amber-950/90 border-amber-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            >
              <p className="text-sm font-bold tracking-wide font-display">
                {battleBanner.text}
              </p>
              <p className="text-xs opacity-90 mt-0.5">{battleBanner.subtext}</p>
            </div>
          )}

          {/* ENEMY STAGE */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div
              className={`transition-transform duration-200 ${
                isEnemyDown ? 'rotate-12 scale-95 opacity-80' : 'scale-105'
              }`}
            >
              <PersonaSpriteArt
                shadowId={targetShadow.id}
                personaName={targetShadow.personaName}
                arcana={targetShadow.arcana}
                className="w-28 h-28 border-rose-500/60 shadow-lg"
              />
            </div>

            <div className="flex-1 w-full space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-slate-400">
                    Nv. {targetShadow.level} · Arcana {targetShadow.arcana}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {targetShadow.personaName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Disfarce: {targetShadow.shadowDisguiseName}
                  </p>
                </div>

                {/* Enemy Status Tags */}
                <div className="flex items-center gap-2">
                  {isEnemyDown && (
                    <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-mono text-xs font-bold">
                      DERRUBADO (DOWN!)
                    </span>
                  )}
                  {enemyAilment !== 'NONE' && (
                    <span className="px-2.5 py-1 rounded bg-sky-600 text-white font-mono text-xs font-bold">
                      STATUS: {enemyAilment}
                    </span>
                  )}
                </div>
              </div>

              {/* HP Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono tabular-nums">
                  <span className="text-slate-300">HP DA SOMBRA</span>
                  <span className="font-bold text-white">
                    {enemyHp} / {maxHp} HP
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-rose-600 transition-all duration-200"
                    style={{ width: `${Math.max(0, (enemyHp / maxHp) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Compact Elemental Reference Strip */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 pt-1">
                {ELEMENT_LABELS.map((el) => {
                  const aff = targetShadow.affinities[el.key];
                  return (
                    <div
                      key={el.key}
                      className="bg-slate-950 border border-slate-800 rounded p-1 text-center"
                    >
                      <span className="block font-mono text-[9px] text-slate-400">
                        {el.short}
                      </span>
                      <span
                        className={`block font-mono text-[10px] font-bold ${
                          aff === 'FRACO'
                            ? 'text-rose-400'
                            : aff === 'NULO' || aff === 'REFLETE'
                            ? 'text-sky-300'
                            : aff === 'DRENA'
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {aff}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HOLD UP! OVERLAY WHEN ENEMY IS DOWN */}
          {isEnemyDown && enemyHp > 0 && (
            <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-950 border-2 border-rose-500 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-300 uppercase">
                    Inimigo Cercado · Decisão de Hold Up!
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    HOLD UP! O que você deseja fazer?
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAllOutAttack}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow"
                  >
                    <Zap className="w-4 h-4" />
                    All-Out Attack (Finalizar)
                  </button>
                  <button
                    onClick={() => {
                      setShowNegotiationModal(true);
                      setNegotiationResult(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Negociar Poder (Recrutar Persona)
                  </button>
                </div>
              </div>

              {/* Interactive Negotiation Modal Inside Hold Up */}
              {showNegotiationModal && (
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Personalidade Detectada:{' '}
                      <strong className="text-amber-300">{targetShadow.personality}</strong>
                    </span>
                    <span className="text-slate-400">Escolha o tom certo para ganhar a Máscara!</span>
                  </div>
                  <p className="text-sm font-semibold text-white italic">
                    {negotiationData.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {negotiationData.choices.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerNegotiation(ch.result, ch.explanation)}
                        className="text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-100 flex items-center justify-between gap-3"
                      >
                        <span>{ch.text}</span>
                        <span className="font-mono text-[11px] text-slate-400 shrink-0">
                          [{ch.tone}]
                        </span>
                      </button>
                    ))}
                  </div>
                  {negotiationResult && (
                    <div className="p-3 rounded bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-medium">
                      {negotiationResult}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BATON PASS / SHIFT BAR WHEN 1 MORE IS ACTIVE */}
          {oneMoreActive && enemyHp > 0 && (
            <div className="bg-slate-900 border border-sky-500/60 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  1 MORE ATIVO! Passe o Bastão (Baton Pass / Shift) para subir o Multiplicador:
                </span>
                <span className="text-xs font-mono text-white">
                  Cadeia Atual: Nv. {batonPassRank} / 3
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PARTY_MEMBERS.map((member, idx) => {
                  const alreadyUsed = passedMembers.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      disabled={alreadyUsed}
                      onClick={() => handleBatonPass(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                        alreadyUsed
                          ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-sky-600 hover:bg-sky-500 border-sky-400 text-white'
                      }`}
                    >
                      Passar para {member.codename}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* PLAYER COMMAND DECK & COMBAT LOG (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Turn Command Menu */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-5 space-y-5 shadow-[6px_6px_0px_rgba(0,0,0,0.75)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400">
                  TURNO ATIVO · BATON PASS NV. {batonPassRank}
                </span>
                <h3 className={`text-lg font-bold ${gameConfig.accentTextClass}`}>
                  {activeMember.codename} ({activeMember.persona})
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-sky-300">
                {batonPassRank === 3 ? 'CUSTO: 0 SP!' : `SP: ${activeMember.sp}/${activeMember.maxSp}`}
              </span>
            </div>

            {/* Primary Persona Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleExecuteAttack('phys')}
                className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left flex items-center gap-2.5 transition-colors"
              >
                <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-white">Ataque Físico</span>
                  <span className="block text-[10px] text-slate-400">Golpe Corpo a Corpo</span>
                </div>
              </button>

              <button
                onClick={() => handleExecuteAttack('gun')}
                className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left flex items-center gap-2.5 transition-colors"
              >
                <Crosshair className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-white">Disparo (Gun/Pierce)</span>
                  <span className="block text-[10px] text-slate-400">Sem gasto de SP</span>
                </div>
              </button>

              <button
                onClick={() => setShowElementPicker(!showElementPicker)}
                className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors col-span-2 ${
                  showElementPicker
                    ? `${gameConfig.accentBgClass} border-transparent`
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                }`}
              >
                <Flame className="w-4 h-4 shrink-0" />
                <div className="flex-1">
                  <span className="block text-xs font-bold">
                    Invocar Magia Elemental de Persona (8 Elementos)
                  </span>
                  <span className="block text-[10px] opacity-80">
                    Fogo, Gelo, Eletricidade, Vento, Psíquico, Nuclear, Luz, Trevas
                  </span>
                </div>
              </button>
            </div>

            {/* Expandable 8-Element Spell Grid */}
            {showElementPicker && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-slate-900 border border-slate-700">
                {ELEMENT_LABELS.filter((e) => e.key !== 'phys' && e.key !== 'gun').map((el) => (
                  <button
                    key={el.key}
                    onClick={() => handleExecuteAttack(el.key)}
                    className="py-2 px-2.5 rounded bg-slate-950 hover:bg-rose-600 text-white border border-slate-800 text-xs font-mono font-bold transition-colors"
                  >
                    {el.short}
                  </button>
                ))}
              </div>
            )}

            {/* Status Ailments Bar (For Technical Setup) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Habilidades de Status (Prepare um Dano Technical!):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleApplyAilment('SLEEP', 'Dormina (Sono)')}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-sky-950 border border-slate-800 hover:border-sky-500/50 text-left text-xs"
                >
                  <span className="font-bold text-white block">Dormina (Sono)</span>
                  <span className="text-[10px] text-slate-400">Combo: Qualquer Golpe</span>
                </button>
                <button
                  onClick={() => handleApplyAilment('FORGET', 'Makajam (Esquecimento)')}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-sky-950 border border-slate-800 hover:border-sky-500/50 text-left text-xs"
                >
                  <span className="font-bold text-white block">Makajam (Mental)</span>
                  <span className="text-[10px] text-slate-400">Combo: Psíquico (Psi)</span>
                </button>
                <button
                  onClick={() => handleApplyAilment('FREEZE', 'Bufu (Congelamento)')}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-sky-950 border border-slate-800 hover:border-sky-500/50 text-left text-xs"
                >
                  <span className="font-bold text-white block">Congelar (Freeze)</span>
                  <span className="text-[10px] text-slate-400">Combo: Físico / Tiro</span>
                </button>
                <button
                  onClick={() => handleApplyAilment('SHOCK', 'Zio (Choque)')}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-sky-950 border border-slate-800 hover:border-sky-500/50 text-left text-xs"
                >
                  <span className="font-bold text-white block">Choque (Shock)</span>
                  <span className="text-[10px] text-slate-400">Combo: Físico / Nuclear</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Combat Analysis Log */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 block">
              HISTÓRICO TÁTICO DO TURNO
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs font-mono">
              {combatLog.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    idx === 0
                      ? 'bg-slate-900 text-white border border-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
