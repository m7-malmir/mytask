$("#momMeetingMinutes_Add").off("click").on("click", function () {
    const presentIds = ($("#txtPresentActorId").val() || "")
        .split(",").map(id => id.trim()).filter(Boolean);
    const absentIds = ($("#txtAbsentActorId").val() || "")
        .split(",").map(id => id.trim()).filter(Boolean);

    $.showModalForm(
        {
            registerKey: "ZJM.MOM.MinutesMeetingApprovals",
            params: { 
                presentIds: presentIds,
                absentIds: absentIds
            }
        },
        function (retVal) {
            if (retVal && retVal.OK && retVal.Result) {
                handleNewMinuteItem(retVal.Result);
            }
        }
    );
});
























txtMeetingStartTime  ->cmbMeetingStartTime
txtMinMeetingStartTime  -> cmbMinMeetingStartTime
txtHourMeetingEndTime  -> cmbHourMeetingEndTime
txtminMeetingEndTime  -> cmbMinMeetingEndTime