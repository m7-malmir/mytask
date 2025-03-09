//ثبت 
alert(JSON.stringify(params));
FormManager.insertEntity(params,
 function(status, list) { 
	 $.alert("ثبت غذا با موفقیت انجام شد.","","rtl",function(){
		 hideLoading();
		 tblMain.refresh();
		 $("#txtFoodTitle").val('');
		 $("#cmbFoodStatus").prop('selectedIndex', 0);
	 });
	 },
	 function(error) { // تابع خطا
		 console.log("خطای برگشتی:", error);
		 $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
	 }
 );



 //update
 var params = {
	'FoodTitle': $("#txtFoodTitle").val(), 
	'FoodStatus': $("#cmbFoodStatus").val()
};
params = $.extend(params, { Where: "FoodId = "+id });
alert(JSON.stringify(params));
FormManager.updateEntity(params,
	function(status, list) { 
		$.alert("ویرایش غذا با موفقیت انجام شد.","","rtl",function(){
			$("#txtFoodTitle").val('');
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