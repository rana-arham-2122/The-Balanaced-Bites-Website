# 🍽️ The Balanced Bites

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-F00000?logo=jsonwebtokens&logoColor=white)

> A full-stack meal planning web application that helps users discover recipes, build weekly meal plans, and generate grocery lists automatically.

---

## 📌 Project Overview

The Balanced Bites is designed to help users make meal choices based on their goals, preferences, and dietary needs.

The project combines a **React frontend** with a **Node.js and Express backend API**, while **MongoDB** is used for storing users, recipes, and meal plans. Authentication is handled using **JWT tokens**.

### ✨ Main idea
Users can:
- create an account
- complete their profile and nutrition information
- browse recipes
- save weekly meal plans
- generate grocery lists automatically

---

## 🚀 Main Features

### 👤 Client-side features
- user registration and login
- profile onboarding and personal nutrition information
- recipe browsing and filtering
- recipe detail view
- weekly meal planner
- automatic grocery list generation
- profile view and update options

### ⚙️ Backend features
- REST-style API routes
- JWT authentication and refresh token support
- protected routes for logged-in users
- admin-only routes for management features
- recipe storage and retrieval from MongoDB
- meal plan saving and grocery list generation
- external recipe search using Spoonacular
- security middleware such as Helmet, CORS, and rate limiting

---

## 🛠️ Tech Stack

### 🎨 Frontend
- React
- Vite
- Axios

### 🧠 Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Helmet
- CORS
- express-rate-limit
- Morgan

---

## 🗂️ Project Structure

```text
The-Balanaced-Bites-Website-main/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── create-user.js
│   ├── create-multiple-users.js
│   ├── test-api.js
│   ├── test-connection.js
│   └── test-mongo.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
├── package.json
└── README.md
```

---

## 🔄 How the System Works

- The frontend is built in **React** and sends requests to the backend using **Axios**
- The backend exposes API routes through **Express**
- **MongoDB Atlas** stores users, recipes, and meal plans
- **JWT access tokens** protect restricted routes
- **Refresh tokens** are used to keep sessions active
- The backend connects to the **Spoonacular API** for external recipe search

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder.

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
SPOONACULAR_API_KEY=your_spoonacular_api_key
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📥 Installation and Setup

### 1️⃣ Clone the repository

```bash
git clone <your-repository-link>
cd The-Balanaced-Bites-Website-main
```

### 2️⃣ Install backend dependencies

```bash
cd backend
npm install
```

### 3️⃣ Install frontend dependencies

```bash
cd frontend
npm install
```

---

## ▶️ Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

Backend URL: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

### Start the frontend

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173`

---

## 📡 API Overview

Main route groups:

- **Authentication** — register, login, refresh, profile, logout
- **Recipes** — get all, get by ID, create, update, delete, Spoonacular search
- **Meal plans** — save, get by user, delete, update grocery item
- **Admin** — dashboard, users, delete user, update role

---

## 🛡️ Authentication and Security

The backend includes:

- password hashing using `bcryptjs`
- JWT access and refresh tokens
- protected routes with authentication middleware
- role-based access control for admin routes
- CORS restrictions for allowed client origins
- rate limiting for API traffic and auth endpoints
- Helmet for secure HTTP headers

---

## 🧩 Database Models

- **User** — stores account data, role, onboarding progress, and profile information
- **Recipe** — stores recipe details such as ingredients, nutrition values, tags, and preparation details
- **MealPlan** — stores a user’s weekly plan, selected recipes, and generated grocery items

---

## 🌍 External API Integration

The project integrates with the **Spoonacular API** to search for additional recipes.  
The backend maps the returned data into the project’s own recipe card format before sending it to the frontend.

---

## 🧪 Testing

The repository includes a few helper scripts for manual and connection-based testing:

- `test-api.js` for basic API checks
- `test-connection.js` for MongoDB connection testing
- `test-mongo.js` for environment and MongoDB diagnostics

Example:

```bash
cd backend
node test-api.js
```

At the moment, testing is mostly manual and script-based. It could be expanded later with a full testing framework such as Jest or Supertest.

---

## 🚚 Deployment Notes

Before deployment, make sure the following are configured:

- production MongoDB connection string
- strong JWT secrets
- frontend API base URL
- correct CORS allowed origin
- Spoonacular API key
- environment-specific production settings

---

## ⚠️ Known Limitations

- testing is mostly manual rather than fully automated
- the frontend mentions both Edamam and Spoonacular, but the backend currently uses Spoonacular
- some setup scripts should be reviewed so that sensitive values are removed and replaced with environment variables

---

## 🔮 Future Improvements

- add Swagger or OpenAPI documentation
- add automated backend testing
- expand the admin functionality
- improve deployment and production configuration
- add more advanced filtering and recommendation features

---

## 🙌 Acknowledgement

This project was developed as part of the **CS22002 Modern Web Stack Development** module at the **University of Dundee**.
