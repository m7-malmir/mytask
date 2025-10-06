var $form;
var currentActorId;
var isInTestMode = false;
var html_;
var ProcessStatus;
var MeetingMinutesData = { Items: [] };
let actorLookup = {}; // تعریف در بالا، سراسری

$(function(){
    $form = (function(){
        var pk, inEditMode = false;
		
        function init(){
            build();
            bindEvents();
            createControls();
        }

        function build(){
            $("body").css({overflow: "hidden"}).attr({scroll: "no"});
            $("#frmLoanRequest").css({
                top: "0", left: "0",
                width: $(document).width() + "px",
                height: $(document).height() + "px"
            });
            changeDialogTitle("ثبت صورتجلسه");
        }

        function bindEvents(){
            window.handleNewMinuteItem = handleNewMinuteItem;

            $("#momMeetingMinutes_Delete").off("click").on("click", function() {
                const selectedId = $("input[name='selectedRowId']:checked").val();
                if (!selectedId) return $.alert("لطفاً یک ردیف را انتخاب کنید.", "", "rtl");
				$.confirm("آیا از حذف این مصوبه اطمینان دارید؟", "حذف", "rtl", function (res) {
				    if (res !== "OK") return; // اگه لغو شد، هیچی نکن
				
				    deleteMinuteItem(selectedId);
				});


            });

            $("#gbxDocuments").on("click", ".remove-btn", function(){
                const fileId = $(this).closest("div").data("file-id");
                if (fileId) removeAttachment(fileId, $(this).closest("div"));
            });
        }
		function loadActorLookup(callback) {
		    BS_GetUserInfo.Read({}, function (data) {
		        const $xml = $.xmlDOM ? $.xmlDOM(data) : $(data);
		        $xml.find("row").each(function () {
		            const id = $(this).find("col[name='ActorId']").text().trim();
		            const fullName = $(this).find("col[name='fullName']").text().trim();
		            actorLookup[id] = fullName;
		        });
		        console.log(" actorLookup loaded:", actorLookup);
		        if (typeof callback === "function") callback();
		    }, function (err) {
		        console.error(" Error loading actorLookup:", err);
		        if (typeof callback === "function") callback();
		    });
		}

        function createControls(){
			
            const params = window.dialogArguments || window.arguments || {};
            const meetingMinuteId = params.MeetingMinuteId || null;
            $("#lblMeetingMinuteId").text(meetingMinuteId);

            showLoading();
			UserService.GetCurrentActor(true, function (data) {
			    const xmlActor = $.xmlDOM(data);
			    currentActorId = xmlActor.find('actor').attr('pk');
			
			    BS_GetUserInfo.Read({ Where: "ActorId = " + currentActorId }, function (data) {
			        if ($.trim(data) !== "") {
			            const dataXml = $.xmlDOM(data);
			            $("#txtFullName").val(dataXml.find("row:first > col[name='fullName']").text())
			                .prop('disabled', true);
			            const actorId = dataXml.find("col[name='ActorId']").text();
						$("#txtActorIdCreator").val(actorId).prop('disabled', true);
						$("#txtPresentActorId").val(actorId).prop('disabled', true);

			        }
			
			        const $presentCombo = $("#cmbUserPresent").data("actor-field", "#txtPresentActorId");
			        const $absentCombo = $("#cmbUserAbsent").data("actor-field", "#txtAbsentActorId");
			
					Promise.all([
					    fillComboWithService($("#cmbUserPresent"), BS_GetUserInfo, "انتخاب شخص"),
					    fillComboWithService($("#cmbUserAbsent"), BS_GetUserInfo, "انتخاب غایبین")
					]).then(() => {
					    let actorLookup = {};
					    UserService.GetCurrentActor({}, function (resp) {
					        const actors = Array.isArray(resp) ? resp :
					            Array.isArray(resp.Items) ? resp.Items : [];
					        actors.forEach(a => actorLookup[String(a.Id)] = a.Name);
					
					        Promise.all([
					            loadMeetingData(meetingMinuteId),
					            loadMeetingDetails(meetingMinuteId, actorLookup)
					        ]).then(() => {
					            setComboSelectionFromHidden($("#cmbUserPresent"));
					            setComboSelectionFromHidden($("#cmbUserAbsent"));
					            return loadAttachments(meetingMinuteId);
					        })
					        .finally(() => {
					            hideLoading(); // فقط وقتی فایل‌ها کامل اضافه شدند
					        });
					    });
					});
			    });
			});
        }

        return { init };
    })();

    $form.init();
});
