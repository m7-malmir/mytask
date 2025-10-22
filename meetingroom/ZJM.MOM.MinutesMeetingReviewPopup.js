//#region ready.js
let $form;

$(function () {
    $form = (function () {
		//=========================init==================================
		async function init() {
		    const params = window.dialogArguments || {};
		    buildDialog();
		
		    showLoading("در حال بارگذاری اطلاعات...");
		
		    try {
		        // اول کمبو بساز و بعد داده ها رو Load کن
		        await fillComboWithAllowedActors(params.allUsers || []);
		        await loadData(
		            params?.editItem?.MeetingMinuteDetailId,
		            params?.editItem?.MeetingManagmentId,
		            params.allUsers || []
		        );
		    } catch (err) {
		        console.error("خطا در مقداردهی پاپ‌آپ:", err);
		        alert("خطایی در بارگذاری داده رخ داد. لطفاً مجدداً تلاش کنید.");
		    } finally {
		        hideLoading();
		    }
		}
		//=========================buildDialog============================
        function buildDialog() {
            changeDialogTitle("بازنگری مصوبه جلسه");
            $('input[role="TextBox"], input[role="DatePicker"]').attr('autocomplete', 'off');
        }
		//=========================loadData===============================
        // خواندن داده از سرویس و مقداردهی فرم
		function loadData(MeetingMinuteDetailId, allUsersFromParent) {
		    return new Promise((resolve, reject) => {
		        if (!MeetingMinuteDetailId) {
		            return resolve();
		        }
		        const jsonParams = { Where: "Id = " + MeetingMinuteDetailId };
		        FormManager.readMeetingMinuteManagmentDetail(jsonParams, function (list) {
		            try {
		                if (!list || list.length === 0) {
		                    return resolve();
		                }
		
		                const item = list[0];
		                $("#lblIdeaRequestId").text(MeetingMinuteDetailId);
		                $("#txtTitle").val(item.Title || "");
		
		                const rawJDate = (item.ActionDeadLineJDate || "").trim();
		                const rawGDate = (item.ActionDeadLineDate || "").trim();
		                const finalDate = rawJDate || (rawGDate ? formatMiladiToShamsi(rawGDate) : "");
		                $("#txtActionDeadLineDate").val(finalDate);
		
		                const actorIdsService = String(item.ResponsibleForAction || "")
		                    .split(",").map(id => id.trim()).filter(Boolean);
		                const actorIdsParent = Array.isArray(allUsersFromParent)
		                    ? allUsersFromParent.map(String)
		                    : String(allUsersFromParent || "").split(",").map(x => x.trim()).filter(Boolean);
		
		                const finalActorIds = [...new Set([...actorIdsService, ...actorIdsParent])];
		
		                $("#txtResponsibleActorId").val(finalActorIds.join(","));
		                $("#cmbResponsibleForAction").val(finalActorIds).trigger("change.select2");
		                resolve();
		
		            } catch (e) {
		                reject(e);
		            }
		        }, reject);
		    });
		}
        return { init };
    })();

    $form.init();
});

//#endregion ready.js

//#region formmanager.js
var FormManager = {
//******************************************************************************************************
    meetingMinuteManagmentDetailReview: function (jsonParams, onSuccess, onError) {
        SP_MM_MeetingMinuteManagmentDetailReview.Execute(jsonParams,
            function (data) {

				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(data, "text/xml");

				const cols = xmlDoc.getElementsByTagName("col");
				
				const result = {};
				for (let i = 0; i < cols.length; i++) {
				    const name = cols[i].getAttribute("name");
				    const value = cols[i].textContent;
				    result[name] = value;
				}
                if ($.isFunction(onSuccess)) {
                    onSuccess(result);
                }
            },
            function (error) {
                var methodName = "meetingMinuteManagmentDetailReview";

                if ($.isFunction(onError)) {
                    var erroMessage = "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
                    console.error("Error:", erroMessage);
                    console.error("Details:", error);

                    onError({
                        message: erroMessage,
                        details: error
                    });
                } else {
                    console.error(erroMessage + " (no onError callback provided):", error);
                }
            }
        );
    },
//******************************************************************************************************	
	readMeetingMinuteManagmentDetail: function(jsonParams, onSuccess, onError)
	{
	  BS_MM_MeetingMinuteManagmentDetail.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						Id: $(this).find("col[name='Id']").text(),
		                MeetingManagmentId: $(this).find("col[name='MeetingManagmentId']").text(),
						ResponsibleForAction: $(this).find("col[name='ResponsibleForAction']").text(),
						Title: $(this).find("col[name='Title']").text(),
						ActionDeadLineDate: $(this).find("col[name='ActionDeadLineDate']").text()
	                  });
	               }
	           );
	           if($.isFunction(onSuccess))
	           {
	               onSuccess(list);
	           
	           }
	       }, onError
	   );
	},
};


