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
      itemData.competitorBrandNameFa = dialogArguments["competitorBrandNameFa"];
      itemData.competitorBrandNameEn = dialogArguments["competitorBrandNameEn"];
      itemData.samtGroupNo = dialogArguments["samtGroupNo"];
      itemData.samtGroupName = dialogArguments["samtGroupName"];
      itemData.samtGroupPercent = dialogArguments["samtGroupPercent"];
      itemData.reportTradeMarketingId =
        dialogArguments["reportTradeMarketingId"];
      itemData.goodsId = dialogArguments["goodsId"];
      itemData.consumerPrice = dialogArguments["consumerPrice"];
      itemData.producerPrice = dialogArguments["producerPrice"];
      itemData.basePrice = dialogArguments["basePrice"];
      itemData.competitorBrandId = dialogArguments["competitorBrandId"];
      itemData.competitorConsumerPrice =
        dialogArguments["competitorConsumerPrice"];
      itemData.promotion = dialogArguments["promotion"];
      itemData.competitorPromotion = dialogArguments["competitorPromotion"];
      itemData.discount = dialogArguments["discount"];
      itemData.competitorDiscount = dialogArguments["competitorDiscount"];
      itemData.specialOffer = dialogArguments["specialOffer"];
      itemData.competitorSpecialOffer =
        dialogArguments["competitorSpecialOffer"];
      itemData.foc = dialogArguments["foc"];
      itemData.competitorFOC = dialogArguments["competitorFOC"];
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
      $("#txtConsumerPrice").val(commafy(itemData.consumerPrice));
      $("#txtProducerPrice").val(commafy(itemData.producerPrice));
      $("#txtBasePrice").val(commafy(itemData.basePrice));

      $("#txtcompetitorBrandName").val(itemData.competitorBrandNameFa);
      $("#txtCompetitorConsumerPrice").val(
        commafy(itemData.competitorConsumerPrice)
      );

      $("#txtPromotion").val(itemData.promotion);
      $("#txtCompetitorPromotion").val(itemData.competitorPromotion);
      $("#txtDiscount").val(itemData.discount);
      $("#txtCompetitorDiscount").val(itemData.competitorDiscount);
      $("#txtSpecialOffer").val(itemData.specialOffer);
      $("#txtCompetitorSpecialOffer").val(itemData.competitorSpecialOffer);
      $("#txtFOC").val(itemData.foc);
      $("#txtCompetitorFOC").val(itemData.competitorFOC);

      $("#cmbGoodsId").val(itemData.goodsId);
      $("#cmbCompetitorBrandId").val(itemData.competitorBrandId);
      //$("#cmbSamtInfoId").val(itemData.samtInfoId);

      $("#lblReportTradeMarketingId").text(itemData.reportTradeMarketingId);
    }

    return {
      init: init,
    };
  })();

  $form.init();
});

//#endregion ready.js

