import { Request, Response } from "express"
import prisma from "../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { env } from "../lib/env"
import KEY from "../utils/key"

interface IUserReq {
    email: string
    password: string
}

interface IUserRegister extends IUserReq {
    name: string
}

interface ICookieOptions {
    secure: boolean
    domain: string
    expires?: Date
}

const USER = prisma.user
const TOKEN = prisma.token

class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const user: IUserRegister = req.body

            // if name, email, password empty
            if (!user.name || !user.email || !user.password) {
                res.status(400).json({ message: "Name, email, and password are required!" })
                return
            }

            const isExist = await USER.findUnique({ where: { email: user.email } })

            if (isExist) {
                res.status(400).json({ message: "Email is already in use!" })
                return
            }

            // Create user
            await USER.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: bcrypt.hashSync(user.password, KEY.getSalt()),
                },
            }).catch((error: any) => {
                throw new Error(`Failed to create new user\nError: ${error}`)
            })

            res.status(201).json({ message: "User has been created." })
        } catch (error) {
            res.status(500).json({
                message: "Failed to register new user!",
            })

            console.error("Failed to register new user!\n", error)
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const user: IUserReq = req.body

            // if email or password empty
            if (!user.email || !user.password) {
                res.status(400).json({ message: "Name and password are required!" })
                return
            }

            // Find user from database
            const data = await USER.findUnique({ where: { email: user.email } })

            // Return response
            if (data === null) {
                res.status(401).json({ message: "Email is not registered!" })
                return
            }

            // Check Password
            const checkPW = bcrypt.compareSync(user.password, data.password)

            if (!checkPW) {
                res.status(401).json({ message: "Password is incorrect!" })
                return
            }

            // Create token
            const token = jwt.sign(
                { id: data.id, name: data.name, email: data.email },
                KEY.getSecret(),
                { algorithm: "HS256" }
            )

            // Create Token Option
            const cookieOptions: ICookieOptions = {
                secure: true,
                domain: env.FE_URL
            }

            // Add expire to the token
            if (req.body.save === true) cookieOptions.expires = new Date(Date.now() + 7 * 86400000)

            // Create or Update Token in DB
            await TOKEN.upsert({
                where: {
                    userId: data.id,
                },
                create: {
                    userId: data.id,
                    token: token,
                    expire: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                },
                update: {
                    token: token,
                    expire: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                },
            })

            // Return response
            if (token) {
                res.status(200)
                    .cookie("user_access", token, cookieOptions)
                    .json({ message: "Login successful" })
            } else {
                res.status(500).json({ message: "Failed to create token" })
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to login! Unexpected error has occurred." })

            console.error("Failed to login", error)
        }
    }
}

export default AuthController
