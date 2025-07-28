//#region ready.js
let $form;
let CurrentUserId;
var params;

$(function () {
    $form = (function () {
        var inEditMode = false,
            primaryKeyName = "Id";

        // ======== Helpers =====
        // اضافه کردن گزینه "انتخاب کنید" اگر وجود نداشت
        function addPlaceholder($sel) {
            if (
                $sel.length &&
                (!($sel.find("option:first").text().trim() === "انتخاب کنید") || $sel.find("option:first").val() !== "")
            ) {
                $sel.prepend('<option value="" selected disabled hidden>انتخاب کنید</option>');
                $sel[0].selectedIndex = 0;
            }
        }

        // فعال کردن MutationObserver برای هر سلکتور
        function observeAndAddPlaceholder(selector) {
            var $sel = $(selector);
            if (!$sel.length) return;
            var observer = new MutationObserver(function () {
                if ($sel.find("option").length > 0) {
                    addPlaceholder($sel);
                    observer.disconnect();
                }
            });
            observer.observe($sel[0], { childList: true });
        }

        // ======== Init ========
        function init() {
            build();
            createControls();
        }

        // ======== Build =======
        function build() {
            params = window.dialogArguments || window.arguments;
            changeDialogTitle("ثبت جزییات اعلام هزینه");
        }

        // ===== CreateControls ====
        function createControls() {
            // لیست همه سلکتورهایی که نیاز به placeholder دارن
            var selectIds = [
                "#cmbCostRequestTypeId",
                "#cmbCostRequestTypeDetailId",
                "#cmbCostRequestTypeSubDetail",
                "#cmbOriginProvinceId",
                "#cmbOriginCityId",
                "#cmbDestinationProvinceId",
                "#cmbDestinationCityId"
            ];
            // اعمال MutationObserver برای همه سلکتورها
            selectIds.forEach(observeAndAddPlaceholder);

			// اختصاص id به optionهای سلکت دیتیل بعد از لود شدن
			var $detail = $("#cmbCostRequestTypeDetailId");
			if ($detail.length) {
			    var observerDetail = new MutationObserver(function () {
			        var idx = 1;
			        $detail.find("option").each(function () {
			            if ($(this).val() !== "") { // فقط به optionهای دیتابیس id بده
			                $(this).attr("id", idx++);
			            }
			        });
			        observerDetail.disconnect();
			    });
			    observerDetail.observe($detail[0], { childList: true });
			}

            // ------------------ رویدادهای وابسته ------------------
            // استان و شهر پویا
            function handleProvinceChange(provinceSelector, citySelector) {
                $(provinceSelector).on('change', function () {
                    var selectedProvince = $(this).val();
                    var $citySelect = $(citySelector);
                    $citySelect.find('option').hide();
                    $citySelect.find('option').filter(function () {
                        return $(this).val() === selectedProvince;
                    }).show();
                    var firstVisible = $citySelect.find('option:visible:first').val();
                    $citySelect.val(firstVisible);
                });
            }

            // رشته هزینه دوم و سوم بر اساس مقدار اولی فیلتر میشن
            $("#cmbCostRequestTypeDetailId option, #cmbCostRequestTypeSubDetail option").hide();

            $("#cmbCostRequestTypeId").on('change', function () {
                var selectedVal = $(this).val();
                $("#cmbCostRequestTypeDetailId option").each(function () {
                    $(this).toggle($(this).val() === selectedVal);
                });
                $("#cmbCostRequestTypeDetailId").val('');
                $("#cmbCostRequestTypeSubDetail option").hide();
                $("#cmbCostRequestTypeSubDetail").val('');
            });

			$("#cmbCostRequestTypeDetailId").on('change', function () {
			    var selectedDetailId = $("#cmbCostRequestTypeDetailId option:selected").attr("id"); // این id هست، نه value!
			    var $subDetail = $("#cmbCostRequestTypeSubDetail");
			
			    // اول هر بار همه‌ی آپشن‌ها به جز placeholder رو hide کن
			    $subDetail.find('option').not('[value=""]').hide();
			
			    // فقط اگر 4 یا 5 بود 
			    if (selectedDetailId === "4" || selectedDetailId === "5") {
			        // اونایی که value = 4 یا value = 5 دارن رو نشون بده
			        $subDetail.find('option[value="' + selectedDetailId + '"]').show();
			    }
			
			    // اگر گزینه فعلی subDetail دیگه قابل انتخاب نبود، مقدارش رو خالی کن
			    if ($subDetail.find('option:selected:visible').length === 0) {
			        $subDetail.val('');
			    }
			});




            $("#cmbCostRequestTypeId").trigger('change');

            // استان/شهر مبدا و مقصد واکنش‌گرا
            handleProvinceChange('#cmbOriginProvinceId', '#cmbOriginCityId');
            handleProvinceChange('#cmbDestinationProvinceId', '#cmbDestinationCityId');

            // سرویس کاربر فعلی
            UserService.GetCurrentUser(
                true,
                function (data) {
                    showLoading();
                    const xml = $.xmlDOM(data);
                    CurrentUserId = xml.find("user > id").text().trim();
                },
                function (err) {
                    console.log('Error callback fired');
                    hideLoading();
                    $ErrorHandling.Erro(err, "خطا در سرویس getCurrentActor");
                }
            );
        }

        // ======= Return Object ======
        return {
            init: init
        };
    })();

    $form.init();
});

