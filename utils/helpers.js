import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';

// Configuration constants that can be imported and customized
export const DEFAULT_CONFIG = {
  timeout: 10000,
  screenshotFolder: './screenshots',
  screenshotOnFail: true
};

/**
 * Waits for an element to contain specific text
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {By} locator - Element locator
 * @param {string} text - Text to wait for
 * @param {number} timeout - Wait timeout in ms
 * @param {boolean} screenshotOnFail - Whether to take a screenshot on failure
 * @returns {Promise<boolean>} - True if the element contains the text
 */
export async function waitForText(
  driver,
  locator,
  text,
  timeout = DEFAULT_CONFIG.timeout,
  screenshotOnFail = DEFAULT_CONFIG.screenshotOnFail
) {
  try {
    const element = await safeFindElement(driver, locator, timeout, false);
    await driver.wait(
      until.elementTextIs(element, text),
      timeout,
      `Element text did not match "${text}" within ${timeout}ms`
    );
    return true;
  } catch (err) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder);
    }
    throw new Error(`❌ Failed waiting for text "${text}" in element with locator: ${locator.toString()}. Error: ${err.message}`);
  }
}

/**
 * Safely finds an element with better error handling
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {By} locator - Element locator
 * @param {number} timeout - Wait timeout in ms
 * @param {boolean} screenshotOnFail - Whether to take a screenshot on failure
 * @returns {Promise<WebElement>} - The found element
 */
export async function safeFindElement(
  driver,
  locator,
  timeout = DEFAULT_CONFIG.timeout,
  screenshotOnFail = DEFAULT_CONFIG.screenshotOnFail
) {
  try {
    // Wait for the element to be both located and visible
    const element = await driver.wait(
      until.elementLocated(locator),
      timeout,
      `Element not found within ${timeout}ms: ${locator.toString()}`
    );

    await driver.wait(
      until.elementIsVisible(element),
      timeout,
      `Element not visible within ${timeout}ms: ${locator.toString()}`
    );

    return element;
  } catch (err) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder);
    }
    throw new Error(`❌ Failed to find element with locator: ${locator.toString()}. Error: ${err.message}`);
  }
}

/**
 * Safely clicks an element with error handling
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {By} locator - Element locator
 * @param {number} timeout - Wait timeout in ms
 * @param {boolean} screenshotOnFail - Whether to take a screenshot on failure
 * @returns {Promise<void>}
 */
export async function safeClick(
  driver,
  locator,
  timeout = DEFAULT_CONFIG.timeout,
  screenshotOnFail = DEFAULT_CONFIG.screenshotOnFail
) {
  try {
    const element = await safeFindElement(driver, locator, timeout, false);

    // Wait for the element to be enabled before clicking
    await driver.wait(
      until.elementIsEnabled(element),
      timeout,
      `Element not enabled within ${timeout}ms: ${locator.toString()}`
    );

    // Sometimes elements can be covered by other elements, like tooltips or modals
    // Scroll element into view to improve reliability
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);

    // Add a small wait to allow scrolling to complete
    await sleep(200);

    await element.click();
  } catch (err) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder);
    }
    throw new Error(`❌ Failed to click element with locator: ${locator.toString()}. Error: ${err.message}`);
  }
}

/**
 * Safely sends text to an element with error handling
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {By} locator - Element locator
 * @param {string} text - Text to send
 * @param {number} timeout - Wait timeout in ms
 * @param {boolean} screenshotOnFail - Whether to take a screenshot on failure
 * @returns {Promise<void>}
 */
export async function safeSendKeys(
  driver,
  locator,
  text,
  timeout = DEFAULT_CONFIG.timeout,
  screenshotOnFail = DEFAULT_CONFIG.screenshotOnFail
) {
  try {
    const element = await safeFindElement(driver, locator, timeout, false);

    // Clear the field first and wait a bit to ensure it's ready
    await element.clear();
    await sleep(100);

    // Send the text
    await element.sendKeys(text);
  } catch (err) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder);
    }
    throw new Error(`❌ Failed to send text to element with locator: ${locator.toString()}. Error: ${err.message}`);
  }
}

/**
 * Captures a screenshot and saves it to a file
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} folder - Folder to save the screenshot in
 * @returns {Promise<string>} - Path to the saved screenshot
 */
