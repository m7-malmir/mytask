//#region ready.js
let $form;

$(function () {
    $form = (function () {
		//==============================init==========================================
        function init() {
            const params = window.dialogArguments || {};
            build();
            createControls(params);
        }
		//==============================build==========================================
        function build() {
            changeDialogTitle("سوابق مصوبه");
        }
		//=======================loadMinuteManagmentDetails=============================
        function loadMinuteManagmentDetails(recordId) {
            return new Promise((resolve, reject) => {
                if (!recordId) {
                    alert("شناسه معتبر نیست");
                    return reject("شناسه معتبر نیست");
                }
                showLoading();
                const $tbody = $("#tblMinuteManagment").find("tbody").first();
                $tbody.find("tr:not(.row-header)").remove();

                const params = { Where: `MeetingMinuteDetailId = '${recordId}'` };
                FormManager.readMeetingMinuteManagmentDetaiActionLog(
                    params,
                    function (list) {
						list = list.reverse();
                        if (!Array.isArray(list)) list = [];

                        if (list.length === 0) {
                            $tbody.append(`
                                <tr><td colspan="6" style="text-align:center;">هیچ داده ای یافت نشد</td></tr>
                            `);
                            hideLoading();
                            return resolve();
                        }

                        list.forEach(function (row, i) {
                            try {
                                const $tr = $("<tr>").css("height", "20px");

                                // شماره ردیف
                                $tr.append(`
                                    <td style="width:25px;background-color:#E0F6FE;border:1px solid #BED4DC;text-align:center">
                                        ${i + 1}
                                    </td>
                                `);

                                // شناسه (مخفی)
                                $tr.append(`<td style="display:none;">${row.Id || ""}</td>`);

                                // ثبت کننده از FullName (مستقیم از ویو)
                                const fullName = row.FullName || "-";
								const onlyName = fullName.split("(")[0].trim();
								
								$tr.append(`
								    <td class="creator-cell" style="border:1px solid #BED4DC">
								        ${onlyName}
								    </td>
								`);
                                // وضعیت تایید رد  و بازنگری
								const statusText = row.IsAcceptTitle;
								const $statusTd = $('<td style="border:1px solid #BED4DC"></td>');
								const $statusBadge = $('<div class="isaccept-badge"></div>').text(statusText);
								
								if (row.IsAccept === true || row.IsAccept === "true" || row.IsAccept === 1) {
								    $statusBadge.addClass("badge-green");
								} else if (row.IsAccept === false || row.IsAccept === "false" || row.IsAccept === 0) {
								    $statusBadge.addClass("badge-red");
								} else {
								    $statusBadge.addClass("badge-orange");
								}
								$statusTd.append($statusBadge);
								$tr.append($statusTd);

                                // تاریخ فقط روز/ماه/سال (بدون ساعت و پرانتز)
                                const dateOnly = formatMiladiToShamsiWithTime(row.CreatedDate);
								$tr.append(`<td style="border:1px solid #BED4DC">${dateOnly}</td>`);

                                // توضیحات
                                $tr.append(`<td style="border:1px solid #BED4DC">${row.Description || "-"}</td>`);

                                // اضافه کردن به جدول
                                $tbody.append($tr);

                            } catch (e) {
                                console.error("خطا در رندر ردیف:", e, row);
                            }
                        });

                        hideLoading();
                        resolve();
                    },
                    function (err) {
                        console.error("خطا در خواندن اطلاعات:", err);
                        alert(err || "خطا در دریافت اطلاعات");
                        hideLoading();
                        reject(err);
                    }
                );
            });
        }
		//==============================createControls==========================================
        function createControls(params) {
            if (params && params.Id) {
                loadMinuteManagmentDetails(params.Id).catch(() => {});
            } else {
                alert("هیچ ID دریافت نشد!");
            }
        }

        return {
            init: init
        };
    })();

    $form.init();
});

//#endregion ready.js

//#region formmanager.js
const FormManager = (() => {
    return {
        readMeetingMinuteManagmentDetaiActionLog: function (jsonParams, onSuccess, onError) {
            BS_vw_MM_MeetingMinuteManagmentDetaiActionLog.Read(
                jsonParams,
                function (data) {
                    var list = [];
                    var xmlvar = $.xmlDOM(data);
                    xmlvar.find("row").each(function () {
                        list.push({
                            Id: $(this).find("col[name='Id']").text(),
                            MeetingMinuteDetailId: $(this).find("col[name='MeetingMinuteDetailId']").text(),
                            Description: $(this).find("col[name='Description']").text(),
                            IsAccept: $(this).find("col[name='IsAccept']").text(),
                            IsAcceptTitle: $(this).find("col[name='IsAcceptTitle']").text(),
                            CreatedDate: $(this).find("col[name='CreatedDate']").text(),
							FullName: $(this).find("col[name='FullName']").text()
                        });
                    });
                    if ($.isFunction(onSuccess)) {
                        onSuccess(list);
                    }
                },
                onError
            );
        }
    };
})();

//#endregion form manager.js

//#region 

//#endregion












