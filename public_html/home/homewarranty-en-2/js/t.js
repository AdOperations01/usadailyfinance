/**
 * Tracker t.js v4 — 2026-05-19 redesign
 *
 * Three input modes:
 *   - clickid present: Mode A (direct.php already created click row; t.js update mode)
 *   - cid present: Mode B (bare-LP; t.js POSTs pageview to create click)
 *   - neither: no-op
 *
 * Single client-side fbq event: PageView (no event_id). All business events go via CAPI server-side.
 * No data-track-url CTA hijack. No event_id reconciliation needed.
 *
 * Spec: docs/superpowers/specs/2026-05-19-tracker-postback-redesign-design.md
 */

(function () {
    var _me = document.currentScript;
    var TRACKER = _me ? new URL(_me.src).origin : ((_me = document.querySelector('script[data-server]')) && _me.getAttribute('data-server')) || location.origin;
    var pending = [];

    var url = new URL(location.href);
    var clickid = url.searchParams.get('clickid') || url.searchParams.get('click_id') || url.searchParams.get('subid');
    var cid = url.searchParams.get('cid');

    if (clickid) {
        modeA(clickid);
    } else if (cid) {
        modeB(cid);
    }
    // else: no-op

    // Drain pending queue once click_id ready
    var tries = 0;
    var flushTimer = setInterval(function () {
        if (window.__trkClickId) {
            flushPending();
            clearInterval(flushTimer);
        } else if (++tries > 30) {
            clearInterval(flushTimer);
        }
    }, 500);

    function modeA(id) {
        window.__trkClickId = id;
        window.__trkServer = TRACKER;
        window.__trkCampaignId = url.searchParams.get('utm_id') || '';
        window.__trkPixelId = url.searchParams.get('utm_medium') || '';
        loadFbPixel();
        bindWaitForFbp();
        bindLpHelpers();
        bindCTALinks();
    }

    function modeB(cidVal) {
        var allParams = {};
        url.searchParams.forEach(function (v, k) { allParams[k] = v; });
        postJSON('/api/event', {
            type: 'pageview',
            cid: cidVal,
            url: location.href,
            referer: document.referrer,
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc'),
            all_params: allParams
        }).then(function (r) {
            if (!r || r.tracked === false) return;
            window.__trkClickId = r.click_id;
            window.__trkServer = TRACKER;
            window.__trkCampaignId = cidVal;
            window.__trkPixelId = url.searchParams.get('utm_medium') || '';
            loadFbPixel();
            bindWaitForFbp();
            bindLpHelpers();
            bindCTALinks();
            flushPending();
        });
    }

    function fireEvent(type, data) {
        if (window.__trkClickId) {
            postJSON('/api/event', Object.assign({type: type, click_id: window.__trkClickId}, data));
        } else {
            pending.push({type: type, data: data});
        }
    }

    function flushPending() {
        while (pending.length > 0) {
            var item = pending.shift();
            fireEvent(item.type, item.data);
        }
    }

    function bindLpHelpers() {
        window.__trkFunnel = function (stage, extras) {
            fireEvent('funnel', {stage: stage, extras: extras || {}});
        };
        window.__trkCapturePII = function (data) {
            fireEvent('pii_capture', data);
        };
        window.__trkCaptureEmail = function (email) {
            window.__trkCapturePII({email: email});
            window.__trkFunnel('lead');
        };
        window.__trkFireEvent = window.__trkFunnel;
    }

    function bindCTALinks() {
        // Patch <a class="cta" href="{TRACKER}/o/...?ck="> with current __trkClickId.
        // Runs on DOMContentLoaded or immediately if DOM already parsed.
        // Only affects links to our /o/ endpoint and only on elements with class="cta".
        function patch() {
            if (!window.__trkClickId) return;
            var ctas = document.querySelectorAll('a.cta');
            for (var i = 0; i < ctas.length; i++) {
                var a = ctas[i];
                var url;
                try {
                    url = new URL(a.href, location.href);
                } catch (e) { continue; }
                // Only patch links targeting our tracker /o/ endpoint
                if (url.host === new URL(TRACKER).host && url.pathname.indexOf('/o/') === 0) {
                    url.searchParams.set('ck', window.__trkClickId);
                    a.href = url.toString();
                }
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', patch);
        } else {
            patch();
        }
    }

    function bindWaitForFbp() {
        var t = 0;
        var poll = setInterval(function () {
            var fbp = getCookie('_fbp');
            var fbc = getCookie('_fbc');
            if (fbp || fbc) {
                fireEvent('fb_update', {fbp: fbp, fbc: fbc});
                clearInterval(poll);
            } else if (++t > 30) {
                clearInterval(poll);
            }
        }, 200);
    }

    function loadFbPixel() {
        if (!window.__trkPixelId) return;
        if (window.fbq) {
            // LP manually inited Pixel — skip to avoid double init
            return;
        }
        // FB Pixel base code (verbatim from FB docs)
        (function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
            if (!f._fbq) f._fbq = n;
            n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
            t = b.createElement(e); t.async = !0; t.src = v;
            s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', window.__trkPixelId);
        fbq('track', 'PageView');
    }

    function postJSON(path, body) {
        return fetch(TRACKER + path, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
            keepalive: true
        }).then(function (r) { return r.json(); }).catch(function () { return {}; });
    }

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : '';
    }
})();
