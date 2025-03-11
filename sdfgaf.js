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
			$("#btnRegister").click(function(){
				params =  {};
				FormManager.readEntityّFoodMealPlan(params,
					function(list,status) { 
						mainList=list;
			        },
			        function(error) { // تابع خطا
			            console.log("1خطای برگشتی:", error);
			            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
			        }
			    );
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
						let mealId = 3;
						list[0]['FoodId'] = foodId;
						list[0]['MealId'] = mealId;
							
						const isDuplicate = list.some(item => 
							mainList.some(mainItem => mainItem.CalendarId === item.CalendarId)
						);
						
						if (isDuplicate) {
							alert(JSON.stringify('برای روز انتخابی برنامه غذایی تدوین شده است'));
						} else {
							
						}
							
							if ($("#hiddenFoodId").val() === '') {
							  list = $.extend(list, { Where: "FoodMealPlanId = '" + $("#mealPlanSelectId").val() + "'" });
							 alert(JSON.stringify(list));
							/*	FormManager.updateEntity(list,
							        function(status, list) { 
										$.alert("ویرایش با موفقیت انجام شد","","rtl",function(){
											hideLoading();
								        	tblMain.refresh();
										});
							        },
							        function(error) { // تابع خطا
							            console.log("1خطای برگشتی:", error);
							            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
							        }
							    );
							*/
							}else{
							alert(JSON.stringify(list));
							/*	FormManager.insertEntity(list,
							        function(status, list) { 
										$.alert("غذا در تاریخ انتخابی با موفقیت ثبت شد","","rtl",function(){
											hideLoading();
								        	tblMain.refresh();
										});
							        },
							        function(error) { // تابع خطا
							            console.log("1خطای برگشتی:", error);
							            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
							        }
							    );	
								*/
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