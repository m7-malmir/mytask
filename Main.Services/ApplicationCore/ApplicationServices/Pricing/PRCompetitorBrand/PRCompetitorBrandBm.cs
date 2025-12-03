
using Marina.Services.ApplicationCore.DomainModels.PricingModels;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRCompetitorBrand;

public class PRCompetitorBrandBm : BusinessMapper<PRCompetitorBrandModel, PRCompetitorBrandViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public PRCompetitorBrandBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(PRCompetitorBrandViewModel viewModel)
    {
        try
        {
            var model = new PRCompetitorBrandModel
            {
                BrandNameFA = viewModel.BrandNameFA,
                BrandNameEN = viewModel.BrandNameEN
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
    public override SysResult ToModels(IEnumerable<PRCompetitorBrandViewModel> viewModels)
    {
        try
        {
            var models = viewModels.Select(item => new PRCompetitorBrandModel
            {
                BrandNameFA = item.BrandNameFA,
                BrandNameEN = item.BrandNameEN
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
