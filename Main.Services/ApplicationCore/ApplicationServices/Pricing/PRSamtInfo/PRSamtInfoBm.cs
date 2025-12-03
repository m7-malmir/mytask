using Marina.Services.ApplicationCore.DomainModels.PricingModels;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRSamtInfo;

public class PRSamtInfoBm : BusinessMapper<PRSamtInfoModel, PRSamtInfoViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public PRSamtInfoBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(PRSamtInfoViewModel viewModel)
    {
        try
        {
            var model = new PRSamtInfoModel
            {
                SamtGroupNo = viewModel.SamtGroupNo,
                SamtGroupName = viewModel.SamtGroupName,
                SamtGroupPercent = viewModel.SamtGroupPercent,
                CreatedDate = viewModel.CreatedDate,
                UserCreator = viewModel.UserCreator
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
    public override SysResult ToModels(IEnumerable<PRSamtInfoViewModel> viewModels)
    {
        try
        {
            var models = viewModels.Select(item => new PRSamtInfoModel
            {
                SamtGroupNo = item.SamtGroupNo,
                SamtGroupName = item.SamtGroupName,
                SamtGroupPercent = item.SamtGroupPercent,
                CreatedDate = item.CreatedDate,
                UserCreator = item.UserCreator
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
