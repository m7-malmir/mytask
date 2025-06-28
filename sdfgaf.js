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
				var price = parseInt(rcommafy($row.find("td").eq(8).text()), 10);
				
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

				// بررسی اعتبار و تخفیف و افزودن به سفارش در صورت داشتن اعتبار
				checkCreditAndDiscount(price, function (result) {
					if (!result) {
						// ❗ تیک چک باکس رو برگردون
						setTimeout(function () {
							$(checkbox).prop("checked", false);
						}, 0);
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
						
						if (quantity >= maxQty) {
							alert("تعداد هر کالا نمی تواند بیشتر از " + maxQty +" باشد.");
							return;
						}
						// قیمت کل فعلی
						var currentTotal = getTotalPrice();

						// قیمت جدید با افزایش مقدار کالا
						var nextItemTotal = (quantity + 1) * price; 

						// قیمت فعلی کالا
						var currentItemTotal = quantity * price; 

						// قیمت کل جدید
						var newTotal = currentTotal - currentItemTotal + nextItemTotal; 

						// محاسبه تخفیف و قیمت نهایی
						var discountAmount = Math.floor(newTotal * discountPercentForUser / 100);

						// قیمت نهایی با تخفیف
						var finalTotal = newTotal - discountAmount; 

						// بررسی اعتبار باقیمانده
						var remainingBalance = remainCredit - finalTotal; // اعتبار باقیمانده پس از خرید


							//quantity++; // افزایش مقدار کالا
							//quantityDisplay.text(quantity); // به‌روزرسانی نمایش مقدار

							//var totalPrice = quantity * price;
							//tempRow.find('.total-price').text(commafy(totalPrice)); // به‌روزرسانی قیمت کل ردیف

							//updateTotalPrice();
							//$('#txtRemainCredit').val(commafy(0)); // به روزرسانی اعتبار باقیمانده به 0
							//$('#txtTotalPrice').val(commafy(finalTotal)); // به روزرسانی قیمت کل نهایی

						// اگر اعتبار باقیمانده منفی است
						if (remainingBalance < 0) {
							// در صورتی که اعتبار کافی نیست، پیغام تأیید را نمایش می‌دهیم
							var confirmation = confirm("مبلغ فاکتور بیشتر از باقیمانده اعتبار شما می باشد، در صورت تایید برای ادامه کل مبلغ سفارش جاری و سفارشات آتی با 35% تخفیف محاسبه خواهد گردید.");
							if (confirmation) {
								// اگر کاربر تأیید کند، اعتبار را به روز کنیم
								var list = {
									'cancelCredit': true
								};
								list = $.extend(list, {
									Where: "PersonnelCode = '" + currentusername + "'"
								});

								FormManager.updatePersonnelCredit(list,
									function (status, list) {
										$.alert("اعتبار شما با موفقیت به روز شد.", "", "rtl", function () {
											cancelCredit = 'true'; // ✅ مقدار JS را به‌روزرسانی کردیم
											discountPercentForUser = 35; // تغییر به 35% تخفیف
											$('#RemainCredit').val(commafy(0)); // به‌روزرسانی اعتبار باقیمانده به 0
											quantity++; // افزایش مقدار کالا
											quantityDisplay.text(quantity); // به‌روزرسانی نمایش مقدار
											updateRowTotal(); // به‌روزرسانی قیمت کل ردیف
											$('#TotalPrice').val(commafy(finalTotal)); // به‌روزرسانی قیمت کل نهایی
											$('#txtRemainCredit').val(commafy(0)); // به روزرسانی اعتبار باقیمانده به 0
										});
									},
									function (error) {
										console.log("خطای برگشتی:", error);
										$.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
									}
								);
							}
							return; // از تابع خارج می شویم
						} else {
							// اگر اعتبار کافی است، مقدار را افزایش می‌دهیم
							quantity++;
							quantityDisplay.text(quantity);
							var totalPrice = quantity * price;
							tempRow.find('.total-price').text(commafy(totalPrice));
							updateTotalPrice();
							updateRowTotal(); // به‌روزرسانی قیمت کل ردیف
						}

						// به‌روزرسانی باقی مانده اعتبار
						$('#RemainCredit').val(commafy(remainingBalance));
						$('#TotalPrice').val(commafy(finalTotal)); // به‌روزرسانی قیمت کل نهایی
					});
					//------------------------------------------------


					//------------------------------------------------
					// کلیک دکمه کاهش تعداد
					//------------------------------------------------
					minusBtn.on("click", function () {
						if (quantity > 1) {
							quantity--;
							quantityDisplay.text(quantity);
							let totalPrice = quantity * price;
    						tempRow.find('.total-price').text(commafy(totalPrice));
							updateTotalPrice();
						}
					});
					//------------------------------------------------

					$('#tblOrderedGoods tbody').append(tempRow);
					$(this).prop("disabled", true);

					updateTotalPrice();
				});
			});
			//----------------------------------------------------
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
			let unitPrice=(rowInfo.CartonQTY)*(rowInfo.Price);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(unitPrice));
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.Price));
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
		function checkCreditAndDiscount(price, callback) {

			// قیمت کل فعلی
			var totalCurrent = getTotalPrice();

			// قیمت کل به اضافه قیمت کالای جدید
			var totalWithNewItem = totalCurrent + price;

			// قیمت کل با تخفیف
			var totalWithDiscount = totalWithNewItem - Math.floor(totalWithNewItem * discountPercentForUser / 100);

			let remainCreditNew = 0;

			// اگر discountPercentForUser برابر با 35% است، هیچ چک اعتبار را انجام ندهید
			if (discountPercentForUser == discountPercentBase) {
				callback(true); // ادامه محاسبات
				return; // از تابع خارج میشویم
			}

			// اعتبار باقیمانده
			remainCreditNew = remainCredit - totalCurrent; // اعتبار باقیمانده قبل از اضافه کردن کالا

			// بررسی اعتبار باقیمانده
			if (remainCreditNew < 0) {
				// در صورتی که اعتبار کافی نیست، پیغام تأیید را نمایش می‌دهیم
				var confirmation = confirm("مبلغ فاکتور بیشتر از باقیمانده اعتبار شما می باشد، در صورت تایید برای ادامه کل مبلغ سفارش جاری و سفارشات آتی با " + discountPercentBase +"% تخفیف محاسبه خواهد گردید.");
				if (confirmation) {
					// اگر کاربر تأیید کند، نشانگر لغو استفاده از اعتبار را به روز کنیم
					let params = {
						'cancelCredit': true
					};
					params = $.extend(params, {
						Where: "PersonnelCode = '" + currentusername + "'"
					});

					FormManager.updatePersonnelCredit(params,
						function (status, list) {
							$.alert("درخواست شما با موفقیت انجام گردید و از این پس سفارشات شما با تخفیف پایه بصورت نامحدود محاسبه خواهند گردید.", "", "rtl", function () {
								cancelCredit = 'true';
								discountPercentForUser = 35; // تغییر به 35% تخفیف
								hasConfirmedDiscount = true; // وضعیت تأیید کاربر را به‌روزرسانی می‌کنیم
								$('#txtRemainCreditNew').val(commafy(0)); // به‌روزرسانی اعتبار باقیمانده به 0
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
				return; // از تابع خارج می‌شویم
			}

			// اگر اعتبار باقیمانده کافی باشد، اعتبار جدید را محاسبه می‌کنیم
			var newRemainingBalance = remainCredit - totalWithDiscount; // اعتبار باقیمانده جدید

			if (newRemainingBalance < 0) {
				// اگر اعتبار باقیمانده جدید هم کافی نیست
				var confirmation = confirm("مبلغ فاکتور بیشتر از باقیمانده اعتبار شما می باشد، در صورت تایید برای ادامه کل مبلغ سفارش جاری و سفارشات آتی با 35% تخفیف محاسبه خواهد گردید.");
				if (confirmation) {
					// اگر کاربر تأیید کند، اعتبار را به روز کنیم
					var list = {
						'cancelCredit': true
					};
					list = $.extend(list, {
						Where: "PersonnelCode = '" + currentusername + "'"
					});

					FormManager.updatePersonnelCredit(list,
						function (status, list) {
							$.alert("اعتبار شما با موفقیت به روز شد.", "", "rtl", function () {
								cancelCredit = 'true'; // ✅ مقدار JS را به‌روزرسانی کردیم
								discountPercentForUser = 35; // تغییر به 35% تخفیف
								hasConfirmedDiscount = true; // وضعیت تأیید کاربر را به‌روزرسانی می‌کنیم
								$('#txtRemainCreditNew').val(commafy(0)); // به‌روزرسانی اعتبار باقیمانده به 0
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
				$('#txtRemainCreditNew').val(commafy(newRemainingBalance)); // نمایش اعتبار باقیمانده
				callback(true); // ادامه محاسبات
			}
		}
		//******************************************************************************************************
		function checkAddButtonState() {
			var totalQuantity = 0;
			$('#tblOrderedGoods tbody tr').each(function () {
				var quantityText = $(this).find('td').eq(6).find('span').text();
				totalQuantity += parseInt(quantityText) || 0;
			});

			if (totalQuantity >= maxQty) {
				$('#addRow').prop("disabled", true);
			} else {
				$('#addRow').prop("disabled", false);
			}
		}
		//******************************************************************************************************
		function updateTotalPrice() {
			var total = getTotalPrice();
			var discountAmount = Math.floor(total * discountPercentForUser / 100);
			var finalTotal = total - discountAmount;
			$('#txtTotalPrice').val(commafy(total));
			$('#txtTotalPriceWithDiscount').val(commafy(finalTotal));
			$('#txtDiscountPercent').val(discountPercentForUser + '%'); // درصد تخفیف
			if (cancelCredit === 'false') {
				var remainingBalance = remainCredit - finalTotal;
				$('#txtRemainCreditNew').val(commafy(remainingBalance));
			} else {
				$('#txtRemainCreditNew').val('-'); // یا می‌تونی خالی بذاری ""
			}
			checkAddButtonState();
		}
		//******************************************************************************************************

		return {
			refresh: refresh,
			load: load
		};
	}());
});