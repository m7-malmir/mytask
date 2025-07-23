//#region ready.js
// Create a variable to hold our form module
// Create a variable to hold our form module
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
});//#endregion ready.js

//#region tblCostRequest.js
var tblCostRequest = null;
var mainList;

$(function () {
    tblCostRequest = (function () {
        // ================ Variables ===============
		  var element = null,
	            isDirty = false,
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
			$("#tblCostRequest").on("click", "input[type=checkbox][name=CostRequestId]", function() {
			    var $this = $(this);
			    $("#tblCostRequest input[type=checkbox][name=CostRequestId]").not($this).prop("checked", false);
			    selectedContractId = $this.is(":checked") ? $this.val() : null;
			});
			//-------------------------------
			
			/*
			$("#").on("click",,function(){
				WorkflowService.RunWorkflow("ZJM.PSW.ProdutWholesale",
	            '<Content><Id>' + data["OrderId"] + '</Id><IsInTestMode>' + $form.isInTestMode() + '</IsInTestMode></Content>',
	            true,
	            function(data) {
	                handleRunWorkflowResponse(data);
	            },
	            function(err) {
					 handleError(err, 'WorkflowService.RunWorkflow');
	            }
	        );
			});
			*/
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
			let tbCheckbox = `<input type='checkbox' id='id' name='CostRequestId' class="pointer" value=${rowInfo.Id}>`;
		    tds.eq(0).html(tbCheckbox); 			    // tbCheckbox		
		    tds.eq(1).text(rowInfo.Id);             	// ID
		    tds.eq(2).text(rowInfo.CostRequestNo);     	// CostRequest No 
		    tds.eq(3).text(miladiDateToShamsi(rowInfo.CreatedDate.split(' ')[0]));       	// CreatedDate
		    tds.eq(4).text(rowInfo.CostReuqestTitle);           	// CostReuqestTitle
		    tds.eq(5).text(rowInfo.RejectStatus ? "فعال" : "غیرفعال");
		    tds.eq(6).text(rowInfo.ProcessStatus);  
			tds.eq(7).text(rowInfo.CostRequestNo);   	// CostRequest No
			tds.eq(8).html(`<button id=${rowInfo.Id} href="#">ارسال درخواست</button>`);   // Proccess
		
		    // Add the row before the template
		    element.children("tbody").children("tr.row-template").before(tempRow);
		
		    // Hide loading spinner
		    myHideLoading();
		}

		// ================== Load ==================
		// This function loads data and fills the table
		function load() {
			if (!currentUserId){return;} 
            var params = {
                Where: "CreatorUserId = " + currentUserId
            };
		    readRows(params,
		        function (list) {

		            if (Array.isArray(list) && list.length > 0) {
		                list.forEach(function (row, index) {
		                    addRow(row, index + 1); // Pass row and row number
		                });
		            } else {
		                console.warn('No data received.');
		            }
		
		            myHideLoading(); // Only once, in success
		        },
		        function (error) {
		            myHideLoading(); // On error
		            alert(error || "خطایی رخ داده است");
		        }
		    );
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