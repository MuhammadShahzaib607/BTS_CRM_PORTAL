import express from "express"
import { verifyToken } from "../utils/verifyToken.js";
import {
    signup,
    login,
    checkToken,
    getSingleUser,
    getAllUsers,
 } from "../controllers/usersControllers.js";

const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.post("/check-token", checkToken);
router.get("/:id", verifyToken, getSingleUser)
router.get("/all-users/:id", verifyToken, getAllUsers)

export default router;