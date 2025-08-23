      [CreatorActorId]->txtCreatorActorId
      [GiftCreditForUserId]->txtGiftCreditForUserId
      [OfferedGiftCredit]->txtOfferedGiftCredit
      [Description]->txtDescription


      CreatedDate
      ConfirmedGiftCredit
      Description



      var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;

$(function(){
	$form = (function(){
		var pk,
		inTestMode = (typeof isInTestMode !== "undefined" ? isInTestMode : false),
		primaryKeyName = "Id",
		inEditMode = false;

		function init(){
			build();
			createControls();
		}

		function build(){
			changeDialogTitle("درخواست اعتبار هدیه");
		}

		function createControls(){
			try {
				const parentUrl = window.parent?.location?.href;
				const url = new URL(parentUrl);
				isInTestMode = url.searchParams.get("icantestmode") === "1";
			}
			catch (e) {
				console.warn("Cannot reach parent document:", e);
				isInTestMode = false;
			}

			UserService.GetCurrentActor(true,
				function(data){
					var xmlActor = $.xmlDOM(data);
					currentActorId = xmlActor.find('actor').attr('pk');
					var params = {Where: "ActorId = " + currentActorId};
					
					BS_GetUserInfo.Read(params, function(data){
						if($.trim(data) != ""){
							var dataXml = $.xmlDOM(data);
							ActorId = dataXml.find("row:first").find(">col[name='ActorId']").text();
							$("#txtCreatorActorId").val(ActorId).prop('disabled', true);
							hideLoading();
						}
					});
				},
				function(err){
					$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
				}
			);

			// ——— اینجا کمبو رو بعد از آماده شدن کنترل‌ها پر می‌کنیم ———
			requestAnimationFrame(() => {
			    fillPersonCombo($("#cmbPersonSelect"), BS_GetUserInfo, "انتخاب شخص");
			    $('#pnlPersonSelect').css("height", "30px");
			});
		}

		function getPK(){
			return pk;
		}

		function isInEditMode(){
			return inEditMode;
		}

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

		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			isInTestMode: isInTestMode
		};
	}());

	$form.init();
});


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












    //  شرط جلوگیری کامل: اگر اعتبار باقیمانده < قیمت محصول
    let currentRemain = parseInt($('#txtRemainCredit').val().trim().replace(/,/g, ''), 10) || 0;
    if (currentRemain < price) {
        alert("اعتبار شما برای خرید این کالا کافی نیست");
        $(this).prop("checked", false); // تیک رو هم برگردون
        return false; 
    }
