//#region ready.js
// ===================== Public variables =====================
let $form;
let CurrentUserId;
let CurrentCompanyId;
let isInTestMode = false;
$(function () {
  $form = (function () {
    // ==================== Init =====================
    function init() {
      build();
      createControls();
    }
    // ==================== Build ====================
    function build() {
      changeDialogTitle("قیمت گذاری");
    }
    // ==================== isInTestMode =====================
    function isInTestMode() {
      try {
        const parentUrl = window.parent?.location?.href;
        const url = new URL(parentUrl);

        // If 'icantestmode' is 1 then return True
        return url.searchParams.get("icantestmode") === "1";
      } catch (e) {
        console.warn("Cannot reach parent document:", e);
        return false;
      }
    }
    // =============== CreateControls ================
    function createControls() {
      UserService.GetCurrentUser(
        true,
        function (data) {
          const xml = $.xmlDOM(data);
          const userInfo = {
            id: xml.find("user > id").text().trim(),
            username: xml.find("user > username").text().trim(),
            firstname: xml.find("user > firstname").text().trim(),
            lastname: xml.find("user > lastname").text().trim(),
            logintime: xml.find("user > logintime").text().trim(),
            delegatedactorid: xml.find("user > delegatedactorid").text().trim(),
            theme: xml.find("user > theme").text().trim(),
            actors: [],
          };

          xml.find("user > actors > actor").each(function () {
            const $actor = $(this);
            const actorInfo = {
              pk: $actor.attr("pk"),
              roleid: $actor.find("roleid").text().trim(),
              rolename: $actor.find("rolename").text().trim(),
              rolecode: $actor.find("rolecode").text().trim(),
              isdefault: $actor.find("isdefault").text().trim() === "True",
            };
            userInfo.actors.push(actorInfo);
          });

          const defaultActor = userInfo.actors.find((actor) => actor.isdefault);
          const roleid = defaultActor ? defaultActor.roleid : "";

          CurrentUserId = `${userInfo.id},${roleid},${userInfo.username}`;
          CurrentCompanyId = 1; // Default

          /*
           * After setting the variable 'CurrentUserId',
           * the table is refreshed by passing its values.
           */
          tblMain.refresh();
        },
        function (err) {
          $ErrorHandling.Erro(err, "خطا در سرویس getCurrentActor");
          CurrentCompanyId = 1;
          tblMain.load();
        }
      );
    }

    // ================ Run Workflow ===================
    $("#tblPricing").on("click", "a.workflow-link", function (e) {
      e.preventDefault();
      LoadingSpinner.show();
      const row = $(this).closest("tr");
      const requestId = row.find('input[name="PricingId"]').val();
      const dcid = "-1";

      const contentXml = `<Content>
		        <Id>${requestId}</Id>
				<CompanyId>${CurrentCompanyId}</CompanyId>
				<DCId>${dcid}</DCId>
				<IsInTestMode>${isInTestMode()}</IsInTestMode>
		    </Content>`;
      WorkflowService.RunWorkflow(
        "ZJM.PRI.PricingProcess",
        contentXml,
        true,
        function () {
          LoadingSpinner.hide();
          tblMain.refresh();
        },
        function (err) {
          LoadingSpinner.hide();
          handleError(err, "ZJM.PRI.PricingProcess");
        }
      );
    });
    // =================== Return ====================
    return {
      init: init,
    };
  })();
  $form.init();
});
//#endregion ready.js

