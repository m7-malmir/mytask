var that = $(this);
$.qConfirm(that, "آیا از حذف مطمئن هستید؟", function(btn) {
    if (btn.toUpperCase() === "OK") { // بررسی اینکه کاربر 
        
    }
});


	if(CancelCredit=='false'){
		//اضافه کردن محصول با همان محدودیت اعتبار ینی این txtCreditBalance  خب
		}else{
		// اینجا دیگه آزاد باشه هرچی عسقش کشید هزارتا محصول حتی بیشتر بی نهایت اضافه کنه 
	}



        var confirmation = confirm("آیا از حذف سمت مطمئن هستید؟");
    if (confirmation) {
        var actorId = $(this).closest("tr").find("td").eq(1).text(); 
        var params = {
            ActorId: actorId
        };
        
        FormManager.RevokeActorId(params, function(list) {
            $.alert("حذف سمت کاربر با موفقیت انجام شد.", "", "rtl", function() {
                hideLoading();
                
                // بارگذاری دوباره داده‌ها پس از حذف
                var PersonnelNO = $("#txtPersonnelNO").val(); // می‌توانید از همین مقدار استفاده کنید
                loadEmployeeData(PersonnelNO); // فراخوانی تابع بارگذاری داده‌ها
            });
        }, function(error) {
            console.log(error);
            alert("خطا در ارسال درخواست: " + error);
        });
    }





    
var removeBtn = $("<button/>", { title: "حذف" })
    .css({
        cursor: "pointer", backgroundColor: "red", color: "white", border: 0,
        padding: "5px 0px", borderRadius: "50px", lineHeight: "1.2rem", fontSize: "20px", width: "20px",
        height: "20px", textAlign: "center"
    }).text("-").on("click", function () {
        var $removedRow = $(this).closest("tr");
        var removedProductId = $removedRow.attr("data-id");
        $('#tblGoods tbody tr').each(function () {
            var $row = $(this);
            var rowProductId = $row.find("td").eq(2).text().trim();
            if (rowProductId === removedProductId) {
                $row.find('.CHbox').prop("disabled", false).prop("checked", false); // فعال و بدون تیک
            }
        });

        $removedRow.remove();
        updateTotalPrice();
        checkAddButtonState();
    });



    

RemainCredit   txtDiscount   TotalPrice



    GoodsCode: $(this).find("col[name='GoodsCode']").text(),
    GoodsName: $(this).find("col[name='GoodsName']").text(),
    Qty: $(this).find("col[name='Qty']").text(),
    UnitPrice: $(this).find("col[name='UnitPrice']").text(),
    AfterDiscountGoodsPrice: $(this).find("col[name='AfterDiscountGoodsPrice']").text()


