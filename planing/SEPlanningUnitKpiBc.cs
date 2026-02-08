using Marina.Services.ApplicationCore.DomainModels.PlanningModels;
using Marina.Services.Infrastructure.Data.Repositories.Planning;
using Marina.ViewModels.PlanningViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Planning.SEPlanningUnitKpi;

public class SEPlanningUnitKpiBc
    : BusinessCore<
        SEPlanningUnitKpiKeyViewModel,
        SEPlanningUnitKpiBaseViewModel,
        SEPlanningUnitKpiFullViewModel,
        SEPlanningUnitKpiBm,
        SEPlanningUnitKpiModel,
        SEPlanningUnitKpiRepository,
        SEPlanningUnitKpiResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEPlanningUnitKpiRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;

    //*******************************************************************************************************************
    public SEPlanningUnitKpiBc(
        Serilog.ILogger logger,
        byte currentCompanyId,
        string currentUserId,
        IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new SEPlanningUnitKpiRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(
                GeneralEnums.LogType.Error,
                "Constructor",
                nameof(SEPlanningUnitKpiBc),
                $"Exception in constructor of {nameof(SEPlanningUnitKpiBc)} Class",
                ex);

            var message =
                $"Exception in constructor of {nameof(SEPlanningUnitKpiBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //*******************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        if (config.CustomFilters == null)
            return Result.Error("Costum Filters is not defined");

        var planningId = config.CustomFilters.Get<int>("UsedInPlanningId");
        var unitIdList = config.CustomFilters.Get<int>("UnitIdList");

        StringBuilder query = new();

        query.Append($@"
            SELECT SOSK.Id,
                   SOSK.ObjectiveId,
                   SO.ObjectiveCode,
                   SO.ObjectiveTitleEN,
                   SOSK.StrategicKPIId,
                   SSK.KPICode,
                   SSK.StrategicKPINameEN,
                   SOSK.UnitsId,
                   (
                       SELECT STRING_AGG(U.Name, ' - ')
                       FROM Bpms_Core.Office.Units AS U
                       WHERE U.Id IN
                             (
                                 SELECT * FROM STRING_SPLIT(SOSK.UnitsId, ',') AS SS
                             )
                   ) UnitsName,
                   SOSK.ReportersId,
                   SOSK.Threshold,
                   SOSK.UpperControlLimit,
                   SOSK.LowerControlLimit,
                   SOSK.VerificationSource,
                   SOSK.UsedInPlanningId
            FROM ZJM.SE_ObjectiveStrategicKPI AS SOSK
                INNER JOIN ZJM.SE_StrategicKPI AS SSK
                    ON SSK.Id = SOSK.StrategicKPIId
                INNER JOIN ZJM.SE_Objective AS SO
                    ON SO.Id = SOSK.ObjectiveId
            WHERE EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(SOSK.UnitsId, ',') AS UnitIdList
                WHERE UnitIdList.value = {unitIdList}
            ) AND (SOSK.UsedInPlanningId = {planningId} OR SOSK.UsedInPlanningId IS NULL)

        ");

        return SelectByQueryWithConfig(config, query);
    }
    //*******************************************************************************************************************
    public override SysResult Find(DataRequestConfigBase config)
    {
        var viewModel = config.GetViewModel<SEPlanningUnitKpiBaseViewModel>;

        if (config.CustomFilters == null)
            return Result.Error("Costum Filters is not defined");

        var planningId = config.CustomFilters.Get<int>("UsedInPlanningId");
        var unitIdList = config.CustomFilters.Get<int>("UnitIdList");

        StringBuilder query = new();

        query.Append($@"
            SELECT SOSK.Id,
                   SOSK.ObjectiveId,
                   SO.ObjectiveCode,
                   SO.ObjectiveTitleEN,
                   SOSK.StrategicKPIId,
                   SSK.KPICode,
                   SSK.StrategicKPINameEN,
                   SOSK.UnitsId,
                   (
                       SELECT STRING_AGG(U.Name, ' - ')
                       FROM Bpms_Core.Office.Units AS U
                       WHERE U.Id IN
                             (
                                 SELECT * FROM STRING_SPLIT(SOSK.UnitsId, ',') AS SS
                             )
                   ) UnitsName,
                   SOSK.ReportersId,
                   SOSK.Threshold,
                   SOSK.UpperControlLimit,
                   SOSK.LowerControlLimit,
                   SOSK.VerificationSource,
                   SOSK.UsedInPlanningId
            FROM ZJM.SE_ObjectiveStrategicKPI AS SOSK
                INNER JOIN ZJM.SE_StrategicKPI AS SSK
                    ON SSK.Id = SOSK.StrategicKPIId
                INNER JOIN ZJM.SE_Objective AS SO
                    ON SO.Id = SOSK.ObjectiveId
            WHERE EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(SOSK.UnitsId, ',') AS UnitIdList
                WHERE UnitIdList.value = {unitIdList}
            ) AND (SOSK.UsedInPlanningId = {planningId} OR SOSK.UsedInPlanningId IS NULL)
        ");
        return _repository.SelectByQuery(query.ToString());
    }
    //*******************************************************************************************************************
    public override SysResult Delete(SEPlanningUnitKpiKeyViewModel viewModel)
    {
        var predicate = "Id = @Id";
        var predicateParameters = new
        {
            viewModel.Id
        };

        return _repository.Delete(predicate, predicateParameters);
    }
    //*******************************************************************************************************************
}
