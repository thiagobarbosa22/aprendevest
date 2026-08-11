import { expect, test } from "@playwright/test";

test("visitante encontra as áreas acadêmicas", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Organize seus estudos",
  );
  await page.getByRole("link", { name: "Matérias" }).click();
  await expect(page).toHaveURL(/\/materias/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("navegação por teclado expõe o salto para conteúdo", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /pular para o conteúdo/i }),
  ).toBeFocused();
});

test("simulados explicam autosave e levam ao fluxo autenticado", async ({
  page,
}) => {
  await page.goto("/simulados");
  await expect(page.getByText("Autosave e retomada")).toBeVisible();
  await page.getByRole("link", { name: "Criar simulado" }).click();
  await expect(page).toHaveURL(/\/entrar/);
});

test("redação informa privacidade e correção humana", async ({ page }) => {
  await page.goto("/redacao");
  await expect(
    page.getByRole("heading", { name: /escreva, revise/i }),
  ).toBeVisible();
  await expect(page.getByText(/correção humana/i).first()).toBeVisible();
  await page.getByRole("link", { name: "Começar redação" }).click();
  await expect(page).toHaveURL(/\/entrar/);
});
