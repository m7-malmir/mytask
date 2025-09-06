//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var html_;
var ProcessStatus;
var hire_this_year = 0;
var daysForHireDiff;

$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_MainData",
			readFromData = FormManager.readEntity,
			updateFromData = FormManager.updateEntity,
            insertFromData = FormManager.insertEntity;
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
					readData();
				}
			}
			
			build();
			createControls();
			bindEvents();
		}
        //******************************************************************************************************	
		function build()
		{
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
			$("#frmLoanRequest").css({top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px"});
						
			//Set the new dialog title
	 	   changeDialogTitle("ثبت صورتجلسه");
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
			
			UserService.GetCurrentActor(true,
				function(data){
					hideLoading();
					var xmlActor = $.xmlDOM(data);
					currentActorId = xmlActor.find('actor').attr('pk');
					var params = {Where: "ActorId = " + currentActorId};
					
					BS_GetUserInfo.Read(params
						, function(data)
						{
							var dataXml = null;
							if($.trim(data) != "")
							{
								dataXml = $.xmlDOM(data);
								fullName = dataXml.find("row:first").find(">col[name='fullName']").text();	
								userId =dataXml.find("row:first").find(">col[name='UserId']").text(); 						
								$("#txtFullName").val(fullName).prop('disabled', true);
								$("#txtActorIdCreator").val(userId).prop('disabled', true);
							}
						}
					);
				},
				function(err){
					hideLoading();
					$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
				}
			);
			$("#cmbUserPresent").data("user-field", "#txtPresentUserId").data("role-field", null);
			$("#cmbUserAbsent").data("user-field", "#txtAbsentUserId").data("role-field", null);
			$("#cmbResponsibleForAction").data("user-field", "#txtResponsibleUserId").data("role-field", null);
			
			requestAnimationFrame(() => {
			    fillComboWithService($("#cmbUserPresent"), BS_GetUserInfo, "انتخاب شخص");
			    fillComboWithService($("#cmbUserAbsent"), BS_GetUserInfo, "انتخاب غایبین");
			    fillComboWithService($("#cmbResponsibleForAction"), BS_GetUserInfo, "شخص مسئول", true); // ← اینجا true
			});


		}
        //******************************************************************************************************	
		function bindEvents()
		{
		}
		//******************************************************************************************************	
		function readData()
		{
		}
		//******************************************************************************************************	
		function getPK()
		{
			return pk;
		}
		//******************************************************************************************************	
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
		}
		//******************************************************************************************************	
		function validateForm(onSuccess, onError)
		{
			try
			{
				if ($("#txtSubjectMeeting").val() == '' && $("#txtMeetingAgenda").val() == '') {
		            if ($.isFunction(onError)) {
		                onError("لطفا عنوان و دستورکار جلسه را وارد کنید!");
		            }
		            return;
		        }
				
				if ($("#txtLoanAmount").val() == '0' || $("#txtLoanAmount").val() == '') {
		            if ($.isFunction(onError)) {
		                onError("مبلغ وارد شده نامعتبر می باشد");
		            }
		            return;
		        }
				
				if ($("#txtReqDate").val() == '') {
		            if ($.isFunction(onError)) {
		                onError("لطفاً تاریخ موردنیاز را انتخاب نمایید");
		            }
		            return;
		        }
				
				
				var currentDate = new Date();
				var year = currentDate.getFullYear();
			    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
			    var day = currentDate.getDate().toString().padStart(2, '0');
				var currentDateFormatted = `${year}-${month}-${day}`;
							
				var [month2, day2, year2] = $("#txtReqDate").attr('gdate').split('/').map(Number);
				var selectedDate = `${year2.toString().padStart(4, '0')}-${month2.toString().padStart(2, '0')}-${day2.toString().padStart(2, '0')}`;
				
				if(selectedDate >= currentDateFormatted)
				{
					if ($.isFunction(onError)) {
		                onError("تاریخ انتخابی نمی تواند بزرگتر  از تاریخ روز جاری باشد");
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
					onError(e.message);
				}
			}
		}
		//******************************************************************************************************

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