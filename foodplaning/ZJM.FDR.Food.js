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

/*********end form manager********************* */