//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var html_;
var ProcessStatus;
var hire_this_year = 0;
var daysForHireDiff;

$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_MainData",
			readFromData = FormManager.readEntity,
			updateFromData = FormManager.updateEntity,
            insertFromData = FormManager.insertEntity;
		//******************************************************************************************************	
		function init()
		{
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
					readData();
				}
			}
			
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
		function createControls()
		{
			//-----------------------------------
			//	Get Test Mode Value
			//-----------------------------------
			try {
				const parentUrl = window.parent?.location?.href;
				const url = new URL(parentUrl);
		   	 isInTestMode = url.searchParams.get("icantestmode") === "1";
			  }
			  catch (e) {
			    console.warn("Cannot reach parent document:", e);
			    isInTestMode = false;
			  }
			//-----------------------------------
			
			UserService.GetCurrentActor(true,
				function(data){
					hideLoading();
					var xmlActor = $.xmlDOM(data);
					currentActorId = xmlActor.find('actor').attr('pk');
					var params = {Where: "ActorId = " + currentActorId};
					
					BS_GetUserInfo.Read(params
						, function(data)
						{
							var dataXml = null;
							if($.trim(data) != "")
							{
								dataXml = $.xmlDOM(data);
								fullName = dataXml.find("row:first").find(">col[name='fullName']").text();	
								userId =dataXml.find("row:first").find(">col[name='UserId']").text(); 						
								$("#txtFullName").val(fullName).prop('disabled', true);
								$("#txtActorIdCreator").val(userId).prop('disabled', true);
							}
						}
					);
				},
				function(err){
					hideLoading();
					$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
				}
			);
			$("#cmbUserPresent").data("user-field", "#txtPresentUserId").data("role-field", null);
			$("#cmbUserAbsent").data("user-field", "#txtAbsentUserId").data("role-field", null);
			$("#cmbResponsibleForAction").data("user-field", "#txtResponsibleUserId").data("role-field", null);
			
			requestAnimationFrame(() => {
			    fillComboWithService($("#cmbUserPresent"), BS_GetUserInfo, "انتخاب شخص");
			    fillComboWithService($("#cmbUserAbsent"), BS_GetUserInfo, "انتخاب غایبین");
			    fillComboWithService($("#cmbResponsibleForAction"), BS_GetUserInfo, "شخص مسئول", true); // ← اینجا true
			});


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
			validateForm(
				function()
				{
					if(inEditMode)
					{
						updateData(callback);
					}
					else
					{
						insertData(callback);
					}
				},
				function(errorMessage) {
		            $.alert(errorMessage || "لطفا موارد اجباری را تکمیل نمایید.", "", "rtl",
		                function() {}
		            );
		        }
			);
		}
		//******************************************************************************************************	
		function insertData(callback)
		{
		}
		//******************************************************************************************************	
		function updateData(callback)
		{
		}
		//******************************************************************************************************	
		function deleteData(callback)
		{
		}
		//******************************************************************************************************	
		function validateForm(onSuccess, onError)
		{
			try
			{
				if ($("#txtSubjectMeeting").val() == '' && $("#txtMeetingAgenda").val() == '') {
		            if ($.isFunction(onError)) {
		                onError("لطفا عنوان و دستورکار جلسه را وارد کنید!");
		            }
		            return;
		        }
				
				if ($("#txtLoanAmount").val() == '0' || $("#txtLoanAmount").val() == '') {
		            if ($.isFunction(onError)) {
		                onError("مبلغ وارد شده نامعتبر می باشد");
		            }
		            return;
		        }
				
				if ($("#txtReqDate").val() == '') {
		            if ($.isFunction(onError)) {
		                onError("لطفاً تاریخ موردنیاز را انتخاب نمایید");
		            }
		            return;
		        }
				
				
				var currentDate = new Date();
				var year = currentDate.getFullYear();
			    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
			    var day = currentDate.getDate().toString().padStart(2, '0');
				var currentDateFormatted = `${year}-${month}-${day}`;
							
				var [month2, day2, year2] = $("#txtReqDate").attr('gdate').split('/').map(Number);
				var selectedDate = `${year2.toString().padStart(4, '0')}-${month2.toString().padStart(2, '0')}-${day2.toString().padStart(2, '0')}`;
				
				if(selectedDate >= currentDateFormatted)
				{
					if ($.isFunction(onError)) {
		                onError("تاریخ انتخابی نمی تواند بزرگتر  از تاریخ روز جاری باشد");
		            }
		            return;
				}
				
				$("[role]").validateData(true);
				if($.isFunction(onSuccess))
				{
					onSuccess();
				}
			}
			catch(e)
			{
				if($.isFunction(onError))
				{
					onError(e.message);
				}
			}
		}
		//******************************************************************************************************

		//******************************************************************************************************	
		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			validateForm: validateForm,
			saveData: saveData
		};
	}());
	$form.init();
});
//#endregion

