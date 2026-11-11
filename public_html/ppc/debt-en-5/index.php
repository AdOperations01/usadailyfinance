<?php
/* ============================================================
   BUILD debt-en-5-v4 :: congratulations box + congrats audio
   (the #eligibility CTA block is hidden once the box appears)
   ------------------------------------------------------------
   Triggers: header "CHECK ELIGIBILITY" + the YES / NO buttons on the
   $15,000 question. All of them open the congratulations box and play
   the audio.
   ============================================================ */

$ctaUrl = '#eligibility';

/* ---------- CONGRATULATIONS BOX CONFIG ---------- */
$phoneDisplay = '(877) 348-0120';                                  // <-- SET YOUR NUMBER
$phoneTel     = '+18773480120';                                    // <-- and the tel: version
$audioUrl     = 'https://usadailyfinance.com/congrats_audio.mp3';
$timerSeconds = 90;                                                // countdown start
$agentsFree   = 1;
/* ------------------------------------------------ */
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Explore Debt Relief Options</title>
<meta name="description" content="Explore potential debt relief options and check whether you may qualify.">
<link rel="stylesheet" href="assets/style.css?v=2">

<!-- Congratulations box styles are inlined so a cached assets/style.css
     can never break them. -->
<style>
/* ---- eligibility question + YES / NO ---- */
.q-title{
  font-size:19px;font-weight:700;line-height:1.35;
  color:#15181d;text-align:center;margin:18px 0 14px!important;
}
.q-amt{color:#1f9e6b}

.q-options{
  display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 12px;
}
.q-btn{
  display:block;width:100%;
  font-family:inherit;font-size:18px;font-weight:700;letter-spacing:.5px;
  padding:16px 10px;border-radius:8px;cursor:pointer;
  transition:transform .08s ease,box-shadow .08s ease;
}
.q-btn:active{transform:translateY(3px)}
.q-yes{
  background:#24ad77;color:#fff;border:0;box-shadow:0 4px 0 0 #1a8258;
}
.q-yes:active{box-shadow:0 1px 0 0 #1a8258}
.q-no{
  background:#eef1f4;color:#39414a;border:1px solid #d7dde3;box-shadow:0 4px 0 0 #d3dae0;
}
.q-no:active{box-shadow:0 1px 0 0 #d3dae0}

.q-offer{
  text-align:center;font-size:13px;color:#6b7280;margin:0 0 4px!important;
}
.q-offer strong{color:#a8790a}

@media(max-width:600px){
  .q-title{font-size:17px}
  .q-btn{font-size:16px;padding:14px 8px}
}

.final{display:none}
.final.is-visible{display:block}

.final{
  margin:22px 0 5px;
  background:#fff;
  border:1px solid #e3e7ea;
  border-top:5px solid #41b883;
  border-radius:14px;
  padding:26px 20px 22px;
  text-align:center;
  box-shadow:0 12px 30px rgba(20,30,25,.13);
  animation:finalIn .45s ease-out both;
}
@keyframes finalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

.final__headline{
  font-family:"Bitter",Georgia,"Times New Roman",serif;
  font-weight:700;font-size:24px;line-height:1.27;
  color:#15181d;margin:0 0 16px;letter-spacing:-.1px;
}
.final__appid{font-size:16px;color:#6b7280;margin:0 0 15px}
.final__appid strong{color:#15181d;font-weight:700}
.final__sub{font-size:17px;color:#3a4149;margin:0 0 13px}

.final__avail{
  font-size:15px;font-weight:700;color:#1f8f63;margin:0 0 15px;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
.final__dot{
  width:10px;height:10px;border-radius:50%;background:#24ad77;
  display:inline-block;flex:0 0 auto;animation:finalPulse 2s ease-out infinite;
}
@keyframes finalPulse{
  0%{box-shadow:0 0 0 0 rgba(36,173,119,.55)}
  70%{box-shadow:0 0 0 9px rgba(36,173,119,0)}
  100%{box-shadow:0 0 0 0 rgba(36,173,119,0)}
}

.final__cta{
  display:flex;align-items:center;justify-content:center;gap:10px;
  width:100%;padding:16px 12px;box-sizing:border-box;
  font-size:24px;font-weight:700;line-height:1.1;
  color:#fff;text-decoration:none;
  background:#24ad77;border-radius:8px;
  box-shadow:0 4px 0 0 #1a8258;
  margin:0 0 16px;
  transition:transform .08s ease,box-shadow .08s ease;
}
.final__cta:active{transform:translateY(3px);box-shadow:0 1px 0 0 #1a8258}
.final__cta-icon{width:22px;height:22px;flex:0 0 auto}

.final__note{font-size:15px;line-height:1.45;color:#6b7280;margin:0 0 16px}

.final__timer{
  background:#fdf2f2;border:1px solid #f5d9d9;border-radius:10px;
  padding:16px 14px;max-width:300px;margin:0 auto;
}
.final__timer-num{
  font-size:48px;line-height:1;font-weight:700;color:#d15353;
  font-variant-numeric:tabular-nums;margin-bottom:6px;
}
.final__timer-label{
  font-size:12px;font-weight:700;letter-spacing:1.1px;
  text-transform:uppercase;color:#8a8f98;
}
.final__timer.is-expired{background:#f2f8f5;border-color:#dcebe3}
.final__timer-expired{font-size:15px;line-height:1.45;color:#4b5563;margin:0}

@media(max-width:600px){
  .final{padding:20px 15px 18px}
  .final__headline{font-size:21px}
  .final__cta{font-size:20px}
  .final__timer-num{font-size:42px}
}
</style>

 <!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '2862053604126930');
fbq('init', '1257511942488593');
fbq('track', 'PageView');
fbq('track', 'ViewContent');
</script>

<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=2862053604126930&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->

<script src=//b-js.ringba.com/CA4e777c3eb13245c9bb03a3065b8aa23e async></script> 

<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wi7360htn4");
</script>
  

</head>
<body>
<div class="page">
  <header class="header">
    <div class="brand">Debt Relief Options</div>
    <a href="<?= htmlspecialchars($ctaUrl) ?>" class="header-cta" data-congrats>CHECK ELIGIBILITY</a>
  </header>

  <main>
    <section class="intro">
      <h1>Americans Are Eliminating Their Debt with this little Debt Relief Trick </h1>
      <p class="subhead">A Simple Way to See If You May Qualify for Debt Relief Options</p>
    </section>

    <section class="hero">
      <img src="assets/hero-debt.jpg?1" alt="Debt relief concept with money and debt-free message">
    </section>

    <section class="content">
      <p>If you're carrying <strong>$15,000+ in unsecured debt</strong>, you may have options that could help reduce financial pressure and make your monthly payments more manageable.</p>
      <p>Credit cards, personal loans, medical bills, and other unsecured debts can quickly become difficult to handle. <strong>Depending on your situation and state, debt relief programs may be available.</strong></p>

      <h2>Who is Eligible for this Program?</h2>
      
      <ul class="checks">
        <li>You have <strong>$15,000 or more in unsecured debt</strong></li>
        <li>You're struggling with high-interest balances or monthly payments</li>
        <li>You have credit card, personal loan, or medical debt</li>
        <li>You live in a state where participating programs are available</li>
      </ul>

      <section class="highlight">
        <h3>Could You Qualify for Debt Relief?</h3>
        <p>Every situation is different. The best way to find out what options may be available is to complete a quick eligibility check.</p>
        <p><strong>You could discover potential options to lower your monthly financial burden.</strong></p>
      </section>

      <section id="eligibility" class="eligibility">
        <h2>How Do I Check My Eligibility?</h2>
        <p>It only takes a few moments to answer a few basic questions.</p>

        <p class="q-title">Do you have more than <span class="q-amt">$15,000</span> in Credit Card or Personal loan Debt?</p>

        <div class="q-options">
          <button type="button" class="q-btn q-yes" data-congrats>YES</button>
          <button type="button" class="q-btn q-no" data-congrats>NO</button>
        </div>

        <p class="q-offer"><strong>Limited Time Offer:</strong> Verify your eligibility today</p>

        <p class="disclaimer">No obligation to check. Eligibility and program availability vary by individual circumstances and state.</p>
      </section>

      <!-- ===================================================
           CONGRATULATIONS BOX  (hidden until a CTA is tapped)
           =================================================== -->
      <section class="final" id="final">
        <h2 class="final__headline">🎉 Congratulations! You may pre-qualify for a call with a licensed debt relief specialist to see how much of your unsecured debt could be reduced.</h2>

        <p class="final__appid">Application #<strong id="application_id">C000000</strong></p>

        <p class="final__sub">Tap the button below to speak with your assigned specialist.</p>

        <p class="final__avail"><span class="final__dot"></span><span id="agents_available"><?= (int)$agentsFree ?></span> licensed specialist available now</p>

        <a href="tel:<?= htmlspecialchars($phoneTel) ?>" class="final__cta" id="final_call">
          <svg class="final__cta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>
          <span>Call <span class="final__phone"><?= htmlspecialchars($phoneDisplay) ?></span></span>
        </a>

        <p class="final__note">We're experiencing high call volume. Your assigned specialist is reserved for you for the time shown below &mdash; after that, they'll move on to the next caller.</p>

        <div class="final__timer" id="final_timer">
          <div class="final__timer-num" id="timer_seconds"><?= (int)$timerSeconds ?></div>
          <div class="final__timer-label">Seconds Remaining</div>
        </div>
      </section>

      <div class="trust">
        <div class="stars">★★★★★</div>
        <strong>Trusted Experience</strong>
      </div>
    </section>
  </main>

  <footer>
    This is an advertising/lead-generation page and is not a government website. We do not provide government benefits. Results are not guaranteed. Debt relief services, if available, are provided by third parties and may have fees, eligibility requirements and other terms.
  </footer>
</div>

<!-- =====================================================================
     CONGRATULATIONS AUDIO  (build audio-v1)
     Trigger on this page: both CTAs ([data-congrats])
     ===================================================================== -->
<audio id="congratsAudio" src="<?= htmlspecialchars($audioUrl) ?>" preload="auto"></audio>
<script>
(function (w, d) {
  'use strict';

  /* ---------------- CONFIG ---------------- */
  var SELECTOR      = '[data-congrats]';
  var PLAY_AFTER_MS = 0;      /* 0 = play the instant the button is tapped. */
  var PLAY_ONCE     = true;   /* the header CTA stays on screen after the box
                                 opens - this stops the sound replaying if it
                                 is tapped again. */
  /* ---------------------------------------- */

  var el = d.getElementById('congratsAudio');
  if (!el) return;

  var unlocked = false, played = false;

  function rewind() {
    try { if (el.readyState > 0) el.currentTime = 0; } catch (e) {}
  }

  function play() {
    rewind();
    var p;
    try { p = el.play(); } catch (e) { return; }
    if (p && p.catch) p.catch(function (err) {
      console.warn('[congrats audio] blocked or failed:', err && err.name);
    });
  }

  /* iOS/Safari only allow playback that starts inside a user gesture. */
  function unlockThenPlayLater() {
    var p;
    try { p = el.play(); } catch (e) { return; }
    if (p && p.then) {
      p.then(function () {
        el.pause(); rewind(); unlocked = true;
        setTimeout(play, PLAY_AFTER_MS);
      }).catch(function () {
        setTimeout(play, PLAY_AFTER_MS);
      });
    } else {
      el.pause(); rewind();
      setTimeout(play, PLAY_AFTER_MS);
    }
  }

  d.addEventListener('click', function (e) {
    var hit = e.target && e.target.closest ? e.target.closest(SELECTOR) : null;
    if (!hit) return;
    if (PLAY_ONCE && played) return;
    played = true;
    if (PLAY_AFTER_MS > 0 && !unlocked) unlockThenPlayLater();
    else if (PLAY_AFTER_MS > 0) setTimeout(play, PLAY_AFTER_MS);
    else play();
  }, true); /* capture phase so it fires before anything can stop propagation */

  w.playCongrats = function () { played = true; play(); };   /* console test hook */
})(window, document);
</script>

<!-- =====================================================================
     CONGRATULATIONS BOX CONTROLLER
     ===================================================================== -->
<script>
(function (w, d) {
  'use strict';

  var BUILD         = 'debt-en-5-v4';
  var HIDE_ON_SHOW  = '#eligibility';   /* hidden once the box appears:
                                           the "How Do I Check My Eligibility?"
                                           heading, its text, the $15,000
                                           question, the YES / NO buttons and
                                           the disclaimer.
                                           Add ', .header-cta' to also hide the
                                           button in the top bar. */
  var TIMER_SECONDS = <?= (int)$timerSeconds ?>;
  var TIMER_PERSIST = true;    /* refresh does NOT restart the countdown */
  var APP_PREFIX    = 'C';
  var APP_DIGITS    = 6;
  var TIMER_EXPIRED = 'Your specialist is still on the line &mdash; tap the button above to connect.';

  var shown = false;

  var SS = {
    get: function (k) { try { return w.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { w.sessionStorage.setItem(k, v); } catch (e) {} }
  };

  function applicationId() {
    var k = 'lp_app_id', c = SS.get(k);
    if (c) return c;
    var min = Math.pow(10, APP_DIGITS - 1);
    var id = APP_PREFIX + Math.floor(min + Math.random() * (min * 9));
    SS.set(k, id);
    return id;
  }

  function startTimer() {
    var box = d.getElementById('final_timer'), num = d.getElementById('timer_seconds');
    if (!box || !num) return;
    var k = 'lp_timer_start';
    var t0 = TIMER_PERSIST ? parseInt(SS.get(k), 10) : NaN;
    if (!t0 || isNaN(t0)) { t0 = Date.now(); if (TIMER_PERSIST) SS.set(k, String(t0)); }

    function tick() {
      var left = TIMER_SECONDS - Math.floor((Date.now() - t0) / 1000);
      if (left <= 0) {
        clearInterval(iv);
        box.className = 'final__timer is-expired';
        box.innerHTML = '<p class="final__timer-expired">' + TIMER_EXPIRED + '</p>';
        return;
      }
      num.textContent = left;
    }
    tick();
    var iv = setInterval(tick, 1000);
  }

  /* the serif headline font is only needed once the box appears */
  function loadFont() {
    if (d.getElementById('final_font')) return;
    var l = d.createElement('link');
    l.id = 'final_font';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Bitter:wght@600;700&display=swap';
    d.head.appendChild(l);
  }

  function showFinal() {
    if (shown) return;
    shown = true;

    var card = d.getElementById('final');
    if (!card) return;

    loadFont();

    /* hide the eligibility CTA block so the box replaces it */
    Array.prototype.forEach.call(d.querySelectorAll(HIDE_ON_SHOW), function (n) {
      n.style.display = 'none';
    });

    var idEl = d.getElementById('application_id');
    if (idEl) idEl.textContent = applicationId();

    card.className = card.className.replace(/\bis-visible\b/g, '') + ' is-visible';
    startTimer();

    try { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    catch (e) { card.scrollIntoView(); }

    console.log('[' + BUILD + '] congratulations box shown');
  }

  d.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-congrats]') : null;
    if (!btn) return;
    e.preventDefault();
    if (shown) {
      /* box is already open - just take them back to it */
      var c = d.getElementById('final');
      if (c) { try { c.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (err) { c.scrollIntoView(); } }
      return;
    }
    showFinal();
  }, false);

  /* QA: ?final=1 opens the box straight away */
  function boot() {
    if (new URLSearchParams(w.location.search).get('final') === '1') showFinal();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();

  w.LP_BUILD = BUILD;
  w.showFinal = showFinal;
  console.log('%c LP BUILD ' + BUILD + ' ', 'background:#24ad77;color:#fff;font-weight:700');

})(window, document);
</script>

<script>
document.addEventListener('click', function(event) {
    const telLink = event.target.closest('a[href^="tel:"]');

    if (telLink) {
        fbq('track', 'AddToCart', {
            content_name: 'Debt Relief Call',
            content_category: 'Pay Per Call'
        });
    }
});
</script>

</body>
</html>
