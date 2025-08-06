//#region ready.js
var $form;
var currentActorId;
var isInTestMode = false;
var html_;
var ProcessStatus;
var hire_this_year = 0;
var daysForHireDiff;
var primaryKeyName;
//----------------------------------
//  تعریف ثابت ها برای چک باکس ها 
//---------------------------------
const groups = {
    product: {
        fields: ["NewProduct", "ImprovementCurrentProducts"],
        alert: 'لطفا از حوزه ایده بخش محصول یک گزینه را انتخاب نمایید'
    },
    innovation: {
        fields: [
            "BusinessModels", "OptimizationOfOrganization", "MotivatingEmployees",
            "FinancialStructue", "KnowledgeManagment", "InformationTechnology",
            "MarketingAndBranding", "InteractAndCommunicating",
            "ImprovePerformance"
        ],
        alert: 'لطفا از حوزه ایده بخش "نوآوری و بهبود سازمانی" حداقل یک گزینه انتخاب نمایید'
    },
    ideaGoal: {
        fields: [
            "IncreaseIncome", "IncreaseEffectiveness", "AccelerationOfProcesses",
            "FacilitateProcesses", "CreatingMotivationWorkplace", "PromoteEmployerBrand",
            "ReduceBusinessThreats", "ReduceBusinessSafetyRisks", "ReduceWaste",
            "QualityImprovement", "ReducingFoodSafetyRisks"
        ],
        alert: 'لطفا از حوزه ایده بخش "هدف ایده/نوآوری" حداقل یک گزینه انتخاب نمایید'
    }
};

const requiredFields = [
    { selector: "#txtIdeaSubject", message: "لطفا عنوان ایده را انتخاب کنید" },
    { selector: "#txtFullDescription", message: "لطفا شرح کامل ایده را بنویسید" }
];

const additionalValidations = [
    { selector: "#txtResponsibleForImplementation", message: "لطفا مسئول اجرا ایده را بنویسید" },
    { selector: "#txtReasonForResponsible", message: "علت انتخاب مسئول اجرا ایده را بنویسید" }
];
//---------------------------------

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
		}
        //******************************************************************************************************	
		function build()
		{
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
			$("#frmLoanRequest").css({top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px"});
						
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
								UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
								UserName = dataXml.find("row:first").find(">col[name='UserName']").text();
								userId = dataXml.find("row:first").find(">col[name='UserId']").text();
								//خواندن اطلاعات کاربر جاری و نمایش 
								$("#txtCreatorUserId").val(userId).prop('disabled', true);						
								$("#txtFullName").val(fullName).prop('disabled', true);
								$("#txtPersonnel").val(UserName).prop('disabled', true);
								$("#txtUnits").val(UnitsName).prop('disabled', true);
							}
						}
					);
				},
				function(err){
					hideLoading();
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
		// برای دریافت شناسه فرایند بعد از ایجاد و یا در ویرایش استفاده می شود
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
		const pairs = [
		      { checkboxId: "chbOtherInovations", textId: "txtOtherInovations" },
		      { checkboxId: "chbOtherImprovement", textId: "txtchbOtherImprovement" }
		    ];
		
		    pairs.forEach(({ checkboxId, textId }) => {
		      const checkbox = document.getElementById(checkboxId);
		      const textInput = document.getElementById(textId);
		
		      if (!checkbox || !textInput) return;
		
		      // تابع برای تغییر نمایش
		      function toggleVisibility() {
		        textInput.style.display = checkbox.checked ? "block" : "none";
		      }
		
		      // وضعیت اولیه
		      toggleVisibility();
		
		      // گوش دادن به تغییرات
		      checkbox.addEventListener("change", toggleVisibility);
		    });
			// اسم فیلدهای گروه محصولت رو اینجا تعریف کن
			const productGroup = ["chbNewProduct", "chbImprovementCurrentProducts"];
			
			// هندلر: فقط یکی از این دو تا همیشه می‌تونه تیک باشه
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

