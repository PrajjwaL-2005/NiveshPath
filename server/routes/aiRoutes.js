import express from "express";
import { chatWithStockAI } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { stockChatSchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/stock-chat", authMiddleware, validate(stockChatSchema), chatWithStockAI);

export default router;
