import {Page} from "@playwright/test"

export class LoginPage{
    readonly page : Page;
    constructor(page: Page){
        this.page = page;
    }

    async login(email: string, password: string){
        await this.page.getByPlaceholder("username@company.com").fill(email);
        await this.page.locator('.sc-gbbtgC [type="password"]').fill(password);
        await this.page.locator('.sc-gbbtgC [type="submit"]:visible').click();
    }

    async forceLogin(email: string, password: string){
        await this.page.getByPlaceholder("username@company.com").fill(email);
        await this.page.locator('.sc-gbbtgC [type="password"]').fill(password);
        await this.page.locator('.sc-gbbtgC [type="submit"]:visible').click({force: true});
    }
}