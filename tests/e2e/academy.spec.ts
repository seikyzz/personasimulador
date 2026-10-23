import { test, expect, Page } from "@playwright/test";
async function edition(page: Page, name: string) {
  await page.getByRole("button", { name, exact: true }).click();
}
async function answerLab(page: Page, answers: number[]) {
  for (let i = 0; i < 4; i++) {
    await page.locator(".answer-options>button").nth(answers[i]).click();
    await page
      .getByRole("button", {
        name: i === 3 ? "Ver meu diagnóstico" : "Próxima situação",
      })
      .click();
  }
}
test("início guia ao combate, imagens reais carregam e critério exige ação", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Começar do zero" }).click();
  await expect(page.locator(".mission-objective")).toContainText("Analise");
  await page.getByRole("button", { name: "Começar encontro" }).click();
  await expect
    .poll(() =>
      page
        .locator(".combat-enemy img")
        .first()
        .evaluate((e: HTMLImageElement) => e.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(
    page.getByRole("button", { name: "All-Out Attack", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Analisar este alvo" }).click();
  await expect(page.locator(".affinity-readout")).toContainText("Fogo");
  await page.getByLabel("Persona equipada").selectOption("jack-o-lantern");
  await page.getByRole("button", { name: "Agi 4 SP", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("1 MORE");
  await page.getByRole("button", { name: "Agi 4 SP", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Você demonstrou a habilidade." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Agi 4 SP", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(
    page.getByRole("button", { name: "Começar encontro" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("erros têm feedback e equipe mantém progresso por edição", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Minha equipe", exact: true }).click();
  await page
    .getByRole("button", { name: "Entendi o objetivo. Quero praticar" })
    .click();
  await page.locator(".answer-options>button").nth(0).click();
  await expect(page.getByRole("status")).toContainText("não define");
  await answerLab(page, [1, 1, 0, 2]);
  await expect(page.getByRole("status")).toContainText("3/4");
  await page
    .getByRole("button", { name: "Adicionar ao grupo" })
    .first()
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Minha equipe", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "No grupo · remover" }),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "Velvet Academy início" }).click();
  await expect(page.locator(".path-item.passed")).toHaveCount(1);
  await edition(page, "Persona 3 RELOAD");
  await expect(page.locator(".path-item.passed")).toHaveCount(0);
});
test("fusão exige decisões e deixa claro que não calcula receitas", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Laboratório de fusão", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Entendi o objetivo. Quero praticar" })
    .click();
  await answerLab(page, [0, 1, 2, 0]);
  await expect(page.getByRole("status")).toContainText("4/4");
  await page.locator(".extra-lab>summary").click();
  await expect(
    page.getByText("não uma calculadora", { exact: false }),
  ).toBeVisible();
});
test("conversa usa personagem escolhido, feedback e não expõe eventos", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Treino de vínculos", exact: true })
    .click();
  await page.getByRole("button", { name: /Yukiko P4 GOLDEN/ }).click();
  await expect(page.locator(".social-cast button.selected")).toContainText(
    "Yukiko",
  );
  await page
    .getByRole("button", { name: "Iniciar conversa de treino" })
    .click();
  await expect
    .poll(() =>
      page
        .locator(".social-portrait")
        .evaluate((e: HTMLImageElement) => e.naturalWidth),
    )
    .toBeGreaterThan(0);
  for (const [stage, answer] of [0, 1, 2, 0].entries()) {
    await page.locator(".dialogue-choices>button").nth(answer).click();
    await expect(page.getByRole("status")).toContainText("Leitura consistente");
    await page
      .getByRole("button", {
        name: stage === 3 ? "Ver revisão" : "Continuar",
        exact: true,
      })
      .click();
  }
  await expect(page.getByRole("status")).toContainText("4/4");
  await expect(page.getByRole("status")).toContainText("Nenhum rank real");
});
test("Persona 2 nunca oferece 1 More ou Social Links modernos", async ({
  page,
}) => {
  await page.goto("/");
  await edition(page, "Persona 2 IS / EP");
  await page.getByRole("button", { name: "Começar do zero" }).click();
  await expect(
    page.getByRole("button", { name: "All-Out Attack" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Entendi o objetivo. Quero praticar" })
    .click();
  await answerLab(page, [1, 2, 0, 1]);
  await expect(page.getByRole("status")).toContainText("4/4");
  await page
    .getByRole("button", { name: "Treino de vínculos", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Contatos, não Social Links." }),
  ).toBeVisible();
});
test("quatro layouts no desktop e no celular, sem overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, id] of [
      ["Persona 5 ROYAL", "p5"],
      ["Persona 3 RELOAD", "p3"],
      ["Persona 4 GOLDEN", "p4"],
      ["Persona 2 IS / EP", "p2"],
    ]) {
      await edition(page, name);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBeTruthy();
      await page.screenshot({
        path: `/workspace/academy-${id}-${width}.png`,
        fullPage: true,
      });
    }
  }
});
test("batalha e conversa cabem no celular com todas as edições", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const name of [
    "Persona 5 ROYAL",
    "Persona 3 RELOAD",
    "Persona 4 GOLDEN",
  ]) {
    await edition(page, name);
    await page
      .getByRole("button", { name: "Simulador de batalha", exact: true })
      .click();
    await page.locator(".mission-tabs button").nth(2).click();
    await page.getByRole("button", { name: "Começar encontro" }).click();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBeTruthy();
    await page
      .getByRole("button", { name: "Treino de vínculos", exact: true })
      .click();
    if (name !== "Persona 5 ROYAL") {
      await page
        .getByRole("button", { name: "Iniciar conversa de treino" })
        .click();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBeTruthy();
    }
  }
});

test("prova de Royal permite concluir vínculos sem mudar de edição", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Treino de vínculos", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Entendi o objetivo. Quero praticar" })
    .click();
  await answerLab(page, [1, 0, 2, 1]);
  await expect(page.getByRole("status")).toContainText("4/4");
  await page.getByRole("button", { name: "Velvet Academy início" }).click();
  await expect(page.locator(".path-item.passed")).toContainText(
    "Treine os vínculos",
  );
});
