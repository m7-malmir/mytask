var observer = new MutationObserver(function(mutations) {
	if ($("#ComboBoxControl2 option[value='" + res + "']").length > 0) {
		$("#ComboBoxControl2").val(res).trigger('change');
		observer.disconnect(); // دیگه نیاز نداریم، متوقفش کن
	}
});

observer.observe(document.getElementById("ComboBoxControl2"), {
	childList: true,
	subtree: true
});

/** ************************************************************ */



txtSubjectMeeting
cmbMeetingRoomId
txtMeetingDate
txtMeetingStartTime
txtMinMeetingStartTime

txtHourMeetingEndTime
txtminMeetingEndTime

cmbUserPresent
cmbUserAbsent
txtMeetingAgenda


txtTitle
cmbResponsibleForAction




function fillComboWithService($combo, service, placeholderText, singleSelect = false) {
    return new Promise(resolve => {
        service.Read({}, function (data) {
            const xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);
            const list = xmlData.find("row").map(function () {
                return {
                    id: $(this).find("col[name='ActorId']").text(),
                    text: $(this).find("col[name='fullName']").text(),
                    userId: $(this).find("col[name='UserId']").text(),
                    roleId: $(this).find("col[name='RoleId']").text()
                };
            }).get();

            $combo.empty().select2({
                data: list,
                placeholder: placeholderText || "انتخاب مورد",
                dir: "rtl",
                multiple: !singleSelect,
                closeOnSelect: singleSelect,
                scrollAfterSelect: false
            });

            // رویداد انتخاب/حذف
            $combo
                .off("select2:select").on("select2:select", e => {
                    const d = e.params.data;
                    if (singleSelect) {
                        $($combo.data("user-field")).val(d.userId);
                    } else {
                        updateHiddenFields($combo, d.userId, d.roleId, true);
                    }
                })
                .off("select2:unselect").on("select2:unselect", e => {
                    const d = e.params.data;
                    if (singleSelect) {
                        $($combo.data("user-field")).val("");
                    } else {
                        updateHiddenFields($combo, d.userId, d.roleId, false);
                    }
                });

            resolve(); // 
        }, function (err) {
            alert("Service titles read error: " + err);
            resolve(); // حتی توی خطا هم آزاد کن
        });
    });
}





















{
  "ActorIdCreator": #txtActorIdCreator,
  "MeetingStartDate": txtMeetingDate ->"2025-09-07",
  "MeetingStartTime":#txtMeetingStartTime+":"#txtMinMeetingStartTime "10:10",
  "MeetingEndTime":#txtHourMeetingEndTime+":"+#txtminMeetingEndTime "11:11",
  "SubjectMeeting": #txtSubjectMeeting,
  "MeetingAgenda":#txtMeetingAgenda ,
  "MeetingRoomId": #cmbMeetingRoomId(باید ولیو همون اتاق کی از آپشن انتخاب میکنه بگیری),
  "UserPresent": #txtPresentUserId,
  "UserAbsent": #txtAbsentUserId,
  "Items": [
    {
      "Title": "1موضوع",
      "ActionDeadLineDate": "2025-09-07",
      "ResponsibleForAction": "1,2"
    },
    {
      "Title": "موضوع2",
      "ActionDeadLineDate": "2025-09-07",
      "ResponsibleForAction": "3,4"
    },
    {
      "Title": "موضوع3",
      "ActionDeadLineDate": "2025-09-07",
      "ResponsibleForAction": "2,3"
    }
  ]
}


























// نمایش JSON با alert و کنسول
function logItems() {
    $.alert({
        title: 'آیتم‌ها',
        content: `<pre style="text-align:left;direction:ltr">${JSON.stringify(Items, null, 2)}</pre>`,
        rtl: true
    });
    console.log("Items =", JSON.stringify(Items, null, 2));
}

