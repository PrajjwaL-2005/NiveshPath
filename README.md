# NiveshPath

A virtual stock trading and learning platform. Practice buying/selling real-market-priced stocks with a simulated wallet, track your portfolio, and get AI-assisted insights — with no real money involved.

## Tech Stack

**Frontend** — React 18, Vite, React Router, Tailwind CSS, Chart.js, Axios
**Backend** — Node.js, Express 5, MongoDB (Mongoose 9), JWT authentication
**External APIs** — Finnhub (quotes, search, company profile/metrics), Yahoo Finance (historical candles), Google Gemini (AI stock chat)

## Features

- Email/password authentication (JWT, bcrypt-hashed passwords)
- Virtual wallet with buy/sell market orders backed by MongoDB transactions (no race conditions on concurrent trades)
- Live portfolio holdings with average buy price and unrealized P&L
- Trade history
- Real-time-ish stock search, quotes, candlestick charts, and company metrics
- AI stock chat assistant (Gemini) scoped to a selected stock
- Dashboard with live wallet balance, invested amount, P&L, and recent activity

## Security Highlights

- Passwords hashed with bcrypt; password hash never included in API responses
- JWT-protected routes for trading, portfolio, and AI chat (`authMiddleware`)
- Frontend route guarding (`ProtectedRoute`) redirects unauthenticated users to `/login`
- CORS restricted to a configured client origin (`CLIENT_URL`)
- Production error responses mask internal error messages/stack traces
- AI prompt input is length-capped and sanitized to reduce prompt-injection risk
- Trade quantity validated as a positive integer; stock symbols normalized (trim + uppercase) to prevent duplicate holdings from casing mismatches
- Secrets kept out of git via `.env` (see `.env.example` for required variables)

## Prerequisites

- Node.js 18+
- npm
- A MongoDB Atlas cluster (or any replica-set-enabled MongoDB — required for multi-document transactions used by the trade engine)
- API keys: [Finnhub](https://finnhub.io/), [Google Gemini](https://ai.google.dev/)

## Setup & Installation

### 1. Clone and configure environment variables

```bash
git clone https://github.com/PrajjwaL-2005/NiveshPath.git
cd NiveshPath
cp .env.example .env
```

Fill in `.env` with your own values (see [Environment Variables](#environment-variables) below).

### 2. Install & run the backend

```bash
npm install
npm start
```

The API server starts on `http://localhost:5001` (or `PORT` from `.env`).

### 3. Install & run the frontend

```bash
cd client
npm install
npm run dev
```

The client starts on `http://localhost:5173` (Vite default).

## Environment Variables

Defined in `.env` at the project root — see `.env.example` for the full template.

| Variable          | Description                                              |
|--------------------|------------------------------------------------------------|
| `PORT`             | Port the Express server listens on (default `5001`)         |
| `MONGO_URI`        | MongoDB connection string (replica set / Atlas required)    |
| `JWT_SECRET`       | Secret used to sign/verify JWTs                              |
| `FINNHUB_API_KEY`  | API key for Finnhub (quotes, search, profiles)              |
| `GEMINI_API_KEY`   | API key for Google Gemini (AI stock chat)                   |
| `CLIENT_URL`       | Allowed CORS origin for the frontend (e.g. `http://localhost:5173`) |

## API Route Summary

All routes are prefixed with `/api`. Routes marked 🔒 require a valid JWT (`Authorization: Bearer <token>`).

### Auth — `/api/auth`
| Method | Route      | Description        |
|--------|-----------|---------------------|
| POST   | `/signup` | Register a new user |
| POST   | `/login`  | Log in, receive JWT |

### Users — `/api/users`
| Method | Route  | Description                    |
|--------|--------|----------------------------------|
| GET 🔒 | `/me`  | Get the authenticated user's profile/balance |

### Trade — `/api/trade`
| Method | Route   | Description                              |
|--------|--------|--------------------------------------------|
| POST 🔒 | `/buy`  | Buy a stock (market order, transactional) |
| POST 🔒 | `/sell` | Sell a stock (market order, transactional) |

### Portfolio — `/api/portfolio`
| Method | Route      | Description                    |
|--------|-----------|----------------------------------|
| GET 🔒 | `/`        | Get current holdings             |
| GET 🔒 | `/trades`  | Get trade history                |

### Stocks — `/api/stocks`
| Method | Route                | Description                          |
|--------|---------------------|----------------------------------------|
| GET    | `/search?q=`         | Search stocks by name/symbol           |
| GET    | `/:symbol`           | Get a live quote for a symbol          |
| GET    | `/:symbol/details`   | Get profile, quote, and metrics        |
| GET    | `/:symbol/candles`   | Get historical candle data for charts  |

### News — `/api/news`
| Method | Route              | Description               |
|--------|-------------------|------------------------------|
| GET    | `/market`          | General market news         |
| GET    | `/company/:symbol` | News for a specific company |

### AI — `/api/ai`
| Method | Route         | Description                                  |
|--------|--------------|--------------------------------------------------|
| POST 🔒 | `/stock-chat` | Ask the AI assistant about a specific stock |

## License

ISC
