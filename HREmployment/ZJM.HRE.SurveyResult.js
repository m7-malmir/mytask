//#region ready.js
// ===================== Public variables =====================
let $form;
let currentActorId;
let isInTestMode = false;

$(function(){
    $form = (function() {
        // ================== Private variables ===================
        let pk;
        let inEditMode = false;

        // ========================= Init =========================
        function init() {
            build();
            createControls();
            bindEvents();
            // Disable autocomplete for all input fields
            $('input[role="TextBox"], input[role="DatePicker"]').attr('autocomplete', 'off');
        }
        // ======================== Build =========================
        function build() {        
            changeDialogTitle("تدوین صورتجلسه");
        }

        // ====================== Bind Events ======================
        function bindEvents(){
        }
		
        // ==================== createControls ====================
        function createControls() {
            UserService.GetCurrentUser(true,
                function(data){
                    hideLoading();

                    const xml = $.xmlDOM(data);
                    currentActorId = xml.find("user > actors > actor").attr("pk");
                    tblSurveyResult.refresh();
                },
                function(err){
                    hideLoading();
                    $ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
                }
            );
        }
		
        // ==================== isInTestMode =====================
        function isInTestMode() {
            try {
                const parentUrl = window.parent?.location?.href;
                const url = new URL(parentUrl);
				
                // If 'icantestmode' is 1 then return True
                return url.searchParams.get("icantestmode") === "1";
            } catch (e) {
                console.warn("Cannot reach parent document:", e);
                return false;
            }
        }
		
        // ==================== getPrimaryKey ====================
        function getPrimaryKey() {
            return pk;
        }

        // ==================== isInEditMode ====================
        function isInEditMode() {
            return inEditMode;
        }
        // ======================== return ========================
        return {
            init: init,
            getPK: getPrimaryKey,
            isInEditMode: isInEditMode,
        };

    }());
    
    $form.init();
});
//#endregion ready.js

