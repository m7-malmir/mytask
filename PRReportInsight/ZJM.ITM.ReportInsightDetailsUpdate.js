//#region ready.js
let $form;
let CurrentUserId = 0;
let itemData = {};
let reportInsightDetailId;
let reportInsightId;
let goodsId;
$(function () {
  $form = (function () {
    //=====================Init============================
    function init() {
      CurrentUserId = dialogArguments["currentUserId"];
      itemData.id = dialogArguments["id"];
      itemData.goodsName = dialogArguments["goodsName"];
      itemData.reportInsightId = dialogArguments["reportInsightId"];
      itemData.goodsId = dialogArguments["goodsId"];
      itemData.willingnessPay = dialogArguments["willingnessPay"];
      itemData.optimalPricePoint = dialogArguments["optimalPricePoint"];
      itemData.acceptablePriceRange = dialogArguments["acceptablePriceRange"];
      itemData.priceElasticityDemand = dialogArguments["priceElasticityDemand"];
      itemData.samtInfoId = dialogArguments["samtInfoId"];

      build();
    }
    function commafy(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    //=====================build============================
    function build() {
      changeDialogTitle("جزییات گزارش ترید مارکتینگ");
      reportInsightDetailId = itemData.id;
      reportInsightId = itemData.reportInsightId;
      goodsId = itemData.goodsId;
      $("#txtGoodsName").val(itemData.goodsName);
      $("#txtWillingnessPay").val(commafy(itemData.willingnessPay));
      $("#txtOptimalPricePoint").val(commafy(itemData.optimalPricePoint));
      $("#txtAcceptablePriceRange").val(commafy(itemData.acceptablePriceRange));
      $("#txtPriceElasticityDemand").val(
        commafy(itemData.priceElasticityDemand)
      );
      $("#cmbGoodsId").val(itemData.goodsId);
      $("#lblReportInsightId").text(itemData.reportInsightId);
    }

    return {
      init: init,
    };
  })();

  $form.init();
});

//#endregion ready.js

//#region btnUpdate.js
$("#btnUpdate").click(function () {
  function rcommafy(x) {
    a = x.replace(/\,/g, "");
    a = parseInt(a, 10);
    return a;
  }
  const addRows = FormManager.updatePRReportInsightDetail;
  if (
    validateRequiredFields(
      "gbxPricingReportInsight",
      "متن هشدار",
      "فیلدهای اجباری را تکمیل کنید",
      "rtl"
    )
  ) {
    // ساخت آبجکت دیتا
    let data = {
      reportInsightId: reportInsightId,
      goodsId: goodsId,
      priceElasticityDemand: rcommafy($("#txtPriceElasticityDemand").val()),
      acceptablePriceRange: rcommafy($("#txtAcceptablePriceRange").val()),
      optimalPricePoint: rcommafy($("#txtOptimalPricePoint").val()),
      willingnessPay: rcommafy($("#txtWillingnessPay").val()),
      samtInfoId: 1,
      id: reportInsightDetailId,
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
//#endregion btnUpdate.js
