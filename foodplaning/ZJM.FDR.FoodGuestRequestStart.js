//#region js ready
var $form;
var currentActorId;
var ProcessStatus;
var currentPersonnelNO;
var FoodId;
$(function(){
	$form = (function()
	{ 
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
			insertFromData = FormManager.insertEntity,
			readRows = FormManager.readEntityّSPFoodView;
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
			showLoading();
			$("#btnEdit").css('display','none');
			UserService.GetCurrentActor(true,
				function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
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
			var params = $.getFormDataValues(bindingSourceName);
			params.CreatorActor_ID = currentActorId;
			insertFromData(params,
				function()
				{
					alert(JSON.stringify(pk));
					WorkflowService.RunWorkflow("ZJM.FDR.FoodGuestsReservation",
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
//#endregion

//#region js form manager
var FormManager = {
	//*****************************************************************************************************
	readEntityّFoodEdit: function(jsonParams, onSuccess, onError)
	{
	  /*  BS_HRFood.Read(jsonParams
	        , function(data)
	        {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
	            xmlvar.find("row").each(
	                function()
	                { 
	                    list.push
	                    ({
	                        FoodId: $(this).find("col[name='FoodId']").text(),
	                        FoodTitle: $(this).find("col[name='FoodTitle']").text(),
	                        FoodStatus: $(this).find("col[name='FoodStatus']").text()
	                    });
	                }
	            );
	            if($.isFunction(onSuccess))
	            {
	                onSuccess(list);
	            
	            }
	        }, onError
	    );*/
	},
		//*****************************************************************************************************
	readEntityّFoodMealPlan: function(jsonParams, onSuccess, onError)
	{
	   BS_FoodMealPlan.Read(jsonParams
	        , function(data)
	        {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
	            xmlvar.find("row").each(
	                function()
	                { 
	                    list.push
	                    ({
	                        FoodId: $(this).find("col[name='FoodId']").text(),
	                        FoodTitle: $(this).find("col[name='FoodTitle']").text(),
	                        FoodStatus: $(this).find("col[name='FoodStatus']").text()
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
	insertEntity: function(jsonParams, onSuccess, onError)
	{
		 BS_HRGuestRequest.Insert(jsonParams,
			function(data)
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
			}, 
			function(error) {
				var methodName = "insertEntity";

	            if ($.isFunction(onError)) {
					var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
					console.error("Error:", erroMessage);
					console.error("Details:", error);
	                
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error(erroMessage+ " (no onError callback provided):", error);
	            }
	        }
		);
		
	},
	//******************************************************************************************************
	deleteEntity: function(jsonParams, onSuccess, onError)
	{
		BS_HRFood.Delete(jsonParams, 
			function(data)
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
			},
			function(error) {
					var methodName = "deleteEntity";
	
		            if ($.isFunction(onError)) {
						var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
						console.error("Error:", erroMessage);
						console.error("Details:", error);
		                
		                onError({
		                    message: erroMessage,
		                    details: error
		                });
		            } else {
		                console.error(erroMessage+ " (no onError callback provided):", error);
		            }
		        }
		);
	},
	//******************************************************************************************************
	updateEntity: function(jsonParams, onSuccess, onError)
	{
		 BS_HRFood.Update(jsonParams
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
			}, 
		function(error) {
					var methodName = "deleteEntity";
	
		            if ($.isFunction(onError)) {
						var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
						console.error("Error:", erroMessage);
						console.error("Details:", error);
		                
		                onError({
		                    message: erroMessage,
		                    details: error
		                });
		            } else {
		                console.error(erroMessage+ " (no onError callback provided):", error);
		            }
		        }
		);
	},
};
//#endregion

//#region js ready
//#endregion

//#region js ready
//#endregion
