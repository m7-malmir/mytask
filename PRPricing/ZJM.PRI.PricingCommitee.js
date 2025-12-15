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
