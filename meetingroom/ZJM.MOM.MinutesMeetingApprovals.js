//#region ready.js
let $form;
let CurrentUserId;

$(function () {
    $form = (function () {
		// ======================== init =========================
        async function init() {
            const params = window.dialogArguments || {};
            build();
            bindEvents(params);
            await createControls(params); 
            $('input[role="TextBox"], input[role="DatePicker"]').attr('autocomplete', 'off');
            $("#lblFileInputHTML").html(`<input type="file" id="fileInput" accept="image/*" />`);
        }
		// ======================== build =========================
        function build() {
            changeDialogTitle("افزودن/ویرایش مصوبات");
        }
		// ======================== bindEvents =========================
        function bindEvents(params) {
            if (params && params.IdeaRequestId) {
                $("#lblIdeaRequestId").text(params.IdeaRequestId);
            }
        }
		// ======================== createControls =========================
        async function createControls(params) {
            window.modalParams = params || {};
            const presentIdsParam = params.presentIds || [];
            const absentIdsParam = params.absentIds || [];
            const selectedIds = [...presentIdsParam, ...absentIdsParam];

            showLoading();
            await fillSelectedOnlyFromService($("#cmbResponsibleForAction"), BS_GetUserInfo, selectedIds, "انتخاب کنید", false);

            // بعد از پر شدن کمبو، فرم رو پر کن
            fillEditFormFields(params);
            hideLoading();
        }

        return { init };

    })();

    $form.init();
});

//#endregion ready.js

