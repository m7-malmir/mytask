using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpiVariable;

public class SEStrategicKpiVariableBm : BusinessMapper<SEStrategicKpiVariableModel, SEStrategicKpiVariableViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public SEStrategicKpiVariableBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(SEStrategicKpiVariableViewModel viewModel)
    {
        try
        {
            var model = new SEStrategicKpiVariableModel
            {
                VariableNameFA = viewModel.VariableNameFA,
                VariableNameEN = viewModel.VariableNameEN,
                VariableMetricUnitId = viewModel.VariableMetricUnitId,
                DataPlacementName = viewModel.DataPlacementName,
                DataPlacementPath = viewModel.DataPlacementPath,
                IsAPI = viewModel.IsAPI
            };

            return Result.Success(Messages.ModelMappedSuccess, model);
        }
        catch (Exception ex)
        {
            return Result.ErrorOfException(ex);
        }
    }
    //********************************************************************************************************************
    /// <summary>
    /// تبدیل مجموعه‌ای از ویومدل‌ها به مدل‌های متناظر
    /// </summary>
    /// <param name="viewModels">مجموعه ویومدل‌ها</param>
    /// <returns></returns>
    public override SysResult ToModels(IEnumerable<SEStrategicKpiVariableViewModel> viewModels)
    {
        try
        {
            var models = viewModels.Select(item => new SEStrategicKpiVariableModel
            {
                VariableNameFA = item.VariableNameFA,
                VariableNameEN = item.VariableNameEN,
                VariableMetricUnitId = item.VariableMetricUnitId,
                DataPlacementName = item.DataPlacementName,
                DataPlacementPath = item.DataPlacementPath,
                IsAPI = item.IsAPI
            }).ToList();

            return Result.Success(Messages.ModelMappedSuccess, models);
        }
        catch (Exception ex)
        {
            return Result.ErrorOfException(ex);
        }
    }
    //********************************************************************************************************************
}
