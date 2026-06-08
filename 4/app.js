const BASE_URL  = 'https://str2.eivotv.es/';
const BASE_PATH = '/index.m3u8';

const SET_A_PREFIX     = 'canal_a';
const SET_A_FIRST_CHAR = 'a';
const SET_A_LAST_CHAR  = 'z';

const CHANNEL_NAMES_A = {
  canal_aa: 'El Toro - 1 Vista dirección Palma',
  canal_ab: 'El Toro - 2 Vista Santa Ponsa',
  canal_ac: 'Illa del Toro',
  canal_ad: 'Mancor',
  canal_ae: 'Horta',
  canal_af: 'Manacor',
  canal_ag: 'Port de Pollença',
  canal_ah: 'Sant Marti Alcudia',
  canal_ai: 'La Savina',
  canal_aj: 'No Name',
  canal_ak: 'Sa Mesquida',
  canal_al: 'Punta Prima',
  canal_am: 'Santa Magdalena',
  canal_an: 'Cap Blanc',
  canal_ao: 'Ses Figueretes',
  canal_ap: 'Maó',
  canal_aq: 'Es Castell',
  canal_ar: 'Cala Morell',
  canal_as: 'No Name',
  canal_at: 'No Name',
  canal_au: 'No Name',
  canal_av: 'No Name',
  canal_aw: 'No Name',
  canal_ax: 'No Name',
  canal_ay: 'No Name',
  canal_az: 'No Name',
};

const SET_B_PREFIX     = 'canal_';
const SET_B_FIRST_CHAR = 'a';
const SET_B_LAST_CHAR  = 'z';

const CHANNEL_NAMES_B = {
  canal_a: 'Capdepera',
  canal_b: 'La Mola - Pollença',
  canal_c: 'No Name',
  canal_d: 'Cala Torret',
  canal_e: 'Puig de Randa',
  canal_f: 'Montaña de Pollença',
  canal_g: 'Monte Toro',
  canal_h: 'Alfabia',
  canal_i: 'Cala Sant Vicenç',
  canal_j: 'S Illot',
  canal_k: 'Puig de sa Tudossa - Artà',
  canal_l: 'Museu Sa Bassa Blanca',
  canal_m: 'Artà',
  canal_n: 'Sant Salvador - Felanitx',
  canal_o: 'Puig de sa Talaia',
  canal_p: 'Santa Eulària des Riu',
  canal_q: 'Playa Alconàsser - Sóller',
  canal_r: 'La Mola',
  canal_s: 'San Josep',
  canal_t: 'Font de sa Cala',
  canal_u: 'Puig de Maria, Pollença',
  canal_v: 'Colònia de Sant Pere',
  canal_w: 'Colònia Sant Jordi',
  canal_x: 'Cala en Bosch',
  canal_y: 'Cabrera',
  canal_z: 'Betlem',
};

const STORAGE_KEY = 'mallorca_tv_favorites';
let memoryFavorites = [];

const HAS_LOCAL_STORAGE = (function () {
  try {
    const probe = '__mtv_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch (e) {
    return false;
  }
})();

