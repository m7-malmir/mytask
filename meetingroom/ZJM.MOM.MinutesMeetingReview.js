//#region ready.js
// ===================== Public variables =====================
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;
var pk;
var actorLookup = {};
var MeetingMinutesData = {
    Items: []
};
var allUsers;
$(function(){
    $form = (function(){
        var pk, inEditMode = false;
		// ==================== init ============================
        function init(){
			if(typeof dialogArguments !== "undefined")
			{
				if(primaryKeyName in dialogArguments)
				{
					pk = dialogArguments[primaryKeyName];
					inEditMode = true;
					readData();
				} 
				if("FormParams" in dialogArguments)
				{
					pk = dialogArguments.FormParams;
					inEditMode = true;
				}
				DocumentId = dialogArguments["DocumentId"];
				CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
				InboxId = dialogArguments["WorkItem"]["InboxId"];
			}
	      build();
	      createControls();
        }
		// ==================== build ============================
	    function build() {
	      //Set the new dialog title
	      changeDialogTitle("بازنگری مصوبات جلسه");
	    }
        function bindEvents(){

        }
		// ==================== createControls ====================
		function createControls(){
			
			showLoading();


			try {
			    const parentUrl = window.parent?.location?.href;
			    const url = new URL(parentUrl);
			    isInTestMode = url.searchParams.get("icantestmode") === "1";
			} catch (e) {
			    console.warn("Cannot reach parent document:", e);
			    isInTestMode = false;
			}
			
			//  در صورت وجود ActorId از form والد، از اون استفاده کن
			if (typeof dialogArguments !== "undefined" &&
			    dialogArguments["WorkItem"] &&
			    dialogArguments["WorkItem"]["ActorId"]) {
			
			    currentActorId = dialogArguments["WorkItem"]["ActorId"];
			
			} else {
			    //  در غیر این صورت، خودت از سرویس بگیر
			    UserService.GetCurrentActor(true, function (data) {
			        let xmlActor = $.xmlDOM(data);
			        currentActorId = xmlActor.find('actor').attr('pk');
			    }, function (error) {
			        console.error("خطا در دریافت Actor:", error);
			    });
			}
			
			FormManager.readMeetingMinuteManagment(
			    { Where: "Id = " + pk },
			    function (list) { 
			        if (!list || list.length === 0) {
			            hideLoading();
			            return;
			        }
			        const data = list[0]; // چون فقط یک رکورد داریم
			        const Id = data.Id;
			        const MeetingMinuteNo = data.MeetingMinuteNo;
			        const fullName = data.fullName;
			        const MeetingStartTime = data.MeetingStartTime;
			        const MeetingEndTime = data.MeetingEndTime;
			        const SubjectMeeting = data.SubjectMeeting;
			        const MeetingAgenda = data.MeetingAgenda;
			        const Title = data.Title;
			        const UserPresent = data.UserPresent;
			        const UserAbsent = data.UserAbsent;
			        const CreatedDate = data.CreatedDate; 
					allUsers= data.AllUsers;
			        // مقداردهی به فیلدها
			        $("#txtFullName").val(fullName).prop("disabled", true);
					$("#txtMeetingMinuteNo").val(MeetingMinuteNo).prop("disabled", true);
			        $("#txtCreatedDate").val(formatMiladiToShamsi(CreatedDate)).prop("disabled", true);
			        $("#txtMeetingStartTime").val(extractTime(MeetingStartTime)).prop("disabled", true);
					$("#txtMeetingEndTime").val(extractTime(MeetingEndTime)).prop("disabled", true);
			        $("#txtSubjectMeeting").val(SubjectMeeting).prop("disabled", true);
			        $("#txtMeetingAgenda").val(MeetingAgenda).prop("disabled", true);
			        $("#txtTitle").val(Title).prop("disabled", true);
			        $("#txtUserPresent").val(UserPresent).prop("disabled", true);
			        $("#txtUserAbsent").val(UserAbsent).prop("disabled", true);
			
			        // اگر لازم داری Id و MeetingMinuteNo رو ذخیره کنیم
			        $("#hiddenMeetingId").val(Id);
			        $("#hiddenMeetingNo").val(MeetingMinuteNo);
					loadAttachments(data.Id); 
					hideLoading();
					 
	
			    },
			    function (err) {
			        alert(JSON.stringify("خطا در دریافت اطلاعات درخواست! لطفا با پشتیبان سامانه تماس بگیرید."));
			        hideLoading();
			    }
			);

		}
		// ==================== getPrimaryKey ====================
		function getPK()
		{
			return pk;
		}
        return {
			 init:init,
			 getPK: getPK
			 };
    })();

    $form.init();
});

//#endregion ready.js

