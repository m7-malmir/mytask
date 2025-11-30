using Marina.ViewModels.GeneralTableViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.GeneralTable.GTMetricUnit;

public class GTMetricUnitBl : BusinessLogic<GTMetricUnitKeyViewModel,
                                         GTMetricUnitViewModel,
                                         GTMetricUnitFullViewModel,
                                         GTMetricUnitResultViewModel,
                                         GTMetricUnitBc,
                                         GTMetricUnitBr,
                                         GTMetricUnitBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    private readonly GTMetricUnitBc _bc;
    public GTMetricUnitBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId) : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;
        try
        {
            if (currentCompanyId <= 0)
            {
                throw new ArgumentException("Invalid company number", nameof(currentCompanyId));
            }

            if (string.IsNullOrEmpty(currentUserId))
            {
                throw new ArgumentException("Invalid user internet number", nameof(currentUserId));
            }

            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
            _bc = new GTMetricUnitBc(_logger, currentCompanyId, _currentUserId, null);
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(GTMetricUnitBl),
                                        $"Exception in constructor of {nameof(GTMetricUnitBl)} Class");

            var message = $"Exception in constructor of {nameof(GTMetricUnitBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new GTMetricUnitBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}
