using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.Services.Infrastructure.Data.Repositories.StrategyEvaluation;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpiVariable;

public class SEStrategicKpiVariableBc : BusinessCore<
                                            SEStrategicKpiVariableKeyViewModel,
                                            SEStrategicKpiVariableViewModel,
                                            SEStrategicKpiVariableFullViewModel,
                                            SEStrategicKpiVariableBm,
                                            SEStrategicKpiVariableModel,
                                            SEStrategicKpiVariableRepository,
                                            SEStrategicKpiVariableResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEStrategicKpiVariableRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;

    //********************************************************************************************************************
    public SEStrategicKpiVariableBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new SEStrategicKpiVariableRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEStrategicKpiVariableBc),
                                        $"Exception in constructor of {nameof(SEStrategicKpiVariableBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(SEStrategicKpiVariableBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }

    //********************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append(@"
            SELECT 
                ZJM.SE_StrategicKPIVariable.Id,
                ZJM.SE_StrategicKPIVariable.VariableNameFA,
                ZJM.SE_StrategicKPIVariable.VariableNameEN,
                ZJM.SE_StrategicKPIVariable.VariableMetricUnitId,
                ZJM.GT_MetricUnit.MetricUnitTitleFA,
                ZJM.GT_MetricUnit.MetricUnitTitleEN,
                ZJM.SE_StrategicKPIVariable.DataPlacementName,
                ZJM.SE_StrategicKPIVariable.DataPlacementPath,
                ZJM.SE_StrategicKPIVariable.IsAPI,
                CASE 
                    WHEN ZJM.SE_StrategicKPIVariable.IsAPI = 1 THEN 'Yes'
                    WHEN ZJM.SE_StrategicKPIVariable.IsAPI = 0 THEN 'No'
                    ELSE 'No'
                END AS IsAPITitle
            FROM 
                ZJM.SE_StrategicKPIVariable
            INNER JOIN 
                ZJM.GT_MetricUnit
                ON ZJM.SE_StrategicKPIVariable.VariableMetricUnitId = ZJM.GT_MetricUnit.Id
        ");


        return SelectByQueryWithConfig(config, query);
    }

    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<SEStrategicKpiVariableKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;

        if (viewModel == null)
            return Result.Error("Passed KeyViewModel in DataRequestConfig is Null");

        StringBuilder query = new();

        query.Append($@"
            SELECT 
                ZJM.SE_StrategicKPIVariable.Id,
                ZJM.SE_StrategicKPIVariable.VariableNameFA,
                ZJM.SE_StrategicKPIVariable.VariableNameEN,
                ZJM.SE_StrategicKPIVariable.VariableMetricUnitId,
                ZJM.GT_MetricUnit.MetricUnitTitleFA,
                ZJM.GT_MetricUnit.MetricUnitTitleEN,
                ZJM.SE_StrategicKPIVariable.DataPlacementName,
                ZJM.SE_StrategicKPIVariable.DataPlacementPath,
                ZJM.SE_StrategicKPIVariable.IsAPI,
                CASE 
                    WHEN ZJM.SE_StrategicKPIVariable.IsAPI = 1 THEN 'Yes'
                    WHEN ZJM.SE_StrategicKPIVariable.IsAPI = 0 THEN 'No'
                    ELSE 'No'
                END AS IsAPITitle
            FROM 
                ZJM.SE_StrategicKPIVariable
            INNER JOIN 
                ZJM.GT_MetricUnit
                ON ZJM.SE_StrategicKPIVariable.VariableMetricUnitId = ZJM.GT_MetricUnit.Id
            WHERE 
                ZJM.SE_StrategicKPIVariable.Id = {viewModel.Id}");

        return _repository.SelectByQuery(query.ToString());
    }

    //********************************************************************************************************************
    public override SysResult Update(SEStrategicKpiVariableFullViewModel viewModel)
    {
        var updateValues = new
        {
            viewModel.VariableNameFA,
            viewModel.VariableNameEN,
            viewModel.VariableMetricUnitId,
            viewModel.DataPlacementName,
            viewModel.DataPlacementPath,
            viewModel.IsAPI
        };

        var predicate = "Id = @Id";
        var predicateParameters = new { viewModel.Id };

        return _repository.Update(updateValues, predicate, predicateParameters);
    }

    //********************************************************************************************************************
    public override SysResult Delete(SEStrategicKpiVariableKeyViewModel viewModel)
    {
        var predicate = "Id = @Id";
        var predicateParameters = new { viewModel.Id };

        return _repository.Delete(predicate, predicateParameters);
    }

    //********************************************************************************************************************
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append(@"
                SELECT 
                    ZJM.SE_StrategicKPIVariable.Id,
                    ZJM.SE_StrategicKPIVariable.VariableNameFA,
                    ZJM.SE_StrategicKPIVariable.VariableNameEN,
                    ZJM.SE_StrategicKPIVariable.VariableMetricUnitId,
                    ZJM.SE_StrategicKPIVariable.DataPlacementName,
                    ZJM.SE_StrategicKPIVariable.DataPlacementPath,
                    ZJM.SE_StrategicKPIVariable.IsAPI,
                    CASE 
                        WHEN ZJM.SE_StrategicKPIVariable.IsAPI = 1 THEN 'Yes'
                        WHEN ZJM.SE_StrategicKPIVariable.IsAPI = 0 THEN 'No'
                    END AS IsAPITitle,
                    ZJM.GT_MetricUnit.MetricUnitTitleFA,
                    ZJM.GT_MetricUnit.MetricUnitTitleEN
                FROM 
                    ZJM.SE_StrategicKPIVariable
                INNER JOIN 
                    ZJM.GT_MetricUnit
                        ON ZJM.SE_StrategicKPIVariable.VariableMetricUnitId = ZJM.GT_MetricUnit.Id
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                    nameof(GetAll),
                    nameof(SEStrategicKpiVariableBc),
                    $"Exception in {nameof(GetAll)} Method of {nameof(SEStrategicKpiVariableBc)}",
                    ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
}
