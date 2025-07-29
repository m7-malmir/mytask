//#region ready.js
// Create a variable to hold our form module
var $form;
var CurrentUserId;
var params={};
var primaryKeyName = "Id";
$(function () {
	
    $form = (function () {
		
		var pk,
		inEditMode = false,
		primaryKeyName = "Id";
        // ==================== Init =====================
        function init() {

            build();
			createControls();
        }

        // ==================== Build ====================
		function build() {
		    $("body").css({overflow: "hidden"}).attr({scroll: "no"});
		    changeDialogTitle("مشاهده و ثبت اعلام هزینه");
		    var params = window.dialogArguments || window.arguments;
		
		    if (params && params.CostRequestNo) {
		        // فقط وقتی مقدار وجود داره مقداردهی بشه
		        if (params.CostRequestNo) $("#txtCostRequestNo").val(params.CostRequestNo);
		        if (params.CostRequestId)  $("#lblCostRequestID").text(params.CostRequestId);
		        if (params.Title) {
		            $("#txtRequestTitle").val(params.Title);
		            $("#txtRequestTitle").prop('disabled', true);
		        }
		        $('#btnRegister').prop('disabled', true);
		    } else {
		        // اگر پارامز نیومده می‌تونی مقدار پیشفرض بدی یا فرم رو آماده حالت ایجاد جدید کنی
		        // یا اصلاً هیچ کاری نکن و let it be
		    }
		}


        // ==================== createControls ====================
        function createControls() {
			//-----------------------------------
			showLoading();
			UserService.GetCurrentUser(true,
				function(data){
						hideLoading(); 
						var xml = $.xmlDOM(data);
						currentUserId = xml.find("user > id").text().trim();
						
					},
				function(err){
					hideLoading();
					$ErrorHandling.Erro(err,"خطا در سرویس GetCurrentUser");
				}	
			);
        }
	
        // ==================== Return ====================
        return {
            init: init
        };
    })();

    // Call the init functio
    $form.init();
});
//#endregion ready.js

//#region btnRegister.js 
$("#btnRegister").click(function() {
	//----------------------------
    // -- تابع تولید شماره جدید --
	//----------------------------
    function getNextCostRequestNo(list) {
        if (!Array.isArray(list) || list.length === 0) {
            return "CR100001";
        }
        let maxNum = 100000;
        list.forEach(item => {
            let value = item.CostRequestNo;
            let num = 0;
            if (typeof value === "string" && value.startsWith("CR")) {
                num = parseInt(value.replace("CR", ""), 10);
            } else {
                num = parseInt(value, 10);
            }
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        });
        const nextNum = maxNum + 1;
        return "CR" + nextNum.toString().padStart(6, "0");
    }
	//----------------------------
	
    // -- کنترل خالی بودن عنوان --
    let requestTitle = $('#txtRequestTitle').val().trim();
    if (requestTitle == "") {
        $.alert("لطفا عنوان پرونده هزینه را وارد کنید", "توجه", "rtl");
        return;
    }
	
	//-----------------------------------
    // -- خواندن لیست و ثبت رکورد جدید --
	//-----------------------------------
	    FormManager.readCostRequest({}, function(list, status) {
	        let nextCR = getNextCostRequestNo(list);   // ساختن شماره جدید
	        let insertParams = {
	            CostRequestNo: nextCR,
	            CreatorUserId: currentUserId,
	            CostReuqestTitle: requestTitle
	    };
        FormManager.insertCostRequest(insertParams,
            function(dataXml) {
                myHideLoading();

                pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
                $("#lblCostRequestID").text(pk);
                $.alert(
                    `درخواست شما با موفقیت ذخیره شد`,
                    "ذخیره شد",
                    "rtl"
                );
                $('#btnRegister').prop('disabled', true);
            },
            function(err) {
                myHideLoading();
                alert(err);
            }
        );
    });
	//-----------------------------------
});

//#endregion btnRegister.js

