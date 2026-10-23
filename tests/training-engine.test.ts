import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createRun,
  command,
  scan,
  swap,
  canAll,
  mastered,
  Command,
  PersonaId,
} from "../src/training/engine";
test("análise é grátis e a vitória iniciante exige análise e fraqueza", () => {
  let s = createRun("p5r");
  s = scan(s, 0);
  assert.equal(s.sp, 64);
  s = swap(s, "jack-o-lantern");
  s = command(s, "Agi", 0);
  assert.equal(s.extra, true);
  assert.equal(s.round, 1);
  s = command(s, "Agi", 0);
  assert.equal(s.outcome, "won");
  assert.equal(mastered(s), true);
  assert.equal(command(s, "Dia"), s);
});
test("troca muda a defesa e só é permitida uma vez por rodada", () => {
  let s = swap(createRun("p5r"), "jack-frost");
  assert.equal(swap(s, "jack-o-lantern"), s);
  s = command(s, "Defender");
  assert.equal(s.hp, 180);
  assert.equal(s.switched, false);
  assert.equal(swap(s, "jack-o-lantern").active, "jack-o-lantern");
});
test("All-Out exige alvos derrubados e não garante vitória", () => {
  let s = createRun("p5r", 3);
  assert.equal(command(s, "All-Out Attack"), s);
  s.enemies.forEach((e) => (e.down = true));
  assert.equal(canAll(s), true);
  s = command(s, "All-Out Attack");
  assert.equal(s.outcome, "playing");
  assert.deepEqual(
    s.enemies.map((e) => e.hp),
    [125, 125, 125],
  );
});
test("drenagem cura o alvo e anulação não causa dano", () => {
  let s = createRun("p5r", 1);
  s.enemies[1].hp = 40;
  s = swap(s, "jack-o-lantern");
  s = command(s, "Agi", 1);
  assert.equal(s.enemies[1].hp, 72);
  assert.equal(s.stats.mistakes, 2); // drenagem + resposta de gelo contra a Persona vulnerável
  s = createRun("p5r");
  s = swap(s, "jack-frost");
  s = command(s, "Bufu", 0);
  assert.equal(s.enemies[0].hp, 70);
});
test("sono permanece disponível e Technical só ocorre em Royal", () => {
  for (const game of ["p5r", "p3r", "p4g"] as const) {
    let s = createRun(game);
    s = command(s, "Dormina", 0);
    assert.equal(s.enemies[0].sleep, true);
    s = command(s, "Ataque", 0);
    assert.equal(s.stats.technical, game === "p5r" ? 1 : 0);
    assert.equal(s.enemies[0].sleep, false);
    assert.equal(s.extra, game === "p5r");
  }
});
test("Shift não recebe bônus de Baton Pass e Golden não permite transferência", () => {
  for (const game of ["p5r", "p3r", "p4g"] as const) {
    let s = swap(createRun(game, 1), "jack-o-lantern");
    s = command(s, "Agi", 0);
    const n = command(s, "Passar");
    if (game === "p4g") {
      assert.equal(n, s);
      continue;
    }
    assert.equal(n.active, "jack-frost");
    assert.equal(command(n, "Passar"), n);
    const hit = command(n, "Bufu", 1);
    assert.equal(hit.enemies[1].hp, 115 - (game === "p5r" ? 60 : 48));
  }
});
test("SP insuficiente, magia não equipada e cura com HP cheio são bloqueados", () => {
  let s = createRun("p5r");
  assert.equal(command(s, "Agi"), s);
  assert.equal(command(s, "Dia"), s);
  s.sp = 0;
  assert.equal(command(s, "Tarunda"), s);
  assert.equal(s.sp, 0);
});
test("defesa reduz dano e bloqueia amplificação por fraqueza", () => {
  const plain = command(createRun("p5r", 2), "Ataque", 0);
  const guard = command(createRun("p5r", 2), "Defender");
  assert.ok(guard.hp > plain.hp);
  assert.equal(guard.stats.guard, 1);
});
test("não concede domínio só por vencer", () => {
  const s = createRun("p4g", 3);
  s.outcome = "won";
  assert.equal(mastered(s), false);
  s.stats.guard = 1;
  s.stats.debuff = 1;
  s.stats.weak = 1;
  assert.equal(mastered(s), true);
  s.round = 9;
  assert.equal(mastered(s), false);
});
const paths = {
  p5r: [
    "swap:jack-o-lantern",
    "Agi:0",
    "Defender:0",
    "Agi:0",
    "Passar:0",
    "Bufu:1",
    "Bufu:2",
    "All-Out Attack:0",
    "Bufu:2",
    "Bufu:2",
    "Bufu:1",
    "Ataque:1",
    "Tarunda:0",
    "Ataque:0",
    "Ataque:0",
  ],
  p3r: [
    "swap:jack-o-lantern",
    "Agi:0",
    "Defender:0",
    "Agi:0",
    "swap:jack-frost",
    "Bufu:1",
    "Bufu:2",
    "All-Out Attack:0",
    "Bufu:1",
    "Bufu:2",
    "Bufu:1",
    "Bufu:2",
    "Tarunda:0",
    "Ataque:0",
    "Ataque:0",
  ],
  p4g: [
    "swap:jack-frost",
    "Bufu:1",
    "Defender:0",
    "Bufu:1",
    "swap:jack-o-lantern",
    "Agi:0",
    "Agi:2",
    "All-Out Attack:0",
    "Agi:0",
    "Agi:2",
    "Agi:0",
    "Agi:2",
    "Tarunda:0",
    "Ataque:1",
    "Ataque:1",
  ],
};
for (const game of ["p5r", "p3r", "p4g"] as const)
  test(`prova avançada vencível em ${game} com critérios reais de aprovação`, () => {
    let s = createRun(game, 3);
    for (const step of paths[game]) {
      const [a, t] = step.split(":");
      s =
        a === "swap"
          ? swap(s, t as PersonaId)
          : command(s, a as Command, Number(t));
    }
    assert.equal(s.outcome, "won");
    assert.equal(mastered(s), true);
    assert.ok(s.hp >= 60);
    assert.ok(s.sp >= 0);
  });

test("Technical não atravessa anulação e derrota bloqueia comandos", () => {
  let s = swap(createRun("p5r"), "jack-frost");
  s = command(s, "Dormina", 0);
  s = command(s, "Bufu", 0);
  assert.equal(s.stats.technical, 0);
  assert.equal(s.enemies[0].hp, 70);
  assert.equal(s.extra, false);
  s = createRun("p5r", 3);
  s.hp = 1;
  s = command(s, "Ataque", 0);
  assert.equal(s.outcome, "lost");
  assert.equal(command(s, "Dia"), s);
});
