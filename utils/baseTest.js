import { createDriver } from './driver.js';

export function baseTest(title, testFn) {
    describe(title, function () {
        let driver;

        beforeEach(async function () {
            try {
                driver = await createDriver();
            } catch (err) {
                console.error('❌ Gagal createDriver di before hook:', err);
                throw err;
            }
        });

        afterEach(async function () {
            if (driver) {
                try {
                    await driver.quit();
                } catch (err) {
                    console.error('❌ Gagal quit di after hook:', err);
                    throw err;
                }
            }
        });

        it(title, async function () {
            try {
                if(!driver) {
                    throw new Error('Driver tidak tersedia untuk pengujian!')
                }
                // Jalankan fungsi test yang diberikan dengan driver
                await testFn(driver);
            } catch (error) {
                console.error('Test failed with error:', error);
                throw error;
            }
        });
    });
}
