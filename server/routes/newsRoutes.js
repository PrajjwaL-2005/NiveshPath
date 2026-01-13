import express from "express";
import {
  getMarketNews,
  getCompanyNews
} from "../controllers/newsController.js";

const router = express.Router();

router.get("/market", getMarketNews);
router.get("/company/:symbol", getCompanyNews);

// ✅ THIS LINE IS CRITICAL
export default router;
