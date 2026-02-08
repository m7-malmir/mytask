const URL_SaleActivity =
  "https://api.marinagroup.org/api/Promotion/PMSaleActivity/Select";
new Select2Loader({
  selector: "#cmbSaleActivity",
  apiUrl: URL_SaleActivity,
  apiMethod: "POST",
  pageSize: maxNumber,
  enablePaging: true,

  requestData: {
    CurrentCompanyId: companyId,
    CurrentUserId: userId,
    PageSize: maxNumber,
    PageIndex: 0,
    ClientApiKey: "",
    ServiceMethodName: "",
    SortOrder: [
      {
        Column: "Id",
        Direction: "DESC",
      },
    ],
    FilterConditions: [],
    CustomFilters: {},
  },

  searchConfig: {
    column: "activityNameFA",
    operator: "Contains",
  },

  valueField: "id",
  textField: "activityNameFA",
  placeholder: "انتخاب گروه مشتری (ها) ...",
  multiple: false,
  allowClear: true,
  minimumInputLength: 0,
});
/////////////////////////////////////////////////////////
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
          errorDialog("Error", error.message || "Error loading Units.", "ltr");
          success({ results: [] });
        }
      );
    },
    cache: true,
  },
});
///////////////////////////////////////////////////////////

{
"currentCompanyId": 1,
"currentUserId": "1,1,1",
"pageSize": 10,
"pageIndex": 0,
"clientApiKey": "",
"CustomMethodName":"SelectDataListPlanning",
"serviceMethodName": "",
"sortOrder": [{
    "column": "id",
    "direction": "Desc"
    }],
    "filterConditions": [{}
    ],
    "customFilters": {
    "UnitIdList":"35",
    "PlanningUnitKpiProjId": "9"
    }
}




لطفاً سورس رو Get کن، من با این سمپل روی Swagger تست گرفتم و اوکی بود. نام تابع رو اشتباه گذاشته بودی....
یکی از فیلترها هم اضافه بود حذف کردم سمت UI هم اصلاح کن لطفاً


			var params = {
			    CurrentCompanyId: 1,
			    CurrentUserId: CurrentUserId,
			    PageSize: pageSize,
			    PageIndex: pageIndex,
                ClientApiKey: "",

				CustomMethodName:'SelectDataListPlanning',
				ServiceMethodName: "",
                SortOrder: [currentSort],
			    FilterConditions: [],
				CustomFilters: {
				    UnitIdList: UnitId ? Number(UnitId) : null,
				   // UsedInPlanningId: PlanningId ? Number(PlanningId) : null
				}
			};
{
    "currentCompanyId": 1,
     "currentUserId": "1,1,1",
      "pageSize": 10,
       "pageIndex": 0,
        "clientApiKey": "",
         "CustomMethodName":"SelectDataListForPlanning",
          "serviceMethodName": "",
           "sortOrder": [{ "column": "id", "direction": "Desc" }],
            "filterConditions": [],
         "customFilters": { "UnitIdList":"35" }
         }


         	let params = {
		        CurrentCompanyId: CurrentCompanyId,
		        CurrentUserId: CurrentUserId,
		        PageSize: pageSize,
		        PageIndex: pageIndex,
		        SortOrder: [currentSort],
		        FilterConditions: [],
		        CustomFilters: {}
		    };


                            successDialog("ثبت موفق", "اطلاعات گزارش بازار با موفقیت ثبت گردید", "rtl");
				if (/^\d+$/.test(txtReportInsightId)) {
					tblMain.refresh();
				} else if (txtReportInsightId === 'ReportInsightId') {
					tblMain.refresh();
					//closeWindow({OK:true, Result:null});
				}
