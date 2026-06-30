function updateSidebarCompareCount() {
  if (window.yigitCompare) {
    window.yigitCompare.updateBadges();
  }
}

function toggleCompareFromList(productId, checkbox) {
  var compare = window.yigitCompare;
  if (!compare) return;

  var id = Number(productId);
  var ids = compare.getIds();
  var inList = ids.indexOf(id) !== -1;

  if (checkbox && checkbox.checked && !inList) {
    var result = compare.toggle(id);
    if (result.action === "limited" && checkbox) checkbox.checked = false;
    return;
  }

  if (checkbox && !checkbox.checked && inList) {
    compare.toggle(id);
    return;
  }

  if (!checkbox) {
    compare.toggle(id);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var compare = window.yigitCompare;
  if (!compare) return;

  compare.updateBadges();
  var compareList = compare.getIds();
  document.querySelectorAll(".compare-checkbox").forEach(function (checkbox) {
    var productId = parseInt(checkbox.dataset.productId || "0", 10);
    var card = checkbox.closest(".product-card-full");
    if (card && !checkbox.getAttribute("aria-label")) {
      var titleEl = card.querySelector(".product-title-card, .product-code-card");
      var label = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "Ürün";
      checkbox.setAttribute("aria-label", label + " karşılaştırmaya ekle");
    }
    checkbox.checked = compareList.indexOf(productId) !== -1;
    checkbox.addEventListener("change", function () {
      toggleCompareFromList(productId, checkbox);
    });
  });
});

window.addEventListener("storage", updateSidebarCompareCount);
window.addEventListener("yck-compare-change", updateSidebarCompareCount);
