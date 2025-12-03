using Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRCompetitorBrand;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRCompetitorBrand;

public class PRPricingBl : BusinessLogic<
                                        PRCompetitorBrandKeyViewModel,
                                        PRCompetitorBrandViewModel,
                                        PRCompetitorBrandFullViewModel,
                                        PRCompetitorBrandResultViewModel,
                                        PRCompetitorBrandBc,
                                        PRCompetitorBrandBr,
                                        PRCompetitorBrandBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    private readonly PRCompetitorBrandBc _bc;

    //********************************************************************************************************************
    public PRPricingBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
        : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;

        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _bc = new PRCompetitorBrandBc(_logger, _currentCompanyId, _currentUserId, null);
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(
                GeneralEnums.LogType.Error,
                "Constructor",
                nameof(PRPricingBl),
                $"Exception in constructor of {nameof(PRPricingBl)} Class",
                ex);

            var message = $"Exception in constructor of {nameof(PRPricingBl)}.\n LogID: {logId}";
            throw new Exception(message, ex);
        }
    }

    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new PRCompetitorBrandBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}
