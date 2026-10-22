import {test} from 'node:test';
import assert from 'node:assert/strict';
import {act,initialBattle} from '../src/academy/battle';
test('fraqueza cria 1 More e dois alvos derrubados liberam finalização',()=>{let s=initialBattle();s=act(s,'Fogo',0);assert.equal(s.hp,100);assert.equal(s.sp,28);assert.equal(s.down[0],true);s=act(s,'Eletricidade',1);assert.equal(s.hp,100);s=act(s,'all',0);assert.equal(s.ended,true);assert.deepEqual(s.enemies,[0,0]);assert.deepEqual(act(s,'Fogo',0),s)});
test('resistência reduz dano e permite resposta inimiga',()=>{const s=act(initialBattle(),'Gelo',0);assert.equal(s.enemies[0],92);assert.equal(s.hp,82);assert.equal(s.turn,2)});
test('repetir fraqueza em alvo caído não gera cadeia infinita',()=>{let s=act(initialBattle(),'Fogo',0);s=act(s,'Fogo',0);assert.equal(s.hp,82);assert.deepEqual(s.down,[false,false])});
test('SP insuficiente, cura cheia e ataque conjunto bloqueado não alteram estado',()=>{const s=initialBattle();assert.deepEqual(act(s,'all',0),s);assert.deepEqual(act(s,'heal',0),s);assert.deepEqual(act({...s,sp:0},'Fogo',0),{...s,sp:0})});
test('defesa reduz resposta e derrota encerra ações',()=>{const s=act({...initialBattle(),hp:5},'guard',0);assert.equal(s.hp,0);assert.equal(s.ended,true);assert.deepEqual(act(s,'heal',0),s)});
test('cura custa SP, respeita máximo de HP e consome turno',()=>{const s=act({...initialBattle(),hp:90},'heal',0);assert.equal(s.hp,82);assert.equal(s.sp,26);assert.equal(s.turn,2)});
