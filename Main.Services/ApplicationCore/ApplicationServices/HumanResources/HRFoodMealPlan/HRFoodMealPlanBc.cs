using Marina.Services.ApplicationCore.DomainModels.HumanResources;
using Marina.Services.Infrastructure.Data.Repositories.HumanResources;
using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HRFoodMealPlan;

public class HRFoodMealPlanBc : BusinessCore<HRFoodMealPlanKeyViewModel,
                                            HRFoodMealPlanViewModel,
                                            HRFoodMealPlanFullViewModel,
                                            HRFoodMealPlanBm, 
                                            HRFoodMealPlanModel, 
                                            HRFoodMealPlanRepository, 
                                            HRFoodMealPlanListViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly HRFoodMealPlanRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HRFoodMealPlanBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new HRFoodMealPlanRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(HRFoodMealPlanBc),
                                        $"Exception in constructor of {nameof(HRFoodMealPlanBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(HRFoodMealPlanBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<HRFoodMealPlanKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;
        StringBuilder query = new();

        query.Append($@" 
            SELECT ZJM.HR_FoodMealPlan.FoodMealPlanId,
                   ZJM.HR_FoodMealPlan.FoodId,
                   ZJM.HR_Food.FoodTitle,
                   ZJM.HR_FoodMealPlan.MealId,
                   ZJM.HR_Meal.MealTitle,
                   ZJM.HR_FoodMealPlan.CalendarId,
                   ZJM.HR_Calendar.Date,
                   ZJM.HR_Calendar.SolarDate,
                   ZJM.HR_Calendar.SolarStrDay
            FROM ZJM.HR_FoodMealPlan
                INNER JOIN ZJM.HR_Food ON ZJM.HR_FoodMealPlan.FoodId = ZJM.HR_Food.FoodId
                INNER JOIN ZJM.HR_Meal ON ZJM.HR_FoodMealPlan.MealId = ZJM.HR_Meal.MealId
                INNER JOIN ZJM.HR_Calendar ON ZJM.HR_FoodMealPlan.CalendarId = ZJM.HR_Calendar.CalendarId
            WHERE ZJM.HR_FoodMealPlan.FoodMealPlanId = {viewModel.FoodMealPlanId}
        ");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public override SysResult Update(HRFoodMealPlanFullViewModel viewModel)
    {
        var updateValues = new { viewModel.FoodId, viewModel.MealId, viewModel.CalendarId };
        var predicate = "FoodMealPlanId = @FoodMealPlanId";
        var predicateParameters = new
        {
            viewModel.FoodMealPlanId
        };

        var result = _repository.Update(updateValues, predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
    public override SysResult Delete(HRFoodMealPlanKeyViewModel viewModel)
    {
        var predicate = "FoodMealPlanId = @FoodMealPlanId";
        var predicateParameters = new
        {
            viewModel.FoodMealPlanId
        };

        var result = _repository.Delete(predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@" 
                SELECT ZJM.HR_FoodMealPlan.FoodMealPlanId,
                       ZJM.HR_FoodMealPlan.FoodId,
                       ZJM.HR_Food.FoodTitle,
                       ZJM.HR_FoodMealPlan.MealId,
                       ZJM.HR_Meal.MealTitle,
                       ZJM.HR_FoodMealPlan.CalendarId,
                       ZJM.HR_Calendar.Date,
                       ZJM.HR_Calendar.SolarDate,
                       ZJM.HR_Calendar.SolarStrDay
                FROM ZJM.HR_FoodMealPlan
                    INNER JOIN ZJM.HR_Food ON ZJM.HR_FoodMealPlan.FoodId = ZJM.HR_Food.FoodId
                    INNER JOIN ZJM.HR_Meal ON ZJM.HR_FoodMealPlan.MealId = ZJM.HR_Meal.MealId
                    INNER JOIN ZJM.HR_Calendar ON ZJM.HR_FoodMealPlan.CalendarId = ZJM.HR_Calendar.CalendarId
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(HRFoodMealPlanBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(HRFoodMealPlanBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
    public SysResult GetActiveFoodMealPlans()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@" 
                SELECT 
                  ZJM.HR_Calendar.SolarDate, 
                  ZJM.HR_Calendar.SolarStrDay, 
                  IIF(HR_Food_1.FoodTitle IS NULL, ZJM.HR_Food.FoodTitle, ZJM.HR_Food.FoodTitle+' - '+HR_Food_1.FoodTitle) AS FoodTitle, 
                  ZJM.HR_Calendar.DateTime AS MiladiDate
                FROM 
                  ZJM.HR_FoodMealPlan 
                  INNER JOIN ZJM.HR_Food ON ZJM.HR_FoodMealPlan.FoodId = ZJM.HR_Food.FoodId 
                  INNER JOIN ZJM.HR_Calendar ON ZJM.HR_FoodMealPlan.CalendarId = ZJM.HR_Calendar.CalendarId 
                  LEFT OUTER JOIN ZJM.HR_Food AS HR_Food_1 ON ZJM.HR_FoodMealPlan.FoodId2 = HR_Food_1.FoodId 
                WHERE 
                  (
                    CAST(ZJM.HR_Calendar.DateTime AS DATE) >= CAST(
                      GETDATE() AS DATE
                    )
                  ) 
                ORDER BY 
                  ZJM.HR_Calendar.SolarDate
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(HRFoodMealPlanBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(HRFoodMealPlanBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}