import loginPage from '../pageobjects/login.page.js';
import homePage from '../pageobjects/home.page.js';

describe('My Login application', () => {
    beforeEach(async () => {
        await loginPage.open();
    });

    it('Valid Login', async () => {
        await loginPage.fillLoginForm('standard_user', 'secret_sauce');
        await loginPage.assertLoginDataIsRepresentedITheField('standard_user', 'secret_sauce');
        await loginPage.btnLogin.click();
        await homePage.assertUserLoggedIn();
    });

    it('Login with invalid password', async () => {
        await loginPage.fillLoginForm('standard_user', 'secret500');
        await loginPage.assertLoginDataIsRepresentedITheField('standard_user', 'secret500');
        await loginPage.btnLogin.click();
        await loginPage.assertFieldValidationFor(loginPage.inputUsername);
        await loginPage.assertFieldValidationFor(loginPage.inputPassword);
        await loginPage.assertLoginError(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    it('Login with invalid login', async () => {
        await loginPage.login('standarD_user', 'secret_sauce');
        await loginPage.assertLoginDataIsRepresentedITheField('standarD_user', 'secret_sauce');
        await loginPage.assertFieldValidationFor(loginPage.inputUsername);
        await loginPage.assertFieldValidationFor(loginPage.inputPassword);
        await loginPage.assertLoginError(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    it('Logout', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await homePage.openMenu();
        await homePage.assertSidebarIsVisibleAndAmountOfItemsIs(4);
        await homePage.logout();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');
        await loginPage.assertEmptyFields(loginPage.inputUsername);
        await loginPage.assertEmptyFields(loginPage.inputPassword);
    });
});

