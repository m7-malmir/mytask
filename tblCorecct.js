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
      LoadingSpinner.show();
      let params = {
        CurrentCompanyId: 1,
        CurrentUserId: CurrentUserId,
        PageSize: pageSize,
        PageIndex: pageIndex,
        SortOrder: [currentSort],
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
        },
        function (error) {
          LoadingSpinner.hide();
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
