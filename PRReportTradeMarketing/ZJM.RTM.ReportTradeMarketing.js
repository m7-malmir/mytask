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
      changeDialogTitle("گزارش ترید مارکتینگ");
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
    $("#tblReportTradeMarketing").on("click", "a.workflow-link", function (e) {
      e.preventDefault();
      showLoading();
      const row = $(this).closest("tr");
      const requestId = row.find('input[name="TradeMarketingId"]').val();
      const dcid = "-1";

      const contentXml = `<Content>
		        <Id>${requestId}</Id>
				<CompanyId>${CurrentCompanyId}</CompanyId>
				<DCId>${dcid}</DCId>
				<IsInTestMode>${isInTestMode()}</IsInTestMode>
		    </Content>`;
      WorkflowService.RunWorkflow(
        "ZJM.RTM.ReportTradeMarketingProcess",
        contentXml,
        true,
        function () {
          LoadingSpinner.hide();
          tblMain.refresh();
        },
        function (err) {
          LoadingSpinner.hide();
          handleError(err, "ZJM.RTM.ReportTradeMarketingProcess");
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
// ===================== Public variables =====================
const FormManager = (() => {
  // ====================== Load Custom JS =======================
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/Web/Scripts/Custom/marinaUtility.js";
  document.head.appendChild(script);

  // ====================== Private methods ======================
  const MainURLB = "http://localhost:5113/api/";
  const ControllerURL = "Pricing/PRReportTradeMarketing/";

  // ===== parseReportTradeMarketingList =======
  function parseReportTradeMarketingList(data) {
    const dataArray = getValidDataArray(data);

    const list = dataArray.map((item) => ({
      id: item.id,
      createdDate: item.createdDate,
      userCreator: item.userCreator,
      processStatus: item.processStatus,
      fullName: item.fullName,
    }));

    return list;
  }
  // ===== parseGoodsPriceList =======
  function parseReportTradeMarketingDetailList(data) {
    let dataArray = getValidDataArray(data);
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
    // ================================================
    // ============= readReportTradeMarketing =========
    // ================================================
    readReportTradeMarketing(jsonParams, onSuccess, onError) {
      const apiUrl = `${MainURLB}${ControllerURL}Select`;

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
            const list = parseReportTradeMarketingList(data);
            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            handleError("readReportTradeMarketing", data.message, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError("readReportTradeMarketing", error, onError);
        },
      });
    },
    //============= Read ReportTradeMarketingDetail =====================
    readReportTradeMarketingDetail(jsonParams, onSuccess, onError) {
      const apiUrl = `${MainURLB}Pricing/PRReportTradeMarketingDetail/Select`;

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
            const list = parseReportTradeMarketingDetailList(data);
            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
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
          handleError("readReportTradeMarketingDetail", error, onError);
        },
      });
    },
  };
})();

//#endregion DAL.js

//#region btnClose.js
$("#btnClose").click(function () {
  Office.Inbox.setResponse(
    dialogArguments.WorkItem,
    1,
    "",
    function (data) {
      closeWindow({ OK: true, Result: null });
    },
    function (err) {
      throw Error(err);
    }
  );
});
//#endregion btnClose.js
