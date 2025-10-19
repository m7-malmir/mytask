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

//#region Utility.js
// =========================== sortTable ============================
function sortTable(table){
    const headers = table.querySelectorAll(".row-header td");

    headers.forEach((header, index) => {
        // Only make data columns sortable, not the selection column
        if (header.textContent.trim() !== "") {
            header.classList.add("sortable");
            header.addEventListener("click", function () {
                sortTable(table, index);
            });
        }
    });

    function sortTable(table, columnIndex) {
        const rowsArray = Array.from(table.querySelectorAll(".row-data"));
        const headerCell = headers[columnIndex];
        const isAsc = !headerCell.classList.contains("asc");

        // Delete classes
        headers.forEach(h => h.classList.remove("asc", "desc"));

        rowsArray.sort((a, b) => {
            let aText = a.cells[columnIndex].innerText.trim();
            let bText = b.cells[columnIndex].innerText.trim();

            // If it is a number, compare it to a number
            let aNum = parseFloat(aText.replace(/,/g, ""));
            let bNum = parseFloat(bText.replace(/,/g, ""));
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAsc ? aNum - bNum : bNum - aNum;
            }

            // Textual comparison
            return isAsc
                ? aText.localeCompare(bText, 'fa', { numeric: true })
                : bText.localeCompare(aText, 'fa', { numeric: true });
        });

        // Add a class to indicate the sort order
        headerCell.classList.toggle("asc", isAsc);
        headerCell.classList.toggle("desc", !isAsc);

        // Reinsert rows
        rowsArray.forEach(row => table.tBodies[0].appendChild(row));
    }	
}

// ========================== pagination ============================
function pagination(element, rowNumber){
    const rowsPerPage = rowNumber;
    const $table = element;
    const $rows = $table.find("tbody tr.row-data");
    const totalRows = $rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    let currentPage = 1; // Current page

    const $pagination = $("#pagination");
	const $rowPagination = $("#tscTablePagination");
    $pagination.empty();
	
	// Hide pagination
    if (totalPages <= 1) {
        $pagination.hide();
    	$rowPagination.hide();
        return;
    }

	// Show pagination
    $pagination.show();
	$rowPagination.show();
	
    // Display the specified page
    function showPage(page) {
        currentPage = page;

        $rows.hide();
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        $rows.slice(start, end).show();

        renderButtons();
    }

    // Generate page number + previous/next buttons
    function renderButtons() {
        $pagination.empty();

        // Previous button
        const prevDisabled = currentPage === 1 ? "disabled" : "";
        $pagination.append(`<a href="#" class="prev" ${prevDisabled}><i style="font-family: 'Font Awesome 5 Pro'!important;" class="fas fa-chevron-double-right"></i></a>`);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = currentPage === i ? "active" : "";
            $pagination.append(`<a href="#" data-page="${i}" class="${activeClass}">${i}</a>`);
        }

        // Next button
        const nextDisabled = currentPage === totalPages ? "disabled" : "";
        $pagination.append(`<a href="#" class="next" ${nextDisabled}><i style="font-family: 'Font Awesome 5 Pro'!important;" class="fas fa-chevron-double-left"></i></a>`);
    }

    // Handle button clicks
    $pagination.off("click").on("click", "a", function (e) {
        e.preventDefault();
        const $btn = $(this);

        if ($btn.hasClass("prev") && currentPage > 1) {
            showPage(currentPage - 1);
        } else if ($btn.hasClass("next") && currentPage < totalPages) {
            showPage(currentPage + 1);
        } else if ($btn.data("page")) {
            showPage(parseInt($btn.data("page")));
        }
    });

    // Start from the first page
    showPage(1);
}

// ========================= addNoDataRow ===========================
function addNoDataRow($table) {
    var $headerRow = $table.find("tr.row-header").first();
    if ($headerRow.length) {
        if ($table.find("tr.no-data-row").length === 0) {
            var colCount = $headerRow.children("th, td").length;
            var newRow = $("<tr class='no-data-row' style='height: 3rem; display: table-row;'><td colspan='" + colCount + "' style='text-align:center; width: 100px; border: solid 1px #BED4DC; font-size: 1.2rem;'>داده ای ثبت نشده است</td></tr>");
            $headerRow.after(newRow);
        }
    }
}

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
/*	
function miladi_be_shamsi(gy, gm, gd) {
  var g_d_m, jy, jm, jd, gy2, days;
  g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  gy2 = (gm > 2) ? (gy + 1) : gy;
  days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  jy = -1595 + (33 * ~~(days / 12053));
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    jm = 1 + ~~(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + ~~((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy ,jm, jd];
}
//******************************************************************************************************

function miladiFormattedForAttr(miladiStr) {
    if (!miladiStr) return "";

    let cleanDate = miladiStr.split("T")[0].split(" ")[0].trim();
    let gy, gm, gd;

    if (cleanDate.includes("/")) {
        // فرمت MM/DD/YYYY
        let [m, d, y] = cleanDate.split("/").map(Number);
        return `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`;
    } else if (cleanDate.includes("-")) {
        // فرمت YYYY-MM-DD
        let [y, m, d] = cleanDate.split("-").map(Number);
        return `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`;
    }

    // اگر هیچ‌کدوم نبود
    return "";
}
//******************************************************************************************************

function miladiToShamsiFormatted(gy, gm, gd) {
    const [jy, jm, jd] = miladi_be_shamsi(gy, gm, gd);
    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}
*/
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
//#endregion  Utility.js

