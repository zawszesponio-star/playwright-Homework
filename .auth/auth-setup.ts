import { chromium, type FullConfig } from '@playwright/test';

const fs = require('fs').promises;
const filePath = '.auth/user.json';

async function browserAuthorize(config: FullConfig){
    const { baseURL, storageState } = config.projects[0].use;
    const email = process.env['EMAIL'];
    const password = process.env['PASSWORD'];
    if (!email?.trim() || !password?.trim()) {
        throw new Error('Uzupelnij EMAIL i PASSWORD w pliku .env w katalogu projektu.');
    }
   
    let user: any;
    try {
        const data = await fs.readFile(filePath);
        user = JSON.parse(data);
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            console.log('User auth file does not exist, creating new file');
            user = { cookies: [], origins: [] };
            await fs.writeFile(filePath, JSON.stringify(user, null, 2));
        } else {
            console.error('Error processing user.json file:', err);
            throw err;
        }
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    await context.addCookies(user.cookies)
    const page = await context.newPage();

    console.log(`\x1b[2m\tSign in started to '${baseURL}'\x1b[0m`);

    const tokenResponsePromise = page.waitForResponse(response =>
        response.url().endsWith('/token') && response.request().method() === 'POST'
    );
    await page.goto(baseURL!)
    if(await page.locator('.login').isVisible()){
        await page.locator('#username').fill(email)
        await page.locator('#password').fill(password)
        await page.getByRole('button', { name: 'Continue' }).click()
    }
    const tokenResponse = await tokenResponsePromise
    const responeJsonBody = await tokenResponse.json()
    const accessToken = responeJsonBody.access_token
    if (!tokenResponse.ok() || !accessToken) {
        await browser.close();
        throw new Error('Logowanie nie zwrocilo tokena. Sprawdz EMAIL i PASSWORD w .env.');
    }
    process.env['ACCESS_TOKEN'] = accessToken

    console.log(`\x1b[2m\tSign in processed\x1b[0m`);

    await page.context().storageState({ path: storageState as string });
    await browser.close();
}

export default browserAuthorize;
