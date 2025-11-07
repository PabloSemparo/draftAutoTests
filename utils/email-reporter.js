// utils/email-reporter.js
const nodemailer = require('nodemailer');

class EmailReporter {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.office365.com', // для Outlook
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, //  email Outlook
                pass: process.env.EMAIL_PASS  // пароль или app password
            }
        });
    }

    async sendTestResults(results) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'recipient@example.com', // получатель
            subject: `Результаты тестов - ${new Date().toLocaleDateString()}`,
            html: this.generateEmailTemplate(results)
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email отправлен успешно');
        } catch (error) {
            console.error('Ошибка отправки email:', error);
        }
    }

    generateEmailTemplate(results) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
          .passed { color: green; }
          .failed { color: red; }
          .test { margin: 10px 0; padding: 10px; border-left: 4px solid; }
          .test.passed { border-color: green; background: #f0fff0; }
          .test.failed { border-color: red; background: #fff0f0; }
        </style>
      </head>
      <body>
        <h2>Результаты автоматического тестирования</h2>
        <div class="summary">
          <h3>Статистика:</h3>
          <p>Всего тестов: ${results.total}</p>
          <p class="passed">Пройдено: ${results.passed}</p>
          <p class="failed">Провалено: ${results.failed}</p>
          <p>Время выполнения: ${results.duration}ms</p>
        </div>
        <h3>Детали тестов:</h3>
        ${results.tests.map(test => `
          <div class="test ${test.status}">
            <strong>${test.title}</strong><br>
            Статус: ${test.status}<br>
            Длительность: ${test.duration}ms
            ${test.error ? `<br>Ошибка: ${test.error}` : ''}
          </div>
        `).join('')}
      </body>
      </html>
    `;
    }
}

module.exports = EmailReporter;