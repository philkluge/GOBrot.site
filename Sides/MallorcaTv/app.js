const BASE_URL  = 'https://str2.eivotv.es/';
const BASE_PATH = '/index.m3u8';
const OWM_API_KEY = 'bb7df96c14881f536a7bbe0b65eb635c';
const WEATHER_STORAGE_KEY = 'mallorca_tv_weather_cache';
const WEATHER_TTL_MS = 2 * 60 * 60 * 1000; // 2 Stunden statt 10 Minuten


const CHANNEL_LOCATIONS = {
  canal_aa: { lat: 39.5057, lng: 2.4429 }, // Illa del Toro, vor Santa Ponsa
  canal_ab: { lat: 39.5057, lng: 2.4429 }, // Illa del Toro, vor Santa Ponsa
  canal_ac: { lat: 39.5057, lng: 2.4429 }, // Illa del Toro
  canal_ad: { lat: 39.7601, lng: 2.8688 }, // Mancor de la Vall
  canal_ae: { lat: 39.5830, lng: 2.6780 }, // Horta, Palma
  canal_af: { lat: 39.5698, lng: 3.2094 }, // Manacor
  canal_ag: { lat: 39.9084, lng: 3.0912 }, // Port de Pollença
  canal_ah: { lat: 39.8500, lng: 3.1250 }, // Sant Martí / Alcúdia
  canal_ai: { lat: 38.7359, lng: 1.4225 }, // La Savina, Formentera
  canal_ak: { lat: 39.9105, lng: 4.2989 }, // Sa Mesquida, Menorca
  canal_al: { lat: 39.8264, lng: 4.2661 }, // Punta Prima, Menorca
  canal_am: { lat: 39.7120, lng: 2.9130 }, // Ermita de Santa Magdalena, Inca
  canal_an: { lat: 39.3390, lng: 2.8240 }, // Cap Blanc
  canal_ao: { lat: 38.9020, lng: 1.4360 }, // Ses Figueretes, Eivissa
  canal_ap: { lat: 39.8885, lng: 4.2658 }, // Maó
  canal_aq: { lat: 39.8778, lng: 4.2892 }, // Es Castell
  canal_ar: { lat: 40.0177, lng: 3.8933 }, // Cala Morell

  canal_a:  { lat: 39.7011, lng: 3.4342 }, // Capdepera
  canal_b:  { lat: 39.9580, lng: 3.1900 }, // La Mola, Pollença/Formentor
  canal_d:  { lat: 39.8280, lng: 4.2470 }, // Cala Torret, Menorca
  canal_e:  { lat: 39.5560, lng: 2.9830 }, // Puig de Randa
  canal_f:  { lat: 39.8763, lng: 3.0166 }, // Montaña de Pollença
  canal_g:  { lat: 39.9834, lng: 4.1000 }, // Monte Toro, Menorca
  canal_h:  { lat: 39.7089, lng: 2.6928 }, // Jardins d'Alfàbia
  canal_i:  { lat: 39.9236, lng: 3.0589 }, // Cala Sant Vicenç
  canal_j:  { lat: 39.5867, lng: 3.3467 }, // S'Illot
  canal_k:  { lat: 39.6919, lng: 3.3644 }, // Puig de sa Tudossa, Artà
  canal_l:  { lat: 39.8422, lng: 3.1590 }, // Museu Sa Bassa Blanca, Alcúdia
  canal_m:  { lat: 39.6942, lng: 3.3489 }, // Artà
  canal_n:  { lat: 39.4756, lng: 3.1867 }, // Sant Salvador, Felanitx
  canal_o:  { lat: 38.9660, lng: 1.2136 }, // Puig de sa Talaia, Eivissa
  canal_p:  { lat: 38.9847, lng: 1.5347 }, // Santa Eulària des Riu
  canal_q:  { lat: 39.7967, lng: 2.6981 }, // Sóller
  canal_r:  { lat: 38.6614, lng: 1.5601 }, // La Mola, Formentera
  canal_s:  { lat: 38.9227, lng: 1.3009 }, // Sant Josep de sa Talaia
  canal_t:  { lat: 39.6987, lng: 3.4649 }, // Font de sa Cala
  canal_u:  { lat: 39.8763, lng: 3.0166 }, // Puig de Maria, Pollença
  canal_v:  { lat: 39.8167, lng: 3.1667 }, // Colònia de Sant Pere
  canal_w:  { lat: 39.3311, lng: 2.9903 }, // Colònia de Sant Jordi
  canal_x:  { lat: 39.9328, lng: 3.8394 }, // Cala en Bosch, Menorca
  canal_y:  { lat: 39.1500, lng: 2.9333 }, // Cabrera
  canal_z:  { lat: 39.7864, lng: 3.2394 }, // Betlem, Artà
};

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

