import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialJourney} from '../src/academy/journey';
import {createFree,freeAction,freeItem,continueFree,freeEscape,actionBlock,actionCost,loadout,freeAffinity,type Action} from '../src/academy/free-engine';
import {pickReward,rewardStart} from '../src/academy/StudyLabs';
import {fieldGuide,type StudyEdition} from '../src/academy/field-guide';
test('ataque físico cobra HP percentual sem permitir auto-incapacitação',()=>{
 const j=initialJourney('p4g');let s=createFree('p4g',j,'normal',['jack-frost']);const a:Action={name:'Bash',element:'Físico',cost:6,resource:'hp',kind:'hit',power:60};s.loadouts[s.active]=[a];assert.equal(actionCost(a),11);s.actors[0].hp=11;assert.match(actionBlock(s,a,0,0),/HP insuficiente/);assert.equal(freeAction(s,'Bash',0,0),s);s.actors[0].hp=50;const n=freeAction(s,'Bash',0,0);assert.equal(n.actors[0].hp,39);assert.equal(n.actors[0].sp,64);assert.equal(n.hpSpent,11);assert.equal(s.actors[0].hp,50);
});
test('área resolve fraqueza e absorção separadamente e concede apenas uma oportunidade',()=>{
 let s=createFree('p5r',initialJourney('p5r'),'normal',['jack-frost','jack-o-lantern']);s.enemies[1].hp=80;s.loadouts[s.active]=[{name:'Maragi',element:'Fogo',cost:10,kind:'hit',all:true,power:40}];assert.equal(freeAffinity('p5r','jack-o-lantern','Fogo'),'Drena');const n=freeAction(s,'Maragi',0,0);assert.ok(n.enemies[0].hp<160);assert.ok(n.enemies[1].hp>80);assert.equal(n.hits,1);assert.equal(n.extra,true);assert.equal(n.actors[0].sp,54);assert.equal(s.enemies[1].hp,80);
});
test('custos e funções são diferentes entre edições',()=>{
 const p3=loadout('p3r',initialJourney('p3r'),'jack-o-lantern').find(a=>a.name==='Agi');const p5=loadout('p5r',initialJourney('p5r'),'jack-o-lantern').find(a=>a.name==='Agi');assert.equal(p3?.cost,3);assert.equal(p5?.cost,4);
});
test('item consome unidade e ação; cura não revive; continuidade não restaura recursos',()=>{
 let s=createFree('p5r',initialJourney('p5r'),'normal',['jack-frost']);s.actors[1].hp=0;assert.equal(freeItem(s,'medicine',1),s);const revived=freeItem(s,'revive',1);assert.equal(revived.actors[1].hp,90);assert.equal(revived.items.revive,0);assert.equal(revived.turn,1);assert.equal(s.items.revive,1);
 revived.outcome='won';revived.actors[0].sp=8;const n=continueFree(revived,initialJourney('p5r'),['pixie']);assert.equal(n.actors[0].sp,8);assert.equal(n.actors[1].hp,90);assert.equal(n.items.revive,0);assert.equal(n.stage,2);assert.equal(n.outcome,'playing');const escaped=freeEscape(n);assert.equal(escaped.outcome,'escaped');assert.equal(freeAction(escaped,'Ataque',0,0),escaped);assert.equal(continueFree(escaped,initialJourney('p5r'),['pixie']),escaped);
});
test('buff de ataque e redução de defesa afetam dano sem mutar a origem',()=>{
 const s=createFree('p5r',initialJourney('p5r'),'normal',['pixie']);const base=freeAction(s,'Ataque',0,0);const buffed={...s,actors:s.actors.map((a,i)=>({...a,attackUp:i===0?3:0}))};const better=freeAction(buffed,'Ataque',0,0);assert.ok(better.enemies[0].hp<base.enemies[0].hp);assert.equal(s.actors[0].attackUp,0);
});
test('Shuffle de treino permite sweep e transformação pode apagar atributo',()=>{
 let s=rewardStart();for(const id of ['extra2','extra','attribute','transform','heal'])s=pickReward(s,id);assert.equal(s.sweep,true);assert.equal(s.stats,1);assert.equal(s.xp,60);assert.equal(s.cards.length,0);assert.equal(pickReward(s,'attribute'),s);
 const transformed=pickReward(rewardStart(),'transform');assert.equal(transformed.cards.find(c=>c.id==='attribute')?.kind,'money');assert.equal(pickReward(transformed,'attribute').stats,0);const stopped=pickReward(rewardStart(),'attribute');assert.equal(stopped.picks,0);assert.equal(pickReward(stopped,'heal'),stopped);
});
test('todas as edições têm decisões válidas, sem confundir os modos de estudo',()=>{
 for(const e of ['p4g','p3p','p3r','p5r','p2is','p2ep'] as StudyEdition[]){const rows=fieldGuide(e);assert.ok(rows.length>=4);assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);for(const r of rows){assert.equal(r.quiz.options.length,r.quiz.feedback.length);assert.ok(r.quiz.correct>=0&&r.quiz.correct<r.quiz.options.length);assert.ok(r.body.length>=2);}}
 assert.ok(fieldGuide('p3p').some(r=>r.body.some(p=>p.includes('Portable não tem Shift'))));
});
test('preparação respeita alvo: aliado em Reload e próprio usuário quando indicado',()=>{
 let s=createFree('p3r',initialJourney('p3r'),'normal',['jack-frost']);s.loadouts[s.active]=[{name:'Charge',kind:'charge',target:'1 ally',cost:30}];const n=freeAction(s,'Charge',0,2);assert.equal(n.actors[2].charge,'physical');assert.equal(n.actors[0].charge,null);s.actors[2].hp=0;assert.equal(freeAction(s,'Charge',0,2),s);
 const p=createFree('p5r',initialJourney('p5r'),'normal',['jack-frost']);p.loadouts[p.active]=[{name:'Concentrate',kind:'charge',target:'Self',cost:15}];const m=freeAction(p,'Concentrate',0,2);assert.equal(m.actors[0].charge,'magic');assert.equal(m.actors[2].charge,null);
});
