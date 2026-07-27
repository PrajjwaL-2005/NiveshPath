import express from "express";
import protect from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createOrderSchema,
  orderIdParamSchema,
  listOrdersQuerySchema,
} from "../validation/schemas.js";
import {
  createOrder,
  listOrders,
  getOrder,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, validate(createOrderSchema), createOrder);
router.get("/", protect, validate(listOrdersQuerySchema, "query"), listOrders);
router.get("/:id", protect, validate(orderIdParamSchema, "params"), getOrder);
router.delete("/:id", protect, validate(orderIdParamSchema, "params"), cancelOrder);

export default router;
