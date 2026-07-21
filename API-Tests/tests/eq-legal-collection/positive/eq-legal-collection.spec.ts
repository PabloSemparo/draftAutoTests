import { test, expect } from "@playwright/test";
import * as allure from "allure-js-commons";

import { EnforcementService } from "../../../services/enforcementService";

import {
    EXPECTED_EVENTS
} from "../../../tests-data/enforcementEvents.data";


test.describe("EQ Legal Collection API", function () {

    let enforcementService: EnforcementService;


    test.beforeEach(async function ({ request }) {

        enforcementService = new EnforcementService(request);

    });


    for (const [state, expectedEvents] of Object.entries(EXPECTED_EVENTS)) {


        test(
            `Проверка доступных событий для состояния ${state}`,
            async function () {


                await allure.feature(
                    "Legal Collection"
                );


                await allure.story(
                    "Получение доступных событий"
                );


                await allure.description(
                    `
                    Проверка доступных событий для состояния:

                    ${state}

                    Ожидаемые события:

                    ${expectedEvents.join(", ")}
                    `
                );


                const response =
                    await allure.step(
                        `GET доступных событий для ${state}`,
                        async function () {

                            return await enforcementService
                                .getAvailableEvents(state);

                        }
                    );


                await allure.step(
                    "Проверка HTTP статуса",
                    async function () {

                        expect(
                            response.raw.status()
                        )
                        .toBe(200);

                    }
                );


                await allure.step(
                    "Проверка структуры ответа",
                    async function () {


                        expect(response.body)
                            .toHaveProperty("events");


                        expect(
                            Array.isArray(response.body.events)
                        )
                        .toBe(true);


                    }
                );


                await allure.step(
                    "Проверка количества событий",
                    async function () {


                        expect(
                            response.body.events.length
                        )
                        .toBe(
                            expectedEvents.length
                        );


                    }
                );


                await allure.step(
                    "Проверка соответствия событий",
                    async function () {


                        expect(
                            response.body.events
                        )
                        .toEqual(
                            expect.arrayContaining(
                                expectedEvents
                            )
                        );


                    }
                );


                await allure.step(
                    "Проверка отсутствия лишних событий",
                    async function () {


                        const actualEvents =
                            [...response.body.events]
                                .sort();


                        const expected =
                            [...expectedEvents]
                                .sort();


                        expect(actualEvents)
                            .toEqual(expected);


                    }
                );

            }
        );

    }

});