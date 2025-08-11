//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;
//----------------------------------------------------
//  تعریف ثابت ها برای همه اینپوتها و پیغام هشدار مناسب
//----------------------------------------------------

const groups = {
    product: {
        fields: ["NewProduct", "ImprovementCurrentProducts"],
        alert: 'لطفا از بخش "محصولات" یک گزینه را انتخاب نمایید'
    },
    innovation: {
        fields: [
            "BusinessModels", "OptimizationOfOrganization", "MotivatingEmployees",
            "FinancialStructue", "KnowledgeManagment", "InformationTechnology",
            "MarketingAndBranding", "InteractAndCommunicating",
            "ImprovePerformance","OtherInovations",
        ],
        alert: 'لطفا از بخش "نوآوری و بهبود سازمانی" حداقل یک گزینه انتخاب نمایید'
    },
    ideaGoal: {
        fields: [
            "IncreaseIncome", "IncreaseEffectiveness", "AccelerationOfProcesses",
            "FacilitateProcesses", "CreatingMotivationWorkplace", "PromoteEmployerBrand",
            "ReduceBusinessThreats", "ReduceBusinessSafetyRisks", "ReduceWaste",
            "QualityImprovement", "ReducingFoodSafetyRisks","OtherImprovement",
        ],
        alert: 'لطفا از بخش "هدف ایده/نوآوری" حداقل یک گزینه انتخاب نمایید'
    }
};

const requiredFields = [
    { selector: "#txtIdeaSubject", message: "لطفا عنوان ایده را وارد کنید" },
    { selector: "#txtFullDescription", message: "لطفا شرح کامل ایده را وارد کنید" }
];

