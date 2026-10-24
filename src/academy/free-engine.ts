import {catalogs,companions,ownedSkills,type Journey,type Modern} from './journey';
export type Difficulty='easy'|'normal'|'hard'|'merciless';
export const difficulty:Record<Modern,Record<Difficulty,{out:number;incoming:number;weak:number;name:string}>>={
 p5r:{easy:{out:1,incoming:.5,weak:1.25,name:'Easy'},normal:{out:1,incoming:1,weak:1.25,name:'Normal'},hard:{out:.8,incoming:1.6,weak:1.25,name:'Hard'},merciless:{out:.64,incoming:1.6,weak:3.75,name:'Merciless'}},
 p3r:{easy:{out:1.25,incoming:.5,weak:1.25,name:'Easy'},normal:{out:1,incoming:1,weak:1.25,name:'Normal'},hard:{out:.8,incoming:1.3,weak:1.25,name:'Hard'},merciless:{out:.6,incoming:1.5,weak:1.7,name:'Merciless'}},
 p4g:{easy:{out:1,incoming:.5,weak:1.5,name:'Easy'},normal:{out:1,incoming:1,weak:1.5,name:'Normal'},hard:{out:.8,incoming:1.6,weak:1.5,name:'Hard'},merciless:{out:.8,incoming:1.6,weak:1.5,name:'Very Hard'}},
};
import skillData from './combat-skills.json';
export type Action={name:string;element?:string;cost:number;kind:'hit'|'heal'|'debuff'|'buff'|'guard'|'charge';resource?:'hp'|'sp';target?:string;all?:boolean;power?:number};
const skillTable=skillData as Record<Modern,Record<string,Action>>;
export const basic:Action[]=[{name:'Ataque',element:'Físico',cost:0,kind:'hit'},{name:'Defender',cost:0,kind:'guard'}];
export type Actor={id:string;name:string;hp:number;sp:number;guard:boolean;buff:number;attackUp:number;charge:'physical'|'magic'|null;weak:string;element:string;actions:Action[]};
export type Foe={id:string;hp:number;max:number;down:boolean;scanned:boolean;charged:boolean;attackDown:number;defenseDown:number};
export type ItemId='medicine'|'soul'|'revive';
export type FreeRun={game:Modern;difficulty:Difficulty;actors:Actor[];enemies:Foe[];turn:number;acted:number[];extra:boolean;passUsed:number[];round:number;active:string;switched:boolean;reserve:string[];loadouts:Record<string,Action[]>;log:string[];outcome:'playing'|'won'|'lost'|'escaped';hits:number;spent:number;hpSpent:number;items:Record<ItemId,number>;stage:number};
export function loadout(game:Modern,state:Journey,id:string):Action[]{return [...basic,...ownedSkills(game,state,id).flatMap(s=>skillTable[game][s.name]?[skillTable[game][s.name]]:[])];}
export function createFree(game:Modern,state:Journey,level:Difficulty,enemyIds:string[],solo=false):FreeRun{
 const lead:Actor={id:'hero',name:'Protagonista',hp:180,sp:64,guard:false,buff:0,attackUp:0,charge:null,weak:'',element:'',actions:[]};
 const names:Record<string,string>={Fogo:'Agi',Gelo:'Bufu',Vento:'Garu',Eletricidade:'Zio'};
 const allies=solo?[]:companions[game].filter(c=>state.allies.includes(c.id)).map(c=>({...lead,...c,actions:[...basic,{...skillTable[game][names[c.element]],name:'Magia de '+c.element},...(c.role.includes('cura')?[skillTable[game].Dia,skillTable[game].Media]:[skillTable[game].Tarunda,skillTable[game].Rakunda]),...(c.role.includes('física')?[skillTable[game][game==='p5r'?'Lunge':'Bash']]:[])].filter(Boolean)}));
 return {game,difficulty:level,actors:[lead,...allies],enemies:enemyIds.filter(id=>catalogs[game][id]).map(id=>({id,hp:160,max:160,down:false,scanned:false,charged:false,attackDown:0,defenseDown:0})),turn:0,acted:[],extra:false,passUsed:[],round:1,active:state.reserve[0],switched:false,reserve:[...state.reserve],loadouts:Object.fromEntries(state.reserve.map(id=>[id,loadout(game,state,id)])),log:['Analise o alvo, escolha um comando e confira quem age depois. Itens e recursos persistem se você continuar a incursão.'],outcome:'playing',hits:0,spent:0,hpSpent:0,items:{medicine:2,soul:1,revive:1},stage:1};
}
export function freeAffinity(game:Modern,id:string,element:string){return catalogs[game][id].affinities.find(a=>a.element===(game==='p3r'&&element==='Físico'?'Corte':element))?.affinity??'Normal';}
function clone(s:FreeRun):FreeRun{return {...s,actors:s.actors.map(a=>({...a})),enemies:s.enemies.map(e=>({...e})),acted:[...s.acted],passUsed:[...s.passUsed],log:[...s.log],items:{...s.items}};}
function record(s:FreeRun,t:string){s.log=[t,...s.log].slice(0,60);}
export function freeScan(s:FreeRun,i:number){if(s.outcome!=='playing'||!s.enemies[i]||s.enemies[i].scanned)return s;const n=clone(s);n.enemies[i].scanned=true;record(n,'Análise grátis neste treino: cada inimigo reage ao elemento de forma própria. Compare alvo único e área.');return n;}
export function freeSwap(s:FreeRun,id:string){if(s.outcome!=='playing'||s.turn!==0||s.switched||!s.reserve.includes(id)||id===s.active)return s;const n=clone(s);n.active=id;n.switched=true;record(n,`Persona equipada: ${catalogs[s.game][id].name}. Suas habilidades e afinidades defensivas agora são as desta Persona.`);return n;}
function check(s:FreeRun){if(s.actors[0].hp<=0)s.outcome='lost';else if(s.enemies.every(e=>e.hp<=0))s.outcome='won';return s.outcome!=='playing';}
export function enemyElement(s:FreeRun,e:Foe){return catalogs[s.game][e.id].coverage.find(x=>['Fogo','Gelo','Eletricidade','Vento','Corte','Impacto','Perfuração','Físico'].includes(x))??'Físico';}
export function enemyTarget(s:FreeRun,i:number){const live=s.actors.map((a,k)=>({a,k})).filter(x=>x.a.hp>0);if(!live.length)return 0;const element=enemyElement(s,s.enemies[i]);if(s.difficulty==='hard'||s.difficulty==='merciless'){const exposed=live.find(({a,k})=>!a.guard&&(k===0?freeAffinity(s.game,s.active,element)==='Fraco':a.weak===element));if(exposed)return exposed.k;}return live[(s.round+i-1)%live.length].k;}
function next(s:FreeRun){if(check(s))return;s.extra=false;s.passUsed=[];s.acted=[...new Set([...s.acted,s.turn])];const next=s.actors.findIndex((a,i)=>a.hp>0&&!s.acted.includes(i));if(next>=0){s.turn=next;return;}
 const d=difficulty[s.game][s.difficulty];
 for(const [i,e] of s.enemies.entries()){
  if(check(s))break;if(e.hp<=0)continue;if(e.down){e.down=false;record(s,`${catalogs[s.game][e.id].name} se levanta; neste treino isso consome sua resposta.`);continue;}
  if(s.round%3===0&&!e.charged){e.charged=true;record(s,`${catalogs[s.game][e.id].name} prepara ataque forte. Defenda antes da próxima resposta.`);continue;}
  const k=enemyTarget(s,i),a=s.actors[k],elem=enemyElement(s,e);const aff=k===0?freeAffinity(s.game,s.active,elem):a.weak===elem?'Fraco':'Normal';let damage=(e.charged?56:24)*d.incoming;e.charged=false;
  if(aff==='Fraco'&&!a.guard)damage*=d.weak;if(aff==='Resiste')damage*=.5;damage*=a.guard?.4:1;damage*=a.buff>0?.75:1;damage*=e.attackDown>0?.75:1;damage=Math.round(damage);
  if(aff==='Drena'){a.hp=Math.min(180,a.hp+damage);record(s,`${a.name} absorve ${elem} e recupera até ${damage} HP.`);}
  else if(aff==='Repele'){e.hp=Math.max(0,e.hp-damage);record(s,`${a.name} reflete ${elem}: ${catalogs[s.game][e.id].name} perde ${damage} HP.`);}
  else{if(aff==='Anula')damage=0;a.hp=Math.max(0,a.hp-damage);record(s,`${catalogs[s.game][e.id].name} → ${a.name}: ${elem}, −${damage} HP${a.guard?' · protegido':aff==='Fraco'?' · fraqueza exposta':''}.`);}
 }
 s.enemies.forEach(e=>{e.attackDown=Math.max(0,e.attackDown-1);e.defenseDown=Math.max(0,e.defenseDown-1);});s.actors.forEach(a=>{a.guard=false;a.buff=Math.max(0,a.buff-1);a.attackUp=Math.max(0,a.attackUp-1);});s.round++;s.turn=0;s.acted=[];s.switched=false;check(s);
}
export function freePass(s:FreeRun,to:number){if(s.game==='p4g'||!s.extra||s.outcome!=='playing'||to===s.turn||!s.actors[to]||s.actors[to].hp<=0||s.passUsed.includes(to))return s;const n=clone(s);n.passUsed.push(s.turn);n.acted=[...new Set([...n.acted,s.turn])];n.turn=to;record(n,`${n.actors[to].name} recebe ${s.game==='p5r'?'Baton Pass (bônus didático de 25%)':'Shift (sem bônus de dano)'}. Escolha quem tem a resposta que falta.`);return n;}
export function freeAll(s:FreeRun){if(s.outcome!=='playing'||s.actors.filter(a=>a.hp>0).length<2||!s.enemies.some(e=>e.hp>0)||!s.enemies.every(e=>e.hp<=0||e.down))return s;const n=clone(s);n.enemies.forEach(e=>{e.hp=Math.max(0,e.hp-Math.round(95*difficulty[n.game][n.difficulty].out));e.down=false;});record(n,'All-Out Attack: o grupo aproveita a abertura. Dano base de treino: 95; não é vitória garantida.');next(n);return n;}
export function actionCost(a:Action){return a.resource==='hp'?Math.ceil(180*a.cost/100):a.cost;}
export function actionBlock(s:FreeRun,a:Action,target:number,ally:number):string{
 if(s.outcome!=='playing')return 'O encontro terminou.';
 const actor=s.actors[s.turn],cost=actionCost(a);
 if(a.resource==='hp'?actor.hp<=cost:actor.sp<cost)return a.resource==='hp'?'HP insuficiente para pagar sem cair.':'SP insuficiente.';
 if(['hit','debuff'].includes(a.kind)&&!a.all&&(!s.enemies[target]||s.enemies[target].hp<=0))return 'Escolha um inimigo vivo.';
 if(a.kind==='heal'&&(a.all||a.name==='Media')&&!s.actors.some(x=>x.hp>0&&x.hp<180))return 'Nenhum aliado vivo precisa de cura.';
 if(a.kind==='charge'&&a.target==='1 ally'&&(!s.actors[ally]||s.actors[ally].hp<=0))return 'Escolha um aliado vivo para preparar o golpe.';
 if(['heal','buff'].includes(a.kind)&&!a.all&&a.name!=='Media'&&(!s.actors[ally]||s.actors[ally].hp<=0||a.kind==='heal'&&s.actors[ally].hp===180))return 'Escolha um aliado vivo que possa receber o efeito.';
 return '';
}
export function actionDescription(a:Action){const range=a.all?(a.kind==='heal'?'todos os aliados':'todos os inimigos'):a.kind==='heal'||a.kind==='buff'?'um aliado':'um inimigo';return a.kind==='guard'?'Defende este integrante; reduz dano e protege a fraqueza.':a.kind==='charge'?`Prepara o próximo ataque correspondente ${a.target==='1 ally'?'do aliado selecionado':'do próprio usuário'}; custa uma ação.`:a.kind==='heal'?`Recupera HP de ${range}; não revive.`:a.kind==='debuff'?`Reduz ${a.name==='Rakunda'?'defesa':'ataque'} de ${range} por três respostas.`:a.kind==='buff'?`Aumenta ${a.name==='Tarukaja'?'ataque':'defesa'} de ${range} por três respostas.`:`${a.element} · ${range}. Cada alvo mantém sua própria afinidade.`;}
export function freeAction(s:FreeRun,name:string,target:number,ally:number):FreeRun{
 const action=(s.turn===0?s.loadouts[s.active]:s.actors[s.turn].actions)?.find(a=>a.name===name);if(!action||actionBlock(s,action,target,ally))return s;
 const n=clone(s),actor=n.actors[n.turn],cost=actionCost(action),d=difficulty[n.game][n.difficulty];
 if(action.resource==='hp'){actor.hp-=cost;n.hpSpent+=cost;}else{actor.sp-=cost;n.spent+=cost;}
 if(action.kind==='guard'){actor.guard=true;record(n,`${actor.name} defende: reduz a resposta em 60% e evita o bônus de fraqueza neste treino.`);}
 if(action.kind==='charge'){const recipient=action.target==='1 ally'?n.actors[ally]:actor;recipient.charge=['Charge','Power Charge'].includes(name)?'physical':'magic';record(n,`${recipient.name} prepara ${recipient.charge==='physical'?'ataque físico':'magia'}: o próximo golpe correspondente terá potência dobrada neste treino.`);}
 if(action.kind==='heal'){const targets=action.all||name==='Media'?n.actors.filter(a=>a.hp>0):[n.actors[ally]];let restored=0;const amount=name.includes('rama')?110:60;targets.forEach(a=>{const hp=Math.min(amount,180-a.hp);a.hp+=hp;restored+=hp;});record(n,`${actor.name} usa ${name}: ${restored} HP recuperados ${targets.length>1?'no grupo vivo':'em '+targets[0].name}. Custo: uma ação e ${cost} SP.`);}
 if(action.kind==='buff'){if(name==='Tarukaja')n.actors[ally].attackUp=3;else n.actors[ally].buff=3;record(n,`${n.actors[ally].name}: ${name==='Tarukaja'?'ataque':'defesa'} melhorado por três respostas inimigas.`);}
 if(action.kind==='debuff'){if(name==='Rakunda')n.enemies[target].defenseDown=3;else n.enemies[target].attackDown=3;record(n,`${name}: ${name==='Rakunda'?'defesa':'ataque'} de ${catalogs[n.game][n.enemies[target].id].name} reduzido por três respostas inimigas. Os outros alvos não foram afetados.`);}
 if(action.kind==='hit'){
  const targets=action.all?n.enemies.filter(e=>e.hp>0):[n.enemies[target]];let gained=false;
  const physical=['Físico','Corte','Impacto','Perfuração','Arma'].includes(action.element!);const boosted=actor.charge===(physical?'physical':'magic');
  for(const e of targets){const aff=freeAffinity(n.game,e.id,action.element!);let damage=(name==='Ataque'?22:32*Math.sqrt((action.power??40)/40))*d.out*(actor.attackUp?1.25:1)*(e.defenseDown?1.25:1)*(boosted?2:1)*(n.game==='p5r'&&n.passUsed.length?1.25:1);
   if(aff==='Fraco')damage*=d.weak;if(aff==='Resiste')damage*=.5;damage=Math.round(damage);
   if(aff==='Drena'){e.hp=Math.min(e.max,e.hp+damage);damage=0;}if(aff==='Repele'){actor.hp=Math.max(0,actor.hp-damage);damage=0;}if(aff==='Anula')damage=0;e.hp=Math.max(0,e.hp-damage);
   record(n,`${actor.name} · ${name} → ${catalogs[n.game][e.id].name}: ${damage} de dano. ${aff}${aff==='Repele'?' · dano refletido no usuário':aff==='Drena'?' · o alvo recuperou vida':''}.`);
   if(aff==='Fraco'&&!e.down&&damage>0){e.down=true;gained=true;n.hits++;}
  }
  if(boosted)actor.charge=null;
  if(check(n))return n;
  if(gained&&actor.hp>0){n.extra=true;record(n,'1 More (+1): uma nova derrubada abriu outra ação. Resolva outro alvo, cure ou transfira a oportunidade.');return n;}
 }
 next(n);return n;
}
export const trainingItems:Record<ItemId,{name:string;detail:string}>={medicine:{name:'Medicina de treino',detail:'Recupera até 80 HP de um aliado vivo.'},soul:{name:'Recuperador de SP de treino',detail:'Recupera até 20 SP de um aliado vivo.'},revive:{name:'Reviver de treino',detail:'Reanima um aliado incapacitado com 90 HP.'}};
export function freeItem(s:FreeRun,id:ItemId,ally:number):FreeRun{
 const a=s.actors[ally];if(s.outcome!=='playing'||!a||s.items[id]<=0||id==='revive'&&a.hp>0||id!=='revive'&&a.hp<=0||id==='medicine'&&a.hp===180||id==='soul'&&a.sp===64)return s;
 const n=clone(s);n.items[id]--;if(id==='medicine')n.actors[ally].hp=Math.min(180,a.hp+80);if(id==='soul')n.actors[ally].sp=Math.min(64,a.sp+20);if(id==='revive')n.actors[ally].hp=90;record(n,`${n.actors[n.turn].name} usa ${trainingItems[id].name} em ${a.name}. Uma unidade e a ação foram consumidas.`);next(n);return n;
}
export function freeEscape(s:FreeRun){if(s.outcome!=='playing')return s;const n=clone(s);n.outcome='escaped';record(n,'Você encerrou a incursão para preparar. Saída garantida apenas neste treino; no jogo, fuga e itens de saída têm condições próprias.');return n;}
export function continueFree(s:FreeRun,state:Journey,enemyIds:string[]):FreeRun{
 if(s.outcome!=='won')return s;const n=createFree(s.game,state,s.difficulty,enemyIds,s.actors.length===1);n.actors=n.actors.map(a=>{const old=s.actors.find(x=>x.id===a.id);return old?{...a,hp:old.hp,sp:old.sp}:a;});n.items={...s.items};n.stage=s.stage+1;if(n.reserve.includes(s.active))n.active=s.active;record(n,'Novo encontro, mesmos HP/SP e itens restantes. Vencer a luta anterior não restaurou os recursos.');return n;
}