//******************************************************************************************************
// کد اصلی
$(function () {
    window.Items = [];

    $("#btnTitleRegister").on("click", function () {
        const txt = $("#txtTitle").val().trim();
        const responsible = $("#txtResponsibleUserId").val()?.trim() || null;
        let actionDate = $("#txtActionDeadLineDate").val()?.trim() || null;

        if (!txt) {
            $.alert({ title: '', content: 'لطفاً متن صورتجلسه را وارد کنید.', rtl: true, type: 'red' });
            return;
        }

        // اگر تاریخ شمسی باشد (فرمت 1404/06/16)
        if (actionDate && actionDate.includes('/')) {
            const [jy, jm, jd] = actionDate.split('/').map(Number);
            actionDate = shamsiToMiladiFormatted(jy, jm, jd);
        }

        const newItem = { Title: txt, ActionDeadLineDate: actionDate, ResponsibleForAction: responsible };
        Items.push(newItem);
        logItems();

        const $item = $("<div></div>").css({ display: "flex", justifyContent: "space-between" });

        const $text = $("<div></div>").text(txt);

        const $btnEdit = $("<button>ویرایش</button>").on("click", function () {
            const newText = prompt("متن جدید:", $text.text());
            if (newText && newText.trim()) {
                $text.text(newText.trim());
                newItem.Title = newText.trim();
                logItems();
            }
        });

        const $btnDelete = $("<button>حذف</button>").on("click", function () {
            if (confirm("حذف شود؟")) {
                $item.remove();
                const index = Items.indexOf(newItem);
                if (index > -1) {
                    Items.splice(index, 1);
                    logItems();
                }
            }
        });

        $item.append($text).append($btnEdit).append($btnDelete);
        $("#pnlTitles").append($item);

        $("#txtTitle").val("");
        $("#txtResponsibleUserId").val("");
        $("#txtActionDeadLineDate").val("");
    });
});












pnlManagmentDetail  -> pnlTitles


$("#cmbUserPresent")
    .data("actor-field", "#txtPresentActorId")
    .data("role-field", null);

$("#cmbUserAbsent")
    .data("actor-field", "#txtAbsentActorId")
    .data("role-field", null);

$("#cmbResponsibleForAction")
    .data("actor-field", "#txtResponsibleActorId")
    .data("role-field", null);

// پرومیس کمبوها
const combosPromise = Promise.all([
    fillComboWithService($("#cmbUserPresent"), BS_GetUserInfo, "انتخاب شخص"),
    fillComboWithService($("#cmbUserAbsent"), BS_GetUserInfo, "انتخاب غایبین"),
    fillComboWithService($("#cmbResponsibleForAction"), BS_GetUserInfo, "شخص مسئول", true)
]);



// آیکون‌ها
const ICON_DELETE = '<img src="Images/delete.png" title="حذف" class="delete" style="cursor:pointer;" />';
const ICON_EDIT   = '<img src="Images/edit.png" title="ویرایش" class="edit" style="cursor:pointer;" />';

// --------------------
// متغیرها
// --------------------
let actorLookup = {}; // از ActorId به نام بازیگر
let Items = [];

// --------------------
// دریافت همه بازیگرها
// --------------------
function loadActorLookup() {
    return new Promise((resolve) => {
        BS_GetUserInfo.Read(
            { Where: "" },
            function (data) {
                console.log("=== RAW RESPONSE FROM BS_GetUserInfo.Read ===", data);

                const actors = Array.isArray(data) ? data : (Array.isArray(data?.Items) ? data.Items : []);
                actors.forEach(actor => {
                    const id = String(actor.ActorId || actor.Id || "").trim();
                    const name = actor.FullName || actor.Name || actor.rolename || "-";
                    if (id) actorLookup[id] = name;
                });

                console.log("=== actorLookup filled ===", actorLookup);
                resolve();
            },
            function (error) {
                console.error("خطا در BS_GetUserInfo.Read:", error);
                resolve(); // ضدقفل
            }
        );
    });
}

// --------------------
// دریافت جزئیات جلسه
// --------------------
function loadMeetingDetails(meetingMinuteId) {
    return new Promise((resolve) => {
        if (!meetingMinuteId) {
            console.warn("meetingMinuteId خالی است، جزئیات بارگذاری نشد.");
            return resolve();
        }

        const readParamsDetail = {
            WHERE: "MeetingManagmentId = '" + meetingMinuteId + "'"
        };

        FormManager.readMeetingMinuteManagmentDetail(
            readParamsDetail,
            function (detailList) {
                const tbody = $("#tblMinuteManagment tbody");
                tbody.find("tr.data-row").remove();
                Items.length = 0;

                if (Array.isArray(detailList) && detailList.length) {
                    detailList.forEach((srvItem, idx) => {
                        const newItem = {
                            Id: srvItem.Id || "",
                            MeetingManagmentId: srvItem.MeetingManagmentId || "",
                            Title: srvItem.Title || "-",
                            ActionDeadLineDate: srvItem.ActionDeadLineDate || "",
                            ResponsibleForActionName:
                                actorLookup[String(srvItem.ResponsibleForAction)] || "-"
                        };
                        Items.push(newItem);
                        addRowToTable(newItem, idx + 1);
                    });
                }

                showEmptyMessage();
                logItems();
                resolve();
            },
            function (error) {
                console.error("خطا در جزئیات:", error);
                resolve(); // ضدقفل
            }
        );
    });
}

