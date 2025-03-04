import loginPage from '../pageobjects/login.page.js';
import homePage from '../pageobjects/home.page.js';
import checkoutPage from '../pageobjects/checkout.page.js';
import testDataGeneration from '../test-data/testDataGeneration.js';

describe('Cart', () => {
    beforeEach(async () => {
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await homePage.assertUserLoggedIn();
    });

    it('Saving the card after logout ', async () => { 
        const productName = await homePage.getTextForProduct(0);
        const currentQuantityInCart = await homePage.getCurrentQuantityInCart();

        await homePage.clickOnAddToCartButton(0);
        const newQuantityInCart = parseInt(await homePage.getTextForShoppingCartBadge(), 10);
        expect(newQuantityInCart).toBe(currentQuantityInCart + 1)

        await homePage.openMenu();
        await homePage.assertSidebarIsVisibleAndAmountOfItemsIs(4);

        await homePage.logout();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');

        await loginPage.login('standard_user', 'secret_sauce');
        expect(await homePage.areProductsDisplayed()).toBe(true);

        await homePage.clickOnShoppingCartBadge();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        await homePage.assertCartContains(productName);

        await homePage.clickOnRemoveButton();
      
    });

    it('Sorting', async () => {
        const sortOptions = {
            lowToHigh: 'lohi', // Price (low to high)
            highToLow: 'hilo', // Price (high to low)
            nameAToZ: 'az',    // Name (A to Z)
            nameZToA: 'za',    // Name (Z to A)
        };

        const verifySorting = async (sortType, type) => {
            await homePage.selectSortingOption(sortType);
        
            let sortedData;
            if (type === 'price') {
                const productPrices = await homePage.getProductPrices();
                sortedData = [...productPrices];

                if (sortType === 'lohi') {
                    sortedData.sort((a, b) => a - b);
                }
                else if (sortType === 'hilo') {
                    sortedData.sort((a, b) => b - a);
                }

                expect(productPrices).toEqual(sortedData);
            } else if (type === 'name') {
                const productNames = await homePage.getProductNames();
 
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
        await homePage.verifySocialMediaLink(homePage.twitterIcon, 'x.com/saucelabs');
        await homePage.verifySocialMediaLink(homePage.linkedinIcon, 'linkedin.com/company/sauce-labs');
        await homePage.verifySocialMediaLink(homePage.facebookIcon, 'facebook.com/saucelabs');
    });

    it('Valid Checkout', async () => { 
        const productName = await homePage.getTextForProduct(0);
        const currentQuantityInCart = await homePage.getCurrentQuantityInCart();

        await homePage.clickOnAddToCartButton(0);

        const newQuantityInCart = parseInt(await homePage.getTextForShoppingCartBadge(), 10);
        expect(newQuantityInCart).toBe(currentQuantityInCart + 1);

        await homePage.clickOnShoppingCartBadge();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        await homePage.assertCartContains(productName);

        const productPrice = await checkoutPage.getProductPrice(homePage.productPrices[0]);

        await homePage.clickOnCheckoutButton();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/checkout-step-one.html');

        await checkoutPage.fillCheckoutForm(testDataGeneration.randomFirstName(), testDataGeneration.randomLastName(), testDataGeneration.randomZipCode());
        await checkoutPage.continue();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/checkout-step-two.html');

        await expect(productPrice).toBe(await checkoutPage.getCheckoutItemTotal());
        await checkoutPage.finish()
        expect(await browser).toHaveUrl('https://www.saucedemo.com/checkout-complete.html');
        expect(await checkoutPage.getCompleteHeader()).toBe('Thank you for your order!');
        await checkoutPage.backHome();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        expect(await homePage.getTextForShoppingCartBadge()).toBe('');
    });

    it('Checkout without products', async () => {
        await homePage.clickOnShoppingCartBadge();
        expect(await browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        await expect(homePage.cartItem).not.toBeDisplayed();
        await homePage.clickOnCheckoutButton();
        await expect(homePage.getTextForErrorMessage()).toBe('Cart is empty');
    });
});
