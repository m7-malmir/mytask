$("#btnAccept").click(function () {

    //  تایید صحت مقدار اعتبار مورد تایید فرم
    validateIdeaForm(function () {

    // --- گرفتن مقادیر ورودی مورد نیاز---
    const confirmedGiftCreditRaw = $("#txtConfirmedGiftCredit").val().trim();
    const confirmedGiftCredit = (typeof rcommafy === "function")
        ? rcommafy(confirmedGiftCreditRaw)
        : confirmedGiftCreditRaw.replace(/,/g, "");

    const personnelCode = $("#txtUserName").val().trim();
    const giftCreditPerson = { Where: "Id = '" + $form.getPK() + "'" };
	//-------------------------------------
		
    //  خواندن موجودی فعلی پرسنل
    const paramsReadCredit = { Where: "PersonnelCode = '" + personnelCode + "'" };
    FormManager.readPersonnelCredit(paramsReadCredit, function (data) {

        if (!Array.isArray(data) || data.length === 0) {
            $.alert("رکوردی با این کد پرسنلی یافت نشد.", "", "rtl");
            return;
        }

        //  محاسبه موجودی جدید هدیه
        const remainGiftCredit = Number(data[0].RemainGiftCredit || 0);
        const newGiftCredit = remainGiftCredit + Number(confirmedGiftCredit);

        //  آپدیت موجودی هدیه پرسنل در جدول PersonnelCredit
        const updatePersonnelList = {
            RemainGiftCredit: newGiftCredit,
            Where: "PersonnelCode = '" + personnelCode + "'"
        };
        FormManager.updatePersonnelCredit(updatePersonnelList, function () {

            //  آپدیت مبلغ تایید شده در جدول  PersonnelGiftCredit
            const updateGiftList = $.extend({ ConfirmedGiftCredit: confirmedGiftCredit }, giftCreditPerson);
            FormManager.updatePersonnelGiftCredit(updateGiftList, function () {

                //  ارسال ایمیل به کاربر
                const emailList = {
                    UserId: $("#txtGiftCreditForUserId").val(),
                    EmailText: `<p dir='rtl'>همکار گرامی – اعتبار خرید 100% تخفیف به مبلغ '<b>${confirmedGiftCredit}</b>' ریال برای شما در خرید تکی و عمده محصولات لحاظ گردید.</p>`,
                    EmailSubject: 'اعتبار هدیه'
                };
                FormManager.SendEmail(emailList, function () {

                    // ثبت هامش
                    const hameshParams = {
                        Context: 'تایید شد',
                        DocumentId: DocumentId,
                        CreatorActorId: CurrentUserActorId,
                        InboxId: InboxId
                    };
                    FormManager.InsertHamesh(hameshParams, function () {

                        //  ادامه گردش کار و پیام موفقیت
                        Office.Inbox.setResponse(dialogArguments.WorkItem, 1, "", function () {
                            showSuccessAlert("اعتبار با موفقیت ثبت و ارسال شد", function () {
                                closeWindow({ OK: true, Result: null });
                            });
                        }, function (err) {
                            throw Error(err);
                        });

                    }, function (err) {
                        throw Error(err);
                    });

                }, function (err) {
                    throw Error(err);
                });

            }, function (err) {
                $.alert("خطا در آپدیت هدیه: " + (err.message || "خطای ناشناخته"), "", "rtl");
            });

        }, function (err) {
            $.alert("خطا در آپدیت موجودی پرسنل: " + (err.message || "خطای ناشناخته"), "", "rtl");
        });

    }, function (err) {
        $.alert("خطا در خواندن موجودی پرسنل: " + (err.message || "خطای ناشناخته"), "", "rtl");
    });
 });
});






$("#txtRemainCredit").val(commafy(remainCredit));
$("#txtRemainCreditNew").val(commafy(remainCredit));
$("#txtDiscountPercent").val(discountPercentForUser);
$("#txtTotalPrice").val('0');
$("#txtTotalPriceWithDiscount").val('0');


$("#txtRemainCredit").val('0');
$("#txtRemainCreditNew").val('0');
$("#txtDiscountPercent").val('0');
$("#txtTotalPrice").val('0');
$("#txtTotalPriceWithDiscount").val('0');

let $options = $("#cmbCreditType option");

// شرط مورد نیاز برای نمایش انتخاب نوع اعتبار
$options.hide().prop("disabled", true);
if (discountPercentMax == discountPercentBase) {
    $options.filter('[credittype="2"]').show().prop("disabled", false);
} else {
    $options.filter('[credittype="1"], [credittype="2"]').show().prop("disabled", false);
}

// شرط دوم
if (remainGiftCredit > 0) {
    $options.filter('[credittype="3"]').show().prop("disabled", false);
}

$("#cmbCreditType").on("change", function () {
    let selectedType = $(this).find(":selected").attr("credittype");

    // مقادیر پیش فرض (برای حالتی که چیزی انتخاب نشده یا حالت خاصی باشه)
    $("#txtRemainCredit").val('0');
    $("#txtRemainCreditNew").val('0');
    $("#txtDiscountPercent").val('0');
    $("#txtTotalPrice").val('0');
    $("#txtTotalPriceWithDiscount").val('0');

    // حالا بر اساس انتخاب مقداردهی می کنیم
    switch (selectedType) {
        case "1": // سازمانی
		    $("#txtRemainCredit").val(commafy(remainCredit));
            $("#txtRemainCreditNew").val(commafy(remainCredit));
            $("#txtDiscountPercent").val(discountPercentForUser);
            break;

        case "2": // پایه
			discountPercentForUser=discountPercentBase;
 		   $("#txtRemainCredit").val("نامحدود");
            $("#txtRemainCreditNew").val("نامحدود");
            $("#txtDiscountPercent").val(discountPercentBase);
            break;

        case "3": // هدیه
			discountPercentForUser=100;
            $("#txtRemainCredit").val(commafy(remainGiftCredit));
            $("#txtRemainCreditNew").val(commafy(remainGiftCredit));
            $("#txtDiscountPercent").val('100');
            break;

        default:
            // چیزی انتخاب نشده، مقادیر پیش فرض باقی میمونه
            break;
    }
	let $rows = $("#tblOrderedGoods tbody tr").not(".row-header, .row-template");
	if ($rows.length > 0) {
	    $rows.remove();
	    updateTotalPrice();
	    refresh();
	}
});