//#endregion ready.js


//#region btnregister.js
function parseGDate(str) {
    if(!str) return null;
    var parts = str.includes('/') ? str.split('/') : str.split('-');
    if(parts.length !== 3) return null;
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var day = parseInt(parts[2]);
    return new Date(year, month-1, day);
}
function handleTypeFieldsState() {
    var costRequestTypeId = $("#cmbCostRequestTypeId").val();
    var costRequestTypeDetailId = $("#cmbCostRequestTypeDetailId").find("option:selected").attr("id");

    // فیلدهایی که برای خوراک و سایر باید disable بشن
    var commonFields = [
        "#cmbOriginProvinceId",
        "#cmbOriginCityId",
        "#dpStartDate",
        "#cmbDestinationProvinceId",
        "#cmbDestinationCityId",
        "#bpEndDate",
		"#cmbCostRequestTypeSubDetail"
    ];
    // فیلدهای کیلومتر
    var kmFields = [ "#txtStartKM", "#txtEndKM" ];

    // خوراک یا سایر، همه غیرفعال و خالی (هم کیلومتر و هم بقیه)
    if (costRequestTypeId === "3" || costRequestTypeId === "4") {
        [...commonFields, ...kmFields].forEach(function(sel){
            $(sel).val("").prop("disabled", true);
            if ($(sel).attr("data-gdate") !== undefined)
                $(sel).attr("data-gdate", "");
        });
    }
    // ایاب و ذهاب یا اقامت (بجز کیلومتر)
    else if (costRequestTypeId === "1" || costRequestTypeId === "2") {
        commonFields.forEach(function(sel){
            $(sel).prop("disabled", false);
        });
        // فقط حالت "ایاب و ذهاب" و "جزئیات=4یا5" کیلومتر فعال
        if (costRequestTypeId === "1" && (costRequestTypeDetailId === "4" || costRequestTypeDetailId === "5")) {
            kmFields.forEach(function(sel){
                $(sel).prop("disabled", false);
            });
        } else {
            // غیرفعال و پاک کن
            kmFields.forEach(function(sel){
                $(sel).val("").prop("disabled", true);
            });
        }
    } else {
        // پیش‌فرض همه رو فعال کن
        [...commonFields, ...kmFields].forEach(function(sel){
            $(sel).prop("disabled", false);
        });
    }
}

