/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'ma-ristorante-cinese',
    /* nessun WhatsApp: solo il fisso della scheda Google */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (2/10/2026): lunedì e da mercoledì a domenica 12–15 e 19–23, martedì chiuso */
    hours: {
      0: [['12:00', '15:00'], ['19:00', '23:00']], 1: [['12:00', '15:00'], ['19:00', '23:00']],
      2: [],
      3: [['12:00', '15:00'], ['19:00', '23:00']], 4: [['12:00', '15:00'], ['19:00', '23:00']], 5: [['12:00', '15:00'], ['19:00', '23:00']],
      6: [['12:00', '15:00'], ['19:00', '23:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "MA Ristorante: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.scodella": "The fire bowl",
      "n.carta": "The menu",
      "n.sala": "The dining room",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Chinese restaurant · Via Lomellina 26 · Milan",
      "h.loro": "«Welcome to MA Ristorante»",
      "h.cit": "«[…] in a welcoming, refined, elegant and romantic setting, you can taste typical and unique dishes of oriental cuisine.»",
      "h.citf": "— from our old website",
      "h.testo": "Steamed dim sum, the fire bowls, fish, duck. Lunch and dinner, takeaway too; on Tuesday we rest.",
      "h.voto": "on Google, 441 reviews",
      "s.etichetta": "The dish everyone mentions",
      "s.titolo": "The fire bowl",
      "s.intro": "A two-handled steel wok that comes to the table on its own little burner, on a wooden frame. On our menu there are five: with squid, with prawns, with chicken wings, with cauliflower, with savoy cabbage and prawns.",
      "s.citf": "Francesca B., on Google",
      "p.titolo": "The fire bowl",
      "p.desc": "The fire bowl, drawn: the two-handled steel wok on the wooden frame, the flame lit underneath, and inside bean sprouts, leek, yellow peppers, chillies and, as you choose, squid, prawns or cauliflower; steam rises above it.",
      "p.d0": "The fire bowl with squid, drawn.",
      "p.d1": "The fire bowl with prawns, drawn.",
      "p.d2": "The fire bowl with cauliflower, drawn.",
      "p.modi": "With what",
      "p.b0": "Squid",
      "p.b1": "Prawns",
      "p.b2": "Cauliflower",
      "c.etichetta": "The menu",
      "c.titolo": "The way we write it",
      "c.intro": "The chapters of our menu, with the dishes named the way we write them, in Italian. You find the prices in the restaurant.",
      "c.m1": "Dim sum",
      "c.m2": "Steamed",
      "c.m3": "Soups",
      "c.m4": "Rice and noodles",
      "c.m5": "Fish",
      "c.m6": "Fire bowls",
      "c.m7": "Chicken and duck",
      "c.m8": "Other mains",
      "c.m9": "Vegetables and tofu",
      "a.gamberi": "Lemon prawns with pieces of pineapple on a white plate.",
      "c.fgamberi": "Lemon prawns (photo by a client)",
      "a.anatra": "Peking duck from above: the thin pancakes, the lacquered duck sliced on lettuce, the julienned vegetables and the dark sauce.",
      "c.fanatra": "Peking duck (photo by a client)",
      "a.bambu": "Bamboo shoots and mushrooms in a dark sauce on a white plate, with a purple orchid; behind, the golden damask of the dining room.",
      "c.fbambu": "With bamboo shoots and mushrooms (photo by a client)",
      "a.pollo": "Sweet and sour chicken: fried pieces in red sauce with chunks of tomato, in a deep white plate.",
      "c.fpollo": "Sweet and sour chicken (photo by a client)",
      "c.nota": "From our paper menu and our Just Eat menu (October 2026); the dishes are named in Italian, the way we write them.",
      "c.surgelati": "«Some products may be frozen at source: please ask the staff to confirm.»",
      "l.etichetta": "The dining room",
      "l.titolo": "Homely and comfortable",
      "l.loro": "«The setting is homely and comfortable, designed to put every guest at ease.»",
      "l.lorof": "from our old website",
      "a.salasera": "The dining room in the evening: the golden damask walls, the windows with string curtains, the crystal chandelier, the yellow tablecloths and a red rose on every table.",
      "l.fsera": "The dining room in the evening",
      "a.coperto": "The place setting for two from above: square plates, yellow napkins folded into roses, wine glasses, steel chopsticks on their rest, the yellow tablecloth.",
      "l.fcoperto": "The place setting, with steel chopsticks",
      "a.salagiorno": "The dining room by day: the chandelier, the large mirror, the yellow tablecloths, the dark chairs, the red plants on the counter.",
      "l.fgiorno": "The dining room by day",
      "a.insegna": "The sign lit up at night: the orange lightbox with the monogram and the words MA RISTORANTE; below, the window with string curtains and the chandelier.",
      "l.finsegna": "Our sign, at night",
      "l.nota": "The photos of the dining room come from our old website and our Instagram, from 2018.",
      "d.etichetta": "Reviews",
      "d.titolo": "Not your usual Chinese restaurant",
      "d.voto": "on Google, 441 reviews",
      "d.t25": "Google, 2025",
      "d.t23": "Google, 2023",
      "d.t21": "Google, 2021",
      "d.t18": "Google, 2018",
      "d.nota": "From the reviews on Google, in Italian, as they were written; […] where we shortened them. The line about the fire bowls, higher up, is by Francesca B., also on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "At Via Lomellina 26",
      "o.cap": "Opening hours",
      "o.chiuso": "closed",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.nota": "Hours from our Google listing (October 2026). We post our holidays there, in our updates.",
      "w.dove": "Where",
      "w.dovev": "Via Lomellina 26, 20133 Milan (Corsica area)",
      "w.filobus": "Trolleybus",
      "w.filobusv": "the 93, stop Via Lomellina – Via Sismondi",
      "w.tram": "Tram and bus",
      "w.tramv": "trams 12 and 27 and buses 45 and 175 on Viale Corsica, a few steps away",
      "w.metro": "Underground",
      "w.metrov": "M4 Argonne or Stazione Forlanini, about 500 metres away",
      "w.tel": "Phone",
      "w.asporto": "Takeaway",
      "w.asportov": "delivery too, on",
      "w.mappa": "Map: MA Ristorante Cinese, Via Lomellina 26, Milan",
      "q.etichetta": "Questions",
      "q.titolo": "Before you come",
      "q.d1": "Do I need to book?",
      "q.r1": "It is a good idea, especially in the evening: call 02 7000 9616.",
      "q.d2": "Are you open on Tuesday?",
      "q.r2": "No: Tuesday is our closing day. On the other days we are open for lunch, from 12 to 3 pm, and for dinner, from 7 to 11 pm.",
      "q.d3": "Can I order takeaway?",
      "q.r3": "Yes, and delivery too: you find us on Just Eat as «Ma Ristorante».",
      "q.d4": "Are there dishes without meat or fish?",
      "q.r4": "Yes: tofu with vegetables, fried vegetables, mixed stir-fried vegetables, vegetable dumplings, edamame, wakame. For the ingredients of each dish, ask in the restaurant.",
      "q.d5": "How do I get there?",
      "q.r5": "By trolleybus 93 (stop Via Lomellina – Via Sismondi), by trams 12 and 27 and buses 45 and 175 on Viale Corsica, a few steps away; the M4 underground at Argonne or Stazione Forlanini, about 500 metres away.",
      "f2.piva": "VAT no.",
      "f2.orario": "Lunch 12–15 · dinner 19–23 · closed on Tuesday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours, rating and reviews from the Google listing (October 2026); the dishes from their menu and Just Eat; the photos of the dining room from their old website and their Instagram, those of the dishes by clients on Google. We redrew the monogram and the fire bowl ourselves.",
      "f2.su": "Back to the top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ MA RISTORANTE CINESE — Via Lomellina 26 ══════════
     la FIRMA — «la scodella di fuoco», il loro piatto più nominato: la wok d'acciaio a due manici sul telaio di legno; si accende
     la fiamma, dall'alto cadono gli ingredienti uno dopo l'altro, un salto in padella, sale il vapore. Lo stato è M (Calamari /
     Gamberi / Cavolfiore), T (0…1) e V (0 al suo posto; fino a 1 il contenuto scende e si spegne; da −1 a 0 arriva dall'alto il
     prossimo, vuoto). Senza JS e alla fine: Calamari, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la scodella vuota, la
     fiamma spenta. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un
     gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,480],"via":40,"caduta":160,"salto":26,"fuocoC":[280,352],"modi":[{"nome":"Calamari","fuoco":[0,0.1],"pezzi":[{"f":[0.1,0.12]},{"f":[0.113,0.12]},{"f":[0.126,0.12]},{"f":[0.138,0.12]},{"f":[0.151,0.12]},{"f":[0.164,0.12]},{"f":[0.177,0.12]},{"f":[0.19,0.12]},{"f":[0.203,0.12]},{"f":[0.215,0.12]},{"f":[0.228,0.12]},{"f":[0.241,0.12]},{"f":[0.254,0.12]},{"f":[0.267,0.12]},{"f":[0.279,0.12]},{"f":[0.292,0.12]},{"f":[0.305,0.12]},{"f":[0.318,0.12]},{"f":[0.331,0.12]},{"f":[0.344,0.12]},{"f":[0.356,0.12]},{"f":[0.369,0.12]},{"f":[0.382,0.12]},{"f":[0.395,0.12]},{"f":[0.408,0.12]},{"f":[0.421,0.12]},{"f":[0.433,0.12]},{"f":[0.446,0.12]},{"f":[0.459,0.12]},{"f":[0.472,0.12]},{"f":[0.485,0.12]},{"f":[0.497,0.12]},{"f":[0.51,0.12]},{"f":[0.523,0.12]},{"f":[0.536,0.12]},{"f":[0.549,0.12]},{"f":[0.562,0.12]},{"f":[0.574,0.12]},{"f":[0.587,0.12]},{"f":[0.6,0.12]}],"salto":[0.72,0.12],"vapori":[{"f":[0.8,0.16],"l":142.7},{"f":[0.83,0.15],"l":142.7},{"f":[0.86,0.14],"l":142.7}]},{"nome":"Gamberi","fuoco":[0,0.1],"pezzi":[{"f":[0.1,0.12]},{"f":[0.113,0.12]},{"f":[0.126,0.12]},{"f":[0.138,0.12]},{"f":[0.151,0.12]},{"f":[0.164,0.12]},{"f":[0.177,0.12]},{"f":[0.19,0.12]},{"f":[0.203,0.12]},{"f":[0.215,0.12]},{"f":[0.228,0.12]},{"f":[0.241,0.12]},{"f":[0.254,0.12]},{"f":[0.267,0.12]},{"f":[0.279,0.12]},{"f":[0.292,0.12]},{"f":[0.305,0.12]},{"f":[0.318,0.12]},{"f":[0.331,0.12]},{"f":[0.344,0.12]},{"f":[0.356,0.12]},{"f":[0.369,0.12]},{"f":[0.382,0.12]},{"f":[0.395,0.12]},{"f":[0.408,0.12]},{"f":[0.421,0.12]},{"f":[0.433,0.12]},{"f":[0.446,0.12]},{"f":[0.459,0.12]},{"f":[0.472,0.12]},{"f":[0.485,0.12]},{"f":[0.497,0.12]},{"f":[0.51,0.12]},{"f":[0.523,0.12]},{"f":[0.536,0.12]},{"f":[0.549,0.12]},{"f":[0.562,0.12]},{"f":[0.574,0.12]},{"f":[0.587,0.12]},{"f":[0.6,0.12]}],"salto":[0.72,0.12],"vapori":[{"f":[0.8,0.16],"l":142.7},{"f":[0.83,0.15],"l":142.7},{"f":[0.86,0.14],"l":142.7}]},{"nome":"Cavolfiore","fuoco":[0,0.1],"pezzi":[{"f":[0.1,0.12]},{"f":[0.113,0.12]},{"f":[0.126,0.12]},{"f":[0.138,0.12]},{"f":[0.151,0.12]},{"f":[0.164,0.12]},{"f":[0.177,0.12]},{"f":[0.19,0.12]},{"f":[0.203,0.12]},{"f":[0.215,0.12]},{"f":[0.228,0.12]},{"f":[0.241,0.12]},{"f":[0.254,0.12]},{"f":[0.267,0.12]},{"f":[0.279,0.12]},{"f":[0.292,0.12]},{"f":[0.305,0.12]},{"f":[0.318,0.12]},{"f":[0.331,0.12]},{"f":[0.344,0.12]},{"f":[0.356,0.12]},{"f":[0.369,0.12]},{"f":[0.382,0.12]},{"f":[0.395,0.12]},{"f":[0.408,0.12]},{"f":[0.421,0.12]},{"f":[0.433,0.12]},{"f":[0.446,0.12]},{"f":[0.459,0.12]},{"f":[0.472,0.12]},{"f":[0.485,0.12]},{"f":[0.497,0.12]},{"f":[0.51,0.12]},{"f":[0.523,0.12]},{"f":[0.536,0.12]},{"f":[0.549,0.12]},{"f":[0.562,0.12]},{"f":[0.574,0.12]},{"f":[0.587,0.12]},{"f":[0.6,0.12]}],"salto":[0.72,0.12],"vapori":[{"f":[0.8,0.16],"l":142.7},{"f":[0.83,0.15],"l":142.7},{"f":[0.86,0.14],"l":142.7}]}],"tempi":{"inizio":300,"scodella":4600,"servi":420,"arriva":480,"scodellaV":3800}};
  /* la scodella di fuoco a (M, T, V) — una sola fonte: la usano _ma_firma.mjs (l'HTML allo stato finale), main.js (via ma_main.cjs)
     e la prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     La wok d'acciaio a due manici sul telaio di legno: si accende la fiamma sotto, dall'alto cadono dentro gli ingredienti uno
     dopo l'altro (i germogli, poi il pesce o il cavolfiore, poi il porro e i peperoni, per ultimi i peperoncini), un salto in
     padella, sale il vapore. Col V il contenuto scende e si spegne; quello della prossima scelta arriva dall'alto, ancora vuoto. */
  function creaScodella(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r2 = function (n) { return Math.round(n * 100) / 100; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var tutti = function (cl, m, n) { var a = []; for (var k = 0; k < n; k++) a.push(q('.' + cl + '[data-m="' + m + '"][data-k="' + k + '"]')); return a; };
    var pezzi = D.modi.map(function (M, m) {
      return { fuoco: q('.sc-fuoco[data-m="' + m + '"]'), salto: q('.sc-salto[data-m="' + m + '"]'), p: tutti('sc-p', m, M.pezzi.length), v: tutti('sc-v', m, M.vapori.length) };
    });
    function disegna(m, t, v) {
      var P = pezzi[m], M = D.modi[m], k, u;
      /* la fiamma si accende e cresce dal fornellino */
      var s = dolce(fase(t, M.fuoco));
      P.fuoco.setAttribute('transform', 'translate(' + D.fuocoC[0] + ' ' + D.fuocoC[1] + ') scale(' + r2(0.3 + 0.7 * s) + ')');
      P.fuoco.setAttribute('opacity', r3(s));
      /* gli ingredienti cadono dall'alto al loro posto, uno dopo l'altro */
      for (k = 0; k < P.p.length; k++) {
        u = fase(t, M.pezzi[k].f);
        P.p[k].setAttribute('transform', 'translate(0 ' + r1(-D.caduta * (1 - dolce(u))) + ')');
        P.p[k].setAttribute('opacity', r3(dolce(c01(u / 0.25))));
      }
      /* un salto in padella */
      P.salto.setAttribute('transform', 'translate(0 ' + r1(-D.salto * Math.sin(Math.PI * fase(t, M.salto))) + ')');
      /* il vapore sale dalla scodella */
      for (k = 0; k < P.v.length; k++) P.v[k].setAttribute('stroke-dashoffset', r1(M.vapori[k].l * (1 - dolce(fase(t, M.vapori[k].f)))));
      /* col V il contenuto scende e si spegne; il prossimo arriva dall'alto */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P) { return P.fuoco && P.salto && P.p.every(Boolean) && P.v.every(Boolean); });
    return { disegna: disegna, pezzi: pezzi, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('scodella-firma'), svgF = prendi('scodellaSvg'), leggiF = prendi('scodellaLeggi');
  var SCODELLA = svgF ? creaScodella(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.scodella__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.scodella__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    SCODELLA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) SCODELLA.disegna(k, 1, 0); });
    SCODELLA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la scodella vuota */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la scodella vuota */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.scodella, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.scodella });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la scena scende e si spegne, arriva dall'alto la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.scodellaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && SCODELLA && SCODELLA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaScodella); } catch (e) {}
    window.__scodella = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__scodella.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la scodella vuota */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__scodella.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
