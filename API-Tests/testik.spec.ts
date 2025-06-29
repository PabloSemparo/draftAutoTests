import { test, expect } from '@playwright/test';
import contractorData from './contractorData.json';

const API_URL = process.env.API_URL || 'http://eq-dc-debt-importer.test2.mmk.local/admin/v1/contractors';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'eyJraWQiOiJzbWZ0cC1rZXkiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsIm5iZiI6MTcwMTA5Nzc2Nywic2NvcGUiOiJBRE1JTiIsImlzcyI6InNlbGYiLCJleHAiOjIwMTY0NTc3NjcsImlhdCI6MTcwMTA5Nzc2N30.euDaDutoZtG5-_t3HcLPK5LmjVUYwE961AerMgJ4QwQAPDa0Kdamk6b83TnbAI5k3HJD3j2kZMWxM8IRbO1GgUu_rKTHwyfjhQaW5vX2bDkb74E9JeVaq91kXUAa4craFSBjKlS8_oZsCSiifWU297FsDpJTC7-ezn8saMNi4uUeA4pAuEJxbWXhpLh06G0jaHfQec3EtphsTSP-_VvKUGdwToUZ3jcuDEfB4OECAYAeCjs1lW5CJ7Ngxtrlcrj6l_Tu5URDrLejGe9ikcq_Lg7sAQ_4TpoNiS4K7iPjuEURX37DsUoOHff_Ex2PTlM27XusDBT_splBLsZjlHri7w';

test('POST /contractors - Создание контрагента из JSON файла', async ({ request }) => {
    const response = await request.post(API_URL, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`},
        data: contractorData
    });

    expect(response.status()).toBe(201);
});