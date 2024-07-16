import {Page, expect} from "@playwright/test";

export class DashboardPage{
    readonly page: Page;
    readonly newProject_btn;
    readonly newProject_PopUp;
    readonly unitDescription;

    constructor(page: Page){
        this.page = page;
        this.newProject_btn = this.page.getByRole("button", {name: "New Project"});
        this.newProject_PopUp = this.page.locator("div.gWWbCc");
        this.unitDescription = this.page.getByText("Unit is set to");
    }

    async createNewProject(name: string, unit: string, projectUnit: string){
        await this.page.getByPlaceholder("Enter the name of the project").fill(name);
        await this.page.getByText(unit, {exact: true}).click();
        expect(await this.unitDescription.textContent()).toEqual(`Unit is set to ${projectUnit} (This can be changed later)`);
        await this.page.getByRole("button",{name:"Create"}).click();
    }
}