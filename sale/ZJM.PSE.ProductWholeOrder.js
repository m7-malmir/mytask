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

var currentActorId;
var selectedValue;
//---------------------------------
var ProcessStatus;
var currentUserId;

var discountPercentBase;
var discountPercentMax;
var discountPercentForUser;
var maxQty= 10;
var remainCredit;
var cancelCredit;

$(function(){
	$form = (function()
	{ 
		var pk,
			inTestMode = false;
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
			var jsonParams = {}; // پارامترهای مورد نیاز برای خواندن داده‌ها
		    readBrandName(jsonParams, function(brandOptions) {
		        $('#cmbBrandFilter').html(brandOptions);
		    }, function(error) {
		        console.error("Error fetching brand data:", error);
		    });
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
			
			showLoading();
			UserService.GetCurrentUser(true,
				function(data){
						hideLoading(); 
						
						var xml = $.xmlDOM(data);
						currentUserId = xml.find("user > id").text().trim();
				        currentusername = xml.find("user > username").text().trim();
				        currentUserfirstname = xml.find("user > firstname").text().trim();
				        currentUserlastname = xml.find("user > lastname").text().trim();
				        currentActorId = xml.find("actor").attr("pk");
						
						$("#txtFullName").val(currentUserfirstname+' '+currentUserlastname);
						$("#txtPersonnelNO").val(currentusername);
						
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
									
									var params = {Where: "PersonnelCode = " + currentusername.toString()};
									readPersonnelCredit(params,
										function(list)
										{
											if(list.length == 0 ){
												$.alert("هیچ اعتباری برای شما تعریف نشده است، لطفاً با جنرال سرویس تماس حاصل فرمائید","","rtl",function(){
													hideLoading();
										        	closeWindow({OK:true, Result:null});
												});
											}
											
											remainCredit=list[0].RemainCredit;
											discountPercentMax=list[0].DiscountPercent;
											discountPercentBase=list[0].LimitDiscountPercent;
											cancelCredit=list[0].CancelCredit;
											$("#txtRemainCredit").val(commafy(remainCredit));
											$("#txtRemainCreditNew").val(commafy(remainCredit));
										
											if(cancelCredit=='false'){
												discountPercentForUser=discountPercentMax;	
											}else{
												discountPercentForUser=discountPercentBase;
											}
											
											$("#txtDiscountPercent").val(discountPercentForUser);
											$("#txtTotalPrice").val('0');
											$("#txtTotalPriceWithDiscount").val('0');
											
											
										},
										function(error)
									    {
									        alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
									        myHideLoading();
											return;
									    }
									);
									
									tblMain.refresh();
						
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
			                 BrandName: $(this).find("col[name='BrandName']").text(),
						 	CartonQTY: $(this).find("col[name='CartonQTY']").text(),
			                 UnitName: $(this).find("col[name='UnitName']").text(),
						     
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
//#endregion formmanager.js


//#region tblGoods.js
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
    if (!this.checked) return;

    var $row = $(this).closest("tr");
    var productId = $row.find("td").eq(2).text().trim();//3
    var goodsCode = $row.find("td").eq(3).text().trim();//4
    var brandName = $row.find("td").eq(4).text().trim();//5
    var goodsName = $row.find("td").eq(5).text().trim();//6
    var price = parseInt($row.find("td").eq(8).text().replace(/,/g, '').trim(), 10); // 9

    if (isNaN(price)) { alert("قیمت کالا نامعتبر است!"); return; }
    if (!productId) { alert("شناسه محصول نامعتبر است."); return; }

    var alreadyAdded = $('#tblOrderedGoods tbody tr[data-id="' + productId + '"]').length > 0;
    if (alreadyAdded) {
        alert("این کالا قبلاً اضافه شده است.");
        return;
    }

    var remainingBalance = CreditBalance - getTotalPrice();
    if (remainingBalance < price) {
        alert("مقدار خرید شما بیشتر از مبلغ باقیمانده است.");
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
            $(this).closest("tr").remove();
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
            alert("تعداد هر کالا نمی‌تواند بیشتر از 10 باشد.");
            return;
        }
        var currentTotal = getTotalPrice();
        var nextItemTotal = (quantity + 1) * price;
        var currentItemTotal = quantity * price;
        var newTotal = currentTotal - currentItemTotal + nextItemTotal;
        if (newTotal > CreditBalance) {
            alert("مقدار خرید شما بیشتر از مبلغ باقیمانده است.");
            return;
        }
        quantity++;
        quantityDisplay.text(quantity);
        updateRowTotal();
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
    var Discount = 50; // عدد متغیر اگر داری از سرور بگیر اینجا بزار
    var finalTotal = Math.floor(total * Discount / 100);

    $('#TotalPrice').val(commafy(finalTotal));
    var remainingBalance = CreditBalance - finalTotal;
    $('#RemainCredit').val(commafy(remainingBalance));
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
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.UnitName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.CartonQTY);
			var SPrice=rowInfo.Price;
			var QTY=rowInfo.CartonQTY;
			var totalPrice=SPrice*QTY;
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(totalPrice));
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.Price));
			
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