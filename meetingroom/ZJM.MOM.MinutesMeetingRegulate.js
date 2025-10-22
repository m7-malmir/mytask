//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var html_;
var ProcessStatus;
var MeetingMinutesData = { Items: [] };
var actorLookup = {};

$(function(){
    $form = (function(){
        var pk, inEditMode = false;
		var lastModalResult = null;
		var meetingMinuteId = null;  
        function init(){
            build();
            bindEvents();
            createControls();
        }
		// ======================== Build =========================
        function build(){
            $("body").css({overflow: "hidden"}).attr({scroll: "no"});
            $("#frmLoanRequest").css({
                top: "0", left: "0",
                width: $(document).width() + "px",
                height: $(document).height() + "px"
            });
            changeDialogTitle("تدوین صورتجلسه");
        }
		// ====================== Bind Events =====================
        function bindEvents(){
			
            window.handleNewMinuteItem = handleNewMinuteItem;
            $("#momMeetingMinutes_Delete").off("click").on("click", function() {
                const selectedId = $("input[name='selectedRowId']:checked").val();
                if (!selectedId) return $.alert("لطفاً یک ردیف را انتخاب کنید.", "", "rtl");
				$.confirm("آیا از حذف این مصوبه اطمینان دارید؟", "حذف", "rtl", function (res) {
				    if (res !== "OK") return;
				
				    deleteMinuteItem(selectedId);
				});
            });

            $("#gbxDocuments").on("click", ".remove-btn", function(){
                const fileId = $(this).closest("div").data("file-id");
                if (fileId) removeAttachment(fileId, $(this).closest("div"));
            });
        }
		// ==================== createControls ====================
		function createControls(){
		    const params = window.dialogArguments || window.arguments || {};
		    const meetingMinuteId = params.MeetingMinuteId || null;
		    $("#lblMeetingMinuteId").text(meetingMinuteId);
		
		    showLoading();
		    UserService.GetCurrentActor(true, function (data) {
		        const xmlActor = $.xmlDOM(data);
		        currentActorId = xmlActor.find('actor').attr('pk');
		
		        BS_GetUserInfo.Read({ Where: "ActorId = " + currentActorId }, function (data) {
		            if ($.trim(data) !== "") {
		                const dataXml = $.xmlDOM(data);
		                $("#txtFullName").val(dataXml.find("row:first > col[name='fullName']").text())
		                    .prop('disabled', true);
		                const actorId = dataXml.find("col[name='ActorId']").text();
		                $("#txtActorIdCreator").val(actorId).prop('disabled', true);
		                $("#txtPresentActorId").val(actorId).prop('disabled', true);
		            }
		
		            const $presentCombo = $("#cmbUserPresent").data("actor-field", "#txtPresentActorId");
		            const $absentCombo = $("#cmbUserAbsent").data("actor-field", "#txtAbsentActorId");
		
		            Promise.all([
		                fillComboWithService($("#cmbUserPresent"), BS_GetUserInfo, "انتخاب شخص"),
		                fillComboWithService($("#cmbUserAbsent"), BS_GetUserInfo, "انتخاب غایبین"),
		                loadMeetingRoomsCombo()
		            ]).then(() => {
		                let actorLookup = {};
		                UserService.GetCurrentActor({}, function (resp) {
		                    const actors = Array.isArray(resp) ? resp :
		                        Array.isArray(resp.Items) ? resp.Items : [];
		                    actors.forEach(a => actorLookup[String(a.Id)] = a.Name);
		
		                    //  دیتا جلسه بیاد و مقدار اتاق ست میشود
		                    Promise.all([
		                        loadMeetingData(meetingMinuteId),
		                        loadMeetingDetails(meetingMinuteId, actorLookup)
		                    ]).then(() => {
		                        setComboSelectionFromHidden($("#cmbUserPresent"));
		                        setComboSelectionFromHidden($("#cmbUserAbsent"));
		                        return loadOrRefreshAttachments(meetingMinuteId, { refresh: false });
		                    }).finally(() => {
		                        hideLoading();
		                    });
		                });
		            });
		        });
		    });
		}

		// گرفتن پارامز برای افزودن UI فایل
		window.addAttachmentToFieldset = addAttachmentToFieldset;
		window.removeAttachment = removeAttachment;
		window.loadOrRefreshAttachments = loadOrRefreshAttachments;

        return { init, loadOrRefreshAttachments };
    })();
	
    $form.init();
});
//#endregion EDN ready.js 

