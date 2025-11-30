using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEObjective;

public class SEObjectiveBm : BusinessMapper<SEObjectiveModel, SEObjectiveViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public SEObjectiveBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(SEObjectiveViewModel viewModel)
    {
        try
        {
            var model = new SEObjectiveModel
            {
                FocusAreaId = viewModel.FocusAreaId,
                ObjectiveCode = viewModel.ObjectiveCode,
                ObjectiveTitleFA = viewModel.ObjectiveTitleFA,
                ObjectiveTitleEN = viewModel.ObjectiveTitleEN,
                ObjectiveUnitsEnvolve = viewModel.ObjectiveUnitsEnvolve
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
    public override SysResult ToModels(IEnumerable<SEObjectiveViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new SEObjectiveModel
            {
                FocusAreaId = item.FocusAreaId,
                ObjectiveCode = item.ObjectiveCode,
                ObjectiveTitleFA = item.ObjectiveTitleFA,
                ObjectiveTitleEN = item.ObjectiveTitleEN,
                ObjectiveUnitsEnvolve = item.ObjectiveUnitsEnvolve
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