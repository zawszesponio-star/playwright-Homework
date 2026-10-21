import { test, expect, type Page } from '@playwright/test';

const RabbitInput = 'rabbit';
const CatInput = 'cat';

async function restoreCat(page: Page) {
  await page.goto('/pettypes');
  const catRow = page.locator('tbody tr').nth(0);
  const input = catRow.getByRole('textbox');
  await expect(input).toBeVisible();

  const currentAnimal = await input.inputValue();
  if (currentAnimal !== 'cat') {
    await catRow.getByRole('button', { name: 'Edit', exact: true }).click();
    await expect(page.getByRole('textbox')).toHaveValue(currentAnimal);
    await page.getByRole('textbox').fill('cat');
    await page.getByRole('button', { name: 'Update', exact: true }).click();
    await expect(input).toHaveValue('cat');
  }
}

test.beforeEach( async({page}) => {
  await restoreCat(page);
  await page.goto('/')
})

test('Animal contains values', async ({page}) => {
  await page.getByRole('link', { name: 'Pet Types', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Pet Types', exact: true })).toBeVisible();

  const expectedAnimals = ['cat', 'dog', 'lizard', 'snake', 'bird', 'hamster'];
  const petTypes = page.locator('input[name="pettype_name"]');

  await expect(petTypes).toHaveCount(expectedAnimals.length);

  for (const [index, animal] of expectedAnimals.entries()) {
    await expect(petTypes.nth(index)).toBeVisible();
    await expect(petTypes.nth(index)).toHaveValue(animal);
  }
});

test('Playing with cat', async ({page}) => {
  await page.getByRole('link', { name: 'Pet Types', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Pet Types', exact: true })).toBeVisible();

  const catRow = page.locator('tbody tr').nth(0);
  await expect(catRow.getByRole('textbox')).toHaveValue('cat');

  await catRow.getByRole('button', { name: 'Edit', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Edit Pet Type', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveValue(CatInput);

  await page.getByRole('textbox').fill(RabbitInput);
  await page.getByRole('button', { name: 'Update', exact: true }).click();
  await expect(catRow.getByRole('textbox')).toHaveValue(RabbitInput);

  const rabbitRow = page.locator('tbody tr').nth(0);
  await rabbitRow.getByRole('button', { name: 'Edit', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Edit Pet Type', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveValue(RabbitInput);

  await page.getByRole('textbox').fill(CatInput);
  await page.getByRole('button', { name: 'Update', exact: true }).click();
  await expect(rabbitRow.getByRole('textbox')).toHaveValue(CatInput);

  await expect(page.locator('input[name="pettype_name"]').nth(0)).toHaveValue(CatInput);
  

});
