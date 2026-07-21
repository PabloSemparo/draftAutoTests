import { test, expect } from "@playwright/test";
import * as allure from "allure-js-commons";

import { EnforcementService } from "../../../services/enforcementService";
import { EXPECTED_EVENTS } from "../../../tests-data/enforcementEvents.data";

test.describe("Получение доступных событий", () => {
    let enforcementService: EnforcementService;

    test.beforeEach(async function ({ request }) {
        enforcementService = new EnforcementService(request);
    });

    for (const [state, expectedEvents] of Object.entries(EXPECTED_EVENTS)) {

        test(`GET /v1/enforcements/events?state=${state}`, async () => {

            await allure.feature("Enforcement");
            await allure.story("Получение доступных событий");
            await allure.owner("QA");
            await allure.tag("API");
            await allure.tag("Smoke");

            const response = await allure.step(
                `Получить события для состояния ${state}`,
                async () => {
                    return await enforcementService.getAvailableEvents(state);
                }
            );

            await allure.step("Проверить HTTP статус", async () => {
                expect(response.raw.status()).toBe(200);
            });

            await allure.step("Проверить наличие массива events", async () => {
                expect(response.body).toHaveProperty("events");
                expect(Array.isArray(response.body.events)).toBeTruthy();
            });

            await allure.step("Проверить количество событий", async () => {
                expect(response.body.events).toHaveLength(expectedEvents.length);
            });

            await allure.step("Проверить состав событий", async () => {
                expect(response.body.events).toEqual(
                    expect.arrayContaining(expectedEvents)
                );
            });

            await allure.step("Проверить отсутствие лишних событий", async () => {
                expect(response.body.events.sort())
                    .toEqual(expectedEvents.sort());
            });
        });
    }
});