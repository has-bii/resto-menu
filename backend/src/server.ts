import { env, loadEnv } from "./lib/env"

loadEnv() // Executed synchronously before the rest of your app loads

import express from "express"
import router from "./API"
import cookieParser from "cookie-parser"
import cors from "cors"
import fileUpload from "express-fileupload"

const app = express()
const port = env.PORT || 3000

// Enable cors
app.use(
    cors({
        origin: env.FE_URL,
        credentials: true,
    })
)

// Enable Cookie Parser
app.use(cookieParser())

// Enable body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    fileUpload({
        limits: { fileSize: 5 * 1024 * 1024 },
    })
)

app.use("/api", router)

app.listen(port, () => {
    console.log(`\n⚡ Server running at http://localhost:${port}`)
})
