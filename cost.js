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
