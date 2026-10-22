import React, { useState } from 'react';
import {
  ARCANA_ARCHETYPES,
  GAMES,
  GameId,
  SOCIAL_STATS_DATA,
} from '../data/personaData';
import { Search, Plus, Minus, Calculator, Award } from 'lucide-react';

interface SocialLinksAcademyModuleProps {
  activeGame: GameId;
  arcanaRanks: Record<string, number>;
  onUpdateArcanaRank: (key: string, delta: number) => void;
}

export const SocialLinksAcademyModule: React.FC<SocialLinksAcademyModuleProps> = ({
  activeGame,
  arcanaRanks,
  onUpdateArcanaRank,
}) => {
  const gameConfig = GAMES[activeGame];

  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hidden Affinity Calculator states
  const [baseNotes, setBaseNotes] = useState<1 | 2 | 3>(2);
  const [hasMatchingPersona, setHasMatchingPersona] = useState<boolean>(true);
  const [examRankBonus, setExamRankBonus] = useState<'none' | 'top10' | 'top1'>('top10');
  const [hasFortuneBoost, setHasFortuneBoost] = useState<boolean>(false);

  const filteredArcanas = ARCANA_ARCHETYPES.filter((arc) => {
    const matchesPriority =
      priorityFilter === 'ALL' || arc.calendarPriority === priorityFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      arc.name.toLowerCase().includes(query) ||
      arc.portugueseName.toLowerCase().includes(query) ||
      arc.examplesByGame[activeGame].toLowerCase().includes(query) ||
      arc.psychologicalProfile.toLowerCase().includes(query);
    return matchesPriority && matchesSearch;
  });

  const gameSocialStats = SOCIAL_STATS_DATA.filter((s) => s.gameId === activeGame);
  const displaySocialStats =
    gameSocialStats.length > 0 ? gameSocialStats : SOCIAL_STATS_DATA.slice(0, 3);

  const [selectedStatId, setSelectedStatId] = useState<string>(displaySocialStats[0].id);
  const activeStat =
    displaySocialStats.find((s) => s.id === selectedStatId) || displaySocialStats[0];

  // Calculate hidden affinity points (Atlus internal points formula)
  // Base: 1 note = 10 pts (P3R/P4G) or 2 internal points; we express in standardized Atlus Affinity Points (15/20/30 base)
  const rawBasePoints = baseNotes === 1 ? 10 : baseNotes === 2 ? 15 : 22;
  const personaMult = hasMatchingPersona ? 1.51 : 1.0;
  const examMult = examRankBonus === 'top1' ? 1.51 : examRankBonus === 'top10' ? 1.2 : 1.0;
  const fortuneBonusPts = hasFortuneBoost ? 10 : 0;
  const totalCalculatedPoints = Math.floor(rawBasePoints * personaMult * examMult) + fortuneBonusPts;
  const pointsWithoutMultipliers = rawBasePoints;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT ZONE (65% -> 8 cols): Arcana Psychological Decoder & Social Stats Thresholds */}
      <div className="lg:col-span-8 space-y-8">
        {/* Arcana Psychological Decoder */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-400">
                Engenharia Comportamental · Acerte Respostas Sem Colar de Guias
              </p>
              <h2 className="text-xl font-bold text-white mt-1">
                Decodificador Psicológico de Arcanas ({gameConfig.shortTitle})
              </h2>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => setPriorityFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  priorityFilter === 'ALL'
                    ? gameConfig.accentBgClass
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({ARCANA_ARCHETYPES.length})
              </button>
              <button
                onClick={() => setPriorityFilter('Crítica (Economiza Tempo)')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  priorityFilter === 'Crítica (Economiza Tempo)'
                    ? gameConfig.accentBgClass
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Prioridade Crítica
              </button>
              <button
                onClick={() => setPriorityFilter('Alta (Combate & Grupo)')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  priorityFilter === 'Alta (Combate & Grupo)'
                    ? gameConfig.accentBgClass
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Grupo & Combate
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por Arcana (ex: Temperance, Chariot) ou Personagem (ex: Kawakami, Ryuji, Mitsuru)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
            />
          </div>

          {/* Arcana List */}
          <div className="divide-y divide-slate-800/80">
            {filteredArcanas.map((arc) => {
              const rankKey = `${activeGame}-${arc.name}`;
              const currentRank = arcanaRanks[rankKey] ?? 0;

              return (
                <div key={arc.name} className="py-5 first:pt-0 last:pb-0 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono tabular-nums font-semibold text-slate-300">
                          Arcana {arc.arcanaNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className={gameConfig.accentTextClass}>
                          {arc.calendarPriority}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {arc.name} — {arc.portugueseName}
                      </h3>
                    </div>

                    {/* Interactive Personal Rank Counter */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-slate-400">Seu Rank:</span>
                      <button
                        onClick={() => onUpdateArcanaRank(rankKey, -1)}
                        disabled={currentRank <= 0}
                        aria-label="Diminuir Rank"
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono tabular-nums text-xs font-bold text-white min-w-[3.2rem] text-center">
                        {currentRank === 10 ? 'MAX (10)' : `${currentRank} / 10`}
                      </span>
                      <button
                        onClick={() => onUpdateArcanaRank(rankKey, 1)}
                        disabled={currentRank >= 10}
                        aria-label="Aumentar Rank"
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong className="text-white">No jogo selecionado ({gameConfig.shortTitle}): </strong>
                    {arc.examplesByGame[activeGame]}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 text-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block mb-1">
                        Arquétipo Psicológico:
                      </span>
                      <p className="text-slate-400 leading-relaxed">
                        {arc.psychologicalProfile}
                      </p>
                    </div>
                    <div>
                      <span className={`font-semibold ${gameConfig.accentTextClass} block mb-1`}>
                        Como Acertar os Diálogos pelo Seu Mérito:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {arc.howToAnswerWithoutGuide}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Social Stats Thresholds & Efficiency Map */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-400">
                Matemática dos Atributos Sociais · Pontos Invisíveis por Nível
              </p>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Engenharia de Status Sociais
              </h3>
            </div>

            {displaySocialStats.length > 1 && (
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                {displaySocialStats.map((stat) => (
                  <button
                    key={stat.id}
                    onClick={() => setSelectedStatId(stat.id)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      activeStat.id === stat.id
                        ? gameConfig.accentBgClass
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {stat.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <h4 className="text-base font-bold text-white">{activeStat.name}</h4>

            {/* Ranks Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="py-2.5 px-4 font-semibold">Nível (Rank)</th>
                    <th className="py-2.5 px-4 font-semibold">Título do Atributo</th>
                    <th className="py-2.5 px-4 font-semibold text-right">
                      Pontos Acumulados Exigidos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {activeStat.ranks.map((r) => (
                    <tr key={r.rank} className="hover:bg-slate-950/50">
                      <td className="py-2.5 px-4 font-mono tabular-nums font-bold text-white">
                        Rank 0{r.rank}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">{r.title}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-right text-slate-200">
                        {r.pointsRequired}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-semibold text-emerald-400">
                  Melhores Fontes SEM Gastar Tempo
                </p>
                <ul className="space-y-1.5 text-slate-300">
                  {activeStat.bestTimeFreeMethods.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-semibold text-sky-400">
                  Melhores Fontes de Alto Rendimento
                </p>
                <ul className="space-y-1.5 text-slate-300">
                  {activeStat.bestTimeSlotMethods.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <p className={`font-semibold ${gameConfig.accentTextClass}`}>
                  Travas de Confidants (Gates)
                </p>
                <ul className="space-y-1.5 text-slate-300">
                  {activeStat.keyUnlocks.map((u, i) => (
                    <li key={i}>• {u}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* RIGHT ZONE (35% -> 4 cols): Hidden Affinity Multiplier Calculator */}
      <div className="lg:col-span-4 space-y-6">
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calculator className="w-3.5 h-3.5" />
              <span>Fórmula Interna da Atlus</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Calculadora de Multiplicador de Afinidade
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            As notas musicais que aparecem na tela (<span className="font-mono text-white">♪1, ♪2, ♪3</span>) escondem um valor matemático interno. Veja como seus multiplicadores mudam os pontos reais ganhos em uma única resposta:
          </p>

          {/* Base Note Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              1. Nota Base da Resposta de Diálogo:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setBaseNotes(n)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono tabular-nums font-bold border transition-colors ${
                    baseNotes === n
                      ? `${gameConfig.accentBgClass} border-transparent`
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {'♪'.repeat(n)} ({n} {n === 1 ? 'Nota' : 'Notas'})
                </button>
              ))}
            </div>
          </div>

          {/* Matching Persona Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              2. Multiplicadores Passivos Ativos:
            </label>
            <button
              onClick={() => setHasMatchingPersona(!hasMatchingPersona)}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                hasMatchingPersona
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span>Persona da Mesma Arcana no Inventário</span>
              <span className="font-mono tabular-nums font-bold">
                {hasMatchingPersona ? '×1.51 ATIVO' : '×1.00 (Sem Persona)'}
              </span>
            </button>

            <button
              onClick={() => setHasFortuneBoost(!hasFortuneBoost)}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                hasFortuneBoost
                  ? 'bg-sky-950/40 border-sky-500/40 text-sky-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span>Leitura da Chihaya / Santuário antes</span>
              <span className="font-mono tabular-nums font-bold">
                {hasFortuneBoost ? '+10 pts Grátis' : '+0 pts'}
              </span>
            </button>
          </div>

          {/* Exam Rank Bonus */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              3. Desempenho na Última Prova Escolar:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'Normal (×1.0)' },
                { id: 'top10', label: 'Top 10 (×1.2)' },
                { id: 'top1', label: '1º Lugar (×1.51)' },
              ].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setExamRankBonus(ex.id as 'none' | 'top10' | 'top1')}
                  className={`py-2 px-2 rounded-lg text-[11px] font-mono tabular-nums font-medium border transition-colors whitespace-nowrap shrink-0 ${
                    examRankBonus === ex.id
                      ? `${gameConfig.accentBgClass} border-transparent`
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output Comparison Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Pontos ganhos sem preparo:</span>
              <span className="font-mono tabular-nums text-slate-400">
                {pointsWithoutMultipliers} pts
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-white">Pontos Reais com Seu Preparo:</span>
              <span className={`font-mono tabular-nums text-lg font-bold ${gameConfig.accentTextClass}`}>
                {totalCalculatedPoints} pts
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              {hasMatchingPersona ? (
                <span>
                  Com <strong className="text-emerald-400">+{Math.round(((totalCalculatedPoints - pointsWithoutMultipliers) / pointsWithoutMultipliers) * 100)}% de pontos extras</strong>, uma resposta mediana (♪2) vale mais do que a melhor resposta possível (♪3) de alguém que esqueceu de equipar uma Persona da mesma Arcana!
                </span>
              ) : (
                <span className="text-rose-400">
                  Atenção: Sair com um Social Link sem ter uma Persona da mesma Arcana no bolso faz você perder 34% dos pontos, forçando encontros extras que desperdiçam dias!
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Golden Checklist Before Hanging Out */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Award className={`w-4 h-4 ${gameConfig.accentTextClass}`} />
            <h3 className="text-sm font-bold text-white">
              Regra dos 10 Segundos Antes do Encontro
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <strong className="text-white">1.</strong> Você NÃO precisa equipar a Persona como principal na batalha — basta ela estar no seu estoque de Personas ao iniciar a conversa.
            </li>
            <li>
              <strong className="text-white">2.</strong> Os únicos Confidants que NUNCA exigem Persona da mesma Arcana em P5R são: <strong>Sun (Yoshida)</strong>, <strong>Moon (Mishima)</strong> e <strong>Strength (Gêmeas)</strong>.
            </li>
            <li>
              <strong className="text-white">3.</strong> Tenha sempre 1 presente barato de cada tipo comprado no Underground Mall para destravar o próximo Rank caso falte apenas 1 nota musical.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
