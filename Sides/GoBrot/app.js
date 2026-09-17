/* GoBrot – Lexikon, Detailansicht, Navigation */
(() => {
  const { REGIONS, CATEGORIES, BREADS } = window.GOBROT_DATA;

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const catByKey = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
  const byId = new Map(BREADS.map((b) => [b.id, b]));
  const sorted = [...BREADS].sort((a, b) => a.name.localeCompare(b.name, "de"));
  sorted.forEach((b) => {
    b._hay = norm([b.name, b.alias, b.land, b.region, catByKey[b.kat].label, b.getreide, b.trieb, b.text].filter(Boolean).join(" "));
  });

  const state = { q: "", region: "", kat: "" };
  let visible = sorted;

  const grid = $("#bread-grid");
  const empty = $("#bread-empty");
  const countEl = $("#result-count");
  const search = $("#search");
  const catSelect = $("#filter-kategorie");
  const regionGroup = $("#filter-region");

  // Anzahl überall einsetzen
  $$("[data-bread-count]").forEach((el) => { el.textContent = BREADS.length; });

  // Filter aufbauen
  const regionCount = (r) => BREADS.filter((b) => b.region === r).length;
  regionGroup.innerHTML = [["", "Alle Regionen", BREADS.length], ...REGIONS.map((r) => [r, r, regionCount(r)])]
    .map(([val, label, n]) => `<button type="button" class="chip" data-region="${esc(val)}" aria-pressed="${val === "" ? "true" : "false"}">${esc(label)} <span class="chip__n">${n}</span></button>`)
    .join("");

  CATEGORIES.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.key;
    opt.textContent = `${c.label} (${BREADS.filter((b) => b.kat === c.key).length})`;
    catSelect.appendChild(opt);
  });

  const cardHTML = (b) => {
    const cat = catByKey[b.kat];
    return `<li>
      <button type="button" class="tag" data-id="${b.id}" style="--cat:${cat.color}">
        <span class="tag__cat">${esc(cat.label)}</span>
        <span class="tag__name">${esc(b.name)}</span>
        <span class="tag__land">${esc(b.land)}</span>
        <span class="tag__text">${esc(b.text)}</span>
        <span class="tag__meta">${esc(b.getreide)}<br>${esc(b.trieb)}</span>
      </button>
    </li>`;
  };

  const render = () => {
    const words = norm(state.q).split(/\s+/).filter(Boolean);
    visible = sorted.filter((b) =>
      (!state.region || b.region === state.region) &&
      (!state.kat || b.kat === state.kat) &&
      words.every((w) => b._hay.includes(w))
    );
    grid.innerHTML = visible.map(cardHTML).join("");
    empty.hidden = visible.length > 0;
    countEl.textContent = visible.length === BREADS.length
      ? `Alle ${BREADS.length} Brotsorten, alphabetisch`
      : `${visible.length} von ${BREADS.length} Brotsorten`;
  };

  let searchTimer;
  search.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = search.value; render(); }, 120);
  });

  catSelect.addEventListener("change", () => { state.kat = catSelect.value; render(); });

  regionGroup.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-region]");
    if (!btn) return;
    state.region = btn.dataset.region;
    $$("[data-region]", regionGroup).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    render();
  });

  $("#filter-reset").addEventListener("click", () => {
    state.q = ""; state.region = ""; state.kat = "";
    search.value = ""; catSelect.value = "";
    $$("[data-region]", regionGroup).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.region === "")));
    render();
    search.focus();
  });

  grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-id]");
    if (card) openBread(card.dataset.id);
  });

  $("#random-bread").addEventListener("click", () => {
    const pool = visible.length ? visible : sorted;
    openBread(pool[Math.floor(Math.random() * pool.length)].id);
  });

  // Detailansicht
  const dialog = $("#bread-dialog");
  const d = {
    card: $(".sheet", dialog),
    cat: $("#dlg-cat", dialog),
    title: $("#dlg-title", dialog),
    alias: $("#dlg-alias", dialog),
    land: $("#dlg-land", dialog),
    region: $("#dlg-region", dialog),
    getreide: $("#dlg-getreide", dialog),
    trieb: $("#dlg-trieb", dialog),
    text: $("#dlg-text", dialog),
    faktBox: $("#dlg-fakt", dialog),
    fakt: $("#dlg-fakt-text", dialog),
    prev: $("#dlg-prev", dialog),
    next: $("#dlg-next", dialog)
  };
  let currentId = null;
  let lastFocus = null;

  const neighbourList = () => (visible.some((b) => b.id === currentId) ? visible : sorted);

  const fill = (b) => {
    const cat = catByKey[b.kat];
    currentId = b.id;
    d.card.style.setProperty("--cat", cat.color);
    d.cat.textContent = cat.label;
    d.title.textContent = b.name;
    d.alias.textContent = b.alias ? `Auch bekannt als ${b.alias}` : "";
    d.alias.hidden = !b.alias;
    d.land.textContent = b.land;
    d.region.textContent = b.region;
    d.getreide.textContent = b.getreide;
    d.trieb.textContent = b.trieb;
    d.text.textContent = b.text;
    d.fakt.textContent = b.fakt || "";
    d.faktBox.hidden = !b.fakt;

    const list = neighbourList();
    const i = list.findIndex((x) => x.id === b.id);
    const prev = list[i - 1];
    const next = list[i + 1];
    d.prev.hidden = !prev;
    d.next.hidden = !next;
    d.prev.dataset.id = prev ? prev.id : "";
    d.next.dataset.id = next ? next.id : "";
    d.prev.querySelector("span").textContent = prev ? prev.name : "";
    d.next.querySelector("span").textContent = next ? next.name : "";

    history.replaceState(null, "", `#brot/${b.id}`);
  };

  function openBread(id) {
    const b = byId.get(id);
    if (!b) return;
    fill(b);
    if (!dialog.open) {
      lastFocus = document.activeElement;
      dialog.showModal();
    }
    dialog.scrollTop = 0;
  }

  const closeDialog = () => dialog.open && dialog.close();

  dialog.addEventListener("close", () => {
    history.replaceState(null, "", location.pathname + location.search);
    currentId = null;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", (e) => { if (e.target === dialog) closeDialog(); });
  $("#dlg-close", dialog).addEventListener("click", closeDialog);
  [d.prev, d.next].forEach((btn) => btn.addEventListener("click", () => btn.dataset.id && openBread(btn.dataset.id)));
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && !d.prev.hidden) d.prev.click();
    if (e.key === "ArrowRight" && !d.next.hidden) d.next.click();
  });

  const openFromHash = () => {
    const m = location.hash.match(/^#brot\/([a-z0-9-]+)$/);
    if (m) openBread(m[1]);
  };
  window.addEventListener("hashchange", openFromHash);

  // Aktiver Menüpunkt
  const navLinks = $$(".site-nav a");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  let navTick = false;
  const updateNav = () => {
    navTick = false;
    const mark = window.innerHeight * 0.4;
    let current = null;
    sections.forEach((sec) => { if (sec.getBoundingClientRect().top <= mark) current = sec; });
    navLinks.forEach((a) => a.classList.toggle("is-active", !!current && a.getAttribute("href") === `#${current.id}`));
  };
  window.addEventListener("scroll", () => {
    if (!navTick) { navTick = true; requestAnimationFrame(updateNav); }
  }, { passive: true });
  window.addEventListener("resize", updateNav);

  $("#year").textContent = new Date().getFullYear();

  window.GoBrot = { openBread };

  render();
  updateNav();
  openFromHash();
})();
