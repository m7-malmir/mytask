//#region ready.js
// ===================== Public variables =====================
let $form;
let CurrentUserId;
let CurrentCompanyId;
$(function () {
  $form = (function () {
    // ==================== Init =====================
    function init() {
      CurrentUserId = dialogArguments["currentUserId"];
      PricingId = dialogArguments["PricingId"];
      build();
    }
    // ==================== Build ====================
    function build() {
      changeDialogTitle("افزودن قیمت مصرف کننده");
      $("#lblPricingId").text(PricingId);
      CurrentCompanyId = 1;
    }
    // ==================== commafy ====================
    function commafy(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // =================== Return ====================
    return {
      init: init,
    };
  })();
  $form.init();
});

//#endregion ready.js

//#region ready.js
$("#btnAdd").click(function () {
  function rcommafy(x) {
    a = x.replace(/\,/g, ""); // 1125, but a string, so convert it to number
    a = parseInt(a, 10);
    return a;
  }
  const addRows = FormManager.addPricingDetail;
  //چک کردن اینکه جزییات جدید است یا
  let txt = $("#lblPricingId").text().trim();
  let pricingId = /^\d+$/.test(txt) ? Number(txt) : 0;
  if (
    validateRequiredFields(
      "gbxPricingDetails",
      "متن هشدار",
      "فیلدهای اجباری را تکمیل کنید",
      "rtl"
    )
  ) {
    // ساخت آبجکت دیتا
    let data = {
      pricingId: pricingId,
      goodsId: parseInt($("#cmbGoodsId").val(), 10),
      NewConsumerPrice: rcommafy($("#txtNewConsumerPrice").val()),
      samtInfoId: 1,
    };

    // بسته نهایی
    let params = {
      currentCompanyId: 1,
      currentUserId: CurrentUserId,
      clientApiKey: "",
      serviceMethodName: "",
      customParameters: {},
      viewModels: [data],
    };
    addRows(
      params,
      function (response) {
        successDialog("Add Success", "Data successfully submitted", "ltr");
        closeWindow({ OK: true, Result: null });
      },
      function (error) {
        errorDialog("Add Error", error.message, "ltr");
      }
    );
  }
});

//#endregion ready.js