export async function captureScreenshot(driver, folder = DEFAULT_CONFIG.screenshotFolder) {
  try {
    if (typeof driver.takeScreenshot !== 'function') {
      console.error('❌ driver.takeScreenshot is not a function. Check if driver is properly initialized.');
      return null;
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `error-${timestamp}.png`;
    const filepath = path.join(folder, filename);

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(filepath, screenshot, 'base64');
    console.log(`📸 Screenshot saved at ${filepath}`);

    return filepath;
  } catch (err) {
    console.error(`Failed to capture screenshot: ${err.message}`);
    return null;
  }
}

/**
 * Login to SauceDemo website
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @returns {Promise<void>}
 */
export async function loginSuccess(driver, username, password) {
  await driver.get('https://saucedemo.com');

  // Add a wait for page load to improve reliability
  await driver.wait(
    until.titleIs('Swag Labs'),
    DEFAULT_CONFIG.timeout,
    'SauceDemo page did not load correctly'
  );

  await safeSendKeys(driver, By.id('user-name'), username);
  await safeSendKeys(driver, By.id('password'), password);
  await safeClick(driver, By.id('login-button'));

  // Verify login was successful by checking for inventory page
  await driver.wait(
    until.urlContains('/inventory.html'),
    DEFAULT_CONFIG.timeout,
    'Login was not successful, inventory page not loaded'
  );
}

/**
 * Waits for the specified amount of time
 * @param {number} ms - Time to wait in milliseconds
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely finds multiple elements with error handling
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {By} locator - Element locator
 * @param {number} timeout - Wait timeout in ms
 * @param {boolean} screenshotOnFail - Whether to take a screenshot on failure
 * @returns {Promise<WebElement[]>} - Array of found elements
 */
export async function safeFindElements(
  driver,
  locator,
  timeout = DEFAULT_CONFIG.timeout,
  screenshotOnFail = DEFAULT_CONFIG.screenshotOnFail
) {
  try {
    // First, wait for at least one element to be present
    await driver.wait(
      until.elementLocated(locator),
      timeout,
      `No elements found with locator: ${locator.toString()} within ${timeout}ms`
    );

    // Then get all matching elements
    const elements = await driver.findElements(locator);

    if (elements.length === 0) {
      throw new Error(`No elements found with locator: ${locator.toString()}`);
    }

    return elements;
  } catch (err) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder);
    }
    throw new Error(`❌ Failed to find elements with locator: ${locator.toString()}. Error: ${err.message}`);
  }
}

/**
 * Safely gets text from an element with error handling
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {By} locator - Element locator
 * @param {number} timeout - Wait timeout in ms
 * @returns {Promise<string>} - The text content of the element
 */
export async function safeGetText(
  driver,
  locator,
  timeout = DEFAULT_CONFIG.timeout
) {
  const element = await safeFindElement(driver, locator, timeout);
  return element.getText();
}

/**
 * Adds specified number of items to cart and navigates to checkout
 * @param {WebDriver} driver - The Selenium WebDriver instance
 * @param {number} numItems - Number of items to add (default: 1)
 * @param {boolean} screenshotOnFail - Whether to take screenshot on failure (default: true)
 * @returns {Promise<void>}
 */
export async function AddToCart(
  driver,
  numItems = 1,
  screenshotOnFail = DEFAULT_CONFIG.screenshotOnFail
) {
  try {
    // Add specified number of items
    const addButtons = [
      'add-to-cart-sauce-labs-backpack',
      'add-to-cart-sauce-labs-bike-light',
      'add-to-cart-sauce-labs-bolt-t-shirt',
      'add-to-cart-sauce-labs-fleece-jacket'
    ];
    
    for (let i = 0; i < Math.min(numItems, addButtons.length); i++) {
      try {
        await safeClick(driver, By.id(addButtons[i]));
      } catch (buttonError) {
        console.error(`Failed to add item ${addButtons[i]}: ${buttonError.message}`);
        if (screenshotOnFail) {
          await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder, `add-item-failed-${addButtons[i]}`);
        }
        // Continue with next item even if one fails
      }
    }
    
    // Go to cart
    try {
      await safeClick(driver, By.className('shopping_cart_link'));
    } catch (cartError) {
      if (screenshotOnFail) {
        await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder, 'navigate-to-cart-failed');
      }
      throw new Error(`❌ Failed to navigate to shopping cart. Error: ${cartError.message}`);
    }
  } catch (error) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder, 'add-to-cart-function-failed');
    }
    throw new Error(`❌ Error in addToCart function: ${error.message}`);
  }
}

/**
 * Fills checkout information form with error handling
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} firstName - Customer first name
 * @param {string} lastName - Customer last name
 * @param {string} zipCode - Customer zip/postal code
 * @param {boolean} screenshotOnFail - Whether to take screenshot on failure
 * @returns {Promise<void>}
 */
export async function fillCheckoutInfo(
  driver,
  firstName,
  lastName,
  zipCode,
  screenshotOnFail = DEFAULT_CONFIG.screenshotOnFail
) {
  try {
    // Fill first name field
    try {
      await safeSendKeys(driver, By.id('first-name'), firstName);
    } catch (firstNameError) {
      if (screenshotOnFail) {
        await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder, 'fill-first-name-failed');
      }
      throw new Error(`❌ Failed to fill first name field. Error: ${firstNameError.message}`);
    }

    // Fill last name field
    try {
      await safeSendKeys(driver, By.id('last-name'), lastName);
    } catch (lastNameError) {
      if (screenshotOnFail) {
        await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder, 'fill-last-name-failed');
      }
      throw new Error(`❌ Failed to fill last name field. Error: ${lastNameError.message}`);
    }

    // Fill zip code field
    try {
      await safeSendKeys(driver, By.id('postal-code'), zipCode);
    } catch (zipCodeError) {
      if (screenshotOnFail) {
        await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder, 'fill-zip-code-failed');
      }
      throw new Error(`❌ Failed to fill zip code field. Error: ${zipCodeError.message}`);
    }

    // Click continue button
    try {
      await safeClick(driver, By.id('continue'));
    } catch (continueError) {
      if (screenshotOnFail) {
        await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder, 'click-continue-failed');
      }
      throw new Error(`❌ Failed to click continue button. Error: ${continueError.message}`);
    }
  } catch (error) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, DEFAULT_CONFIG.screenshotFolder, 'fill-checkout-info-failed');
    }
    throw new Error(`❌ Error in fillCheckoutInfo function: ${error.message}`);
  }
}