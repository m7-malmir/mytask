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
					$("#txtTotalPrice").val(commafy(list[0].OrderAmount));
					$("#txtTotalPriceWithDiscount").val(commafy(list[0].OrderNetAmount));
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
			//--------------------------------------------
			
			/******************************************************************************/
			showLoading();
			UserService.GetCurrentUser(true,
				function(data){
					hideLoading();
					//--------------------------------------------
					//خواندن اطلاعات کاربر درخواست دهنده محصولات	
					//--------------------------------------------				
					readEmployeeInfo(orderedPersonnelNO,
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
				//--------------------------------------------
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
						   GoodsId: $(this).find("col[name='GoodsId']").text(),
						   GoodsCode: $(this).find("col[name='GoodsCode']").text(),
						   GoodsName: $(this).find("col[name='GoodsName']").text(),
						   Qty: $(this).find("col[name='Qty']").text(),
						   CartonQTY: $(this).find("col[name='CartonQTY']").text(),
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

//#region tblOrderedGoods
var tblOrderedGoods = null;

$(function()
{
    tblOrderedGoods = (function()
    {
		//خواندن پارامترهای اصلی جدول
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.ReadPersonnelOrderDetail;
		//فراخوانی سازنده جدول
        init();
		//******************************************************************************************************
        function init()
        {
            element = $("#tblOrderedGoods");
            build();
            bindEvents();
            load();
        }
		//******************************************************************************************************
        function build()
        {       

        }
		//******************************************************************************************************
		//این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود
        function bindEvents()
        {
			//------------------------------------------------------
			// عملکرد دکمه منفی
			//------------------------------------------------------
			$(document).on('click', '.btn-negative', function () {
			    var row = $(this).closest('tr');
			    updateRowQty(row, false);
			    updateTotals();
			});
			//------------------------------------------------------
			
			//------------------------------------------------------
			// عملکرد دکمه مثبت
			//------------------------------------------------------
			$(document).on('click', '.btn-positive', function () {
			    var row = $(this).closest('tr');
			    updateRowQty(row, true);
			    updateTotals();
			});
			//------------------------------------------------------
        }
		
		/* *********************************************************************************************** */
		// عملیات پر کردن دیتای هر سطر می باشد
		function addRow(rowInfo, rowNumber) {
		    var index = 0,
		        tempRow = element.find("tr.row-template").clone();
		
		    tempRow.show().removeClass("row-template").addClass("row-data");
		    tempRow.data("rowInfo", rowInfo);
		    
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber); // شماره ردیف
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsId); // ID سفارش
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsCode); // کد محصول
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsName); // نام محصول
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.BrandName); // نام برند
			
			var Qty=(rowInfo.Qty)/(rowInfo.CartonQTY);
			tempRow.find("td:eq(" + index++ + ")").empty().text(Qty); // نام محصول  
		
			// مقدار Qty را اضافه می کنیم و کلاس qty را به آن اضافه می کنیم
			var qtyCell = tempRow.find("td:eq(" + index++ + ")").empty();
			qtyCell.append(
			    $('<span class="btn-negative" title="کاهش تعداد" style="cursor: pointer; color: white; background-color: red; border: none; border-radius: 3px; padding: 0px 5px 0px 5px; margin-right: 5px; font-weight: bold; width: 30px; text-align: center;">-</span>')
			);
				qtyCell.append($('<span class="qty" style="margin-right: 5px;"></span>').text(Qty)); // اضافه کردن کلاس qty به عنصر Span و مارجین راست
			qtyCell.append(
			    $('<span class="btn-positive" title="افزایش تعداد" style="cursor: pointer; color: white; background-color: green; border: none; border-radius: 3px; padding: 0px 5px 0px 5px; margin-right: 5px; font-weight: bold; width: 30px; text-align: center;">+</span>')
			);
		    tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.UnitPrice)); // قیمت واحد
		    tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.BeforeDiscountGoodsPrice)); // قیمت قبل از تخفیف
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.CartonQTY); // نام برند
		    tempRow.attr({ state: "new" });
		    element.find("tr.row-template").before(tempRow);
		    myHideLoading();
		}
		//******************************************************************************************************
		//حذف یک سطر
        function removeRow(row)
        {
			row_info = row.data("rowInfo");
			
			var params={Where: rowPrimaryKeyName + " = " + row_info.Id}
			
			deleteRows(params,
                function(data)
                {
					refresh();
					hideLoading();
                },
                function(error)
                {
					hideLoading();
                    alert(error);
                }
            );
        }
		//******************************************************************************************************
		//اگر شماره سفارش وجود داشت سفارشات کاربر در جدول نمایش داده میشود
        function load()
        {
			if(!orderId) return;
			var params = {Where: "OrderId = " + orderId};
			showLoading();
            readRows(params,
                function(list)
                {
					if(list.length > 0){
						for(var i = 0, l = list.length; i < l; i += 1)
	                    {
	                        addRow(list[i], i + 1);
	                    }
					}
					myHideLoading();
                },
                function(error)
                {
					myHideLoading();
                    alert(error);
                }
            );
        }
		//******************************************************************************************************
		//  محاسبه و آپدیت مقدار جدید در جدول برای دکمه های موجود در ستون تعداد تایید شده
		function updateRowQty(row, isIncrease) {
		    var qtyElement = row.find('.qty');
		    var qty = parseInt(qtyElement.text());
		    var unitPrice = parseInt(row.find('td:eq(7)').text().replace(/,/g, '')); // قیمت واحد
		    unitPrice = unitPrice * (parseInt(row.data("rowInfo").CartonQTY));
		    var priceElement = row.find('td:eq(8)');
		    var Qty = (parseInt(row.data("rowInfo").Qty)) / (parseInt(row.data("rowInfo").CartonQTY));
		    var maxQty = Qty;
		
		    if (isIncrease && qty < maxQty) {
		        qty++;
		    } else if (!isIncrease && qty > 0) {
		        qty--;
		    }
		    // بروزرسانی مقدار و قیمت سطر
		    qtyElement.text(qty);
		    priceElement.text(commafy(qty * unitPrice));
		}
		//******************************************************************************************************
		// محاسبه مقدار تخفیف و جمع نهایی برای دکمه های موجود در ستون تعداد تایید شده
		function updateTotals() {
		    let total = 0;
		    $('#tblOrderedGoods tbody tr.row-data').each(function () {
		        var priceText = $(this).find('td:eq(8)').text().replace(/,/g, '');
		        var price = parseInt(priceText, 10) || 0;
		        total += price;
		    });
		    var discountPercent = parseFloat($('#txtDiscountPercent').val().replace('%', '')) || 0;
		    var discountAmount = Math.floor(total * discountPercent / 100);
		    var finalTotal = total - discountAmount;
		
		    $('#txtTotalPrice').val(commafy(total));
		    $('#txtTotalPriceWithDiscount').val(commafy(finalTotal));
		}
		//******************************************************************************************************
		//بروز رسانی دیتای جدول
        function refresh()
        {
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
//#endregion

//#region btnDecline.js
$("#btnDecline").click(function(){
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
			//-----------------------------------------------
			// فراخوانی sp برای بازگردانی مقدار اعتبار کاربر
			//-----------------------------------------------
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
			//--------------------------------------------
		     },
        function(e) {
            alert(e.details);
        }
    );
	//--------------------------------------------
});

