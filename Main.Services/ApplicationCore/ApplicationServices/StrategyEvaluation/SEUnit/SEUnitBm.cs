using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEUnit;

public class SEUnitBm : BusinessMapper<SEUnitModel, SEUnitViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public SEUnitBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(SEUnitViewModel viewModel)
    {
        try
        {
            var model = new SEUnitModel
            {
                UnitId = viewModel.UnitId,
                UserId = viewModel.UserId,
                Status = viewModel.Status
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
    public override SysResult ToModels(IEnumerable<SEUnitViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new SEUnitModel
            {
                UnitId = item.UnitId,
                UserId = item.UserId,
                Status = item.Status
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