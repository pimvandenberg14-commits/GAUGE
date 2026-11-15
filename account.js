/* GAUGE — Account-pagina: register portal, login, profiel en aankopenoverzicht */
(function () {
  'use strict';

  var root = document.getElementById('account');
  if (!root) return;

  /* ═══ AANKOPEN ═══════════════════════════════════════════════════════════
     MOCK-DATA voor ontwikkeling. >>> HIER ECHTE DATA KOPPELEN <<<
     Vervang getPurchases() door een aanroep naar jullie order-API / shopsysteem.
     Elk item: { id, productId (uit de productlijst in site.js), date (ISO), price, season }.
     Zet USE_MOCK_PURCHASES op false om de lege staat te zien. */
  var USE_MOCK_PURCHASES = true;
  var MOCK_PURCHASES = [
    { id: 'o-1004', productId: 'ribbed-zip-cardigan-navy',  date: '2026-11-08', price: 349, season: 'Autumn/Winter 2026' },
    { id: 'o-1003', productId: 'knit-zip-hoodie-charcoal', date: '2026-10-24', price: 349, season: 'Autumn/Winter 2026' },
    { id: 'o-1002', productId: 'knit-zip-hoodie-ecru',     date: '2026-10-02', price: 349, season: 'Autumn/Winter 2026' },
    { id: 'o-1001', productId: 'knit-zip-hoodie-navy',     date: '2026-09-19', price: 349, season: 'Autumn/Winter 2026' }
  ];
  function getPurchases(/* user */) {
    var list = USE_MOCK_PURCHASES ? MOCK_PURCHASES.slice() : [];
    return list.sort(function (a, b) { return a.date < b.date ? 1 : -1; }); /* nieuwste eerst */
  }
  var PRODUCTS = (window.GAUGE && window.GAUGE.products) || [];
  function productFor(purchase) {
    return PRODUCTS.filter(function (p) { return p.id === purchase.productId; })[0] || null;
  }

  /* ═══ ACCOUNTS ═══════════════════════════════════════════════════════════
     DEMO-OPSLAG: accounts staan alleen in localStorage van deze browser.
     Dit is geen echte beveiliging. >>> VERVANG DOOR ECHTE AUTH (server) VOOR LIVEGANG <<< */
  var USERS_KEY = 'gauge-users', SESSION_KEY = 'gauge-session';
  var memory = {};
  function load(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; }
    catch (e) { return key in memory ? memory[key] : fallback; }
  }
  function save(key, value) {
    memory[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* privévenster: alleen deze pagina */ }
  }
  function clear(key) {
    delete memory[key];
    try { localStorage.removeItem(key); } catch (e) { /* idem */ }
  }
  function hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function hashPassword(password, salt) {
    var text = salt + ':' + password;
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(hex);
    }
    var h = 5381; /* terugval zonder https: eenvoudige hash, alleen voor de demo */
    for (var i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return Promise.resolve('x' + (h >>> 0).toString(16));
  }
  function newSalt() {
    var a = new Uint8Array(8);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
    else for (var i = 0; i < 8; i++) a[i] = Math.floor(Math.random() * 256);
    return hex(a.buffer);
  }
  function currentUser() {
    var email = load(SESSION_KEY, null);
    if (!email) return null;
    return load(USERS_KEY, []).filter(function (u) { return u.email === email; })[0] || null;
  }

  /* ═══ HULPJES ═══ */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function parseDate(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fullDate(iso) { return parseDate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function ageFrom(dob) {
    var d = parseDate(dob), now = new Date(), age = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
    return age;
  }
  function todayISO() {
    var n = new Date();
    return n.getFullYear() + '-' + ('0' + (n.getMonth() + 1)).slice(-2) + '-' + ('0' + n.getDate()).slice(-2);
  }
  var GENDERS = { woman: 'Woman', man: 'Man', 'non-binary': 'Non-binary', 'prefer-not': 'Prefer not to say' };

  /* ═══ STATE 1 — REGISTER PORTAL / LOGIN ═══ */
  function field(name, label, control) {
    return '<div class="field"><label class="label" for="f-' + name + '">' + label + '</label>' + control +
      '<p class="field__error" id="e-' + name + '" role="alert"></p></div>';
  }
  function input(name, type, extra) {
    return '<input id="f-' + name + '" name="' + name + '" type="' + type + '" aria-describedby="e-' + name + '" ' + (extra || '') + '>';
  }
  var VALIDATORS = {
    name: function (v) { return v.trim() ? '' : 'Please enter your name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
    password: function (v) { return v.length >= 8 ? '' : 'Use at least 8 characters.'; },
    loginPassword: function (v) { return v ? '' : 'Please enter your password.'; },
    dob: function (v) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Please enter your date of birth.';
      if (v > todayISO()) return 'This date is in the future.';
      if (ageFrom(v) > 120) return 'Please check the year.';
      return '';
    },
    gender: function (v) { return v ? '' : 'Please choose an option.'; }
  };
  function setError(form, name, message) {
    var el = form.elements[name];
    document.getElementById('e-' + name).textContent = message;
    if (message) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !message;
  }
  function wireValidation(form, rules) {
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      el.addEventListener('blur', function () { setError(form, name, rules[name](el.value)); });
      el.addEventListener('input', function () { if (el.hasAttribute('aria-invalid')) setError(form, name, rules[name](el.value)); });
    });
  }
  function validateAll(form, rules) {
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      if (!setError(form, name, rules[name](form.elements[name].value)) && !firstBad) firstBad = form.elements[name];
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function renderPortal(mode) {
    var isLogin = mode === 'login';
    var genderOptions = '<option value="">Select</option>' + Object.keys(GENDERS).map(function (k) {
      return '<option value="' + k + '">' + GENDERS[k] + '</option>';
    }).join('');
    root.innerHTML =
      '<section class="portal"><div class="portal__inner">' +
        '<h1 tabindex="-1">Get the keys of your closet.</h1>' +
        (isLogin
          ? '<form id="login-form" novalidate>' +
              field('email', 'Email', input('email', 'email', 'autocomplete="email"')) +
              field('loginPassword', 'Password', input('loginPassword', 'password', 'autocomplete="current-password"')) +
              '<button class="btn btn--full" type="submit">Log in</button>' +
            '</form>' +
            '<p class="portal__switch">No key yet? <button type="button" id="switch">Get one</button></p>'
          : '<form id="register-form" novalidate>' +
              field('name', 'Name', input('name', 'text', 'autocomplete="name"')) +
              field('email', 'Email', input('email', 'email', 'autocomplete="email"')) +
              field('password', 'Password', input('password', 'password', 'autocomplete="new-password"')) +
              field('dob', 'Date of birth', input('dob', 'date', 'autocomplete="bday" max="' + todayISO() + '"')) +
              field('gender', 'Gender', '<select id="f-gender" name="gender" aria-describedby="e-gender">' + genderOptions + '</select>') +
              '<button class="btn btn--full" type="submit">Get my keys</button>' +
            '</form>' +
            '<p class="portal__switch">Already have a key? <button type="button" id="switch">Log in</button></p>') +
      '</div></section>';

    document.getElementById('switch').addEventListener('click', function () {
      renderPortal(isLogin ? 'register' : 'login');
      root.querySelector('input').focus();
    });

    if (isLogin) {
      var lf = document.getElementById('login-form');
      var lrules = { email: VALIDATORS.email, loginPassword: VALIDATORS.loginPassword };
      wireValidation(lf, lrules);
      lf.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateAll(lf, lrules)) return;
        var email = lf.elements.email.value.trim().toLowerCase();
        var user = load(USERS_KEY, []).filter(function (u) { return u.email === email; })[0];
        if (!user) { setError(lf, 'email', 'No key found for this email address.'); lf.elements.email.focus(); return; }
        hashPassword(lf.elements.loginPassword.value, user.salt).then(function (hash) {
          if (hash !== user.passHash) { setError(lf, 'loginPassword', 'This password is not correct.'); lf.elements.loginPassword.focus(); return; }
          save(SESSION_KEY, user.email);
          renderAccount(user, true);
        });
      });
    } else {
      var rf = document.getElementById('register-form');
      var rrules = { name: VALIDATORS.name, email: VALIDATORS.email, password: VALIDATORS.password, dob: VALIDATORS.dob, gender: VALIDATORS.gender };
      wireValidation(rf, rrules);
      rf.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateAll(rf, rrules)) return;
        var users = load(USERS_KEY, []);
        var email = rf.elements.email.value.trim().toLowerCase();
        if (users.some(function (u) { return u.email === email; })) {
          setError(rf, 'email', 'This email already has a key. Log in instead.'); rf.elements.email.focus(); return;
        }
        var salt = newSalt();
        hashPassword(rf.elements.password.value, salt).then(function (hash) {
          var user = {
            name: rf.elements.name.value.trim(), email: email, salt: salt, passHash: hash,
            dob: rf.elements.dob.value, gender: rf.elements.gender.value, createdAt: new Date().toISOString()
          };
          users.push(user);
          save(USERS_KEY, users);
          save(SESSION_KEY, email);
          renderAccount(user, true);
        });
      });
    }
  }

  /* ═══ STATE 2 — ACCOUNT ═══ */
  function purchaseCard(purchase) {
    var p = productFor(purchase);
    if (!p) return '';
    var second = p.images[1] ? '<img class="alt" src="' + p.images[1] + '" alt="" loading="lazy">' : '';
    return '<li><a class="product purchase" href="product.html?id=' + p.id + '">' +
      '<figure class="ph" data-ph="' + p.images[0] + '">' +
        '<img src="' + p.images[0] + '" alt="' + esc(p.alt) + '" loading="lazy">' + second +
      '</figure>' +
      '<div class="purchase__info">' +
        '<p class="purchase__head"><span><span class="product__name">' + esc(p.name) + '</span>' +
          '<span class="product__color">' + esc(p.color) + '</span></span><span>€' + purchase.price + '</span></p>' +
        '<dl>' +
          '<dt>Purchased</dt><dd>' + fullDate(purchase.date) + '</dd>' +
          '<dt>Season</dt><dd>' + esc(purchase.season) + '</dd>' +
        '</dl>' +
      '</div></a></li>';
  }

  function renderAccount(user, moveFocus) {
    var items = getPurchases(user);
    var memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    root.innerHTML =
      '<div class="acc">' +
        '<h1 class="sr-only" tabindex="-1">Your account</h1>' +
        '<section class="profile" aria-label="Profile">' +
          '<dl>' +
            '<dt>Name</dt><dd class="profile__name">' + esc(user.name) + '</dd>' +
            '<dt>Age</dt><dd>' + ageFrom(user.dob) + '</dd>' +
            '<dt>Gender</dt><dd>' + (GENDERS[user.gender] || '') + '</dd>' +
            '<dt>Member since</dt><dd>' + memberSince + '</dd>' +
          '</dl>' +
          '<button type="button" class="profile__logout" id="logout">Log out</button>' +
        '</section>' +
        '<section class="purchases" aria-labelledby="purchases-title">' +
          '<div class="purchases__head">' +
            '<h2 id="purchases-title">Your closet</h2>' +
            '<p class="label">' + items.length + (items.length === 1 ? ' piece' : ' pieces') + '</p>' +
          '</div>' +
          (items.length
            ? '<ul class="purchases__row">' + items.map(purchaseCard).join('') + '</ul>'
            : '<p class="purchases__empty">Your closet is empty. Your first key opens it. <a class="text-link" href="shop.html">Go to shop</a></p>') +
        '</section>' +
      '</div>';

    /* ontbrekende foto → kader met bestandsnaam (zelfde gedrag als de rest van de site) */
    root.querySelectorAll('.ph').forEach(function (ph) {
      var img = ph.querySelector('img');
      function missing() { ph.classList.add('missing'); }
      if (img.complete && img.naturalWidth === 0) missing();
      img.addEventListener('error', missing);
    });

    document.getElementById('logout').addEventListener('click', function () {
      clear(SESSION_KEY);
      renderPortal('register');
      root.querySelector('h1').focus();
    });
    if (moveFocus) { window.scrollTo(0, 0); root.querySelector('h1').focus(); }
  }

  /* ═══ START ═══ */
  var user = currentUser();
  if (user) renderAccount(user, false); else renderPortal('register');
})();
