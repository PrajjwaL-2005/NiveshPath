import mongoose from "mongoose";
import Order from "../models/Order.js";
import { executeBuyTrade, executeSellTrade } from "./tradeService.js";

export const MAX_FILL_ATTEMPTS = 5;
export const STALE_CLAIM_MS = 2 * 60 * 1000;

// LIMIT: fill once price crosses in the trader's favor (buy at/under, sell at/over).
// STOP_LOSS: fill once price crosses against the position (sell at/under to cap a loss,
// buy at/over as a breakout stop-entry).
export const isOrderTriggered = ({ orderType, side }, currentPriceInPaise, triggerPriceInPaise) => {
  if (orderType === "LIMIT") {
    return side === "BUY"
      ? currentPriceInPaise <= triggerPriceInPaise
      : currentPriceInPaise >= triggerPriceInPaise;
  }
  return side === "SELL"
    ? currentPriceInPaise <= triggerPriceInPaise
    : currentPriceInPaise >= triggerPriceInPaise;
};

/**
 * Atomically moves an order from PENDING to PROCESSING. Returns the claimed
 * document, or null if another worker already claimed it, it was cancelled,
 * or it's no longer PENDING for any other reason. This single findOneAndUpdate
 * is the only thing standing between correctness and a double-fill when
 * multiple worker processes poll the same order concurrently — the query
 * filter (status: "PENDING") and the update are applied atomically by MongoDB,
 * so exactly one caller ever gets a non-null result back.
 */
export const claimOrder = async (orderId, workerId) => {
  return Order.findOneAndUpdate(
    { _id: orderId, status: "PENDING" },
    { $set: { status: "PROCESSING", claimedAt: new Date(), claimedBy: workerId }, $inc: { attempts: 1 } },
    { new: true }
  );
};

/**
 * Executes a claimed order's trade and finalizes it to FILLED, all inside one
 * transaction. Business-rule failures (insufficient funds/shares at fill time)
 * are terminal and move the order straight to FAILED. Any other error (DB
 * hiccup, process crash mid-transaction) leaves the order in PROCESSING —
 * the stale-claim sweep is responsible for requeuing or giving up on it later.
 */
export const fillClaimedOrder = async (claimedOrder, priceInPaise) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      if (claimedOrder.side === "BUY") {
        await executeBuyTrade({
          session,
          userId: claimedOrder.userId,
          symbol: claimedOrder.symbol,
          quantity: claimedOrder.quantity,
          priceInPaise,
        });
      } else {
        await executeSellTrade({
          session,
          userId: claimedOrder.userId,
          symbol: claimedOrder.symbol,
          quantity: claimedOrder.quantity,
          priceInPaise,
        });
      }

      await Order.updateOne(
        { _id: claimedOrder._id, status: "PROCESSING" },
        { $set: { status: "FILLED", filledPriceInPaise: priceInPaise, filledAt: new Date() } },
        { session }
      );
    });
    return { filled: true };
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 404) {
      await Order.updateOne(
        { _id: claimedOrder._id, status: "PROCESSING" },
        { $set: { status: "FAILED", lastError: error.message } }
      );
      return { filled: false, terminal: true, reason: error.message };
    }
    return { filled: false, terminal: false, reason: error.message };
  } finally {
    await session.endSession();
  }
};

/**
 * Requeues PROCESSING orders whose claim is older than STALE_CLAIM_MS — this is
 * what makes the engine crash-safe. If a worker dies between claiming an order
 * and finalizing it, the order would otherwise sit in PROCESSING forever;
 * this sweep hands it back to PENDING (if attempts remain) or gives up and
 * marks it FAILED (if it has already been retried too many times, e.g. a
 * poison order that always errors).
 */
export const sweepStaleClaims = async (workerId) => {
  const staleCutoff = new Date(Date.now() - STALE_CLAIM_MS);

  const requeued = await Order.updateMany(
    { status: "PROCESSING", claimedAt: { $lt: staleCutoff }, attempts: { $lt: MAX_FILL_ATTEMPTS } },
    { $set: { status: "PENDING" }, $unset: { claimedAt: "", claimedBy: "" } }
  );

  const failed = await Order.updateMany(
    { status: "PROCESSING", claimedAt: { $lt: staleCutoff }, attempts: { $gte: MAX_FILL_ATTEMPTS } },
    { $set: { status: "FAILED", lastError: `Exceeded ${MAX_FILL_ATTEMPTS} fill attempts` } }
  );

  return { requeuedCount: requeued.modifiedCount, failedCount: failed.modifiedCount };
};

export const expireStaleOrders = async () => {
  const result = await Order.updateMany(
    { status: "PENDING", expiresAt: { $ne: null, $lte: new Date() } },
    { $set: { status: "EXPIRED" } }
  );
  return result.modifiedCount;
};

export const cancelOrder = async (orderId, userId) => {
  return Order.findOneAndUpdate(
    { _id: orderId, userId, status: "PENDING" },
    { $set: { status: "CANCELLED" } },
    { new: true }
  );
};
