import express from "express"
import AuthController from "../../controllers/auth"

const authAPI = express.Router()

// login
authAPI.post("/login", AuthController.login)

// Register
authAPI.post("/register", AuthController.register)

export default authAPI
