import { EnvType, load } from "ts-dotenv"

export type Env = EnvType<typeof schema>

export const schema = {
    FE_URL: String,
    DATABASE_URL: String,
    PORT: Number,
}

export let env: Env

export function loadEnv(): void {
    env = load(schema)
}
