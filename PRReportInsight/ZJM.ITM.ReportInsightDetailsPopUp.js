//#region ready.js
let $form;
let CurrentUserId = 0;
let itemData = {};

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

//#endregion

//#region

//#endregion
