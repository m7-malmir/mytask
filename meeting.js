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

function addAttachmentToFieldset(file) {
    const $container = $("#GroupBoxControl1");

    const $item = $(`
        <div style="
            display:inline-flex; 
            flex-direction:column; 
            align-items:center; 
            width:60px; 
            height:80px; 
            margin:3px; 
            padding:2px;
            border:1px solid #ccc; 
            border-radius:4px; 
            background:#fff;
            position:relative;
            font-family:Tahoma;
            font-size:8pt;
        ">
            <button class="remove-btn" title="حذف" 
                style="position:absolute; top:1px; right:1px; background:#f33; color:#fff; border:none; border-radius:50%; cursor:pointer; width:14px; height:14px; line-height:12px; font-size:9px; padding:0;">×</button>
            <img src="${getFileIcon(file.FileType, file.FileContent)}"
                 alt="${file.FileName}"
                 title="${file.FileName}"
                 style="width:30px; height:30px; object-fit:contain; margin-top:12px;">
            <span style="display:block; text-align:center; margin-top:3px; width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                ${file.FileName}
            </span>
        </div>
    `);

    $item.find(".remove-btn").on("click", function () {
        if (confirm("آیا از حذف این فایل مطمئن هستید؟")) {
            console.log("Deleting file with ID:", file.FileId);
            $item.remove();
            // API حذف سمت سرور اینجا صدا زده بشه
        }
    });

    $container.append($item);
}

//  اجرای لیست‌خوانی با سایز جدید آیکن‌ها
const readParams = {
    WHERE: "SystemId = 3 AND DocumentId = '" + $("#lblMeetingMinuteId").text().trim() + "'"
};

FormManager.readAttachedFile(
    readParams,
    function (list) {
        if (list && list.length) {
            list.forEach(file => addAttachmentToFieldset(file));
        } else {
            console.log("هیچ فایل پیوستی یافت نشد.");
        }
    },
    function (error) {
        alert('خطا در خواندن فایل‌ها: ' + (error?.erroMessage || error?.message || 'نامشخص'));
    }
);



























 @Id = 20,
 @jsonArray ={
  "ActorIdCreator": 101,
  "MeetingStartDate": "1404/06/16",
  "MeetingStartTime": "15:10",
  "MeetingEndTime": "18:11",
  "SubjectMeeting": "موضوع جلسه",
  "MeetingAgenda": "دستور جلسه",
  "MeetingRoomId": 3,
  "UserPresent": "1,2,3,4",
  "UserAbsent": "5,6,7,8",
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
    },
    {
      "Title": "موضوع3",
      "ActionDeadLineDate": "2025-09-07",
      "ResponsibleForAction": "2,3"
    }
  ]
}















