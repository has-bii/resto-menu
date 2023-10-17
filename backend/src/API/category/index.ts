import express from "express"
import CategoryController from "../../controllers/category"

const categoryAPI = express.Router()

// Fetch category
categoryAPI.get("/", CategoryController.fetch)

// Create new
categoryAPI.post("/create", CategoryController.create)

// Edit
categoryAPI.put("/update", CategoryController.edit)

// Delete
categoryAPI.delete("/delete/:id", CategoryController.delete)

export default categoryAPI
