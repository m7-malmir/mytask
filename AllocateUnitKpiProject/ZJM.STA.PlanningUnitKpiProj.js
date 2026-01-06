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
      // Implementing the functions with Promise
      createControls();
    }

    // ==================== Build ====================
    function build() {
      LoadingSpinner.show();
      changeDialogTitle("Planning Unit KPI And Project");
    }
    // =============== CreateControls (Promise) ================
    function createControls() {
      return new Promise((resolve, reject) => {
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
              delegatedactorid: xml
                .find("user > delegatedactorid")
                .text()
                .trim(),
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
            const defaultActor = userInfo.actors.find(
              (actor) => actor.isdefault
            );
            const roleid = defaultActor ? defaultActor.roleid : "";
            CurrentUserId = `${userInfo.id},${roleid},${userInfo.username}`;
            CurrentCompanyId = 1;

            tblMain.refresh();

            resolve();
          },
          function (err) {
            $ErrorHandling.Erro(err, "خطا در سرویس getCurrentActor");
            CurrentCompanyId = 1;
            tblMain.load();
            reject(err);
          }
        );
      });
    }

    // ==================== isInTestMode =====================
    function isInTestMode() {}

    // ================ getPrimaryKey ================
    function getPrimaryKey() {
      return pk;
    }

    // =================== Return ====================
    return {
      init: init,
      getPK: getPrimaryKey,
    };
  })();
  $form.init();
});
//#endregion

