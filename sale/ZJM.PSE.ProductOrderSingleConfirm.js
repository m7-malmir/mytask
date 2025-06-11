//#region tbl.js
var tblOrderedGoods = null;

$(function()
{
    tblOrderedGoods = (function()
    {
		//خواندن پارامترهای اصلی جدول
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readPersonnelOrderDetail
		//فراخوانی سازنده جدول
        init();
		//******************************************************************************************************
        function init()
        {
            element = $("#tblOrderedGoods");
            build();
            bindEvents();
            //load();
        }
		//******************************************************************************************************
        function build()
        {       
			//دکمه افزودن     
            /*var imgAdd = $("<img/>", {src: "Images/add.png", title: "افزودن"}).addClass("add").css({cursor: "pointer"});
            element.find("tr.row-template").find("td:first").empty().append(imgAdd);*/
			
			//برای حذف دکمه افزودن این سطر را فعال و سطر باتلا را حذف کنید
            // if you don't want to use add button inside table uncomment the line below and remove the lines up
            //element.find("tr.row-template").hide();
        }
		//******************************************************************************************************
		//این متد در زمان ساخت هر سطر بر روی المان ها اعمال می شود
        function bindEvents()
        {
			/**************************************************************/
			// کد مورد نظر برای پرینت هر ردیف در این جدول
            element.on("click", "img.printagreement",
			    function()
			    {
					var row = $(this).closest('tr');
       			 var LoanPaymentID = row.find('td:nth-child(4)').text().trim();
					var paramsForPrint={
					        'DocId': LoanPaymentID
					    };
					FormManager.PreparePrint(paramsForPrint,
						function(list)
						{
							html_ = list[0]["Result"];
							printPdf();
						},
						function(err)
						{
							hideLoading();
							alert(err);
						}
					);
			    }
            );
			/**************************************************************/
			element.on("click", "img.edit",
                function()
                {
	                var that = $(this);
			        var row = that.closest("tr");
			        
			        // فرض می‌کنیم که اطلاعات ردیف در data-rowInfo ذخیره شده است
			        var r_info = row.data("rowInfo");
				  $.showModalForm({registerKey:"ZJM.LPP.LoanPaymentPopUP", params:{r_info: r_info}} 
				      , function(retVal)
				      {
				          if (retVal.OK) {
							  refresh(); 
				          }
						  else
						  {
							  clicked.prop('checked', false);
						  }
				      }
				  );  
               }
            
            );
			
			/**********************************************************/
			
element.on("click", "input#delivered", function() {
    var that = $(this); // ذخیره `this` در متغیر `that`
    
    $.qConfirm(that, "آیا از ثبت مطمئن هستید؟", function(btn) {
        if (btn.toUpperCase() === "OK") { // بررسی اینکه کاربر روی "OK" کلیک کرده است
            var row = that.closest('tr'); // پیدا کردن ردیف مربوطه
            var LoanPaymentID = row.find('td:nth-child(4)').text().trim(); // استخراج ID پرداخت
            var params = {
                'PayStatus': 2
            };
            params = $.extend(params, { Where: "Id = " + LoanPaymentID });

            FormManager.updateEntity(params,
                function(list) {
                    refresh(); // به‌روزرسانی نمای جدول
                },
                function(err) {
                    hideLoading();
                    alert(err); // نمایش خطا در صورت بروز مشکل
                }
            );
        }
    });
});
			/***************************************************************/
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

			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Id);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsCode);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GoodsName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.Qty));
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.UnitPrice);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.AfterDiscountGoodsPrice);
			
            element.find("tr.row-template").before(tempRow);
			myHideLoading();
        }
		//******************************************************************************************************
		/*function editRow(row)
        {
			var rowInfo = row.data("rowInfo"),
				params = {};
			
            params[rowPrimaryKeyName] = rowInfo[rowPrimaryKeyName]; // change params if needed 

            $.showModalForm({registerKey: editFormRegKey, params: params},
                function(retVal)
                {
                    if(retVal.OK)
                    {
                        // if edit form saves the changes
                        refresh();

                        // if edit form passes new values down to be managed here
                        changeRow(row, retVal.Data);
                    }
                }
            );
        }*/
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
        function load()
        {
            var params = {Where: "OrderId ="+ pk}; 
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
		//بروز رسانی دیتای جدول
        function refresh()
        {
			//حذف دیتای موجود
			element.find("tr.row-data").remove();
			//alert(JSON.stringify(111));
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