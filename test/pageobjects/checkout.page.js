import BasePage from "./base.page";

class CheckoutPage extends BasePage {
    get firstName() { return $('#first-name'); }
    get lastName() { return $('#last-name'); }
    get postalCode() { return $('#postal-code'); }
    get continueButton() { return $('#continue'); }
    get finishButton() { return $('#finish'); }
    get cancelButton() { return $('#cancel'); }
    get checkoutItemTotal() { return $('.summary_subtotal_label'); };
    get completeHeader() { return $('.complete-header'); };
    get backHomeButton() { return $('#back-to-products'); }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.firstName.setValue(firstName);
        await this.lastName.setValue(lastName);
        await this.postalCode.setValue(postalCode);
    }

    async continue() {
        await this.continueButton.click();
    }

    async finish() {
        await this.finishButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    async getProductPrice(priceElement) {
        const priceText = await priceElement.getText();
        const price = parseFloat(priceText.replace('$', ''));
        return price;
    }

    async getCheckoutItemTotal() {
        const priceText = await this.checkoutItemTotal.getText();
        const price = parseFloat(priceText.replace('Item total: $', ''));
        return price;
    }

    async getCompleteHeader() {
        return this.completeHeader.getText();
    }

    async backHome() {
        await this.backHomeButton.click();
    }

}

export default new CheckoutPage();