//#region Common.js
//******************************************************************************************************
function changeDialogTitle (title, onSuccess, onError) {
    try {
        var $titleSpan = window.parent
            .$(window.frameElement)         // this iframe
            .closest('.ui-dialog')          // find the dialog box
            .find('.ui-dialog-title');      // find the title span

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
//******************************************************************************************************
function showLoading() {
    let $box = $('#loadingBoxTweaked');
    if (!$box.length) {
        $box = $(`
            <div id="loadingBoxTweaked"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.80);display:flex;align-items:center;justify-content:center;z-index:999999;">
                <div class="spinner"></div>
            </div>
        `);

        // spinner css فقط یکبار اضافه شود
        if (!$('#loadingSpinnerStyle').length) {
            $('<style id="loadingSpinnerStyle">')
                .html(`
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
                `)
                .appendTo('head');
        }
        $('body').append($box);
    } else {
        $box.show();
    }
}
//******************************************************************************************************
function hideLoading() {
    $('#loadingBoxTweaked').fadeOut(180, function () { $(this).remove(); });
}
//******************************************************************************************************
function safeTrim(val) {
    return (val != null) ? String(val).trim() : "";
}
//******************************************************************************************************
// پیدا کردن اسامی تفرات حاضر و غایب از صفحه اصلی
 function fillSelectedOnlyFromService(
     $combo,
     service,
     selectedIds,
     placeholderText = "انتخاب کنید",
     singleSelect = true
 ) {
     return new Promise(resolve => {
         try {
             service.Read({}, function (data) {
                 try {
                     const xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);
                     const list = xmlData.find("row").map(function () {
                         const fullName = $(this).find("col[name='fullName']").text();
                         const roleName = $(this).find("col[name='RoleName']").text();
                         const actorId = $(this).find("col[name='ActorId']").text();
                         return {
                             id: actorId,
                             text: roleName ? `${fullName} - ${roleName}` : fullName,
                             actorId: actorId,
                             roleId: $(this).find("col[name='RoleId']").text()
                         };
                     }).get();

                     const filteredList = list.filter(item => selectedIds.includes(item.id));
                     const finalList = filteredList;

                     $combo.empty().select2({
                         data: finalList,
                         placeholder: placeholderText,
                         dir: "rtl",
                         multiple: !singleSelect,
                         closeOnSelect: singleSelect,
                         dropdownCssClass: "combo-scroll"
                     });

                     $combo.val("").trigger("change");

                     $combo.off("select2:select").on("select2:select", e => {
                             const d = e.params.data;
                             if (d.id) {
                                 if (singleSelect) {
                                     $("#txtResponsibleActorId").val(d.actorId);
                                 } else {
                                     const allSelected = $combo.val() || [];
                                     $("#txtResponsibleActorId").val(allSelected.join(","));
                                 }
                             }
                         })
                         .off("select2:unselect").on("select2:unselect", e => {
                             if (singleSelect) {
                                 $("#txtResponsibleActorId").val("");
                             } else {
                                 const allSelected = $combo.val() || [];
                                 $("#txtResponsibleActorId").val(allSelected.join(","));
                             }
                         });
                 } catch (err) {
                     console.error("fillSelectedOnlyFromService parse error:", err);
                 } finally {
                     resolve();
                 }
             }, function (err) {
                 console.error("Service read error:", err);
                 resolve();
             });
         } catch (err) {
             console.error("fillSelectedOnlyFromService call error:", err);
             resolve();
         }
     });
 }

//******************************************************************************************************
// تغییر مقادیر در پاپ آپ مصوبات
 function fillEditFormFields(params) {
     if (!params.editItem) return;
     const editItem = params.editItem;

     $("#txtTitle").val(editItem.Title || "");

     if (editItem.ResponsibleActorId) {
         const ids = editItem.ResponsibleActorId.toString().split(",").map(x => x.trim()).filter(Boolean);
         $("#txtResponsibleActorId").val(ids.join(","));
         const $combo = $("#cmbResponsibleForAction");
         $combo.val(ids).trigger("change");
     }

     const $dateField = $("#txtActionDeadLineDate");
     $dateField.val("").attr("data-jdate", "").attr("data-gdate", "");

     if (editItem.ActionDeadLineJDate && editItem.ActionDeadLineJDate.trim() !== "") {
         $dateField
             .val(editItem.ActionDeadLineJDate)
             .attr("data-jdate", editItem.ActionDeadLineJDate)
             .attr("data-gdate", editItem.ActionDeadLineDate || "")
             .trigger("change");
         return;
     }

     if (editItem.ActionDeadLineDate && editItem.ActionDeadLineDate.trim() !== "") {
         const jdate = formatMiladiToShamsi(editItem.ActionDeadLineDate);
         $dateField
             .val(jdate)
             .attr("data-jdate", jdate)
             .attr("data-gdate", editItem.ActionDeadLineDate)
             .trigger("change");
     }
 }
//******************************************************************************************************
// تایپ فقط 500 کاراکتر مجاز است
$(function() {
    const maxChars = 500;
    const allowedRegex = /^[\u0600-\u06FF\uFB8A\u067E\u0686\u06AFA-Za-z0-9\.\،\-\_\(\)\s]+$/;
    const $txt = $("#txtTitle");
    const $lbl = $("#lblCaracter");

    // استایل لیبل
    $lbl.css({
        "font-family": "Tahoma",
        "font-size": "7pt",
        "color": "#666",
        "font-weight": "normal"
    });

    // مقدار اولیه
    $lbl.text(`(تعداد كاراكتر مجاز: ${maxChars})`);

    // رویداد تایپ
    $txt.on("input", function() {
        let input = $(this).val();

        // حذف کاراکترهای غیرمجاز، فقط اجازه‌ی مجازها
        input = input.split('').filter(ch => allowedRegex.test(ch)).join('');

        // محدودیت طول
        if (input.length > maxChars) {
            input = input.substring(0, maxChars);
        }

        $(this).val(input);

        const remain = maxChars - input.length;
        $lbl.text(`(تعداد كاراكتر مجاز: ${remain})`);

        // رنگ هشدار نزدیک پایان کاراکترها
        $lbl.css("color", remain < 50 ? "red" : "#666");
    });
});
//******************************************************************************************************
// ========================== styleDialog ===========================
const styleDialog = (background, border, color) => {
    setTimeout(() => {
        $(".ui-dialog-titlebar").css({
            background,
            border,
            color
        });
    }, 0);
};
//******************************************************************************************************
function formatMiladiToShamsi(miladiStr) {
    if (!miladiStr) return "";

    // جدا کردن تاریخ از زمان
    let cleanDate = miladiStr.split("T")[0].split(" ")[0].trim();
    let gy, gm, gd;

    if (cleanDate.includes("/")) {
        // فرمت MM/DD/YYYY
        let parts = cleanDate.split("/").map(Number);
        if (parts.length === 3) {
            gm = parts[0];
            gd = parts[1];
            gy = parts[2];
        }
    } else if (cleanDate.includes("-")) {
        // فرمت YYYY-MM-DD
        let parts = cleanDate.split("-").map(Number);
        if (parts.length === 3) {
            gy = parts[0];
            gm = parts[1];
            gd = parts[2];
        }
    }

    if (isNaN(gy) || isNaN(gm) || isNaN(gd)) return "";
    return miladiToShamsiFormatted(gy, gm, gd);
}

//#endregion Common.js

//#region formmanager.js
const FormManager = (() => {
		//to do
})();
//#endregion formmanager.js

//#region btnMinuteManagmentRegister.js
$("#btnMinuteManagmentRegister").on("click", function () {
    // --- ولیدیشن: عنوان خالی نباشد ---
    const titleValue = safeTrim($("#txtTitle").val());
    if (!titleValue) {
        $.alert('متن مصوبه خالی است، لطفاً وارد کنید.', "", "rtl");
        $("#txtTitle").focus();
        return;
    }

    // --- ولیدیشن: تاریخ اقدام نباید گذشته باشد ---
    const $dateInput = $("#txtActionDeadLineDate", document);
    let gDateRaw = safeTrim(
        $dateInput.data("gdate") ||
        $dateInput.attr("data-gdate") ||
        $dateInput.attr("gdate") ||
        ""
    );
    const jDateRaw = safeTrim(
        $dateInput.data("jdate") ||
        $dateInput.attr("data-jdate") ||
        ""
    );

    if (gDateRaw && /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(gDateRaw)) {
        const [gy, gm, gd] = gDateRaw.split("/").map(Number);
        const actionDate = new Date(gy, gm - 1, gd);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        actionDate.setHours(0, 0, 0, 0);

        if (actionDate.getTime() < todayDate.getTime()) {
            // هشدار به کاربر
            $.alert('تاریخ امروز و روزهای آینده مجاز است!', "", "rtl");

            // ریست کامل حالت های ذخیره‌شده برای تاریخ قدیمی:
            $dateInput.removeAttr("data-gdate data-jdate gdate")
                      .removeData("gdate")
                      .removeData("jdate")
                      .val("");
            return;
        }
    }
    // --- محاسبه حالت و آیدی ---
    const isEditMode = !!(
        window.modalParams &&
        window.modalParams.editItem &&
        window.modalParams.editItem.Id &&
        String(window.modalParams.editItem.Id).trim() !== ""
    );

    const finalId = isEditMode
        ? String(window.modalParams.editItem.Id).trim()
        : `ui_${new Date().toLocaleDateString("en-US")}_${Math.random()
              .toString(36)
              .substr(2, 5)}`;

    // --- سایر داده ها ---
    const actorIdsArray = $("#cmbResponsibleForAction").val() || [];
    const actorNamesFullArray = $("#cmbResponsibleForAction option:selected")
        .map(function () {
            return $(this).text();
        })
        .get();
    const actorNamesShortArray = actorNamesFullArray.map(function (txt) {
        return safeTrim(txt.split(" - ")[0]);
    });
    const actorNamesShort = actorNamesShortArray.join("، ");

    // --- ساخت آبجکت نهایی ---
    const FinalItem = {
        Id: finalId,
        Title: titleValue,
        ResponsibleForAction: actorIdsArray.join(","),
        ResponsibleForActionName: actorNamesShort,
        ActionDeadLineDate: gDateRaw,
        DisplayDate: jDateRaw,
    };

    // --- ارسال و پایان ---
    if (window.modalParams && typeof window.modalParams.onSubmit === "function") {
        window.modalParams.onSubmit(FinalItem);
    }

    closeWindow({ OK: true, Result: FinalItem });
});

//#endregion btnMinuteManagmentRegister.js
