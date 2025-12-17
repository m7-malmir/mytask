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
        DocumentId = dialogArguments["DocumentId"];
        CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
        InboxId = dialogArguments["WorkItem"]["InboxId"];
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
//#endregion ready.js

//#region tblPricing.js
var info;
$(function () {
  tblMain = (function () {
    // ====================== Variables ======================
    const pageSize = 3;
    const readRows = FormManager.readPricingDetail;
    let currentSort = { Column: "Id", Direction: "DESC" };
    let element = null;
    const columnMap = {
      1: "Id",
      2: "GoodsCode",
      3: "GoodsName",
      4: "BrandNameFA",
      5: "Action",
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
      //============== POP UP =============
      $(document).on("click", ".btn-action", function () {
        const $btn = $(this);
        const $row = $btn.closest("tr");

        const info = $row.data("info"); // الان کلید درست است

        if (!info) {
          warningDialog("خطا", "اطلاعات ردیف یافت نشد", "rtl");
          return;
        }

        $.showModalForm(
          {
            registerKey: "ZJM.RTM.ReportInsightDetailsPopUp",
            params: {
              id: info.id,
              goodsName: info.goodsName,
              reportInsightId: info.reportInsightId,
              willingnessPay: info.willingnessPay,
              optimalPricePoint: info.optimalPricePoint,
              acceptablePriceRange: info.acceptablePriceRange,
              priceElasticityDemand: info.priceElasticityDemand,
              samtInfoId: info.samtInfoId,
            },
          },
          function (retVal) {
            tblMain.refresh();
          }
        );
      });
      //===================================
    }
    // ====================== Add Row ========================
    function addRow(rowInfo) {
      const tempRow = element
        .children("tbody")
        .children("tr.row-template")
        .clone();
      function commafy(x) {
        x = x.toString().replace(/,/g, ""); // حذف کاماهای قبلی
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      tempRow
        .show()
        .removeClass("row-template")
        .addClass("row-data")
        .data("info", rowInfo); // کلید درست اینجاست

      const tds = tempRow.children("td");

      let tbCheckbox = `<input type='radio' id='PricingId' name='PricingId' class='pointer' value='${rowInfo.id}'>`;

      tds.eq(0).html(tbCheckbox);
      tds.eq(1).text(rowInfo.id);
      tds.eq(2).text(rowInfo.goodsId);
      tds.eq(3).text(rowInfo.goodsName);
      tds.eq(4).text(commafy(rowInfo.newConsumerPrice));
      element.children("tbody").children("tr.row-template").before(tempRow);
    }

    // ======================== Load =========================
    function load(pageIndex = 0) {
      const pk = $form.getPK();
      if (!pk || !CurrentUserId) return;

      showLoading();

      // به مدل سواگر دقت کن — دقیقاً همین باید باشد
      let params = {
        CurrentCompanyId: 1,
        CurrentUserId: CurrentUserId,
        PageSize: 10,
        PageIndex: pageIndex,
        ClientApiKey: "",
        ServiceMethodName: "",
        SortOrder: [{ Column: "Id", Direction: "DESC" }],
        FilterConditions: [
          {
            Column: "PricingId",
            Operator: "EqualTo",
            Value: String(pk),
          },
          {
            Column: "IsDeleted",
            Operator: "EqualTo",
            Value: false,
          },
        ],
        CustomFilters: {},
        viewModels: [],
      };
      readRows(
        params,
        function (response) {
          const list = Array.isArray(response.list)
            ? response.list
            : response.value?.data || [];

          element.find(".row-data").remove();

          if (Array.isArray(list) && list.length > 0) {
            element.find("tr.no-data-row").remove();

            list.forEach(addRow);

            // اگر پجینیشن لازم نیست، این را حذف کن
            gridPagination(
              element,
              pageSize,
              list.length,
              "ltr"
            )(list.length, 1);
          } else {
            addNoDataRow(element);
            gridPagination(element, pageSize, 0, "ltr")(0, 1);
          }

          closeLoading();
        },
        function (error) {
          closeLoading();
          addNoDataRow(element);
          errorDialog("Error", error.message || error, "rtl");
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
  tblMain.load();
});
//#endregion tblPricing.js

//#region tscPricing_Add.js
$("#tscPricing_Add").click(function () {
  const id = parseInt($("#txtId").val().trim());
  $.showModalForm(
    {
      registerKey: "ZJM.PRI.PricingReviewPopUp",
      params: { PricingId: id, currentUserId: CurrentUserId },
    },
    function (retVal) {
      tblMain.refresh();
    }
  );
});
//#endregion tscPricing_Add.js

//#region tscPricing_Delete.js
$("#tscPricing_Delete").click(function () {
  // ====================== Variables ======================
  const deleteRows = FormManager.deletePricingDetail;
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
//#endregion tscPricing_Delete.js

//#region Form.DAL.js
$("#tscPricing_Delete").click(function () {
  // ====================== Variables ======================
  const deleteRows = FormManager.deletePricingDetail;
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
//#endregion Form.DAL.js
