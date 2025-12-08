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

//#region btnadd.js
$("#btnAdd").click(function () {
  const addRows = FormManager.addPRReportTradeMarketing;
  let txt = $("#lblReportTradeMarketingId").text().trim();
  let reportTradeMarketingId = /^\d+$/.test(txt) ? Number(txt) : 0;
  if (validateRequiredFields("gbxPricingTradeMarketing")) {
    // ساخت آبجکت دیتا — همه فیلدها Non-Null و عددی
    let data = {
      ReportTradeMarketingId: reportTradeMarketingId,
      goodsId: parseInt($("#cmbGoodsId").val(), 10),
      consumerPrice: parseFloat($("#txtConsumerPrice").val()),
      producerPrice: parseFloat($("#txtProducerPrice").val()),
      basePrice: parseFloat($("#txtBasePrice").val()),
      competitorBrandId: parseInt($("#cmbCompetitorBrandId").val(), 10),
      competitorConsumerPrice: parseFloat(
        $("#txtCompetitorConsumerPrice").val()
      ),
      promotion: parseFloat($("#txtPromotion").val()),
      competitorPromotion: parseFloat($("#txtCompetitorPromotion").val()),
      discount: parseFloat($("#txtDiscount").val()),
      competitorDiscount: parseFloat($("#txtCompetitorDiscount").val()),
      specialOffer: parseFloat($("#txtSpecialOffer").val()),
      competitorSpecialOffer: parseFloat($("#txtCompetitorSpecialOffer").val()),
      foc: parseFloat($("#txtFOC").val()),
      competitorFOC: parseFloat($("#txtCompetitorFOC").val()),
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
    console.log(params);
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

//#endregion btnadd.js

//#region tblReportTradeMarketing.js
var info;
$(function () {
  tblMain = (function () {
    // ====================== Variables ======================
    const pageSize = 3;
    const readRows = FormManager.readReportTradeMarketingDetail;
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
      element = $("#tblReportTradeMarketing");
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
            registerKey: "ZJM.RTM.ReportTradeMarketingPopUp",
            params: {
              id: info.id,
              goodsName: info.goodsName,
              competitorBrandNameFa: info.competitorBrandNameFa,
              competitorBrandNameEn: info.competitorBrandNameEn,
              samtGroupNo: info.samtGroupNo,
              samtGroupName: info.samtGroupName,
              samtGroupPercent: info.samtGroupPercent,
              reportTradeMarketingId: info.reportTradeMarketingId,
              goodsId: info.goodsId,
              consumerPrice: info.consumerPrice,
              producerPrice: info.producerPrice,
              basePrice: info.basePrice,
              competitorBrandId: info.competitorBrandId,
              competitorConsumerPrice: info.competitorConsumerPrice,
              promotion: info.promotion,
              competitorPromotion: info.competitorPromotion,
              discount: info.discount,
              competitorDiscount: info.competitorDiscount,
              specialOffer: info.specialOffer,
              competitorSpecialOffer: info.competitorSpecialOffer,
              foc: info.foc,
              competitorFOC: info.competitorFOC,
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

      tempRow
        .show()
        .removeClass("row-template")
        .addClass("row-data")
        .data("info", rowInfo); // کلید درست اینجاست

      const tds = tempRow.children("td");

      let tbCheckbox = `<input type='radio' id='TradeMarketingId' name='TradeMarketingId' class='pointer' value='${rowInfo.id}'>`;

      tds.eq(0).html(tbCheckbox);
      tds.eq(1).text(rowInfo.id);
      tds.eq(2).text(rowInfo.goodsId);
      tds.eq(3).text(rowInfo.goodsName);
      tds.eq(4).text(rowInfo.competitorBrandNameFa);
      tds
        .eq(5)
        .html(
          '<button class="btn-action" data-id="' +
            rowInfo.reportTradeMarketingId +
            '">بازبینی</button>'
        );

      element.children("tbody").children("tr.row-template").before(tempRow);
    }

    // ======================== Load =========================
    function load(pageIndex = 0) {
      showLoading();

      let reportId = $("#lblReportTradeMarketingId").text().trim();

      // پارامترهای تو، بدون کوچکترین تغییر
      let params = {
        currentCompanyId: 1,
        currentUserId: CurrentUserId,
        customMethodName: "",
        clientApiKey: "",
        serviceMethodName: "",
        CustomFilters: {
          ReportTradeMarketingId: Number(reportId) || 0,
        },
        viewModels: [],
        PageSize: pageSize,
        PageIndex: pageIndex,
        SortOrder: [currentSort],
        FilterConditions: [],
      };

      if ($("#pagination").length === 0) {
        $("#lblPagination").html('<div id="gridPagination"></div>');
      }

      readRows(
        params,

        function (response) {
          let list = [];
          let total = 0;

          // ---- حالت 1: خروجی واقعی API مارینا ----
          if (response?.value?.data) {
            list = response.value.data;
            total = response.value.totalCount || list.length;
          }
          // ---- حالت 2: خروجی مدل قبلی (list + totalCount) ----
          else if (Array.isArray(response.list)) {
            list = response.list;
            total = response.totalCount || list.length;
          }
          // ---- حالت 3: خروجی خام readRows (آرایه) ----
          else if (Array.isArray(response)) {
            list = response;
            total = list.length;
          }

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

          closeLoading();
        },

        function (error) {
          closeLoading();
          addNoDataRow(element);
          errorDialog("Error", error.message, "rtl");
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
//#endregion tblReportTradeMarketing.js

//#region tscTradeMarketing_Delete.js
$("#tscTradeMarketing_Delete").click(function () {
  // ====================== Variables ======================
  const deleteRows = FormManager.deletePRReportTradeMarketing;
  const $checkedRadio = $("input[name='TradeMarketingId']:checked");

  // ================= Validation checkbox =================
  if ($checkedRadio.length === 0) {
    warningDialog("Warning", "لطفا حداق یک آیتم را انتخاب نمایید!", "rtl");
    return;
  }

  // ================= Get id from checkbox ================
  const $row = $checkedRadio.closest("tr");
  const id = parseInt($checkedRadio.val().trim());

  $.confirm(
    "آیا از حذف این آیتم مطمئن هستید?",
    "تایید",
    "rtl",
    function (date) {
      switch (date) {
        case "OK":
          let params = {
            CurrentCompanyId: CurrentCompanyId,
            CurrentUserId: CurrentUserId,
            ClientApiKey: "",
            ServiceMethodName: "",
            CustomParameters: {},
            viewModels: [
              {
                id: id,
              },
            ],
          };
          deleteRows(
            params,
            function (response) {
              successDialog("حذف موفق", "حذف با موفقیت انجام گردید", "rtl");
              tblMain.refresh();
            },
            function (error) {
              errorDialog("Delete Error", error.message, "rtl");
            }
          );
          break;
        case "Cancel":
        default:
          break;
      }
    }
  );

  // Change style of the confirm
  styleDialog(
    "#d35c64 url('/Cache/Images/ZJM.TCM.Contract/pcbUIWaveRed.png') 50% 50% repeat-x",
    "1px solid #d35c64",
    "white"
  );
});
//#endregion tscTradeMarketing_Delete.js

//#region cmbGoodsId.js
function fillGoodsCombo($combo, placeholderText = "انتخاب کالا") {
  $combo.select2({
    placeholder: placeholderText,
    dir: "rtl",
    minimumInputLength: 1,

    ajax: {
      delay: 200,

      transport: function (params, success, failure) {
        const term = params.data.term || "";

        const req = {
          CurrentCompanyId: 1,
          CurrentUserId: CurrentUserId,
          PageSize: 25,
          PageIndex: 0,
          SortOrder: [{ Column: "Id", Direction: "ASC" }],
          FilterConditions: [
            { Column: "GoodsName", Operator: "Contains", Value: term },
          ],
        };

        FormManager.readGoodsPrice(
          req,
          function (res) {
            const mapped = (res.list || []).map((x) => ({
              id: x.goodsId,
              goodsId: x.goodsId,
              text: x.goodsName,
              goodsName: x.goodsName,
              consumerPrice: x.consumerPrice,
              producerPrice: x.producerPrice,
              basePrice: x.basePrice,
            }));

            success({ results: mapped });
          },
          function (err) {
            failure(err);
          }
        );
      },
    },

    multiple: false,
  });

  $combo.on("select2:select", function (e) {
    const item = e.params.data;

    $("#txtConsumerPrice").val(item.consumerPrice || 0);
    $("#txtProducerPrice").val(item.producerPrice || 0);
    $("#txtBasePrice").val(item.basePrice || 0);
  });
}

$(function () {
  fillGoodsCombo($("#cmbGoodsId"), "انتخاب محصول");
});

//#endregion cmbGoodsId.js

//#region cmbCompetitorBrandId.js
function fillCompetitorBrandCombo($combo, placeholderText = "انتخاب واحد") {
  const normalizeArabic = (t) =>
    t
      ? t
          .replace(/\u06A9/g, "\u0643")
          .replace(/\u06CC/g, "\u064A")
          .replace(/\u06C0/g, "\u0647")
          .replace(/\u06BE/g, "\u0647")
      : "";

  $combo.select2({
    placeholder: placeholderText,
    dir: "rtl",
    minimumInputLength: 0,

    ajax: {
      delay: 250,

      transport: function (params, success, failure) {
        const term = params.data.term || "";
        const page = params.data.page || 0; // صفحه مورد درخواست

        let filter = [];

        // فقط موقع سرچ
        if (term.length >= 3) {
          filter.push({
            Column: "Name",
            Operator: "Contains",
            Value: term,
          });
        }

        const req = {
          CurrentCompanyId: 1,
          CurrentUserId: CurrentUserId,
          PageSize: 25,
          PageIndex: page,
          SortOrder: [{ Column: "Id", Direction: "ASC" }],
          FilterConditions: filter,
        };

        FormManager.readCompetitorBrand(
          req,
          (res) => {
            const mapped = res.list.map((x) => ({
              id: x.id,
              text: x.brandNameFA,
              searchIndex: (
                x.brandNameFA +
                " " +
                normalizeArabic(x.brandNameFA)
              ).trim(),
            }));

            success({
              results: mapped,
              pagination: {
                more: res.list.length === 25,
              },
            });
          },
          (err) => failure(err)
        );
      },
    },

    multiple: false,

    // سرچ سمت کلاینت روی نتایج واکشی شده
    matcher: function (params, data) {
      if ($.trim(params.term) === "") return data;

      const term = params.term.trim().toLowerCase();
      const norm = normalizeArabic(term);
      const search = (data.searchIndex || "").toLowerCase();

      if (search.includes(term) || search.includes(norm)) return data;

      return null;
    },
  });
}

$(function () {
  fillCompetitorBrandCombo($("#cmbCompetitorBrandId"), "انتخاب برند رقیب");
});

//#endregion cmbCompetitorBrandId.js
