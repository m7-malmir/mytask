این کد محتوای فایل ready.js
var $form;
var currentActorId;
var ProcessStatus;

$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
			readFromData = FormManager.readEntity,
			updateFromData = FormManager.updateEntity,
            insertFromData = FormManager.insertEntity;
		//******************************************************************************************************	
		function init()
		{
			
			//اگر از جریان فرآیند یا بصورت پاپ آپ از یک فرم دیگر باز شود
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
			}
			
			$("#btnConfirm").css('display','none');
			$("#btnReject").css('display','none');
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
		//****************************************************
		
		function createControls()
		{	
			if(!inEditMode){
				UserService.GetCurrentActor(true,
					function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
						var params = {Where: "ActorId = " + currentActorId};
						
						//----------------------------------------------------------------
						// دریافت اطلاعات و نمایش در صفحه
						//----------------------------------------------------------------
						BS_GetUserInfo.Read(params
							, function(data)
							{
								var dataXml = null;
								if($.trim(data) != "")
								{
									dataXml = $.xmlDOM(data);
									fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
									RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
									PersonnelNO = dataXml.find("row:first").find(">col[name='Codepersonel']").text();
																
									$("#txtFullName").val(fullName).prop('disabled', true);
									$("#txtPersonnelNO").val(PersonnelNO).prop('disabled', true);
									$("#txtRoleName").val(RoleName).prop('disabled', true);
									alert(JSON.stringify(dataXml));
									//tblMain.refresh();
								}
							}
						);
						//----------------------------------------------------------------
					},
					function(err){
						hideLoading();
						$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
					}
				);
			}
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
			showLoading();
			readFromData({Where: primaryKeyName + " = " + pk},
				function(dataXml)
				{
					alert(JSON.stringify(data));
					hideLoading();
					$.setFormDataValues(bindingSourceName, dataXml);
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);
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
		function insertData(callback)
		{
			showLoading();
			var params = {};
			
			//در مواردی که المان ها بایند شده باشند از این روش استفاده می کنیم
			//var params = $.getFormDataValues(bindingSourceName);
			// البته می توانیم هر یک از موارد دلخواه دیگر را که بانیسد نشده اند را هم بصورت دستی با این روش بایند کنیم
			params.CreatorActor_ID = currentActorId;
						
			insertFromData(params,
				function(dataXml)
				{
					// pk در واقع همان Id رکورد ایجاد شده می باشد primaryKeyName = Id
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					var params = {};
					params.LoanPayment_ID = pk;
					params = $.extend(params, {Where :"LoanPayment_ID IS NULL AND CreatorActor_ID = "+currentActorId});
					
					FormManager.updateEntityBankLoanCredit(params,
						function(data)
						{
							// فراخوانی شروع فرآیند الزامی می باشد
							WorkflowService.RunWorkflow("ZJM.LPP.LoanAssigmentProcess",
							    '<Content><Id>'+pk+'</Id></Content>',
							    true,
							    function(data)
							    {
							        $.alert("درخواست شما با موفقیت ارسال شد.","","rtl",function(){
										hideLoading();
							        	closeWindow({OK:true, Result:null});
									});				
							    }
							    ,function(err)
							    {
							        alert('مشکلی در شروع فرآیند به وجود آمده. '+err);
							        hideLoading();
							    }
							);
						},
						function(err)
						{
							hideLoading();
							alert(err);
						}
					);
					inEditMode = true;
					
					myHideLoading();
					if($.isFunction(callback))
					{
						callback();
					}
				},
				function(err)
				{
					hideLoading();
					alert(err);
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

و این کد مربوط به globalmanager 

var FormManager = {
	//******************************************************************************************************
	readEntity: function(jsonParams, onSuccess, onError)
	{
		BS_MainData.Read(jsonParams
			, function(data)
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
			}, onError
		);
	},
	//******************************************************************************************************
	readEntityLoanList: function(jsonParams, onSuccess, onError)
	{
		
		BS_PersonLoanList.Read(jsonParams
			, function(data)
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
			}, onError
		);
	},
	//******************************************************************************************************
	insertEntity: function(jsonParams, onSuccess, onError)
	{
		BS_MainData.Insert(jsonParams
			, function(data)
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
			}, onError
		);
	},
	//******************************************************************************************************
	updateEntity: function(jsonParams, onSuccess, onError)
	{
		BS_MainData.Update(jsonParams
			, function(data)
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
			}, onError
		);
	}
	//******************************************************************************************************
};

و این مربوط به فایل tblloanlist هستشن

var tblLoanList = null;

