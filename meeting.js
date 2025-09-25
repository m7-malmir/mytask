// ============================================================================
//  ابزارهای عمومی برای قالب‌بندی و مدیریت داده‌ها
// ============================================================================

// جدا کردن اعداد سه‌رقمی با ویرگول (مثلاً 1000 → 1,000)
function commafy(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/*****************************************************************************************/

// حذف ویرگول از رشته و تبدیل به عدد
function rcommafy(x) {
    a = x.replace(/\,/g, '');   // حذف همه ویرگول‌ها
    a = parseInt(a, 10);        // تبدیل به عدد صحیح
    return a;
}

// ============================================================================
//  مدیریت خطاها
// ============================================================================

// نمایش پیام خطا و چاپ دیتا در کنسول
function ErrorMessage(message, data) {
    $.alert(message);
    console.log('Data: ' + list); //  متغیر list اینجا تعریف نشده
    myHideLoading();
}

// هندل خطا برای متدها
function handleError(err, methodName) {
    console.error('Error On ' + methodName, err); // چاپ خطا در کنسول
    alert('Error On ' + methodName + ', ' + err); // نمایش به کاربر
    hideLoading();
    myHideLoading();
}

// ============================================================================
//  هندل کردن نتیجه اجرای فرآیند (Workflow)
// ============================================================================
function handleRunWorkflowResponse(xmlString) {
    // پارس XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // گرفتن مقادیر خطا
    const hasErrorNode = xmlDoc.querySelector("hasError");
    const errorMessageNode = xmlDoc.querySelector("errorMessage");

    const hasError = hasErrorNode && hasErrorNode.textContent.trim().toLowerCase() === "true";
    const errorMessage = errorMessageNode ? errorMessageNode.textContent.trim() : "Unknown error";

    if (hasError) {
        console.error("خطا در اجرای فرآیند:", errorMessage);
        alert("خطا در اجرای فرآیند: " + errorMessage);
    } else {
        console.log("درخواست با موفقیت ارسال شد");
        $.alert("درخواست شما با موفقیت ارسال شد", "", "rtl", function () {
            hideLoading();
            closeWindow({ OK: true, Result: null });
            myHideLoading();
        });
    }
}

// ============================================================================
//  تغییر عنوان دیالوگ
// ============================================================================
function changeDialogTitle(title, onSuccess, onError) {
    try {
        var $titleSpan = window.parent
            .$(window.frameElement) // دسترسی به iframe جاری
            .closest('.ui-dialog')  // پیدا کردن دیالوگ
            .find('.ui-dialog-title'); // گرفتن تایتل

        if ($titleSpan.length > 0) {
            $titleSpan.text(title);
            if (typeof onSuccess === 'function') onSuccess();
        } else {
            if (typeof onError === 'function') onError('Dialog title not found');
            else console.warn('Dialog title not found');
        }
    } catch (e) {
        if (typeof onError === 'function') onError(e);
        else console.error("Cannot reach parent document", e);
    }
}

// ============================================================================
//  نمایش و مخفی کردن لودینگ
// ============================================================================
function showLoading() {
    let $box = $('#loadingBoxTweaked');
    if (!$box.length) {
        $box = $(`
            <div id="loadingBoxTweaked"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.80);
                display:flex;align-items:center;justify-content:center;z-index:999999;">
                <div class="spinner"></div>
            </div>
        `);

        // تعریف CSS اسپینر فقط یک بار
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

function hideLoading() {
    $('#loadingBoxTweaked').fadeOut(180, function () { $(this).remove(); });
}

// ============================================================================
//  مدیریت Hidden Fields برای Actor/Role
// ============================================================================
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

// ============================================================================
//  پر کردن کمبو از سرویس و هندل انتخاب/حذف
// ============================================================================
function fillComboWithService($combo, service, placeholderText, singleSelect = false) {
    return new Promise(resolve => {
        service.Read({}, function (data) {
            const xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);

            const list = xmlData.find("row").map(function () {
                const fullName = $(this).find("col[name='fullName']").text();
                const roleName = $(this).find("col[name='RoleName']").text();
                return {
                    id: $(this).find("col[name='ActorId']").text(),
                    text: roleName ? `${fullName} - ${roleName}` : fullName,
                    actorId: $(this).find("col[name='ActorId']").text(),
                    roleId: $(this).find("col[name='RoleId']").text()
                };
            }).get();

            // مقداردهی کمبو
            $combo.empty().select2({
                data: list,
                placeholder: placeholderText || "انتخاب مورد",
                dir: "rtl",
                multiple: !singleSelect,
                closeOnSelect: singleSelect,
                scrollAfterSelect: false
            });

            // رویداد انتخاب
            $combo
                .off("select2:select").on("select2:select", e => {
                    const d = e.params.data;
                    if (singleSelect) $($combo.data("actor-field")).val(d.actorId);
                    else updateHiddenFields($combo, d.actorId, d.roleId, true);
                })
                // رویداد حذف
                .off("select2:unselect").on("select2:unselect", e => {
                    const d = e.params.data;
                    if (singleSelect) $($combo.data("actor-field")).val("");
                    else updateHiddenFields($combo, d.actorId, d.roleId, false);
                });

            resolve();
        }, function (err) {
            alert("Service titles read error: " + err);
            resolve();
        });
    });
}

// ============================================================================
//  ست کردن انتخاب‌ها از Hidden Field
// ============================================================================
function setComboSelectionFromHidden($combo) {
    const actorField = $combo.data("actor-field");
    if (!actorField) return;

    const actorIds = $(actorField).val().split(",").filter(Boolean);
    if (actorIds.length === 0) return;

    $combo.val(actorIds).trigger("change");
}

// ============================================================================
//  توابع کاربردی (Utility)
// ============================================================================

// تاریخ میلادی → شمسی با کنترل خطا
function safeShamsiDate(miladiDate) {
    if (!miladiDate || typeof miladiDate !== "string" || !miladiDate.trim()) return "";
    if (miladiDate.startsWith("0001") || miladiDate.startsWith("1900")) return "";
    return formatMiladiToShamsi(miladiDate);
}

// گرفتن آیکون فایل بر اساس پسوند
function getFileIcon(fileType, fileContent) {
    switch (fileType.toLowerCase()) {
        case ".doc":
        case ".docx":
            return "https://cdn.iconscout.com/icon/free/png-64/microsoft-word-28-761688.png";
        case ".xls":
        case ".xlsx":
            return "https://cdn.iconscout.com/icon/free/png-64/microsoft-excel-29-761701.png";
        case ".ppt":
        case ".pptx":
            return "https://cdn.iconscout.com/icon/free/png-64/microsoft-powerpoint-30-761705.png";
        case ".pdf":
            return "https://cdn.iconscout.com/icon/free/png-64/adobe-pdf-5646849-4691213.png";
        case ".png":
        case ".jpg":
        case ".jpeg":
        case ".gif":
            return "data:image/png;base64," + fileContent;
        default:
            return "https://cdn-icons-png.flaticon.com/64/337/337946.png";
    }
}

// ============================================================================
//  مدیریت مصوبات (Items)
// ============================================================================
function handleNewMinuteItem(result) {
    const uniqueId = result.Id || `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const newItem = Object.assign({}, result, {
        Id: uniqueId,
        ResponsibleForAction: result.ResponsibleForAction || "",
        ResponsibleForActionName: result.ResponsibleForActionName || "-",
        ActorForAction: result.ResponsibleForAction || ""
    });

    console.log("MeetingMinutesData before add:", MeetingMinutesData);

    MeetingMinutesData.Items.push(newItem);
    addRowToTable(newItem, MeetingMinutesData.Items.length);
}

// افزودن ردیف در جدول
function addRowToTable(item, displayIndex) {
    $("#tblMinuteManagment .empty-message").remove();

    const $template = $("#tblMinuteManagment tbody tr.row-template").first().clone();
    $template.removeClass("row-template").addClass("data-row").show();

    const rowId = item.Id;

    // ستون رادیویی
    $template.find("td").eq(0)
        .html(`<input type="radio" name="selectedRowId" value="${rowId}" />`);

    // ستون شناسه
    $template.find("td").eq(1).text(rowId);

    // ستون عنوان
    $template.find("td").eq(2).text(item.Title?.trim() || "-");

    // ستون مسئول
    let actorName = (item.ResponsibleForActionName && item.ResponsibleForActionName.trim()) || "";
    if (!actorName && item.ResponsibleForAction) {
        const $actorOption = $("#cmbResponsibleForAction option[value='" + item.ResponsibleForAction + "']");
        actorName = ($actorOption.length && $actorOption.text().trim()) || "";
    }
    $template.find("td").eq(3).text(actorName || "-");

    // ستون تاریخ
    $template.find("td").eq(4)
        .text(item.DisplayDate || "-")
        .attr("data-gdate", item.ActionDeadLineDate || "");

    // ستون ActorForAction
    $template.find("td").eq(5).text(item.ActorForAction?.trim() || "-");

    $("#tblMinuteManagment tbody").append($template);
}

// حذف آیتم
function deleteMinuteItem(selectedId) {
    const index = MeetingMinutesData.Items.findIndex(item => String(item.Id) === String(selectedId));
    if (index > -1) {
        MeetingMinutesData.Items.splice(index, 1);
        $("#tblMinuteManagment tbody tr").has(`input[name='selectedRowId'][value='${selectedId}']`).remove();
    }
}

// ============================================================================
//  مدیریت فایل‌های پیوست
// ============================================================================

// افزودن فایل به UI
function addAttachmentToFieldset(file) {
    const $container = $("#gbxDocuments");

    const $item = $(`
        <div data-file-id="${file.FileId}" style="display:inline-flex;flex-direction:column;
            align-items:center;width:30px;height:30px;margin:2px;padding:2px;
            border:1px solid #ccc;border-radius:4px;background:#fff;position:relative;
            font-family:Tahoma;font-size:8pt;">
            <button class="remove-btn" title="حذف"
                style="position:absolute;top:-3px;right:-3px;background:#f33;color:#fff;
                border:none;border-radius:50%;cursor:pointer;width:14px;height:14px;
                line-height:12px;font-size:9px;padding:0;">×</button>
            <img src="${getFileIcon(file.FileType, file.FileContent)}"
                 alt="${file.FileName}" title="${file.FileName}"
                 style="width:15px;height:15px;object-fit:contain;margin-top:12px;">
            <span style="display:block;text-align:center;margin-top:3px;width:100%;
                overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                ${file.FileName}
            </span>
        </div>
    `);

    $item.find(".remove-btn").on("click", function () {
        const fileId = $item.data("file-id");
        removeAttachment(fileId, $item);
    });

    $container.append($item);
}

// حذف فایل
function removeAttachment(fileId, $element) {
    $.confirm("آیا نسبت به حذف این سند مطمئن هستید؟", "حذف اطلاعات", "rtl", function (result) {
        if (result === "OK") {
            const params = { Where: "FileId = '" + fileId + "'" };
            showLoading();
            FormManager.deleteAttachedFile(
                params,
                function () {
                    hideLoading();
                    $element.remove();
                    $.alert("حذف با موفقیت انجام شد", "حذف شد", "rtl");
                },
                function (error) {
                    hideLoading();
                    $.alert("حذف با خطا مواجه شد.", "خطا", "rtl");
                    console.error(error);
                }
            );
        }
    });
}

// بارگذاری فایل‌ها
function loadAttachments(meetingMinuteId) {
    if (!meetingMinuteId) {
        console.debug("loadAttachments skipped: no meetingMinuteId");
        return;
    }

    const readParams = { WHERE: "SystemId = 3 AND DocumentId = '" + meetingMinuteId + "'" };
    FormManager.readAttachedFile(
        readParams,
        function (list) {
            if (list && list.length) {
                list.forEach(file => addAttachmentToFieldset(file));
            } else {
                console.debug("No attachments found.");
            }
        },
        function (error) {
            if (error && (error.erroMessage || error.message)) {
                alert('خطا در خواندن فایل‌ها: ' + (error.erroMessage || error.message));
            } else {
                console.debug("No file found, but not an error.");
            }
        }
    );
}