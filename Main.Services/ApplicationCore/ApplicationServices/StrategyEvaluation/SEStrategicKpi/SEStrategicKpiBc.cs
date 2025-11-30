using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.Services.Infrastructure.Data.Repositories.StrategyEvaluation;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpi;
public class SEStrategicKpiBc : BusinessCore<
                                    SEStrategicKpiKeyViewModel,      
                                    SEStrategicKpiViewModel,         
                                    SEStrategicKpiFullViewModel,     
                                    SEStrategicKpiBm,
                                    SEStrategicKpiModel,              
                                    SEStrategicKpiRepository,        
                                    SEStrategicKpiResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEStrategicKpiRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public SEStrategicKpiBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new SEStrategicKpiRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEStrategicKpiBc),
                                        $"Exception in constructor of {nameof(SEStrategicKpiBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(SEStrategicKpiBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append($@"
        SELECT 
            ZJM.SE_StrategicKPI.Id,
            ZJM.SE_StrategicKPI.StrategicKPINameEN,
            ZJM.SE_StrategicKPI.StrategicKPINameFA,
            ZJM.SE_StrategicKPI.KPICode,

            CASE 
                WHEN ZJM.SE_StrategicKPI.KPIResultType = 1 THEN 'Decreasing'
                WHEN ZJM.SE_StrategicKPI.KPIResultType = 2 THEN 'Increasing'
                WHEN ZJM.SE_StrategicKPI.KPIResultType = 3 THEN 'Maintaining'
                ELSE ''
            END AS KPIResultTypeTitle,

            CASE 
                WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 1 THEN 'Lagging'
                WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 2 THEN 'Current'
                WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 3 THEN 'Leading'
                ELSE ''
            END AS KPITimeVisionTypeTitle,

            ZJM.SE_StrategicKPI.KPIMetricUnitId,

            CASE
                WHEN ZJM.SE_StrategicKPI.KPIUsageType = 1 THEN 'IM (Improvement)'
                WHEN ZJM.SE_StrategicKPI.KPIUsageType = 2 THEN 'BAU (Business As Usual / Monitor)'
                ELSE ''
            END AS KPIUsageTypeTitle,

            ZJM.SE_StrategicKPI.Threshold,
            ZJM.SE_StrategicKPI.UpperControlLimit,
            ZJM.SE_StrategicKPI.LowerControlLimit,

            CASE 
                WHEN ZJM.SE_StrategicKPI.IsManagementKPI = 1 THEN 'Yes'
                WHEN ZJM.SE_StrategicKPI.IsManagementKPI = 0 THEN 'No'
                ELSE ''
            END AS IsManagementKPITitle,

            ZJM.SE_StrategicKPI.VerificationSource,
            ZJM.SE_StrategicKPI.KPIFormula,
            ZJM.GT_MetricUnit.MetricUnitTitleFA,
            ZJM.GT_MetricUnit.MetricUnitTitleEN
        FROM 
            ZJM.SE_StrategicKPI
        LEFT JOIN 
            ZJM.GT_MetricUnit
            ON ZJM.SE_StrategicKPI.KPIMetricUnitId = ZJM.GT_MetricUnit.Id
    ");


        return SelectByQueryWithConfig(config, query);
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<SEStrategicKpiKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;
        StringBuilder query = new();

        query.Append($@"
        SELECT 
            ZJM.SE_StrategicKPI.Id,
            ZJM.SE_StrategicKPI.StrategicKPINameEN,
            ZJM.SE_StrategicKPI.StrategicKPINameFA,
            ZJM.SE_StrategicKPI.KPICode,

            CASE 
                WHEN ZJM.SE_StrategicKPI.KPIResultType = 1 THEN 'Decreasing'
                WHEN ZJM.SE_StrategicKPI.KPIResultType = 2 THEN 'Increasing'
                WHEN ZJM.SE_StrategicKPI.KPIResultType = 3 THEN 'Maintaining'
                ELSE ''
            END AS KPIResultTypeTitle,

            CASE 
                WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 1 THEN 'Lagging'
                WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 2 THEN 'Current'
                WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 3 THEN 'Leading'
                ELSE ''
            END AS KPITimeVisionTypeTitle,

            ZJM.SE_StrategicKPI.KPIMetricUnitId,

            CASE
                WHEN ZJM.SE_StrategicKPI.KPIUsageType = 1 THEN 'IM (Improvement)'
                WHEN ZJM.SE_StrategicKPI.KPIUsageType = 2 THEN 'BAU (Business As Usual / Monitor)'
                ELSE ''
            END AS KPIUsageTypeTitle,

            ZJM.SE_StrategicKPI.Threshold,
            ZJM.SE_StrategicKPI.UpperControlLimit,
            ZJM.SE_StrategicKPI.LowerControlLimit,

            CASE 
                WHEN ZJM.SE_StrategicKPI.IsManagementKPI = 1 THEN 'Yes'
                WHEN ZJM.SE_StrategicKPI.IsManagementKPI = 0 THEN 'No'
                ELSE ''
            END AS IsManagementKPITitle,

            ZJM.SE_StrategicKPI.VerificationSource,
            ZJM.SE_StrategicKPI.KPIFormula,
            ZJM.GT_MetricUnit.MetricUnitTitleFA,
            ZJM.GT_MetricUnit.MetricUnitTitleEN
        FROM 
            ZJM.SE_StrategicKPI
        LEFT JOIN 
            ZJM.GT_MetricUnit
            ON ZJM.SE_StrategicKPI.KPIMetricUnitId = ZJM.GT_MetricUnit.Id
        WHERE ZJM.SE_StrategicKPI.Id = {viewModel.Id}");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public override SysResult Update(SEStrategicKpiFullViewModel viewModel)
    {
        var updateValues = new
        {
            //viewModel.Id,
            viewModel.StrategicKPINameEN,
            viewModel.StrategicKPINameFA,
            viewModel.KPICode,
            viewModel.KPIResultType,
            viewModel.KPITimeVisionType,
            viewModel.KPIMetricUnitId,
            viewModel.KPIUsageType,
            viewModel.Threshold,
            viewModel.UpperControlLimit,
            viewModel.LowerControlLimit,
            viewModel.IsManagementKPI,
            viewModel.VerificationSource,
            viewModel.KPIFormula
        };

        var predicate = "Id = @Id";
        var predicateParameters = new
        {
            viewModel.Id
        };

        var result = _repository.Update(updateValues, predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
    public override SysResult Delete(SEStrategicKpiKeyViewModel viewModel)
    {
        var predicate = "Id = @Id";
        var predicateParameters = new
        {
            viewModel.Id
        };

        var result = _repository.Delete(predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@"
            SELECT 
                ZJM.SE_StrategicKPI.Id,
                ZJM.SE_StrategicKPI.StrategicKPINameEN,
                ZJM.SE_StrategicKPI.StrategicKPINameFA,
                ZJM.SE_StrategicKPI.KPICode,

                CASE 
                    WHEN ZJM.SE_StrategicKPI.KPIResultType = 1 THEN 'Decreasing'
                    WHEN ZJM.SE_StrategicKPI.KPIResultType = 2 THEN 'Increasing'
                    WHEN ZJM.SE_StrategicKPI.KPIResultType = 3 THEN 'Maintaining'
                    ELSE ''
                END AS KPIResultTypeTitle,

                CASE 
                    WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 1 THEN 'Lagging'
                    WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 2 THEN 'Current'
                    WHEN ZJM.SE_StrategicKPI.KPITimeVisionType = 3 THEN 'Leading'
                    ELSE ''
                END AS KPITimeVisionTypeTitle,

                ZJM.SE_StrategicKPI.KPIMetricUnitId,

                CASE
                    WHEN ZJM.SE_StrategicKPI.KPIUsageType = 1 THEN 'IM (Improvement)'
                    WHEN ZJM.SE_StrategicKPI.KPIUsageType = 2 THEN 'BAU (Business As Usual / Monitor)'
                    ELSE ''
                END AS KPIUsageTypeTitle,

                ZJM.SE_StrategicKPI.Threshold,
                ZJM.SE_StrategicKPI.UpperControlLimit,
                ZJM.SE_StrategicKPI.LowerControlLimit,

                CASE 
                    WHEN ZJM.SE_StrategicKPI.IsManagementKPI = 1 THEN 'Yes'
                    WHEN ZJM.SE_StrategicKPI.IsManagementKPI = 0 THEN 'No'
                    ELSE ''
                END AS IsManagementKPITitle,

                ZJM.SE_StrategicKPI.VerificationSource,
                ZJM.SE_StrategicKPI.KPIFormula,
                ZJM.GT_MetricUnit.MetricUnitTitleFA,
                ZJM.GT_MetricUnit.MetricUnitTitleEN
            FROM 
                ZJM.SE_StrategicKPI
            LEFT JOIN 
                ZJM.GT_MetricUnit
                ON ZJM.SE_StrategicKPI.KPIMetricUnitId = ZJM.GT_MetricUnit.Id
        ");
            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                    nameof(GetAll),
                    nameof(SEStrategicKpiBc),
                    $"Exception in {nameof(GetAll)} Method of {nameof(SEStrategicKpiBc)}",
                    ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
}