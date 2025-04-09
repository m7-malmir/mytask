//#region js ready
var $form;
var currentActorId;
var DocumentId;
var ProcessStatus;
var currentPersonnelNO;
var FoodId;
$(function(){
	$form = (function()
	{ 
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_HRGuestRequest",
			readFromData = FormManager.readEntity,
		    readRows = FormManager.readEntityّSPFoodView;
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
		}
		//******************************************************************************************************
		//مقداردهی به المان ها در هر دو حالت ویرایش و ایجاد
		function createControls()
		{	
			readFromData({Where: primaryKeyName + " = '" + pk + "'"},
				function(dataXml)
				{
					$.setFormDataValues(bindingSourceName, dataXml);
					
					tblMain.refresh();
				}, function(err){
					alert(JSON.stringify("خطا در دریافت اطلاعات درخواست! لطفا با پشتیبان سامانه تماس بگیرید."));
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
		function saveData(callback)
		{
			if(inEditMode)
			{
				updateData(callback);
			}
			else
			{
				insertData(callback);
			}
		}
		//******************************************************************************************************

		function insertData(callback) {		    
		}
		//******************************************************************************************************
		function updateData(callback)
		{
		}
		//********************************************************************************************************
		function readData()
		{
			//showLoading();
			readFromData({},
				function(dataXml)
				{
					//alert(JSON.stringify(dataXml));
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);
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

//#region js form manager
var FormManager = {
    readEntity: function(jsonParams, onSuccess, onError)
        {
            BS_HRGuestRequest.Read(jsonParams,
                function(data)
                {
                    var dataXml = null;
                    if($.trim(data) != "")
                    {
                        dataXml = $.xmlDOM(data);
                    }
                    if($.isFunction(onSuccess))
                    {
                        onSuccess(dataXml);
                    }
                },
                function(error) {
                    var methodName = "readEntity";
    
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
    readEntityRequestDetail: function(jsonParams, onSuccess, onError)
        {
            BS_HRGuestRequestDetail.Read(jsonParams
                , function(data)
                {
                    var list = [];
                    var xmlvar = $.xmlDOM(data);
                    xmlvar.find("row").each(
                        function()
                        {
                            list.push
                            ({
                                GuestCode: $(this).find("col[name='GuestCode']").text(),
                                FirsName: $(this).find("col[name='FirsName']").text(),
                                LastName: $(this).find("col[name='LastName']").text(),
                                BreakFast: $(this).find("col[name='BreakFast']").text(),
                                Lunch: $(this).find("col[name='Lunch']").text(),
                                Dinner: $(this).find("col[name='Dinner']").text(),
                                GiftPack: $(this).find("col[name='GiftPack']").text(),
                                VIP: $(this).find("col[name='VIP']").text()
                                
                            });
                        }
                    );
                    if($.isFunction(onSuccess))
                    {
                        onSuccess(list);
                    }
                },
                function(error) {
                    var methodName = "readEntityLoanList";
    
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
        }
    };
//#endregion

//#region js tbl
var tblMain = null;
$(function()
{

    tblMain = (function()
    {
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readEntityRequestDetail;
		
        init();

		//ست کردن دیتا در جدول مورد نیاز ما در فرم
        function init()
        {
            element = $("#tblFood");
            bindEvents();
        }
        //عملیات پر کردن دیتای هر سطر می باشد
		function addRow(rowInfo, rowNumber) {
		    var index = 0,
		        tempRow = element.find("tr.row-template").clone();
		    tempRow.show().removeClass("row-template").addClass("row-data");
		
		    // تابع برای تبدیل true/false به دارد/ندارد
		    function tf(val) {
		        return val === "true" ? "دارد" : "ندارد";
		    }
		
		    // پر کردن اطلاعات سطر
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.GuestCode);
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FirsName);
		    tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.LastName);
		    tempRow.find("td:eq(" + index++ + ")").empty().text(tf(rowInfo.VIP));
		    tempRow.find("td:eq(" + index++ + ")").empty().text(tf(rowInfo.GiftPack));
		    tempRow.find("td:eq(" + index++ + ")").empty().text(tf(rowInfo.BreakFast));
		    tempRow.find("td:eq(" + index++ + ")").empty().text(tf(rowInfo.Lunch));
		    tempRow.find("td:eq(" + index++ + ")").empty().text(tf(rowInfo.Dinner));
		
		    element.find("tr.row-template").before(tempRow);
		    myHideLoading();
		}

/****************************************************************************************/
		
        function bindEvents()
        {
			//کد مورد نظر برای اینکه فقط یک ردیف را انتخاب کند
			  element.on("click", ".CHbox",
                function()
                {
                  clicked = $(this);
				  if ($(this).is(':checked')) {
				    $('.CHbox:checked').not($(this)).each(function() {
				      $(this).prop('checked', false);
				      $(this).trigger('change');
				    });
					    var that = $(this),
                        row = that.closest("tr");
						r_info = row.data("rowInfo");
					  	
					  	$("#txtServiceId").val(r_info.OwnerPersonnelName);
					  	carId=r_info.Id;
					  	NewOwnerName=r_info.OwnerPersonnelName;
					  
				  };
                }
            );
        }
/****************************************************************************************/
        function addNewRow(rowInfo)
        {
        }

        function showAddDialog()
        {

        }

        function editRow(row)
        {
			
        }

        function changeRow(row, newRowInfo)
        {
            
        }

        function removeRow(row)
        {
           
        }
/****************************************************************************************/
        function load()
        {

			var params = {}; // شرط لازم برای نمایش وام‌های فردی که فرم را باز می‌کند
			params = $.extend(params, { Where: "GuestRequestId = 2" });
			
			//showLoading();
			readRows(params,
			    function(list) {
					console.log(list);
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
        }
/***********************************************************************************************/
        function saveData(callback)
        {			
			if(!isDirty)
			{
				if($.isFunction(callback))
				{
				    callback();
				}
				return;
			}
            var defObjs = [$.Deferred(), $.Deferred(), $.Deferred()];
			
			showLoading();
			
            insertNewRows(
                function()
                {
                    defObjs[0].resolve();
                }
            );
            updateChangedRows(
                function()
                {
                    defObjs[1].resolve();
                }
            );
            deleteRemovedRows(
                function()
                {
                    defObjs[2].resolve();
                }
            );
            $.when(defObjs[0], defObjs[1], defObjs[2]).done(
                function()
                {
					isDirty = false;
					hideLoading();
                    if($.isFunction(callback))
                    {
                        callback();
                    }
                }
            );
        }

        function insertNewRows(callback)
        {
			
        }

        function updateChangedRows(callback)
        {
        }

        function deleteRemovedRows(callback)
        {
		}

        function rearrangeRows()
        {
           
        }

        function refresh()
        {
			//alert(JSON.stringify('4'));
			element.find("tr.row-data").remove();
            load();
        }

        function validateData()
        {
			// change the validation method if needed
            if(element.find("tr.row-data").length == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        return {
            refresh: refresh,
            addRow: addNewRow,
            saveData: saveData,
            showAddDialog: showAddDialog,
			validateData: validateData,
			load: load
        };
    }());
});
//#endregion

//#region js 

//#endregion