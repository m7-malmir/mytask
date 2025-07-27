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
            // Set specific styling
            $("body").css({overflow: "hidden"}).attr({scroll: "no"});

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