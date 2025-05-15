import { baseTest } from '../../../utils/baseTest.js';
import { safeClick, safeSendKeys, safeFindElement } from '../../../utils/helpers.js';
import { By, until } from 'selenium-webdriver';
import { expect } from 'chai';

baseTest('Login failed using wrong password', async (driver) => {
  await driver.get('https://www.saucedemo.com'); // Visit URL

  await safeSendKeys(driver, By.id('user-name'), 'standard_user'); // Input username
  await safeSendKeys(driver, By.id('password'), 'osi_admin'); // Input password
  await safeClick(driver, By.id('login-button')); // Click button Login

  const errorElement = await safeFindElement(driver, By.css('[data-test="error"]'), 10000);

  // Verifikasi apakah teks error sesuai menggunakan expect
  const errorText = await errorElement.getText();
  expect(errorText).to.include('Epic sadface: Username and password do not match any user in this service'); // Assertion dengan expect
});
