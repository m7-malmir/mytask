//#region ready.js
var $form;
//---------------------------------
// Global Variables For UserInfo
//---------------------------------
var currentusername;
var currentPersonnelNO;
var currentUserCompanyId;
var nationalCode;
var currentUserfirstname;
var currentUserlastname;
var birthday;
var email;
var employmentDate;
var rankTitle;
var leaveDate;
var gender;
//---------------------------------
var userId;

$(function(){
	$form = (function()
	{ 
		var pk,
			isInTestMode = false;
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
			
			$("#txtPersonnelCredit").on("input", function() {
			    $(this).val(commafy($(this).val().replace(/,/g,"")));
			});
		}
		//******************************************************************************************************
		//مقداردهی به المان ها در هر دو حالت ویرایش و ایجاد
		function createControls()
		{		
			//-----------------------------------
			//	Get Test Mode Value
			//-----------------------------------
			try {
				const parentUrl = window.parent?.location?.href;
				const url = new URL(parentUrl);
		   	 isInTestMode = url.searchParams.get("icantestmode") === "1";
			  }
			  catch (e) {
			    console.warn("Cannot reach parent document:", e);
			    isInTestMode = false;
			  }
			//-----------------------------------
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
			saveData: saveData,

		};
	}());
	$form.init();
});
//#endregion

//#region btnregister.js
$("#btnRegister").click(function(){
	
    var personnelCode = $("#txtPersonnelCode").val().trim();
	var firstName = $("#txtFirstName").val().trim();
    var personnelCredit = $("#txtPersonnelCredit").val().trim();
    var selectedDiscount = $("#cmbDiscountPercent").val().trim();
	
	// اگر فیلد کد پرسنلی پر بود و دکمه جستجو را نزده بود باز هم پیام هشدار باقی میماند
    if (personnelCode === "" || firstName==="") {
        $.alert("لطفاً کد پرسنلی را جستجو کنید.", "", "rtl");
        return false;
    }
	// فقط موقعی معتبره که درصد باشه
	if (!selectedDiscount.endsWith('%')) { 
	    $.alert('لطفا مقدار تخفیف را انتخاب کنید!', "", "rtl");
	    return;
	}
	// اگر میزان اعتبار شخص خالی بود
    if (personnelCredit === "") {
        $.alert("لطفاً میزان اعتبار را وارد کنید.", "", "rtl");
        return false;
    }
    //از بین بردن علامت % برای insert در دیتابیس
	selectedDiscount = selectedDiscount.replace('%', '').trim();
	FormManager.readPersonnelCredit({},
		function(list,status) {
			//چک کردن اینکه آیا برای کد پرسنلی پرسنل جستجو شده اعتبار تخصیص داده شده است یا نه
			if (list.some(item => item.PersonnelCode === currentPersonnelNO)) {
			   $.alert("برای شخص مورد نظر اعتبار تخصیص داده شده است!", "", "rtl");
			   return false;
			} else {
				var params = {
				    'UserId': userId,
				    'PersonnelCode': currentPersonnelNO, 
				    'AccYear': getCurrentShamsiDate(),
				    'DiscountPercent': selectedDiscount,
				    'Credit': rcommafy(personnelCredit),
				    'RemainCredit': rcommafy(personnelCredit),
					'CreatedUserId':userId
				};
			    FormManager.insertPersonnelCredit(params,
			       function(status, list) { 
					    $.alert("ثبت اعتبار با موفقیت انجام شد.","","rtl",function(){
							//رفرش کردن فرم برای جستجو و ثبت مجدد اعتبار پرسنل
							location.reload();
						});
			        }, function(error) { // تابع خطا
						handleError(error, 'FormManager.insertPersonnelCredit'); 
			    	}
				);					
			}
		}
	);
});

//#endregion    

//#region btn search.js
$("#btnPersonnelSearch").click(function() {
    // گرفتن کد پرسنلی از فیلد ورودی
    var personnelCode = $("#txtPersonnelCode").val().trim(); 

    // بررسی اینکه آیا کاربر کد پرسنلی وارد کرده است یا نه
    if (!personnelCode) {
        $.alert('لطفاً کد پرسنلی را وارد کنید.', "", "rtl");
        return;
    }
    // فراخوانی تابع برای خواندن اطلاعات پرسنل با شماره پرسنلی مشخص
    UserHelpes.readEmployeeInfo(personnelCode, function(list) {
        if (list && list.length > 0) {
            var employee = list[0]; 
			currentPersonnelNO=employee.CurrentPersonnelNO;
			userId=employee.UserId;
            // پر کردن فیلدهای ورودی با اطلاعات پرسنل
            $("#txtFirstName").val(employee.CurrentUserFirstName);
            $("#txtLastName").val(employee.CurrentUserLastName);
            $("#txtRoleName").val(employee.RoleName || 'ندارد');
            $("#txtUnitsName").val(employee.UnitsName || 'ندارد');
        } else {
            $.alert('هیچ اطلاعاتی برای کد پرسنلی داده شده پیدا نشد.', "", "rtl");
			return;
        }
    }, function(error) { 
	    handleError(error, 'UserHelpes.readEmployeeInfo'); 
	});
});
//#endregion

//#region formmanager
var FormManager = {
//******************************************************************************************************
	insertPersonnelCredit: function(jsonParams, onSuccess, onError)
	{
		BS_HR_PersonnelCredit.Insert(jsonParams
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
			}, onError
		);
	},
//*****************************************************************************************************
	readPersonnelCredit: function(jsonParams, onSuccess, onError)
	{
	   BS_HR_PersonnelCredit.Read(jsonParams
	        , function(data)
	        {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
				
	            xmlvar.find("row").each(
	                function()
	                {
	                    list.push
	                    ({
							PersonnelCode: $(this).find("col[name='PersonnelCode']").text()
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