function readFavoritesCookie() {
  if (HAS_LOCAL_STORAGE) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  try {
    const all = document.cookie.split(';');
    for (let i = 0; i < all.length; i++) {
      const part = all[i].trim();
      if (part.startsWith(STORAGE_KEY + '=')) {
        const raw = part.substring(STORAGE_KEY.length + 1);
        const parsed = JSON.parse(decodeURIComponent(raw));
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (e) {}

  return memoryFavorites.slice();
}

function writeFavoritesCookie(ids) {
  memoryFavorites = ids.slice();

  if (HAS_LOCAL_STORAGE) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      return;
    } catch (e) {}
  }

  try {
    const value   = encodeURIComponent(JSON.stringify(ids));
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie =
      STORAGE_KEY + '=' + value +
      '; expires=' + expires.toUTCString() +
      '; path=/' +
      '; SameSite=Lax';
  } catch (e) {}
}

function isFavorite(id) {
  return readFavoritesCookie().indexOf(id) !== -1;
}

function toggleFavorite(id) {
  const favs = readFavoritesCookie();
  const idx  = favs.indexOf(id);

  if (idx === -1) {
    favs.push(id);
    writeFavoritesCookie(favs);
    return true; 
  } else {
    favs.splice(idx, 1);
    writeFavoritesCookie(favs);
    return false;
  }
}


function buildChannels() {
  const channels = [];
  let num = 1;

  const spanA = SET_A_LAST_CHAR.charCodeAt(0) - SET_A_FIRST_CHAR.charCodeAt(0);
  for (let i = 0; i <= spanA; i++) {
    const letter = String.fromCharCode(SET_A_FIRST_CHAR.charCodeAt(0) + i);
    const id     = SET_A_PREFIX + letter;
    channels.push({
      id,
      name:  CHANNEL_NAMES_A[id] || 'Canal ' + num,
      url:   BASE_URL + id + BASE_PATH,
      num:   String(num).padStart(2, '0'),
      group: 'A',
    });
    num++;
  }

  const spanB = SET_B_LAST_CHAR.charCodeAt(0) - SET_B_FIRST_CHAR.charCodeAt(0);
  for (let i = 0; i <= spanB; i++) {
    const letter = String.fromCharCode(SET_B_FIRST_CHAR.charCodeAt(0) + i);
    const id     = SET_B_PREFIX + letter;
    channels.push({
      id,
      name:  CHANNEL_NAMES_B[id] || 'Canal ' + num,
      url:   BASE_URL + id + BASE_PATH,
      num:   String(num).padStart(2, '0'),
      group: 'B',
    });
    num++;
  }

  return channels;
}

function createCard(ch, dotIndex, onStarClick) {
  const starred = isFavorite(ch.id);

  const card = document.createElement('div');
  card.className = 'channel-card';
  card.setAttribute('role', 'listitem');
  card.tabIndex  = 0;
  card.setAttribute('aria-label', ch.name + ' abspielen');
  card.style.setProperty('--dot-delay', (dotIndex * 0.12 % 2) + 's');
  card.dataset.channelId = ch.id;

  card.innerHTML =
    '<button class="star-btn' + (starred ? ' starred' : '') + '"' +
    '  data-id="' + ch.id + '"' +
    '  aria-label="' + (starred ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen') + '"' +
    '  title="' + (starred ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen') + '"' +
    '>★</button>' +
    '<div class="card-inner">' +
    '  <div class="card-id">' + ch.id.toUpperCase() + '</div>' +
    '  <div class="card-name">' + ch.name + '</div>' +
    '</div>' +
    '<div class="card-footer">' +
    '  <div class="card-live"><span class="card-dot"></span>LIVE</div>' +
    '  <div class="card-play-btn">▶</div>' +
    '</div>' +
    '<div class="card-num" aria-hidden="true">' + ch.num + '</div>';


  card.querySelector('.star-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    const nowStarred = toggleFavorite(ch.id);
    onStarClick(ch.id, nowStarred);
  });

  card.addEventListener('click', function () {
    openPlayer(ch.url, ch.name);
  });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPlayer(ch.url, ch.name);
    }
  });

  return card;
}

let ALL_CHANNELS = [];

function refreshFavoritesSection() {
  const section  = document.getElementById('favoritesSection');
  const grid     = document.getElementById('favoritesGrid');
  const divider  = document.getElementById('favoritesDivider');
  const favIds   = readFavoritesCookie();


  grid.innerHTML = '';

  if (favIds.length === 0) {
    section.classList.remove('visible');
    divider.style.display = 'none';
    return;
  }

  const favChannels = [];
  favIds.forEach(function (id) {
    const ch = ALL_CHANNELS.find(function (c) { return c.id === id; });
    if (ch) favChannels.push(ch);
  });

  if (favChannels.length === 0) {
    section.classList.remove('visible');
    divider.style.display = 'none';
    return;
  }

  section.classList.add('visible');
  divider.style.display = 'block';

  favChannels.forEach(function (ch, i) {
    const card = createCard(ch, i, handleStarClick);
    grid.appendChild(card);
  });
}

function handleStarClick(channelId, nowStarred) {
  document.querySelectorAll('.star-btn[data-id="' + channelId + '"]')
    .forEach(function (btn) {
      btn.classList.toggle('starred', nowStarred);
      const label = nowStarred ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen';
      btn.setAttribute('aria-label', label);
      btn.title = label;
    });
  refreshFavoritesSection();
}

function renderMainGrid(channels) {
  const grid = document.getElementById('channelsGrid');
  grid.innerHTML = '';

  channels.forEach(function (ch, i) {
    const card = createCard(ch, i, handleStarClick);
    grid.appendChild(card);
  });
}

let hlsInstance = null;

function openPlayer(url, name) {
  const modal   = document.getElementById('playerModal');
  const video   = document.getElementById('videoPlayer');
  const overlay = document.getElementById('playerOverlay');
  const nameEl  = document.getElementById('modalChannelName');

  if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
  video.src = '';

  nameEl.textContent = name;
  overlay.classList.remove('hidden');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  function hideOverlay() {
    overlay.classList.add('hidden');
    video.removeEventListener('playing', hideOverlay);
  }
  video.addEventListener('playing', hideOverlay);

  if (Hls.isSupported()) {
    hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(video);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(function () {});
    });
    hlsInstance.on(Hls.Events.ERROR, function (_, data) {
      if (data.fatal) console.error('HLS error:', data.type, data.details);
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play().catch(function () {});
  } else {
    overlay.innerHTML =
      '<p style="color:#c8622a;font-family:var(--ff-mono);font-size:0.72rem;' +
      'letter-spacing:0.25em;text-transform:uppercase">HLS no soportado</p>';
  }
}

