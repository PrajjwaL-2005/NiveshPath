import { z } from "zod";

const symbol = z
  .string()
  .trim()
  .min(1, "Symbol is required")
  .max(15, "Symbol is too long")
  .regex(/^[A-Za-z0-9.\-]+$/, "Invalid symbol")
  .transform((s) => s.toUpperCase());

/* ============================
   AUTH
============================ */
export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/* ============================
   TRADE
============================ */
export const tradeSchema = z.object({
  symbol,
  quantity: z.coerce
    .number("Quantity must be a number")
    .int("Quantity must be a whole number")
    .positive("Quantity must be a positive integer"),
});

/* ============================
   PORTFOLIO
============================ */
export const getTradesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/* ============================
   STOCKS
============================ */
export const symbolParamSchema = z.object({ symbol });

export const candlesQuerySchema = z.object({
  range: z.enum(["1D", "7D", "1M", "1Y", "ALL"], {
    message: "range must be one of 1D, 7D, 1M, 1Y, ALL",
  }),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
});

/* ============================
   NEWS
============================ */
export const marketNewsQuerySchema = z.object({
  category: z.enum(["general", "forex", "crypto", "merger"]).default("general"),
});

export const companyNewsParamSchema = z.object({ symbol });

/* ============================
   AI
============================ */
export const stockChatSchema = z.object({
  symbol,
  question: z.string().trim().min(1, "Question is required"),
  stockData: z.unknown().optional(),
  history: z.array(z.unknown()).optional(),
});

/* ============================
   WATCHLIST
============================ */
export const watchlistBodySchema = z.object({ symbol });
export const watchlistParamSchema = z.object({ symbol });
