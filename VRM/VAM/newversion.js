var $form;
var currentActorId;
var isGetForm = 0;
var ServiceLocationId;
var RequestType;
var WithRole;
var PersonnelNO;
var html_;
var is_printed = 0;
var CarId; // تعریف متغیر CarId بدون مقداردهی اولیه

$(function(){
	$form = (function()
	{
		// دریافت CarId از dialogArguments
		if(typeof dialogArguments !== "undefined" && "CarId" in dialogArguments) {
			CarId = dialogArguments.CarId; // مقداردهی CarId از پارامترهای فرم دیگر
		} else {
			CarId = 12; // مقدار پیش‌فرض در صورت عدم ارسال از فرم دیگر
		}

		alert(JSON.stringify(CarId)); // نمایش CarId برای بررسی
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_InsertCar",
			readFromData = FormManager.readEntity,
            insertFromData = FormManager.insertEntity;
		
		function init()
		{
			if(typeof dialogArguments !== "undefined")
			{
				if(primaryKeyName in dialogArguments)
				{
					pk = dialogArguments[primaryKeyName];
					inEditMode = true;
					readData();
				}
				if("FormParams" in dialogArguments)
				{
					pk = dialogArguments.FormParams;
					inEditMode = true;
					readData();
				}
			}
			build();
			createControls();
			bindEvents();
		}
		
		function build()
		{
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
			$("#Form1").css({top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px"});
		}

		function createControls()
		{
			Server.GetCurrentDate("dddd d MMMM yyyy", 'fa', true,
			    function(data) {
					$("#LabelControl12").text(data);
			    },
			    function(error) {
			        $ErrorHandling.Error(error, " خطا در تاریخ جاری سیستم");
			});

			if(!inEditMode){
				$("#PanelControl2").hide();
				$("#LabelControl1").hide();
				UserService.GetCurrentActor(true,
					function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
						var params = {Where: "Id = '" + CarId + "'"}; // استفاده از CarId
						alert(JSON.stringify(CarId));
						BS_InsertCar.Read(params, function(data) {
							var dataXml = null;
							if($.trim(data) != "")
							{
								dataXml = $.xmlDOM(data);
								
								// خواندن اطلاعات خودرو
								CarName = dataXml.find("row:first").find(">col[name='CarName']").text();
								ModelYear = dataXml.find("row:first").find(">col[name='ModelYear']").text();
								Color = dataXml.find("row:first").find(">col[name='Color']").text();
								SS = dataXml.find("row:first").find(">col[name='SS']").text();
								CarNO = dataXml.find("row:first").find(">col[name='CarNO']").text();
								Status = dataXml.find("row:first").find(">col[name='Status']").text();
								
								if (ServiceLocationId == "2")
								{
								    $("#ButtonControl13").show();
								}
								$("#CarName").val(CarName);
								$("#CarModel").val(ModelYear);
								$("#CarColor").val(Color);
								$("#CarSS").val(SS);
								$("#CarNo").val(CarNO);
								$("#txtPosition").val(Status);
								$("#CarSS").prop('disabled', false);
							}
						});
					},
					function(err){
						hideLoading();
						$ErrorHandling.Error(err,"خطا در سرویس getCurrentActor");
					}
				);
			} else {
				// کد مربوط به حالت ویرایش
			}
		}

		function bindEvents() {
			// کد مربوط به رویدادها
		}

		function readData() {
			// کد مربوط به خواندن داده‌ها
		}

		function getPK() {
			return pk;
		}

		function isInEditMode() {
			return inEditMode;
		}

		function saveData(callback) {
			// کد مربوط به ذخیره داده‌ها
		}

		function insertData(callback) {
			// کد مربوط به درج داده‌ها
		}

		function updateData(callback) {
			// کد مربوط به به‌روزرسانی داده‌ها
		}
		
		function deleteData(callback) {
			// کد مربوط به حذف داده‌ها
		}

		function validateForm(onSuccess, onError) {
			// کد مربوط به اعتبارسنجی فرم
		}
		
		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			validateForm: validateForm,
			saveData: saveData
		};
	}());
	$form.init();
});