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
            changeDialogTitle("مدیریت صورتجلسات");
        }

        // ====================== Bind Events ======================
        function bindEvents(){
			
            // Streamline workflow
			$('#tblMinutesMeeting').on('click', 'a.workflow-link', function (e) {
		    e.preventDefault();
		
		    const requestId = this.id;
		    const params = { MeetingMinuteManagmentId: requestId };
		
		    FormManager.meetingMinuteManagmentFlowReceiver(
		        params,
		        function (data) {
		            if (data.Success === 0) {
		                $.alert("SP Error: " + data.Message, "خطا", "rtl");
		                return;
		            }
		
		            const contentXml = `<Content>
		                <Id>${requestId}</Id>
		                <IsInTestMode>${isInTestMode()}</IsInTestMode>
		            </Content>`;
		
		            WorkflowService.RunWorkflow(
		                "ZJM.MOM.MinutesOfMeeting",
		                contentXml,
		                true,
		                function () {
		                    tblMinutesMeeting.refresh();
		                },
		                function (err) {
		                    handleError(err, "WorkflowService.RunWorkflow");
		                }
		            );
		        },
		        function (err) {
		            alert(err?.details || err);
		        }
		    );
		});


        }
		
        // ==================== createControls ====================
        function createControls() {
            UserService.GetCurrentUser(true,
                function(data){
                    hideLoading();

                    const xml = $.xmlDOM(data);
                    currentActorId = xml.find("user > actors > actor").attr("pk");
                    tblMinutesMeeting.refresh();
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