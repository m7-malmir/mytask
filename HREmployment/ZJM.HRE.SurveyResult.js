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

//#region tblSurveyResult.js
$(function () {
    tblSurveyResult = (function () {
        // ====================== Variables ======================
		const rowNumber = 15;
		//const meetingMinuteManagment = FormManager.readMeetingMinuteManagment;
		let tblSurveyResult = null;
        let element = null;
        let rowPrimaryKeyName = "Id";
        init();
		
        // ======================= Init ==========================
        function init() {
            element = $("#tblSurveyResult");   
            bindEvents();  
            load();    
			element.find("tr.row-template").hide();
    
        }

        // ==================== Bind Events ======================
        function bindEvents() {
           $("#tblSurveyResult").on("change", "input[name=MeetingMinuteId]", function () {
                const $this = $(this);
                $("input[name=MeetingMinuteId]").not(this).prop("checked", false);
                selectedCostId = this.checked ? this.value : null;
            });
        }
		
        // ====================== Add Row ========================
		function addRow(rowInfo) {
		    const element = $("#tblSurveyResult");
		
		    // کلون ردیف الگو
		    const tempRow = element.find("tr.row-template").clone();
		
		    tempRow
		        .show()
		        .removeClass("row-template")
		        .addClass("row-data")
		        .data("rowInfo", rowInfo);
		
		    const tds = tempRow.children("td");
		
		    // انتخاب رادیویی
		    const tbCheckbox = `<input type='radio' id='MeetingMinuteId' name='MeetingMinuteId' class="pointer" value="${rowInfo.Id}">`;
		    tds.eq(0).html(tbCheckbox);
		
		    // پر کردن ستون‌ها
		    tds.eq(1).text(rowInfo.Id);
		    tds.eq(2).text(rowInfo.NationalCode);
		    tds.eq(3).text(rowInfo.FirstName);
		    tds.eq(4).text(rowInfo.LastName);
		    tds.eq(5).text(rowInfo.IdentityNo);
		    tds.eq(6).text(rowInfo.MaritalStatus);
		    tds.eq(7).text(rowInfo.Major);
		
		    // ستون عملیات — آیکن چاپ
		    const imgPrint = $("<img/>", {
		        src: "Images/print.png",
		        title: "چاپ"
		    }).addClass("print").css({ cursor: "pointer" });
		
		    // درج آیکن در آخرین ستون (شماره ۸)
		    tds.eq(8).append(imgPrint);
		    tempRow.attr({ state: "new" });
		
		    // درج ردیف جدید قبل از row-template
		    element.find("tr.row-template").before(tempRow);
		}


        // ======================== Load =========================
		function load(page = 1, pageSize = 10) {
		    const element = $("#tblSurveyResult");
		    try {
		        const testRows = [
		            { Id: 1, NationalCode: "1111111111", FirstName: "علی", LastName: "احمدی", IdentityNo: "22811", MaritalStatus: "مجرد", Major: "مهندسی برق", ProcessStatus: 1, Selectable: true },
		            { Id: 2, NationalCode: "2222222222", FirstName: "مریم", LastName: "کاظمی", IdentityNo: "22812", MaritalStatus: "متاهل", Major: "حقوق", ProcessStatus: 0, Selectable: false },
		            { Id: 3, NationalCode: "3333333333", FirstName: "رضا", LastName: "حسینی", IdentityNo: "22813", MaritalStatus: "مجرد", Major: "پزشکی", ProcessStatus: 1, Selectable: true },
		            { Id: 4, NationalCode: "4444444444", FirstName: "زهرا", LastName: "کریمی", IdentityNo: "22814", MaritalStatus: "متاهل", Major: "معماری", ProcessStatus: 0, Selectable: false },
		            { Id: 5, NationalCode: "5555555555", FirstName: "سارا", LastName: "مرادی", IdentityNo: "22815", MaritalStatus: "مجرد", Major: "طراحی صنعتی", ProcessStatus: 1, Selectable: true },
		            { Id: 6, NationalCode: "6666666666", FirstName: "حامد", LastName: "جعفری", IdentityNo: "22816", MaritalStatus: "مجرد", Major: "مهندسی کامپیوتر", ProcessStatus: 1, Selectable: true },
		            { Id: 7, NationalCode: "7777777777", FirstName: "مهسا", LastName: "قنبری", IdentityNo: "22817", MaritalStatus: "متاهل", Major: "مدیریت", ProcessStatus: 0, Selectable: false },
		            { Id: 8, NationalCode: "8888888888", FirstName: "امین", LastName: "نوری", IdentityNo: "22818", MaritalStatus: "مجرد", Major: "مهندسی عمران", ProcessStatus: 1, Selectable: true },
		            { Id: 9, NationalCode: "9999999999", FirstName: "نگین", LastName: "محب", IdentityNo: "22819", MaritalStatus: "مجرد", Major: "روانشناسی", ProcessStatus: 1, Selectable: true },
		            { Id: 10, NationalCode: "1010101010", FirstName: "محمد", LastName: "رضوی", IdentityNo: "22820", MaritalStatus: "متاهل", Major: "اقتصاد", ProcessStatus: 0, Selectable: false },
		            { Id: 11, NationalCode: "1212121212", FirstName: "الهام", LastName: "شریفی", IdentityNo: "22821", MaritalStatus: "مجرد", Major: "فیزیک", ProcessStatus: 1, Selectable: true },
		            { Id: 12, NationalCode: "1313131313", FirstName: "کیوان", LastName: "نعمتی", IdentityNo: "22822", MaritalStatus: "متاهل", Major: "هنر", ProcessStatus: 0, Selectable: false },
		            { Id: 13, NationalCode: "1414141414", FirstName: "نرگس", LastName: "داوری", IdentityNo: "22823", MaritalStatus: "مجرد", Major: "طبیعت‌گردی", ProcessStatus: 1, Selectable: true },
		            { Id: 14, NationalCode: "1515151515", FirstName: "پیام", LastName: "یوسفی", IdentityNo: "22824", MaritalStatus: "مجرد", Major: "حقوق", ProcessStatus: 1, Selectable: true },
		            { Id: 15, NationalCode: "1616161616", FirstName: "الهه", LastName: "فدایی", IdentityNo: "22825", MaritalStatus: "متاهل", Major: "مهندسی شیمی", ProcessStatus: 0, Selectable: false },
		            { Id: 16, NationalCode: "1717171717", FirstName: "نوید", LastName: "فرهمند", IdentityNo: "22826", MaritalStatus: "مجرد", Major: "نرم‌افزار", ProcessStatus: 1, Selectable: true },
		            { Id: 17, NationalCode: "1818181818", FirstName: "عاطفه", LastName: "موسوی", IdentityNo: "22827", MaritalStatus: "متاهل", Major: "پرستاری", ProcessStatus: 0, Selectable: false },
		            { Id: 18, NationalCode: "1919191919", FirstName: "آرش", LastName: "اکبری", IdentityNo: "22828", MaritalStatus: "مجرد", Major: "الکترونیک", ProcessStatus: 1, Selectable: true },
		            { Id: 19, NationalCode: "2020202020", FirstName: "فرزانه", LastName: "صفوی", IdentityNo: "22829", MaritalStatus: "مجرد", Major: "جامعه‌شناسی", ProcessStatus: 1, Selectable: true },
		            { Id: 20, NationalCode: "2121212121", FirstName: "حمید", LastName: "کریمیان", IdentityNo: "22830", MaritalStatus: "متاهل", Major: "مهندسی نساجی", ProcessStatus: 0, Selectable: false }
		        ];
		
		        const reversedList = testRows.slice().reverse();
		
		        // پاک‌کردن ردیف‌های قبلی
		        element.find("tr.row-data, tr.no-data-row").remove();
		
		        const startIndex = (page - 1) * pageSize;
		        const endIndex = startIndex + pageSize;
		        const currentPageRows = reversedList.slice(startIndex, endIndex);
		
		        if (currentPageRows.length > 0) {
		            $.each(currentPageRows, function (index, row) {
		                addRow(row, startIndex + index + 1);
		            });
		
		            // باید تعداد کل رکوردها را بدهی نه فقط اندازه‌ی صفحه
		            pagination($("#tblSurveyResult"), reversedList.length, pageSize, page);
		            hideLoading();
		
		        } else {
		            addNoDataRow(element);
		            hideLoading();
		        }
		
		        console.log("Rows rendered:", currentPageRows.length);
		    } catch (error) {
		        hideLoading();
		        console.error("Load error:", error);
		        alert("خطایی در بارگذاری داده‌ها رخ داده است.");
		    } finally {
		        hideLoading();
		    }
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
           // readRows: meetingMinuteManagment
        };
    }());
});
//#endregion tblSurveyResult.js