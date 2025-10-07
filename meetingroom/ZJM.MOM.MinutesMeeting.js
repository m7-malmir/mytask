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
          //  sortTable(element[0]);
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
			
            // شماره درخواست 
            tds.eq(2).html(`<a href="javascript:showMoadlWithTag(${args})">${rowInfo.MeetingMinuteNo}</a>`);
			
            // تاریخ درخواست
            const [gmSD, gdSD, gySD] = rowInfo.CreatedDate.split('/').map(n => parseInt(n, 10));
            tds.eq(3).text(convertGregorianToJalali(gySD, gmSD, gdSD));
			
            // عنوان
            tds.eq(4).text(rowInfo.SubjectMeeting); 

            // convert to true

            let status, color;
			
            if (rowInfo.ProcessStatus == 1) {
              color = "#FF0000";
              status = "ارسال";
            } 
            // مرحله جاری
            tds.eq(6).addClass("process-column");		
            tds.eq(6).text(rowInfo.ProcessTitle);
			
            // تعداد جزئیات درخواست
            tds.eq(7).text(rowInfo.CostRequestDetailCount);   
			
            // مجموع هزینه	
            tds.eq(8).text(formatNumber(rowInfo.SumRequestCostPrice));
			
            // مجموع هزینه تایید شده
            tds.eq(9).text(formatNumber(rowInfo.SumConfirmCostPrice));
			
            // شماره مدرک فرایند  
            tds.eq(10).text(rowInfo.InnerRegNumber);
			
            // فرآیند	
            if (rowInfo.ProcessStatus == 1) {
                tds.eq(5).html(`<a href="#" class="workflow-link" data-status="${rowInfo.ProcessStatus}" id="${args}">ارسال</a>`);
            } else {
                tds.eq(5).html(`<a href="#" class="workflow-link">گزارش</a>`);
            }
			
            // Add the row before the template
            element.children("tbody").children("tr.row-template").before(tempRow);
			
            // Hide loading spinner
            closeLoading();
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
                    Where: `ActorIdCreator = ${currentActorId}`
                };
            }
            meetingMinuteManagment(
                params,
                function (list) {
                    if (Array.isArray(list) && list.length > 0) {
                        list.forEach(function (row, index) {
							
                            // Delete the "No data recorded" row if it exists
                            element.find("tr.no-data-row").remove();
							
                            // Add row of table
                            addRow(row, index + 1);
                        });

                      // Pagination the table
                        pagination(element,rowNumber);
						
                        // Close loading
                        closeLoading();
                    } else {
                        closeLoading();
                        addNoDataRow(element);
                        console.warn('No data received.');
                    }
                    closeLoading();
                },
                function (error) {
                    closeLoading();
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