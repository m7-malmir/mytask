using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpi;
public class SEStrategicKpiBm : BusinessMapper<SEStrategicKpiModel, SEStrategicKpiViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public SEStrategicKpiBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        _logger = logger;
        _dbConnection = dbConnection;
    }
    //********************************************************************************************************************
    /// <summary>
    /// تبدیل ویومدل آبجکت به مدل متناظر
    /// </summary>
    /// <param name="viewModel">ویومدل</param>
    /// <returns></returns>
    public override SysResult ToModel(SEStrategicKpiViewModel viewModel)
    {
        try
        {
            var model = new SEStrategicKpiModel
            {
                StrategicKPINameEN = viewModel.StrategicKPINameEN,
                StrategicKPINameFA=viewModel.StrategicKPINameFA,
                KPICode=viewModel.KPICode,
                KPIResultType=viewModel.KPIResultType,
                KPITimeVisionType=viewModel.KPITimeVisionType,
                KPIMetricUnitId=viewModel.KPIMetricUnitId,
                KPIUsageType=viewModel.KPIUsageType,
                Threshold=viewModel.Threshold,
                UpperControlLimit=viewModel.UpperControlLimit,
                LowerControlLimit=viewModel.LowerControlLimit,
                IsManagementKPI=viewModel.IsManagementKPI,
                VerificationSource=viewModel.VerificationSource,
                KPIFormula=viewModel.KPIFormula
            };

            return Result.Success(Messages.ModelMappedSuccess, model);
        }
        catch (Exception e)
        {
            return Result.ErrorOfException(e);
        }
    }
    //********************************************************************************************************************
    /// <summary>
    /// تبدیل ویومدل آبجکت به مدل متناظر
    /// </summary>
    /// <param name="viewModel">ویومدل</param>
    /// <returns></returns>
    public override SysResult ToModels(IEnumerable<SEStrategicKpiViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new SEStrategicKpiModel
            {
                StrategicKPINameEN = item.StrategicKPINameEN,
                StrategicKPINameFA = item.StrategicKPINameFA,
                KPICode = item.KPICode,
                KPIResultType = item.KPIResultType,
                KPITimeVisionType = item.KPITimeVisionType,
                KPIMetricUnitId = item.KPIMetricUnitId,
                KPIUsageType = item.KPIUsageType,
                Threshold = item.Threshold,
                UpperControlLimit = item.UpperControlLimit,
                LowerControlLimit = item.LowerControlLimit,
                IsManagementKPI = item.IsManagementKPI,
                VerificationSource = item.VerificationSource,
                KPIFormula = item.KPIFormula
            }).ToList();

            return Result.Success(Messages.ModelMappedSuccess, models);
        }
        catch (Exception e)
        {
            return Result.ErrorOfException(e);
        }
    }
    //********************************************************************************************************************
}