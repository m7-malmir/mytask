//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;
$(function(){
	$form = (function()
	{
		var pk,
		inTestMode = (typeof isInTestMode !== "undefined" ? isInTestMode : false),
		primaryKeyName = "Id",
		inEditMode = false;

		//******************************************************************************************************	
		function init()
		{
			build();
			createControls();
		}
        //******************************************************************************************************	
		function build()
		{			
			//Set the new dialog title
	 	   changeDialogTitle("درخواست اعتبار هدیه");
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
								ActorId = dataXml.find("row:first").find(">col[name='ActorId']").text();
								//خواندن اطلاعات کاربر جاری و نمایش 
								$("#txtCreatorActorId").val(ActorId).prop('disabled', true);						
								hideLoading();
							}
						}
					);
				},
				function(err){
					
					$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
				}
			);
			requestAnimationFrame(() => {
			    fillPersonCombo($("#cmbPersonSelect"), BS_GetUserInfo, "انتخاب شخص");
			    $('#pnlPersonSelect').css("height", "30px");
			});
		}
		//******************************************************************************************************
		function getPK()
		{
			return pk;
		}
		//******************************************************************************************************
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
		function isInEditMode()
		{
			return inEditMode;
		}
		//******************************************************************************************************
		// چک کردن url برای رفتن به حالت تست مود
		function isInTestMode() {
		    try {
		        const parentUrl = window.parent?.location?.href;
		        const url = new URL(parentUrl);
		        return url.searchParams.get("icantestmode") === "1";
		    } catch (e) {
		        console.warn("Cannot reach parent document:", e);
		        return false;
		    }
		}
		//******************************************************************************************************
		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			isInTestMode: isInTestMode
		};
	}());
	$form.init();
});
//#endregion

