import express from "express"
import { createTask, deleteTaskById, getAllTask, getTaskById, updateTaskById } from "./controller"

const router = express.Router()

router.get("/",getAllTask)
router.get("/:id", getTaskById)
router.delete("/:id", deleteTaskById)
router.post("/",createTask)
router.put("/:id",updateTaskById)

export default router