function loadWeatherCache() {
  if (!HAS_LOCAL_STORAGE) return {};
  try {
    const raw = window.localStorage.getItem(WEATHER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveWeatherCache(cache) {
  if (!HAS_LOCAL_STORAGE) return;
  try {
    window.localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

const weatherCache = loadWeatherCache();

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
      loc:   CHANNEL_LOCATIONS[id] || null,
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
      loc:   CHANNEL_LOCATIONS[id] || null,
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

function fetchWeather(id, lat, lng) {
  const cached = weatherCache[id];
  if (cached && (Date.now() - cached.time) < WEATHER_TTL_MS) {
    return Promise.resolve(cached.data);
  }

  if (!OWM_API_KEY) {
    return Promise.reject(new Error('missing-api-key'));
  }

  const url = 'https://api.openweathermap.org/data/2.5/weather' +
    '?lat=' + lat + '&lon=' + lng +
    '&units=metric&lang=es&appid=' + OWM_API_KEY;

  return fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error('weather-fetch-failed');
      return res.json();
    })
    .then(function (data) {
      weatherCache[id] = { data, time: Date.now() };
      saveWeatherCache(weatherCache);
      return data;
    });
}

function createPopupContent(ch) {
  const wrap = document.createElement('div');
  wrap.className = 'map-popup';

  const starred = isFavorite(ch.id);

  wrap.innerHTML =
    '<div class="popup-header">' +
    '  <span class="popup-name">' + ch.name + '</span>' +
    '  <button class="star-btn popup-star-btn' + (starred ? ' starred' : '') + '"' +
    '    data-id="' + ch.id + '"' +
    '    aria-label="' + (starred ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen') + '"' +
    '  >★</button>' +
    '</div>' +
    '<div class="popup-weather" data-role="weather">Wetter wird geladen…</div>' +
    '<button class="popup-play-btn">▶ Ansehen</button>';

  wrap.querySelector('.star-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    const nowStarred = toggleFavorite(ch.id);
    handleStarClick(ch.id, nowStarred);
  });

  wrap.querySelector('.popup-play-btn').addEventListener('click', function () {
    openPlayer(ch.url, ch.name);
  });

  wrap.loadWeather = function () {
    const weatherEl = wrap.querySelector('[data-role="weather"]');
    fetchWeather(ch.id, ch.loc.lat, ch.loc.lng)
      .then(function (data) {
        const temp    = Math.round(data.main.temp);
        const desc    = data.weather[0].description;
        const iconUrl = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png';
        weatherEl.innerHTML =
          '<img class="weather-icon" src="' + iconUrl + '" alt="' + desc + '">' +
          '<span>' + temp + '°C · ' + desc + '</span>';
      })
      .catch(function (err) {
        weatherEl.textContent = err.message === 'missing-api-key'
          ? 'No hay API-Key disponible'
          : 'No hay datos meteorológicos disponibles';
      });
  };

  return wrap;
}

let leafletMap = null;

function initMap(channels) {
  const container = document.getElementById('mapContainer');
  if (!container || typeof L === 'undefined') return;

  leafletMap = L.map(container, { attributionControl: true }).setView([39.4, 2.9], 8);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 16,
  }).addTo(leafletMap);

  const markerIcon = L.divIcon({
    className: 'map-marker',
    html: '<span class="map-marker-dot"></span>',
    iconSize: [16, 16],
  });

  channels.forEach(function (ch) {
    if (!ch.loc) return;
    const popupEl = createPopupContent(ch);
    const marker  = L.marker([ch.loc.lat, ch.loc.lng], { icon: markerIcon })
      .addTo(leafletMap)
      .bindPopup(popupEl, { maxWidth: 240 });
    marker.on('popupopen', function () { popupEl.loadWeather(); });
  });

  window.addEventListener('load', function () {
    leafletMap.invalidateSize();
  });
}

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
  initMap(ALL_CHANNELS);
});
