using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HRFoodReservation;

public class HRFoodReservationBl : BusinessLogic<HRFoodReservationKeyViewModel,
                                                HRFoodReservationViewModel,
                                                HRFoodReservationFullViewModel,
                                                HRFoodReservationResultViewModel,
                                                HRFoodReservationBc, 
                                                HRFoodReservationBr, 
                                                HRFoodMealPlanBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HRFoodReservationBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
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
                                        nameof(HRFoodReservationBl),
                                        $"Exception in constructor of {nameof(HRFoodReservationBl)} Class");

            var message = $"Exception in constructor of {nameof(HRFoodReservationBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new HRFoodReservationBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}