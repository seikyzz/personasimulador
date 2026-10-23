import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  RotateCcw,
  Eye,
  Shield,
  Swords,
  BookOpen,
  Target,
  ChevronRight,
  Heart,
  Zap,
  LockKeyhole,
  ExternalLink,
} from "lucide-react";
import { Game, games } from "../academy/content";
import profiles from "../academy/profiles.json";
import {
  createRun,
  command,
  scan,
  swap,
  skills,
  kits,
  canAll,
  mastered,
  missionTitles,
  missionGoals,
  Command,
  PersonaId,
  ModernGame,
} from "./engine";
import { questions, theory, labNames, Lab, sources } from "./curriculum";
export type TrainingPage =
  "battle" | "team" | "fusion" | "calendar" | "social" | "learn" | "sources";
export function Art({ id }: { id: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}personas/${id}.webp`}
      alt={id.replaceAll("-", " ")}
      className="training-art"
      draggable={false}
    />
  );
}
export function Trail({
  game,
  done,
  onGo,
}: {
  game: Game;
  done: string[];
  onGo: (page: TrainingPage) => void;
}) {
  const tasks: [TrainingPage, string, string][] = [
    [
      "battle",
      "Aprenda a ler uma luta",
      "Analise, equipe, ataque. Quatro encontros com dificuldade crescente.",
    ],
    [
      "team",
      "Construa sua resposta",
      "Diagnostique a cobertura e a defesa que faltam.",
    ],
    [
      "fusion",
      game === "p2" ? "Prepare a invocação" : "Faça uma fusão consciente",
      "Decida o que preservar, o que trocar e por quê.",
    ],
    [
      "calendar",
      game === "p2" ? "Planeje sua incursão" : "Use o dia com intenção",
      "Compare prazo, requisitos e custo de oportunidade.",
    ],
    [
      "social",
      game === "p2" ? "Entenda os contatos" : "Treine os vínculos",
      "Pratique decisões sem reproduzir cenas da história.",
    ],
  ];
  const next = tasks.find(([id]) => !done.includes(id)) ?? tasks[0];
  return (
    <>
      <section className="training-home">
        <div className="training-hero-copy">
          <span className="chapter-label">
            MANUAL DE CAMPO / {games[game].edition}
          </span>
          <h1>
            {game === "p5r" ? (
              <>
                ROUBE A CENA.
                <br />
                <em>ENTENDA A JOGADA.</em>
              </>
            ) : game === "p3r" ? (
              <>
                CADA ESCOLHA.
                <br />
                <em>UM NOVO POTENCIAL.</em>
              </>
            ) : game === "p4g" ? (
              <>
                SINTONIZE.
                <br />
                <em>ENCONTRE SUA RESPOSTA.</em>
              </>
            ) : (
              <>
                OUTRO EU.
                <br />
                <em>OUTRA ESTRATÉGIA.</em>
              </>
            )}
          </h1>
          <p>
            Não sabe por onde começar? Siga o treino abaixo.
            <br />
            Você aprende uma regra, testa na prática e recebe uma explicação
            para cada erro.
          </p>
          <button className="primary" onClick={() => onGo(next[0])}>
            {done.length ? "Continuar meu treinamento" : "Começar do zero"}{" "}
            <ArrowRight size={19} />
          </button>
          <div className="learning-ratio">
            <b>
              20%<small>ENTENDA A REGRA</small>
            </b>
            <span>→</span>
            <b>
              80%<small>DECIDA · ERRE · TENTE DE NOVO</small>
            </b>
          </div>
          <span className="tiny">
            Proporção do formato: uma explicação curta para quatro decisões. O
            tempo depende do seu ritmo.
          </span>
        </div>
        <div className="training-hero-art">
          <div className="theme-seal">
            {game === "p4g"
              ? "TV"
              : game === "p3r"
                ? "SEES"
                : game === "p5r"
                  ? "TAKE YOUR TIME"
                  : "ARCANA"}
          </div>
          <Art id={games[game].hero} />
          <span className="floating-label">
            SUA PRIMEIRA MISSÃO
            <br />
            <strong>Entender antes de agir.</strong>
          </span>
        </div>
      </section>
      <section className="pathway">
        <div className="section-heading">
          <div>
            <span className="eyebrow">POR AQUI · SEM PULAR OS FUNDAMENTOS</span>
            <h2>Do primeiro turno à autonomia.</h2>
          </div>
          <span className="progress-badge">
            {tasks.filter(([id]) => done.includes(id)).length}/5 etapas
          </span>
        </div>
        <div className="path-list">
          {tasks.map(([page, title, desc], i) => (
            <button
              className={`path-item ${done.includes(page) ? "passed" : ""} ${next[0] === page ? "next" : ""}`}
              key={page}
              onClick={() => onGo(page)}
            >
              <span className="path-number">
                {done.includes(page) ? (
                  <Check />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <div>
                <small>
                  {done.includes(page)
                    ? "CRITÉRIO ATINGIDO"
                    : next[0] === page
                      ? "SUA PRÓXIMA ETAPA"
                      : "PRÁTICA LIVRE DISPONÍVEL"}
                </small>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <ArrowRight size={22} />
            </button>
          ))}
        </div>
      </section>
      <div className="mentor-note">
        <Target size={25} />
        <div>
          <strong>O que significa dominar aqui?</strong>
          <p>
            Vencer não basta. As provas pedem evidência: analisar, explorar
            fraquezas, administrar recursos e justificar escolhas. A aprovação
            vale para estes exercícios, não certifica domínio de todos os jogos.
          </p>
        </div>
      </div>
      <div className="button-row">
        <button className="secondary" onClick={() => onGo("learn")}>
          <BookOpen size={17} /> Consultar conceitos
        </button>
        <button className="secondary" onClick={() => onGo("sources")}>
          <ExternalLink size={17} /> Fontes e aprofundamento
        </button>
      </div>
    </>
  );
}
export function PracticalLab({
  lab,
  game,
  onMaster,
}: {
  lab: Lab;
  game: Game;
  onMaster: () => void;
}) {
  const bank = questions(lab, game);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [missed, setMissed] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const q = bank[index];
  const correct = choice !== null && q.answers[choice].correct;
  const score = 4 - missed.length;
  function answer(i: number) {
    if (correct) return;
    setChoice(i);
    if (!q.answers[i].correct && !missed.includes(index))
      setMissed([...missed, index]);
  }
  function next() {
    if (index === 3) {
      setComplete(true);
      if (score >= 3) onMaster();
    } else {
      setIndex(index + 1);
      setChoice(null);
    }
  }
  function reset() {
    setIndex(0);
    setChoice(null);
    setMissed([]);
    setComplete(false);
    setStarted(true);
  }
  return (
    <section className="practice-course">
      <div className="course-title">
        <span className="chapter-label">
          TEORIA CURTA → 4 DECISÕES → REVISÃO
        </span>
        <h2>{labNames[game === "p2" ? "classic" : lab]}</h2>
        <p>
          Critério: pelo menos 3 acertos na primeira tentativa. Errou? Leia a
          causa, corrija e continue. Você pode repetir a prova.
        </p>
      </div>
      {!started ? (
        <div className="briefing">
          <span className="briefing-number">
            01<span>REGRA</span>
          </span>
          <div>
            <h3>Antes de agir</h3>
            <p>{theory[game === "p2" ? "classic" : lab]}</p>
            <button className="primary" onClick={() => setStarted(true)}>
              Entendi o objetivo. Quero praticar <ArrowRight size={17} />
            </button>
          </div>
        </div>
      ) : complete ? (
        <div className="assessment" role="status">
          <span className="chapter-label">REVISÃO DA TENTATIVA</span>
          <h2>
            {score >= 3 ? "Critério atingido." : "Vamos consolidar a base."}
          </h2>
          <p>
            {score}/4 decisões corretas na primeira tentativa.{" "}
            {score >= 3
              ? "Você demonstrou o raciocínio pedido neste módulo."
              : "Corrigir os erros é parte do treino. Refaça e tente justificar cada decisão antes de responder."}
          </p>
          {missed.length > 0 && (
            <ul>
              {missed.map((i) => (
                <li key={i}>
                  <strong>Revisar: {bank[i].title}.</strong>{" "}
                  {bank[i].answers.find((a) => a.correct)?.why}
                </li>
              ))}
            </ul>
          )}
          <button className="secondary" onClick={reset}>
            <RotateCcw size={16} /> Repetir prova
          </button>
        </div>
      ) : (
        <div className="question-panel">
          <div className="question-meter">
            <span>DECISÃO {index + 1} / 4</span>
            <span>
              {bank.map((_, i) => (
                <i key={i} className={i <= index ? "lit" : ""} />
              ))}
            </span>
          </div>
          <h3>{q.title}</h3>
          <p className="situation">{q.situation}</p>
          <div className="answer-options">
            {q.answers.map((a, i) => (
              <button
                key={a.text}
                className={
                  choice === i ? (a.correct ? "correct" : "incorrect") : ""
                }
                disabled={!!correct}
                onClick={() => answer(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {a.text}
              </button>
            ))}
          </div>
          {choice !== null && (
            <div
              className={`decision-feedback ${correct ? "correct" : "incorrect"}`}
              role="status"
            >
              <strong>
                {correct
                  ? "Raciocínio consistente."
                  : "Observe o que ficou de fora."}
              </strong>
              <p>{q.answers[choice].why}</p>
              {correct ? (
                <button className="primary" onClick={next}>
                  {index === 3 ? "Ver meu diagnóstico" : "Próxima situação"}{" "}
                  <ArrowRight size={17} />
                </button>
              ) : (
                <span className="tiny">
                  Tente outra decisão. O primeiro erro fica no diagnóstico, mas
                  não bloqueia seu aprendizado.
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
export function CombatTrainer({
  game,
  onMaster,
}: {
  game: Game;
  onMaster: () => void;
}) {
  if (game === "p2")
    return (
      <>
        <div className="module-intro">
          <span className="eyebrow">PERSONA 2 · UM SISTEMA DIFERENTE</span>
          <h1>Coordene. Converse. Combine.</h1>
          <p>
            IS e EP não usam o combate moderno. Esta etapa é uma prova de
            decisões; não simula receitas de Fusion Spells ou batalhas completas
            de Persona 2.
          </p>
        </div>
        <PracticalLab lab="classic" game={game} onMaster={onMaster} />
      </>
    );
  return <ModernCombat game={game} onMaster={onMaster} />;
}
function ModernCombat({
  game,
  onMaster,
}: {
  game: ModernGame;
  onMaster: () => void;
}) {
  const [mission, setMission] = useState(0);
  const [run, setRun] = useState(() => createRun(game));
  const [target, setTarget] = useState(0);
  const [started, setStarted] = useState(false);
  const [wins, setWins] = useState<number[]>([]);
  const [support, setSupport] = useState(false);
  const enemy = run.enemies[target];
  const rows = profiles[game][enemy.id];
  const all = canAll(run);
  const pass = mastered(run);
  useEffect(() => {
    if (pass && !wins.includes(mission)) {
      setWins([...wins, mission]);
      if (mission === 3) onMaster();
    }
  }, [pass, mission]);
  function reset(m: number) {
    setMission(m);
    setRun(createRun(game, m));
    setTarget(0);
    setStarted(false);
    setSupport(false);
  }
  const active = profiles[game][run.active];
  function execute(c: Command) {
    setRun((r) => command(r, c, target));
  }
  return (
    <>
      <div className="module-intro combat-intro">
        <span className="chapter-label">
          ACADEMIA TÁTICA / {games[game].edition}
        </span>
        <h1>Pense antes do próximo turno.</h1>
        <p>
          Leia a intenção, escolha sua defesa e crie oportunidades. Os números
          são calibrados para treino; as afinidades dos modelos vêm da edição
          selecionada.
        </p>
      </div>
      <div className="mission-tabs" aria-label="Encontros de treino">
        {missionTitles.map((title, i) => (
          <button
            key={title}
            onClick={() => reset(i)}
            aria-pressed={mission === i}
            className={mission === i ? "selected" : ""}
          >
            <span>{wins.includes(i) ? "✓" : `0${i + 1}`}</span>
            {title}
          </button>
        ))}
      </div>
      <div className="mission-objective">
        <Target size={23} />
        <div>
          <strong>SEU OBJETIVO · {missionTitles[mission]}</strong>
          <p>{missionGoals[mission]}</p>
        </div>
        <span>
          {mission === 0
            ? "INICIANTE"
            : mission === 3
              ? "AVANÇADO"
              : "INTERMEDIÁRIO"}
        </span>
      </div>
      {!started ? (
        <div className="battle-brief">
          <div>
            <span className="eyebrow">20% TEORIA · A REGRA DESTA MISSÃO</span>
            <h2>
              {
                [
                  "Uma afinidade por alvo.",
                  "Derrubou? Continue pensando.",
                  "O inimigo também tem um plano.",
                  "Dano, defesa e economia juntos.",
                ][mission]
              }
            </h2>
            <p>
              {
                [
                  "Analisar revela fraquezas, resistências e anulações. Trocar a Persona muda seu ataque e sua defesa. A cor do cenário não determina o elemento do inimigo.",
                  "Um alvo derrubado não concede outro 1 More por repetir a mesma fraqueza. Distribua ações. All-Out Attack exige todos os alvos vivos derrubados e pode não finalizar a luta.",
                  "Um ataque preparado causa mais dano. Defender ou reduzir o ataque pode valer mais que atacar. Cura tem custo de ação: não espere estar sem saída.",
                  "Você precisa criar aberturas sem se expor. Use Tarunda cedo, defenda ataques concentrados e procure terminar com uma reserva de HP. Vencer sem cumprir os critérios ainda pede revisão.",
                ][mission]
              }
            </p>
            <div className="battle-checklist">
              <span>1. Analise o alvo</span>
              <span>2. Confira sua Persona</span>
              <span>3. Escolha a ação</span>
              <span>4. Leia o resultado</span>
            </div>
            <button className="primary" onClick={() => setStarted(true)}>
              Começar encontro <Swords size={18} />
            </button>
          </div>
          <Art id={run.enemies[0].id} />
        </div>
      ) : (
        <>
          <div className="tactical-layout">
            <div className="tactical-stage">
              <div className="dungeon-scenery" aria-hidden="true">
                <div className="dungeon-door" />
                <div className="dungeon-floor" />
                {Array.from({ length: 6 }, (_, i) => (
                  <i key={i} style={{ "--i": i } as React.CSSProperties} />
                ))}
                <div className="dungeon-haze" />
              </div>
              <div className="stage-top">
                <span>ARENA DE TREINO · SEM LOCAL DE HISTÓRIA</span>
                <b>ROUND {String(run.round).padStart(2, "0")}</b>
              </div>
              <div className="stage-enemies">
                {run.enemies.map((e, i) => (
                  <button
                    key={e.id}
                    disabled={e.hp === 0 || run.outcome !== "playing"}
                    onClick={() => setTarget(i)}
                    aria-pressed={target === i}
                    aria-label={`Selecionar ${profiles[game][e.id].name}`}
                    className={`combat-enemy ${target === i ? "selected" : ""} ${e.down ? "knocked" : ""} ${e.hp === 0 ? "fainted" : ""}`}
                  >
                    <span className="intent">
                      {e.hp === 0
                        ? "DERROTADO"
                        : e.sleep
                          ? "DORMINDO"
                          : e.down
                            ? "DERRUBADO"
                            : e.charged
                              ? "⚠ ATAQUE FORTE"
                              : "PREPARA ATAQUE"}
                    </span>
                    <div
                      key={`${run.hit === i ? run.serial : 0}`}
                      className={run.hit === i ? "hit-art" : ""}
                    >
                      <Art id={e.id} />
                    </div>
                    <strong>{profiles[game][e.id].name}</strong>
                    <meter
                      min={0}
                      max={e.max}
                      value={e.hp}
                      aria-label={`HP de ${profiles[game][e.id].name}`}
                    />
                    <small>
                      {e.hp} / {e.max} HP
                    </small>
                  </button>
                ))}
              </div>
              <div
                className="battle-announcement"
                key={run.serial}
                aria-hidden="true"
              >
                {run.message.startsWith("WEAK")
                  ? "WEAK!"
                  : run.message.startsWith("TECHNICAL")
                    ? "TECHNICAL!"
                    : run.message.startsWith("ALL-OUT")
                      ? "ALL-OUT ATTACK"
                      : ""}
              </div>
              <div className="combat-player">
                <Art id={run.active} />
                <div>
                  <span>PERSONA EQUIPADA</span>
                  <strong>{active.name}</strong>
                  <small>
                    {active.affinities
                      .filter((a) => a.affinity === "Fraco")
                      .map((a) => `Fraco: ${a.element}`)
                      .join(" · ")}
                  </small>
                </div>
                <div className="combat-resources">
                  <span>
                    <Heart size={15} /> {run.hp}/180 HP
                  </span>
                  <span>
                    <Zap size={15} /> {run.sp}/64 SP
                  </span>
                </div>
              </div>
              <div className="status-strip">
                <span>{run.extra ? "1 MORE DISPONÍVEL" : "AÇÃO NORMAL"}</span>
                <span>
                  Defesa ↑ {run.buff} · Ataque inimigo ↓ {run.debuff}
                </span>
              </div>
            </div>
            <div className="tactical-menu">
              <span className="chapter-label">COMANDO / {rows.name}</span>
              <button
                className="secondary full"
                disabled={enemy.scanned || run.outcome !== "playing"}
                onClick={() => setRun(scan(run, target))}
              >
                <Eye size={17} />
                {enemy.scanned
                  ? "Alvo analisado"
                  : "Analisar este alvo · grátis"}
              </button>
              {enemy.scanned && (
                <div className="affinity-readout">
                  {rows.affinities.map((a) => (
                    <span key={a.element}>
                      <b>{a.element}</b>
                      {a.affinity}
                    </span>
                  ))}
                  <small>
                    Demais afinidades: normal. Modelos de Persona usados como
                    adversários de treino; não são encontros de uma masmorra
                    específica.
                  </small>
                </div>
              )}
              <label className="field persona-select">
                PERSONA ·{" "}
                {run.switched ? "TROCA JÁ USADA" : "1 TROCA POR RODADA"}
                <select
                  aria-label="Persona equipada"
                  value={run.active}
                  disabled={run.switched || run.outcome !== "playing"}
                  onChange={(e) =>
                    setRun(swap(run, e.target.value as PersonaId))
                  }
                >
                  {(
                    ["pixie", "jack-frost", "jack-o-lantern"] as PersonaId[]
                  ).map((id) => (
                    <option key={id} value={id}>
                      {profiles[game][id].name} · {kits[id]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="tactical-commands">
                {(
                  [kits[run.active], "Ataque", "Defender", "Dia"] as Command[]
                ).map((c) => (
                  <button
                    key={c}
                    disabled={
                      run.outcome !== "playing" ||
                      run.sp < skills[c].cost ||
                      (c === "Dia" && run.hp === 180)
                    }
                    title={skills[c].help}
                    onClick={() => execute(c)}
                  >
                    <strong>{c}</strong>
                    <span>
                      {skills[c].cost ? `${skills[c].cost} SP` : "SEM SP"}
                    </span>
                  </button>
                ))}
              </div>
              <button
                className="text-button"
                aria-expanded={support}
                onClick={() => setSupport(!support)}
              >
                {support ? "−" : "+"} Apoio e controle de estado
              </button>
              {support && (
                <div className="tactical-commands support-commands">
                  {(["Tarunda", "Rakukaja", "Dormina"] as Command[]).map(
                    (c) => (
                      <button
                        key={c}
                        disabled={
                          run.outcome !== "playing" || run.sp < skills[c].cost
                        }
                        title={skills[c].help}
                        onClick={() => execute(c)}
                      >
                        <strong>{c}</strong>
                        <span>{skills[c].cost} SP</span>
                      </button>
                    ),
                  )}
                </div>
              )}
              <div className="tactical-finish">
                {game !== "p4g" && (
                  <button
                    className="secondary"
                    disabled={
                      !run.extra || run.passed || run.outcome !== "playing"
                    }
                    onClick={() => execute("Passar")}
                  >
                    {game === "p5r" ? "Baton Pass" : "Shift"} →
                  </button>
                )}
                <button
                  className="primary"
                  disabled={!all || run.outcome !== "playing"}
                  onClick={() => execute("All-Out Attack")}
                >
                  All-Out Attack
                </button>
              </div>
              <p className="tiny">
                Passe o mouse ou leia o guia abaixo para entender as ações.
                Apoio representa habilidades emprestadas pelo grupo, não a ficha
                natural da Persona.
              </p>
            </div>
          </div>
          <div className="coach-feedback" role="status">
            <span className="coach-symbol">!</span>
            <div>
              <strong>O QUE ACONTECEU — E POR QUÊ</strong>
              <p>{run.message}</p>
            </div>
          </div>
          {run.outcome !== "playing" && (
            <div className="assessment">
              <span className="chapter-label">
                REVISÃO / {run.outcome === "won" ? "VITÓRIA" : "DERROTA"}
              </span>
              <h2>
                {pass
                  ? "Você demonstrou a habilidade."
                  : run.outcome === "won"
                    ? "Venceu. Agora refine a decisão."
                    : "Um erro que você pode usar."}
              </h2>
              <p>{missionGoals[mission]}</p>
              <div className="metrics">
                <span>
                  <b>{run.stats.weak}</b>fraquezas
                </span>
                <span>
                  <b>{run.stats.guard}</b>defesas
                </span>
                <span>
                  <b>{run.stats.debuff}</b>Tarunda
                </span>
                <span>
                  <b>{run.stats.spent}</b>SP gastos
                </span>
                <span>
                  <b>{run.stats.mistakes}</b>decisões punidas
                </span>
              </div>
              <p>
                {run.stats.mistakes
                  ? "Revise ataques contra resistência e a fraqueza da Persona equipada. "
                  : ""}
                {!run.stats.guard && mission >= 2
                  ? "Você ainda precisa demonstrar defesa. "
                  : ""}
                {mission === 3 && !run.stats.debuff
                  ? "Use Tarunda para reduzir a pressão por várias respostas. "
                  : ""}
                {mission === 3 && run.hp < 60
                  ? "A vitória consumiu HP demais: cure antes do golpe final."
                  : ""}
              </p>
              <div className="button-row">
                <button className="secondary" onClick={() => reset(mission)}>
                  <RotateCcw size={16} /> Tentar novamente
                </button>
                {mission < 3 && (
                  <button
                    className="primary"
                    onClick={() => reset(mission + 1)}
                  >
                    Próximo desafio <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          )}
          <details className="combat-journal">
            <summary>Rever minhas decisões ({run.log.length})</summary>
            <ol>
              {run.log.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
          </details>
        </>
      )}
      <details className="simulation-contract">
        <summary>Guia das ações e diferenças para o jogo real</summary>
        <div className="action-guide">
          {Object.entries(skills)
            .filter(([k]) => k !== "Passar" || game !== "p4g")
            .map(([k, v]) => (
              <p key={k}>
                <strong>{k}</strong> — {v.help}
              </p>
            ))}
        </div>
        <p>
          Treino determinístico: dano, custo, HP, duração, precisão e resposta
          inimiga são normalizados. Não há críticos aleatórios, itens,
          experiência, troca de equipamento ou controle de quatro personagens.
          Anulação e fraquezas do jogador afetam a defesa; drenar/repelir na
          defesa anulam o dano neste modelo. Dormina é garantida. Royal usa a
          condição de Technical rank 4; não copie essa garantia para o começo do
          jogo. Pass/Shift representam um aliado didático, não um sistema
          completo de grupo. Kits elementais não representam necessariamente
          habilidades iniciais no nível base. Os cenários são ilustrações
          vetoriais de treino inspiradas na direção visual de cada jogo, não
          capturas de masmorras.
        </p>
      </details>
    </>
  );
}
export function SourceLibrary() {
  return (
    <>
      <div className="module-intro">
        <span className="chapter-label">DADOS, CONTEXTO E VERIFICAÇÃO</span>
        <h1>Aprender também é conferir.</h1>
        <p>
          As fichas e receitas da jornada usam a base por edição de aqiu384. O manual do modo livre também lista as fontes de dificuldade e os limites do motor. Buscas de vídeos e discussões são material complementar, não conteúdo auditado.
        </p>
      </div>
      <div className="source-grid">
        {sources.map((s) => (
          <article className="panel" key={s.url}>
            <span className="eyebrow">{s.kind}</span>
            <h2>{s.title}</h2>
            <p>{s.detail}</p>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-button"
            >
              Abrir fonte externa <ExternalLink size={15} />
            </a>
          </article>
        ))}
      </div>
      <div className="mentor-note">
        <Shield size={23} />
        <p>
          Os exercícios não reproduzem falas ou eventos da história. Links
          externos podem mostrar spoilers; abra apenas se quiser sair do
          ambiente protegido.
        </p>
      </div>
    </>
  );
}
