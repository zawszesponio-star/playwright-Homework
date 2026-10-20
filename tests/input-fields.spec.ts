import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Home page is opened and Welcome message is displayed 1', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
});

test('Home page is opened and Welcome message is displayed 2', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
});

test('Home page is opened and Welcome message is displayed 3', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
}  )