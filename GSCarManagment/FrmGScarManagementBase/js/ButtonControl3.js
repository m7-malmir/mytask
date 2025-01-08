$("#ButtonControl3").click(function(){
    // بررسی اینکه آیا فیلد ServiceId خالی است یا خیر
    if ($("#txtServiceId").val() === '') {
        $.alert("لطفا یک ردیف را انتخاب نمایید.", "", "rtl");
        return;
    }

    // بررسی اینکه آیا CarId خالی است یا خیر
    if (!carId) {
        $.alert("لطفا یک CarId معتبر انتخاب نمایید.", "", "rtl");
        return;
    }

    // نمایش فرم پاپ‌آپ و ارسال CarId به آن
    $.showModalForm({
        registerKey: "FrmGScarManagementPopup",
        params: {
            CarId: carId // ارسال CarId انتخاب شده به فرم جدید
        }
    }, function(retVal) {
        if (retVal.Result) {
            refreshTable();
        }
    });
});