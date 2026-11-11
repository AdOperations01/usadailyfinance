/* ==========================================================================
   final.js — congratulations / call step
   --------------------------------------------------------------------------
   Fires automatically the moment .final becomes visible (MutationObserver),
   so js.js does not need to know this file exists.

   Copy lives in index.html. Only behaviour knobs live here.
   ========================================================================== */

(function (w, d) {
  'use strict';

  var CONFIG = {
    // ---- countdown -------------------------------------------------------
    TIMER_SECONDS: 90,          // starting value
    TIMER_PERSIST: true,        // survives refresh (does NOT restart on reload)
    TIMER_EXPIRED_HTML: 'Your expert is still on the line &mdash; tap the button above to connect.',

    // ---- application id --------------------------------------------------
    APP_PREFIX: 'C',
    APP_DIGITS: 6,
    APP_PERSIST: true,          // same id for the whole session

    // ---- default phone ---------------------------------------------------
    // js.js overwrites these per age/checking-account bucket on click.
    DEFAULT_PHONE_DISPLAY: '(833) 623-3133',
    DEFAULT_PHONE_TEL: '+18336233133'
  };

  var SS = {
    get: function (k) { try { return w.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { w.sessionStorage.setItem(k, v); } catch (e) {} }
  };

  var started = false;

  /* ---------- application id ---------------------------------------------- */

  function applicationId() {
    var key = 'lp_app_id';
    var cached = CONFIG.APP_PERSIST ? SS.get(key) : null;
    if (cached) return cached;

    var min = Math.pow(10, CONFIG.APP_DIGITS - 1);
    var n = Math.floor(min + Math.random() * (min * 9));
    var id = CONFIG.APP_PREFIX + n;

    if (CONFIG.APP_PERSIST) SS.set(key, id);
    return id;
  }

  /* ---------- countdown ---------------------------------------------------- */

  function startTimer() {
    var box = d.getElementById('final_timer');
    var num = d.getElementById('timer_seconds');
    if (!box || !num) return;

    var key = 'lp_timer_start';
    var startedAt = CONFIG.TIMER_PERSIST ? parseInt(SS.get(key), 10) : NaN;

    if (!startedAt || isNaN(startedAt)) {
      startedAt = Date.now();
      if (CONFIG.TIMER_PERSIST) SS.set(key, String(startedAt));
    }

    function tick() {
      var elapsed = Math.floor((Date.now() - startedAt) / 1000);
      var left = CONFIG.TIMER_SECONDS - elapsed;

      if (left <= 0) {
        clearInterval(iv);
        box.classList.add('is-expired');
        box.innerHTML = '<p class="final__timer-expired">' + CONFIG.TIMER_EXPIRED_HTML + '</p>';
        return;
      }
      num.textContent = left;
    }

    tick();
    var iv = setInterval(tick, 1000);
  }

  /* ---------- phone sync --------------------------------------------------- */

  function syncPhone() {
    var display = d.querySelector('.cphone2');
    var link = d.querySelector('.final .cphone');

    // Only set defaults if js.js hasn't already swapped in a bucket number.
    if (display && !display.textContent.trim()) display.textContent = CONFIG.DEFAULT_PHONE_DISPLAY;
    if (link && (!link.getAttribute('href') || link.getAttribute('href') === '#')) {
      link.setAttribute('href', 'tel:' + CONFIG.DEFAULT_PHONE_TEL);
    }
  }

  /* ---------- boot --------------------------------------------------------- */

  function init() {
    if (started) return;
    started = true;

    var idEl = d.getElementById('application_id');
    if (idEl) idEl.textContent = applicationId();

    syncPhone();
    startTimer();

    try { w.dispatchEvent(new CustomEvent('final:shown')); } catch (e) {}
  }

  w.showFinalStep = init; // manual hook if you ever want to call it directly

  function watch() {
    var el = d.querySelector('.final');
    if (!el) return;

    // QA shortcut: ?final=1 jumps straight to the card, no funnel walk
    if (new URLSearchParams(w.location.search).get('final') === '1') {
      Array.prototype.forEach.call(d.querySelectorAll('.question__element'), function (q) {
        q.style.display = 'none';
      });
      el.style.display = 'block';
    }

    var visible = function () {
      return el.offsetParent !== null || getComputedStyle(el).display !== 'none';
    };

    if (visible()) { init(); return; }

    var mo = new MutationObserver(function () {
      if (visible()) { mo.disconnect(); init(); }
    });
    mo.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', watch);
  else watch();

})(window, document);
