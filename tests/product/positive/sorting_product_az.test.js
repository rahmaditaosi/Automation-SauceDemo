import { expect } from 'chai';
import { baseTest } from '../../../utils/baseTest.js';
import { loginSuccess, safeClick, safeFindElement, safeFindElements } from '../../../utils/helpers.js';
import { By, until } from 'selenium-webdriver';

baseTest('Sorting all data products from A to Z', async (driver) => {
  await loginSuccess(driver, 'standard_user', 'secret_sauce'); // login
  await safeClick(driver, By.css('.product_sort_container'));
  await safeClick(driver, By.css('option[value="az"]'), 10000);

  // Ambil semua elemen yang memiliki nama
  const nameElements = await safeFindElements(driver, By.css('.inventory_item .inventory_item_name'), 10000);

  // Extract names
  const names = await Promise.all(
    nameElements.map(async (element) => {
      return await element.getText();
    })
  );

  // Verify that all names are in alphabetical order
  const sortedNames = [...names].sort();
  for (let i = 0; i < names.length; i++) {
    expect(names[i]).to.equal(sortedNames[i],
      `Name at position ${i} (${names[i]}) should be equal to sorted name at position ${i} (${sortedNames[i]})`);
  }
});
