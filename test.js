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
		    const $descCell = tds.eq(9); // ستون توضیحات (اختیاری برای نمایش پیام تایید)
		
		    $descCell.empty(); // پاک‌کردن محتوای قبلی توضیحات
		
		    // فقط اگر مقدار تایید انتخاب شده
		    if (val === "1") {
		        // ساخت پارامتر برای آپدیت SP
		        const list = {
		            IsAccepted: 1,
		            Where: "Id = '" + detailActionId + "'"
		        };
		
		        // اجرای مستقیم درخواست
		        FormManager.updateMeetingMinuteManagmentDetailAction(
		            list,
		            function () {
		                //موفقیت امیز بود
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
			                                //
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
			//============================
			
				
			//============================
			// پاپ آپ توضیحات طولانی
			//============================
			// رویداد کلیک روی سلول عنوان
			$("#tblMinuteManagment").on("click", ".minute-text-cell", function () {
			    const fullText = String(this.dataset.fulltext || "-").trim();
			
			    // ساختار پاپ‌آپ مشابه رد مصوبه
			    const fullTextPopup = $(`
			        <div style="direction:rtl;text-align:right;" class="ui-form">
			            <label style="font-size:9pt;font-weight:600;"></label><br>
			        </div>
			    `);
			    const textArea = $("<textarea>")
			        .addClass("form-control")
			        .prop("readonly", true) // ← فقط خواندنی
			        .css({
			            height: "180px",
			            fontSize: "9pt",
			            resize: "none",
			            width: "98%",
			            backgroundColor: "#f9f9f9", // رنگ ملایم برای حالت غیرفعال
			            cursor: "default"
			        })
			        .val(fullText);
			
			    fullTextPopup.append(textArea);
			
			    fullTextPopup.dialog({
			        modal: true,
			        title: " متن کامل صورتجلسه",
			        width: 540,
			        buttons: [
			            {
			                text: "بستن",
			                click: function () {
			                    $(this).dialog("close");
			                }
			            }
			        ]
			    });
			});
			//============================
	
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
			const fullText = String(rowInfo.Title || "-").trim();
			const shortText = truncateText(fullText, 15);
			
			// شمارش تعداد کلمات
			const wordCount = fullText.split(/\s+/).filter(w => w).length;
			
			// گرفتن خود عنصر td واقعی
			const tdEl = tds.eq(4)[0];
			tdEl.textContent = shortText;
			tdEl.dataset.fulltext = fullText;
			
			// فقط اگر متن طولانی‌تر از ۱۵ کلمه بود، کلاس کلیک‌پذیر اضافه می‌شود
			if (wordCount > 15) {
			    tdEl.classList.add("minute-text-cell");
			}
		
			// اقدام کننده ها (مسئول ها)
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
































