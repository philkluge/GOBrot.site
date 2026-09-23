const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Theme switch ---------- */
(function theme() {
  const btn = document.getElementById("themeToggle");
  const root = document.documentElement;

  function render() {
    const on = root.dataset.theme === "zombies";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "Classic mode" : "Zombies mode";
  }

  btn.addEventListener("click", () => {
    const on = root.dataset.theme !== "zombies";
    if (on) root.dataset.theme = "zombies";
    else delete root.dataset.theme;
    try { localStorage.setItem("tedd-theme", on ? "zombies" : "classic"); } catch {}
    render();
  });

  render();
})();

/* ---------- Destination sign ---------- */
/* A fixed 80×18 LED dot matrix with a 5×7 font. Only the lit dots change;
   the panel itself never resizes. */
(function sign() {
  const canvas = document.getElementById("signMatrix");
  const ctx = canvas.getContext("2d");
  const stops = ["BUS DEPOT", "DINER", "FARM", "POWER STATION", "TOWN"];

  const COLS = 80;
  const ROWS = 18;
  const TOP = { y: 1, h: 7 };   // "NEXT STOP"
  const BOTTOM = { y: 10, h: 7 }; // destination
  const ROLL_GAP = 2;           // blank rows between old and new text while rolling
  const STEP_MS = 55;

  const FONT = {
    A: "01110 10001 10001 11111 10001 10001 10001",
    B: "11110 10001 10001 11110 10001 10001 11110",
    C: "01110 10001 10000 10000 10000 10001 01110",
    D: "11100 10010 10001 10001 10001 10010 11100",
    E: "11111 10000 10000 11110 10000 10000 11111",
    F: "11111 10000 10000 11110 10000 10000 10000",
    G: "01110 10001 10000 10111 10001 10001 01111",
    H: "10001 10001 10001 11111 10001 10001 10001",
    I: "01110 00100 00100 00100 00100 00100 01110",
    J: "00111 00010 00010 00010 00010 10010 01100",
    K: "10001 10010 10100 11000 10100 10010 10001",
    L: "10000 10000 10000 10000 10000 10000 11111",
    M: "10001 11011 10101 10101 10001 10001 10001",
    N: "10001 10001 11001 10101 10011 10001 10001",
    O: "01110 10001 10001 10001 10001 10001 01110",
    P: "11110 10001 10001 11110 10000 10000 10000",
    Q: "01110 10001 10001 10001 10101 10010 01101",
    R: "11110 10001 10001 11110 10100 10010 10001",
    S: "01111 10000 10000 01110 00001 00001 11110",
    T: "11111 00100 00100 00100 00100 00100 00100",
    U: "10001 10001 10001 10001 10001 10001 01110",
    V: "10001 10001 10001 10001 10001 01010 00100",
    W: "10001 10001 10001 10101 10101 10101 01010",
    X: "10001 10001 01010 00100 01010 10001 10001",
    Y: "10001 10001 01010 00100 00100 00100 00100",
    Z: "11111 00001 00010 00100 01000 10000 11111",
    0: "01110 10001 10011 10101 11001 10001 01110",
    1: "00100 01100 00100 00100 00100 00100 01110",
    2: "01110 10001 00001 00010 00100 01000 11111",
    3: "11111 00010 00100 00010 00001 10001 01110",
    4: "00010 00110 01010 10010 11111 00010 00010",
    5: "11111 10000 11110 00001 00001 10001 01110",
    6: "00110 01000 10000 11110 10001 10001 01110",
    7: "11111 00001 00010 00100 01000 01000 01000",
    8: "01110 10001 10001 01110 10001 10001 01110",
    9: "01110 10001 10001 01111 00001 00010 01100",
    " ": "00000 00000 00000 00000 00000 00000 00000",
    ".": "00000 00000 00000 00000 00000 01100 01100",
    "'": "01100 00100 01000 00000 00000 00000 00000",
    "-": "00000 00000 00000 11111 00000 00000 00000",
    ":": "00000 01100 01100 00000 01100 01100 00000"
  };

  // Text → array of 7 row bitmaps (arrays of 0/1), centered in COLS.
  function rasterize(text) {
    const rows = Array.from({ length: 7 }, () => new Array(COLS).fill(0));
    const chars = [...text.toUpperCase()].filter((c) => FONT[c]);
    const width = chars.length * 6 - 1;
    let x = Math.floor((COLS - width) / 2);
    for (const c of chars) {
      FONT[c].split(" ").forEach((bits, r) => {
        for (let b = 0; b < 5; b++) {
          if (bits[b] === "1" && x + b >= 0 && x + b < COLS) rows[r][x + b] = 1;
        }
      });
      x += 6;
    }
    return rows;
  }

  // Slight per-LED brightness variance, like real aged diodes.
  const tint = Array.from({ length: COLS * ROWS }, () => 0.82 + Math.random() * 0.18);

  let grid = new Array(COLS * ROWS).fill(0);
  let size = { w: 0, h: 0, dpr: 1 };

  function paintBand(band, bitmap, offset) {
    for (let r = 0; r < band.h; r++) {
      const src = r + offset;
      for (let c = 0; c < COLS; c++) {
        const on = bitmap && src >= 0 && src < 7 ? bitmap[src][c] : 0;
        if (on) grid[(band.y + r) * COLS + c] = 1;
      }
    }
  }

  function clearBand(band) {
    for (let r = band.y; r < band.y + band.h; r++) grid.fill(0, r * COLS, (r + 1) * COLS);
  }

  function draw() {
    const { w, h, dpr } = size;
    if (!w) return;
    const pitch = w / COLS;
    const rCore = pitch * 0.36;
    const rGlow = pitch * 0.72;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#050606";
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < grid.length; i++) {
      const cx = (i % COLS + 0.5) * pitch;
      const cy = (Math.floor(i / COLS) + 0.5) * pitch;
      if (grid[i]) {
        const k = tint[i];
        ctx.fillStyle = `rgba(255, 150, 20, ${0.22 * k})`;
        ctx.beginPath();
        ctx.arc(cx, cy, rGlow, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255, ${170 + 20 * k | 0}, 40, ${k})`;
        ctx.beginPath();
        ctx.arc(cx, cy, rCore, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255, 235, 180, ${0.55 * k})`;
        ctx.beginPath();
        ctx.arc(cx, cy, rCore * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#1a1409";
        ctx.beginPath();
        ctx.arc(cx, cy, rCore, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = w * ROWS / COLS;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    size = { w, h, dpr };
    draw();
  }

  new ResizeObserver(resize).observe(canvas);

  const header = rasterize("NEXT STOP");
  let i = 0;
  let current = rasterize(stops[i]);
  paintBand(TOP, header, 0);
  paintBand(BOTTOM, current, 0);

  // Classic roll: the old destination scrolls up out of its row band,
  // then the new one rolls in from below, one LED row per step.
  function roll(next) {
    if (reduceMotion) {
      clearBand(BOTTOM);
      paintBand(BOTTOM, next, 0);
      current = next;
      draw();
      return;
    }
    const total = 7 + ROLL_GAP;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      clearBand(BOTTOM);
      paintBand(BOTTOM, current, step);
      paintBand(BOTTOM, next, step - total);
      draw();
      if (step >= total) {
        clearInterval(timer);
        current = next;
      }
    }, STEP_MS);
  }

  setInterval(() => {
    i = (i + 1) % stops.length;
    roll(rasterize(stops[i]));
  }, 3200);
})();

/* ---------- Route map ---------- */
(function route() {
  const stops = {
    depot: {
      name: "Bus Depot",
      text: "Every TranZit match starts here. The bus waits behind the depot and doesn't leave until a player boards it or sets off on foot toward the next area."
    },
    diner: {
      name: "Diner",
      text: "A roadside diner, reached through the tunnel out of the Bus Depot. The first stop on the loop."
    },
    farm: {
      name: "Farm",
      text: "A farmhouse and barn out in the fields. Farm is also one of Black Ops II's standalone Survival maps."
    },
    power: {
      name: "Power Station",
      text: "Where the crew turns on the power for the whole map, and where Pack-a-Punch gets set up."
    },
    town: {
      name: "Town",
      text: "The last stop before the loop starts over at the Bus Depot. Like Farm and Bus Depot, Town is also a standalone Survival map."
    }
  };

  const nameEl = document.getElementById("stopName");
  const textEl = document.getElementById("stopText");
  const groups = document.querySelectorAll(".stop");

  function select(key) {
    const s = stops[key];
    nameEl.textContent = s.name;
    textEl.textContent = s.text;
    groups.forEach(g => {
      const active = g.dataset.stop === key;
      g.classList.toggle("is-active", active);
      g.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  groups.forEach(g => {
    g.addEventListener("click", () => select(g.dataset.stop));
    g.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select(g.dataset.stop);
      }
    });
  });

  select("depot");

  /* --- Bus: drives the loop, halts at every stop --- */
  const loop = document.getElementById("loop");
  const bus = document.getElementById("busMarker");
  const status = document.getElementById("busStatus");
  const total = loop.getTotalLength();
  const SPEED = 55;    // SVG units per second
  const DWELL = 2600;  // ms spent at each stop

  // Find where along the road each stop circle sits.
  const halts = [...groups].map(g => {
    const c = g.querySelector("circle");
    const cx = +c.getAttribute("cx");
    const cy = +c.getAttribute("cy");
    let best = 0;
    let bestDist = Infinity;
    for (let s = 0; s < total; s += 1) {
      const p = loop.getPointAtLength(s);
      const d = (p.x - cx) ** 2 + (p.y - cy) ** 2;
      if (d < bestDist) { bestDist = d; best = s; }
    }
    return { key: g.dataset.stop, group: g, at: best };
  }).sort((a, b) => a.at - b.at);

  function place(s) {
    s = ((s % total) + total) % total;
    const p = loop.getPointAtLength(s);
    const a = loop.getPointAtLength((s + 1) % total);
    const b = loop.getPointAtLength((s - 1 + total) % total);
    const angle = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;
    bus.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
  }

  function arriveAt(halt) {
    groups.forEach(g => g.classList.toggle("has-bus", g === halt.group));
    status.textContent = `Bus halting at ${stops[halt.key].name}`;
  }

  function departFor(halt) {
    groups.forEach(g => g.classList.remove("has-bus"));
    status.textContent = `Bus en route to ${stops[halt.key].name}`;
  }

  let index = 0;
  place(halts[0].at);
  arriveAt(halts[0]);

  if (reduceMotion) return; // stays parked at the depot

  // Smooth start and stop between halts.
  const ease = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

  function drive() {
    const from = halts[index];
    const to = halts[(index + 1) % halts.length];
    let dist = to.at - from.at;
    if (dist <= 0) dist += total;
    const duration = dist / SPEED * 1000;
    departFor(to);

    let start = null;
    let last = null;
    function frame(now) {
      // Don't jump ahead after the tab was in the background.
      if (last !== null && now - last > 100) start += now - last - 16;
      last = now;
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      place(from.at + dist * ease(t));
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        index = (index + 1) % halts.length;
        arriveAt(to);
        setTimeout(drive, DWELL);
      }
    }
    requestAnimationFrame(frame);
  }

  setTimeout(drive, DWELL);
})();

