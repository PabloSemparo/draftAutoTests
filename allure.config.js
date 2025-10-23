module.exports = {
    RESULT_DIR: 'allure-results',
    REPORT_DIR: 'allure-report',
    SCREENSHOT_DIR: 'screenshots',
    VIDEO_DIR: 'videos',

    // Категории для багов
    categories: [
        {
            name: 'Failed tests',
            messageRegex: '.*AssertionError.*',
            matchedStatuses: ['failed']
        },
        {
            name: 'Broken tests',
            traceRegex: '.*RuntimeException.*',
            matchedStatuses: ['broken']
        },
        {
            name: 'Passed tests',
            matchedStatuses: ['passed']
        }
    ],

    // Environment variables для отчета
    environment: {
        base_url: process.env.BASE_URL,
        node_version: process.version,
        platform: process.platform
    }
};module.exports = {
    RESULT_DIR: 'allure-results',
    REPORT_DIR: 'allure-report',
    SCREENSHOT_DIR: 'screenshots',
    VIDEO_DIR: 'videos',

    // Категории для багов
    categories: [
        {
            name: 'Failed tests',
            messageRegex: '.*AssertionError.*',
            matchedStatuses: ['failed']
        },
        {
            name: 'Broken tests',
            traceRegex: '.*RuntimeException.*',
            matchedStatuses: ['broken']
        },
        {
            name: 'Passed tests',
            matchedStatuses: ['passed']
        }
    ],

    // Environment variables для отчета
    environment: {
        base_url: process.env.BASE_URL,
        node_version: process.version,
        platform: process.platform
    }
};