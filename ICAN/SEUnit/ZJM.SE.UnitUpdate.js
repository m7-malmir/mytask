//#region ready.js
let $form;
let CurrentUserId;
let UnitID;

$(function () {
  $form = (function () {
    const readSEUnit = FormManager.readSEUnit;
    const readUnit = FormManager.readUnit;
    const readUser = FormManager.readUser;

    function init() {
      CurrentUserId = dialogArguments["currentUserId"];
      UnitID = dialogArguments["UnitID"];
      build();
    }

    function build() {
      changeDialogTitle("Edit");
      $("#lblUnitID").text(UnitID);

      // مقدار اولیه کمبوباکس Status
      $("#cmbStatus").html(`
                <option value="1">Active</option>
                <option value="2">Deactive</option>
            `);

      LoadingSpinner.show();

      appendElenentsById()
        .then(() => {
          LoadingSpinner.hide();
        })
        .catch((err) => {
          LoadingSpinner.hide();
          console.error(err);
        });
    }

    function appendElenentsById() {
      return new Promise((resolve, reject) => {
        if (!UnitID) {
          reject(new Error("UnitID is undefined"));
          return;
        }

        const params = {
          currentCompanyId: 1,
          currentUserId: CurrentUserId,
          customMethodName: "Find",
          clientApiKey: "",
          serviceMethodName: "",
          customFilters: {},
          viewModel: {
            id: UnitID,
          },
        };

        readSEUnit(
          params,
          function (response) {
            const item =
              response.list && response.list.length > 0
                ? response.list[0]
                : null;

            if (!item) {
              reject(new Error("No data found"));
              return;
            }

            /* ======================
                           Fill Unit Combo
                        ======================= */

            readUnit(
              {
                CurrentCompanyId: 1,
                CurrentUserId: CurrentUserId,
                CustomFilters: {},
              },
              function (res) {
                const $cmb = $("#cmbUnitId");
                $cmb.empty().append('<option value="">Select...</option>');

                res.list.forEach((u) => {
                  $cmb.append(`<option value="${u.id}">${u.name}</option>`);
                });

                $cmb.val(item.unitId);
              },
            );
            /* ======================
                           Fill Status Combo
                        ======================= */

            const statusValue = item.status === true ? "1" : "2";
            $("#cmbStatus").val(statusValue);

            /* ======================
                           Fill Accountable Checkbox
                        ======================= */

            const isAccountable = item.accountable === true;
            $("#chbAccountable").prop("checked", isAccountable);

            /* ======================
                           Fill User Combo
                        ======================= */

            readUser(
              {
                CurrentCompanyId: 1,
                CurrentUserId: CurrentUserId,
                CustomFilters: {},
              },
              function (res) {
                const $cmb = $("#cmbUserId");
                $cmb.empty().append('<option value="">Select...</option>');

                res.list.forEach((u) => {
                  $cmb.append(
                    `<option value="${u.id}">${u.userFullName}</option>`,
                  );
                });

                $cmb.val(item.userId);
              },
            );

            resolve();
          },
          reject,
        );
      });
    }

    return {
      init: init,
    };
  })();

  $form.init();
});
//#endregion

//#region btnSave.js
$("#btnRegister").click(function () {
  // ====================== Variables ======================
  const updateRows = FormManager.updateSEUnit;

  if (validateRequiredFields("gbxUnitUpdate")) {
    showLoading();

    let params = {
      currentCompanyId: 1,
      currentUserId: CurrentUserId || "",
      customMethodName: "",
      clientApiKey: "",
      serviceMethodName: "",
      customParameters: {},
      viewModels: [
        {
          Id: parseInt($("#lblUnitID").text(), 10),
          unitId: 0,
          userId: 0,
          accountable: $("#chbAccountable").is(":checked"),
          // به Boolean تبدیل کن
          status: $("#cmbStatus").val() === "1",
        },
      ],
    };
    updateRows(
      params,
      function (response) {
        closeLoading();
        successDialog(
          "Update Success",
          "The Vision was successfully updated",
          "ltr",
        );
        closeWindow({
          OK: true,
          Result: null,
        });
      },
      function (error) {
        closeLoading();
        errorDialog("Add Error", error.message, "ltr");
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
  // const MainURLB = "http://localhost:5113/api/"
  const ControllerURL = "ican/ICUnit/";

  // ===== parseSEUnitList =======
  function parseSEUnitList(data) {
    let dataArray = getValidDataArraySEUnit(data);

    const list = dataArray.map((item) => ({
      id: item.id,
      unitId: item.unitId,
      userId: item.userId,
      accountable: item.accountable,
      status: item.status,
    }));
    return list;
  }

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

  function getValidDataArraySEUnit(data) {
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
    // ========== readSEUnit ==========
    readSEUnit(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}StrategyEvaluation/SEUnit/GetData`;

      const defaultParams = {
        currentCompanyId: 1,
        currentUserId: "",
        customMethodName: "GetAll",
        clientApiKey: "",
        serviceMethodName: "",
        customFilters: {},
        viewModel: null,
      };

      const requestParams = {
        ...defaultParams,
        ...jsonParams,
      };

      $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
          DataRequestConfig: JSON.stringify(requestParams),
        },
        success: function (data) {
          if (data && data.successed) {
            const list = parseSEUnitList(data);

            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
              });
            }
          } else {
            const errorMessage = data.message || "Failed to get data from API";
            handleError("readSEUnit", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX error:", xhr.responseText);
          handleError(
            "readSEUnit",
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
      const apiUrl = `${MarinaURL}StrategyEvaluation/SEUnit/Add`; // Corrected to Add endpoint
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
    // ======== update SEUnit ========
    updateSEUnit(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}StrategyEvaluation/SEUnit/Update`;
      const defaultParams = {
        currentCompanyId: "",
        currentUserId: "",
        customMethodName: "",
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
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestParams),
        success: function (data) {
          if (data && data.successed) {
            if ($.isFunction(onSuccess)) {
              onSuccess({
                message: "SEUnit updated successfully.",
                data: data.value,
              });
            }
          } else {
            const errorMessage = data.message || "Failed to add Vision.";
            handleError("updateSEUnit", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX error:", xhr.responseText);
          handleError(
            "updateSEUnit",
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
