import {expect, test} from "@playwright/test";
import { LoginPage } from "../page-objects/loginPage";
import testData from "../test-data/testData.json"

test.beforeEach(async({page})=>{
    await page.goto("https://staging.snaptru.de/login");
})

test("Ensure page is loaded without any issue", async({page})=>{
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot();
})

test("Ensure user is warned on entering invalid email OR no email address in email field", async({page})=>{
    const invalidEmail = testData.invalidCredentials.email;
    const testPassword = testData.invalidCredentials.password;
    const loginPanel = page.locator("div.cphggK");

    const loginPage = new LoginPage(page);
    loginPage.forceLogin("",testPassword);
    //assert "Email required" error is shown right above the email address field on providing empty email address
    await expect(loginPanel).toHaveScreenshot();
    expect(await loginPanel.getByAltText("Art").isVisible()).toBeTruthy();
    
    loginPage.forceLogin(invalidEmail, testPassword);
    //assert "Invalid email error is shown right above the email address field on providing invalid email address"
    await expect(loginPanel).toHaveScreenshot();
    expect(await loginPanel.getByText("Invalid email").isVisible()).toBeTruthy();
})

test("User is able to login with valid credentials", async({page})=>{
    //test data objects please provide valie email address before testing
    const email = testData.validCredentials.email;
    const password = testData.validCredentials.password;
    const workspace = testData.validCredentials.workspaceName;
    const loginPage = new LoginPage(page);

    loginPage.login(email, password);

    await page.waitForLoadState("networkidle");
    
    //assert valid workspace name to ensure the user was able to login to correct workspace
    const workspaceName = page.getByText(workspace);
    expect(await workspaceName.isVisible()).toBeTruthy();
})

test("Ensure user not found error is shown on entering incorrect email", async({page})=>{
    const email = testData.incorrectCredentials.email;
    const password = testData.incorrectCredentials.password;
    const errorMessage = testData.incorrectCredentials.errorMessage;
    const loginpage = new LoginPage(page);

    const signUpLink = "/signup";
    const homePageURL = "https://www.snaptrude.com/";
    const homePageTitle = "Snaptrude | Design better buildings together";

    loginpage.login(email, password);

    //user not found error on entering incorrect email address
    const signUp =  page.getByRole('link', { name: 'Sign Up' });
    expect(await page.locator('.login-error').textContent()).toEqual(errorMessage);
    expect(await signUp.getAttribute("href")).toBe(signUpLink);

    //user is able to navigate to home page using the sign up link (this could be a bug - need to report user should be taken to get started)
    await signUp.click();
    await page.waitForURL(homePageURL);
    expect(await page.title()).toBe(homePageTitle);
})