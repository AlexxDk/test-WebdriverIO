import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import HomePage from '../pageobjects/home.page.js';
import CheckoutPage from '../pageobjects/checkout.page.js';

describe('My Login application', () => {
    beforeEach(async () => {
        await LoginPage.open();
    });

    it('Valid Login', async () => {
        await LoginPage.fillLoginForm('standard_user', 'secret_sauce');
        await LoginPage.assertLoginDataIsRepresentedITheField('standard_user', 'secret_sauce');
        await LoginPage.btnLogin.click();
        await HomePage.assertUserLoggedIn();
    });

    it('Login with invalid password', async () => {
        await LoginPage.fillLoginForm('standard_user', 'secret500');
        await LoginPage.assertLoginDataIsRepresentedITheField('standard_user', 'secret500');
        await LoginPage.btnLogin.click();
        await LoginPage.assertFieldValidationFor(LoginPage.inputUsername);
        await LoginPage.assertFieldValidationFor(LoginPage.inputPassword);
        await LoginPage.assertLoginError(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    it('Login with invalid login', async () => {
        await LoginPage.login('standarD_user', 'secret_sauce');
        await LoginPage.assertLoginDataIsRepresentedITheField('standarD_user', 'secret_sauce');
        await LoginPage.assertFieldValidationFor(LoginPage.inputUsername);
        await LoginPage.assertFieldValidationFor(LoginPage.inputPassword);
        await LoginPage.assertLoginError(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    it('Logout', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');
        await HomePage.openMenu();
        await HomePage.assertSidebarIsVisibleAndAmountOfItemsIs(4);
        await HomePage.logout();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');
        await LoginPage.assertEmptyFields(LoginPage.inputUsername);
        await LoginPage.assertEmptyFields(LoginPage.inputPassword);
    });
});

describe('Cart', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login('standard_user', 'secret_sauce');
        await HomePage.assertUserLoggedIn();
    });

    it('Saving the card after logout ', async () => { 
        const productName = await HomePage.productNames[0].getText();
        const currentQuantityInCart = parseInt(await HomePage.shoppingCartBadge.getText(), 10) || 0;

        await HomePage.addToCartButton[0].click();
        const newQuantityInCart = parseInt(await HomePage.shoppingCartBadge.getText(), 10);
        expect(newQuantityInCart).toBe(currentQuantityInCart + 1)

        await HomePage.openMenu();
        await HomePage.assertSidebarIsVisibleAndAmountOfItemsIs(4);

        await HomePage.logout();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');

        await LoginPage.login('standard_user', 'secret_sauce');
        expect(await HomePage.areProductsDisplayed()).toBe(true);

        await HomePage.shoppingCartBadge.click();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        await HomePage.assertCartContains(productName);

        await HomePage.removeButton.click();
      
    });

    it('Sorting', async () => {
        const sortOptions = {
            lowToHigh: 'lohi', // Price (low to high)
            highToLow: 'hilo', // Price (high to low)
            nameAToZ: 'az',    // Name (A to Z)
            nameZToA: 'za',    // Name (Z to A)
        };

        const verifySorting = async (sortType, type) => {
            await HomePage.selectSortingOption(sortType);
        
            let sortedData;
            if (type === 'price') {
                const productPrices = await HomePage.getProductPrices();
                sortedData = [...productPrices];

                if (sortType === 'lohi') {
                    sortedData.sort((a, b) => a - b);
                }
                else if (sortType === 'hilo') {
                    sortedData.sort((a, b) => b - a);
                }

                expect(productPrices).toEqual(sortedData);
            } else if (type === 'name') {
                const productNames = await HomePage.getProductNames();
 
                if (sortType === 'az') {
                    const sortedNames = [...productNames].sort();
                    expect(productNames).toEqual(sortedNames);
                }
                else if (sortType === 'za') {
                    const sortedNames = [...productNames].sort().reverse();
                    expect(productNames).toEqual(sortedNames);
                }
            }
        };
        
        await verifySorting(sortOptions.lowToHigh, 'price');
        await verifySorting(sortOptions.highToLow, 'price');
        await verifySorting(sortOptions.nameAToZ, 'name');
        await verifySorting(sortOptions.nameZToA, 'name');
    });

    it('Footer Links', async () => { 
        await HomePage.verifySocialMediaLink(HomePage.twitterIcon, 'x.com/saucelabs');
        await HomePage.verifySocialMediaLink(HomePage.linkedinIcon, 'linkedin.com/company/sauce-labs');
        await HomePage.verifySocialMediaLink(HomePage.facebookIcon, 'facebook.com/saucelabs');
    });

    it('Valid Checkout', async () => { 
        const productName = await HomePage.productNames[0].getText();
        const currentQuantityInCart = parseInt(await HomePage.shoppingCartBadge.getText(), 10) || 0;

        await HomePage.addToCartButton[0].click();

        const newQuantityInCart = parseInt(await HomePage.shoppingCartBadge.getText(), 10);
        expect(newQuantityInCart).toBe(currentQuantityInCart + 1);

        await HomePage.shoppingCartBadge.click();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        await HomePage.assertCartContains(productName);

        const productPrice = await CheckoutPage.getProductPrice(HomePage.productPrices[0]);

        await HomePage.checkoutButton.click();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/checkout-step-one.html');

        await CheckoutPage.fillCheckoutForm('John', 'Smith', '12345');
        await CheckoutPage.continueButton.click();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/checkout-step-two.html');

        await expect(productPrice).toBe(await CheckoutPage.getCheckoutItemTotal());
        await CheckoutPage.finishButton.click();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/checkout-complete.html');
        expect(await CheckoutPage.getCompleteHeader()).toBe('Thank you for your order!');
        await CheckoutPage.backHome();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        expect(await HomePage.shoppingCartBadge.getText()).toBe('');
    });

    it('Checkout without products', async () => {
        await HomePage.shoppingCartBadge.click();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        await expect(HomePage.cartItem).not.toBeDisplayed();
        await HomePage.checkoutButton.click();
        // await expect(HomePage.errorMessage.getText()).toBe('Cart is empty');
    });
});
