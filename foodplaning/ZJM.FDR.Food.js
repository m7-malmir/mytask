/*******body*************** */

$("#btnRegister").click(function(){


    if ($("#txtFoodTitle").val() === '') {
        $.alert("نام غذا و وضعیت آن را تعیین نمایید", "", "rtl");
        return;
    }
	
	
	//افزودن غذا به لیست
    var params = {
        'FoodTitle': $("#txtFoodTitle").val(), 
        'FoodStatus': $("#cmbFoodStatus").val()
    };

		var FoodId = $("#hiddenFoodId").val();
		if (FoodId!='') {
		    params = $.extend(params, { Where: "FoodId = "+FoodId });
			FormManager.updateEntity(params,
				function(status, list) { 
					$.alert("ویرایش غذا با موفقیت انجام شد.","","rtl",function(){
						$("#txtFoodTitle").val('');
						$("#hiddenFoodId").val('');
						$("#cmbFoodStatus").prop('selectedIndex', 0);
						hideLoading();
						tblMain.refresh();
					});		
				},
				function(error) { // تابع خطا
					console.log("خطای برگشتی:", error);
					$.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
				}
			);
		} else {

		const isDuplicate = mainList.some(item => item.FoodTitle.trim() === params.FoodTitle.trim());

			if (isDuplicate) {
			    alert(JSON.stringify('این غذا قبلا در لیست ثبت شده است.'));
			} else {
		      FormManager.insertEntity(params,
	        function(status, list) { 
				$.alert("ثبت غذا با موفقیت انجام شد.","","rtl",function(){
					hideLoading();
		        	tblMain.refresh();
					$("#txtFoodTitle").val('');
					$("#hiddenFoodId").val('');
	    			$("#cmbFoodStatus").prop('selectedIndex', 0);
					$form.refresh();
				});
		        },
		        function(error) { // تابع خطا
		            console.log("خطای برگشتی:", error);
		            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
	        	}
	    	);
			}
		}
});
/*******end body****************** */

/*********form manager********************* */
var FormManager = {
	//*****************************************************************************************************
	readEntityّFoodEdit: function(jsonParams, onSuccess, onError)
	{
	    BS_HRFood.Read(jsonParams
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
		 BS_HRFood.Insert(jsonParams,
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
/*********end form manager********************* */

/**********btn register*********************** */

$("#btnRegister").click(function(){


    if ($("#txtFoodTitle").val() === '') {
        $.alert("نام غذا و وضعیت آن را تعیین نمایید", "", "rtl");
        return;
    }
	
	
	//افزودن غذا به لیست
    var params = {
        'FoodTitle': $("#txtFoodTitle").val(), 
        'FoodStatus': $("#cmbFoodStatus").val()
    };

		var FoodId = $("#hiddenFoodId").val();
		if (FoodId!='') {
		    params = $.extend(params, { Where: "FoodId = "+FoodId });
			FormManager.updateEntity(params,
				function(status, list) { 
					$.alert("ویرایش غذا با موفقیت انجام شد.","","rtl",function(){
						$("#txtFoodTitle").val('');
						$("#hiddenFoodId").val('');
						$("#cmbFoodStatus").prop('selectedIndex', 0);
						hideLoading();
						tblMain.refresh();
					});		
				},
				function(error) { // تابع خطا
					console.log("خطای برگشتی:", error);
					$.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
				}
			);
		} else {

		const isDuplicate = mainList.some(item => item.FoodTitle.trim() === params.FoodTitle.trim());

			if (isDuplicate) {
			    alert(JSON.stringify('این غذا قبلا در لیست ثبت شده است.'));
			} else {
		      FormManager.insertEntity(params,
	        function(status, list) { 
				$.alert("ثبت غذا با موفقیت انجام شد.","","rtl",function(){
					hideLoading();
		        	tblMain.refresh();
					$("#txtFoodTitle").val('');
					$("#hiddenFoodId").val('');
	    			$("#cmbFoodStatus").prop('selectedIndex', 0);
					$form.refresh();
				});
		        },
		        function(error) { // تابع خطا
		            console.log("خطای برگشتی:", error);
		            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
	        	}
	    	);
			}
		}
});
/**********end btn register*********************** */