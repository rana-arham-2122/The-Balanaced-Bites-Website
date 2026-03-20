# 🌿 The Balanced Bites

A smart personalised meal planning web app.

---

## ✅ Requirements (install these first)
- **Node.js** → https://nodejs.org (download LTS version)

---

## 🚀 How to Run (3 steps only)

### Step 1 — Install Backend
Open a terminal in this folder and run:
```
cd backend
npm install
```

### Step 2 — Install Frontend
Open a SECOND terminal and run:
```
cd frontend
npm install
```

### Step 3 — Start Both Servers

**Terminal 1 (backend):**
```
cd backend
npm run dev
```

**Terminal 2 (frontend):**
```
cd frontend
npm run dev
```

Then open your browser at: **http://localhost:5173** 🎉

---

## ⚠️ MongoDB Setup (Required for login/register to work)
1. Go to https://mongodb.com/atlas and create a FREE account
2. Create a free cluster
3. Get your connection string
4. Open `backend/.env` and replace the MONGO_URI value with your connection string

> Without MongoDB, the frontend UI will still fully work — you just won't be able to register/login.

---

## 📁 Project Structure
```
balanced-bites/
├── backend/          ← Node.js + Express API (port 5000)
│   ├── src/
│   │   ├── config/   ← Database connection
│   │   ├── controllers/ ← Business logic
│   │   ├── middleware/  ← JWT auth
│   │   ├── models/   ← MongoDB schemas
│   │   ├── routes/   ← API routes
│   │   └── server.js ← Entry point
│   └── .env          ← Environment variables (edit this!)
│
└── frontend/         ← React + Vite app (port 5173)
    ├── src/
    │   ├── api/      ← Axios + API calls
    │   ├── context/  ← Auth state
    │   ├── hooks/    ← Custom React hooks
    │   ├── App.jsx   ← All pages
    │   └── main.jsx  ← Entry point
    └── .env          ← Frontend env vars
```
