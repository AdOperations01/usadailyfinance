/*
  AUTO INSURANCE PRE-LANDER
  --------------------------------
  Replace OFFER_URL below with your ClickFlare/offer URL.

  Optional ClickFlare macros can be appended to OFFER_URL, for example:
  ?subid={subid}&zip={zip}

  Meta Pixel:
  Replace YOUR_PIXEL_ID in the HTML if you want to install your pixel.
*/

const OFFER_URL = "https://globalvisitclub.com/cf/click/1";

function isValidZip(zip) {
  return /^\d{5}$/.test(zip);
}

function goToOffer(zip) {
  // Store the ZIP locally so it can be passed to the next step.
  sessionStorage.setItem("auto_rate_zip", zip);

  // Fire your Meta event here if required.
  // Example:
  // if (window.fbq) fbq("trackCustom", "AutoRateCheck", {zip});

  if (OFFER_URL && OFFER_URL !== "YOUR_CLICKFLARE_OR_OFFER_URL") {
    const separator = OFFER_URL.includes("?") ? "&" : "?";
    window.location.href = `${OFFER_URL}${separator}zip=${encodeURIComponent(zip)}`;
  } else {
    // Development fallback.
    document.querySelectorAll(".error").forEach(el => {
      el.textContent = "Demo mode: replace OFFER_URL in script.js with your offer/tracking URL.";
    });
  }
}

function attachZipForm(formId, inputId, errorId) {
  const form = document.getElementById(formId);
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const zip = input.value.trim();

    if (!isValidZip(zip)) {
      error.textContent = "Please enter a valid 5-digit ZIP code.";
      input.focus();
      return;
    }

    error.textContent = "";
    goToOffer(zip);
  });
}

attachZipForm("zipForm", "zip", "zipError");

document.getElementById("finalForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("zip2");
  const zip = input.value.trim();

  if (!isValidZip(zip)) {
    input.setCustomValidity("Please enter a valid 5-digit ZIP code.");
    input.reportValidity();
    return;
  }

  input.setCustomValidity("");
  goToOffer(zip);
});
