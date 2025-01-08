var NewOwnerNO = '';

$("#ButtonControl1").click(function() {
    // بررسی اینکه فیلد ServiceId خالی نباشد
    if ($("#txtServiceId").val() === '') {
        $.alert("لطفا ردیف مورد نظر را انتخاب نمایید.", "", "rtl");
        return;
    }
		if($("#dtStart").val() === '' || $("#dtStart2").val() === ''){
		alert(JSON.stringify('لطفا تاریخ تحویل دهنده و تحویل گیرنده را مشخص کنید!!!'));	
	}
    // تنظیم پارامترهای ارسال
	var gdate = $("#dtStart").attr('gdate').split("/");
	var gdate1 = gdate[2]+'-'+gdate[0]+'-'+gdate[1];
	var gdate2 = $("#dtStart2").attr('gdate').split("/");
	var gdate4 = gdate2[2]+'-'+gdate2[0]+'-'+gdate2[1]; 
	
    var params = {
        'CarId': carId, 
        'NewOwnerNo': $("#ComboBoxControl2").val(),
        'CreatorPersonelNO': PersonnelNO ,
		'EndDateAssign' : gdate1,
		'DateNewAssign' : gdate4
    };
	alert(JSON.stringify(params));
    // نمایش پارامترها برای دیباگ
    //alert(JSON.stringify(params));

    // فراخوانی تابع InsertCar
    FormManager.InsertCar(params,
        function(status, list) { 
            if (status === 200) { 
                console.log("نتیجه برگشتی:", list);
                // ذخیره داده‌ها در فرم (در صورت نیاز)
                if (typeof $form !== "undefined" && $form.saveData) {
                    $form.saveData(list);
                }
                // نمایش پیام موفقیت
                $.alert("عملیات با موفقیت انجام شد!", "", "rtl");
				refreshTable();
				hideLoading();
				
            } else {
                $.alert("وضعیت نامشخص: " + status, "", "rtl");
            }
        },
        function(error) { // تابع خطا
            console.log("خطای برگشتی:", error);
            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
        }
    );
});
