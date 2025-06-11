//#region main js
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

var currentActorId;
var selectedValue;
//---------------------------------
var CreditBalance;
var ProcessStatus;
var currentUserId;
var Discount;
var CancelCredit;
$(function(){
	$form = (function()
	{ 
		var pk,
			isInTestMode = false;
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
			readBrandName=FormManager.ReadBrandName,
			ReadPersonnelCredit=FormManager.ReadPersonnelCredit,
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
			var jsonParams = {}; // پارامترهای مورد نیاز برای خواندن داده‌ها
		    readBrandName(jsonParams, function(brandOptions) {
		        $('#CmbBrandFilter').html(brandOptions);
		    }, function(error) {
		        console.error("Error fetching brand data:", error);
		    });
		}
		//******************************************************************************************************
		//مقداردهی به المان ها در هر دو حالت ویرایش و ایجاد
		function createControls()
		{
			/******************************************************************************/

			showLoading();
			UserService.GetCurrentUser(true,
				function(data){
						hideLoading(); 
						FormManager.ReadPersonnelCredit({},
							function(list)
							{
								CreditBalance=list[0].RemainCredit;
								DiscountPercent=list[0].DiscountPercent;
								LimitDiscountPercent=list[0].LimitDiscountPercent;
								CancelCredit=list[0].CancelCredit;
								$("#txtCreditBalance").val(commafy(CreditBalance));	
							
								if(list[0].CancelCredit=='false'){
									Discount=DiscountPercent;	
								}else{
									Discount=LimitDiscountPercent;
								}
								
							},
							function(error)
						    {
						        alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
						        myHideLoading();
								return;
						    }
						);
						
						var xml = $.xmlDOM(data);
						currentUserId = xml.find("user > id").text().trim();
				        currentusername = xml.find("user > username").text().trim();
				        currentUserfirstname = xml.find("user > firstname").text().trim();
				        currentUserlastname = xml.find("user > lastname").text().trim();
				        currentActorId = xml.find("actor").attr("pk");
						$("#txtFullName").val(currentUserfirstname+' '+currentUserlastname);
						$("#txtPersonnelNO").val(currentusername);
						tblMain.refresh();
					
						readEmployeeInfo(currentusername,
			                function(list)
			                {
								if(list.length > 1 ){
									$.alert("خطا در دیافت اطلاعات کاربری، لطفاً به پشتیبانی سیستم اطلاع رسانی نمایید","","rtl",function(){
										hideLoading();
							        	closeWindow({OK:true, Result:null});
									});
								}
								else {
									if(list[0]["DCId"]!=0){
										$.alert("این فرآیند فقط برای پرسنل دفتر مرکزی فعال می باشد.","","rtl",function(){
											hideLoading();
								        	closeWindow({OK:true, Result:null});
										});
									}
									currentUserCompanyId = list[0]["CurrentUserCompanyId"];
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
//#endregion

//#region tblGoods js
var tblMain = null;

$(function()
{
    tblMain = (function()
    {
		//خواندن پارامترهای اصلی جدول
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readEntityGoodsCatalogue;
		//فراخوانی سازنده جدول
        init();
		//******************************************************************************************************
        function init()
        {
            element = $("#tblGoods");
            build();
            bindEvents();
        }
		//******************************************************************************************************
        function build()
        {   
			
        }
		//******************************************************************************************************
		//این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود
        function bindEvents()
        {
			
function commafy(num) {
    num = Math.floor(Number(num) || 0);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var element = $('#tblGoods');

element.on("click", ".CHbox", function () {
	var checkbox = this;
    if (!this.checked) return;

    var $row = $(this).closest("tr");
    var productId = $row.find("td").eq(2).text().trim();
    var goodsCode = $row.find("td").eq(3).text().trim();
    var brandName = $row.find("td").eq(4).text().trim();
    var goodsName = $row.find("td").eq(5).text().trim();
    var price = parseInt($row.find("td").eq(6).text().replace(/,/g, '').trim(), 10);

    if (isNaN(price)) { alert("قیمت کالا نامعتبر است!"); return; }
    if (!productId) { alert("شناسه محصول نامعتبر است."); return; }

    var alreadyAdded = $('#tblOrderedGoods tbody tr[data-id="' + productId + '"]').length > 0;
    if (alreadyAdded) {
        alert("این کالا قبلاً اضافه شده است.");
        return;
    }

    // بررسی اعتبار و تخفیف
    checkCreditAndDiscount(price, function (proceed) {
        if (!proceed) {
	        // ❗ تیک چک‌باکس رو برگردون
	        setTimeout(function () {
	            $(checkbox).prop("checked", false);
	        }, 0);
	        return;
	    }
        var tempRow = $("<tr></tr>").attr("data-id", productId);
        tempRow.append($("<td></td>").text("*").css({ "width": "25px", "background-color": "#E0F6FE", "border": "solid 1px #BED4DC", "text-align": "center" }));
        tempRow.append($("<td></td>").css({ "width": "120px", "display": "none", "border": "solid 1px #BED4DC" }).text(productId));

		var removeBtn = $("<button/>", { title: "حذف" })
		    .css({
		        cursor: "pointer", backgroundColor: "red", color: "white", border: 0,
		        padding: "5px 0px", borderRadius: "50px", lineHeight: "1.2rem", fontSize: "20px", width: "20px",
		        height: "20px", textAlign: "center"
		    }).text("-").on("click", function () {
		        var $removedRow = $(this).closest("tr");
		        var removedProductId = $removedRow.attr("data-id");
		        $('#tblGoods tbody tr').each(function () {
		            var $row = $(this);
		            var rowProductId = $row.find("td").eq(2).text().trim();
		            if (rowProductId === removedProductId) {
		                $row.find('.CHbox').prop("disabled", false).prop("checked", false); // فعال و بدون تیک
		            }
		        });

        $removedRow.remove();
        updateTotalPrice();
        checkAddButtonState();
    });
        tempRow.append($("<td></td>").append(removeBtn).css({ "width": "80px", "border": "solid 1px #BED4DC" }));
        tempRow.append($("<td></td>").css({ "width": "100px", "border": "solid 1px #BED4DC" }).text(goodsCode));
        tempRow.append($("<td></td>").css({ "width": "120px", "border": "solid 1px #BED4DC" }).text(brandName));
        tempRow.append($("<td></td>").css({ "width": "320px", "border": "solid 1px #BED4DC" }).text(goodsName));

        var quantity = 1;
        var plusBtn = $("<button/>").text("+").css({
            "font-weight": "900", "width": "18px", "height": "18px", "fontSize": "12px", "background-color": "#000",
            "border": "1px solid #fcfcfc", "border-radius": "50%", "color": "#fff", "display": "inline-block", "margin": "0 2px"
        });
        var minusBtn = $("<button/>").text("-").css({
            "font-weight": "900", "width": "18px", "height": "18px", "fontSize": "12px", "background-color": "#000",
            "border": "1px solid #fcfcfc", "border-radius": "50%", "color": "#fff", "display": "inline-block", "margin": "0 2px"
        });
        var quantityDisplay = $("<span></span>").text(quantity).css({
            "margin": "0 12px", "fontSize": "13px", "display": "inline-block", "min-width": "16px", "text-align": "center"
        });

        var quantityCell = $("<td></td>").css({
            "width": "50px", "border": "solid 1px #BED4DC", "text-align": "center", "white-space": "nowrap"
        }).append(minusBtn).append(quantityDisplay).append(plusBtn);

        tempRow.append(quantityCell);

        // قیمت واحد (فی)
        tempRow.append($("<td class='price-unit'></td>").css({
            "width": "100px", "border": "solid 1px #BED4DC", "text-align": "center"
        }).text(commafy(price)));

        // قیمت کل
        tempRow.append($("<td class='total-price'></td>").css({
            "width": "140px", "border": "solid 1px #BED4DC", "text-align": "center"
        }).text(commafy(price))); // جمع واحد × تعداد = چون تعداد ۱ فعلاً

        function updateRowTotal() {
            var totalPrice = quantity * price;
            tempRow.find('.total-price').text(commafy(totalPrice));
            updateTotalPrice();
            checkAddButtonState();
        }

        plusBtn.on("click", function () {
            if (quantity >= 10) {
                alert("تعداد هر کالا نمی تواند بیشتر از 10 باشد.");
                return;
            }
            var currentTotal = getTotalPrice();
            var nextItemTotal = (quantity + 1) * price;
            var currentItemTotal = quantity * price;
            var newTotal = currentTotal - currentItemTotal + nextItemTotal;

            checkCreditAndDiscount(newTotal, function (proceed) {
                if (!proceed) {
                    alert("مقدار خرید شما بیشتر از مبلغ باقیمانده است.");
                    return;
                }
                quantity++;
                quantityDisplay.text(quantity);
                updateRowTotal();
            });
        });

        minusBtn.on("click", function () {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.text(quantity);
                updateRowTotal();
            }
        });

        $('#tblOrderedGoods tbody').append(tempRow);
        $(this).prop("disabled", true);
        updateTotalPrice();
        checkAddButtonState();
    });
});

function checkCreditAndDiscount(price, callback) {
    if (CancelCredit === 'false') {
        var remainingBalance = CreditBalance - getTotalPrice();
        if (remainingBalance < price) {
            var confirmation = confirm("مبلغ فاکتور بیشتر از باقیمانده اعتبار شما می باشد، در صورت تایید برای ادامه کل مبلغ سفارش جاری و سفارشات آتی با 35% تخفیف محاسبه خواهد گردید.");
            if (confirmation) {
                var list = {
                    'CancelCredit': true
                };
                list = $.extend(list, { Where: "PersonnelCode = '" + currentusername + "'" });

                FormManager.updatePersonnelCredit(list,
                    function (status, list) {
                        $.alert("اعتبار شما با موفقیت به روز شد.", "", "rtl", function () {
                            CancelCredit = 'true'; // ✅ مقدار JS را به‌روزرسانی کردیم
                            Discount = 35; // تغییر به 35% تخفیف
                            updateTotalPrice(); // به‌روزرسانی قیمت‌ها
                            callback(true); // ادامه محاسبات
                        });
                    },
                    function (error) {
                        console.log("خطای برگشتی:", error);
                        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                        callback(false); // متوقف کردن ادامه
                    }
                );
            } else {
                callback(false); // متوقف کردن ادامه
            }
        } else {
            callback(true); // ادامه محاسبات
        }
    } else {
        Discount = 35; // تخفیف 35% در حالت آزاد
        callback(true); // ادامه محاسبات
    }
}


function updateCreditBalance(callback) {
    // فرض کنید این تابع یک درخواست AJAX برای دریافت اعتبار به‌روز شده انجام می‌دهد
    $.ajax({
        url: '/getUpdatedCreditBalance', // این URL را با URL مناسب خود تغییر دهید
        method: 'GET',
        success: function (data) {
            if (data.success) {
                callback(data.newBalance); // مقدار جدید را به callback ارسال کنید
            } else {
                console.error("خطا در دریافت اعتبار جدید:", data.message);
                callback(CreditBalance); // اگر خطایی رخ داد، اعتبار قبلی را برگردانید
            }
        },
        error: function (error) {
            console.error("خطای AJAX:", error);
            callback(CreditBalance); // اگر خطایی رخ داد، اعتبار قبلی را برگردانید
        }
    });
}

function checkAddButtonState() {
    var totalQuantity = 0;
    $('#tblOrderedGoods tbody tr').each(function () {
        var quantityText = $(this).find('td').eq(6).find('span').text();
        totalQuantity += parseInt(quantityText) || 0;
    });
    if (totalQuantity >= 10) {
        $('#addRow').prop("disabled", true);
    } else {
        $('#addRow').prop("disabled", false);
    }
}

function updateTotalPrice() {
    var total = getTotalPrice();
    var discountAmount = Math.floor(total * Discount / 100);
    var finalTotal = total - discountAmount;
    $('#TotalPrice').val(commafy(finalTotal));
    $('#txtDiscount').val(Discount + '%'); // درصد تخفیف
    if (CancelCredit === 'false') {
        var remainingBalance = CreditBalance - finalTotal;
        $('#RemainCredit').val(commafy(remainingBalance));
    } else {
        $('#RemainCredit').val('-'); // یا می‌تونی خالی بذاری ""
    }
    checkAddButtonState();
}


function getTotalPrice() {
    var total = 0;
    $('#tblOrderedGoods tbody tr').each(function () {
        var priceText = $(this).find('td.total-price').text().replace(/,/g, '');
        var price = parseInt(priceText, 10) || 0;
        total += price;
    });
    return total;
}
		}
		//******************************************************************************************************
		//عملیات پر کردن دیتای هر سطر می باشد
        function addRow(rowInfo, rowNumber)
        {
			
			var index = 0,
            tempRow = element.find("tr.row-template").clone();

            tempRow.show().removeClass("row-template").addClass("row-data");
            tempRow.data("rowInfo", rowInfo);
			
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
			
			var CHbox = $("<input type='checkbox'  value='"+rowInfo.Id+"'>").addClass( 'CHbox' );
			tempRow.find("td:eq(" + index++ + ")").append(CHbox);
			
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsId);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsCode);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.BrandName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.Price));
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.LogicalQty);
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
		//برگذاری دیتا برای نمایش که در صورت لزوم می توان یک لیست به آن پاس داد
		function load() {
			
		    let selectedValue = ''; // متغیر برای ذخیره مقدار انتخاب شده
		    let params = {}; // متغیر params
		    showLoading();
			params = { WHERE: "BrandRef = '1'" }; // فیلتر شده با سان استار
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
		
		    // هندل تغییر برند
		    $('#CmbBrandFilter').change(function () {
		        selectedValue = $(this).find("option:selected").val();
		
		        console.log(selectedValue);
		
		        if (!selectedValue || selectedValue === 'undefined') {
		            params = {}; // همه دیتاها
		        } else {
		            params = { WHERE: "BrandRef = N'" + selectedValue + "'" }; // فیلتر شده
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
		}

		//******************************************************************************************************
		//بروز رسانی دیتای جدول
        function refresh()
        {
			//alert(JSON.stringify(22222222222));
			//حذف دیتای موجود
			element.find("tr.row-data").remove();
			
			//بازنشانی دیتای جدول
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

//#region form manager
var FormManager = {

	//******************************************************************************************************
	readEntityGoodsCatalogue: function(jsonParams, onSuccess, onError)
	{
	  BS_vw_IS_GoodsCatalogue.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                   list.push
	                   ({
			                 GoodsId: $(this).find("col[name='GoodsId']").text(),
			                 GoodsCode: $(this).find("col[name='GoodsCode']").text(),
			                 GoodsName: $(this).find("col[name='GoodsName']").text(),
			                 LogicalQty: $(this).find("col[name='LogicalQty']").text(),
						     Price: $(this).find("col[name='Price']").text(),
			                 BrandName: $(this).find("col[name='BrandName']").text()
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
	
	ReadBrandName: function(jsonParams, onSuccess, onError) {
	    SP_vw_IS_GoodsCatalogue_Brand.Execute(jsonParams, function(data) {
	        var xmlvar = $.xmlDOM(data);
	        var brandOptions = '';
	
	        xmlvar.find("row").each(function() {
	            var BrandRef = $(this).find(">col[name='BrandRef']").text();
	            var BrandName = $(this).find(">col[name='BrandName']").text();
	            brandOptions += '<option value="' + BrandRef + '">' + BrandName + '</option>';
	        });
	
	        // اگر onSuccess یک تابع باشد، آن را فراخوانی کنید و گزینه‌ها را به آن بفرستید
	        if ($.isFunction(onSuccess)) {
	            onSuccess(brandOptions);
	        }
	    }, onError);
	},
		//******************************************************************************************************
	ReadPersonnelCredit: function(jsonParams, onSuccess, onError)
	{
	  BS_HRPersonnelCredit.Read(jsonParams
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
			                 Credit: $(this).find("col[name='Credit']").text(),
			                 RemainCredit: $(this).find("col[name='RemainCredit']").text(),
						 	CancelCredit: $(this).find("col[name='CancelCredit']").text(),
						     DiscountPercent: $(this).find("col[name='DiscountPercent']").text(),
						 	LimitDiscountPercent: $(this).find("col[name='LimitDiscountPercent']").text()
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

    RetailPersonnelOrder: function(jsonParams, onSuccess, onError) 
	{
        SP_RetailPersonnelOrder.Execute(jsonParams, function(data) {
            var list = [];
            var xmlvar = $.xmlDOM(data);
            xmlvar.find("row").each(function() {
                list.push({
                    Result: $(this).find("col[name='res']").text()
                });
            });
            if ($.isFunction(onSuccess)) {
                onSuccess(list);
            }
        }, function(error) {
            if ($.isFunction(onError)) {
                onError(error);
            }
        });
    }
};
//#endregion

//#region btnRegister.js
$("#btnRegister").click(function(){
var jsonArray = [];

// جمع‌آوری داده‌ها از جدول
$('#tblOrderedGoods tbody tr[data-id]').each(function () {
    var productId = $(this).find('td').eq(1).text(); // کد محصول
    var price = parseFloat($(this).find('td.total-price').text());
    var quantity = parseInt($(this).find('td').eq(6).find('span').text());

    jsonArray.push({
        GoodsId: productId,
        Price: price,
        Qty: quantity
    });
});

// بررسی وجود داده
if (jsonArray.length === 0) {
    alert("هیچ داده‌ای برای ارسال وجود ندارد.");
    return;
}

// پارامترها با نام درست
var sp_params = {
	    UserId: currentUserId,
	    username: currentusername,
	    jsonArray: JSON.stringify(jsonArray),
	    Description: $("#txtDiscription").val(),
	    Ordertype: 1 
		    };
				//alert(JSON.stringify(sp_params));
			 FormManager.RetailPersonnelOrder(
		        sp_params,
		        function(data){
		            var $data = $.xmlDOM(data);
					alert(JSON.stringify(data));
					/*
					WorkflowService.RunWorkflow("ZJM.PSE.ProductOrderSingle",
						'<Content><Id>' + pk + '</Id><IsInTestMode>' + isInTestMode + '</IsInTestMode></Content>',
						true,
						function(data) {
								handleRunWorkflowResponse(data);
							},
						function(err) {
								handleError(err,'WorkflowService.RunWorkflow');
							}
					);
		            
		            var totalRows = $data.find("col[name='TotalRows']:first").text();
		
		            // Parse each row and extract values
		            var rows = [];
		            $data.find("datatable > row").each(function () {
		                var row = {
		                    RemainedAmount: $(this).find("col[name='RemainedAmount']").text()
		                };
		                rows.push(row);
		            });
					*/
					//$("#txtRemainedAmount").val(commafy(rows[0].RemainedAmount));
		        },
		        function(e){ 
		            alert(e);
		        }
		    );
	
});
//#endregion btnRegister.js