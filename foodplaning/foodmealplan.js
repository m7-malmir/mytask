$("#btnRegister").click(function(){
	var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() );
	var year = tomorrow.getFullYear();
    var month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    var day = tomorrow.getDate().toString().padStart(2, '0');
	var tomorrowDate = `${year}-${month}-${day}`;
	
	var dateString = $("#txtSelectDate").attr('gdate');
	var [month2, day2, year2] = dateString.split('/').map(Number);
	selectedDate = `${year2.toString().padStart(4, '0')}-${month2.toString().padStart(2, '0')}-${day2.toString().padStart(2, '0')}`;

	if(selectedDate > tomorrowDate){
		 if ($("#txtFoodTitle").val() === '') {
	        $.alert("نام غذا و وضعیت آن را تعیین نمایید", "", "rtl");
	        return;
		 }
	/*********************************************************************************************/	
		//افزودن غذا به لیست
	    var params = {
	        'FoodTitle': $("#txtFoodTitle").val(), 
	        'FoodStatus': $("#cmbFoodStatus").val()
	    };
	
	    FormManager.insertEntity(params,
	        function(status, list) { 
				$.alert("ثبت غذا با موفقیت انجام شد.","","rtl",function(){
					hideLoading();
		        	tblMain.refresh();
				});
	        },
	        function(error) { // تابع خطا
	            console.log("خطای برگشتی:", error);
	            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
	        }
	    );
		
	/*********************************************************************************************/	
		
	}else{
		alert(JSON.stringify('not ok'));
		$.alert("تاریخ پیشنهادی جلسه باید از بعد از فردا باشد.", "", "rtl",
			function()
			{}
		);
		return;
	}
	
	
	
	
});