import {
  createRun,
  command,
  swap,
  scan,
  mastered,
  kits,
  Run,
  Command,
  PersonaId,
} from "../src/training/engine";
function key(s: Run) {
  return JSON.stringify([
    s.round,
    s.hp,
    s.sp,
    s.active,
    s.switched,
    s.extra,
    s.passed,
    s.buff,
    s.debuff,
    s.enemies.map((e) => [e.hp, e.down, e.sleep, e.charged]),
    s.stats.guard > 0,
    s.stats.debuff > 0,
  ]);
}
for (const game of ["p5r", "p3r", "p4g"] as const) {
  let beam = [{ s: createRun(game, 3), path: [] as string[] }];
  let win;
  const seen = new Set<string>();
  for (let depth = 0; depth < 42 && !win; depth++) {
    let next: typeof beam = [];
    for (const { s, path } of beam) {
      const cand: { s: Run; a: string }[] = [];
      for (const id of ["pixie", "jack-frost", "jack-o-lantern"] as PersonaId[])
        cand.push({ s: swap(s, id), a: "swap:" + id });
      for (const action of [
        kits[s.active],
        "Ataque",
        "Dia",
        "Tarunda",
        "Rakukaja",
        "Dormina",
        "Defender",
        "All-Out Attack",
        "Passar",
      ] as Command[])
        for (
          let i = 0;
          i <
          (action === kits[s.active] ||
          action === "Ataque" ||
          action === "Dormina"
            ? s.enemies.length
            : 1);
          i++
        )
          cand.push({ s: command(s, action, i), a: action + ":" + i });
      for (const { s: n, a } of cand) {
        if (n === s || n.outcome === "lost" || n.round > 8) continue;
        const k = key(n);
        if (seen.has(k)) continue;
        seen.add(k);
        const p = [...path, a];
        if (mastered(n)) {
          win = { s: n, path: p };
          break;
        }
        if (n.outcome === "playing") next.push({ s: n, path: p });
      }
      if (win) break;
    }
    function value(s: Run) {
      return (
        s.enemies.reduce(
          (v, e) => v + (e.max - e.hp) + (e.hp === 0 ? 140 : 0),
          0,
        ) +
        s.hp * 0.65 +
        s.sp * 0.8 -
        s.round * 6 +
        Math.min(1, s.stats.guard) * 45 +
        Math.min(1, s.stats.debuff) * 45
      );
    }
    next.sort((a, b) => value(b.s) - value(a.s));
    beam = next.slice(0, 500);
  }
  console.log(
    game,
    win
      ? JSON.stringify({
          path: win.path,
          hp: win.s.hp,
          sp: win.s.sp,
          round: win.s.round,
        })
      : "NO STRATEGY FOUND",
  );
}
