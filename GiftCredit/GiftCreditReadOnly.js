//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;
$(function(){
	$form = (function()
	{
		var pk,
		inTestMode = (typeof isInTestMode !== "undefined" ? isInTestMode : false),
		primaryKeyName = "Id",
		readFromData = FormManager.readPersonnelGiftCredit,
		inEditMode = false;

		//******************************************************************************************************	
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
				}
			}
	      build();
	      createControls();

		}
        //******************************************************************************************************	
		function build()
		{			
			//Set the new dialog title
	 	   changeDialogTitle(" بازبینی اعتبار هدیه");
		}
		//******************************************************************************************************	
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
			showLoading();
	        readFromData(
	            { Where: primaryKeyName + " = " + pk },
	            function (formData) {
	                if (!Array.isArray(formData) || formData.length === 0) {
	                    console.warn("داده فرم خالی است");
	                    hideLoading();
	                    return;
	                }
	                const giftCreditUserId = formData[0].GiftCreditForUserId;
	                // پرکردن فیلدهای فرم از فرم ثبت کننده اعتبار هدیه
	                $("#txtOfferedGiftCredit").val(commafy(formData[0].OfferedGiftCredit));
	                $("#txtDescription").val(formData[0].Description);
	                $("#txtGiftCreditForUserId").val(formData[0].GiftCreditForUserId);
					$("#txtConfirmedGiftCredit").val(commafy(formData[0].ConfirmedGiftCredit));
	                // گرفتن اطلاعات کاربر اعتبار گیرنده
	                BS_GetUserInfo.Read(
	                    { Where: "UserId = " + giftCreditUserId },
	                    function (userData) {
	                        $("#txtFullName").val(getField(userData, "FullName", "fullName"));
	                        $("#txtUserName").val(getField(userData, "UserName", "UserName"));
	                        $("#txtUnitsName").val(getField(userData, "UnitsName", "UnitsName"));
	                        $("#txtRoleName").val(getField(userData, "RoleName", "RoleName"));
	                        
	                        // اگه CreatorActor_ID هم خواستی:
	                        const creatorActorId = getField(userData, "CreatorActor_ID", "CreatorActor_ID");
							tblPersonnelGiftCredit.refresh();
	                        hideLoading();
	                    },
	                    function (err) {
	                        handleError(err, "BS_GetUserInfo.Read");
	                    }
	                );
	            },
	            function (err) {
	                handleError(err, "readFromData");
	            }
	        );
		}
		//******************************************************************************************************
		function getPK()
		{
			return pk;
		}
		//******************************************************************************************************
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
		function isInEditMode()
		{
			return inEditMode;
		}
		//******************************************************************************************************
		function refresh() {
           // element.find("tr.row-data").remove();
            load();
        }
		//******************************************************************************************************
		// چک کردن url برای رفتن به حالت تست مود
		function isInTestMode() {
		    try {
		        const parentUrl = window.parent?.location?.href;
		        const url = new URL(parentUrl);
		        return url.searchParams.get("icantestmode") === "1";
		    } catch (e) {
		        console.warn("Cannot reach parent document:", e);
		        return false;
		    }
		}
		//******************************************************************************************************
		return {
			init: init,
			refresh: refresh,
			getPK: getPK,
			isInEditMode: isInEditMode,
			isInTestMode: isInTestMode
		};
	}());
	$form.init();
});
//#endregion

//#region btnClose.js
$("#btnRegister").click(function () {
	closeWindow({OK:true, Result:null});
});

//#endregion


//#region tblPersonnelGiftCredit.js
var tblPersonnelGiftCredit = null;

$(function() {
    tblPersonnelGiftCredit = (function() {
        //خواندن پارامترهای اصلی جدول
        var element = null,
            isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readPersonnelGiftCredit;
        //فراخوانی سازنده جدول
        init();
        //******************************************************************************************************
        function init() {
            element = $("#tblPersonnelGiftCredit");
            load();
        }
        /* *********************************************************************************************** */
        // عملیات پر کردن دیتای هر سطر می باشد
		function load() {
		    var params = { Where: "Id = " + $form.getPK() };
		    showLoading();
		
		    readRows(
		        params,
		        function(list) {
		            element.find("tr.row-data").remove();
		
		            if (list.length === 0) {
		                showNoDataRow();
		            } else {
		                for (var i = 0; i < list.length; i++) {
		                    addRow(list[i], i + 1);
		                }
		            }
		
		            hideLoading(); // اینجا بعد از پر شدن جدول
		        },
		        function(error) {
		            hideLoading(); // اینجا بعد از مواجهه با خطا
		            alert(error);
		        }
		    );
		}

		function addRow(rowInfo, rowNumber) {
		    var index = 0,
		    tempRow = element.find("tr.row-template").clone();
		    tempRow.show().removeClass("row-template").addClass("row-data");
		    tempRow.data("rowInfo", rowInfo);
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
		    tempRow.find("td:eq(" + index++ + ")").empty().text(formatGregorianToJalali(rowInfo.CreatedDate));
		    tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.ConfirmedGiftCredit));
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Description);
		    tempRow.attr({ state: "new" });
		
		    element.find("tr.row-template").before(tempRow);
		}
		function showNoDataRow() {
		    // colspan رو برابر تعداد ستون‌ها بذار
		    element.append('<tr class="row-data"><td colspan="4" style="text-align:center;color:#999;">داده‌ای یافت نشد!</td></tr>');
		    hideLoading();
		}
        //******************************************************************************************************
        //بروز رسانی دیتای جدول
        function refresh() {
            element.find("tr.row-data").remove();
            load();
        }
        //******************************************************************************************************
        return {
            refresh: refresh,
            load: load
        };
    }());
});
//#endregion
