//email-reporter/email-reporter.js
const EmailReporter = require('../utils/email-reporter');

class CustomEmailReporter {
    constructor(options = {}) {
        this.emailReporter = new EmailReporter();
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: [],
            startTime: null,
            duration: 0
        };
    }

    onBegin(config, suite) {
        this.results.startTime = Date.now();
        console.log(`Запуск тестов: ${suite.allTests().length} тестов`);
    }

    onTestBegin(test) {
        this.results.total++;
    }

    onTestEnd(test, result) {
        const testResult = {
            title: test.title,
            status: result.status,
            duration: result.duration,
            error: result.error ? result.error.message : null
        };

        this.results.tests.push(testResult);

        if (result.status === 'passed') {
            this.results.passed++;
        } else {
            this.results.failed++;
        }
    }

    onEnd(result) {
        this.results.duration = Date.now() - this.results.startTime;

        // Отправляем email с результатами
        this.emailReporter.sendTestResults(this.results);
    }
}

module.exports = CustomEmailReporter;