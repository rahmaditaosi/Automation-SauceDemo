import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export async function createDriver() {
  const options = new chrome.Options();

  // Nonaktifkan fitur password manager dan pop-up simpan sandi
  options.setUserPreferences({
    'credentials_enable_service': false,
    'profile.password_manager_enabled': false
  });

  options.addArguments(
    '--disable-save-password-bubble',
    '--disable-infobars',
    'incognito',
    '--disable-extensions',
    '--start-maximized',
    '--headless=new',
  );

  return await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}
