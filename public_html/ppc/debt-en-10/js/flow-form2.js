const results = {};
window.addEventListener("DOMContentLoaded", function () {
  const hideOnLastbox = document.querySelectorAll(".hide-on-lastbox");
  const quizDivs = document.querySelectorAll(".quiz");
  const config = document.querySelector("#amount-config")?.dataset;

  if (config.hidecta === "yes") {
    document.querySelector(".elementor-location-header").style.display = "none";
  }

  quizDivs.forEach((div) => {
    const barToFill = div.querySelector(".bar-fill");
    const boxMove = div.querySelectorAll(".move");
    const stepBox = div.querySelectorAll(".step");
    const debtAmount = div.querySelector(".amount")?.textContent;
    const finalBox = div.querySelector(".final-box");
    const backBtn = div.querySelector(".go-back-btn");
    const thankyouDiv = div.querySelector(".thank-you");

    // for Disclaimer Shortcode
    const arrowBtn = div.querySelector(".arrow-btn");
    arrowBtn?.addEventListener("click", () => {
      arrowBtn.classList.toggle("rotate");
      arrowBtn.nextElementSibling.classList.toggle("hide");
    });

    // Progress Bar
    let count = 1;
    function barIncrement() {
      count++;
      barToFill.style.width = `${(count * 100) / stepBox.length}%`;
    }
    function barDecrement() {
      count--;
      barToFill.style.width = `${(count * 100) / stepBox.length}%`;
    }
    const previous = (box) => {
      box.classList.add("hide");
      box.previousElementSibling.classList.remove("hide");
      if (box.previousElementSibling.dataset.step == "livingStatus") {
        backBtn.classList.add("hide");
      }
    };

    backBtn.addEventListener("click", () => {
      const box = div.querySelector(".step:not(.hide)");
      barDecrement();
      previous(box);
    });

    const next = (box) => {
      box.classList.add("hide");
      box.nextElementSibling.classList.remove("hide");

      if (box.nextElementSibling.classList.contains("auto")) {
        finalBox.classList.add("hide");
        setTimeout(next, 1000, box.nextElementSibling);
      }

      if (box.classList.contains("instantdisqualify") && results.debtValue === "$0-$10000") {
        thankyouDiv.innerHTML = `
          <h2>Thanks for Checking!</h2>
          <p><strong>Based on your answers, it looks like you don’t qualify for this program at this time.</strong></p>
          <p>
            This program is designed for individuals facing
            <strong>${debtAmount} or more in credit card debt.</strong>
          </p>
          <p>
            Since your current balance is below that amount, you’re not eligible right now — but that’s not a bad thing. It simply means this specific program may not be the right fit at the moment. 
          </p>
        `;
        box.nextElementSibling.classList.add("box");
        barToFill.closest(".progress").style.display = "none";
        backBtn.classList.add("hide");
      }

      const qualified = thankyouDiv.querySelector(".qualified");
      const disqualified = thankyouDiv.querySelector(".disqualified");

      if (results.debtValue && qualified && disqualified) {
        if (results.debtValue === "$0-$10000") {
          qualified.remove();
          disqualified.classList.add("auto-cr");
        } else {
          disqualified.remove();
        }
      }

      const nextFinalBox = box.nextElementSibling.classList.contains("disqualify");

      if (nextFinalBox) {
        if (results.debtValue === "$0-$10000" && results.debtPayments === "No") {
          thankyouDiv.innerHTML = `
          <h2>Thanks for Checking!</h2>
          <p><strong>Based on your answers, it looks like you don’t qualify for this program at this time.</strong></p>
          <p>This program is designed for individuals facing <strong>${debtAmount} or more in credit card debt.</strong> & <strong>current on their payments.</strong>
          </p>
          <p>Since your current balance is below that amount and you’re not current on payments, you’re not eligible right now — but that’s not a bad thing. It simply means this specific program may not be the right fit at the moment.</p>
        `;
        } else if (results.debtValue === "$0-$10000") {
          thankyouDiv.innerHTML = `
          <h2>Thanks for Checking!</h2>
          <p><strong>Based on your answers, it looks like you don’t qualify for this program at this time.</strong></p>
          <p>This program is designed for individuals facing <strong>${debtAmount} or more in credit card debt.</strong></p>
          <p>Since your current balance is below that amount, you’re not eligible right now — but that’s not a bad thing. It simply means this specific program may not be the right fit at the moment.</p>
        `;
        } else if (results.debtPayments === "No") {
          thankyouDiv.innerHTML = `
          <h2>Thanks for Checking!</h2>
          <p><strong>Based on your answers, it looks like you don’t qualify for this program at this time.</strong></p>
          <p>This program is designed for individuals who are <strong>current on their payments.</strong></p>
          <p>Since you are not current on payments, you’re not eligible right now — but that’s not a bad thing. It simply means this specific program may not be the right fit at the moment.</p>
        `;
        }
      }

      if (!thankyouDiv.classList.contains("hide")) {
        if (disqualified && disqualified.classList.contains("auto-cr")) {
          ringba.replacer = undefined;
          ringba.SetupNumberReplacement();

          document.body.classList.add("cr");
          document.querySelector(".header-cta-green.debt").classList.add("hide");
          document.querySelector(".header-cta-green.cr").classList.remove("hide");
        }
        const display = div.querySelector("#timer");
        startTimer(60 * 2, display);
      }
    };

    const debtPayments = div.querySelector('.step[data-step="debtPayments"]');
    const creditScore = div.querySelector('.step[data-step="creditScore"]');
    const scoreBoost = div.querySelector('.step[data-step="scoreBoost"]');
    const income = div.querySelector('.step[data-step="income"]');
    const disqualifiedAutoCR = thankyouDiv.querySelector(".disqualified");

    boxMove.forEach((box, idx) => {
      const step = box.dataset.step;
      const boxBtn = box.querySelectorAll(".btn button");

      boxBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
          barIncrement();

          results[step] = btn.value.replace(/\s/g, "").replace(/,/g, "");

          if (step == "livingStatus") {
            backBtn.classList.remove("hide");
          }

          if (step == "debtValue" && debtPayments && creditScore && scoreBoost && income) {
            if (btn.textContent.trim() == "Yes") {
              creditScore.remove();
              scoreBoost.remove();
              income.remove();
            } else {
              debtPayments.remove();
            }
          }

          next(box);

          if (box.nextElementSibling.classList.contains("auto")) {
            backBtn.classList.add("hide");

            setTimeout(() => {
              barToFill.closest(".progress").style.display = "none";
              hideOnLastbox.forEach((box) => {
                box.classList.add("hide");
              });
            }, 2000);

            if (results.debtValue === "$10000+") {
              gtag("event", "conversion", {
                send_to: "AW-16515592872/dTjbCIe0nbIZEKjln8M9",
              });
              snapTrackEvent("ADD_CART");
            } else {
              snapTrackEvent("SUBSCRIBE");
            }

            dataLayer.push({
              event: "cc-debt-form-submit",
              data: {
                ...results,
                uuid: sessionStorage.getItem("uuid"),
              },
            });

            snapTrackEvent("START_CHECKOUT");
          }
        });
      });
    });
  });

  document.querySelectorAll("a[href^='tel:']").forEach((link) => {
    link.addEventListener("click", function () {
      if (results.debtValue === "$10000+") {
        gtag("event", "conversion", {
          send_to: "AW-16515592872/NsChCL-VnbIZEKjln8M9",
        });
      }

      dataLayer.push({
        event: "cc-debt-form-click-to-call",
        data: {
          ...results,
          uuid: sessionStorage.getItem("uuid"),
        },
      });
    });
  });
});
