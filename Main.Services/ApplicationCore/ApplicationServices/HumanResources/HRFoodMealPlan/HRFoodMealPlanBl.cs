using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HRFoodMealPlan;

public class HRFoodMealPlanBl : BusinessLogic<HRFoodMealPlanKeyViewModel,
                                            HRFoodMealPlanViewModel,
                                            HRFoodMealPlanFullViewModel,
                                            HRFoodMealPlanListViewModel,
                                            HRFoodMealPlanBc, 
                                            HRFoodMealPlanBr, 
                                            HRFoodMealPlanBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HRFoodMealPlanBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
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
                                        nameof(HRFoodMealPlanBl),
                                        $"Exception in constructor of {nameof(HRFoodMealPlanBl)} Class");

            var message = $"Exception in constructor of {nameof(HRFoodMealPlanBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new HRFoodMealPlanBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
    public SysResult GetActiveFoodMealPlans(DataRequestConfigBase config)
    {
        var businessCore = new HRFoodMealPlanBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetActiveFoodMealPlans();
    }
    //********************************************************************************************************************
}