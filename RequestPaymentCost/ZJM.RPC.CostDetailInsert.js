//#region ready.js
let $form;
let CurrentUserId;
var costRequestID = null;
var isInTestMode = false;
var primaryKeyName = "Id";

$(function () {
    $form = (function () {
        var pk,
            inEditMode = false,
            primaryKeyName = "Id";

        // ======== Helpers =====
        // اگر گزینه "انتخاب کنید" در ابتدای سلکت نبود، اضافه کن
        function addPlaceholder($sel) {
            if (
                $sel.length &&
                (!($sel.find("option:first").text().trim() === "انتخاب کنید") || $sel.find("option:first").val() !== "")
            ) {
                $sel.prepend('<option value="" selected disabled hidden>انتخاب کنید</option>');
                $sel[0].selectedIndex = 0;
            }
        }

        // استفاده از MutationObserver برای اضافه کردن placeholder تا زمانی که آپشن‌ها در سلکت لود شوند
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
            $(document).ready(function () {
                costRequestID = params?.costRequestID;
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

            // اعمال MutationObserver برای همه سلکتورها جهت اضافه کردن "انتخاب کنید"
            selectIds.forEach(observeAndAddPlaceholder);

            /***********-- وابستگی بین نوع هزینه و جزییات آن --*************/
            // وقتی "نوع هزینه" تغییر کرد فقط جزییات مرتبط را نشان بده
            $("#cmbCostRequestTypeId").change(function () {
                var selectedType = $(this).val();
                $("#cmbCostRequestTypeDetailId option").hide();
                $("#cmbCostRequestTypeDetailId option[value='']").show(); // فقط گزینه "انتخاب کنید"
                $("#cmbCostRequestTypeDetailId option[value='" + selectedType + "']").show();
                $("#cmbCostRequestTypeDetailId").val("");
                // ریست و مخفی‌سازی sub detail
                $("#cmbCostRequestTypeSubDetail").val("");
                $("#cmbCostRequestTypeSubDetail option").hide();
                $("#cmbCostRequestTypeSubDetail option[value='']").show();
            });

            // وقتی یک جزییات انتخاب شد، فقط زیرجزییات مرتبط را نمایش بده
            $("#cmbCostRequestTypeDetailId").change(function () {
                var selectedDetail = $("#cmbCostRequestTypeDetailId option:selected").attr("id");
                $("#cmbCostRequestTypeSubDetail option").hide();
                $("#cmbCostRequestTypeSubDetail option[value='']").show();
                $("#cmbCostRequestTypeSubDetail option[value='" + selectedDetail + "']").show();
                $("#cmbCostRequestTypeSubDetail").val("");
            });

            //انتخاب استان باعث فیلتر شهر می‌شود
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

            // مقداردهی اولیه وابستگی نوع هزینه و جزییات
            $("#cmbCostRequestTypeId").trigger('change');

            // رویداد وابستگی استان/شهر مبدا و مقصد
            handleProvinceChange('#cmbOriginProvinceId', '#cmbOriginCityId');
            handleProvinceChange('#cmbDestinationProvinceId', '#cmbDestinationCityId');

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
//------------------------------------------
// تبدیل رشته تاریخ به شی تاریخ
//------------------------------------------
function parseGDate(str) {
    if (!str) return null;
    var parts = str.includes('/') ? str.split('/') : str.split('-');
    if (parts.length !== 3) return null;
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    return new Date(year, month - 1, day);
}
//------------------------------------------

//------------------------------------------
// ثابت های سلکتور برای فیلدها
//------------------------------------------
const commonFields = [
    "#cmbOriginProvinceId",
    "#cmbOriginCityId",
    "#dpStartDate",
    "#cmbDestinationProvinceId",
    "#cmbDestinationCityId",
    "#bpEndDate",
    "#cmbCostRequestTypeSubDetail"
];
const kmFields = [ "#txtStartKM", "#txtEndKM" ];
//------------------------------------------

//------------------------------------------
// تنظیم وضعیت فیلدها بر اساس نوع درخواست
//------------------------------------------
function handleTypeFieldsState() {
    const typeId = $("#cmbCostRequestTypeId").val();
    const detailId = $("#cmbCostRequestTypeDetailId option:selected").attr("id");

    // اگر "خوراک" یا "سایر": همه غیرفعال و خالی
    if (typeId === "3" || typeId === "4") {
        [...commonFields, ...kmFields].forEach(sel => {
            $(sel).val("").prop("disabled", true);
            if ($(sel).attr("data-gdate") !== undefined)
                $(sel).attr("data-gdate", "");
        });
        return;
    }
    // اگر "ایاب و ذهاب" یا "اقامت"
    if (typeId === "1" || typeId === "2") {
        commonFields.forEach(sel => $(sel).prop("disabled", false));
        // فقط اگر جزئیات درسته، کیلومتر فعال
        if (typeId === "1" && (detailId === "4" || detailId === "5")) {
            kmFields.forEach(sel => $(sel).prop("disabled", false));
        } else {
            kmFields.forEach(sel => $(sel).val("").prop("disabled", true));
        }
        return;
    }
    // بقیه موارد: همه فعال
    [...commonFields, ...kmFields].forEach(sel => $(sel).prop("disabled", false));
}
//------------------------------------------

//------------------------------------------
// رویداد تغییر نوع درخواست
//------------------------------------------
$("#cmbCostRequestTypeId, #cmbCostRequestTypeDetailId").on("change", handleTypeFieldsState);
$(handleTypeFieldsState);
//------------------------------------------

//------------------------------------------
// اعتبارسنجی فرم
//------------------------------------------
function isFormValid() {
    const costDate = $("#dpCostDate").attr("data-gdate");
    const typeId = $("#cmbCostRequestTypeId").val();
    const detailId = $("#cmbCostRequestTypeDetailId option:selected").attr("id");
    const priceVal = rcommafy($("#txtRequestCostPrice").val());

    if (!costDate) return $.alert('لطفا تاریخ را وارد کنید!', '', 'rtl'), false;
    if (!typeId) {
        $.alert('لطفا نوع هزینه را انتخاب کنید!', '', 'rtl');
        $("#cmbCostRequestTypeId").focus();
        return false;
    }
    if (!$("#cmbCostRequestTypeDetailId").val()) {
        $.alert('لطفا جزئیات هزینه را انتخاب کنید!', '', 'rtl');
        $("#cmbCostRequestTypeDetailId").focus();
        return false;
    }
    if (!priceVal || isNaN(priceVal) || Number(priceVal) <= 0) {
        $.alert('لطفا مبلغ هزینه را صحیح وارد کنید!', '', 'rtl');
        $("#txtRequestCostPrice").focus();
        return false;
    }

    // چک فیلدهای تکمیلی برای برخی نوع هزینه
    if (typeId === "1" || typeId === "2") {
        if (!$("#cmbOriginProvinceId").val()) return $.alert('لطفا استان مبدا را انتخاب کنید!', '', 'rtl'), $("#cmbOriginProvinceId").focus(), false;
        if (!$("#cmbOriginCityId").val()) return $.alert('لطفا شهر مبدا را انتخاب کنید!', '', 'rtl'), $("#cmbOriginCityId").focus(), false;
        if (!$("#dpStartDate").attr("data-gdate")) return $.alert('لطفا تاریخ شروع را وارد کنید!', '', 'rtl'), false;
        if (!$("#cmbDestinationProvinceId").val()) return $.alert('لطفا استان مقصد را انتخاب کنید!', '', 'rtl'), $("#cmbDestinationProvinceId").focus(), false;
        if (!$("#cmbDestinationCityId").val()) return $.alert('لطفا شهر مقصد را انتخاب کنید!', '', 'rtl'), $("#cmbDestinationCityId").focus(), false;
        if (!$("#bpEndDate").attr("data-gdate")) return $.alert('لطفا تاریخ پایان را وارد کنید!', '', 'rtl'), false;
    }

    // اعتبارسنجی جزئیات و کیلومتر
    if (typeId === "1" && (detailId === "4" || detailId === "5")) {
        if (!$("#cmbCostRequestTypeSubDetail").val()) return $.alert('لطفا زیرجزئیات نوع هزینه را انتخاب کنید!', '', 'rtl'), $("#cmbCostRequestTypeSubDetail").focus(), false;
        const startKM = rcommafy($("#txtStartKM").val());
        const endKM = rcommafy($("#txtEndKM").val());
        if (!startKM || isNaN(startKM) || Number(startKM) < 0) return $.alert('لطفا کیلومتر شروع را صحیح وارد کنید!', '', 'rtl'), $("#txtStartKM").focus(), false;
        if (!endKM || isNaN(endKM) || Number(endKM) < 0) return $.alert('لطفا کیلومتر پایان را صحیح وارد کنید!', '', 'rtl'), $("#txtEndKM").focus(), false;
        if (startKM > endKM) {
            $.alert('کیلومتر شروع نباید از کیلومتر پایان بیشتر باشد!', '', 'rtl');
            $("#txtStartKM, #txtEndKM").addClass('error').first().focus();
            return false;
        }
    }

    // کنترل تاریخ ها: شروع، پایان، امروز
    if (typeId === "1" || typeId === "2") {
        const startStr = $("#dpStartDate").attr("data-gdate");
        const endStr = $("#bpEndDate").attr("data-gdate");
        if ((!startStr || startStr === "") && endStr && endStr !== "") {
            $.alert('ابتدا تاریخ شروع را انتخاب کنید!', '', 'rtl');
            return false;
        }
        const startDate = parseGDate(startStr);
        const endDate = parseGDate(endStr);
        const today = new Date(); today.setHours(0,0,0,0);
        if (startDate && startDate > today) return $.alert('تاریخ شروع نباید بزرگتر از امروز باشد!', '', 'rtl'), false;
        if (endDate && endDate > today) return $.alert('تاریخ پایان نباید بزرگتر از امروز باشد!', '', 'rtl'), false;
        if (startDate && endDate && endDate < startDate) return $.alert('تاریخ پایان نباید کمتر از تاریخ شروع باشد!', '', 'rtl'), false;
    }
    return true;
}
//------------------------------------------
// ثبت فرم با اکشن کلیک
$("#btnRegister").on("click", function (e) {
    if (!isFormValid()) {
        e.preventDefault();
        return false;
    }
	//------------------------------------------
    // گرفتن اطلاعات (میتونی یه آرایه یوزفل سلکتورها درست کنی و با یک loop فیلتر کنی)
	//------------------------------------------
    const insertParams = {
        RequestCostId: costRequestID,
        CostDate: $("#dpCostDate").data("gdate"),
        CostRequestTypeId: $("#cmbCostRequestTypeId").val(),
        CostRequestTypeDetailId: $("#cmbCostRequestTypeDetailId option:selected").attr("id"),
        CostRequestTypeSubDetail: $("#cmbCostRequestTypeSubDetail option:selected").attr("id"),
        OriginProvinceId: $("#cmbOriginProvinceId").val(),
        OriginCityId: $("#cmbOriginCityId option:selected").attr("id"),
        DestinationProvinceId: $("#cmbDestinationProvinceId").val(),
        DestinationCityId: $("#cmbDestinationCityId option:selected").attr("id"),
        StartDate: $("#dpStartDate").data("gdate"),
        EndDate: $("#bpEndDate").data("gdate"),
        Description: $("#txtDiscription").val(),
        RequestCostPrice: rcommafy($("#txtRequestCostPrice").val()),
        StartKM: rcommafy($("#txtStartKM").val()),
        EndKM: rcommafy($("#txtEndKM").val())
    };
	//------------------------------------------
	
	//------------------------------------------
    // فیلتر: حذف فیلدهای خالی
    Object.keys(insertParams).forEach(key => {
        if (insertParams[key] === undefined || insertParams[key] === null || insertParams[key] === '')
            delete insertParams[key];
    });
	//------------------------------------------
	
	//------------------------------------------
    // ثبت اطلاعات
	//------------------------------------------
    FormManager.insertCostRequest(insertParams,
        function (dataXml) {
            hideLoading();
            $.alert(
                "درخواست شما با موفقیت ذخیره گردید.",
                "ذخیره شد",
                "rtl",
                function () {
                    closeWindow({ OK: true, Result: costRequestID });
                }
            );
        },
        function (error) {
            hideLoading();
            $.alert(`ذخیره سازی با خطا مواجه شده است.\n ${error}`, "توجه", "rtl");
            console.error(error);
        }
    );
	//------------------------------------------
});



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