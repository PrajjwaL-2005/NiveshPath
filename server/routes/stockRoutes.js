import express from "express";
import { searchStock } from "../controllers/stockController.js";
import { searchStocks } from "../controllers/stockController.js";

const router = express.Router();
router.get("/search", searchStocks);
router.get("/:symbol", searchStock);

export default router;
