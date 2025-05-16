import { expect } from 'chai';
import { baseTest } from '../../../utils/baseTest.js';
import { loginSuccess, safeClick, safeFindElement, safeFindElements, safeGetText, sleep } from '../../../utils/helpers.js';
import { By, until } from 'selenium-webdriver';

baseTest('Retrieve all detail data products', async (driver) => {
  await loginSuccess(driver, 'standard_user', 'secret_sauce');
  await safeFindElement(driver, By.css('.inventory_container'), 10000);
  let products = await safeFindElements(driver, By.css('[data-test="inventory-item"]'), 10000); // Get All products

  for (let i = 0; i < products.length; i++) {

    products = await safeFindElements(driver, By.css('[data-test="inventory-item"]'), 10000);
    const product = products[i];

    // Klik nama produk
    const productLink = await product.findElement(By.css('.inventory_item_name'));
    await productLink.click();

    // Wait for detail page
    await safeFindElement(driver, By.css('.inventory_details'), 10000);

    //name
    const detailName = await safeGetText(driver, By.css('.inventory_details_name'), 10000);
    expect(detailName.length).to.be.greaterThan(0);

    //description
    const detailDesc = await safeGetText(driver, By.css('.inventory_details_desc'), 10000);
    expect(detailDesc.length).to.be.greaterThan(0);

    //price
    const detailPrice = await safeGetText(driver, By.css('.inventory_details_price'), 10000);
    expect(detailPrice.length).to.be.greaterThan(0);

    await safeClick(driver, By.css('[data-test="back-to-products"]'), 10000);

  }
});

