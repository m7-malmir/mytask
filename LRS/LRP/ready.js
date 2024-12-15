var $form;
var currentActorId;
var html_;
var ProcessStatus;

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

		function build()
		{
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
			$("#Form1").css({top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px"});
		}

		function createControls()
		{
			Server.GetCurrentDate("dddd d MMMM yyyy", 'fa', true,
			    function(data) {
					$("#LabelControl12").text(data);
			    },
			    function(error) {
			        $ErrorHandling.Error(error, " خطا در تاریخ جاری سیستم");
			});
			var now = new Date();
			//resDate2 = "2024-09-22 07:04:00"; //resDate[0] + '-' + resDate[1] + '-' + resDate[2] + " 23:59:00";
			if(!inEditMode){
				$("#PanelControl2").css("display","none");
				p_status = "فرم ثبت درخواست";
				$("#LabelControl13").text(p_status);
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
									RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
									ServiceLocation = dataXml.find("row:first").find(">col[name='mahalkhedmat']").text();
									UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
									UserName = dataXml.find("row:first").find(">col[name='Codepersonel']").text();
									RoleId = dataXml.find("row:first").find(">col[name='RoleId']").text();
									HireDate = dataXml.find("row:first").find(">col[name='employmentdate']").text();
									ServiceLocationId = dataXml.find("row:first").find(">col[name='ServiceLocation_ID']").text();
																		
									$("#txtFullName").val(fullName).prop('disabled', true);
									$("#txtServiceLoc").val(ServiceLocation).prop('disabled', true);
									$("#txtPersonnel").val(UserName).prop('disabled', true);
									$("#txtUnits").val(UnitsName).prop('disabled', true);
									$("#txtPosition").val(RoleName).prop('disabled', true);
									$("#txtHireDate").val(HireDate).prop('disabled', true);
									
									$("#txtLoanAmount").prop('readOnly', false);
									$("#txtReqDate").prop('disabled', false);
									$("#txtLoanAmount").prop('disabled', false);
									$("#txtDiscription").prop('disabled', false);
									$("#comboReqType").prop('disabled', false);
								}
								if($.isFunction(onSuccess))
								{
									onSuccess(dataXml);
								}
							}
						);
					},
					function(err){
						hideLoading();
						$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
					}
				);
			}else{

				$("#CheckBoxControl1").parent().parent().hide();
				$("#comboOffice").hide();
				$("#TextBoxControl5").show();
				
				$("#ButtonControl4").hide();
				$("#ButtonControl13").hide();
				$("#ButtonControl1").show();
				$("#ButtonControl3").show();
				FormManager.readDescs({Where: "Process_ID = " + pk + " AND Process = 'CDS'"},
					function(list)
					{
						$("#ButtonControl13").val("نظرات و توضیحات (" + list.length + ")");
					},
					function(err)
					{
						hideLoading();
						alert(err);
					}
				);
				$("#ButtonControl1").show();
				readFromData({Where: primaryKeyName + " = " + pk},
					function(dataXml)
					{
						PersonnelNO = dataXml.find("row:first").find(">col[name='PersonnelNO']").text();
						ProcessStatus = dataXml.find("row:first").find(">col[name='ProcessStatus']").text();
						GuranteeType = dataXml.find("row:first").find(">col[name='GuranteeType']").text();
						$("#TextBoxControl5").val(GuranteeType);
						LoanAmount = dataXml.find("row:first").find(">col[name='LoanAmount']").text();
						LoanInstallments = dataXml.find("row:first").find(">col[name='LoanInstallments']").text();
						
						$("#txtLoanAmount").val(commafy(LoanAmount));
						$("#txtLoanInstallments").val(commafy(LoanInstallments));
						p_status = ""
						if(ProcessStatus == 2){
							p_status = "فرم بررسی منابع انسانی کارخانه";
							$("#LabelControl26").text("تعهدات درخواست دهنده");
						}else if(ProcessStatus == 3){
							p_status = "فرم بررسی جبران خدمات";
							$("#LabelControl26").text("تعهدات درخواست دهنده");
							$("#LabelControl27").show();
							$("#LabelControl20").show();
							$("#TextBoxControl1").show();
							$("#TextBoxControl2").show();
						}else if(ProcessStatus == 4){
							p_status = "فرم بررسی معاون منابع انسانی";
							$("#LabelControl26").text("تعهدات درخواست دهنده");
							$("#LabelControl27").show();
							$("#LabelControl20").show();
							$("#TextBoxControl1").show();
							$("#TextBoxControl2").show();
							$("#TextBoxControl1").prop('disabled',true);
							$("#TextBoxControl2").prop('disabled',true);
						}else if(ProcessStatus == 5){
							p_status = "فرم صدور گواهی کسر از حقوق توسط جبران خدمات";
							
							$("#LabelControl27").show();
							$("#LabelControl20").show();
							$("#TextBoxControl1").show();
							$("#TextBoxControl2").show();
							
							$("#LabelControl28").show();
							$("#LabelControl33").show();
							$("#LabelControl34").show();
							$("#PanelControl5").show();
							$("#TextBoxControl3").show();
							$("#TextBoxControl4").show();
							$("#ButtonControl2").show();
							
							$("#TextBoxControl1").prop('disabled',true);
							$("#TextBoxControl2").prop('disabled',true);
							
							$("#LabelControl26").text("تعهدات درخواست دهنده");
							$("#ButtonControl3").hide();
							$("#ButtonControl1").val("گواهی صادر گردید");
						}	
						$("#LabelControl13").text(p_status);
						FundType = dataXml.find("row:first").find(">col[name='FundType']").text();
						var params = {Where: "UserName = '" + PersonnelNO.toString() + "' AND EnabledRole = 1"};
						BS_GetUserInfo.Read(params
							, function(data)
							{
								var dataXml = null;
								if($.trim(data) != "")
								{
									dataXml = $.xmlDOM(data);
									fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
									RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
									ServiceLocation = dataXml.find("row:first").find(">col[name='ServiceLocation']").text();
									UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
									UserName = dataXml.find("row:first").find(">col[name='UserName']").text();
									RoleId = dataXml.find("row:first").find(">col[name='RoleId']").text();
									Mobile = dataXml.find("row:first").find(">col[name='Mobile']").text();
									ServiceLocationId = dataXml.find("row:first").find(">col[name='ServiceLocation_ID']").text();
									
									$("#txtFullName").val(fullName);
									$("#txtGuranteed").val(fullName);
									$("#txtServiceLoc").val(ServiceLocation);
									$("#txtPersonnel").val(UserName);
									$("#txtUnits").val(UnitsName);
									$("#txtPosition").val(RoleName);
									$("#txtMobile").val(Mobile);
								}
							}, function(err){
								alert(JSON.stringify("خطا در دریافت اطلاعات درخواست! لطفا با پشتیبان سامانه تماس بگیرید."));
							}
						);
					}
				);
			}
		}

		function bindEvents()
		{
			/*randomFileId = Math.floor(Math.random() * (1000000000)) - 2000000;
			firstRandomId = randomFileId;*/
		}

		function readData()
		{
			showLoading();
			readFromData({Where: primaryKeyName + " = " + pk},
				function(dataXml)
				{
					
					hideLoading();
					$.setFormDataValues(bindingSourceName, dataXml);
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);
		}

		function getPK()
		{
			return pk;
		}

		function isInEditMode()
		{
			return inEditMode;
		}

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
				function()
				{
					$.alert("لطفا موارد اجباری را تکمیل نمایید.", "", "rtl",
						function()
						{}
					);
				}
			);
		}

		function insertData(callback)
		{
			showLoading();
			var params = $.getFormDataValues(bindingSourceName);
			params.CreatorActor_ID = currentActorId;
			params.LoanNeededAmount = rcommafy($("#txtLoanAmount").val());
			params.PersonnelNO = $("#txtPersonnel").val();
			insertFromData(params,
				function(dataXml)
				{
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					inEditMode = true;
					WorkflowService.RunWorkflow("ZJM.LRP.LoanRequestProcess",
					    '<Content><Id>'+pk+'</Id></Content>',
					    true,
					    function(data)
					    {
					        $.alert("درخواست شما با موفقیت ارسال شد.","","rtl",function(){
								hideLoading();
					        	closeWindow({OK:true, Result:null});
							});				
					    }
					    ,function(err)
					    {
					        alert('مشکلی در شروع فرآیند به وجود آمده. '+err);
					        hideLoading();
					    }
					);
					myHideLoading();
					if($.isFunction(callback))
					{
						callback();
					}
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);
		}

		function updateData(callback)
		{
			showLoading();
			var params = {};
			params.MonthlyTotalCommitmentAmount = $("#TextBoxControl2").val();
			params.MonthlyTotalCommitmentRatio = $("#TextBoxControl1").val();
			params = $.extend(params, {Where : primaryKeyName + " = " + pk});
			updateFromData(params,
				function(data)
				{
					Office.Inbox.setResponse(dialogArguments.WorkItem,1, ""
					    , function(data)
					    { 
					        closeWindow({OK:true, Result:null});
					    }, function(err){ throw Error(err); }
					);
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);
		}
		
		function deleteData(callback)
		{
			showLoading();
		}

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