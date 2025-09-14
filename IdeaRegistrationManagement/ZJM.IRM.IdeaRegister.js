//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;

//----------------------------------------------------------
//------ گروه ها و فیلدهای برای ثبت در دیتابیس--------------
//----------------------------------------------------------
const groups = {
    innovation: {
        fields: [
            "BusinessModels", "OptimizationOfOrganization", "MotivatingEmployees",
            "FinancialStructue", "KnowledgeManagment", "InformationTechnology",
            "MarketingAndBranding", "InteractAndCommunicating",
            "ImprovePerformance", "OtherInovations"
        ]
    },
    ideaGoal: {
        fields: [
            "IncreaseIncome", "IncreaseEffectiveness", "AccelerationOfProcesses",
            "FacilitateProcesses", "CreatingMotivationWorkplace", "PromoteEmployerBrand",
            "ReduceBusinessThreats", "ReduceBusinessSafetyRisks", "ReduceWaste",
            "QualityImprovement", "ReducingFoodSafetyRisks", "OtherImprovement"
        ]
    }
};
//----------------------------------------------------------

//----------------------------------------------------------
//--  تعریف ثابت ها برای همه اینپوتها و پیغام هشدار مناسب--
//----------------------------------------------------------
const requiredFields = [
    "#txtIdeaSubject",
    "#txtFullDescription"
];

// فیلدهای الزامی اضافی
const additionalValidations = [
    "#txtResponsibleForImplementation",
    "#txtReasonForResponsible"
];

// مپ بین فیلد و لیبل خطا
const fieldLabelMap = {
    "#txtIdeaSubject": "#lblRequireSubject",
    "#txtSubject": "#lblRequireSubject",
    "#txtFullDescription": "#lblRequireFullDescription",
    "#txtImprovePerformance": "#lblRequireImprovePerformance",
    "#txtImplementation": "#lblRequireImplementation",
    "#txtImplementationIdea": "#lblRequireImplementationIdea",
    "#txtReasonForResponsible": "#lblRequireReasonForResponsible",
    "#txtResponsibleForImplementation": "#lblRequireImplementation",
    "#cmbIdeaGenerators": "#lblRequireIdeatorInfo", // پیام خاص
    "gbxInnovation": "#lblRequireImprovePerformance",
    "gbxGoal": "#lblRequireImplementationIdea",
    "#cmbIdeaType": "#lblIdeaTypes"
};

// نام گروهها به ID پنل
const groupPanels = {
    innovation: "gbxInnovation",
    ideaGoal: "gbxGoal"
};
//----------------------------------------------------



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
	 	   changeDialogTitle("ثبت ایده / پیشنهادات");
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
								fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
								UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
								UserName = dataXml.find("row:first").find(">col[name='UserName']").text();
								userId = dataXml.find("row:first").find(">col[name='UserId']").text();
								//خواندن اطلاعات کاربر جاری و نمایش 
								$("#txtCreatorUserId").val(userId).prop('disabled', true);						
								$("#txtFullName").val(fullName).prop('disabled', true);
								$("#txtPersonnel").val(UserName).prop('disabled', true);
								$("#txtUnits").val(UnitsName).prop('disabled', true);
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
			    fillIdeaGeneratorsCombo($("#cmbIdeaGenerators"), BS_GetUserInfo, "انتخاب شخص");
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
		//-----------------------------------
		//	انتخاب یک گزینه  از نوع ایده
		//-----------------------------------
		$(function () {
		    $("#cmbIdeaType").on("change", function () {
		        const selectedValue = $(this).val();
		
		        // بررسی attribute IdeaType
		        const ideaTypeNumber = $(this).find(":selected").attr("IdeaType");
		
		        if (ideaTypeNumber === "2" || ideaTypeNumber === "3") {
		            // غیرفعال کردن کل گروه
		            $("#gbxInnovation").find("input, select, textarea, button").prop("disabled", true);
		            $("#gbxInnovation").addClass("group-disabled");
		        } else {
		            // فعال کردن دوباره
		            $("#gbxInnovation").find("input, select, textarea, button").prop("disabled", false);
		            $("#gbxInnovation").removeClass("group-disabled");
		        }
		    });
		});
		//-----------------------------------
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

