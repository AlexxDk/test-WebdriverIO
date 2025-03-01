export default class BasePage {
    async open(path) {
        await browser.url(path);
    }
}