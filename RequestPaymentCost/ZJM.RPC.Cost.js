//#region ready.js

	var $form;
	var isInTestMode = false;
	var currentUserId;
	var primaryKeyName = "Id";
	var selectedContractId = null;
	$(function(){
	$form = (function()
	{ 
		var pk,
			inTestMode = (typeof isInTestMode !== "undefined" ? isInTestMode : false),
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
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
			var jsonParams = {}; // پارامترهای مورد نیاز برای خواندن داده‌ها

		}
        // ==================== createControls ====================
        function createControls() {
            showLoading();
            UserService.GetCurrentUser(true,
                function(data){
                    hideLoading();
					
                    var xml = $.xmlDOM(data);
                    currentUserId = xml.find("user > id").text().trim();
					tblCostRequest.refresh();
                },
                function(err){
                    hideLoading();
                    $ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
                }
		
            );
        }

        // ==================== Return ====================
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
		// چک کردن url برای رفتن به حالت تست مود
		function isInTestMode() {
		    try {
		        const parentUrl = window.parent?.location?.href;
		        const url = new URL(parentUrl);
		        return url.searchParams.get("icantestmode") === "1";
		    } catch (e) {
		        console.warn("Cannot reach parent document:", e);
		        return false;
		    }
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
		$("#tblCostRequest").on("click", "button", function () {
		    var requestId = this.id;
				WorkflowService.RunWorkflow(
				    "ZJM.RPC.RequestPaymentCost",
				    '<Content><Id>' + requestId + '</Id><IsInTestMode>' + isInTestMode() + '</IsInTestMode></Content>',
				    true,
				    function (data) {
				        handleRunWorkflowResponse(data);
				    },
				    function (err) {
				        handleError(err, 'WorkflowService.RunWorkflow');
						console.log('دیتای کامل خطا:', err);
				    }
				);
		});
		//******************************************************************************************************
		function insertData(callback) {		    
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
//#endregion ready.js

//#region tblCostRequest.js
var tblCostRequest = null;

$(function () {
    tblCostRequest = (function () {
        // ================ Variables ===============
		  var element = null,
	            rowPrimaryKeyName = "Id",
	            readRows = FormManager.readCostRequest;
		        // Start the table setup
		        init();
        // ================== Init ==================
        function init() {
			element = $("#tblCostRequest");
            build();        // build the structure
            bindEvents();   // setup event handlers
            load();         // load data into the table
        }
        // ================= Build ==================
        function build() {
           //element = $("#tblCostRequest"); // get the table element
        }
        // =============== Bind Events ===============
        function bindEvents() {
			
			//-------------------------------
			//--- گرفتن ایدی درخواست هزینه در صورتی که یک ردیف باید انتخاب شود
			//-------------------------------
			$("#tblCostRequest").on("click", "input[type=radio][name=CostRequestId]", function() {
			    var $this = $(this);
			    $("#tblCostRequest input[type=checkbox][name=CostRequestId]").not($this).prop("checked", false);
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
			if (rowInfo.ProcessStatus == 1) {
			    tbCheckbox = `<input type='radio' id='id${rowInfo.CostRequestId}' name='CostRequestId' class="pointer" value="${rowInfo.CostRequestId}">`;
			}
		    tds.eq(0).html(tbCheckbox); 			    // tbCheckbox		
		    tds.eq(1).text(rowInfo.CostRequestId);   // ID
			if(rowInfo.ProcessStatus==1){
			tds.eq(2).html(`<a class="details-link" style="text-decoration: underline;" id=${rowInfo.CostRequestNo} href="#">${rowInfo.CostRequestNo}</a>`);
		    }else{
				tds.eq(2).html(`<span>${rowInfo.CostRequestNo}</span>`);  // Proccess
			}
			
		    tds.eq(3).text(miladiDateToShamsi(rowInfo.CreatedDate.split(' ')[0]));       	// CreatedDate
		    tds.eq(4).text(rowInfo.CostReuqestTitle);           	// CostReuqestTitle
		    tds.eq(5).text(rowInfo.RejectStatusTitle ? "رد شده" : "در جریان");
		    tds.eq(6).text(rowInfo.ProcessTitle);  
			tds.eq(7).text(rowInfo.InnerRegNumber);   	// CostRequest No
			if(rowInfo.ProcessStatus==1){
				tds.eq(8).html(`<a class="workflow-link" style="text-decoration: underline;" id=${rowInfo.CostRequestId} href="#">ارسال درخواست</a>`);  // Proccess
			}else{
				tds.eq(8).html(`<span>ارسال شده</span>`);  // Proccess
			}
		    // Add the row before the template
		    element.children("tbody").children("tr.row-template").before(tempRow);
		    // Hide loading spinner
		    myHideLoading();
		}

		// ================== Load ==================
		// This function loads data and fills the table
		function load() {
			//-------------------------------------
			// جستجو بر اساس شماره مدرک و نام پرونده
			//-------------------------------------
			if (!currentUserId){return;} 
			let params; 
			let searchValue = $("#txtSearchValue").val().trim(); // مقدار سرچ با trim
			
			if (searchValue !== "") {
			    let $selectedSearchField = $("#cmbSearchField option:selected");
			    let type = $selectedSearchField.data("type"); // نوع فیلد: number یا string
			    let searchField = $selectedSearchField.val(); // نام ستون
			
			    // شرط WHERE بر اساس نوع فیلد
			    switch (type) {
			        case "string":
			            params = {
			                Where: `CreatorUserId = ${currentUserId} AND ${searchField} LIKE N'%${searchValue}%'`
			            };
			            break;
			        case "number":
			        case "int":
			        default:
			            params = {
			                Where: `CreatorUserId = ${currentUserId} AND ${searchField} = ${searchValue}`
			            };
			            break;
			    }
			} else {
			    // وقتی سرچ خالیه، فقط فیلتر بر اساس CreatorUserId
			    params = {
			        Where: `CreatorUserId = ${currentUserId}`
			    };
			}
			// فراخوانی اصلی داده ها
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

			//-------------------------------------
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

//#endregion tblCostRequest.js

//#region rpcCostRequest_Delete-btn.js
$("#rpcCostRequest_Delete").click(function() {
	if (selectedContractId === null || selectedContractId === undefined || selectedContractId === "") {
	    $.alert("لطفا ابتدا سطر مورد نیاز برای حذف را انتخاب کنید!", "", "rtl");
	    return;
	}
    // تعریف متغیر params با let یا var (بهتره let)
    let params = { Where: "Id = " + selectedContractId };
	alert(JSON.stringify(params));
    FormManager.deleteCostRequest(
        params,
        function(status, list) { 
            $.alert("حذف درخواست هزینه با موفقیت انجام شد.", "", "rtl", function() {
                hideLoading();
                tblCostRequest.refresh();
            });  	 	 
        },
        function(error) { 
            console.log("خطای برگشتی:", error);
            $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
        }
    );
});

//#endregion rpcCostRequest_Delete-btn.js

//#region rpcCostRequest_Add_btn.js
$("#rpcCostRequest_Add").click(function(){
	$.showModalForm({registerKey:"ZJM.RPC.CostDetailInsert", params:{}} 
	    , function(retVal)
	    {
	        if (retVal.Result) {
	            tblCostRequest.refresh();
	        }
	    }
	);
});
//#endregion rpcCostRequest_Add_btn.js


//#region formmanager.js
const FormManager = {
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
                                CostRequestId: $(this).find("col[name='CostRequestId']").text(),
                                CostRequestNo: $(this).find("col[name='CostRequestNo']").text(),
                                CreatedDate: $(this).find("col[name='CreatedDate']").text(),
                                CreatorUserId: $(this).find("col[name='CreatorUserId']").text(),
								ProcessStatus: $(this).find("col[name='ProcessStatus']").text(),
								RejectStatusTitle: $(this).find("col[name='RejectStatusTitle']").text(),
                                ProcessTitle: $(this).find("col[name='ProcessTitle']").text(),
								InnerRegNumber: $(this).find("col[name='InnerRegNumber']").text(),
                                CostReuqestTitle: $(this).find("col[name='CostReuqestTitle']").text()
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
	deleteCostRequest: function(jsonParams, onSuccess, onError)
	 {
	 	 BS_CR_CostRequest.Delete(jsonParams, 
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
	 	 	 	   var methodName = "deleteCostRequest";	 
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
//#endregion formmanager