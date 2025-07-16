//#region  ready.js
var $form;

//---------------------------------
// Global Variables For UserInfo
//---------------------------------
var currentusername;
var currentPersonnelNO;
var currentUserCompanyId;
var nationalCode;
var currentUserfirstname;
var currentUserlastname;
var birthday;
var email;
var employmentDate;
var rankTitle;
var leaveDate;
var gender;
var isInTestMode = false; 
//---------------------------------
var DocumentId;
var CurrentUserActorId;
var InboxId;
var DCId;
var orderedPersonnelNO;
var orderId;
$(function(){
	$form = (function()
	{ 
		var pk,
			inTestMode = (typeof isInTestMode !== "undefined" ? isInTestMode : false),
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
			readEmployeeInfo = UserHelpes.readEmployeeInfo;
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
				DocumentId = dialogArguments["DocumentId"];
				CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
				InboxId = dialogArguments["WorkItem"]["InboxId"];
			}
			build();
			createControls();
			bindEvents();
		}
        //******************************************************************************************************
		function build()
		{
			//اگر بخواهیم استیل دهی خاصی داشته باشیم در این متد اعمال می شود
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
			var jsonParams = {}; // پارامترهای مورد نیاز برای خواندن داده‌ها

		}
		//******************************************************************************************************
		//مقداردهی به المان ها در هر دو حالت ویرایش و ایجاد
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
			
			//--------------------------------------------
			// خواندن اطلاعات محصولات سفارش داده شده کاربر
			//--------------------------------------------
			params = { WHERE: "Id = '" + $form.getPK() + "'" };
			FormManager.readPersonnelOrder(params,
				function(list)
				{
					orderedPersonnelNO=list[0].PersonnelNo;
					orderId=list[0].Id;
					$("#txtDiscountPercent").val(list[0].PercentDiscount);
					$("#txtRemainCreditNew").val(commafy(list[0].RemainCreditAfterOrder));
					$("#txtTotalPrice").val(commafy(list[0].OrderAmount));
					$("#txtTotalPriceWithDiscount").val(commafy(list[0].OrderNetAmount));
					$("#txtCreditBalance").val(commafy(list[0].RemainCreditBeforOrder));
					$("#txtDiscription").val(list[0].Description);
					tblOrderedGoodsDelivery.refresh();	
				},
				function(error)
			    {
			        alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
			        myHideLoading();
					return;
			    }
			);
			
			/******************************************************************************/
			showLoading();
			UserService.GetCurrentUser(true,
				function(data){
					hideLoading();
					//--------------------------------------------
					//خواندن اطلاعات کاربر درخواست دهنده محصولات	
					//--------------------------------------------				
					readEmployeeInfo(currentusername,
		                function(data)
		                {
							var xml = $.xmlDOM(data);
					        let user = data[0];
					        let currentUserName = user.UserName; 
					        let currentUserFirstName = user.CurrentUserFirstName;
					        let currentUserLastName = user.CurrentUserLastName;
					
					        // مقداردهی به فیلدهای HTML
					        $("#txtFullName").val(currentUserFirstName + ' ' + currentUserLastName);
					        $("#txtPersonnelNO").val(currentUserName);

							myHideLoading();
		                },
		                function(error)
		                {
							myHideLoading();
		                    alert(error);
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
		// تمام ایونت های مربوط به یک المان یا خود فرم در این متد نوشته می شوند
		// مانند ماوس هاور و ...
		function bindEvents()
		{
		}
		//******************************************************************************************************
		function readData()
		{
		}
		//******************************************************************************************************
		// برای دریافت شناسه فرایند بعد از ایجاد و یا در ویرایش استفاده می شود
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
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
		//******************************************************************************************************
		function saveData(callback)
		{
			validateForm(
				function()
				{
					if(inEditMode)
					{
						updateData(callback);
					}
					else
					{
						insertData(callback);
					}
				},
				function(errorMessage) {
		            $.alert(errorMessage || "لطفا موارد اجباری را تکمیل نمایید.", "", "rtl",
		                function() {}
		            );
		        }
			);
		}
		//******************************************************************************************************
		function insertData(callback) {		    
		}
		//******************************************************************************************************
		function updateData(callback)
		{
		}
		
		//******************************************************************************************************
		function deleteData(callback)
		{
			// اگر بخواهیم خود اینستنس فرایند را حذف کنیم کد فراخوانی حذف از فرم منیجر را اینجا می نویسیم
		}
		//******************************************************************************************************
		function validateForm(onSuccess, onError)
		{
		}
		//******************************************************************************************************
		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			validateForm: validateForm,
			saveData: saveData
		};
	}());
	$form.init();
});
//#endregion  ready.js

//#region tblOrderedGoodsDelivery.js
var tblOrderedGoodsDelivery = null;

$(function() {
    tblOrderedGoodsDelivery = (function() {
        //خواندن پارامترهای اصلی جدول
        var element = null,
            isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.ReadPersonnelOrderDetail;
        //فراخوانی سازنده جدول
        init();
        //******************************************************************************************************
        function init() {
            element = $("#tblOrderedGoodsDelivery");
            build();
            bindEvents();
            load();
        }
        //******************************************************************************************************
        function build() {
            //
        }
        //******************************************************************************************************
        //این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود
        function bindEvents() {}
        //عملیات پر کردن دیتای هر سطر می باشد
        function addRow(rowInfo, rowNumber) {
            var index = 0,
                tempRow = element.find("tr.row-template").clone();
            tempRow.show().removeClass("row-template").addClass("row-data");
            tempRow.data("rowInfo", rowInfo);
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber); // شماره ردیف
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.OrderId); // ID سفارش
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsCode);
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsName);
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.BrandName); // نام برند
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.UnitName); // بسته بندی

            var ConfirmedQty = (rowInfo.ConfirmedQty) / (rowInfo.CartonQTY);
            tempRow.find("td:eq(" + index++ + ")").empty().text(ConfirmedQty); // بسته بندی 
            tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.UnitPrice)); // fee
            tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.BeforeDiscountGoodsPrice)); // قیمت قبل از تخفیف

            tempRow.attr({
                state: "new"
            });
            element.find("tr.row-template").before(tempRow);
            myHideLoading();
        }
        //******************************************************************************************************
        //حذف یک سطر
        function removeRow(row) {
            row_info = row.data("rowInfo");

            var params = {
                Where: rowPrimaryKeyName + " = " + row_info.Id
            }

            deleteRows(params,
                function(data) {
                    refresh();
                    hideLoading();
                },
                function(error) {
                    hideLoading();
                    alert(error);
                }
            );
        }
        //******************************************************************************************************
        //اگر شماره سفارش وجود داشت سفارشات کاربر در جدول نمایش داده میشود
        function load() {
            if (!orderId) return;
            var params = {
                Where: "OrderId = " + orderId
            };
            showLoading();
            readRows(params,
                function(list) {
                    if (list.length > 0) {
                        for (var i = 0, l = list.length; i < l; i += 1) {
                            addRow(list[i], i + 1);
                        }
                    }
                    myHideLoading();
                },
                function(error) {
                    myHideLoading();
                    alert(error);
                }
            );
        }
        //******************************************************************************************************
        //بروز رسانی دیتای جدول
        function refresh() {
            element.find("tr.row-data").remove();
            load();
        }
        //******************************************************************************************************
        return {
            refresh: refresh,
            load: load
        };
    }());
});
//#endregion tblOrderedGoodsDelivery.js

