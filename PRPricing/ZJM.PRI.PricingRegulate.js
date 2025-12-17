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

//#region tblPricing
var info;
$(function () {
  tblMain = (function () {
    // ====================== Variables ======================
    const pageSize = 3;
    const readRows = FormManager.readPricingDetail;
    let currentSort = { Column: "Id", Direction: "DESC" };
    let element = null;
    const columnMap = {
      1: "Id",
      2: "GoodsCode",
      3: "GoodsName",
      4: "BrandNameFA",
      5: "Action",
    };
    // Calling init
    init();

    // ======================= Init ==========================
    function init() {
      build();
      bindEvents();
    }
    // ======================= Build ==========================
    function build() {
      element = $("#tblPricing");
      // Make sure the empty row is hidden
      element.find("tr.row-template").hide();
    }
    // ==================== Bind Events ======================
    function bindEvents() {
      const headers = element.find(".row-header td");
      headers.each(function (index) {
        const header = $(this);
        if (header.text().trim() !== "") {
          header.addClass("sortable");
          header.on("click", function () {
            const column = columnMap[index];
            if (column) {
              if (currentSort.Column === column) {
                if (currentSort.Direction === "ASC") {
                  currentSort = { Column: column, Direction: "DESC" };
                } else if (currentSort.Direction === "DESC") {
                  currentSort = { Column: "Id", Direction: "DESC" };
                } else {
                  currentSort = { Column: column, Direction: "ASC" };
                }
              } else {
                currentSort = { Column: column, Direction: "ASC" };
              }

              headers.removeClass("asc desc");

              const currentHeader = headers.filter(function () {
                return columnMap[$(this).index()] === currentSort.Column;
              });
              if (currentSort.Direction === "ASC") {
                currentHeader.addClass("asc");
              } else if (currentSort.Direction === "DESC") {
                currentHeader.addClass("desc");
              }

              refresh();
            }
          });
        }
      });
      //============== POP UP =============
      $(document).on("click", ".btn-action", function () {
        const $btn = $(this);
        const $row = $btn.closest("tr");

        const info = $row.data("info"); // الان کلید درست است

        if (!info) {
          warningDialog("خطا", "اطلاعات ردیف یافت نشد", "rtl");
          return;
        }

        $.showModalForm(
          {
            registerKey: "ZJM.RTM.ReportInsightDetailsPopUp",
            params: {
              id: info.id,
              goodsName: info.goodsName,
              reportInsightId: info.reportInsightId,
              willingnessPay: info.willingnessPay,
              optimalPricePoint: info.optimalPricePoint,
              acceptablePriceRange: info.acceptablePriceRange,
              priceElasticityDemand: info.priceElasticityDemand,
              samtInfoId: info.samtInfoId,
            },
          },
          function (retVal) {
            tblMain.refresh();
          }
        );
      });
      //===================================
    }
    // ====================== Add Row ========================
    function addRow(rowInfo) {
      const tempRow = element
        .children("tbody")
        .children("tr.row-template")
        .clone();
      function commafy(x) {
        x = x.toString().replace(/,/g, ""); // حذف کاماهای قبلی
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      tempRow
        .show()
        .removeClass("row-template")
        .addClass("row-data")
        .data("info", rowInfo); // کلید درست اینجاست

      const tds = tempRow.children("td");

      let tbCheckbox = `<input type='radio' id='PricingId' name='PricingId' class='pointer' value='${rowInfo.id}'>`;

      tds.eq(0).html(tbCheckbox);
      tds.eq(1).text(rowInfo.id);
      tds.eq(2).text(rowInfo.goodsId);
      tds.eq(3).text(rowInfo.goodsName);
      tds.eq(4).text(commafy(rowInfo.newConsumerPrice));
      element.children("tbody").children("tr.row-template").before(tempRow);
    }

    // ======================== Load =========================
    function load(pageIndex = 0) {
      let pricingId = Number($("#lblPricingId").text().trim()) || 0;

      if (pricingId <= 0) {
        addNoDataRow(element);
        return;
      }

      let params = {
        CurrentCompanyId: 1,
        CurrentUserId: CurrentUserId,

        PageSize: pageSize,
        PageIndex: pageIndex,

        SortOrder: [
          {
            Column: "Id",
            Direction: "DESC",
          },
        ],

        FilterConditions: [
          {
            Column: "PricingId",
            Operator: "EqualTo",
            Value: pricingId,
          },
        ],

        CustomFilters: {},
      };

      if ($("#gridPagination").length === 0) {
        $("#lblPagination").html('<div id="gridPagination"></div>');
      }

      readRows(
        params,
        function (result) {
          let list = result.list || [];
          let total = result.totalCount || 0;

          element.find(".row-data").remove();

          if (list.length > 0) {
            element.find("tr.no-data-row").remove();
            list.forEach(addRow);

            gridPagination(
              element,
              pageSize,
              total,
              "ltr"
            )(total, pageIndex + 1);
          } else {
            addNoDataRow(element);
            gridPagination(element, pageSize, 0, "ltr")(0, 1);
          }

          LoadingSpinner.hide();
          closeLoading();
        },
        function (error) {
          LoadingSpinner.hide();
          closeLoading();
          addNoDataRow(element);
          errorDialog("Error", error.message || error, "rtl");
        }
      );
    }

    // ====================== Refresh ========================
    function refresh() {
      // Remove all rows with class 'row-data' directly
      if (element && element.length) {
        element.find(".row-data").remove();
      }
      load();
    }

    // ======================= Return ========================
    return {
      refresh: refresh,
      load: load,
      readRows: readRows,
    };
  })();
  tblMain.load();
});
//#endregion tblPricing

//#region  Form.DAL.js
const FormManager = (() => {
  // ====================== Load Custom JS =======================
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/Web/Scripts/Custom/marinaUtility.js";
  document.head.appendChild(script);

  // ====================== Private methods ======================
  const MainURLB = "http://localhost:5113/api/";
  const ControllerURL = "Pricing/PRReportInsightDetail/";
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
  // ===== parsePricingDetailList =======
  function parsePricingDetailList(data) {
    let dataArray = getValidDataArray(data);
    const list = dataArray.map((item) => ({
      id: item.id,
      pricingId: item.pricingId,
      goodsId: item.goodsId,
      goodsName: item.goodsName,
      newConsumerPrice: item.newConsumerPrice,
      isManagerAccepted: item.isManagerAccepted,
      isCEOAccepted: item.isCEOAccepted,
      isDeleted: item.isDeleted,
      description: item.description,
      samtInfoId: item.samtInfoId,
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
  function getValidDatalistArray(data) {
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
    // ========== Read GoodsPrice ==========
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
    //============= Read ReportTradeMarketingDetail =====================
    readPricingDetail(jsonParams, onSuccess, onError) {
      const apiUrl = `${MainURLB}Pricing/PRPricingDetail/Select`;

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
            const list = parsePricingDetailList(data);

            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            handleError(
              "readPricingDetail",
              data.message || "Failed to get data",
              onError
            );
          }
        },
        error: function (xhr, status, error) {
          handleError("readPricingDetail", error, onError);
        },
      });
    },
    // ========== Delete ReportInsightDetail ==========
    deletePricingDetail(jsonParams, onSuccess, onError) {
      const apiUrl = `${MainURLB}Pricing/PRPricingDetail/Delete`;
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
              onSuccess({ message: "با موفقیت حذف شد", data: data.value });
            }
          } else {
            const errorMessage = data.message || "Data deletion failed.";
            handleError("deletePricingDetail", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError(
            "deletePricingDetail",
            `Error in deletion request: ${status} - ${error}`,
            onError
          );
        },
      });
    },
    // ========== addReportInsight ==========
    addPricingDetail(jsonParams, onSuccess, onError) {
      const apiUrl = `${MainURLB}Pricing/PRPricingDetail/Add`;
      const defaultParams = {
        currentCompanyId: 1,
        currentUserId: "",
        clientApiKey: "",
        serviceMethodName: "",
        customParameters: {},
        viewModels: [],
      };

      const requestParams = { ...defaultParams, ...jsonParams };
      $.ajax({
        url: apiUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestParams),
        success: function (data) {
          if (data && data.successed) {
            if ($.isFunction(onSuccess)) {
              onSuccess({ message: "با موفقیت افزوده شد.", data: data.value });
            }
          } else {
            const errorMessage =
              data.message || "Failed to add PRReportTradeMarketing area.";
            handleError("addReportInsight", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX error:", xhr.responseText);
          handleError(
            "addReportInsight",
            { status, error, response: xhr.responseText },
            onError
          );
        },
      });
    },
  };
})();
//#endregion  Form.DAL.js

//#region ready.js

//#endregion ready.js

//#region ready.js

//#endregion ready.js

//#region ready.js

//#endregion ready.js