//#region btnregister
$("#btnRegister").click(function () {
    // فراخوانی تابع ولیدیشن برای فرم
    if (!validateIdeaForm()) return;

    // گرفتن ideatype انتخابی
    const ideaTypeAttr = $("#cmbIdeaType").find(":selected").attr("ideatype");

    const insertParams = {
        IdeaSubject: $("#txtIdeaSubject").val(),
        FullDescription: $("#txtFullDescription").val(),
        CreatorUserId: $("#txtCreatorUserId").val(),
        UserIdIdeas: $("#txtUserIdIdeas").val(),
        RoleIdIdeas: $("#txtRoleIdIdeas").val(),
        OtherInovations: $("#txtOtherInovations").val(),
        OtherImprovement: $("#txtOtherImprovementTargrt").val(),
        ResponsibleForImplementation: $("#txtResponsibleForImplementation").val(),
        ReasonForResponsible: $("#txtReasonForResponsible").val(),
        AdditionalInformation: $("#txtOtherImprovement").val(),
        IdeaType: ideaTypeAttr 
    };

    // افزودن دو بخش چک باکسها
    const allCheckboxes = [
        ...groups.innovation.fields,
        ...groups.ideaGoal.fields
    ];
	const skipOverwrite = ["OtherInovations", "OtherImprovement"];
	allCheckboxes.forEach(field => {
	    if ($(`#chb${field}`).is(":checked")) {
	        if (!skipOverwrite.includes(field)) {
	            insertParams[field] = "1";
	        }
	    }
	});
    // ثبت کل فرم در دیتابیس و ران کردن وورکفلو
    FormManager.insertIdeaRegistration(
        insertParams,
        function (dataXml) {
            var pk = dataXml.find("row:first > col[name='Id']").text();
            WorkflowService.RunWorkflow(
                "ZJM.IRM.IdeaRegistrationProcess",
                '<Content><Id>' + pk + '</Id><IsInTestMode>' + $form.isInTestMode() + '</IsInTestMode></Content>',
                true,
                function (data) { handleRunWorkflowResponse(data); },
                function (err) { handleError(err, 'WorkflowService.RunWorkflow'); }
            );
        },
        function (err) {
            myHideLoading();
            alert(err);
        }
    );
});

//#endregion

//#region btnAddIdeatorInfo.js
$("#btnAddIdeatorInfo").click(function(){
    var $combo = $("#cmbIdeatorInfo");
    var dataArr = $combo.select2('data');
    var data = dataArr && dataArr[0];

    // حالت انتخاب نشده یا خالی
    if (!data || !data.userId || !data.roleId) {
        $.alert('لطفا شخص مورد نظر را جستجو و انتخاب کنید!', '', 'rtl');
        return;
    }
    var userId = data.userId;
    var roleId = data.roleId;
    var fullName = data.text || '';

    window.selectedUserIds = window.selectedUserIds || [];
    window.selectedRoleIds = window.selectedRoleIds || [];

    if (selectedUserIds.indexOf(userId) !== -1) {
	    $.alert('این شخص در لیست شما ثبت شده است!', '', 'rtl');
	    return;
    }
    selectedUserIds.push(userId);
    selectedRoleIds.push(roleId);

    $("#txtUserIdIdeas").val(selectedUserIds.join(","));
    $("#txtRoleIdIdeas").val(selectedRoleIds.join(","));

    // ردیف جدول
    var $tr = $('<tr class="row-data" style="height:20px">' +
        '<td style="width:25px;background-color:#ADD8E6;border:solid 1px #778899" align="center">*</td>' +
        '<td style="width:100px;display:none;border:solid 1px #778899">'+ userId +'</td>' +
        '<td style="border:solid 1px #778899" align="center">' +
            '<span class="delete-ideator" style="display: inline-block;width: 20px;height: 20px;line-height: 20px;text-align: center;border-radius: 50%;background: red;color: white; border: 2px solid red;cursor: pointer;font-weight: bold;font-size: 20px;">-</span>' +
        '</td>' +
        '<td style="width:300px;border:solid 1px #778899">'+ fullName +'</td>' +
    '</tr>');
    $("#tblIdeatorInfo tbody").append($tr);

    // حذف ردیف
    $tr.find('.delete-ideator').on('click', function() {
        var idx = selectedUserIds.indexOf(userId);
        if(idx !== -1) {
            selectedUserIds.splice(idx, 1);
            selectedRoleIds.splice(idx, 1);
            $("#txtUserIdIdeas").val(selectedUserIds.join(","));
            $("#txtRoleIdIdeas").val(selectedRoleIds.join(","));
            $tr.remove();
        }
    });

	$combo.val(null).trigger('change');
});

//#endregion

