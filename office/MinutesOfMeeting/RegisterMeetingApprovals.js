//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var html_;
var ProcessStatus;
var Items = [];
$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id";
		//******************************************************************************************************	
		function init()
		{
			build();
			createControls();
			bindEvents();
		}
        //******************************************************************************************************	
		function build()
		{
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
			$("#frmLoanRequest").css({top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px"});
						
			//Set the new dialog title
	 	   changeDialogTitle("ثبت صورتجلسه");
		}
		//******************************************************************************************************	
		function createControls() {
		    try {
		        const parentUrl = window.parent?.location?.href;
		        const url = new URL(parentUrl);
		        isInTestMode = url.searchParams.get("icantestmode") === "1";
		    } catch {
		        isInTestMode = false;
		    }
		
		    showLoading();
		
		    // پرومیس گرفتن Actor
		    const actorPromise = new Promise(resolve => {
		        UserService.GetCurrentActor(true, function (data) {
		            const xmlActor = $.xmlDOM(data);
		            currentActorId = xmlActor.find('actor').attr('pk');
		
		            const params = { Where: "ActorId = " + currentActorId };
		            BS_GetUserInfo.Read(params, function (data) {
		                if ($.trim(data) !== "") {
		                    const dataXml = $.xmlDOM(data);
		                    const fullName = dataXml.find("row:first col[name='fullName']").text();
		                    const userId = dataXml.find("row:first col[name='UserId']").text();
		                    $("#txtFullName").val(fullName).prop('disabled', true);
		                    $("#txtActorIdCreator").val(userId).prop('disabled', true);
		                }
		               

						 resolve();
		            });
		        }, function () {
		            resolve(); // خطا؟ مهم نیست، ادامه بده
		        });
		    });
			$("#cmbUserPresent").data("user-field", "#txtPresentUserId").data("role-field", null);
			$("#cmbUserAbsent").data("user-field", "#txtAbsentUserId").data("role-field", null);
			$("#cmbResponsibleForAction").data("user-field", "#txtResponsibleUserId").data("role-field", null);
		    // پرومیس کمبوها
		    const combosPromise = Promise.all([
		        fillComboWithService($("#cmbUserPresent"), BS_GetUserInfo, "انتخاب شخص"),
		        fillComboWithService($("#cmbUserAbsent"), BS_GetUserInfo, "انتخاب غایبین"),
		        fillComboWithService($("#cmbResponsibleForAction"), BS_GetUserInfo, "شخص مسئول", true)
		    ]);
		
		    // بستن لودینگ فقط وقتی هر دو تمام شد
		    Promise.all([actorPromise, combosPromise])
		        .finally(() => hideLoading());
		
		}

        //******************************************************************************************************	
		function bindEvents()
		{
		}
		//******************************************************************************************************	
		function readData()
		{
		}
		//******************************************************************************************************	
		function getPK()
		{
			return pk;
		}
		//******************************************************************************************************	
		function isInEditMode()
		{
			return inEditMode;
		}
		//******************************************************************************************************
			
		function saveData(callback)
		{ 
		}
		//******************************************************************************************************

		//******************************************************************************************************	
		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			saveData: saveData
		};
	}());
	$form.init();
});
//#endregion

