// advanced-converter.js
const fs = require('fs');

class AdvancedPostmanConverter {
    constructor(postmanCollection) {
        this.collection = postmanCollection;
        this.variables = {};
        this.tests = [];
    }

    convert() {
        const { info, item, variable } = this.collection;

        // Извлекаем переменные
        this.extractVariables(variable);

        let code = this.generateHeader(info);
        code += this.generateTestSuite(info.name, item);

        return code;
    }

    extractVariables(variables) {
        if (!variables || !Array.isArray(variables)) return;

        variables.forEach(variable => {
            if (variable.key && variable.value) {
                this.variables[variable.key] = variable.value;
            }
        });
    }

    generateHeader(info) {
        return `/**
 * Generated from Postman Collection: ${info.name}
 * Description: ${info.description || 'No description'}
 * Generated: ${new Date().toISOString()}
 */

import { test, expect } from '@playwright/test';

// Base configuration
const BASE_CONFIG = {
    baseURL: '${this.variables.baseUrl || 'https://api.example.com'}',
    defaultHeaders: {
        'Content-Type': 'application/json',
        'User-Agent': 'Playwright-Tests'
    }
};

`;
    }

    generateTestSuite(suiteName, items) {
        let code = `test.describe('${this.escapeString(suiteName)}', () => {\n\n`;

        items.forEach(item => {
            if (item.request) {
                code += this.generateTest(item);
            } else if (item.item) {
                code += this.generateTestFolder(item);
            }
        });

        code += '});\n';
        return code;
    }

    generateTestFolder(folder) {
        let code = `    test.describe('${this.escapeString(folder.name)}', () => {\n`;

        folder.item.forEach(item => {
            if (item.request) {
                code += this.generateTest(item, '        ');
            }
        });

        code += '    });\n\n';
        return code;
    }

    generateTest(item, indent = '    ') {
        const { name, request, event } = item;
        const tests = this.extractTests(event);

        let code = `${indent}test('${this.escapeString(name)}', async ({ request }) => {\n`;

        // Request setup
        code += this.generateRequestSetup(request, indent + '    ');

        // Execute request
        code += this.generateRequestExecution(request, indent + '    ');

        // Tests
        code += this.generateAssertions(tests, indent + '    ');

        code += `${indent}});\n\n`;
        return code;
    }

    generateRequestSetup(request, indent) {
        const { method, url, header, body } = request;
        let code = '';

        // URL
        const fullUrl = this.buildUrl(url);
        code += `${indent}const url = \`${this.replaceVariables(fullUrl)}\`;\n`;

        // Headers
        const headers = { ...this.buildHeaders(header) };
        if (Object.keys(headers).length > 0) {
            code += `${indent}const headers = ${JSON.stringify(headers, null, 8)};\n`;
        }

        // Body
        if (body && body.mode === 'raw') {
            const requestBody = this.parseRequestBody(body.raw);
            code += `${indent}const requestBody = ${requestBody};\n`;
        }

        return code;
    }

    generateRequestExecution(request, indent) {
        const { method } = request;
        let code = `\n${indent}// Execute request\n`;

        const options = [];
        if (request.body && request.body.mode === 'raw') {
            options.push('data: requestBody');
        }
        if (request.header && request.header.length > 0) {
            options.push('headers');
        }

        const optionsString = options.length > 0 ? `, { ${options.join(', ')} }` : '';
        code += `${indent}const response = await request.${method.toLowerCase()}(url${optionsString});\n`;

        return code;
    }

    generateAssertions(tests, indent) {
        let code = `\n${indent}// Assertions\n`;

        // Basic assertions
        code += `${indent}expect(response.status(), 'Status should be 2xx').toBeLessThan(300);\n`;

        // Postman tests conversion
        tests.forEach(test => {
            const playwrightTest = this.convertPostmanTestToPlaywright(test, indent);
            if (playwrightTest) {
                code += playwrightTest + '\n';
            }
        });

        // Response body parsing
        code += `\n${indent}const responseBody = await response.json();\n`;
        code += `${indent}// Add additional assertions here\n`;

        return code;
    }

