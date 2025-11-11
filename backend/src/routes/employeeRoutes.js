import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees
} from "../controllers/employeeController.js";
import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("picture"), createEmployee);
router.get("/", authMiddleware, getEmployees);
router.get("/search", authMiddleware, searchEmployees);
router.get("/:id", authMiddleware, getEmployeeById);
router.put("/:id", authMiddleware, upload.single("picture"), updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
