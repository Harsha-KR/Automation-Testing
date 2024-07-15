import {Page, ElementHandle} from "@playwright/test";

export class DashboardPage{
    readonly page: Page;
    readonly newProject_btn;
    readonly newProject_PopUp;
    readonly unitDescription;

    constructor(page: Page){
        this.page = page;
        this.newProject_btn = this.page.getByRole("button", {name: "New Project"});
        this.newProject_PopUp = this.page.locator("div.gWWbCc");
        this.unitDescription = this.page.locator(".hxtHnZ");
    }

    async createNewProject(name: string, unit: string){
        await this.newProject_PopUp.getByPlaceholder("Enter the name of the project").fill(name);
        await this.newProject_PopUp.getByText(unit, {exact: true}).click();
        await this.newProject_PopUp.getByRole("button",{name:"Create"}).click();
    }
}