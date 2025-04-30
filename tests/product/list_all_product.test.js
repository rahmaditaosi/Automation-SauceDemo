import { expect } from 'chai';
import { baseTest } from '../../utils/baseTest.js';
import { loginSuccess, safeClick, safeFindElement, sleep } from '../../utils/helpers.js';
import { By, until } from 'selenium-webdriver';

baseTest('Retrieve all data products', async (driver) => {
  await loginSuccess(driver, 'standard_user', 'secret_sauce');
  const products = await driver.findElements(By.css('[data-test="inventory-item"]'));
  expect(products.length).to.be.greaterThan(0);
});