//#region btnTitleRegister.js
$(function () {
    // فعال کردن اسکرول در پنل
    $("#pnlTitles").css({
        "max-height": "150px", // یا هر اندازه‌ای که دوست داری
        "overflow-y": "auto",
        "direction": "rtl", // جهت اسکرول راست‌چین
        "padding-right": "5px",
        "box-sizing": "border-box",
        "border": "1px solid #ccc",
        "border-radius": "4px"
    });

    // رویداد کلیک دکمه ثبت مصوبه
    $("#btnTitleRegister").on("click", function () {
        var txt = $("#txtTitle").val().trim();

        if (!txt) {
            $.alert({
                title: '',
                content: 'لطفاً متن صورتجلسه را وارد کنید.',
                rtl: true,
                type: 'red'
            });
            return;
        }

        // ساخت آیتم جدید با Flexbox
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

        // متن صورتجلسه
        var $text = $("<div></div>").text(txt).css({
            flex: "1",
            paddingRight: "8px"
        });

        // دکمه ویرایش
        var $btnEdit = $("<button>ویرایش</button>").css({
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer",
            marginLeft: "5px"
        });

        // دکمه حذف
        var $btnDelete = $("<button>حذف</button>").css({
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer"
        });

        // رویداد ویرایش
        $btnEdit.on("click", function () {
            var editPopup = $(
                '<div style="direction:rtl;" class="ui-form">' +
                    '<label style="text-align:right; display:block; margin-bottom:5px;">' +
                        'لطفاً متن جدید صورتجلسه را وارد کنید:' +
                    '</label>' +
                '</div>'
            );

            var editInput = $("<textarea>", { type: "text" })
                .addClass("edit-input form-control")
                .css({
                    height: "60px",
                    "font-size": "10pt",
                    resize: "none"
                })
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
                            if (newText.length > 0) {
                                $text.text(newText);
                                $(this).dialog("close");
                            } else {
                                $(this).notify("لطفاً متن جدید مصوبه را وارد نمایید", {
                                    position: "top"
                                });
                            }
                        }
                    },
                    {
                        text: "انصراف",
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        });

        // رویداد حذف
        $btnDelete.on("click", function () {
            var deleteDialog = $('<div style="direction:rtl; font-size:10pt;">' +
                'آیا از حذف مصوبه اطمینان دارید؟' +
            '</div>');

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
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "خیر",
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        });

        // گروه دکمه ها
        var $btnGroup = $("<div></div>").css({
            display: "flex",
            flexShrink: "0"
        }).append($btnEdit).append($btnDelete);

        // ترکیب متن و دکمه ها
        $item.append($text).append($btnGroup);

        // افزودن به پنل
        $("#pnlTitles").append($item);

        // پاک کردن متن ورودی
        $("#txtTitle").val("");
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
// افزودن ایده پردازان

// تابع آپدیت کردن Hidden Fields
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

// تابع پر کردن کمبو
function fillComboWithService($combo, service, placeholderText, singleSelect = false) {
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

        // رویدادها
        $combo
            .off("select2:select").on("select2:select", e => {
                const d = e.params.data;
                if (singleSelect) {
                    // فقط به‌روزرسانی یوزرآیدی، همیشه یک نفر
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

    }, function (err) {
        alert("Service titles read error: " + err);
    });
}


//#endregion