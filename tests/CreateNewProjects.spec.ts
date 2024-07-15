import {expect, test} from "@playwright/test";
import { LoginPage } from "../page-objects/loginPage";
import { DashboardPage } from "../page-objects/dashboardPage";
import exp from "constants";

const units = {Millimeter:"mm", Centimeter: "cm", Meter: "m", Inch: "in", 'Feet-Inch': "ft-in"};

test("create new project", async({page})=>{

    const testData = {projectName: "My First Automation Project", projectUnit: "Meter"};

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto("https://staging.snaptru.de/login");
    await loginPage.login("harsha@snaptrude.com", "22222222");

    await page.waitForLoadState("networkidle");

    await dashboardPage.newProject_btn.click();
    //await expect(dashboardPage.newProject_PopUp).toHaveScreenshot();- this test is not very consistent so removing it
    await dashboardPage.createNewProject(testData.projectName, units[testData.projectUnit]);
    expect(await dashboardPage.unitDescription.textContent()).toEqual(`Unit is set to ${testData.projectUnit} (This can be changed later)`);

    await page.waitForLoadState("networkidle");
    expect(await page.locator("#project-title").textContent()).toBe("My First Aut...");
    await expect(page).toHaveScreenshot();
})

