// One-off migration: convert existing rupee-float fields to integer-paise fields.
// Run manually with MONGO_URI set: node server/scripts/migrateMoneyToPaise.js
import "dotenv/config";
import mongoose from "mongoose";
import { toPaise } from "../utils/money.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  const users = await db.collection("users").find({ virtualBalance: { $exists: true } }).toArray();
  for (const u of users) {
    await db.collection("users").updateOne(
      { _id: u._id },
      { $set: { virtualBalanceInPaise: toPaise(u.virtualBalance) }, $unset: { virtualBalance: "" } }
    );
  }
  console.log(`Users migrated: ${users.length}`);

  const holdings = await db.collection("portfolios").find({ avgBuyPrice: { $exists: true } }).toArray();
  for (const h of holdings) {
    await db.collection("portfolios").updateOne(
      { _id: h._id },
      { $set: { avgBuyPriceInPaise: toPaise(h.avgBuyPrice) }, $unset: { avgBuyPrice: "" } }
    );
  }
  console.log(`Portfolio holdings migrated: ${holdings.length}`);

  const trades = await db.collection("trades").find({ price: { $exists: true } }).toArray();
  for (const t of trades) {
    await db.collection("trades").updateOne(
      { _id: t._id },
      { $set: { priceInPaise: toPaise(t.price) }, $unset: { price: "" } }
    );
  }
  console.log(`Trades migrated: ${trades.length}`);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
