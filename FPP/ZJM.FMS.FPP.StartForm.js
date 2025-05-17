//#region js.ready 
var $form;
var PaymentMethod;
var total_count = 0;
var total_sum = 0;
var current_role_id = 0;

var DocumentId;
var CurrentUserActorId;
var InboxId;
showLoading(1000);
$(function(){
    $form = (function()
    {
        var pk,
            inEditMode = false,
            primaryKeyName = "Id",
            bindingSourceName = "BS_FundPaymentProcess",
            insertFromData = FormManager.insertEntity,
            updateFromData = FormManager.updateEntity,
            updateFundManagmentProcess = FormManager.updateFundManagmentProcess;

        // تابع init برای راه‌اندازی فرم و خواندن داده‌ها در صورت ویرایش
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
                if(inEditMode){
                    DocumentId = dialogArguments["DocumentId"];
                    CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
                    InboxId = dialogArguments["WorkItem"]["InboxId"];
                }
            }
            build();
            createControls();
            bindEvents();
        }
        
        // تابع build برای تنظیمات اولیه فرم و قرار دادن آن در صفحه
        function build()
        {
            $("body").css({overflow: "hidden"}).attr({scroll: "no"});
            $("#Form1").css({top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px"});
        }

        // تابع createControls برای ایجاد و تنظیم کنترل‌های فرم بر اساس حالت ویرایش
        function createControls()
        {
            if(!inEditMode){
                $("#btnStartProcess").show();
                $("#txtPaymentDateLabel").hide();
                $("#txtPaymentDateArea").addClass("DatePickerhide");
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
                                    // پنهان کردن برخی از دکمه‌ها برای تسک منابع انسانی
                                    $("#btnUnpaidIndividual").hide();
                                    $("#btnUnpaidByExpense").hide();
                                    $("#txtPaymentDateLabel").hide();
                                    $("#txtPaymentDateArea").addClass("DatePickerhide");
                                    $("#txtPaymentOrderNOLabel").hide();
                                    $("#txtPaymentOrderNO").hide();
                                    $("#btnViewed").show();
                                    $("#btnStartProcess").hide();
                                    $("#txtPaymentCheckNOLabel").hide();
                                    $("#txtPaymentCheckNO").hide();
                                    $("#txtPaymentBankNOLabel").hide();
                                    $("#txtPaymentBankNO").hide();
                                    $("#cmbPaymentMethod").hide();
                                    $("#cmbPaymentMethodLabel").hide();
                                }else{
                                    
                                    if(inEditMode){
                                        $("#cmbPaymentMethod").hide();
                                        $("#cmbPaymentMethodLabel").hide();
                                    
                                        params =  {  Where: "Id =" + dialogArguments.FormParams  };
                                        FormManager.readEntity(params,
                                            function(list, status) { 
                                                var paymentMethod = list[0].PaymentMethod;
                                                // تنظیمات براساس نوع روش پرداخت
                                                if(paymentMethod==1){
                                                    $("#txtPaymentDateLabel").show();
                                                    $("#txtPaymentDateArea").addClass("DatePickershow");
                                                    $("#txtPaymentOrderNOLabel").show();
                                                    $("#txtPaymentOrderNO").show();
                                                    $("#btnRegister").show();
                                                    
                                                    $("#btnStartProcess").hide();
                                                    $("#txtPaymentCheckNOLabel").hide();
                                                    $("#txtPaymentCheckNO").hide();
                                                    $("#txtPaymentBankNOLabel").hide();
                                                    $("#txtPaymentBankNO").hide();
                                                }else if(paymentMethod==2){
                                                    $("#txtPaymentDateLabel").hide();
                                                    $("#txtPaymentDateArea").addClass("DatePickerhide");
                                                    $("#txtPaymentOrderNOLabel").hide();
                                                    $("#txtPaymentOrderNO").hide();
                                                    $("#btnViewed").hide();
                                                    $("#btnStartProcess").hide();
                                                    $("#btnRegister").show();
                                                    $("#txtPaymentCheckNOLabel").show();
                                                    $("#txtPaymentCheckNO").show();
                                                    $("#txtPaymentCheckNO").prop("disabled", false);
                                                    $("#txtPaymentBankNOLabel").show();
                                                    $("#txtPaymentBankNO").show();
                                                    $("#txtPaymentBankNO").prop("disabled", false);    
                                                }
                                            },
                                            function(error) { // تابع خطا
                                                console.log("1خطای برگشتی:", error);
                                                $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                                            }
                                        );
                                    }
                                }
                            },
                            function(err)
                            {
                                hideLoading();
                                alert(err);
                            }
                        );
                        
                        tblMain.refresh();
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

        // تابع bindEvents برای متصل کردن رویدادها به کنترل‌ها 
        function bindEvents()
        {
        }

        // تابع readData برای خواندن داده‌ها 
        function readData()
        {
        }

        // تابع getPK برای دریافت شناسه ران شده در پروژه
        function getPK()
        {
            return pk;
        }

        // تابع isInEditMode برای بررسی اینکه آیا در حالت ویرایش هستیم یا نه
        function isInEditMode()
        {
            return inEditMode;
        }

        // تابع saveData برای ذخیره داده‌ها، بررسی اعتبار فرم و فراخوانی توابع درج یا بروزرسانی
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
                function()
                {
                    $.alert("لطفا موارد اجباری را تکمیل نمایید.", "", "rtl",
                        function()
                        {}
                    );
                }
            );
        }

        // تابع insertData برای درج داده‌های جدید در فرم
        function insertData(callback) {
            var selectValue = $('#cmbPaymentMethod').val().trim(); 
            var PaymentMethod;
            var ProcessStatus;

            // تعیین روش پرداخت و وضعیت پردازش بر اساس انتخاب کاربر
            if (selectValue === 'تنخواه دار') {
                PaymentMethod = 1;
                ProcessStatus = 5;
            } else if (selectValue === 'خزانه دار') {
                PaymentMethod = 2;
                ProcessStatus = 10;
            } else {
                alert("لطفا روش پرداخت را انتخاب کنید");
                return;
            }

            // جمع‌آوری اطلاعات فرم برای درج
            var params = $.getFormDataValues(bindingSourceName);
            params.CreatorActor_ID = currentActorId;
            params.PaymentAmount = rcommafy($("#txtTotalUnpaidAmount").val());
            params.PaymentReqAmount = $("#txtUnpaidRequestCount").val();
            params.PaymentMethod = PaymentMethod;
            params.ProcessStatus = ProcessStatus;

            // درج داده‌ها و بروزرسانی وضعیت فرایند پرداخت
            insertFromData(params, function(dataXml) {
                pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
                randomFileId = pk;
                var result = "<data><" + primaryKeyName + ">" + pk + "</" + primaryKeyName + "></data>";

                // به‌روزرسانی وضعیت فرایند پرداخت
                params.PaymentProcess_ID = pk;
                params = $.extend(params, { Where: "ProcessStatus = 15 AND PayStatus = 0" });

                updateFundManagmentProcess(params, function(data) {
                    WorkflowService.RunWorkflow(
                        "ZJM.FMS.FPP.FundPaymentProcess",
                        '<Content><Id>' + pk + '</Id><Pay>' + PaymentMethod + '</Pay></Content>',
                        true,
                        function(data) {
                            $.alert("درخواست پرداخت با موفقیت ارسال شد.", "", "rtl", function() {
                                hideLoading();
                                closeWindow({ OK: true, Result: null });
                            });
                        },
                        function(err) {
                            console.error('Error details: ', err);
                            alert('مشکلی در شروع فرآیند به وجود آمده. ' + err);
                            hideLoading();
                        }
                    );
                }, function(err) {
                    hideLoading();
                    alert(err);
                });

                hideLoading();
                if ($.isFunction(callback)) {
                    callback();
                }
            });
        }

        // تابع updateData برای به‌روزرسانی داده‌های موجود در فرم
        function updateData(callback)
        {
            params =  {  Where: "Id =" + dialogArguments.FormParams  };
            FormManager.readEntity(params,
                function(list, status) { 
                    var paymentMethod = list[0].PaymentMethod;
                    params = {};
                    // بررسی نوع روش پرداخت و انجام اعتبارسنجی لازم
                    if(paymentMethod==1){
                        if($("#txtPaymentDate").val()==='' || $("#txtPaymentOrderNO").val()===''){
                            alert(JSON.stringify('لطفا تاریخ و شماره پرداخت را وارد نمایید'));    
                            return;
                        }

                        // دریافت تاریخ و بررسی اعتبار آن
                        var gdate = $("#txtPaymentDate").attr('gdate').split("/");
                        var PaymentDate = gdate[2] + '-' + gdate[0] + '-' + gdate[1];
                        var selectedDate = new Date(PaymentDate);
                        var today = new Date();
                        today.setHours(0, 0, 0, 0); // تنظیم ساعت، دقیقه و ثانیه امروز به صفر
                        
                        // بررسی اینکه آیا تاریخ انتخاب شده کمتر از امروز است
                        if (selectedDate < today) {
                            alert(JSON.stringify('مقدار تاریخ کمتر از تاریخ امروز است.'));
                            return;
                        }

                        var PaymentOrderNO = $("#txtPaymentOrderNO").val();
                        params.PaymentDate=PaymentDate;
                        params.PaymentOrderNO=PaymentOrderNO;
                        params = $.extend(params, { Where: "Id =" + dialogArguments.FormParams});
                        updateFromData(params,
                            function(data)
                            {
                                var hameshDescription = $(this).find('.comment-input').val();
                                var params = {
                                    'Context': 'پرداخت توسط تنخواه دار انجام گردید',
                                    'DocumentId': DocumentId,
                                    'CreatorActorId': CurrentUserActorId,
                                    'InboxId': InboxId
                                };
                                
                                FormManager.InsertHamesh(params,
                                    function(res)
                                    {
                                        Office.Inbox.setResponse(dialogArguments.WorkItem,0, "",
                                            function(data)
                                            { 
                                                closeWindow({OK:true, Result:null});
                                            }, function(err){ throw Error(err); }
                                        );
                                    }
                                );
                            },
                            function(err)
                            {
                                hideLoading();
                                alert(err);
                            }
                        );
                    // وقتی از طریق خزانه دار پرداخت میگردد
                    }else if(paymentMethod==2){
                        if($("#txtPaymentCheckNO").val()==='' || $("#txtPaymentBankNO").val()===''){
                            alert(JSON.stringify('لطفا شماره چک و شماره پرداخت بانک را وارد نمایید!'));    
                            return;
                        }
                        var PaymentCheckNO = $("#txtPaymentCheckNO").val();
                        var PaymentBankNO = $("#txtPaymentBankNO").val();
                        params.PaymentCheckNO=PaymentCheckNO;
                        params.PaymentBankNO=PaymentBankNO;
                        params = $.extend(params, { Where: "Id =" + dialogArguments.FormParams});
                        updateFromData(params,
                            function(data)
                            {
                                var hameshDescription = $(this).find('.comment-input').val();
                                var params = {
                                    'Context': 'پرداخت توسط خزانه دار انجام گردید',
                                    'DocumentId': DocumentId,
                                    'CreatorActorId': CurrentUserActorId,
                                    'InboxId': InboxId
                                };
                                
                                FormManager.InsertHamesh(params,
                                    function(res)
                                    {
                                        Office.Inbox.setResponse(dialogArguments.WorkItem,1, "",
                                            function(data)
                                            { 
                                                closeWindow({OK:true, Result:null});
                                            }, function(err){ throw Error(err); }
                                        );
                                    }
                                );
                            },
                            function(err)
                            {
                                hideLoading();
                                alert(err);
                            }
                        );
                    }
                },
                function(error) { // تابع خطا
                    console.log("1خطای برگشتی:", error);
                    $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
                }
            );
        }
        
        // تابع deleteData برای حذف داده‌ها (در حال حاضر خالی است)
        function deleteData(callback)
        {
            showLoading();
        }

        // تابع validateForm برای اعتبارسنجی فرم و فراخوانی تابع مناسب در صورت موفقیت یا خطا
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
var FormManager = {
	//******************************************************************************************************
	readEntity: function(jsonParams, onSuccess, onError)
	{
	    BS_FundPaymentProcess.Read(jsonParams
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
	                        ProcessStatus: $(this).find("col[name='ProcessStatus']").text(),
	                        PaymentMethod: $(this).find("col[name='PaymentMethod']").text(),
							Active: $(this).find("col[name='Active']").text(),
							
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
/****************************************************************************************************************/
readReportTableEditMode: function(jsonParams, onSuccess, onError)
	{
		SCMD_GetReportTableEditMode.Execute(jsonParams
		    , function(data)
		    {
		        var list = [];
				var xmlvar = $.xmlDOM(data);
				xmlvar.find("row").each(
					function()
					{
						list.push
						({
							CarSum: $(this).find("col[name='CarSum']").text(),
							CarCount: $(this).find("col[name='CarCount']").text(),
							FuelSum: $(this).find("col[name='FuelSum']").text(),
							FuelCount: $(this).find("col[name='FuelCount']").text(),
							MissionSum: $(this).find("col[name='MissionSum']").text(),
							MissionCount: $(this).find("col[name='MissionCount']").text(),
							TotalSUM: $(this).find("col[name='TotalSUM']").text(),
							UnitsName: $(this).find("col[name='UnitsName']").text()
						});
					}
				);
				if($.isFunction(onSuccess))
				{
					onSuccess(list);
				}
		    },onError
		);
	}
	,
/****************************************************************************************************************/
	insertEntity: function(jsonParams, onSuccess, onError)
	{
		BS_FundPaymentProcess.Insert(jsonParams
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
		BS_FundPaymentProcess.Update(jsonParams,
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
				var methodName = "updateEntity";

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
	updateFundManagmentProcess: function(jsonParams, onSuccess, onError)
	{
		BS_FundManagmentProcess.Update(jsonParams,
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
				var methodName = "updateEntity";

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
	InsertHamesh: function(jsonParams, onSuccess, onError)
	{
		SP_HameshInsert.Execute(jsonParams,
			function(data)
			{ 
				var xmlvar = null;
				var xmlvar = $.xmlDOM(data);
				if($.isFunction(onSuccess))
				{
					onSuccess(200);
				}
			},
			function(error) {
				var methodName = "InsertHamesh";

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

/****************************************************************************************************************/
	readReportTable: function(jsonParams, onSuccess, onError)
	{
		SCMD_GetReportTable.Execute(jsonParams
		    , function(data)
		    {
		        var list = [];
				var xmlvar = $.xmlDOM(data);
				xmlvar.find("row").each(
					function()
					{
						list.push
						({
							CarSum: $(this).find("col[name='CarSum']").text(),
							CarCount: $(this).find("col[name='CarCount']").text(),
							FuelSum: $(this).find("col[name='FuelSum']").text(),
							FuelCount: $(this).find("col[name='FuelCount']").text(),
							MissionSum: $(this).find("col[name='MissionSum']").text(),
							MissionCount: $(this).find("col[name='MissionCount']").text(),
							TotalSUM: $(this).find("col[name='TotalSUM']").text(),
							UnitsName: $(this).find("col[name='UnitsName']").text()
						});
					}
				);
				if($.isFunction(onSuccess))
				{
					onSuccess(list);
				}
		    },onError
		);
	},
/****************************************************************************************************************/
	GetReport2: function(jsonParams, onSuccess, onError)
	{
		SCMD_GetExcelReport2.Execute(jsonParams
			, function(data)
			{ 
				var list = [];
				var xmlvar = $.xmlDOM(data);
				PersonnelNO = 'کد پرسنلی';
				FullName = 'نام و نام خانوادگی';
				TotalSUM = 'مبلغ';
				MelliAccount = 'شماره حساب';
				c = 'تعداد درخواستهای پرداخت نشده';
				
				xmlvar.find("row").each(
					function()
					{
						
						list.push
						({
							'کد پرسنلی': $(this).find("col[name='PersonnelNO']").text(),
							'نام و نام خانوادگی': $(this).find("col[name='FullName']").text(),
							'مبلغ': commafy($(this).find("col[name='TotalSUM']").text()),
							'تعداد درخواستهای پرداخت نشده': commafy($(this).find("col[name='c']").text()),
							'شماره حساب': $(this).find("col[name='MelliAccount']").text()
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
/****************************************************************************************************************/
	GetRoleId: function(jsonParams, onSuccess, onError)
	{
		SCMD_GetRoleId.Execute(jsonParams
			, function(data)
			{ 
				var list = [];
				var xmlvar = $.xmlDOM(data);
				xmlvar.find("row").each(
					function()
					{
						list.push
						({
							RoleId: $(this).find("col[name='RoleId']").text()
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

/****************************************************************************************************************/
	GetReport3: function(jsonParams, onSuccess, onError)
	{
		SCMD_GetExcelReport3.Execute(jsonParams
			, function(data)
			{ 
				var list = [];
				var xmlvar = $.xmlDOM(data);
				Id = 'شماره درخواست';
				PersonnelNO = 'کد پرسنلی';
				fullName = 'نام و نام خانوادگی';
				RahkaranInsertedDate = 'تاریخ ثبت در راهکاران';
				TotalSUM = 'مبلغ';
				CreatedDate = 'تاریخ درخواست';
				RahkaranInsertedDate = 'تاریخ ثبت در راهکاران';
				desc = 'شرح';
				
				xmlvar.find("row").each(
					function()
					{
						gdate = $(this).find("col[name='RahkaranInsertedDate']").text().split(' ')[0];
						gdate_ = gdate.split('/');
						
						jalaliDate = miladi_be_shamsi(parseInt(gdate_[2]), parseInt(gdate_[0]), parseInt(gdate_[1]))[0];
						
						desc_ = $(this).find("col[name='FundType']").text();
						if(desc_ == 1){
							desc1 = "هزینه سوخت";
						}else if(desc_ == 2){
							desc1 = "هزینه خودرو";
						}else if(desc_ == 3){
							desc1 = "هزینه ماموریت";
						}else{
							desc1 = "نامشخص ... ";
						}
						desc = "درخواست بابت " + desc1 + " " + $(this).find("col[name='fullName']").text();
						
						gdate2 = $(this).find("col[name='CreatedDate']").text().split(' ')[0];
						gdate2_ = gdate2.split('/');
						jalaliDate2 = miladi_be_shamsi(parseInt(gdate2_[2]), parseInt(gdate2_[0]), parseInt(gdate2_[1]))[0];
						
						list.push
						({
							'کد پرسنلی': $(this).find("col[name='PersonnelNO']").text(),
							'تاریخ ثبت در راهکاران': jalaliDate,
							'تاریخ شمسی درخواست': jalaliDate2,
							'مبلغ': commafy($(this).find("col[name='TotalSUM']").text()),
							'شرح': desc
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
/******************************************************************************/
	GetReport: function(jsonParams, onSuccess, onError)
	{
		SCMD_GetExcelReport.Execute(jsonParams
			, function(data)
			{ 
				var list = [];
				var xmlvar = $.xmlDOM(data);
				Id = 'شماره درخواست';
				PersonnelNO = 'کد پرسنلی';
				fullName = 'نام و نام خانوادگی';
				RahkaranInsertedDate = 'تاریخ ثبت در راهکاران';
				TotalSUM = 'مبلغ';
				CreatedDate = 'تاریخ درخواست';
				RahkaranInsertedDate = 'تاریخ ثبت در راهکاران';
				desc = 'شرح';
				
				xmlvar.find("row").each(
					function()
					{
						gdate = $(this).find("col[name='RahkaranInsertedDate']").text().split(' ')[0];
						gdate_ = gdate.split('/');
						
						jalaliDate = miladi_be_shamsi(parseInt(gdate_[2]), parseInt(gdate_[0]), parseInt(gdate_[1]))[0];
						
						desc_ = $(this).find("col[name='FundType']").text();
						if(desc_ == 1){
							desc1 = "هزینه سوخت";
						}else if(desc_ == 2){
							desc1 = "هزینه خودرو";
						}else if(desc_ == 3){
							desc1 = "هزینه ماموریت";
						}else{
							desc1 = "نامشخص ... ";
						}
						desc = "درخواست بابت " + desc1 + " " + $(this).find("col[name='fullName']").text();
						
						gdate2 = $(this).find("col[name='CreatedDate']").text().split(' ')[0];
						gdate2_ = gdate2.split('/');
						jalaliDate2 = miladi_be_shamsi(parseInt(gdate2_[2]), parseInt(gdate2_[0]), parseInt(gdate2_[1]))[0];
						
						list.push
						({
							'کد پرسنلی': $(this).find("col[name='PersonnelNO']").text(),
							'تاریخ ثبت در راهکاران': jalaliDate,
							'تاریخ شمسی درخواست': jalaliDate2,
							'مبلغ': commafy($(this).find("col[name='TotalSUM']").text()),
							'شرح': desc
						});
					}
				);
				if($.isFunction(onSuccess))
				{
					onSuccess(list);
				}
			}, onError
		);
	}
};
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
//افزودن داده های بارگذاری شده از تابع load مطابق شرط لازم
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
				$("#txtTotalUnpaidAmount").val(commafy(total_sum));
				$("#txtUnpaidRequestCount").val(commafy(total_count));
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
			// در حالت editmode اجرا میشود
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
			//برای فرم اول اجرا میشود
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

//#region 

//#endregion