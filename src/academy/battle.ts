export type Element = 'Fogo' | 'Gelo' | 'Eletricidade' | 'Vento';
export type Battle = { hp:number; sp:number; enemies:number[]; down:boolean[]; turn:number; log:string[]; effect:string; ended:boolean };
export const initialBattle = ():Battle => ({hp:100,sp:32,enemies:[100,100],down:[false,false],turn:1,log:['Analise os alvos. O objetivo é derrubar os dois e usar o ataque conjunto.'],effect:'',ended:false});
export function act(state:Battle, action:string, target:number):Battle {
 if(state.ended) return state;
 const s={...state,enemies:[...state.enemies],down:[...state.down],log:[...state.log]};
 const note=(v:string)=>{s.log=[v,...s.log].slice(0,8);s.effect=v};
 if(action==='all') { if(!s.down.every((d,i)=>d||s.enemies[i]===0)) return state; s.enemies=[0,0];s.ended=true;note('ALL-OUT ATTACK! Você criou uma oportunidade derrubando todos os alvos.');return s; }
 if(action==='heal') {if(s.sp<6||s.hp===100)return state;s.sp-=6;s.hp=Math.min(100,s.hp+40);note('Dia: +40 HP (máximo 100). Curar também consome seu turno.');}
 else if(action==='guard') {s.hp=Math.max(0,s.hp-5);s.turn++;s.down=[false,false];note('DEFESA! Você recebeu apenas 5 de dano e guardou SP. Os alvos se levantaram.');s.ended=s.hp===0;return s;}
 else {
  if(s.enemies[target]===0||s.sp<4)return state;
  s.sp-=4;
  const weak=target===0?'Fogo':'Eletricidade'; const resist=target===0?'Gelo':'Vento';
  const damage=action===weak?34:action===resist?8:20;
  s.enemies[target]=Math.max(0,s.enemies[target]-damage);
  const extra=action===weak&&!s.down[target];
  if(extra) {s.down[target]=true;note(`WEAK! −${damage} HP. 1 MORE: use a ação extra no outro alvo ou finalize o grupo.`);return s;}
  note(`${action}: −${damage} HP.${action===resist?' RESISTE: pouco retorno para o mesmo SP.':action===weak?' Alvo já derrubado: não há novo 1 More.':' Dano normal: não gera ação extra.'}`);
 }
 if(s.enemies.every(h=>h===0)){s.ended=true;note('Vitória! Compare os recursos restantes antes de reiniciar.');return s;}
 s.hp=Math.max(0,s.hp-18);s.turn++;s.down=[false,false];s.log[0]+=' Resposta inimiga: −18 HP; alvos se levantam.';
 if(s.hp===0){s.ended=true;note('Fim do treino. Tente explorar fraquezas e usar defesa ou cura.');}
 return s;
}