//#endregion formmanager.js

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
//************************************************showLoading*********************************************
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
 // فیلتر کردن کمبو با ActorIdهای والد
 function fillComboWithAllowedActors(allUsers) {
     return new Promise((resolve, reject) => {
         let userIds = [];

         if (typeof allUsers === "string") {
             userIds = allUsers.split(",").map(id => id.trim()).filter(Boolean);
         } else if (Array.isArray(allUsers)) {
             userIds = allUsers.map(id => String(id).trim()).filter(Boolean);
         }

         if (userIds.length === 0) {
             $("#cmbResponsibleForAction").empty().select2({
                 data: [],
                 placeholder: "هیچ فردی حضور ندارد",
                 dir: "rtl",
                 multiple: true
             });
             return resolve();
         }

         BS_GetUserInfo.Read({}, function (data) {
             try {
                 const xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);
                 const allRows = xmlData.find("row");
                 const fullList = allRows.map(function () {
                     const actorId = ($(this).find("col[name='ActorId']").text() || "").trim();
                     const fullName = ($(this).find("col[name='fullName']").text() || "").trim();
                     const roleName = ($(this).find("col[name='RoleName']").text() || "").trim();
                     return {
                         id: actorId,
                         text: roleName ? `${fullName} - ${roleName}` : fullName
                     };
                 }).get();

                 const filtered = fullList.filter(item => userIds.includes(item.id));

                 $("#cmbResponsibleForAction").empty().select2({
                     data: filtered,
                     placeholder: filtered.length === 0 ? "کاربری یافت نشد" : "انتخاب کنید",
                     dir: "rtl",
                     multiple: true,
                     dropdownCssClass: "combo-scroll"
                 });

                 // سینک کردن فیلد هیدن برای اکتور ایدی
                 $("#cmbResponsibleForAction")
                     .off("select2:select select2:unselect")
                     .on("select2:select select2:unselect", function () {
                         const actorIds = ($("#cmbResponsibleForAction").val() || []).map(id => id.trim());
                         $("#txtResponsibleActorId").val(actorIds.join(","));
                     });

                 resolve();
             } catch (e) {
                 reject(e);
             }
         }, reject);
     });
 }
//******************************************************************************************************
// تایپ فقط 500 کاراکتر مجاز است
$(function() {
    const maxChars = 500;
    const allowedRegex = /^[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF0-9\.\،\-\_\(\)\s]+$/; // فارسی و اعداد و علائم مجاز
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
	
function miladiToShamsiFormatted(gy, gm, gd) {
    const [jy, jm, jd] = miladi_be_shamsi(gy, gm, gd);
    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}

//******************************************************************************************************	

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
// تاریخ شمسی به میلادی فرمتی
function shamsiToMiladiFormatted(jy, jm, jd) {
    const [gy, gm, gd] = shamsi_be_miladi(jy, jm, jd);
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}
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
//******************************************************************************************************
function shamsi_be_miladi(jy, jm, jd) {
  var sal_a, gy, gm, gd, days;
  jy += 1595;
  days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy = 400 * ~~(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * ~~(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  gd = days + 1;
  sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return [gy,gm,gd];
}
//#endregion Common.js

//#region btnMinuteManagmentRegister.js
$("#btnMinuteManagmentRegister").on("click", function () {
    const $dateInput = $("#txtActionDeadLineDate");
    const rawVal = $dateInput.val()?.trim() || "";
    const rawGDate = ($dateInput.attr("data-gdate") ||
                      $dateInput.attr("gdate") || "").trim();

    let finalGDate = null;

    // اگر ورودی واقعی نیست یا تاریخ پیش فرض دیت پیکر هست
    if (!rawVal ||
        rawVal === "0000/00/00" ||
        rawVal === "1278/10/11" ||
        rawGDate === "1278/10/11" ||
        rawGDate === "NaN/NaN/NaN") {
        finalGDate = null; // Explicit null برای SP
    }
    // اگر پلاگین تاریخ میلادی داده
    else if (rawGDate && rawGDate.includes("/")) {
        const [gy, gm, gd] = rawGDate.split("/").map(Number);
        finalGDate = `${gy}/${String(gm).padStart(2, "0")}/${String(gd).padStart(2, "0")}`;
    }
    // اگر پلاگین مقدار نداده ولی val (شمسی) داده شده
    else if (rawVal.includes("/")) {
        const [jy, jm, jd] = rawVal.split("/").map(Number);
        finalGDate = shamsiToMiladiFormatted(jy, jm, jd).replace(/-/g, "/");
    }
    // کنترل تاریخ گذشته 
    if (finalGDate) {
        const [gy, gm, gd] = finalGDate.split("/").map(Number);
        const selectedDate = new Date(gy, gm - 1, gd);
        const today = new Date();
        const todayTrimmed = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (selectedDate < todayTrimmed) {
            $.alert("تاریخ مهلت نمی‌تواند قبل از امروز باشد", "", "rtl");
            return; // جلوی ارسال را بگیر
        }
    }
    // ارسال کامل با پارامتر اجباری
    const reviewData = {
        MeetingManagmentDetailId: $("#lblIdeaRequestId").text().trim(),
        Title: $("#txtTitle").val().trim(),
        ResponsibleForAction: $("#txtResponsibleActorId").val().trim(),
        ActionDeadLineDate: finalGDate // همیشه تعریف می شود (ممکن است null باشد)
    };

    FormManager.meetingMinuteManagmentDetailReview(
        reviewData,
        function (status, response) {
            $.alert("بازنگری با موفقیت ثبت شد", "", "rtl", function () {
                closeWindow({ OK: true, Result: null });
            });
        },
        function (error) {
            console.error("خطا در ثبت بازنگری:", error);
            $.alert("خطا در ثبت بازنگری: " + (error.message || "نامشخص"), "", "rtl");
        }
    );
});

//#endregion btnMinuteManagmentRegister.js



