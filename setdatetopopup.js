var params = window.dialogArguments || window.arguments || {};
// --- تبدیل XML به آبجکت JS ---
var dataXml = $(params); // params همون XMLDocument شما

// استخراج همه مقادیر مورد نیاز
var costDate                = dataXml.find("row:first > col[name='CostDate']").text();                  // dpCostDate
var costRequestTypeId       = dataXml.find("row:first > col[name='CostRequestTypeId']").text();         // cmbCostRequestTypeId
var costRequestTypeDetailId = dataXml.find("row:first > col[name='CostRequestTypeDetailId']").text();   // cmbCostRequestTypeDetailId
var costRequestTypeSubDetail= dataXml.find("row:first > col[name='CostRequestTypeSubDetail']").text();  // cmbCostRequestTypeSubDetail
var originProvinceId        = dataXml.find("row:first > col[name='OriginProvinceId']").text();          // cmbOriginProvinceId
var originCityId            = dataXml.find("row:first > col[name='OriginCityId']").text();              // cmbOriginCityId
var startDate               = dataXml.find("row:first > col[name='StartDate']").text();                 // dpStartDate
var startKM                 = dataXml.find("row:first > col[name='StartKM']").text();                   // txtStartKM
var destinationProvinceId   = dataXml.find("row:first > col[name='DestinationProvinceId']").text();     // cmbDestinationProvinceId
var destinationCityId       = dataXml.find("row:first > col[name='DestinationCityId']").text();         // cmbDestinationCityId
var endDate                 = dataXml.find("row:first > col[name='EndDate']").text();                   // bpEndDate
var endKM                   = dataXml.find("row:first > col[name='EndKM']").text();                     // txtEndKM
var requestCostPrice        = dataXml.find("row:first > col[name='RequestCostPrice']").text();          // txtRequestCostPrice

// ============================================
// ست کردن مقدارها به المنت‌های مربوطه
// (input ها، datepicker ها، select ها)

// تقویم‌ها یا inputهای تاریخ (مثلاً dpCostDate, dpStartDate, bpEndDate)
// مقدار inputها
$("#txtStartKM").val(startKM);
$("#txtEndKM").val(endKM);
$("#txtRequestCostPrice").val(requestCostPrice);
$("#txtConfirmPrice").val(confirmPrice);

// مقداردهی selectهای async-safe
$("#cmbCostRequestTypeId").val(costRequestTypeId);
$("#cmbCostRequestTypeDetailId").val(costRequestTypeDetailId);
$("#cmbCostRequestTypeSubDetail").val(costRequestTypeSubDetail);
$("#cmbOriginProvinceId").val(originProvinceId);
$("#cmbOriginCityId").val(originCityId);
$("#cmbDestinationProvinceId").val(destinationProvinceId);
$("#cmbDestinationCityId").val(destinationCityId);

// مقداردهی datepickerها به صورت مستقیم (در صورت داشتن setDate):
$("#dpCostDate").val(costDate);
$("#dpStartDate").val(startDate);
$("#bpEndDate").val(endDate);
