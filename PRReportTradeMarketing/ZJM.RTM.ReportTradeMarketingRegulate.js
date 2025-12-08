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
      ReportTradeMarketingId = dialogArguments["ReportTradeMarketingId"];
      build();
    }

    // ==================== Build ====================
    function build() {
      changeDialogTitle("Add New");
      $("#lblReportTradeMarketingId").text(ReportTradeMarketingId);
      CurrentCompanyId = 1;
    }
    // =================== Return ====================
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
  const MainURLB = "http://localhost:5113/api/";
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
      const apiUrl = `${MainURLB}Inventory/ISGoodsPrice/Select`;

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
      const apiUrl = `${MainURLB}Pricing/PRCompetitorBrand/Select`;

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
      const apiUrl = `${MainURLB}Pricing/PRReportTradeMarketingDetail/GetData`;

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
      console.log(requestParams);
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
    // ========== delete PRReportTradeMarketing ==========
    deletePRReportTradeMarketing(jsonParams, onSuccess, onError) {
      const apiUrl = `${MainURLB}Pricing/PRReportTradeMarketingDetail/Delete`;
      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        ClientApiKey: "",
        ServiceMethodName: "",
        CustomParameters: {},
        viewModels: [],
      };

      // Merge default and custom params
      const requestParams = { ...defaultParams, ...jsonParams };

      // Validate viewModels and ID
      var validItems = getValidViewModels(requestParams, onError);
      if (!validItems.length) return;

      // ID are numbers
      requestParams.viewModels = validItems.map(function (vm) {
        return { id: Number(vm.id) };
      });

      $.ajax({
        url: apiUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestParams),
        success: function (data) {
          if (data && data.successed) {
            if ($.isFunction(onSuccess)) {
              onSuccess({ message: "Deleted successfully.", data: data.value });
            }
          } else {
            const errorMessage = data.message || "Data deletion failed.";
            handleError("deletePRReportTradeMarketing", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError(
            "deletePRReportTradeMarketing",
            `Error in deletion request: ${status} - ${error}`,
            onError
          );
        },
      });
    },
    // ========== addPRReportTradeMarketing ==========
    addPRReportTradeMarketing(jsonParams, onSuccess, onError) {
      const apiUrl = `${MainURLB}Pricing/PRReportTradeMarketingDetail/Add`;
      const defaultParams = {
        currentCompanyId: 1,
        currentUserId: "",
        clientApiKey: "",
        serviceMethodName: "",
        customParameters: {},
        viewModels: [],
      };
      const requestParams = { ...defaultParams, ...jsonParams };
      //console.log("AddVision params:", requestParams);
      $.ajax({
        url: apiUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestParams),
        success: function (data) {
          //console.log("AddVision response:", data);
          if (data && data.successed) {
            if ($.isFunction(onSuccess)) {
              onSuccess({
                message: "PRReportTradeMarketing added successfully.",
                data: data.value,
              });
            }
          } else {
            const errorMessage = data.message || "Failed to add focus area.";
            handleError("addPRReportTradeMarketing", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX error:", xhr.responseText);
          handleError(
            "addPRReportTradeMarketing",
            { status, error, response: xhr.responseText },
            onError
          );
        },
      });
    },
  };
})();
//#endregion DAL.js