//#endregion

//#region btnAccept.js
$("#btnAccept").click(function(){
	const table = document.getElementById("tblOrderedGoods");
	const items = [];
	
	const PersonnelOrderId = $form.getPK();
	const Type = 1;
	//--------------------------------------------
	// خواندن دیتا جدول tblOrderedGoods
	//--------------------------------------------
	for (let i = 1; i < table.rows.length; i++) {
	    const row = table.rows[i];
	    if (row.classList.contains('row-data')) {
	        const goodsIdCell = row.cells[1];
	        const confirmQtyCell = row.cells[6];
	        const cartonQtyCell = row.cells[9];
	
	        if (goodsIdCell && confirmQtyCell && cartonQtyCell) {
	            const goodsId = goodsIdCell.innerText.trim();
	            const qtySpan = confirmQtyCell.querySelector('.qty');
	            let confirmQty = qtySpan ? qtySpan.innerText.trim().replace(/,/g, '') : "0";
	            confirmQty = parseInt(confirmQty) || 0;
	            let cartonQty = cartonQtyCell.innerText.trim().replace(/,/g, '');
	            cartonQty = parseInt(cartonQty) || 0;
	            const totalQty = confirmQty * cartonQty;
	
	            if (goodsId) {
	                items.push({
	                    goodsId: goodsId,
	                    confirmQty: totalQty
	                });
	            }
	        }
	    }
	}
	//--------------------------------------------
	
	//اگر کاربر در کارخانه یا دفتر مرکزی مستقر نیست
	 if (DCId > 1) {
 		$.alert("این فرآیند ویژه پرسنل مستقر در دفتر مرکزی می باشد","","rtl",function(){
			hideLoading();
        	closeWindow({OK:true, Result:null});
		  });
          return;
      }
	// ارسال این آرایه تبدیل شده به رشته (stringify) در پارامتر JsonArray
	const sp_params = {
	    PersonnelOrderId: PersonnelOrderId,
	    JsonArray: JSON.stringify(items), 
	    Type: Type
	};
	//--------------------------------------------
	// فراخوانی sp برای ثبت تغییر تعداد تایید شده
	//--------------------------------------------
    FormManager.retailPersonnelOrder(
        sp_params,
        function(data) {
			
            var hameshParams = {
                Context: 'تایید شد',
                DocumentId: DocumentId,
                CreatorActorId: CurrentUserActorId,
                InboxId: InboxId
     	};		
			//----------------------------------------------------------------------------------------
			// تغییر لین با توجه به اینکه پرسنل درخواست دهنده در دفتر مرکزی مستقر است یا کارخانه
			//----------------------------------------------------------------------------------------
            FormManager.InsertHamesh(hameshParams, function() {
                if (DCId == 0) {
                    Office.Inbox.setResponse(dialogArguments.WorkItem, 1, "", function(data) {
                        closeWindow({ OK: true, Result: null });
                    }, function(err) {
                        throw Error(err);
                    });
                } else if (DCId == 1) {
                    Office.Inbox.setResponse(dialogArguments.WorkItem, 2, "", function(data) {
                        closeWindow({ OK: true, Result: null });
                    }, function(err) {
                        throw Error(err);
                    });
                }
            });
        },
		//----------------------------------------------------------------------------------------
        function(e) {
            alert(e.details);
        }
    );
});

//#endregion btnAccept.js