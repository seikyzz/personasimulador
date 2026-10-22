import React, { useState, useEffect } from 'react';
import { GAMES, GameId } from '../data/personaData';
import {
  AffinityState,
  ELEMENT_LABELS,
  ElementKey,
  PALACE_ZONES,
  SHADOW_ENEMIES,
} from '../data/shadowCompendiumData';
import { PersonaSpriteArt } from './PersonaSpriteArt';
import { Search, Eye, EyeOff, ShieldAlert, CheckSquare, Swords } from 'lucide-react';

interface PalaceWeaknessCompendiumProps {
  activeGame: GameId;
  discoveredShadows: string[];
  onToggleDiscoveredShadow: (id: string) => void;
  onPracticeAgainstShadow?: (shadowId: string) => void;
}

const PERSONALITY_MATRIX = [
  {
    id: 'Tímida (Timid)',
    shortLabel: 'Tímida',
    likes: 'Respostas Bondosas / Gentis (Kind)',
    neutral: 'Respostas Engraçadas (Funny)',
    hates: 'Respostas Vagas ou Agressivas/Sérias',
    tip: 'Trate a Sombra com calma, prometa não machucá-la e ofereça ajuda.',
  },
  {
    id: 'Irritada (Irritable)',
    shortLabel: 'Irritada',
    likes: 'Respostas Sérias / Diretas (Serious)',
    neutral: 'Respostas Vagas (Vague)',
    hates: 'Respostas Bondosas (acha que é pena) ou Engraçadas',
    tip: 'Responda com firmeza, desafio e lógica direta sem fazer piadas.',
  },
  {
    id: 'Alegre (Upbeat)',
    shortLabel: 'Alegre',
    likes: 'Respostas Engraçadas / Brincalhonas (Funny)',
    neutral: 'Respostas Bondosas (Kind)',
    hates: 'Respostas Sérias ou Vagas',
    tip: 'Entre na brincadeira, dance, faça piadas e mantenha o clima leve.',
  },
  {
    id: 'Sombria (Gloomy)',
    shortLabel: 'Sombria',
    likes: 'Respostas Vagas / Filosóficas (Vague)',
    neutral: 'Respostas Sérias (Serious)',
    hates: 'Respostas Engraçadas ou Bondosas demais',
    tip: 'Dê respostas misteriosas, evasivas ou concorde que o mundo é incerto.',
  },
];

