//#region js.ready 

var $form;
var PaymentMethod;
var total_count = 0;
var total_sum = 0;
var current_role_id = 0;

$(function(){
	$form = (function()
	{
		
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_FundPaymentProcess",
            insertFromData = FormManager.insertEntity;
		//متغیر اضافه شده در فرم
			
		
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
			}
			build();
			createControls();
			bindEvents();
		}
		
		function build()
		{
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
			$("#Form1").css({top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px"});
		}

		function createControls()
		{
			if(!inEditMode){
				$("#btnStartProcess").show();
			}
		
			if(/*check_date*/1){
				UserService.GetCurrentActor(true,
					function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
						var params = {'actor_id': currentActorId}
						FormManager.GetRoleId(params,
							function(list)
							{
								current_role_id = list[0]["RoleId"];
								if(current_role_id == 30){
									$("#btnCostSeparatUnpaid4").show();
									$("#btnCostSeparatUnpaid1").hide();
									$("#btnCostSeparatUnpaid2").hide();
								}else{
									if(inEditMode){
									    $("#cmbPaymentBy").hide();
										$("#cmbPaymentByLabel").hide();
									params =  {  Where: "Id =" + dialogArguments.FormParams  };
										
									FormManager.readEntity(params,
										
									    function(list, status) { 
											var paymentMethod = list[0].PaymentMethod;
											if(paymentMethod==1){
												
												$("#DatePickerPayLabel").show();
												$("#DatePickerPay").show();
												$("#txtPaymentOrderNumLabel").show();
												$("#txtPaymentOrderNum").show();
												
												$("#txtCheckNumLabel").hide();
												$("#txtCheckNum").hide();
												$("#txtBankPaymentNumLabel").hide();
												$("#txtBankPaymentNum").hide();
												
											}else if(paymentMethod==2){
												$("#DatePickerPayLabel").hide();
												$("#DatePickerPay").hide();
												$("#txtPaymentOrderNumLabel").hide();
												$("#txtPaymentOrderNum").hide();
												$("#btnViewed").hide();
												$("#btnStartProcess").hide();
												
												$("#btnRegister").show();
												$("#txtCheckNumLabel").show();
												$("#txtCheckNum").show();
												$("#txtCheckNum").prop("disabled", false);
												$("#txtBankPaymentNumLabel").show();
												$("#txtBankPaymentNum").show();
												$("#txtBankPaymentNum").prop("disabled", false);
												
												
												
											}
													
									    },
									    function(error) { // تابع خطا
									        console.log("1خطای برگشتی:", error);
									        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
									    }
									);
										
										$("#btnStartProcess").show();
										$("#DatePickerPay").show();
										$("#txtCheckNum").show();
										$("#LabelControl3").show();
										$("#txtPaymentOrderNum").show();
										$("#LabelControl4").show();
										$("#txtBankPaymentNum").show();
									}
								}
							},
							function(err)
							{
								hideLoading();
								alert(err);
							}
						);
						tblMeetingPersons.refresh();
							
					},
					function(err){
						hideLoading();
						$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
					}
				);
			}else{
				$.alert("بازه مجاز پرداخت از چهاردهم هر ماه بجز فروردین و اسفند است.","","rtl",function(){
					hideLoading();
		        	closeWindow({OK:true, Result:null});
				});
			}
		}

		function bindEvents()
		{
			/*randomFileId = Math.floor(Math.random() * (1000000000)) - 2000000;
			firstRandomId = randomFileId;*/
		}

		function readData()
		{
			
			/*showLoading();
			readFromData({Where: primaryKeyName + " = " + pk},
				function(dataXml)
				{
					hideLoading();
					$.setFormDataValues(bindingSourceName, dataXml);
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);*/
		}

		function getPK()
		{
			return pk;
		}

		function isInEditMode()
		{
			return inEditMode;
		}

		function saveData(callback)
		{
			//alert(JSON.stringify('save data'));
			validateForm(
				function()
				{
					if(inEditMode)
					{
						//updateData(callback);
						alert(JSON.stringify('in edit'));
					}
					else
					{
						insertData(callback);
						alert(JSON.stringify('not edit'));
					}
				},
				function()
				{
					$.alert("لطفا موارد اجباری را تکمیل نمایید.", "", "rtl",
						function()
						{}
					);
				}
			);
		}

		function insertData(callback)
		{
			//showLoading();
			var selectedValue = $('#cmbPaymentBy').val(); 
	        var PaymentMethod;

	        if (selectedValue === 'تنخواه دار') {
	            PaymentMethod =1;
	        } else if (selectedValue === 'خزانه دار') {
	            PaymentMethod =2;
	        } else {
	            PaymentMethod = null; 
	        }

			var params = $.getFormDataValues(bindingSourceName);
			params.CreatorActor_ID = currentActorId;
			params.PaymentAmount = rcommafy($("#txtAllAmountUnpaid").val());
			params.PaymentReqAmount = $("#txtAllReqsUnpaidCount").val();
			params.PaymentMethod=PaymentMethod;
			insertFromData(params,
				function(dataXml)
				{
					alert(JSON.stringify(params));
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					randomFileId = pk;
					var result = "<data><" + primaryKeyName + ">" + pk + "</" + primaryKeyName + "></data>";
					//inEditMode = true;
					WorkflowService.RunWorkflow("ZJM.FMS.FPP.FundPaymentProcess",
					    '<Content><Id>'+pk+'</Id><Pay>'+PaymentMethod+'</Pay></Content>',
					    true,
					    function(data)
					    {
					        $.alert("درخواست پرداخت با موفقیت ارسال شد.","","rtl",function(){
								hideLoading();
					        	closeWindow({OK:true, Result:null});
							});				
					    }
					    ,function(err)
					    {
							 console.error('Error details: ', err);
					        alert('مشکلی در شروع فرآیند به وجود آمده. '+err);
					        hideLoading();
							
					    }
					);	
					hideLoading();
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

		function updateData(callback)
		{
			//showLoading();
		}
		
		function deleteData(callback)
		{
			showLoading();
		}

		function validateForm(onSuccess, onError)
		{
			try
			{
				if($.isFunction(onSuccess))
				{
					onSuccess();
				}
			}
			catch(e)
			{
				console.error("Validation Error:", e);

				if($.isFunction(onError))
				{
					onError();
				}
			}
		}
		
		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			saveData: saveData
		};
	}());
	$form.init();
});
//#endregion ready.js

//#region form manager


//#endregion


//#region tbl js ready 
var tblMain = null;

$(function()
{
    tblMain = (function()
    {
        var element = null,
			isDirty = false,
            rowPrimaryKeyName = "Id",
            readRows = FormManager.readEntity,
            insertRows = FormManager.insertEntity,
            updateRows = FormManager.updateEntity,
            deleteRows = FormManager.deleteEntity,
            editFormRegKey = "EditFormRegKey",
            insertFormRegKey = "InsertFormRegKey";

        init();

        function init()
        {
            element = $("#tblPaymentItems");
            build();
            bindEvents();
        }

        function build()
        {            
        }

        function bindEvents()
        {	
        }

        function addRow(rowInfo, rowNumber, l)
        {
            var index = 0,
                tempRow = element.find("tr.row-template").clone();

            tempRow.show().removeClass("row-template").addClass("row-data");
            tempRow.data("rowInfo", rowInfo);
            tempRow.find("td:eq(" + index++ + ")").empty().text(rowNumber);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.UnitsName);
			
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.FuelCount);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.FuelSum));
			total_count += parseInt(rowInfo.FuelCount);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.CarCount);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.CarSum));
			total_count += parseInt(rowInfo.CarCount);
			tempRow.find("td:eq(" + index++ + ")").empty().text(rowInfo.MissionCount);
			total_count += parseInt(rowInfo.MissionCount);
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.MissionSum));
			tempRow.find("td:eq(" + index++ + ")").empty().text(commafy(rowInfo.TotalSUM));
			total_sum += parseInt(rowInfo.TotalSUM);
			if(rowNumber = l){
				$("#txtAllAmountUnpaid").val(commafy(total_sum));
				$("#txtAllReqsUnpaidCount").val(commafy(total_count));
			}
            element.find("tr.row-template").before(tempRow);
        }

        function addNewRow(rowInfo)
        {
            addRow(rowInfo, element.find("tr.row-data").filter(":visible").length + 1);
			isDirty = true;
        }

        function showAddDialog()
        {
            var params = {}; // change params if needed

            $.showModalForm({registerKey: insertFormRegKey, params: params},
                function(retVal)
                {
                    if(retVal.OK)
                    {
                        // if edit form saves the changes
                        refresh();

                        // if edit form passes new values down to be managed here
                        addNewRow(retVal.Data);
                    }
                }
            );
        }

        function editRow(row)
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
        }

        function changeRow(row, newRowInfo)
        {
            var index = 1;
            row.find("td:eq(" + index++ + ")").text(newRowInfo.Name);

            row.attr({state: "changed"});
            row.data("rowInfo", newRowInfo);
			isDirty = true;
        }

        function removeRow(row)
        {
            if(row.attr("state") == "new")
			{
			    row.remove();
				rearrangeRows();
			}
			else
			{
	            row.attr({state: "deleted"});
	            row.hide();
	            rearrangeRows();
			}
			isDirty = true;
        }

        function load()
        {
			// در حالت editmode 
			if($form.isInEditMode()){
				params = {};	
				params = $.extend(params, { 'PaymentProcessID':$form.getPK()});	
				FormManager.readReportTableEditMode(params,
					function(list)
					{
						for(var i = 0, l = list.length; i < l; i += 1)
			            {
							addRow(list[i], i + 1, l);
			            }
					},
					function(err)
					{
						hideLoading();
						alert(err);
					}
				);
			//در حالت ثبت اولیه
			}else{
				params = {};			
				FormManager.readReportTable(params,
					function(list)
					{
						for(var i = 0, l = list.length; i < l; i += 1)
			            {
							addRow(list[i], i + 1, l);
			            }
					},
					function(err)
					{
						hideLoading();
						alert(err);
					}
				);
			}
        }

        function rearrangeRows()
        {
            element.find("tr.row-data").filter(":visible").each(
                function(index)
                {
                    $(this).find("td:eq(0)").text(index + 1);
                }
            );
        }

        function refresh()
        {
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
            showAddDialog: showAddDialog,
			validateData: validateData,
			load: load
        };
    }());
});
//#endregion