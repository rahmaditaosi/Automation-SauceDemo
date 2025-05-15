import { baseTest } from '../../../utils/baseTest.js';
import { safeClick, safeSendKeys, safeFindElement } from '../../../utils/helpers.js';
import { By, until } from 'selenium-webdriver';
import { expect } from 'chai';

baseTest('Login successful with glitch_user', async (driver) => {
  await driver.get('https://www.saucedemo.com'); // Visit URL

  await safeSendKeys(driver, By.id('user-name'), 'performance_glitch_user'); // Input username
  await safeSendKeys(driver, By.id('password'), 'secret_sauce'); // Input password
  await safeClick(driver, By.id('login-button')); // Click button Login

  // Verify successful login by checking for inventory container
  await safeFindElement(driver, By.id('inventory_container'), 15000);

  await driver.wait(until.urlContains('inventory'), 10000); // Wait for URL to contain 'inventory'

  // Check for element + contains text
  const appLogo = await safeFindElement(driver, By.css('.app_logo'));
  const appLogoText = await appLogo.getText();
  expect(appLogoText).to.include('Swag Labs'); // Assertion to check text

  const title = await safeFindElement(driver, By.css('.title'));
  const titleText = await title.getText();
  expect(titleText).to.include('Products'); // Assertion to check text
});