$(function () {
  tblCostRequestDetails = (function () {
    // ====================== Variables ======================
    const rowNumber = 15;
    const readCostRequestDetail = FormManager.readCostRequestDetail;
    const readCostRequest = FormManager.readCostRequest;
    const primaryKeyName = "FormParams";
    let tblCostRequestDetails = null;
    let sumRequestCostPrice = 0;
    let sumConfirmCostPrice = 0;
    let element = null;
    let costRequestId;
    let inEditMode;

    init();

    // ======================= Init ==========================
    function init() {
      build();
      load();
      sortTable(element[0]);
    }

    // ======================== Build =========================
    function build() {
      element = $("#tblCostRequestDetails");
      // Make sure the template row is hidden
      element.find("tr.row-template").hide();
    }

    // ====================== Add Row ========================
    function addRow(rowInfo, index) {
      index++;

      const tbody = element.children("tbody");
      const template = tbody.children("tr.row-template");

      // Clone and prepare row
      const tempRow = template
        .clone()
        .show()
        .removeClass("row-template")
        .addClass("row-data")
        .data("rowInfo", rowInfo);

      // Get all <td> elements once
      const tds = tempRow.children("td");

      // format number with commas
      const formatNumber = (num) =>
        (num ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // شناسه
      tds.eq(0).text(rowInfo.Id);

      // شماره درخواست هزینه
      const rowDataStr = encodeURIComponent(JSON.stringify(rowInfo));
      tds
        .eq(1)
        .html(
          `<a href="javascript:showMoadlDetails('${rowDataStr}')">${index}</a>`
        );

      // تاریخ هزینه
      const [gmSD, gdSD, gySD] = rowInfo.CostDate.split("/").map((n) =>
        parseInt(n, 10)
      );
      tds.eq(2).text(convertGregorianToJalali(gySD, gmSD, gdSD));

      // نوع جزئیات هزینه
      tds.eq(3).text(rowInfo.CostRequestTypeName);

      // نوع هزینه
      tds.eq(4).text(rowInfo.CostRequestTypeDetailName);

      // جزییات هزینه
      tds.eq(5).text(rowInfo.CostRequestTypeSubDatailName);

      // مبلغ هزینه
      tds.eq(6).text(formatNumber(rowInfo.RequestCostPrice));

      // هزینه تایید شده
      const confirmCostPrice = parseFloat(rowInfo.ConfirmCostPrice ?? 0) || 0;
      tds.eq(7).text(formatNumber(confirmCostPrice));

      // كل هزينه‌ها درخواستي
      sumRequestCostPrice += parseFloat(rowInfo.RequestCostPrice) || 0;
      $("#txtTotalCosts").val(formatNumber(sumRequestCostPrice));

      // كل هزينه‌هاي مصوب
      sumConfirmCostPrice += confirmCostPrice;
      $("#txtTotalCostsConfirm").val(formatNumber(sumConfirmCostPrice));

      // Insert row
      template.before(tempRow);

      // Add pagination div once
      if (!$("#pagination-cost-request-details").length) {
        $("#lblPagination").html(
          '<div id="pagination-cost-request-details"></div>'
        );
      }

      hideLoading();
    }

    // ======================== Load =========================
    function load() {
      showLoading();

      // ================= TEST MODE – چون بک‌اند فقط ۱ ردیف می‌دهد =================
      element.find("tr.row-data").remove();
      sumRequestCostPrice = 0;
      sumConfirmCostPrice = 0;

      // ساخت ۲۰ ردیف ساختگی با استفاده از addRow واقعی
      for (let i = 0; i < 20; i++) {
        const mockRow = {
          Id: 2000 + i,
          RequestCostId: 900 + i,
          CostDate: "12/23/2025",
          CostRequestTypeName: "سایر",
          CostRequestTypeDetailName: "جزئیات تست",
          CostRequestTypeSubDatailName: "",
          RequestCostPrice: (i + 1) * 100000,
          ConfirmCostPrice: (i + 1) * 90000,
        };

        addRow(mockRow, i);
      }

      //بسیار مهم: pagination آخر کار
      pagination(element, rowNumber);

      closeLoading();
      return; //  نذار بره سراغ API
    }

    // ====================== Refresh ========================
    function refresh() {
      sumRequestCostPrice = 0;
      sumConfirmCostPrice = 0;
      element.find("tr.row-data").remove();
      load();
    }

    // ======================= Return ========================
    return {
      refresh: refresh,
      load: load,
      readRows: readCostRequestDetail,
    };
  })();
});

function load() {
  showLoading();

  let requestCostId = $("#lblCostRequestID").text().trim();
  let params = {
    Where: `CostRequestId = ${requestCostId}`,
  };

  readCostRequest(
    params,
    function (list) {
      if (Array.isArray(list) && list.length > 0) {
        list.forEach(function (row) {
          $("#txtRequestTitle").val(row.CostReuqestTitle);
          $("#txtCostRequestNo").val(row.CostRequestNo);

          $("#rpcCostRequestDetail_Refresh").css({
            left: "1189px",
          });
        });

        let params = {
          Where: `RequestCostId = ${requestCostId}`,
        };

        readCostRequestDetail(
          params,
          function (list) {
            if (Array.isArray(list) && list.length > 0) {
              // sort by CostDate
              list.sort(function (a, b) {
                let aParts = a.CostDate.split("/");
                let bParts = b.CostDate.split("/");

                let aNum = parseInt(
                  aParts[2] +
                    aParts[0].padStart(2, "0") +
                    aParts[1].padStart(2, "0")
                );

                let bNum = parseInt(
                  bParts[2] +
                    bParts[0].padStart(2, "0") +
                    bParts[1].padStart(2, "0")
                );

                return aNum - bNum;
              });

              /* ✅ فقط این قسمت اضافه شده */
              if (list.length < 20) {
                let baseList = [...list];

                while (list.length < 20) {
                  baseList.forEach(function (item) {
                    if (list.length < 20) {
                      let cloned = Object.assign({}, item);
                      cloned.__mock = true; // فقط برای دیباگ
                      list.push(cloned);
                    }
                  });
                }
              }

              list.forEach(function (row, index) {
                element.find("tr.no-data-row").remove();
                addRow(row, index);
              });

              pagination(element, rowNumber);
              closeLoading();
            } else {
              addNoDataRow(element);
              closeLoading();
              console.warn("No data received.");
            }
          },
          function (error) {
            closeLoading();
            alert(error || "خطایی رخ داده است");
          }
        );
      } else {
        closeLoading();
        $.alert("شماره درخواست یافت نشد.", "توجه", "rtl");
      }
    },
    function (error) {
      closeLoading();
      alert(error || "خطایی رخ داده است");
    }
  );
}

//=========================================================================
function load() {
  if (!CurrentUserId) {
    return;
  }

  let params; // filters with query params
  if ($("#txtSearchValue").val() != "") {
    let $selectedSearchField = $("#cmbSearchField option:selected");
    let type = $selectedSearchField.data("type");
    let searchField = $selectedSearchField.val();
    let searchValue = $("#txtSearchValue").val();

    switch (type) {
      case "string":
        params = {
          Where: `CreatorUserId = ${CurrentUserId} AND ${searchField} LIKE N'%${searchValue}%'`,
        };
        break;
      case "number":
      case "int":
      default:
        params = {
          Where: `CreatorUserId = ${CurrentUserId} AND ${searchField} LIKE N'%${searchValue}%'`,
        };
        break;
    }
  } else {
    params = {
      Where: `CreatorUserId = ${CurrentUserId}`,
    };
  }

  readCostRequest(
    params,
    function (list) {
      if (Array.isArray(list) && list.length > 0) {
        list.forEach(function (row, index) {
          // Delete the "No data recorded" row if it exists
          element.find("tr.no-data-row").remove();

          // Add row of table
          addRow(row, index + 1);
        });

        // Pagination the table
        pagination(element, rowNumber);

        // Close loading
        closeLoading();
      } else {
        closeLoading();
        addNoDataRow(element);
        console.warn("No data received.");
      }
      closeLoading();
    },
    function (error) {
      closeLoading();
      alert(error || "خطایی رخ داده است");
    }
  );
}
