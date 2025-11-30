using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEVision;

public class SEVisionBm : BusinessMapper<SEVisionModel, SEVisionViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public SEVisionBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(SEVisionViewModel viewModel)
    {
        try
        {
            var model = new SEVisionModel
            {
                VisionTitleFA = viewModel.VisionTitleFA,
                VisionTitleEN = viewModel.VisionTitleEN,
                VisionDescription = viewModel.VisionDescription
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
    public override SysResult ToModels(IEnumerable<SEVisionViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new SEVisionModel
            {
                VisionTitleFA = item.VisionTitleFA,
                VisionTitleEN = item.VisionTitleEN,
                VisionDescription = item.VisionDescription
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