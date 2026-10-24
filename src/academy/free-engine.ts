import {catalogs,companions,ownedSkills,type Journey,type Modern} from './journey';
export type Difficulty='easy'|'normal'|'hard'|'merciless';
export const difficulty:Record<Modern,Record<Difficulty,{out:number;incoming:number;weak:number;name:string}>>={
 p5r:{easy:{out:1,incoming:.5,weak:1.25,name:'Easy'},normal:{out:1,incoming:1,weak:1.25,name:'Normal'},hard:{out:.8,incoming:1.6,weak:1.25,name:'Hard'},merciless:{out:.64,incoming:1.6,weak:3.75,name:'Merciless'}},
 p3r:{easy:{out:1.25,incoming:.5,weak:1.25,name:'Easy'},normal:{out:1,incoming:1,weak:1.25,name:'Normal'},hard:{out:.8,incoming:1.3,weak:1.25,name:'Hard'},merciless:{out:.6,incoming:1.5,weak:1.7,name:'Merciless'}},
 p4g:{easy:{out:1,incoming:.5,weak:1.5,name:'Easy'},normal:{out:1,incoming:1,weak:1.5,name:'Normal'},hard:{out:.8,incoming:1.6,weak:1.5,name:'Hard'},merciless:{out:.8,incoming:1.6,weak:1.5,name:'Very Hard'}},
};
export type Action={name:string;element?:string;cost:number;kind:'hit'|'heal'|'debuff'|'buff'|'guard'};
const spellElements:Record<string,string>={Agi:'Fogo',Agilao:'Fogo',Bufu:'Gelo',Bufula:'Gelo',Zio:'Eletricidade',Zionga:'Eletricidade',Garu:'Vento',Garula:'Vento',Kouha:'Luz',Kouga:'Luz',Eiha:'Trevas',Eiga:'Trevas',Psi:'Psíquico',Psio:'Psíquico',Frei:'Nuclear',Freila:'Nuclear'};
export const basic:Action[]=[{name:'Ataque',element:'Físico',cost:0,kind:'hit'},{name:'Defender',cost:0,kind:'guard'}];
export type Actor={id:string;name:string;hp:number;sp:number;guard:boolean;buff:number;weak:string;element:string;actions:Action[]};
export type Foe={id:string;hp:number;max:number;down:boolean;scanned:boolean;charged:boolean;attackDown:number};
export type FreeRun={game:Modern;difficulty:Difficulty;actors:Actor[];enemies:Foe[];turn:number;acted:number[];extra:boolean;passUsed:number[];round:number;active:string;switched:boolean;reserve:string[];loadouts:Record<string,Action[]>;debuff:number;log:string[];outcome:'playing'|'won'|'lost';hits:number;spent:number};
export function loadout(game:Modern,state:Journey,id:string):Action[]{return [...basic,...ownedSkills(game,state,id).flatMap((s):Action[]=>{
 if(spellElements[s.name])return [{name:s.name,element:spellElements[s.name],cost:4,kind:'hit'}];
 if(['Dia','Media','Diarama'].includes(s.name))return [{name:s.name,cost:6,kind:'heal'}];
 if(s.name==='Tarunda')return [{name:s.name,cost:8,kind:'debuff'}];
 if(s.name==='Rakukaja')return [{name:s.name,cost:8,kind:'buff'}];return [];
 })];}
