import { FullConfig } from '@playwright/test';
import fs from 'fs';
import dotenv from 'dotenv';

async function globalSetup(config: FullConfig) {
  // Загружаем .env
  dotenv.config({ path: "env_settings/.env.test2" });

  // Создаём папку, если её нет
  const storageDir = "API-Tests";
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // Здесь можно выполнить логин в API и сохранить токен в storageState.json
  // Например:
  // const response = await fetch(`${process.env.API_BASE_URL}/login`, { ... });
  // const authData = await response.json();
  // fs.writeFileSync(`${storageDir}/storageState.json`, JSON.stringify({ cookies: [], origins: [] }));
}

export default globalSetup;