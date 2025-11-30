using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEUnit;

public class SEUnitBl : BusinessLogic<SEUnitKeyViewModel,
                                         SEUnitViewModel,
                                         SEUnitFullViewModel,
                                         SEUnitResultViewModel,
                                         SEUnitBc,
                                         SEUnitBr,
                                         SEUnitBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    private readonly SEUnitBc _bc;
    public SEUnitBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId) : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;
        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
            _bc = new SEUnitBc(_logger, currentCompanyId, _currentUserId, null);
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEUnitBl),
                                        $"Exception in constructor of {nameof(SEUnitBl)} Class");

            var message = $"Exception in constructor of {nameof(SEUnitBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new SEUnitBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}
