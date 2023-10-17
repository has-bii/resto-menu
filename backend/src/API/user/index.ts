import express from "express"
import UsersController from "../../controllers/user"

const userAPI = express.Router()

// Fetch all Users
userAPI.get("/", UsersController.getAllUsers)

// Edit
userAPI.put("/edit", UsersController.edit)

// Edit multiple records
userAPI.put("/edit-users", UsersController.editUsers)

// Delete user
userAPI.delete("/delete", UsersController.deleteUsers)

export default userAPI
