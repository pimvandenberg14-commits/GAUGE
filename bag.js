/* GAUGE — Shopping bag: items, overzicht, kortingscode en "You may also like" */
(function () {
  'use strict';

  var root = document.getElementById('bag');
  var G = window.GAUGE;
  if (!root || !G) return;

  /* ═══ KORTINGSCODES ══════════════════════════════════════════════════════
     DEMO: codes staan hier in de pagina en zijn dus voor iedereen te lezen.
     >>> VERVANG DOOR CONTROLE OP DE SERVER / IN HET SHOPSYSTEEM VOOR LIVEGANG <<<
     Formaat: CODE: percentage korting. */
  var DISCOUNT_CODES = { WELCOME10: 10 };
  var DISCOUNT_KEY = 'gauge-discount';

  function loadCode() {
    try { var c = localStorage.getItem(DISCOUNT_KEY); return c && DISCOUNT_CODES[c] ? c : null; } catch (e) { return null; }
  }
  function saveCode(code) {
    try { if (code) localStorage.setItem(DISCOUNT_KEY, code); else localStorage.removeItem(DISCOUNT_KEY); } catch (e) { /* privévenster */ }
  }

  var code = loadCode();
  var checkoutNote = '';

  function product(id) { return G.products.filter(function (p) { return p.id === id; })[0] || null; }
  function money(n) { return '€' + (Math.round(n * 100) % 100 === 0 ? Math.round(n) : n.toFixed(2)); }

  /* De winkelwagen is een lijst losse stuks { id, size }; hier gegroepeerd per product + maat */
  function lines() {
    var map = {}, out = [];
    G.getCart().forEach(function (entry) {
      var p = product(entry.id);
      if (!p) return;
      var key = entry.id + '|' + entry.size;
      if (!map[key]) { map[key] = { key: key, product: p, size: entry.size, qty: 0 }; out.push(map[key]); }
      map[key].qty++;
    });
    return out;
  }
  function change(line, delta) {
    var cart = G.getCart();
    if (delta > 0) {
      cart.push({ id: line.product.id, size: line.size });
    } else {
      var remove = delta === -Infinity ? line.qty : 1;
      for (var i = cart.length - 1; i >= 0 && remove > 0; i--) {
        if (cart[i].id === line.product.id && cart[i].size === line.size) { cart.splice(i, 1); remove--; }
      }
    }
    G.setCart(cart);
    checkoutNote = '';
    render();
  }

  function itemHTML(line, index) {
    var p = line.product, label = p.name + ', ' + p.color + ', size ' + line.size;
    return '<li class="bag-item">' +
      '<a class="ph" data-ph="' + p.images[0] + '" href="' + G.productUrl(p) + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + p.images[0] + '" alt=""></a>' +
      '<div class="bag-item__main">' +
        '<a class="bag-item__name" href="' + G.productUrl(p) + '">' + p.name + '</a>' +
        '<p class="bag-item__meta">' + p.color + ' · Size ' + line.size + '</p>' +
        '<div class="bag-item__controls">' +
          '<div class="qty" role="group" aria-label="Quantity for ' + label + '">' +
            '<button type="button" data-act="minus" data-i="' + index + '" aria-label="Decrease quantity">−</button>' +
            '<span aria-live="polite">' + line.qty + '</span>' +
            '<button type="button" data-act="plus" data-i="' + index + '" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<button type="button" class="bag-item__remove" data-act="remove" data-i="' + index + '" aria-label="Remove ' + label + '">Remove</button>' +
        '</div>' +
      '</div>' +
      '<p class="bag-item__price">' + money(p.price * line.qty) + '</p>' +
    '</li>';
  }

  function render(focusSelector) {
    var ls = lines();
    var count = ls.reduce(function (n, l) { return n + l.qty; }, 0);
    var subtotal = ls.reduce(function (n, l) { return n + l.product.price * l.qty; }, 0);
    var percent = code ? DISCOUNT_CODES[code] : 0;
    var discount = subtotal * percent / 100;
    var total = subtotal - discount;

    document.getElementById('bag-count').textContent = count + (count === 1 ? ' item' : ' items');

    var left = ls.length
      ? '<ul class="bag__items">' + ls.map(itemHTML).join('') + '</ul>'
      : '<div class="bag__empty"><p>Your bag is empty.</p><a class="btn" href="shop.html">Go to shop</a></div>';

    var discountBlock = code
      ? '<div class="discount"><span class="label">Discount code</span>' +
          '<p class="discount__applied"><span>' + code + ' · ' + percent + '% off</span>' +
          '<button type="button" id="discount-remove">Remove</button></p>' +
          '<p class="discount__msg" id="discount-msg" role="status"></p></div>'
      : '<form class="discount" id="discount-form" novalidate>' +
          '<label class="label" for="discount-code">Discount code</label>' +
          '<div class="discount__row">' +
            '<input id="discount-code" name="code" type="text" placeholder="Enter code" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="discount-msg">' +
            '<button type="submit">Apply</button>' +
          '</div>' +
          '<p class="discount__msg" id="discount-msg" role="status"></p></form>';

    root.innerHTML =
      '<section aria-label="Items in your bag">' + left + '</section>' +
      '<aside class="summary" aria-labelledby="summary-title">' +
        '<h2 id="summary-title">Summary</h2>' +
        '<dl class="summary__rows">' +
          '<div class="summary__row"><dt>Subtotal</dt><dd>' + money(subtotal) + '</dd></div>' +
          (code ? '<div class="summary__row summary__row--discount"><dt>Discount (' + code + ')</dt><dd>−' + money(discount) + '</dd></div>' : '') +
          '<div class="summary__row"><dt>Shipping</dt><dd>Calculated at checkout</dd></div>' +
          '<div class="summary__row summary__row--total"><dt>Total</dt><dd aria-live="polite">' + money(total) + '</dd></div>' +
        '</dl>' +
        discountBlock +
        '<button type="button" class="btn btn--full" id="checkout"' + (ls.length ? '' : ' disabled') + '>Checkout</button>' +
        '<p class="summary__msg" id="checkout-msg" role="status">' + checkoutNote + '</p>' +
      '</aside>';

    G.watchImages(root);

    root.querySelectorAll('[data-act]').forEach(function (b) {
      b.addEventListener('click', function () {
        var line = ls[+b.getAttribute('data-i')], act = b.getAttribute('data-act');
        change(line, act === 'plus' ? 1 : act === 'minus' ? -1 : -Infinity);
      });
    });

    var form = document.getElementById('discount-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var value = form.elements.code.value.trim().toUpperCase();
        var msg = document.getElementById('discount-msg');
        if (!value) { msg.textContent = 'Please enter a code.'; msg.className = 'discount__msg is-error'; return; }
        if (!DISCOUNT_CODES[value]) { msg.textContent = 'This code is not valid.'; msg.className = 'discount__msg is-error'; return; }
        code = value; saveCode(code);
        render('#discount-remove');
        document.getElementById('discount-msg').textContent = 'Code applied.';
      });
    }
    var removeCode = document.getElementById('discount-remove');
    if (removeCode) {
      removeCode.addEventListener('click', function () { code = null; saveCode(null); render('#discount-code'); });
    }

    /* >>> HIER DE ECHTE CHECKOUT KOPPELEN (betaalprovider / shopsysteem) <<< */
    document.getElementById('checkout').addEventListener('click', function () {
      checkoutNote = 'Checkout is not available yet.';
      document.getElementById('checkout-msg').textContent = checkoutNote;
    });

    if (focusSelector) { var f = root.querySelector(focusSelector); if (f) f.focus(); }
  }

  /* ═══ YOU MAY ALSO LIKE: vier artikelen, eerst wat nog niet in de bag zit ═══ */
  function renderAlsoLike() {
    var el = document.getElementById('also-like');
    if (!el) return;
    var inBag = {};
    G.getCart().forEach(function (e) { inBag[e.id] = true; });
    var sorted = G.products.filter(function (p) { return !inBag[p.id]; })
      .concat(G.products.filter(function (p) { return inBag[p.id]; }));
    el.innerHTML = sorted.slice(0, 4).map(G.card).join('');
    G.watchImages(el);
  }

  render();
  renderAlsoLike();
})();
