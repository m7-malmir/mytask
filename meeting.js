let $form;

$(function () {
    $form = (function () {

async function init() {
    const params = window.dialogArguments || {};
    buildDialog();

    showLoading("در حال بارگذاری اطلاعات...");

    try {
        // اول کمبو بساز و بعد داده‌ها رو Load کن
        await fillComboWithAllowedActors(params.allUsers || []);
        await loadData(
            params?.editItem?.MeetingMinuteDetailId,
            params?.editItem?.MeetingManagmentId,
            params.allUsers || []
        );
    } catch (err) {
        console.error("خطا در مقداردهی پاپ‌آپ:", err);
        alert("خطایی در بارگذاری داده رخ داد. لطفاً مجدداً تلاش کنید.");
    } finally {
        hideLoading();
    }
}


        function buildDialog() {
            changeDialogTitle("بازنگری مصوبه جلسه");
            $('input[role="TextBox"], input[role="DatePicker"]').attr('autocomplete', 'off');
        }

        // فیلتر کردن کمبو با ActorIdهای والد
        function fillComboWithAllowedActors(allUsers) {
            return new Promise((resolve, reject) => {
                let userIds = [];

                if (typeof allUsers === "string") {
                    userIds = allUsers.split(",").map(id => id.trim()).filter(Boolean);
                } else if (Array.isArray(allUsers)) {
                    userIds = allUsers.map(id => String(id).trim()).filter(Boolean);
                }

                if (userIds.length === 0) {
                    console.warn("لیست allUsers خالی است یا به درستی پاس داده نشده.");
                    $("#cmbResponsibleForAction").empty().select2({
                        data: [],
                        placeholder: "هیچ فردی حضور ندارد",
                        dir: "rtl",
                        multiple: true
                    });
                    return resolve();
                }

                BS_GetUserInfo.Read({}, function (data) {
                    try {
                        const xmlData = $.xmlDOM ? $.xmlDOM(data) : $(data);
                        const allRows = xmlData.find("row");
                        const fullList = allRows.map(function () {
                            const actorId = ($(this).find("col[name='ActorId']").text() || "").trim();
                            const fullName = ($(this).find("col[name='fullName']").text() || "").trim();
                            const roleName = ($(this).find("col[name='RoleName']").text() || "").trim();
                            return {
                                id: actorId,
                                text: roleName ? `${fullName} - ${roleName}` : fullName
                            };
                        }).get();

                        const filtered = fullList.filter(item => userIds.includes(item.id));

                        $("#cmbResponsibleForAction").empty().select2({
                            data: filtered,
                            placeholder: filtered.length === 0 ? "کاربری یافت نشد" : "انتخاب کنید",
                            dir: "rtl",
                            multiple: true,
                            dropdownCssClass: "combo-scroll"
                        });

                        // سینک‌کردن فیلد هیدن
                        $("#cmbResponsibleForAction")
                            .off("select2:select select2:unselect")
                            .on("select2:select select2:unselect", function () {
                                const actorIds = ($("#cmbResponsibleForAction").val() || []).map(id => id.trim());
                                $("#txtResponsibleActorId").val(actorIds.join(","));
                            });

                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                }, reject);
            });
        }

        // خواندن داده از سرویس و مقداردهی فرم
function loadData(MeetingMinuteDetailId, meetingManagmentId, allUsersFromParent) {
    return new Promise((resolve, reject) => {
        if (!MeetingMinuteDetailId) {
            console.warn("MeetingMinuteDetailId تعریف نشده است.");
            return resolve();
        }

        
        // شرط دقیق برای فیلتر ویو
// شرط دقیق برای فیلتر ویو
const whereClause =
    `MeetingManagmentId = ${Number(meetingManagmentId)} AND MeetingMinuteDetailId = ${Number(MeetingMinuteDetailId)}`;

        const jsonParams = { Where: whereClause };

        console.log("Reading view with params:", jsonParams);
				BS_vw_MM_MeetingMinuteManagmentDetailAction.Read(jsonParams, function (data) {
                    try {
                        const xmlvar = $.xmlDOM(data);
                        const results = [];

                        xmlvar.find("row").each(function () {
                            results.push({
                                ResponsibleForAction: $(this).find("col[name='ResponsibleForAction']").text().trim(),
                                Title: $(this).find("col[name='Title']").text().trim(),
                                MeetingMinuteDetailId: $(this).find("col[name='MeetingMinuteDetailId']").text().trim(),
                                ActionDeadLineDate: $(this).find("col[name='ActionDeadLineDate']").text().trim(),
                    			ActionDeadLineJDate: $(this).find("col[name='ActionDeadLineJDate']").text().trim()
                            });
                        });

                        if (!results.length) return resolve();
                        const item = results[0];

                        $("#lblIdeaRequestId").text(item.MeetingManagmentId);
                        $("#txtTitle").val(item.Title || "");

					  const rawJDate = (item.ActionDeadLineJDate || "").trim();
					    const rawGDate = (item.ActionDeadLineDate || "").trim();
					    const finalDate = rawJDate || (rawGDate ? formatMiladiToShamsi(rawGDate) : "");
					    $("#txtActionDeadLineDate").val(finalDate);

                        const actorIdsService = String(item.ResponsibleForAction || "")
                            .split(",").map(id => id.trim()).filter(Boolean);
                        const actorIdsParent = Array.isArray(allUsersFromParent)
                            ? allUsersFromParent.map(String)
                            : String(allUsersFromParent || "").split(",").map(x => x.trim()).filter(Boolean);

                        const finalActorIds = [...new Set([...actorIdsService, ...actorIdsParent])];
                        console.log("Merged Responsible Actor IDs:", finalActorIds);

                        $("#txtResponsibleActorId").val(finalActorIds.join(","));
                        $("#cmbResponsibleForAction").val(finalActorIds).trigger("change.select2");

                        console.log("Actors applied successfully to Select2:", finalActorIds);
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                }, reject);
            });
        }

        return { init };
    })();

    $form.init();
});










