//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;
var pk;
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
	
  // Checkbox1
  NewProduct: "chbNewProduct",
  ImprovementCurrentProducts: "chbImprovementCurrentProducts",

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
      $("body").css({overflow: "hidden"}).attr({scroll: "no"});
      $("#frmLoanRequest").css({
        top: "0",
        left: "0",
        width: $(document).width() + "px",
        height: $(document).height() + "px"
      });
      //Set the new dialog title
      changeDialogTitle("مشاهده ایده / پیشنهاد");
    }

    //*************************    CREATE CONTROLS    **************************
   function createControls() {
	  showLoading();
	
	  try {
	    const parentUrl = window.parent?.location?.href;
	    const url = new URL(parentUrl);
	    isInTestMode = url.searchParams.get("icantestmode") === "1";
	  } catch (e) {
	    console.warn("Cannot reach parent document:", e);
	    isInTestMode = false;
	  }
	
	  getCurrentActorPromise()
	    .then(() => readIdeaRegistrationPromise({ Where: primaryKeyName + " = " + pk }))
	    .then(dataXmlArr => {
	      const data = dataXmlArr[0];
	      const creatorUserId = data.CreatorUserId;
	
	      fillAndDisableFields(data);
	
	      const userIdIdeasList = (data.UserIdIdeas || "")
	        .split(',')
	        .map(id => id.trim())
	        .filter(Boolean);
	
	      const $tblBody = $("#tblIdeatorInfo tbody");
	      $tblBody.find("tr:not(.row-header):not(.row-template)").remove();
	
	      // اسامی ایده پردازان
	      const ideatorPromises = userIdIdeasList.map(function(userId) {
	        return getUserInfoPromise({ Where: "UserId = " + userId }).then(response => {
	          if ($.trim(response) !== "") {
	            const dataXml = $.xmlDOM(response);
	            const fullName = dataXml.find("row:first > col[name='fullName']").text();
	            if (fullName) {
	              const $tr =
	                $('<tr style="height:20px">' +
	                  '<td style="width:25px;background-color:#ADD8E6;border:solid 1px #778899" align="center">*</td>' +
	                  '<td style="width:400px;border:solid 1px #778899">' +
	                  fullName +
	                  "</td>" +
	                  "</tr>");
	              $tblBody.append($tr);
	            }
	          }
	        });
	      });
	
	      // ایده پرداز اصلی
	      const creatorPromise = getUserInfoPromise({ Where: "UserId = " + creatorUserId }).then(response => {
	        if ($.trim(response) !== "") {
	          const dataXml = $.xmlDOM(response);
	          const fullName = dataXml.find("row:first > col[name='fullName']").text();
	          const unitsName = dataXml.find("row:first > col[name='UnitsName']").text();
	          const userName = dataXml.find("row:first > col[name='UserName']").text();
	          const userId = dataXml.find("row:first > col[name='UserId']").text();
	          $("#txtCreatorUserId").val(userId).prop("disabled", true);
	          $("#txtFullName").val(fullName).prop("disabled", true);
	          $("#txtPersonnel").val(userName).prop("disabled", true);
	          $("#txtUnits").val(unitsName).prop("disabled", true);
	        }
	      });
	
	      return Promise.all([...ideatorPromises, creatorPromise]);
	    })
	    .catch(function(err) {
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

//#region formManager.js
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
//******************************************************************************************************
	updateIdeaCommittee: function(jsonParams, onSuccess, onError)
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
				var methodName = "updateIdeaCommittee";

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
	//*****************************************************************************************************
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
	}
	//******************************************************************************************************
};
//#endregion

//#region helpercommon.js
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
      function fillAndDisableFields(data) {
        Object.entries(fieldMap).forEach(([dataKey, elementId]) => {
          const value = data[dataKey];
          const el = document.getElementById(elementId);

          if (!el) return;

          const isHiddenTextField =
            elementId === "txtOtherInovations" || elementId === "txtchbOtherImprovement";

          if (el.type === "checkbox") {
            el.checked = value === "true" || value === "1";
            el.disabled = true;

          } else {
            if (isHiddenTextField) {
              if (value && value.trim() !== "") {
                // فقط اگر مقدار داشت، نشون بده و مقدار ست کن
                el.style.display = "block";
                el.disabled = false;    // آزاد کن تا بشه مقدار داد
                el.readOnly = true;     // فقط خواندنی باشه
                el.value = value;
                el.disabled = true;     // دوباره غیرفعال کن بعد مقداردهی
              } else {
                // مقدار نداشت، پنهان بمونه
                el.style.display = "none";
              }
            } else {
              // فیلدهای معمولی
              el.disabled = false;
              el.value = value || "";
              el.readOnly = true;
              el.disabled = true;
            }
          }
        });
      }
//---------------------------------------------------------------------------------------------
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
//-----------------------------------
//------promise for loading----------
//-----------------------------------
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
//-----------------------------------


//#endregion

//#region btnViewed.js
$("#btnViewed").click(function(){
	showLoading();
	var params = {
		'Context': 'مشاهده شد',
		'DocumentId': DocumentId,
		'CreatorActorId': CurrentUserActorId,
		'InboxId': InboxId
	};
	
	FormManager.InsertHamesh(params,
		function()
		{
			Office.Inbox.setResponse(dialogArguments.WorkItem,1, "",
			    function(data)
			    { 
			        closeWindow({OK:true, Result:null});
			    }, function(err){ throw Error(err); }
			);
		}
	);
});


//#endregion