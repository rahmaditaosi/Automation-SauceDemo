import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import 'chromedriver'; // This ensures the ChromeDriver is available
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Creates and configures a WebDriver instance for Chrome
 * @returns {Promise<WebDriver>} The configured WebDriver instance
 */
export async function createDriver() {
  try {
    console.log('Starting to create WebDriver...');
    console.log(`Operating System: ${os.platform()} ${os.release()}`);
    
    // Create a temporary directory for Chrome user data
    const tempUserDataDir = path.join(os.tmpdir(), `chrome-profile-${Date.now()}`);
    try {
      fs.mkdirSync(tempUserDataDir, { recursive: true });
      console.log(`Created temp directory: ${tempUserDataDir}`);
    } catch (error) {
      console.warn(`Could not create temp directory: ${error.message}`);
    }
    
    // Set up Chrome options
    const options = new chrome.Options();
    
    // Basic arguments for stability
    options.addArguments('--disable-extensions');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('incognito');
    options.addArguments('--headless');
    
    // Set window size to avoid layout issues
    options.addArguments('--window-size=1920,1080');
    
    // Build and return the WebDriver with detailed logging
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    console.log('Successfully created WebDriver instance');
    return driver;
  } catch (error) {
    console.error('Failed to create WebDriver:', error);
    if (error.message.includes('ChromeDriver')) {
      console.error('ChromeDriver error. Check if Chrome and ChromeDriver versions match.');
    }
    if (error.message.includes('permission')) {
      console.error('Possible permission issues with Chrome or directories.');
    }
    throw error;
  }
}