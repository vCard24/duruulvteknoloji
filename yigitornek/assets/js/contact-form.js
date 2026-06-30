(function () {
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

  function root() {
    return document.body.getAttribute("data-root") || "";
  }

  function isLocalDev() {
    var h = window.location.hostname;
    return h === "localhost" || h === "127.0.0.1";
  }

  function apiEndpoint(path) {
    if (/^https?:\/\//i.test(path)) return path;
    return new URL(path.charAt(0) === "/" ? path : "/" + path, window.location.origin).href;
  }

  function parseApiJson(text) {
    var raw = String(text || "").trim();
    if (!raw) return null;
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    try {
      return JSON.parse(raw);
    } catch (e1) {
      var start = raw.indexOf("{");
      var end = raw.lastIndexOf("}");
      if (start >= 0 && end > start) {
        try {
          return JSON.parse(raw.slice(start, end + 1));
        } catch (e2) {}
      }
    }
    return null;
  }

  function apiUrl(form) {
    var custom = form.getAttribute("data-contact-api");
    if (custom) return apiEndpoint(custom);
    return apiEndpoint("/api/send-contact.php");
  }

  function fieldValue(form, names) {
    for (var i = 0; i < names.length; i++) {
      var el = form.querySelector('[name="' + names[i] + '"]');
      if (el && String(el.value || "").trim()) return String(el.value).trim();
    }
    return "";
  }

  function collectName(form) {
    var full = fieldValue(form, ["Ad Soyad", "name"]);
    if (full) return full;
    var ad = fieldValue(form, ["Ad"]);
    var soyad = fieldValue(form, ["Soyad"]);
    return [ad, soyad].filter(Boolean).join(" ");
  }

  function setStatus(form, message, type) {
    var el = form.querySelector(".contact-form-status");
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
    el.className = "contact-form-status" + (type ? " contact-form-status--" + type : "");
  }

  function setBusy(form, busy) {
    var btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    btn.disabled = busy;
    if (busy) {
      if (!btn.getAttribute("data-label")) btn.setAttribute("data-label", btn.textContent);
      btn.textContent = msg("Gönderiliyor…", "جاري الإرسال…", "Sending…");
    } else if (btn.getAttribute("data-label")) {
      btn.textContent = btn.getAttribute("data-label");
    }
  }

  function thanksHref() {
    try {
      if (isAr()) {
        return new URL("../شكرا-لكم/index.html", window.location.href).href;
      }
      return new URL("../tesekkurler/index.html", window.location.href).href;
    } catch (_e) {
      if (isAr()) return root() + "ar/شكرا-لكم/index.html";
      if (isEn()) return root() + "en/tesekkurler/index.html";
      return root() + "tesekkurler/index.html";
    }
  }

  function submitForm(form) {
    setBusy(form, true);
    setStatus(form, msg("Gönderiliyor…", "جاري الإرسال…", "Sending…"), "info");

    var payload = {
      name: collectName(form),
      email: fieldValue(form, ["email", "E-posta"]),
      phone: fieldValue(form, ["Telefon", "telefon", "phone"]),
      message: fieldValue(form, ["Mesaj", "message"]),
      source: form.getAttribute("data-form-source") || "web",
      honey: fieldValue(form, ["_honey"]),
    };

    return fetch(apiUrl(form), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.text().then(function (text) {
          var body = parseApiJson(text);
          if (!body) {
            throw new Error(
              msg(
                "Sunucu yanıtı okunamadı (HTTP " + res.status + ").",
                "تعذّر قراءة رد الخادم (HTTP " + res.status + ").",
                "Could not read server response (HTTP " + res.status + ")."
              )
            );
          }
          if (!res.ok || !body.ok) {
            throw new Error(
              (body && body.error) ||
                msg("Mesaj gönderilemedi.", "تعذّر إرسال الرسالة.", "Message could not be sent.")
            );
          }
          return body;
        });
      })
      .then(function (body) {
        if (isLocalDev() && body.saved) {
          window.open("/api/outbox/" + encodeURIComponent(body.saved), "_blank", "noopener,noreferrer");
        }
        setStatus(form, msg("Mesajınız gönderildi. Yönlendiriliyorsunuz…", "تم إرسال رسالتك. جاري التحويل…", "Your message was sent. Redirecting…"), "success");
        window.setTimeout(function () {
          window.location.href = thanksHref();
        }, 1200);
      })
      .catch(function (err) {
        var errMsg =
          (err && err.message) ||
          msg(
            "Mesaj gönderilemedi. Lütfen +90 352 311 55 41 numarasından bizi arayın.",
            "تعذّر إرسال الرسالة. يرجى الاتصال على +90 352 311 55 41.",
            "Message could not be sent. Please call us at +90 352 311 55 41."
          );
        setStatus(form, errMsg, "error");
        window.alert(errMsg);
      })
      .finally(function () {
        setBusy(form, false);
      });
  }

  function bindForm(form) {
    if (form.getAttribute("data-yck-contact-form") === "1") return;
    form.setAttribute("data-yck-contact-form", "1");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (
        window.yigitFormValidate &&
        typeof window.yigitFormValidate.validateForm === "function" &&
        !window.yigitFormValidate.validateForm(form)
      ) {
        return;
      }
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      submitForm(form);
    });

    form.addEventListener(
      "input",
      function (e) {
        var t = e.target;
        if (!t || (!t.matches("input") && !t.matches("textarea"))) return;
        var wrap =
          t.closest(".footer-quick-form__field") ||
          t.closest(".contact-quick-form__field") ||
          t.parentElement;
        if (!wrap) return;
        wrap.classList.remove("footer-quick-form__field--invalid", "form-field--invalid");
        t.removeAttribute("aria-invalid");
        var err = wrap.querySelector(".form-field__error");
        if (err) err.remove();
      },
      true
    );
  }

  function init() {
    document
      .querySelectorAll(".footer-quick-form[data-contact-api], .contact-quick-form[data-contact-api]")
      .forEach(bindForm);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("yck-layout-ready", init);
})();
