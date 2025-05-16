import { expect } from 'chai';
import { baseTest } from '../../../utils/baseTest.js';
import { loginSuccess, safeClick, safeFindElement } from '../../../utils/helpers.js';
import { By, until } from 'selenium-webdriver';

baseTest('Sorting all data products from Price low to high', async (driver) => {
  await loginSuccess(driver, 'standard_user', 'secret_sauce'); // login
  await safeClick(driver, By.css('.product_sort_container'));
  let priceLowToHighOption = await safeFindElement(driver, By.css('option[value="lohi"]'));
  await priceLowToHighOption.click();

  // Ambil semua elemen yang memiliki harga
  const prices = await driver.findElements(By.css('.inventory_item .inventory_item_price'));

  // Ambil harga dari product pertama dan kedua
  const firstProductPriceText = await prices[0].getText(); // Menggunakan [0] untuk product pertama
  const secondProductPriceText = await prices[1].getText(); // Menggunakan [1] untuk product kedua

  // Parse harga menjadi angka
  const firstProductPrice = parseFloat(firstProductPriceText.replace('$', ''));
  const secondProductPrice = parseFloat(secondProductPriceText.replace('$', ''));
  expect(firstProductPrice).to.be.below(secondProductPrice);
});