//#region formmanager.js
var FormManager = {
	//******************************************************************************************************
	// ==================== insertEntity ====================
	insertPersonnelGiftCredit: function(jsonParams, onSuccess, onError)
	{
		BS_HR_PersonnelGiftCredit.Insert(jsonParams,
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
				var methodName = "insertPersonnelGiftCredit";

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
	// ==================== readEntity ====================
    readPersonnelGiftCredit: function (jsonParams, onSuccess, onError) {
        BS_HR_PersonnelGiftCredit.Read(jsonParams,
            function (data) {
                var list = [];
                var xmlvar = $.xmlDOM(data);
                xmlvar.find("row").each(
                    function () {
                        list.push
                            ({
                                CreatedDate: $(this).find("col[name='CreatedDate']").text(),
								ConfirmedGiftCredit: $(this).find("col[name='ConfirmedGiftCredit']").text(),
								Description: $(this).find("col[name='Description']").text()
                            });
                    }
                );
                if ($.isFunction(onSuccess)) {
                    onSuccess(list);
                }
            },
            function (error) {
                var methodName = "readPersonnelGiftCredit";

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

//#region Common.js
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
function ErrorMessage(message,data) {
	$.alert(message);
	console.log('Data: '+list);
	hideLoading();
}
//******************************************************************************************************
function handleError(err,methodName) {
	console.error('Error On '+methodName, err); // چاپ خطا در کنسول
	alert('Error On '+ methodName +', '+ err);
	hideLoading();
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
		 hideLoading();
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
//***************************showLoading*********************************************
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
//**********************************hideLoading*****************************************************
function hideLoading() {
    $('#loadingBoxTweaked').fadeOut(180, function () { $(this).remove(); });
}
//**************************************************************************************************
function isFullDescriptionValid(str){
    const regex = /^[\u0600-\u06FFa-zA-Z0-9\s.,\-_،]+$/;
    return regex.test(str.trim());
}
//************************* select 2 ***************************************************************
function fillPersonCombo($combo, service, placeholderText) {
    showLoading();
    service.Read({}, function (data) {
        var xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);

        var list = xmlData.find("row").toArray().map(function (row) {
            var $row = $(row);
            return {
                id:        $row.find("col[name='ActorId']").text(),
                text:      $row.find("col[name='fullName']").text(),
                userName:  $row.find("col[name='UserName']").text(),
                unitsName: $row.find("col[name='UnitsName']").text(),
                roleName:  $row.find("col[name='RoleName']").text(),
                userId:    $row.find("col[name='UserId']").text(),
                roleId:    $row.find("col[name='RoleId']").text()
            };
        });
        list.unshift({ id: '', text: 'انتخاب شخص' }); // گزینه پیش‌فرض

        $combo.empty().select2({
            data: list,
            dir: "rtl",
            placeholder: placeholderText || 'انتخاب شخص',
            matcher: (params, data) => {
                if (!params.term) return data;
                return (data.text && data.text.includes(params.term)) ||
                       (data.userName && data.userName.includes(params.term))
                       ? data : null;
            }
        }).on('select2:select', e => {
            const person = e.params.data;
            $('#txtUserName').val(person.userName || '');
            $('#txtUnitsName').val(person.unitsName || '');
            $('#txtRoleName').val(person.roleName || '');
            $('#txtGiftCreditForUserId').val(person.userId || '');
            tblPersonnelGiftCredit.refresh();
        });
        // بستن لودینگ با تاخیر یک فریم برای جلوگیری از پرش
        requestAnimationFrame(() => hideLoading());
    });
}
//******************************************************************************************************
// تابع کمکی برای نمایش پیام و فوکوس بعد از بسته شدن alert
function showAlertAndFocus(message, selector) {
    $.alert(message, '', 'rtl', function () {
        if (selector) {
            $(selector).focus();
        }
    });
}
//******************************************************************************************************
function validateIdeaForm() {
    //  گرفتن مقادیر و trim کردن قبل از بررسی
    var giftCreditForUserId = $.trim($("#txtGiftCreditForUserId").val());
    var offeredGiftCredit   = $.trim($("#txtOfferedGiftCredit").val());

    //  بررسی اجباری بودن انتخاب شخص
    if (giftCreditForUserId === '') {
        showAlertAndFocus('لطفا شخص مورد نظر را انتخاب کنید', '#cmbPersonSelect');
        // بعد از کمی تاخیر، کمبو رو باز کنیم (برای هماهنگی با alert)
        setTimeout(() => {
            $('#cmbPersonSelect').select2('open');
        }, 50);
        return false;
    }

    //  بررسی اجباری بودن مقدار اعتبار هدیه
    if (offeredGiftCredit === '') {
        showAlertAndFocus('لطفا میزان اعتبار هدیه را وارد کنید', '#txtOfferedGiftCredit');
        return false;
    }
    return true;
}
//******************************************************************************************************
// تبدیل تاریخ
function getFullDateTime() {
    var now = new Date();

    var year      = now.getFullYear();
    var month     = String(now.getMonth() + 1).padStart(2, '0');
    var day       = String(now.getDate()).padStart(2, '0');
    var hours     = String(now.getHours()).padStart(2, '0');
    var minutes   = String(now.getMinutes()).padStart(2, '0');
    var seconds   = String(now.getSeconds()).padStart(2, '0');
    var millis    = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${millis}`;
}
//******************************************************************************************************

//#endregion

//#region btnRegister.js
$("#btnRegister").click(function () {
    // فراخوانی تابع ولیدیشن برای فرم
    if (!validateIdeaForm()) return;


 // گرفتن مقادیر و trim کردن قبل ارسال
var creatorActorId      = $.trim($("#txtCreatorActorId").val());
var giftCreditForUserId = $.trim($("#txtGiftCreditForUserId").val());
var offeredGiftCredit   = $.trim($("#txtOfferedGiftCredit").val());
var description         = $.trim($("#txtDescription").val());
var createdDate         = getFullDateTime(); // تاریخ دقیق میلادی

    var insertParams = {
        CreatorActorId:      creatorActorId,
        GiftCreditForUserId: giftCreditForUserId,
        OfferedGiftCredit:   rcommafy(offeredGiftCredit),
		ConfirmedGiftCredit: rcommafy(offeredGiftCredit),
        Description:         description
    };

    FormManager.insertPersonnelGiftCredit(
        insertParams,
        function (dataXml) {
            var pk = dataXml.find("row:first > col[name='Id']").text();
            WorkflowService.RunWorkflow(
                "ZJM.GCR.GiftCreditProcess",
                '<Content><Id>' + pk + '</Id><IsInTestMode>' + $form.isInTestMode() + '</IsInTestMode></Content>',
                true,
                function (data) { handleRunWorkflowResponse(data); },
                function (err) { handleError(err, 'WorkflowService.RunWorkflow'); }
            );  
        },
        function (err) {
            hideLoading();
            alert(err);
        }
    );
});
//#endregion

//#region tblPersonnelGiftCredit.js
var tblPersonnelGiftCredit = null;

$(function() {
    tblPersonnelGiftCredit = (function() {
        //خواندن پارامترهای اصلی جدول
        var element = null,
            isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readPersonnelGiftCredit;
        //فراخوانی سازنده جدول
        init();
        //******************************************************************************************************
        function init() {
            element = $("#tblPersonnelGiftCredit");
            load();
        }
        /* *********************************************************************************************** */
        // عملیات پر کردن دیتای هر سطر می باشد
       function load() {
		    var giftCreditForUserId = $.trim($("#txtGiftCreditForUserId").val() || '');
		
		    element.find("tr.row-data").remove();
		
		    if (!giftCreditForUserId) {
		        showNoDataRow();
		        return;
		    }
		    var params = { Where: "GiftCreditForUserId = " + giftCreditForUserId };
		    showLoading();
		
		    readRows(params,
		        function(list) {
		            element.find("tr.row-data").remove();
		
		            if (list.length === 0) {
		                showNoDataRow();
		            } else {
		                for (var i = 0; i < list.length; i++) {
		                    addRow(list[i], i + 1);
		                }
		                hideLoading();
		            }
		        },
		        function(error) {
		            hideLoading();
		            alert(error);
		        }
		    );
		}
		function addRow(rowInfo, rowNumber) {
		    var index = 0,
		    tempRow = element.find("tr.row-template").clone();
		    tempRow.show().removeClass("row-template").addClass("row-data");
		    tempRow.data("rowInfo", rowInfo);
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
		    tempRow.find("td:eq(" + index++ + ")").empty().text(formatGregorianToJalali(rowInfo.CreatedDate));
		    tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.ConfirmedGiftCredit));
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Description);
		    tempRow.attr({ state: "new" });
		
		    element.find("tr.row-template").before(tempRow);
		}
		function showNoDataRow() {
		    // colspan رو برابر تعداد ستون‌ها بذار
		    element.append('<tr class="row-data"><td colspan="4" style="text-align:center;color:#999;">داده‌ای یافت نشد!</td></tr>');
		    hideLoading();
		}
        //******************************************************************************************************
        //بروز رسانی دیتای جدول
        function refresh() {
            element.find("tr.row-data").remove();
            load();
        }
        //******************************************************************************************************
        return {
            refresh: refresh,
            load: load
        };
    }());
});
//#endregion