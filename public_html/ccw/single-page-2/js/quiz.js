(function () {
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var progressFill = document.querySelector(".progress-fill");
  var index = 0;

  function show(i) {
    steps.forEach(function (step, si) {
      step.classList.toggle("current", si === i);
    });
    index = i;
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (progressFill) {
      var pct = (i / (steps.length - 1)) * 100;
      progressFill.style.width = pct + "%";
    }

    var role = steps[i].getAttribute("data-role");
    if (role === "checking") runChecking(steps[i]);
    if (role === "final") runFinal(steps[i]);
  }

  function advance() {
    if (index < steps.length - 1) show(index + 1);
  }

  document.querySelectorAll(".step-option").forEach(function (opt) {
    opt.addEventListener("click", function () {
      advance();
    });
  });

  function runChecking(step) {
    var messages = ["Checking your answers...", "Checking eligibility...", "Approved!"];
    var label = step.querySelector(".checking-message");
    var i = 0;
    label.textContent = messages[0];
    var timer = window.setInterval(function () {
      i += 1;
      if (i < messages.length) {
        label.textContent = messages[i];
      } else {
        window.clearInterval(timer);
        window.setTimeout(advance, 500);
      }
    }, 900);
  }

  function runFinal(step) {
    var link = step.querySelector(".survey-link");
    var count = step.querySelector(".countdown");
    var seconds = 5;

    if (count) count.textContent = seconds;

    var timer = window.setInterval(function () {
      seconds -= 1;
      if (seconds > 0) {
        if (count) count.textContent = seconds;
      } else {
        window.clearInterval(timer);
        if (link) link.click();
      }
    }, 1000);
  }

  show(0);
})();
