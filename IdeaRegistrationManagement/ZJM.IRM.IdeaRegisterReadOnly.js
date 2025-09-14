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
      if (typeof dialogArguments !== "undefined") {
        if (primaryKeyName in dialogArguments) {
          pk = dialogArguments[primaryKeyName];
          inEditMode = true;
          readData();
        }
        if ("FormParams" in dialogArguments) {
          pk = dialogArguments.FormParams;
          inEditMode = true;
        }
      }
      build();
      createControls();
    }

    //*************************        BUILD         ****************************
    function build() {
      //Set the new dialog title
      changeDialogTitle("ثبت ایده / پیشنهادات");
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
			
			//افزودن نوع ایده یا پیشنهاد در کمبوباکس
			if (data.IdeaType) {
		    $("#cmbIdeaType")
		        .val(
		            $("#cmbIdeaType option[ideatype='" + String(data.IdeaType).trim() + "']").val()
		        )
		        .prop("disabled", true);
			}
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

//#region formManager
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

    /*********************************************************************************************************/
};

//#endregion


//#region btnViewed.js
$("#btnViewed").click(function(){
	closeWindow({OK:true, Result:null});
});

//#endregion