//#region tblPlanningUnitKpiProj.js
$(function () {
  tblMain = (function () {
    // ====================== Variables ======================
    const pageSize = 10;
    const readRows = FormManager.readPlaningKpiProj;
    let currentSort = {
      Column: "Id",
      Direction: "DESC",
    };
    let element = null;
    const columnMap = {
      1: "Id", //Id
      2: "InnerRegNumber", //innerRegNumber
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
      LoadingSpinner.show();
      element = $("#tblPlanningUnitKpiProj");
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

      // Event Delegation
      element
        .off("click", ".btn-kpi, .btn-project")
        .on("click", ".btn-kpi, .btn-project", function () {
          // Get the closest row and its data
          const $row = $(this).closest("tr");
          const rowInfo = $row.data("rowInfo"); // We saved it in addRow()

          if (!rowInfo) {
            warningDialog("Error", "Row information not found.", "ltr");
            return;
          }

          const planningId = rowInfo.id;
          const unitId = rowInfo.unitId;
          const processStatus = parseInt(rowInfo.processStatus, 10);
          const canEdit = processStatus === 1 || processStatus === 15;
          const isKPI = $(this).hasClass("btn-kpi");

          // Choose correct form based on status and type
          let registerKey;

          if (canEdit) {
            // User can edit
            registerKey = isKPI
              ? "ZJM.STA.PlanningUnitKpi"
              : "ZJM.STE.ObjectiveProjectAdd";
          } else {
            // Already sent or approved
            registerKey = isKPI
              ? "ZJM.STE.ObjectiveKPIReadOnly"
              : "ZJM.STE.ObjectiveProjectReadOnly";
          }

          // Open modal form
          $.showModalForm(
            {
              registerKey: registerKey,
              params: {
                currentUserId: CurrentUserId,
                planningId: planningId,
                unitId: unitId,
                mode: canEdit ? "edit" : "view",
              },
            },
            function () {
              tblMain.refresh();
            }
          );
        });
    }
    // ====================== Add Row ========================
    function addRow(rowInfo) {
      console.log(rowInfo);
      const tempRow = element
        .children("tbody")
        .children("tr.row-template")
        .clone();
      processStatus = rowInfo.processStatus;
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
      let tbCheckbox = `<input type='radio' id='PlaningId' name='PlaningId' class='pointer' value='${rowInfo.id}'>`;

      tds.eq(0).html(tbCheckbox);
      tds.eq(1).text(rowInfo.id);
      tds.eq(2).text(rowInfo.createdDateShamsi);
      tds.eq(3).text(rowInfo.actorIdCreator);
      tds.eq(4).text(rowInfo.actorNameCreator);
      tds.eq(5).text(rowInfo.unitName);
      tds.eq(6).text(rowInfo.typeName);
      let tbButton = `
				<input type='button' class="btn-kpi" data-id="${rowInfo.id}" value="KPI (${rowInfo.planningUnitKpiCount})">
        		<input type='button' class="btn-project" data-id="${rowInfo.id}" value="Project (${rowInfo.planningUnitProjCount})">
			`;
      tds.eq(7).html(tbButton);
      tds.eq(8).html(rowInfo.isCancelName);
      if (rowInfo.processStatus == 1) {
        tds.eq(9)
          .html(`<a href="#" class="workflow-link" data-status="${rowInfo.ProcessStatus}" id="${args}">
				ارسال
				</a>`);
      } else {
        tds.eq(9)
          .html(`<a href="#" class="registered-document" data-inner-reg-number="${rowInfo.innerRegNumber}">
			       گردش کار
			    </a>`);
      }

      element.children("tbody").children("tr.row-template").before(tempRow);
    }

    // ======================== Load =========================
    function load(pageIndex = 0) {
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
      if ($("#gridPagination").length === 0) {
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
              $("#gridPagination"),
              pageSize,
              response.totalCount || 0,
              "ltr",
              function (newPageIndex) {
                load(newPageIndex - 1); // چون UI یک‌مبناست
              }
            )(response.totalCount || 0, pageIndex + 1);
          } else {
            addNoDataRow(element);
            gridPagination(element, pageSize, 0, "ltr")(0, 1);
          }

          LoadingSpinner.hide();
        },
        function (error) {
          LoadingSpinner.hide();
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

//#endregion

//#region DAL.js
const FormManager = (() => {
  // ====================== Load Custom JS =======================
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/Web/Scripts/Custom/marinaUtility.js";
  document.head.appendChild(script);

  // ====================== Private methods ======================
  const MarinaURL = "http://localhost:5113/api/";
  const VisionURL = "StrategyEvaluation/SEVision/";
  const FocusAreaURL = "StrategyEvaluation/SEFocusArea/";
  const ObjectiveURL = "StrategyEvaluation/SEObjective/";
  const KpiProjURL = "SEPlanningUnitKpiProj/Select";

  // ===== parsePlanningUnitKpiProjList =====
  function parsePlanningUnitKpiProjList(data) {
    const dataArray = getValidDataArray(data);
    return dataArray.map((item) => ({
      id: item.id,
      planningUnitKpiCount: item.planningUnitKpiCount,
      planningUnitProjCount: item.planningUnitProjCount,
      createdDateShamsi: item.createdDateShamsi,
      actorIdCreator: item.actorIdCreator,
      actorNameCreator: item.actorNameCreator,
      processStatus: item.processStatus,
      rejectStatus: item.rejectStatus,
      isCancel: item.isCancel,
      isCancelName: item.isCancelName,
      typeId: item.type,
      typeName: item.typeName,
      unitId: item.unitId,
      unitName: item.unitName,
    }));
  }
  // ====== getValidDataArray =======
  function getValidDataArray(data) {
    if (!data || !data.successed || !data.value) {
      console.warn("Invalid API response:", data);
      return [];
    }
    if (Array.isArray(data.value)) {
      return data.value;
    }
    if (data.value.data && Array.isArray(data.value.data)) {
      return data.value.data;
    }

    console.warn("Expected array but got:", data.value);
    return [];
  }
  // ====== getValidViewModels ======
  function getValidViewModels(requestParams, onError) {
    var items =
      requestParams && requestParams.viewModels ? requestParams.viewModels : [];
    if (!items.length) {
      handleError(
        "deleteObjective",
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
      handleError(
        "deleteObjective",
        "No valid [ID] found in viewModels",
        onError
      );
      return [];
    }

    return validItems;
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
    // ============= readPricing =========
    readPlaningKpiProj(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}Planning/SEPlanningUnitKpiProj/Select`;
      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        PageSize: 10,
        PageIndex: 0,
        ClientApiKey: "",
        ServiceMethodName: "",
        SortOrder: [{ Column: "Id", Direction: "DESC" }],
        FilterConditions: [],
        CustomFilters: {},
      };

      const requestParams = { ...defaultParams, ...jsonParams };

      $.ajax({
        url: apiUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestParams),
        success: function (data) {
          if (data && data.successed) {
            const list = parsePlanningUnitKpiProjList(data);
            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            handleError("readPlaningKpiProj", data.message, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError("readPlaningKpiProj", error, onError);
        },
      });
    },

    // ========== deleteObjective ==========
    deletePlanning(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}Planning/SEPlanningUnitKpiProj/Delete`;
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
            handleError("deleteObjective", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError(
            "deleteObjective",
            `Error in deletion request: ${status} - ${error}`,
            onError
          );
        },
      });
    },
  };
})();
//#endregion
