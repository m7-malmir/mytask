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
