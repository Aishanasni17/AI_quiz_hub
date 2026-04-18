const firebaseConfig = {
  apiKey:            "AIzaSyBBxJsxHdK1eyYPl4NV6YpAcreyvRboCoI",
  authDomain:        "quizhub-app-c6d83.firebaseapp.com",
  databaseURL:       "https://quizhub-app-c6d83-default-rtdb.firebaseio.com",
  projectId:         "quizhub-app-c6d83",
  storageBucket:     "quizhub-app-c6d83.firebasestorage.app",
  messagingSenderId: "1061350983799",
  appId:             "1:1061350983799:web:dcef17036c333f79481e72"
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.database();
const auth = firebase.auth();

// ── Auth helpers ───────────────────────────────────────────────
function registerUser(email, password, displayName) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(cred => cred.user.updateProfile({ displayName }));
}

function loginUser(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

function logoutUser() {
  return auth.signOut();
}

// ── Save score ─────────────────────────────────────────────────
function saveScore(entry) {
  const user = auth.currentUser;
  if (user) entry.uid = user.uid;
  console.log("💾 Saving score:", entry);
  return db.ref("leaderboard").push(entry)
    .then(() => console.log("✅ Score saved!"))
    .catch(err => {
      console.error("❌ Save error:", err.code, err.message);
      return Promise.resolve();
    });
}

// ── Fetch all scores sorted by score desc ────────────────────
function fetchScores(topic) {
  return db.ref("leaderboard").once("value")
    .then(snap => {
      const rows = [];
      snap.forEach(c => rows.push(c.val()));
      console.log("📊 Total entries fetched:", rows.length, rows);
      rows.sort((a, b) => b.score - a.score);
      return topic === "all" ? rows : rows.filter(r => r.topic === topic);
    })
    .catch(err => {
      console.error("❌ Fetch error:", err.code, err.message);
      const rows = JSON.parse(localStorage.getItem("qhScores") || "[]");
      rows.sort((a, b) => b.score - a.score);
      return topic === "all" ? rows : rows.filter(r => r.topic === topic);
    });
}

// ── Real-time listener ─────────────────────────────────────────
function onScoresUpdate(topic, callback) {
  db.ref("leaderboard").on("value", snap => {
    const rows = [];
    snap.forEach(c => rows.push(c.val()));
    rows.sort((a, b) => b.score - a.score);
    callback(topic === "all" ? rows : rows.filter(r => r.topic === topic));
  }, err => {
    console.error("❌ Realtime listener error:", err.code, err.message);
  });
}
