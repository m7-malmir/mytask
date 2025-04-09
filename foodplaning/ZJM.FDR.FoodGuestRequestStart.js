//#region js ready
var $form;
var currentActorId;
var ProcessStatus;
var currentPersonnelNO;
var FoodId;
$(function(){
	$form = (function()
	{ 
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
			insertFromData = FormManager.insertEntity,
			readRows = FormManager.readEntityّSPFoodView;
		//******************************************************************************************************	
		function init()
		{ 
			build();
			createControls();
			bindEvents();
		}
        //******************************************************************************************************
		function build()
		{
			//اگر بخواهیم استیل دهی خاصی داشته باشیم در این متد اعمال می شود
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
		}
		//******************************************************************************************************
		//مقداردهی به المان ها در هر دو حالت ویرایش و ایجاد
		function createControls()
		{	
			showLoading();
			$("#btnEdit").css('display','none');
			UserService.GetCurrentActor(true,
				function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
					},
				function(err){
					hideLoading();
					$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
				}
			);
		}
		//******************************************************************************************************
		// تمام ایونت های مربوط به یک المان یا خود فرم در این متد نوشته می شوند
		// مانند ماوس هاور و ...
		function bindEvents()
		{
		}
		//******************************************************************************************************
		function readData()
		{
		}
		//******************************************************************************************************
		// برای دریافت شناسه فرایند بعد از ایجاد و یا در ویرایش استفاده می شود
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
		function getPK()
		{
			return pk;
		}
		//******************************************************************************************************
		// برای دریافت شناسه فرایند بعد از ایجاد و یا در ویرایش استفاده می شود
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
		function isInEditMode()
		{
			return inEditMode;
		}
		//******************************************************************************************************
		function saveData(callback)
		{
			if(inEditMode)
			{
				updateData(callback);
			}
			else
			{
				insertData(callback);
			}
		}
		//******************************************************************************************************

		function insertData(callback) {
		    // تعریف params به عنوان یک شیء خالی
		    var params = {}; 
			var sdate = $("#txtSelectStartDate").attr("gdate").split('/').join('-');
			var edate = $("#txtSelectEndDate").attr("gdate").split('/').join('-');
		    params.CreatorActorId = currentActorId;
		    params.StartDate = sdate;
		    params.EndDate = edate;
		    params.Description = $("#txtDescription").val().trim(); 
			
		    // فراخوانی تابع insertFromData با params به‌روزرسانی شده
		    insertFromData(params,
		        function(dataXml) {
				    var GuestRequestId = dataXml.find("row:first").find(">col[name='Id']").text();
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					const guestCodes = new Set();
					
					// تابع برای تولید کد مهمان یکتا
					function generateUniqueGuestCode() {
					    let code;
					    do {
					        code = Math.floor(Math.random() * 900000) + 100000;
					    } while (code.toString().startsWith('5') || code.toString().startsWith('0') || guestCodes.has(code));
					
					    guestCodes.add(code);
					    return code;
					}
					// پیمایش روی ردیف‌های جدول
					var Guests = [];
					var param={};
					$('#tblFood .row-data').each(function() {
					    var $row = $(this);
					    var guestCode = generateUniqueGuestCode(); // فرض بر اینه این تابع قبلاً تعریف شده
					    var param = {
					        'GuestRequestId': GuestRequestId, // فرض بر اینه این متغیر هم قبلاً تعریف شده
					        'GuestCode': guestCode,
					        'FirsName': $row.find('td').eq(2).text().trim(),
					        'LastName': $row.find('td').eq(3).text().trim(),
					        'VIP': $row.find('td').eq(4).text().trim().toLowerCase() === "دارد" ? 1 : 0,
					        'GiftPack': $row.find('td').eq(5).text().trim().toLowerCase() === "دارد" ? 1 : 0,
					        'BreakFast': $row.find('td').eq(6).text().trim().toLowerCase() === "دارد" ? 1 : 0,
					        'Lunch': $row.find('td').eq(7).text().trim().toLowerCase() === "دارد" ? 1 : 0,
					        'Dinner': $row.find('td').eq(8).text().trim().toLowerCase() === "دارد" ? 1 : 0
					    };
					
					    Guests.push(param); // اضافه کردن مهمان به لیست
					});
					FormManager.insertGuestDetail(Guests,
					    function(dataXml) { 
							
								WorkflowService.RunWorkflow("ZJM.FDR.FoodGuestsReservation",
									'<Content><Id>' + pk + '</Id></Content>',
									true,
								
									function(data) {
					
										   $.alert("درخواست شما با موفقیت ارسال شد.", "", "rtl", function() {
											hideLoading();
											closeWindow({ OK: true, Result: null });
										});
									},
									function(err) {
										console.error('مشکلی در شروع فرآیند به وجود آمده:', err); // چاپ خطا در کنسول
										alert('مشکلی در شروع فرآیند به وجود آمده. ' + err);
										hideLoading();
									}
								);
								myHideLoading();
								if ($.isFunction(callback)) {
									callback();
								}
											        $.alert("اطلاعات مهمان با موفقیت ثبت شد.","","rtl",function(){	
									closeWindow({OK:true, Result:null});
						        });
						    },
						    function(error) { // تابع خطا
						        console.log("خطای برگشتی:", error);
						        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
						    }
						);
		            myHideLoading();
		            if ($.isFunction(callback)) {
		                callback();
		            }
				}
		    );		    
		}
		//******************************************************************************************************
		function updateData(callback)
		{
		}
		//******************************************************************************************************
		function deleteData(callback)
		{
			// اگر بخواهیم خود اینستنس فرایند را حذف کنیم کد فراخوانی حذف از فرم منیجر را اینجا می نویسیم
		}
		//******************************************************************************************************
		function validateForm(onSuccess, onError)
		{
			try
			{
				$("[role]").validateData(true);
				if($.isFunction(onSuccess))
				{
					onSuccess();
				}
			}
			catch(e)
			{
				if($.isFunction(onError))
				{
					onError();
				}
			}
		}
		//******************************************************************************************************
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
		//******************************************************************************************************
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
//#endregion

//#region js form manager
var FormManager = {
	//*****************************************************************************************************
	readEntityّFoodEdit: function(jsonParams, onSuccess, onError)
	{
	  /*  BS_HRFood.Read(jsonParams
	        , function(data)
	        {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
	            xmlvar.find("row").each(
	                function()
	                { 
	                    list.push
	                    ({
	                        FoodId: $(this).find("col[name='FoodId']").text(),
	                        FoodTitle: $(this).find("col[name='FoodTitle']").text(),
	                        FoodStatus: $(this).find("col[name='FoodStatus']").text()
	                    });
	                }
	            );
	            if($.isFunction(onSuccess))
	            {
	                onSuccess(list);
	            
	            }
	        }, onError
	    );*/
	},
		//*****************************************************************************************************
	readEntityّFoodMealPlan: function(jsonParams, onSuccess, onError)
	{
	   BS_FoodMealPlan.Read(jsonParams
	        , function(data)
	        {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
	            xmlvar.find("row").each(
	                function()
	                { 
	                    list.push
	                    ({
	                        FoodId: $(this).find("col[name='FoodId']").text(),
	                        FoodTitle: $(this).find("col[name='FoodTitle']").text(),
	                        FoodStatus: $(this).find("col[name='FoodStatus']").text()
	                    });
	                }
	            );
	            if($.isFunction(onSuccess))
	            {
	                onSuccess(list);
	            
	            }
	        }, onError
	    );
	},
	//******************************************************************************************************
	insertEntity: function(jsonParams, onSuccess, onError)
	{
		 BS_HRGuestRequest.Insert(jsonParams,
			function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					dataXml = $.xmlDOM(data);
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			}, 
			function(error) {
				var methodName = "insertEntity";

	            if ($.isFunction(onError)) {
					var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
					console.error("Error:", erroMessage);
					console.error("Details:", error);
	                
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error(erroMessage+ " (no onError callback provided):", error);
	            }
	        }
		);
		
	},
	//******************************************************************************************************
	deleteEntity: function(jsonParams, onSuccess, onError)
	{
		BS_HRFood.Delete(jsonParams, 
			function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					dataXml = $.xmlDOM(data);
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			},
			function(error) {
					var methodName = "deleteEntity";
	
		            if ($.isFunction(onError)) {
						var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
						console.error("Error:", erroMessage);
						console.error("Details:", error);
		                
		                onError({
		                    message: erroMessage,
		                    details: error
		                });
		            } else {
		                console.error(erroMessage+ " (no onError callback provided):", error);
		            }
		        }
		);
	},
	//******************************************************************************************************
	updateEntity: function(jsonParams, onSuccess, onError)
	{
		 BS_HRFood.Update(jsonParams
			, function(data)
			{
				
				var dataXml = null;
				if($.trim(data) != "")
				{
					dataXml = $.xmlDOM(data);
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			}, 
		function(error) {
					var methodName = "deleteEntity";
	
		            if ($.isFunction(onError)) {
						var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
						console.error("Error:", erroMessage);
						console.error("Details:", error);
		                
		                onError({
		                    message: erroMessage,
		                    details: error
		                });
		            } else {
		                console.error(erroMessage+ " (no onError callback provided):", error);
		            }
		        }
		);
	},
};
//#endregion

//#region js tbl
var tblMain = null;

$(function () {
    tblMain = (function () {
        var element = $("#tblFood");
        init();
        function init() {
            bindEvents();
        }

        function bindEvents() {
		$("#btnRegisterGuests").click(function () {
		    var firstName = $("#txtFirstName").val().trim();
		    var lastName = $("#txtLastName").val().trim();
		    var vip = $("#cmbVIP").val(); // دریافت مقدار VIP
		    var giftpack = $("#cmbGiftpack").val(); // دریافت مقدار پک هدیه
		    var breakfast = $("#cmbBreakfast").val(); // دریافت مقدار صبحانه
		    var lunch = $("#cmbLunch").val(); // دریافت مقدار ناهار
		    var dinner = $("#cmbDinner").val(); // دریافت مقدار شام
		
		    // بررسی اینکه نام و نام خانوادگی وارد شده باشد
		    if (firstName === "" || lastName === "") {
		        alert("لطفاً نام و نام خانوادگی را وارد کنید.");
		        return;
		    }
		
			// بررسی تکراری نبودن نام و نام خانوادگی
			var isDuplicate = false;
			$("#tblFood tr.row-data").each(function() {
			    var existingFirstName = $(this).find("td:eq(2)").text().trim(); 
			    var existingLastName = $(this).find("td:eq(3)").text().trim(); 
			    
			    if (existingFirstName === firstName && existingLastName === lastName) {
			        isDuplicate = true;
			        return false; 
			    }
			});
			
			if (isDuplicate) {
			    alert("این نام و نام خانوادگی قبلاً ثبت شده است.");
			    return;
			}
		
		    // محاسبه شماره ردیف جدید
		    var newRowNumber = $("#tblFood tr.row-data").length + 1; 
		
		    // اطلاعات ردیف جدید
		    var rowInfo = {
		        RowNumber: newRowNumber, 
		        FirstName: firstName,
		        LastName: lastName,
		        VIP: vip,
		        Giftpack: giftpack,
		        Breakfast: breakfast,
		        Lunch: lunch,
		        Dinner: dinner
		    };
		    
		    addRow(rowInfo); // تابع برای اضافه کردن ردیف جدید به جدول
		
		    // پاک کردن مقادیر ورودی‌ها
		    $("#txtFirstName").val('');
		    $("#txtLastName").val('');
		    $("#cmbVIP").val('ندارد'); 
		    $("#cmbGiftpack").val('ندارد'); 
		    $("#cmbBreakfast").val('ندارد'); 
		    $("#cmbLunch").val('ندارد'); 
		    $("#cmbDinner").val('ندارد'); 
		});
			
		

          element.on("click", ".delete", function () {
              $(this).closest("tr").remove();
              updateRowNumbers(); // به‌روزرسانی شماره‌ها بعد از حذف
          });
        }
		function addRow(rowInfo) {
		    var tempRow = $("#tblFood").find("tr.row-template").clone(); // کپی ردیف الگو
		    tempRow.show().removeClass("row-template").addClass("row-data"); // نمایش و تغییر کلاس
		
		    var index = 0;
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.RowNumber); // شماره ردیف
		
		    var imgDelete = $("<img/>", {
		        src: "Images/delete.png",
		        title: "حذف",
		        class: "delete",
		        css: { cursor: "pointer" }
		    });
		
		    tempRow.find("td:eq(" + index++ + ")").empty().append(imgDelete); // حذف
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.FirstName); // نام
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.LastName); // نام خانوادگی
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.VIP); // VIP
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Giftpack); // پک هدیه
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Breakfast); // صبحانه
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Lunch); // ناهار
		    tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Dinner); // شام
		
		    $("#tblFood").find("tbody").append(tempRow); // اضافه کردن ردیف جدید به جدول
		}

        function updateRowNumbers() {
            element.find("tr.row-data").each(function (index, row) {
                $(row).find("td:eq(0)").text(index + 1);  
            });
        }
    })();
});

//#endregion

//#region js 

//#endregion
