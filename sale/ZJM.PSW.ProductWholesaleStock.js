//#region js.ready
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
			isInTestMode = false;
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
					$("#txtCreditBalance").val('---');
					$("#txtDiscription").val(list[0].Description);
					tblOrderedGoods.refresh();	
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
					//خواندن اطلاعات کاربر درخواست دهنده محصولات					
					readEmployeeInfo(currentusername,
		                function(data)
		                {
							
							var xml = $.xmlDOM(data);
					        let user = data[0];
							DCId=user.DCId;
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
		// برای دریافت شناسه فرایند بعد از ایجاد و یا در ویرایش استفاده می شود
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
		function isInEditMode()
		{
			return inEditMode;
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
//#endregion js.ready



//#region formmanager.js
var FormManager = {
	

//******************************************************************************************************
readPersonnelOrder: function(jsonParams, onSuccess, onError)
{
  BS_IS_PersonnelOrder.Read(jsonParams
       , function(data)
       {
           var list = [];
           var xmlvar = $.xmlDOM(data);
           xmlvar.find("row").each(
               function()
               { 
                  list.push
                  ({
					Id: $(this).find("col[name='Id']").text(),
	                UserId: $(this).find("col[name='UserId']").text(),
					PersonnelNo: $(this).find("col[name='PersonnelNo']").text(),
					OrderAmount: $(this).find("col[name='OrderAmount']").text(),
				    PercentDiscount: $(this).find("col[name='PercentDiscount']").text(),
				    OrderNetAmount: $(this).find("col[name='OrderNetAmount']").text(),
				    RemainCreditBeforOrder: $(this).find("col[name='RemainCreditBeforOrder']").text(),
				    RemainCreditAfterOrder: $(this).find("col[name='RemainCreditAfterOrder']").text(),
					Description: $(this).find("col[name='Description']").text()
                  });
               }
           );
           if($.isFunction(onSuccess))
           {
               onSuccess(list);
           
           }
       }, onError
   );
},
/*********************************************************************************************************/
	ReadPersonnelOrderDetail: function(jsonParams, onSuccess, onError)
	{
	  BS_vw_IS_PersonnelOrderDetail.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                   list.push
	                   ({
			               OrderId: $(this).find("col[name='OrderId']").text(),
						   GoodsCode: $(this).find("col[name='GoodsCode']").text(),
						   GoodsName: $(this).find("col[name='GoodsName']").text(),
						   Qty: $(this).find("col[name='Qty']").text(),
						   BrandName: $(this).find("col[name='BrandName']").text(),
						   UnitPrice: $(this).find("col[name='UnitPrice']").text(),
						   BeforeDiscountGoodsPrice: $(this).find("col[name='BeforeDiscountGoodsPrice']").text(),
						   AfterDiscountGoodsPrice: $(this).find("col[name='AfterDiscountGoodsPrice']").text(),
	                   });
	               }
	           );
	           if($.isFunction(onSuccess))
	           {
	               onSuccess(list);
	           
	           }
	       }, onError
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

    // ثبت سفارش، کاهش موجودی منطقی انبار، کاهش اعتبار کاربر جاری
    retailPersonnelOrder: function(jsonParams, onSuccess, onError) {
        SP_IS_WholeSalePersonnelOrderRespond.Execute(jsonParams,
            function(data) {

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");

                const cols = xmlDoc.getElementsByTagName("col");

                const result = {};
                for (let i = 0; i < cols.length; i++) {
                    const name = cols[i].getAttribute("name");
                    const value = cols[i].textContent;
                    result[name] = value;
                }

                /* var xmlvar = $.xmlDOM(data);
				alert(JSON.stringify(data));
                xmlvar.find("row").each(function () {
                    list.push({
                        Result: $(this).find("col[name='res']").text()
                    });
                });*/

                if ($.isFunction(onSuccess)) {
                    onSuccess(result);
                }
            },
            function(error) {
                var methodName = "retailPersonnelOrder";

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
    }
    /*********************************************************************************************************/
};
//#endregion formmanager.js



//#region tblGoods.js

//#endregion