function closePlayer() {
  const modal = document.getElementById('playerModal');
  const video = document.getElementById('videoPlayer');
  if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
  video.pause();
  video.src = '';
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.getElementById('closeBtn').addEventListener('click', closePlayer);
document.getElementById('modalBackdrop').addEventListener('click', closePlayer);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !document.getElementById('playerModal').hidden) {
    closePlayer();
  }
});


function initTicker() {
  const inner = document.getElementById('tickerInner');
  if (!inner) return;

  Array.from(inner.children).forEach(function (el) {
    inner.appendChild(el.cloneNode(true));
  });

  let offset    = 0;
  let halfWidth = 0;
  const speed   = 0.5;

  function measure() {
    halfWidth = inner.scrollWidth / 4;
  }

  function tick() {
    offset -= speed;
    if (offset <= -halfWidth) offset += halfWidth;
    inner.style.transform = 'translateX(' + offset + 'px)';
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(function () {
    measure();
    tick();
  });

  window.addEventListener('resize', measure);
}


function initHeat() {
  const canvas = document.getElementById('heatCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, motes = [], columns = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function newMote(atBottom) {
    return {
      x:       Math.random() * W,
      y:       atBottom ? H + 5 : Math.random() * H,
      r:       Math.random() * 1.2 + 0.2,
      vy:      -(Math.random() * 0.22 + 0.04),
      vx:      (Math.random() - 0.5) * 0.12,
      alpha:   Math.random() * 0.5 + 0.05,
      flicker: Math.random() * 0.008 + 0.002,
      phase:   Math.random() * Math.PI * 2,
      hue:     Math.random() < 0.6 ? 38 : Math.random() < 0.5 ? 22 : 55,
      sat:     Math.random() * 30 + 20,
      lit:     Math.random() * 30 + 65,
    };
  }

  function spawnMotes() {
    motes = [];
    const count = Math.floor(W * H / 5500);
    for (let i = 0; i < count; i++) motes.push(newMote(false));
  }

  function spawnColumns() {
    columns = [];
    const count = Math.floor(W / 90);
    for (let i = 0; i < count; i++) {
      columns.push({
        x:      Math.random() * W,
        width:  Math.random() * 30 + 8,
        vy:     -(Math.random() * 0.3 + 0.08),
        y:      Math.random() * H,
        height: Math.random() * 180 + 60,
        alpha:  Math.random() * 0.025 + 0.004,
        drift:  (Math.random() - 0.5) * 0.04,
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    columns.forEach(function (col) {
      col.y += col.vy;
      col.x += col.drift;
      if (col.x < -50)      col.x = W + 50;
      if (col.x > W + 50)   col.x = -50;
      if (col.y + col.height < 0) { col.y = H; col.x = Math.random() * W; }

      const grad = ctx.createLinearGradient(col.x, col.y, col.x, col.y + col.height);
      grad.addColorStop(0,   'rgba(255,210,160,0)');
      grad.addColorStop(0.4, 'rgba(255,210,160,' + col.alpha + ')');
      grad.addColorStop(0.7, 'rgba(255,180,100,' + (col.alpha * 0.6) + ')');
      grad.addColorStop(1,   'rgba(255,210,160,0)');

      ctx.beginPath();
      ctx.ellipse(col.x, col.y + col.height / 2, col.width / 2, col.height / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    motes.forEach(function (m, idx) {
      m.x     += m.vx;
      m.y     += m.vy;
      m.phase += m.flicker;
      const a = m.alpha * (0.6 + 0.4 * Math.abs(Math.sin(m.phase)));
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + m.hue + ',' + m.sat + '%,' + m.lit + '%,' + a + ')';
      ctx.fill();
      if (m.y < -10 || m.x < -10 || m.x > W + 10) motes[idx] = newMote(true);
    });

    requestAnimationFrame(drawFrame);
  }

  resize();
  spawnMotes();
  spawnColumns();
  requestAnimationFrame(drawFrame);
  window.addEventListener('resize', function () {
    resize();
    spawnMotes();
    spawnColumns();
  });
}


document.addEventListener('DOMContentLoaded', function () {
  initHeat();
  initTicker();
  ALL_CHANNELS = buildChannels();
  renderMainGrid(ALL_CHANNELS);
  refreshFavoritesSection();
});
