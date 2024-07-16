import {expect, test} from "@playwright/test";
import { LoginPage } from "../page-objects/loginPage";

test.beforeEach(async({page})=>{
    await page.goto("https://staging.snaptru.de/login");
})

test("Ensure page is loaded without any issue", async({page})=>{
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot();
})

test("Ensure user is warned on entering invalid email OR no email address in email field", async({page})=>{
    const invalidEmail = "testmail";
    const testPassword = "testpassword";
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
    const validIds = {email: "Test@testmail.com", password: "test-password", workspaceName: "Enter your workspace name as shown in snaptrude dashboard"}
    const loginPage = new LoginPage(page);

    loginPage.login(validIds.email, validIds.password);
    await page.waitForLoadState("networkidle");
    
    //assert valid workspace name to ensure the user was able to login to correct workspace
    const workspaceName = page.getByText(validIds.workspaceName);
    expect(await workspaceName.isVisible()).toBeTruthy();
})

test("Ensure user not found error is shown on entering incorrect email", async({page})=>{
    //test data object
    const incorrectIds = {email: "test@testmail.com", password: "12345678", errorMessage: "User not foundSign Up"}

    const loginpage = new LoginPage(page);

    const signUpLink = "/signup";
    const homePageURL = "https://www.snaptrude.com/";
    const homePageTitle = "Snaptrude | Design better buildings together";

    loginpage.login(incorrectIds.email, incorrectIds.password);

    //user not found error on entering incorrect email address
    const signUp =  page.getByRole('link', { name: 'Sign Up' });
    expect(await page.locator('.login-error').textContent()).toEqual(incorrectIds.errorMessage);
    expect(await signUp.getAttribute("href")).toBe(signUpLink);

    //user is able to navigate to home page using the sign up link (this could be a bug - need to report user should be taken to get started)
    await signUp.click();
    await page.waitForURL(homePageURL);
    expect(await page.title()).toBe(homePageTitle);
})