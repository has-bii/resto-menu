import fs from "fs"
import crypto from "crypto"
import bcrypt from "bcrypt"

const PATH = ".env"
const MARKER = "SECRET_KEY="
const secretKey = crypto.randomBytes(32).toString("hex")

const MARKER2 = "SALT="
const salt = bcrypt.genSaltSync(10)

try {
    // Check if .env exists
    if (!fs.existsSync(PATH)) {
        // Copy .env.example
        fs.copyFileSync(".env.example", PATH)
    }

    // Read .env
    const data = fs.readFileSync(PATH, "utf-8")

    // Finding SECRET_KEY index
    const markerIndex = data.indexOf(MARKER)

    if (markerIndex === -1) {
        throw new Error("Marker not found in the file.")
    }

    // Inserting Secret Key to .env file
    const updatedDataSecretKey =
        data.slice(0, markerIndex + MARKER.length) +
        secretKey +
        data.slice(markerIndex + MARKER.length)

    // Finding SALT= index
    const markerIndex2 = updatedDataSecretKey.indexOf(MARKER2)

    if (markerIndex2 === -1) {
        throw new Error("Marker not found in the file.")
    }

    // Inserting Salt to .env file
    const updatedData =
        updatedDataSecretKey.slice(0, markerIndex2 + MARKER2.length) +
        salt +
        updatedDataSecretKey.slice(markerIndex2 + MARKER2.length)

    // Writing updated content of .env file
    fs.writeFileSync(PATH, updatedData, "utf-8")

    console.log("Secret Key generated successfully")
} catch (error) {
    console.error("Failed to generate Secret Key!", error)
}
