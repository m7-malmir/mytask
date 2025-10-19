//#region Ready.js
// ===================== Public variables =====================
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;
var pk;

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
	      changeDialogTitle("بررسی و تایید مصوبات جلسه");
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
			    //  در غیر این صورت از سرویس 
			    UserService.GetCurrentActor(true, function (data) {
			        let xmlActor = $.xmlDOM(data);
			        currentActorId = xmlActor.find('actor').attr('pk');
			    }, function (error) {
			        console.error("خطا در دریافت Actor:", error);
			    });
			}
			
			FormManager.readMeetingMinuteManagment(
			    { Where: "Id = " + pk },
			    function (list) { // اینجا به خاطر منطق تابع شما، list آرایه ای از رکوردهاست
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
			        const CreatedDate = data.CreatedDate; // اگر توی سرویس برگرده
			
			        // مقداردهی به فیلدها
			        $("#txtFullName").val(fullName).prop("disabled", true);
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

//#endregion EDN Ready.js 

//#region formmanager.js
var FormManager = {
	
//******************************************************************************************************
	readMeetingMinuteManagment: function(jsonParams, onSuccess, onError)
	{
	  BS_vw_MM_MeetingMinuteManagment.Read(jsonParams
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
						fullName: $(this).find("col[name='fullName']").text(),
						CreatedDate: $(this).find("col[name='CreatedDate']").text(),
						MeetingStartTime: $(this).find("col[name='MeetingStartTime']").text(),
						MeetingStartTime: $(this).find("col[name='MeetingStartTime']").text(),
					    MeetingEndTime: $(this).find("col[name='MeetingEndTime']").text(),
					    SubjectMeeting: $(this).find("col[name='SubjectMeeting']").text(),
					    MeetingAgenda: $(this).find("col[name='MeetingAgenda']").text(),
					    Title: $(this).find("col[name='Title']").text(),
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
	readMeetingMinuteManagmentDetailAction: function(jsonParams, onSuccess, onError)
	{
	  BS_vw_MM_MeetingMinuteManagmentDetailAction.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						DetailActionId: $(this).find("col[name='DetailActionId']").text(),
		                MeetingMinuteDetailId: $(this).find("col[name='MeetingMinuteDetailId']").text(),
						ActorId: $(this).find("col[name='ActorId']").text(),
		                IsAccepted: $(this).find("col[name='IsAccepted']").text(),
						MeetingManagmentId: $(this).find("col[name='MeetingManagmentId']").text(),
						Title: $(this).find("col[name='Title']").text(),
						CreateDate: $(this).find("col[name='CreateDate']").text(),
						IsLock: $(this).find("col[name='IsLock']").text(),
						ActionDeadLineDate: $(this).find("col[name='ActionDeadLineDate']").text(),
						ResponsibleForActionName: $(this).find("col[name='ResponsibleForActionName']").text(),
						DetailActionDescription: $(this).find("col[name='DetailActionDescription']").text()
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
	updateMeetingMinuteManagmentDetailAction: function(jsonParams, onSuccess, onError)
	{
		 BS_MeetingMinuteManagmentDetailAction.Update(jsonParams
			, function(data)
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
				var methodName = "deleteEntity";

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
//******************************************************************************************************
    meetingMinuteManagmentDetaiActionLogInsert: function (jsonParams, onSuccess, onError) {
        SP_MeetingMinuteManagmentDetaiActionLogInsert.Execute(jsonParams,
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
                var methodName = "meetingMinuteManagmentDetaiActionLogInsert";

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
};

//#endregion EDN formmanager.js 

//#region  tblMinuteManagment.js
$(function () {
    tblMinutesMeeting = (function () {
        // ====================== Variables ======================
        const rowNumber = 15;
        const meetingMinuteManagment = FormManager.readMeetingMinuteManagmentDetailAction;
        let element = null;
        let rowPrimaryKeyName = "Id";

        init();

        // ======================= Init ==========================
        function init() {
            element = $("#tblMinutesMeeting");
            bindEvents();
            load();
        }

        // ==================== Bind Events ======================
        function bindEvents() {
            // =========== نمایش نظرات در پاپ آپ هیستوری ================
            $("#tblMinuteManagment").on("click", ".comment-icon", function () {
                const $row = $(this).closest("tr");
                const recordId = $row.find("td").eq(2).text().trim();
                console.log("recordId for comments:", recordId);

                $.showModalForm(
                    {
                        registerKey: "ZJM.MOM.MinutesMeetingHistoryDetails",
                        params: { Id: recordId }
                    },
                    function () {
                        tblMinuteManagment.refresh();
                    }
                );
            });

            // ===================== تأیید / رد مصوبه =====================
            $("#tblMinuteManagment").on("change", ".confirm-select", function () {
                const $select = $(this);
                const val = $select.val();
                const $row = $select.closest("tr");
                const tds = $row.find("td");
                const detailActionId = tds.eq(1).text().trim();
                const $descCell = tds.eq(9);
                $descCell.empty();

                if (val === "1") {
                    // --- تأیید ---
                    const list = { IsAccepted: 1, Where: "Id = '" + detailActionId + "'" };
                    FormManager.updateMeetingMinuteManagmentDetailAction(
                        list,
                        function () { /* ok */ },
                        function (err) {
                            console.error("خطا در تایید:", err);
                            $descCell.text("خطا در ثبت تایید");
                            $.alert("خطا در ثبت تایید: " + (err.message || "خطای ناشناخته"), "", "rtl");
                        }
                    );
                } else if (val === "0") {
                    // --- رد ---
                    const hameshPopup = $(`
                        <div style="direction:rtl;text-align:right;" class="ui-form">
                            <label style="font-size:9pt;">لطفاً دلیل مخالفت خود را بنویسید:</label><br>
                        </div>
                    `);

                    const commentInput = $("<textarea>")
                        .addClass("comment-input form-control")
                        .css({ height: "70px", fontSize: "9pt", resize: "none", width: "95%" });

                    hameshPopup.append(commentInput);

                    hameshPopup.dialog({
                        modal: true,
                        title: "دلیل رد مصوبه",
                        width: 420,
                        buttons: [
                            {
                                text: "ثبت",
                                click: function () {
                                    const reason = commentInput.val().trim();
                                    if (!reason) {
                                        $(this).notify("لطفاً دلیل رد را وارد نمایید", { position: "top" });
                                        return;
                                    }
                                    showLoading();
                                    const reasonLabel = $("<label/>", {
                                        "class": "reject-reason-label",
                                        text: reason,
                                        css: {
                                            fontSize: "inherit",
                                            color: "#c00",
                                            fontWeight: "600",
                                            display: "inline-block",
                                            padding: "2px 6px"
                                        }
                                    });

                                    $descCell.empty().append(reasonLabel);

                                    let list = { Description: reason, IsAccepted: 0 };
                                    list = $.extend(list, { Where: "Id = '" + detailActionId + "'" });

                                    FormManager.updateMeetingMinuteManagmentDetailAction(
                                        list,
                                        function () {
                                            hideLoading();
											$select.val("0");
                                        },
                                        function (error) {
                                            hideLoading();
                                            console.error("خطا در رد:", error);
                                            $.alert("خطا در ثبت دلیل رد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                                        }
                                    );

                                    $(this).dialog("close");
                                }
                            },
                            {
                                text: "انصراف",
                                click: function () {
                                    $(this).dialog("close");
                                    $select.val("").trigger("change");
                                }
                            }
                        ]
                    });
                } else {
                    // --- نامشخص ---
                    $descCell.empty();
                }
            });


            // ===================== پاپ آپ توضیحات طولانی =====================
            $("#tblMinuteManagment").off("click", ".minute-text-cell").on("click", ".minute-text-cell", function () {
	                const fullText = $(this).data("fulltext") || "-";
	                const fullTextPopup = $(`
	                    <div style="direction:rtl;text-align:right;" class="ui-form">
	                        <textarea readonly
	                      style="height:180px;font-size:9pt;resize:none;width:98%;background-color:#f9f9f9;cursor:default;">${fullText}</textarea>
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
	        }

        // ====================== Add Row ========================
        function addRow(rowInfo, rowIndex) {
            const tempRow = $("#tblMinuteManagment").find("tr.row-template").first().clone();
            tempRow.removeClass("row-template").addClass("row-data").show();
            const tds = tempRow.find("td");

            tds.eq(0).text(rowIndex).attr("align", "center");
            tds.eq(1).text(rowInfo.DetailActionId || "");
            tds.eq(2).text(rowInfo.MeetingMinuteDetailId || "");
            tds.eq(3).text(rowInfo.MeetingManagmentId || "");

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

            // --- اقدام کننده ---
            tds.eq(5).text(rowInfo.ResponsibleForActionName || "-");

            // --- تاریخ اقدام ---
            if (rowInfo.ActionDeadLineDate) {
                tds.eq(6).text(formatMiladiToShamsi(rowInfo.ActionDeadLineDate));
            } else {
                tds.eq(6).text("-");
            }

            // --- نظرات ---
            const infoIcon = $('<i class="fa fa-info-circle comment-icon" style="cursor:pointer;"></i>')
                .attr("data-id", rowInfo.DetailActionId || "");
            tds.eq(7).empty().append(infoIcon);

            // --- سلکت تأیید/رد ---
			if (rowInfo.IsLock == 'true') {
			    // اگر قفل بود فقط متن تأیید بنویس
			    tds.eq(8).empty().text("تأیید");
			} else {
			    // در غیر این صورت سلکتور معمولی را بساز
			    const confirmSelect = $('<select class="confirm-select"/>')
			        .append('<option value="">نامشخص</option>')
			        .append('<option value="1">تأیید</option>')
			        .append('<option value="0">رد</option>')
			        .css({ fontSize: "inherit", height: "auto", padding: "2px 4px" });
			
			    let isAccepted = rowInfo.IsAccepted;
			    if (isAccepted === true || isAccepted === "true" || isAccepted === 1 || isAccepted === "1") {
			        isAccepted = "1";
			    } else if (isAccepted === false || isAccepted === "false" || isAccepted === 0 || isAccepted === "0") {
			        isAccepted = "0";
			    } else {
			        isAccepted = "";
			    }
			
			    confirmSelect.val(isAccepted);
			    tds.eq(8).empty().append(confirmSelect);
			}
            // --- ستون توضیحات ---
            tds.eq(9).empty().text(rowInfo.DetailActionDescription || "");

            // درج قبل از row-template
            $("#tblMinuteManagment tbody tr.row-template").before(tempRow);
        }

        // ======================== Load =========================
        function load() {
            const pk = $form.getPK();

            if (!pk || !currentActorId) return;

            const params = {
                Where: `MeetingManagmentId = '${pk}' AND ActorId = '${currentActorId}'`
            };

            meetingMinuteManagment(
                params,
                function (list) {
                    try {
                        if (Array.isArray(list) && list.length > 0) {
                            const $tbl = $("#tblMinuteManagment");
                            $tbl.find("tr.no-data-row").remove();
                            list.forEach((row, index) => addRow(row, index + 1));
                            pagination($tbl, rowNumber);
                        } else {
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

        // ======================= Return ========================
        return {
            refresh: refresh,
            load: load,
            readRows: meetingMinuteManagment
        };
    }());
});

//#endregion tblMinuteManagment.js

//#region Common.js
function commafy(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/*****************************************************************************************/
function rcommafy(x) {
  a = x.replace(/\,/g, ""); // 1125, but a string, so convert it to number
  a = parseInt(a, 10);
  return a;
}

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
// ====== handleRunWorkflowResponse =======
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
// ====== changeDialogTitle =======
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
//********************************************************************************************
// ====== showLoading =======
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
// ====== تابع فراخوانی فایلهای مرتیط با صورتجلسه =======
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
// ====== کدهای UI افزودن ایکن فایل به فرم =======
function addAttachmentToFieldset(file) {
  const $container = $("#gbxDocuments");
  const iconClass = getFileIconClass(file.FileType);

  const $item = $(`
        <div data-file-id="${file.FileId}" title="${file.FileName}"
            style="
                display:inline-flex;
                flex-direction:column;
                align-items:center;
                width:40px;
                margin: 15px 10px 0px 5px;
                padding:3px;
                border:1px solid #ccc;
                border-radius:4px;
                background:#fff;
                position:relative;
                font-family:Tahoma;
                font-size:8pt;">
            <a href="javascript:void(0)" class="download-link" style="text-decoration:none;">
                <i class="${iconClass}" style="font-size:35px; color:#555;"></i>
            </a>
        </div>
    `);

  // رویداد دانلود فقط برای همین آیتم
  $item.find(".download-link").on("click", function (e) {
    e.preventDefault();
    downloadBase64(file.FileContent, file.FileSubject, file.FileType);
  });

  $container.append($item);
}
//*******************************************************************************************************
// ====== دانلود فایل موجود در فرم با کلیک =======
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
// ====== گرفتن فرمت لازم برای نمایس انوع ایکن متناسب با نوع فایل =======
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
//*******************************************************************************************************
// ====== تبدیل تاریخ میلادی به شمسی با حذف تاریخ‌های پیش فرض=======
function safeShamsiDate(miladiDate) {
  if (!miladiDate || typeof miladiDate !== "string" || !miladiDate.trim())
    return "";
  if (miladiDate.startsWith("0001") || miladiDate.startsWith("1900")) return "";
  return formatMiladiToShamsi(miladiDate);
}
//*******************************************************************************************************


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
// end table
//برای مودال مصوبات طولانی
function truncateText(text, maxWords = 15) {
    if (!text) return "-";
    const words = text.trim().split(/\s+/);
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
}


//#endregion Common.js

//#region btnRegister.js
$("#btnRegister").on("click", function (e) {
    e.preventDefault();
    let invalidRows = [];
    $("#tblMinuteManagment tr.row-data").each(function () {
        const $row = $(this);
        const confirmValue = $row.find("select.confirm-select").val();
        if (confirmValue === "") {
            invalidRows.push($row);
        }
    });
	if (invalidRows.length > 0) {
	    // افکت چشمک زن برای ردیفهای ناقص
	    invalidRows.forEach($row => {
	        $row.addClass("row-invalid");
	        setTimeout(() => $row.removeClass("row-invalid"), 1500);
	    });
	
	    // اسکرول خودکار به اولین ردیف نامعتبر در div اسکرول‌دار
	    const $firstInvalidRow = invalidRows[0];
	    const $scrollContainer = $("#tblMinuteManagmentArea"); 
	
	    // محاسبه موقعیت نسبی ردیف داخل کانتینر و اسکرول نرم
	    $scrollContainer.animate({
	        scrollTop: $scrollContainer.scrollTop() + $firstInvalidRow.position().top - 40
	    }, 400);
	
	    $.alert(
	        'لطفاً وضعیت تأیید یا رد را در تمام ردیف ها مشخص کنید!',
	        "",
	        "rtl"
	    );
	    return;
	}
    const pk = $form.getPK();
    const list = {
        MeetingManagmentId: pk,
        ActorId: currentActorId
    };

    // اجرای سرویس فقط اگر هیچ ردیف نامشخص نیست
	FormManager.meetingMinuteManagmentDetaiActionLogInsert(
	    list,
	    function (status, list) {
		  const responseCode = status && status.ResponseValue ? status.ResponseValue : "0";
		  Office.Inbox.setResponse(
	            dialogArguments.WorkItem,
	            responseCode,
	            "",
	            function (data) {
	                $.alert("فرم ثبت و ارسال شد", "", "rtl", function () {
	                    closeWindow({
	                        OK: true,
	                        Result: null
	                    });
	                }); 
	            }
	        ); 	
	    },
	    function (err) {
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