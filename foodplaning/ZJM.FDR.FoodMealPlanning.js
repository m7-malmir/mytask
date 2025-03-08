/******************************* js for table */
var tblMain = null;

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
			//دکمه افزودن     
            /*var imgAdd = $("<img/>", {src: "Images/add.png", title: "افزودن"}).addClass("add").css({cursor: "pointer"});
            element.find("tr.row-template").find("td:first").empty().append(imgAdd);*/
			
			//برای حذف دکمه افزودن این سطر را فعال و سطر باتلا را حذف کنید
            // if you don't want to use add button inside table uncomment the line below and remove the lines up
            //element.find("tr.row-template").hide();
        }
		//******************************************************************************************************
		//این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود

		function bindEvents()
        {
			$("#btnRegister").click(function(){
				
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
							FormManager.insertEntity(list,
						        function(status, list) { 
									$.alert("ثبت غذا با موفقیت انجام شد.","","rtl",function(){
										hideLoading();
							        	tblMain.refresh();
									});
						        },
						        function(error) { // تابع خطا
						            console.log("خطای برگشتی:", error);
						            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
						        }
						    );
							
							$.alert("ثبت غذا با موفقیت انجام شد.","","rtl",function(){
								hideLoading();
							});
				        },
				        function(error) { // تابع خطا
				            console.log("خطای برگشتی:", error);
				            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
				        }
				    );
				}else{
					alert(JSON.stringify('not ok'));
					$.alert("تاریخ پیشنهادی جلسه باید از بعد از فردا باشد.", "", "rtl",
						function()
						{}
					);
					return;
				}
			});
			//delete row
			/**************************************************************/
			element.on("click", ".delete", function() {
				var row = $(this).closest('tr'); 
			    var id = row.find('td:eq(3)').text().trim(); 
				
			    var that = $(this); // ذخیره `this` در متغیر `that`
			    
			    $.qConfirm(that, "آیا از حذف مطمئن هستید؟", function(btn) {
			        if (btn.toUpperCase() === "OK") { // بررسی اینکه کاربر روی "OK" کلیک کرده است
						
			            params =  { Where: "FoodId = "+id };
					    FormManager.deleteEntity(params,
					        function(status, list) { 
								$.alert("حذف غذا با موفقیت انجام شد.","","rtl",function(){
									hideLoading();
						        	tblMain.refresh();
								});		
					        },
					        function(error) { // تابع خطا
					            console.log("خطای برگشتی:", error);
					            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
					        }
					    );
						
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
	
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FoodMealPlanId);
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FoodTitle);
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.SolarStrDay);
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.SolarStrDay);
	    
	    element.find("tr.row-template").before(tempRow);
	    myHideLoading();
	}
		//******************************************************************************************************
		/*function editRow(row)
        {
			var rowInfo = row.data("rowInfo"),
				params = {};
			
            params[rowPrimaryKeyName] = rowInfo[rowPrimaryKeyName]; // change params if needed 

            $.showModalForm({registerKey: editFormRegKey, params: params},
                function(retVal)
                {
                    if(retVal.OK)
                    {
                        // if edit form saves the changes
                        refresh();

                        // if edit form passes new values down to be managed here
                        changeRow(row, retVal.Data);
                    }
                }
            );
        }*/
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
			//متد readRows در ایتدای همین صفحه از FormManager مقدار دهی شده است.
			// درصورت نیاز به لود از لیست این بخش بازنویسی میگردد
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
/****************************** */