//#region tbl.js
$(function () {
  tblMain = (function () {
    // ====================== Variables ======================
    const pageSize = 10;
    const readRows = FormManager.readPricing;
    let currentSort = {
      Column: "Id",
      Direction: "DESC",
    };
    let element = null;
    const columnMap = {
      1: "Id", //Id
      // 2: "InnerRegNumber",	//innerRegNumber
      3: "FullName", //fullName
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
                  currentSort = {
                    Column: column,
                    Direction: "DESC",
                  };
                } else if (currentSort.Direction === "DESC") {
                  currentSort = {
                    Column: "Id",
                    Direction: "DESC",
                  };
                } else {
                  currentSort = {
                    Column: column,
                    Direction: "ASC",
                  };
                }
              } else {
                currentSort = {
                  Column: column,
                  Direction: "ASC",
                };
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
    }
    // ====================== Add Row ========================
    function addRow(rowInfo) {
      const tempRow = element
        .children("tbody")
        .children("tr.row-template")
        .clone();

      // Prepare the row
      tempRow
        .show()
        .removeClass("row-template")
        .addClass("row-data")
        .data("rowInfo", rowInfo);

      // Get all <td> elements once
      const tds = tempRow.children("td");
      const colorFlowTitle =
        String(rowInfo.processStatus).trim() === "15" ? "#008000" : "#337AB7";
      const htmlTextColor = `<span style="color:${colorFlowTitle} !important;">${
        rowInfo.workFlowTitle || ""
      }</span>`;
      let args = `${rowInfo.Id}`;
      let tbCheckbox = `<input type='radio' id='PricingId' name='PricingId' class='pointer' value='${rowInfo.id}'>`;

      tds.eq(0).html(tbCheckbox);
      tds.eq(1).text(rowInfo.id);
      tds.eq(2).text(rowInfo.fullName);
      tds.eq(3).text(rowInfo.createdDateShamsi);
      tds.eq(4).html(htmlTextColor);
      tds.eq(5).text(rowInfo.innerRegNumber);
      if (rowInfo.processStatus == 1) {
        tds
          .eq(6)
          .html(
            `<a href="#" class="workflow-link" data-status="${rowInfo.ProcessStatus}" id="${args}">ارسال</a>`
          );
      } else {
        tds.eq(6).html(`<span  class="workflow-link">ارسال شده</span>`);
      }

      element.children("tbody").children("tr.row-template").before(tempRow);
    }

    // ======================== Load =========================
    function load(pageIndex = 0) {
      //LoadingSpinner.show();

      let params = {
        CurrentCompanyId: CurrentCompanyId,
        CurrentUserId: CurrentUserId,
        PageSize: pageSize,
        PageIndex: pageIndex,
        SortOrder: [currentSort],
        FilterConditions: [],
        CustomFilters: {},
      };

      if ($("#txtSearchValue").val().trim() !== "") {
        let $selectedSearchField = $("#cmbSearchField option:selected");
        let searchField = $selectedSearchField.val();
        let searchValue = $("#txtSearchValue").val().trim();
        const fieldType = $selectedSearchField.data("type") || "string";
        const sqlOperator = fieldType === "string" ? "Contains" : "EqualTo";
        const filterValue =
          sqlOperator === "Contains" ? `%${searchValue}%` : searchValue;
        params.FilterConditions = [
          {
            Column: searchField,
            Operator: sqlOperator,
            Value: filterValue,
          },
        ];
      }

      // Append div htlm (pagination)
      if ($("#pagination").length === 0) {
        $("#lblPagination").html('<div id="gridPagination"></div>');
      }

      readRows(
        params,
        function (response) {
          const list = Array.isArray(response.list) ? response.list : response;
          element.find(".row-data").remove();
          if (Array.isArray(list) && list.length > 0) {
            // Delete the "No data recorded" row if it exists
            element.find("tr.no-data-row").remove();

            list.forEach(function (row) {
              addRow(row);
              LoadingSpinner.hide();
            });

            gridPagination(
              element,
              pageSize,
              response.totalCount || 0,
              "ltr"
            )(response.totalCount || 0, pageIndex + 1);
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
});
//#endregion tbl.js

//#region tscTradeMarketing_Add.js
$("#tscTradeMarketing_Add").click(function () {
  $.showModalForm(
    {
      registerKey: "ZJM.PRI.PricingRegulate",
      params: { currentUserId: CurrentUserId },
    },
    function (retVal) {
      tblMain.refresh();
    }
  );
});
//#endregion tscTradeMarketing_Add.js

//#region tscTradeMarketing_Edit.js
$("#tscTradeMarketing_Edit").click(function () {
  // ====================== Variables ======================
  const $checkedRadio = $("input[name='PricingId']:checked");

  // ================= Validation checkbox =================
  if ($checkedRadio.length === 0) {
    warningDialog("Warning", "لطفا حداقل یک آیتم را انتخاب نمایید!", "rtl");

    return;
  }

  // ================= Get id from checkbox ================
  const $row = $checkedRadio.closest("tr");
  const id = parseInt($checkedRadio.val().trim());

  $.showModalForm(
    {
      registerKey: "ZJM.PRI.PricingRegulate",
      params: { PricingId: id, currentUserId: CurrentUserId },
    },
    function (retVal) {
      tblMain.refresh();
    }
  );
});
//#endregion tscTradeMarketing_Edit.js

//#region tscTradeMarketing_Delete.js
$("#tscTradeMarketing_Delete").click(function () {
  // ====================== Variables ======================
  const deleteRows = FormManager.deletePricing;
  const $checkedRadio = $("input[name='PricingId']:checked");

  // ================= Validation checkbox =================
  if ($checkedRadio.length === 0) {
    warningDialog("Warning", "لطفا حداقل یک آیتم را انتخاب نمایید!", "rtl");
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
              errorDialog(
                "خطا",
                "لطفاً ابتدا جزئیات گزارش را حذف نمایید.",
                "rtl"
              );
              //console.log("Delete Error", error.message, "rtl")
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
