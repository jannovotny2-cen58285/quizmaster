import { Given, When, Then } from 'steps/fixture.ts';
import { expect } from '@playwright/test';

Given('numerical question {string} with correct answer {string}', async function () {
  // Otevře testovací stránku s numerickou otázkou
  await this.page.goto('/test-numerical-question');
});

When('I will take question {string}', async function () {
  // Pro testovací účely zůstáváme na /test-numerical-question, není třeba znovu přecházet
});

Then('I see a number input', async function () {
  const input = await this.page.$('input[type="number"]');
  expect(input).not.toBeNull();
});

When('I enter  {string}', async function (answer: string) {
  await this.page.fill('input[type="number"]', answer);
  // Odeslání odpovědi, pokud je potřeba
  await this.page.click('#submit-answer');
});