export function createFree(game:Modern,state:Journey,level:Difficulty,enemyIds:string[],solo=false):FreeRun{
 const lead:Actor={id:'hero',name:'Protagonista',hp:180,sp:64,guard:false,buff:0,weak:'',element:'',actions:[]};
 const allies=solo?[]:companions[game].filter(c=>state.allies.includes(c.id)).map(c=>({...c,hp:180,sp:64,guard:false,buff:0,actions:[...basic,{name:'Magia de '+c.element,element:c.element,cost:4,kind:'hit' as const},...(c.role.includes('cura')?[{name:'Dia',cost:6,kind:'heal' as const}]:[{name:'Tarunda',cost:8,kind:'debuff' as const}])]}));
 return {game,difficulty:level,actors:[lead,...allies],enemies:enemyIds.filter(id=>catalogs[game][id]).map(id=>({id,hp:160,max:160,down:false,scanned:false,charged:false,attackDown:0})),turn:0,acted:[],extra:false,passUsed:[],round:1,active:state.reserve[0],switched:false,reserve:[...state.reserve],loadouts:Object.fromEntries(state.reserve.map(id=>[id,loadout(game,state,id)])),debuff:0,log:['Leia as afinidades e coordene quem resolve cada alvo.'],outcome:'playing',hits:0,spent:0};
}
export function freeAffinity(game:Modern,id:string,element:string){return catalogs[game][id].affinities.find(a=>a.element===(game==='p3r'&&element==='Físico'?'Corte':element))?.affinity??'Normal';}
function clone(s:FreeRun):FreeRun{return {...s,actors:s.actors.map(a=>({...a})),enemies:s.enemies.map(e=>({...e})),acted:[...s.acted],passUsed:[...s.passUsed],log:[...s.log]};}
function record(s:FreeRun,t:string){s.log=[t,...s.log].slice(0,40);}
export function freeScan(s:FreeRun,i:number){if(s.outcome!=='playing'||!s.enemies[i]||s.enemies[i].scanned)return s;const n=clone(s);n.enemies[i].scanned=true;record(n,'Análise grátis: compare a afinidade com as ações de cada integrante.');return n;}
export function freeSwap(s:FreeRun,id:string){if(s.outcome!=='playing'||s.turn!==0||s.switched||!s.reserve.includes(id)||id===s.active)return s;const n=clone(s);n.active=id;n.switched=true;return n;}
function check(s:FreeRun){if(s.actors[0].hp<=0)s.outcome='lost';else if(s.enemies.every(e=>e.hp<=0))s.outcome='won';return s.outcome!=='playing';}
function next(s:FreeRun){if(check(s))return;s.extra=false;s.passUsed=[];s.acted=[...new Set([...s.acted,s.turn])];const next=s.actors.findIndex((a,i)=>a.hp>0&&!s.acted.includes(i));if(next>=0){s.turn=next;return;}
 const d=difficulty[s.game][s.difficulty];
 s.enemies.forEach((e,i)=>{if(e.hp<=0)return;if(e.down){e.down=false;return;}if(s.round%3===0&&!e.charged){e.charged=true;record(s,`${catalogs[s.game][e.id].name} prepara ataque forte. Defenda na próxima rodada.`);return;}
 const living=s.actors.map((a,k)=>({a,k})).filter(x=>x.a.hp>0);if(!living.length)return;const {a,k}=living[(s.round+i-1)%living.length];const elem=catalogs[s.game][e.id].coverage.find(x=>['Fogo','Gelo','Eletricidade','Vento'].includes(x))??'Físico';const aff=k===0?freeAffinity(s.game,s.active,elem):a.weak===elem?'Fraco':'Normal';let damage=(e.charged?56:24)*d.incoming;e.charged=false;if(aff==='Fraco'&&!a.guard)damage*=d.weak;if(aff==='Resiste')damage*=.5;if(['Anula','Drena','Repele'].includes(aff))damage=0;damage*=a.guard?.4:1;damage*=a.buff>0?.75:1;damage*=e.attackDown>0?.75:1;damage=Math.round(damage);a.hp=Math.max(0,a.hp-damage);record(s,`${catalogs[s.game][e.id].name} → ${a.name}: ${elem}, −${damage} HP${a.guard?' · protegido':aff==='Fraco'?' · fraqueza exposta':''}.`);
 });s.enemies.forEach(e=>{e.attackDown=Math.max(0,e.attackDown-1);});s.actors.forEach(a=>{a.guard=false;a.buff=Math.max(0,a.buff-1);});s.debuff=Math.max(0,s.debuff-1);s.round++;s.turn=0;s.acted=[];s.switched=false;check(s);
}
export function freePass(s:FreeRun,to:number){if(s.game==='p4g'||!s.extra||s.outcome!=='playing'||to===s.turn||!s.actors[to]||s.actors[to].hp<=0||s.passUsed.includes(to))return s;const n=clone(s);n.passUsed.push(s.turn);n.acted=[...new Set([...n.acted,s.turn])];n.turn=to;record(n,`${n.actors[to].name} recebe ${s.game==='p5r'?'Baton Pass (bônus didático de 25%)':'Shift (sem bônus de dano)'}.`);return n;}
export function freeAll(s:FreeRun){if(s.outcome!=='playing'||s.actors.filter(a=>a.hp>0).length<2||!s.enemies.some(e=>e.hp>0)||!s.enemies.every(e=>e.hp<=0||e.down))return s;const n=clone(s);n.enemies.forEach(e=>{e.hp=Math.max(0,e.hp-Math.round(95*difficulty[n.game][n.difficulty].out));e.down=false;});record(n,'All-Out Attack: o grupo aproveita a abertura. Dano base de treino: 95.');next(n);return n;}
export function freeAction(s:FreeRun,name:string,target:number,ally:number):FreeRun{
 if(s.outcome!=='playing')return s;const actions=s.turn===0?s.loadouts[s.active]:s.actors[s.turn].actions;const action=actions?.find(a=>a.name===name);if(!action||s.actors[s.turn].sp<action.cost)return s;
 if(['hit','debuff'].includes(action.kind)&&(!s.enemies[target]||s.enemies[target].hp<=0))return s;
 if(action.kind==='heal'&&name==='Media'&&!s.actors.some(a=>a.hp>0&&a.hp<180))return s;
 if(['heal','buff'].includes(action.kind)&&name!=='Media'&&(!s.actors[ally]||s.actors[ally].hp<=0||action.kind==='heal'&&s.actors[ally].hp===180))return s;
 const n=clone(s);const actor=n.actors[n.turn];actor.sp-=action.cost;n.spent+=action.cost;const d=difficulty[n.game][n.difficulty];
 if(action.kind==='guard'){actor.guard=true;record(n,`${actor.name} defende: reduz a resposta em 60% e evita o bônus de fraqueza.`);}
 if(action.kind==='heal'){const targets=name==='Media'?n.actors.filter(a=>a.hp>0):[n.actors[ally]];let restored=0;targets.forEach(a=>{const hp=Math.min(60,180-a.hp);a.hp+=hp;restored+=hp;});record(n,`${actor.name} usa ${name}: ${restored} HP recuperados ${name==='Media'?'no grupo vivo':'em '+n.actors[ally].name}. Custo didático: uma ação e 6 SP.`);}
 if(action.kind==='buff'){n.actors[ally].buff=3;record(n,`${n.actors[ally].name}: defesa melhorada por três respostas inimigas.`);}
 if(action.kind==='debuff'){n.enemies[target].attackDown=3;record(n,`Tarunda: ataque de ${catalogs[n.game][n.enemies[target].id].name} reduzido por três respostas inimigas. Os outros alvos não foram afetados.`);}
 if(action.kind==='hit'){
 const e=n.enemies[target];const aff=freeAffinity(n.game,e.id,action.element!);let damage=(name==='Ataque'?22:32)*d.out*(n.game==='p5r'&&n.passUsed.length?1.25:1);if(aff==='Fraco')damage*=d.weak;if(aff==='Resiste')damage*=.5;damage=Math.round(damage);
 if(aff==='Drena'){e.hp=Math.min(e.max,e.hp+damage);damage=0;}if(aff==='Repele'){actor.hp=Math.max(0,actor.hp-damage);damage=0;}if(aff==='Anula')damage=0;e.hp=Math.max(0,e.hp-damage);
 record(n,`${actor.name} · ${name}: ${damage} de dano. ${aff}. Base × dificuldade (${d.out})${aff==='Fraco'?` × fraqueza (${d.weak})`:''}.`);
 if(aff==='Fraco'&&!e.down&&damage>0){e.down=true;n.extra=true;n.hits++;record(n,'1 More: este integrante continua. Procure outro alvo ou passe a oportunidade a um aliado.');check(n);return n;}
 }next(n);return n;
}
