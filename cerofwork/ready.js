var $form;
var currentActorId;
var isGetForm = 0;
var ServiceLocationId;
var RequestType;
var WithRole;
var PersonnelNO;

$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_MainData",
			readFromData = FormManager.readEntity;
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
			var now = new Date();
			//resDate2 = "2024-09-22 07:04:00"; //resDate[0] + '-' + resDate[1] + '-' + resDate[2] + " 23:59:00";
			if(!inEditMode){
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
									ServiceLocation = dataXml.find("row:first").find(">col[name='ServiceLocation']").text();
									UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
									UserName = dataXml.find("row:first").find(">col[name='UserName']").text();
									RoleId = dataXml.find("row:first").find(">col[name='RoleId']").text();
									Mobile = dataXml.find("row:first").find(">col[name='Mobile']").text();
									ServiceLocationId = dataXml.find("row:first").find(">col[name='ServiceLocation_ID']").text();
									
									if (ServiceLocationId=="2")
									{
									    $("#ButtonControl13").show();
									}
									PersonnelNO = UserName;
									$("#txtFullName").val(fullName);
									$("#txtGuranteed").val(fullName);
									$("#txtServiceLoc").val(ServiceLocation);
									$("#txtPersonnel").val(UserName);
									$("#txtUnits").val(UnitsName);
									$("#txtPosition").val(RoleName);
									$("#txtMobile").val(Mobile);
									
									$("#type1").prop('disabled', false);
									$("#type2").prop('disabled', false);
									$("#RadioButtonControl4").prop('disabled', false);
									$("#RadioButtonControl3").prop('disabled', false);
									$("#Presentation_For").prop('disabled', false);
									$("#txtDiscription").prop('disabled', false);
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
			params.PersonnelNO = PersonnelNO;
			params.WithRole = WithRole;
			params.RequestType = RequestType;
			insertFromData(params,
				function(dataXml)
				{
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					inEditMode = true;
					WorkflowService.RunWorkflow("ZJM.COW.CertificateOfWork",
					    '<Content><Id>'+pk+'</Id><Type>'+RequestType+'</Type></Content>',
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
			//showLoading();
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