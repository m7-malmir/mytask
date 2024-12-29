var NewOwnerNO = '';

$("#ButtonControl1").click(function() {
    // بررسی اینکه فیلد ServiceId خالی نباشد
    if ($("#txtServiceId").val() === '') {
        $.alert("لطفا شخص مورد نظر را انتخاب نمایید.", "", "rtl");
        return;
    }

    // تنظیم پارامترهای ارسال
    var params = {
        'CarId': carId, // جایگزین با مقدار واقعی carId
        'NewOwnerNo': $("#ComboBoxControl2").val(),
        'CreatorPersonelNO': PersonnelNO // جایگزین با مقدار واقعی PersonnelNO
    };

    // نمایش پارامترها برای دیباگ
    alert(JSON.stringify(params));

    // فراخوانی تابع InsertCar
    FormManager.InsertCar(params,
        function(status, list) { // تابع موفقیت
            if (status === 200) { // بررسی وضعیت
                console.log("نتیجه برگشتی:", list);

                // ذخیره داده‌ها در فرم (در صورت نیاز)
                if (typeof $form !== "undefined" && $form.saveData) {
                    $form.saveData(list);
                }

                // نمایش پیام موفقیت
                $.alert("عملیات با موفقیت انجام شد!", "", "rtl");
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
