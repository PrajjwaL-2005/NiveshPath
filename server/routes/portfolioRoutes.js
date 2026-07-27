import express from "express";
import protect from "../middleware/authMiddleware.js" ;
import { getPortfolio, getTrades } from "../controllers/portfolioController.js";
import { validate } from "../middleware/validate.js";
import { getTradesQuerySchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/", protect, getPortfolio);
router.get("/trades", protect, validate(getTradesQuerySchema, "query"), getTrades);

export default router;
