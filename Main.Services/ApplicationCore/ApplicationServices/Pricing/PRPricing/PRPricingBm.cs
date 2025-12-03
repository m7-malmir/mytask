using Marina.Services.ApplicationCore.DomainModels.PricingModels;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRPricing;

public class PRPricingBm : BusinessMapper<PRPricingModel, PRPricingViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public PRPricingBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(PRPricingViewModel viewModel)
    {
        try
        {
            var model = new PRPricingModel
            {
                PricingNo = viewModel.PricingNo,
                CreatorId = viewModel.CreatorId,
                CreatedDate = viewModel.CreatedDate,
                ProcessStatus = viewModel.ProcessStatus,
                RejectStatus = viewModel.RejectStatus
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
    /// تبدیل مجموعه‌ای از ویومدل‌ها به مدل‌های متناظر
    /// </summary>
    /// <param name="viewModels">مجموعه ویومدل‌ها</param>
    /// <returns></returns>
    public override SysResult ToModels(IEnumerable<PRPricingViewModel> viewModels)
    {
        try
        {
            var models = viewModels.Select(item => new PRPricingModel
            {
                PricingNo = item.PricingNo,
                CreatorId = item.CreatorId,
                CreatedDate = item.CreatedDate,
                ProcessStatus = item.ProcessStatus,
                RejectStatus = item.RejectStatus
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
