import { test, expect } from "@playwright/test";
import * as allure from "allure-js-commons";

import { EnforcementService } from "../../../services/enforcementService";

import {
    EXPECTED_EVENTS,
    EXCLUDED_STATES
} from "../../../tests-data/enforcementEvents.data";


test.describe(
    "EQ Legal Collection API - Enforcement Events",
    function () {


        for (
            const [state, expectedEvents] of Object.entries(EXPECTED_EVENTS)
                .filter(
                    function ([state]) {

                        return !EXCLUDED_STATES.has(state);

                    }
                )
        ) {


            test(
                `Проверка доступных событий для состояния ${state}`,
                async function ({ request }) {


                    const enforcementService =
                        new EnforcementService(request);



                    await allure.feature(
                        "Legal Collection"
                    );


                    await allure.story(
                        "Enforcement Events"
                    );


                    await allure.severity(
                        "critical"
                    );


                    await allure.description(
                        `
                        Проверка доступных событий.

                        State:
                        ${state}

                        Expected events:
                        ${expectedEvents.join(", ")}
                        `
                    );



                    const response =
                        await allure.step(
                            `GET /v1/enforcements/events?state=${state}`,
                            async function () {

                                return await enforcementService
                                    .getAvailableEvents(state);

                            }
                        );



                    await allure.step(
                        "Проверка HTTP статуса 200",
                        async function () {


                            expect(
                                response.raw.status()
                            )
                            .toBe(200);


                        }
                    );



                    await allure.step(
                        "Проверка наличия поля events",
                        async function () {


                            expect(
                                response.body
                            )
                            .toHaveProperty(
                                "events"
                            );


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
                        "Проверка списка доступных событий",
                        async function () {


                            expect(
                                response.body.events.sort()
                            )
                            .toEqual(
                                expectedEvents.sort()
                            );


                        }
                    );


                }
            );

        }


    }
);