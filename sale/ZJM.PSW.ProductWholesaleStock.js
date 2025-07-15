//#region js.ready
var $form;

//---------------------------------
// Global Variables For UserInfo
//---------------------------------
var currentUserName;
var currentPersonnelNO;
var currentUserCompanyId;
var nationalCode;
var currentUserfirstName;
var currentUserlastName;
var birthday;
var email;
var employmentDate;
var rankTitle;
var leaveDate;
var gender;
var isInTestMode = false;
var currentActorId;
var selectedValue;
//---------------------------------
var ProcessStatus;
var currentUserId;

var discountPercentBase;
var discountPercentMax;
var discountPercentForUser;
var remainCredit;
var cancelCredit;

$(function(){
	$form = (function()
	{ 
		var pk,
			inTestMode = (typeof isInTestMode !== "undefined" ? isInTestMode : false),
			inEditMode = false,
			primaryKeyName = "Id",
			readBrandName=FormManager.readBrandName,
			readPersonnelCredit=FormManager.readPersonnelCredit,
			readEmployeeInfo = UserHelpes.readEmployeeInfo;
		//******************************************************************************************************	
		function init()
		{ 
			build();
			createControls();
			bindEvents();
		}
        //******************************************************************************************************
		function build()
		{
			//اگر بخواهیم استیل دهی خاصی داشته باشیم در این متد اعمال می شود
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
			
			//-------------------------------------
			//	پر کردن لیست برندها با کمبوباکس
			//-------------------------------------
			var jsonParams = {};
		    readBrandName(jsonParams, function(brandOptions) {
		        $('#cmbBrandFilter').html(brandOptions);
		    }, function(error) {
		        console.error("Error fetching brand data:", error);
		    });
			//-----------------------------------
		}

		//******************************************************************************************************
		//مقداردهی به المان ها در هر دو حالت ویرایش و ایجاد
		function createControls()
		{
			
			//-----------------------------------
			//  چک کردن بازه مجاز برای ثبت محصول
			//-----------------------------------
			if(!isAllowedTime()) {
		        $.alert("بازه مجاز درخواست محصول عمده از شنبه تا سه شنبه ساعت 12 می باشد!","","rtl",function(){
					hideLoading();
		        	closeWindow({OK:true, Result:null});
				});
				return;				
			}
			//-----------------------------------
			showLoading();
			UserService.GetCurrentUser(true,
				function(data){
						hideLoading(); 
						var xml = $.xmlDOM(data);
						currentUserId = xml.find("user > id").text().trim();
				        currentUserName = xml.find("user > username").text().trim();
				        currentUserfirstName = xml.find("user > firstname").text().trim();
				        currentUserlastName = xml.find("user > lastname").text().trim();
				        currentActorId = xml.find("actor").attr("pk");
						$("#txtFullName").val(currentUserfirstName+' '+currentUserlastName);
						$("#txtPersonnelNO").val(currentUserName);
						
						readEmployeeInfo(currentUserName,
			                function(list)
			                {
								if(list.length > 1 ){
									$.alert("خطا در دیافت اطلاعات کاربری، لطفاً به پشتیبانی سیستم اطلاع رسانی نمایید","","rtl",function(){
										hideLoading();
							        	closeWindow({OK:true, Result:null});
									});
								}
								else {
									var params = {Where: "PersonnelCode = " + currentUserName.toString()};
									readPersonnelCredit(params,
										function(list)
										{
											if(list.length == 0 ){
												$.alert("هیچ اعتباری برای شما تعریف نشده است، لطفاً با جنرال سرویس تماس حاصل فرمائید","","rtl",function(){
													hideLoading();
										        	closeWindow({OK:true, Result:null});
												});
											}
											//----------------------------
											//  نمایش مانده اعتبار کاربر
											//----------------------------
											remainCredit=list[0].RemainCredit;
											discountPercentMax=list[0].DiscountPercent;
											discountPercentBase=list[0].LimitDiscountPercent;
											cancelCredit=list[0].CancelCredit;
											$("#txtRemainCredit").val(commafy(remainCredit));
											$("#txtRemainCreditNew").val(commafy(remainCredit));
											
											//------------------------------------------------------
											//چک کردن مقدار درصد تخفیف فعال برای پرسنل
											//------------------------------------------------------
											if(cancelCredit=='false'){
												discountPercentForUser=discountPercentMax;	
											}else{
												discountPercentForUser=discountPercentBase;
											}
											$("#txtDiscountPercent").val(discountPercentForUser);
											$("#txtTotalPrice").val('0');
											$("#txtTotalPriceWithDiscount").val('0');
											//------------------------------------------------------
											
										},
										function(error)
									    {
									        alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
									        myHideLoading();
											return;
									    }
									);
								}
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
					$ErrorHandling.Erro(err,"خطا در سرویس GetCurrentUser");
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
		//شرط لازم برای چک کردن ثبت محصول عمده در بازه مجاز
		function isAllowedTime() {
		    const now = new Date();
		    const day = now.getDay(); // 0:یکشنبه، 1:دوشنبه، ... 6:شنبه
		    const hour = now.getHours();
		    const minute = now.getMinutes();
		    const second = now.getSeconds();
		    
		    // اگر شنبه
		    if(day === 6 || day === 0 || day === 1) {
		        return true;
		    }
		    // اگر سه شنبه تا ساعت 12
		    if(day === 2 && hour < 12) {
		        return true;
		    }
		    // بازه غیر از ساعت مجاز
		    return false;
		}
		//******************************************************************************************************
		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			isInTestMode: isInTestMode,
			validateForm: validateForm,
			saveData: saveData
		};
	}());
	$form.init();
});
//#endregion js.ready

//#region formmanager.js
var FormManager = {
    /*********************************************************************************************************/
    // دریافت لیست برندها
    readBrandName: function (jsonParams, onSuccess, onError) {
        SP_vw_IS_GoodsCatalogue_Brand.Execute(jsonParams,
            function (data) {
                var xmlvar = $.xmlDOM(data);
                var brandOptions = '';
                brandOptions += '<option value="0">انتخاب نمایید</option>';

                xmlvar.find("row").each(function () {
                    var BrandRef = $(this).find(">col[name='BrandRef']").text();
                    var BrandName = $(this).find(">col[name='BrandName']").text();
                    brandOptions += '<option value="' + BrandRef + '">' + BrandName + '</option>';
                });

                if ($.isFunction(onSuccess)) {
                    onSuccess(brandOptions);
                }
            },
            function (error) {
                var methodName = "readBrandName";

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
    // دریافت اعتبار خرید کاربر جاری
    readPersonnelCredit: function (jsonParams, onSuccess, onError) {
        BS_HRPersonnelCredit.Read(jsonParams
            , function (data) {
                var list = [];
                var xmlvar = $.xmlDOM(data);
                xmlvar.find("row").each(
                    function () {
                        list.push
                            ({
                                Id: $(this).find("col[name='Id']").text(),
                                Credit: $(this).find("col[name='Credit']").text(),
                                RemainCredit: $(this).find("col[name='RemainCredit']").text(),
                                CancelCredit: $(this).find("col[name='CancelCredit']").text(),
                                DiscountPercent: $(this).find("col[name='DiscountPercent']").text(),
                                LimitDiscountPercent: $(this).find("col[name='LimitDiscountPercent']").text()
                            });
                    }
                );
                if ($.isFunction(onSuccess)) {
                    onSuccess(list);

                }
            },
            function (error) {
                var methodName = "readPersonnelCredit";

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
    // دریافت لیست کالاهای قابل فروش
    readGoodsCatalogue: function (jsonParams, onSuccess, onError) {
        BS_vw_IS_GoodsCatalogue.Read(jsonParams,
            function (data) {
                var list = [];
                var xmlvar = $.xmlDOM(data);
                xmlvar.find("row").each(
                    function () {
                        list.push
                            ({
                                GoodsId: $(this).find("col[name='GoodsId']").text(),
                                GoodsCode: $(this).find("col[name='GoodsCode']").text(),
                                GoodsName: $(this).find("col[name='GoodsName']").text(),
                                LogicalQty: $(this).find("col[name='LogicalQty']").text(),
								CartonQTY: $(this).find("col[name='CartonQTY']").text(),
                                Price: $(this).find("col[name='Price']").text(),
                                BrandName: $(this).find("col[name='BrandName']").text(),
								UnitName: $(this).find("col[name='UnitName']").text(),
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
    // ثبت سفارش، کاهش موجودی منطقی انبار، کاهش اعتبار کاربر جاری
    retailPersonnelOrder: function (jsonParams, onSuccess, onError) {
        SP_RetailPersonnelOrder.Execute(jsonParams,
            function (data) {

				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(data, "text/xml");

				const cols = xmlDoc.getElementsByTagName("col");
				
				const result = {};
				for (let i = 0; i < cols.length; i++) {
				    const name = cols[i].getAttribute("name");
				    const value = cols[i].textContent;
				    result[name] = value;
				}
				//alert(JSON.stringify(data));
				/*
                var xmlvar = $.xmlDOM(data);
				
                xmlvar.find("row").each(function () {
                    list.push({
                        Result: $(this).find("col[name='res']").text()
                    });
                });
				*/
                if ($.isFunction(onSuccess)) {
                    onSuccess(result);
                }
            },
            function (error) {
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
    },
    /**************************************************************************************************************/
    updatePersonnelCredit: function (jsonParams, onSuccess, onError) {
        BS_HRPersonnelCredit.Update(jsonParams,
            function (data) {

                var dataXml = null;
                if ($.trim(data) != "") {
                    dataXml = $.xmlDOM(data);
                }
                if ($.isFunction(onSuccess)) {
                    onSuccess(dataXml);
                }
            },
            function (error) {
                var methodName = "updatePersonnelCredit";

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
    /**************************************************************************************************************/
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