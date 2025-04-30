//#region ready.js
var $form;

//---------------------------------
// Global Variables For UserInfo
//---------------------------------
var currentusername;
var currentPersonnelNO;
var currentActorId;
//--------------------------------

var ProcessStatus;
var FoodId;
$(document).ready(function() {
  $('#txtCapacity').on('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
});

$(function(){
	$form = (function()
	{ 
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "";
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
			UserService.GetCurrentUser(true,
				function(data){
						hideLoading();
						tblMain.refresh();
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
			validateForm(
				function()
				{
					if(inEditMode)
					{
						updateData(callback);
					}
					else
					{
						insertData(callback);
					}
				},
				function(errorMessage) {
		            $.alert(errorMessage || "لطفا موارد اجباری را تکمیل نمایید.", "", "rtl",
		                function() {}
		            );
		        }
			);
		}
		//******************************************************************************************************
		function insertData(callback) {		    
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

//#region tbl.js
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
        }
		//******************************************************************************************************
		//این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود
        function bindEvents()
        {
			element.on("click", ".edit", function() {
		    var row = $(this).closest('tr'); 
		    var RoomId = row.find('td:eq(1)').text().trim();	
            // دریافت مقادیر از سلول‌ها با استفاده از jQuery
            var title = row.find('td:eq(4)').text().trim(); // عنوان
            var location = row.find('td:eq(5)').text().trim(); // موقعیت
            var capacity = row.find('td:eq(6)').text().trim(); // ظرفیت اتاق
            var isOnline = row.find('td:eq(8)').text().trim() === "دارد" ? "دارد" : "ندارد"; // قابلیت پخش جلسه آنلاین
            var projector = row.find('td:eq(7)').text().trim() === "دارد" ? "دارد" : "ندارد"; // پرژکتور
            var whiteboard = row.find('td:eq(10)').text().trim() === "دارد" ? "دارد" : "ندارد"; // وایت برد
            var telephone = row.find('td:eq(9)').text().trim() === "دارد" ? "دارد" : "ندارد"; // تلفن
            var active = row.find('td:eq(11)').text().trim(); // فعال/غیرفعال
			
            // قرار دادن مقادیر در ورودی‌ها با jQuery
			$('#hiddenId').val(RoomId);	
			$('#txtRoomTitle').val(title);
            $('#txtLocation').val(location);
            $('#txtCapacity').val(capacity);
            $('#cmbIsOnline').val(isOnline);
            $('#cmbProjector').val(projector);
            $('#cmbWhiteboard').val(whiteboard);
            $('#cmbTelephone').val(telephone);
            $('#cmbActive').val(active === "فعال" ? "فعال" : "غيرفعال");
			   		
			});
			
			element.on("click", ".delete", function() {
				var row = $(this).closest('tr'); 
		  	  var RoomId = row.find('td:eq(1)').text().trim();
				
			    var that = $(this); // ذخیره `this` در متغیر `that`
			    
			    $.qConfirm(that, "آیا از حذف مطمئن هستید؟", function(btn) {
			        if (btn.toUpperCase() === "OK") { // بررسی اینکه کاربر روی "OK" کلیک کرده است
						
	     			   params =  { Where: "Id = "+RoomId };
					    FormManager.deleteEntity(params,
					        function(status, list) { 
								$.alert("حذف اتاق با موفقیت انجام شد.","","rtl",function(){
									hideLoading();
						        	tblMain.refresh();
								});		
					        },
					        function(error) { // تابع خطا
					            handleError(error,'delete-tbl');
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
				FormManager.readEntityّRooms(params,
					function(list,status) {
						mainList=list;
			        },
			        function(error) { 
			            console.log("خطای برگشتی:", error);
			            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
			        }
			    );
			
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

//#region form-manager
var FormManager = {
	//******************************************************************************************************
	readEntityّRooms: function(jsonParams, onSuccess, onError)
	{
	    BS_MMMeetingRooms.Read(jsonParams
	        , function(data)
	        {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
	            xmlvar.find("row").each(
	                function()
	                { 
	                    list.push
	                    ({
							Id: $(this).find("col[name='Id']").text(),
	                        Title: $(this).find("col[name='Title']").text(),
	                        Address: $(this).find("col[name='Address']").text(),
	                        Capasity: $(this).find("col[name='Capasity']").text(),
							Projector: $(this).find("col[name='Projector']").text(),
							IsLive: $(this).find("col[name='IsLive']").text(),
							Telephone: $(this).find("col[name='Telephone']").text(),
							WhiteBoard: $(this).find("col[name='WhiteBoard']").text(),
							Active: $(this).find("col[name='Active']").text()
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
		 BS_MMMeetingRooms.Insert(jsonParams,
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
		BS_MMMeetingRooms.Delete(jsonParams, 
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
		 BS_MMMeetingRooms.Update(jsonParams
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

//#region btn-register/edit
$("#btnRegisterRoom").click(function () {

	var RoomId=$("#hiddenId").val();
	var params = {
            'Title': $("#txtRoomTitle").val(), 
            'Address': $("#txtLocation").val(),
		    'Capasity': $("#txtCapacity").val(), 
			'Projector': $('#cmbProjector').val() === "دارد" ? '1' : '0',
			'IsLive': $('#cmbIsOnline').val() === "دارد" ? '1' : '0',
			'Telephone': $('#cmbTelephone').val() === "دارد" ? '1' : '0',
			'WhiteBoard': $('#cmbWhiteboard').val() === "دارد" ? '1' : '0',
            'Active': $("#cmbActive").val() === "فعال" ? '1' : '0'
       };
    if (RoomId!='') {
        params = $.extend(params, { Where: "Id = "+RoomId });
		FormManager.updateEntity(params,
				function(status, list) { 
					$.alert("ویرایش اتاق با موفقیت انجام شد.","","rtl",function(){
						$("#txtRoomTitle").val('');
						$("#txtLocation").val('');
		    			$("#txtCapacity").val('');
						hideLoading();
						tblMain.refresh();
					});		
				},
				function(error) { // تابع خطا
					console.log("خطای برگشتی:", error);
					$.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
				}
			);
    }else{
	
		if ($("#txtRoomTitle").val() === '' || $("#txtLocation").val() === '') {
	        $.alert("لطفا نام اتاق و آدرس آن را رد قسمت مربوطه وارد نمایید.", "", "rtl");
	        return;		
	    }	

		const isDuplicate = mainList.some(item => item.Title.trim() === params.Title.trim());
		if (isDuplicate) {
		    alert(JSON.stringify('این اتاق قبلا در لیست ثبت شده است.'));
			return;
		} else {
	      FormManager.insertEntity(params,
       	 function(status, list) { 
				$.alert("ثبت اتاق با موفقیت انجام شد.","","rtl",function(){
					hideLoading();
		        	tblMain.refresh();
					$("#txtRoomTitle").val('');
					$("#txtLocation").val('');
	    			$("#txtCapacity").val('');
					$form.refresh();
				});
	        },
	        function(error) { // تابع خطا
				handleError(error,'btnRegisterRoom');
        	}
    	  );
			
		}	
	}
	
});
//#endregion