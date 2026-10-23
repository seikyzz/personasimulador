import profiles from "../academy/profiles.json";
import type { Game } from "../academy/content";
export type ModernGame = Exclude<Game, "p2">;
export type PersonaId = "pixie" | "jack-frost" | "jack-o-lantern";
export type Command =
  | "Agi"
  | "Bufu"
  | "Zio"
  | "Ataque"
  | "Dia"
  | "Tarunda"
  | "Rakukaja"
  | "Dormina"
  | "Defender"
  | "All-Out Attack"
  | "Passar";
export type Enemy = {
  id: PersonaId | "angel";
  hp: number;
  max: number;
  down: boolean;
  sleep: boolean;
  sleepTicks: number;
  scanned: boolean;
  charged: boolean;
};
export type Run = {
  game: ModernGame;
  mission: number;
  round: number;
  hp: number;
  sp: number;
  active: PersonaId;
  switched: boolean;
  extra: boolean;
  passed: boolean;
  buff: number;
  debuff: number;
  enemies: Enemy[];
  log: string[];
  message: string;
  hit: number;
  serial: number;
  outcome: "playing" | "won" | "lost";
  stats: {
    weak: number;
    guard: number;
    heals: number;
    debuff: number;
    technical: number;
    passes: number;
    spent: number;
    scans: number;
    mistakes: number;
  };
};
export const skills: Record<
  Command,
  { cost: number; element?: string; help: string }
