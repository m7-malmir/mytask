//#region js ready
var $form;
var currentActorId;
var ProcessStatus;
var currentPersonnelNO;

$(function(){
	$form = (function()
	{ 
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_FoodView",
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
		{	showLoading();
			UserService.GetCurrentActor(true,
				function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
												
						//----------------------------------------------------------------
						// دریافت اطلاعات و نمایش در صفحه
						//----------------------------------------------------------------
						var params = {Where: "ActorId = " + currentActorId};
						
						BS_GetUserInfo.Read(params
							, function(data)
							{
								var dataXml = null;
								if($.trim(data) != "")
								{
									dataXml = $.xmlDOM(data);
									fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
									RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
									PersonnelNO = dataXml.find("row:first").find(">col[name='Codepersonel']").text();
									currentPersonnelNO= PersonnelNO;
									 						
									$("#txtFullName").val(fullName).prop('disabled', true);
									$("#txtPersonnelNO").val(PersonnelNO).prop('disabled', true);
									$("#txtRoleName").val(RoleName).prop('disabled', true);
									
									tblMain.refresh();
								}
							}
						);
						//----------------------------------------------------------------
					},
				function(err){
					hideLoading();
					$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
				}
			);
			
			
			$().css('');
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
		function insertData(callback)
		{
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
//#endregion

//#region js form manager
var FormManager = {
	//*****************************************************************************************************
	readEntityّFoodEdit: function(jsonParams, onSuccess, onError)
	{
	    BS_HRCalendar.Read(jsonParams
	        , function(data)
	        {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
				
	            xmlvar.find("row").each(
	                function()
	                {
	                    list.push
	                    ({
							CalendarId: $(this).find("col[name='CalendarId']").text()
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
//*****************************************************************************************************
	readEntityّMealPlan: function(jsonParams, onSuccess, onError)
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
							CalendarId: $(this).find("col[name='CalendarId']").text()
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
		 BS_FoodMealPlan.Insert(jsonParams,
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
		BS_FoodMealPlan.Delete(jsonParams, 
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
		 BS_FoodEdit.Update(jsonParams
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
		//*****************************************************************************************************
	readEntityّFoodMealPlan: function(jsonParams, onSuccess, onError)
	{
	    vw_HR_FDR_FoodMealPlan.Read(jsonParams
	        , function(data)
	        {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
	            xmlvar.find("row").each(
	                function()
	                { 
	                    list.push
	                    ({
	                        FoodMealPlanId: $(this).find("col[name='FoodMealPlanId']").text(),
	                        FoodTitle: $(this).find("col[name='FoodTitle']").text(),
	                        SolarDate: $(this).find("col[name='SolarDate']").text(),
							SolarStrDay: $(this).find("col[name='SolarStrDay']").text()
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
};
//#endregion

//#region js tbl
var tblMain = null;
var mainList;
$(function()
{
    tblMain = (function()
    {
		//خواندن پارامترهای اصلی جدول
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
			readFromData = FormManager.readReservationCount,
            readRows = FormManager.readEntityّFoodMealPlan
		//فراخوانی سازنده جدول
        init();
		//******************************************************************************************************
        function init()
        {
            element = $("#tblFoodMealPlan");
            build();
            bindEvents();
            //load();

        }
		//******************************************************************************************************
        function build()
        {       
        }
		//******************************************************************************************************
		//این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود

		function bindEvents()
        {
			//update with edit button
			/***********************************************************************/
			
			element.on("click", ".edit", function() {
				
			    var row = $(this).closest('tr');
			    var foodTitle = row.find('td:eq(4)').text().trim();
			    foodTitle = foodTitle.replace(/\u200C/g, ' ').replace(/\s+/g, ' ').trim();
				var foodDate = row.find('td:eq(6)').text().trim(); // تاریخ
    			var foodMealSelect = row.find('td:eq(3)').text().trim(); // شناسه
				
			    var $cmbHRFood = $("#cmbHRFood");
			    var option = $cmbHRFood.find("option").filter(function() {
			        return $(this).text().trim() === foodTitle;
			    });
			    if (option.length > 0) {
			        var selectedFoodId = option.val(); // متغیر جدید
			
			        if ($cmbHRFood.find("option[value='" + selectedFoodId + "']").length) {
			            $cmbHRFood.val(selectedFoodId).trigger("change");
			            
			            $("#hiddenFoodId").val(selectedFoodId);
						$("#txtSelectDate").val(foodDate);
					    $("#mealPlanSelectId").val(foodMealSelect);
						$("#txtSelectDate").attr('disabled',true);
						$(".ui-datepicker-trigger").css('display','none');
			        }
			    } else {
			        console.warn("گزینه مورد نظر در لیست یافت نشد: " + foodTitle);
			    }
				
			});
			
			/***********************************************************************/
			//insert food
			$("#btnRegister").click(function(){
				
				
					if($("#mealPlanSelectId").val()===''){
					
					//insert
					var tomorrow = new Date();
				    tomorrow.setDate(tomorrow.getDate() );
					var year = tomorrow.getFullYear();
				    var month = (tomorrow.getMonth() ).toString().padStart(2, '0');
				    var day = tomorrow.getDate().toString().padStart(2, '0');
					var tomorrowDate = `${year}-${month}-${day}`;
					
					var dateString = $("#txtSelectDate").attr('gdate');
					var [month2, day2, year2] = dateString.split('/').map(Number);
					selectedDate = `${year2.toString().padStart(4, '0')}-${month2.toString().padStart(2, '0')}-${day2.toString().padStart(2, '0')}`;
				
					if(selectedDate > tomorrowDate){
						 if ($("#txtFoodTitle").val() === '') {
					        $.alert("نام غذا و وضعیت آن را تعیین نمایید", "", "rtl");
					        return;
						 }
						params =  {  Where: "SolarDate = '" + $("#txtSelectDate").val() + "'"  };
					
						 FormManager.readEntityّFoodEdit(params,
					        function(list,status) {
								
							let foodId =$("#cmbHRFood").val();
							let mealId = 2;
							list[0]['FoodId'] = foodId;
							list[0]['MealId'] = mealId;
							
							const isDuplicate = list.some(item => 
								mainList.some(mainItem => mainItem.CalendarId === item.CalendarId)
							);
							
							if (isDuplicate) {
								alert(JSON.stringify('برای روز انتخابی برنامه غذایی تدوین شده است'));
							} else {
								
							
								FormManager.insertEntity(list,
							        function(status, list) { 
										$.alert("غذا در تاریخ انتخابی با موفقیت ثبت شد","","rtl",function(){
											hideLoading();
											$("#txtSelectDate").val('');
										    $("#cmbHRFood").val('');
											tblMain.refresh();
										});
							        },
							        function(error) { // تابع خطا
							            console.log("1خطای برگشتی:", error);
							            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
							        }
							    );
								
							}	
					        },
					        function(error) { // تابع خطا
					            console.log("2خطای برگشتی:", error);
					            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
					        }
					    );
					}else{
						alert(JSON.stringify('not ok'));
						$.alert("تاریخ ثبت غذا باید از بعد از فردا باشد.", "", "rtl",
							function()
							{}
						);
						return;
					}
					
				}else{
				 list={
					'FoodId':$("#cmbHRFood").val()
					};
				 list = $.extend(list, { Where: "FoodMealPlanId = '" + $("#mealPlanSelectId").val() + "'" });
					FormManager.updateEntity(list,
				        function(status, list) { 
							$.alert("غذا در تاریخ مورد نظر ویرایش شد.","","rtl",function(){
								hideLoading();
					        	tblMain.refresh();
								
								$("#hiddenFoodId").val('');
								$("#txtSelectDate").val('');
							    $("#mealPlanSelectId").val('');
								$("#txtSelectDate").attr('disabled',false);
								$(".ui-datepicker-trigger").css('display','inline-flex');
								
							});
				        },
				        function(error) { // تابع خطا
				            console.log("1خطای برگشتی:", error);
				            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
				        }
					);
					
				}

			});
			/**************************************************************/
			element.on("click", ".delete", function() {
				var row = $(this).closest('tr'); 
			    var id = row.find('td:eq(3)').text().trim();
			    var that = $(this); 
			    $.qConfirm(that, "آیا از حذف مطمئن هستید؟", function(btn) {
			        if (btn.toUpperCase() === "OK") { 
						
						params =  {};
						FormManager.readEntityFoodReservationّ(params,
							function(list,status) {
								if (list.some(item => item.FoodMealPlanId === id)) {
								   alert(JSON.stringify('وعده غذایی مورد نظر رزرو می باشد.'));
								} else {
									params = { Where: "FoodMealPlanId = "+id };
								    FormManager.deleteEntity(params,
								        function(status, list) { 
											$.alert("حذف غذا در این تاریخ با موفقیت انجام شد.","","rtl",function(){
												hideLoading();
									        	tblMain.refresh();
											});		
								        },
								        function(error) { 
								            console.log("خطای برگشتی:", error);
								            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
								        }
								    );
									
								}
						});
					}
			    });
			});
       }
	//******************************************************************************************************
	//عملیات پر کردن دیتای هر سطر می باشد

	function addRow(rowInfo, rowNumber)
	{
	    var index = 0,
	    tempRow = element.find("tr.row-template").clone();
	
	    tempRow.show().removeClass("row-template").addClass("row-data");
	    tempRow.data("rowInfo", rowInfo);
	    
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
	    var imgDelete = $("<img/>", {src: "Images/delete.png", title: "حذف"}).addClass("delete").css({cursor: "pointer"});
	    tempRow.find("td:eq(" + index++ + ")").append(imgDelete);
	    tempRow.attr({state: "saved"});
		
				var imgDelete = $("<img/>", {src: "Images/edit.png", title: "ویرایش"}).addClass("edit").css({cursor: "pointer"});
	    tempRow.find("td:eq(" + index++ + ")").append(imgDelete);
	    tempRow.attr({state: "new"});
	
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FoodMealPlanId);
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FoodTitle);
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.SolarStrDay);
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.SolarDate);
	    
	    element.find("tr.row-template").before(tempRow);
	    myHideLoading();
	}
		//******************************************************************************************************
		//حذف یک سطر
        function removeRow(row)
        {
			row_info = row.data("rowInfo");
			
			var params={Where: rowPrimaryKeyName + " = " + row_info.Id}
			
			deleteRows(params,
                function(data)
                {
					refresh();
					hideLoading();
                },
                function(error)
                {
					hideLoading();
                    alert(error);
                }
            );
        }
		//******************************************************************************************************
		//برگذاری دیتا برای نمایش که در صورت لزوم می توان یک لیست به آن پاس داد
        function load()
        {
           var params = {}; // change the params sent to FormManager with needed info
			showLoading();
	           readRows(params,
	               function(list)
	               {
					if(list.length > 0){
						for(var i = 0, l = list.length; i < l; i += 1)
	                    {
	                        addRow(list[i], i + 1);
	                    }
					}
					myHideLoading();
	               },
	               function(error)
	               {
					myHideLoading();
	                   alert(error);
	               }
	           );
			myHideLoading();
				
			
			params =  {};
				FormManager.readEntityّHrFoodMealPlan(params,
					function(list,status) { 
						mainList=list;
			        },
			        function(error) { // تابع خطا
			            console.log("1خطای برگشتی:", error);
			            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
			        }
			    );
			
			
			FormManager.readReservationCount({}, function(dataXml) {
			    var parser = new DOMParser();
			    var xmlDoc = parser.parseFromString(dataXml, "text/xml");
			    var reservationCounter = xmlDoc.getElementsByTagName("col")[0].textContent;
				$("#txtReservationCounter").val(reservationCounter);
			 }, function(error) {
			    console.error("Error:", error);
			    alert("خطا رخ داد: " + JSON.stringify(error));  
			});
		}
		//******************************************************************************************************
		//بروز رسانی دیتای جدول
        function refresh()
        {
			//حذف دیتای موجود
			element.find("tr.row-data").remove();
			
			//بازنشانی دیتای جدول
            load();
        }
		//******************************************************************************************************

        return {
            refresh: refresh,
			load: load,
			readRows: readRows
        };
    }());
});
//#endregion

//#region js for cmbHRFood
var $comboOffice = null;
$(function(){
	$comboOffice = new Combobox().init($("#cmbHRFood"));
	$comboOffice.onLoad(function(){
		$('#cmbHRFood').val(0);
		$('#cmbHRFood').select2({
			dir: "rtl",
			placeholder: 'انتخاب غذا'
		  });
	});
});
//#endregion
