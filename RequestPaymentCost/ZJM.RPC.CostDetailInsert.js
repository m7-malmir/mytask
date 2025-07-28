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


//#region 
//#endregion


//#region 
//#endregion