//#region btnMinuteManagmentRegister.js
$(function () {
    // فعال کردن اسکرول در پنل
    $("#pnlManagmentDetail").css({
        "max-height": "150px",
        "overflow-y": "auto",
        "direction": "rtl",
        "padding-right": "5px",
        "box-sizing": "border-box",
        "border": "1px solid #ccc",
        "border-radius": "4px"
    });

    function logItems() {
        alert(JSON.stringify(Items, null, 2));
        console.log(Items);
    }

    $("#btnMinuteManagmentRegister").on("click", function () {
        var title = ($("#txtTitle").val() || "").trim();
        var UserId = ($("#txtResponsibleUserId").val() || "").trim();
        // به جای var actionDate = getGregorianDate();
		var gdateAttr = $("#txtActionDeadLineDate").attr("gdate");
		var actionDate = null;
		
		if (gdateAttr) {
		    let [m, d, y] = gdateAttr.split("/").map(Number);
		    actionDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
		} else {
		    let shamsiVal = ($("#txtActionDeadLineDate").val() || "").trim();
		    actionDate = shamsiVal ? shamsiToMiladiFormatted(shamsiVal) : null;
		}


		if (!title) {
			$.alert("لطفا متن مصوبه را وارد کنید","","rtl");
		    return;
		}
        // ساخت ساختار JSON
        var newItem = {
            Title: title,
            ActionDeadLineDate: actionDate,
            UserId: UserId
        };
        Items.push(newItem);

        // ساخت آیتم برای نمایش
        var $item = $("<div></div>").css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #ccc",
            margin: "4px 0",
            padding: "6px 10px",
            background: "#f9f9f9",
            borderRadius: "4px",
            boxSizing: "border-box",
            width: "100%"
        });

        var $text = $("<div></div>").text(title).css({ flex: "1", paddingRight: "8px" });

        var $btnEdit = $("<button>ویرایش</button>").css({
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer",
            marginLeft: "5px"
        }).on("click", function () {
            var editPopup = $('<div style="direction:rtl;" class="ui-form">' +
                '<label style="text-align:right; display:block; margin-bottom:5px;">' +
                'لطفاً متن جدید صورتجلسه را وارد کنید:' +
                '</label></div>'
            );
            var editInput = $("<textarea>").addClass("edit-input form-control")
                .css({ height: "60px", "font-size": "10pt", resize: "none" })
                .val($text.text());
            editPopup.append(editInput);

            editPopup.dialog({
                modal: true,
                width: 400,
                title: "ویرایش مصوبه جلسات",
                buttons: [
                    {
                        text: "ذخیره",
                        click: function () {
                            var newText = $(this).find(".edit-input").val().trim();
                            if (newText) {
                                $text.text(newText);
                                newItem.Title = newText;
                                $(this).dialog("close");
                            } else {
                                $(this).notify("لطفاً متن جدید مصوبه را وارد نمایید", {
                                    position: "top"
                                });
                            }
                        }
                    },
                    { text: "انصراف", click: function () { $(this).dialog("close"); } }
                ]
            });
        });

        var $btnDelete = $("<button>حذف</button>").css({
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer"
        }).on("click", function () {
            var deleteDialog = $('<div style="direction:rtl; font-size:10pt;">آیا از حذف مصوبه اطمینان دارید؟</div>');
            deleteDialog.dialog({
                modal: true,
                width: 350,
                title: "تأیید حذف",
                buttons: [
                    {
                        text: "بله",
                        class: "btn-red",
                        click: function () {
                            $item.remove();
                            Items = Items.filter(i => i !== newItem);
                            $(this).dialog("close");
                        }
                    },
                    { text: "خیر", click: function () { $(this).dialog("close"); } }
                ]
            });
        });

        var $btnGroup = $("<div></div>").css({ display: "flex", flexShrink: "0" })
            .append($btnEdit, $btnDelete);

        $item.append($text, $btnGroup);
        $("#pnlManagmentDetail").append($item);

        // پاک کردن ورودیها
        $("#txtTitle, #txtActionDeadLineDate, #txtResponsibleUserId").val("");
		$("#cmbResponsibleForAction").val("").trigger("change");

        // نمایش JSON
        logItems();
    });
});

//#endregion

//#region common.js
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
//******************************************************************************************************//***************************showLoading*********************************************
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

// تابع Hidden Fields
function updateHiddenFields($combo, userId, roleId, isAdd) {
    const userField = $combo.data("user-field");
    const roleField = $combo.data("role-field");

    // مدیریت UserId
    let userIds = $(userField).val().split(",").filter(Boolean);
    if (isAdd) {
        if (!userIds.includes(userId)) userIds.push(userId);
    } else {
        userIds = userIds.filter(id => id !== userId);
    }
    $(userField).val(userIds.join(","));

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
//-------------------------------------------------------------------------------------------
// تابع پر کردن کمبو

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
            resolve();  
        }, function (err) {
            alert("Service titles read error: " + err);
            resolve(); // حتی توی خطا هم آزاد کن
        });
    });
}
//---------------------------------------------------------------------------------------------
//#endregion

//#region formmanager.js
    var FormManager = {
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
                    var methodName = "retailPersonnelOrder";

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
        }
        //******************************************************************************************************
    };
//#endregion


