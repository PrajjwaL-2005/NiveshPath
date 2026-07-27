import express from "express";
import protect from "../middleware/authMiddleware.js";
import { buyStock, sellStock } from "../controllers/tradeController.js";
import { validate } from "../middleware/validate.js";
import { tradeSchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/buy", protect, validate(tradeSchema), buyStock);
router.post("/sell", protect, validate(tradeSchema), sellStock);

export default router;
