import {RewardLab} from './StudyLabs';
import {useState} from 'react';
import type {Game} from './content';
import {CombatTrainer} from '../training/Training';
import {FreeBattle} from './FreeBattle';
export function BattleHub({game,onMaster,onTeam}:{game:Game;onMaster:()=>void;onTeam:()=>void}){
 const [mode,setMode]=useState('guided');
 return <>{game!=='p2'&&<div className="mission-tabs" aria-label="Modo de combate"><button aria-pressed={mode==='guided'} className={mode==='guided'?'selected':''} onClick={()=>setMode('guided')}>Curso guiado · kit emprestado</button><button aria-pressed={mode==='free'} className={mode==='free'?'selected':''} onClick={()=>setMode('free')}>Modo livre · minha equipe</button>{game==='p4g'&&<button aria-pressed={mode==='rewards'} className={mode==='rewards'?'selected':''} onClick={()=>setMode('rewards')}>Shuffle Time · escolhas de recompensa</button>}</div>}{mode==='rewards'&&game==='p4g'?<RewardLab/>:game==='p2'||mode==='guided'?<CombatTrainer game={game} onMaster={onMaster}/>:<FreeBattle onTeam={onTeam}/>}</>;
}
