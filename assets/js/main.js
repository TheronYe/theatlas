/* THE ATLAS 擎海 — shared header/footer/i18n renderer + koi video hero + floating contact */
(function () {
  "use strict";

  var LANG_KEY = "atlas-lang";
  var LANGS = ["zh-hk", "zh-cn", "en"];

  /* ---- shared contact config (single source) ---- */
  var HOTLINE = "85253392749";
  var WHATSAPP_URL = "https://wa.me/85253392749?&text=NA%E6%82%A8%E5%A5%BD%EF%BC%8C%E6%88%91%E6%83%B3%E7%99%BB%E8%A8%98%20The%20Sterling%20%E7%A4%BA%E7%AF%84%E5%96%AE%E4%BD%8D%E9%A0%90%E7%B4%84%E3%80%82%20%E3%80%90%E4%BE%86%E6%BA%90%EF%BC%9AThe%20Sterling%20%E5%AE%98%E7%B6%B2%E3%80%91";

  function getLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "").toLowerCase();
    if (nav.indexOf("en") === 0) return "en";
    if (nav.indexOf("cn") !== -1 || nav.indexOf("hans") !== -1 || nav === "zh") return "zh-cn";
    return "zh-hk";
  }
  function setLang(l) { try { localStorage.setItem(LANG_KEY, l); } catch (e) {} }

  var lang = getLang();
  var T = window.I18N[lang];
  /* 页面附注（仅 the-atlas / location 页加载了 i18n-notes.js） */
  if (window.I18N_NOTES && window.I18N_NOTES[lang]) {
    T.notes = window.I18N_NOTES[lang];
  }
  document.documentElement.lang = T.htmlLang;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- header ---- */
  var page = document.body.getAttribute("data-page") || "home";
  var navItems = [
    ["sales", "sales-info.html"],
    ["location", "location.html"],
    ["atlas", "the-atlas.html"],
    ["media", "media.html"]
  ];

  function langButtons() {
    return LANGS.map(function (l) {
      return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === lang) + '">' +
        esc(window.I18N[l].langName) + "</button>";
    }).join("");
  }

  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<a class="brand" href="index.html" aria-label="THE ATLAS 擎海">' +
      '<img class="logo-white" src="assets/branding/logo_white.svg" alt="THE ATLAS 擎海">' +
      '<img class="logo-color" src="assets/branding/logo_color.svg" alt="" aria-hidden="true">' +
    "</a>" +
    '<div style="display:flex;align-items:center;gap:10px">' +
      '<div class="hdr-lang">' + langButtons() + "</div>" +
      '<button class="nav-toggle" type="button" aria-label="Menu">☰</button>' +
    "</div>" +
    '<nav class="site-nav" id="siteNav" aria-label="Main">' +
      '<button class="nav-close" type="button" aria-label="Close">✕</button>' +
      navItems.map(function (n) {
        var cur = n[0] === page ? ' aria-current="page"' : "";
        return "<a href=\"" + n[1] + "\"" + cur + ">" + esc(T.nav[n[0]]) + "</a>";
      }).join("") +
      '<div class="lang-switch">' + langButtons() + "</div>" +
    "</nav>";
  document.body.prepend(header);

  var nav = header.querySelector("#siteNav");
  header.querySelector(".nav-toggle").addEventListener("click", function () {
    nav.classList.add("open");
  });
  header.querySelector(".nav-close").addEventListener("click", function () {
    nav.classList.remove("open");
  });

  header.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-lang]");
    if (!b) return;
    setLang(b.getAttribute("data-lang"));
    location.reload();
  });

  /* header state on scroll */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- footer ---- */
  var F = T.footer;
  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML =
    '<div class="inner">' +
      "<h2>" + esc(F.disclaimerTitle) + "</h2>" +
      "<p>" + esc(F.placeholder) + "</p>" +
      "<p>" + esc(F.general) + "</p>" +
      '<div class="footer-contact">' +
        '<div class="fc-item"><span class="fc-label">' + esc(F.hotlineLabel) + '</span>' +
        '<a class="fc-icon" href="tel:+' + HOTLINE + '" aria-label="' + esc(F.hotlineLabel) + ' ' + HOTLINE + '">' +
          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' +
        "</a></div>" +
      "</div>" +
      '<div class="footer-links">' +
        '<a href="sales-info.html">' + esc(T.nav.sales) + "</a>" +
        '<a href="location.html">' + esc(T.nav.location) + "</a>" +
        '<a href="the-atlas.html">' + esc(T.nav.atlas) + "</a>" +
        '<a href="media.html">' + esc(T.nav.media) + "</a>" +
        '<a href="privacy.html">' + esc(F.privacy) + "</a>" +
        '<a href="#" data-legal-open>' + esc(T.legal.title) + "</a>" +
      "</div>" +
      '<div class="footer-meta"><span>' + esc(F.updated) + "</span><span>" + esc(F.copyright) + "</span></div>" +
    "</div>";
  document.body.appendChild(footer);

  /* ---- floating contact (WhatsApp + phone), fixed bottom-right ---- */
  var floatWrap = document.createElement("div");
  floatWrap.className = "float-contact";
  floatWrap.innerHTML =
    '<a class="float-whatsapp" href="' + WHATSAPP_URL + '" target="_blank" rel="noopener" aria-label="WhatsApp">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.03c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.24-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.24-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>' +
    "</a>" +
    '<a class="float-tel" href="tel:+' + HOTLINE + '" aria-label="Call">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' +
    "</a>";
  document.body.appendChild(floatWrap);

  /* ---- legal modal（法律文字弹窗，内容按目标网站 / 客户提供文本） ---- */
  var legal = T.legal;
  var modal = document.createElement("div");
  modal.className = "legal-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", legal.title);
  modal.innerHTML =
    '<div class="legal-modal__panel">' +
      '<div class="legal-modal__head">' +
        "<h2>" + esc(legal.title) + "</h2>" +
        '<button class="legal-modal__close" type="button" data-legal-close aria-label="' +
          esc(legal.close) + '">✕</button>' +
      "</div>" +
      '<div class="legal-modal__body">' +
        legal.paragraphs.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
      "</div>" +
    "</div>";
  document.body.appendChild(modal);

  var legalTimer = null;
  function openLegal() {
    modal.classList.add("open");
    modal.classList.remove("leaving");
    document.body.style.overflow = "hidden";
    /* 强制一帧后再加 in，确保入场过渡每次都播放 */
    setTimeout(function () { modal.classList.add("in"); }, 20);
  }
  function closeLegal() {
    if (legalTimer) return;
    if (motionOK) {
      modal.classList.remove("in");
      modal.classList.add("leaving");
      legalTimer = setTimeout(function () {
        legalTimer = null;
        modal.classList.remove("open", "leaving");
        document.body.style.overflow = "";
      }, 320);
    } else {
      modal.classList.remove("in");
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-legal-open]")) { e.preventDefault(); openLegal(); return; }
    if (e.target.closest("[data-legal-close]") || e.target === modal) { closeLegal(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closeLegal();
  });

  /* ---- splash gate：进入网站前先显示法律声明（对齐官网做法） ---- */
  var GATE_KEY = "atlas-legal-accepted";
  var gate = document.createElement("div");
  gate.className = "splash-gate";
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  gate.setAttribute("aria-label", legal.title);
  gate.innerHTML =
    '<div class="splash-gate__bg" aria-hidden="true"></div>' +
    '<div class="splash-gate__panel">' +
      '<img class="splash-gate__logo" src="assets/branding/logo_hero.svg" alt="THE ATLAS 擎海">' +
      "<h2>" + esc(legal.title) + "</h2>" +
      '<div class="splash-gate__scroll" tabindex="0">' +
        legal.paragraphs.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
      "</div>" +
      '<div class="splash-gate__actions">' +
        '<button type="button" class="splash-gate__enter" data-gate-enter>' +
          '<span class="splash-gate__enter-label">' + esc(T.gate.enter) + "</span>" +
        "</button>" +
      "</div>" +
    "</div>";
  document.body.appendChild(gate);

  var gateHidden = gate.classList.contains("hidden");

  function closeGate() {
    if (gateHidden) return;
    gateHidden = true;
    try { sessionStorage.setItem(GATE_KEY, "1"); } catch (e) {}
    document.body.classList.remove("gate-open");
    document.body.style.overflow = "";
    if (motionOK) {
      /* 优雅退出：淡出 + 轻微放大，随后移除节点 */
      gate.classList.add("leaving");
      setTimeout(function () {
        gate.classList.add("hidden");
      }, 650);
    } else {
      gate.classList.add("hidden");
    }
    /* 首屏可见时才开始播放 koi（只播一次） */
    var koiEl = document.querySelector(".hero-koi");
    if (koiEl && motionOK) {
      var pr = koiEl.play();
      if (pr && typeof pr.catch === "function") pr.catch(function () {});
    }
  }
  gate.addEventListener("click", function (e) {
    if (e.target.closest("[data-gate-enter]")) closeGate();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !gate.classList.contains("hidden")) closeGate();
  });

  var accepted = null;
  try { accepted = sessionStorage.getItem(GATE_KEY); } catch (e) {}
  if (accepted === "1") {
    gate.classList.add("hidden");
  } else {
    document.body.classList.add("gate-open");
    document.body.style.overflow = "hidden";
    /* 延迟一帧再加入场类，确保淡入 + 面板浮起的过渡在首帧后播放 */
    setTimeout(function () { gate.classList.add("in"); }, 60);
  }

  /* lists: <ul data-i18n-list="atlas.facts" data-tpl="th-td"> etc. */
  function dig(obj, path) {
    return path.split(".").reduce(function (o, k) { return o && o[k]; }, obj);
  }
  document.querySelectorAll("[data-i18n-list]").forEach(function (el) {
    var v = dig(T, el.getAttribute("data-i18n-list"));
    if (!Array.isArray(v)) return;
    var tpl = el.getAttribute("data-tpl") || "pair";
    el.innerHTML = v.map(function (row, idx) {
      var delay = ' style="transition-delay:' + Math.min(idx * 80, 560) + 'ms"';
      if (tpl === "facts") {
        return '<tr class="fade-up"' + delay + '><th scope="row">' + esc(row[0]) + "</th><td>" + esc(row[1]) + "</td></tr>";
      }
      if (tpl === "doc") {
        if (row[2]) {
          return '<li class="doc fade-up"' + delay + '><span class="dn">' + esc(row[0]) +
            '</span><a class="badge badge-link" href="' + esc(row[2]) + '" target="_blank" rel="noopener">' +
            esc(T.sales.statusPdf) + " ↗</a></li>";
        }
        return '<li class="doc fade-up"' + delay + '><span class="dn">' + esc(row[0]) +
          '</span><span class="badge">' + esc(T.sales.statusPending) + "</span></li>";
      }
      if (tpl === "photo") {
        return '<img class="photo fade-up"' + delay + ' src="' + esc(row[0]) + '" alt="' + esc(row[1]) +
          '" loading="lazy">';
      }
      if (tpl === "card") {
        return '<article class="card fade-up"' + delay + '><h3 class="ct">' + esc(row[0]) +
          '</h3><p class="cd">' + esc(row[1]) + "</p></article>";
      }
      if (tpl === "facility") {
        return '<figure class="facility fade-up"' + delay + '>' +
          '<img src="' + esc(row[0]) + '" alt="' + esc(row[1]) + '" loading="lazy">' +
          "<figcaption>" + esc(row[1]) + "</figcaption></figure>";
      }
      if (tpl === "photocap") {
        return '<figure class="photo-card fade-up"' + delay + '>' +
          '<img src="' + esc(row[0]) + '" alt="' + esc(row[1]) + '" loading="lazy">' +
          "<figcaption>" + esc(row[1]) + "</figcaption></figure>";
      }
      if (tpl === "stat") {
        return '<div class="stat fade-up"' + delay + '>' +
          '<span class="stat-num" data-count="' + esc(row[0]) + '">0</span>' +
          '<span class="stat-unit">' + esc(row[1]) + "</span>" +
          '<span class="stat-label">' + esc(row[2]) + "</span></div>";
      }
      if (tpl === "brand") {
        return '<div class="brand fade-up"' + delay + '>' +
          '<img src="' + esc(row[0]) + '" alt="' + esc(row[1]) + '" loading="lazy">' +
          '<span class="brand-label">' + esc(row[1]) + "</span></div>";
      }
      return "<li><strong>" + esc(row[0]) + "</strong><br><span>" + esc(row[1]) + "</span></li>";
    }).join("");
  });

  /* ---- render data-i18n page content ---- */
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var v = dig(T, el.getAttribute("data-i18n"));
    if (typeof v === "string") el.textContent = v;
  });

  var motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  /* ---- reveal animations：循环播放 —— 元素离开视口时移除状态，重新进入时再次播放 ----
     采用滚动位置判定（rAF 节流），不依赖 IntersectionObserver 的投递时序，行为确定。 */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".fade-up"));
    if (!els.length) return;

    if (!motionOK) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var ticking = false;
    var lastRun = 0;
    function update() {
      ticking = false;
      lastRun = Date.now();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      /* gate 打开时不上 'in'：让 hero 元素在「進入」后按错落延迟依次浮现 */
      var gateOpen = document.body.classList.contains("gate-open");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var r = el.getBoundingClientRect();
        /* 元素进入视口中部区域即播放；完全离开后复位以便重播 */
        var visible = r.top < vh * 0.92 && r.bottom > vh * 0.06;
        if (visible && !gateOpen) {
          if (!el.classList.contains("in")) el.classList.add("in");
        } else if (el.classList.contains("in")) {
          el.classList.remove("in");
        }
      }
    }
    /* 时间节流：不依赖 requestAnimationFrame（后台标签页/无合成环境下 rAF 可能不触发） */
    function request() {
      var now = Date.now();
      if (ticking && now - lastRun < 120) return;
      ticking = true;
      update();
    }

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    /* 页面重新显示（含 bfcache 返回）时重算 */
    window.addEventListener("pageshow", request);
    document.addEventListener("visibilitychange", request);
    /* 兜底：程序化滚动、内容高度变化、或事件被节流时仍能正确播放/复位 */
    setInterval(request, 400);
    update();
    request();
  }
  initReveal();

  /* ---- 环境照片墙（首页）：自动循环播放 + 手动切换（‹ › / 圆点） ---- */
  function initCarousel() {
    var root = document.getElementById("envCarousel");
    if (!root) return;
    var photos = (T.media && Array.isArray(T.media.envPhotos)) ? T.media.envPhotos : [];
    if (!photos.length) return;

    var track = root.querySelector(".carousel-track");
    var dotsBox = root.querySelector(".carousel-dots");
    var prevBtn = root.querySelector(".carousel-btn.prev");
    var nextBtn = root.querySelector(".carousel-btn.next");
    if (!track || !dotsBox) return;

    track.innerHTML = photos.map(function (ph) {
      return '<figure class="carousel-slide">' +
        '<img src="' + esc(ph[0]) + '" alt="' + esc(ph[1]) + '" loading="lazy">' +
        "<figcaption>" + esc(ph[1]) + "</figcaption>" +
        "</figure>";
    }).join("");
    dotsBox.innerHTML = photos.map(function (_, i) {
      return '<button type="button" data-dot="' + i + '" aria-pressed="' + (i === 0) +
        '" aria-label="' + (i + 1) + '"></button>';
    }).join("");

    var idx = 0;
    var N = photos.length;
    var timer = null;
    var paused = false;
    var PAUSE_MS = 4800;

    function go(n, user) {
      idx = (n % N + N) % N;
      track.style.transform = "translateX(" + (-idx * 100) + "%)";
      dotsBox.querySelectorAll("button[data-dot]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(+b.getAttribute("data-dot") === idx));
      });
      if (user) restart();
    }
    function next() { go(idx + 1, true); }
    function prev() { go(idx - 1, true); }

    function restart() {
      if (timer) { clearInterval(timer); timer = null; }
      if (motionOK && !paused) timer = setInterval(function () { go(idx + 1, false); }, PAUSE_MS);
    }

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    dotsBox.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-dot]");
      if (b) go(+b.getAttribute("data-dot"), true);
    });
    /* 触碰 / 悬停时暂停自动播放，离开后恢复 */
    root.addEventListener("pointerenter", function () { paused = true; restart(); });
    root.addEventListener("pointerleave", function () { paused = false; restart(); });
    root.addEventListener("pointerdown", function () { paused = true; restart(); }, { passive: true });
    document.addEventListener("visibilitychange", function () {
      paused = document.hidden;
      restart();
    });

    go(0, false);
    restart();
  }
  initCarousel();

  /* ---- 页面附注（data-notes-list="atlas" / "location"，来自 i18n-notes.js） ---- */
  document.querySelectorAll("[data-notes-list]").forEach(function (el) {
    var key = el.getAttribute("data-notes-list");
    var list = T.notes && T.notes[key];
    if (!Array.isArray(list)) return;
    el.innerHTML = list.map(function (t) {
      var n = t.match(/^(\d+)\./);
      var body = n ? t.slice(n[0].length) : t;
      return '<li><span class="notes-no">' + (n ? n[1] : "") + '.</span><span>' + esc(body) + "</span></li>";
    }).join("");
  });

  /* ---- 数字滚动动画（stat 计数器）：进入视口时从 0 缓动至目标值 ---- */
  function initCounters() {
    var nums = document.querySelectorAll(".stat-num[data-count]");
    if (!nums.length) return;

    function animate(el) {
      el.setAttribute("data-done", "1");
      var target = +el.getAttribute("data-count");
      if (!isFinite(target)) return;
      if (!motionOK) { el.textContent = String(target); return; }
      var t0 = Date.now(), dur = 1100;
      (function tick() {
        var p = Math.min(1, (Date.now() - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * e));
        if (p < 1) setTimeout(tick, 30);
      })();
    }
    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      nums.forEach(function (el) {
        if (el.getAttribute("data-done")) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > vh * 0.06) animate(el);
      });
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    setInterval(check, 400);
    check();
  }
  initCounters();

  /* ---- hero 向下浏览提示：点击缓动滚动至首个内容区 ----
     不用 scrollIntoView(smooth)/rAF（无合成环境下不推进），用 setTimeout 链缓动。 */
  var cue = document.querySelector(".scroll-cue");
  if (cue) {
    cue.addEventListener("click", function () {
      var heroSection = document.querySelector(".hero");
      var target = heroSection ? heroSection.nextElementSibling : null;
      var top = target
        ? target.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0)
        : (window.innerHeight || 800);
      if (!motionOK) { window.scrollTo(0, top); return; }
      var startY = window.pageYOffset || document.documentElement.scrollTop || 0;
      var dist = top - startY;
      if (Math.abs(dist) < 2) return;
      var t0 = Date.now(), dur = 650;
      (function step() {
        var p = Math.min(1, (Date.now() - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
        window.scrollTo(0, startY + dist * e);
        if (p < 1) setTimeout(step, 16);
      })();
    });
  }

  /* ---- koi hero video：只播放一次，播完停在最后一帧（不循环）；刷新后才会再播 ----
     若 splash gate 正在显示，则等用户点击「進入」后再播（见 closeGate）。 */
  var koi = document.querySelector(".hero-koi");
  if (koi) {
    koi.loop = false;
    if (!motionOK) {
      try { koi.pause(); } catch (e) {}
    } else if (!document.body.classList.contains("gate-open")) {
      var pr = koi.play();
      if (pr && typeof pr.catch === "function") pr.catch(function () {});
    }
  }
})();
