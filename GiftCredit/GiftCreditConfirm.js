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
		readFromData = FormManager.readPersonnelGiftCredit,
		inEditMode = false;

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
				}
				DocumentId = dialogArguments["DocumentId"];
				CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
				InboxId = dialogArguments["WorkItem"]["InboxId"];
			}
	      build();
	      createControls();

		}
        //******************************************************************************************************	
		function build()
		{			
			//Set the new dialog title
	 	   changeDialogTitle(" تایید اعتبار هدیه");
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
			showLoading();
	        readFromData(
	            { Where: primaryKeyName + " = " + pk },
	            function (formData) {
	                if (!Array.isArray(formData) || formData.length === 0) {
	                    console.warn("داده فرم خالی است");
	                    hideLoading();
	                    return;
	                }
	                const giftCreditUserId = formData[0].GiftCreditForUserId;
	                // پرکردن فیلدهای فرم از فرم ثبت کننده اعتبار هدیه
	                $("#txtOfferedGiftCredit").val(commafy(formData[0].OfferedGiftCredit));
	                $("#txtDescription").val(formData[0].Description);
	                $("#txtGiftCreditForUserId").val(formData[0].GiftCreditForUserId);
	
	                // گرفتن اطلاعات کاربر اعتبار گیرنده
	                BS_GetUserInfo.Read(
	                    { Where: "UserId = " + giftCreditUserId },
	                    function (userData) {
	                        $("#txtFullName").val(getField(userData, "FullName", "fullName"));
	                        $("#txtUserName").val(getField(userData, "UserName", "UserName"));
	                        $("#txtUnitsName").val(getField(userData, "UnitsName", "UnitsName"));
	                        $("#txtRoleName").val(getField(userData, "RoleName", "RoleName"));
	                        
	                        // اگه CreatorActor_ID هم خواستی:
	                        const creatorActorId = getField(userData, "CreatorActor_ID", "CreatorActor_ID");
							tblPersonnelGiftCredit.refresh();
	                        hideLoading();
	                    },
	                    function (err) {
	                        handleError(err, "BS_GetUserInfo.Read");
	                    }
	                );
	            },
	            function (err) {
	                handleError(err, "readFromData");
	            }
	        );
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
		function refresh() {
           // element.find("tr.row-data").remove();
            load();
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
			refresh: refresh,
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
		// ==================== updateEntity ====================
	updatePersonnelGiftCredit: function(jsonParams, onSuccess, onError)
	{
		 BS_HR_PersonnelGiftCredit.Update(jsonParams
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
								Id: $(this).find("col[name='Id']").text(),
                                CreatedDate: $(this).find("col[name='CreatedDate']").text(),
								ConfirmedGiftCredit: $(this).find("col[name='ConfirmedGiftCredit']").text(),
								OfferedGiftCredit: $(this).find("col[name='OfferedGiftCredit']").text(),
								GiftCreditForUserId: $(this).find("col[name='GiftCreditForUserId']").text(),
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
    },
	//******************************************************************************************************
	InsertHamesh: function(jsonParams, onSuccess, onError)
	{
		SP_HameshInsert.Execute(jsonParams,
			function(data)
			{ 
				var xmlvar = null;
				var xmlvar = $.xmlDOM(data);
				if($.isFunction(onSuccess))
				{
					onSuccess(200);
				}
			},
			function(error) {
				var methodName = "InsertHamesh";

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
	SendEmail: function(jsonParams, onSuccess, onError)
	{
		SP_SendEmail.Execute(jsonParams,
			function(data)
			{ 
				var xmlvar = null;
				var xmlvar = $.xmlDOM(data);
				if($.isFunction(onSuccess))
				{
					onSuccess(200);
				}
			},
			function(error) {
				var methodName = "InsertHamesh";

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
	}
	//******************************************************************************************************
};
//#endregion

//#region btnDecline.js
$("#btnDecline").click(function(){
	var that = $(this);
	var hameshPopup = $(
		'<div tabindex="1" style="direction:rtl;" class="ui-form">'+
	     '<label tabindex="-1" style="text-align:right;" class="ui-form-label">لطفا دلیل مخالفت خود را بنویسید.</label>'+
	    '</div>'
	);
	var commentInput = $("<textarea>", {type: "text"}).addClass("comment-input form-control").css({height:"60px","font-size":"8pt",resize:"none"});
	hameshPopup.append(commentInput);
	
	var res = false;
	
	hameshPopup.dialog({
		buttons: [
			{
				text: "ثبت",
				click: function() {
					showLoading();
					if($(this).find('.comment-input').val().trim().length > 0){
					
						var hameshDescription = $(this).find('.comment-input').val();
						var params = {
							'Context': 'رد شد ('+hameshDescription+')',
							'DocumentId': DocumentId,
							'CreatorActorId': CurrentUserActorId,
							'InboxId': InboxId
						};
						
						FormManager.InsertHamesh(params,
							function(res)
							{
								Office.Inbox.setResponse(dialogArguments.WorkItem,0, "",
								 function(data)
								    { 
								        closeWindow({OK:true, Result:null});
								    }, function(err){ throw Error(err); }
								);
							}
						);
						
					}else{
						$(this).notify('لطفاً علت رد را وارد نمایید',{position:'top'});
						myHideLoading();
					}
				}
			},
			{
				text: "انصراف",
				click: function(){
					$(this).dialog("close");
				}
			}
		],
		open: function( event, ui ) {
			res = false;
		},
		close: function(e,u) {
			if( res == true ){
				
			}
			else{
				
			}
				
		}
	});
});
//#endregion

//#region btnAccept.js
$("#btnAccept").click(function () {
    validateIdeaForm(function () {
        let confirmedGiftCredit = $("#txtConfirmedGiftCredit").val().trim();
        confirmedGiftCredit = rcommafy ? rcommafy(confirmedGiftCredit) : confirmedGiftCredit.replace(/,/g, "");

        // مرحله اول: آپدیت مبلغ تایید شده
        let list = $.extend({ ConfirmedGiftCredit: confirmedGiftCredit }, { Where: "Id = '" + $form.getPK() + "'" });

        FormManager.updatePersonnelGiftCredit(
            list,
            function (status, list) {
                // مرحله دوم: ارسال ایمیل
                let userId = $("#txtGiftCreditForUserId").val();
                let emailList = {
                    'UserId': userId,
                    'EmailText': "<p dir='rtl'>همکار گرامی – اعتبار خرید 100% تخفیف به مبلغ '<b>" +
                                 confirmedGiftCredit +
                                 "</b>' ريال برای شما در خرید تکی و عمده محصولات لحاظ گردید.</p>",
                    'EmailSubject': 'اعتبار هدیه'
                };

                FormManager.SendEmail(
                    emailList,
                    function (data) {
                        // مرحله سوم: ثبت هامش
                        let params = {
                            'Context': 'تایید شد',
                            'DocumentId': DocumentId,
                            'CreatorActorId': CurrentUserActorId,
                            'InboxId': InboxId
                        };

                        FormManager.InsertHamesh(
                            params,
                            function () {
                                // مرحله چهارم: ران وورکفلو
                                Office.Inbox.setResponse(
                                    dialogArguments.WorkItem,1,"",
                                    function () {
                                        // مرحله پنجم: آپدیت اعتبار دوم پرسنل 
                                        let updatePersonnelCredit = { 'Id': $form.getPK() };
                                        FormManager.updatePersonnelCredit(
                                            updatePersonnelCredit,
                                            function (data) { console.log('ok'); },
                                            function (err) { $.alert("خطا در آپدیت هدیه: " + (err.message || "خطای ناشناخته"), "", "rtl"); }
                                        );

                                        // پیام موفقیت و بستن پنجره
                                        showSuccessAlert("اعتبار با موفقیت ثبت و ارسال شد", function () {
                                            closeWindow({ OK: true, Result: null });
                                        });
                                    },
                                    function (err) { throw Error(err); }
                                );
                            },
                            function (err) { throw Error(err); }
                        );
                    },
                    function (err) { throw Error(err); }
                );
            },
            function (error) {
                console.log("1خطای برگشتی:", error);
                $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
            }
        );
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
    var confirmedGiftCredit = $.trim($("#txtConfirmedGiftCredit").val());
    //  بررسی اجباری بودن مقدار اعتبار هدیه
    if (confirmedGiftCredit === '') {
        showAlertAndFocus('لطفا میزان اعتبار تایید شده را وارد کنید', '#txtConfirmedGiftCredit');
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
// Helper یکپارچه برای خواندن فیلد هم از JSON هم از XML
const getField = (data, jsonKey, xmlKey) => {
    if (!data) return "";
    return Array.isArray(data)
        // JSON
        ? (data[0][jsonKey] || data[0][jsonKey.toLowerCase()] || "")
        // XML
        : $.xmlDOM(data).find(`row:first > col[name='${xmlKey}']`).text();
};
//*****************************************************************************************************
function showSuccessAlert(message, callback) {
    $.alert(message, "", "rtl", function () {
        if (typeof callback === "function") {
            callback();
        }
    });
}



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
		    var params = { Where: "Id = " + $form.getPK() };
		    showLoading();
		
		    readRows(
		        params,
		        function(list) {
		            element.find("tr.row-data").remove();
		
		            if (list.length === 0) {
		                showNoDataRow();
		            } else {
		                for (var i = 0; i < list.length; i++) {
		                    addRow(list[i], i + 1);
		                }
		            }
		
		            hideLoading(); // اینجا بعد از پر شدن جدول
		        },
		        function(error) {
		            hideLoading(); // اینجا بعد از مواجهه با خطا
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