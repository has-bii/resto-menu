import express from "express"
import MenuController from "../../controllers/menu"

const menuAPI = express.Router()

// Fetch menu
menuAPI.get("/:id?", MenuController.fetch)

// Create menu
menuAPI.post("/create", MenuController.create)

// Update menu
menuAPI.put("/update", MenuController.update)

export default menuAPI
