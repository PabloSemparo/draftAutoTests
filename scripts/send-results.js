// scripts/send-results.js
const nodemailer = require('nodemailer');
const { exec } = require('child_process');

class TestResultSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.OUTLOOK_EMAIL,
                pass: process.env.OUTLOOK_PASSWORD
            }
        });
    }

    async runTestsAndSendEmail() {
        console.log('Запуск тестов...');

        exec('npx playwright test --reporter=json', async (error, stdout, stderr) => {
            let results;

            try {
                // Парсим JSON вывод
                const jsonOutput = JSON.parse(stdout);
                results = this.parseResults(jsonOutput);
            } catch (parseError) {
                results = {
                    total: 0,
                    passed: 0,
                    failed: 1,
                    error: 'Ошибка парсинга результатов тестов'
                };
            }

            await this.sendEmail(results);
        });
    }

    parseResults(jsonOutput) {
        const suites = jsonOutput.suites || [];
        let total = 0;
        let passed = 0;
        let failed = 0;
        const tests = [];

        suites.forEach(suite => {
            suite.specs.forEach(spec => {
                spec.tests.forEach(test => {
                    total++;
                    if (test.status === 'expected') passed++;
                    else failed++;

                    tests.push({
                        title: spec.title,
                        status: test.status,
                        duration: test.duration
                    });
                });
            });
        });

        return { total, passed, failed, tests };
    }

    async sendEmail(results) {
        const mailOptions = {
            from: process.env.OUTLOOK_EMAIL,
            to: 'team@company.com',
            subject: `Результаты тестов API - ${new Date().toLocaleString()}`,
            html: this.generateEmailBody(results)
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Результаты тестов отправлены на email');
        } catch (error) {
            console.error('Ошибка отправки email:', error);
        }
    }

    generateEmailBody(results) {
        return `
      <h2>📊 Результаты автоматического тестирования API</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h3 style="color: #333;">Статистика выполнения:</h3>
        <p><strong>Всего тестов:</strong> ${results.total}</p>
        <p style="color: green;"><strong>Успешно:</strong> ${results.passed}</p>
        <p style="color: ${results.failed > 0 ? 'red' : 'green'};"><strong>Провалено:</strong> ${results.failed}</p>
        <p><strong>Успешность:</strong> ${((results.passed / results.total) * 100).toFixed(1)}%</p>
      </div>
      
      ${results.failed > 0 ? `
        <div style="margin-top: 20px; color: red;">
          <h3>⚠️ Внимание: есть проваленные тесты!</h3>
          <p>Пожалуйста, проверьте детали выполнения тестов.</p>
        </div>
      ` : `
        <div style="margin-top: 20px; color: green;">
          <h3>✅ Все тесты прошли успешно!</h3>
        </div>
      `}
      
      <div style="margin-top: 20px;">
        <p><em>Отчет сгенерирован автоматически</em></p>
      </div>
    `;
    }
}

// Запуск
const sender = new TestResultSender();
sender.runTestsAndSendEmail();