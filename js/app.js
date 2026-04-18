// -- Tiny helpers
const $    = id => document.getElementById(id);
const show = id => $(id).classList.remove("hidden");
const hide = id => $(id).classList.add("hidden");
const safe = s  => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

// -- App state
const state = {
  player : "",
  topic  : "",
  qs     : [],
  idx    : 0,
  score  : 0,
  timer  : null,
  secs   : 15,
  locked : false
};

const TOTAL_QS   = 10;
const TIME_LIMIT = 15;
const BASE_PTS   = 10;

// -- Screen router
function goTo(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  show("screen-" + screen);
}

// -- Auth tabs
$("tab-login").addEventListener("click", () => {
  $("tab-login").classList.add("active");
  $("tab-register").classList.remove("active");
  show("form-login"); hide("form-register");
});

$("tab-register").addEventListener("click", () => {
  $("tab-register").classList.add("active");
  $("tab-login").classList.remove("active");
  hide("form-login"); show("form-register");
});

// -- Login
$("btn-login").addEventListener("click", () => {
  const email = $("login-email").value.trim();
  const pass  = $("login-password").value;
  const err   = $("login-error");
  err.classList.add("hidden");
  if (!email || !pass) { showAuthError(err, "Please fill in all fields."); return; }
  $("btn-login").textContent = "Logging in...";
  loginUser(email, pass)
    .catch(e => { showAuthError(err, friendlyError(e)); $("btn-login").textContent = "Login"; });
});

$("login-password").addEventListener("keydown", e => e.key === "Enter" && $("btn-login").click());

// -- Register
$("btn-register").addEventListener("click", () => {
  const name  = $("reg-name").value.trim();
  const email = $("reg-email").value.trim();
  const pass  = $("reg-password").value;
  const err   = $("reg-error");
  err.classList.add("hidden");
  if (!name || !email || !pass) { showAuthError(err, "Please fill in all fields."); return; }
  if (pass.length < 6) { showAuthError(err, "Password must be at least 6 characters."); return; }
  $("btn-register").textContent = "Creating...";
  registerUser(email, pass, name)
    .catch(e => { showAuthError(err, friendlyError(e)); $("btn-register").textContent = "Create Account"; });
});

function showAuthError(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
}

function friendlyError(e) {
  if (e.code === "auth/email-already-in-use") return "Email already registered.";
  if (e.code === "auth/invalid-email")        return "Invalid email address.";
  if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") return "Incorrect email or password.";
  if (e.code === "auth/user-not-found")       return "No account found with this email.";
  return e.message;
}

// -- Auth state observer
auth.onAuthStateChanged(user => {
  if (user) {
    state.player = user.displayName || user.email.split("@")[0];
    $("welcome-name").textContent = state.player;
    $("nav-user").textContent = "👤 " + state.player;
    $("nav-user").classList.remove("hidden");
    $("btn-logout").classList.remove("hidden");
    $("btn-login").textContent = "Login";
    $("btn-register").textContent = "Create Account";
    goTo("splash");
  } else {
    state.player = "";
    $("nav-user").classList.add("hidden");
    $("btn-logout").classList.add("hidden");
    goTo("auth");
  }
});

$("btn-logout").addEventListener("click", () => logoutUser());

// -- Splash
$("btn-enter").addEventListener("click", () => goTo("topics"));

// -- Topic selection
document.querySelectorAll(".topic-card").forEach(card => {
  card.addEventListener("click", () => {
    state.topic = card.dataset.topic;
    beginQuiz();
  });
});

// -- Quiz engine
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function beginQuiz() {
  state.qs     = shuffle(QUESTIONS[state.topic]).slice(0, TOTAL_QS);
  state.idx    = 0;
  state.score  = 0;
  state.locked = false;
  goTo("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = state.qs[state.idx];
  state.locked = false;

  $("q-topic").textContent   = state.topic.charAt(0).toUpperCase() + state.topic.slice(1);
  $("q-counter").textContent = (state.idx + 1) + " / " + TOTAL_QS;
  $("q-score").textContent   = "⭐ " + state.score;
  $("prog-fill").style.width = ((state.idx / TOTAL_QS) * 100) + "%";
  $("q-text").textContent    = q.q;

  const grid = $("options-grid");
  grid.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "opt-btn";
    btn.innerHTML = '<span class="opt-letter">' + "ABCD"[i] + '</span><span>' + safe(opt) + '</span>';
    btn.addEventListener("click", () => pick(i, btn));
    grid.appendChild(btn);
  });

  hide("feedback-bar");
  startCountdown();
}

// -- Timer
function startCountdown() {
  clearInterval(state.timer);
  state.secs = TIME_LIMIT;
  paintTimer();
  state.timer = setInterval(() => {
    state.secs--;
    paintTimer();
    if (state.secs <= 0) { clearInterval(state.timer); timeUp(); }
  }, 1000);
}

function paintTimer() {
  $("timer-num").textContent = state.secs;
  const pct   = (state.secs / TIME_LIMIT) * 100;
  const color = state.secs <= 5 ? "#ef4444" : state.secs <= 9 ? "#f59e0b" : "#6366f1";
  $("timer-arc").style.background = "conic-gradient(" + color + " " + (pct * 3.6) + "deg, #1e1b4b " + (pct * 3.6) + "deg)";
  $("timer-num").style.color = color;
}

