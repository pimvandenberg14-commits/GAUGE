/* GAUGE — gedeeld script: productdata, header/footer, shop en productpagina */
(function () {
  'use strict';

  /* ═══ PRODUCTEN ═══
     Hier pas je namen, prijzen, foto's en teksten aan. Eén plek voor de hele site. */
  var PRODUCTS = [
    {
      id: 'knit-zip-hoodie-charcoal',
      name: 'Knit Zip Hoodie', color: 'Charcoal', price: 349, group: 'knit-zip-hoodie',
      images: ['lookbook/05.jpg', 'lookbook/01.jpg', 'lookbook/08.jpg', 'lookbook/07.jpg'],
      alt: 'Knit Zip Hoodie in charcoal',
      desc: 'Knitted hoodie with a two-way zip, drawstring hood and two front pockets. Ribbed cuffs and hem.',
      details: ['Silver-tone two-way zip', 'Drawstring hood', 'Two front pockets', 'Ribbed cuffs and hem'],
      fit: 'Relaxed, straight fit. True to size: take your usual size.'
    },
    {
      id: 'knit-zip-hoodie-ecru',
      name: 'Knit Zip Hoodie', color: 'Ecru', price: 349, group: 'knit-zip-hoodie',
      images: ['lookbook/04.jpg', 'lookbook/06.jpg'],
      alt: 'Knit Zip Hoodie in ecru',
      desc: 'Knitted hoodie with a two-way zip, drawstring hood and two front pockets. Ribbed cuffs and hem.',
      details: ['Silver-tone two-way zip', 'Drawstring hood', 'Two front pockets', 'Ribbed cuffs and hem'],
      fit: 'Relaxed, straight fit. True to size: take your usual size.'
    },
    {
      id: 'knit-zip-hoodie-navy',
      name: 'Knit Zip Hoodie', color: 'Navy', price: 349, group: 'knit-zip-hoodie',
      images: ['lookbook/03.jpg', 'lookbook/02.jpg'],
      alt: 'Knit Zip Hoodie in navy',
      desc: 'Knitted hoodie with a two-way zip, drawstring hood and two front pockets. Ribbed cuffs and hem.',
      details: ['Silver-tone two-way zip', 'Drawstring hood', 'Two front pockets', 'Ribbed cuffs and hem'],
      fit: 'Relaxed, straight fit. True to size: take your usual size.'
    },
    {
      id: 'ribbed-zip-cardigan-navy',
      name: 'Ribbed Zip Cardigan', color: 'Navy', price: 349, group: 'ribbed-zip-cardigan',
      images: ['lookbook/10.jpg', 'lookbook/09.jpg', 'hero.jpg'],
      alt: 'Ribbed Zip Cardigan in navy',
      desc: 'Ribbed cardigan with a high collar and two-way zip. Ribbed cuffs and hem.',
      details: ['Silver-tone two-way zip', 'High stand collar', 'Rib knit throughout', 'Ribbed cuffs and hem'],
      fit: 'Straight fit with a slightly dropped shoulder. True to size: take your usual size.'
    }
  ];
  var SIZES = ['S', 'M', 'L', 'XL'];
  /* Nog in te vullen door GAUGE */
  var MATERIAL_TEXT = 'Material and care: to be added.';
  var SHIPPING_TEXT = 'Shipping and returns: to be added.';

  window.GAUGE = { products: PRODUCTS }; /* gedeeld met account.js */

  var page = document.body.getAttribute('data-page');
  var isHome = page === 'home';
  function $(id) { return document.getElementById(id); }
  function price(n) { return '€' + n; }
  function productUrl(p) { return 'product.html?id=' + p.id; }

  /* ═══ ICONEN + LOGO (logo getraceerd uit de lookbookfoto) ═══ */
  var SPRITE = '<svg class="sprite" aria-hidden="true">' +
    '<symbol id="gauge-logo" viewBox="0 0 558.8 74.5"><path fill-rule="evenodd" d="M40.5 0.3L56.6 0.3L68.2 2.3L75.9 5.3L81.6 8.3L86.4 12.0L90.1 16.3L83.4 20.3L74.4 24.8L73.4 24.6L67.4 19.4L60.4 16.6L50.4 15.4L41.4 15.8L34.4 17.7L30.4 19.7L26.4 22.9L22.7 27.3L20.9 31.3L20.0 35.3L20.0 39.3L20.7 43.3L23.7 49.3L28.4 53.9L36.4 57.9L43.4 59.0L57.4 58.9L58.8 58.3L62.4 57.8L68.4 55.8L72.4 53.4L72.9 52.3L73.0 47.3L72.4 45.9L71.4 45.5L47.4 45.6L46.6 45.3L46.8 34.3L46.8 32.3L47.4 32.1L92.4 32.3L92.4 59.4L89.4 62.3L81.4 67.3L74.8 70.3L68.4 72.3L56.4 74.4L43.4 74.5L32.9 73.3L22.4 70.3L14.9 66.3L11.1 63.3L7.4 59.4L2.4 51.7L0.4 45.3L0.1 33.3L1.4 27.4L4.4 20.6L9.4 13.8L16.4 8.1L24.0 4.3L29.5 2.3ZM398.9 0.3L414.4 0.2L422.4 1.2L426.8 2.3L431.8 4.3L432.4 4.9L434.3 5.3L439.4 8.0L444.8 12.3L448.2 16.3L439.4 20.8L437.3 22.3L431.4 24.7L428.4 21.7L424.4 18.7L416.4 15.9L406.4 14.8L399.4 15.9L395.4 16.8L389.4 19.6L383.6 25.3L381.7 28.3L379.7 35.3L379.8 40.3L380.4 40.9L380.6 43.3L381.6 46.3L383.7 49.3L387.4 52.9L390.4 55.0L394.4 56.9L396.8 57.3L398.4 58.0L407.4 59.0L412.4 58.8L419.4 57.8L419.9 57.3L422.4 57.0L428.4 54.6L430.9 53.3L431.2 52.3L431.2 46.3L430.4 45.6L405.4 45.6L405.0 45.3L405.3 37.3L405.4 32.0L450.6 32.3L450.5 59.3L445.6 63.3L439.0 67.3L432.4 70.3L429.4 70.8L428.9 71.3L426.4 71.7L425.4 72.3L418.4 73.5L410.4 74.2L398.4 73.7L390.0 72.3L380.5 69.3L372.4 64.4L366.4 58.5L362.4 52.3L360.3 46.3L359.4 40.3L359.3 36.3L360.4 28.5L361.1 27.3L361.3 25.3L363.4 21.4L368.3 14.3L374.4 9.0L383.0 4.3L392.8 1.3ZM158.6 2.3L180.4 1.9L181.4 2.3L182.7 5.3L189.4 16.1L195.8 28.3L204.4 42.8L210.4 54.1L210.6 55.3L214.4 61.2L218.9 70.3L220.4 72.3L199.4 72.4L198.4 71.4L197.0 68.3L196.4 67.7L195.9 66.3L191.4 58.9L181.4 58.6L148.4 58.6L146.8 60.3L140.4 72.3L119.2 72.3L128.4 55.4L132.9 48.3L136.3 41.3L142.4 30.8L143.1 30.3L144.3 27.3L148.0 21.3L148.4 19.9L149.8 18.3ZM245.1 2.3L264.4 1.9L264.6 2.3L264.7 42.3L265.8 48.3L266.7 50.3L271.4 54.8L275.4 56.9L277.7 57.3L278.4 57.9L282.2 58.3L283.4 58.8L287.4 58.8L294.4 58.0L295.4 57.2L297.4 57.0L298.4 56.2L300.4 55.6L303.4 53.2L305.9 50.3L306.4 48.8L307.0 48.3L308.1 45.3L308.3 42.3L308.4 2.1L327.4 1.9L327.9 2.3L327.7 15.3L327.5 49.3L326.5 53.3L325.6 54.3L323.4 59.3L319.4 64.0L315.3 67.3L309.3 70.3L307.4 70.6L306.4 71.4L298.4 73.4L286.4 74.3L273.6 73.3L263.2 70.3L260.7 69.3L255.9 66.3L252.4 63.3L249.4 59.2L246.4 52.7L246.0 50.3L245.3 49.3L245.2 46.3ZM486.3 1.9L558.3 1.9L558.5 15.8L506.4 15.8L505.7 18.3L505.7 27.3L506.4 29.8L553.7 29.8L553.7 42.8L506.4 42.9L505.7 46.3L505.7 55.3L506.4 57.8L558.8 57.9L558.6 72.3L486.3 72.3ZM168.8 20.3L169.4 19.7L171.0 20.3L174.2 27.3L183.2 43.3L182.4 44.6L180.4 44.2L171.4 44.1L159.4 44.3L157.4 44.6L156.3 43.3L157.0 41.3L158.4 39.5Z"/></symbol>' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></symbol>' +
    '<symbol id="i-account" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></symbol>' +
    '<symbol id="i-bag" viewBox="0 0 24 24"><path d="M4.5 8h15l-1 13h-13z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/></symbol>' +
    '<symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 8h18M3 16h18"/></symbol>' +
    '<symbol id="i-close" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19"/></symbol>' +
    '<symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/></symbol>' +
    '<symbol id="i-tiktok" viewBox="0 0 24 24"><path d="M14 3v11.5a3.75 3.75 0 1 1-3.75-3.75"/><path d="M14 3c.3 2.6 2 4.4 4.75 4.75"/></symbol>' +
    '<symbol id="i-pinterest" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 20.5 12.2 10"/><path d="M9.2 13.2A3.4 3.4 0 1 1 12 15.4"/></symbol>' +
    '</svg>';
  var LOGO = '<svg class="logo" viewBox="0 0 558.8 74.5" role="img" aria-label="GAUGE"><use href="#gauge-logo"/></svg>';
  function icon(name) { return '<svg class="icon"><use href="#i-' + name + '"/></svg>'; }

  document.body.insertAdjacentHTML('afterbegin', SPRITE);

  /* ═══ HEADER ═══ */
  var home = isHome ? '' : 'index.html';
  var shopActive = (page === 'shop' || page === 'product') ? ' class="active" aria-current="page"' : '';
  var header = $('header');
  header.innerHTML =
    '<a class="header__logo" href="' + (isHome ? '#top' : 'index.html') + '" aria-label="GAUGE — home">' + LOGO + '</a>' +
    '<div class="header__right">' +
      '<div class="header__menu" id="menu">' +
        '<nav class="nav" aria-label="Main menu">' +
          '<a href="shop.html"' + shopActive + '>Shop</a>' +
          '<a href="' + home + '#lookbook" data-spy="lookbook">Lookbook</a>' +
          '<a href="' + home + '#story" data-spy="story">Story</a>' +
        '</nav>' +
        '<div class="icons">' +
          '<a href="#" aria-label="Search">' + icon('search') + '</a>' +
          '<a href="account.html" aria-label="Account"' + (page === 'account' ? ' aria-current="page"' : '') + '>' + icon('account') + '</a>' +
          '<a href="#" id="cart-link" aria-label="Cart">' + icon('bag') + '<span class="cart__count" id="cart-count"></span></a>' +
        '</div>' +
      '</div>' +
      '<button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="menu">' +
        '<svg class="icon"><use id="burger-icon" href="#i-menu"/></svg>' +
      '</button>' +
    '</div>';

  var burger = $('burger');
  function setMenu(open) {
    header.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    $('burger-icon').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  burger.addEventListener('click', function () { setMenu(!header.classList.contains('open')); });
  header.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ═══ FOOTER ═══ */
  var footer = $('footer');
  if (footer) {
    footer.innerHTML =
      '<div class="footer__top">' +
        '<a href="' + (isHome ? '#top' : 'index.html') + '" aria-label="GAUGE — home">' + LOGO + '</a>' +
        '<form class="newsletter" id="newsletter" novalidate>' +
          '<label class="label" for="email">Newsletter</label>' +
          '<div class="newsletter__row">' +
            '<input id="email" type="email" name="email" placeholder="Email address" autocomplete="email" required>' +
            '<button type="submit">Sign up</button>' +
          '</div>' +
          '<p class="newsletter__msg" id="newsletter-msg" role="status"></p>' +
        '</form>' +
        '<div class="social">' +
          '<a href="#" aria-label="Instagram">' + icon('instagram') + '</a>' +
          '<a href="#" aria-label="TikTok">' + icon('tiktok') + '</a>' +
          '<a href="#" aria-label="Pinterest">' + icon('pinterest') + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer__bottom">' +
        '<span>© 2026 GAUGE</span>' +
        '<nav aria-label="Footer menu"><a href="shop.html">Shop</a><a href="' + home + '#lookbook">Lookbook</a><a href="' + home + '#story">Story</a></nav>' +
      '</div>';
    /* Nieuwsbrief (demo: koppel hier jullie mailprovider) */
    $('newsletter').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('email'), msg = $('newsletter-msg');
      if (!input.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      msg.textContent = 'Thank you — you are on the list.';
      input.value = '';
    });
  }

  /* ═══ WINKELWAGEN (voorlopig alleen een teller, bewaard in de browser) ═══ */
  function readCart() {
    try { return JSON.parse(localStorage.getItem('gauge-cart')) || []; } catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem('gauge-cart', JSON.stringify(items)); } catch (e) { /* privévenster: teller geldt dan alleen voor deze pagina */ }
  }
  var cart = readCart();
  function showCartCount() {
    var n = cart.length;
    $('cart-count').textContent = n ? n : '';
    $('cart-link').setAttribute('aria-label', 'Cart' + (n ? ' (' + n + ')' : ''));
  }
  showCartCount();

  /* ═══ PRODUCTKAART ═══ */
  function card(p) {
    var second = p.images[1] ? '<img class="alt" src="' + p.images[1] + '" alt="" loading="lazy">' : '';
    return '<a class="product" href="' + productUrl(p) + '">' +
      '<figure class="ph" data-ph="' + p.images[0] + '">' +
        '<img src="' + p.images[0] + '" alt="' + p.alt + '" loading="lazy">' + second +
      '</figure>' +
      '<div class="product__info">' +
        '<span><span class="product__name">' + p.name + '</span><span class="product__color">' + p.color + '</span></span>' +
        '<span class="product__price">' + price(p.price) + '</span>' +
      '</div></a>';
  }
  document.querySelectorAll('[data-products]').forEach(function (el) {
    el.innerHTML = PRODUCTS.map(card).join('');
  });
  document.querySelectorAll('[data-product-count]').forEach(function (el) {
    el.textContent = PRODUCTS.length + ' pieces';
  });

  /* ═══ PRODUCTPAGINA ═══ */
  var pdp = $('pdp');
  if (pdp) {
    var id = new URLSearchParams(location.search).get('id');
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
    if (!p) {
      pdp.className = 'notfound';
      pdp.innerHTML = '<h1>This product is no longer available.</h1><a class="btn" href="shop.html">Go to shop</a>';
    } else {
      document.title = p.name + ' — ' + p.color + ' | GAUGE';
      var siblings = PRODUCTS.filter(function (x) { return x.group === p.group; });
      var colors = siblings.map(function (s) {
        return '<a href="' + productUrl(s) + '"' + (s.id === p.id ? ' aria-current="true"' : '') + '>' + s.color + '</a>';
      }).join('');
      var sizes = SIZES.map(function (s) {
        return '<label><input type="radio" name="size" value="' + s + '"><span>' + s + '</span></label>';
      }).join('');
      pdp.innerHTML =
        '<div class="pdp__gallery">' +
          p.images.map(function (src, i) {
            return '<figure class="ph" data-ph="' + src + '"><img src="' + src + '" alt="' + p.alt + ', photo ' + (i + 1) + '"' + (i ? ' loading="lazy"' : '') + '></figure>';
          }).join('') +
        '</div>' +
        '<div class="pdp__info">' +
          '<p class="label crumbs"><a href="shop.html">Shop</a> / ' + p.name + '</p>' +
          '<h1>' + p.name + '</h1>' +
          '<p>' + p.color + '</p>' +
          '<p class="pdp__price">' + price(p.price) + '</p>' +
          '<p class="pdp__desc">' + p.desc + '</p>' +
          '<div class="pdp__group"><div class="pdp__group-head"><span class="label">Colour</span></div><div class="colors">' + colors + '</div></div>' +
          '<form id="add-form" novalidate>' +
            '<div class="pdp__group"><div class="pdp__group-head"><span class="label" id="size-label">Size</span></div>' +
              '<fieldset class="sizes" aria-labelledby="size-label">' + sizes + '</fieldset></div>' +
            '<button class="btn btn--full pdp__add" type="submit">Add to cart</button>' +
            '<p class="pdp__msg" id="add-msg" role="status"></p>' +
          '</form>' +
          '<div class="accordion">' +
            '<details open><summary>Details</summary><div class="accordion__body"><ul>' +
              p.details.map(function (d) { return '<li>' + d + '</li>'; }).join('') +
              '<li>' + MATERIAL_TEXT + '</li></ul></div></details>' +
            '<details><summary>Fit</summary><div class="accordion__body">' + p.fit + '</div></details>' +
            '<details><summary>Shipping &amp; returns</summary><div class="accordion__body">' + SHIPPING_TEXT + '</div></details>' +
          '</div>' +
        '</div>';

      $('add-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var chosen = this.querySelector('input[name="size"]:checked');
        var msg = $('add-msg');
        if (!chosen) { msg.textContent = 'Please choose a size first.'; return; }
        cart.push({ id: p.id, size: chosen.value });
        writeCart(cart);
        showCartCount();
        msg.textContent = 'Added: ' + p.name + ', ' + p.color + ', size ' + chosen.value + '.';
      });

      var related = $('related');
      if (related) {
        related.innerHTML = PRODUCTS.filter(function (x) { return x.id !== p.id; }).map(card).join('');
      }
    }
    var relatedSection = $('related-section');
    if (relatedSection && !p) relatedSection.hidden = true;
  }

  /* ═══ FOTO-PLACEHOLDERS: ontbrekende foto → kader met bestandsnaam ═══ */
  document.querySelectorAll('.ph').forEach(function (ph) {
    var img = ph.querySelector('img');
    if (!img) return;
    function missing() { ph.classList.add('missing'); }
    if (img.complete && img.naturalWidth === 0) missing();
    img.addEventListener('error', missing);
  });

  /* ═══ HOME: actieve menulink + fade-in ═══ */
  if ('IntersectionObserver' in window) {
    var spyLinks = {};
    header.querySelectorAll('[data-spy]').forEach(function (a) { spyLinks[a.getAttribute('data-spy')] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (spyLinks[e.target.id]) spyLinks[e.target.id].classList.toggle('active', e.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -55% 0px' });
    Object.keys(spyLinks).forEach(function (key) { var s = $(key); if (s) spy.observe(s); });

    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
