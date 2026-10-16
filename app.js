(function () {
  "use strict";
  var C = window.NURA_CONFIG, D = window.NURA_PRODUCTS, KEY = "nura2-cart-v1", cart = {};
  var WA = "https://wa.me/" + C.whatsappNumber + "?text=";
  var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KIND = { soap: "Soap", oil: "Hair oil", shampoo: "Shampoo" };
  var ICON = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 4C9.4 4 4 9.3 4 15.9c0 2.1.6 4.2 1.6 6L4 28l6.3-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 12-5.3 12-11.9S22.6 4 16 4zm0 21.8c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7.9 1-3.6-.2-.4A9.700 9.700 0 0 1 6.2 16C6.2 10.600 10.600 6.300 16 6.300s9.800 4.300 9.800 9.700-4.400 9.800-9.800 9.800zm5.400-7.300c-.3-.1-1.700-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.100-.2.200-.3.200-.6.100-1.700-.8-2.800-1.500-3.900-3.400-.3-.5.3-.5.9-1.600.1-.2 0-.4 0-.5l-.9-2.100c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1 1-1 2.400s1 2.800 1.200 3c.1.200 2 3.100 4.900 4.300 1.800.8 2.500.8 3.400.7.500-.1 1.700-.7 1.900-1.400.2-.7.200-1.200.2-1.400-.1-.1-.3-.2-.6-.3z"/></svg>';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function find(i) { return D.filter(function (p) { return p.id == i; })[0]; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function money(n) { return C.currency + " " + n.toLocaleString("en-US"); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function to(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" }); }

  try { cart = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (i) { if (!find(i)) delete cart[i]; });
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }

  /* ---------- product reel ---------- */
  var track = $("#track"), reel = $("#collection"), stick = $("#stick"), glow = $("#glow"), rail = $("#rail");
  var html = "", railHtml = "";
  D.forEach(function (x, i) {
    var msg = "Hi Nura, I want to order: " + x.n;
    html += '<article class="panel" data-i="' + i + '"><div class="pimg"><img data-zoom decoding="async" src="' + x.img + '" alt="' + esc(x.n) + '"' + (x.pos ? ' style="object-position:' + x.pos + '"' : "") + '><span class="tg">' + KIND[x.k] + '</span></div>' +
      '<div class="ptx"><div class="pno" aria-hidden="true">' + pad(i + 1) + "</div><h3>" + esc(x.n) + "</h3><p>" + esc(x.d) + "</p>" +
      (x.bot ? '<p class="bot">' + esc(x.bot) + "</p>" : "") + (x.price ? '<p class="pr">' + money(x.price) + "</p>" : "") +
      '<div class="pa"><button class="btn add" type="button" data-id="' + x.id + '">Add</button><a class="btn wab" href="' + WA + encodeURIComponent(msg) + '" target="_blank" rel="noopener" aria-label="Order ' + esc(x.n) + ' on WhatsApp">' + ICON + "<span>WhatsApp</span></a></div></div></article>";
    railHtml += '<button type="button" data-g="' + i + '" aria-label="' + esc(x.n) + '"></button>';
  });
  track.innerHTML = html; rail.innerHTML = railHtml;
  $("#ct").textContent = pad(D.length);
  var panels = $$(".panel", track), dots = $$("button", rail);
  var mode = "h", maxShift = 0, curX = 0, tgtX = 0, active = -1;

  function setActive(i) {
    if (i === active) return; active = i;
    $("#ci").textContent = pad(i + 1);
    dots.forEach(function (d, k) { d.setAttribute("aria-current", k === i ? "true" : "false"); });
    glow.style.backgroundColor = D[i].col || "#444";
  }
  function decide() {
    var h = matchMedia("(min-width:1000px) and (hover:hover)").matches && !REDUCED;
    mode = h ? "h" : "n"; reel.classList.toggle("native", !h); layout();
  }
  function layout() {
    if (mode === "h") {
      track.style.transform = "translate3d(0,0,0)";
      var last = panels[panels.length - 1];
      maxShift = Math.max(0, last.offsetLeft + last.offsetWidth + innerWidth * 0.08 - stick.clientWidth);
      reel.style.height = (maxShift + innerHeight) + "px";
      curX = tgtX = 0; frame();
    } else {
      reel.style.height = ""; track.style.transform = "none"; nativeActive();
    }
  }
  function frame() {
    if (mode !== "h") return;
    var top = reel.getBoundingClientRect().top;
    tgtX = clamp(-top, 0, maxShift);
    curX += (tgtX - curX) * 0.16; if (Math.abs(tgtX - curX) < .3) curX = tgtX;
    track.style.transform = "translate3d(" + (-curX).toFixed(1) + "px,0,0)";
    var mid = stick.clientWidth * 0.5, best = 0, bd = 1e9;
    panels.forEach(function (p, k) { var d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - curX - mid); if (d < bd) { bd = d; best = k; } });
    setActive(best);
  }
  function loop() { frame(); requestAnimationFrame(loop); }
  function nativeActive() {
    var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = 1e9;
    panels.forEach(function (p, k) { var d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = k; } });
    setActive(best);
  }
  track.addEventListener("scroll", function () { if (mode === "n") nativeActive(); }, { passive: true });
  function goTo(i) {
    i = clamp(i, 0, D.length - 1); var p = panels[i];
    if (mode === "h") {
      var t = clamp(p.offsetLeft - (stick.clientWidth - p.offsetWidth) / 2, 0, maxShift);
      window.scrollTo({ top: reel.getBoundingClientRect().top + window.scrollY + t, behavior: REDUCED ? "auto" : "smooth" });
    } else {
      if (reel.getBoundingClientRect().top > 80 || reel.getBoundingClientRect().top < -200) reel.scrollIntoView({ behavior: "smooth" });
      track.scrollTo({ left: p.offsetLeft - (track.clientWidth - p.offsetWidth) / 2, behavior: REDUCED ? "auto" : "smooth" });
    }
  }
  $("#rp").addEventListener("click", function () { goTo(active - 1); });
  $("#rn").addEventListener("click", function () { goTo(active + 1); });
  rail.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) goTo(+b.dataset.g); });
  addEventListener("resize", decide);
  addEventListener("load", layout);
  decide(); loop();

  /* ---------- ingredient index ---------- */
  var ING = [
    { n: "Neem", l: "Azadirachta indica", t: "Traditionally valued for purifying properties. Used for scalp and skin care.", f: [10] },
    { n: "Tulsi", l: "Ocimum tenuiflorum", t: "Holy basil. Soothing and refreshing, helps keep the scalp fresh.", f: [10] },
    { n: "Hibiscus", l: "Hibiscus rosa-sinensis", t: "Rich in natural conditioning. Traditionally used to strengthen hair and add shine.", f: [9, 12] },
    { n: "Aloe Vera", l: "Aloe barbadensis", t: "Hydrating and cooling. Soothes the skin and scalp.", f: [6, 9] },
    { n: "Mulethi", l: "Glycyrrhiza glabra", t: "Licorice root, traditionally used for brighter, even-looking skin tone.", f: [4] },
    { n: "Multani Mitti", l: "Fuller’s earth", t: "Natural clay that absorbs excess oil and cleans the skin deeply.", f: [5] },
    { n: "Coffee", l: "Coffea arabica", t: "Refreshing and energising, leaves skin feeling fresh.", f: [8] },
    { n: "Rose", l: "Rosa damascena", t: "Gentle and calming with a light fragrance. Leaves skin soft.", f: [7, 13] },
    { n: "Fenugreek", l: "Trigonella foenum-graecum", t: "Methi seeds, a traditional hair-care ingredient to nourish the roots.", f: [9] }
  ];
  function idx(id) { for (var i = 0; i < D.length; i++) if (D[i].id == id) return i; return -1; }
  var ih = "";
  ING.forEach(function (g, i) {
    var found = g.f.map(function (id) { var k = idx(id); return k < 0 ? "" : '<button type="button" data-g="' + k + '">' + esc(D[k].n) + "</button>"; }).join("");
    ih += '<li' + (i === 0 ? ' class="open"' : "") + '><button class="hd" type="button" aria-expanded="' + (i === 0) + '"><span class="nm">' + g.n + '</span><span class="lt">' + g.l + '</span></button><div class="bd"><div class="bi"><div class="bw"><p>' + g.t + '</p><div class="found"><span>Found in</span>' + found + "</div></div></div></div></li>";
  });
  $("#ix").innerHTML = ih;
  $("#ix").addEventListener("click", function (e) {
    var g = e.target.closest(".found button"); if (g) { goTo(+g.dataset.g); return; }
    var hd = e.target.closest(".hd"); if (!hd) return;
    var li = hd.parentNode, was = li.classList.contains("open");
    $$("#ix li").forEach(function (x) { x.classList.remove("open"); $(".hd", x).setAttribute("aria-expanded", "false"); });
    if (!was) { li.classList.add("open"); hd.setAttribute("aria-expanded", "true"); }
  });

  /* marquee */
  (function () {
    var w = ["Neem", "Tulsi", "Hibiscus", "Aloe Vera", "Mulethi", "Multani Mitti", "Coffee", "Rose", "Fenugreek"], h = "";
    for (var r = 0; r < 4; r++) w.forEach(function (x) { h += x + "<i>✦</i>"; });
    $("#mq").innerHTML = h;
  })();

  /* ---------- order drawer ---------- */
  function ids() { return Object.keys(cart).filter(function (i) { return cart[i] > 0; }); }
  function total() { return ids().reduce(function (t, i) { var x = find(i); return t + (x.price ? x.price * cart[i] : 0); }, 0); }
  function priced() { return ids().some(function (i) { return find(i).price; }); }
  function paintAdd() { $$(".add").forEach(function (b) { var q = cart[b.dataset.id] || 0; b.classList.toggle("on", q > 0); b.textContent = q > 0 ? "Added " + q : "Add"; }); }
  function render() {
    var list = ids(), h = "", n = 0;
    if (!list.length) h = '<li class="empty">Nothing chosen yet. Tap Add on any product.</li>';
    list.forEach(function (i) {
      var x = find(i), q = cart[i]; n += q;
      h += '<li><span class="nm">' + esc(x.n) + '</span><span class="qty"><button type="button" data-m="' + i + '" aria-label="Remove one">-</button>' + q + '<button type="button" data-p="' + i + '" aria-label="Add one">+</button></span></li>';
    });
    if (list.length && priced()) h += '<li class="tot"><span>Total</span><span>' + money(total()) + "</span></li>";
    $("#lines").innerHTML = h; $("#cc").textContent = n; paintAdd(); save();
  }
  var drawer = $("#drawer"), scrim = $("#scrim"), lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement; drawer.hidden = false; scrim.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add("on"); scrim.classList.add("on"); });
    document.body.style.overflow = "hidden"; $("#closeCart").focus(); hideToast();
  }
  function closeCart() {
    drawer.classList.remove("on"); scrim.classList.remove("on"); document.body.style.overflow = "";
    setTimeout(function () { drawer.hidden = true; scrim.hidden = true; }, 420);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  var toast = $("#toast"), tt = null;
  function hideToast() { toast.hidden = true; clearTimeout(tt); }
  function showToast(name) { $("#tt").textContent = "Added: " + name; toast.hidden = false; clearTimeout(tt); tt = setTimeout(hideToast, 3600); }
  $("#tv").addEventListener("click", openCart);

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-to]"); if (t) { to(t.dataset.to); return; }
    var a = e.target.closest(".add"); if (a) { cart[a.dataset.id] = (cart[a.dataset.id] || 0) + 1; render(); showToast(find(a.dataset.id).n); return; }
    var b = e.target.closest(".lines button");
    if (b) { if (b.dataset.p) cart[b.dataset.p]++; if (b.dataset.m) cart[b.dataset.m] = Math.max(0, cart[b.dataset.m] - 1); render(); return; }
    var z = e.target.closest("img[data-zoom]"); if (z && !z.closest(".lb")) openLb(z);
  });

  /* ---------- photo viewer ---------- */
  var lb = $("#lb"), lbi = $("img", lb), lbp = $("p", lb), lf = null;
  function openLb(img) { lf = document.activeElement; lbi.src = img.currentSrc || img.src; lbi.alt = img.alt; lbp.textContent = img.alt; lb.hidden = false; $(".lbx", lb).focus(); }
  function closeLb() { lb.hidden = true; lbi.removeAttribute("src"); if (lf && lf.focus) lf.focus(); }
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lbx")) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (!lb.hidden) closeLb(); else if (!drawer.hidden) closeCart(); }
  });

  /* ---------- sending the order ---------- */
  function copy(txt, ok, fail) { try { navigator.clipboard.writeText(txt).then(ok, fail); } catch (e) { fail(); } }
  function message() {
    var s = "Hi Nura, I want to order:\n";
    ids().forEach(function (i) { s += cart[i] + " x " + find(i).n + "\n"; });
    if (priced()) s += "\nTotal: " + money(total());
    return s + "\n\nName: " + $("#nm").value + "\nPhone: " + $("#ph").value + "\nAddress: " + $("#ad").value;
  }
  $("#wa").textContent = C.displayNumber;
  $("#cn").addEventListener("click", function () { var b = this; copy("0" + C.whatsappNumber.slice(2), function () { b.textContent = "Copied"; }, function () { b.textContent = "Select the number"; }); });
  $("#form").addEventListener("submit", function (e) {
    e.preventDefault(); var m = $("#msg");
    if (!ids().length) { m.textContent = "Please add at least one product first."; return; }
    var s = message();
    copy(s, function () { m.textContent = "Copied. Now paste it in WhatsApp and send it to " + C.displayNumber + "."; },
      function () { m.textContent = "Could not copy automatically. Please copy this message:\n\n" + s; });
  });
  $("#wsend").addEventListener("click", function () {
    if (!ids().length) { $("#msg").textContent = "Please add at least one product first."; return; }
    window.open(WA + encodeURIComponent(message()), "_blank", "noopener");
  });
  ["nm", "ph", "ad"].forEach(function (id) {
    var el = $("#" + id);
    try { el.value = localStorage.getItem("nura2-" + id) || ""; } catch (e) {}
    el.addEventListener("input", function () { try { localStorage.setItem("nura2-" + id, el.value); } catch (e) {} });
  });

  /* ---------- nav, parallax, cursor, particles, reveal ---------- */
  var nav = $("#nav"), story = $(".story"), par = $("[data-par]");
  function onScroll() {
    nav.classList.toggle("solid", window.scrollY > 30);
    if (!REDUCED && par && story) {
      var r = story.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) par.style.transform = "translate3d(0," + (((r.top + r.height / 2) - innerHeight / 2) * -0.12).toFixed(1) + "px,0) scale(1.06)";
    }
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  (function () {
    if (REDUCED || !matchMedia("(hover:hover)").matches) return;
    var cur = $("#cur"), x = 0, y = 0, cx = 0, cy = 0, run = false;
    addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; cur.classList.add("on"); if (!run) { run = true; tick(); } });
    document.addEventListener("mouseleave", function () { cur.classList.remove("on"); });
    document.addEventListener("mouseover", function (e) { cur.classList.toggle("big", !!e.target.closest("img[data-zoom]")); });
    function tick() { cx += (x - cx) * .22; cy += (y - cy) * .22; cur.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)"; requestAnimationFrame(tick); }
  })();

  (function () {
    var cv = $("#pollen"), ctx = cv.getContext("2d"), W = 0, H = 0, P = [], visible = true, raf = 0;
    var sprite = document.createElement("canvas"); sprite.width = sprite.height = 32;
    var sg = sprite.getContext("2d"), g = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(235,217,166,1)"); g.addColorStop(.35, "rgba(214,181,107,.55)"); g.addColorStop(1, "rgba(214,181,107,0)");
    sg.fillStyle = g; sg.fillRect(0, 0, 32, 32);
    function size() { var r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
    function mk(init) { return { x: Math.random() * W, y: init ? Math.random() * H : H + 20, s: 5 + Math.random() * 16, v: .12 + Math.random() * .4, w: Math.random() * 6.28, a: .25 + Math.random() * .6 }; }
    size(); for (var i = 0; i < (W < 700 ? 22 : 44); i++) P.push(mk(true));
    function draw(move) {
      ctx.clearRect(0, 0, W, H);
      P.forEach(function (p) {
        ctx.globalAlpha = p.a * (.6 + .4 * Math.sin(p.w * 1.7));
        ctx.drawImage(sprite, p.x + Math.sin(p.w) * 18 - p.s / 2, p.y - p.s / 2, p.s, p.s);
        if (move) { p.y -= p.v; p.w += .01; if (p.y < -20) { var n = mk(false); p.x = n.x; p.y = n.y; } }
      });
    }
    function step() { draw(true); raf = visible ? requestAnimationFrame(step) : 0; }
    addEventListener("resize", size);
    if (REDUCED) { draw(false); return; }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible && !raf) step(); }).observe(cv);
    step();
  })();

  (function () {
    var els = $$(".h2,.sub,.ix,.steps li,.fl,.scard,.fcta,.fg,.disc");
    els.forEach(function (el) { el.classList.add("rv"); });
    if (!("IntersectionObserver" in window) || REDUCED) return;
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); } }); }, { threshold: .08 });
    els.forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight * .92) { el.classList.add("pre"); io.observe(el); } });
    setTimeout(function () { els.forEach(function (el) { el.classList.remove("pre"); }); }, 7000);
  })();

  render();
})();
