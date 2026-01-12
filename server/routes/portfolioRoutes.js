import express from "express";
import protect from "../middleware/authMiddleware.js" ;
import { getPortfolio, getTrades } from "../controllers/portfolioController.js";

const router = express.Router();

router.get("/", protect, getPortfolio);
router.get("/trades", protect, getTrades);

export default router;