> = {
  Agi: {
    cost: 4,
    element: "Fogo",
    help: "Dano de fogo. Confira a afinidade antes de gastar SP.",
  },
  Bufu: {
    cost: 4,
    element: "Gelo",
    help: "Dano de gelo. Drenar recupera o HP do inimigo!",
  },
  Zio: {
    cost: 4,
    element: "Eletricidade",
    help: "Dano elétrico. Cobertura não é o mesmo que potência.",
  },
  Ataque: {
    cost: 0,
    element: "Físico",
    help: "Ataque básico sem custo de SP. Em P5R, pode gerar Technical em um alvo dormindo.",
  },
  Dia: {
    cost: 6,
    help: "Recupera 60 HP. Consome a ação e permite a resposta inimiga.",
  },
  Tarunda: {
    cost: 8,
    help: "No exercício, reduz em 25% o dano inimigo por 3 respostas.",
  },
  Rakukaja: {
    cost: 8,
    help: "No exercício, reduz o dano recebido em 25% por 3 respostas.",
  },
  Dormina: {
    cost: 5,
    help: "Adormece um alvo neste treino. Acorda ao sofrer dano; somente Royal usa Technical.",
  },
  Defender: {
    cost: 0,
    help: "Reduz a próxima resposta em 60% e bloqueia o bônus por sua fraqueza.",
  },
  "All-Out Attack": {
    cost: 0,
    help: "Exige todos os inimigos vivos derrubados. Causa 95 de dano em cada alvo, não é vitória automática.",
  },
  Passar: {
    cost: 0,
    help: "Transfere uma ação extra a um aliado de treino com outro elemento. P4G não tem essa opção.",
  },
};
export const kits: Record<PersonaId, Command> = {
  pixie: "Zio",
  "jack-frost": "Bufu",
  "jack-o-lantern": "Agi",
};
export const missionTitles = [
  "Leia o inimigo",
  "Crie uma sequência",
  "Sobreviva à pressão",
  "Prova de domínio",
];
export const missionGoals = [
  "Analise um alvo e vença explorando sua fraqueza.",
  "Vença usando pelo menos duas fraquezas. P5R/P3R: experimente a transferência.",
  "Vença após defender um ataque e usar cura ou redução de dano.",
  "Vença em até 8 rodadas, com pelo menos 60 HP; use fraqueza, defesa e Tarunda.",
];
export function createRun(game: ModernGame, mission = 0): Run {
  const ids: Enemy["id"][] =
    mission === 0
      ? ["jack-frost"]
      : mission === 1
        ? ["jack-frost", "jack-o-lantern"]
        : mission === 2
          ? ["jack-frost", "pixie"]
          : ["jack-frost", "jack-o-lantern", "pixie"];
  const max = [70, 115, 180, 220][mission] ?? 70;
  return {
    game,
    mission,
    round: 1,
    hp: 180,
    sp: 64,
    active: "pixie",
    switched: false,
    extra: false,
    passed: false,
    buff: 0,
    debuff: 0,
    enemies: ids.map((id) => ({
      id,
      hp: max,
      max,
      down: false,
      sleep: false,
      sleepTicks: 0,
      scanned: false,
      charged: mission >= 2,
    })),
    log: [],
    message:
      "Comece analisando. Observe também a intenção inimiga, não só o HP.",
    hit: -1,
    serial: 0,
    outcome: "playing",
    stats: {
      weak: 0,
      guard: 0,
      heals: 0,
      debuff: 0,
      technical: 0,
      passes: 0,
      spent: 0,
      scans: 0,
      mistakes: 0,
    },
  };
}
export function affinity(game: ModernGame, id: Enemy["id"], element: string) {
  return (
    profiles[game][id].affinities.find((a) => a.element === element)
      ?.affinity ?? "Normal"
  );
}
export function canAll(s: Run) {
  return (
    s.enemies.some((e) => e.hp > 0) &&
    s.enemies.every((e) => e.hp === 0 || e.down)
  );
}
export function mastered(s: Run) {
  if (s.outcome !== "won") return false;
  switch (s.mission) {
    case 0:
      return s.stats.scans > 0 && s.stats.weak > 0;
    case 1:
      return s.stats.weak >= 2;
    case 2:
      return s.stats.guard > 0 && (s.stats.heals > 0 || s.stats.debuff > 0);
    default:
      return (
        s.round <= 8 &&
        s.hp >= 60 &&
        s.stats.weak > 0 &&
        s.stats.guard > 0 &&
        s.stats.debuff > 0
      );
  }
}
function copy(s: Run): Run {
  return {
    ...s,
    enemies: s.enemies.map((e) => ({ ...e })),
    stats: { ...s.stats },
    log: [...s.log],
    serial: s.serial + 1,
    hit: -1,
  };
}
function note(s: Run, t: string) {
  s.message = t;
  s.log = [t, ...s.log].slice(0, 20);
}
function finish(s: Run) {
  if (s.enemies.every((e) => e.hp <= 0)) {
    s.outcome = "won";
    s.extra = false;
    return true;
  }
  if (s.hp <= 0) {
    s.outcome = "lost";
    s.extra = false;
    return true;
  }
  return false;
}
export function scan(s: Run, index: number): Run {
  if (s.outcome !== "playing" || !s.enemies[index] || s.enemies[index].scanned)
    return s;
  const n = copy(s);
  n.enemies[index].scanned = true;
  n.stats.scans++;
  note(
    n,
    "Análise registrada sem gastar a ação. Compare as afinidades com as habilidades e a resistência da Persona equipada.",
  );
  return n;
}
export function swap(s: Run, id: PersonaId): Run {
  if (s.outcome !== "playing" || s.switched || id === s.active) return s;
  const n = copy(s);
  n.active = id;
  n.switched = true;
  note(
    n,
    `Persona equipada: ${profiles[s.game][id].name}. Uma troca por rodada neste exercício; sua defesa também mudou.`,
  );
  return n;
}
function respond(s: Run, guard = false) {
  let total = 0;
  const lines: string[] = [];
  for (const enemy of s.enemies) {
    if (enemy.hp <= 0) continue;
    if (enemy.sleep) {
      enemy.sleepTicks--;
      enemy.sleep = enemy.sleepTicks > 0;
      lines.push(
        enemy.sleep
          ? "Um alvo perdeu sua ação dormindo."
          : "Um alvo perdeu sua ação e acordou.",
      );
      continue;
    }
    if (enemy.down) {
      enemy.down = false;
      lines.push("Um alvo gastou sua ação se levantando.");
      continue;
    }
    if (s.round % 3 === 0 && !enemy.charged && s.mission >= 2) {
      enemy.charged = true;
      lines.push(
        "O inimigo concentra energia. Na próxima resposta, o dano será maior.",
      );
      continue;
    }
    const element =
      enemy.id === "jack-frost"
        ? "Gelo"
        : enemy.id === "jack-o-lantern"
          ? "Fogo"
          : enemy.id === "pixie"
            ? "Eletricidade"
            : "Físico";
    const aff = affinity(s.game, s.active, element);
    let damage = enemy.charged ? 56 : 18 + s.mission * 3;
    enemy.charged = false;
    if (aff === "Anula" || aff === "Drena" || aff === "Repele") damage = 0;
    else if (aff === "Resiste") damage *= 0.5;
    else if (aff === "Fraco" && !guard) {
      damage *= 1.5;
      lines.push(`Sua Persona é fraca a ${element}: dano ampliado no treino.`);
      s.stats.mistakes++;
    }
    damage *= guard ? 0.4 : 1;
    damage *= s.buff > 0 ? 0.75 : 1;
    damage *= s.debuff > 0 ? 0.75 : 1;
    total += Math.round(damage);
  }
  s.hp = Math.max(0, s.hp - total);
  s.round++;
  s.switched = false;
  s.extra = false;
  s.passed = false;
  s.buff = Math.max(0, s.buff - 1);
  s.debuff = Math.max(0, s.debuff - 1);
  s.message += ` Resposta: −${total} HP. ${lines.join(" ")}`;
  s.log[0] = s.message;
  if (finish(s) && s.outcome === "lost")
    note(
      s,
      "Derrota de treino. Revise a intenção inimiga, a fraqueza da sua Persona e o momento de curar. Você pode tentar novamente.",
    );
}
export function command(state: Run, action: Command, target = 0): Run {
  if (
    state.outcome !== "playing" ||
    !skills[action] ||
    state.sp < skills[action].cost
  )
    return state;
  if (action === "Passar") {
    if (state.game === "p4g" || !state.extra || state.passed) return state;
    const n = copy(state);
    n.passed = true;
    n.stats.passes++;
    n.active =
      n.active === "jack-o-lantern"
        ? "jack-frost"
        : n.active === "jack-frost"
          ? "pixie"
          : "jack-o-lantern";
    note(
      n,
      `${state.game === "p5r" ? "Baton Pass" : "Shift"}: aliado de treino assume com ${kits[n.active]}. A ação extra continua; ${state.game === "p5r" ? "o próximo ataque recebe bônus didático de 25%." : "Shift não recebe o bônus de dano de Baton Pass."}`,
    );
    return n;
  }
  if (action === "All-Out Attack" && !canAll(state)) return state;
  if (["Agi", "Bufu", "Zio"].includes(action) && kits[state.active] !== action)
    return state;
  if (action === "Dia" && state.hp === 180) return state;
  if (
    (skills[action].element || action === "Dormina") &&
    (!state.enemies[target] || state.enemies[target].hp <= 0)
  )
    return state;
  const s = copy(state);
  s.sp -= skills[action].cost;
  s.stats.spent += skills[action].cost;
  if (action === "All-Out Attack") {
    s.enemies.forEach((e) => {
      e.hp = Math.max(0, e.hp - 95);
      e.down = false;
    });
    note(
      s,
      "ALL-OUT ATTACK! −95 HP em cada alvo. Se alguém resistir, prepare a próxima rodada.",
    );
  } else if (action === "Defender") {
    s.stats.guard++;
    note(s, "Você se protegeu e abriu mão do ataque para reduzir a resposta.");
    respond(s, true);
    return s;
  } else if (action === "Dia") {
    s.hp = Math.min(180, s.hp + 60);
    s.stats.heals++;
    note(s, "Dia recuperou até 60 HP. Agora os inimigos podem agir.");
  } else if (action === "Tarunda") {
    s.debuff = 3;
    s.stats.debuff++;
    note(
      s,
      "Tarunda: dano inimigo reduzido nas próximas 3 respostas. No treino, aplica-se ao grupo; no jogo, confira o alvo da habilidade.",
    );
  } else if (action === "Rakukaja") {
    s.buff = 3;
    note(
      s,
      "Rakukaja: defesa melhorada por 3 respostas. Não substitui defender um ataque concentrado.",
    );
  } else if (action === "Dormina") {
    s.enemies[target].sleep = true;
    s.enemies[target].sleepTicks = 2;
    note(
      s,
      "O alvo dormiu. A chance é garantida neste exercício; no jogo depende de precisão, resistência e condições.",
    );
  } else {
    const enemy = s.enemies[target];
    const aff = affinity(s.game, enemy.id, skills[action].element!);
    const tech =
      enemy.sleep &&
      s.game === "p5r" &&
      !["Anula", "Drena", "Repele"].includes(aff);
    let damage = action === "Ataque" ? 22 : 32;
    damage *= state.passed && state.game === "p5r" ? 1.25 : 1;
    if (tech) {
      damage *= 1.6;
      s.stats.technical++;
    }
    if (aff === "Fraco") damage *= 1.5;
    if (aff === "Resiste") damage *= 0.5;
    if (aff === "Anula") damage = 0;
    if (aff === "Drena") {
      enemy.hp = Math.min(enemy.max, enemy.hp + Math.round(damage));
      damage = 0;
      s.stats.mistakes++;
    }
    if (aff === "Repele") {
      s.hp = Math.max(0, s.hp - Math.round(damage));
      damage = 0;
      s.stats.mistakes++;
    }
    enemy.hp = Math.max(0, enemy.hp - Math.round(damage));
    s.hit = target;
    if (damage > 0) {
      enemy.sleep = false;
      enemy.sleepTicks = 0;
    }
    const extra = (aff === "Fraco" || tech) && !enemy.down && damage > 0;
    if (aff === "Fraco") s.stats.weak++;
    if (["Anula", "Resiste"].includes(aff)) s.stats.mistakes++;
    note(
      s,
      `${tech ? "TECHNICAL! " : aff === "Fraco" ? "WEAK! " : ""}${action}: ${Math.round(damage)} de dano. Afinidade: ${aff}.${tech ? " Treino de Royal com Technical rank 4: derrubada garantida nesta condição." : ""}`,
    );
    if (extra) {
      enemy.down = true;
      s.extra = true;
      s.passed = false;
      s.message += " 1 MORE: aproveite outra ação.";
      s.log[0] = s.message;
      finish(s);
      return s;
    }
  }
  if (!finish(s)) respond(s);
  return s;
}
