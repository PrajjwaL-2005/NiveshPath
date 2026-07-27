import express from "express";
import { searchStock } from "../controllers/stockController.js";
import { searchStocks } from "../controllers/stockController.js";
import { getStockDetails } from "../controllers/stockController.js";
import { getStockCandles } from "../controllers/stockController.js";
import { validate } from "../middleware/validate.js";
import {
  symbolParamSchema,
  candlesQuerySchema,
  searchQuerySchema,
} from "../validation/schemas.js";

const router = express.Router();
router.get("/search", validate(searchQuerySchema, "query"), searchStocks);
router.get(
  "/:symbol/candles",
  validate(symbolParamSchema, "params"),
  validate(candlesQuerySchema, "query"),
  getStockCandles
);
router.get("/:symbol/details", validate(symbolParamSchema, "params"), getStockDetails);
router.get("/:symbol", validate(symbolParamSchema, "params"), searchStock);


export default router;