export const PalaceWeaknessCompendium: React.FC<PalaceWeaknessCompendiumProps> = ({
  activeGame,
  discoveredShadows,
  onToggleDiscoveredShadow,
  onPracticeAgainstShadow,
}) => {
  const gameConfig = GAMES[activeGame];
  const gamePalaces = PALACE_ZONES.filter((p) => p.gameId === activeGame);

  const [selectedPalaceId, setSelectedPalaceId] = useState<string>(
    gamePalaces[0]?.id || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [weakElementFilter, setWeakElementFilter] = useState<ElementKey | 'ALL'>('ALL');
  const [spoilerGuard, setSpoilerGuard] = useState<boolean>(true);
  const [selfDiscoveryMode, setSelfDiscoveryMode] = useState<boolean>(false);
  const [selectedPersonality, setSelectedPersonality] = useState<string>(
    PERSONALITY_MATRIX[0].id
  );

  useEffect(() => {
    const firstPalace = PALACE_ZONES.find((p) => p.gameId === activeGame);
    if (firstPalace) {
      setSelectedPalaceId(firstPalace.id);
    }
    setWeakElementFilter('ALL');
  }, [activeGame]);

  const activePalaceZone =
    gamePalaces.find((p) => p.id === selectedPalaceId) || gamePalaces[0];

  const filteredEnemies = SHADOW_ENEMIES.filter((enemy) => {
    if (enemy.gameId !== activeGame) return false;
    if (selectedPalaceId !== 'ALL' && enemy.palaceId !== selectedPalaceId) return false;

    const q = searchQuery.toLowerCase().trim();
    if (
      q &&
      !enemy.personaName.toLowerCase().includes(q) &&
      !enemy.shadowDisguiseName.toLowerCase().includes(q) &&
      !enemy.arcana.toLowerCase().includes(q)
    ) {
      return false;
    }

    if (weakElementFilter !== 'ALL' && enemy.affinities[weakElementFilter] !== 'FRACO') {
      return false;
    }

    return true;
  });

  const renderAffinityCell = (state: AffinityState, isHidden: boolean) => {
    if (isHidden) {
      return (
        <span className="font-mono text-[11px] text-slate-600 select-none">?</span>
      );
    }

    switch (state) {
      case 'FRACO':
        return (
          <span className="inline-block font-mono text-[11px] font-bold text-rose-300 bg-rose-950/90 border border-rose-500/60 px-1.5 py-0.5 rounded">
            FRACO
          </span>
        );
      case 'NULO':
        return (
          <span className="inline-block font-mono text-[11px] font-semibold text-slate-200 bg-slate-800 border border-slate-600 px-1.5 py-0.5 rounded">
            NULO
          </span>
        );
      case 'REFLETE':
        return (
          <span className="inline-block font-mono text-[11px] font-bold text-sky-300 bg-sky-950/80 border border-sky-500/50 px-1.5 py-0.5 rounded">
            REFL
          </span>
        );
      case 'DRENA':
        return (
          <span className="inline-block font-mono text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-1.5 py-0.5 rounded">
            DRENA
          </span>
        );
      case 'RESISTE':
        return (
          <span className="inline-block font-mono text-[11px] font-medium text-amber-300 px-1 py-0.5">
            RES
          </span>
        );
      default:
        return <span className="font-mono text-xs text-slate-600">—</span>;
    }
  };

  const activePersonalityInfo =
    PERSONALITY_MATRIX.find((p) => p.id === selectedPersonality) || PERSONALITY_MATRIX[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT ZONE (65% -> 8 cols): Palace Selector & Illustrated Shadow Weakness Cards */}
      <div className="lg:col-span-8 space-y-6">
        <section className="bg-slate-950/90 border-2 border-slate-800 rounded-xl p-6 space-y-6 shadow-[6px_6px_0px_rgba(0,0,0,0.7)]">
          {/* Header & Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className={`text-xs font-mono font-bold uppercase ${gameConfig.accentTextClass}`}>
                Passo 02 · Compêndio Visual de Sombras & Palácios
              </p>
              <h2 className="text-xl font-bold text-white mt-1">
                Identificação Visual & Fraquezas Elementais ({gameConfig.shortTitle})
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelfDiscoveryMode(!selfDiscoveryMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  selfDiscoveryMode
                    ? `${gameConfig.accentBorderClass} ${gameConfig.accentSoftBgClass} text-white`
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {selfDiscoveryMode ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                {selfDiscoveryMode
                  ? 'Modo Descoberta (Ocultar)'
                  : 'Revelar Todas as Fraquezas'}
              </button>

              <button
                onClick={() => setSpoilerGuard(!spoilerGuard)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  spoilerGuard
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {spoilerGuard ? 'Anti-Spoiler Ativo' : 'Spoilers Liberados'}
              </button>
            </div>
          </div>

          {/* Ordered Palace / Dungeon Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Escolha o Palácio / Masmorra em Ordem Cronológica:
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedPalaceId('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                  selectedPalaceId === 'ALL'
                    ? `${gameConfig.accentBgClass} border-transparent`
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                Todos ({gamePalaces.length} Áreas)
              </button>
              {gamePalaces.map((palace) => {
                const isMasked = spoilerGuard && palace.isLateGameSpoiler;
                return (
                  <button
                    key={palace.id}
                    onClick={() => setSelectedPalaceId(palace.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                      selectedPalaceId === palace.id
                        ? `${gameConfig.accentBgClass} border-transparent`
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {isMasked
                      ? 'Palácio Final [Protegido]'
                      : palace.name.split(':')[0] +
                        (palace.name.split(':')[1]
                          ? `: ${palace.name.split(':')[1].split('(')[0].trim()}`
                          : '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Element Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Disfarce (ex: Guarda Devasso) ou Persona (ex: Shiki-Ouji)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="md:col-span-6 flex items-center gap-1 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 mr-1 whitespace-nowrap shrink-0">
                Filtrar Fraqueza:
              </span>
              <button
                onClick={() => setWeakElementFilter('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap shrink-0 ${
                  weakElementFilter === 'ALL'
                    ? `${gameConfig.accentBgClass}`
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                TODOS
              </button>
              {ELEMENT_LABELS.map((el) => (
                <button
                  key={el.key}
                  onClick={() => setWeakElementFilter(el.key)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap shrink-0 ${
                    weakElementFilter === el.key
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {el.short}
                </button>
              ))}
            </div>
          </div>

          {/* Illustrated Shadow Cards */}
          {filteredEnemies.length > 0 ? (
            <div className="space-y-4">
              {filteredEnemies.map((enemy) => {
                const isDiscovered = discoveredShadows.includes(enemy.id);
                const hideAffinities = selfDiscoveryMode && !isDiscovered;

                return (
                  <div
                    key={enemy.id}
                    className="bg-slate-900/95 border-2 border-slate-800 rounded-xl p-4 space-y-4 hover:border-slate-700 transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.5)]"
                  >
                    {/* Top Row: Sprite + Name + Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <PersonaSpriteArt
                          shadowId={enemy.id}
                          personaName={enemy.personaName}
                          arcana={enemy.arcana}
                          className="w-20 h-20"
                        />

                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono tabular-nums font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-white">
                              Nv. {enemy.level}
                            </span>
                            <span className="font-bold text-lg text-white">
                              {enemy.personaName}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-slate-300 font-medium">
                              Arcana {enemy.arcana}
                            </span>
                            {enemy.isSavageOrBoss && (
                              <>
                                <span aria-hidden="true" className="text-slate-600">·</span>
                                <span className="text-rose-400 font-bold">
                                  Sombra Selvagem / Chefe
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            Nome de Disfarce no Palácio:{' '}
                            <strong className="text-amber-300">{enemy.shadowDisguiseName}</strong>
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Personalidade de Negociação:{' '}
                            <button
                              onClick={() => setSelectedPersonality(enemy.personality)}
                              className={`underline font-semibold ${gameConfig.accentTextClass}`}
                            >
                              {enemy.personality}
                            </button>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {onPracticeAgainstShadow && (
                          <button
                            onClick={() => onPracticeAgainstShadow(enemy.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 ${gameConfig.accentBgClass}`}
                          >
                            <Swords className="w-3.5 h-3.5" />
                            Treinar Luta no Simulador
                          </button>
                        )}

                        <button
                          onClick={() => onToggleDiscoveredShadow(enemy.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                            isDiscovered
                              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                              : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          {isDiscovered ? 'Dominada' : 'Marcar'}
                        </button>
                      </div>
                    </div>

                    {/* 10-Column Elemental Weakness Grid */}
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-2 border-t border-slate-800">
                      {ELEMENT_LABELS.map((el) => (
                        <div
                          key={el.key}
                          className="bg-slate-950 border border-slate-800 rounded p-1.5 text-center space-y-1"
                        >
                          <span className="block font-mono text-[10px] text-slate-400">
                            {el.short}
                          </span>
                          <div>
                            {renderAffinityCell(enemy.affinities[el.key], hideAffinities)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tactical Strategy Footer */}
                    <p className="text-xs text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded-lg px-3.5 py-2.5">
                      <strong className={gameConfig.accentTextClass}>Como Derrotar / Recrutar: </strong>
                      {hideAffinities
                        ? 'Clique em "Marcar" ou "Treinar Luta" para descobrir as fraquezas na prática!'
                        : enemy.tacticalTip}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-white">
                Nenhuma Sombra encontrada com esses filtros.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setWeakElementFilter('ALL');
                  setSelectedPalaceId('ALL');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold ${gameConfig.accentBgClass}`}
              >
                Mostrar Todos os Inimigos
              </button>
            </div>
          )}
        </section>
      </div>

      {/* RIGHT ZONE (35% -> 4 cols): Palace Dossier & Shadow Negotiation Decoder */}
      <div className="lg:col-span-4 space-y-6">
        {activePalaceZone && (
          <section className="bg-slate-950/90 border-2 border-slate-800 rounded-xl p-6 space-y-4 shadow-[6px_6px_0px_rgba(0,0,0,0.7)]">
            <div className="border-b border-slate-800 pb-3">
              <p className="text-xs font-mono text-slate-400 uppercase">
                Resumo Tático do Palácio Atual
              </p>
              <h3 className="text-base font-bold text-white mt-0.5">
                {spoilerGuard && activePalaceZone.isLateGameSpoiler
                  ? 'Palácio Avançado (Protegido)'
                  : activePalaceZone.name}
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Nível Recomendado:</span>
                <span className="font-mono tabular-nums font-bold text-white">
                  {activePalaceZone.recommendedLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Prazo do Calendário:</span>
                <span className="font-mono tabular-nums text-amber-400 text-right">
                  {activePalaceZone.deadlineNote}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-800 space-y-1">
                <span className={`font-semibold ${gameConfig.accentTextClass} block`}>
                  Estratégia Chave da Masmorra:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activePalaceZone.keyStrategy}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Interactive Hold-Up Negotiation Decoder */}
        <section className="bg-slate-950/90 border-2 border-slate-800 rounded-xl p-6 space-y-4 shadow-[6px_6px_0px_rgba(0,0,0,0.7)]">
          <div className="border-b border-slate-800 pb-3">
            <p className="text-xs font-mono text-slate-400 uppercase">
              Tabela de Bolso · Hold Up
            </p>
            <h3 className="text-base font-bold text-white mt-0.5">
              Como Negociar com Cada Personalidade
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PERSONALITY_MATRIX.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonality(p.id)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                  selectedPersonality === p.id
                    ? `${gameConfig.accentBgClass} border-transparent`
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {p.shortLabel}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2.5 text-xs">
            <p className="font-bold text-white text-sm">{activePersonalityInfo.id}</p>
            <p className="text-emerald-400">
              <strong>Ganha a Persona (Notas ♪):</strong> {activePersonalityInfo.likes}
            </p>
            <p className="text-amber-300">
              <strong>Neutro / Pede Item:</strong> {activePersonalityInfo.neutral}
            </p>
            <p className="text-rose-400">
              <strong>Irrita / Ataca:</strong> {activePersonalityInfo.hates}
            </p>
            <p className="pt-2 border-t border-slate-800 text-slate-300">
              {activePersonalityInfo.tip}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
