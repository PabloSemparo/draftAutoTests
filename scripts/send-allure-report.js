// scripts/send-allure-report.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function sendAllureReport() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK_PASSWORD
        }
    });

    // Читаем Allure отчет
    const reportPath = path.join(__dirname, '../test-results/index.html');
    const reportContent = fs.readFileSync(reportPath, 'utf8');

    const mailOptions = {
        from: process.env.OUTLOOK_EMAIL,
        to: 'team@company.com',
        subject: `Allure Report - API Tests - ${new Date().toLocaleDateString()}`,
        html: `
      <h2>Allure Report - Результаты тестирования API</h2>
      <p>Отчет тестирования API пакетов документов прикреплен к этому письму.</p>
      <p>Для просмотра детальной информации откройте прикрепленный HTML файл в браузере.</p>
    `,
        attachments: [
            {
                filename: 'allure-report.html',
                content: reportContent
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Allure report отправлен на email');
    } catch (error) {
        console.error('Ошибка отправки отчета:', error);
    }
}

sendAllureReport();