//#region common.js
//******************************************************************************************************
function ErrorMessage(message, data) {
  $.alert(message);
  console.log("Data: " + list);
  myHideLoading();
}
//******************************************************************************************************
function handleError(err, methodName) {
  console.error("Error On " + methodName, err); // چاپ خطا در کنسول
  alert("Error On " + methodName + ", " + err);
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

  const hasError =
    hasErrorNode && hasErrorNode.textContent.trim().toLowerCase() === "true";
  const errorMessage = errorMessageNode
    ? errorMessageNode.textContent.trim()
    : "Unknown error";

  if (hasError) {
    console.error("خطا در اجرای فرآیند:", errorMessage);
    alert("خطا در اجرای فرآیند: " + errorMessage);
  } else {
    $.alert("درخواست شما با موفقیت ارسال شد", "", "rtl", function () {
      hideLoading();
      closeWindow({ OK: true, Result: null });
      myHideLoading();
    });
  }
}
//******************************************************************************************************
function changeDialogTitle(title, onSuccess, onError) {
  try {
    var $titleSpan = window.parent
      .$(window.frameElement) // this iframe
      .closest(".ui-dialog") // find the dialog box
      .find(".ui-dialog-title"); // find the title span

    if ($titleSpan.length > 0) {
      $titleSpan.text(title);

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } else {
      if (typeof onError === "function") {
        onError("Dialog title not found");
      } else {
        console.warn("Dialog title not found");
      }
    }
  } catch (e) {
    if (typeof onError === "function") {
      onError(e);
    } else {
      console.error("Cannot reach parent document", e);
    }
  }
}
//******************************************************************************************************
function showLoading() {
  let $box = $("#loadingBoxTweaked");
  if (!$box.length) {
    $box = $(`
            <div id="loadingBoxTweaked"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.80);display:flex;align-items:center;justify-content:center;z-index:999999;">
                <div class="spinner"></div>
            </div>
        `);

    // spinner css فقط یکبار اضافه شود
    if (!$("#loadingSpinnerStyle").length) {
      $('<style id="loadingSpinnerStyle">')
        .html(
          `
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
                `
        )
        .appendTo("head");
    }
    $("body").append($box);
  } else {
    $box.show();
  }
}
//******************************************************************************************************
function hideLoading() {
  $("#loadingBoxTweaked").fadeOut(180, function () {
    $(this).remove();
  });
}
//******************************************************************************************************
// تابع برای فرستان اکتور ایدی ها
function updateHiddenFields($combo, actorId, roleId, isAdd) {
  const actorField = $combo.data("actor-field");
  const roleField = $combo.data("role-field");

  // مدیریت ActorId
  let actorIds = $(actorField).val().split(",").filter(Boolean);
  if (isAdd) {
    if (!actorIds.includes(actorId)) actorIds.push(actorId);
  } else {
    actorIds = actorIds.filter((id) => id !== actorId);
  }
  $(actorField).val(actorIds.join(","));

  // مدیریت RoleId (در صورت وجود)
  if (roleField) {
    let roleIds = $(roleField).val().split(",").filter(Boolean);
    if (isAdd) {
      if (!roleIds.includes(roleId)) roleIds.push(roleId);
    } else {
      roleIds = roleIds.filter((id) => id !== roleId);
    }
    $(roleField).val(roleIds.join(","));
  }
}

//*******************************************************************************************************
// تابع پر کردن کمبو بر اساس ActorId همان select2
function fillComboWithService($combo,service,placeholderText,singleSelect = false) {
	  return new Promise((resolve) => {
	    service.Read(
	      {},
	      function (data) {
	        const xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);
	        const list = xmlData
	          .find("row")
	          .map(function () {
	            const fullName = $(this).find("col[name='fullName']").text();
	            const roleName = $(this).find("col[name='RoleName']").text(); // اسم ستون سمت کاربر
	            return {
	              id: $(this).find("col[name='ActorId']").text(),
	              text: roleName ? `${fullName} - ${roleName}` : fullName,
	              actorId: $(this).find("col[name='ActorId']").text(),
	              roleId: $(this).find("col[name='RoleId']").text(),
	            };
	          })
	          .get();
	
	        $combo.empty().select2({
	          data: list,
	          placeholder: placeholderText || "انتخاب مورد",
	          dir: "rtl",
	          multiple: !singleSelect,
	          closeOnSelect: singleSelect,
	          scrollAfterSelect: false,
	        });
	
	        // رویداد انتخاب/حذف
	        $combo
	          .off("select2:select")
	          .on("select2:select", (e) => {
	            const d = e.params.data;
	            if (singleSelect) {
	              $($combo.data("actor-field")).val(d.actorId);
	            } else {
	              updateHiddenFields($combo, d.actorId, d.roleId, true);
	            }
	          })
	          .off("select2:unselect")
	          .on("select2:unselect", (e) => {
	            const d = e.params.data;
	            if (singleSelect) {
	              $($combo.data("actor-field")).val("");
	            } else {
	              updateHiddenFields($combo, d.actorId, d.roleId, false);
	            }
	          });
	        resolve();
	      },
	      function (err) {
	        alert("Service titles read error: " + err);
	        resolve();
	      }
	    );
	  });
}
//*******************************************************************************************************

//تابع جدید برای پیدا کردن افراد حاضر و غایب وقتی ئیتا لود میشود
function setComboSelectionFromHidden($combo) {
  const actorField = $combo.data("actor-field");
  if (!actorField) return;

  // 1 - گرفتن ActorIdها از hidden
  const actorIds = $(actorField).val().split(",").filter(Boolean);

  if (actorIds.length === 0) return;

  // 2 - انتخاب در select2
  $combo.val(actorIds).trigger("change");
}

//*******************************************************************************************************
//پیدا کردن کلاس فونت اسوم برای نمایش نوع فایل
function getFileIconClass(fileType) {
  let type = fileType.toLowerCase();
  if (type.includes(".")) {
    type = type.split(".").pop();
  }
  if (type.includes("/")) {
    type = type.split("/").pop();
  }

  if (["xls", "xlsx", "csv"].includes(type)) return "fas fa-file-excel"; // اکسل
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(type))
    return "fas fa-file-image"; // تصویر
  if (["pdf"].includes(type)) return "fas fa-file-pdf"; // پی‌دی اف
  if (["doc", "docx"].includes(type)) return "fas fa-file-word"; // ورد
  if (["ppt", "pptx"].includes(type)) return "fas fa-file-powerpoint"; // پاورپوینت

  return "fas fa-file"; // پیش فرض
}
//*******************************************************************************************************
//نمایش فایل با کمک fontawesome برای فایلهای اپلود شده
function addAttachmentToFieldset(file) {
  const $container = $("#gbxDocuments");
  const iconClass = getFileIconClass(file.FileType);

  const $item = $(`
        <div class="attach-file" data-file-id="${file.FileId}" title="${file.FileSubject}" >
            
            <button class="remove-btn" title="حذف">×</button>
            <a href="javascript:void(0)" class="download-link" style="text-decoration:none;">
                <i class="${iconClass}" style="font-size:35px; color:#555;"></i>
            </a>
        </div>
    `);

  // رویداد حذف فایل
  $item.find(".remove-btn").on("click", function () {
    const fileId = $item.data("file-id");
    removeAttachment(fileId, $item);
  });

  // رویداد دانلود فقط برای همین آیتم
  $item.find(".download-link").on("click", function (e) {
    e.preventDefault();
    downloadBase64(file.FileContent, file.FileSubject, file.FileType);
  });

  $container.append($item);
}

