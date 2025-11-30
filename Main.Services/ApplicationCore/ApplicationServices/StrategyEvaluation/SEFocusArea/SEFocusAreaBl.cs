using Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEVision;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEFocusArea;

public class SEFocusAreaBl : BusinessLogic<SEFocusAreaKeyViewModel, 
                                            SEFocusAreaViewModel,
                                            SEFocusAreaFullViewModel,
                                            SEFocusAreaResultViewModel,
                                            SEFocusAreaBc, 
                                            SEFocusAreaBr, 
                                            SEFocusAreaBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public SEFocusAreaBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
        : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;

        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEFocusAreaBl),
                                        $"Exception in constructor of {nameof(SEFocusAreaBl)} Class");

            var message = $"Exception in constructor of {nameof(SEFocusAreaBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAllByVision(DataRequestConfig<SEFocusAreaViewModel> config)
    {
        var businessCore = new SEFocusAreaBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAllByVision(config);
    }
    //********************************************************************************************************************
}