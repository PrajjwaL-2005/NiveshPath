import express from "express";
import { chatWithStockAI } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/stock-chat", authMiddleware, chatWithStockAI);

export default router;
