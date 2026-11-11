/* ==========================================================================
   geo.js — dynamic city / state injection
   --------------------------------------------------------------------------
   MARKUP TOKENS (put these on any element):
     data-geo="city"        ->  Gurgaon
     data-geo="state"       ->  Haryana
     data-geo="city_state"  ->  Gurgaon, Haryana
     data-geo="state_code"  ->  HR

   FALLBACK:
     data-geo-fallback="..."  replaces that element's text if every
                              provider fails (so you never ship "(State)").

   QA OVERRIDE (no network call, instant):
     ?city=Austin&state=Texas
     ?state=Florida

   EVENT:
     window.addEventListener('geo:ready', e => console.log(e.detail))
     window.LP_GEO  ->  { city, state, state_code, city_state, resolved }
   ========================================================================== */

(function (w, d) {
  'use strict';

  var CONFIG = {
    timeout: 2500,          // per-provider timeout (ms)
    cacheKey: 'lp_geo_v1',  // sessionStorage cache key
    cache: true,
    legacyEndpoint: 'https://truepathrelief.com/FEV8/index.php' // your own server-side lookup
  };

  /* ---------- provider chain (tried in order, first win stops the chain) --- */
  var PROVIDERS = [
    {
      name: 'ipapi',
      url: 'https://ipapi.co/json/',
      map: function (r) {
        if (!r || r.error) return null;
        return { ip: r.ip, city: r.city, state: r.region, state_code: r.region_code };
      }
    },
    {
      name: 'ipwho',
      url: 'https://ipwho.is/',
      map: function (r) {
        if (!r || r.success === false) return null;
        return { ip: r.ip, city: r.city, state: r.region, state_code: r.region_code || '' };
      }
    },
    {
      name: 'geojs',
      url: 'https://get.geojs.io/v1/ip/geo.json',
      map: function (r) {
        if (!r) return null;
        return { ip: r.ip, city: r.city, state: r.region, state_code: '' };
      }
    },
    {
      name: 'freeipapi',
      url: 'https://freeipapi.com/api/json',
      map: function (r) {
        if (!r) return null;
        return { ip: r.ipAddress, city: r.cityName, state: r.regionName, state_code: '' };
      }
    }
  ];

  /* ---------- helpers ------------------------------------------------------ */

  function getJSON(url) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        if (!done) { done = true; reject(new Error('timeout')); }
      }, CONFIG.timeout);

      fetch(url, { method: 'GET', credentials: 'omit', cache: 'no-store' })
        .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error(res.status)); })
        .then(function (json) {
          if (done) return;
          done = true; clearTimeout(timer); resolve(json);
        })
        .catch(function (err) {
          if (done) return;
          done = true; clearTimeout(timer); reject(err);
        });
    });
  }

  function clean(v) {
    return (v == null ? '' : String(v)).replace(/["']/g, '').trim();
  }

  function isUsable(g) {
    return !!(g && (clean(g.state) || clean(g.city)));
  }

  function readCache() {
    if (!CONFIG.cache) return null;
    try {
      var raw = w.sessionStorage.getItem(CONFIG.cacheKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeCache(g) {
    if (!CONFIG.cache) return;
    try { w.sessionStorage.setItem(CONFIG.cacheKey, JSON.stringify(g)); } catch (e) {}
  }

  /* ---------- 0. URL param override ---------------------------------------- */

  function fromParams() {
    var p = new URLSearchParams(w.location.search);
    var state = p.get('state') || p.get('region') || p.get('st');
    var city = p.get('city');
    if (!state && !city) return null;
    return { city: clean(city), state: clean(state), state_code: clean(p.get('state_code')) };
  }

  /* ---------- 4. legacy: ipify -> your own PHP endpoint (state only) -------- */

  function fromLegacy() {
    return getJSON('https://api.ipify.org?format=json').then(function (r) {
      var ip = clean(r && r.ip);
      if (!ip) throw new Error('no ip');
      var el = d.getElementById('ip_address');
      if (el) el.value = ip;
      return fetch(CONFIG.legacyEndpoint + '?ip=' + encodeURIComponent(ip), { cache: 'no-store' })
        .then(function (res) { return res.text(); })
        .then(function (txt) {
          var state = clean(txt);
          if (!state) throw new Error('no state');
          return { ip: ip, city: '', state: state, state_code: '' };
        });
    });
  }

  /* ---------- runner ------------------------------------------------------- */

  function runChain(i) {
    if (i >= PROVIDERS.length) {
      return fromLegacy().catch(function () { return null; });
    }
    var p = PROVIDERS[i];
    return getJSON(p.url)
      .then(function (json) {
        var g = p.map(json);
        if (isUsable(g)) { g._src = p.name; return g; }
        return runChain(i + 1);
      })
      .catch(function () { return runChain(i + 1); });
  }

  /* ---------- render ------------------------------------------------------- */

  function render(g) {
    var ip = clean(g && g.ip);
    if (ip) {
      var ipField = d.getElementById('ip_address');
      if (ipField && !ipField.value) ipField.value = ip;
      w.LP_IP = ip;
    }

    var city = clean(g && g.city);
    var state = clean(g && g.state);
    var code = clean(g && g.state_code);
    var resolved = !!(city || state);

    var map = {
      city: city,
      state: state,
      state_code: code,
      city_state: (city && state) ? (city + ', ' + state) : (state || city)
    };

    // token nodes
    var nodes = d.querySelectorAll('[data-geo]');
    Array.prototype.forEach.call(nodes, function (n) {
      var val = map[n.getAttribute('data-geo')];
      if (val) n.textContent = val;
    });

    // legacy hooks kept alive for anything still targeting these
    if (map.city_state) {
      var byId = d.getElementById('state_name');
      if (byId && !byId.hasAttribute('data-geo')) byId.textContent = map.city_state;
    }
    if (map.state) {
      Array.prototype.forEach.call(d.querySelectorAll('.state_name'), function (n) {
        if (!n.hasAttribute('data-geo')) n.textContent = map.state;
      });
    }

    // nothing resolved -> swap in the safe copy so "(State)" never ships
    if (!resolved) {
      Array.prototype.forEach.call(d.querySelectorAll('[data-geo-fallback]'), function (n) {
        // author-controlled string, markup allowed (keeps <strong> etc.)
        n.innerHTML = n.getAttribute('data-geo-fallback');
      });
      // kill the shimmer skeleton on anything left over
      Array.prototype.forEach.call(d.querySelectorAll('[data-geo]'), function (n) {
        n.removeAttribute('data-geo');
        n.textContent = '';
      });
    }

    d.documentElement.setAttribute('data-geo-ready', resolved ? 'yes' : 'no');
    map.resolved = resolved;
    map.source = (g && g._src) || 'none';
    w.LP_GEO = map;

    try { w.dispatchEvent(new CustomEvent('geo:ready', { detail: map })); } catch (e) {}
  }

  /* ---------- boot --------------------------------------------------------- */

  function boot() {
    var override = fromParams();
    if (isUsable(override)) { override._src = 'url'; render(override); return; }

    var cached = readCache();
    if (isUsable(cached)) { render(cached); return; }

    runChain(0).then(function (g) {
      if (isUsable(g)) writeCache(g);
      render(g);
    }).catch(function () { render(null); });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window, document);