//*******************************************************************************************************
// ====== Download a Base64 string as a file based on its type =======
function downloadBase64(hexString, fileName, fileType) {
  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };

  // If the format is not valid, default to png.
  const mimeType =
    mimeTypes[fileType.toLowerCase()] || "application/octet-stream";

  const dataUrl = `data:${mimeType};base64,${hexString}`;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName || "download" + fileType;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//*******************************************************************************************************
//حذف فایل در صفحه اصلی
function removeAttachment(fileId, $element) {
  $.confirm(
    "آیا نسبت به حذف این سند مطمئن هستید؟",
    "حذف اطلاعات",
    "rtl",
    function (result) {
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
    }
  );
}

//*******************************************************************************************************
//تابع فراخوانی فایلهای مرتیط با صورتجلسه به همراه رفرش پس از بسته شدن پاپ آپ
function loadOrRefreshAttachments(meetingMinuteId, options = {}) {
    return new Promise((resolve, reject) => {
        if (!meetingMinuteId) return resolve();

        const readParams = {
            WHERE: "SystemId = 3 AND DocumentId = '" + meetingMinuteId + "'",
        };

        showLoading();

        FormManager.readAttachedFile(
            readParams,
            function (list) {
                const $container = $("#gbxDocuments");

                // اگر refresh=true بود، محتوا قبلی پاک شود ولی legend حفظ گردد
                if (options.refresh) {
                    const $legends = $container.children("legend").clone(true);
                    $container.empty().append($legends);
                }

                // اضافه کردن فایل‌ها (بدون تکرار در حالت refresh)
                if (list && list.length) {
                    list.forEach(file => addAttachmentToFieldset(file));
                    console.debug(`${options.refresh ? 'Refreshed' : 'Loaded'} ${list.length} attachments.`);
                } else {
                    console.debug("No attachments found for " + (options.refresh ? "refresh." : "load."));
                }

                hideLoading();
                resolve();
            },
            function (error) {
                hideLoading();
                if (error && (error.erroMessage || error.message)) {
                    $.alert("خطا در خواندن فایل‌ها: " + (error.erroMessage || error.message), "", "rtl");
                    reject(error);
                } else {
                    console.debug("No file found (this is not an error).");
                    resolve();
                }
            }
        );
    });
}

//*******************************************************************************************************
function miladiFormattedForAttr(miladiStr) {
  if (!miladiStr) return "";

  let cleanDate = miladiStr.split("T")[0].split(" ")[0].trim();
  let gy, gm, gd;

  if (cleanDate.includes("/")) {
    // فرمت MM/DD/YYYY
    let [m, d, y] = cleanDate.split("/").map(Number);
    return `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}/${y}`;
  } else if (cleanDate.includes("-")) {
    // فرمت YYYY-MM-DD
    let [y, m, d] = cleanDate.split("-").map(Number);
    return `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}/${y}`;
  }

  // اگر هیچ‌کدوم نبود
  return "";
}

//*******************************************************************************************************
//خواندن جزییات جلسه ثبت شده در حالت ویرایش مجدد صورتجلسه
function loadMeetingDetails(meetingMinuteId, actorLookup) {
  return new Promise((resolve) => {
    if (!meetingMinuteId) return resolve();

    const readParamsDetail = {
      WHERE: "MeetingManagmentId = '" + meetingMinuteId + "'",
    };

    FormManager.readMeetingMinuteManagmentDetail(
      readParamsDetail,
      function (detailList) {
        $("#tblMinuteManagment tbody tr.data-row").remove();
        MeetingMinutesData.Items.length = 0;

        if (Array.isArray(detailList) && detailList.length) {
          const updatePromises = [];

          detailList.forEach((srvItem, idx) => {
            const responsibleIds = String(srvItem.ResponsibleForAction || "")
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean);
			  
            const cleanItem = {
              Id: srvItem.Id,
              Title: srvItem.Title || "-",
              ActionDeadLineDate: srvItem.ActionDeadLineDate || "",
              DisplayDate: safeShamsiDate(srvItem.ActionDeadLineDate || ""),
              ResponsibleForAction: responsibleIds.join(","),
              ResponsibleForActionName: "-",
            };

            MeetingMinutesData.Items.push(cleanItem);
            addRowToTable(cleanItem, idx + 1);

            const selectedPerson = getNameForIds(responsibleIds, actorLookup).then(
              (namesArray) => {
                const joinedNames =
                  namesArray.filter((n) => !!n && n !== "-").join(", ") || "-";

                const idxItem = MeetingMinutesData.Items.findIndex(
                  (it) => it.Id === cleanItem.Id
                );
                if (idxItem >= 0) {
                  MeetingMinutesData.Items[idxItem].ResponsibleForActionName =
                    joinedNames;
                }

                const $row = $("#tblMinuteManagment tbody tr.data-row").filter(
                  `[data-rowid="${cleanItem.Id}"]`
                );

                if ($row.length) {
                  $row.find("td").eq(3).text(joinedNames);
                  $row
                    .find("td")
                    .eq(5)
                    .attr("data-ids", cleanItem.ResponsibleForAction);
                } else {
                }
                return joinedNames;
              }
            );

            updatePromises.push(selectedPerson);
          });

          Promise.all(updatePromises).then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      },
      () => resolve()
    );
  });
}

//*******************************************************************************************************
function checkRequired(selector, msg, focusSelect2 = false) {
  let el = $(selector),
    val = el.val();
  if (!val || (typeof val === "string" && !val.trim())) {
    $.alert(msg, "", "rtl");
    focusSelect2 ? el.select2("open") : el.focus();
    throw new Error("StopValidation");
  }
}

//*******************************************************************************************************
function checkNumberRange(selector, min, max, msg) {
  let num = parseInt($(selector).val(), 10);
  if (isNaN(num) || num < min || num > max) {
    $.alert(msg, "", "rtl");
    //alert(msg);
    $(selector).focus();
    throw new Error("StopValidation");
  }
  return num;
}

