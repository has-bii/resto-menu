import { Request, Response } from "express"
import prisma from "../lib/prisma"
import { IUser } from "../types/global"
import { UploadedFile } from "express-fileupload"
import { existsSync, unlinkSync } from "fs"
import { json } from "body-parser"

interface IMenuBody {
    name: string
    desc: string
    categoryId: string
    price: string
}

interface IMenuEditBody {
    id: string
    name?: string
    desc?: string
    categoryId?: string
    price?: string
}

export default class MenuController {
    static async fetch(req: Request, res: Response) {
        try {
            const id: string = req.params.id

            const user: IUser = req.body.user

            if (id) {
                const data = await prisma.menu.findUnique({ where: { id: parseInt(id) } })

                if (!data) {
                    return res.status(404).json({ message: "Menu not found!" })
                }

                return res.status(200).json({ message: "Fetched menu success.", data })
            }

            const data = await prisma.menu
                .findMany({ where: { userId: user.id } })
                .catch((error: string | undefined) => {
                    throw new Error(error)
                })

            res.status(200).json({ message: "Fetched menu success.", data })
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch menu! Unexpected error has occurred.",
            })

            console.error("Failed to fetch menu!\nError: ", error)
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const user: IUser = req.body.user
            const body: IMenuBody = req.body
            const picture = req.files?.picture as UploadedFile

            const publicPath = "frontend/public"
            let uploadPath = ""

            if (!body.name || !body.price) {
                return res.status(400).json({ message: "Name and price are required!" })
            }

            // Add picture
            if (picture) {
                const allowedMimeTypes = ["image/jpeg", "image/png"]

                // Check type of picture
                if (!allowedMimeTypes.includes(picture.mimetype)) {
                    return res
                        .status(400)
                        .json({ message: "Invalid file type. Allowed types are: JPEG & PNG" })
                }

                const pictureName = `${user.id}_${body.name.replace(/\s/g, "_")}.${
                    picture.mimetype.split("/")[1]
                }`

                // Define uploading path
                uploadPath = "/menus/" + pictureName

                // Move file to public/picture
                picture.mv(publicPath + uploadPath, (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error uploading file." })
                    }
                })
            }

            const menuRecord = await prisma.menu.create({
                data: {
                    name: body.name,
                    desc: body.desc ? body.desc : null,
                    userId: user.id,
                    categoryId: parseInt(body.categoryId),
                    price: parseFloat(body.price.replace(",", ".")),
                    picture: uploadPath ? uploadPath : null,
                    createdAt: new Date(),
                },
            })

            res.status(200).json({ message: "Created new menu.", data: menuRecord })
        } catch (error) {
            res.status(500).json({ message: "Failed to create new menu!" })

            console.error("Failed to create new menu!\nError: ", error)
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const user: IUser = req.body.user
            const body: IMenuEditBody = req.body
            const picture = req.files?.picture as UploadedFile

            const publicPath = "frontend/public"
            let uploadPath = ""

            const menuRecord = await prisma.menu.findUnique({
                where: { id: parseInt(body.id), userId: user.id },
            })

            if (!menuRecord) return res.status(404).json({ message: "Menu not found!" })

            // Add picture
            if (picture) {
                const allowedMimeTypes = ["image/jpeg", "image/png"]

                // Check type of picture
                if (!allowedMimeTypes.includes(picture.mimetype)) {
                    return res
                        .status(400)
                        .json({ message: "Invalid file type. Allowed types are: JPEG & PNG" })
                }

                const pictureName = `${user.id}_${
                    body.name ? body.name.replace(/\s/g, "_") : menuRecord.name.replace(/\s/g, "_")
                }.${picture.mimetype.split("/")[1]}`

                // Define uploading path
                uploadPath = "/menus/" + pictureName

                // Move file to public/picture
                picture.mv(publicPath + uploadPath, (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error uploading file." })
                    }
                })

                if (menuRecord.picture && existsSync(publicPath + menuRecord.picture))
                    unlinkSync(publicPath + menuRecord.picture)
            }

            const data = await prisma.menu.update({
                where: { id: parseInt(body.id), userId: user.id },
                data: {
                    name: body.name ? body.name : menuRecord.name,
                    desc: body.desc ? body.desc : menuRecord.desc,
                    price: body.price ? parseFloat(body.price.replace(",", ".")) : menuRecord.price,
                    categoryId: body.categoryId ? parseInt(body.categoryId) : menuRecord.categoryId,
                    picture: uploadPath ? uploadPath : menuRecord.picture,
                    updatedAt: new Date(),
                },
            })

            res.status(200).json({ message: "Updated menu success.", data })
        } catch (error) {
            res.status(500).json({
                message: "Failed to update menu! Unexpected error has occurred.",
            })

            console.error("Failed to update menu!\nError: ", error)
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id
            const user: IUser = req.body.user

            if (!id) return res.status(400).json({ message: "ID is required!" })

            const menuRecord = await prisma.menu.findUnique({
                where: { id: parseInt(id), userId: user.id },
            })

            if (!menuRecord) return res.status(404).json({ message: "Menu not found!" })

            await prisma.menu.delete({ where: { id: parseInt(id), userId: user.id } })

            res.status(200).json({ message: "Deleted menu successfully." })
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete menu! Unexpected error has occurred.",
            })

            console.error("Failed to delete menu!\nError: ", error)
        }
    }
}
