import express from "express";
import protect from "../middleware/authMiddleware.js";
import { buyStock, sellStock } from "../controllers/tradeController.js";

const router = express.Router();

router.post("/buy", protect, buyStock);
router.post("/sell", protect, sellStock);

export default router;
