//#region js.ready
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

var currentActorId;
var selectedValue;
//---------------------------------
var GoodsHavePrice;
var IS_Goods_ID;
var CreditBalance;
var ProcessStatus;
$(function(){
	$form = (function()
	{ 
		var pk,
			isInTestMode = false;
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
			readEmployeeInfo = UserHelpes.readEmployeeInfo;
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
		  	 UserService.GetCurrentUser(true,
				function(data){
						hideLoading(); 
						var xml = $.xmlDOM(data);
					
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

//#region btnPersonnelNOSearch.js
// تابعی برای بارگذاری داده‌ها
function loadEmployeeData(PersonnelNO) {
    UserHelpes.readEmployeeInfo(PersonnelNO, function(list) {
        // پاک کردن داده‌های قبلی در جدول
        $("#tblPersonnelNO tbody tr:not(.row-header)").remove();
        
        // افزودن داده‌های جدید به جدول
        list.forEach(function(item) {
            // بررسی اینکه آیا Enabled برابر با true است
            if (item.Enabled === 'true') { // فقط ردیف‌هایی که فعال هستند
                var newRow = `
                    <tr style="height:20px" class="row-data">
                        <td style="width:25px;background-color:#E0F6FE;border:solid 1px #BED4DC" align="center">*</td>
                        <td style="width:100px;display:none;border:solid 1px #BED4DC">${item.ActorId}</td>
                        <td style="width:250px;border:solid 1px #BED4DC">${item.RoleId}</td>
                        <td style="width:350px;border:solid 1px #BED4DC">${item.RoleName}</td>
                        <td style="width:350px;border:solid 1px #BED4DC">${item.Enabled === 'true' ? 'فعال' : 'غیرفعال'}</td>
                        <td style="width:220px;border:solid 1px #BED4DC"><button class="btnDelete">حذف سمت</button></td>
                    </tr>`;
                $("#tblPersonnelNO tbody").append(newRow);
            }
        });
    }, function(error) {
        myHideLoading();
        alert('خطا: ' + error);
    });
}

// بارگذاری داده‌ها هنگام کلیک بر روی دکمه جستجو
$("#btnPersonnelNOSearch").click(function() {
    var PersonnelNO = $("#txtPersonnelNO").val();
    loadEmployeeData(PersonnelNO); // فراخوانی تابع بارگذاری داده‌ها
});

// رویداد کلیک برای دکمه‌های حذف
$(document).on("click", ".btnDelete", function() {
    // تأیید حذف
    var confirmation = confirm("آیا از حذف سمت مطمئن هستید؟");
    if (confirmation) {
        var actorId = $(this).closest("tr").find("td").eq(1).text(); 
        var params = {
            ActorId: actorId
        };
        
        FormManager.RevokeActorId(params, function(list) {
            $.alert("حذف سمت کاربر با موفقیت انجام شد.", "", "rtl", function() {
                hideLoading();
                
                // بارگذاری دوباره داده‌ها پس از حذف
                var PersonnelNO = $("#txtPersonnelNO").val(); // می‌توانید از همین مقدار استفاده کنید
                loadEmployeeData(PersonnelNO); // فراخوانی تابع بارگذاری داده‌ها
            });
        }, function(error) {
            console.log(error);
            alert("خطا در ارسال درخواست: " + error);
        });
    } else {
        // اگر کاربر تأیید نکرد، هیچ کاری انجام نمی‌دهیم
        console.log("حذف سمت لغو شد.");
    }
});
//#endregion

//#region form manager.js
var FormManager = {

	//******************************************************************************************************
	readEntityGoodsCatalogue: function(jsonParams, onSuccess, onError)
	{
	  BS_vw_IS_GoodsCatalogue.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                   list.push
	                   ({
			                 GoodsId: $(this).find("col[name='GoodsId']").text(),
			                 GoodsCode: $(this).find("col[name='GoodsCode']").text(),
			                 GoodsName: $(this).find("col[name='GoodsName']").text(),
			                 LogicalQty: $(this).find("col[name='LogicalQty']").text(),
						     Price: $(this).find("col[name='Price']").text(),
			                 BrandName: $(this).find("col[name='BrandName']").text()
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
/*********************************************************************************************************/
	
	ReadBrandName: function(jsonParams, onSuccess, onError) {
	    SP_vw_IS_GoodsCatalogue_Brand.Execute(jsonParams, function(data) {
	        var xmlvar = $.xmlDOM(data);
	        var brandOptions = '';
	
	        xmlvar.find("row").each(function() {
	            var BrandRef = $(this).find(">col[name='BrandRef']").text();
	            var BrandName = $(this).find(">col[name='BrandName']").text();
	            brandOptions += '<option value="' + BrandRef + '">' + BrandName + '</option>';
	        });
	
	        // اگر onSuccess یک تابع باشد، آن را فراخوانی کنید و گزینه‌ها را به آن بفرستید
	        if ($.isFunction(onSuccess)) {
	            onSuccess(brandOptions);
	        }
	    }, onError);
	},
		//******************************************************************************************************
	ReadPersonnelCredit: function(jsonParams, onSuccess, onError)
	{
	  BS_HRPersonnelCredit.Read(jsonParams
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
			                 Credit: $(this).find("col[name='Credit']").text(),
			                 RemainCredit: $(this).find("col[name='RemainCredit']").text(),
						 	CancelCredit: $(this).find("col[name='CancelCredit']").text(),
						     DiscountPercent: $(this).find("col[name='DiscountPercent']").text(),
						 	LimitDiscountPercent: $(this).find("col[name='LimitDiscountPercent']").text()
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
/*********************************************************************************************************/

    RetailPersonnelOrder: function(jsonParams, onSuccess, onError) 
	{
        SP_RetailPersonnelOrder.Execute(jsonParams, function(data) {
            var list = [];
            var xmlvar = $.xmlDOM(data);
            xmlvar.find("row").each(function() {
                list.push({
                    Result: $(this).find("col[name='res']").text()
                });
            });
            if ($.isFunction(onSuccess)) {
                onSuccess(list);
            }
        }, function(error) {
            if ($.isFunction(onError)) {
                onError(error);
            }
        });
    }
};
//#endregion