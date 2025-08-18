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
$("#btnAccept").click(function() {
	// فراخوانی تابع ولیدیشن برای فرم
    if (!validateIdeaForm()) return;
	
	let confirmedGiftCredit = $("#txtConfirmedGiftCredit").val().trim();
	confirmedGiftCredit = rcommafy ? rcommafy(confirmedGiftCredit) : confirmedGiftCredit.replace(/,/g, "");
	
	let list = {ConfirmedGiftCredit: confirmedGiftCredit};
	list = $.extend(list, { Where: "Id = '" + $form.getPK() + "'" });

		FormManager.updatePersonnelGiftCredit(list,
	        function(status, list) { 
				
				var userId = $("#txtGiftCreditForUserId").val();
			    var list = {
			        'UserId': userId,
			        'EmailText': "<p dir='rtl'>همکار گرامی – اعتبار خرید 100% تخفیف به مبلغ '<b>" + confirmedGiftCredit + "</b>' ريال برای شما در خرید تکی و عمده محصولات لحاظ گردید.</p>",
			        'EmailSubject': 'اعتبار هدیه'
			    };
			    FormManager.SendEmail(list,
			        function(data) { 
			            var params = {
			                'Context': 'تایید شد',
			                'DocumentId': DocumentId,
			                'CreatorActorId': CurrentUserActorId,
			                'InboxId': InboxId
			            };
			
			            FormManager.InsertHamesh(params,
			                function() { 
			                    Office.Inbox.setResponse(dialogArguments.WorkItem, 1, "",
			                        function(data) { 
			                            // پیام موفقیت قبل از بستن
			                            showSuccessAlert("اعتبار با موفقیت ثبت و ارسال شد", function(){
			                                closeWindow({OK:true, Result:null});
			                            });
			                        },
			                        function(err) {
			                            throw Error(err);
			                        }
			                    );
			                },
			                function(err) {
			                    throw Error(err);
			                }
			            );
			      
						},
			        function(err) {
			            throw Error(err);
			        }
			    );	
	        },
	        function(error) { 
	            console.log("1خطای برگشتی:", error);
	            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
	        }
		);

});

//#endregion