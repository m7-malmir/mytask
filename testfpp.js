$("#btnRegister").click(function(){

    var personnelCode = $("#txtPersonnelCode").val().trim();
	var firstName = $("#txtFirstName").val().trim();
    var personnelCredit = $("#txtPersonnelCredit").val().trim();
    var selectedDiscount = $("#cmbDiscountPercent").val().trim();
	
	// اگر فیلد کد پرسنلی پر بود و دکمه جستجو را نزده بود باز هم پیام هشدار باقی میماند
    if (personnelCode === "" || firstName==="") {
        $.alert("لطفاً کد پرسنلی را جستجو کنید.", "", "rtl");
        return false;
    }
	// فقط موقعی معتبره که درصد باشه
	if (!selectedDiscount.endsWith('%')) { 
	    $.alert('لطفا مقدار تخفیف را انتخاب کنید!', "", "rtl");
	    return;
	}
	// اگر میزان اعتبار شخص خالی بود
    if (personnelCredit === "") {
        $.alert("لطفاً میزان اعتبار را وارد کنید.", "", "rtl");
        return false;
    }
    //از بین بردن علامت % برای insert در دیتابیس
    
	selectedDiscount = selectedDiscount.replace('%', '').trim();
	params =  {};
	FormManager.readPersonnelCredit(params,
		function(list,status) {
			if (list.some(item => item.PersonnelCode === currentPersonnelNO)) {
			   alert(JSON.stringify('تکراری است'));
				return false;
			} else {
				var params = {
				    'UserId': userId,
				    'PersonnelCode': currentPersonnelNO, 
				    'AccYear': getCurrentShamsiDate(),
				    'DiscountPercent': selectedDiscount,
				    'Credit': rcommafy(personnelCredit),
				    'RemainCredit': rcommafy(personnelCredit),
					'CreatedUserId':userId
				};
			    FormManager.insertPersonnelCredit(params,
			       	function(status, list) { 
					$.alert("ثبت اعتبار با موفقیت انجام شد.","","rtl",function(){
						hideLoading();
						// خالی کردن اینپوت ها پس از ارسال فرم در دیتابیس
						$("#txtPersonnelCode").val('');
						$("#txtPersonnelCredit").val('');
			   		 $("#cmbDiscountPercent").prop('selectedIndex', 0);
						$("#txtFirstName").val('');
			            $("#txtLastName").val('');
			            $("#txtRoleName").val('');
			            $("#txtUnitsName").val('');
						
					});
			        }, function(error) { // تابع خطا
						handleError(error, 'FormManager.insertPersonnelCredit'); 
			    	}
				);
									
			}
		}
	);
});
