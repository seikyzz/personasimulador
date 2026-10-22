import React, { useState } from 'react';
import {
  GAMES,
  GameId,
  TECHNICAL_COMBOS,
} from '../data/personaData';
import { Zap, BookOpen, Flame, Compass, Save } from 'lucide-react';

interface CombatAndClassicLabProps {
  activeGame: GameId;
  playerNotes: string;
  onUpdatePlayerNotes: (notes: string) => void;
}

export const CombatAndClassicLab: React.FC<CombatAndClassicLabProps> = ({
  activeGame,
  playerNotes,
  onUpdatePlayerNotes,
}) => {
  const gameConfig = GAMES[activeGame];

  const [selectedTechId, setSelectedTechId] = useState<string>(TECHNICAL_COMBOS[0].id);
  const [hasKnowingTheHeartBook, setHasKnowingTheHeartBook] = useState<boolean>(true);
  const [billiardsRank, setBilliardsRank] = useState<number>(4);
  const [batonPassChain, setBatonPassChain] = useState<number>(3);
  const [p2Tab, setP2Tab] = useState<'rumors' | 'tarot' | 'fusionspells'>('rumors');

  const activeTech =
    TECHNICAL_COMBOS.find((t) => t.id === selectedTechId) || TECHNICAL_COMBOS[0];

  // Technical multiplier calculation
  const baseTechMultiplier =
    billiardsRank === 1
      ? 1.5
      : billiardsRank === 2
      ? 1.65
      : billiardsRank === 3
      ? 1.8
      : 2.1;
  const knockdownChance =
    billiardsRank === 4 ? '100% (1 More Garantido)' : billiardsRank >= 2 ? 'Alta (~75%)' : '50% (Sem Down Garantido)';

  // Baton Pass multiplier calculation
  const batonMultiplier =
    batonPassChain === 0
      ? 1.0
      : batonPassChain === 1
      ? 1.25
      : batonPassChain === 2
      ? 1.5
      : 1.75;

  const combinedDamageMult = (baseTechMultiplier * batonMultiplier).toFixed(2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT ZONE (65% -> 8 cols): Technical Damage Matrix & Persona 2 Classic Academy */}
      <div className="lg:col-span-8 space-y-8">
        {/* Interactive Technical Damage Lab */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-400">
                Engenharia de Combate · Como Derrubar Qualquer Inimigo Sem Fraqueza
              </p>
              <h2 className="text-xl font-bold text-white mt-1">
                Laboratório de Dano Technical & Knockdown
              </h2>
            </div>

            <button
              onClick={() => setHasKnowingTheHeartBook(!hasKnowingTheHeartBook)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                hasKnowingTheHeartBook
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {hasKnowingTheHeartBook
                ? 'Livro "Knowing the Heart" Lido (Combos Expandidos)'
                : 'Sem Livro "Knowing the Heart"'}
            </button>
          </div>

          {/* Ailment Selector Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              1. Escolha o Status Negativo (Ailment) aplicado na Sombra:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TECHNICAL_COMBOS.map((combo) => (
                <button
                  key={combo.id}
                  onClick={() => setSelectedTechId(combo.id)}
                  className={`p-3 rounded-lg text-left border transition-colors ${
                    selectedTechId === combo.id
                      ? `${gameConfig.accentBorderClass} ${gameConfig.accentSoftBgClass}`
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-[11px] font-mono text-slate-400">
                    {combo.ailmentCategory}
                  </span>
                  <span className="block text-xs font-bold text-white mt-0.5">
                    {combo.ailmentName.split('(')[0].trim()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Technical Combo Output */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeTech.ailmentName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeTech.ailmentEffect}</p>
              </div>
              <span className={`font-mono tabular-nums text-xs font-bold ${gameConfig.accentTextClass}`}>
                Multiplicador Technical: ×{baseTechMultiplier.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5">
                <span className="font-semibold text-white block">
                  Elementos que Disparam Technical:
                </span>
                <ul className="space-y-1 text-emerald-300 font-medium">
                  {(hasKnowingTheHeartBook
                    ? activeTech.bookExpandedTriggers
                    : activeTech.baseTriggers
                  ).map((trig, idx) => (
                    <li key={idx}>→ {trig}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5">
                <span className="font-semibold text-white block">
                  Aplicação Tática nos Palácios:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeTech.guaranteedKnockdownNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Persona 2 Duology (Innocent Sin & Eternal Punishment) Mastery Section */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-purple-400">
                Módulo Especial Era Clássica · Innocent Sin & Eternal Punishment
              </p>
              <h2 className="text-xl font-bold text-white mt-1">
                Guia de Domínio de Persona 2 (Sumaru City)
              </h2>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => setP2Tab('rumors')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  p2Tab === 'rumors'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                01. Rumores
              </button>
              <button
                onClick={() => setP2Tab('tarot')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  p2Tab === 'tarot'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                02. Contatos & Tarot
              </button>
              <button
                onClick={() => setP2Tab('fusionspells')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  p2Tab === 'fusionspells'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                03. Fusion Spells
              </button>
            </div>
          </div>

          {p2Tab === 'rumors' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Em <strong>Persona 2</strong>, a maldição de Nyarlathotep faz com que qualquer rumor em que a população de Sumaru City acredite se torne realidade física. Você coleta rumores com informantes (Toro, Chikarin, Toku) e paga a <strong>Agência de Detetives Kuzunoha</strong> para espalhá-los:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <h4 className="font-bold text-white text-sm">
                    Regra das Lojas Secretas (Qualidade vs. Preço)
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Ao espalhar rumores sobre lojas de armas (como o restaurante Clair de Lune ou Rosa Candida), você terá opções diferentes de boato. <strong>SEMPRE escolha o rumor que diz que a loja é "Cara, mas de Qualidade Suprema"</strong> — o dinheiro é infinito em batalha, mas o catálogo de armas fortes é permanente!
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                  <h4 className="font-bold text-white text-sm">
                    Rumores de Demônios & Cassino Mu
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Espalhe o rumor de que o Cassino Mu tem "Pagamentos Altos no Blackjack/Poker" para farmar moedas e trocar por itens de invocação lendários e Skill Cards raros logo na metade do jogo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {p2Tab === 'tarot' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Em vez de fundir duas Personas, em Persona 2 você invoca Personas na Velvet Room juntando <strong>Cartas de Tarot</strong> daquela Arcana. Entenda as 4 Emoções de Contato:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1">
                  <span className="font-mono font-bold text-emerald-400 block">
                    1. ALEGRIA (Happy - Verde) → PACTO!
                  </span>
                  <p className="text-slate-400">
                    Tirar 3 vezes Alegria fecha um <strong>Pacto (Pact)</strong> com aquele demônio (você pode ter até 3 Pactos ativos).
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1">
                  <span className="font-mono font-bold text-sky-400 block">
                    2. INTERESSE (Eager - Azul) → CARTAS + FREE TAROT!
                  </span>
                  <p className="text-slate-400">
                    Tirar 3 vezes Interesse em um demônio com quem você JÁ TEM PACTO faz ele dar Cartas da Arcana dele + <strong>Free Tarot Cards</strong> (cartas coringa queIgor transforma em qualquer Arcana!).
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1">
                  <span className="font-mono font-bold text-rose-400 block">
                    3. FÚRIA (Angry - Vermelho) → QUEBRA DE PACTO
                  </span>
                  <p className="text-slate-400">
                    Irrita o demônio e dá ataque preventivo inimigo. Só use se quiser abrir vaga para um novo Pacto de nível maior.
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1">
                  <span className="font-mono font-bold text-amber-400 block">
                    4. MEDO (Scared - Amarelo) → FUGA DO DEMÔNIO
                  </span>
                  <p className="text-slate-400">
                    Faz o encontro acabar imediatamente sem lutar (útil para atravessar masmorras longas quando estiver sem SP).
                  </p>
                </div>
              </div>
            </div>
          )}

          {p2Tab === 'fusionspells' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                O sistema de combate de Persona 2 permite ordenar a fila de turnos dos 5 personagens. Quando 2 ou 3 aliados usam elementos compatíveis em sequência exata, eles disparam uma <strong>Fusion Spell</strong>:
              </p>
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <th className="py-2 px-3">Nome da Fusion Spell</th>
                      <th className="py-2 px-3">Ordem Exata na Fila de Turno</th>
                      <th className="py-2 px-3">Efeito Estratégico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 font-mono text-[11px]">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">Blazing Burst</td>
                      <td className="py-2.5 px-3 text-rose-300">
                        1º Fogo (Agi) → 2º Vento (Garu) → 3º Fogo (Agi)
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">
                        Dano massivo de Fogo em todos os inimigos desde o Nv. 5!
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">Megido / Nuclear</td>
                      <td className="py-2.5 px-3 text-sky-300">
                        1º Vento (Garu) → 2º Fogo (Agi) → 3º Terra (Magna)
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">
                        Dano Nuclear/Almighty em área para limpar hordas resistentes.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">Grand Cross</td>
                      <td className="py-2.5 px-3 text-purple-300">
                        5 Personas Supremas (Apollo + Artemis + Hermes + Cronus + Venus)
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">
                        A técnica definitiva de Innocent Sin contra os chefes finais.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* RIGHT ZONE (35% -> 4 cols): Baton Pass / Billiards Simulator & Player Field Notebook */}
      <div className="lg:col-span-4 space-y-6">
        {/* Baton Pass & Billiards Multiplier Calculator */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <p className="text-xs text-slate-400">Matemática de Dano em Cadeia</p>
            <h3 className="text-base font-bold text-white mt-0.5">
              Multiplicador Technical + Baton Pass
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="billiards-slider" className="text-slate-300 font-medium">
                  Rank de Bilhar (Kichijoji):
                </label>
                <span className="font-mono tabular-nums font-bold text-white">
                  Rank {billiardsRank}
                </span>
              </div>
              <input
                id="billiards-slider"
                type="range"
                min={1}
                max={4}
                value={billiardsRank}
                onChange={(e) => setBilliardsRank(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="baton-slider" className="text-slate-300 font-medium">
                  Nível da Cadeia de Baton Pass / Shift:
                </label>
                <span className="font-mono tabular-nums font-bold text-white">
                  {batonPassChain} {batonPassChain === 1 ? 'Passe' : 'Passes'}
                </span>
              </div>
              <input
                id="baton-slider"
                type="range"
                min={0}
                max={3}
                value={batonPassChain}
                onChange={(e) => setBatonPassChain(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Chance de Derrubar (Down):</span>
                <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                  {knockdownChance}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Custo de SP no 3º Passe:</span>
                <span className="font-mono tabular-nums text-sky-400 font-semibold">
                  {batonPassChain === 3 ? '0 SP / 0 HP (GRÁTIS!)' : 'Custo Normal'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-white">Multiplicador Final:</span>
                <span className={`font-mono tabular-nums text-lg font-bold ${gameConfig.accentTextClass}`}>
                  ×{combinedDamageMult} Dano
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Persistent Player Field Notebook */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <p className="text-xs text-slate-400">Salvo Automaticamente no Navegador</p>
              <h3 className="text-base font-bold text-white mt-0.5">
                Caderno de Campo Pessoal
              </h3>
            </div>
            <Save className="w-4 h-4 text-slate-400" />
          </div>

          <p className="text-xs text-slate-400">
            Anote suas próprias metas da semana no jogo, receitas de fusão planejadas ou quais Personas levar para o próximo Palácio:
          </p>

          <textarea
            value={playerNotes}
            onChange={(e) => onUpdatePlayerNotes(e.target.value)}
            rows={6}
            placeholder="Ex: Terça à noite ligar para Kawakami → Quarta chuvosa ir ao Diner → Fundir Shiki-Ouji com Frei antes do Palácio do Kaneshiro..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 resize-y"
          />
        </section>
      </div>
    </div>
  );
};
