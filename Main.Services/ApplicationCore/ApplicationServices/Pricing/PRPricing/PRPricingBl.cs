using Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRPricing;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRPricing;

public class PRPricingBl : BusinessLogic<
                                        PRPricingKeyViewModel,
                                        PRPricingViewModel,
                                        PRPricingFullViewModel,
                                        PRPricingResultViewModel,
                                        PRPricingBc,
                                        PRPricingBr,
                                        PRPricingBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    private readonly PRPricingBc _bc;

    //********************************************************************************************************************
    public PRPricingBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
        : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;

        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            // اصلاح اصلی: CompetitorBrandBc → PRPricingBc
            _bc = new PRPricingBc(_logger, _currentCompanyId, _currentUserId, null);
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(
                GeneralEnums.LogType.Error,
                "Constructor",
                nameof(PRPricingBl),
                $"Exception in constructor of {nameof(PRPricingBl)} Class",
                ex);

            throw new Exception($"Exception in constructor of {nameof(PRPricingBl)}.\n LogID: {logId}", ex);
        }
    }

    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        // اصلاح اصلی: CompetitorBrandBc → PRPricingBc
        var businessCore = new PRPricingBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}
