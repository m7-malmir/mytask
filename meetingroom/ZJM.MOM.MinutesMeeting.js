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
			
			$('#tblMinutesMeeting').on('click', 'a.workflow-link', function (e) {
			    e.preventDefault();
				showLoading();
			    const requestId = this.id;
			    const contentXml = `<Content>
			        <Id>${requestId}</Id>
			        <IsInTestMode>${isInTestMode()}</IsInTestMode>
			    </Content>`;
			
			    //  SP1: دریافت اطلاعات (FlowReceiver)
			    const flowParams = { MeetingMinuteManagmentId: requestId };
			    FormManager.meetingMinuteManagmentFlowReceiver(
			        flowParams,
			        function (data) {
			            if (data.Success === 0) {
							hideLoading();
			                $.alert("SP Error: " + data.Message, "خطا", "rtl");
			                return;
			            }
			
			            //  بعد از موفقیت FlowReceiver → اجرای SP دوم (DetailAction)
			            const detailParams = { Id: requestId };
			            FormManager.meetingMinuteManagmentDetailAction(
			                detailParams,
			                function (detailData) {
			                    if (detailData.Success === 0) {
									hideLoading();
			                        $.alert("SP Detail Error: " + detailData.Message, "خطا", "rtl");
			                        return;
			                    }
			                    //  بعد از موفقیت هر دو SP، اجرای Workflow
			                    WorkflowService.RunWorkflow(
			                        "ZJM.MOM.MinutesOfMeeting",
			                        contentXml,
			                        true,
			                        function () {
										hideLoading();
			                            tblMinutesMeeting.refresh(); 
										
			                        },
			                        function (err) {
										hideLoading();
			                            handleError(err, "WorkflowService.RunWorkflow");
			                        }
			                    );
			                },
			                function (errDetail) {
								hideLoading();
			                    console.error("Error in DetailAction:", errDetail);
			                    $.alert("خطا در اجرای SP دوم: " + (errDetail.message || errDetail), "", "rtl");
			                }
			            );
			        },
			        function (errFlow) {
						hideLoading();
			            console.error("Error in FlowReceiver:", errFlow);
			            $.alert("خطا در اجرای SP اول: " + (errFlow.message || errFlow), "", "rtl");
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
//#endregion EDN ready.js 

//#region tblMinutesMeeting.js
$(function () {
    tblMinutesMeeting = (function () {
        // ====================== Variables ======================
		const rowNumber = 15;
		const meetingMinuteManagment = FormManager.readMeetingMinuteManagment;
		let tblMinutesMeeting = null;
        let element = null;
        let rowPrimaryKeyName = "Id";
        init();
		
        // ======================= Init ==========================
        function init() {
            element = $("#tblMinutesMeeting");   
            bindEvents();  
            load();    
			element.find("tr.row-template").hide();
    
        }

        // ==================== Bind Events ======================
        function bindEvents() {
           $("#tblMinutesMeeting").on("change", "input[name=MeetingMinuteId]", function () {
                const $this = $(this);
                $("input[name=MeetingMinuteId]").not(this).prop("checked", false);
                selectedCostId = this.checked ? this.value : null;
            });
        }
		
        // ====================== Add Row ========================
        function addRow(rowInfo) {
            // Clone the template row
            var tempRow = element.children("tbody").children("tr.row-template").clone();
			
            // Prepare the row
            tempRow
                .show()
                .removeClass("row-template")
                .addClass("row-data")
                .data("rowInfo", rowInfo);
			
            // Get all <td> elements once
            const tds = tempRow.children("td");
			
            // format number with commas
            const formatNumber = (num) => (num ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			
            // Fill table cells
            let args = `${rowInfo.Id}`;
            let tbCheckbox = '';
            if (rowInfo.ProcessStatus == 1) {
                tbCheckbox = `<input type='radio' id='MeetingMinuteId' name='MeetingMinuteId' class="pointer" value="${rowInfo.Id}">`;
            }

            tds.eq(0).html(tbCheckbox);
			
            // شناسه
            tds.eq(1).text(rowInfo.Id);
			
            // شماره صورتجلسه 
			if (rowInfo.ProcessStatus == 1) {
               tds.eq(2).html(`<a href="javascript:showMoadlWithTag(${args})">${rowInfo.MeetingMinuteNo}</a>`);
            } else { 
				tds.eq(2).html(`<a href="javascript:showReadOnlyWithTag(${args})">${rowInfo.MeetingMinuteNo}</a>`);
            }
			
            // تاریخ جلسه
            const [gmSD, gdSD, gySD] = rowInfo.CreatedDate.split('/').map(n => parseInt(n, 10));
            tds.eq(3).text(convertGregorianToJalali(gySD, gmSD, gdSD));
			
            // موضوع جلسه
            tds.eq(4).text(rowInfo.SubjectMeeting); 
			
            if (rowInfo.ProcessStatus == 1) {
              color = "#FF0000";
              status = "ارسال";
            } 
            // مرحله جاری
			tds.eq(5).text(rowInfo.ProcessStatusTitle);
			
			//شماره مدرک فرآیند
			tds.eq(6).text(rowInfo.InnerRegNumber);
			
            // فرآیند	
            if (rowInfo.ProcessStatus == 1) {
                tds.eq(7).html(`<a href="#" class="workflow-link" data-status="${rowInfo.ProcessStatus}" id="${args}">ارسال</a>`);
            } else {
				//to do
                tds.eq(7).html(`<span  class="workflow-link">ارسال شده</span>`);
            }
			
            // Add the row before the template
            element.children("tbody").children("tr.row-template").before(tempRow);
			
        }

        // ======================== Load =========================
        function load() {
			if (!currentActorId){
                return;
            } 
			
            let params; // filters with query params			
            if ($("#txtSearchValue").val() != "") {
                let $selectedSearchField = $("#cmbSearchField option:selected");
                let type = $selectedSearchField.data("type"); 
                let searchField = $selectedSearchField.val();
                let searchValue = $("#txtSearchValue").val();
							
                switch (type) {
                    case "string":
                        params = {
                            Where: `ActorIdCreator = ${currentActorId} AND ${searchField} LIKE N'%${searchValue}%'`
                        };
                        break;
                    case "number":
                    case "int":
                    default:
                        params = {
                            Where: `ActorIdCreator = ${currentActorId} AND ${searchField} LIKE N'%${searchValue}%'`
                        };
                        break;
                }
            } else {
                 params = {
				    Where: `ActorIdCreator = ${currentActorId} AND ProcessStatus != '20'`
				};

            }
            meetingMinuteManagment(
                params,
                function (list) {
					list = list.reverse();
                    if (Array.isArray(list) && list.length > 0) {
                        list.forEach(function (row, index) {
							
                            // Delete the "No data recorded" row if it exists
                            element.find("tr.no-data-row").remove();
							
                            // Add row of table
                            addRow(row, index + 1);
                        });

                        // Pagination the table
						pagination(element, rowNumber);

                        // Close loading
                        hideLoading();
                    } else {
                        hideLoading();
                        addNoDataRow(element);
                        console.warn('No data received.');
                    }
                    hideLoading();
                },
                function (error) {
                    hideLoading();
                    alert(error || "خطایی رخ داده است");
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
//#endregion EDN tblMinutesMeeting.js 

//#region FormManager.js
const FormManager = (() => {

    // ===================== parseMeetingMinuteManagment ===================
    function parseMeetingMinuteManagment(data) {
        const list = [];
        const xml = $.xmlDOM(data);

        xml.find("row").each(function () {
            const $row = $(this);
            const get = name => $row.find(`col[name='${name}']`).text();

            list.push({
                Id:                 get("Id"),
                MeetingMinuteNo:    get("MeetingMinuteNo"),
                ActorIdCreator:     get("ActorIdCreator"),
                CreatedDate:        get("CreatedDate"),
                MeetingStartDate:   get("MeetingStartDate"),
                MeetingStartTime:   get("MeetingStartTime"),
                MeetingEndTime:     get("MeetingEndTime"),
                ProcessStatus:      get("ProcessStatus"),
				ProcessStatusTitle: get("ProcessStatusTitle"),
				RejectStatus:       get("RejectStatus"),
                InnerRegNumber:     get("InnerRegNumber"),
                SubjectMeeting:     get("SubjectMeeting")
            });
        });

        return list;
    }

    // ======================= handleXmlResponse ======================
    function handleXmlResponse(data, onSuccess) {
        const xml = $.trim(data) ? $.xmlDOM(data) : null;
        if ($.isFunction(onSuccess)) {
            onSuccess(xml);
        }
    }

    // ========================== handleError =========================
    function handleError(methodName, error, onError) {
        const message = `خطایی در سیستم رخ داده است. (Method: ${methodName})`;

        console.error("Error:", message);
        console.error("Details:", error);

        if ($.isFunction(onError)) {
            onError({ message, details: error });
        } else {
            console.error(`${message} (no onError callback provided):`, error);
        }
    }

    // ======================= Public methods =========================
    return {
        // ====================== readMeetingMinuteManagment ======================
        readMeetingMinuteManagment(jsonParams, onSuccess, onError) {
            BS_vw_MM_MeetingMinuteManagment.Read(
                jsonParams,
                data => {
                    const list = parseMeetingMinuteManagment(data);
                    if ($.isFunction(onSuccess)) onSuccess(list);
                },
                error => handleError("readMeetingMinuteManagment", error, onError)
            );
        },

        // ====================== deleteMeetingMinuteManagment ======================
		//حذف کلی صورتجلسه
        deleteMeetingMinuteManagment(jsonParams, onSuccess, onError) {
            SP_MM_MeetingMinuteManagmentDelete.Execute(
                jsonParams,
                data => {
                    // پارس خروجی XML به آبجکت
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, "text/xml");

                    const cols = xmlDoc.getElementsByTagName("col");
                    const result = {};

                    for (let i = 0; i < cols.length; i++) {
                        const name = cols[i].getAttribute("name");
                        const value = cols[i].textContent;
                        result[name] = value;
                    }

                    if ($.isFunction(onSuccess)) {
                        onSuccess(result);
                    }
                },
                error => handleError("deleteMeetingMinuteManagment", error, onError)
            );
        },
		//============================================================================
		// اجرای ران وورکفلو و ارسال برای گیرنده ها
		 meetingMinuteManagmentFlowReceiver(jsonParams, onSuccess, onError) {
            SP_MM_MeetingMinuteManagmentFlowReceiver.Execute(
                jsonParams,
                data => {
                    // پارس خروجی XML به آبجکت
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, "text/xml");

                    const cols = xmlDoc.getElementsByTagName("col");
                    const result = {};

                    for (let i = 0; i < cols.length; i++) {
                        const name = cols[i].getAttribute("name");
                        const value = cols[i].textContent;
                        result[name] = value;
                    }

                    if ($.isFunction(onSuccess)) {
                        onSuccess(result);
                    }
                },
                error => handleError("meetingMinuteManagmentFlowReceiver", error, onError)
            );
        },
		//============================================================================
		// ارسال برای حاضرین و غایبین متنخب رد صورتجلسه
		 meetingMinuteManagmentDetailAction(jsonParams, onSuccess, onError) {
            SP_MM_MeetingMinuteManagmentDetailAction.Execute(
                jsonParams,
                data => {
                    // پارس خروجی XML به آبجکت
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, "text/xml");

                    const cols = xmlDoc.getElementsByTagName("col");
                    const result = {};

                    for (let i = 0; i < cols.length; i++) {
                        const name = cols[i].getAttribute("name");
                        const value = cols[i].textContent;
                        result[name] = value;
                    }

                    if ($.isFunction(onSuccess)) {
                        onSuccess(result);
                    }
                },
                error => handleError("MeetingMinuteManagmentDetailAction", error, onError)
            );
        },
    };
})();


//#endregion EDN FormManager.js 

//#region utility.js
function pagination(element, rowNumber) {
    const rowsPerPage = rowNumber;
    const $table = element;
    const $rows = $table.find("tbody tr.row-data");
    const totalRows = $rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    let currentPage = 1;

    let $rowPagination = $("#tscTablePagination");
    let $pagination = $("#pagination");
    let $label = $("#lblPagination");

    // ساخت نوار اصلی صفحه‌بندی
    if ($rowPagination.length === 0) {
        $rowPagination = $(`
            <div id="tscTablePagination"
                 style="position:absolute;width:1220px;height:25px;
                 background-image:url(/Cache/Images/ZJM.MOM.MinutesMeeting/tscTablePagination.png);
                 background-repeat:repeat-x;background-position:left top;
                 font-family:Tahoma;font-size:8pt;direction:rtl;color:#fff !important;overflow:hidden;">
            </div>`);
        $("body").append($rowPagination);
    }

    // ساخت چینش داخلی
    if ($pagination.length === 0) {
        $pagination = $(`
            <div id="pagination"
                 style="display:flex;justify-content:center;align-items:center;
                 height:22px;margin:auto;color:#fff !important;direction:rtl;">
            </div>`);
        $rowPagination.append($pagination);
    }

    const $target = $label.length ? $label : $pagination;
    $target.empty();

    if (totalPages <= 1) {
        $rowPagination.hide();
        return;
    }
    $rowPagination.show();

    // ================== نمایش صفحات ==================
    function showPage(page) {
        currentPage = page;
        $rows.hide();
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        $rows.slice(start, end).show();
        renderButtons();
    }

    // ================== رندر دکمه‌ها ==================
    function renderButtons() {
        $target.empty();

        // تعیین جهت محیط بصری (داخل همیشه LTR برای جلوگیری از وارونگی دوباره)
        $target.css({
            "direction": "ltr",
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "center",
            "align-items": "center"
        });

        // استخراج جهت خارجی RTL یا LTR از کل صفحه
        const isRTL = $("body").css("direction") === "rtl";

        const iconPrev = `<i class="fas fa-chevron-double-left" style="color:#fff !important;font-family:'Font Awesome 5 Pro'!important;"></i>`;
        const iconNext = `<i class="fas fa-chevron-double-right" style="color:#fff !important;font-family:'Font Awesome 5 Pro'!important;"></i>`;
        const prevClass = currentPage === 1 ? "disabled" : "";
        const nextClass = currentPage === totalPages ? "disabled" : "";

        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);

        function addPageButton(i) {
            const activeClass = currentPage === i ? "active" : "";
            $target.append(`<a href="#" data-page="${i}" class="${activeClass}" style="margin:0 6px;color:#fff !important;">${i}</a>`);
        }
        function addDots() {
            $target.append(`<span style="margin:0 6px;color:#fff;">...</span>`);
        }

        // ===================== حالت RTL =====================
        if (isRTL) {
            // ترتیب عددی وارونه (۵ … ۳ ۲ ۱)
            $target.append(`<a href="#" class="next ${nextClass}" style="margin:0 8px;color:#fff !important;">${iconNext}</a>`);
            if (endPage < totalPages - 1) { addPageButton(totalPages); addDots(); }
            for (let i = endPage; i >= startPage; i--) addPageButton(i);
            if (startPage > 2) { addDots(); addPageButton(1); }
            $target.append(`<a href="#" class="prev ${prevClass}" style="margin:0 8px;color:#fff !important;">${iconPrev}</a>`);
        }

        // ===================== حالت LTR =====================
        else {
            // ترتیب عادی (1 2 … 5)
            $target.append(`<a href="#" class="prev ${prevClass}" style="margin:0 8px;color:#fff !important;">${iconPrev}</a>`);
            if (startPage > 2) { addPageButton(1); addDots(); }
            for (let i = startPage; i <= endPage; i++) addPageButton(i);
            if (endPage < totalPages - 1) { addDots(); addPageButton(totalPages); }
            $target.append(`<a href="#" class="next ${nextClass}" style="margin:0 8px;color:#fff !important;">${iconNext}</a>`);
        }
    }

    // ================== رویداد کلیک ==================
    $target.off("click").on("click", "a", function (e) {
        e.preventDefault();
        const $btn = $(this);
        if ($btn.hasClass("prev") && currentPage > 1) showPage(currentPage - 1);
        else if ($btn.hasClass("next") && currentPage < totalPages) showPage(currentPage + 1);
        else if ($btn.data("page")) showPage(parseInt($btn.data("page")));
    });

    showPage(1);
}



// ========================= addNoDataRow ===========================
function addNoDataRow($table) {
    const $headerRow = $table.find("tr.row-header").first();
    if ($headerRow.length && !$table.find("tr.no-data-row").length) {
        const colCount = $headerRow.children("th, td").length;
        const newRow = $(`<tr class='no-data-row' style='height:3rem;display:table-row;'>
            <td colspan='${colCount}' style='text-align:center;width:100px;border:solid 1px #BED4DC;font-size:1.2rem;'>داده‌ای ثبت نشده است</td>
        </tr>`);
        $headerRow.after(newRow);
    }
}

// ======================= showMoadlWithTag =========================
function showMoadlWithTag(meetingMinuteId) {
    $.showModalForm({
        registerKey: "ZJM.MOM.MinutesMeetingRegulate",
        params: { MeetingMinuteId: meetingMinuteId }
    }, function(retVal) {
        tblMinutesMeeting.refresh();
    });
}

// ======================= showReadOnlyWithTag ======================
function showReadOnlyWithTag(meetingMinuteId) {
    $.showModalForm({
        registerKey: "ZJM.MOM.MinutesMeetingReadOnly",
        params: { MeetingMinuteId: meetingMinuteId }
    }, function(retVal) {
        tblMinutesMeeting.refresh();
    });
}

// ========================== styleDialog ===========================
const styleDialog = (background, border, color) => {
    setTimeout(() => {
        $(".ui-dialog-titlebar").css({ background, border, color });
    }, 0);
};
// ********************************************************************

//#endregion EDN utility.js 

//#region commom.js
// ======================== changeDialogTitle ========================
function changeDialogTitle (title, onSuccess, onError) {
    try {
        var $titleSpan = window.parent
            .$(window.frameElement)         // this iframe
            .closest('.ui-dialog')          // find the dialog box
            .find('.ui-dialog-title');      // find the title span

        // Check if the title span exists
        if ($titleSpan.length > 0) {

            $titleSpan.text(title);

            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } else {
            if (typeof onError === 'function') {
                onError('Dialog title not found');
            } else {
                console.warn('Dialog title not found');
            }
        }
    } catch (e) {
        if (typeof onError === 'function') {
            onError(e);
        } else {
            console.error("Cannot reach parent document", e);
        }
    }
}

// ==================== convertGregorianToJalali =====================
function convertGregorianToJalali(gy, gm, gd) {
    let g_d_m, jy, jm, jd, gy2, days;
    g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    gy2 = (gm > 2) ? (gy + 1) : gy;
    days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    jy = -1595 + (33 * ~~(days / 12053));
    days %= 12053;
    jy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += ~~((days - 1) / 365);
        days = (days - 1) % 365;
    }
    if (days < 186) {
        jm = 1 + ~~(days / 31);
        jd = 1 + (days % 31);
    } else {
        jm = 7 + ~~((days - 186) / 30);
        jd = 1 + ((days - 186) % 30);
    }

    const pad = n => n < 10 ? '0' + n : n;

    return `${jy}/${pad(jm)}/${pad(jd)}`;
}

// ==================== convertJalaliToGregorian =====================
function convertJalaliToGregorian(jy, jm, jd) {
    let sal_a, gy, gm, gd, days;
    jy += 1595;
    days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy = 400 * ~~(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * ~~(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += ~~((days - 1) / 365);
        days = (days - 1) % 365;
    }
    gd = days + 1;
    sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return [gy,gm,gd];
}
// ========================= showLoading ============================
function showLoading() {
  let $box = $("#loadingBoxTweaked");
  if (!$box.length) {
    $box = $(`
            <div id="loadingBoxTweaked"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.80);display:flex;align-items:center;justify-content:center;z-index:999999;">
                <div class="spinner"></div>
            </div>
        `);

    // spinner css فقط یکبار اضافه شود
    if (!$("#loadingSpinnerStyle").length) {
      $('<style id="loadingSpinnerStyle">')
        .html(
          `
                .spinner {
                    border: 7px solid #eee;
                    border-top: 7px solid #1976d2;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
                `
        )
        .appendTo("head");
    }
    $("body").append($box);
  } else {
    $box.show();
  }
}
// ========================= closeLoading ============================
function hideLoading() {
  $("#loadingBoxTweaked").fadeOut(180, function () {
    $(this).remove();
  });
}

//#endregion EDN commom.js 

//#region momMinutesMeeting_Add.js
$("#momMinutesMeeting_Add").click(function(){
    $.showModalForm(
		{
            registerKey: "ZJM.MOM.MinutesMeetingRegulate",
            params: {}
        },
        function (retVal) {
        	tblMinutesMeeting.refresh();
        }
    );
});
//#endregion EDN momMinutesMeeting_Add.js 

//#region momMinutesMeeting_Delete.js
$("#momMinutesMeeting_Delete").click(function () {

    if ($("input[name='MeetingMinuteId']:checked").length == 0) {
        $.alert('جهت حذف می بایست ردیف مورد نظر خود را انتخاب کنید.', "توجه", "rtl");
        styleDialog(
            "#dbd155 url('/Cache/Images/ZJM.RPC.Cost/pcbUIWaveYellow.png') 50% 50% repeat-x",
            "1px solid #dbd155",
            "black"
        );
        return;
    }

    const minutesMeetingId = $("#MeetingMinuteId:checked").val();

    $.confirm("آیا نسبت به حذف این صورتجلسه مطمئن هستید؟", "حذف اطلاعات", "rtl", function (res) {
        if (res !== "OK") return;

				 const params = { Id : minutesMeetingId };
				 FormManager.deleteMeetingMinuteManagment(params, function (data) {
			        if (data.Success == 0) {
			            $.alert("SP Error: " + data.Message, "خطا", "rtl");
			            return;
			        }
			        tblMinutesMeeting.refresh();
			    }, function (err) {
			        alert(err.details);
			    });
        styleDialog(
            "#d35c64 url('/Cache/Images/ZJM.RPC.Cost/pcbUIWaveRed.png') 50% 50% repeat-x",
            "1px solid #d35c64",
            "white"
        );
    });
});
//#endregion EDN momMinutesMeeting_Delete.js 