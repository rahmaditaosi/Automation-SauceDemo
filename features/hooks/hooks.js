import { Before, After } from "@cucumber/cucumber";

import { Builder, Capabilities } from 'selenium-webdriver';

const capabilities = Capabilities.chrome();
capabilities.set('chromeoptions', { 'w3c': false });
Before(({tags: '@web'}),function(){
    this.driver = new Builder().withCapabilities(capabilities).build();
})

After(({tags: '@web'}),async function(){
    await this.driver.quit();
})