import { expect } from 'chai';
import { baseTest } from '../../../utils/baseTest.js';
import { loginSuccess, safeClick, safeFindElement, safeFindElements, safeGetText, sleep } from '../../../utils/helpers.js';
import { By, until } from 'selenium-webdriver';

baseTest('Retrieve all data products', async (driver) => {
  await loginSuccess(driver, 'standard_user', 'secret_sauce');
  await safeFindElement(driver, By.css('.inventory_container'), 10000);
  const products = await safeFindElements(driver, By.css('[data-test="inventory-item"]'), 10000);
  expect(products.length).to.be.greaterThan(0);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    //name
    const productName = await safeGetText(driver, By.css('.inventory_item_name'), 10000);
    expect(productName.length).to.be.greaterThan(0);

    //description
    const productDesc = await safeGetText(driver, By.css('.inventory_item_desc'), 10000);
    expect(productDesc.length).to.be.greaterThan(0);

    //price
    const productPrice = await safeGetText(driver, By.css('.inventory_item_price'), 10000);
    expect(productPrice.length).to.be.greaterThan(0);

    //button
    const productButton = await safeGetText(driver, By.css('button[id^="add-to-cart"]'), 10000);
    expect(productButton).to.equal('Add to cart');
  }
});

// baseTest('Retrieve all detail data products', async (driver) => {
//   await loginSuccess(driver, 'standard_user', 'secret_sauce');
//   await safeFindElement(driver, By.css('.inventory_container'), 10000);
//   const products = await safeFindElements(driver, By.css('[data-test="inventory-item"]'), 10000); // Get All products

//   for (let i = 0; i < products.length; i++) {

//     if (i > 0) {
//       const currentProducts = await safeFindElements(driver, By.css('[data-test="inventory-item"]'), 10000);
//       const currentProduct = currentProducts[i];

//       // Click on the product name within the specific product context
//       const productLink = await currentProduct.findElement(By.css('.inventory_item_name'));
//       await productLink.click();
//     } else {
//       const product = products[i];

//       // Click on the product name within the specific product context
//       const productLink = await product.findElement(By.css('.inventory_item_name'));
//       await productLink.click();
//     }

//     // Wait for detail page
//     await safeFindElement(driver, By.css('.inventory_details'), 10000);

//     //name
//     const detailName = await safeGetText(driver, By.css('.inventory_details_name'), 10000);
//     expect(detailName.length).to.be.greaterThan(0);

//     //description
//     const detailDesc = await safeGetText(driver, By.css('.inventory_details_desc'), 10000);
//     expect(detailDesc.length).to.be.greaterThan(0);

//     //price
//     const detailPrice = await safeGetText(driver, By.css('.inventory_details_price'), 10000);
//     expect(detailPrice.length).to.be.greaterThan(0);

//     //button
//     const productButton = await safeGetText(driver, By.css('button[id^="add-to-cart"]'), 10000);
//     expect(productButton).to.equal('Add to cart');
//   }
// });