$("#btnRegister").on("click", function (e) {
    e.preventDefault();

    const checkRequired = (selector, msg, focusSelect2 = false) => {
        let el = $(selector), val = el.val();
        if (!val || (typeof val === "string" && !val.trim())) {
            alert(msg);
            focusSelect2 ? el.select2('open') : el.focus();
            throw new Error("StopValidation");
        }
    };

    const checkNumberRange = (selector, min, max, msg) => {
        let num = parseInt($(selector).val(), 10);
        if (isNaN(num) || num < min || num > max) {
            alert(msg);
            $(selector).focus();
            throw new Error("StopValidation");
        }
        return num;
    };

    try {
        /** 1- اعتبارسنجی **/
        checkRequired("#txtSubjectMeeting", "موضوع جلسه را وارد کنید.");
        checkRequired("#cmbMeetingRoomId", "اتاق جلسه را انتخاب کنید.");
        checkRequired("#txtMeetingDate", "تاریخ جلسه را انتخاب کنید.");



		// اگر تقویمت شمسیه، این تبدیل رو انجام بده
		let selectedShamsi = $("#txtMeetingDate").val(); // مثلاً 1404/07/01
		if (selectedShamsi) {
		    let [jy, jm, jd] = selectedShamsi.split("/").map(Number);
		    let [gy, gm, gd] = shamsi_be_miladi(jy, jm, jd); // خروجی اعدادی مثل 2025, 9, 22
		    let gdateStr = `${String(gm).padStart(2, '0')}/${String(gd).padStart(2, '0')}/${gy}`;
		    $("#txtMeetingDate").data("gdate", gdateStr).attr("gdate", gdateStr);
		}

		let gdate = $("#txtMeetingDate").data("gdate") || $("#txtMeetingDate").attr("gdate") || "";
		if (!gdate.trim()) {
		    alert("تاریخ جلسه را انتخاب کنید.");
		    $("#txtMeetingDate").focus();
		    throw new Error("StopValidation");
		}
	
		let [m, d, y] = gdate.split('/').map(Number);
		let meetingDateObj = new Date(y, m - 1, d);
		
		let todayObj = new Date();
		todayObj.setHours(0, 0, 0, 0);
		meetingDateObj.setHours(0, 0, 0, 0);
		
		if (meetingDateObj.getTime() > todayObj.getTime()) {
		    alert("تاریخ انتخابی جلسه نمی‌تواند بزرگتر از تاریخ روز جاری باشد.");
		    $("#txtMeetingDate").focus();
		    throw new Error("StopValidation");
		}

        let sHour = checkNumberRange("#txtMeetingStartTime", 1, 23, "ساعت شروع باید بین 1 تا 23 باشد.");
        let sMin = checkNumberRange("#txtMinMeetingStartTime", 0, 59, "دقیقه شروع باید بین 0 تا 59 باشد.");
        let eHour = checkNumberRange("#txtHourMeetingEndTime", 1, 23, "ساعت پایان باید بین 1 تا 23 باشد.");
        let eMin = checkNumberRange("#txtminMeetingEndTime", 0, 59, "دقیقه پایان باید بین 0 تا 59 باشد.");

        if (eHour < sHour || (eHour === sHour && eMin <= sMin)) {
            alert("زمان پایان نمی‌تواند قبل یا مساوی زمان شروع باشد.");
            $("#txtHourMeetingEndTime").focus();
            throw new Error("StopValidation");
        }

        checkRequired("#cmbUserPresent", "حداقل یک نفر شرکت‌کننده حاضر انتخاب کنید.", true);
        checkRequired("#txtMeetingAgenda", "دستور جلسه را وارد کنید.");

        if ($("#tblMinuteManagment tr.data-row").length === 0) {
            alert("حداقل یک مصوبه باید وارد شود.");
            throw new Error("StopValidation");
        }

        // چک کردن حاضرین و غایبین
        const parseIds = sel => ($(sel).val() || "")
            .split(",").map(id => id.trim()).filter(Boolean);
        const dup = parseIds("#txtPresentActorId")
            .filter(id => parseIds("#txtAbsentActorId").includes(id));
        if (dup.length) {
            alert("یک شخص نمی تواند در هر دو لیست حاضرین و غایبین حضور داشته باشد!");
            throw new Error("StopValidation");
        }

        /** 2- آماده‌سازی Items **/
        let items;
		let meetingMinuteId = Number($("#lblMeetingMinuteId").text().trim());
		let isEditMode = Number.isInteger(meetingMinuteId) && meetingMinuteId > 0;
        if (isEditMode) {
         

			items = $("#tblMinuteManagment tr.data-row").map(function () {
			    let tds = $(this).find("td");
			    let rawActor = (tds.eq(5).text() || "").trim();
			    rawActor = rawActor && rawActor !== "-" ? rawActor : null;
			    return {
			        Title: (tds.eq(2).text() || "").trim() || null,
			        ResponsibleForAction: rawActor,
			        ActionDeadLineDate: tds.eq(4).attr("data-gdate") || null
			    };
			}).get();

        } else {
            // حالت ثبت جدید → از MeetingMinutesData.Items
            items = MeetingMinutesData.Items.map(it => ({
                Title: it.Title,
                ActionDeadLineDate: it.ActionDeadLineDate && it.ActionDeadLineDate.trim() !== ""
                    ? it.ActionDeadLineDate
                    : null,
                ResponsibleForAction: (it.ResponsibleForAction || "").trim() !== ""
			        ? it.ResponsibleForAction.trim()
			        : null
            }));
        }

        /** 3- ساخت JSON **/
        let jsonArray = {
            ActorIdCreator: parseInt($("#txtActorIdCreator").val(), 10),
            MeetingStartDate: $("#txtMeetingDate").data("gdate"),
            MeetingStartTime: `${String(sHour).padStart(2, '0')}:${String(sMin).padStart(2, '0')}`,
            MeetingEndTime: `${String(eHour).padStart(2, '0')}:${String(eMin).padStart(2, '0')}`,
            SubjectMeeting: $("#txtSubjectMeeting").val().trim(),
            MeetingAgenda: $("#txtMeetingAgenda").val().trim(),
            MeetingRoomId: Number($("#cmbMeetingRoomId").val()),
            UserPresent: $("#txtPresentActorId").val()?.trim() || "",
            UserAbsent: $("#txtAbsentActorId").val()?.trim() || "",
            Items: items,
            Files: $("#gbxDocuments > div").map(function () {
                return $(this).data("file-id");
            }).get()
        };

        /** 4- ارسال **/
        var sp_params = { jsonArray: JSON.stringify(jsonArray) };
		alert(JSON.stringify(sp_params));
        FormManager.insertMeetingMinuteManagment(
            sp_params,
            function (data) {
                if (data["Success"] == 0) {
                    $.alert("SP Error: " + data["Message"], "خطا", "rtl");
                    e.preventDefault();
                    return;
                }
                alert(JSON.stringify(data));
                // WorkflowService.RunWorkflow(...) در صورت نیاز
            },
            function (err) { alert(err.details); }
        );
		
    } catch (err) {
        if (err.message !== "StopValidation") throw err;
    }
});
