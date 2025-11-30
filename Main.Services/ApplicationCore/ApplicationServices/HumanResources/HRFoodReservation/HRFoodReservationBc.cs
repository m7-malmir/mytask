using Marina.Services.ApplicationCore.DomainModels.HumanResources;
using Marina.Services.Infrastructure.Data.Repositories.HumanResources;
using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HRFoodReservation;

public class HRFoodReservationBc : BusinessCore<HRFoodReservationKeyViewModel,
                                                HRFoodReservationViewModel,
                                                HRFoodReservationFullViewModel,
                                                HRFoodMealPlanBm,
                                                HRFoodReservationModel,
                                                HRFoodReservationRepository,
                                                HRFoodReservationResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly HRFoodReservationRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HRFoodReservationBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new HRFoodReservationRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(HRFoodReservationBc),
                                        $"Exception in constructor of {nameof(HRFoodReservationBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(HRFoodReservationBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<HRFoodReservationKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;
        StringBuilder query = new();
        query.Append($@" 
            SELECT ZJM.HR_FoodReservation.PersonnelNo,
                ZJM.HR_Employee.FirstName,
                ZJM.HR_Employee.LastName,
                ZJM.HR_FoodMealPlan.FoodMealPlanId,
                ZJM.HR_FoodMealPlan.FoodId,
                ZJM.HR_Food.FoodTitle,
                ZJM.HR_Calendar.SolarDate,
                ZJM.HR_FoodReservation.DeliveredTime
            FROM ZJM.HR_FoodMealPlan
                INNER JOIN ZJM.HR_Calendar ON ZJM.HR_FoodMealPlan.CalendarId = ZJM.HR_Calendar.CalendarId
                INNER JOIN ZJM.HR_FoodReservation ON ZJM.HR_FoodMealPlan.FoodMealPlanId = ZJM.HR_FoodReservation.FoodMealPlanId
                INNER JOIN ZJM.HR_Food ON ZJM.HR_FoodMealPlan.FoodId = ZJM.HR_Food.FoodId
                LEFT OUTER JOIN ZJM.HR_Employee ON ZJM.HR_FoodReservation.PersonnelNo = ZJM.HR_Employee.PersonnelNO
            WHERE
	            ZJM.HR_FoodMealPlan.FoodMealPlanId = {viewModel.FoodReservationId}
        ");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public override SysResult Update(HRFoodReservationFullViewModel viewModel)
    {
        var updateValues = new { viewModel.PersonnelNo };
        var predicate = "TransactionCode = @TransactionCode";
        var predicateParameters = new
        {
            viewModel.FoodReservationId
        };

        var result = _repository.Update(updateValues, predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
    public override SysResult Delete(HRFoodReservationKeyViewModel viewModel)
    {
        var predicate = "TransactionCode = @TransactionCode";
        var parameters = new
        {
            viewModel.FoodReservationId
        };

        var result = _repository.Delete(predicate, parameters);

        return result;
    }
    //********************************************************************************************************************
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@" 
                SELECT
	                HRFoodReservation1.TransactionCode,
	                CAST(HRFoodReservation1.TransactionCode AS NVARCHAR(3)) +' - '+ HRFoodReservation1.NAME AS NAME,
	                HRFoodReservation1.RegulatorPers,
	                HRFoodReservation1.RegulatorSignDate,
	                HRFoodReservation1.RegulatorSignTime,
	                HRFoodReservation1.RegulatorSignFlag,
	                HRFoodReservation1.StopPers,
	                HRFoodReservation1.StopSignDate,
	                HRFoodReservation1.StopSignTime,
	                HRFoodReservation1.StopSignFlag 
                FROM
	                HRFoodReservation1
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(HRFoodReservationBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(HRFoodReservationBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
    public SysResult GetActiveFoodMealPlan()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@" 
                SELECT
	                HRFoodReservation1.TransactionCode,
	                CAST(HRFoodReservation1.TransactionCode AS NVARCHAR(3)) +' - '+ HRFoodReservation1.NAME AS NAME,
	                HRFoodReservation1.RegulatorPers,
	                HRFoodReservation1.RegulatorSignDate,
	                HRFoodReservation1.RegulatorSignTime,
	                HRFoodReservation1.RegulatorSignFlag,
	                HRFoodReservation1.StopPers,
	                HRFoodReservation1.StopSignDate,
	                HRFoodReservation1.StopSignTime,
	                HRFoodReservation1.StopSignFlag 
                FROM
	                HRFoodReservation1
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(HRFoodReservationBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(HRFoodReservationBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}