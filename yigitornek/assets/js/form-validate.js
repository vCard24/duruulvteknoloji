(function () {
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function isValidEmail(value) {
    return EMAIL_RE.test(String(value || "").trim());
  }

  function isValidTrPhone(value) {
    var digits = normalizePhone(value);
    if (!digits) return true;
    if (digits.indexOf("90") === 0 && digits.length === 12) {
      digits = digits.slice(2);
    } else if (digits.charAt(0) === "0" && digits.length === 11) {
      digits = digits.slice(1);
    }
    return digits.length === 10 && /^[1-9]/.test(digits);
  }

  function isValidIntlPhone(value) {
    var digits = normalizePhone(value);
    if (!digits) return true;
    return digits.length >= 7 && digits.length <= 15;
  }

  function fieldWrapper(input) {
    return (
      input.closest(".form-field") ||
      input.closest(".footer-quick-form__field") ||
      input.parentElement
    );
  }

  function clearFieldError(input) {
    var wrap = fieldWrapper(input);
    if (!wrap) return;
    wrap.classList.remove("form-field--invalid", "footer-quick-form__field--invalid");
    input.removeAttribute("aria-invalid");
    var err = wrap.querySelector(".form-field__error");
    if (err) err.remove();
  }

  function showFieldError(input, message) {
    var wrap = fieldWrapper(input);
    if (!wrap) return;
    clearFieldError(input);
    wrap.classList.add(
      wrap.classList.contains("footer-quick-form__field")
        ? "footer-quick-form__field--invalid"
        : "form-field--invalid"
    );
    input.setAttribute("aria-invalid", "true");
    var err = document.createElement("span");
    err.className = "form-field__error";
    err.setAttribute("role", "alert");
    err.textContent = message;
    wrap.appendChild(err);
  }

  function clearFormErrors(form) {
    form.querySelectorAll("input, textarea, select").forEach(clearFieldError);
  }

  function findField(form, names) {
    for (var i = 0; i < names.length; i++) {
      var el = form.querySelector('[name="' + names[i] + '"]');
      if (el) return el;
    }
    return null;
  }

  function validateForm(form) {
    var valid = true;
    var firstInvalid = null;

    var emailInput = findField(form, ["email", "E-posta"]);
    if (emailInput && !isValidEmail(emailInput.value)) {
      showFieldError(
        emailInput,
        msg("Geçerli bir e-posta adresi girin.", "يرجى إدخال بريد إلكتروني صالح.", "Enter a valid email address.")
      );
      valid = false;
      firstInvalid = firstInvalid || emailInput;
    }

    var phoneInput = findField(form, ["Telefon", "telefon", "phone"]);
    var isQuoteForm = form.classList.contains("quote-form");
    if (phoneInput) {
      var digits = normalizePhone(phoneInput.value);
      if (isQuoteForm) {
        if (digits && digits.length < 7) {
          showFieldError(
            phoneInput,
            msg("Geçerli bir telefon numarası girin.", "يرجى إدخال رقم هاتف صالح.", "Enter a valid phone number.")
          );
          valid = false;
          firstInvalid = firstInvalid || phoneInput;
        }
      } else if (isAr() || isEn() ? !isValidIntlPhone(phoneInput.value) : !isValidTrPhone(phoneInput.value)) {
        showFieldError(
          phoneInput,
          isAr()
            ? "يرجى إدخال رقم هاتف صالح (مع رمز الدولة إن أمكن)."
            : isEn()
              ? "Enter a valid phone number (with country code if possible)."
              : "Geçerli bir telefon numarası girin (ör. 05XX XXX XX XX)."
        );
        valid = false;
        firstInvalid = firstInvalid || phoneInput;
      }
    }

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  function bindForm(form) {
    if (form.getAttribute("data-yck-form-validate") === "1") return;
    form.setAttribute("data-yck-form-validate", "1");

    if (form.hasAttribute("data-contact-api")) return;

    form.addEventListener("submit", function (e) {
      clearFormErrors(form);
      if (!validateForm(form)) e.preventDefault();
    });

    form.addEventListener(
      "input",
      function (e) {
        var t = e.target;
        if (t && (t.matches("input") || t.matches("textarea"))) clearFieldError(t);
      },
      true
    );
  }

  function init() {
    document
      .querySelectorAll(".yigit-form, .footer-quick-form, .contact-quick-form")
      .forEach(bindForm);
  }

  window.yigitFormValidate = {
    bindForm: bindForm,
    validateForm: validateForm,
    init: init,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("yck-layout-ready", init);
})();
