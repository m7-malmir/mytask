//*******************************************************************************************************
//خواندن اطلاعات مصوبات و نمایش در جدول
function loadMeetingDetails(meetingMinuteId) {
    return new Promise((resolve) => {
        console.log("=== loadMeetingDetails START === meetingMinuteId =", meetingMinuteId);

        if (!meetingMinuteId) {
            console.warn(" loadMeetingDetails: meetingMinuteId empty → no data");
            return resolve();
        }

        const readParamsDetail = { WHERE: "MeetingManagmentId = '" + meetingMinuteId + "'" };

        FormManager.readMeetingMinuteManagmentDetail(
            readParamsDetail,
            function (detailList) {
                console.log(" detailList returned:", detailList);

                $("#tblMinuteManagment tbody tr.data-row").remove();
                MeetingMinutesData.Items.length = 0;

                if (Array.isArray(detailList) && detailList.length) {
                    const updatePromises = [];

                    detailList.forEach((srvItem) => {
                        const responsibleIds = String(srvItem.ResponsibleForAction || "")
                            .split(",")
                            .map((id) => id.trim())
                            .filter(Boolean);

                        const cleanItem = {
                            Id: srvItem.Id,
                            Title: srvItem.Title || "-",
                            ActionDeadLineDate: srvItem.ActionDeadLineDate || "",
                            DisplayDate: safeShamsiDate(srvItem.ActionDeadLineDate || ""),
                            ResponsibleForAction: responsibleIds.join(","),
                            ResponsibleForActionName: "-"
                        };

                        MeetingMinutesData.Items.push(cleanItem);
                        addRowToTable(cleanItem);

                        const p = getNameForIds(responsibleIds).then((namesArray) => {
                            const joinedNames = namesArray.filter((n) => !!n && n !== "-").join(", ") || "-";

                            // به‌روزرسانی مدل داده
                            const idxItem = MeetingMinutesData.Items.findIndex((it) => it.Id === cleanItem.Id);
                            if (idxItem >= 0) {
                                MeetingMinutesData.Items[idxItem].ResponsibleForActionName = joinedNames;
                            }

                            // به‌روزرسانی جدول
                            const $row = $("#tblMinuteManagment tbody tr.data-row[data-rowid='" + cleanItem.Id + "']");
                            if ($row.length) {
                                $row.find("td").eq(3).text(joinedNames);
                                $row.find("td").eq(5)
                                    .text(joinedNames)
                                    .attr("data-ids", cleanItem.ResponsibleForAction);
                            }
                        });

                        updatePromises.push(p);
                    });

                    Promise.all(updatePromises).then(() => {
                        console.log("=== loadMeetingDetails END ===");
                        resolve();
                    });
                } else {
                    console.warn(" detailList empty or invalid");
                    resolve();
                }
            },
            (err) => {
                console.error(" Error in readMeetingMinuteManagmentDetail:", err);
                resolve();
            }
        );
    });
}

//*******************************************************************************************************
//افزودن دیتا به جدول
function addRowToTable(item) {
    const $template = $("#tblMinuteManagment tbody tr.row-template").first().clone();
    $template.removeClass("row-template").addClass("data-row").show();

    $template.attr("data-rowid", String(item.Id));

    $template.find("td").eq(0).html(
        `<input type="radio" name="selectedRowId" value="${item.Id}" />`
    );
    $template.find("td").eq(1).text(item.Id);
    $template.find("td").eq(2).text(item.Title || "-"); // عنوان مصوبه
    $template.find("td").eq(3).text(item.ResponsibleForActionName || "-"); // نام مسئول
  $template.find("td").eq(4)
    .text(item.DisplayDate || "-")
    .attr("data-gdate", item.ActionDeadLineDate || "")
    .attr("data-jdate", item.DisplayDate || "");
    $template.find("td").eq(5) // نفرات اجرا
        .text(item.ResponsibleForActionName || "-") // ← متن نفرات
        .attr("data-ids", item.ResponsibleForAction || ""); // آی‌دی نفرات

    $("#tblMinuteManagment tbody").append($template);
}

//*******************************************************************************************************
var actorLookup = {};
// گرفتن نام مسئولین بر اساس IDها
function getNameForIds(ids) {
    console.log(`[getNameForIds] starting for IDs = ${ids.join(",")}`);

    return new Promise((resolve) => {
        if (!Array.isArray(ids) || !ids.length) {
            return resolve(["-"]);
        }

        const results = [];
        let processed = 0;

        ids.forEach((responsibleId) => {
            console.log(`[getNameForIds] request to service for ActorId=${responsibleId}`);

            BS_GetUserInfo.Read(
                { Where: "ActorId = '" + responsibleId + "'" },
                function (data) {
                    let name = "-";

                    // حالت پاسخ XML به شکل string
                    if (typeof data === "string") {
                        const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
                        const fullNameNode = xmlDoc.querySelector("col[name='fullName']");
                        name = fullNameNode ? fullNameNode.textContent.trim() : "-";
                    }
                    // حالت پاسخ آرایه جاوااسکریپت
                    else if (Array.isArray(data) && data.length) {
                        name = data[0].FullName || data[0].Name || "-";
                    }

                    // ذخیره در actorLookup برای استفاده‌ی احتمالی بعدی
                    actorLookup[responsibleId] = name;
                    console.log(`[BS_GetUserInfo.Read] saved: ${name}`);

                    results.push(name);
                    processed++;
                    if (processed === ids.length) {
                        resolve(results);
                    }
                },
                function () {
                    console.warn(`[BS_GetUserInfo.Read] error for ActorId=${responsibleId}`);
                    actorLookup[responsibleId] = "-";
                    results.push("-");
                    processed++;
                    if (processed === ids.length) {
                        resolve(results);
                    }
                }
            );
        });
    });
}
//*******************************************************************************************************


{
    "Id":"208",
    "MeetingManagmentId":"33",
    "Title":"مصوبه 1",
    "ActionDeadLineDate":"10/13/2025",
    "ResponsibleForAction":"342"
}

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
			// شناسه
            tds.eq(1).text(rowInfo.MeetingManagmentId);
			
            // عنوان جلسه
            tds.eq(2).text(rowInfo.Title);
            // شخص مسئول
			tds.eq(3).text(rowInfo.ResponsibleForAction);
            // تاریخ انجام
            const [gmSD, gdSD, gySD] = rowInfo.ActionDeadLineDate.split('/').map(n => parseInt(n, 10));
            tds.eq(4).text(convertGregorianToJalali(gySD, gmSD, gdSD));
			
            // عنوان
            tds.eq(5).text(rowInfo.SubjectMeeting); 
            tds.eq(5).text(rowInfo.ProcessTitle);
            tds.eq(6).text(rowInfo.ProcessTitle);
			
            // تعداد جزئیات درخواست
            tds.eq(7).text(rowInfo.CostRequestDetailCount);   
			
            // مجموع هزینه	
            tds.eq(8).text(formatNumber(rowInfo.SumRequestCostPrice));

            // Add the row before the template
            element.children("tbody").children("tr.row-template").before(tempRow);
			

            closeLoading();











