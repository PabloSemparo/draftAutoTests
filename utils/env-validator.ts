// Простая версия без dotenv - используем встроенные возможности Playwright
export class EnvValidator {
    private requiredEnvVars: string[] = [
        'BASE_URL'
    ];

    validate() {
        const missingVars = this.requiredEnvVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missingVars.join(', ')}\n` +
                'Please create .env file or set environment variables'
            );
        }

        console.log('✅ Environment variables validated');
    }

    getEnv(varName: string): string {
        const value = process.env[varName];
        if (!value) {
            throw new Error(`Environment variable ${varName} is not set`);
        }
        return value;
    }

    getOptionalEnv(varName: string, defaultValue: string = ''): string {
        return process.env[varName] || defaultValue;
    }
}

export const envValidator = new EnvValidator();