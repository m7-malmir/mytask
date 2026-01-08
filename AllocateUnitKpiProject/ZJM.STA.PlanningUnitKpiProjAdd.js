//#region ready.js
// ===================== Public variables =====================
let $form;
let CurrentUserId;
let CurrentCompanyId;
let currentActorId;
$(function () {
  $form = (function () {
    // ==================== Init =====================
    function init() {
      build();
      CurrentUserId = dialogArguments["currentUserId"];
      CurrentCompanyId = dialogArguments["currentCompanyId"];
      initUnitsCombo();
      createControls();
    }
    // ==================== initcmbSaleActivityCombo =====================
    // ================ initUnitsCombo ===============
    function initUnitsCombo() {
      const $cmbUnit = $("#cmbUnit");

      $cmbUnit.select2({
        placeholder: "Select unit(s)...",
        dir: "rtl",
        allowClear: true,
        multiple: false,
        closeOnSelect: false,
        minimumResultsForSearch: 10,
        ajax: {
          delay: 300,
          transport: function (params, success, failure) {
            const parameters = {
              CurrentCompanyId: 1,
              CurrentUserId: CurrentUserId,
              CustomMethodName: "GetAllSEUnits",
              ClientApiKey: "",
              ServiceMethodName: "",
              CustomFilters: {},
              ViewModel: null,
            };

            FormManager.readUnits(
              parameters,
              function (response) {
                const items = (response.list || []).map((item) => ({
                  id: item.unitId,
                  text: item.unitName,
                }));
                success({ results: items });
              },
              function (error) {
                console.error("Error loading units:", error);
                errorDialog(
                  "Error",
                  error.message || "Error loading Units.",
                  "ltr"
                );
                success({ results: [] });
              }
            );
          },
          cache: true,
        },
      });

      $cmbUnit.on("change", function () {
        const selectedValues = $(this).val();
        const hasValue = selectedValues && selectedValues.length > 0;

        $("#cmbUsers").prop("disabled", !hasValue);

        if (!hasValue) {
          $("#cmbUsers").val(null).trigger("change");
        }
      });
    }
    // ==================== createControls ====================
    function createControls() {
      UserService.GetCurrentUser(
        true,
        function (data) {
          hideLoading();

          const xml = $.xmlDOM(data);
          currentActorId = xml.find("user > actors > actor").attr("pk");
          //tblMain.refresh();
        },
        function (err) {
          hideLoading();
          $ErrorHandling.Erro(err, "خطا در سرویس getCurrentActor");
        }
      );
    }
    // ==================== Build ====================
    function build() {
      changeDialogTitle("Add Planning Unit/Kpi Project");
    }

    // =================== Return ====================
    return {
      init: init,
    };
  })();
  $form.init();
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
  const UNIT_URL = "StrategyEvaluation/SEUnit/";

  // ======== parseUnitList =========
  function parseUnitList(data) {
    const dataArray = getValidDataArray(data);

    return dataArray.map((item) => ({
      id: item.id ?? 0,
      unitId: item.unitId ?? 0,
      userId: item.userId ?? 0,
      unitName: item.unitName || "",
      statusTitle: item.statusTitle || "",
      firstName: item.firstName || "",
      lastName: item.lastName || "",
      userName: item.userName || "",
      status: item.status ?? false,
    }));
  }

  // ====== getValidDataArray =======
  function getValidDataArray(data, hasNestedData = false) {
    if (!data || !data.successed || !data.value) {
      console.warn("Invalid API response (no successed/value):", data);
      return [];
    }

    let arrayToReturn;

    if (hasNestedData || (data.value.data && Array.isArray(data.value.data))) {
      arrayToReturn = data.value.data;
    } else if (Array.isArray(data.value)) {
      arrayToReturn = data.value;
    } else {
      console.warn("Unexpected data structure:", data.value);
      return [];
    }

    if (!Array.isArray(arrayToReturn)) {
      console.warn("Expected array but got:", arrayToReturn);
      return [];
    }

    return arrayToReturn;
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
    // ============ readUnits ============
    readUnits(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}${UNIT_URL}GetData`;
      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        CustomMethodName: "GetAllSEUnits",
        ClientApiKey: "",
        ServiceMethodName: "",
        CustomFilters: {},
        ViewModel: null,
      };
      const requestParams = { ...defaultParams, ...jsonParams };

      $.ajax({
        url: apiUrl,
        type: "GET",
        data: { DataRequestConfig: JSON.stringify(requestParams) },
        success: function (data) {
          if (data && data.successed) {
            const list = parseUnitList(data);
            if ($.isFunction(onSuccess)) onSuccess({ list });
          } else {
            handleError("readUnits", data?.message || "Failed", onError);
          }
        },
        error: function (xhr) {
          console.error("AJAX Error in readUnits:", xhr.responseText);
          handleError(
            "readUnits",
            xhr.responseText || "Network error",
            onError
          );
        },
      });
    },

    // ========== addKpiProj ==========

    addKpiProj(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}Planning/SEPlanningUnitKpiProj/Add`;
      const defaultParams = {
        currentCompanyId: "",
        currentUserId: "",
        customMethodName: "",
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
              onSuccess({
                message: "KpiProj added successfully.",
                data: data.value,
              });
            }
          } else {
            const errorMessage = data.message || "Failed to add KpiProj.";
            handleError("addKpiProj", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX error:", xhr.responseText);
          handleError(
            "addKpiProj",
            { status, error, response: xhr.responseText },
            onError
          );
        },
      });
    },
  };
})();
//#endregion




