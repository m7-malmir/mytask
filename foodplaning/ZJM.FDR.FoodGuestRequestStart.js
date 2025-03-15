//#region 
var tblMain = null;

$(function () {
    tblMain = (function () {
        var element = $("#tblFood");
        init();
        function init() {
            bindEvents();
        }

        function bindEvents() {
            $("#btnRegisterGuests").click(function () {
                var firstName = $("#txtFirstName").val().trim();
                var lastName = $("#txtLastName").val().trim();
                
                if (firstName === "" || lastName === "") {
                    alert("لطفاً نام و نام خانوادگی را وارد کنید.");
                    return;
                }

                // شمارش تعداد ردیف‌های داده‌ای برای تنظیم شناسه از 1
                var newId = element.find("tr.row-data").length + 1;

                var rowInfo = {
                    RowNumber: newId, // شماره ردیف
                    Id: newId, // شناسه که از ۱ شروع می‌شود
                    FirstName: firstName,
                    LastName: lastName,
                    ReservationCode: Math.floor(Math.random() * 10000) // کد رزرو تصادفی
                };

                addRow(rowInfo);
            });

            element.on("click", ".delete", function () {
                $(this).closest("tr").remove();
                updateRowNumbers(); // به‌روزرسانی شماره‌ها بعد از حذف
            });
        }

        function addRow(rowInfo) {
            var tempRow = element.find("tr.row-template").clone();
            tempRow.show().removeClass("row-template").addClass("row-data");

            var index = 0;
            tempRow.find("td:eq(" + index++ + ")").text(rowInfo.RowNumber); // شماره ردیف
            tempRow.find("td:eq(" + index++ + ")").text(rowInfo.Id); // شناسه

            var imgDelete = $("<img/>", {
                src: "Images/delete.png",
                title: "حذف",
                class: "delete",
                css: { cursor: "pointer" }
            });

            tempRow.find("td:eq(" + index++ + ")").empty().append(imgDelete); // حذف
            tempRow.find("td:eq(" + index++ + ")").text(rowInfo.FirstName); // نام
            tempRow.find("td:eq(" + index++ + ")").text(rowInfo.LastName); // نام خانوادگی
            tempRow.find("td:eq(" + index++ + ")").text(rowInfo.ReservationCode); // کد رزرو

            element.find("tr.row-template").before(tempRow);
        }

        function updateRowNumbers() {
            element.find("tr.row-data").each(function (index, row) {
                $(row).find("td:eq(0)").text(index + 1); // شماره ردیف
                $(row).find("td:eq(1)").text(index + 1); // شناسه
            });
        }

    })();
});

//#endregion