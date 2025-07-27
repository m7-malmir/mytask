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

