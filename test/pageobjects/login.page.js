import BasePage from './base.page.js';

class LoginPage extends BasePage {
    get inputUsername() { return $('#user-name'); }
    get inputPassword() { return $('#password'); }
    get btnLogin() { return $('#login-button'); }
    get errorMessage() { return $('.error-message-container'); }
    get borderInput() { return $$('.input_error.error'); }
  
    async open() {
        await super.open('https://www.saucedemo.com');
    }

    async fillLoginForm(username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
    }

    async login(username, password) {
        await this.fillLoginForm(username, password);
        await this.btnLogin.click();
    }

    async getErrorMessageText() {
        return this.errorMessage.getText();
    }
    
    async isClearIconVisible(inputField) {
        const nextElement = await inputField.nextElement();
        const classNameForNextEl = await nextElement.getAttribute('class');
        return classNameForNextEl.includes('error_icon');
    }

    async isFieldHighlighted(inputField) {
        const className = await inputField.getAttribute('class');
        return className.includes('input_error') ;
    }
  
    async isFieldEmpty(field) {
        return (await field.getValue()) === '';
    }    

    async assertLoginError(expectedMessage) {
        expect(await this.getErrorMessageText()).toBe(expectedMessage);
    }

    async assertFieldValidationFor(field) {
        expect(await this.isFieldHighlighted(field)).toBe(true);
        expect(await this.isClearIconVisible(field)).toBe(true);
    }
    
    async assertLoginDataIsRepresentedITheField(username, password) {
        expect(await this.inputUsername.getValue()).toBe(username);
        expect(await this.inputPassword.getValue()).toBe(password);
        expect(await this.inputPassword.getAttribute('type')).toBe('password');
    }

    async assertEmptyFields(inputField) {
        expect(await this.isFieldEmpty(inputField)).toBe(true);
    }

    async assertEmptyLoginFields() {
        await this.assertEmptyFields();
    }
}

export default new LoginPage();
