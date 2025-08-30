var tblMain = null;
var selectedBrandValue = '0'; // متغیر برای ذخیره مقدار انتخاب شده برند

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

			function hasEnoughCredit(price) {
			    let selectedCreditType = String($("#cmbCreditType option:selected").attr("credittype") || "");
			
			    // اگر نوع انتخاب معتبر نیست
			    if (!["1", "2", "3"].includes(selectedCreditType)) {
			        alert("لطفاً نوع اعتبار را مشخص کنید");
			        $("#cmbCreditType").focus();
			        return false;
			    }
			
			    // اگر انتخاب اعتبار پایه باشد نامحدود است
			    if (selectedCreditType === "2") {
			        return true;
			    }
			
			    // موجودی فعلی
			    let currentRemainingBalance =
			        (selectedCreditType === "1" || selectedCreditType === "3")
			            ? parseInt($('#txtRemainCreditNew').val().replace(/,/g, '')) || 0
			            : parseInt($('#txtRemainCredit').val().replace(/,/g, '')) || 0;
			
			    // قیمت با لحاظ تخفیف
			    let finalPrice = (discountPercentForUser == 100)
			        ? price
			        : price - Math.floor(price * discountPercentForUser / 100);
			
			    if (currentRemainingBalance < finalPrice) {
			        alert("اعتبار کافی نیست");
			        return false;
			    }
			
			    return true;
			}


            //----------------------------------------------------
            // تعریف متد کلیک بر روی چک باکس انتخاب در هر ردیف
            //----------------------------------------------------
            element.on("click", ".CHbox", function () {
				//ابتدا نوع اعتبار باید مشخص شود
			    let selectedCreditType = String($("#cmbCreditType option:selected").attr("credittype") || "");
			
			    if (!["1", "2", "3"].includes(selectedCreditType)) {
			        alert("لطفاً نوع اعتبار را مشخص کنید");
			        $("#cmbCreditType").focus();
			        return false; 
			    }

                var checkbox = this;
                if (!this.checked) return;

                let $row = $(this).closest("tr");
                let goodsId = $row.find("td").eq(2).text().trim();
                let goodsCode = $row.find("td").eq(3).text().trim();
                let brandName = $row.find("td").eq(4).text().trim();
                let goodsName = $row.find("td").eq(5).text().trim();
                var price = parseInt(rcommafy($row.find("td").eq(6).text()), 10);
			    if (!hasEnoughCredit(price)) {
			        $(this).prop("checked", false);
			        return false;
			    }
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
                }).text(commafy(price))); // جمع واحد × تعداد = چون تعداد ۱ فعلاً
                //------------------------------------------------


                //------------------------------------------------
                // کلیک دکمه افزایش تعداد
                //------------------------------------------------
                plusBtn.on("click", function () {
				
				    if (!hasEnoughCredit(price)) {
				        return false; // جلو افزایش تعداد رو بگیر
				    }

                    let currentRow = this.closest('tr');
                    let cells = currentRow.querySelectorAll("td");
                    let currentquantity = parseInt(cells[6].querySelector("span").innerText.trim());

                    if (currentquantity >= maxQty) {
                        alert("تعداد هر کالا نمی تواند بیشتر از " + maxQty + " باشد.");
                        return;
                    }

                    // قیمت کل فعلی
                    let currentTotal = parseInt(cells[8].innerText.replace(/,/g, ''));
					
                    // قیمت جدید با افزایش مقدار کالا
                    let itemNewTotal = (currentquantity + 1) * price;

                    // قیمت فعلی کالا
                    let itemCurrentTotal = currentquantity * price;

                    // قیمت کل جدید
                    let newTotal = currentTotal - itemCurrentTotal + itemNewTotal;

                    //تعداد جدید
                    cells[6].querySelector("span").innerText = parseInt(currentquantity) + 1;

                    //قیمت کل ردیف
                    cells[8].innerText = commafy(newTotal);

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
                        let currentTotal =  parseInt(cells[8].innerText.replace(/,/g, ''));
                        
                        // قیمت جدید با افزایش مقدار کالا
                        let itemNewTotal = (currentquantity - 1) * price;

                        // قیمت فعلی کالا
                        let itemCurrentTotal = currentquantity * price;

                        // قیمت کل جدید
                        let newTotal = currentTotal - itemCurrentTotal + itemNewTotal;

                        //تعداد جدید
                        cells[6].querySelector("span").innerText = parseInt(currentquantity) - 1;

                        //قیمت کل ردیف
                        cells[8].innerText = commafy(newTotal);

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
            tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.Price));
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.LogicalQty);
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
		    const selectedCreditType = String($("#cmbCreditType option:selected").attr("credittype") || "");
		    const total = getTotalPrice();
		    const discountAmount = Math.floor(total * discountPercentForUser / 100);
		    const finalTotal = total - discountAmount;
		
		    // اگر نوع 2 باشه → نامحدود و خروج از تابع
		    if (selectedCreditType === "2") {
		        $('#txtRemainCreditNew').val("نامحدود");
		        $('#txtTotalPrice').val(commafy(total));
		        $('#txtTotalPriceWithDiscount').val(commafy(finalTotal));
		        $('#txtDiscountPercent').val(discountPercentForUser + '%');
		        return;
		    }
		
		    // موجودی فعلی
		    const currentBalance = parseInt($('#txtRemainCredit').val().trim().replace(/,/g, '')) || 0;
		
		    // محاسبه موجودی باقی مانده
		    const remainCredit = currentBalance - (
		        discountPercentForUser == 100 ? total : finalTotal
		    );
		
		    // بروزرسانی فیلدها
		    $('#txtRemainCreditNew').val(commafy(remainCredit));
		    $('#txtTotalPrice').val(commafy(total));
		    $('#txtTotalPriceWithDiscount').val(commafy(finalTotal));
		    $('#txtDiscountPercent').val(discountPercentForUser + '%');
		}

        //******************************************************************************************************

        return {
            refresh: refresh,
            load: load
        };
    }());
});