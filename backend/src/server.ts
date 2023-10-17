import { env, loadEnv } from "./lib/env"

loadEnv() // Executed synchronously before the rest of your app loads

import express from "express"
import router from "./API"
import cookieParser from "cookie-parser"
import cors from "cors"
import { createProxyMiddleware } from "http-proxy-middleware"
import fileUpload from "express-fileupload"

const app = express()
const port = env.PORT || 3000

// Enable cors
app.use(
    cors({
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

// Serve static files from the Vite development server in development
if (env.NODE_ENV === "development") {
    // Proxy requests to the Vite development server
    app.use("/", createProxyMiddleware({ target: env.BASE_URL, changeOrigin: true }))
} else {
    // Serve Vite's static files in production
    app.use("/", express.static("dist/frontend"))
}

app.listen(port, () => {
    console.log(`\n⚡ Server running at http://localhost:${port}`)
})
