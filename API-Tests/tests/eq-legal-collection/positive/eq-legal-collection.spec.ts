import { test, expect } from "@playwright/test";
import * as allure from "allure-js-commons";

import { EnforcementService } from "../../../services/enforcementService";

import {
    EXPECTED_EVENTS,
    EXCLUDED_STATES
} from "../../../tests-data/enforcementEvents.data";


const TEST_NAME = "EQ Legal Collection - Enforcement Events";


test.describe(
    TEST_NAME,
    function () {


        for (
            const [
                state,
                expectedEvents
            ] of Object.entries(EXPECTED_EVENTS)
                .filter(
                    function ([state]) {
                        return !EXCLUDED_STATES.has(state);
                    }
                )
        ) {


            test(
                `Available events for state: ${state}`,
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


                    await allure.tag(
                        "API"
                    );


                    await allure.tag(
                        "Regression"
                    );


                    await allure.description(
                        [
                            "Проверка доступных событий",
                            "",
                            `State: ${state}`,
                            "",
                            "Expected events:",
                            expectedEvents.join(", ")
                        ].join("\n")
                    );



                    const response =
                        await allure.step(
                            `GET available events: ${state}`,
                            async function () {

                                return enforcementService
                                    .getAvailableEvents(state);

                            }
                        );



                    await allure.step(
                        "Validate response",
                        async function () {


                            expect(
                                response.raw.status()
                            )
                            .toBe(200);



                            expect(
                                response.body.events
                            )
                            .toBeDefined();



                            expect(
                                Array.isArray(
                                    response.body.events
                                )
                            )
                            .toBe(true);



                            expect(
                                response.body.events.length
                            )
                            .toBe(
                                expectedEvents.length
                            );



                            expect(
                                [...response.body.events].sort()
                            )
                            .toEqual(
                                [...expectedEvents].sort()
                            );

                        }
                    );

                }
            );

        }

    }
);