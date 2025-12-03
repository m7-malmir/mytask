{
  "CurrentCompanyId": 1,
  "CurrentUserId": "1,1,1",
  "PageSize": 50,
  "PageIndex": 0,
  "ClientApiKey": "",
  "ServiceMethodName": "",
  "SortOrder": [
    { "Column": "Id", "Direction": "ASC" }
  ],
  "FilterConditions": [
  ],
  "CustomFilters": {
  }
}


{
  "currentCompanyId": 0,
  "currentUserId": "2200,1662,501355",
  "customMethodName": "string",
  "clientApiKey": "string",
  "serviceMethodName": "string",
  "customParameters": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "viewModels": [
    {
      "id": 12
    }
  ]
}


viewModel


{
  "currentCompanyId": 1,
  "currentUserId": "2200,1662,501355",
  "customMethodName": "",
  "clientApiKey": "",
  "serviceMethodName": "",
  "customParameters": {
  },
  "viewModel":
    {
    }
}






{
    currentCompanyId: 1,
    currentUserId: "324,444,222",
    customMethodName: "GetAll",
    clientApiKey: "",
    serviceMethodName: "",
    customFilters: {},
    viewModel: null}









{   "currentCompanyId": 1,   "currentUserId": "2200,1662,501355",   "customMethodName": "",   "clientApiKey": "",   "serviceMethodName": "",   "customParameters": {   },   "viewModel":     {       "id": 12     }  }





{
  "CurrentCompanyId": 1,
  "CurrentUserId": "1,1,1",
  "PageSize": 50,
  "PageIndex": 0,
  "ClientApiKey": "",
  "ServiceMethodName": "",
  "SortOrder": [
    { "Column": "Name", "Direction": "ASC" }
  ],
  "FilterConditions": [{ "Column": "Name", "Operator": "Contains", "Value": "محمد" }
  ],
  "CustomFilters": {
  }
}















/* ===================== Public variables ===================== */
let $form;
let CurrentUserId;
let UnitID;

$(function () {

    $form = (function () {

        // ===================== Aliases =====================
        let readSEUnit = FormManager.readSEUnit;

        // ===================== Init =====================
        async function init() {
            try {
                console.log("Init started");

                CurrentUserId = dialogArguments["currentUserId"];
                UnitID = dialogArguments["UnitID"];

                console.log("CurrentUserId:", CurrentUserId);
                console.log("UnitID:", UnitID);

                if (!CurrentUserId) {
                    console.warn("CurrentUserId not found. Stopping initialization.");
                    return;
                }

                if (!UnitID) {
                    console.log("Add Mode: No UnitID provided");
                    build();
                    return;
                }

                console.log("Edit Mode");
                changeDialogTitle("Edit Unit");
                $("#lblUnitVariableID").text(UnitID);

                build();
                await loadSEUnit();
                console.log("loadSEUnit completed successfully");

            } catch (err) {
                console.error("Initialization failed:", err);
            }
        }

        // ===================== Build =====================
        function build() {
            changeDialogTitle("Add New");

            $("#cmbStatus").html(`
                <option value="1">Active</option>
                <option value="2">Deactive</option>
            `);
        }

        // ===================== Load SEUnit =====================
        async function loadSEUnit() {

            let params = {
                currentCompanyId: 1,
                currentUserId: CurrentUserId,
                customMethodName: "Find",
                clientApiKey: "",
                customFilters: {},
                viewModel: { id: UnitID }
            };
            console.log("===== Payload Sent to readSEUnit =====");
            console.log(JSON.stringify(params, null, 4));

            return new Promise((resolve, reject) => {

                readSEUnit(
                    params,

                    // ======== SUCCESS CALLBACK ========
                    response => {
                        console.log("===== Raw Response From readSEUnit =====");
                        console.log(response);

                        let root =
                            response?.value ||
                            response?.list ||
                            response?.value?.list ||
                            [];

                        console.log("Extracted root:", root);

                        let item = Array.isArray(root) && root.length ? root[0] : null;
                        console.log("Extracted item:", item);

                        if (!item) {
                            console.error("No SEUnit data found");
                            return reject(new Error("No SEUnit data found"));
                        }

                        // -------- Set UnitId --------
                        let unitIdStr = String(item.unitId ?? "").trim();
                        console.log("unitId:", unitIdStr);

                        if (unitIdStr) {
                            let $cmb = $("#cmbUnitId");
                            let opt = $cmb.find(`option[value='${unitIdStr}']`);

                            if (opt.length) {
                                $cmb.val(unitIdStr).trigger("change.select2");
                            } else {
                                let newOption = new Option(item.unitTitle || unitIdStr, unitIdStr, true, true);
                                $cmb.append(newOption).trigger("change");
                            }
                        }

                        // -------- Set UserId --------
                        let userIdStr = String(item.userId ?? "").trim();
                        console.log("userId:", userIdStr);

                        if (userIdStr) {
                            let $cmb = $("#cmbUserId");
                            let opt = $cmb.find(`option[value='${userIdStr}']`);

                            if (opt.length) {
                                $cmb.val(userIdStr).trigger("change.select2");
                            } else {
                                let newOption = new Option(item.userFullName || userIdStr, userIdStr, true, true);
                                $cmb.append(newOption).trigger("change");
                            }
                        }

                        // -------- Set Status --------
                        let statusValue = item.status ? "1" : "2";
                        console.log("status:", statusValue);
                        $("#cmbStatus").val(statusValue).trigger("change");

                        resolve();
                    },

                    // ======== ERROR CALLBACK ========
                    err => {
                        console.error("readSEUnit error:", err);
                        reject(err);
                    }
                );
            });
        }

        // ===================== Return =====================
        return {
            init: init
        };

    })();

    $form.init();

});
