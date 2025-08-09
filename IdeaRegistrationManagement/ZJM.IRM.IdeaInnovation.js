//#region ready.js

var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;

//---------------------------------
const fieldMap = {
  // Textboxes
  IdeaNo: "txtIdeaNo",
  IdeaSubject: "txtIdeaSubject",
  FullDescription: "txtFullDescription",
  ResponsibleForImplementation: "txtResponsibleForImplementation",
  ReasonForResponsible: "txtReasonForResponsible",
  OtherImprovement: "txtchbOtherImprovement",
  OtherInovations: "txtOtherInovations",
  AdditionalInformation: "txtOtherImprovement",

  // Checkbox1
  NewProduct: "chbNewProduct",
  ImprovementCurrentProducts: "chbImprovementCurrentProducts",

  // Checkbox2
  BusinessModels: "chbNewProduct",
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

    //============================== END ===============================
  }());
  $form.init();

});

//#endregion


//#region formmanager.js
var FormManager = {
	//******************************************************************************************************
    // دریافت لیست کالاهای قابل فروش
	readIdeaRegistration: function (jsonParams, onSuccess, onError) {
	    // لیست ستون‌ها یک جا: فقط همین رو تغییر بده اگه در آینده ستونی اضافه شد
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
	
	    BS_IR_IdeaRegistration.Read(jsonParams,
	        function (data) {
	            var list = [];
	            var xmlvar = $.xmlDOM(data);
	            xmlvar.find("row").each(function () {
	                var obj = {};
	                dbFields.forEach(function(field) {
	                    obj[field] = $(this).find("col[name='" + field + "']").text();
	                }, this); // توجه کن این this رو برای حفظ context گذاشتی
	                list.push(obj);
	            });
	            if ($.isFunction(onSuccess)) {
	                onSuccess(list);
	            }
	        },
	        function (error) {
	            var methodName = "readIdeaRegistration"; // اسم متد درست!
	            if ($.isFunction(onError)) {
	                var erroMessage = "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
	                console.error("Error:", erroMessage);
	                console.error("Details:", error);
	                onError({
	                    message: erroMessage,
	                    details: error
	                });
	            } else {
	                console.error("خطایی در سیستم رخ داده است. (Method: " + methodName + ") (no onError callback provided):", error);
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

//#region  btnRecheck.js
$("#btnDecline").click(function(){
	showLoading();
	var params = {
		'Context': 'بررسی مجدد',
		'DocumentId': DocumentId,
		'CreatorActorId': CurrentUserActorId,
		'InboxId': InboxId
	};
	
	FormManager.InsertHamesh(params,
		function()
		{
			Office.Inbox.setResponse(dialogArguments.WorkItem,2, "",
			    function(data)
			    { 
			        closeWindow({OK:true, Result:null});
			    }, function(err){ throw Error(err); }
			);
		}
	);
});
//#endregion

//#region btnAccept.js
//******************************************************************************************************
$("#btnAccept").click(function() {
	showLoading();
	var params = {
		'Context': 'تایید شد',
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
//******************************************************************************************************
//#endregion 