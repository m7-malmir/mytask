var $form;
alert('test');
$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_test2",
            readFromData = "",
            insertFromData = FormManager.insertEntity,
            updateFromData = "",
            deleteFromData = "";
		
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
								UserId = dataXml.find("row:first").find(">col[name='UserId']").text();
								fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
								RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
								UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
								UserName = dataXml.find("row:first").find(">col[name='UserName']").text();
								RoleId = dataXml.find("row:first").find(">col[name='RoleId']").text();
								PersonnelNO_ = UserName;
								
								$("#TextBoxControl1").val(fullName);
								$("#TextBoxControl3").val(UnitsName);
								$("#TextBoxControl2").val(RoleName);
								
								
							}
						}
					);
				}
			);
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
			insertFromData(params,
				function(dataXml)
				{
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					var result = "<data><" + primaryKeyName + ">" + pk + "</" + primaryKeyName + "></data>";
					inEditMode = true;
					hideLoading();
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
			var params = $.getFormDataValues(bindingSourceName);
			
			params = $.extend(params, {Where : primaryKeyName + " = " + pk});
			updateFromData(params,
				function()
				{
					hideLoading();
					if($.isFunction(callback))
					{
						callback();
					}
					//closeWindow({OK: true});
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
			var params = {Where : primaryKeyName + " = " + pk};
			deleteFromData(params,
				function()
				{
					hideLoading();
					closeWindow({OK: true});
					/*if($.isFunction(callback))
					{
						callback();
					}*/
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);
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