//*******************************************************************************************************
//تابع برای فیلتر تاریخ مصوبه که نباید از روزهای اتی انتخاب شود
function validateNotFuture(gdate, $input) {
  let y, m, d;
  if (gdate.includes("-")) [y, m, d] = gdate.split("-").map(Number);
  else [m, d, y] = gdate.split("/").map(Number);

  const meetingDateObj = new Date(y, m - 1, d);
  const todayObj = new Date();
  todayObj.setHours(0, 0, 0, 0);
  meetingDateObj.setHours(0, 0, 0, 0);

  if (meetingDateObj.getTime() > todayObj.getTime()) {
    $.alert("تاریخ انتخابی جلسه نمی تواند بزرگتر از امروز باشد.", "", "rtl");
    $input.focus();
    throw new Error("StopValidation");
  }
}

//*******************************************************************************************************
function validatePresentAbsent() {
  const parseIds = (sel) =>
    ($(sel).val() || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

  const dup = parseIds("#txtPresentActorId").filter((id) =>
    parseIds("#txtAbsentActorId").includes(id)
  );

  if (dup.length) {
    $.alert("یک شخص نمی تواند در هر دو لیست حاضرین و غایبین باشد!", "", "rtl");
    throw new Error("StopValidation");
  }
}

//*******************************************************************************************************
// گرفتن تاریخ میلادی با استفاده از توابع خودت
function getMeetingGDate($input) {
  let meetingGDate = $input.attr("gdate") || $input.data("gdate");
  if (!meetingGDate) {
    const jdate = $input.attr("data-jdate") || $input.val();
    if (jdate) {
      const [jy, jm, jd] = jdate.split("/").map(Number);
      const [gy, gm, gd] = shamsi_be_miladi(jy, jm, jd);
      meetingGDate = `${gy}/${String(gm).padStart(2, "0")}/${String(
        gd
      ).padStart(2, "0")}`;
      $input
        .attr("data-gdate", meetingGDate)
        .attr("gdate", meetingGDate)
        .data("gdate", meetingGDate);
    }
  }
  return meetingGDate;
}

//*******************************************************************************************************
// ولیدیشن کل فرم و دادن پیغام مناسب به کاربر
function validateMeetingForm($meetingDateInput, meetingGDate) {
  checkRequired("#txtSubjectMeeting", "موضوع جلسه را وارد کنید.");
  checkRequired("#cmbMeetingRoomId", "اتاق جلسه را انتخاب کنید.");
  checkRequired("#txtMeetingDate", "تاریخ جلسه را انتخاب کنید.");

  const selectedDate = new Date(meetingGDate.replace(/\//g, "-"));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    $.alert(
      "انتخاب تاریخ آینده برای جلسه مجاز نیست. لطفاً امروز یا روزهای قبل را انتخاب کنید.",
      "",
      "rtl"
    );
    $meetingDateInput
      .val("")
      .attr("data-gdate", "")
      .attr("data-jdate", "")
      .attr("gdate", "");
    throw new Error("StopValidation");
  }

  const sHour = checkNumberRange(
    "#cmbMeetingStartTime",
    1,
    23,
    "ساعت شروع باید بین 6 تا 23 باشد."
  );
  const sMin = checkNumberRange(
    "#cmbMinMeetingStartTime",
    0,
    59,
    "دقیقه شروع باید بین 00 تا 45 باشد."
  );
  const eHour = checkNumberRange(
    "#cmbHourMeetingEndTime",
    1,
    23,
    "ساعت پایان باید بین 6 تا 23 باشد."
  );
  const eMin = checkNumberRange(
    "#cmbMinMeetingEndTime",
    0,
    59,
    "دقیقه پایان باید بین 00 تا 45 باشد."
  );

  if (eHour < sHour || (eHour === sHour && eMin <= sMin)) {
    $.alert("زمان پایان نمی تواند قبل یا مساوی زمان شروع باشد.", "", "rtl");
    $("#cmbHourMeetingEndTime").focus();
    throw new Error("StopValidation");
  }

  checkRequired(
    "#cmbUserPresent",
    "حداقل یک نفر شرکت کننده حاضر انتخاب کنید.",
    true
  );
  checkRequired("#txtMeetingAgenda", "دستور جلسه را وارد کنید.");

  if ($("#tblMinuteManagment tr.data-row").length === 0) {
    $.alert("حداقل یک مصوبه باید وارد شود.", "", "rtl");
    throw new Error("StopValidation");
  }

  validatePresentAbsent();

  return { sHour, sMin, eHour, eMin };
}

//*******************************************************************************************************
//تابع تبدیل میلادی موجود در دیت پیکر و تبدیل به شمسی
function safeShamsiDate(miladiDate) {
  if (!miladiDate || typeof miladiDate !== "string" || !miladiDate.trim())
    return "";
  if (miladiDate.startsWith("0001") || miladiDate.startsWith("1900")) return "";
  return formatMiladiToShamsi(miladiDate);
}
//*******************************************************************************************************
//برای مودال مصوبات طولانی
function truncateText(text, maxWords = 15) {
    if (!text) return "-";
    const words = text.trim().split(/\s+/);
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
}
$("#tblMinuteManagment").off("click", ".minute-text-cell").on("click", ".minute-text-cell", function () {
   const fullText = $(this).data("fulltext") || "-";
   const fullTextPopup = $(`
       <div style="direction:rtl;text-align:right;" class="ui-form">
           <textarea readonly
               style="height:120px;font-size:9pt;resize:none;width:98%;background-color:#f9f9f9;cursor:default;">${fullText}</textarea>
       </div>
   `);

   fullTextPopup.dialog({
       modal: true,
       title: "متن کامل مصوبه",
       width: 540,
       buttons: [
           {
               text: "بستن",
               click: function () {
                   $(this).dialog("close");
               }
           }
       ]
   });
});
//***********************************************************************************************
// ساخت سلول عنوان کوتاه سازی و ذخیره متن کامل
function buildTitleCell($td, titleText) {
    const fullText = String(titleText || "-").trim();
    const shortText = truncateText(fullText, 12);
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;

    const $span = $("<span>")
        .text(shortText)
        .attr("data-fulltext", fullText);

    if (wordCount > 12) $span.addClass("minute-text-cell");

    $td.empty().append($span);
}

//***********************************************************************************************
// افزودن یا ویرایش مصوبه
function handleNewMinuteItem(result, $rowFromEdit) {
    const uniqueId = result.Id ? String(result.Id).trim() : null;
    if (!uniqueId) return console.error("رکورد بدون Id – عملیات لغو شد");

    const actorIds = (result.ResponsibleForAction || "").trim();
    const actorNames = (result.ResponsibleForActionName || "-").trim();

    const newItem = {
        Id: uniqueId,
        Title: result.Title || "-",
        ResponsibleForAction: actorIds,
        ResponsibleForActionName: actorNames,
        ActorForAction: actorIds,
        ActionDeadLineDate: result.ActionDeadLineDate,
        DisplayDate: result.DisplayDate || "-",
    };

    const idx = MeetingMinutesData.Items.findIndex(it => String(it.Id) === uniqueId);
    const $tbody = $("#tblMinuteManagment tbody");

    if (idx >= 0) {
        // --- ویرایش رکورد موجود ---
        MeetingMinutesData.Items[idx] = newItem;

        let $row = $tbody.find(`tr.data-row[data-rowid="${uniqueId}"]`);
        if (!$row.length && $rowFromEdit?.length) $row = $rowFromEdit;
        if (!$row.length) return;

        const tds = $row.find("td");
        buildTitleCell(tds.eq(2), newItem.Title);
        tds.eq(3).text(newItem.ResponsibleForActionName);
        tds.eq(4)
           .text(newItem.DisplayDate)
           .attr("data-gdate", newItem.ActionDeadLineDate)
           .attr("data-jdate", newItem.DisplayDate);
        tds.eq(5).attr("data-ids", newItem.ResponsibleForAction);
    } else {
        // --- افزودن رکورد جدید ---
        MeetingMinutesData.Items.push(newItem);
        addRowToTable(newItem);
    }
}

//***********************************************************************************************
// افزودن در جدول مصوبات
function addRowToTable(item) {
    const $template = $("#tblMinuteManagment tbody tr.row-template").first().clone()
        .removeClass("row-template").addClass("data-row").show()
        .attr("data-rowid", String(item.Id));

    const tds = $template.find("td");
    tds.eq(0).html(`<input type="radio" name="selectedRowId" value="${item.Id}" />`);
    tds.eq(1).text(item.Id);

    buildTitleCell(tds.eq(2), item.Title); // عنوان مصوبه

    tds.eq(3).text(item.ResponsibleForActionName || "-");
    tds.eq(4)
       .text(item.DisplayDate || "-")
       .attr("data-gdate", item.ActionDeadLineDate || "")
       .attr("data-jdate", item.DisplayDate || "");
    tds.eq(5)
       .text(item.ResponsibleForActionName || "-")
       .attr("data-ids", item.ResponsibleForAction || "");

    $("#tblMinuteManagment tbody").append($template);
}

//*******************************************************************************************************
//حذف یک رکورد از جدول مصوبات
function deleteMinuteItem(selectedId) {
  const index = MeetingMinutesData.Items.findIndex(
    (item) => String(item.Id) === String(selectedId)
  );
  if (index > -1) {
    MeetingMinutesData.Items.splice(index, 1);
    $("#tblMinuteManagment tbody tr")
      .has(`input[name='selectedRowId'][value='${selectedId}']`)
      .remove();
  }
}

//*******************************************************************************************************
// بارگزاری اطلاعات جلسه برای حالت ویرایش	
function loadMeetingData(meetingMinuteId) {
  return new Promise((resolve) => {
    if (!meetingMinuteId) return resolve();

    const readParams = { WHERE: "Id = '" + meetingMinuteId + "'" };
    FormManager.readMeetingMinuteManagment(
      readParams,
      function (list) {
        if (list && list.length) {
          const item = list[0];
          $("#txtActorIdCreator").val(item.ActorIdCreator);
          $("#txtMeetingDate")
            .val(formatMiladiToShamsi(item.MeetingStartDate) || "")
            .data("gdate", miladiFormattedForAttr(item.MeetingStartDate) || "")
            .attr("gdate", miladiFormattedForAttr(item.MeetingStartDate) || "");

          if (item.MeetingStartTime && item.MeetingEndTime) {
            const [stH, stM] = item.MeetingStartTime.split(":");
            const [enH, enM] = item.MeetingEndTime.split(":");
            $("#cmbMeetingStartTime").val(stH || "");
            $("#cmbMinMeetingStartTime").val(stM || "");
            $("#cmbHourMeetingEndTime").val(enH || "");
            $("#cmbMinMeetingEndTime").val(enM || "");
          }
          $("#cmbMeetingRoomId").val(item.MeetingRoomId).trigger("change");
          $("#txtSubjectMeeting").val(item.SubjectMeeting);
          $("#txtMeetingAgenda").val(item.MeetingAgenda);
          $("#txtPresentActorId").val(item.UserPresent);
          $("#txtAbsentActorId").val(item.UserAbsent);
        }
        resolve();
      },
      function () {
        resolve();
      }
    );
  });
}

//*******************************************************************************************************
// گرفتن اسامی حاضرین و غایبین نه کل یوزرهای آیکن!
function getNameForIds(ids, actorLookup) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return Promise.resolve([]);
  }

  const promises = ids.map((responsibleId) => {
    if (actorLookup[responsibleId]) {
      return Promise.resolve(actorLookup[responsibleId]);
    }
    return new Promise((resolve) => {
      BS_GetUserInfo.Read(
        { Where: "ActorId = '" + responsibleId + "'" },
        function (data) {
          let name = "-";
          if (typeof data === "string") {
            const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
            const fullNameNode = xmlDoc.querySelector("col[name='fullName']");
            name = fullNameNode ? fullNameNode.textContent.trim() : "-";
          } else if (Array.isArray(data) && data.length) {
            name = data[0].FullName || data[0].Name || "-";
          }
          actorLookup[responsibleId] = name;
          resolve(name);
        },
        function () {
          actorLookup[responsibleId] = "-";
          resolve("-");
        }
      );
    });
  });

  return Promise.all(promises);
}

