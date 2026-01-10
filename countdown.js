document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // GLOBAL STATE
  // ===============================
  let targetUTC = null;
  let countdownInterval = null;
  let celebrationTimeout = null;

  // DOM references
  const dEl = document.getElementById("days");
  const hEl = document.getElementById("hours");
  const mEl = document.getElementById("mins");
  const sEl = document.getElementById("secs");

  const celebrationSection = document.getElementById("celebration");
  const celebrationSpans = celebrationSection.querySelectorAll("span");

  // ===============================
  // CELEBRATION EMOJI PREP
  // ===============================
  function prepareCelebrationEmojis() {
    celebrationSpans.forEach(span => {
      const sway = Math.random() * 30 - 15;
      const delay = Math.random() * 5;
      span.style.setProperty("--sway", sway + "px");
      span.style.animationDelay = delay + "s";
    });
  }
  prepareCelebrationEmojis();

  // ===============================
  // COUNTDOWN LOGIC
  // ===============================
  let initialUTCTime = null;
  let initialLocalTime = null;

  async function initializeCountdown(birthdayUTC) {
    targetUTC = new Date(birthdayUTC);

    try {
      const res = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
      const json = await res.json();
      initialUTCTime = new Date(json.utc_datetime);
      initialLocalTime = new Date();
    } catch {
      initialUTCTime = new Date();
      initialLocalTime = new Date();
    }

    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // immediate first update
  }

  function updateCountdown() {
    if (!targetUTC || !initialUTCTime || !initialLocalTime) return;

    const nowLocal = new Date();
    const elapsed = nowLocal - initialLocalTime;
    const utcNow = new Date(initialUTCTime.getTime() + elapsed);

    const diff = targetUTC - utcNow;

    if (diff <= 0) {
      dEl.textContent = "0";
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";

      celebrationSection.style.visibility = "visible";
      celebrationSection.style.opacity = "1";

      if (celebrationTimeout) clearTimeout(celebrationTimeout);
      celebrationTimeout = setTimeout(() => {
        celebrationSection.style.opacity = "0";
        celebrationSection.style.visibility = "hidden";
      }, 10000);
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    dEl.textContent = days;
    hEl.textContent = hours.toString().padStart(2, "0");
    mEl.textContent = mins.toString().padStart(2, "0");
    sEl.textContent = secs.toString().padStart(2, "0");

    celebrationSection.style.opacity = "0";
    celebrationSection.style.visibility = "hidden";
  }

  // ===============================
  // EXPORT FUNCTION TO LOAD FROM HTML
  // ===============================
  window.loadCountdownFor = initializeCountdown;

}); // end DOMContentLoaded
