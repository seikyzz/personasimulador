import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import raw from './catalog.json';
import rawRecipes from './recipes.json';
import type { Game } from './content';
export type Modern = Exclude<Game,'p2'>;
export type Skill = {name:string;level:number;initial:boolean;element:string;code:string;transfer:boolean};
export type Persona = {id:string;name:string;level:number;arcana:string;skills:Skill[];affinities:{element:string;affinity:string}[];coverage:string[];accepts:string[];stats:number[]};
export const catalogs = raw as Record<Modern,Record<string,Persona>>;
export const recipes = rawRecipes as Record<Modern,Record<string,string>>;
export const companions:Record<Modern,{id:string;name:string;role:string;element:string;weak:string}[]> = {
 p5r:[{id:'ryuji',name:'Ryuji',role:'Eletricidade e pressão física',element:'Eletricidade',weak:'Vento'},{id:'ann',name:'Ann',role:'Fogo e redução de ataque',element:'Fogo',weak:'Gelo'},{id:'morgana',name:'Morgana',role:'Vento e cura',element:'Vento',weak:'Eletricidade'}],
 p3r:[{id:'yukari',name:'Yukari',role:'Vento e cura',element:'Vento',weak:'Eletricidade'},{id:'junpei',name:'Junpei',role:'Fogo e pressão física',element:'Fogo',weak:'Vento'},{id:'akihiko',name:'Akihiko',role:'Eletricidade e redução de ataque',element:'Eletricidade',weak:'Gelo'}],
 p4g:[{id:'yosuke',name:'Yosuke',role:'Vento e suporte',element:'Vento',weak:'Eletricidade'},{id:'chie',name:'Chie',role:'Gelo e pressão física',element:'Gelo',weak:'Fogo'},{id:'yukiko',name:'Yukiko',role:'Fogo e cura',element:'Fogo',weak:'Gelo'}],
};
export type Journey = {version:3;reserve:string[];registered:string[];inherited:Record<string,Skill[]>;level:number;allies:string[];goal:string;diary:string[]};
export function initialJourney(game:Modern):Journey {return {version:3,reserve:['pixie','jack-frost','jack-o-lantern'].filter(id=>catalogs[game][id]),registered:[],inherited:{},level:35,allies:companions[game].map(c=>c.id),goal:'Cobertura elemental',diary:[]};}
export function sanitizeJourney(game:Modern,v:unknown):Journey {
 const d=initialJourney(game); if(!v || typeof v!=='object') return d;
 const s=v as Partial<Journey>; const ids=(a:unknown)=>Array.isArray(a)?[...new Set(a.filter((x):x is string=>typeof x==='string'&&!!catalogs[game][x]))]:[];
 const inherited:Record<string,Skill[]>={};
 if(s.inherited && typeof s.inherited==='object') for(const [id,skills] of Object.entries(s.inherited)) if(catalogs[game][id]&&Array.isArray(skills)) inherited[id]=skills.filter(x=>x&&typeof x.name==='string'&&typeof x.element==='string'&&typeof x.code==='string').slice(0,5);
 return {...d,reserve:ids(s.reserve).slice(0,12),registered:ids(s.registered),inherited,level:typeof s.level==='number'&&Number.isFinite(s.level)?Math.max(1,Math.min(99,s.level)):35,allies:Array.isArray(s.allies)?s.allies.filter(x=>companions[game].some(c=>c.id===x)):d.allies,goal:typeof s.goal==='string'?s.goal:d.goal,diary:Array.isArray(s.diary)?s.diary.filter(x=>typeof x==='string').slice(-20):[]};
}
export function ownedSkills(game:Modern,s:Journey,id:string):Skill[]{return [...catalogs[game][id].skills.filter(x=>x.initial),...(s.inherited[id]??[])];}
export function fusionResult(game:Modern,a:string,b:string){return catalogs[game][recipes[game][[a,b].sort().join('|')]];}
export function inheritanceOptions(game:Modern,s:Journey,a:string,b:string):Skill[]{const r=fusionResult(game,a,b); if(!r)return []; return [...new Map([...ownedSkills(game,s,a),...ownedSkills(game,s,b)].filter(x=>x.transfer&&r.accepts.includes(x.code)&&!r.skills.some(y=>y.initial&&y.name===x.name)).map(x=>[x.name,x])).values()];}
export function fuse(game:Modern,s:Journey,a:string,b:string,inherit:string):Journey {
 const r=fusionResult(game,a,b); if(!r||a===b||!s.reserve.includes(a)||!s.reserve.includes(b)||r.level>s.level||s.reserve.includes(r.id)) return s;
 const chosen=inheritanceOptions(game,s,a,b).find(x=>x.name===inherit); if(inherit&&!chosen)return s;
 return {...s,reserve:[...s.reserve.filter(x=>x!==a&&x!==b),r.id],registered:[...new Set([...s.registered,a,b,r.id])],inherited:{...s.inherited,[r.id]:chosen?[chosen]:[]},diary:[...s.diary,`${catalogs[game][a].name} + ${catalogs[game][b].name} → ${r.name}${chosen?' · '+chosen.name:''}`].slice(-20)};
}
const Context=createContext<{state:Journey;update:(fn:(s:Journey)=>Journey)=>void;game:Modern;saveError:boolean}|null>(null);
export function JourneyProvider({game,children}:{game:Modern;children:ReactNode}) {
 const [state,setState]=useState(()=>{try{const saved=localStorage.getItem('va-journey-v3-'+game); if(saved)return sanitizeJourney(game,JSON.parse(saved));const old=JSON.parse(localStorage.getItem('va-team-'+game)||'null');return Array.isArray(old)&&old.length?sanitizeJourney(game,{...initialJourney(game),reserve:old}):initialJourney(game);}catch{return initialJourney(game);}});
 const [saveError,setSaveError]=useState(false);
 useEffect(()=>{try{localStorage.setItem('va-journey-v3-'+game,JSON.stringify(state));setSaveError(false);}catch{setSaveError(true);}},[state,game]);
 return <Context.Provider value={{state,update:setState,game,saveError}}>{saveError&&<p role="alert" className="notice">O navegador não conseguiu salvar. Seu progresso continua nesta sessão; libere armazenamento antes de fechar.</p>}{children}</Context.Provider>;
}
export function useJourney(){const v=useContext(Context);if(!v)throw new Error('JourneyProvider ausente');return v;}
export function EditionJourney({game,children}:{game:Game;children:ReactNode}){return game==='p2'?<>{children}</>:<JourneyProvider key={game} game={game}>{children}</JourneyProvider>;}
