import dotenv from 'dotenv'

dotenv.config({path: '.env'})

export const config = {
    PORT: Number(process.env.PORT),
    MONGO_URL: String(process.env.MONGO_URL),
    GEMINI_API_KEY_1: String(process.env.GEMINI_API_KEY_1),
    GEMINI_API_KEY_2: String(process.env.GEMINI_API_KEY_2),
    CLIENT_URL: String(process.env.CLIENT_URL),
    JWT_SECRET: String(process.env.JWT_SECRET),
    'GEMINI_FLASH_LITE_LATEST': 'gemini-flash-lite-latest',
    'GEMINI2.5':'gemini-2.5-flash',
    'GEMINI2.0':'gemini-2.0-flash',
    ADMIN_KEY: String(process.env.ADMIN_KEY),
    UPLOADTHING_TOKEN: String(process.env.UPLOADTHING_TOKEN),
    FIREBASE_PROJECT_ID: String(process.env.FIREBASE_PROJECT_ID),
    ENVIRONMENT: String(process.env.ENVIRONMENT),
}