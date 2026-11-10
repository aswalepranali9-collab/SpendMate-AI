# 💎 SpendMate AI — Production-Ready AI Personal Finance Tracker

<div align="center">

![SpendMate AI Banner](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80)

[![License: MIT](https://img.shields.io/badge/License-MIT-6366F1.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-10B981.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-3B82F6.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-06B6D4.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-47A248.svg)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5-8B5CF6.svg)](https://vitejs.dev/)

**An intelligent, portfolio-worthy fintech web application built with the MERN stack that enables users to track income and expenses, monitor monthly budgets, achieve savings goals, and receive automated, actionable AI financial guidance.**

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start-instructions) • [Screenshots](#-screenshots--ui-preview) • [Architecture](#-project-architecture--folder-structure) • [Deployment](#-production-deployment-guide) • [Future Roadmap](#-future-improvements)

</div>

---

## 🌟 Key Features

### 1. 🔐 Authentication & Authorization
- **JWT-Based Authentication** with secure token persistence and automatic session renewal / expiration redirects.
- **Password Hashing** via `bcryptjs` with salted key stretching.
- **Protected React Routes** with high-order layout route wrappers (`<ProtectedRoute>`).
- **1-Click Instant Guest Demo Login** (*Alex Morgan*): Preloaded with 18+ transactions, active budgets, savings targets, and health scores for zero-effort evaluation.

### 2. 📊 Personal Finance Dashboard
- **Glassmorphic KPI Cards**:
  - **Total Income Card**: Emerald green styling with MoM growth trajectory.
  - **Total Expense Card**: Rose red styling with burn rate indicators.
  - **Net Liquid Balance Card**: Instant visibility into surplus funds.
  - **Monthly Savings Card**: Benchmark evaluation against standard savings rates.
- **Financial Health Score (0 - 100)**: Proprietary multi-factor algorithm auditing resilience across 4 core pillars:
  1. *Savings Rate Pillar* (35% weight)
  2. *Budget Discipline Pillar* (25% weight)
  3. *Discretionary Spending Control* (20% weight)
  4. *Savings Goals Momentum* (20% weight)
- **Recent Transactions Feed**: Clean interactive table displaying category pills, dates, and payment methods.

### 3. 💸 Transaction Management & Smart Auto-Categorization
- Full CRUD operations for Income & Expense records with formatted currency values.
- **Real-Time NLP Keyword Categorization**: Autonomously detects categories as the user types descriptions (e.g. *Swiggy*, *Uber*, *Amazon*, *Salary*, *Rent*, *Netflix*).
- **Categories Supported**:
  - *Income*: `Salary`, `Freelancing`, `Business`, `Investments`, `Other`
  - *Expense*: `Food`, `Shopping`, `Travel`, `Bills`, `Healthcare`, `Education`, `Entertainment`, `EMI`, `Other`
- **Payment Method Tagging**: `UPI`, `Credit Card`, `Debit Card`, `Net Banking`, `Bank Transfer`, `Cash`, `Other`.

### 4. 📈 Smart Analytics & Interactive Visualizations
- **6-Month Cash Flow Bar Chart**: Comparative monthly inflow vs outflow with custom tooltips.
- **Expense Distribution Donut Chart**: Category-by-category proportional spending breakdown.
- **30-Day Daily Spending Curve**: Area chart highlighting daily velocity and burn peaks.
- **Category Outflow Rankings**: Ranked list with interactive progress bars and percentage share meters.

### 5. 🎯 Budget Planner & Automated Alerts
- Create monthly overall budget caps or granular category-specific limits.
- Real-time calculation of **Spent Amount**, **Remaining Safe Spend**, and **Utilization %**.
- **Automated Alerts**: Warning notifications trigger when spending reaches 80%, and critical alerts fire at >100% budget breach.

### 6. 🏆 Savings Goals & Confetti Milestones
- Set long-term targets (Emergency Fund, Tokyo Vacation, Workstation, Real Estate).
- Interactive **Deposit / Contribute** modal to add funds toward goals.
- **Confetti Celebrations**: Smooth celebratory particle physics triggered via `canvas-confetti` upon hitting 100% completion.

### 7. 🤖 AI Finance Advisor & Interactive Copilot
- **Automated Algorithmic Audit**: Detects anomalies, lifestyle creep, and 50/30/20 budget adherence.
- **30-Day Predictive Expense Forecast**: Machine-learning moving average predicting upcoming month's expenses.
- **Interactive AI Chat**: Ask questions like:
  - *"How can I cut expenses by 15%?"*
  - *"Can I afford a ₹50,000 purchase right now?"*
  - *"Am I saving enough for an emergency buffer?"*
- **Dual Engine Architecture**: Supports Google Gemini 1.5 Flash API with graceful fallback to built-in algorithmic intelligence when offline or without an API key.

### 8. 📄 Financial Reports & CSV Export
- Downloadable formatted CSV files for financial record-keeping.
- Printable Monthly Financial Statements with clean print-optimized layout.

### 9. 🔔 Notification Center
- Dropdown badge counter with unread notifications.
- Instant alerts for budget breaches, goal milestones, and AI weekly savings tips.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, React Router v6, Axios, Recharts, Framer Motion, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express.js, MongoDB / Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `express-validator`, Morgan, Concurrently |
| **Database** | MongoDB Atlas / Local MongoDB (with automatic in-memory fallback for zero-setup local dev) |
| **AI Layer** | Built-in Heuristic Financial Intelligence Engine + Optional Google Gemini 1.5 Flash API |

---

## 📸 Screenshots & UI Preview

<div align="center">

### Modern Glassmorphism Dashboard
```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💎 SpendMate AI                     [+ Add Transaction]  [🔔 (3)]  [🌙]  [👤] │
├─────────────────────────────────────────────────────────────────────────────┤
│ Welcome back, Alex Morgan!                                    Nov 8, 2026   │
│                                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│ │ TOTAL INCOME │ │ TOTAL SPENT  │ │ NET BALANCE  │ │ MONTHLY SAVINGS      │ │
│ │  ₹1,49,700   │ │   ₹68,546    │ │   ₹81,154    │ │   ₹81,154 (54% Rate) │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘ │
│                                                                             │
│ ┌───────────────────────────────┐ ┌───────────────────────────────────────┐ │
│ │ Monthly Income vs Expenses    │ │ Financial Health Score: 100/100       │ │
│ │   [=== Bar Chart Recharts ===]│ │   Status: Optimal Financial Condition │ │
│ │                               │ │   • Savings Rate:        35/35 pts    │ │
│ │ Daily Spending Curve          │ │   • Budget Discipline:   25/25 pts    │ │
│ │   [~~~ Area Curve Chart ~~~]  │ │   • Discretionary Spend: 20/20 pts    │ │
│ └───────────────────────────────┘ └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

</div>

### Key UI Capabilities
- **Glassmorphism**: Backdrop blur with translucent cards and gradient glow effects.
- **Data Signaling**: Vibrant emerald green for inflows, rose red for outflows.
- **Theme Switcher**: Smooth transition between Dark mode (`#0A0E17`) and Light mode.
- **Mobile First**: Collapsible navigation drawer and responsive grids for phones, tablets, and desktops.

---

## 📁 Project Architecture & Folder Structure

```text
spendmate-ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Resilient MongoDB Atlas / In-Memory connector
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, JWT, profile & demo seeder
│   │   │   ├── transactionController.js # Transaction CRUD, search, filter & category auto-suggest
│   │   │   ├── budgetController.js   # Budget tracking, threshold calculations & alerts
│   │   │   ├── goalController.js     # Savings goals, deadlines & deposit milestones
│   │   │   ├── analyticsController.js# Dashboard KPIs, chart aggregations & statements
│   │   │   ├── aiController.js       # AI insights engine & contextual copilot Q&A
│   │   │   └── notificationController.js # Notification center endpoints
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # Bearer JWT verification
│   │   │   ├── errorMiddleware.js    # Centralized error & 404 handler
│   │   │   └── validationMiddleware.js # Express-validator processor
│   │   ├── models/
│   │   │   ├── User.js               # User model with bcrypt password hashing
│   │   │   ├── Transaction.js        # Income & Expense records with compound index
│   │   │   ├── Budget.js             # Monthly budget caps & spent trackers
│   │   │   ├── SavingsGoal.js        # Milestone targets, deadlines & colors
│   │   │   ├── FinancialInsight.js   # AI recommendation history
│   │   │   └── Notification.js       # Alert notifications
│   │   ├── routes/                   # Express REST route modules
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── budgetRoutes.js
│   │   │   ├── goalRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── utils/
│   │   │   ├── aiEngine.js           # Smart categorization, 30-day forecast & Gemini hooks
│   │   │   ├── healthScore.js        # 4-Pillar Financial Health Score algorithm
│   │   │   └── seedData.js           # Multi-month demo dataset seeder
│   │   └── server.js                 # Express application entrypoint
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Glassmorphic navbar with search, notifications & theme toggle
│   │   │   │   ├── Sidebar.jsx       # Responsive navigation drawer
│   │   │   │   ├── GlassCard.jsx     # Reusable glassmorphic panel
│   │   │   │   ├── StatCard.jsx      # Gradient KPI metric cards
│   │   │   │   ├── Modal.jsx         # Accessible animated dialog
│   │   │   │   └── NotificationDropdown.jsx # Real-time notification center
│   │   │   ├── dashboard/
│   │   │   │   ├── FinancialHealthScore.jsx # Radial score gauge & 4 stability pillars
│   │   │   │   ├── RecentTransactions.jsx   # Latest cash flow entries
│   │   │   │   ├── SummaryCards.jsx         # Income, Expense, Balance, Savings cards
│   │   │   │   └── QuickAddModal.jsx        # Modal with real-time AI category suggestion
│   │   │   ├── charts/
│   │   │   │   ├── IncomeExpenseChart.jsx   # 6-Month comparative bar chart
│   │   │   │   ├── CategoryPieChart.jsx     # Proportional donut distribution
│   │   │   │   └── SpendingTrendChart.jsx   # 30-Day spending velocity area chart
│   │   │   └── ai/
│   │   │       └── AdvisorCard.jsx          # AI recommendation card with impact tags
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # JWT persistence & state management
│   │   │   └── ThemeContext.jsx      # Dark / Light mode toggle
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Portfolio landing page with interactive preview
│   │   │   ├── Login.jsx             # Login with 1-Click Guest Demo
│   │   │   ├── Register.jsx          # Signup with currency selector
│   │   │   ├── Dashboard.jsx         # Personal finance command center
│   │   │   ├── Transactions.jsx      # Ledger with search, filters & CSV export
│   │   │   ├── Analytics.jsx         # In-depth visual charts & rankings
│   │   │   ├── Budgets.jsx           # Budget planner & utilization meters
│   │   │   ├── SavingsGoals.jsx      # Savings targets with confetti celebrations
│   │   │   ├── AIAdvisor.jsx         # 30-Day forecast & interactive AI chat copilot
│   │   │   ├── Reports.jsx           # Monthly statement generator & print view
│   │   │   └── Profile.jsx           # Currency switch, avatar & budget cap
│   │   ├── services/
│   │   │   ├── api.js                # Axios client with JWT interceptors
│   │   │   ├── authService.js
│   │   │   ├── transactionService.js
│   │   │   ├── budgetService.js
│   │   │   ├── goalService.js
│   │   │   ├── analyticsService.js
│   │   │   ├── aiService.js
│   │   │   └── notificationService.js
│   │   ├── utils/
│   │   │   ├── formatters.js         # Currency and date formatters
│   │   │   └── exportUtils.js        # CSV file generator & downloader
│   │   ├── App.jsx                   # React Router with ProtectedRoute guards
│   │   └── index.css                 # Tailwind directives & glassmorphic styles
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .env.example                      # Root environment template
├── .gitignore                        # Complete git exclusion rules
├── package.json                      # Root orchestration scripts (concurrently)
└── README.md
```

---

## ⚡ Quick Start Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)*: Local MongoDB instance or free MongoDB Atlas account

### 1. Install All Dependencies (Single Command)
Run this command from the project root:

```bash
npm install
```
> The root `postinstall` script automatically installs dependencies for both backend and frontend.

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Default configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/spendmate_ai
JWT_SECRET=spendmate_ai_jwt_secret_key_production_grade_super_secure_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Optional: Google Gemini API Key for live LLM responses
GEMINI_API_KEY=
```

> **Zero-Setup Local Dev:** If local MongoDB is not running, SpendMate AI automatically initializes an in-memory MongoDB server instance so you can test immediately with zero configuration!

### 3. Run the Full Stack App
Start both Backend and Frontend concurrently with one command from the project root:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

### 4. 1-Click Demo Evaluation
On the Login screen, click **"One-Click Guest Demo (Alex Morgan)"** to instantly access the preloaded demo account without typing credentials.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | Public |
| `POST` | `/api/auth/demo` | 1-Click instant guest login | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer |
| `PUT` | `/api/auth/profile` | Update profile, currency & budget cap | Bearer |
| `GET` | `/api/transactions` | Query transactions (search, filter, sort) | Bearer |
| `POST` | `/api/transactions` | Create income or expense record | Bearer |
| `POST` | `/api/transactions/suggest-category` | Suggest category via AI keyword detection | Bearer |
| `PUT` | `/api/transactions/:id` | Update transaction record | Bearer |
| `DELETE`| `/api/transactions/:id` | Delete transaction record | Bearer |
| `GET` | `/api/budgets` | Fetch monthly budgets & utilization metrics | Bearer |
| `POST` | `/api/budgets` | Set or update monthly budget | Bearer |
| `DELETE`| `/api/budgets/:id` | Delete budget rule | Bearer |
| `GET` | `/api/goals` | List savings goals & completion % | Bearer |
| `POST` | `/api/goals` | Create savings goal | Bearer |
| `POST` | `/api/goals/:id/deposit` | Add deposit contribution to goal | Bearer |
| `DELETE`| `/api/goals/:id` | Remove savings goal | Bearer |
| `GET` | `/api/analytics/dashboard` | Dashboard KPIs & health score metrics | Bearer |
| `GET` | `/api/analytics/charts` | Datasets for 6-month bars, pie & daily trend | Bearer |
| `GET` | `/api/analytics/report` | Monthly financial audit statement | Bearer |
| `GET` | `/api/ai/insights` | Run AI audit & generate optimization tips | Bearer |
| `GET` | `/api/ai/forecast` | Predict upcoming 30-day expenses | Bearer |
| `POST` | `/api/ai/ask` | Contextual AI chat query on live ledger | Bearer |
| `GET` | `/api/notifications` | Fetch alert notifications & unread count | Bearer |
| `PUT` | `/api/notifications/read-all`| Mark all notifications as read | Bearer |

---

## 🚀 Production Deployment Guide

### 1. Database: MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, whitelist `0.0.0.0/0` (or your server's IP).
3. Under **Database Access**, create a user with read/write permissions.
4. Copy the connection string to `MONGODB_URI`:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/spendmate_ai?retryWrites=true&w=majority
   ```

### 2. Backend: Render / Railway / AWS
1. Push this repository to GitHub.
2. In [Render](https://render.com), create a new **Web Service** pointing to `backend/`.
3. Set Build Command: `npm install` and Start Command: `node src/server.js`.
4. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your Atlas URI*
   - `JWT_SECRET`: *Your secure random 64-char key*
   - `CLIENT_URL`: *Your deployed frontend URL*

### 3. Frontend: Vercel / Netlify
1. In [Vercel](https://vercel.com), create a new project linked to this repo.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Set Environment Variable:
   - `VITE_API_URL`: `https://your-spendmate-backend.onrender.com`
5. Deploy!

---

## 🔮 Future Improvements

- [ ] **Open Banking Account Aggregation**: Direct sync with bank accounts via Plaid / Setu API.
- [ ] **Receipt OCR Scanning**: Capture physical receipts via camera and auto-extract items with Gemini Vision.
- [ ] **Multi-Currency Live FX**: Real-time foreign exchange currency conversion rates.
- [ ] **Mobile App**: Cross-platform mobile version built with React Native and Expo.
- [ ] **Recurring Bill Auto-Detection**: Predictive recurring subscription alerts.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
