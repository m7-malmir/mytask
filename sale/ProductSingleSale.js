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
			/******************************************************************************/
			var jsonParams = {}; // پارامترهای مورد نیاز برای خواندن داده‌ها

		    readBrandName(jsonParams, function(brandOptions) {
		        // پر کردن سلکتور با گزینه‌ها
		        $('#CmbBrandFilter').html(brandOptions);
		    }, function(error) {
		        console.error("Error fetching brand data:", error);
		    });
			/******************************************************************************/
	
			showLoading();
			UserService.GetCurrentUser(true,
				function(data){
						hideLoading(); 
						FormManager.ReadPersonnelCredit({},
							function(list)
							{
								CreditBalance=list[0].RemainCredit;
								$("#txtCreditBalance").val(CreditBalance);	
								
								if(list[0].CancelCredit=='false'){
									//alert(JSON.stringify('falssssse'));
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
						//alert(JSON.stringify(currentUserId));
						$("#txtFullName").val(currentUserfirstname+' '+currentUserlastname);
						$("#txtPersonnelNO").val(currentusername);
						tblMain.refresh();
						readEmployeeInfo(currentusername,
			                function(list)
			                {
								if(list.length > 1){
									ErrorMessage("خطا در دیافت اطلاعات کاربری، لطفاً به پشتیبانی سیستم اطلاع رسانی نمایید",list);
								}
								else {
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
		    var params = {}; 
			params.CompanyId = currentUserCompanyId;
		    params.CreatorActorId = currentActorId;
		    params.StartDate = $("#txtStartDate").attr("gdate").split('/').join('-');
		    params.EndDate = $("#txtEndDate").attr("gdate").split('/').join('-');
		    params.Description = $("#txtDescription").val().trim(); 
			
		    // ثبت Geust Master
		    insertFromData(params,
		        function(dataXml) {
				    var GuestRequestId = dataXml.find("row:first").find(">col[name='Id']").text();
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					
					// پیمایش روی ردیف‌های جدول
					var Guests = [];
					var param={};
					$('#tblGuestList .row-data').each(function() {
						//ایجاد کد مهمان
						var guestCode = GenerateRandomCode(6);
						
						// ثبت شدن این کد از قبل چک شود
						
					    var $row = $(this);
					    var param = {
					        'GuestRequestId': GuestRequestId,
					        'GuestCode': guestCode,
					        'FirstName': $row.find('td').eq(2).text().trim(),
					        'LastName': $row.find('td').eq(3).text().trim(),
					        'VIP': $row.find('td').eq(4).text().trim().toLowerCase() === "دارد" ? 1 : 0,
					        'GiftPack': $row.find('td').eq(5).text().trim().toLowerCase() === "دارد" ? 1 : 0,
					        'BreakFast': $row.find('td').eq(6).text().trim().toLowerCase() === "دارد" ? 1 : 0,
					        'Lunch': $row.find('td').eq(7).text().trim().toLowerCase() === "دارد" ? 1 : 0,
					        'Dinner': $row.find('td').eq(8).text().trim().toLowerCase() === "دارد" ? 1 : 0
					    };
					
					    Guests.push(param); // اضافه کردن مهمان به لیست
					});
					
					FormManager.insertGuestDetail(Guests,
					    function(dataXml) { 
							WorkflowService.RunWorkflow("ZJM.GUR.GuestRequest",
								'<Content><Id>' + pk + '</Id><IsInTestMode>' + isInTestMode + '</IsInTestMode></Content>',
								true,
								function(data) {
										handleRunWorkflowResponse(data);
									},
								function(err) {
										handleError(err,'WorkflowService.RunWorkflow');
									}
							);
					    },
					    function(error) {
					        handleError(err,'FormManager.insertGuestDetail');
					    }
					);

		            if ($.isFunction(callback)) {
		                callback();
		            }
				}
		    );		    
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
			try
			{
				var startDate = $('#txtStartDate').val().trim();
			    var endDate = $('#txtEndDate').val().trim();
			    var description = $('#txtDescription').val().trim();
												
			    if ($('#txtStartDate').val().trim() == '' ) {
					if ($.isFunction(onError)) {
		                onError("لطفا تاریخ ورود مهمان (ها) را تعیین نمایید");
		            }
			        return; 
			    }
				
				if ($('#txtEndDate').val().trim() == '' ) {
					if ($.isFunction(onError)) {
		                onError("لطفا تاریخ خروج مهمان (ها) را تعیین نمایید");
		            }
			        return; 
			    }

				if ($('#txtDescription').val().trim() == '' ) {
					if ($.isFunction(onError)) {
		                onError("لطفا متن توضیح علت حضور مهمان (ها) را وارد نمایید");
		            }
			        return; 
			    }
								
				var $rows = $('#tblGuestList .row-data');
				if ($rows.length === 0) {
					if ($.isFunction(onError)) {
		                onError("لطفاً اطلاعات مهمان(ها) را وارد نمایید");
		            }
				    return; 
				}
				
				$("[role]").validateData(true);
				if($.isFunction(onSuccess))
				{
					onSuccess();
				}
			}
			catch(e)
			{
				if($.isFunction(onError))
				{
					onError();
				}
			}
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
			var element = $('#tblGoods');
			
			element.on("click", ".CHbox", function () {
			    if (!this.checked) return;
			
			    var $row = $(this).closest("tr");
			
			    var productId = $row.find("td").eq(2).text().trim();
			    var goodsCode = $row.find("td").eq(3).text().trim();
			    var brandName = $row.find("td").eq(4).text().trim();
			    var goodsName = $row.find("td").eq(5).text().trim();
			    var price = parseFloat($row.find("td").eq(6).text().trim());
			
			    if (!productId) {
			        alert("شناسه محصول نامعتبر است.");
			        return;
			    }
			
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
			
			    tempRow.append($("<td></td>").text("*").css({
			        "width": "25px", "background-color": "#E0F6FE",
			        "border": "solid 1px #BED4DC", "text-align": "center"
			    }));
			
			    tempRow.append($("<td></td>").css({
			        "width": "150px", "display": "none", "border": "solid 1px #BED4DC"
			    }).text(productId));
			
			    var reprint = $("<button/>", { title: "حذف" })
			        .css({
			            cursor: "pointer",
			            backgroundColor: "red",
			            color: "white",
			            border: "0",
			            padding: "5px 0px",
			            borderRadius: "50px",
			            fontSize: "20px",
			            lineHeight: "0.2",
			            width: "20px",
			            height: "20px",
			            textAlign: "center"
			        })
			        .text("-")
			        .on("click", function () {
			            $(this).closest("tr").remove();
			            updateTotalPrice();
			            checkAddButtonState();
			        });
			
			    tempRow.append($("<td></td>").append(reprint).css({
			        "border": "solid 1px #BED4DC"
			    }));
			
			    tempRow.append($("<td></td>").css({
			        "width": "100px", "border": "solid 1px #BED4DC"
			    }).text(goodsCode));
			
			    tempRow.append($("<td></td>").css({
			        "width": "120px", "border": "solid 1px #BED4DC"
			    }).text(brandName));
			
			    tempRow.append($("<td></td>").css({
			        "width": "320px", "border": "solid 1px #BED4DC"
			    }).text(goodsName));
			
			    var quantity = 1;
			
			    var plusButton = $("<button/>")
			        .text("+")
			        .css({
			            "font-weight": "900",
			            "width": "18px",
			            "height": "18px",
			            "fontSize": "12px",
			            "background-color": "#FF9999",
			            "background-color": "#000",
			            "border": "1px solid rgb(252 252 252)",
			            "border-radius": "50%",
			            "color": "#fff"
			        });
			
			    var minusButton = $("<button/>")
			        .text("-")
			        .css({
			            "font-weight": "900",
			            "width": "18px",
			            "height": "18px",
			            "fontSize": "12px",
			            "background-color": "#FF9999",
			            "background-color": "#000",
			            "border": "1px solid rgb(252 252 252)",
			            "border-radius": "50%",
			            "color": "#fff"
			        });
			
			    var quantityDisplay = $("<span></span>")
			        .text(quantity)
			        .css({
			            "margin": "0 15px",
			            "fontSize": "13px"
			        });
			
			    function updateRowTotal() {
			        var totalPrice = quantity * price;
			        tempRow.find('.total-price').text(totalPrice.toFixed(2));
			        updateTotalPrice();
			        checkAddButtonState();
			    }
			
			    plusButton.on("click", function () {
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
			
			    minusButton.on("click", function () {
			        if (quantity > 1) {
			            quantity--;
			            quantityDisplay.text(quantity);
			            updateRowTotal();
			        }
			    });
			
			    var quantityCell = $("<td></td>").css({
			        "width": "100px", "border": "solid 1px #BED4DC", "text-align": "center"
			    }).append(minusButton).append(quantityDisplay).append(plusButton);
			
			    tempRow.append(quantityCell);
			
			    tempRow.append($("<td class='total-price'></td>").css({
			        "width": "100px", "border": "solid 1px #BED4DC"
			    }).text(price.toFixed(2)));
			
			    $('#tblOrderedGoods tbody').append(tempRow);
			    $(this).prop("disabled", true);
			    updateTotalPrice();
			    checkAddButtonState();
			});
			
			function checkAddButtonState() {
			    var totalQuantity = 0;
			    $('#tblOrderedGoods tbody tr').each(function () {
			        var quantityText = $(this).find('td').eq(6).find('span').text(); // assuming quantity is in the 6th td
			        totalQuantity += parseInt(quantityText);
			    });
			
			    if (totalQuantity >= 10) {
			        $('#addRow').prop("disabled", true);
			    } else {
			        $('#addRow').prop("disabled", false);
			    }
			}
			
			function updateTotalPrice() {
			    var total = getTotalPrice();
			    var totalPriceFormatted = commafy(total.toFixed(2));
			    $('#TotalPrice').val(totalPriceFormatted);
			
			    var remainingBalance = CreditBalance - total;
			    $('#RemainCredit').val(commafy(remainingBalance.toFixed(2)));
			
			    checkAddButtonState();
			}
			
			function getTotalPrice() {
			    var total = 0;
			    $('#tblOrderedGoods tbody tr').each(function () {
			        var priceText = $(this).find('td.total-price').text();
			        var price = parseFloat(priceText) || 0;
			        total += price;
			    });
			    return total;
			}
			
			function commafy(num) {
			    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Price);
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
	// متد عمومی برای فراخوانی اطلاعات کامل کاربر
	readEmployeeInfo: function(personnelNO, onSuccess, onError)
	{
		var params = {Where: "PersonnelNO = " + personnelNO};
		
		BS_EmployeeInfo.Read(params,
			function(data)
			{
				var list = [];
				var xmlvar = $.xmlDOM(data);
				xmlvar.find("row").each(
					function()
					{
						list.push
						({
							CurrentPersonnelNO: $(this).find(">col[name='PersonnelNO']").text(),
							CurrentUserCompanyId: $(this).find(">col[name='CompanyId']").text(),
							NationalCode: $(this).find(">col[name='NationalCode']").text(),
							CurrentUserFirstName: $(this).find(">col[name='FirstName']").text(),
							CurrentUserLastName: $(this).find(">col[name='LastName']").text(),
							Birthday: $(this).find(">col[name='Birthday']").text(),
							CityName: $(this).find(">col[name='CityName']").text(),
							Mobile: $(this).find(">col[name='Mobile']").text(),
							Email: $(this).find(">col[name='Email']").text(),
							FirstName_EN: $(this).find(">col[name='FirstName_EN']").text(),
							LastName_EN: $(this).find(">col[name='LastName_EN']").text(),
							EmploymentDate: $(this).find(">col[name='EmploymentDate']").text(),
							DCId: $(this).find(">col[name='DCId']").text(),
							RankTitle: $(this).find(">col[name='RankTitle']").text(),
							LeaveDate: $(this).find(">col[name='LeaveDate']").text(),
							Gender: $(this).find(">col[name='Gender']").text(),
							ActorId: $(this).find(">col[name='ActorId']").text(),
							UserId: $(this).find(">col[name='UserId']").text(),
							RoleId: $(this).find(">col[name='RoleId']").text(),
							RoleName: $(this).find(">col[name='RoleName']").text(),
							RoleCode: $(this).find(">col[name='RoleCode']").text(),
							UnitId: $(this).find(">col[name='UnitId']").text(),
							DepartmentId: $(this).find(">col[name='DepartmentId']").text(),
							Enabled: $(this).find(">col[name='Enabled']").text(),
							UserName: $(this).find(">col[name='UserName']").text(),
							UnitsName: $(this).find(">col[name='UnitsName']").text(),
							EnabledRole: $(this).find(">col[name='EnabledRole']").text(),
							EnabledUser: $(this).find(">col[name='EnabledUser']").text(),
							UsersDefaultActorId: $(this).find(">col[name='UsersDefaultActorId']").text(),
							DepartmentCode: $(this).find(">col[name='DepartmentCode']").text()
						});
					}
				);
				
				if($.isFunction(onSuccess))
				{
					onSuccess(list);
				}
			},
			function(error) {
				var methodName = "readEmployeeInfo";

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
var params = {
    UserId: currentUserId,
    username: currentusername,
    jsonArray: JSON.stringify(jsonArray),
    Description: $("#txtDiscription").val(),
    Ordertype: 1 // اینجا درست شد!
};
alert(JSON.stringify(params));
// ارسال درخواست
FormManager.RetailPersonnelOrder(params, function (list) {
    if (list.length > 0) {
        var res = list[0]["Result"];
        alert(JSON.stringify(res));
    } else {
        alert("هیچ نتیجه‌ای دریافت نشد.");
    }
    loadTable();
}, function (error) {
	console.log(error);
   // alert("خطا در ارسال درخواست: " + error);
});

	
});
//#endregion btnRegister.js