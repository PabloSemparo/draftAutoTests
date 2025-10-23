import { allure } from 'allure-playwright';

export class AllureDecorators {
    static epic(epic: string) {
        allure.epic(epic);
    }

    static feature(feature: string) {
        allure.feature(feature);
    }

    static story(story: string) {
        allure.story(story);
    }

    static severity(severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial') {
        allure.severity(severity);
    }

    static owner(owner: string) {
        allure.owner(owner);
    }

    static tag(tag: string) {
        allure.tag(tag);
    }

    static description(description: string) {
        allure.description(description);
    }

    static async step<T>(name: string, body: () => Promise<T>): Promise<T> {
        return await allure.step(name, async () => {
            return await body();
        });
    }

    static stepSync<T>(name: string, body: () => T): T {
        return allure.step(name, () => {
            return body();
        });
    }

    static attachScreenshot(name: string, screenshot: Buffer) {
        allure.attachment(name, screenshot, 'image/png');
    }

    static attachJson(name: string, data: any) {
        allure.attachment(name, JSON.stringify(data, null, 2), 'application/json');
    }

    static attachText(name: string, text: string) {
        allure.attachment(name, text, 'text/plain');
    }

    static link(url: string, name?: string) {
        allure.link(url, name || url);
    }
}