//#region btndecline.js
$("#btnDecline").click(function() {
    var sp_params = {
        PersonnelOrderId: $form.getPK(),
        JsonArray: null,
        Type: 2
    };
    //------------------------------------------------
    // فراخوانی sp برای بازگردانی مقدار اعتبار کاربر
    //------------------------------------------------
    FormManager.retailPersonnelOrder(
        sp_params,
        function(data) {
            var hameshParams = {
                'Context': 'سفارش لغو شد',
                'DocumentId': DocumentId,
                'CreatorActorId': CurrentUserActorId,
                'InboxId': InboxId
            };

            var that = $(this);
            var hameshPopup = $(
                '<div tabindex="1" style="direction:rtl;" class="ui-form">' +
                '<label tabindex="-1" style="text-align:right;" class="ui-form-label">لطفا دلیل مخالفت خود را بنویسید.</label>' +
                '</div>'
            );
            var commentInput = $("<textarea>", {
                    type: "text"
                }).addClass("comment-input form-control")
                .css({
                    height: "60px",
                    "font-size": "8pt",
                    resize: "none"
                });
            hameshPopup.append(commentInput);

            var res = false;
            //-----------------------------------------------
            // ثبت توضیحات برای رد درخواست عمده محصول
            //-----------------------------------------------
            hameshPopup.dialog({
                buttons: [{
                        text: "ثبت",
                        click: function() {
                            showLoading();

                            if ($(this).find('.comment-input').val().trim().length > 0) {

                                var hameshDescription = $(this).find('.comment-input').val();
                                var params = {
                                    'Context': 'رد شد (' + hameshDescription + ')',
                                    'DocumentId': DocumentId,
                                    'CreatorActorId': CurrentUserActorId,
                                    'InboxId': InboxId
                                };
                                FormManager.InsertHamesh(params,
                                    function() {
                                        Office.Inbox.setResponse(dialogArguments.WorkItem, 0, "",
                                            function(data) {
                                                closeWindow({
                                                    OK: true,
                                                    Result: null
                                                });
                                            },
                                            function(err) {
                                                throw Error(err);
                                            }
                                        );
                                    }
                                );

                            } else {
                                $(this).notify('لطفاً علت رد را وارد نمایید', {
                                    position: 'top'
                                });
                                myHideLoading();
                            }
                        }
                    },
                    {
                        text: "انصراف",
                        click: function() {
                            $(this).dialog("close");
                        }
                    }
                ],
                open: function(event, ui) {
                    res = false;
                },
                close: function(e, u) {
                    if (res == true) {} else {}
                }
            });
            //-----------------------------------------------
        },
        function(e) {
            alert(e.details);
        }
    );
    //-----------------------------------------------
});
//#endregion btndecline.js

//#region btnAccept.js
//**********************************************
$("#btnAccept").click(function() {
    var hameshParams = {
        'Context': 'تایید شد',
        'DocumentId': DocumentId,
        'CreatorActorId': CurrentUserActorId,
        'InboxId': InboxId
    };

    FormManager.InsertHamesh(hameshParams,
        function() {
            Office.Inbox.setResponse(dialogArguments.WorkItem, 1, "",
                function(data) {
                    closeWindow({
                        OK: true,
                        Result: null
                    });
                },
                function(err) {
                    throw Error(err);
                }
            );
        }
    );
});
//*******************************************************
//#endregion btnAccept.js