//#region btnRegister.js
$("#btnRegister").on("click", function (e) {
    e.preventDefault();
    showLoading();

    Office.Inbox.setResponse(
        dialogArguments.WorkItem,
        1,
        "",
        function (data) {
            hideLoading();

            $.alert("فرم با موفقیت ارسال شد.", "", "rtl", function () {
                closeWindow({ OK: true, Result: null });
            });
        },
        function (err) {
            hideLoading();

            console.error("خطا در setResponse:", err);
            $.alert(
                "خطا در ارسال پاسخ: " + (err.message || "خطای ناشناخته"),
                "",
                "rtl"
            );
        }
    );
});

//#endregion btnRegister.js

//#region tblMinuteManagment.js
$(function () {
    tblMinuteManagment = (function () {
        // ====================== Variables ======================
        const rowNumber = 15;
        const meetingMinuteManagment = FormManager.readMeetingMinuteManagmentDetail;
        let element = null;
        let rowPrimaryKeyName = "Id";
        init();
		
        // ======================= Init ==========================
        function init() {
            element = $("#tblMinuteManagment");   
            bindEvents();  
            load();        
        }
		
        // ==================== Bind Events ======================
        function bindEvents() {
			//============================
			// نمایش لاگ تایید رد
			//============================
            $("#tblMinuteManagment").on("click", ".comment-icon", function () {
                const $row = $(this).closest("tr");
                const recordId = $row.find("td").eq(2).text().trim();
        		console.log(recordId);
				
                $.showModalForm({
                    registerKey: "ZJM.MOM.MinutesMeetingHistoryDetails",
                    params: { Id: recordId }
                }, function (retVal) {
                    tblMinuteManagment.refresh();
                });
            });
			
			//============================
			// نمایش پاپ آپ برای بازنگری
			//============================
			$(document).on("click", ".btn-review", function () {
			    const $row = $(this).closest("tr");
			    const MeetingMinuteDetailId = ($row.find("td").eq(2).text() || "").trim();
			
			    $.showModalForm(
			        {
			            registerKey: "ZJM.MOM.MinutesMeetingReviewPopup",
			            params: {
			                editItem: { MeetingMinuteDetailId },
			                allUsers
			            }
			        },
			        function (retVal) {
			            tblMinuteManagment.refresh();
			        }
			    );
			});
			
			//============================
			// پاپ آپ توضیحات طولانی
			//============================
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
                    title: "متن کامل صورتجلسه",
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
			//============================
        }
	
        // ====================== Add Row ========================
		
		function addRow(rowInfo, rowIndex) {
		    const tempRow = $("#tblMinuteManagment").find("tr.row-template").first().clone();
		    tempRow.removeClass("row-template").addClass("row-data").show();
		
		    const tds = tempRow.find("td");
		    //  شماره ردیف
		    tds.eq(0).text(rowIndex).attr("align", "center");
		
		    //  شناسه اکشن (DetailActionId)
		    tds.eq(1).text(rowInfo.DetailActionId || "").hide();
		
		    //  شناسه جزییات مصوبه (MeetingMinuteDetailId)
		    tds.eq(2).text(rowInfo.MeetingMinuteDetailId || "").hide();
		
		    //  شناسه جلسه (MeetingManagmentId)
		    tds.eq(3).text(rowInfo.MeetingManagmentId || "").hide();
		
            // --- متن صورتجلسه ---
            const fullText = String(rowInfo.Title || "-").trim();
            const shortText = truncateText(fullText, 7);
            const wordCount = fullText.split(/\s+/).filter(w => w).length;

            const tdEl = tds.eq(4);
            tdEl.empty();

            const spanEl = $("<span>")
                .text(shortText)
                .attr("data-fulltext", fullText);

            if (wordCount > 7) {
                spanEl.addClass("minute-text-cell");
            }

            tdEl.append(spanEl);
		
		    //  اقدام کننده ها (مسئول ها)
		    tds.eq(5).text(rowInfo.ResponsibleForActionName || "-");
		
		    //  تاریخ اقدام
		    tds.eq(6).text(
		        rowInfo.ActionDeadLineDate
		            ? formatMiladiToShamsi(rowInfo.ActionDeadLineDate)
		            : "-"
		    );
		
		    //  ستون نظرات → آیکن اینفو
		    const infoIcon = $('<i class="fa fa-info-circle comment-icon" style="cursor:pointer;"></i>')
		        .attr("data-id", rowInfo.DetailActionId || "");
		    tds.eq(7).empty().append(infoIcon);
		
		    // ساخت المان گرافیکی تایید/رد (RejAcc)
			const rejAccVal = (rowInfo.RejAcc || "-").trim();
			
			// اگر مقدار درست مثل "0-2"
			if (rejAccVal.includes("-")) {
			    const [leftVal, rightVal] = rejAccVal.split("-");
			    const $rejAccContainer = $('<div style="display:flex;justify-content:center;gap:6px;width:100%"></div>');
			    const rightBadge = $('<div class="green-info"></div>').text(rightVal);
			    const leftBadge = $('<div class="red-info"></div>').text(leftVal);
				$rejAccContainer.append( rightBadge, leftBadge);
			    tds.eq(8).empty().append($rejAccContainer);
			} else {
			    // اگر مقدار معتبر نیست
			    tds.eq(8).text("-");
			}
		
		    //  ستون عملیات → دکمه بازنگری
		    const reviewButton = $('<button type="button" class="btn-review" data-id="' + (rowInfo.DetailActionId || '') + '">بازنگری</button>');

		    tds.eq(9).empty().append(reviewButton);
			
			// اکتور ایدی
			tds.eq(10).text(rowInfo.ResponsibleForAction || "").hide();
			
		    // درج در جدول قبل از تمپلیت
		    $("#tblMinuteManagment tbody tr.row-template").before(tempRow);
		}


        // ======================== Load =========================
		function load() {
		    const pk = $form.getPK();
		
		    //  کنترل ایمن مقداردهی ها
		    if (!pk || !currentActorId) {
		        return;
		    }
		    //  پارامترهای امن برای SP
		    let params = {
		        Where: `MeetingManagmentId = '${pk}' AND ActorId = '${currentActorId}'`
		    };
		
		    //  گرفتن داده از متد اصلی
		    meetingMinuteManagment(
		        params,
		        function (list) {
		            try {
		                // بررسی صحت لیست
		                if (Array.isArray(list) && list.length > 0) {
		                    const $tbl = $("#tblMinuteManagment");
		                    $tbl.find("tr.no-data-row").remove();
		                    
		                    list.forEach((row, index) => addRow(row, index + 1));
		
		                    // شماره گذاری و صفحه بندی
		                    pagination($tbl, rowNumber);
		                } else {
		                    // هیچ داده ای نیست
		                    addNoDataRow($("#tblMinuteManagment"));
		                    console.warn("No data received for MeetingMinuteManagment.");
		                }
		            } catch (err) {
		                console.error("Error while processing list:", err);
		                $.alert("خطایی در پردازش داده‌ها رخ داده است!", "", "rtl");
		            }
		        },
		        function (error) {
		            console.error("meetingMinuteManagment error:", error);
		            $.alert(error || "خطا در دریافت اطلاعات از سامانه!", "", "rtl");
		        }
		    );
		}

        // ====================== Refresh ========================
        function refresh() {
            element.find("tr.row-data").remove();
            load();
        }

        return {
            refresh,
            load
        };
    }());
});
//#endregion tblMinuteManagment.js

