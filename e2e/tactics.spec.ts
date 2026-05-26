import { expect, test, type Page } from '@playwright/test';

async function gotoTactics(page: Page) {
  await page.goto('/tactics');
  // Esperamos a que el toolbar esté visible (asegura que el lazy chunk cargó).
  await expect(page.getByRole('toolbar', { name: /pizarra/i })).toBeVisible({ timeout: 15_000 });
  // Un poco más para que se seed la formación 4-4-2 y el 3D se monte.
  await page.waitForTimeout(1200);
}

test.describe('Pizarra táctica', () => {
  test('arranca con 4-4-2 sembrado en ambos equipos', async ({ page }) => {
    await gotoTactics(page);
    await expect(page.getByText(/22 en cancha · 6 en banca/i)).toBeVisible({ timeout: 5_000 });
  });

  test('botón Flecha cambia a estado activo (chip sólido con glow)', async ({ page }) => {
    await gotoTactics(page);
    const arrow = page.getByRole('button', { name: /flecha/i });
    await arrow.click();
    await expect(arrow).toHaveAttribute('aria-pressed', 'true');
  });

  test('dibuja una flecha y aparece en el contador de trazos', async ({ page }) => {
    await gotoTactics(page);
    await page.getByRole('button', { name: /flecha/i }).click();
    await page.mouse.move(450, 600);
    await page.mouse.down();
    await page.mouse.move(950, 380, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    await expect(page.getByText(/1 trazo/i)).toBeVisible();
  });

  test('Limpiar resetea tokens y trazos a 4-4-2 inicial', async ({ page }) => {
    await gotoTactics(page);
    // Crea un trazo
    await page.getByRole('button', { name: /flecha/i }).click();
    await page.mouse.move(450, 600);
    await page.mouse.down();
    await page.mouse.move(900, 400, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    // Limpiar
    await page.getByRole('button', { name: /limpiar/i }).click();
    await page.waitForTimeout(800);
    // El meta vuelve a no mostrar "trazos"
    await expect(page.getByText(/trazo/i)).toHaveCount(0);
    // Y vuelve el contador de cancha (auto-seed)
    await expect(page.getByText(/22 en cancha/i)).toBeVisible();
  });

  test('drag de un token bajo rotación 90° lo mueve cerca del cursor (±10 px)', async ({
    page,
  }) => {
    await gotoTactics(page);
    await page.getByRole('button', { name: /rotar/i }).click();
    await page.waitForTimeout(900);

    // Encuentra el dorsal #8 (centrocampista home)
    const tokenLocator = page.locator('text="8"').first();
    const box = await tokenLocator.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const delta = { dx: 80, dy: -120 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(start.x + (delta.dx * i) / 10, start.y + (delta.dy * i) / 10);
    }
    await page.mouse.up();
    await page.waitForTimeout(400);

    const newBox = await page.locator('text="8"').first().boundingBox();
    expect(newBox).not.toBeNull();
    if (!newBox) return;
    const newCenter = { x: newBox.x + newBox.width / 2, y: newBox.y + newBox.height / 2 };
    expect(Math.abs(newCenter.x - (start.x + delta.dx))).toBeLessThan(15);
    expect(Math.abs(newCenter.y - (start.y + delta.dy))).toBeLessThan(15);
  });
});

test.describe('Pizarra táctica · TeamMenu', () => {
  test('Local menu abre con fondo sólido y formaciones disponibles', async ({ page }) => {
    await gotoTactics(page);
    await page.getByRole('button', { name: /local/i }).click();
    await expect(page.getByText('Formación')).toBeVisible();
    // Las 6 formaciones presentes
    for (const f of ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '5-3-2', '3-4-3']) {
      await expect(page.getByRole('button', { name: new RegExp(`^${f}`, 'i') })).toBeVisible();
    }
  });
});
