import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Swords,
  Layers3,
  CalendarDays,
  BookOpen,
  House,
  ShieldCheck,
  Sparkles,
  Check,
  RotateCcw,
  VolumeX,
  Eye,
  Zap,
  Heart,
  Shield,
  ChevronRight,
  Users,
  Star,
} from "lucide-react";
import { games, Game, personas, topics, editionNotes } from "./academy/content";
import profiles from "./academy/profiles.json";
import {
  Trail,
  CombatTrainer,
  PracticalLab,
  SourceLibrary,
} from "./training/Training";
import { SocialTrainer } from "./training/Social";

import {EditionJourney} from "./academy/journey";
import {Reserve, Velvet} from "./academy/Velvet";
import {BattleHub} from "./academy/BattleHub";
import {DayPlanner} from "./academy/Planning";
import {SocialWorkshop} from "./academy/SocialWorkshop";
import "./academy/journey.css";

type Page =
  | "home"
  | "battle"
  | "fusion"
  | "team"
  | "calendar"
  | "learn"
  | "social"
  | "sources";
const nav = [
  { id: "home", name: "Sala de estudos", icon: House },
  { id: "battle", name: "Simulador de batalha", icon: Swords },
  { id: "fusion", name: "Laboratório de fusão", icon: Layers3 },
  { id: "team", name: "Minha equipe", icon: Users },
  { id: "calendar", name: "Como usar meu dia", icon: CalendarDays },
  { id: "social", name: "Treino de vínculos", icon: Heart },
  { id: "learn", name: "Biblioteca de mecânicas", icon: BookOpen },
  { id: "sources", name: "Fontes e aprofundamento", icon: Eye },
];
function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function Art({ id, className = "" }: { id: string; className?: string }) {
  return (
    <img
      className={`persona-art ${className}`}
      src={`${import.meta.env.BASE_URL}personas/${id}.webp`}
      alt={`Arte de ${id.replaceAll("-", " ")}`}
      draggable={false}
    />
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill">{children}</span>;
}
function Intro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="module-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}
export default function App() {
  const [game, setGame] = useState<Game>(() => {
    const v = read<Game>("va-game", "p5r");
    return v in games ? v : "p5r";
  });
  const [page, setPage] = useState<Page>("home");
  const [motion, setMotion] = useState(() => read("va-motion", true));
  const [completed, setCompleted] = useState<string[]>(() => {
    const v = read<unknown>("va-lessons", []);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  });
  const [mastery, setMastery] = useState<string[]>(() => {
    const v = read<unknown>("va-mastery-v2", []);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  });
  function mark(id: string) {
    setMastery((prev) => {
      const k = game + ":" + id;
      if (prev.includes(k)) return prev;
      const n = [...prev, k];
      localStorage.setItem("va-mastery-v2", JSON.stringify(n));
      return n;
    });
  }
  const g = games[game];
  useEffect(() => {
    localStorage.setItem("va-game", JSON.stringify(game));
    localStorage.setItem("va-motion", JSON.stringify(motion));
    localStorage.setItem("va-lessons", JSON.stringify(completed));
  }, [game, motion, completed]);
  function go(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const count = completed.filter((x) => x.startsWith(game + ":")).length;
  const lessonTotal = game === "p2" ? 5 : topics.length;
  return (
    <div
      className={`academy theme-${game} ${motion ? "" : "still"}`}
      style={{ "--accent": g.color } as React.CSSProperties}
    >
      <a className="skip" href="#main">
        Pular para o conteúdo
      </a>
      <div className="ambient" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>
          {game === "p5r"
            ? "★"
            : game === "p3r"
              ? "◯"
              : game === "p4g"
                ? "◎"
                : "✦"}
        </span>
      </div>
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => go("home")}
          aria-label="Velvet Academy início"
        >
          <span className="brand-symbol">
            V<span>✦</span>
          </span>
          <span>
            VELVET<small>ACADEMY</small>
          </span>
        </button>
        <div className="sidebar-rule" />
        <p className="eyebrow">SEU OUTRO EU COMEÇA AQUI</p>
        <nav aria-label="Principal">
          {nav.map((n) => (
            <button
              key={n.id}
              aria-label={n.name}
              title={n.name}
              className={page === n.id ? "active" : ""}
              onClick={() => go(n.id as Page)}
            >
              <n.icon size={18} />
              <span>{n.name}</span>
              {page === n.id && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="safety">
            <ShieldCheck size={22} />
            <div>
              Descubra as regras.
              <br />
              <strong>Preserve as surpresas.</strong>
            </div>
          </div>
          <p>
            Sem história. Sem chefes.
            <br />
            Sem roteiro obrigatório.
          </p>
          <span className="tiny">FAN PROJECT / EST. 2026</span>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            VELVET ROOM <span>/</span> {nav.find((n) => n.id === page)?.name}
          </div>
          <div className="header-options">
            <span className="safe">
              <span /> SEM SPOILERS
            </span>
            <button
              className="motion-toggle"
              aria-pressed={!motion}
              onClick={() => setMotion(!motion)}
              title="Ativar ou pausar animações"
            >
              <Sparkles size={16} />
              <span>{motion ? "Pausar movimento" : "Ativar movimento"}</span>
            </button>
          </div>
        </header>
        <main id="main">
          <div className="edition-bar">
            <span className="eyebrow">ESCOLHA SEU UNIVERSO</span>
            <div className="game-tabs" role="group" aria-label="Jogo e edição">
              {(Object.keys(games) as Game[]).map((k) => (
                <button
                  key={k}
                  aria-pressed={game === k}
                  onClick={() => setGame(k)}
                  className={game === k ? "selected" : ""}
                >
                  <span>{games[k].name}</span>
                  <small>{games[k].edition}</small>
                </button>
              ))}
            </div>
          </div>
          <EditionJourney game={game}><div key={game + page} className="page-enter">
            {page === "home" && (
              <Trail
                game={game}
                done={mastery
                  .filter((x) => x.startsWith(game + ":"))
                  .map((x) => x.split(":")[1])}
                onGo={go}
              />
            )}
            {page === "battle" && (
              <BattleHub game={game} onMaster={() => mark("battle")} onTeam={() => go("team")} />
            )}
            {page === "fusion" && (game === "p2" ? <FusionModule game={game}/> : <><Velvet onTeam={() => go("team")}/><details className="extra-lab"><summary>Exercício complementar de herança</summary><PracticalLab lab="fusion" game={game} onMaster={() => mark("fusion")}/></details></>)}
            {page === "team" && (game === "p2" ? <TeamModule game={game}/> : <><Reserve onFusion={() => go("fusion")}/><details className="extra-lab"><summary>Exercício complementar de cobertura</summary><PracticalLab lab="team" game={game} onMaster={() => mark("team")}/></details></>)}
            {page === "calendar" && (game === "p2" ? <CalendarModule game={game}/> : <><DayPlanner onTeam={() => go("team")} onSocial={() => go("social")}/><details className="extra-lab"><summary>Prova de planejamento</summary><PracticalLab lab="calendar" game={game} onMaster={() => mark("calendar")}/></details></>)}
            {page === "social" && (game === "p2" ? <SocialTrainer game={game} onEdition={setGame} onMaster={() => mark("social")}/> : <SocialWorkshop onMaster={() => mark("social")} onCalendar={() => go("calendar")} onFusion={() => go("fusion")}/>)}
            {page === "sources" && <SourceLibrary />}
            {page === "learn" && (
              <>
                <Intro
                  eyebrow="SEU MANUAL SEM HISTÓRIA"
                  title="Entenda. Depois, experimente."
                  body="Conceitos para tomar suas próprias decisões. Leia a regra da edição antes de aplicar o que aprendeu em outro jogo."
                />
                <div className="notice">
                  <BookOpen size={20} />
                  <div>
                    <strong>
                      As regras de {g.name} {g.edition}
                    </strong>
                    <ul>
                      {editionNotes[game].map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="lesson-grid">
                  {topics
                    .filter((_, i) => game !== "p2" || ![2, 5, 6].includes(i))
                    .map((t) => {
                      const i = topics.indexOf(t);
                      const done = completed.includes(`${game}:${i}`);
                      return (
                        <article className="lesson" key={t.title}>
                          <span className="eyebrow">{t.tag}</span>
                          <h3>{t.title}</h3>
                          <p>{t.text}</p>
                          <div className="practice">
                            <Sparkles size={17} />
                            {t.practice}
                          </div>
                          <button
                            className={
                              done ? "checked text-button" : "text-button"
                            }
                            onClick={() =>
                              setCompleted(
                                done
                                  ? completed.filter(
                                      (x) => x !== `${game}:${i}`,
                                    )
                                  : [...completed, `${game}:${i}`],
                              )
                            }
                          >
                            {done ? (
                              <Check size={18} />
                            ) : (
                              <BookOpen size={18} />
                            )}{" "}
                            {done
                              ? "Conceito estudado"
                              : "Marcar como estudado"}
                          </button>
                        </article>
                      );
                    })}
                </div>
              </>
            )}
          </div>
          </EditionJourney>
          <footer>
            <span>
              VELVET ACADEMY <span className="footer-cross">✦</span> APRENDER
              TAMBÉM É JOGAR.
            </span>
            <span>
              Projeto de fã · Artes © ATLUS / SEGA ·{" "}
              <a href={`${import.meta.env.BASE_URL}ART-CREDITS.md`} target="_blank" rel="noreferrer">
                Créditos e fontes ↗
              </a>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
function Rules({ game }: { game: Game }) {
  return (
    <div className="notice">
      <ShieldCheck size={22} />
      <div>
        <strong>Não leve uma regra para o jogo errado.</strong>
        <p>{editionNotes[game][0]}</p>
        <p>
          Este módulo pratica apenas as ações disponíveis acima.{" "}
          {game === "p5r"
            ? "Baton Pass, Technical e negociação são explicados na biblioteca, mas não simulados aqui."
            : game === "p3r"
              ? "Shift e Theurgy são explicados na biblioteca, mas não simulados aqui."
              : game === "p4g"
                ? "Shuffle Time não está simulado neste treino."
                : "Valores e receitas específicos de IS e EP não estão simulados."}
        </p>
      </div>
    </div>
  );
}
function FusionModule({ game }: { game: Game }) {
  const [role, setRole] = useState("Equilíbrio");
  const [skills, setSkills] = useState<string[]>([]);
  const [evaluated, setEvaluated] = useState(false);
  const choices = [
    "Cura",
    "Fogo",
    "Gelo",
    "Eletricidade",
    "Buff de defesa",
    "Debuff de ataque",
  ];
  if (game === "p2")
    return (
      <>
        <Intro
          eyebrow="LAB 02 / INVOCAÇÃO"
          title="Cartas. Afinidade. Possibilidades."
          body="Em Persona 2, não funda duas Personas como em P3–P5. Use cartas de Tarot e os requisitos da invocação na Velvet Room."
        />
        <div className="study-grid">
          {[
            [
              "01",
              "Faça contato",
              "Reações dos demônios dependem do contato e da situação. Aprenda a obter cartas, em vez de atacar automaticamente.",
            ],
            [
              "02",
              "Confira a invocação",
              "Compare Arcana, cartas necessárias, nível e condições especiais. IS e EP não compartilham todas as receitas.",
            ],
            [
              "03",
              "Escolha quem equipa",
              "A compatibilidade com o personagem e as habilidades disponíveis importam para custo e combinações.",
            ],
          ].map(([n, t, p]) => (
            <article className="panel" key={n}>
              <span className="eyebrow">{n}</span>
              <h2>{t}</h2>
              <p>{p}</p>
            </article>
          ))}
        </div>
        <Rules game={game} />
      </>
    );
  return (
    <>
      <Intro
        eyebrow="LAB 02 / ENGENHARIA DE PERSONAS"
        title="Não funda no escuro."
        body="Treine a decisão de herança antes de gastar recursos. Este é um laboratório de funções, não uma calculadora de receitas ou de habilidades legalmente herdáveis."
      />
      <div className="fusion-layout">
        <div className="fusion-visual">
          <span className="eyebrow">O QUE VOCÊ QUER CONSTRUIR?</span>
          <Art id="jack-frost" />
          <span className="fusion-ring" />
          <h2>
            Uma função.
            <br />
            <em>Várias possibilidades.</em>
          </h2>
          <p>
            A arte é ilustrativa. A herança real depende do resultado, da edição
            e das restrições da habilidade.
          </p>
        </div>
        <div className="panel">
          <label className="field">
            1. Defina a função
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setEvaluated(false);
              }}
            >
              {["Equilíbrio", "Suporte", "Cobertura elemental"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <h3>2. Escolha até três prioridades</h3>
          <div className="skill-options">
            {choices.map((x) => (
              <button
                aria-pressed={skills.includes(x)}
                className={skills.includes(x) ? "chosen" : ""}
                key={x}
                disabled={!skills.includes(x) && skills.length === 3}
                onClick={() => {
                  setSkills(
                    skills.includes(x)
                      ? skills.filter((s) => s !== x)
                      : [...skills, x],
                  );
                  setEvaluated(false);
                }}
              >
                {skills.includes(x) ? <Check size={16} /> : <span>+</span>}
                {x}
              </button>
            ))}
          </div>
          <p className="tiny">
            {skills.length} / 3 prioridades · limite do exercício, não do jogo
          </p>
          <button
            className="primary"
            disabled={skills.length === 0}
            onClick={() => setEvaluated(true)}
          >
            Avaliar minha escolha <ArrowRight size={18} />
          </button>
          {evaluated && (
            <div className="result" role="status">
              <h3>
                {role === "Suporte" && skills.includes("Cura")
                  ? "Uma base de suporte útil."
                  : role === "Cobertura elemental" &&
                      skills.filter((s) =>
                        ["Fogo", "Gelo", "Eletricidade"].includes(s),
                      ).length >= 2
                    ? "Sua cobertura está crescendo."
                    : "Pense no que sua equipe já tem."}
              </h3>
              <p>
                {skills.includes("Cura")
                  ? "Você preservou uma opção de recuperação."
                  : "Sem cura nesta seleção: garanta recuperação em outra Persona, aliado ou item."}{" "}
                {skills.some((s) => s.includes("Buff") || s.includes("Debuff"))
                  ? "Suporte pode render ao longo de vários turnos."
                  : "Considere suporte quando o grupo já cobre os elementos."}
              </p>
              <p>
                Antes de confirmar no jogo: registre os materiais, confira nível
                exigido, custo para recuperá-los, prévia do resultado e herança
                permitida.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="notice">
        <Layers3 size={22} />
        <div>
          <strong>Como a fusão funciona nos jogos modernos?</strong>
          <p>
            A combinação de Arcanas e níveis base orienta fusões normais; a
            tabela muda entre edições. Fusões especiais têm receitas próprias.
            Bônus de vínculo alteram a experiência recebida, não substituem a
            conferência do resultado. DLC pode mudar os resultados de uma
            calculadora.
          </p>
          <a
            href="https://aqiu384.github.io/megaten-fusion-tool/"
            target="_blank"
            rel="noreferrer"
          >
            Consultar calculadora por edição (site externo, pode revelar
            Personas) ↗
          </a>
        </div>
      </div>
    </>
  );
}
function TeamModule({ game }: { game: Game }) {
  const key = "va-team-" + game;
  const [team, setTeam] = useState<string[]>(() => {
    const v = read<unknown>(key, []);
    return Array.isArray(v)
      ? v.filter((x) => personas.some((p) => p.id === x))
      : [];
  });
  const [detail, setDetail] = useState<string | null>(null);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(team));
  }, [team, key]);
  const catalog: Record<string, typeof profiles.p5r.pixie> | null =
    game === "p2" ? null : profiles[game];
  const covered = personas
    .filter((p) => team.includes(p.id))
    .flatMap((p) => (catalog ? catalog[p.id].coverage : p.elements));
  return (
    <>
      <Intro
        eyebrow="LAB 03 / COBERTURA E PAPÉIS"
        title="Uma equipe com propósito."
        body="Selecione até três Personas para comparar funções. Nos jogos modernos, os dados abaixo são da edição selecionada e a cobertura considera apenas habilidades iniciais. Em P2, as cartas mostram apenas arquétipos ilustrativos."
      />
      <div className="team-summary">
        <div>
          <span className="eyebrow">SEU GRUPO DE ESTUDO</span>
          <h2>
            {team.length} / 3 <small>papéis escolhidos</small>
          </h2>
        </div>
        <div className="coverage">
          {["Fogo", "Gelo", "Eletricidade", "Vento", "Cura", "Suporte"].map(
            (e) => (
              <span className={covered.includes(e) ? "covered" : ""} key={e}>
                {covered.includes(e) ? "✓" : "○"} {e}
              </span>
            ),
          )}
        </div>
      </div>
      <div className="persona-grid">
        {personas.map((p) => (
          <article
            className={`persona-card ${team.includes(p.id) ? "in-team" : ""}`}
            key={p.id}
          >
            <div className="persona-art-box">
              <span className="persona-index">
                {String(personas.indexOf(p) + 1).padStart(2, "0")}
              </span>
              <Art id={p.id} />
              <span className="persona-role">{p.role}</span>
            </div>
            <div className="persona-card-copy">
              <h2>{catalog ? catalog[p.id].name : p.name}</h2>
              <p>
                {catalog
                  ? `Lv. ${catalog[p.id].level} · ${catalog[p.id].arcana}`
                  : p.skills.join(" · ")}
              </p>
              <button
                className="secondary full"
                aria-pressed={team.includes(p.id)}
                disabled={!team.includes(p.id) && team.length === 3}
                onClick={() =>
                  setTeam(
                    team.includes(p.id)
                      ? team.filter((x) => x !== p.id)
                      : [...team, p.id],
                  )
                }
              >
                {team.includes(p.id) ? (
                  <>
                    <Check size={16} /> No grupo · remover
                  </>
                ) : (
                  <>+ Adicionar ao grupo</>
                )}
              </button>
              <button
                className="text-button"
                aria-expanded={detail === p.id}
                onClick={() => setDetail(detail === p.id ? null : p.id)}
              >
                Quando vale a pena? <ChevronRight size={16} />
              </button>
              {detail === p.id && (
                <div className="persona-tip">
                  <p>{p.tip}</p>
                  {catalog && (
                    <>
                      <h4>Afinidades</h4>
                      {catalog[p.id].affinities.map((a) => (
                        <p key={a.element}>
                          {a.element}: {a.affinity}
                        </p>
                      ))}
                      <h4>Habilidades e aprendizado</h4>
                      {catalog[p.id].skills.map((a) => (
                        <p key={a.name}>
                          {a.name}{" "}
                          <span>
                            · {a.initial ? "inicial" : `nível ${a.level}`}
                          </span>
                        </p>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="notice">
        <Users size={22} />
        <div>
          <strong>
            {team.length === 0
              ? "Comece pela lacuna que quer resolver."
              : covered.length < 3
                ? "Sua cobertura ainda é limitada."
                : "Você já tem papéis diferentes."}
          </strong>
          <p>
            {covered.includes("Cura")
              ? "Há uma opção de cura inicial no grupo."
              : "Pense em quem vai curar: Persona, aliado ou item."}{" "}
            Estes indicadores não são a lista completa de elementos do jogo. Não
            esqueça suporte, dano físico e defesa contra as fraquezas da equipe.
          </p>
          <p>
            {game === "p2"
              ? "Em P2, confira também qual personagem tem compatibilidade com cada Persona."
              : "Nos jogos modernos, isto representa a reserva do protagonista; os companheiros têm suas próprias Personas."}
          </p>
        </div>
      </div>
    </>
  );
}
function CalendarModule({ game }: { game: Game }) {
  const [deadline, setDeadline] = useState("folgado");
  const [energy, setEnergy] = useState("boa");
  const [available, setAvailable] = useState(true);
  const [weather, setWeather] = useState("sol");
  const [slot, setSlot] = useState("Tarde");
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const p2 = game === "p2";
  const night = slot === "Noite";
  const recommend =
    deadline === "curto" && energy === "boa"
      ? "Explorar"
      : energy === "baixa"
        ? "Preparar recursos"
        : available && !night
          ? "Encontrar vínculo"
          : "Treinar atributo";
  function choose(action: string) {
    let text = "";
    if (action === "Explorar")
      text =
        energy === "baixa"
          ? "Entrar sem recursos aumenta o risco de voltar cedo. Prepare cura e SP antes de insistir."
          : deadline === "curto"
            ? "O prazo está próximo e você tem recursos: avançar reduz a pressão dos próximos dias."
            : "Explorar agora cria margem para outros dias, mas ocupa uma oportunidade de atividade social.";
    else if (action === "Encontrar vínculo")
      text =
        "Você aproveitou uma disponibilidade. Confira se há chance de rank, requisitos e uma Persona da Arcana adequada; o encontro pode dar pontos sem subir rank.";
    else if (action === "Treinar atributo")
      text =
        weather === "chuva"
          ? "Algumas atividades recebem bônus com chuva. Confira a atividade e a edição; não existe bônus universal."
          : "Atributos podem desbloquear opções futuras. Escolha um requisito concreto para evitar treinar sem objetivo.";
    else
      text =
        "Preparação não é tempo perdido. Repor recursos ajuda a explorar com menos interrupções. O custo de tempo depende da atividade real.";
    setResult(text);
    setHistory([...history, `${slot}: ${action}`]);
    setSlot(night ? "Tarde" : "Noite");
  }
  if (p2)
    return (
      <>
        <Intro
          eyebrow="DECISÕES EM PERSONA 2"
          title="Sem calendário. Com intenção."
          body="Não existe a escolha diária entre Social Link e dungeon em IS/EP. Treine a preparação de uma incursão, sem inventar um sistema de dias."
        />
        <div className="panel">
          <h2>Seu grupo está gastando recursos rápido.</h2>
          <p>O que vale conferir antes de continuar?</p>
          <div className="button-row">
            {[
              "Compatibilidade e custo de SP",
              "Ordem das habilidades",
              "Apenas o maior nível",
            ].map((x, i) => (
              <button
                key={x}
                className="secondary"
                onClick={() =>
                  setResult(
                    i === 2
                      ? "Nível ajuda, mas sozinho não resolve custo, compatibilidade ou combinações."
                      : "Boa investigação: compare a Persona equipada, o custo e as habilidades antes de retomar. Verifique os detalhes na sua edição.",
                  )
                }
              >
                {x}
              </button>
            ))}
          </div>
          <p className="result" role="status">
            {result || "Escolha uma hipótese para ver o raciocínio."}
          </p>
        </div>
      </>
    );
  return (
    <>
      <Intro
        eyebrow="LAB 04 / DECISÕES DO DIA"
        title="Seu tempo. Suas prioridades."
        body="Cenário livre, sem datas da história. Ajuste a situação e pratique duas decisões. O avanço de tarde/noite é didático; disponibilidade e custos reais dependem da edição."
      />
      <div className="calendar-layout">
        <div className="day-card">
          <span className="eyebrow">DIA DE TREINO</span>
          <strong className="day-number">
            0{Math.floor(history.length / 2) + 1}
          </strong>
          <h2>{slot}</h2>
          <span className="weather">
            {weather === "chuva" ? "☂ CHUVA" : "☀ TEMPO ABERTO"}
          </span>
          <div className="day-divider" />
          <p>
            {game === "p3r"
              ? "Em Reload, exploração noturna e atividades da tarde não disputam o mesmo horário."
              : "Olhe o prazo antes de escolher uma atividade."}
          </p>
          <span className="tiny">SEM DATA REAL · SEM EVENTOS DE HISTÓRIA</span>
        </div>
        <div className="panel">
          <div className="fields">
            <label className="field">
              Prazo da exploração
              <select
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              >
                <option value="folgado">Tenho margem</option>
                <option value="curto">Está próximo</option>
              </select>
            </label>
            <label className="field">
              Recursos para explorar
              <select
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
              >
                <option value="boa">HP, SP e itens preparados</option>
                <option value="baixa">Poucos recursos</option>
              </select>
            </label>
            <label className="field">
              Clima
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
              >
                <option value="sol">Tempo aberto</option>
                <option value="chuva">Chuva</option>
              </select>
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />{" "}
              Vínculo disponível nesta tarde
            </label>
          </div>
          <div className="recommendation">
            <Sparkles size={19} />
            <p>
              <strong>Uma prioridade possível</strong>
              <br />
              {game === "p3r" && !night && recommend === "Explorar"
                ? "Preserve a tarde para um vínculo ou atributo; prepare a exploração noturna."
                : recommend}
              . Não é uma obrigação: seu objetivo pode mudar a escolha.
            </p>
          </div>
          <div className="decision-grid">
            {[
              "Explorar",
              "Encontrar vínculo",
              "Treinar atributo",
              "Preparar recursos",
            ].map((a, i) => (
              <button
                className="secondary"
                key={a}
                disabled={
                  history.length >= 2 ||
                  (a === "Encontrar vínculo" && (!available || night)) ||
                  (a === "Explorar" && (game === "p3r" ? !night : night))
                }
                onClick={() => choose(a)}
              >
                <span>0{i + 1}</span>
                {a}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
          <p className="tiny">
            Opções desativadas representam este cenário de treino; não são uma
            tabela completa de disponibilidade.
          </p>
        </div>
      </div>
      {result && (
        <div className="result" role="status">
          <h3>O que sua escolha ensina</h3>
          <p>{result}</p>
        </div>
      )}
      <div className="panel">
        <div className="section-heading">
          <h3>Seu registro do dia</h3>
          <button
            className="text-button"
            onClick={() => {
              setHistory([]);
              setSlot("Tarde");
              setResult("");
            }}
          >
            <RotateCcw size={15} /> Reiniciar cenário
          </button>
        </div>
        {history.length ? (
          history.map((h, i) => <p key={i}>✓ {h}</p>)
        ) : (
          <p>Faça uma escolha para registrar seu raciocínio.</p>
        )}
        {history.length === 2 && (
          <p>
            Dia concluído. Mude as condições e reinicie para comparar outras
            escolhas.
          </p>
        )}
      </div>
    </>
  );
}
