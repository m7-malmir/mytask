var $cmbUserPresent = null;

$(function () {
  $cmbUserPresent = $("#cmbUserPresent");

  $cmbUserPresent
    .off("select2:unselecting")
    .on("select2:unselecting", (e) => {
      const d = e.params.args.data;
      const secretaryId = String($("#txtActorIdCreator").val() || "").trim();
      // اگر آیتم دبیر جلسه بود، حذف نکن
      if (String(d.actorId || d.id || "").trim() === secretaryId) {
        e.preventDefault();
        $.alert("دبیر جلسه را نمی توانید حذف کنید.", "", "rtl");
        return;
      }
    })
    .off("select2:unselect")
    .on("select2:unselect", (e) => {
      const d = e.params.data;
      const secretaryId = String($("#txtActorIdCreator").val() || "").trim();
      if (String(d.actorId || d.id || "").trim() === secretaryId) {
        // اگر دبیر جلسه بود، اینجا کاری نکن
        return;
      }
      // چون اینجا خارج از fillComboWithService هست، باید خودت singleSelect و $combo رو مشخص کنی
      updateHiddenFields($cmbUserPresent, d.actorId, d.roleId, false);
    })
    .on("select2:open", function () {
      const $input = $(".select2-search__field");
      $input
        .off("input.fixArabic") // برای اطمینان از دوباره بایند نشدن
        .on("input.fixArabic", function () {
          const fixed = fixArabicString($(this).val());
          if ($(this).val() !== fixed) {
            $(this).val(fixed);
          }
        });
    });
});

function fixArabicString(text) {
  if (!text) return text;
  return text
    .replace(/\u06A9/g, "\u0643") // ک → ك
    .replace(/\u06CC/g, "\u064A") // ی → ي
    .replace(/\u06C0/g, "\u0647"); // ؠ → ه (اختیاری)
}

//////////////////////////////////////////////////////////////////////////

var $cmbUserPresent = null;

$(function () {
  $cmbUserPresent = $("#cmbUserPresent");

  // --- تابع پاک کردن فیلد جستجوی Select2 ---
  const clearSelect2Search = () => {
    const $search = $(".select2-search__field");
    if ($search.length) {
      $search.val("").trigger("input");
    }
  };

  // --- تابع نرمال‌سازی عربی ---
  const fixArabicString = (text) => {
    if (!text) return text;
    return text
      .replace(/\u06A9/g, "\u0643") // ک → ك
      .replace(/\u06CC/g, "\u064A") // ی → ي
      .replace(/\u06C0/g, "\u0647"); // ؠ → ه
  };

  // --- شناسایی دبیر جلسه ---
  const getSecretaryId = () => {
    const actorFieldSelector = $cmbUserPresent.data("actor-field");
    if (!actorFieldSelector) return "";
    return String($(actorFieldSelector).val() || "").trim();
  };

  const isSecretary = (d) => {
    if (!d) return false;
    const secretaryId = getSecretaryId();
    if (!secretaryId) return false;
    const id = String(d.actorId ?? d.id ?? "").trim();
    return id === secretaryId;
  };

  // --- جلوگیری از حذف دبیر ---
  const preventSecretaryUnselect = (e) => {
    const d = e.params?.data;
    if (!isSecretary(d)) return;
    e.preventDefault();
    $.alert("دبیر جلسه را نمی‌توانید حذف کنید.", "", "rtl");
  };

  // --- پردازش حذف کاربران عادی ---
  const handleUserUnselect = (e) => {
    const d = e.params?.data;
    if (d && !isSecretary(d)) {
      updateHiddenFields($cmbUserPresent, d.actorId, d.roleId, false);
    }
  };

  // --- پاک کردن متن جستجو پس از انتخاب ---
  const clearSearchAfterSelect = (e) => {
    // کمی تأخیر برای اطمینان از کامل شدن انتخاب
    setTimeout(clearSelect2Search, 10);
  };

  // --- نرمال‌سازی عربی در حین تایپ ---
  const fixArabicInput = () => {
    const $input = $(".select2-search__field");
    $input.off("input.fixArabic").on("input.fixArabic", function () {
      const val = $(this).val();
      const fixed = fixArabicString(val);
      if (val !== fixed) {
        $(this).val(fixed);
      }
    });
  };

  // --- بایند رویدادها با namespace ---
  $cmbUserPresent
    // جلوگیری از حذف دبیر
    .off("select2:unselecting.secretary")
    .on("select2:unselecting.secretary", preventSecretaryUnselect)
    // پردازش حذف کاربران عادی
    .off("select2:unselect.secretary")
    .on("select2:unselect.secretary", handleUserUnselect)
    // پاک کردن جستجو پس از انتخاب
    .off("select2:select.clearSearch")
    .on("select2:select.clearSearch", clearSearchAfterSelect)
    // فعال‌سازی نرمال‌سازی عربی هنگام باز شدن dropdown
    .off("select2:open.fixArabic")
    .on("select2:open.fixArabic", fixArabicInput);
});
=======================================================



