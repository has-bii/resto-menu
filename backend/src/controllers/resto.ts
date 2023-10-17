import { Request, Response } from "express"
import prisma from "../lib/prisma"

export default class RestoController {
    static async fetch(req: Request, res: Response) {
        try {
            const name = req.params.name

            if (!name) return res.status(400).json({ message: "Name parameter is required!" })

            const data = await prisma.user.findFirst({
                where: { name },
                select: {
                    id: true,
                    name: true,
                    picture: true,
                    menus: {
                        select: {
                            id: true,
                            name: true,
                            desc: true,
                            category: true,
                            price: true,
                            picture: true,
                            createdAt: true,
                        },
                    },
                    categories: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })

            if (!data) return res.status(404).json({ message: "Restaurant not found!" })

            res.status(200).json({ message: "Fetched Restaurant successfully.", data })
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch restaurant!" })

            console.error("Failed to fetch restaurant!\nError: ", error)
        }
    }

    static async fetchMenu(req: Request, res: Response) {
        try {
            const name = req.params.name
            const id = req.params.id

            if (!name || !id)
                return res.status(400).json({ message: "Name and ID parameters are required!" })

            const data = await prisma.menu.findFirst({
                where: { user: { name }, id: parseInt(id) },
                select: {
                    id: true,
                    name: true,
                    desc: true,
                    category: { select: { id: true, name: true } },
                    price: true,
                    picture: true,
                    createdAt: true,
                },
            })

            if (!data) return res.status(404).json({ message: "Menu not found!" })

            res.status(200).json({ message: "Fetched menu successfully.", data })
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch menu!" })

            console.error("Failed to fetch menu!\nError: ", error)
        }
    }
}
