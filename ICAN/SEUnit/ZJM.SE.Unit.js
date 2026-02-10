//#region ready.js
// ===================== Public variables =====================
let $form;
let CurrentUserId;
let CurrentCompanyId;

$(function () {
  $form = (function () {
    // ==================== Init =====================
    function init() {
      build();
      createControls();
    }

    // ==================== Build ====================
    function build() {
      changeDialogTitle("Unit");
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
        },
      );
    }

    // =================== Return ====================
    return {
      init: init,
    };
  })();
  $form.init();
});
//#endregion

//#region tbl.js
$(function () {
  tblMain = (function () {
    // ====================== Variables ======================
    const pageSize = 10;
    const readRows = FormManager.readUnit;
    let currentSort = {
      Column: "Id",
      Direction: "DESC",
    };
    let element = null;
    const columnMap = {
      1: "Id",
      2: "UnitId",
      3: "UserId",
      4: "UnitName",
      5: "FirstName",
      6: "LastName",
      7: "RoleName",
      8: "UserName",
      9: "StatusTitle",
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
      element = $("#tblUnit");
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
      // Clone the template row
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

      // Fill table cells
      let tbCheckbox = `<input type='radio' id='UnitId' name='UnitId' class="pointer" value=${rowInfo.id}>`;
      tds.eq(0).html(tbCheckbox);
      tds.eq(1).html(rowInfo.id);
      tds.eq(2).text(rowInfo.unitName);
      tds.eq(3).text(rowInfo.unitId);
      tds.eq(4).text(rowInfo.userId);
      tds.eq(5).text(rowInfo.userName);
      tds.eq(6).text(rowInfo.firstName);
      tds.eq(7).text(rowInfo.lastName);
      tds.eq(8).text(rowInfo.roleName);
      tds.eq(9).text(rowInfo.statusTitle);
      // Add the row before the template
      element.children("tbody").children("tr.row-template").before(tempRow);
    }

    // ======================== Load =========================
    function load(pageIndex = 0) {
      showLoading();

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
            });

            gridPagination(
              element,
              pageSize,
              response.totalCount || 0,
              "ltr",
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
        },
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
//#endregion

//#region DAL.js
const FormManager = (() => {
  // ====================== Load Custom JS =======================
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/Web/Scripts/Custom/marinaUtility.js";
  document.head.appendChild(script);

  // ====================== Private methods ======================
  // const MainURLB = "http://localhost:5113/api/"
  const ControllerURL = "StrategyEvaluation/SEUnit/";

  // ===== parseUnitList =======
  function parseUnitList(data) {
    let dataArray = getValidDataArray(data);

    const list = dataArray.map((item) => ({
      id: item.id,
      unitId: item.unitId,
      userId: item.userId,
      roleName: item.roleName,
      statusTitle: item.statusTitle,
      firstName: item.firstName,
      lastName: item.lastName,
      userName: item.userName,
      unitName: item.unitName,
    }));
    return list;
  }

  // ====== getValidViewModels ======
  function getValidViewModels(requestParams, onError) {
    var items =
      requestParams && requestParams.viewModels ? requestParams.viewModels : [];
    if (!items.length) {
      handleError(
        "deleteUnit",
        "No valid [viewModels] were provided for deletion.",
        onError,
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
      handleError("deleteUnit", "No valid [ID] found in viewModels", onError);
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

  // ======== handleError ==========
  function handleError(methodName, error, onError) {
    const message = `An error occurred. (Method: ${methodName})`;
    console.error("Error:", message);
    console.error("Details:", error);
    if ($.isFunction(onError)) {
      onError({
        message,
        details: error,
      });
    } else {
      console.error(`${message} (No callback onError):`, error);
    }
  }

  // ====================== Public methods ======================

  return {
    // ========== readUnit ==========
    readUnit(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}${ControllerURL}Select`;

      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        PageSize: 10,
        PageIndex: 0,
        ClientApiKey: "",
        ServiceMethodName: "",
        SortOrder: [
          {
            Column: "Id",
            Direction: "DESC",
          },
        ],
        FilterConditions: [],
        CustomFilters: {},
      };

      // Merge default and custom params
      const requestParams = {
        ...defaultParams,
        ...jsonParams,
      };

      $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
          DataListRequestConfig: JSON.stringify(requestParams),
        },
        success: function (data) {
          if (data && data.successed) {
            const list = parseUnitList(data);
            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            const errorMessage = data.message || "Failed to get data from API";
            handleError("readUnit", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError("readUnit", error, onError);
        },
      });
    },

    // ========== deleteUnit ==========
    deleteUnit(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}${ControllerURL}Delete`;
      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        ClientApiKey: "",
        ServiceMethodName: "",
        CustomParameters: {},
        viewModels: [],
      };

      // Merge default and custom params
      const requestParams = {
        ...defaultParams,
        ...jsonParams,
      };

      // Validate viewModels and ID
      var validItems = getValidViewModels(requestParams, onError);
      if (!validItems.length) return;

      // ID are numbers
      requestParams.viewModels = validItems.map(function (vm) {
        return {
          id: Number(vm.id),
        };
      });

      $.ajax({
        url: apiUrl,
        type: "Post",
        contentType: "application/json",
        data: JSON.stringify(requestParams),
        success: function (data) {
          if (data && data.successed) {
            if ($.isFunction(onSuccess)) {
              onSuccess({
                message: "Deleted successfully.",
                data: data.value,
              });
            }
          } else {
            const errorMessage = data.message || "Data deletion failed.";
            handleError("deleteUnit", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError(
            "deleteUnit",
            `Error in deletion request: ${status} - ${error}`,
            onError,
          );
        },
      });
    },
  };
})();
//#endregion

//#region tbl.js
//#endregion
