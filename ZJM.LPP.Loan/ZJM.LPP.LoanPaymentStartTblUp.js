var tblMain = null;

$(function()
{
    tblMain = (function()
    {
		//خواندن پارامترهای اصلی جدول
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readEntityLoanRequests
		//فراخوانی سازنده جدول
        init();
		//******************************************************************************************************
        function init()
        {
            element = $("#tblLoansForAgreement");
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
			element.on("click", ".CHbox",
               function()
               {
                 clicked = $(this);
				  if ($(this).is(':checked')) {
					  var that = $(this),
		              row = that.closest("tr");
					  LoanPaymentID = $form.getPK();
					  r_info = row.data("rowInfo"); 	
				
					  $.showModalForm({registerKey:"ZJM.LPP.LoanPaymentPopUP", params:{r_info:r_info}} 
					      , function(retVal)
					      {
					          if (retVal.OK) {
					              tblLoanBankStatus.refresh(); // رفرش اون جدول پایین
								  
								  refresh(); // رفرش خودش
								  /*tblLoanRequests.refresh();*/  
					          }
							  else
							  {
								  clicked.prop('checked', false);
							  }
					      }
					  );
				  };
               }
            );
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
			
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.Id);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.PersonnelNO);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FullName);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.LoanReasonTitle);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.ApprovedLoanAmount));
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.ApprovedBankTitle);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.ApprovedLoanTypeTitle);
			
            /*if(rowPrimaryKeyName in rowInfo)
            {
                var imgDelete = $("<img/>", {src: "Images/delete.png", title: "حذف"}).addClass("delete").css({cursor: "pointer"});
                tempRow.find("td:eq(" + index++ + ")").append(imgDelete);
                tempRow.attr({state: "saved"});
            }
            else
            {
				index++;
                var imgDelete = $("<img/>", {src: "Images/delete.png", title: "حذف"}).addClass("delete").css({cursor: "pointer"});
                tempRow.find("td:eq(" + index++ + ")").append(imgDelete);
                tempRow.attr({state: "new"});
            }*/
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
            var params = {Where: "ProcessStatus = 4 and CancleStatus = 0"}; // change the params sent to FormManager with needed info
			showLoading();
			//متد readRows در ایتدای همین صفحه از FormManager مقدار دهی شده است.
			// درصورت نیاز به لود از لیست این بخش بازنویسی میگردد
            readRows(params,
                function(list)
                {
					//alert(JSON.stringify(list));
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