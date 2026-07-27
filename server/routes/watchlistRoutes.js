import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlistController.js";
import { validate } from "../middleware/validate.js";
import { watchlistBodySchema, watchlistParamSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/", protect, getWatchlist);
router.post("/", protect, validate(watchlistBodySchema), addToWatchlist);
router.delete(
  "/:symbol",
  protect,
  validate(watchlistParamSchema, "params"),
  removeFromWatchlist
);

export default router;
