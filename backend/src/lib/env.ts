import { EnvType, load } from "ts-dotenv"

export type Env = EnvType<typeof schema>

export const schema = {
    NODE_ENV: String,
    BASE_URL: String,
    DATABASE_URL: String,
    SECRET_KEY: String,
    SALT: String,
    PORT: Number,
}

export let env: Env

export function loadEnv(): void {
    env = load(schema)
}
