module.exports = {

    RESULT_DIR: "allure-results",

    REPORT_DIR: "allure-report",

    SCREENSHOT_DIR: "screenshots",

    VIDEO_DIR: "videos",


    categories: [

        {
            name: "Assertion failures",
            messageRegex: ".*AssertionError.*",
            matchedStatuses: [
                "failed"
            ]
        },


        {
            name: "API errors",
            messageRegex: ".*(500|502|503|504).*",
            matchedStatuses: [
                "broken",
                "failed"
            ]
        },


        {
            name: "Timeout errors",
            messageRegex: ".*Timeout.*",
            matchedStatuses: [
                "broken"
            ]
        },


        {
            name: "Infrastructure problems",
            traceRegex: ".*ECONNREFUSED.*|.*ENOTFOUND.*",
            matchedStatuses: [
                "broken"
            ]
        }

    ],


    environment: {

        BASE_URL:
            process.env.BASE_URL || "not_defined",


        NODE_VERSION:
            process.version,


        PLATFORM:
            `${process.platform} ${process.arch}`,


        TEST_FRAMEWORK:
            "Playwright + TypeScript",


        API_AUTOMATION:
            "EQ Legal Collection"

    }

};