//#region Common.js
function commafy(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/*****************************************************************************************/
function rcommafy(x) {
    a=x.replace(/\,/g,''); // 1125, but a string, so convert it to number
	a=parseInt(a,10);
	return a
}
//******************************************************************************************************
// برای ایجاد یک عدد تصادفی با طول دخواه که با 0 و 5 و 3 شروع نمی شود
function GenerateRandomCode(length) {
    if (length < 1) {
        throw new Error("Length must be at least 1");
    }

    const digits = '0123456789';
    const disallowedFirstDigits = ['0', '3', '5'];

    // Generate the first digit, excluding 0 and 3 and 5
    let firstDigit;
    do {
        firstDigit = digits[Math.floor(Math.random() * digits.length)];
    } while (disallowedFirstDigits.includes(firstDigit));

    let code = firstDigit;

    // Generate the remaining digits
    for (let i = 1; i < length; i++) {
        code += digits[Math.floor(Math.random() * digits.length)];
    }

    return code;
}
//******************************************************************************************************
function ErrorMessage(message,data) {
	$.alert(message);
	console.log('Data: '+list);
	myHideLoading();
}
//******************************************************************************************************
function handleError(err,methodName) {
	console.error('Error On '+methodName, err); // چاپ خطا در کنسول
	alert('Error On '+ methodName +', '+ err);
	hideLoading();
	myHideLoading();
}
//******************************************************************************************************
function handleRunWorkflowResponse(xmlString) {
  // Parse XML string
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  // Get hasError and errorMessage values
  const hasErrorNode = xmlDoc.querySelector("hasError");
  const errorMessageNode = xmlDoc.querySelector("errorMessage");

  const hasError = hasErrorNode && hasErrorNode.textContent.trim().toLowerCase() === "true";
  const errorMessage = errorMessageNode ? errorMessageNode.textContent.trim() : "Unknown error";

  if (hasError) {
    console.error("خطا در اجرای فرآیند:", errorMessage);
    alert("خطا در اجرای فرآیند: " + errorMessage);
  } else {
    console.log("درخواست شما با موفقیت ارسال شد");
	$.alert("درخواست شما با موفقیت ارسال شد", "", "rtl", function() {
		hideLoading();
		closeWindow({ OK: true, Result: null });
		 myHideLoading();
	});
  }
}
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

// تابع Hidden Fields بر اساس ActorId
function updateHiddenFields($combo, actorId, roleId, isAdd) {
    const actorField = $combo.data("actor-field");
    const roleField = $combo.data("role-field");

    // مدیریت ActorId
    let actorIds = $(actorField).val().split(",").filter(Boolean);
    if (isAdd) {
        if (!actorIds.includes(actorId)) actorIds.push(actorId);
    } else {
        actorIds = actorIds.filter(id => id !== actorId);
    }
    $(actorField).val(actorIds.join(","));

    // مدیریت RoleId (در صورت وجود)
    if (roleField) {
        let roleIds = $(roleField).val().split(",").filter(Boolean);
        if (isAdd) {
            if (!roleIds.includes(roleId)) roleIds.push(roleId);
        } else {
            roleIds = roleIds.filter(id => id !== roleId);
        }
        $(roleField).val(roleIds.join(","));
    }
}

//******************************************************************************************************
// تابع پر کردن کمبو بر اساس ActorId
function fillComboWithService($combo, service, placeholder, filterIds) {
    return new Promise((resolve, reject) => {
        service.Read({}, function (data) {
            const xml = $.xmlDOM(data);
            let items = xml.find("row").map(function() {
                const id = $(this).find("col[name='ActorId']").text();
                const name = $(this).find("col[name='fullName']").text();
                return { id, text: name };
            }).get();

            // فیلتر فقط زمانی که filterIds پاس داده شده باشه
            if (Array.isArray(filterIds) && filterIds.length > 0) {
                items = items.filter(item => filterIds.includes(item.id));
            }

            $combo.empty().select2({
                data: items,
                placeholder: placeholder
            });

            resolve();
        });
    });
}

//******************************************************************************************************
//تابع جدید برای پیدا کردن افراد حاضر و غایب 
function setComboSelectionFromHidden($combo) {
    const actorField = $combo.data("actor-field");
    if (!actorField) return;

    // 1 - گرفتن ActorIdها از hidden
    const actorIds = $(actorField).val().split(",").filter(Boolean);

    if (actorIds.length === 0) return;

    // 2 - انتخاب در select2
    $combo.val(actorIds).trigger("change");
}
//******************************************************************************************************
//انتخاب حاضرین و غایبین در select2
function initActorCombo($cmb, serviceUrl, placeholder, valueField) {
    Promise.all([
        fillComboWithService($cmb, serviceUrl, placeholder)
    ])
    .then(() => {
        $cmb
            .prop("multiple", false)
            .select2({
                placeholder: placeholder,
                allowClear: true,
                dir: "rtl"
            })
            .val(null).trigger("change")
            .on("change", function () {
                $(valueField).val($(this).val() || "");
            });
    });
}

//******************************************************************************************************
function safeTrim(val) {
    return (val != null) ? String(val).trim() : "";
}
//******************************************************************************************************
 // کاملاً Promise محور، بدون تاخیر زمانی
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

                     $combo
                         .off("select2:select").on("select2:select", e => {
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
 function toJalali(gy) {
     if (!gy) return "";
     return moment(gy, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
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

//#endregion Common.js

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