//#region DAL.js
const FormManager = (() => {
  // ====================== Load Custom JS =======================
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/Web/Scripts/Custom/marinaUtility.js";
  document.head.appendChild(script);

  // ====================== Private methods ======================
  //const MainURLB = "http://localhost:5113/api/"
  const ControllerURL = "Pricing/PRCompetitorBrand/";
  // ===== parseGoodsPriceList =======
  function parseGoodsPriceList(data) {
    let dataArray = getValidDataArray(data);

    const list = dataArray.map((item) => ({
      id: item.id,
      goodsId: item.goodsId,
      goodsName: item.goodsName,
      consumerPrice: item.consumerPrice,
      producerPrice: item.producerPrice,
      basePrice: item.basePrice,
    }));

    return list;
  }
  // ===== parseGoodsPriceList =======
  function parseReportTradeMarketingDetailList(data) {
    let dataArray = getValidDatalistRepotArray(data);
    const list = dataArray.map((item) => ({
      id: item.id,
      goodsName: item.goodsName,
      competitorBrandNameFa: item.competitorBrandNameFa,
      competitorBrandNameEn: item.competitorBrandNameEn,
      samtGroupNo: item.samtGroupNo,
      samtGroupName: item.samtGroupName,
      samtGroupPercent: item.samtGroupPercent,
      reportTradeMarketingId: item.reportTradeMarketingId,
      goodsId: item.goodsId,
      consumerPrice: item.consumerPrice,
      producerPrice: item.producerPrice,
      basePrice: item.basePrice,
      competitorBrandId: item.competitorBrandId,
      competitorConsumerPrice: item.competitorConsumerPrice,
      promotion: item.promotion,
      competitorPromotion: item.competitorPromotion,
      discount: item.discount,
      competitorDiscount: item.competitorDiscount,
      specialOffer: item.specialOffer,
      competitorSpecialOffer: item.competitorSpecialOffer,
      foc: item.foc,
      competitorFOC: item.competitorFOC,
      samtInfoId: item.samtInfoId,
    }));

    return list;
  }

  // ===== parseCompetitorBrand =======
  function parseCompetitorBrand(data) {
    let dataArray = getValidDataArray(data);

    const list = dataArray.map((item) => ({
      id: item.id,
      brandNameFA: item.brandNameFA,
    }));
    return list;
  }
  // ====== getValidViewModels ======
  function getValidViewModels(requestParams, onError) {
    var items =
      requestParams && requestParams.viewModels ? requestParams.viewModels : [];
    if (!items.length) {
      handleError(
        "deleteGoods",
        "No valid [viewModels] were provided for deletion.",
        onError
      );
      return [];
    }

    var validItems = [];
    for (var i = 0; i < items.length; i++) {
      var vm = items[i];
      if (vm && typeof vm.id === "number" && vm.id > 0) {
        validItems.push(vm);
      }
    }

    if (!validItems.length) {
      handleError("deleteGoods", "No valid [ID] found in viewModels", onError);
      return [];
    }

    return validItems;
  }

  // ====== getValidDataArray =======
  function getValidDataArray(data) {
    if (data && data.value && Array.isArray(data.value.data)) {
      return data.value.data;
    }

    console.warn("Invalid API response or no data:", data);
    return [];
  }
  function getValidDatalistRepotArray(data) {
    if (!data || !data.successed || !data.value || !Array.isArray(data.value)) {
      console.warn("Invalid API response or no data:", data);
      return [];
    }
    return data.value;
  }
  // ======== handleError ==========
  function handleError(methodName, error, onError) {
    const message = `An error occurred. (Method: ${methodName})`;
    console.error("Error:", message);
    console.error("Details:", error);
    if ($.isFunction(onError)) {
      onError({ message, details: error });
    } else {
      console.error(`${message} (No callback onError):`, error);
    }
  }

  // ====================== Public methods ======================
  return {
    // ========== readGoodsPrice ==========
    readGoodsPrice(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}Inventory/ISGoodsPrice/Select`;

      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        PageSize: 50,
        PageIndex: 0,
        ClientApiKey: "",
        ServiceMethodName: "",
        SortOrder: [{ Column: "Id", Direction: "ASC" }],
        FilterConditions: [],
        CustomFilters: {},
      };

      // Merge default and custom params
      const requestParams = { ...defaultParams, ...jsonParams };
      $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
          DataListRequestConfig: JSON.stringify(requestParams),
        },
        success: function (data) {
          if (data && data.successed) {
            const list = parseGoodsPriceList(data);
            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            const errorMessage = data.message || "Failed to get data from API";
            handleError("readGoodsPrice", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError("readGoodsPrice", error, onError);
        },
      });
    },
    //============= Read CompetitorBrand =====================
    readCompetitorBrand(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}Pricing/PRCompetitorBrand/Select`;

      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        PageSize: 50,
        PageIndex: 0,
        ClientApiKey: "",
        ServiceMethodName: "",
        SortOrder: [{ Column: "Id", Direction: "ASC" }],
        CustomFilters: {},
      };

      const requestParams = { ...defaultParams, ...jsonParams };

      $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
          DataListRequestConfig: JSON.stringify(requestParams),
        },
        success: function (data) {
          if (data && data.successed) {
            const list = parseCompetitorBrand(data);

            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            handleError(
              "readCompetitorBrand",
              data.message || "Failed to get data",
              onError
            );
          }
        },
        error: function (xhr, status, error) {
          handleError("readCompetitorBrand", error, onError);
        },
      });
    },
    //============= Read CompetitorBrand =====================
    readReportTradeMarketingDetail(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}Pricing/PRReportTradeMarketingDetail/GetData`;

      const defaultParams = {
        currentCompanyId: 1,
        currentUserId: "",
        customMethodName: "",
        clientApiKey: "",
        serviceMethodName: "",
        CustomFilters: {},
        viewModels: [],
      };

      const requestParams = {
        ...defaultParams,
        ...jsonParams,
      };
      $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
          DataRequestConfig: JSON.stringify(requestParams),
        },
        success: function (data) {
          if (data && data.successed) {
            const list = parseReportTradeMarketingDetailList(
              data.value?.data || data
            );
            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value?.totalCount || 0,
              });
            }
          } else {
            handleError(
              "readReportTradeMarketingDetail",
              data.message,
              onError
            );
          }
        },
        error: function (xhr, status, error) {
          handleError(
            "readReportTradeMarketingDetail",
            {
              status,
              error,
              response: xhr.responseText,
            },
            onError
          );
        },
      });
    },
  };
})();
//#endregion DAL.js
