# 🧠 QuizHub — AI-Powered Quiz Platform

> Interactive quiz platform with topic-wise categories, countdown timers, speed bonuses, and a Firebase real-time leaderboard.

---

## 📁 Project Structure

```
quiz-hub/
├── index.html          ← Single-page app (all 5 screens)
├── css/
│   └── style.css       ← Dark theme, animations, responsive
├── js/
│   ├── questions.js    ← 50 questions across 5 topics
│   ├── firebase.js     ← Firebase init + read/write helpers
│   └── app.js          ← Quiz engine, timer, routing, leaderboard
└── README.md
```

---

## ✨ Features

- **5 Topics** — JavaScript, Python, Science, History, Math
- **15-second countdown** per question with animated arc timer
- **Speed bonus** — faster answers earn more points
- **Real-time leaderboard** via Firebase Realtime Database
- **Topic filter** on leaderboard
- **localStorage fallback** when Firebase is not configured
- **Fully responsive** — mobile & desktop

---

## 🏆 Scoring System

| Event | Points |
|---|---|
| Correct answer | 10 pts |
| Speed bonus | +0 to +15 pts (seconds remaining) |
| Max per question | 25 pts |
| Max total (10 Qs) | 250 pts |

---

## 🔥 Step 1 — Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → give it a name → Continue
3. Go to **Build → Realtime Database → Create database**
   - Choose a region → Start in **test mode** → Enable
4. Go to **Project Settings (⚙️) → Your apps → Web (</>)**
   - Register app → copy the `firebaseConfig` object
5. Open `js/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

> ⚠️ Without this, scores save to `localStorage` (device-only, no live leaderboard).

---

## 🚀 Step 2 — Deploy to GitHub Pages

```bash
# 1. Initialize git and push to GitHub
git init
git add .
git commit -m "🚀 Initial commit — QuizHub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quiz-hub.git
git push -u origin main

# 2. Enable GitHub Pages
# → GitHub repo → Settings → Pages
# → Source: Deploy from a branch
# → Branch: main  /  Folder: / (root)
# → Save
```

Your live URL will be:
```
https://YOUR_USERNAME.github.io/quiz-hub/
```

---

## 🖥️ Run Locally

Just open `index.html` in any browser — no build step needed.

```bash
# Or use VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

---

## 📸 Screens

| Screen | Description |
|---|---|
| Splash | Name entry + feature overview |
| Topics | 5 topic cards to choose from |
| Quiz | Question + options + timer + progress |
| Result | Score, grade, accuracy percentage |
| Leaderboard | Top 20 scores, filterable by topic, live updates |
