/* GoBrot – Quiz „Welches Brot bin ich?“
   Vier Achsen, je drei Fragen:
   t: Tradition (+) / Abenteuer (−)
   k: Kräftig (+)   / Fein (−)
   g: Gesellig (+)  / Ruhig (−)
   h: Herzhaft (+)  / Süß (−)  */
(() => {
  const AXES = {
    t: { plus: "Traditionsbewusst", minus: "Abenteuerlustig", pos: "T", neg: "A" },
    k: { plus: "Kräftig & rustikal", minus: "Fein & leicht", pos: "K", neg: "F" },
    g: { plus: "Gesellig", minus: "In sich ruhend", pos: "G", neg: "R" },
    h: { plus: "Herzhaft", minus: "Süß", pos: "H", neg: "S" }
  };

  const QUESTIONS = [
    { axis: "t", q: "Wie sieht dein perfekter Urlaub aus?", a: [
      ["Das gleiche gemütliche Ferienhaus wie jedes Jahr", 2],
      ["Mit dem Rucksack durch ein Land, das ich noch nicht kenne", -2],
      ["Eine Städtereise in Europa", 1],
      ["Ein Roadtrip ohne festen Plan", -1] ] },
    { axis: "k", q: "Welcher Kleidungsstil passt zu dir?", a: [
      ["Schlicht, elegant, gut sitzend", -1],
      ["Karohemd und Wanderschuhe – fertig", 2],
      ["Leicht und luftig, gern mit Statement", -2],
      ["Jeans und Pulli: bequem, aber ordentlich", 1] ] },
    { axis: "g", q: "Freitagabend. Was machst du?", a: [
      ["Essen mit ein paar guten Freunden", 1],
      ["Serie, Decke, Tee", -1],
      ["Party – je mehr Leute, desto besser", 2],
      ["Ein Buch und absolute Ruhe", -2] ] },
    { axis: "h", q: "Was kommt bei dir aufs Frühstücksbrot?", a: [
      ["Honig oder Marmelade", -1],
      ["Käse, Wurst oder Ei", 2],
      ["Schokocreme – je mehr, desto besser", -2],
      ["Avocado, Tomate und etwas Salz", 1] ] },
    { axis: "t", q: "Im Restaurant bestellst du …", a: [
      ["… das Gericht, dessen Namen ich nicht aussprechen kann", -2],
      ["… mein Stammgericht. Warum ändern, was gut ist?", 2],
      ["… die Empfehlung des Hauses", -1],
      ["… etwas Bekanntes mit kleinem Twist", 1] ] },
    { axis: "k", q: "Wie gehst du Probleme an?", a: [
      ["Ärmel hoch und durch", 2],
      ["Mit Fingerspitzengefühl", -1],
      ["Mit Ausdauer – ich bleibe dran", 1],
      ["Locker bleiben, es findet sich eine Lösung", -2] ] },
    { axis: "g", q: "In einer Gruppe bist du …", a: [
      ["… eher am Zuhören als am Reden", -1],
      ["… gern mittendrin, aber nicht im Mittelpunkt", 1],
      ["… lieber gar nicht – ich bin gern allein unterwegs", -2],
      ["… die Person, die alle zusammenbringt", 2] ] },
    { axis: "h", q: "Nachmittags packt dich der Hunger. Du greifst zu …", a: [
      ["… einem Stück Kuchen", -2],
      ["… Nüssen und Käsewürfeln", 1],
      ["… einer Brezel oder Chips", 2],
      ["… frischem Obst", -1] ] },
    { axis: "t", q: "Welcher Satz könnte von dir sein?", a: [
      ["Bewährtes schätze ich, Neues probiere ich gern.", 1],
      ["Das Leben beginnt am Ende der Komfortzone.", -2],
      ["Früher war nicht alles schlecht.", 2],
      ["Neugier ist mein zweiter Vorname.", -1] ] },
    { axis: "k", q: "Dein Lieblingswetter?", a: [
      ["Warme Sommerbrise", -2],
      ["Klarer, kalter Wintertag", 1],
      ["Herbststurm und Kaminfeuer", 2],
      ["Milder Frühlingsmorgen", -1] ] },
    { axis: "g", q: "Jemand möchte von deinem Teller probieren.", a: [
      ["Klar, nimm dir!", 1],
      ["Mein Teller ist mein Königreich.", -2],
      ["Wir stellen einfach alles in die Mitte!", 2],
      ["Na gut, ein kleines Stück.", -1] ] },
    { axis: "h", q: "Wie würden dich Freunde beschreiben?", a: [
      ["Herzlich und fürsorglich", -1],
      ["Direkt und ehrlich, manchmal etwas salzig", 2],
      ["Zuckersüß – ein echter Schatz", -2],
      ["Bodenständig und verlässlich", 1] ] }
  ];

  const RESULTS = {
    TKGH: { id: "bauernbrot", title: "Der bodenständige Gastgeber",
      text: "Bei dir ist immer ein Platz am Tisch frei. Du bist verlässlich, herzlich und brauchst keinen Schnickschnack – Hauptsache, alle werden satt und die Stimmung stimmt." },
    TKGS: { id: "christstollen", title: "Die Seele jedes Festes",
      text: "Du bringst Menschen zusammen und hast ein Faible für Rituale. Unter deiner ruhigen Oberfläche steckt mehr Wärme und Süße, als viele vermuten." },
    TKRH: { id: "pumpernickel", title: "Der geduldige Tiefgründige",
      text: "Gut Ding will Weile haben – so wie deine 16 Stunden im Ofen. Du bist beständig, denkst gründlich nach und wirst mit der Zeit nur besser." },
    TKRS: { id: "hutzelbrot", title: "Der stille Genießer",
      text: "Du magst es gemütlich, echt und ein bisschen altmodisch. Wer dich kennenlernt, entdeckt überraschend viele süße Seiten." },
    TFGH: { id: "laugenbrezel", title: "Das Biergarten-Talent",
      text: "Du bist gesellig, unkompliziert und hast eine gewisse Würze. Man erkennt dich sofort – und mag dich auf Anhieb." },
    TFGS: { id: "hefezopf", title: "Der Sonntagsliebling",
      text: "Du stehst für entspannte Frühstücke und gemeinsame Zeit. Liebevoll, weich im Kern und ein Garant für gute Laune." },
    TFRH: { id: "baguette", title: "Die klassische Eleganz",
      text: "Du hast Stil, ohne dich zu verbiegen. Außen knackig, innen luftig – und du weißt genau, was du willst." },
    TFRS: { id: "brioche", title: "Die feine Seele",
      text: "Zart, kultiviert und mit einem Hang zum Genuss. Du schätzt die schönen Dinge und musst dafür nicht im Rampenlicht stehen." },
    AKGH: { id: "injera", title: "Das Gemeinschaftswunder",
      text: "Bei dir wird geteilt: Essen, Geschichten, Erlebnisse. Du bist neugierig auf die Welt, hast Charakter und bringst Menschen an einen Tisch." },
    AKGS: { id: "rosca-de-reyes", title: "Die Überraschung in Person",
      text: "Mit dir wird jedes Treffen zum Fest – und irgendwo steckt immer eine Überraschung. Du liebst Traditionen aus aller Welt und teilst sie gern." },
    AKRH: { id: "borodinsky", title: "Der geheimnisvolle Charakterkopf",
      text: "Dunkel, würzig, ein wenig rätselhaft. Du gehst eigene Wege und hast einen Geschmack, der nicht jedem gefällt – aber alle beeindruckt." },
    AKRS: { id: "bara-brith", title: "Der gemütliche Weltenbummler",
      text: "Du reist gern gedanklich um die Welt, am liebsten mit einer Tasse Tee in der Hand. Beständig, warmherzig und voller kleiner Überraschungen." },
    AFGH: { id: "naan", title: "Das Allroundtalent",
      text: "Du passt zu fast allem und jedem, bist offen, warm und unkompliziert. Wo du auftauchst, wird es gemütlich – und ein bisschen würzig." },
    AFGS: { id: "melonpan", title: "Der verspielte Sonnenschein",
      text: "Verspielt, fröhlich und immer für eine Überraschung gut. Du nimmst das Leben leicht und steckst andere mit deiner Freude an." },
    AFRH: { id: "lavash", title: "Der minimalistische Freigeist",
      text: "Du brauchst nicht viel, um glücklich zu sein. Unabhängig, anpassungsfähig und mit einer Geschichte, die tiefer geht, als man denkt." },
    AFRS: { id: "shokupan", title: "Die sanfte Wolke",
      text: "Weich, ruhig und mit feinem Gespür für Details. Du wirkst zurückhaltend, doch wer dich kennt, schätzt deine Sanftheit sehr." }
  };

  const root = document.getElementById("quiz-app");
  if (!root) return;

  const $ = (sel) => root.querySelector(sel);
  const views = {
    start: $('[data-view="start"]'),
    play: $('[data-view="play"]'),
    result: $('[data-view="result"]')
  };
  const els = {
    counter: $("#quiz-counter"),
    bar: $("#quiz-bar"),
    question: $("#quiz-question"),
    answers: $("#quiz-answers"),
    back: $("#quiz-back"),
    resName: $("#result-name"),
    resTitle: $("#result-title"),
    resText: $("#result-text"),
    resAxes: $("#result-axes"),
    share: $("#quiz-share"),
    shareNote: $("#quiz-share-note")
  };

  const { BREADS } = window.GOBROT_DATA;
  const breadById = new Map(BREADS.map((b) => [b.id, b]));

  let step = 0;
  let answers = [];
  let lastResult = null;

  const show = (name) => {
    Object.entries(views).forEach(([key, el]) => { el.hidden = key !== name; });
  };

  const renderQuestion = () => {
    const item = QUESTIONS[step];
    els.counter.textContent = `Frage ${step + 1} von ${QUESTIONS.length}`;
    els.bar.style.width = `${(step / QUESTIONS.length) * 100}%`;
    els.question.textContent = item.q;
    els.answers.innerHTML = "";
    item.a.forEach(([label], i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz__answer";
      btn.textContent = label;
      if (answers[step] === i) btn.setAttribute("aria-pressed", "true");
      btn.addEventListener("click", () => choose(i));
      li.appendChild(btn);
      els.answers.appendChild(li);
    });
    els.back.disabled = step === 0;
    els.question.focus({ preventScroll: true });
  };

  const choose = (i) => {
    answers[step] = i;
    if (step < QUESTIONS.length - 1) {
      step += 1;
      renderQuestion();
    } else {
      els.bar.style.width = "100%";
      renderResult();
    }
  };

  const evaluate = () => {
    const sums = { t: 0, k: 0, g: 0, h: 0 };
    const max = { t: 0, k: 0, g: 0, h: 0 };
    QUESTIONS.forEach((item, idx) => {
      sums[item.axis] += item.a[answers[idx]][1];
      max[item.axis] += Math.max(...item.a.map(([, v]) => Math.abs(v)));
    });
    const key = ["t", "k", "g", "h"]
      .map((ax) => (sums[ax] >= 0 ? AXES[ax].pos : AXES[ax].neg))
      .join("");
    return { key, sums, max };
  };

  const renderResult = () => {
    const { key, sums, max } = evaluate();
    const res = RESULTS[key];
    const bread = breadById.get(res.id);
    lastResult = { res, bread };

    els.resName.textContent = bread.name;
    els.resName.parentElement.style.setProperty("--chars", bread.name.length);
    els.resTitle.textContent = res.title;
    els.resText.textContent = res.text;

    els.resAxes.innerHTML = "";
    Object.entries(AXES).forEach(([ax, meta]) => {
      const pct = Math.round(((sums[ax] + max[ax]) / (2 * max[ax])) * 100);
      const row = document.createElement("div");
      row.className = "axis";
      row.innerHTML = `
        <span class="axis__label axis__label--plus">${meta.plus}</span>
        <span class="axis__track" role="img" aria-label="${pct} % ${meta.plus}, ${100 - pct} % ${meta.minus}">
          <span class="axis__fill" style="width:${pct}%"></span>
        </span>
        <span class="axis__label axis__label--minus">${meta.minus}</span>`;
      els.resAxes.appendChild(row);
    });

    els.shareNote.textContent = "";
    show("result");
    views.result.querySelector("h3").focus({ preventScroll: true });
    root.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  const start = () => {
    step = 0;
    answers = [];
    show("play");
    renderQuestion();
  };

  root.querySelectorAll("[data-quiz-start]").forEach((btn) => btn.addEventListener("click", start));

  els.back.addEventListener("click", () => {
    if (step > 0) {
      step -= 1;
      renderQuestion();
    }
  });

  $("#quiz-open-bread").addEventListener("click", () => {
    if (lastResult && window.GoBrot) window.GoBrot.openBread(lastResult.bread.id);
  });

  els.share.addEventListener("click", async () => {
    if (!lastResult) return;
    const text = `Ich bin ${lastResult.bread.name} – ${lastResult.res.title}! Welches Brot bist du?`;
    const url = `${location.origin}${location.pathname}#quiz`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Welches Brot bin ich?", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        els.shareNote.textContent = "Ergebnis in die Zwischenablage kopiert.";
      }
    } catch (err) {
      if (err && err.name !== "AbortError") {
        els.shareNote.textContent = "Teilen nicht möglich. Kopiere einfach den Link aus der Adresszeile.";
      }
    }
  });
})();
