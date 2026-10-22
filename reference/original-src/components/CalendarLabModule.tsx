import React, { useState } from 'react';
import {
  CALENDAR_SCENARIOS,
  FREE_TIME_ACTIONS,
  GAMES,
  GameId,
} from '../data/personaData';
import { Calendar, CheckCircle2, Clock, Sparkles, RotateCcw } from 'lucide-react';

interface CalendarLabModuleProps {
  activeGame: GameId;
  completedFreeActions: string[];
  onToggleFreeAction: (id: string) => void;
}

export const CalendarLabModule: React.FC<CalendarLabModuleProps> = ({
  activeGame,
  completedFreeActions,
  onToggleFreeAction,
}) => {
  const gameConfig = GAMES[activeGame];
  const gameScenarios = CALENDAR_SCENARIOS.filter((s) => s.gameId === activeGame);
  const allScenarios = gameScenarios.length > 0 ? gameScenarios : CALENDAR_SCENARIOS;

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(allScenarios[0].id);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [dungeonVisits, setDungeonVisits] = useState<number>(1);

  const currentScenario =
    allScenarios.find((s) => s.id === selectedScenarioId) || allScenarios[0];

  const selectedOption = currentScenario.options.find((o) => o.id === selectedOptionId);

  const filteredFreeActions = FREE_TIME_ACTIONS.filter(
    (action) => action.gameId === activeGame
  );

  // Calculate opportunity cost across 8 palaces/dungeons
  const totalDungeons = activeGame === 'p5r' ? 8 : activeGame === 'p4g' ? 7 : 6;
  const afternoonSlotsLost = totalDungeons * dungeonVisits;
  const nightSlotsLostWithoutTemperance = totalDungeons * dungeonVisits;
  const extraSocialLinksPossible = Math.max(
    0,
    Math.floor(((totalDungeons * 3 - afternoonSlotsLost) * 2) / 3)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT ZONE (65% -> 8 cols): Interactive Decision Simulator & Free-Time Actions */}
      <div className="lg:col-span-8 space-y-8">
        {/* Interactive Daily Decision Simulator */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-400">
                Laboratório Prático · Treinamento de Tomada de Decisão Autônoma
              </p>
              <h2 className="text-xl font-bold text-white mt-1">
                Simulador de Economia de Turno ({gameConfig.shortTitle})
              </h2>
            </div>

            {allScenarios.length > 1 && (
              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                {allScenarios.map((scen, idx) => (
                  <button
                    key={scen.id}
                    onClick={() => {
                      setSelectedScenarioId(scen.id);
                      setSelectedOptionId(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      currentScenario.id === scen.id
                        ? `${gameConfig.accentBgClass}`
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cenário 0{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scenario Context Bar */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <span className="font-semibold text-white">{currentScenario.title}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-400">
                {currentScenario.dateContext}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Condição Climática / Mundo: <strong className="text-slate-200">{currentScenario.weather}</strong>
            </p>
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-xs font-medium text-slate-300 mb-2">
                Situação atual no seu save:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {currentScenario.activeObjectives.map((obj, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`font-mono ${gameConfig.accentTextClass}`}>0{index + 1}.</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Decision Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-200">
              Qual decisão você toma neste período? (Clique para analisar a mecânica)
            </p>
            <div className="grid grid-cols-1 gap-3">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isSelected
                        ? `${gameConfig.accentBorderClass} ${gameConfig.accentSoftBgClass}`
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">
                        {opt.label}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-slate-400 shrink-0">
                        Custo: {opt.timeCost}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Reveal Box */}
          {selectedOption ? (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-white">
                    Avaliação Tática: {selectedOption.efficiencyRating}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono tabular-nums text-slate-300">
                    Índice de Aproveitamento: {selectedOption.score}/100
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOptionId(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Testar Outra Escolha
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedOption.mechanicalExplanation}
              </p>
              <div className="pt-2 border-t border-slate-900 text-xs text-slate-400">
                <strong className={gameConfig.accentTextClass}>Princípio Dominado: </strong>
                {selectedOption.hiddenRuleLearned}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-4 text-xs text-slate-400">
              Selecione uma das opções acima para ver o cálculo de custo de oportunidade e a regra oculta do calendário.
            </div>
          )}
        </section>

        {/* Zero-Time Actions Checklist */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-400">
                Ações de Custo Zero · Ganhe Pontos sem Avançar o Relógio
              </p>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Rotina de Ações Gratuitas em {gameConfig.shortTitle}
              </h3>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-400">
              Dominadas: {completedFreeActions.length} / { FREE_TIME_ACTIONS.length }
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {filteredFreeActions.map((item) => {
              const isChecked = completedFreeActions.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {item.name}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{item.frequency}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{item.location}</span>
                    </div>
                    <p className={`text-xs font-medium ${gameConfig.accentTextClass}`}>
                      Ganhos: {item.reward}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.strategicNote}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleFreeAction(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isChecked ? 'Hábito Ativo' : 'Marcar Hábito'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* RIGHT ZONE (35% -> 4 cols): Priority Pyramid & 1-Day Dungeon Calculator */}
      <div className="lg:col-span-4 space-y-6">
        {/* Priority Hierarchy Box */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <p className="text-xs text-slate-400">Heurística Universal da Atlus</p>
            <h3 className="text-lg font-bold text-white mt-0.5">
              A Pirâmide de Prioridades Diárias
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Para zerar com 100% pelo seu próprio mérito sem seguir guia dia a dia, basta aplicar este filtro mental toda vez que ganhar o controle do personagem:
          </p>

          <ol className="space-y-4 text-xs">
            <li className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 space-y-1">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>01. Ações que NÃO gastam tempo</span>
                <span className="font-mono tabular-nums text-emerald-400">Custo: 0</span>
              </div>
              <p className="text-slate-400">
                Planta no quarto, Suco de Domingo, Palavras-Cruzadas, Leitura da Chihaya, Santuário ou Poção da Enfermaria (P3R).
              </p>
            </li>

            <li className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 space-y-1">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>02. Social Links com Rank-Up Garantido</span>
                <span className="font-mono tabular-nums text-sky-400">Prioridade Máxima</span>
              </div>
              <p className="text-slate-400">
                Priorize colegas de escola em dias letivos (especialmente em P3R) e Confidants que economizam tempo (Temperance, Fortune, Hermit).
              </p>
            </li>

            <li className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 space-y-1">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>03. Multiplicadores de Clima (Chuva / Neve)</span>
                <span className="font-mono tabular-nums text-amber-400">Bônus +50%</span>
              </div>
              <p className="text-slate-400">
                Está chovendo e nenhum Social Link importante apareceu? Use o Diner na chuva (P5R), o Mega Beef Bowl no Aiya (P4G) ou a Casa de Banhos.
              </p>
            </li>

            <li className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 space-y-1">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>04. Masmorras em Visita Única (1-Day Clear)</span>
                <span className="font-mono tabular-nums text-rose-400">1 Dia / Arco</span>
              </div>
              <p className="text-slate-400">
                Garanta a rota até o Tesouro / Chefe de Andar em uma única incursão para liberar todas as semanas seguintes para vida social.
              </p>
            </li>
          </ol>
        </section>

        {/* Interactive Dungeon Visit Opportunity Cost Calculator */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <p className="text-xs text-slate-400">Calculadora de Custo de Oportunidade</p>
            <h3 className="text-base font-bold text-white mt-0.5">
              Impacto de Visitas aos Palácios / Tartarus
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="visits-slider" className="text-slate-300 font-medium">
                Visitas médias por Palácio/Arco:
              </label>
              <span className="font-mono tabular-nums font-bold text-white">
                {dungeonVisits} {dungeonVisits === 1 ? 'visita (Ideal)' : 'visitas'}
              </span>
            </div>
            <input
              id="visits-slider"
              type="range"
              min={1}
              max={5}
              value={dungeonVisits}
              onChange={(e) => setDungeonVisits(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-500">
              <span>1 Visita (Mestre)</span>
              <span>3 Visitas (Comum)</span>
              <span>5 Visitas (Lento)</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tardes consumidas na campanha:</span>
              <span className="font-mono tabular-nums font-semibold text-white">
                {afternoonSlotsLost} tardes
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Noites travadas (sem Kawakami Max):</span>
              <span className="font-mono tabular-nums font-semibold text-rose-400">
                {nightSlotsLostWithoutTemperance} noites
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">
                Confidants completos de vantagem (vs 3 visitas):
              </span>
              <span className="font-mono tabular-nums font-bold text-emerald-400">
                +{extraSocialLinksPossible} Confidants Max
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