// --------------------
// افزودن سطر به جدول
// --------------------
function addRowToTable(item, index) {
    const $template = $("#tblMinuteManagment tbody tr.row-template").clone();
    $template.removeClass("row-template").addClass("data-row")
             .attr("data-row", index).show();

    $template.find("td").eq(1).text(index);
    $template.find("td").eq(2).html(ICON_DELETE);
    $template.find("td").eq(3).html(ICON_EDIT);
    $template.find("td").eq(4).text(item.Title);
    $template.find("td").eq(5).text(item.ResponsibleForActionName || "-");
    $template.find("td").eq(6).text(item.ActionDeadLineDate);

    $("#tblMinuteManagment tbody").append($template);
}

// --------------------
// اجرای همزمان همه
// --------------------
let detailsPromise = loadActorLookup()
    .then(() => loadMeetingDetails(meetingMinuteId));

Promise.all([
    combosPromise.catch(e => console.error("combosPromise error:", e)),
    meetingPromise.catch(e => console.error("meetingPromise error:", e)),
    detailsPromise.catch(e => console.error("detailsPromise error:", e))
])
.then(() => console.log(" همه Promiseها کامل شدند"))
.catch(err => console.error(" خطا در Promise.all:", err))
.finally(() => {
    console.log(" اجرای finally => hideLoading()");
    hideLoading();
});































// دریافت همه بازیگرها
function loadActorLookup() {
    return new Promise((resolve) => {
        alert(" شروع loadActorLookup ...");

        BS_GetUserInfo.Read(
            { Where: "" },
            function (data) {
                alert(" خروجی خام BS_GetUserInfo.Read:\n" + JSON.stringify(data, null, 2));

                const actors = Array.isArray(data) ? data : (Array.isArray(data?.Items) ? data.Items : []);
                actors.forEach(actor => {
                    const id = String(actor.ActorId || actor.Id || "").trim();
                    const name = actor.FullName || actor.Name || actor.rolename || "-";
                    if (id) actorLookup[id] = name;
                });

                alert(" actorLookup پر شد:\n" + JSON.stringify(actorLookup, null, 2));
                resolve();
            },
            function (error) {
                alert(" خطا در BS_GetUserInfo.Read:\n" + (error?.message || JSON.stringify(error)));
                resolve();
            }
        );
    });
}

// دریافت جزئیات جلسه
function loadMeetingDetails(meetingMinuteId) {
    return new Promise((resolve) => {
        if (!meetingMinuteId) {
            alert(" meetingMinuteId خالی است، جزئیات جلسه اجرا نمیشه.");
            return resolve();
        }

        alert(" شروع loadMeetingDetails با ID: " + meetingMinuteId);

        const readParamsDetail = {
            WHERE: "MeetingManagmentId = '" + meetingMinuteId + "'"
        };

        FormManager.readMeetingMinuteManagmentDetail(
            readParamsDetail,
            function (detailList) {
                alert(" خروجی جزئیات جلسه:\n" + JSON.stringify(detailList, null, 2));

                const tbody = $("#tblMinuteManagment tbody");
                tbody.find("tr.data-row").remove();
                Items.length = 0;

                if (Array.isArray(detailList) && detailList.length) {
                    detailList.forEach((srvItem, idx) => {
                        const responsibleName = actorLookup[String(srvItem.ResponsibleForAction)] || "-";
                        alert("↪ ردیف " + (idx+1) + ": ResponsibleForAction=" + srvItem.ResponsibleForAction + " → " + responsibleName);

                        const newItem = {
                            Id: srvItem.Id || "",
                            MeetingManagmentId: srvItem.MeetingManagmentId || "",
                            Title: srvItem.Title || "-",
                            ActionDeadLineDate: srvItem.ActionDeadLineDate || "",
                            ResponsibleForActionName: responsibleName
                        };
                        Items.push(newItem);
                        addRowToTable(newItem, idx + 1);
                    });
                }

                resolve();
            },
            function (error) {
                alert(" خطا در جزئیات جلسه:\n" + (error?.erroMessage || error?.message || "نامشخص"));
                resolve();
            }
        );
    });
}


