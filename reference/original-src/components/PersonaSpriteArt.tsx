import React from 'react';
import { GameId } from '../data/personaData';

interface PersonaSpriteProps {
  shadowId: string;
  personaName: string;
  arcana: string;
  className?: string;
}

/**
 * Renders a custom stylized cel-shaded SVG sprite for each iconic Persona/Shadow
 * so the player can visually identify its silhouette and theme in the Palace/Dungeon.
 */
export const PersonaSpriteArt: React.FC<PersonaSpriteProps> = ({
  shadowId,
  personaName,
  arcana,
  className = 'w-20 h-20',
}) => {
  const renderCharacterArt = () => {
    switch (shadowId) {
      case 'p5r-pyro-jack':
        // Jack-o'-Lantern (Pumpkin with witch hat and lantern)
        return (
          <g>
            <circle cx="50" cy="56" r="24" fill="#F97316" stroke="#111827" strokeWidth="3" />
            <path d="M38 35 C38 56 38 76 50 80 C62 76 62 56 62 35" fill="none" stroke="#C2410C" strokeWidth="2" />
            {/* Witch Hat */}
            <polygon points="20,38 50,10 80,38" fill="#1E1B4B" stroke="#FACC15" strokeWidth="2" />
            <ellipse cx="50" cy="38" rx="32" ry="6" fill="#312E81" stroke="#111827" strokeWidth="2" />
            {/* Glowing Eyes & Grin */}
            <polygon points="36,52 44,48 44,56" fill="#FEF08A" />
            <polygon points="64,52 56,48 56,56" fill="#FEF08A" />
            <path d="M36 64 L43 69 L50 64 L57 69 L64 64" fill="none" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
            {/* Flame */}
            <circle cx="82" cy="60" r="7" fill="#EF4444" />
            <circle cx="82" cy="60" r="4" fill="#FDE047" />
          </g>
        );

      case 'p5r-jack-frost':
        // Jack Frost (Hee-Ho Snowman with blue jester hat)
        return (
          <g>
            {/* Jester Hat */}
            <path d="M24 38 Q30 12 46 28 Q50 32 54 28 Q70 12 76 38 Z" fill="#1D4ED8" stroke="#111827" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="5" fill="#FACC15" />
            <circle cx="76" cy="24" r="5" fill="#FACC15" />
            {/* Snow Head */}
            <circle cx="50" cy="52" r="22" fill="#F8FAFC" stroke="#1E293B" strokeWidth="3" />
            {/* Jester Collar */}
            <polygon points="24,68 38,82 50,70 62,82 76,68" fill="#1D4ED8" stroke="#FACC15" strokeWidth="1.5" />
            {/* Eyes & Smile */}
            <ellipse cx="42" cy="48" rx="3.5" ry="5" fill="#0F172A" />
            <ellipse cx="58" cy="48" rx="3.5" ry="5" fill="#0F172A" />
            <path d="M38 59 Q50 67 62 59" fill="none" stroke="#0F172A" strokeWidth="2.5" />
            {/* Ice Crystal */}
            <polygon points="16,48 20,42 24,48 20,54" fill="#38BDF8" />
          </g>
        );

      case 'p5r-pixie':
      case 'p2-pixie-poltergeist':
        // Pixie (Winged fairy silhouette with starlight)
        return (
          <g>
            {/* Butterfly Wings */}
            <path d="M50 48 C20 20 12 52 38 62 C18 70 28 88 48 66" fill="#F472B6" fillOpacity="0.8" stroke="#FBCFE8" strokeWidth="2" />
            <path d="M50 48 C80 20 88 52 62 62 C82 70 72 88 52 66" fill="#F472B6" fillOpacity="0.8" stroke="#FBCFE8" strokeWidth="2" />
            {/* Fairy Body/Head */}
            <circle cx="50" cy="36" r="12" fill="#FDE68A" stroke="#111827" strokeWidth="2" />
            <path d="M38 32 Q50 16 62 32" fill="#EC4899" />
            <polygon points="50,48 38,76 62,76" fill="#38BDF8" stroke="#111827" strokeWidth="2" />
            <circle cx="46" cy="36" r="2" fill="#111827" />
            <circle cx="54" cy="36" r="2" fill="#111827" />
          </g>
        );

      case 'p5r-shiki-ouji':
        // Shiki-Ouji (Iconic Origami Paper Talisman Samurai)
        return (
          <g>
            {/* Floating Talisman Ribbon */}
            <path d="M16 40 Q50 10 84 40" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 3" />
            {/* Paper Body */}
            <polygon points="50,28 24,78 40,78 50,58 60,78 76,78" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
            {/* Paper Head */}
            <rect x="37" y="16" width="26" height="24" rx="2" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
            {/* Red Mystic Markings */}
            <path d="M42 24 L48 28 M58 24 L52 28" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="42" x2="50" y2="56" stroke="#DC2626" strokeWidth="3" />
            <line x1="36" y1="50" x2="64" y2="50" stroke="#DC2626" strokeWidth="3" />
          </g>
        );

      case 'p5r-anubis':
        // Anubis (Egyptian Jackal Judge with Scales)
        return (
          <g>
            {/* Golden Halo & Scales */}
            <circle cx="50" cy="50" r="34" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Jackal Ears */}
            <polygon points="35,42 30,12 45,34" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
            <polygon points="65,42 70,12 55,34" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
            {/* Head & Nemes Headdress */}
            <polygon points="30,36 70,36 78,76 22,76" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="2" />
            <polygon points="36,36 64,36 50,66" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
            {/* Glowing Cyan/Gold Eyes */}
            <polygon points="41,46 47,48 42,51" fill="#38BDF8" />
            <polygon points="59,46 53,48 58,51" fill="#38BDF8" />
            {/* Balance Scale Bar */}
            <line x1="20" y1="68" x2="80" y2="68" stroke="#FACC15" strokeWidth="3" />
            <polygon points="20,68 14,80 26,80" fill="#FACC15" />
            <polygon points="80,68 74,80 86,80" fill="#FACC15" />
          </g>
        );

      case 'p5r-regent':
      case 'p5r-orlov':
      case 'p4g-golden-hand':
        // Treasure Demon / Crown Jewel / Golden Hand
        return (
          <g>
            <polygon points="50,12 84,46 50,84 16,46" fill="#F59E0B" stroke="#FEF08A" strokeWidth="3" />
            <polygon points="50,22 72,46 50,72 28,46" fill="#EF4444" stroke="#FDE047" strokeWidth="2" />
            <circle cx="50" cy="46" r="8" fill="#FEF9C3" />
            <path d="M18 22 L26 30 M82 22 L74 30 M18 72 L26 64 M82 72 L74 64" stroke="#FDE047" strokeWidth="2.5" />
          </g>
        );

      case 'p5r-girimekhala':
        // Girimekhala (Demon Elephant with Evil Eye)
        return (
          <g>
            {/* Large Ears */}
            <ellipse cx="24" cy="48" rx="14" ry="20" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <ellipse cx="76" cy="48" rx="14" ry="20" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            {/* Head & Trunk */}
            <circle cx="50" cy="44" r="20" fill="#475569" stroke="#0F172A" strokeWidth="3" />
            <path d="M44 54 Q44 82 62 78" fill="none" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
            {/* Tusks */}
            <path d="M34 58 L24 72" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
            <path d="M66 58 L76 72" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
            {/* Glowing Red Eyes */}
            <circle cx="42" cy="42" r="3.5" fill="#EF4444" />
            <circle cx="58" cy="42" r="3.5" fill="#EF4444" />
            <polygon points="50,26 45,34 55,34" fill="#FACC15" />
          </g>
        );

      case 'p5r-arahabaki':
        // Arahabaki (Ancient Clay Doll Dogu God that reflects Phys)
        return (
          <g>
            {/* Reflect Shield Ring */}
            <circle cx="50" cy="50" r="36" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="8 4" />
            {/* Clay Vessel Head & Body */}
            <rect x="30" y="20" width="40" height="32" rx="12" fill="#B45309" stroke="#FDE68A" strokeWidth="2.5" />
            <polygon points="24,52 76,52 66,82 34,82" fill="#92400E" stroke="#FDE68A" strokeWidth="2.5" />
            {/* Goggle Slit Eyes */}
            <ellipse cx="40" cy="36" rx="7" ry="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <ellipse cx="60" cy="36" rx="7" ry="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <line x1="34" y1="36" x2="46" y2="36" stroke="#38BDF8" strokeWidth="2" />
            <line x1="54" y1="36" x2="66" y2="36" stroke="#38BDF8" strokeWidth="2" />
          </g>
        );

      case 'p5r-okumura-MDL':
        // Corporobo MDL Robot
        return (
          <g>
            <rect x="26" y="24" width="48" height="40" rx="6" fill="#0284C7" stroke="#E0F2FE" strokeWidth="2.5" />
            <line x1="50" y1="10" x2="50" y2="24" stroke="#FACC15" strokeWidth="3" />
            <circle cx="50" cy="10" r="4" fill="#EF4444" />
            {/* Visor */}
            <rect x="32" y="34" width="36" height="12" rx="2" fill="#0F172A" />
            <circle cx="42" cy="40" r="3.5" fill="#38BDF8" />
            <circle cx="58" cy="40" r="3.5" fill="#38BDF8" />
            {/* Shoulders */}
            <rect x="18" y="64" width="64" height="16" rx="4" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
          </g>
        );

      case 'p5r-berith':
      case 'p5r-archangel':
      case 'p5r-valkyrie':
        // Armored Knight / Valkyrie / Archangel
        return (
          <g>
            {/* Plume */}
            <path d="M50 10 Q75 8 68 30" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
            {/* Knight Helmet */}
            <polygon points="32,26 68,26 72,62 50,78 28,62" fill="#CBD5E1" stroke="#0F172A" strokeWidth="3" />
            {/* Visor Cross */}
            <polygon points="36,42 64,42 50,48" fill="#0F172A" />
            <line x1="50" y1="32" x2="50" y2="72" stroke="#0F172A" strokeWidth="3" />
            {/* Spear/Lance */}
            <line x1="80" y1="14" x2="80" y2="86" stroke="#FACC15" strokeWidth="3" />
            <polygon points="80,8 74,24 86,24" fill="#E2E8F0" />
          </g>
        );

      case 'p3r-reaper':
      case 'p2-alice-sekhet':
        // The Reaper / Death Skull with Pistols
        return (
          <g>
            <path d="M20 82 L30 28 Q50 10 70 28 L80 82 Z" fill="#1E1B4B" stroke="#A855F7" strokeWidth="2.5" />
            {/* Skull Face */}
            <circle cx="50" cy="44" r="16" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="44" cy="42" r="4" fill="#EF4444" />
            <circle cx="56" cy="42" r="4" fill="#EF4444" />
            <line x1="44" y1="54" x2="56" y2="54" stroke="#0F172A" strokeWidth="3" strokeDasharray="2 2" />
            {/* Chains */}
            <path d="M16 64 Q50 84 84 64" fill="none" stroke="#94A3B8" strokeWidth="3" strokeDasharray="5 3" />
          </g>
        );

      default:
        // Classic Velvet Shadow Mask & Arcane Wings
        return (
          <g>
            {/* Dark Wings */}
            <path d="M14 34 L42 50 L20 70 Z" fill="#1E293B" stroke="#E11D48" strokeWidth="2" />
            <path d="M86 34 L58 50 L80 70 Z" fill="#1E293B" stroke="#E11D48" strokeWidth="2" />
            {/* Shadow Mask */}
            <ellipse cx="50" cy="48" rx="20" ry="24" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
            {/* Horns */}
            <polygon points="34,28 24,12 42,24" fill="#E11D48" />
            <polygon points="66,28 76,12 58,24" fill="#E11D48" />
            {/* Glowing Yellow Shadow Eyes */}
            <polygon points="36,44 46,48 38,52" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" />
            <polygon points="64,44 54,48 62,52" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative rounded-lg bg-slate-950 border-2 border-slate-700 overflow-hidden flex flex-col items-center justify-center shrink-0 select-none ${className}`}
      title={`${personaName} (${arcana})`}
    >
      {/* Subtle Tarot Pattern Backdrop */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(244,63,94,0.45), transparent 70%)',
        }}
      />
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1 relative z-10"
        aria-label={personaName}
      >
        {renderCharacterArt()}
      </svg>
      <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[9px] font-mono text-center text-slate-300 py-0.5 truncate px-1 border-t border-slate-800">
        {arcana.toUpperCase()}
      </span>
    </div>
  );
};

/**
 * Renders the game-specific thematic background layer (Metaverse Halftones for P5R,
 * Dark Hour Tartarus Moon for P3R, Midnight TV Broadcast Scanlines for P4G,
 * Velvet Starry Tapestry for P2)
 */
export const GameThematicBackdrop: React.FC<{ activeGame: GameId }> = ({ activeGame }) => {
  if (activeGame === 'p5r') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Crimson Metaverse Diagonal Slashes & Star Motifs */}
        <div
          className="absolute -top-32 -right-32 w-[620px] h-[620px] rounded-full opacity-15"
          style={{
            background:
              'repeating-radial-gradient(circle at center, #E11D48 0px, #E11D48 14px, transparent 14px, transparent 34px)',
          }}
        />
        <div
          className="absolute top-1/3 -left-24 w-[120%] h-32 -rotate-6 opacity-[0.04] bg-rose-500"
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(#E11D48 1.25px, transparent 1.25px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>
    );
  }

  if (activeGame === 'p3r') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dark Hour Full Moon & Tartarus Geometric Rings */}
        <div
          className="absolute -top-24 right-12 w-[420px] h-[420px] rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(circle, rgba(56,189,248,0.45) 0%, rgba(14,165,233,0.12) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>
    );
  }

  if (activeGame === 'p4g') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Midnight Channel Golden Broadcast Rings */}
        <div
          className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full opacity-15"
          style={{
            background:
              'repeating-radial-gradient(circle at center, #F59E0B 0px, #F59E0B 12px, transparent 12px, transparent 28px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #FACC15 0px, #FACC15 1px, transparent 1px, transparent 6px)',
          }}
        />
      </div>
    );
  }

  // Persona 2 Velvet & Rumor Tapestry
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute -top-24 left-1/3 w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background:
            'radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(249,115,22,0.15) 55%, transparent 75%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(#A855F7 1.25px, transparent 1.25px)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
};
