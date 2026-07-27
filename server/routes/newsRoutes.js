import express from "express";
import {
  getMarketNews,
  getCompanyNews
} from "../controllers/newsController.js";
import { validate } from "../middleware/validate.js";
import { marketNewsQuerySchema, companyNewsParamSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/market", validate(marketNewsQuerySchema, "query"), getMarketNews);
router.get(
  "/company/:symbol",
  validate(companyNewsParamSchema, "params"),
  getCompanyNews
);

// ✅ THIS LINE IS CRITICAL
export default router;
