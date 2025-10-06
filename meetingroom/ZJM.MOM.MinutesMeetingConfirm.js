// ===================== Public variables =====================
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;
var pk;

var MeetingMinutesData = {
    Items: []
};

$(function(){
    $form = (function(){
        var pk, inEditMode = false;
		
        function init(){
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
				}
				DocumentId = dialogArguments["DocumentId"];
				CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
				InboxId = dialogArguments["WorkItem"]["InboxId"];
			}
	      build();
	      createControls();
        }
	    function build() {
	      //Set the new dialog title
	      changeDialogTitle("بررسی مصوبات وتایید اعضا جلسه");
	    }
        function bindEvents(){

        }
		function createControls(){
			
			showLoading();

			try {
			    const parentUrl = window.parent?.location?.href;
			    const url = new URL(parentUrl);
			    isInTestMode = url.searchParams.get("icantestmode") === "1";
			} catch (e) {
			    console.warn("Cannot reach parent document:", e);
			    isInTestMode = false;
			}
			UserService.GetCurrentActor(true, function (data) {
			    let xmlActor = $.xmlDOM(data);
			    currentActorId = xmlActor.find('actor').attr('pk');
			}, function (error) {
			    console.error("خطا در دریافت Actor:", error);
			});
			FormManager.readMeetingMinuteManagment(
			    { Where: "Id = " + pk },
			    function (list) { // اینجا به خاطر منطق تابع شما، list آرایه‌ای از رکوردهاست
			        if (!list || list.length === 0) {
			            hideLoading();
			            return;
			        }
					//alert(JSON.stringify(list));
			        const data = list[0]; // چون فقط یک رکورد داریم
			        const Id = data.Id;
			        const MeetingMinuteNo = data.MeetingMinuteNo;
			        const fullName = data.fullName;
			        const MeetingStartTime = data.MeetingStartTime;
			        const MeetingEndTime = data.MeetingEndTime;
			        const SubjectMeeting = data.SubjectMeeting;
			        const MeetingAgenda = data.MeetingAgenda;
			        const Title = data.Title;
			        const UserPresent = data.UserPresent;
			        const UserAbsent = data.UserAbsent;
			        const CreatedDate = data.CreatedDate; // اگر توی سرویس برگرده
			
			        // مقداردهی به فیلدها
			        $("#txtFullName").val(fullName).prop("disabled", true);
			        $("#txtCreatedDate").val(formatMiladiToShamsi(CreatedDate)).prop("disabled", true);
			        $("#txtMeetingStartTime").val(extractTime(MeetingStartTime)).prop("disabled", true);
					$("#txtMeetingEndTime").val(extractTime(MeetingEndTime)).prop("disabled", true);
			        $("#txtSubjectMeeting").val(SubjectMeeting).prop("disabled", true);
			        $("#txtMeetingAgenda").val(MeetingAgenda).prop("disabled", true);
			        $("#txtTitle").val(Title).prop("disabled", true);
			        $("#txtUserPresent").val(UserPresent).prop("disabled", true);
			        $("#txtUserAbsent").val(UserAbsent).prop("disabled", true);
			
			        // اگر لازم داری Id و MeetingMinuteNo رو ذخیره کنیم
			        $("#hiddenMeetingId").val(Id);
			        $("#hiddenMeetingNo").val(MeetingMinuteNo);
					loadAttachments(data.Id); 
					//refresh.tblMinuteManagment();
					hideLoading();
					 
	
			    },
			    function (err) {
			        alert(JSON.stringify("خطا در دریافت اطلاعات درخواست! لطفا با پشتیبان سامانه تماس بگیرید."));
			        hideLoading();
			    }
			);

		}
		// ==================== getPrimaryKey ====================
		function getPK()
		{
			return pk;
		}
        return {
			 init:init,
			 getPK: getPK
			 };
    })();

    $form.init();
});