    extractTests(events) {
        if (!events || !Array.isArray(events)) return [];

        const testEvents = events.filter(event => event.listen === 'test');
        const tests = [];

        testEvents.forEach(event => {
            if (event.script && event.script.exec) {
                event.script.exec.forEach(line => {
                    if (typeof line === 'string' && line.includes('pm.test')) {
                        tests.push(line);
                    }
                });
            }
        });

        return tests;
    }

    convertPostmanTestToPlaywright(testCode, indent) {
        // Конвертация pm.test в expect
        if (testCode.includes('pm.test')) {
            const testNameMatch = testCode.match(/pm\.test\s*\(\s*["']([^"']+)["']/);
            const assertionMatch = testCode.match(/pm\.expect\(([^)]+)\)\./);

            if (testNameMatch && assertionMatch) {
                const testName = testNameMatch[1];
                const assertion = assertionMatch[1];

                // Простая конвертация распространенных assertions
                if (testCode.includes('.to.eql')) {
                    return `${indent}// ${testName}\n${indent}expect(${assertion}).toEqual(/* expected value */);`;
                } else if (testCode.includes('.to.be.true')) {
                    return `${indent}// ${testName}\n${indent}expect(${assertion}).toBe(true);`;
                } else if (testCode.includes('.to.have.property')) {
                    const propMatch = testCode.match(/\.to\.have\.property\(\s*["']([^"']+)["']/);
                    if (propMatch) {
                        return `${indent}// ${testName}\n${indent}expect(${assertion}).toHaveProperty('${propMatch[1]}');`;
                    }
                }

                return `${indent}// ${testName}\n${indent}// TODO: Convert assertion: ${testCode}`;
            }
        }

        return null;
    }

    buildUrl(url) {
        if (typeof url === 'string') return url;
        if (url.raw) return url.raw;

        let fullUrl = '';
        if (url.protocol) fullUrl += url.protocol + '://';
        if (url.host) fullUrl += url.host.join('.');
        if (url.path) fullUrl += '/' + url.path.join('/');
        if (url.query) {
            fullUrl += '?' + url.query.map(q => `${q.key}=${q.value}`).join('&');
        }

        return fullUrl;
    }

    buildHeaders(headers) {
        if (!headers) return {};

        const headerObj = {};
        headers.forEach(header => {
            if (header.key && header.value) {
                headerObj[header.key] = this.replaceVariables(header.value);
            }
        });

        return headerObj;
    }

    parseRequestBody(rawBody) {
        if (!rawBody) return '';

        try {
            const parsed = JSON.parse(rawBody);
            return JSON.stringify(parsed, null, 8);
        } catch (e) {
            return `'${this.replaceVariables(rawBody)}'`;
        }
    }

    replaceVariables(str) {
        if (typeof str !== 'string') return str;

        return str.replace(/{{\s*(\w+)\s*}}/g, (match, variableName) => {
            return this.variables[variableName] || match;
        });
    }

    escapeString(str) {
        return str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    }
}

// CLI утилита
function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log('Usage: node advanced-converter.js <postman-collection.json> [output-file.spec.js]');
        console.log('Example: node advanced-converter.js my-collection.json tests/api.spec.js');
        return;
    }

    const inputFile = args[0];
    const outputFile = args[1] || './generated-api-tests.spec.js';

    try {
        const postmanData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
        const converter = new AdvancedPostmanConverter(postmanData);
        const playwrightCode = converter.convert();

        fs.writeFileSync(outputFile, playwrightCode, 'utf8');
        console.log(`✅ Successfully converted Postman collection to Playwright tests!`);
        console.log(`📁 Output: ${outputFile}`);

    } catch (error) {
        console.error('❌ Conversion failed:', error.message);
    }
}

if (require.main === module) {
    main();
}

module.exports = AdvancedPostmanConverter;