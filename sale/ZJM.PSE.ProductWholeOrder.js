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
			inTestMode = false,
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
		// برای دریافت شناسه فرایند بعد از ایجاد و یا در ویرایش استفاده می شود
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
		function isInTestMode()
		{
			return inTestMode;
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
				/*
                var xmlvar = $.xmlDOM(data);
				alert(JSON.stringify(data));
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


//#region tblGoods.js
var tblMain = null;
 // متغیر برای ذخیره مقدار انتخاب شده برند
var selectedBrandValue = '0';

$(function () {
    tblMain = (function () {
        //خواندن پارامترهای اصلی جدول
        var element = null,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readGoodsCatalogue;
        //فراخوانی سازنده جدول
        init();
        //******************************************************************************************************
        function init() {
            element = $("#tblGoods");
            build();
            bindEvents();
        }
        //******************************************************************************************************
        function build() {
            //----------------------------------------------------
            // متد تغییر برند انتخاب شده
            //----------------------------------------------------
            $('#cmbBrandFilter').change(function () {
                selectedBrandValue = $(this).find("option:selected").val();

                if (!selectedBrandValue || selectedBrandValue === 'undefined') {
                    params = {}; // همه دیتاها
                } else {
                    params = { WHERE: "BrandRef = N'" + selectedBrandValue + "'" }; // فیلتر شده
                }
                showLoading();

                // پاک کردن ردیف‌های قبلی
                element.find("tr.row-data").remove();

                readRows(params,
                    function (list) {
                        if (list.length > 0) {
                            for (var i = 0, l = list.length; i < l; i += 1) {
                                addRow(list[i], i + 1);
                            }
                        }
                        myHideLoading();
                    },
                    function (error) {
                        myHideLoading();
                        alert(error);
                    }
                );
            });
            //----------------------------------------------------



            //----------------------------------------------------
            // تعریف متد کلیک بر روی چک باکس انتخاب در هر ردیف
            //----------------------------------------------------
            element.on("click", ".CHbox", function () {
                var checkbox = this;
                if (!this.checked) return;

				let $row = $(this).closest("tr");
				let goodsId = $row.find("td").eq(2).text().trim();
				let goodsCode = $row.find("td").eq(3).text().trim();
				let brandName = $row.find("td").eq(4).text().trim();
				let goodsName = $row.find("td").eq(5).text().trim();
				
				let CartonQTY = $row.find("td").eq(6).text().trim();
				let UnitName = $row.find("td").eq(7).text().trim();
				//قیمت یک واحد تکی
				var price = parseInt(rcommafy($row.find("td").eq(8).text()), 10);
				//قیمت یک بسته کامل
				var unitPrice = parseInt(rcommafy($row.find("td").eq(9).text()), 10);

                if (isNaN(price)) {
                    alert("قیمت کالا نامعتبر است!");
                    return;
                }

                if (!goodsId) {
                    alert("شناسه محصول نامعتبر است");
                    return;
                }

                var alreadyAdded = $('#tblOrderedGoods tbody tr[data-id="' + goodsId + '"]').length > 0;
                if (alreadyAdded) {
                    alert("این کالا قبلاً به سفارش اضافه شده است");
                    return;
                }

                var tempRow = $("<tr></tr>").attr("data-id", goodsId);

                tempRow.append($("<td></td>").text("*").css({
                    "width": "25px",
                    "background-color": "#E0F6FE",
                    "border": "solid 1px #BED4DC",
                    "text-align": "center"
                }));

                //------------------------------------------------
                //	ستون شناسه کالا
                //------------------------------------------------
                tempRow.append($("<td></td>").css({
                    "width": "120px",
                    "display": "none",
                    "border": "solid 1px #BED4DC"
                }).text(goodsId));
                //------------------------------------------------


                //------------------------------------------------
                //	ستون حذف سطر
                //------------------------------------------------
                var removeBtn = $("<button/>", {
                    title: "حذف"
                })
                    .css({
                        cursor: "pointer",
                        backgroundColor: "red",
                        color: "white",
                        border: 0,
                        padding: "5px 0px",
                        borderRadius: "50px",
                        lineHeight: "1.2rem",
                        fontSize: "20px",
                        width: "20px",
                        height: "20px",
                        textAlign: "center"
                    }).text("-").on("click", function () {
                        var $removedRow = $(this).closest("tr");

                        let removedProductId = $removedRow.attr("data-id");

                        $('#tblGoods tbody tr').each(function () {
                            var $row = $(this);
                            var rowProductId = $row.find("td").eq(2).text().trim();
                            if (rowProductId === removedProductId) {
                                $row.find('.CHbox').prop("disabled", false).prop("checked", false); // فعال و بدون تیک
                            }
                        });

                        $removedRow.remove();
                        updateTotalPrice();
                    });

                tempRow.append($("<td></td>").append(removeBtn).css({
                    "width": "80px",
                    "border": "solid 1px #BED4DC"
                }));
                //------------------------------------------------


                //------------------------------------------------
                //	ستون کد کالا
                //------------------------------------------------
                tempRow.append($("<td></td>").css({
                    "width": "100px",
                    "border": "solid 1px #BED4DC"
                }).text(goodsCode));
                //------------------------------------------------


                //------------------------------------------------
                //	ستون نام برند
                //------------------------------------------------
                tempRow.append($("<td></td>").css({
                    "width": "120px",
                    "border": "solid 1px #BED4DC"
                }).text(brandName));
                //------------------------------------------------


                //------------------------------------------------
                //	ستون نام کالا
                //------------------------------------------------
                tempRow.append($("<td></td>").css({
                    "width": "320px",
                    "border": "solid 1px #BED4DC"
                }).text(goodsName));
                //------------------------------------------------


                //------------------------------------------------
                //	دکمه افزودن تعداد
                //------------------------------------------------
                var plusBtn = $("<button/>").text("+").css({
                    "font-weight": "900",
                    "width": "18px",
                    "height": "18px",
                    "fontSize": "12px",
                    "background-color": "#000",
                    "border": "1px solid #fcfcfc",
                    "border-radius": "50%",
                    "color": "#fff",
                    "display": "inline-block",
                    "margin": "0 2px"
                });
                //------------------------------------------------


                //------------------------------------------------
                //	دکمه کاهش تعداد
                //------------------------------------------------
                var minusBtn = $("<button/>").text("-").css({
                    "font-weight": "900",
                    "width": "18px",
                    "height": "18px",
                    "fontSize": "12px",
                    "background-color": "#000",
                    "border": "1px solid #fcfcfc",
                    "border-radius": "50%",
                    "color": "#fff",
                    "display": "inline-block",
                    "margin": "0 2px"
                });
                //------------------------------------------------


                //------------------------------------------------
                // تعداد و دکمه های افزایش و کاهش آن
                //------------------------------------------------
                var quantity = 1;
                var quantityDisplay = $("<span></span>").text(quantity).css({
                    "margin": "0 12px",
                    "fontSize": "13px",
                    "display": "inline-block",
                    "min-width": "16px",
                    "text-align": "center"
                });

                var quantityCell = $("<td></td>").css({
                    "width": "50px",
                    "border": "solid 1px #BED4DC",
                    "text-align": "center",
                    "white-space": "nowrap"
                }).append(minusBtn).append(quantityDisplay).append(plusBtn);

                tempRow.append(quantityCell);
                //------------------------------------------------
				
				//------------------------------------------------
				// تعداد در کارتن
				//------------------------------------------------
				tempRow.append($("<td class='price-unit'></td>").css({
					"width": "100px",
					"border": "solid 1px #BED4DC",
					"text-align": "center"
				}).text(commafy(CartonQTY)));
				//------------------------------------------------


				//------------------------------------------------
				// نام واحد
				//------------------------------------------------
				tempRow.append($("<td class='price-unit'></td>").css({
					"width": "100px",
					"border": "solid 1px #BED4DC",
					"text-align": "center"
				}).text(commafy(UnitName)));
				//------------------------------------------------
				

                //------------------------------------------------
                // قیمت واحد (فی)
                //------------------------------------------------
                tempRow.append($("<td class='price-unit'></td>").css({
                    "width": "100px",
                    "border": "solid 1px #BED4DC",
                    "text-align": "center"
                }).text(commafy(price)));
                //------------------------------------------------


                //------------------------------------------------
                // قیمت کل
                //------------------------------------------------
                tempRow.append($("<td class='total-price'></td>").css({
                    "width": "140px",
                    "border": "solid 1px #BED4DC",
                    "text-align": "center"
                }).text(commafy(unitPrice))); // جمع واحد × تعداد = چون تعداد ۱ فعلاً
                //------------------------------------------------


                //------------------------------------------------
                // کلیک دکمه افزایش تعداد
                //------------------------------------------------
                plusBtn.on("click", function () {
                    let currentRow = this.closest('tr');
                    let cells = currentRow.querySelectorAll("td");
                    let currentquantity = parseInt(cells[6].querySelector("span").innerText.trim());
					//alert(JSON.stringify(currentquantity));

                    // قیمت کل فعلی
                    let currentTotal = parseInt(cells[10].innerText.replace(/,/g, ''));
					
                    // قیمت جدید با افزایش مقدار کالا
                    let itemNewTotal = (currentquantity + 1) * unitPrice;

                    // قیمت فعلی کالا
                    let itemCurrentTotal = currentquantity * unitPrice;

                    // قیمت کل جدید
                    let newTotal = currentTotal - itemCurrentTotal + itemNewTotal;

                    //تعداد جدید
                    cells[6].querySelector("span").innerText = parseInt(currentquantity) + 1;

                    //قیمت کل ردیف
                    cells[10].innerText = commafy(newTotal);

                    updateTotalPrice();
                });
                //------------------------------------------------


                //------------------------------------------------
                // کلیک دکمه کاهش تعداد
                //------------------------------------------------
                minusBtn.on("click", function () {
                    let currentRow = this.closest('tr');
                    let cells = currentRow.querySelectorAll("td");
                    let currentquantity = parseInt(cells[6].querySelector("span").innerText.trim());

                    if (currentquantity > 1) {
                        // قیمت کل فعلی
                        let currentTotal =  parseInt(cells[10].innerText.replace(/,/g, ''));
                        
                        // قیمت جدید با افزایش مقدار کالا
                        let itemNewTotal = (currentquantity - 1) * unitPrice;

                        // قیمت فعلی کالا
                        let itemCurrentTotal = currentquantity * unitPrice;

                        // قیمت کل جدید
                        let newTotal = currentTotal - itemCurrentTotal + itemNewTotal;

                        //تعداد جدید
                        cells[6].querySelector("span").innerText = parseInt(currentquantity) - 1;

                        //قیمت کل ردیف
                        cells[10].innerText = commafy(newTotal);

                        updateTotalPrice();
                    }
                });
                //------------------------------------------------

                $('#tblOrderedGoods tbody').append(tempRow);
                $(this).prop("disabled", true);

                updateTotalPrice();
            });
        }
        //******************************************************************************************************
        //این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود
        function bindEvents() {
        }
        //******************************************************************************************************
        //عملیات پر کردن دیتای هر سطر می باشد
        function addRow(rowInfo, rowNumber) {
			var index = 0,
			tempRow = element.find("tr.row-template").clone();

			tempRow.show().removeClass("row-template").addClass("row-data");
			tempRow.data("rowInfo", rowInfo);

			tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);

			var CHbox = $("<input type='checkbox'  value='" + rowInfo.Id + "'>").addClass('CHbox');
			tempRow.find("td:eq(" + index++ + ")").append(CHbox);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsId);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsCode);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.BrandName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.UnitName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.CartonQTY);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.Price));
			let unitPrice=(rowInfo.CartonQTY)*(rowInfo.Price);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(unitPrice));
			element.find("tr.row-template").before(tempRow);
			myHideLoading();
			
        }
        //******************************************************************************************************
        //حذف یک سطر
        function removeRow(row) {
            row_info = row.data("rowInfo");

            var params = { Where: rowPrimaryKeyName + " = " + row_info.Id }

            deleteRows(params,
                function (data) {
                    refresh();
                    hideLoading();
                },
                function (error) {
                    hideLoading();
                    alert(error);
                }
            );
        }
        //******************************************************************************************************
        //برگذاری دیتا برای نمایش که در صورت لزوم می توان یک لیست به آن پاس داد
        function load() {
            showLoading();

            let params = { WHERE: "BrandRef = '" + selectedBrandValue + "'" }; // فیلتر شده با سان استار
			
            readRows(params,
                function (list) {
                    if (list.length > 0) {
                        for (var i = 0, l = list.length; i < l; i += 1) {
                            addRow(list[i], i + 1);
                        }
                    }
                    myHideLoading();
                },
                function (error) {
                    myHideLoading();
                    alert(error);
                }
            );
        }
        //******************************************************************************************************
        //بروز رسانی دیتای جدول
        function refresh() {
            //حذف دیتای موجود
            element.find("tr.row-data").remove();

            //بازنشانی دیتای جدول
            load();
        }
        //******************************************************************************************************
        // محاسبه قیمت کل سفارش بدون تخفیف
        function getTotalPrice() {
            let totalPrice = 0;
            $('#tblOrderedGoods tbody tr').each(function () {
                var priceText = $(this).find('td.total-price').text().replace(/,/g, '');
                var price = parseInt(priceText, 10) || 0;
                totalPrice += price;
            });
            return totalPrice;
        }
        //******************************************************************************************************
        function updateTotalPrice() {
            var total = getTotalPrice();
            var discountAmount = Math.floor(total * discountPercentForUser / 100);
            var finalTotal = total - discountAmount;
           
            var currentRemainingBalance = parseInt($('#txtRemainCredit').val().trim().replace(/,/g, ''));
            var remainCredit = 0;
			
			if ($('#txtDiscountPercent').val()=="100")
			{
				remainCredit = parseInt($('#txtRemainCredit').val().trim().replace(/,/g, '')) - total;
			}
			else
			{
				remainCredit = parseInt($('#txtRemainCredit').val().trim().replace(/,/g, '')) - finalTotal;
			}

            // استفاده از اعتبار فعال می باشد و باید اعتبار کنترل شود
            if (cancelCredit === 'false') {
					
                // اگر اعتبار باقیمانده کوچک تر از جمع کل تخفیف دار است
                if (currentRemainingBalance < finalTotal) {
                    // در صورتی که اعتبار کافی نیست، پیغام تأیید را نمایش می‌دهیم
                    var confirmation = confirm("مبلغ فاکتور بیشتر از باقیمانده اعتبار شما می باشد، در صورت تایید برای ادامه کل مبلغ سفارش جاری و سفارشات آتی با " + discountPercentBase + "% تخفیف محاسبه خواهد گردید.");
                    if (confirmation) {
                        // اگر کاربر تأیید کند، نشانگر عدم استفاده از اعتبار را به روز کنیم
                        var list = {
                            'CancelCredit': true
                        };
                        list = $.extend(list, {
                            Where: "PersonnelCode = '" + currentUserName + "'"
                        });

                        FormManager.updatePersonnelCredit(list,
                            function (status, list) {
                                $.alert("لغو استفاده از مانده اعتبار و محاسبه سفارشات بعدی با قیمت تخفیف پایه اعمال گردید", "", "rtl", function () {
                                    cancelCredit = 'true';
                                    discountPercentForUser = discountPercentBase; // تغییر تخفیف به تخفیف پایه
                                    $("#txtDiscountPercent").val(discountPercentForUser);
                                });
                            },
                            function (error) {
                                console.log("خطای برگشتی:", error);
                                $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                            }
                        );
                    }
                    else {
						$("#tblOrderedGoods").find("tbody tr:last").remove();
						updateTotalPrice();
						refresh();
                        return;
                    }
                }

                $('#txtRemainCreditNew').val(commafy(remainCredit));
            }
			
			$('#txtTotalPrice').val(commafy(total));
            $('#txtTotalPriceWithDiscount').val(commafy(finalTotal));
            $('#txtDiscountPercent').val(discountPercentForUser + '%'); // درصد تخفیف

        }
        //******************************************************************************************************

        return {
            refresh: refresh,
            load: load
        };
    }());
});
//#endregion


//#region btnregisterrequest.js
$("#btnRegister").click(function(){
	//---------------------------
	// جمع آوری داده ها از جدول #tblOrderedGoods
	//---------------------------
	const table = document.getElementById("tblOrderedGoods");
    const rows = table.querySelectorAll("tr");
    const goodsList = [];
	var totalQty;
    rows.forEach((row, index) => {
        // Skip header and template row
        if (index === 0 || row.classList.contains("row-template")) return;
        const cells = row.querySelectorAll("td");
        if (cells.length < 9) return;
			var Qty= cells[6].querySelector("span") ? cells[6].querySelector("span").innerText.trim() : '';
			var cartonQty= cells[8].innerText.trim();
        const item = {
            GoodsId: cells[1].innerText.trim(),
            GoodsCode: cells[3].innerText.trim(),
            BrandName: cells[4].innerText.trim(),
            GoodsName: cells[5].innerText.trim(),
			Qty: Qty*cartonQty,
            UnitPrice: cells[9].innerText.trim().replace(/,/g, '')
       };
       goodsList.push(item);
	});
	//---------------------------
	
	// بررسی وجود داده
	if (goodsList.length === 0) {
	    alert("هیچ داده‌ای برای ارسال وجود ندارد.");
	    return;
	}

	// ارسال پارامترها با نام صحیح
	var sp_params = {
		UserId: currentUserId,
		username: currentUserName,
		jsonArray: JSON.stringify(goodsList),
		Description: $("#txtDiscription").val()
	};
	
	FormManager.retailPersonnelOrder(
	    sp_params,
	    function(data) {
	        WorkflowService.RunWorkflow("ZJM.PSW.ProdutWholesale",
	            '<Content><Id>' + data["OrderId"] + '</Id><IsInTestMode>' + $form.isInTestMode() + '</IsInTestMode></Content>',
	            true,
	            function(data) {
	                handleRunWorkflowResponse(data);
	            },
	            function(err) {
					 handleError(err, 'WorkflowService.RunWorkflow');
	            }
	        );
	    },
	    function(e) {
	        alert(e.details);
	    }
	);
});

//#endregion