//*******************************************************************************************************
// جمع آوری آیتم ها با توجه به حالت ثبت یا ویرایش
function collectMeetingItems(isEditMode) {
  if (isEditMode) {
    return $("#tblMinuteManagment tr.data-row")
      .map(function () {
        const tds = $(this).find("td");
        let rawActorIds = tds.eq(5).attr("data-ids") || null; // گرفتن IDها از data-attribute
        return {
          Title: (tds.eq(2).text() || "").trim() || null,
          ResponsibleForAction: rawActorIds,
          ActionDeadLineDate: tds.eq(4).attr("data-gdate") || null,
        };
      })
      .get();
  } else {
    return MeetingMinutesData.Items.map((it) => ({
      Title: it.Title || null,
      ActionDeadLineDate: it.ActionDeadLineDate?.trim() || null,
      ResponsibleForAction: it.ResponsibleForAction?.trim() || null,
    }));
  }
}

//*******************************************************************************************************
// ساخت JSON نهایی برای ارسال در sp ثبت
function buildMeetingJson(meetingGDate, timeData, items) {
  return {
    ActorIdCreator: parseInt($("#txtActorIdCreator").val(), 10),
    MeetingStartDate: meetingGDate,
    MeetingStartTime: `${String(timeData.sHour).padStart(2, "0")}:${String(
      timeData.sMin
    ).padStart(2, "0")}`,
    MeetingEndTime: `${String(timeData.eHour).padStart(2, "0")}:${String(
      timeData.eMin
    ).padStart(2, "0")}`,
    SubjectMeeting: $("#txtSubjectMeeting").val().trim(),
    MeetingAgenda: $("#txtMeetingAgenda").val().trim(),
    MeetingRoomId: Number($("#cmbMeetingRoomId").val()),
    UserPresent: $("#txtPresentActorId").val()?.trim() || "",
    UserAbsent: $("#txtAbsentActorId").val()?.trim() || "",
    Items: items,
    Files: $("#gbxDocuments > div")
      .map(function () {
        return $(this).data("file-id");
      })
      .get(),
  };
}
//*******************************************************************************************************
//پیدا کردن اسامی حاضرین و غایبین
function loadActorLookup(callback) {
    BS_GetUserInfo.Read({}, function (data) {
        const $xml = $.xmlDOM ? $.xmlDOM(data) : $(data);
        $xml.find("row").each(function () {
            const id = $(this).find("col[name='ActorId']").text().trim();
            const fullName = $(this).find("col[name='fullName']").text().trim();
            actorLookup[id] = fullName;
        });
       
        if (typeof callback === "function") callback();
    }, function (err) {
        console.error(" Error loading actorLookup:", err);
        if (typeof callback === "function") callback();
    });
}
//*******************************************************************************************************
// پیدا کردن نام و ترکیب با مکان جلسات
function loadMeetingRoomsCombo() {
    return new Promise((resolve, reject) => {
        FormManager.readMeetingRooms({}, function (list) {
            const $combo = $("#cmbMeetingRoomId");
            $combo.empty(); // پاک کردن گزینه های قبلی

            // ساخت گزینه ها جدید
            list.forEach(room => {
                 const textTitle = room.Title ? String(room.Title).trim() : "";
     			const textAddress = room.Address ? String(room.Address).trim() : "";

                const optionText = textAddress 
                    ? `${textTitle} - (${textAddress})`
                    : textTitle;

                $("<option>")
                    .val(room.Id)
                    .text(optionText)
                    .appendTo($combo);
            });

            resolve();
        }, function (err) {
            console.error("Error loading meeting rooms:", err);
            reject(err);
        });
    });
}

