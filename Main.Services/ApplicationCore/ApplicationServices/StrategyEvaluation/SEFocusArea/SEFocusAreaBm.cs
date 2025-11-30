using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEFocusArea;

public class SEFocusAreaBm : BusinessMapper<SEFocusAreaModel, SEFocusAreaViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public SEFocusAreaBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(SEFocusAreaViewModel viewModel)
    {
        try
        {
            var model = new SEFocusAreaModel
            {
                VisionId = viewModel.VisionId,
                FocusAreaCode = viewModel.FocusAreaCode,
                FocusAreaTitleFA = viewModel.FocusAreaTitleFA,
                FocusAreaTitleEN = viewModel.FocusAreaTitleEN
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
    public override SysResult ToModels(IEnumerable<SEFocusAreaViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new SEFocusAreaModel
            {
                VisionId = item.VisionId,
                FocusAreaCode = item.FocusAreaCode,
                FocusAreaTitleFA = item.FocusAreaTitleFA,
                FocusAreaTitleEN = item.FocusAreaTitleEN
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