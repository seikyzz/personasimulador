import React, { useState } from "react";
import { ArrowRight, RotateCcw, Heart, Check } from "lucide-react";
import type { Game } from "../academy/content";
import { PracticalLab } from "./Training";
const characters = {
  chie: {
    name: "Chie",
    game: "p4g" as Game,
    arcana: "Chariot",
    image: "chie",
    happy: "chie",
    subject: "treino",
    line: "Quero melhorar no treino, mas fico pensando se estou realmente progredindo.",
    reply:
      "Você pode observar o que já consegue fazer e escolher uma coisa para treinar hoje.",
  },
  yukiko: {
    name: "Yukiko",
    game: "p4g" as Game,
    arcana: "Priestess",
    image: "yukiko",
    happy: "yukiko-happy",
    subject: "decisões",
    line: "Às vezes há tantas coisas para fazer que fica difícil escolher por onde começar.",
    reply:
      "Qual dessas coisas é mais importante para você agora? Podemos pensar numa de cada vez.",
  },
  aigis: {
    name: "Aigis",
    game: "p3r" as Game,
    arcana: "Aeon",
    image: "aigis",
    happy: "aigis-happy",
    subject: "aprendizado",
    line: "Se uma tentativa não dá certo, como posso saber se aprendi algo?",
    reply:
      "Podemos comparar o que aconteceu com o que você esperava e tentar de outra forma.",
  },
};
type Character = keyof typeof characters;
export function SocialTrainer({
  game,
  onEdition,
  onMaster,
}: {
  game: Game;
  onEdition: (g: Game) => void;
  onMaster: () => void;
}) {
  const [selected, setSelected] = useState<Character>(() => {
    try {
      const id = sessionStorage.getItem("va-social-character") as Character;
      if (id in characters && characters[id].game === game) return id;
    } catch {}
    return game === "p3r" ? "aigis" : "chie";
  });
  const [stage, setStage] = useState(-1);
  const [answer, setAnswer] = useState<number | null>(null);
  const [errors, setErrors] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  if (game === "p2")
    return (
      <>
        <div className="module-intro">
          <h1>Contatos, não Social Links.</h1>
          <p>
            Persona 2 tem seu próprio sistema. Não transforme afinidade social
            dos jogos modernos em regras de negociação.
          </p>
        </div>
        <PracticalLab lab="classic" game={game} onMaster={onMaster} />
      </>
    );
  const c = characters[selected];
  const scenes = [
    {
      title: "Antes do encontro",
      line: `Você quer estudar vínculos em ${c.game === "p4g" ? "Golden" : "Reload"}. O que deve verificar antes de gastar um período?`,
      choices: [
        "Conferir disponibilidade, requisitos e se bônus de Arcana se aplicam ao encontro.",
        "Assumir que qualquer encontro sobe um rank.",
        "Escolher sempre o personagem com maior nível de combate.",
      ],
      correct: 0,
      feedback: [
        "Você separou condições de acesso, afinidade e progressão. Nem todo vínculo usa as mesmas condições; este cenário não reproduz o calendário de um personagem.",
        "Afinidade e rank são coisas diferentes. Alguns avanços dependem de condições específicas.",
        "Nível de combate não determina o melhor uso do período social.",
      ],
    },
    {
      title: "Escute antes de responder",
      line: c.line,
      choices: [
        "Isso não importa. Só quero ganhar pontos.",
        c.reply,
        "Vou decidir tudo por você.",
      ],
      correct: 1,
      feedback: [
        "O exercício pede compreender o que foi dito. Não é uma tabela de respostas do jogo.",
        "Você respondeu ao contexto e abriu espaço para a outra pessoa. Este é um acerto de interpretação, não uma promessa de pontos numa cena real.",
        "Decidir pela pessoa não mostra que você entendeu o que ela está expressando.",
      ],
    },
    {
      title: "Depois da conversa",
      line: "No exemplo, houve ganho de afinidade, mas o jogo não indica avanço de rank. Como interpretar?",
      choices: [
        "O jogo não registrou nada: encontros sem rank são inúteis.",
        "Afinidade e rank são sempre o mesmo número.",
        "O encontro pode ter preparado progresso, mas é preciso conferir a condição do próximo avanço.",
      ],
      correct: 2,
      feedback: [
        "Pontos de afinidade podem contribuir para um encontro posterior. O resultado depende do vínculo.",
        "Não confunda pontos com rank. Um indicador de progresso não implica outro.",
        "Correto. O princípio é ler o que o jogo informa e não extrapolar para todo personagem ou edição.",
      ],
    },
    {
      title: "Seu próximo período",
      line: "Há um requisito de atributo bloqueando outro vínculo, e nenhuma exploração urgente. Você tem uma atividade que melhora esse atributo.",
      choices: [
        "Usar a atividade para preparar o requisito, após conferir o custo de tempo.",
        "Repetir encontros indiscriminadamente até ignorar o requisito.",
        "Subir nível em combate para resolver o atributo social.",
      ],
      correct: 0,
      feedback: [
        "Você conectou rotina e progressão. Cinema, estudo e outras atividades têm efeitos próprios; confira os da edição.",
        "Pontos de afinidade não removem qualquer requisito de atributo ou calendário.",
        "Nível de combate e atributos sociais são sistemas diferentes.",
      ],
    },
  ];
  const scene = scenes[Math.max(0, stage)];
  const correct = answer === scene.correct;
  function choose(i: number) {
    if (correct) return;
    setAnswer(i);
    if (i !== scene.correct && !errors.includes(stage))
      setErrors([...errors, stage]);
  }
  function next() {
    if (stage === 3) {
      setFinished(true);
      if (errors.length <= 1) onMaster();
    } else {
      setStage(stage + 1);
      setAnswer(null);
    }
  }
  function reset() {
    setStage(-1);
    setAnswer(null);
    setErrors([]);
    setFinished(false);
  }
  return (
    <>
      <div className="module-intro">
        <span className="chapter-label">
          VÍNCULOS / ESCUTA · PREPARAÇÃO · TEMPO
        </span>
        <h1>Uma conversa também é uma escolha.</h1>
        <p>
          Cenas originais de treino, sem falas ou eventos da história. As
          expressões são retratos oficiais animados pela interface; os pontos e
          requisitos reais de cada personagem não são reproduzidos.
        </p>
      </div>
      <div className="social-cast">
        {Object.entries(characters).map(([id, char]) => (
          <button
            key={id}
            className={selected === id ? "selected" : ""}
            onClick={() => {
              if (char.game !== game) {
                sessionStorage.setItem("va-social-character", id);
                onEdition(char.game);
              } else {
                setSelected(id as Character);
                reset();
              }
            }}
          >
            <img src={`${import.meta.env.BASE_URL}characters/${char.image}.png`} alt={char.name} />
            <span>
              {char.name}
              <small>
                {char.game === "p4g"
                  ? "P4 GOLDEN"
                  : "P3 RELOAD · RETRATO CLÁSSICO"}
              </small>
            </span>
          </button>
        ))}
      </div>
      {game === "p5r" ? (
        <>
          <p className="mentor-note">
            Royal tem uma prova de decisões de Confidants abaixo. As conversas
            com retratos estão disponíveis em Golden e Reload; selecionar um
            personagem muda a edição.
          </p>
          <PracticalLab lab="social" game={game} onMaster={onMaster} />
        </>
      ) : (
        <>
          {stage === -1 ? (
            <div className="briefing">
              <span className="briefing-number">
                01<span>REGRA</span>
              </span>
              <div>
                <h3>Não decore uma resposta. Leia a situação.</h3>
                <p>
                  Você fará quatro decisões: preparar o encontro, interpretar a
                  fala, distinguir afinidade de rank e escolher o próximo
                  período. Aprovação: três acertos iniciais. Não usamos a
                  fórmula de pontos nem a sequência real do vínculo de {c.name}.
                </p>
                <button className="primary" onClick={() => setStage(0)}>
                  Iniciar conversa de treino <ArrowRight size={17} />
                </button>
              </div>
            </div>
          ) : finished ? (
            <div className="assessment" role="status">
              <span className="chapter-label">CONVERSA CONCLUÍDA</span>
              <h2>
                {errors.length <= 1
                  ? "Você interpretou o contexto."
                  : "Revise antes de repetir."}
              </h2>
              <p>
                {4 - errors.length}/4 decisões corretas na primeira tentativa.
                Nenhum rank real foi simulado.
              </p>
              {errors.map((i) => (
                <p key={i}>
                  <strong>{scenes[i].title}:</strong>{" "}
                  {scenes[i].feedback[scenes[i].correct]}
                </p>
              ))}
              <button className="secondary" onClick={reset}>
                <RotateCcw size={16} /> Novo ensaio
              </button>
            </div>
          ) : (
            <div className="social-scene">
              <div className="social-set" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <img
                key={correct ? "happy" : "neutral"}
                className="social-portrait"
                src={`${import.meta.env.BASE_URL}characters/${correct ? c.happy : c.image}.png`}
                alt={`${c.name} — retrato ilustrativo`}
              />
              <div className="social-label">
                <span>ENCONTRO FICTÍCIO</span>
                <strong>{c.name}</strong>
                <small>
                  {c.arcana} · ESTUDO DE {c.subject.toUpperCase()}
                </small>
              </div>
              <div className="dialogue-box">
                <div className="dialogue-heading">
                  <span>{scene.title}</span>
                  <span>DECISÃO {stage + 1}/4</span>
                </div>
                <p className="dialogue-text">{scene.line}</p>
                <div className="dialogue-choices">
                  {scene.choices.map((text, i) => (
                    <button
                      key={text}
                      className={
                        answer === i ? (correct ? "correct" : "incorrect") : ""
                      }
                      disabled={correct}
                      onClick={() => choose(i)}
                    >
                      <span>{i + 1}</span>
                      {text}
                    </button>
                  ))}
                </div>
                {answer !== null && (
                  <div className="dialogue-feedback" role="status">
                    <strong>
                      {correct
                        ? "Leitura consistente."
                        : "Vamos pensar de novo."}
                    </strong>
                    <p>{scene.feedback[answer]}</p>
                    {correct && (
                      <button className="primary" onClick={next}>
                        {stage === 3 ? "Ver revisão" : "Continuar"}{" "}
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      <div className="mentor-note">
        <Heart size={22} />
        <p>
          Não há “resposta certa” universal para relações. Aqui, a correção
          avalia a regra ou o contexto explícito do exercício. Ela não é um guia
          de respostas para maximizar o vínculo no jogo.
        </p>
      </div>
    </>
  );
}
