import { Request, Response } from "express"
import { IUser } from "../types/global"
import prisma from "../lib/prisma"
import bcrypt from "bcrypt"
import { env } from "../lib/env"
import { Role } from "@prisma/client"
import { UploadedFile } from "express-fileupload"
import { existsSync, unlinkSync } from "fs"

const USER = prisma.user

interface IEditBody {
    name?: string
    email?: string
    password?: string
    newPassword?: string
}

interface IEditUsersBody {
    id: string[]
    role: Role
}

class UsersController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const user: IUser = req.body.user

            if (user.role === "USER") {
                res.status(403).json({ message: "Permission denied!" })
                return
            }

            // Retrieving all Users
            const data = await USER.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isVerified: true,
                    picture: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })

            res.status(200).json({
                message: "Users data has been fetched successfully.",
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch Users data!",
                data: [],
            })

            console.error("Failed to fetch Users data\nError: ", error)
        }
    }

    static async edit(req: Request, res: Response) {
        try {
            const body: IEditBody = req.body
            const user: IUser = req.body.user
            const picture = req.files?.picture as UploadedFile

            const publicPath = "frontend/public"
            let uploadPath = ""

            const userRecord = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })

            // Change password or email schema
            if (body.newPassword || body.email) {
                if (!body.password) {
                    res.status(400).json({ message: "Password is required!" })
                    return
                }

                // Check password
                if (!bcrypt.compareSync(body.password, userRecord.password)) {
                    res.status(400).json({ message: "Invalid password!" })
                    return
                }
            }

            // Change picture schema
            if (picture) {
                const allowedMimeTypes = ["image/jpeg", "image/png"]

                // Check type of picture
                if (!allowedMimeTypes.includes(picture.mimetype)) {
                    return res
                        .status(400)
                        .json({ message: "Invalid file type. Allowed types are: JPEG & PNG" })
                }

                // Define uploading path
                uploadPath = "/photos/" + `${user.id}_photo.${picture.mimetype.split("/")[1]}`

                // Move file to public/picture
                picture.mv(publicPath + uploadPath, (err: any) => {
                    if (err) {
                        return res.status(500).json({ message: "Error uploading file." })
                    }
                })

                if (userRecord.picture && existsSync(publicPath + userRecord.picture))
                    unlinkSync(publicPath + userRecord.picture)
            }

            // Change name user
            await prisma.user
                .update({
                    where: { id: user.id },
                    data: {
                        name: body.name ? body.name : userRecord.name,
                        email: body.email ? body.email : userRecord.email,
                        password: body.password
                            ? bcrypt.hashSync(body.password, env.SALT)
                            : userRecord.password,
                        picture: uploadPath ? uploadPath : userRecord.picture,
                        updatedAt: new Date(),
                    },
                })
                .then(() => {
                    return res.status(200).json({ message: "User has been updated" })
                })
                .catch((err) => {
                    console.error("Failed to update user!", err)
                    return res.status(500).json({ message: "Failed to updated user!" })
                })
        } catch (error) {
            res.status(500).json({
                message: "Failed to edit User!",
            })

            console.error("Failed to edit User\nError: ", error)
        }
    }

    static async editUsers(req: Request, res: Response) {
        try {
            const body: IEditUsersBody = req.body

            const user: IUser = req.body.user

            if (user.role !== "ADMIN") {
                res.status(403).json({ message: "Permission denied!" })

                return
            }

            const IDs = body.id.map((data) => parseInt(data))

            await prisma.user.updateMany({
                where: { id: { in: IDs } },
                data: { role: body.role, updatedAt: new Date() },
            })

            res.status(200).json({ message: "Users have been updated" })
        } catch (error) {
            res.status(500).json({
                message: "Failed to edit Users!",
            })

            console.error("Failed to edit Users\nError: ", error)
        }
    }

    static async deleteUsers(req: Request, res: Response) {
        try {
            const user: IUser = req.body.user
            const IDs: string[] = req.body.id
            const password: string = req.body.password

            // Check single (the user itself) or multiple (as admin)
            if (IDs) {
                // Check role
                if (user.role !== "ADMIN") {
                    res.status(403).json({ message: "Permission denied!" })

                    return
                }

                // Delete multiple records
                await prisma.user.deleteMany({
                    where: { id: { in: IDs.map((id) => parseInt(id)) } },
                })
            } else {
                // Find user itself
                const data = await prisma.user.findUnique({ where: { id: user.id } })

                // Res error if not found
                if (!data) {
                    res.status(404).json({ message: "User not found!" })
                    return
                }

                // Check password
                if (!password) {
                    res.status(400).json({ message: "Password is required!" })
                    return
                }

                // Compare password
                if (!bcrypt.compareSync(password, data.password)) {
                    res.status(400).json({ message: "Password is invalid!" })
                    return
                }

                // Delete the user itself
                await prisma.user.delete({ where: { id: user.id } })
            }

            res.status(200).json({ message: "User has been deleted" })
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete!",
            })

            console.error("Failed to delete user\nError: ", error)
        }
    }
}

export default UsersController