//#region Common.js

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
//***************************************showLoading*****************************************************
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
function extractTime(datetimeStr) {
    const match = datetimeStr.match(/\b\d{2}:\d{2}\b/);
    return match ? match[0] : "";
}
//******************************************************************************************************
//تابع فراخوانی فایلهای مرتیط با صورتجلسه
function loadAttachments(documentId) {
  return new Promise((resolve, reject) => {
    if (!documentId) {
      console.debug("No documentId provided to loadAttachments");
      return resolve();
    }

    const readParams = {
      WHERE: "SystemId = 3 AND DocumentId = '" + documentId + "'"
    };

    FormManager.readAttachedFile(
      readParams,
      function (list) {
        if (list && list.length) {
          list.forEach((file) => addAttachmentToFieldset(file));
          console.debug(`Loaded ${list.length} attachments.`);
        } else {
          console.debug("No attachments found for this meeting.");
        }
        resolve();
      },
      function (error) {
        alert("خطا در خواندن فایل ها: " + (error.erroMessage || error.message));
        reject(error);
      }
    );
  });
}

//*******************************************************************************************************
//افزودن ایکن فایل ها به بخش پیوست در UI
function addAttachmentToFieldset(file) {
  const $container = $("#gbxDocuments");
  const iconClass = getFileIconClass(file.FileType);

  const $item = $(`
        <div class="attach-file" data-file-id="${file.FileId}" title="${file.FileSubject}">
            <a href="javascript:void(0)" class="download-link" style="text-decoration:none;">
                <i class="${iconClass}" style="font-size:35px; color:#555;"></i>
            </a>
        </div>
    `);

  // رویداد دانلود فقط برای همین آیتم
	$item.find(".download-link").on("click", function (e) {
	    e.preventDefault();
	    e.stopPropagation(); // جلوگیری از رسیدن رویداد به المنت والد
	    if (!file.FileContent) {
	        console.warn("هیچ محتوای فایل وجود ندارد");
	        return;
	    }
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
// نمایش فایلها با دسته بندی عکس pdf ,...
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
  if (["pdf"].includes(type)) return "fas fa-file-pdf"; // پی دی اف
  if (["doc", "docx"].includes(type)) return "fas fa-file-word"; // ورد
  if (["ppt", "pptx"].includes(type)) return "fas fa-file-powerpoint"; // پاورپوینت

  return "fas fa-file"; 
}

//********************************************************************************************************
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
//*******************************************************************************************************
//داده ای در جدول موجود نیست
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
//*******************************************************************************************************
//برای مودال مصوبات طولانی
function truncateText(text, maxWords = 15) {
    if (!text) return "-";
    const words = text.trim().split(/\s+/);
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
}

//#endregion Common.js
