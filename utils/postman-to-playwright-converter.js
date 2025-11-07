// postman-to-playwright-converter.js
const fs = require('fs');
const path = require('path');

class PostmanToPlaywrightConverter {
    constructor(postmanCollection) {
        this.collection = postmanCollection;
        this.playwrightTests = [];
    }

    convert() {
        const { info, item } = this.collection;

        console.log(`Конвертируем коллекцию: ${info.name}`);

        this.playwrightTests.push(this.generateImports());
        this.playwrightTests.push(this.generateTestSuite(info.name));

        this.processItems(item);

        this.playwrightTests.push('});'); // закрытие test.describe

        return this.playwrightTests.join('\n');
    }

    generateImports() {
        return `import { test, expect } from '@playwright/test';\n`;
    }

    generateTestSuite(suiteName) {
        return `test.describe('${this.escapeString(suiteName)}', () => {`;
    }

    processItems(items, parentName = '') {
        items.forEach(item => {
            if (item.request) {
                // Это API запрос
                this.generateTestFromRequest(item, parentName);
            } else if (item.item) {
                // Это папка с вложенными запросами
                const folderName = parentName ? `${parentName} - ${item.name}` : item.name;
                this.processItems(item.item, folderName);
            }
        });
    }

    generateTestFromRequest(item, parentName) {
        const { name, request } = item;
        const testName = parentName ? `${parentName} - ${name}` : name;

        const testCode = [
            `    test('${this.escapeString(testName)}', async ({ request }) => {`,
            ...this.generateRequestCode(request),
            '    });'
        ].join('\n');

        this.playwrightTests.push(testCode);
    }

    generateRequestCode(request) {
        const lines = [];
        const { method, url, header, body } = request;

        // URL
        const fullUrl = this.buildUrl(url);
        lines.push(`        const url = '${fullUrl}';`);

        // Headers
        const headers = this.buildHeaders(header);
        if (Object.keys(headers).length > 0) {
            lines.push(`        const headers = ${JSON.stringify(headers, null, 12)};`);
        }

        // Body
        let requestBody = '';
        if (body && body.mode === 'raw') {
            requestBody = this.parseRequestBody(body.raw);
        }

        // Request
        const requestOptions = [];
        if (Object.keys(headers).length > 0) {
            requestOptions.push('headers');
        }
        if (requestBody) {
            requestOptions.push('data: requestBody');
        }

        const optionsString = requestOptions.length > 0 ?
            `, { ${requestOptions.join(', ')} }` : '';

        lines.push('');
        if (requestBody) {
            lines.push(`        const requestBody = ${requestBody};`);
        }
        lines.push(`        const response = await request.${method.toLowerCase()}(url${optionsString});`);
        lines.push('');
        lines.push('        // Basic assertions');
        lines.push('        expect(response.status()).toBe(200);');
        lines.push('        expect(response.headers()[\'content-type\']).toContain(\'application/json\');');
        lines.push('');
        lines.push('        // Add your specific assertions here');
        lines.push('        const responseBody = await response.json();');
        lines.push('        // expect(responseBody).toHaveProperty(\'id\');');

        return lines;
    }

    buildUrl(url) {
        if (typeof url === 'string') {
            return url;
        }

        if (url.raw) {
            return url.raw;
        }

        if (url.protocol && url.host && url.path) {
            const protocol = url.protocol || 'https';
            const host = url.host.join('.');
            const path = url.path.join('/');
            return `${protocol}://${host}/${path}`;
        }

        return 'https://api.example.com/endpoint';
    }

    buildHeaders(headers) {
        if (!headers || !Array.isArray(headers)) {
            return {};
        }

        const headerObj = {};
        headers.forEach(header => {
            if (header.key && header.value) {
                headerObj[header.key] = header.value;
            }
        });

        return headerObj;
    }

    parseRequestBody(rawBody) {
        if (!rawBody) {
            return '';
        }

        try {
            const parsed = JSON.parse(rawBody);
            return JSON.stringify(parsed, null, 8);
        } catch (e) {
            // Если не JSON, возвращаем как строку
            return `'${this.escapeString(rawBody)}'`;
        }
    }

    escapeString(str) {
        return str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    }
}

// Функция для использования
function convertPostmanToPlaywright(postmanCollectionPath, outputPath) {
    try {
        // Читаем Postman коллекцию
        const postmanData = JSON.parse(fs.readFileSync(postmanCollectionPath, 'utf8'));

        // Конвертируем
        const converter = new PostmanToPlaywrightConverter(postmanData);
        const playwrightCode = converter.convert();

        // Сохраняем результат
        fs.writeFileSync(outputPath, playwrightCode, 'utf8');

        console.log(`✅ Успешно сконвертировано! Файл сохранен: ${outputPath}`);

    } catch (error) {
        console.error('❌ Ошибка конвертации:', error.message);
    }
}

// Использование
if (require.main === module) {
    const postmanFile = process.argv[2] || './postman-collection.json';
    const outputFile = process.argv[3] || './playwright-api-tests.spec.js';

    convertPostmanToPlaywright(postmanFile, outputFile);
}

module.exports = { PostmanToPlaywrightConverter, convertPostmanToPlaywright };