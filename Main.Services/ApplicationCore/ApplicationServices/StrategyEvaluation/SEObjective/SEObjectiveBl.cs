using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEObjective;

public class SEObjectiveBl : BusinessLogic<SEObjectiveKeyViewModel,
                                         SEObjectiveViewModel,
                                         SEObjectiveFullViewModel,
                                         SEObjectiveResultViewModel,
                                         SEObjectiveBc,
                                         SEObjectiveBr,
                                         SEObjectiveBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    private readonly SEObjectiveBc _bc;
    public SEObjectiveBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId) : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;
        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
            _bc = new SEObjectiveBc(_logger, currentCompanyId, _currentUserId, null);
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEObjectiveBl),
                                        $"Exception in constructor of {nameof(SEObjectiveBl)} Class");

            var message = $"Exception in constructor of {nameof(SEObjectiveBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new SEObjectiveBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}
