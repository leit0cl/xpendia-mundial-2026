import { expect, test } from './fixtures';

test.describe('Landing page', () => {
  test('renderiza el hero con countdown y los CTAs principales', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Xpendia|Mundial/i);

    // Hero + tagline editorial
    await expect(page.getByText(/El Mundial no se mira/i)).toBeVisible();

    // Bento tiles (Dos oficios) — los kickers son únicos; "Para el fan"
    // existe también dentro del subtítulo del UseCaseTrio, así que usamos
    // exact match para apuntar al kicker exclusivamente.
    await expect(page.getByText('Para el fan', { exact: true })).toBeVisible();
    await expect(page.getByText('Para el técnico', { exact: true })).toBeVisible();

    // Pizarra showcase
    await expect(page.getByText(/Pizarra Táctica 3D/i)).toBeVisible();
  });

  test('navegación de top nav muestra Selecciones, Pizarra, Ajustes (sin Studio)', async ({
    page,
  }) => {
    await page.goto('/');
    // El nav y el footer tienen ambos links "Selecciones"/"Pizarra táctica"/
    // "Ajustes"; nos limitamos al <banner> (nav superior) para evitar strict
    // mode violations.
    const nav = page.getByRole('banner');
    await expect(nav.getByRole('link', { name: 'Selecciones' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Pizarra' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Ajustes' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Studio' })).toHaveCount(0);
  });

  test('groups board muestra los 12 grupos', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const groupsSection = page.locator('#grupos');
    await expect(groupsSection).toBeVisible();
    // Cada GroupCard expone su letra vía data-group-letter para hooks de test.
    for (const g of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']) {
      await expect(groupsSection.locator(`[data-group-letter="${g}"]`)).toBeVisible();
    }
  });
});
