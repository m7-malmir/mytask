var $form;
var currentActorId;
var isGetForm = 0;
var ServiceLocationId;
var RequestType;
var WithRole;
var PersonnelNO;
var html_;
var is_printed = 0;

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

				UserService.GetCurrentActor(true,
					function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
						var params = {Where: "ActorId = '" + currentActorId + "' AND EnabledRole = 1"};
						BS_GetUserInfo.Read(params
							, function(data)
							{
								alert(JSON.stringify(params));
								var dataXml = null;
								if($.trim(data) != "")
								{
									dataXml = $.xmlDOM(data);
									CarName = dataXml.find("row:first").find(">col[name='CarName']").text();
									ModelYear = dataXml.find("row:first").find(">col[name='ModelYear']").text();
									Color = dataXml.find("row:first").find(">col[name='Color']").text();
									SS = dataXml.find("row:first").find(">col[name='SS']").text();
									CarNO = dataXml.find("row:first").find(">col[name='CarNO']").text();
									Status = dataXml.find("row:first").find(">col[name='Status']").text();
									
									if (ServiceLocationId=="2")
									{
									    $("#ButtonControl13").show();
									}
									$("#CarName").val(CarName);
									$("#CarModel").val(ModelYear);
									$("#CarColor").val(Color);
									$("#CarSS").val(SS);
									$("#CarNo").val(CarNO);
									$("#txtPosition").val(Status);
									$("#CarSS").prop('disabled', false);
									
									//$("#type1").prop('disabled', false);
		
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

		



$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_InsertCar",
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
		}

		function bindEvents()
		{
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
			if(params.status=='فعال'){
				params.Status = 1;
			}else{
				params.Status = 0;
			}
			insertFromData(params,
				function(dataXml)
				{
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					closeWindow({OK: true, Result: pk});
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
		}
		
		function deleteData(callback)
		{
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
			saveData: saveData,
			deleteData: deleteData
		};
	}());
	$form.init();
});