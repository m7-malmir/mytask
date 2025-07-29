//#region ready.js
let $form;
let CurrentUserId;
var globalCostRequestID = null;

$(function () {
    $form = (function () {
        var inEditMode = false,
            primaryKeyName = "Id";

        // ======== Helpers =====
        /**
         * اگر گزینه "انتخاب کنید" در ابتدای سلکت نبود، اضافه کن
         * @param {object} $sel - سلکت جی‌کوئری
         */
        function addPlaceholder($sel) {
            if (
                $sel.length &&
                (!($sel.find("option:first").text().trim() === "انتخاب کنید") || $sel.find("option:first").val() !== "")
            ) {
                $sel.prepend('<option value="" selected disabled hidden>انتخاب کنید</option>');
                $sel[0].selectedIndex = 0;
            }
        }

        /**
         * استفاده از MutationObserver برای اضافه کردن placeholder
         * تا زمانی که آپشن‌ها در سلکت لود شوند
         * @param {string} selector - سلکتور سلکت
         */
        function observeAndAddPlaceholder(selector) {
            var $sel = $(selector);
            if (!$sel.length) return; // اگر سلکت وجود نداشت برگرد
            var observer = new MutationObserver(function () {
                if ($sel.find("option").length > 0) {
                    addPlaceholder($sel);
                    observer.disconnect(); // فقط یکبار اجرا
                }
            });
            observer.observe($sel[0], { childList: true });
        }

        // ======== Init ========
        function init() {
            build();
            createControls();
			showLoading();
        }

        // ======== Build =======
        function build() {
            // مقداردهی اولیه پارامترها
            params = window.dialogArguments || window.arguments;
            $(document).ready(function() {
                globalCostRequestID = params?.costRequestID;
            });

            changeDialogTitle("ثبت جزییات اعلام هزینه");
        }

        // ===== CreateControls ====
        function createControls() {
            // لیست سلکتورهایی که نیاز به placeholder دارند
            var selectIds = [
                "#cmbCostRequestTypeId",
                "#cmbCostRequestTypeDetailId",
                "#cmbCostRequestTypeSubDetail",
                "#cmbOriginProvinceId",
                "#cmbOriginCityId",
                "#cmbDestinationProvinceId",
                "#cmbDestinationCityId"
            ];

            /***********-- وابستگی بین نوع هزینه و جزییات آن --*************/
            // وقتی "نوع هزینه" تغییر کرد فقط جزییات مرتبط را نشان بده
            $("#cmbCostRequestTypeId").change(function() {
                var selectedType = $(this).val();
                // پنهان‌کردن همه‌ی آپشن‌ها و نمایش placeholder
                $("#cmbCostRequestTypeDetailId option").hide();
                $("#cmbCostRequestTypeDetailId option[value='']").show(); // فقط گزینه "انتخاب کنید"
                // فقط گزینه‌هایی که value آن با نوع انتخاب‌شده برابر است را نشان بده
                $("#cmbCostRequestTypeDetailId option[value='" + selectedType + "']").show();
                $("#cmbCostRequestTypeDetailId").val("");

                // ریست و مخفی‌سازی sub detail
                $("#cmbCostRequestTypeSubDetail").val("");
                $("#cmbCostRequestTypeSubDetail option").hide();
                $("#cmbCostRequestTypeSubDetail option[value='']").show();
            });

            // وقتی یک جزییات انتخاب شد، فقط زیرجزییات مرتبط را نمایش بده
            $("#cmbCostRequestTypeDetailId").change(function() {
                var selectedDetail = $("#cmbCostRequestTypeDetailId option:selected").attr("id");
                $("#cmbCostRequestTypeSubDetail option").hide();
                $("#cmbCostRequestTypeSubDetail option[value='']").show();
                $("#cmbCostRequestTypeSubDetail option[value='" + selectedDetail + "']").show();
                $("#cmbCostRequestTypeSubDetail").val("");
            });
            /***********-- پایان وابستگی نوع/جزییات/زیرجزییات --*************/
			
			
            /***********-- استان و شهر پویا --*************/
            /**
             * انتخاب استان باعث فیلتر شهر می‌شود
             * @param {string} provinceSelector - سلکتور استان
             * @param {string} citySelector - سلکتور شهر
             */
            function handleProvinceChange(provinceSelector, citySelector) {
                $(provinceSelector).on('change', function () {
                    var selectedProvince = $(this).val();
                    var $citySelect = $(citySelector);
                    // پنهان‌کردن همه آپشن‌ها
                    $citySelect.find('option').hide();
                    // فقط آپشنی که value برابر کد استان دارد را نشان بده
                    $citySelect.find('option').filter(function () {
                        return $(this).val() === selectedProvince;
                    }).show();
                    // اولین آپشن نمایش داده شده را انتخاب کن
                    var firstVisible = $citySelect.find('option:visible:first').val();
                    $citySelect.val(firstVisible);
                });
            }

            // مقداردهی اولیه وابستگی نوع هزینه و جزییات
            $("#cmbCostRequestTypeId").trigger('change');

            // رویداد وابستگی استان/شهر مبدا و مقصد
            handleProvinceChange('#cmbOriginProvinceId', '#cmbOriginCityId');
            handleProvinceChange('#cmbDestinationProvinceId', '#cmbDestinationCityId');

            /***********-- دریافت کاربر فعلی --*************/
            // اعمال MutationObserver برای همه سلکتورها جهت اضافه کردن "انتخاب کنید"
            selectIds.forEach(observeAndAddPlaceholder);


            // گرفتن کاربر جاری برای ذخیره یا عملیات وابسته
            UserService.GetCurrentUser(
                true,
                function (data) {
                    
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

    // آغاز فرآیند مقداردهی اولیه صفحه
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
		$.alert('لطفا تاریخ را وارد کنید!', '', 'rtl');
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
	var requestCostPrice = rcommafy($("#txtRequestCostPrice").val());
    if (!requestCostPrice || isNaN(requestCostPrice) || Number(requestCostPrice) <= 0) {
        $.alert('لطفا مبلغ هزینه را صحیح وارد کنید!', '', 'rtl');
        $("#txtRequestCostPrice").focus();
        return false;
    }

    // فقط وقتی ایاب وذهاب یا اقامت انتخابه
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
			alert('لطفا تاریخ شروع را وارد کنید!','', 'rtl');
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
			$.alert('لطفا تاریخ پایان را وارد کنید!', '', 'rtl');
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
		let startKM = rcommafy($("#txtStartKM").val());
        if (!startKM || isNaN(startKM) || Number(startKM) < 0) {
            $.alert('لطفا کیلومتر شروع را صحیح وارد کنید!', '', 'rtl');
            $("#txtStartKM").focus();
            return false;
        }
		let endKM = rcommafy($("#txtEndKM").val());
        if (!endKM || isNaN(endKM) || Number(endKM) < 0) {
            $.alert('لطفا کیلومتر پایان را صحیح وارد کنید!', '', 'rtl');
            $("#txtEndKM").focus();
            return false;
        }
		// اگر کیلومتر شروع بزرگتر از پایان باید خطا میدهد
		if (startKM && endKM && startKM > endKM) {
		    $.alert('کیلومتر شروع نباید از کیلومتر پایان بیشتر باشد!', '', 'rtl');
		    $("#txtStartKM, #txtEndKM").addClass('error');
		    $("#txtStartKM").focus();
		    return false; // جلو ادامه یا ثبت رو بگیر
		} 
    }
	if (costRequestTypeId === "1" || costRequestTypeId === "2") {
	    var startStr = $("#dpStartDate").attr("data-gdate");
	    var endStr = $("#bpEndDate").attr("data-gdate");
	
	    // شرط جدید: اگر تاریخ پایان انتخاب شد اما تاریخ شروع خالی بود
	    if ((!startStr || startStr === "") && endStr && endStr !== "") {
	        $.alert('ابتدا تاریخ شروع را انتخاب کنید!', '', 'rtl');
	        return false;
	    }
	
	    var startDate = parseGDate(startStr);
	    var endDate = parseGDate(endStr);
	
	    // تاریخ امروز (سال-ماه-روز) بدون ساعت
	    var today = new Date();
	    today.setHours(0,0,0,0);
	
	    // اگر تاریخ شروع انتخاب شده و از امروز بعدتر بود
	    if (startDate && startDate > today) {
	        $.alert('تاریخ شروع نباید بزرگتر از امروز باشد!', '', 'rtl');
	        return false;
	    }
	
	    // اگر تاریخ پایان انتخاب شده و از امروز بعدتر بود
	    if (endDate && endDate > today) {
	        $.alert('تاریخ پایان نباید بزرگتر از امروز باشد!', '', 'rtl');
	        return false;
	    }
	
	    // تاریخ پایان نباید کوچکتر از تاریخ شروع باشد
	    if (startDate && endDate) {
	        if (endDate < startDate) {
	            $.alert('تاریخ پایان نباید کمتر از تاریخ شروع باشد!', '', 'rtl');
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
    // Create a variables
    let insertCostRequestDetail = FormManager.insertCostRequest;
	let costDate = $("#dpCostDate").data("gdate");
	let costRequestTypeId = $("#cmbCostRequestTypeId").val();
	let costRequestTypeDetailId = $("#cmbCostRequestTypeDetailId option:selected").attr("id");
	let costRequestTypeSubDetail = $("#cmbCostRequestTypeSubDetail option:selected").attr("id");
	let originProvinceId = $("#cmbOriginProvinceId").val();
	let originCityId = $("#cmbOriginCityId option:selected").attr("id");
	let startDate = $("#dpStartDate").data("gdate");
	let startKM = rcommafy($("#txtStartKM").val());
	let destinationProvinceId = $("#cmbDestinationProvinceId").val();
	let destinationCityId = $("#cmbDestinationCityId option:selected").attr("id");
	let endDate = $("#bpEndDate").data("gdate");
	let endKM = rcommafy($("#txtEndKM").val());
	let requestCostPrice = rcommafy($("#txtRequestCostPrice").val());
	let description = $("#txtDiscription").val();


        const insertParams = {
            RequestCostId:              globalCostRequestID,					// شماره درخواست ثبت شده
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
            EndKM:       			   endKM			  // سایر هزینه
        };
		// فیلتر کردن مقادیر خالی (null, '', undefined)
		Object.keys(insertParams).forEach(key => {
		    // اگر مقدار فیلد خالی، undefined یا null بود، حذفش کن
		    if (insertParams[key] === undefined || insertParams[key] === null || insertParams[key] === '') {
		        delete insertParams[key];
		    }
		});
	console.log(insertParams);
	/*
	       insertCostRequestDetail(insertParams,
            function(dataXml){
                hideLoading();
                $.alert(
				    "درخواست شما با موفقیت ذخیره گردید.",
				    "ذخیره شد",
				    "rtl",
				    function() {
				        closeWindow({ OK: true, Result: null });
				    }
				);
            },
            function(error) {
                hideLoading();
				$.alert(`ذخیره سازی با خطا مواجه شده است.\n ${error}`, "توجه", "rtl");
                console.error(error);
            }
        );*/
});	
        // Insert new CostRequest

	
	



//#endregion btnregister.js


//#region helper.common.js
// ==================== changeDialogTitle ====================
// This function changes the title of the dialog box (parent window)
// It takes a new title and two callbacks (onSuccess, onError)
function changeDialogTitle (title, onSuccess, onError) {
    try {
        // Access the parent window
        // Get the iframe that is running this code
        // Go up to the dialog box that contains the iframe
        // Find the span element that has the dialog title
        var $titleSpan = window.parent
            .$(window.frameElement)         // this iframe
            .closest('.ui-dialog')          // find the dialog box
            .find('.ui-dialog-title');      // find the title span

        // Check if the title span exists
        if ($titleSpan.length > 0) {
            $titleSpan.text(title); // Set the new title

            // If success callback is a function, call it
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            // If title span is not found, call onError or show warning
            if (typeof onError === 'function') {
                onError('Dialog title not found');
            } else {
                console.warn('Dialog title not found');
            }
        }
    } catch (e) {
        // If something goes wrong (like cross-origin error)
        if (typeof onError === 'function') {
            onError(e);
        } else {
            console.error("Cannot reach parent document", e);
        }
    }
}

// ==================== allowOnlyNumbers =====================
// This function allows only number keys in an input field
function allowOnlyNumbersComma(e, $input) {
    const key = e.which;

    // اجازه کلیدهای کنترلی (Ctrl+C, Ctrl+V و ...)
    if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(key)) return;

    // اجازه کلیدهای خاص: backspace, tab, enter, delete, arrow keys
    if ([8, 9, 13, 46].includes(key) || (key >= 37 && key <= 40)) return;

    // فقط اعداد از بالا یا numpad
    if ((key >= 48 && key <= 57 && !e.shiftKey) || (key >= 96 && key <= 105)) {
        setTimeout(() => {
            const el = $input[0];
            const originalValue = el.value;
            const cursorPosition = el.selectionStart;

            // حذف تمام کاماها
            const raw = originalValue.replace(/,/g, '');

            // جلوگیری از NaN یا مقدار خالی
            if (isNaN(raw) || raw === "") return;

            // فرمت با کاما
            const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            // محاسبه موقعیت جدید مکان‌نما
            const diff = formatted.length - originalValue.length;
            const newCursorPosition = cursorPosition + diff;

            // مقدار جدید و مکان‌نما
            $input.val(formatted);
            el.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
        return;
    }

    // جلوگیری از سایر کلیدها
    e.preventDefault();
}
//***********************************************************************************
//***************************showLoading*********************************************
function showLoading() {
    let $box = $('#loadingBoxTweaked');
    if (!$box.length) {
        $box = $(`
            <div id="loadingBoxTweaked"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.80);display:flex;align-items:center;justify-content:center;z-index:999999;">
                <div class="spinner"></div>
            </div>
        `);
        // spinner css
        let $style = $('#loadingSpinnerStyle');
        if (!$style.length) {
            $style = $(`
                <style id="loadingSpinnerStyle">
                .spinner {
                    border: 7px solid #eee;
                    border-top: 7px solid #1976d2;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
                </style>
            `);
            $('head').append($style);
        }
        $('body').append($box);
    } else {
        $box.show();
    }
    setTimeout(function() {
        $box.fadeOut(150);
    }, 2000);
}
//***************************showLoading*********************************************
// ==================== changeDialogTitle ====================
function changeDialogTitle (title, onSuccess, onError) {
    try {
        var $titleSpan = window.parent
            .$(window.frameElement)         // this iframe
            .closest('.ui-dialog')          // find the dialog box
            .find('.ui-dialog-title');      // find the title span

        // Check if the title span exists
        if ($titleSpan.length > 0) {

            $titleSpan.text(title); 

            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            if (typeof onError === 'function') {
                onError('Dialog title not found');
            } else {
                console.warn('Dialog title not found');
            }
        }
    } catch (e) {
        if (typeof onError === 'function') {
            onError(e);
        } else {
            console.error("Cannot reach parent document", e);
        }
    }
}
//#endregion

//#region 
//#endregion