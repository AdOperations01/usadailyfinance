(function () {
    // ─────────────────────────────────────────────
    //  CONFIGURATION — pass these in at initialise
    // ─────────────────────────────────────────────
    var CONFIG = {
        session_id: null,
        session_meta: null,
        page: null,
        endpoint: '/analytics',   // your backend endpoint
        debug: false,              // set false in production
        skip_session_start: false,
        gtag_send_to: null,                    // from getArbGtagConfig via tracking-boot
        gtag_include_transaction_id: true
    };

    var SESSION_START_FIRED_KEY = 'arb_session_start_fired';

    function hasSessionStartFired(sessionId) {
        if (!sessionId) {
            return false;
        }
        try {
            var map = JSON.parse(sessionStorage.getItem(SESSION_START_FIRED_KEY) || '{}');
            return !!map[sessionId];
        } catch (e) {
            return false;
        }
    }

    function markSessionStartFired(sessionId) {
        if (!sessionId) {
            return;
        }
        try {
            var map = JSON.parse(sessionStorage.getItem(SESSION_START_FIRED_KEY) || '{}');
            map[sessionId] = Date.now();
            sessionStorage.setItem(SESSION_START_FIRED_KEY, JSON.stringify(map));
        } catch (e) {}
    }

    // ─────────────────────────────────────────────
    //  DEVICE FINGERPRINT
    // ─────────────────────────────────────────────
    var _deviceId = null;

    // Simple djb2-style hash — fallback when crypto.subtle unavailable (HTTP)
    function _simpleHash(str) {
        var hash = 5381;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & hash; // keep 32-bit int
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }

    function _setCookie(name, value, days) {
        var expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + value + '; expires=' + expires + '; path=/; SameSite=Strict';
    }

    function _getCookie(name) {
        var match = document.cookie.split('; ').find(function (r) {
            return r.startsWith(name + '=');
        });
        return match ? match.split('=')[1] : null;
    }

    // ── UUID fallback (works everywhere, HTTP + HTTPS) ────────────────────────
    function _generateUUID() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID(); // modern HTTPS browsers
        }

        // fallback — works on HTTP and older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (window.crypto && window.crypto.getRandomValues)
                ? (window.crypto.getRandomValues(new Uint8Array(1))[0] & 15)
                : (Math.random() * 16 | 0);
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async function _computeDeviceId() {
        const KEY = '__device_id__';

        function _resolve(id) {
            _deviceId = id;
            _registerDeviceId(id);
            return id;
        }

        let id       = localStorage.getItem(KEY);
        let cookieId = _getCookie(KEY);

        if (id && cookieId && id === cookieId)  return _resolve(id);
        if (id && !cookieId)  { _setCookie(KEY, id, 365);           return _resolve(id);        }
        if (!id && cookieId)  { localStorage.setItem(KEY, cookieId); return _resolve(cookieId); }
        if (id && cookieId && id !== cookieId) { _setCookie(KEY, id, 365); return _resolve(id); }

        // Neither — generate fresh
        const newId = _generateUUID();
        localStorage.setItem(KEY, newId);
        _setCookie(KEY, newId, 365);
        return _resolve(newId);
    }

    function gtag_report_conversion(url) {
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        };
        var sendTo = CONFIG.gtag_send_to || 'AW-17577003461/pJ8HCIn336UcEMWTr71B';
        var payload = {
            'send_to': sendTo,
            'event_callback': callback
        };
        if (CONFIG.gtag_include_transaction_id) {
            payload.transaction_id = '';
        }
        gtag('event', 'conversion', payload);
        return false;
    }

    // ─────────────────────────────────────────────
    //  PUBLIC INIT
    // ─────────────────────────────────────────────
    window.Tracker = {
        init: function (options) {
            CONFIG.session_id   = options.session_id;
            CONFIG.session_meta = options.session_meta;
            CONFIG.page         = options.page || window.location.pathname;
            CONFIG.endpoint     = options.endpoint || CONFIG.endpoint;
            CONFIG.debug        = true;//options.debug !== undefined ? options.debug : CONFIG.debug;
            CONFIG.skip_session_start = options.skip_session_start === true;
            CONFIG.gtag_send_to = options.gtag_send_to || null;
            // null = use default snippet behavior (include transaction_id)
            CONFIG.gtag_include_transaction_id = (options.gtag_include_transaction_id === null || options.gtag_include_transaction_id === undefined)
                ? true
                : !!options.gtag_include_transaction_id;

            if (CONFIG.debug) {
                console.log('[Tracker] session meta', JSON.stringify(CONFIG.session_meta, null, 2));
            }

            // ── Register time-spent listeners FIRST (no network call) ────
            _registerTimeSpent();

            // ── Fire session_start once per session (client path only) ───
            var shouldFireSessionStart = !CONFIG.skip_session_start
                && CONFIG.session_id
                && !hasSessionStartFired(CONFIG.session_id);

            if (shouldFireSessionStart) {
                var sessionStartPayload = Object.assign({}, CONFIG.session_meta || {}, { origin: 'client', fired_at: new Date().toISOString() });
                sessionStartPayload.fired_at =  new Date().toISOString();
                _send('session_start', sessionStartPayload);
                markSessionStartFired(CONFIG.session_id);
            } else if (CONFIG.skip_session_start && CONFIG.session_id) {
                markSessionStartFired(CONFIG.session_id);
            }

            // Compute device fingerprint
            _registerPageLoad(); 
            // _computeDeviceId();
            _registerPageView();
            _registerScrollDepth();
            _registerButtonClicks();

            if (CONFIG.debug) {
                console.log('[Tracker] Initialised', CONFIG);
            }
        },

        updateSession: function (sessionId, sessionMeta) {
            CONFIG.session_id = sessionId;
            CONFIG.session_meta = sessionMeta;
        },

        markSessionStartHandled: function (sessionId) {
            markSessionStartFired(sessionId);
        },

        hasSessionStartFired: function (sessionId) {
            return hasSessionStartFired(sessionId);
        },

        fireSessionStartIfNeeded: function (skip) {
            if (skip || !CONFIG.session_id || hasSessionStartFired(CONFIG.session_id)) {
                if (skip && CONFIG.session_id) {
                    markSessionStartFired(CONFIG.session_id);
                }
                return;
            }
            var sessionStartPayload = Object.assign({}, CONFIG.session_meta || {}, { origin: 'client', fired_at: new Date().toISOString() });
            sessionStartPayload.fired_at =  new Date().toISOString();
            _send('session_start', sessionStartPayload);
            markSessionStartFired(CONFIG.session_id);
        }
    };

    // ─────────────────────────────────────────────
    //  CORE — raw dispatcher (no side-effects)
    //  Called by both _send AND _sendTimeSpent to
    //  avoid infinite recursion.
    // ─────────────────────────────────────────────
    function _dispatch(type, payload) {
        if (CONFIG.debug && !CONFIG.session_id) {
            console.warn('[Tracker] Call Tracker.init() before events fire.');
            return;
        }

        var event = {
            type: type,
            session_id: CONFIG.session_id,
            page: CONFIG.page,
            timestamp: new Date().toISOString(),
            payload: payload || {}
        };

        if (CONFIG.debug) {
            console.log('[Tracker] Event:', JSON.stringify(event, null, 2));
        }

        if (navigator.sendBeacon) {
            // preferred — non-blocking, survives page unload
            const formData = new FormData();
            formData.append('data', JSON.stringify(event));
            navigator.sendBeacon(CONFIG.endpoint, formData);
        } else {
            // fallback for older browsers
            fetch(CONFIG.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
                keepalive: true
            }).catch(function (err) {
                console.error('[Tracker] Send failed:', err);
            });
        }
    }

    // ─────────────────────────────────────────────
    //  CORE — public sender
    //  Calls _dispatch, then piggybacks a
    //  time_spent event on every other call.
    // ─────────────────────────────────────────────
    var _sendCallCount = 0;
    var _inTimeSpent   = false;

    function _send(type, payload) {
        _dispatch(type, payload);

        // Piggyback time_spent on every other event.
        // The _inTimeSpent guard prevents _sendTimeSpent → _dispatch
        // from triggering another piggyback (infinite loop).
        if (!_inTimeSpent) {
            _sendCallCount++;
            if (_sendCallCount % 2 === 0) {
                _inTimeSpent = true;
                _sendTimeSpent('heartbeat');
                _inTimeSpent = false;
            }
        }
    }

    // ─────────────────────────────────────────────
    //  TIME SPENT — module-level state + sender
    //  Hoisted here so _send can call _sendTimeSpent
    //  without a scoping / reference error.
    // ─────────────────────────────────────────────
    var _tsStartTime   = Date.now();
    var _tsTotalActive = 0;
    var _tsTotalHidden = 0;
    var _tsHiddenStart = null;
    var _tsIsVisible   = !document.hidden;

    function _sendTimeSpent(trigger) {
        var activeNow    = _tsIsVisible ? (Date.now() - _tsStartTime) : 0;
        var hiddenNow    = !_tsIsVisible && _tsHiddenStart ? (Date.now() - _tsHiddenStart) : 0;

        var total_ms        = _tsTotalActive + activeNow;
        var total_hidden_ms = _tsTotalHidden + hiddenNow;

        // Use _dispatch directly — bypasses the piggyback counter
        _dispatch('time_spent', {
            total_seconds:  Math.round(total_ms / 1000),
            total_ms:       total_ms,
            hidden_seconds: Math.round(total_hidden_ms / 1000),
            hidden_ms:      total_hidden_ms,
            clicked_at:     new Date().toISOString(),
            trigger:        trigger   // 'heartbeat' | 'hidden' | 'unload'
        });
    }

    // ─────────────────────────────────────────────
    //  1. DEVICE ID
    // ─────────────────────────────────────────────
    function _registerDeviceId(deviceId) {
        _send('device_id', {
            device_id: deviceId,
        });
    }

    // ─────────────────────────────────────────────
    //  2. PAGE VIEW
    // ─────────────────────────────────────────────
    function _registerPageView() {
        _send('page_view', {
            url:      window.location.href,
            referrer: document.referrer || '',
            title:    document.title    || ''
        });
    }

    // ─────────────────────────────────────────────
    //  3. SCROLL DEPTH  (milestones: 25, 50, 75, 100)
    // ─────────────────────────────────────────────
    var _scrollFired = {};

    function _registerScrollDepth() {
        var MILESTONES = [15, 25, 50, 75, 100];

        function _onScroll() {
            var scrolled = window.scrollY + window.innerHeight;
            var total    = document.documentElement.scrollHeight || 1;
            var pct      = Math.round((scrolled / total) * 100);

            MILESTONES.forEach(function (milestone) {
                if (pct >= milestone && !_scrollFired[milestone]) {
                    _scrollFired[milestone] = true;
                    _send('scroll_depth', { depth_pct: milestone });
                }
            });
        }

        window.addEventListener('scroll', _onScroll, { passive: true });
    }

    // ─────────────────────────────────────────────
    //  4. BUTTON / LINK CLICKS
    //     - All <a> tags with a "tagName" attribute
    //     - btn-amazon class — count + gtag conversion
    // ─────────────────────────────────────────────
    var _buttonClickCount   = 0;
    var _amazonClickCount   = 0;
    var _backToTopClick     = 0;
    var _compareClick       = 0;
    var _shopTopPicksClick  = 0;
    var _viewDetailsClick   = 0;
    var _logoClick          = 0;

    function _registerButtonClicks() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('a');
            if (!btn) return;

            // Amazon-specific click
            if (btn.getAttribute('tagName') == "amazon_click") {
                _amazonClickCount++;
                _send('amazon_click', { count: _amazonClickCount, clicked_at: new Date().toISOString() });
                if (typeof gtag_report_conversion === 'function') {
                    gtag_report_conversion();
                }
            }

            // All <a> tags with a "tagName" attribute
            if (btn.tagName.toLowerCase() === 'a' && btn.hasAttribute('tagName')) {
                _buttonClickCount++;
                _send('button_click', {
                    count:   _buttonClickCount,
                    tagName: btn.getAttribute('tagName'),
                    href:    btn.href || null,
                    text:    btn.innerText?.trim() || null
                });

                if (btn.getAttribute('tagName') === 'back_to_top_click') {
                    _backToTopClick++;
                    _send('back_to_top_click', { count: _backToTopClick, clicked_at: new Date().toISOString() });
                }

                if (btn.getAttribute('tagName') === 'compare_click') {
                    _compareClick++;
                    _send('compare_click', { count: _compareClick, clicked_at: new Date().toISOString() });
                }

                if (btn.getAttribute('tagName') === 'shop_top_picks_click') {
                    _shopTopPicksClick++;
                    _send('shop_top_picks_click', { count: _shopTopPicksClick, clicked_at: new Date().toISOString() });
                }

                if (btn.getAttribute('tagName') === 'view_details_click') {
                    _viewDetailsClick++;
                    _send('view_details_click', { count: _viewDetailsClick, clicked_at: new Date().toISOString() });
                }

                if (btn.getAttribute('tagName') === 'logo_click') {
                    _logoClick++;
                    _send('logo_click', { count: _logoClick, clicked_at: new Date().toISOString() });
                }
            }
        });
    }

    // ─────────────────────────────────────────────
    //  5. TIME SPENT — event listeners
    //     State lives at module scope (above).
    //     This function only wires up the listeners.
    // ─────────────────────────────────────────────
    function _registerTimeSpent() {
        var _heartbeatTimer = null;

        function _startHeartbeat() {
            _heartbeatTimer = setInterval(function () {
                _sendTimeSpent('heartbeat');
            }, 30000);
        }

        function _stopHeartbeat() {
            if (_heartbeatTimer) {
                clearInterval(_heartbeatTimer);
                _heartbeatTimer = null;
            }
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                // Page going hidden — bank active time
                _tsTotalActive += Date.now() - _tsStartTime;
                _tsHiddenStart  = Date.now();
                _tsIsVisible    = false;
                _stopHeartbeat();
                _sendTimeSpent('hidden');
            } else {
                // Page becoming visible — bank hidden time
                if (_tsHiddenStart) {
                    var hiddenDuration  = Date.now() - _tsHiddenStart;
                    _tsTotalHidden     += hiddenDuration;
                    _tsHiddenStart      = null;

                    _dispatch('hidden_time_spent', {
                        hidden_seconds:       Math.round(hiddenDuration / 1000),
                        hidden_ms:            hiddenDuration,
                        total_hidden_seconds: Math.round(_tsTotalHidden / 1000),
                        total_hidden_ms:      _tsTotalHidden
                    });
                }
                _tsStartTime = Date.now();
                _tsIsVisible = true;
                // _startHeartbeat();
            }
        });

        window.addEventListener('beforeunload', function () {
            _stopHeartbeat();
            _sendTimeSpent('unload');
        });

        // _startHeartbeat();
    }

    // ─────────────────────────────────────────────
    //  6. PAGE LOAD START / COMPLETE
    // ─────────────────────────────────────────────
    var _pageLoadStartFired    = false;
    var _pageLoadCompleteFired = false;

    function _registerPageLoad() {
        // page_load_start — fires immediately on init
        if (!_pageLoadStartFired) {
            _pageLoadStartFired = true;
            _dispatch('page_load_start', {
                url:            window.location.href,
                referrer:       document.referrer || '',
                ready_state:    document.readyState,
                fired_at:       new Date(Date.now() - serverToClientOffset).toISOString()
            });
        }

        // page_load_complete — fires on DOMContentLoaded, or immediately if already past it
        function _fireComplete() {
            if (_pageLoadCompleteFired) return;
            _pageLoadCompleteFired = true;
            _dispatch('page_load_complete', {
                url:            window.location.href,
                ready_state:    document.readyState,
                fired_at:       new Date(Date.now() - serverToClientOffset).toISOString()
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', _fireComplete, { once: true });
        } else {
            // readyState is 'interactive' or 'complete' — DOM already ready
            _fireComplete();
        }
    }

})();


// ─────────────────────────────────────────────
//  USAGE
//  Call Tracker.init() once your page loads,
//  passing session_id and page.
// ─────────────────────────────────────────────
//
//  Tracker.init({
//    session_id: 'sess_abc123',
//    page:       '/home',
//    endpoint:   '/analytics',   // optional, default '/analytics'
//    debug:      true            // optional, default true
//  });