//tbl js

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
            readRows = FormManager.readEntityّRooms;
		//فراخوانی سازنده جدول
        init();
		//******************************************************************************************************
        function init()
        {
			
            element = $("#tblRoomList");
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
			
			element.on("click", ".edit", function() {
				var row = $(this).closest('tr'); 
			    var RoomId = row.find('td:eq(2)').text().trim();
				
            
            // دریافت مقادیر از سلول‌ها با استفاده از jQuery
            var title = row.find('td:eq(4)').text().trim(); // عنوان
            var location = row.find('td:eq(5)').text().trim(); // موقعیت
            var capacity = row.find('td:eq(6)').text().trim(); // ظرفیت اتاق
            var isOnline = row.find('td:eq(7)').text().trim() === "دارد" ? "دارد" : "ندارد"; // قابلیت پخش جلسه آنلاین
            var projector = row.find('td:eq(6)').text().trim() === "دارد" ? "دارد" : "ندارد"; // پرژکتور
            var whiteboard = row.find('td:eq(10)').text().trim() === "دارد" ? "دارد" : "ندارد"; // وایت برد
            var telephone = row.find('td:eq(9)').text().trim() === "دارد" ? "دارد" : "ندارد"; // تلفن
            var active = row.find('td:eq(12)').text().trim(); // فعال/غیرفعال
            
            // قرار دادن مقادیر در ورودی‌ها با jQuery
            $('#txtRoomTitle').val(title);
            $('#txtLocation').val(location);
            $('#txtCapacity').val(capacity);
            $('#cmbIsOnline').val(isOnline);
            $('#cmbProjector').val(projector);
            $('#cmbWhiteboard').val(whiteboard);
            $('#cmbTelephone').val(telephone);
            $('#cmbActive').val(active);

				
			});
			
			element.on("click", ".delete", function() {
				var row = $(this).closest('tr'); 
			    var id = row.find('td:eq(3)').text().trim(); 
				
			    var that = $(this); // ذخیره `this` در متغیر `that`
			    
			    $.qConfirm(that, "آیا از حذف مطمئن هستید؟", function(btn) {
			        if (btn.toUpperCase() === "OK") { // بررسی اینکه کاربر روی "OK" کلیک کرده است
						
						params =  {};
						FormManager.readEntityّFoodMealPlan(params,
							function(list,status) { 
								
								if (list.some(item => item.FoodId === id)) {
								   alert(JSON.stringify('این غذا به روز خاصی اختصاص داده شده '));
								} else {
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
								
					        },
					        function(error) { // تابع خطا
					            console.log("1خطای برگشتی:", error);
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
		
		tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Id);
	    var imgDelete = $("<img/>", {src: "Images/delete.png", title: "حذف"}).addClass("delete").css({cursor: "pointer"});
	    tempRow.find("td:eq(" + index++ + ")").append(imgDelete);
	    tempRow.attr({state: "saved"});
	    
	    var imgDelete = $("<img/>", {src: "Images/edit.png", title: "ویرایش"}).addClass("edit").css({cursor: "pointer"});
	    tempRow.find("td:eq(" + index++ + ")").append(imgDelete);
	    tempRow.attr({state: "new"});
		
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Title);
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Address);
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Capasity);
		
		tempRow.find("td:eq(" + index++ + ")").empty().text(Number(rowInfo.Projector) === 1 ? "دارد" : "ندارد");
		tempRow.find("td:eq(" + index++ + ")").empty().text(Number(rowInfo.IsLive) === 1 ? "دارد" : "ندارد");
		tempRow.find("td:eq(" + index++ + ")").empty().text(Number(rowInfo.Telephone) === 1 ? "دارد" : "ندارد");
		tempRow.find("td:eq(" + index++ + ")").empty().text(Number(rowInfo.WhiteBoard) === 1 ? "دارد" : "ندارد");
		
	    if (rowInfo.Active == "true") {
	        active = 'فعال';
	    } else {
	        active = 'غیرفعال'; 
	    }
	    tempRow.find("td:eq(" + index++ + ")").empty().text(active);
	    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Active);
	    
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
			
            var params = {}; 
            readRows(params,
                function(list)
                {
					//alert(JSON.stringify(list));
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
			/*
			params =  {};
				FormManager.readEntityّRooms(params,
					function(list,status) { 
						
						mainList=list;
						alert(JSON.stringify(params));
			        },
			        function(error) { // تابع خطا
			            console.log("1خطای برگشتی:", error);
			            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
			        }
			    );
			*/
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
//tbl js