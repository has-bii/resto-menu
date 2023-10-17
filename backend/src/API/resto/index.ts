import express from "express"
import RestoController from "../../controllers/resto"

const restoAPI = express.Router()

// Fetch Restaurant
restoAPI.get("/:name", RestoController.fetch)

// Fetch menu
restoAPI.get("/:name/:id", RestoController.fetchMenu)

export default restoAPI
