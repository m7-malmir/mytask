//#region ready.js
// ===================== Public variables =====================
var $form;
var currentActorId;
var CurrentUserId;
var isInTestMode = false;
var primaryKeyName;
var pk;

$(function () {
  $form = (function () {
    var pk,
      inEditMode = false;
    // ==================== init ============================
    function init() {
      if (typeof dialogArguments !== "undefined") {
        if (primaryKeyName in dialogArguments) {
          pk = dialogArguments[primaryKeyName];
          inEditMode = true;
          readData();
        }
        if ("FormParams" in dialogArguments) {
          pk = dialogArguments.FormParams;
          inEditMode = true;
        }
        //DocumentId = dialogArguments["DocumentId"];
        //CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
        //InboxId = dialogArguments["WorkItem"]["InboxId"];
      }
      build();
      createControls();
    }
    // ==================== build ============================
    function build() {
      //Set the new dialog title
      changeDialogTitle("اصلاح/تایید مصوبه تغییر قیمت محصولات");
    }
    function bindEvents() {}
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

          let params = {
            CurrentCompanyId: CurrentCompanyId,
            CurrentUserId: CurrentUserId,
            PageSize: 1, // چون فقط یک رکورد می‌خوایم
            PageIndex: 0,
            SortOrder: [],
            FilterConditions: [
              {
                Column: "Id",
                Operator: "EqualTo",
                Value: pk,
              },
            ],
            CustomFilters: {},
          };
          tblMain.refresh();
          FormManager.readPricing(
            params,
            function (response) {
              const list = Array.isArray(response.list)
                ? response.list
                : response;

              if (Array.isArray(list) && list.length > 0) {
                const item = list[0];
                // پر کردن اینپوت‌ها
                $("#txtUserCreator").val(item.fullName || "");
                $("#txtCreatedDate").val(item.createdDateShamsi || "");
                $("#txtId").val(pk);
              } else {
                warningDialog("پیام", "داده‌ای یافت نشد", "rtl");
              }

              closeLoading();
            },
            function (error) {
              closeLoading();
              errorDialog("Error", error.message, "rtl");
            }
          );
          /*
           * After setting the variable 'CurrentUserId',
           * the table is refreshed by passing its values.
           */
          //tblMain.refresh();
        },
        function (err) {
          $ErrorHandling.Erro(err, "خطا در سرویس getCurrentActor");
          CurrentCompanyId = 1;
          //tblMain.load();
        }
      );
    }

    // ==================== getPrimaryKey ====================
    function getPK() {
      return pk;
    }
    // =================== Return ====================
    return {
      init: init,
      getPK: getPK,
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
  //const MarinaURL = "http://localhost:5113/api/";
  const ControllerURL = "Pricing/PRPricing/";

  // ===== parsePricingList =======
  function parsePricingList(data) {
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
  // ===== parsePricingDetailList =======
  function parsePricingDetailList(dataArray) {
    return dataArray.map((item) => ({
      id: item.id,
      pricingId: item.pricingId,
      goodsId: item.goodsId,
      goodsName: item.goodsName,
      newConsumerPrice: item.newConsumerPrice,
      isManagerAccepted: item.isManagerAccepted,
      isCEOAccepted: item.isCEOAccepted,
      isDeleted: item.isDeleted,
      description: item.description,
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
  function getValidDatalistArray(data) {
    if (data && data.successed) {
      if (data.value && Array.isArray(data.value.data)) {
        return data.value.data;
      }
    }
    console.warn("Invalid API response:", data);
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
    readPricing(jsonParams, onSuccess, onError) {
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
            const list = parsePricingList(data);
            if ($.isFunction(onSuccess)) {
              onSuccess({
                list: list,
                totalCount: data.value.totalCount || 0,
              });
            }
          } else {
            handleError("readPricing", data.message, onError);
          }
        },
        error: function (xhr, status, error) {
          handleError("readPricing", error, onError);
        },
      });
    },
    //============= Read PricingDetail =====================
    readPricingDetail(jsonParams, onSuccess, onError) {
      const apiUrl = `${MarinaURL}Pricing/PRPricingDetail/Select`;

      const defaultParams = {
        CurrentCompanyId: 1,
        CurrentUserId: "",
        PageSize: 10,
        PageIndex: 0,
        SortOrder: [{ Column: "Id", Direction: "DESC" }],
        FilterConditions: [],
        CustomFilters: {},
        viewModels: [],
      };

      const requestParams = { ...defaultParams, ...jsonParams };

      $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
          DataListRequestConfig: JSON.stringify(requestParams),
        },
        success: function (response) {
          if (!response || !response.successed) {
            return handleError("readPricingDetail", response?.message, onError);
          }

          const dataArray = getValidDatalistArray(response);

          const list = parsePricingDetailList(dataArray);

          if ($.isFunction(onSuccess)) {
            onSuccess({
              list: list,
              totalCount: response.value?.totalCount || list.length,
            });
          }
        },
        error: function (xhr, status, error) {
          handleError("readPricingDetail", error, onError);
        },
      });
    },
  };
})();

//#endregion
