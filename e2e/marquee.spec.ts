import { expect, test } from './fixtures';

test.describe('Modo Marquesina', () => {
  test('botón abre el modo y muestra empty state cuando no hay media', async ({ page }) => {
    await page.goto('/teams/BRA');
    await page.waitForLoadState('networkidle');

    // El botón "Modo Marquesina" vive a la derecha del TeamHeader.
    const btn = page.getByRole('button', { name: /modo marquesina/i });
    await expect(btn).toBeVisible({ timeout: 5_000 });
    await btn.click();

    // Aparece el dialog modal.
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
    // Tag discreto bottom: "Sin material · {team}" (tras la migración i18n
    // dejamos solo el chip pequeño, no el headline grande original).
    await expect(page.getByText(/Sin material · Brasil/i)).toBeVisible({ timeout: 3_000 });

    // Tiene el iframe de YouTube de fallback como fondo.
    const yt = page.locator('iframe[src*="youtube.com/embed"]');
    await expect(yt).toHaveCount(1);
  });

  test('Esc cierra la marquesina', async ({ page }) => {
    await page.goto('/teams/ARG');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /modo marquesina/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('botón "Salir · Esc" cierra la marquesina', async ({ page }) => {
    await page.goto('/teams/ARG');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /modo marquesina/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: /salir de modo marquesina/i }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
