using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HREventCalendar;

public class HREventCalendarBl : BusinessLogic<HREventCalendarKeyViewModel, 
                                            HREventCalendarViewModel,
                                            HREventCalendarFullViewModel,
                                            HREventCalendarResultViewModel,
                                            HREventCalendarBc, 
                                            HREventCalendarBr, 
                                            HREventCalendarBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;

    private readonly HREventCalendarBc _bc;
    //********************************************************************************************************************
    public HREventCalendarBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
        : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;

        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _bc= new HREventCalendarBc(_logger, currentCompanyId, _currentUserId,  null);
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(HREventCalendarBl),
                                        $"Exception in constructor of {nameof(HREventCalendarBl)} Class");

            var message = $"Exception in constructor of {nameof(HREventCalendarBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAllHREvents(DataRequestConfigBase config)
    {
        return _bc.GetAllHREvents();
    }
    //********************************************************************************************************************
}