            SELECT SOSK.Id,
                   SOSK.ObjectiveId,
                   SO.ObjectiveCode,
                   SO.ObjectiveTitleEN,
                   SSK.KPICode,
                   SSK.StrategicKPINameEN,
                   SOSK.UnitId,
                   (
                       SELECT STRING_AGG(U.Name, ' - ')
                       FROM Bpms_Core.Office.Units AS U
                       WHERE U.Id IN
                             (
                                 SELECT * FROM STRING_SPLIT(SOSK.UnitId, ',') AS SS
                             )
                   ) UnitsName,
                   SOSK.ReportersId,
                   SOSK.ObjectiveProjectCode,
                   SOSK.ObjectiveProjectTitleEN,
                   SOSK.ObjectiveProjectStartDate,
                   SOSK.ObjectiveProjectEndDate,
                   SOSK.ObjectiveVerificationSource,
                   SOSK.UsedInPlanningId
            FROM ZJM.SE_ObjectiveProject AS SOSK
                INNER JOIN ZJM.SE_StrategicKPI AS SSK
                    ON SSK.Id = SOSK.ObjectiveId
                INNER JOIN ZJM.SE_Objective AS SO
                    ON SO.Id = SOSK.ObjectiveId
            WHERE EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(SOSK.UnitId, ',') AS UnitIdList
                WHERE UnitIdList.value = 35
            ) AND (SOSK.UsedInPlanningId = 9 OR SOSK.UsedInPlanningId IS NULL)
