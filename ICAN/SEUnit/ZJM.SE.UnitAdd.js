//#region ready.js
// ===================== Public variables =====================
let $form;
let CurrentUserId;

$(function () {
  $form = (function () {
    // ==================== Init =====================
    function init() {
      build();
      CurrentUserId = dialogArguments["currentUserId"];
    }

    // ==================== Build ====================
    function build() {
      changeDialogTitle("Add New");
      $("#cmbStatus").html(`
				<option value="1">Active</option>
				<option value="2">Deactive</option>
			`);
    }
    // =================== Return ====================
    return {
      init: init,
    };
  })();
  $form.init();
});

//#endregion

//#region btnAdd.js
$("#btnRegister").click(function () {
  if (validateRequiredFields("gbxUnitAdd")) {
    LoadingSpinner.show();

    const params = {
      currentCompanyId: 1,
      currentUserId: CurrentUserId || "",
      customMethodName: "",
      clientApiKey: "",
      serviceMethodName: "",
      customParameters: {},
      viewModels: [
        {
          unitId: parseInt($("#cmbUnitId").val(), 10),
          userId: parseInt($("#cmbUserId").val(), 10),
          actorId: $("#cmbUserId").select2("data")[0].actorId,
          accountable: $("#chbAccountable").is(":checked"),
          status: $("#cmbStatus").val() === "1",
        },
      ],
    };

    FormManager.addUnit(
      params,
      function (response) {
        LoadingSpinner.hide();

        successDialog("Success", "Added successfully", "ltr");

        closeWindow({
          OK: true,
          Result: null,
        });
      },
      function (error) {
        LoadingSpinner.hide();
        if (String(error.details) === "[object Object]") {
          errorDialog("Error", error.message, "ltr");
        } else {
          warningDialog("Duplicate", error.details, "ltr");
        }
      },
    );
  }
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
  //const MainURLB = "http://localhost:5113/api/"
  const ControllerURL = "ican/ICUnit/";

  // ===== parseUnitList =======
  function parseUnitList(data) {
    let dataArray = getValidDataArray(data);

    const list = dataArray.map((item) => ({
      id: item.id,
      name: item.name,
    }));
    return list;
  }
  // ===== parseUserList =======
  function parseUserList(data) {
    let dataArray = getValidDataArray(data);

    const list = dataArray.map((item) => ({
      id: item.id,
      actorId: item.actorId,
      userFullName: item.userFullName,
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
        PageSize: 50,
        PageIndex: 0,
        ClientApiKey: "",
        ServiceMethodName: "",
        SortOrder: [
          {
            Column: "Id",
            Direction: "ASC",
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

    //============= READ USERS =====================
    readUser(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}ican/ICUser/Select`;

      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        CustomMethodName: "SelectDataListByActor",
        PageSize: 50,
        PageIndex: 0,
        ClientApiKey: "",
        ServiceMethodName: "",
        SortOrder: [
          {
            Column: "Id",
            Direction: "ASC",
          },
        ],
        CustomFilters: {},
      };

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
            const list = parseUserList(data);

            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            handleError(
              "readUser",
              data.message || "Failed to get data",
              onError,
            );
          }
        },
        error: function (xhr, status, error) {
          handleError("readUser", error, onError);
        },
      });
    },

    // ========== addUnit ==========
    addUnit(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}StrategyEvaluation/SEUnit/Add`;
      const defaultParams = {
        currentCompanyId: 1,
        currentUserId: "",
        clientApiKey: "",
        serviceMethodName: "",
        customParameters: {},
        viewModels: [],
      };
      const requestParams = {
        ...defaultParams,
        ...jsonParams,
      };
      $.ajax({
        url: apiUrl,
        type: "POST", // Corrected to POST
        contentType: "application/json",
        data: JSON.stringify(requestParams),
        success: function (data) {
          if (data && data.successed) {
            if ($.isFunction(onSuccess)) {
              onSuccess({
                message: "Strategic Kpi added successfully.",
                data: data.value,
              });
            }
          } else {
            const errorMessage = data.message || "Failed to add Strategic Kpi.";
            handleError("addUnit", errorMessage, onError);
          }
        },

        error: function (xhr, status, error) {
          console.error("AJAX error:", xhr.responseText);
          handleError(
            "addUnit",
            {
              status,
              error,
              response: xhr.responseText,
            },
            onError,
          );
        },
      });
    },
  };
})();
//#endregion
