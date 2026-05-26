import { expect, test } from '@playwright/test';

test.describe('Landing page', () => {
  test('renderiza el hero con countdown y los CTAs principales', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Xpendia|Mundial/i);

    // Hero + tagline editorial
    await expect(page.getByText(/El Mundial no se mira/i)).toBeVisible();

    // Bento tiles (Dos oficios)
    await expect(page.getByText('Para el fan')).toBeVisible();
    await expect(page.getByText('Para el técnico')).toBeVisible();

    // Pizarra showcase
    await expect(page.getByText(/Pizarra Táctica 3D/i)).toBeVisible();
  });

  test('navegación de top nav muestra Selecciones, Pizarra, Ajustes (sin Studio)', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Selecciones' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pizarra' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ajustes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Studio' })).toHaveCount(0);
  });

  test('groups board muestra los 12 grupos', async ({ page }) => {
    await page.goto('/');
    for (const g of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']) {
      await expect(page.getByText(`Grupo ${g}`, { exact: true })).toBeVisible();
    }
  });
});