// رویدادها:
$("#cmbCostRequestTypeId").on("change", handleTypeFieldsState);
$("#cmbCostRequestTypeDetailId").on("change", handleTypeFieldsState);
$(document).ready(function() {
    handleTypeFieldsState();
});

// بقیه کد اعتبارسنجی همون قبلی بمونه ...

function isFormValid() {
    var costDate = $("#dpCostDate").attr("data-gdate");
    var costRequestTypeId = $("#cmbCostRequestTypeId").val();
    var costRequestTypeDetailId = $("#cmbCostRequestTypeDetailId").find("option:selected").attr("id");
    var requestCostPrice = $("#txtRequestCostPrice").val();

    // چک فیلدهای پایه
    if (!costDate) {
		alert(JSON.stringify('لطفا تاریخ را وارد کنید!'));
        $("#dpCostDate").focus();
        return false;
    }
    if (!costRequestTypeId) {
        $.alert('لطفا نوع هزینه را انتخاب کنید!', '', 'rtl');
        $("#cmbCostRequestTypeId").focus();
        return false;
    }
    if (!$("#cmbCostRequestTypeDetailId").val()) {
        $.alert('لطفا جزئیات هزینه را انتخاب کنید!', '', 'rtl');
        $("#cmbCostRequestTypeDetailId").focus();
        return false;
    }
    if (!requestCostPrice || isNaN(requestCostPrice) || Number(requestCostPrice) <= 0) {
        $.alert('لطفا مبلغ هزینه را صحیح وارد کنید!', '', 'rtl');
        $("#txtRequestCostPrice").focus();
        return false;
    }

    // فقط وقتی ایاب‌وذهاب یا اقامت انتخابه
    if (costRequestTypeId === "1" || costRequestTypeId === "2") {
        if (!$("#cmbOriginProvinceId").val()) {
            $.alert('لطفا استان مبدا را انتخاب کنید!', '', 'rtl');
            $("#cmbOriginProvinceId").focus();
            return false;
        }
        if (!$("#cmbOriginCityId").val()) {
            $.alert('لطفا شهر مبدا را انتخاب کنید!', '', 'rtl');
            $("#cmbOriginCityId").focus();
            return false;
        }
        if (!$("#dpStartDate").attr("data-gdate")) {
			alert(JSON.stringify('لطفا تاریخ شروع را وارد کنید!'));
            $("#dpStartDate").focus();
            return false;
        }
        if (!$("#cmbDestinationProvinceId").val()) {
            $.alert('لطفا استان مقصد را انتخاب کنید!', '', 'rtl');
            $("#cmbDestinationProvinceId").focus();
            return false;
        }
        if (!$("#cmbDestinationCityId").val()) {
            $.alert('لطفا شهر مقصد را انتخاب کنید!', '', 'rtl');
            $("#cmbDestinationCityId").focus();
            return false;
        }
        if (!$("#bpEndDate").attr("data-gdate")) {
			alert(JSON.stringify('لطفا تاریخ پایان را وارد کنید!'));
            $("#bpEndDate").focus();
            return false;
        }
    }

    // فقط وقتی ایاب و ذهاب و جزئیاتش 4 یا 5 باشه کیلومتر چک میشه
    if (costRequestTypeId === "1" && (costRequestTypeDetailId === "4" || costRequestTypeDetailId === "5")) {
        if (!$("#cmbCostRequestTypeSubDetail").val()) {
            $.alert('لطفا زیرجزئیات نوع هزینه را انتخاب کنید!', '', 'rtl');
            $("#cmbCostRequestTypeSubDetail").focus();
            return false;
        }
        if (!$("#txtStartKM").val() || isNaN($("#txtStartKM").val()) || Number($("#txtStartKM").val()) < 0) {
            $.alert('لطفا کیلومتر شروع را صحیح وارد کنید!', '', 'rtl');
            $("#txtStartKM").focus();
            return false;
        }
        if (!$("#txtEndKM").val() || isNaN($("#txtEndKM").val()) || Number($("#txtEndKM").val()) < 0) {
            $.alert('لطفا کیلومتر پایان را صحیح وارد کنید!', '', 'rtl');
            $("#txtEndKM").focus();
            return false;
        }
    }
	//تاریخ پایان نباید کوچکتر از تاریخ شروع باشد
	
    if (costRequestTypeId === "1" || costRequestTypeId === "2") {
        var startStr = $("#dpStartDate").attr("data-gdate");
        var endStr = $("#bpEndDate").attr("data-gdate");
        var startDate = parseGDate(startStr);
        var endDate = parseGDate(endStr);
        if (startDate && endDate) {
            if (endDate < startDate) {
                $.alert('تاریخ پایان نباید کمتر از تاریخ شروع باشد!', '', 'rtl');
                $("#bpEndDate").focus();
                return false;
            }
        }
    }

    return true;
}