const ICON_DELETE = '<img src="Images/delete.png" title="حذف" class="delete" style="cursor:pointer;" />';
const ICON_EDIT   = '<img src="Images/edit.png" title="ویرایش" class="edit" style="cursor:pointer;" />';

let detailsPromise = Promise.resolve();
let actorLookup = {}; // ActorId → Name

UserService.GetCurrentActor({}, function (response) {
    const actors = Array.isArray(response) ? response :
        Array.isArray(response.Items) ? response.Items : [];

    actors.forEach(actor => {
        actorLookup[String(actor.Id)] = actor.Name;
    });

    console.log(" actorLookup after GetCurrentActor:", actorLookup);

    if (meetingMinuteId) {
        detailsPromise = new Promise((resolve) => {
            const readParamsDetail = {
                WHERE: "MeetingManagmentId = '" + meetingMinuteId + "'"
            };

            FormManager.readMeetingMinuteManagmentDetail(
                readParamsDetail,
                function (detailList) {
                    try {
                        console.log(" detailList from readMeetingMinuteManagmentDetail:", detailList);

                        const tbody = $("#tblMinuteManagment tbody");
                        tbody.find("tr.data-row").remove();
                        Items.length = 0;

                        if (Array.isArray(detailList) && detailList.length) {
                            detailList.forEach((srvItem, idx) => {
                                const responsibleId = String(srvItem.ResponsibleForAction || "").trim();
                                console.log(`➡ ردیف ${idx + 1} - ID مسئول:`, responsibleId);

                                if (responsibleId && !actorLookup[responsibleId]) {
                                    console.log(` بازیگر ${responsibleId} در actorLookup نیست، درخواست به BS_GetUserInfo.Read ارسال شد`);
                                    BS_GetUserInfo.Read(
                                        { Where: "ActorId = '" + responsibleId + "'" },
                                        function (data) {
                                            console.log(` نتیجه BS_GetUserInfo.Read برای ${responsibleId}:`, data);
                                            const info = Array.isArray(data) ? data[0] : data?.Items?.[0] || {};
                                            actorLookup[responsibleId] = info.FullName || info.Name || "-";
                                            console.log(` اسم ${responsibleId} اضافه شد →`, actorLookup[responsibleId]);

                                            addRowToTable({
                                                ...srvItem,
                                                ResponsibleForActionName: actorLookup[responsibleId]
                                            }, idx + 1);
                                        },
                                        function (err) {
                                            console.error(` خطا در BS_GetUserInfo.Read برای ${responsibleId}:`, err);
                                            actorLookup[responsibleId] = "-";
                                            addRowToTable({
                                                ...srvItem,
                                                ResponsibleForActionName: "-"
                                            }, idx + 1);
                                        }
                                    );
                                } else {
                                    const newItem = {
                                        Id: srvItem.Id || "",
                                        MeetingManagmentId: srvItem.MeetingManagmentId || "",
                                        Title: srvItem.Title || "-",
                                        ActionDeadLineDate: srvItem.ActionDeadLineDate || "",
                                        ResponsibleForActionName: actorLookup[responsibleId] || "-"
                                    };
                                    console.log(` بازیگر ${responsibleId} از actorLookup →`, newItem.ResponsibleForActionName);

                                    Items.push(newItem);
                                    addRowToTable(newItem, idx + 1);
                                }
                            });
                        }

                        showEmptyMessage();
                        logItems();
                    } finally {
                        resolve();
                    }
                },
                function (error) {
                    console.error(" خطا در جزئیات:", error);
                    resolve();
                }
            );
        });
    }
});

function addRowToTable(item, index) {
    console.log(` افزودن به جدول ردیف ${index}:`, item);
    const $template = $("#tblMinuteManagment tbody tr.row-template").clone();
    $template.removeClass("row-template")
        .addClass("data-row")
        .attr("data-row", index)
        .show();

    $template.find("td").eq(1).text(Items.length);
    $template.find("td").eq(2).html(ICON_DELETE);
    $template.find("td").eq(3).html(ICON_EDIT);
    $template.find("td").eq(4).text(item.Title);
    $template.find("td").eq(5).text(item.ResponsibleForActionName || "-");
    $template.find("td").eq(6).text(item.ActionDeadLineDate);

    $("#tblMinuteManagment tbody").append($template);
}
