# ⚡ Quizzy — AI-Powered Quiz Platform

A full-stack quiz application where AI generates fresh questions every time. Built with React, Node.js, MongoDB, and Groq AI.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react) ![Node](https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb) ![Groq](https://img.shields.io/badge/Groq-AI-F55036?style=flat)

---

## Features

- 🤖 **AI-Generated Questions** — Groq AI (llama-3.1-8b-instant) generates 10 unique questions every quiz
- 📚 **10+ Topics** — Python, Java, C++, DSA, Algorithms, Web Dev, Databases, Networks, OS, Programming
- 🎯 **3 Difficulty Levels** — Beginner, Intermediate, Advanced
- ⏱️ **Timed Quiz** — 30 seconds per question
- 🏆 **Leaderboard** — Top scores across all users
- 📋 **Quiz History & Review** — Revisit past quizzes, see correct/wrong answers
- 💡 **AI Explanations** — Wrong answers get AI-generated explanations
- 🔐 **JWT Authentication** — Secure login/signup

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| AI | Groq SDK (llama-3.1-8b-instant) |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
quizweb-main/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/    # Login, Signup, ProtectedRoute, ErrorBoundary
│   │   ├── context/       # AuthContext
│   │   ├── pages/         # Home, Landing, QuizPage, QuizzesPage, LeaderboardPage, HistoryPage
│   │   └── utils/         # api.js (all API calls)
│   └── public/
│       └── _redirects     # Render/Netlify SPA routing fix
│
└── backend/           # Node.js + Express API
    ├── controllers/       # auth, ai, submission, leaderboard
    ├── models/            # User, Submission, Question
    ├── routes/            # auth, ai, submission, leaderboard
    └── utils/             # auth middleware (JWT verify)
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo

```bash
git clone https://github.com/AryanGupta09/quizzyb.git
cd quizzyb/quizweb-main
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/quizweb
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
CLIENT_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### AI
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/generate-questions` | ✅ | Generate 10 AI questions |
| POST | `/api/ai/get-explanation` | ✅ | Get explanation for wrong answer |

### Submissions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/submissions/save-ai-score` | ✅ | Save quiz score + review data |
| GET | `/api/submissions/me` | ✅ | Get user's quiz history |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Get top 10 scores |

---

## Deployment

### Backend — Render

1. New Web Service → connect GitHub repo
2. Root Directory: `quizweb-main/backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables:

```
MONGO_URI      = your_mongodb_atlas_uri
JWT_SECRET     = your_jwt_secret
GROQ_API_KEY   = your_groq_api_key
CLIENT_URL     = https://your-frontend-domain.com
NODE_ENV       = production
```

### Frontend — Vercel

1. Import GitHub repo
2. Root Directory: `quizweb-main/frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:

```
VITE_API_URL = https://your-backend.onrender.com/api
```

---

## Environment Variables Reference

### Backend `.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens |
| `GROQ_API_KEY` | ✅ | Groq AI API key |
| `CLIENT_URL` | ✅ | Frontend URL for CORS |
| `PORT` | ❌ | Server port (default: 5000) |

### Frontend `.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL |

---

## License

MIT