//*******************************************************************************************************
//افزودن فیلتر برای اینکه دبیر در جلسه جز حاضرین و اسامی باشد
const secretaryId = $("#txtActorIdCreator").val(); 
$("#cmbUserPresent").on("select2:unselect", function (e) {
    if (e.params.data.id === secretaryId) {
        // پیام هشدار
        $.alert("دبیر جلسه را نمی توانید حذف کنید.", "", "rtl");

        // برگرداندن دوباره گزینه به لیست انتخاب شده ها
        var vals = $(this).val() || [];
        vals.push(secretaryId);
        // حذف مقادیر تکراری
        vals = [...new Set(vals)];
        $(this).val(vals).trigger("change");
    }
});

//#endregion EDN common.js 

//#region formmanger.js
var FormManager = {
	
//******************************************************************************************************
	readMeetingMinuteManagment: function(jsonParams, onSuccess, onError)
	{
	  BS_MeetingMinuteManagment.Read(jsonParams
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
		                MeetingMinuteNo: $(this).find("col[name='MeetingMinuteNo']").text(),
						ActorIdCreator: $(this).find("col[name='ActorIdCreator']").text(),
						MeetingStartDate: $(this).find("col[name='MeetingStartDate']").text(),
						MeetingStartTime: $(this).find("col[name='MeetingStartTime']").text(),
					    MeetingEndTime: $(this).find("col[name='MeetingEndTime']").text(),
					    SubjectMeeting: $(this).find("col[name='SubjectMeeting']").text(),
					    MeetingAgenda: $(this).find("col[name='MeetingAgenda']").text(),
					    MeetingRoomId: $(this).find("col[name='MeetingRoomId']").text(),
						UserPresent: $(this).find("col[name='UserPresent']").text(),
						UserAbsent: $(this).find("col[name='UserAbsent']").text()
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
//******************************************************************************************************
    readMeetingRooms: function(jsonParams, onSuccess, onError)
	{
	  BS_MM_MeetingRooms.Read(jsonParams
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
		                Address: $(this).find("col[name='Address']").text(),
						Title: $(this).find("col[name='Title']").text()
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
						Title: $(this).find("col[name='Title']").text(),
						ActionDeadLineDate: $(this).find("col[name='ActionDeadLineDate']").text(),
						ResponsibleForAction: $(this).find("col[name='ResponsibleForAction']").text()
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
/*********************************************************************************************************/
    // ثبت سفارش، کاهش موجودی منطقی انبار، کاهش اعتبار کاربر جاری
    insertMeetingMinuteManagment: function (jsonParams, onSuccess, onError) {
        SP_MeetingMinuteManagmentInsert.Execute(jsonParams,
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
                var methodName = "insertMeetingMinuteManagment";

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
	readAttachedFile: function(jsonParams, onSuccess, onError)
	{
	   BS_Office_AttachedFile.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						  
			                FileId:          $(this).find("col[name='FileId']").text(),
							DocumentId:      $(this).find("col[name='DocumentId']").text(),
							FileSubject:     $(this).find("col[name='FileSubject']").text(),
							FileName:        $(this).find("col[name='FileName']").text(),
							FileType:        $(this).find("col[name='FileType']").text(),
							FileContent:     $(this).find("col[name='FileContent']").text(),
							SystemId:        $(this).find("col[name='SystemId']").text(),
							ProccessStatus:  $(this).find("col[name='ProccessStatus']").text(),
							Description:     $(this).find("col[name='Description']").text(),
							CreatedDate:     $(this).find("col[name='CreatedDate']").text(),
							CreatorUserId:   $(this).find("col[name='CreatorUserId']").text(),

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
//******************************************************************************************************
	deleteAttachedFile: function(jsonParams, onSuccess, onError)
	{
		BS_Office_AttachedFile.Delete(jsonParams, 
			function(data)
			{
				var dataXml = null;
				if($.trim(data) != "")
				{
					dataXml = $.xmlDOM(data);
				}
				if($.isFunction(onSuccess))
				{
					onSuccess(dataXml);
				}
			},
			function(error) {
					var methodName = "deleteAttachedFile";
	
		            if ($.isFunction(onError)) {
						var erroMessage= "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
						console.error("Error:", erroMessage);
						console.error("Details:", error);
		                
		                onError({
		                    message: erroMessage,
		                    details: error
		                });
		            } else {
		                console.error(erroMessage+ " (no onError callback provided):", error);
		            }
		        }
		);
	},
 /*********************************************************************************************************/
    // ثبت سفارش، کاهش موجودی منطقی انبار، کاهش اعتبار کاربر جاری
    updateMeetingMinuteManagment: function (jsonParams, onSuccess, onError) {
        SP_MeetingMinuteManagmentUpdate.Execute(jsonParams,
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
                var methodName = "updateMeetingMinuteManagment";

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
};


//#endregion EDN momMinutesMeeting_Add.js 

//#region btnRegister.js
$("#btnRegister").on("click", function (e) {
    e.preventDefault();

    const meetingMinuteId = Number($("#lblMeetingMinuteId").text().trim());
    const isEditMode = Number.isInteger(meetingMinuteId) && meetingMinuteId > 0;

    try {
        const $meetingDateInput = $("#txtMeetingDate");

        // گرفتن تاریخ میلادی از فیلد
        const meetingGDate = getMeetingGDate($meetingDateInput);

        // ولیدیشن کل فرم
        const timeData = validateMeetingForm($meetingDateInput, meetingGDate);

        // --- جمع‌آوری آیتم ها از آرایه سالم مودال ---
        const items = (MeetingMinutesData.Items || []).map(it => ({
            Id: it.Id || null,
            Title: (it.Title || "").trim() || null,
            ResponsibleForAction: (it.ResponsibleForAction || "").trim() || null,
            ActionDeadLineDate: (it.ActionDeadLineDate || "").trim() || null
        }));

        // ساخت JSON نهایی
        const jsonArray = buildMeetingJson(meetingGDate, timeData, items);

        // پارامتر نهایی برای SP
        const sp_params = isEditMode
            ? { Id: meetingMinuteId, jsonArray: JSON.stringify(jsonArray) }
            : { jsonArray: JSON.stringify(jsonArray) };

        // انتخاب روش باتوجه به ویرایش یا ثبت
        const method = isEditMode
            ? FormManager.updateMeetingMinuteManagment
            : FormManager.insertMeetingMinuteManagment;
        showLoading();
        method(
            sp_params,
            function (data) {
			    hideLoading();
			    if (data.Code != 200) {
			        $.alert("SP Error: " + data.Message, "خطا", "rtl");
			        return;
			    } else {
		            // پاسخ موفق
				    $.alert("ثبت مصوبه با موفقیت انجام شد", "موفق", "rtl", function () {
				        closeWindow({ OK: true, Result: null });
				    });
			    }
			},
            function (err) {
                hideLoading();
                alert(err.details);
            }
        );
    } catch (err) {
        hideLoading(); // حتی در خطای غیر StopValidation خاموش شود
        if (err.message !== "StopValidation") throw err;
    }
});


//#endregion end btnRegister.js

//#region momMeetingMinutes_Add.js
$("#momMeetingMinutes_Add").off("click").on("click", function () {
    const presentIds = ($("#txtPresentActorId").val() || "").split(",").map(id => id.trim()).filter(id => id);
    const absentIds = ($("#txtAbsentActorId").val() || "").split(",").map(id => id.trim()).filter(id => id);

    $.showModalForm(
        {
            registerKey: "ZJM.MOM.MinutesMeetingApprovals",
            params: { 
                editItem: MeetingMinutesData,
                presentIds: presentIds,
                absentIds: absentIds
            }
        },
        function (retVal) {
            if (retVal && retVal.OK && retVal.Result) {
                handleNewMinuteItem(retVal.Result);
            }
        }
    );
});

//#endregion momMeetingMinutes_Add.js

//#region momMeetingMinutes_Edit.js
$("#momMeetingMinutes_Edit").off("click").on("click", function () {
    let $row = $("#tblMinuteManagment input[name='selectedRowId']:checked").closest("tr");
    if ($row.length === 0) {
		$.alert("هیچ ردیفی برای ویرایش انتخاب نشده است.", "توجه", "rtl");
        return;
    }

    // اطمینان از وجود data-jdate روی جدول
    let tds = $row.find("td");
    let jDate = tds.eq(4).attr("data-jdate");
    if (!jDate) {
        // اگر نبود، از متن ستون استفاده کن
        jDate = (tds.eq(4).text() || "").trim();
        tds.eq(4).attr("data-jdate", jDate);
    }

    let gDate = tds.eq(4).attr("data-gdate") || "";
    let itemData = {
        Id: (tds.eq(1).text() || "").trim(),
        Title: (tds.eq(2).find("span").data("fulltext") || "").trim(),
        ResponsibleActorName: (tds.eq(3).text() || "").trim(),
        ActionDeadLineJDate: jDate,
        ActionDeadLineDate: gDate,
        ResponsibleActorId: (tds.eq(5).attr("data-ids") || "").trim()
    };

    const presentIds = ($("#txtPresentActorId").val() || "")
        .split(",").map(id => id.trim()).filter(Boolean);
    const absentIds = ($("#txtAbsentActorId").val() || "")
        .split(",").map(id => id.trim()).filter(Boolean);

    // تضمین لود کش قبل از باز کردن مودال
    if (Object.keys(actorLookup).length === 0) {
        loadActorLookup(function () {
            openEditModal(itemData, presentIds, absentIds);
        });
    } else {
        openEditModal(itemData, presentIds, absentIds);
    }
});

	function openEditModal(itemData, presentIds, absentIds) {
    	$.showModalForm(
        {
            registerKey: "ZJM.MOM.MinutesMeetingApprovals",
            params: { 
                meetingData: MeetingMinutesData,
                editItem: itemData,
                presentIds: presentIds,
                absentIds: absentIds,
                actorLookup: actorLookup 
            }
        },
        function (retVal) {
            if (retVal && retVal.OK && retVal.Result) {
                handleNewMinuteItem(retVal.Result, $("#tblMinuteManagment tbody tr[data-rowid='" + itemData.Id + "']"));
            }
        }
    );
}

//#endregion EDN momMeetingMinutes_Edit.js 

//#region momMeetingMinutes_Delete.js
$("#momMeetingMinutes_Delete").click(function () {
    const $selectedRadio = $("#tblMinuteManagment input[name='selectedRowId']:checked");
    if ($selectedRadio.length === 0) {
        $.alert("لطفاً یک مصوبه را برای حذف انتخاب کنید.", "توجه", "rtl");
        return;
    }
    const rowId = $selectedRadio.val(); // آیدی یکتا
    const $selectedRow = $selectedRadio.closest("tr.data-row");

	$.alert("آیا از حذف این مصوبه مطمئن هستید؟", "حذف", "rtl", function () {
	    // حذف از آرایه فقط همون یک مورد
	    MeetingMinutesData.Items = MeetingMinutesData.Items.filter(item => String(item.Id) !== String(rowId));
	
	    // حذف از جدول
	    $selectedRow.remove();
	});

});

//#endregion EDN momMeetingMinutes_Delete.js 

//#region pnlCompleteDocs.js
$(function () {
    var $pnlCompleteDocs = $('#pnlCompleteDocs');

    // تنظیمات اولیه پنل آپلود
    $pnlCompleteDocs.css({
        width: '85px',
        overflow: 'visible',
        position: 'absolute'
    });
    // افزودن متن فقط اگر قبلاً وجود نداشته باشد
    if ($('#lblUploadText').length === 0) {
        $('<span>', {
            id: 'lblUploadText',
            text: 'بارگذاری فایل'
        }).css({
            position: 'absolute',
            left: '20px',      // نمایش از سمت چپ آیکن
            top: '4px',
            fontSize: '8pt',
            fontWeight: 'bold', // بولد
            color: '#FFFFFF',   // سفید
            fontFamily: 'Tahoma',
            whiteSpace: 'nowrap'
        }).appendTo($pnlCompleteDocs);
    }

    // رویداد کلیک برای باز کردن مودال آپلود فایل
    $pnlCompleteDocs.on('click', function () {
        const meetingMinuteId = $("#lblMeetingMinuteId").text().trim();

        $.showModalForm(
            {
                registerKey: "ZJM.MOM.MinutesMeetingUploadDocument",
                params: { MeetingMinuteId: meetingMinuteId }
            },
            function (retVal) {
                try {
                    if (retVal && retVal.successed && retVal.value) {
                        // اگر value آرایه است، روی همه loop بزن
                        const files = Array.isArray(retVal.value)
                            ? retVal.value
                            : [retVal.value];

							files.forEach(uploadedFile => {
						    // ساخته یک آبجکت استاندارد از اطلاعات فایل برگشتی از مودال
						    const newFile = {
						        FileId: uploadedFile?.id || uploadedFile,                  
						        FileName: uploadedFile?.fileSubject || "نام فایل نامشخص",          
						        FileType: uploadedFile?.type || ".png",                   
						        FileContent: uploadedFile?.content || "",                    
						        FileSubject: uploadedFile?.fileSubject || uploadedFile?.name || "" 
						    };

                            // توابع والد در همین صفحه فعلی هستند، نه در parent.parent
                            if (typeof addAttachmentToFieldset === "function") {
                                addAttachmentToFieldset(newFile);
                            } else {
                                console.warn("تابع addAttachmentToFieldset در همین فرم یافت نشد.");
                            }
                        });
                    } else {
                        console.warn("هیچ فایل جدیدی از مودال برگشت داده نشد یا عملیات ناموفق بود.");
                    }

                    if (typeof loadOrRefreshAttachments === "function") {
                        loadOrRefreshAttachments(meetingMinuteId, { refresh: true });
                    } else {
                        console.warn("تابع loadOrRefreshAttachments در همین فرم یافت نشد.");
                    }
                } catch (err) {
                    console.error("خطا در پردازش نتیجه مودال:", err);
                }
            }
        );
    });
});

//#endregion pnlCompleteDocs.js