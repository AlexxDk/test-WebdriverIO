import { $ } from '@wdio/globals'
import BasePage from './base.page.js';

class HomePage extends BasePage {
    get headerTitle() { return $('.app_logo'); }
    get menuButton() { return $('#react-burger-menu-btn'); }
    get menuItems() { return $$('.bm-item.menu-item'); }
    get logoutItem() { return $('#logout_sidebar_link'); }
    get sidebar() { return $('.bm-menu'); }
    get sidebarItems() { return $$('.bm-item-list a'); }
    get addToCartButton() { return $$('.btn.btn_small.btn_inventory'); }
    get shoppingCartBadge() { return $('#shopping_cart_container'); }
    get productNames() { return $$('.inventory_item_name'); }
    get cartItem() { return $('.cart_item'); }
    get productSortContainer() { return $('.product_sort_container'); }
    get inventoryItems() { return $$('.inventory_item'); }
    get productPrices() { return $$('.inventory_item_price'); }
    get twitterIcon() { return $('.social_twitter'); }
    get linkedinIcon() { return $('.social_linkedin'); }
    get facebookIcon() { return $('.social_facebook'); }
    get checkoutButton() { return $('#checkout'); }
    get removeButton() { return $('#remove-sauce-labs-backpack'); }

    async openMenu() {
        await $('#react-burger-menu-btn').click();
    }

    async isLoggedIn() {
        return (await browser.getUrl()) === 'https://www.saucedemo.com/inventory.html';
    }

    async areProductsDisplayed() {
        return (await $$('.inventory_item')).length > 0;
    }

    async assertSidebarIsVisibleAndAmountOfItemsIs(amount) {
        expect(await this.sidebar.isDisplayed()).toBe(true);
        expect(await this.sidebarItems.length).toBe(amount); 
    }

    async logout() {
        await $('#logout_sidebar_link').click();
    }

    async assertUserLoggedIn() {
        expect(await this.isLoggedIn()).toBe(true);
        expect(await this.areProductsDisplayed()).toBe(true);
    }

    async assertCartContains(expectedProductName) {
        const productNames = await this.productNames;
        let found = false;

        for (let product of productNames) {
            const productName = await product.getText();
            if (productName === expectedProductName) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
    }

    async selectSortingOption(optionValue) {
        await this.productSortContainer.click();
        const option = await $(`option[value="${optionValue}"]`);
        await option.click();        
    }

    async getProductPrices() {
        const prices = [];
        for (let priceElement of await this.productPrices) {
            const priceText = await priceElement.getText();
            const price = parseFloat(priceText.replace('$', ''));
            prices.push(price);
        }
        return prices;
    }

    async getProductNames() {
        const names = [];
        for (let nameElement of await this.productNames) {
            names.push(await nameElement.getText());
        }
        return names;
    }

    async verifySocialMediaLink(media, expectedUrlSubstring) {
        const oldWindowHandles = await browser.getWindowHandles();
    
        await media.click();
    
        await browser.waitUntil(async () => {
            const newWindowHandles = await browser.getWindowHandles();
            return newWindowHandles.length > oldWindowHandles.length;
        }, {
            timeout: 5000,
            timeoutMsg: 'New window did not open in the expected time'
        });
    
        const newWindowHandles = await browser.getWindowHandles();
        const newTabHandle = newWindowHandles.find(handle => !oldWindowHandles.includes(handle));
    
        await browser.switchToWindow(newTabHandle);
    
        const url = await browser.getUrl();
        expect(url).toContain(expectedUrlSubstring);
    
        await browser.closeWindow();
        await browser.switchToWindow(oldWindowHandles[0]);
    }
    
}

export default new HomePage();