<span class="select2-dropdown select2-dropdown--below" dir="rtl" style="width: 555px;"><span class="select2-results"><ul class="select2-results__options" role="listbox" aria-multiselectable="true" id="select2-cmbUserPresent-results" aria-expanded="true" aria-hidden="false"><li class="select2-results__option" id="select2-cmbUserPresent-result-rz7d-1" role="option" aria-selected="false" data-select2-id="select2-cmbUserPresent-result-rz7d-1">درخواست كننده درخواست كننده - كاربر خارجي</li><li class="select2-results__option" id="select2-cmbUserPresent-result-6jn4-3461" role="option" aria-selected="false" data-select2-id="select2-cmbUserPresent-result-6jn4-3461">جواد ارجمند - مدير منطقه قم - اصفهان - فارس - خوزستان</li></ul></span></span>




var $cmbUserPresent = null;

$(function () {
  $cmbUserPresent = $("#cmbUserPresent");

  // جلوگیری از حذف دبیر جلسه
  $cmbUserPresent
    .off("select2:unselecting")
    .on("select2:unselecting", (e) => {
      const d = e.params.args.data;
      const secretaryId = String($("#txtActorIdCreator").val() || "").trim();
      if (String(d.actorId || d.id || "").trim() === secretaryId) {
        e.preventDefault();
        $.alert("دبیر جلسه را نمی‌توانید حذف کنید.", "", "rtl");
        return;
      }
    })
    .off("select2:unselect")
    .on("select2:unselect", (e) => {
      const d = e.params.data;
      const secretaryId = String($("#txtActorIdCreator").val() || "").trim();
      if (String(d.actorId || d.id || "").trim() === secretaryId) return;
      updateHiddenFields($cmbUserPresent, d.actorId, d.roleId, false);
    })

    // وقتی پنجره Select2 باز می‌شود: نرمال‌سازی عربی
    .off("select2:open.fixArabic")
    .on("select2:open.fixArabic", () => {
      const $input = $(".select2-search__field");
      $input
        .off("input.fixArabic")
        .on("input.fixArabic", function () {
          const fixed = fixArabicString($(this).val());
          if ($(this).val() !== fixed) {
            $(this).val(fixed);
          }
        });
    })


    .off("select2:close.clearSearch")
    .on("select2:close.clearSearch", () => {
      setTimeout(() => {
        const $searchInput = $(".select2-search__field");
        if ($searchInput.length) {
          $searchInput.val("").trigger("input");
        }
      }, 0);
    });
});

// تابع نرمال‌سازی کاراکترهای عربی
function fixArabicString(text) {
  if (!text) return text;
  return text
    .replace(/\u06A9/g, "\u0643") // ك
    .replace(/\u06CC/g, "\u064A") // ي
    .replace(/\u06C0/g, "\u0647"); // ه
}



$(document).on("mousedown", ".select2-results__option", function (e) {
    e.stopPropagation();

    const $openSelect2 = $(".select2-container--open");
    $openSelect2.find(".select2-search__field").val("");
});





let lastValidPromotion = "";

$("#txtCompetitorVolumeDiscount").on("input", function () {
    let val = this.value;
    if (!/^[0-9.]*$/.test(val)) {
        this.value = lastValidPromotion;
        return;
    }
    if ((val.match(/\./g) || []).length > 1) {
        this.value = lastValidPromotion;
        return;
    }
    if (val !== "" && val !== ".") {
        let num = Number(val);
        if (isNaN(num) || num < 0 || num > 100) {
            this.value = lastValidPromotion;
            return;
        }
        if (num === 100 && val.includes(".")) {
            this.value = "100";
            lastValidPromotion = "100";
            return;
        }
    }
    if (val.includes(".")) {
        const [i, d] = val.split(".");
        if (d.length > 2) {
            this.value = lastValidPromotion;
            return;
        }
    }

    lastValidPromotion = this.value;
});




						var msg = ((error && error.details) ?
						    String(error.details).split('"').join('').split('\\"').join('') :
						    "حذف ناموفق بود. لطفاً دوباره امتحان کنید یا با پشتیبانی تماس بگیرید.");

						errorDialog("خطا حذف", msg, "rtl");









let __userCache = null;

function loadUsers(callback) {

    if (__userCache) {
        callback(__userCache);
        return;
    }

    FormManager.readUser({
        CurrentCompanyId: 1,
        CurrentUserId: CurrentUserId,
        PageSize: 200,
        PageIndex: 0,
        FilterConditions: [
            { Column: "Enabled", Operator: "EqualTo", Value: 1 }
        ],
        SortOrder: [
            { Column: "Id", Direction: "ASC" }
        ]
    }, function (res) {

        const list = res.list || [];


        console.log("USERS FROM SERVER:", list);

        __userCache = list.map(x => ({
            id: x.id,
            text: x.userFullName,
            _n: normalizeFa(x.userFullName)
        }));

        callback(__userCache);
    });
}



function arabicToPersian(text) {
if (!text) return text;
return text
.replace(/\u06A9/g, "\u0643") // Ú© â†’ Ùƒ
.replace(/\u06CC/g, "\u064A") // ÛŒ â†’ ÙŠ
.replace(/\u06C0/g, "\u0647") // Ø â†’ Ù‡ (Ø§Ø®ØªÛŒØ§Ø±ÛŒ)
.replace(/\u200c/g, ' '); // Ù†ÛŒÙ…â€ŒÙØ§ØµÙ„Ù‡
}