//#region formmanager.js
var FormManager = {
	    //******************************************************************************************************
    // دریافت لیست کالاهای قابل فروش
    readCostRequest: function (jsonParams, onSuccess, onError) {
        BS_CR_CostRequest.Read(jsonParams,
            function (data) {
                var list = [];
                var xmlvar = $.xmlDOM(data);
                xmlvar.find("row").each(
                    function () {
                        list.push
                            ({
                                CostRequestNo: $(this).find("col[name='CostRequestNo']").text()
                            });
                    }
                );
                if ($.isFunction(onSuccess)) {
                    onSuccess(list);
                }
            },
            function (error) {
                var methodName = "readEntityGoodsCatalogue";

                if ($.isFunction(onError)) {
                    var erroMessage = "خطایی در سیستم رخ داده است. (Method: " + methodName + ")";
                    console.error("Error:", erroMessage);
                    console.error("Details:", error);

                    onError({
                        message: erroMessage,
                        details: error
                    });
                } else {
                    console.error(erroMessage + " (no onError callback provided):", error);
                }
            }
        );
    },
    /*********************************************************************************************************/
	// ==================== insertEntity ====================
	insertCostRequest: function(jsonParams, onSuccess, onError)
	{
		BS_CR_CostRequest.Insert(jsonParams,
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
				var methodName = "insertContract";

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
    // ================================================

};

//#endregion


//#region tblCostRequestDetails.js
var tblCostRequestDetails = null;
var mainList;

$(function () {
    tblCostRequestDetails = (function () {
        // ================ Variables ===============
		  var element = null,
	            isDirty = false,
	            rowPrimaryKeyName = "Id",
	            readRows = FormManager.readCostRequestDetail;
		        // Start the table setup
		        init();
        // ================== Init ==================
        function init() {
			element = $("#tblCostRequestDetails");
            build();        // build the structure
            bindEvents();   // setup event handlers
            load();         // load data into the table
        }
        // ================= Build ==================
        function build() {
           //element = $("#tblCostRequestDetails"); // get the table element
        }
        // =============== Bind Events ===============
        function bindEvents() {
			
			//-------------------------------
			//--- گرفتن ایدی درخواست هزینه در صورتی که یک ردیف باید انتخاب شود
			//-------------------------------
			$("#tblCostRequestDetails").on("click", "input[type=radio][name=RequestCostId]", function() {
			    var $this = $(this);
			    $("#tblCostRequestDetails input[type=checkbox][name=CostRequestId]").not($this).prop("checked", false);
			    selectedContractId = $this.is(":checked") ? $this.val() : null;
			});
			//-------------------------------

        }
		// ================= Add Row =================
		// This function adds a new row to the table using data from the server
		function addRow(rowInfo) {
		    // Clone the template row
		    var tempRow = element.children("tbody").children("tr.row-template").clone();
		    // Prepare the row
		    tempRow
		        .show()
		        .removeClass("row-template")
		        .addClass("row-data")
		        .data("rowInfo", rowInfo); // Store row data in the DOM
		    // Get all <td> elements once
		    var tds = tempRow.children("td");
		    // Fill table cells
			let tbCheckbox = '';
			 tbCheckbox = `<input type='radio' id='id${rowInfo.Id}' name="RequestCostId"  class="pointer" >`;
		    tds.eq(0).html(tbCheckbox); 		
		    tds.eq(1).text(rowInfo.Id);             	
		    tds.eq(2).text(rowInfo.RequestCostId);     	
		    var p = rowInfo.CostDate.split('/'),
			sh = miladi_be_shamsi(+p[2], +p[0], +p[1]),
			f  = n => n < 10 ? '0'+n : n;
			tds.eq(3).text(`${sh[0]}/${f(sh[1])}/${f(sh[2])}`);

		    tds.eq(4).text(rowInfo.CostRequestTypeName);           	
		    tds.eq(5).text(rowInfo.CostRequestTypeDetailName);
		    tds.eq(6).text(commafy(rowInfo.RequestCostPrice));  
			tds.eq(7).text(commafy(rowInfo.ConfirmCostPrice));   
		    // Add the row before the template
		    element.children("tbody").children("tr.row-template").before(tempRow);
		    // Hide loading spinner
		    myHideLoading();
		}

		// ================== Load ==================
		// This function loads data and fills the table
		function load() {
		var requestCostId = $("#lblCostRequestID").text().trim();
		
		// فقط وقتی عدد بود اجرا کن
		if (requestCostId !== "" && !isNaN(requestCostId)) {
		    var params = {
		        Where: `RequestCostId = ${requestCostId}`
		    };
		
		    readRows(
		        params,
		        function (list) {
		            if (Array.isArray(list) && list.length > 0) {
		                list.forEach(function (row, index) {
		                    addRow(row, index + 1);
		                });
		            } else {
		                console.warn('No data received.');
		            }
		            myHideLoading(); // موفقیت
		        },
		        function (error) {
		            myHideLoading(); // خطا
		            alert(error || "خطایی رخ داده است");
		        }
		    );
		} else {
		    // وقتی مقدار یا خالی یا غیرعددی بود هیچکاری نمی‌کنیم
		    // (برای دیباگ می‌تونی لاگ بذاری)
		    // console.warn('CostRequestID is not a valid number:', requestCostId);
		}

		}

        // ================= Refresh =================
        // This function clears the table and loads fresh data
        function refresh() {
            element.find("tr.row-data").remove();
            load();
        }

        // =============== Return ===============
        // Return public methods
        return {
            refresh: refresh,
            load: load,
            readRows: readRows
        };
    }());
});

//#endregion