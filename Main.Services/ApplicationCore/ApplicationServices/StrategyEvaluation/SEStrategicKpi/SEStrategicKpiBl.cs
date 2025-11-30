using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpi;
public class SEStrategicKpiBl : BusinessLogic<
                                    SEStrategicKpiKeyViewModel,
                                    SEStrategicKpiViewModel,
                                    SEStrategicKpiFullViewModel,
                                    SEStrategicKpiResultViewModel,
                                    SEStrategicKpiBc,
                                    SEStrategicKpiBr,
                                    SEStrategicKpiBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public SEStrategicKpiBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
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
                                        nameof(SEStrategicKpiBl),
                                        $"Exception in constructor of {nameof(SEStrategicKpiBl)} Class");

            var message = $"Exception in constructor of {nameof(SEStrategicKpiBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new SEStrategicKpiBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}