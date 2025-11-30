using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEVision;

public class SEVisionBl : BusinessLogic<SEVisionKeyViewModel,
                                         SEVisionViewModel,
                                         SEVisionFullViewModel,
                                         SEVisionResultViewModel,
                                         SEVisionBc,
                                         SEVisionBr,
                                         SEVisionBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    private readonly SEVisionBc _bc;
    public SEVisionBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId) : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;
        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
            _bc = new SEVisionBc(_logger, currentCompanyId, _currentUserId, null);
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEVisionBl),
                                        $"Exception in constructor of {nameof(SEVisionBl)} Class");

            var message = $"Exception in constructor of {nameof(SEVisionBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult Update2(DataPostConfig<SEVisionFullViewModel> config)
    {
        var result = new SysResult();
        foreach (var viewModel in config.ViewModels)
        {
            result=_bc.Update2(viewModel);

            if (!result.Successed) return result;
        }
        return result;
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new SEVisionBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}
