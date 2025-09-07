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