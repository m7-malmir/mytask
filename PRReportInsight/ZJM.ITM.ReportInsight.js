//#region ready.js
// ===================== Public variables =====================
let $form;
let CurrentUserId;
let CurrentUser;
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
      changeDialogTitle("گزارش تحقیقات بازار");
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

          CurrentUser = userInfo.id;
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
    $("#tblReportInsight").on("click", "a.workflow-link", function (e) {
      e.preventDefault();
      showLoading();
      const row = $(this).closest("tr");
      const requestId = row.find('input[name="ReportInsightId"]').val();
      const dcid = "-1";

      const contentXml = `<Content>
		        <Id>${requestId}</Id>
				<CompanyId>${CurrentCompanyId}</CompanyId>
				<DCId>${dcid}</DCId>
				<IsInTestMode>${isInTestMode()}</IsInTestMode>
		    </Content>`;
      WorkflowService.RunWorkflow(
        "ZJM.ITM.ReportInsightProcess",
        contentXml,
        true,
        function () {
          LoadingSpinner.hide();
          tblMain.refresh();
        },
        function (err) {
          LoadingSpinner.hide();
          handleError(err, "ZJM.ITM.ReportInsightProcess");
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

//#region DAL.js
const FormManager = (() => {
  // ====================== Load Custom JS =======================
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/Web/Scripts/Custom/marinaUtility.js";
  document.head.appendChild(script);

  // ====================== Private methods ======================
  //const MainURLB = "http://localhost:5113/api/";
  const ControllerURL = "Pricing/PRReportInsight/";

  // ===== parseReportInsightList =======
  function parseReportInsightList(data) {
    const dataArray = getValidDataArray(data);

    const list = dataArray.map((item) => ({
      id: item.id,
      createdDate: item.createdDate,
      createdDateShamsi: item.createdDateShamsi,
      userCreator: item.userCreator,
      processStatus: item.processStatus,
      fullName: item.fullName,
      workFlowTitle: item.workFlowTitle,
      innerRegNumber: item.innerRegNumber,
    }));

    return list;
  }

  // ====== getValidDataArray =======
  function getValidDataArray(data) {
    if (data && data.value && Array.isArray(data.value.data)) {
      return data.value.data;
    }

    console.warn("Invalid API response or no data:", data);
    return [];
  }
  // ====== getValidViewModels ======
  function getValidViewModels(requestParams, onError) {
    var items =
      requestParams && requestParams.viewModels ? requestParams.viewModels : [];
    if (!items.length) {
      handleError(
        "deleteUnit",
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
      handleError("deleteUnit", "No valid [ID] found in viewModels", onError);
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
    // ============= readReportInsight =========
    readReportInsight(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}${ControllerURL}Select`;

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
        type: "GET",
        data: {
          DataListRequestConfig: JSON.stringify(requestParams),
        },
        success: function (data) {
          if (data && data.successed) {
            const list = parseReportInsightList(data);
            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            handleError("readReportInsight", data.message, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError("readReportInsight", error, onError);
        },
      });
    },
    // ========== delete PRReportTradeMarketing ==========
    deleteReportInsightList(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}Pricing/PRReportInsight/Delete`;
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
              onSuccess({ message: "با موفقیت حذف گردید", data: data.value });
            }
          } else {
            const errorMessage = data.message || "Data deletion failed.";
            handleError("deleteReportInsightList", errorMessage, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError(
            "deleteReportInsightList",
            `Error in deletion request: ${status} - ${error}`,
            onError
          );
        },
      });
    },
  };
})();

//#endregion DAL.js

//#region

//#endregion

//#region

//#endregion

//#region

//#endregion