// -- Answer handling
function pick(idx, btn) {
  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timer);

  const correct = state.qs[state.idx].ans;
  document.querySelectorAll(".opt-btn").forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add("correct");
    else if (i === idx) b.classList.add("wrong");
  });

  if (idx === correct) {
    const earned = BASE_PTS + state.secs;
    state.score += earned;
    $("q-score").textContent = "⭐ " + state.score;
    showFeedback("Correct! +" + earned + " pts (" + state.secs + "s speed bonus)", true);
  } else {
    showFeedback("Wrong! Correct: " + state.qs[state.idx].options[correct], false);
  }

  setTimeout(advance, 1600);
}

function timeUp() {
  if (state.locked) return;
  state.locked = true;
  const correct = state.qs[state.idx].ans;
  document.querySelectorAll(".opt-btn").forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add("correct");
  });
  showFeedback("Time's up! Correct: " + state.qs[state.idx].options[correct], false);
  setTimeout(advance, 1600);
}

function showFeedback(msg, good) {
  const bar = $("feedback-bar");
  bar.textContent = msg;
  bar.className = "feedback-bar " + (good ? "fb-good" : "fb-bad");
  show("feedback-bar");
}

function advance() {
  state.idx++;
  if (state.idx < TOTAL_QS) renderQuestion();
  else finishQuiz();
}

// -- Results
function finishQuiz() {
  clearInterval(state.timer);
  goTo("result");

  const maxScore = TOTAL_QS * (BASE_PTS + TIME_LIMIT);
  const pct      = Math.round((state.score / maxScore) * 100);
  const grade    = pct >= 80 ? { icon: "🏆", msg: "Outstanding!" }
                 : pct >= 60 ? { icon: "🥈", msg: "Great job!" }
                 : pct >= 40 ? { icon: "👍", msg: "Good effort!" }
                 :              { icon: "📚", msg: "Keep practicing!" };

  $("res-icon").textContent  = grade.icon;
  $("res-msg").textContent   = grade.msg;
  $("res-name").textContent  = state.player;
  $("res-topic").textContent = state.topic.charAt(0).toUpperCase() + state.topic.slice(1);
  $("res-score").textContent = state.score;
  $("res-pct").textContent   = pct + "% accuracy";

  var rankEl = document.getElementById("res-rank");
  if (rankEl) rankEl.textContent = "Saving score...";

  const user  = auth.currentUser;
  const entry = {
    name  : state.player,
    topic : state.topic,
    score : Number(state.score),
    ts    : Date.now(),
    uid   : user ? user.uid : ""
  };

  db.ref("leaderboard").push(entry).then(() => {
    db.ref("leaderboard").once("value").then(snap => {
      const all = [];
      snap.forEach(c => {
        const v = c.val();
        v.score = Number(v.score);
        all.push(v);
      });
      all.sort((a, b) => b.score - a.score);
      const rank = all.findIndex(r =>
        user ? (r.uid === user.uid && r.score === Number(state.score))
             : (r.name === state.player && r.score === Number(state.score))
      ) + 1;
      if (rankEl) {
        rankEl.textContent = rank > 0
          ? "Your Rank: #" + rank + " out of " + all.length + " players"
          : "Score saved!";
      }
    });
  }).catch(() => {
    if (rankEl) rankEl.textContent = "Score saved locally.";
  });
}

$("btn-play-again").addEventListener("click", () => goTo("topics"));
$("btn-view-lb").addEventListener("click", openLeaderboard);
$("btn-home-res").addEventListener("click", () => goTo("splash"));

// -- Leaderboard
$("btn-lb-nav").addEventListener("click", openLeaderboard);
$("btn-home-lb").addEventListener("click", () => goTo("splash"));
$("lb-topic-filter").addEventListener("change", loadLeaderboard);

let lbListener = null;

function openLeaderboard() {
  goTo("leaderboard");
  if (lbListener) {
    db.ref("leaderboard").off("value", lbListener);
    lbListener = null;
  }
  attachLbListener();
}

function attachLbListener() {
  const topic = $("lb-topic-filter").value;
  $("lb-tbody").innerHTML = '<tr><td colspan="4" class="lb-loading">Loading...</td></tr>';
  lbListener = db.ref("leaderboard").on("value", snap => {
    const rows = [];
    snap.forEach(c => {
      const v = c.val();
      v.score = Number(v.score);
      rows.push(v);
    });
    rows.sort((a, b) => b.score - a.score);
    const filtered = topic === "all" ? rows : rows.filter(r => r.topic === topic);
    renderLB(filtered);
  }, err => {
    console.error("Leaderboard error:", err.message);
    $("lb-tbody").innerHTML = '<tr><td colspan="4" class="lb-empty">Permission denied — check Firebase rules.</td></tr>';
  });
}

function loadLeaderboard() {
  if (lbListener) db.ref("leaderboard").off("value", lbListener);
  attachLbListener();
}

function renderLB(rows) {
  const tbody = $("lb-tbody");
  const currentUid = auth.currentUser ? auth.currentUser.uid : null;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="lb-empty">No scores yet — be the first!</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map((r, i) => {
    const medal    = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "#" + (i + 1);
    const isMe     = currentUid && r.uid === currentUid;
    const rankCls  = i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "";
    const youBadge = isMe ? ' <span class="you-badge">YOU</span>' : "";
    return '<tr class="' + rankCls + (isMe ? " my-row" : "") + '">'
      + "<td>" + medal + "</td>"
      + "<td>" + safe(r.name) + youBadge + "</td>"
      + '<td><span class="topic-pill">' + r.topic + "</span></td>"
      + "<td><strong>" + r.score + "</strong></td>"
      + "</tr>";
  }).join("");

  const myRow = tbody.querySelector(".my-row");
  if (myRow) setTimeout(() => myRow.scrollIntoView({ block: "nearest", behavior: "smooth" }), 100);
}
