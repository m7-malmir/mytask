using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpiVariable;

public class SEStrategicKpiVariableBl : BusinessLogic<
                                            SEStrategicKpiVariableKeyViewModel,
                                            SEStrategicKpiVariableViewModel,
                                            SEStrategicKpiVariableFullViewModel,
                                            SEStrategicKpiVariableResultViewModel,
                                            SEStrategicKpiVariableBc,
                                            SEStrategicKpiVariableBr,
                                            SEStrategicKpiVariableBm>
{
    private readonly Serilog.ILogger _logger;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public SEStrategicKpiVariableBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
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
            var logId = _logger.LogCustom(
                GeneralEnums.LogType.Error,
                "Constructor",
                nameof(SEStrategicKpiVariableBl),
                $"Exception in constructor of {nameof(SEStrategicKpiVariableBl)} Class");

            var message = $"Exception in constructor of {nameof(SEStrategicKpiVariableBl)}.\n LogID: {logId}";
            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new SEStrategicKpiVariableBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}