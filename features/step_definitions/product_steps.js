import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import { By } from 'selenium-webdriver';

Given('I am on the product page', async function () {
    await this.driver.get('https://www.saucedemo.com/');
    await this.driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await this.driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await this.driver.findElement(By.id('login-button')).click();

    const currentUrl = await this.driver.getCurrentUrl();
    assert(
        currentUrl.includes('inventory.html'),
        `Expected to be on product page, but got: ${currentUrl}`
    );
});

When('I view the product list', async function () {
    const productList = await this.driver.wait(
        async () => {
            const elements = await this.driver.findElements(By.className('inventory_item'));
            return elements.length > 0 ? elements : null;
        },
        5000,
        'Product list did not appear within the timeout period'
    );
    this.productList = productList;
});

Then('I should see a list of products displayed', async function () {
    assert(
        this.productList && this.productList.length > 0,
        'Expected to see a list of products, but none were found'
    );
});

When('I Clicked the add to cart button', async function () {
    const addToCartButton = await this.productList[0].findElement(By.xpath("//*[text()='Add to cart']"));
    await addToCartButton.click();

    const cartBadge = await this.driver.findElement(By.css('.shopping_cart_badge'));
    this.cartItemCount = parseInt(await cartBadge.getText(), 10);
});

When('I Clicked the other add to cart button', async function () {
    const addToCartButton = await this.productList[1].findElement(By.xpath("//*[text()='Add to cart']"));
    await addToCartButton.click();

    const cartBadge = await this.driver.findElement(By.css('.shopping_cart_badge'));
    this.cartItemCount = parseInt(await cartBadge.getText(), 10);
});

When('I Clicked the remove button', async function () {
    const removeButton = await this.productList[0].findElement(By.xpath("//*[text()='Remove']"));
    await removeButton.click();

    let cartBadge;
    try {
        cartBadge = await this.driver.findElement(By.css('.shopping_cart_badge'));
        this.cartItemCount = parseInt(await cartBadge.getText(), 10);
    } catch (error) {
        if (error.name === 'NoSuchElementError') {
            this.cartItemCount = 0;
        } else {
            throw error;
        }
    }
});

Then('The number of items in my basket has increased', async function () {
    assert( this.cartItemCount > 0,
        `Expected cart item count to be greater than 0, but got: ${this.cartItemCount}`
    );
});

Then('The number of items in my basket has decreased', async function () {
    // Periksa apakah jumlah item di keranjang adalah 0 atau lebih besar
    assert(
        this.cartItemCount >= 0,
        `Expected cart item count to be 0 or greater, but got: ${this.cartItemCount}`
    );

    // Jika jumlah item adalah 0, pastikan badge keranjang tidak ada
    if (this.cartItemCount === 0) {
        const badgeExists = await this.driver.findElements(By.css('.shopping_cart_badge'));
        assert(
            badgeExists.length === 0,
            'Expected shopping cart badge to be invisible, but it is still visible'
        );
    } else {
        // Jika jumlah item lebih besar dari 0, pastikan badge keranjang menunjukkan jumlah yang benar
        const cartBadge = await this.driver.findElement(By.css('.shopping_cart_badge'));
        const badgeCount = parseInt(await cartBadge.getText(), 10);
        assert.strictEqual(
            badgeCount,
            this.cartItemCount,
            `Expected cart badge count to be ${this.cartItemCount}, but got: ${badgeCount}`
        );
    }
});