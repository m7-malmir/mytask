$("#btnRegister").on("click", function (e) {
    e.preventDefault();

    const checkRequired = (selector, msg, focusSelect2 = false) => {
        let el = $(selector), val = el.val();
        if (!val || (typeof val === "string" && !val.trim())) {
            alert(msg);
            focusSelect2 ? el.select2('open') : el.focus();
            throw new Error("StopValidation");
        }
    };

    const checkNumberRange = (selector, min, max, msg) => {
        let num = parseInt($(selector).val(), 10);
        if (isNaN(num) || num < min || num > max) {
            alert(msg);
            $(selector).focus();
            throw new Error("StopValidation");
        }
        return num;
    };

    try {
        //  موضوع جلسه و اتاق
        checkRequired("#txtSubjectMeeting", "موضوع جلسه را وارد کنید.");
        checkRequired("#cmbMeetingRoomId", "اتاق جلسه را انتخاب کنید.");

        //  تاریخ جلسه
        let gdate = $("#txtMeetingDate").attr('gdate') || "";
        checkRequired("#txtMeetingDate", "تاریخ جلسه را انتخاب کنید.");
        let todayStr = new Date().toISOString().slice(0, 10);
        let [m, d, y] = gdate.split('/').map(Number);
        let selDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (selDate > todayStr) {
            alert("تاریخ انتخابی جلسه نمی‌تواند بزرگتر از تاریخ روز جاری باشد.");
            $("#txtMeetingDate").focus(); throw new Error("StopValidation");
        }

        //  ساعت و دقیقه شروع
        let sHour = checkNumberRange("#txtMeetingStartTime", 1, 23, "ساعت شروع باید بین 1 تا 23 باشد.");
        let sMin = checkNumberRange("#txtMinMeetingStartTime", 0, 59, "دقیقه شروع باید بین 0 تا 59 باشد.");

        //  ساعت و دقیقه پایان
        let eHour = checkNumberRange("#txtHourMeetingEndTime", 1, 23, "ساعت پایان باید بین 1 تا 23 باشد.");
        let eMin = checkNumberRange("#txtminMeetingEndTime", 0, 59, "دقیقه پایان باید بین 0 تا 59 باشد.");

        //  ترتیب زمان
        if (eHour < sHour || (eHour === sHour && eMin <= sMin)) {
            alert("زمان پایان نمی‌تواند قبل یا مساوی زمان شروع باشد.");
            $("#txtHourMeetingEndTime").focus(); throw new Error("StopValidation");
        }

        //  حاضرین
        checkRequired("#cmbUserPresent", "حداقل یک نفر شرکت‌کننده حاضر انتخاب کنید.", true);

        //  دستور جلسه
        checkRequired("#txtMeetingAgenda", "دستور جلسه را وارد کنید.");

        //  مصوبه ها
        if ($("#pnlTitles").children().length === 0) {
            alert("حداقل یک مصوبه باید وارد شود.");
            throw new Error("StopValidation");
        }
//*************************************************************************************************
        var sp_params = {
			jsonArray: JSON.stringify(jsonArray),
	
		};
			FormManager.retailPersonnelOrder(
			    sp_params,
			    function(data) {
					
					
					if (data["Success"] == 0) {
		               $.alert(
		 	                     "SP Errore: "+data["Message"],
		 	                     "خطا",
		 	                     "rtl"
		 	                 );
		               event.preventDefault();
		               return;
					}
					
			     /*   WorkflowService.RunWorkflow("------",
			            '<Content><Id>' + data["OrderId"] + '</Id><IsInTestMode>' + $form.isInTestMode() + '</IsInTestMode></Content>',
			            true,
			            function(data) {
			                handleRunWorkflowResponse(data);
			            },
			            function(err) {
							 handleError(err, 'WorkflowService.RunWorkflow');
			            }
			        );*/
			    },
			    function(e) {
			        alert(e.details);
			    }
			); 

    } catch (err) {
        if (err.message !== "StopValidation") throw err;
    }
//*************************************************************************************************
});
