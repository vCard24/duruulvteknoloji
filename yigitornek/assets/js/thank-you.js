(function () {
  var REDIRECT_SECONDS = 8;

  function isAr() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "ar";
  }

  function isEn() {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase() === "en";
  }

  function msg(tr, ar, en) {
    if (isAr()) return ar;
    if (isEn()) return en || tr;
    return tr;
  }

  function getHomeHref() {
    try {
      if (isAr()) {
        return new URL("../index.html", window.location.href).href;
      }
      if (isEn()) {
        return new URL("../index.html", window.location.href).href;
      }
      return new URL("../index.html", window.location.href).href;
    } catch (_e) {
      var root = document.body.getAttribute("data-root") || "";
      if (isAr()) return root + "ar/index.html";
      if (isEn()) return root + "en/index.html";
      return root + "index.html";
    }
  }

  function initThankYouRedirect() {
    var countdownEl = document.getElementById("thank-you-countdown");
    var liveEl = document.getElementById("thank-you-live");
    if (!countdownEl) return;

    var remaining = REDIRECT_SECONDS;
    var homeHref = getHomeHref();

    function announce() {
      var text =
        remaining > 0
          ? msg(
              remaining + " saniye içinde ana sayfaya yönlendirileceksiniz.",
              "سيتم تحويلك إلى الصفحة الرئيسية خلال " + remaining + " ثانية.",
              "You will be redirected to the home page in " + remaining + " seconds."
            )
          : msg("Ana sayfaya yönlendiriliyorsunuz.", "جاري التحويل إلى الصفحة الرئيسية.", "Redirecting to the home page.");
      if (liveEl) liveEl.textContent = text;
    }

    function tick() {
      countdownEl.textContent = String(remaining);
      announce();
      if (remaining <= 0) {
        window.location.href = homeHref;
        return;
      }
      remaining -= 1;
      window.setTimeout(tick, 1000);
    }

    tick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThankYouRedirect);
  } else {
    initThankYouRedirect();
  }
})();
