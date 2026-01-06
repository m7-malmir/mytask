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

//#region

//#endregion
