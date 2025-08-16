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
	 	   changeDialogTitle("تخصیص کد هدیه");
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