$("#btnRegister").on("click", function (e) {
    if (!isFormValid()) {
        e.preventDefault();
        return false;
    }
    alert(JSON.stringify('ok'));
});






/*
    //showLoading();
	
    // Create a variables
    // let insertCostRequestDetail = FormManager.insertCostRequest;
	let requestCostId = $.trim($("#lblCostRequestID").text());
	let costDate = $("#dpCostDate").data("gdate");
	let costRequestTypeId = $("#cmbCostRequestTypeId").val();
	let costRequestTypeDetailId = $("#cmbCostRequestTypeDetailId").val();
	let costRequestTypeSubDetail = $("#cmbCostRequestTypeSubDetail").val();
	let originProvinceId = $("#cmbOriginProvinceId").val();
	let originCityId = $("#cmbOriginCityId").val();
	let startDate = $("#dpStartDate").data("gdate");
	let startKM = $("#txtStartKM").val();
	let destinationProvinceId = $("#cmbDestinationProvinceId").val();
	let destinationCityId = $("#cmbDestinationCityId").val();
	let endDate = $("#bpEndDate").data("gdate");
	let endKM = $("#txtEndtKM").val();
	let requestCostPrice = $("#txtRequestCostPrice").val();
	let description = $("#txtDiscription").val();


        const insertParams = {
            RequestCostId:              requestCostId,					// شماره درخواست ثبت شده
            CostDate:                   costDate,					  // تاریخ هزینه 
            CostRequestTypeId:          costRequestTypeId,				// شناسه برند پروژه
            CostRequestTypeDetailId:    costRequestTypeDetailId,				 // شناسه نوع پروژه
            CostRequestTypeSubDetail:   costRequestTypeSubDetail,			  // تاریخ شروع
            OriginProvinceId:           originProvinceId,				// تاریخ پایان
            OriginCityId:          	 originCityId,			 	// وضعیت قراداد
            DestinationProvinceId:      destinationProvinceId,			  // شناسه موضوع پروژه
            DestinationCityId:		  destinationCityId,	   // ابعاد پروژه
            StartDate:   			   startDate,	      // شناسه ابزار پروژه
            EndDate:					endDate,	   // تعداد ابزار
            Description: 			   description,		// هزینه ابزار
            RequestCostPrice:      	 requestCostPrice,			 // شناسه برند مرکز هزینه
            StartKM:   				 startKM,		  // هزینه منابع انسانی
            EndKM:       			   endKM,			  // سایر هزینه
        };
		alert(JSON.stringify(insertParams));
	
	
	
        // Insert new CostRequest
    /*    insertCostRequestDetail(insertParams,
            function(dataXml){
                hideLoading();

                // Show alert
                const customeFullName = $("#txtCustContractNo").val();
                $.alert("پروژه مشتری با موفقیت ذخیره گردید. ","ذخیره شد", "rtl");
            },
            function(error) {
                hideLoading();
				$.alert(`ذخیره سازی با خطا مواجه شده است.\n ${error}`, "توجه", "rtl");
                console.error(error);
            }
        );
	
	*/



//#endregion btnregister.js


//#region 
//#endregion