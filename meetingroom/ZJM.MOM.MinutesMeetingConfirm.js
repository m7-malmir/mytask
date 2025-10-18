//#region Ready.js
// ===================== Public variables =====================
var $form;
var currentActorId;
var isInTestMode = false;
var primaryKeyName;
var pk;
var actorLookup = {};
var MeetingMinutesData = {
    Items: []
};

$(function(){
    $form = (function(){
        var pk, inEditMode = false;
		// ==================== init ============================
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
		// ==================== build ============================
	    function build() {
	      //Set the new dialog title
	      changeDialogTitle("بررسی مصوبات وتایید اعضا جلسه");
	    }
        function bindEvents(){

        }
		// ==================== createControls ====================
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


//#endregion EDN Ready.js 


//#region formmanager.js
var FormManager = {
	
//******************************************************************************************************
	readMeetingMinuteManagment: function(jsonParams, onSuccess, onError)
	{
	  BS_vw_MM_MeetingMinuteManagment.Read(jsonParams
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
		                MeetingMinuteNo: $(this).find("col[name='MeetingMinuteNo']").text(),
						fullName: $(this).find("col[name='fullName']").text(),
						CreatedDate: $(this).find("col[name='CreatedDate']").text(),
						MeetingStartTime: $(this).find("col[name='MeetingStartTime']").text(),
						MeetingStartTime: $(this).find("col[name='MeetingStartTime']").text(),
					    MeetingEndTime: $(this).find("col[name='MeetingEndTime']").text(),
					    SubjectMeeting: $(this).find("col[name='SubjectMeeting']").text(),
					    MeetingAgenda: $(this).find("col[name='MeetingAgenda']").text(),
					    Title: $(this).find("col[name='Title']").text(),
						UserPresent: $(this).find("col[name='UserPresent']").text(),
						UserAbsent: $(this).find("col[name='UserAbsent']").text()
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
//******************************************************************************************************
	readMeetingMinuteManagmentDetailAction: function(jsonParams, onSuccess, onError)
	{
	  BS_vw_MM_MeetingMinuteManagmentDetailAction.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						DetailActionId: $(this).find("col[name='DetailActionId']").text(),
		                MeetingMinuteDetailId: $(this).find("col[name='MeetingMinuteDetailId']").text(),
						ActorId: $(this).find("col[name='ActorId']").text(),
		                IsAccepted: $(this).find("col[name='IsAccepted']").text(),
						MeetingManagmentId: $(this).find("col[name='MeetingManagmentId']").text(),
						Title: $(this).find("col[name='Title']").text(),
						CreateDate: $(this).find("col[name='CreateDate']").text(),
						IsLock: $(this).find("col[name='IsLock']").text(),
						ActionDeadLineDate: $(this).find("col[name='ActionDeadLineDate']").text(),
						ResponsibleForAction: $(this).find("col[name='ResponsibleForAction']").text()
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
//******************************************************************************************************
	readAttachedFile: function(jsonParams, onSuccess, onError)
	{
	   BS_Office_AttachedFile.Read(jsonParams
	       , function(data)
	       {
	           var list = [];
	           var xmlvar = $.xmlDOM(data);
	           xmlvar.find("row").each(
	               function()
	               { 
	                  list.push
	                  ({
						  
			                FileId:          $(this).find("col[name='FileId']").text(),
							DocumentId:      $(this).find("col[name='DocumentId']").text(),
							FileSubject:     $(this).find("col[name='FileSubject']").text(),
							FileName:        $(this).find("col[name='FileName']").text(),
							FileType:        $(this).find("col[name='FileType']").text(),
							FileContent:     $(this).find("col[name='FileContent']").text(),
							SystemId:        $(this).find("col[name='SystemId']").text(),
							ProccessStatus:  $(this).find("col[name='ProccessStatus']").text(),
							Description:     $(this).find("col[name='Description']").text(),
							CreatedDate:     $(this).find("col[name='CreatedDate']").text(),
							CreatorUserId:   $(this).find("col[name='CreatorUserId']").text(),

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
//******************************************************************************************************
	updateMeetingMinuteManagmentDetailAction: function(jsonParams, onSuccess, onError)
	{
		 BS_MeetingMinuteManagmentDetailAction.Update(jsonParams
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
			}, 
		function(error) {
				var methodName = "deleteEntity";

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

};



//#endregion EDN formmanager.js 


//#region  tblMinuteManagment.js
$(function () {
    tblMinutesMeeting = (function () {
        // ====================== Variables ======================
		const rowNumber = 15;
		const meetingMinuteManagment = FormManager.readMeetingMinuteManagmentDetailAction;
		let tblMinutesMeeting = null;
        let element = null;
        let rowPrimaryKeyName = "Id";
        init();
		
        // ======================= Init ==========================
        function init() {
            element = $("#tblMinutesMeeting");   
            bindEvents();  
            load();        
            //sortTable(element[0]);
        }
		
        // ==================== Bind Events ======================
		function bindEvents() {
			
			//============================
			// show modal
			//============================
			$("#tblMinuteManagment").on("click", ".comment-icon", function () {
                const $row = $(this).closest("tr");
                const recordId = $row.find("td").eq(2).text().trim();
        		console.log(recordId);
				
                $.showModalForm({
                    registerKey: "ZJM.MOM.MinutesMeetingHistoryDetails",
                    params: { Id: recordId }
                }, function (retVal) {
                    tblMinuteManagment.refresh();
                });
            });
			//============================
			

			//============================
			// // حالت تأیید
			//============================
		$("#tblMinuteManagment").on("change", ".confirm-select", function () {
		    const $select = $(this);
		    const val = $select.val();
		    const $row = $select.closest("tr");
		    const tds = $row.find("td");
		    const detailActionId = tds.eq(1).text().trim(); // ستون دوم = DetailActionId
		
		    $descCell.empty(); // پاک کردن محتوای قبلی توضیحات
		    // فقط اگر مقدار تایید انتخاب شده
		    if (val === "1") {
		        // ساخت پارامتر برای آپدیت SP
		        const list = {
					Description: "تایید",
		            IsAccepted: 1,
		            Where: "Id = '" + detailActionId + "'"
		        };
		
		        // اجرای مستقیم درخواست
		        FormManager.updateMeetingMinuteManagmentDetailAction(
		            list,
		            function () {
		                $.alert("تأیید با موفقیت ثبت شد!", "", "rtl");
		            },
		            function (err) {
		                // خطا
		                console.error("خطا در تایید:", err);
		                $descCell.text(" خطا در ثبت تایید");
		                $.alert("خطا در ثبت تایید: " + (err.message || "خطای ناشناخته"), "", "rtl");
		            }
		        );
		    } else if (val === "0") {
			//============================
			// // حالت رد
			//============================
			        const hameshPopup = $(`
			            <div style="direction:rtl;text-align:right;" class="ui-form">
			                <label style="font-size:9pt;">لطفاً دلیل مخالفت خود را بنویسید:</label><br>
			            </div>
			        `);
			
			        const commentInput = $("<textarea>")
			            .addClass("comment-input form-control")
			            .css({ height: "70px", fontSize: "9pt", resize: "none", width: "95%" });
			
			        hameshPopup.append(commentInput);
			
			        hameshPopup.dialog({
			            modal: true,
			            title: "دلیل رد مصوبه",
			            width: 420,
			            buttons: [
			                {
			                    text: "ثبت",
			                    click: function () {
			                        const reason = commentInput.val().trim();
			                        if (!reason) {
			                            $(this).notify("لطفاً دلیل رد را وارد نمایید", { position: "top" });
			                            return;
			                        }
			
			                        showLoading();
			                        const reasonLabel = $('<label class="reject-reason-label"/>')
			                            .text(reason)
			                            .css({
			                                fontSize: "inherit",
			                                color: "#c00",
			                                fontWeight: "600",
			                                display: "inline-block",
			                                padding: "2px 6px"
			                            });
			
			                        $descCell.empty().append(reasonLabel);
			
			                        let list = { Description: reason, IsAccepted: 0 };
			                        list = $.extend(list, { Where: "Id = '" + detailActionId + "'" });
			
			                        FormManager.updateMeetingMinuteManagmentDetailAction(
			                            list,
			                            function () {
			                                hideLoading();
			                                $.alert("دلیل رد ثبت شد", "", "rtl");
			                            },
			                            function (error) {
			                                hideLoading();
			                                console.error("خطا در رد:", error);
			                                $.alert("خطا در ثبت دلیل رد: " + (error.message || "خطای ناشناخته"), "", "rtl");
			                            }
			                        );
			
			                        $(this).dialog("close");
			                    }
			                },
			                {
			                    text: "انصراف",
			                    click: function () {
			                        $(this).dialog("close");
			                        $select.val("").trigger("change");
			                    }
			                }
			            ]
			        });
			
			    } else {
			        // حالت نامشخص
			        $descCell.empty();
			    }
			});	
		}
	
        // ====================== Add Row ========================

		  function addRow(rowInfo, rowIndex) {
		    const tempRow = $("#tblMinuteManagment").find("tr.row-template").first().clone();
		    tempRow.removeClass("row-template").addClass("row-data").show();
		    const tds = tempRow.find("td");
		
		    //  شماره ردیف
		    tds.eq(0).text(rowIndex).attr("align", "center");
		
		    //  شناسه اکشن (DetailActionId)
		    tds.eq(1).text(rowInfo.DetailActionId || "");
		
		    //  شناسه مصوبه (MeetingMinuteDetailId)
		    tds.eq(2).text(rowInfo.MeetingMinuteDetailId || "");
		
		    //  شناسه جلسه (MeetingManagmentId)
		    tds.eq(3).text(rowInfo.MeetingManagmentId || "");
		
		    //  متن صورتجلسه (Title)
		    tds.eq(4).text(rowInfo.Title || "-");
		
			// اقدام‌کننده‌ها (مسئول‌ها)
			tds.eq(5).text(rowInfo.ResponsibleForActionName || "-");

		
		    //  تاریخ اقدام
		    if (rowInfo.ActionDeadLineDate) {
		        tds.eq(6).text(formatMiladiToShamsi(rowInfo.ActionDeadLineDate));
		    } else {
		        tds.eq(6).text("-");
		    }
		
		    //  ستون نظرات (Comments)
		    const infoIcon = $('<i class="fa fa-info-circle comment-icon" style="cursor:pointer;"></i>')
		        .attr("data-id", rowInfo.DetailActionId || "");
		    tds.eq(7).empty().append(infoIcon);
		
		    //  سلکتور تأیید / رد (Confirm)
			const confirmSelect = $('<select class="confirm-select"/>')
			    .append('<option value="">نامشخص</option>')
			    .append('<option value="1">تأیید</option>')
			    .append('<option value="0">رد</option>')
			    .css({ fontSize: "inherit", height: "auto", padding: "2px 4px" });
			
			// مقدار از دیتابیس
			let isAccepted = rowInfo.IsAccepted;
			
			// اصلاح مقدار برای حالت‌های مختلف
			if (isAccepted === true || isAccepted === "true" || isAccepted === 1 || isAccepted === "1") {
			    isAccepted = "1";            // تأیید
			} else if (isAccepted === false || isAccepted === "false" || isAccepted === 0 || isAccepted === "0") {
			    isAccepted = "0";            // رد
			} else {
			    isAccepted = "";             // نامشخص/null
			}
			
			// مقدار را روی سلکتور ست کن بدون trigger change
			confirmSelect.val(isAccepted);
			
			// اضافه به ستون ۸ (Confirm)
			tds.eq(8).empty().append(confirmSelect);
		
		
		    //  ستون توضیحات (Description) ← باید اینجا input / label بیفته بعداً
		    tds.eq(9).empty().text(rowInfo.DetailActionDescription || "");
		
		    // درج در جدول قبل از ردیف الگو
		    $("#tblMinuteManagment tbody tr.row-template").before(tempRow);
		}


        // ======================== Load =========================

		function load() {
		    const pk = $form.getPK();
		
		    //  کنترل ایمن مقداردهی ها
		    if (!pk || !currentActorId) {
		        return;
		    }
		
		    //  پارامترهای امن برای SP
		    let params = {
		        Where: `MeetingManagmentId = '${pk}' AND ActorId = '${currentActorId}'`
		    };
		
		    //  گرفتن داده از متد اصلی
		    meetingMinuteManagment(
		        params,
		        function (list) {
		            try {
		                // بررسی صحت لیست
		                if (Array.isArray(list) && list.length > 0) {
		                    const $tbl = $("#tblMinuteManagment");
		                    $tbl.find("tr.no-data-row").remove();
		                    
		                    list.forEach((row, index) => addRow(row, index + 1));
		
		                    // شماره گذاری و صفحه بندی
		                    pagination($tbl, rowNumber);
		                } else {
		                    // هیچ داده ای نیست
		                    addNoDataRow($("#tblMinuteManagment"));
		                    console.warn("No data received for MeetingMinuteManagment.");
		                }
		            } catch (err) {
		                console.error("Error while processing list:", err);
		                $.alert("خطایی در پردازش داده‌ها رخ داده است!", "", "rtl");
		            }
		        },
		        function (error) {
		            console.error("meetingMinuteManagment error:", error);
		            $.alert(error || "خطا در دریافت اطلاعات از سامانه!", "", "rtl");
		        }
		    );
		}
		
        // ====================== Refresh ========================
        function refresh() {
            // Remove all rows with class 'row-data' directly
            element.find("tr.row-data").remove();
			
            // Load data again
            load();
        }

        // ======================= Return ========================
        return {
            refresh: refresh,
            load: load,
            readRows: meetingMinuteManagment
        };
    }());
});
//#endregion tblMinuteManagment.js



