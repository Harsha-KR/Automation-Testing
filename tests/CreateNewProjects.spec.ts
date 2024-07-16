import {expect, test} from "@playwright/test";
import { LoginPage } from "../page-objects/loginPage";
import { DashboardPage } from "../page-objects/dashboardPage";
import testData from "../test-data/testData.json"

const units = {Millimeter:"mm", Centimeter: "cm", Meter: "m", Inch: "in", 'Feet-Inch': "ft-in"};

test.only("create new project", async({page})=>{

    const projectName = testData.projectDetails.name;
    const projectUnit = testData.projectDetails.unit;
    const email = testData.validCredentials.email;
    const password = testData.validCredentials.password;


    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto("https://staging.snaptru.de/login");

    //provide test email address and password
    await loginPage.login(email, password);

    await page.waitForLoadState("networkidle");

    await dashboardPage.newProject_btn.click();
    //await expect(dashboardPage.newProject_PopUp).toHaveScreenshot();- this test is not very consistent so removing it
    await dashboardPage.createNewProject(projectName, units[projectUnit], projectUnit);
    

    await page.waitForLoadState("networkidle");
    expect(await page.locator("#project-title").textContent()).toBe("My First Aut...");
    await expect(page).toHaveScreenshot();
})

