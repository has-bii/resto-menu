import express from "express"
import userAPI from "./user"
import authAPI from "./auth"
import categoryAPI from "./category"
import Middleware from "../middleware/verifyToken"
import menuAPI from "./menu"
import restoAPI from "./resto"

const router = express.Router()

router.use("/", restoAPI)

router.use("/auth", authAPI)

router.use(Middleware.verifyToken)

router.use("/user", userAPI)

router.use("/menu", menuAPI)

router.use("/category", categoryAPI)

export default router
