import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';

export async function safeFindElement(driver, locator, timeout = 10000, screenshotOnFail = true) {
  const screenshotFolder = './screenshots'; // Folder tempat screenshot disimpan

  // Pastikan folder sudah ada
  if (!fs.existsSync(screenshotFolder)) {
    fs.mkdirSync(screenshotFolder, { recursive: true });
  }

  try {
    const element = await driver.wait(until.elementLocated(locator), timeout);
    return element; // Kembalikan element yang ditemukan
  } catch (err) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, screenshotFolder); // Ambil screenshot jika gagal
    }
    // Lempar error yang sesuai dengan pesan yang lebih informatif
    throw new Error(`❌ Gagal mencari element dengan locator: ${locator.toString()}. Error: ${err.message}`);
  }
}

export async function safeClick(driver, locator, timeout = 10000, screenshotOnFail = true) {
  const screenshotFolder = './screenshots'; // Folder tempat screenshot disimpan

  // Pastikan folder sudah ada
  if (!fs.existsSync(screenshotFolder)) {
    fs.mkdirSync(screenshotFolder, { recursive: true });
  }

  try {
    const element = await safeFindElement(driver, locator, timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    await driver.wait(until.elementIsEnabled(element), timeout);

    // Jika elemen valid, lakukan klik
    await element.click();

  } catch (err) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, screenshotFolder); // Ambil screenshot jika gagal
    }
    // Lempar error yang lebih jelas dengan informasi lebih lengkap
    throw new Error(`❌ Gagal klik element dengan locator: ${locator.toString()}. Error: ${err.message}`);
  }
}

export async function safeSendKeys(driver, locator, text, timeout = 10000, screenshotOnFail = true) {
  const screenshotFolder = './screenshots'; // Folder tempat screenshot disimpan

  // Pastikan folder sudah ada
  if (!fs.existsSync(screenshotFolder)) {
    fs.mkdirSync(screenshotFolder, { recursive: true });
  }

  try {
    const element = await safeFindElement(driver, locator, timeout);
    await element.clear();
    // Jika elemen valid, kirimkan teks ke elemen
    await element.sendKeys(text);

  } catch (err) {
    if (screenshotOnFail) {
      await captureScreenshot(driver, screenshotFolder); // Ambil screenshot jika gagal
    }
    // Lempar error yang lebih jelas dengan informasi lebih lengkap
    throw new Error(`❌ Gagal isi teks ke element dengan locator: ${locator.toString()}. Error: ${err.message}`);
  }
}

export async function captureScreenshot(driver, folder = './screenshots') {
  if (typeof driver.takeScreenshot !== 'function') {
    console.error('❌ driver.takeScreenshot is not a function. Mungkin driver salah?');
    return;
  }

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const screenshot = await driver.takeScreenshot();
  const filename = `error-${Date.now()}.png`;
  const filepath = path.join(folder, filename);

  fs.writeFileSync(filepath, screenshot, 'base64');
  console.log(`📸 Screenshot disimpan di ${filepath}`);

  return filepath;
}


export async function loginSuccess(driver, username, password) {
  await driver.get('https://saucedemo.com');
  await safeSendKeys(driver, By.id('user-name'), username);
  await safeSendKeys(driver, By.id('password'), password);
  await safeClick(driver, By.id('login-button'));
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



