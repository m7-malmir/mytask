//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;

//--------------------------------------
//-- تعریف ثابت ها برای پر کردن اینپوتها
//--------------------------------------
const fieldMap = {
  // Textboxes
  IdeaNo: "txtIdeaNo",
  IdeaSubject: "txtIdeaSubject",
  FullDescription: "txtFullDescription",
  ResponsibleForImplementation: "txtResponsibleForImplementation",
  ReasonForResponsible: "txtReasonForResponsible",
  OtherImprovement: "txtOtherImprovementTargrt",
  OtherInovations: "txtOtherInovations",
  AdditionalInformation: "txtOtherImprovement",
  CreatedDate: "txtRegistrationDate",
  CompletingTheIdeaDescription: "txtCompletingTheIdeaDescription",
  
  // Checkbox2
  BusinessModels: "chbBusinessModels",
  OptimizationOfOrganization: "chbOptimizationOfOrganization",
  MotivatingEmployees: "chbMotivatingEmployees",
  FinancialStructue: "chbFinancialStructue",
  KnowledgeManagment: "chbKnowledgeManagment",
  InformationTechnology: "chbInformationTechnology",
  MarketingAndBranding: "chbMarketingAndBranding",
  InteractAndCommunicating: "chbInteractAndCommunicating",
  ImprovePerformance: "chbImprovePerformance",

  // Checkbox3
  IncreaseIncome: "chbIncreaseIncome",
  IncreaseEffectiveness: "chbIncreaseEffectiveness",
  AccelerationOfProcesses: "chbAccelerationOfProcesses",
  FacilitateProcesses: "chbFacilitateProcesses",
  CreatingMotivationWorkplace: "chbCreatingMotivationWorkplace",
  PromoteEmployerBrand: "chbPromoteEmployerBrand",
  ReduceBusinessThreats: "chbReduceBusinessThreats",
  ReduceBusinessSafetyRisks: "chbReduceBusinessSafetyRisks",
  ReduceWaste: "chbReduceWaste",
  QualityImprovement: "chbQualityImprovement",
  ReducingFoodSafetyRisks: "chbReducingFoodSafetyRisks"
};
//--------------------------------------
$(function() {

  $form = (function() {
    var pk;
    var inTestMode = (typeof isInTestMode !== "undefined" ? isInTestMode : false);
    var primaryKeyName = "Id";
    var readFromData = FormManager.readIdeaRegistration;
    var inEditMode = false;

    //*************************        INIT         *****************************
	function init() {
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
				$("#lblIdeaRequestID").text(pk);
			}
			DocumentId = dialogArguments["DocumentId"];
			CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
			InboxId = dialogArguments["WorkItem"]["InboxId"];
		}
      build();
      createControls();
	}

    //*************************        BUILD         ****************************
    function build() {
      //Set the new dialog title
      changeDialogTitle("تکمیل ایده/پیشنهاد");
    }

    //*************************    CREATE CONTROLS    **************************
	//تغییر کمبوباکس نوع ایده
	$("#cmbIdeaType").on("change", toggleInnovationGroup);
	
	function createControls() {
	    showLoading();
	
	    getCurrentActorPromise()
	        .then(() => readIdeaRegistrationPromise({ Where: primaryKeyName + " = " + pk }))
	        .then(dataXmlArr => {
	            const data = dataXmlArr[0];
	            fillAllFields(data);
	
	            if (data.IdeaType) {
	                const match = $("#cmbIdeaType option[ideatype='" + String(data.IdeaType).trim() + "']");
	                if (match.length) {
	                    $("#cmbIdeaType").val(match.val());
	                    toggleInnovationGroup(); // اجرا مطمئن بعد از پیدا شدن
	                } else {
	                    console.warn(" گزینه ایده مطابق پیدا نشد:", data.IdeaType);
	                }
	            }
	
	            const userIdIdeasList = parseUserIdIdeas(data.UserIdIdeas);
	            const creatorUserId = data.CreatorUserId;
	            const ideatorData = [];
	
	            return Promise.all([
	                loadIdeators(userIdIdeasList, ideatorData),
	                loadCreatorUser(creatorUserId)
	            ]).then(() => initIdeaGeneratorsCombo(ideatorData));
	        })
	        .catch(err => {
	            $ErrorHandling.Erro(err, "خطا در سرویس‌ها");
	        })
	        .finally(() => {
	            hideLoading();
	        });
	}
    //*********************************************************************************
    function getPK() {
      return pk;
    }
	//*********************************************************************************
    function isInEditMode() {
      return inEditMode;
    }
	//*********************************************************************************
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

    //*************************************************************************************
    return {
      init: init,
      getPK: getPK,
      isInEditMode: isInEditMode,
      isInTestMode: isInTestMode
    };
    //*************************************************************************************
  }());
  $form.init();

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
function myHideLoading(){
	$("#__modalPage").css('display', 'none');
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
//******************************************************************************************************
      //-----------------------------------------------
      //-----  تابع افزودن دیتا به آبجکت های فرم  ----
      //-----------------------------------------------
function fillAllFields(data) {
    Object.entries(fieldMap).forEach(([dataKey, elementId]) => {
        const value = data[dataKey];
        const el = document.getElementById(elementId);

        if (!el) return;

        const isHiddenTextField =
            elementId === "txtOtherInovations" || elementId === "txtOtherImprovementTargrt";

        if (el.type === "checkbox") {
            el.checked = value === "true" || value === "1";
        } else {
            if (isHiddenTextField) {
                if (value && value.trim() !== "") {
                    // فقط اگر مقدار داشت، نشون بده و مقدار ست کن
                    el.style.display = "block";
                    el.value = value;
                } else {
                    // مقدار نداشت، پنهان بمونه
                    el.style.display = "none";
                }
            } else {
                // فیلدهای معمولی
                el.value = value || "";
            }
        }
    });
}

//-----------------------------------------------
function isFullDescriptionValid(str){
    const regex = /^[\u0600-\u06FFa-zA-Z0-9\s.,\-_،]+$/;
    return regex.test(str.trim());
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

function hideLoading() {
    $('#loadingBoxTweaked').fadeOut(180, function () { $(this).remove(); });
}
//*****************************************************************************************
function getCurrentActorPromise() {
  return new Promise((resolve, reject) => {
    UserService.GetCurrentActor(true, resolve, reject);
  });
}
function readIdeaRegistrationPromise(params) {
  return new Promise((resolve, reject) => {
    FormManager.readIdeaRegistration(params, function(dataXml) {
      resolve(dataXml);
    });
  });
}
function getUserInfoPromise(params) {
  return new Promise((resolve, reject) => {
    BS_GetUserInfo.Read(params, function(response) {
      resolve(response);
    });
  });
}
//*********************************************************************************************
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
//*********************************************************************************************
 function toJalali(gy, gm, gd) {
        var g_d_m = [
            0,
            31,
            (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0) ? 29 : 28,
            31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ];
        gy = parseInt(gy);
        gm = parseInt(gm);
        gd = parseInt(gd);
        var jy, jm, jd;
        var gy2 = gm > 2 ? gy + 1 : gy;
        var days =
            355666 +
            365 * gy +
            parseInt((gy2 + 3) / 4) -
            parseInt((gy2 + 99) / 100) +
            parseInt((gy2 + 399) / 400) +
            gd;
        for (var i = 0; i < gm; ++i) days += g_d_m[i];
        jy = -1595 + 33 * parseInt(days / 12053);
        days %= 12053;
        jy += 4 * parseInt(days / 1461);
        days %= 1461;
        if (days > 365) {
            jy += parseInt((days - 1) / 365);
            days = (days - 1) % 365;
        }
        var jmList = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
        for (jm = 1; jm <= 12 && days >= jmList[jm]; jm++) {
            days -= jmList[jm];
        }
        jd = days + 1;
        return [jy, jm, jd];
    }
//*********************************************************************************************
//-----------------------------------------------------
//--------------توابع کمکی برای create controls -------
//-----------------------------------------------------
// تبدیل رشته UserIdIdeas به آرایه 
function parseUserIdIdeas(userIdIdeas) {
    return (userIdIdeas || "")
        .split(",")
        .map(id => id.trim())
        .filter(Boolean);
}

// گرفتن لیست ایده پردازان اولیه
function loadIdeators(userIdIdeasList, ideatorData) {
    const promises = userIdIdeasList.map(userId =>
        getUserInfoPromise({ Where: "UserId = " + userId })
            .then(response => {
                if ($.trim(response) !== "") {
                    const dataXml = $.xmlDOM(response);
                    ideatorData.push({
                        id: dataXml.find("row:first > col[name='ActorId']").text(),
                        text: dataXml.find("row:first > col[name='fullName']").text(),
                        userId: userId,
                        roleId: dataXml.find("row:first > col[name='RoleId']").text()
                    });
                }
            })
    );
    return Promise.all(promises);
}

// گرفتن اطلاعات صاحب ایده
function loadCreatorUser(creatorUserId) {
    return getUserInfoPromise({ Where: "UserId = " + creatorUserId })
        .then(response => {
            if ($.trim(response) !== "") {
                const dataXml = $.xmlDOM(response);
                $("#txtCreatorUserId").val(dataXml.find("col[name='UserId']").text()).prop("disabled", true);
                $("#txtFullName").val(dataXml.find("col[name='fullName']").text()).prop("disabled", true);
                $("#txtPersonnel").val(dataXml.find("col[name='UserName']").text()).prop("disabled", true);
                $("#txtUnits").val(dataXml.find("col[name='UnitsName']").text()).prop("disabled", true);
            }
        });
}

// راه اندازی کمبوباکس Select2
function initIdeaGeneratorsCombo(ideatorData) {
    const $cmb = $("#cmbIdeaGenerators").empty();

    $cmb.select2({
        data: ideatorData,
        placeholder: "انتخاب ایده‌پردازان",
        dir: "rtl",
        multiple: true,
        closeOnSelect: false,
        allowClear: true,
        ajax: {
            transport: (params, success, failure) => {
                if (!params.data.term || params.data.term.length < 2) {
                    return success({ results: [] });
                }
                BS_GetUserInfo.Read(
                    { Where: "fullName LIKE N'%" + params.data.term + "%'" },
                    response => {
                        const xmlData = $.xmlDOM(response);
                        const results = [];
                        xmlData.find("row").each(function () {
                            results.push({
                                id: $(this).find("col[name='ActorId']").text(),
                                text: $(this).find("col[name='fullName']").text(),
                                userId: $(this).find("col[name='UserId']").text(),
                                roleId: $(this).find("col[name='RoleId']").text()
                            });
                        });
                        success({ results });
                    },
                    err => failure(err)
                );
            },
            processResults: data => ({ results: data.results })
        }
    });

    // مقداردهی اولیه
    $cmb.val(ideatorData.map(item => item.id)).trigger("change");
    $("#txtUserIdIdeas").val(ideatorData.map(i => i.userId).join(","));
    $("#txtRoleIdIdeas").val(ideatorData.map(i => i.roleId).join(","));

    // بستن رویدادهای قدیمی و بستن جدید
    $cmb
        .off("select2:select")
        .on("select2:select", e => {
            const d = e.params.data;
            updateHiddenFields(d.userId, d.roleId, true);
        })
        .off("select2:unselect")
        .on("select2:unselect", e => {
            const d = e.params.data;
            updateHiddenFields(d.userId, d.roleId, false);
        });
}

// مدیریت hidden fields
function updateHiddenFields(userId, roleId, isAdd) {
    let userIds = $("#txtUserIdIdeas").val().split(",").filter(Boolean);
    let roleIds = $("#txtRoleIdIdeas").val().split(",").filter(Boolean);

    if (isAdd) {
        if (!userIds.includes(userId)) userIds.push(userId);
        if (!roleIds.includes(roleId)) roleIds.push(roleId);
    } else {
        userIds = userIds.filter(id => id !== userId);
        roleIds = roleIds.filter(id => id !== roleId);
    }

    $("#txtUserIdIdeas").val(userIds.join(","));
    $("#txtRoleIdIdeas").val(roleIds.join(","));
}
//-----------------------------------------------------
//تابع غیرفعال کردن گروپ باکس نوآوری
function toggleInnovationGroup() {
    const selected = $("#cmbIdeaType").find(":selected");
    const ideaTypeNumber = selected.attr("ideatype") || selected.attr("IdeaType");

    if (ideaTypeNumber === "2" || ideaTypeNumber === "3") {
        $("#gbxInnovation").find("input, select, textarea, button").prop("disabled", true);
        $("#gbxInnovation").addClass("group-disabled");
    } else {
        $("#gbxInnovation").find("input, select, textarea, button").prop("disabled", false);
        $("#gbxInnovation").removeClass("group-disabled");
    }
}
//*********************************************************************************************

//#endregion

//#region formmanager
var FormManager = {
		//******************************************************************************************************
	    // دریافت اطلاعات ایده ثبت شده توسط پرسنل
		readIdeaRegistration: function (jsonParams, onSuccess, onError) {
		    // لیست همه اینپوتها
		    var dbFields = [
		        "Id",
		        "IdeaNo",
		        "IdeaSubject",
		        "FullDescription",
				"IdeaType",
		        "CreatorUserId",
		        "UserIdIdeas",
		        "RoleIdIdeas",
		        "NewProduct",
		        "ImprovementCurrentProducts",
		        "BusinessModels",
		        "OptimizationOfOrganization",
		        "MotivatingEmployees",
		        "FinancialStructue",
		        "KnowledgeManagment",
		        "InformationTechnology",
		        "MarketingAndBranding",
		        "InteractAndCommunicating",
		        "ImprovePerformance",
		        "OtherInovations",
		        "IncreaseIncome",
		        "IncreaseEffectiveness",
		        "AccelerationOfProcesses",
		        "FacilitateProcesses",
		        "CreatingMotivationWorkplace",
		        "PromoteEmployerBrand",
		        "ReduceBusinessThreats",
		        "ReduceBusinessSafetyRisks",
		        "ReduceWaste",
		        "QualityImprovement",
		        "ReducingFoodSafetyRisks",
		        "OtherImprovement",
		        "ResponsibleForImplementation",
		        "ReasonForResponsible",
		        "AdditionalInformation",
		        "ProcessStatus",
		        "RejectStatus",
		        "CreatedDate"
		    ];
		
	 BS_IR_IdeaRegistration.Read(
	        jsonParams,
	        function (data) {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
	            xmlvar.find("row").each(function () {
	                var obj = {};
	                dbFields.forEach(function (field) {
	                    var value = $(this).find("col[name='" + field + "']").text();
	
	                    if (field === "CreatedDate" && value) {
	                        // جدا کردن تاریخ از ساعت
	                        var datePart = value.split(" ")[0].split("/"); // MM/DD/YYYY
	                        var gy = datePart[2];
	                        var gm = datePart[0];
	                        var gd = datePart[1];
	                        var [jy, jm, jd] = toJalali(gy, gm, gd);
	                        value = jy + "/" + String(jm).padStart(2, "0") + "/" + String(jd).padStart(2, "0");
	                    }
	
	                    obj[field] = value;
	                }, this);
	                list.push(obj);
	            });
	
	            if ($.isFunction(onSuccess)) {
	                onSuccess(list);
	            }
	        },
	        function (error) {
	            var methodName = "readIdeaRegistration";
	            if ($.isFunction(onError)) {
	                var erroMessage = "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
	                console.error("Error:", erroMessage);
	                console.error("Details:", error);
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error(
	                    "خطایی در سیستم رخ داده است. (Method: " + methodName + ") (no onError callback provided):",
	                    error
	                );
	            }
	        }
	    );
	},
	//*********************************************************************************************************
	updateIdeaRegistration: function(jsonParams, onSuccess, onError)
		{
		 BS_IR_IdeaRegistration.Update(jsonParams
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
				var methodName = "updateIdeaRegistration";

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
	//******************************************************************************************************

};
//#endregion