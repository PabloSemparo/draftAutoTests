import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export class TestRunner {
    static async runTestsWithReport(): Promise<boolean> {
        try {
            console.log('🧪 Running API tests...');

            // Запускаем тесты
            execSync('npx playwright test --reporter=allure-playwright', {
                stdio: 'inherit',
                encoding: 'utf-8'
            });

            // Генерируем отчет
            console.log('📊 Generating Allure report...');
            execSync('npx allure generate allure-results --clean -o allure-report', {
                stdio: 'inherit'
            });

            // Проверяем существует ли отчет
            const reportPath = path.join(process.cwd(), 'allure-report', 'index.html');
            if (fs.existsSync(reportPath)) {
                console.log('✅ Allure report generated successfully');
                console.log(`📋 Report location: ${reportPath}`);

                // Автоматически открываем в браузере
                this.openReportInBrowser(reportPath);
                return true;
            } else {
                console.log('❌ Allure report generation failed');
                return false;
            }

        } catch (error) {
            console.log('❌ Tests failed, but report will be generated');

            // Все равно генерируем отчет для анализа ошибок
            try {
                execSync('npx allure generate allure-results --clean -o allure-report', {
                    stdio: 'inherit'
                });
            } catch (reportError) {
                console.log('❌ Failed to generate error report');
            }

            return false;
        }
    }

    private static openReportInBrowser(reportPath: string) {
        try {
            const open = require('open');
            open(reportPath);
            console.log('🌐 Opening Allure report in browser...');
        } catch (error) {
            console.log('💡 Please open the report manually:', reportPath);
        }
    }
}