//#region formmanager
var FormManager = {
	//******************************************************************************************************
    readIdeaRegistration: function (jsonParams, onSuccess, onError) {
        BS_IR_IdeaRegistration.Read(jsonParams,
            function (data) {
                var list = [];
                var xmlvar = $.xmlDOM(data);
                xmlvar.find("row").each(
                    function () {
                        list.push
                            ({
                                IdeaNo: $(this).find("col[name='IdeaNo']").text()
                            });
                    }
                );
                if ($.isFunction(onSuccess)) {
                    onSuccess(list);
                }
            },
            function (error) {
                var methodName = "readEntityGoodsCatalogue";

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
    /*********************************************************************************************************/
	// ==================== insertEntity ====================
	insertIdeaRegistration: function(jsonParams, onSuccess, onError)
	{
		BS_IR_IdeaRegistration.Insert(jsonParams,
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
				var methodName = "insertContract";

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
		// ==================== insertEntity ====================
	insertIdeaFile: function(jsonParams, onSuccess, onError)
	{
		BS_File.Insert(jsonParams,
			function(data)
			{
				console.log(data);
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
				var methodName = "insertContract";

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
//******************************************************************************************************
function hideLoading() {
    $('#loadingBoxTweaked').fadeOut(180, function () { $(this).remove(); });
}
//******************************************************************************************************
// افزودن ایده پردازان
function fillIdeaGeneratorsCombo($combo, service, placeholderText) {
    
    // خواندن داده ها از سرویس
    service.Read({}, function (data) {

        // گرفتن و پارس داده های XML
        const xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);
        const list = [];

        xmlData.find("row").each(function () {
            list.push({
                id:       $(this).find("col[name='ActorId']").text(),
                text:     $(this).find("col[name='fullName']").text(), // فقط نام کامل
                userId:   $(this).find("col[name='UserId']").text(),
                roleId:   $(this).find("col[name='RoleId']").text()
            });
        });

        // مقداردهی Select2
        $combo.empty().select2({
            data: list,
            placeholder: placeholderText || "انتخاب ایده‌پردازان",
            dir: "rtl",
            multiple: true,
            closeOnSelect: false,
            scrollAfterSelect: false
        });

        // به روزرسانی فیلدهای مخفی
        const updateHiddenFields = (userId, roleId, isAdd) => {
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
        };

        // اتصال رویدادها
        $combo
            .off("select2:select").on("select2:select", e => {
                const d = e.params.data;
                updateHiddenFields(d.userId, d.roleId, true);
            })
            .off("select2:unselect").on("select2:unselect", e => {
                const d = e.params.data;
                updateHiddenFields(d.userId, d.roleId, false);
            });

    }, function (err) {
        alert("Service titles read error: " + err);
    });
}

//---------------------------------------------------------------------------------------------
	//----------------------------------
    // -- اعتبار سنجی برای فرم --------
	//---------------------------------
function validateIdeaForm() {
    let hasError = false;

    /*--- توابع کمکی ---*/
    const markError = (key) => {
        const labelSelector = fieldLabelMap[key] || fieldLabelMap[`#${key}`];
        if (labelSelector) $(labelSelector).addClass("input-error");
        hasError = true;
    };

    const isEmpty = (value) =>
        !value || (Array.isArray(value) && value.length === 0) || !String(value).trim();

    const isGroupChecked = (fields) =>
        fields.some(field => $(`#chb${field}`).is(":checked"));

    /*--- پاک کردن علامت قبلی ---*/
    $(".input-error").removeClass("input-error");

    /*--- بررسی cmbIdeaGenerators ---*/
    const ideaGenVal = $("#cmbIdeaGenerators").val();
    if (isEmpty(ideaGenVal)) {
        markError("#cmbIdeaGenerators");
        $.alert("حداقل نام و نام خانوادگی خود ایده دهنده یا شخص دیگری را حتما وارد کنید", '', 'rtl');
        return false; // توقف سریع
    }

    /*--- بررسی cmbIdeaType ---*/
    const selectedOption = $("#cmbIdeaType").find(":selected");
    const ideaTypeAttr = selectedOption.attr("ideatype") || selectedOption.attr("IdeaType");
    if (!ideaTypeAttr || isNaN(Number(ideaTypeAttr))) {
        markError("#cmbIdeaType");
        $.alert("لطفا نوع ایده را تعیین کنید", '', 'rtl');
        return false; // توقف سریع
    }

    /*--- فیلدهای تکی اجباری ---*/
requiredFields.forEach(selector => {
    if (isEmpty($(selector).val())) markError(selector);
});

    /*--- گروه های چک باکس ---*/
    Object.keys(groups).forEach(groupKey => {
        if (groupKey === "innovation" && (ideaTypeAttr === "2" || ideaTypeAttr === "3")) {
            return; // حذف الزام این گروه وقتی ایده نوع ۲ یا ۳ است
        }
        if (!isGroupChecked(groups[groupKey].fields)) {
            markError(groupPanels[groupKey]);
        }
    });

    /*--- فیلدهای الزامی اضافه ---*/
additionalValidations.forEach(selector => {
    if (isEmpty($(selector).val())) markError(selector);
});

    /*--- پیام کلی ---*/
    if (hasError) {
        $.alert("لطفاً تمام فیلدهای ضروری (ستاره‌دار) را تکمیل کنید", '', 'rtl');
        return false;
    }

    return true;
}
//---------------------------------------------------------------------------------------------
function isFullDescriptionValid(str){
    const regex = /^[\u0600-\u06FFa-zA-Z0-9\s.,\-_،]+$/;
    return regex.test(str.trim());
}

//#endregion

//#region chbOtherInovations.btn
document.addEventListener("DOMContentLoaded", function() {
    const chk = document.getElementById("chbOtherInovations");
    const txt = document.getElementById("txtOtherInovations");

    // حالت اولیه
    txt.style.display = chk.checked ? "block" : "none";

    // رویداد تغییر
    chk.addEventListener("change", function() {
        if (this.checked) {
            txt.style.display = "block";
        } else {
            txt.style.display = "none";
            txt.value = ""; // پاک کردن متن وقتی unchecked میشه
        }
    });
});

//#endregion

