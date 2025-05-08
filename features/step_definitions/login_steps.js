import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'assert';
import { By } from 'selenium-webdriver';

Given('I am on the login page', async function () {
    await this.driver.get('https://www.saucedemo.com/');
});

When('I login with valid credential', async function () {
    await this.driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await this.driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await this.driver.findElement(By.id('login-button')).click();
});

Then('I am logged in', async function () {
    const currentUrl = await this.driver.getCurrentUrl();
    assert(currentUrl.includes('inventory.html'), `Expected to be on inventory page, but got: ${currentUrl}`);
});

When('I login with invalid credential', async function () {
    await this.driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await this.driver.findElement(By.id('password')).sendKeys('secret_sauce_');
    await this.driver.findElement(By.id('login-button')).click();
})

Then('I am not logged in', async function () {
    const errorElement = await this.driver.findElement(By.css('[data-test="error"]'))
    const errorText = await errorElement.getText();
    assert(errorText, `Epic sadface: Username and password do not match any user in this service`);
});
