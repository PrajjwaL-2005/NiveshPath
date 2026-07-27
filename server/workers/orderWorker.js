import cron from "node-cron";
import crypto from "crypto";
import Order from "../models/Order.js";
import { fetchStockPriceFromFinnhub } from "../utils/finnhubClient.js";
import { toPaise } from "../utils/money.js";
import {
  isOrderTriggered,
  claimOrder,
  fillClaimedOrder,
  sweepStaleClaims,
  expireStaleOrders,
} from "../services/orderService.js";

// Identifies this worker process in Order.claimedBy — purely for observability/
// debugging. Correctness against concurrent workers comes from the atomic
// claimOrder() findOneAndUpdate, not from this id.
const WORKER_ID = `${process.pid}-${crypto.randomUUID()}`;
const CRON_SCHEDULE = process.env.ORDER_WORKER_CRON || "*/30 * * * * *";

let tickInProgress = false;

const processSymbol = async (symbol, priceInPaise) => {
  const pendingOrders = await Order.find({ status: "PENDING", symbol });
  const triggered = pendingOrders.filter((order) =>
    isOrderTriggered(order, priceInPaise, order.triggerPriceInPaise)
  );

  for (const order of triggered) {
    const claimed = await claimOrder(order._id, WORKER_ID);
    if (!claimed) continue; // another worker claimed it first, or it was cancelled meanwhile

    const result = await fillClaimedOrder(claimed, priceInPaise);
    if (!result.filled) {
      console.warn(`[orderWorker] order ${claimed._id} not filled this tick: ${result.reason}`);
    }
  }
};

export const runOrderWorkerTick = async () => {
  if (tickInProgress) return; // previous tick still running (e.g. slow price fetch) — skip, don't pile up
  tickInProgress = true;

  try {
    await sweepStaleClaims(WORKER_ID);
    await expireStaleOrders();

    const symbols = await Order.distinct("symbol", { status: "PENDING" });
    if (symbols.length === 0) return;

    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const quote = await fetchStockPriceFromFinnhub(symbol);
          const price = quote?.c;
          if (!price || price <= 0) return;
          await processSymbol(symbol, toPaise(price));
        } catch (error) {
          console.error(`[orderWorker] price fetch failed for ${symbol}:`, error.message);
        }
      })
    );
  } catch (error) {
    console.error("[orderWorker] tick failed:", error);
  } finally {
    tickInProgress = false;
  }
};

export const startOrderWorker = () => {
  if (process.env.ENABLE_ORDER_WORKER === "false") {
    console.log("⏸️  Order worker disabled (ENABLE_ORDER_WORKER=false)");
    return null;
  }

  console.log(`🔁 Order worker started (id ${WORKER_ID}, schedule "${CRON_SCHEDULE}")`);
  return cron.schedule(CRON_SCHEDULE, runOrderWorkerTick);
};