const additionalValidations = [
    { selector: "#txtResponsibleForImplementation", message: "لطفا مسئول اجرا ایده را وارد کنید" },
    { selector: "#txtReasonForResponsible", message: "علت انتخاب مسئول اجرا ایده را وارد کنید" }
];

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
		//	انتخاب یک گزینه برای محصولات
		//-----------------------------------
		const productGroup = ["chbNewProduct", "chbImprovementCurrentProducts"];
		// هندلر: فقط یکی از این دو تا همیشه میتونه تیک باشه
		productGroup.forEach(id => {
		    $(`#${id}`).on('change', function() {
		        if ($(this).is(':checked')) {
		            // بقیه تو گروه رو ردکن (جز خودت)
		            productGroup.forEach(otherId => {
		                if (otherId !== id) $(`#${otherId}`).prop('checked', false);
		            });
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

    FormManager.readIdeaRegistration({}, function (list, status) {
        const nextIR = getNextIdeaNo(list);
        const insertParams = {
            IdeaNo: nextIR,
            IdeaSubject: $("#txtIdeaSubject").val(),
            FullDescription: $("#txtFullDescription").val(),
            CreatorUserId: $("#txtCreatorUserId").val(),
            UserIdIdeas: $("#txtUserIdIdeas").val(),
            RoleIdIdeas: $("#txtRoleIdIdeas").val(),
            OtherInovations: $("#txtOtherInovations").val(),
            OtherImprovement: $("#txtOtherImprovementTargrt").val(),
            ResponsibleForImplementation: $("#txtResponsibleForImplementation").val(),
            ReasonForResponsible: $("#txtReasonForResponsible").val(),
            AdditionalInformation: $("#txtOtherImprovement").val()
        };

        // چک باکس ها رو با همین groups اضافه کن
        const allCheckboxes = [
            ...groups.product.fields,
            ...groups.innovation.fields,
            ...groups.ideaGoal.fields
        ];
        allCheckboxes.forEach(field => {
            if ($(`#chb${field}`).is(":checked")) {
                insertParams[field] = "1";
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
    },
    function (err) {
        myHideLoading();
        alert(err);
    });
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

//#region helper.js
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
//******************************************************************************************************
function fillIdeatorCombo($combo, service, placeholderText) {
    var params = {};
    service.Read(params,
        function (data) {
            var xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);
            var list = [];

            xmlData.find("row").each(function () {
                // استخراج فیلدهای جدید
                var actorId = $(this).find("col[name='ActorId']").text();
                var fullName = $(this).find("col[name='fullName']").text();
                var roleName = $(this).find("col[name='RoleName']").text();
                var userId = $(this).find("col[name='UserId']").text();
                var roleId = $(this).find("col[name='RoleId']").text();

                list.push({
                    id: actorId,
                    text: fullName + '-' + roleName,
                    userId: userId,
                    roleId: roleId
                });
            });

            $combo.empty().append($('<option></option>'));
            $combo.select2({
                data: list,
                placeholder: placeholderText || 'انتخاب فرد',
                dir: "rtl"
            });

            // رویداد select: هر وقت آیتمی انتخاب شد، UserId و RoleId رو روی خودش ثبت کن
            $combo.off('select2:select').on('select2:select', function (e) {
                var d = e.params.data;
                // مثلا ذخیره روی attr خود select
                $combo.attr('data-userid', d.userId || '');
                $combo.attr('data-roleid', d.roleId || '');
                // اگر خواستی: console.log(d.userId, d.roleId, d);
            });
        },
        function (err) {
            alert("service titles read error:" + err);
            hideLoading();
        }
    );
}
//******************************************************************************************************
	//----------------------------------
    // -- تابع تولید شماره جدید ایده --
	//---------------------------------
    function getNextIdeaNo(list) {
        const startNum = 100001;
        if (!Array.isArray(list) || list.length === 0) {
            return "IR" + startNum;
        }
        let maxNum = startNum - 1;
        list.forEach(item => {
            let value = item.IdeaNo;
            let num = 0;
            if (typeof value === "string" && value.startsWith("IR")) {
                num = parseInt(value.replace("IR", ""), 10);
            } else {
                num = parseInt(value, 10);
            }
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        });
        const nextNum = maxNum + 1;
        return "IR" + nextNum.toString().padStart(6, "0");
    }
//---------------------------------------------------------------------------------------------
	//----------------------------------
    // -- اعتبار سنجی برای فرم --
	//---------------------------------

function validateIdeaForm() {
    // اعتبارسنجی فیلد اجباری
    for (let field of requiredFields) {
        if (!$(field.selector).val().trim()) {
            $.alert(field.message, '', 'rtl');
            $(field.selector).focus();
            return false;
        }
    }

    // اعتبارسنجی گروه‌های چک‌باکس
    const isGroupChecked = (fields) =>
        fields.some(field => $(`#chb${field}`).is(":checked"));

    for (let key in groups) {
        const { fields, alert } = groups[key];
        if (!isGroupChecked(fields)) {
            $.alert(alert, '', 'rtl');
            setTimeout(() => { $(`#chb${fields[0]}`).focus(); }, 100);
            return false;
        }
    }

    // فقط یکی از گروه محصول (Mutually Exclusive)
    const product = groups.product.fields;
    const productChecked = product.filter(f => $(`#chb${f}`).is(":checked"));
    if (productChecked.length > 1) {
        $.alert('در بخش محصول فقط مجاز به انتخاب یک گزینه هستید!', '', 'rtl');
        setTimeout(() => { $(`#chb${productChecked[1]}`).focus(); }, 100);
        return false;
    }

    // اعتبارسنجی مسئول اجرا و علت انتخاب
    for (let field of additionalValidations) {
        if (!$(field.selector).val().trim()) {
            $.alert(field.message, '', 'rtl');
            $(field.selector).focus();
            return false;
        }
    }

    return true;
}
//---------------------------------------------------------------------------------------------
function isFullDescriptionValid(str){
    const regex = /^[\u0600-\u06FFa-zA-Z0-9\s.,\-_،]+$/;
    return regex.test(str.trim());
}

//#endregion



