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
			ReadGoodsInfo=FormManager.ReadGoodsInfo,
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
			/******************************************************************************/
			showLoading();
			UserService.GetCurrentUser(true,
				function(data){
						hideLoading(); 
				});				
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
		    var params = {}; 
			params.CompanyId = currentUserCompanyId;
		    params.CreatorActorId = currentActorId;
		    params.StartDate = $("#txtStartDate").attr("gdate").split('/').join('-');
		    params.EndDate = $("#txtEndDate").attr("gdate").split('/').join('-');
		    params.Description = $("#txtDescription").val().trim(); 
			
		    // ثبت Geust Master
		    insertFromData(params,
		        function(dataXml) {
				    var GuestRequestId = dataXml.find("row:first").find(">col[name='Id']").text();
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					
					// پیمایش روی ردیف‌های جدول
					var Guests = [];
					var param={};
					$('#tblGuestList .row-data').each(function() {
						//ایجاد کد مهمان
						var guestCode = GenerateRandomCode(6);
						
						// ثبت شدن این کد از قبل چک شود
						
					    var $row = $(this);
					    var param = {
					        'GuestRequestId': GuestRequestId,
					        'GuestCode': guestCode,
					        'FirstName': $row.find('td').eq(2).text().trim(),
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
							WorkflowService.RunWorkflow("ZJM.GUR.GuestRequest",
								'<Content><Id>' + pk + '</Id><IsInTestMode>' + isInTestMode + '</IsInTestMode></Content>',
								true,
								function(data) {
										handleRunWorkflowResponse(data);
									},
								function(err) {
										handleError(err,'WorkflowService.RunWorkflow');
									}
							);
					    },
					    function(error) {
					        handleError(err,'FormManager.insertGuestDetail');
					    }
					);

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
				var startDate = $('#txtStartDate').val().trim();
			    var endDate = $('#txtEndDate').val().trim();
			    var description = $('#txtDescription').val().trim();
												
			    if ($('#txtStartDate').val().trim() == '' ) {
					if ($.isFunction(onError)) {
		                onError("لطفا تاریخ ورود مهمان (ها) را تعیین نمایید");
		            }
			        return; 
			    }
				
				if ($('#txtEndDate').val().trim() == '' ) {
					if ($.isFunction(onError)) {
		                onError("لطفا تاریخ خروج مهمان (ها) را تعیین نمایید");
		            }
			        return; 
			    }

				if ($('#txtDescription').val().trim() == '' ) {
					if ($.isFunction(onError)) {
		                onError("لطفا متن توضیح علت حضور مهمان (ها) را وارد نمایید");
		            }
			        return; 
			    }
								
				var $rows = $('#tblGuestList .row-data');
				if ($rows.length === 0) {
					if ($.isFunction(onError)) {
		                onError("لطفاً اطلاعات مهمان(ها) را وارد نمایید");
		            }
				    return; 
				}
				
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