$(document).ready(function () {  // مطمئن می‌شویم که کد بعد از بارگذاری کامل DOM اجرا می‌شود
    tblLoanList = (function () {
        var element = null,
            isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readEntityLoanList,
            editFormRegKey = "",
            insertFormRegKey = "";

        init();

        function init() {
            element = $("#tblLoanList");
            build();
            bindEvents();
        }

        function build() {
            // متد ساخت اضافه‌ای اگر نیاز بود
        }

        function addRow(rowInfo, rowNumber) {
            var index = 0;
            var tempRow = element.find("tr.row-template").clone();
            tempRow.show().removeClass("row-template").addClass("row-data");
            tempRow.data("rowInfo", rowInfo);

            var CHbox = $("<input type='checkbox' value='" + rowInfo.Id + "'>").addClass('CHbox');
            tempRow.find("td:eq(" + index++ + ")").append(CHbox);

            element.find("tr.row-template").before(tempRow);
        }

        function bindEvents() {
            // چک‌باکس‌ها
            element.on("click", ".CHbox", function () {
                var clicked = $(this);
                if (clicked.is(':checked')) {
                    // سایر چک‌باکس‌ها را غیر فعال می‌کنیم
                    $('.CHbox:checked').not(clicked).each(function () {
                        $(this).prop('checked', false).trigger('change');
                    });

                    var row = clicked.closest("tr");
                    var r_info = row.data("rowInfo");

                    $("#txtServiceId").val(r_info.OwnerPersonnelName);
                    carId = r_info.Id;
                    NewOwnerName = r_info.OwnerPersonnelName;
                }
            });

            // حذف ردیف
            element.on("click", "img.delete", function () {
                var that = $(this),
                    row = that.closest("tr");

                $.qConfirm(that, "آیا مطمئن هستید؟", function (btn) {
                    if (btn.toUpperCase() == "OK") {
                        removeRow(row);
                    }
                });
            });

            // ویرایش ردیف
            element.on("click", "img.edit", function () {
                editRow($(this).closest("tr"));
            });

            // افزودن ردیف جدید
            element.on("click", "img.add", function () {
                showAddDialog();
            });
        }

        function addNewRow(rowInfo) {
            addRow(rowInfo, element.find("tr.row-data").filter(":visible").length + 1);
            isDirty = true;
        }

        function showAddDialog() {
            var params = {}; // تغییر params در صورت نیاز

            $.showModalForm({ registerKey: insertFormRegKey, params: params },
                function (retVal) {
                    if (retVal.OK) {
                        refresh();
                        addNewRow(retVal.Data);
                    }
                }
            );
        }

        function editRow(row) {
            var rowInfo = row.data("rowInfo"),
                params = {};

            params[rowPrimaryKeyName] = rowInfo[rowPrimaryKeyName]; // تغییر params در صورت نیاز

            $.showModalForm({ registerKey: editFormRegKey, params: params },
                function (retVal) {
                    if (retVal.OK) {
                        refresh();
                        changeRow(row, retVal.Data);
                    }
                }
            );
        }

        function changeRow(row, newRowInfo) {
            var index = 1;
            row.find("td:eq(" + index++ + ")").text(newRowInfo.Name);
            row.attr({ state: "changed" });
            row.data("rowInfo", newRowInfo);
            isDirty = true;
        }

        function removeRow(row) {
            if (row.attr("state") == "new") {
                row.remove();
                rearrangeRows();
            } else {
                row.attr({ state: "deleted" });
                row.hide();
                rearrangeRows();
            }
            isDirty = true;
        }

        function load(list) {
            for (var i = 0, l = list.length; i < l; i++) {
                addRow(list[i], i + 1);
            }
            hideLoading();
            myHideLoading();
        }

        function saveData(callback) {
            if (!isDirty) {
                if ($.isFunction(callback)) {
                    callback();
                }
                return;
            }

            var defObjs = [$.Deferred(), $.Deferred(), $.Deferred()];
            showLoading();

            insertNewRows(function () {
                defObjs[0].resolve();
            });

            updateChangedRows(function () {
                defObjs[1].resolve();
            });

            deleteRemovedRows(function () {
                defObjs[2].resolve();
            });

            $.when(defObjs[0], defObjs[1], defObjs[2]).done(function () {
                isDirty = false;
                hideLoading();
                if ($.isFunction(callback)) {
                    callback();
                }
            });
        }

        function insertNewRows(callback) {
            if (element.find("tr.row-data[state=new]").length == 0) {
                if ($.isFunction(callback)) {
                    callback();
                }
            } else {
                var list = [];
                element.find("tr.row-data[state=new]").each(function () {
                    var tempRowInfo = JSON.parse(JSON.stringify($(this).data("rowInfo")));
                    list.push(tempRowInfo);
                });

                insertRows(list, function () {
                    if ($.isFunction(callback)) {
                        callback();
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }

        function updateChangedRows(callback) {
            if (element.find("tr.row-data[state=changed]").length == 0) {
                if ($.isFunction(callback)) {
                    callback();
                }
            } else {
                var list = [];
                element.find("tr.row-data[state=changed]").each(function () {
                    var tempRowInfo = JSON.parse(JSON.stringify($(this).data("rowInfo")));
                    tempRowInfo.Where = rowPrimaryKeyName + " = " + tempRowInfo[rowPrimaryKeyName];
                    delete tempRowInfo[rowPrimaryKeyName];
                    list.push(tempRowInfo);
                });

                updateRows(list, function () {
                    if ($.isFunction(callback)) {
                        callback();
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }

        function deleteRemovedRows(callback) {
            if (element.find("tr.row-data[state=deleted]").length == 0) {
                if ($.isFunction(callback)) {
                    callback();
                }
            } else {
                var list = [];
                element.find("tr.row-data[state=deleted]").each(function () {
                    var tempRowInfo = JSON.parse(JSON.stringify($(this).data("rowInfo")));
                    list.push({ Where: rowPrimaryKeyName + " = " + tempRowInfo[rowPrimaryKeyName] });
                });

                deleteRows(list, function () {
                    if ($.isFunction(callback)) {
                        callback();
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }

        function rearrangeRows() {
            element.find("tr.row-data").filter(":visible").each(function (index) {
                $(this).find("td:eq(0)").text(index + 1);
            });
        }

        function refresh(list) {
            element.find("tr.row-data").remove();
            load(list);
        }

        function validateData() {
            if (element.find("tr.row-data").length == 0) {
                return false;
            } else {
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
    })();
});


 و نتیجه من به اینصورت میشه!!!!!

 {"0":{"location":null},"context":{"location":null},"length":1,"selector":""}

 همونجایی که الرت گرفتم. ینی دیتا صحیح بهم نداده
