var $form;
var currentActorId;
var ProcessStatus;
var PersonnelNO;
$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
			readFromData = FormManager.readEntity,
			updateFromData = FormManager.updateEntity,
            insertFromData = FormManager.insertEntity;
		//******************************************************************************************************	
		function init()
		{
			
			//اگر از جریان فرآیند یا بصورت پاپ آپ از یک فرم دیگر باز شود
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
			
			$("#btnConfirm").css('display','none');
			$("#btnReject").css('display','none');
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
		//****************************************************
		
		function createControls()
		{	
			if(!inEditMode){
				UserService.GetCurrentActor(true,
					function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
						var params = {Where: "ActorId = " + currentActorId};
						
						//----------------------------------------------------------------
						// دریافت اطلاعات و نمایش در صفحه
						//----------------------------------------------------------------
						BS_GetUserInfo.Read(params
							, function(data)
							{
								var dataXml = null;
								if($.trim(data) != "")
								{
									dataXml = $.xmlDOM(data);
									fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
									RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
									PersonnelNO = dataXml.find("row:first").find(">col[name='Codepersonel']").text();
																
									$("#txtFullName").val(fullName).prop('disabled', true);
									$("#txtPersonnelNO").val(PersonnelNO).prop('disabled', true);
									$("#txtRoleName").val(RoleName).prop('disabled', true);
									tblMain.refresh();
								}
							}
						);
						//----------------------------------------------------------------
					},
					function(err){
						hideLoading();
						$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
					}
				);
			}
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
			showLoading();
			readFromData({Where: primaryKeyName + " = " + pk},
				function(dataXml)
				{
					alert(JSON.stringify(data));
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
			if(inEditMode)
			{
				updateData(callback);
			}
			else
			{
				insertData(callback);
			}
		}
		//******************************************************************************************************
		function insertData(callback)
		{
			showLoading();
			var params = {};
			
			//در مواردی که المان ها بایند شده باشند از این روش استفاده می کنیم
			//var params = $.getFormDataValues(bindingSourceName);
			// البته می توانیم هر یک از موارد دلخواه دیگر را که بانیسد نشده اند را هم بصورت دستی با این روش بایند کنیم
			params.CreatorActor_ID = currentActorId;
						
			insertFromData(params,
				function(dataXml)
				{
					// pk در واقع همان Id رکورد ایجاد شده می باشد primaryKeyName = Id
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					var params = {};
					params.LoanPayment_ID = pk;
					params = $.extend(params, {Where :"LoanPayment_ID IS NULL AND CreatorActor_ID = "+currentActorId});
					
					FormManager.updateEntityBankLoanCredit(params,
						function(data)
						{
							// فراخوانی شروع فرآیند الزامی می باشد
							WorkflowService.RunWorkflow("ZJM.LPP.LoanAssigmentProcess",
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
						},
						function(err)
						{
							hideLoading();
							alert(err);
						}
					);
					inEditMode = true;
					
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