using Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRSamtInfo;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRSamtInfo;

public class PRSamtInfoBl : BusinessLogic<
                                PRSamtInfoKeyViewModel,
                                PRSamtInfoViewModel,
                                PRSamtInfoFullViewModel,
                                PRSamtInfoResultViewModel,
                                PRSamtInfoBc,
                                PRSamtInfoBr,
                                PRSamtInfoBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    private readonly PRSamtInfoBc _bc;

    //********************************************************************************************************************
    public PRSamtInfoBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
        : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;

        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _bc = new PRSamtInfoBc(_logger, _currentCompanyId, _currentUserId, null);
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(
                GeneralEnums.LogType.Error,
                "Constructor",
                nameof(PRSamtInfoBl),
                $"Exception in constructor of {nameof(PRSamtInfoBl)} Class",
                ex);

            var message = $"Exception in constructor of {nameof(PRSamtInfoBl)}.\n LogID: {logId}";
            throw new Exception(message, ex);
        }
    }

    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new PRSamtInfoBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}
