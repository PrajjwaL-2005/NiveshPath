import Order from "../models/Order.js";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import { cancelOrder as cancelOrderInDb } from "../services/orderService.js";
import { toPaise, toRupees } from "../utils/money.js";

const serializeOrder = (order) => ({
  id: order._id,
  symbol: order.symbol,
  side: order.side,
  orderType: order.orderType,
  triggerPrice: toRupees(order.triggerPriceInPaise),
  quantity: order.quantity,
  status: order.status,
  filledPrice: order.filledPriceInPaise != null ? toRupees(order.filledPriceInPaise) : null,
  filledAt: order.filledAt,
  lastError: order.lastError,
  expiresAt: order.expiresAt,
  createdAt: order.createdAt,
});

/* ============================
   CREATE (place a limit / stop-loss order)
============================ */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol, side, orderType, triggerPrice, quantity, expiresAt } = req.body;
    const triggerPriceInPaise = toPaise(triggerPrice);

    // Fail fast on orders that can never fill given current holdings/balance.
    // This is a point-in-time sanity check, not a fund/share reservation — the
    // worker re-validates against live balance/holdings at fill time, since
    // other trades can change them in between.
    if (side === "BUY") {
      const user = await User.findById(userId);
      const worstCaseCostInPaise = triggerPriceInPaise * quantity;
      if (!user || user.virtualBalanceInPaise < worstCaseCostInPaise) {
        return res.status(400).json({ message: "Insufficient balance for this order" });
      }
    } else {
      const holding = await Portfolio.findOne({ userId, symbol });
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ message: "Not enough shares held for this order" });
      }
    }

    const order = await Order.create({
      userId,
      symbol,
      side,
      orderType,
      triggerPriceInPaise,
      quantity,
      expiresAt: expiresAt ?? null,
    });

    return res.status(201).json({ message: "Order placed", order: serializeOrder(order) });
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);
    return res.status(500).json({ message: "Failed to place order" });
  }
};

/* ============================
   LIST (current user's orders)
============================ */
export const listOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page, limit } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return res.json({
      orders: orders.map(serializeOrder),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("ORDER LIST ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ============================
   GET ONE
============================ */
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ order: serializeOrder(order) });
  } catch (error) {
    console.error("ORDER GET ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch order" });
  }
};

/* ============================
   CANCEL (only while still PENDING)
============================ */
export const cancelOrder = async (req, res) => {
  try {
    const cancelled = await cancelOrderInDb(req.params.id, req.user.id);
    if (!cancelled) {
      return res.status(409).json({
        message: "Order can no longer be cancelled — it may already be filled, expired, or processing",
      });
    }
    return res.json({ message: "Order cancelled", order: serializeOrder(cancelled) });
  } catch (error) {
    console.error("ORDER CANCEL ERROR:", error);
    return res.status(500).json({ message: "Failed to cancel order" });
  }
};