/* ---------- Quiz ---------- */
(function quiz() {
  // Every answer can be found on this page; `see` points to the section.
  const pool = [
    { q: "Which map did T.E.D.D debut in?", options: ["TranZit", "Die Rise", "Buried", "Mob of the Dead"], answer: 0,
      why: "He drives the bus in TranZit, Black Ops II's launch map.", see: "#driver" },
    { q: "Who voices T.E.D.D?", options: ["Steve Blum", "Nolan North", "Fred Tatasciore"], answer: 1,
      why: "Nolan North voices T.E.D.D", see: "#driver" },
    { q: "Which other Zombies character does his voice actor play?", options: ["Tank Dempsey", "Takeo Masaki", "Edward Richtofen", "Nikolai Belinski"], answer: 2,
      why: "Nolan North voices both T.E.D.D and Richtofen.", see: "#driver" },
    { q: "What color do his eyes turn when he's angry?", options: ["Green", "Orange", "Red", "Purple"], answer: 2,
      why: "Blue when he's calm, red when a player gets on his bad side.", see: "#driver" },
    { q: "Which nickname does T.E.D.D go by?", options: ["Motormouth", "Tin Man", "Road Rage", "Sparky"], answer: 0,
      why: "He's also known as the Bus Driver and Motormouth.", see: "#driver" },
    { q: "Which crew does he drive around TranZit?", options: ["Ultimis", "Primis", "Victis", "Requiem"], answer: 2,
      why: "Samuel Stuhlinger, Misty Briarton, Marlton Johnson and Russman, the Victis crew.", see: "#driver" },
    { q: "Which of these is not one of the bus's five stops?", options: ["Diner", "Farm", "Pylon", "Town"], answer: 2,
      why: "The five stops are Bus Depot, Diner, Farm, Power Station and Town.", see: "#route" },
    { q: "Which stop do you reach through the tunnel out of the Bus Depot?", options: ["Town", "Diner", "Farm", "Power Station"], answer: 1,
      why: "The Diner is the first stop on the loop, right after the tunnel.", see: "#route" },
    { q: "At which stop does Pack-a-Punch get set up?", options: ["Bus Depot", "Farm", "Town", "Power Station"], answer: 3,
      why: "The Power Station is where the power goes on and Pack-a-Punch is built.", see: "#route" },
    { q: "What decides when the bus drives its loop?", options: ["The current round", "A timer", "How many zombies are left", "A lever at the depot"], answer: 1,
      why: "It runs on a timer, independent of the rounds.", see: "#route" },
    { q: "What does an EMP grenade do to the bus?", options: ["Speeds it up", "Shuts it down", "Opens the roof hatch", "Nothing"], answer: 1,
      why: "The bus stops until a Turbine gets it going again.", see: "#bus" },
    { q: "What gets a stopped bus running again?", options: ["A Turbine", "A Max Ammo", "Knifing T.E.D.D", "Waiting one round"], answer: 0,
      why: "Placing a Turbine restarts the bus.", see: "#bus" },
    { q: "Which enemy can latch onto the bus and shut it down?", options: ["A Hellhound", "The Avogadro", "Brutus", "A Denizen"], answer: 1,
      why: "The Avogadro, unless someone knifes it off.", see: "#bus" },
    { q: "Which weapon can you buy inside the bus?", options: ["Ray Gun", "B23R", "Olympia", "M14"], answer: 1,
      why: "A B23R burst pistol, for 1,000 points.", see: "#bus" },
    { q: "Once the bus is moving, where can't zombies get in?", options: ["The windows", "The roof hatch", "The doors", "The windshield"], answer: 2,
      why: "They can still break in through windows, hatch and windshield, but not the doors.", see: "#bus" },
    { q: "What can knock you off the roof in the tunnel?", options: ["Low ceiling lights", "Road signs", "Zombies on the walls", "Falling rocks"], answer: 1,
      why: "The road signs in the tunnel out of the Bus Depot.", see: "#bus" },
    { q: "In Black Ops 7's Ashes of the Damned, what does his head power?", options: ["A jump pad", "Ol' Tessie", "The Mystery Box", "A turret"], answer: 1,
      why: "Installing his head gets the pickup truck Ol' Tessie running.", see: "#appearances" },
    { q: "On which Black Ops 4 multiplayer map does he sit at the wheel of the bus?", options: ["Remnant", "Nuketown", "Firing Range", "Jungle"], answer: 0,
      why: "On Remnant the bus is parked and can be fought inside.", see: "#appearances" },
    { q: "What is TranZit's Easter egg known as?", options: ["Tower of Babble", "Fly Trap", "Richtofen's Grand Scheme", "Golden Rod"], answer: 0,
      why: "TranZit's main quest is known as Tower of Babble.", see: "#zombies" },
    { q: "Which of these is a TranZit buildable?", options: ["Juggernog", "The Ray Gun", "The Turbine", "Pack-a-Punch"], answer: 2,
      why: "The Turbine, Zombie Shield and Jet Gun are all built at a workbench.", see: "#zombies" }
  ];

  const ROUND = 8;
  const BEST_KEY = "tedd-quiz-best";

  const introEl = document.getElementById("qIntro");
  const countEl = document.getElementById("qCount");
  const scoreEl = document.getElementById("qScore");
  const progressEl = document.getElementById("qProgress");
  const textEl = document.getElementById("qText");
  const optsEl = document.getElementById("qOptions");
  const fbEl = document.getElementById("qFeedback");
  const reviewEl = document.getElementById("qReview");
  const nextBtn = document.getElementById("qNext");
  const box = document.getElementById("quizBox");

  introEl.textContent = `${ROUND} random questions from a pool of ${pool.length}. Everything you need is on this page.`;

  let round = [];
  let index = 0;
  let score = 0;
  let misses = [];
  let answered = false;

  function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function readBest() {
    try { return +localStorage.getItem(BEST_KEY) || 0; } catch { return 0; }
  }

  function saveBest(value) {
    try { localStorage.setItem(BEST_KEY, value); } catch {}
  }

  function start() {
    // Shuffle the answer order too, keeping track of the right one.
    round = shuffle(pool).slice(0, ROUND).map(item => {
      const order = shuffle(item.options.map((_, i) => i));
      return { ...item, options: order.map(i => item.options[i]), answer: order.indexOf(item.answer) };
    });
    index = 0;
    score = 0;
    misses = [];
    progressEl.innerHTML = round.map(() => "<li></li>").join("");
    reviewEl.hidden = true;
    reviewEl.innerHTML = "";
    show();
  }

  function show() {
    const item = round[index];
    answered = false;
    countEl.textContent = `Question ${index + 1} of ${round.length}`;
    scoreEl.textContent = `Score ${score}`;
    progressEl.children[index].classList.add("current");
    textEl.textContent = item.q;
    fbEl.textContent = "";
    nextBtn.hidden = true;
    optsEl.innerHTML = "";

    item.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = `<kbd aria-hidden="true">${i + 1}</kbd>`;
      b.append(opt);
      b.addEventListener("click", () => choose(i));
      optsEl.appendChild(b);
    });
  }

  function choose(i) {
    if (answered) return;
    answered = true;
    const item = round[index];
    const buttons = optsEl.querySelectorAll("button");
    buttons.forEach(b => (b.disabled = true));
    buttons[item.answer].classList.add("correct");
    const step = progressEl.children[index];
    step.classList.remove("current");

    if (i === item.answer) {
      score++;
      step.classList.add("right");
      fbEl.textContent = "Correct. " + item.why;
    } else {
      buttons[i].classList.add("wrong");
      step.classList.add("miss");
      misses.push(item);
      fbEl.textContent = "Not quite. " + item.why;
    }
    scoreEl.textContent = `Score ${score}`;

    nextBtn.textContent = index < round.length - 1 ? "Next question" : "See your score";
    nextBtn.hidden = false;
    nextBtn.focus();
  }

  function verdict(ratio) {
    if (ratio === 1) return "Perfect score. T.E.D.D approves, eyes glowing blue.";
    if (ratio >= .75) return "Solid run. Front seat's yours.";
    if (ratio >= .5) return "Halfway around the loop. Keep riding.";
    if (ratio > 0) return "You made it to the Diner, barely.";
    return "T.E.D.D just drove off without you.";
  }

  function finish() {
    const previous = readBest();
    const best = Math.max(previous, score);
    saveBest(best);

    countEl.textContent = "Finished";
    scoreEl.textContent = score > previous ? "New best!" : `Best ${best} of ${round.length}`;
    textEl.textContent = `You scored ${score} of ${round.length}.`;
    optsEl.innerHTML = "";
    fbEl.textContent = verdict(score / round.length);

    if (misses.length) {
      const list = document.createElement("ol");
      misses.forEach(m => {
        const li = document.createElement("li");
        li.innerHTML = `<p></p><p class="q-r-answer"></p><p class="q-r-why"></p>`;
        const [q, a, why] = li.children;
        q.textContent = m.q;
        a.textContent = m.options[m.answer];
        why.textContent = m.why + " ";
        const link = document.createElement("a");
        link.href = m.see;
        link.textContent = "Read up";
        why.append(link);
        list.append(li);
      });
      reviewEl.innerHTML = "<h3>What you missed</h3>";
      reviewEl.append(list);
      reviewEl.hidden = false;
    }

    nextBtn.textContent = "Play again";
    nextBtn.hidden = false;
    index = round.length;
  }

  nextBtn.addEventListener("click", () => {
    if (index >= round.length) return start();
    index++;
    if (index < round.length) show();
    else finish();
  });

  // Number keys 1–4 answer while focus is inside the quiz.
  box.addEventListener("keydown", e => {
    if (index >= round.length || answered) return;
    const n = Number(e.key);
    if (n >= 1 && n <= round[index].options.length) choose(n - 1);
  });

  start();
})();
