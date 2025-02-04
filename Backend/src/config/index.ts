import dotenv from 'dotenv'

dotenv.config({path: '.env'})

export const config = {
    PORT: Number(process.env.PORT),
    MONGO_URL: String(process.env.MONGO_URL),
    GEMINI_API_KEY: String(process.env.GEMINI_API_KEY),
    CLIENT_URL: String(process.env.CLIENT_URL),
    JWT_SECRET: String(process.env.JWT_SECRET)
}