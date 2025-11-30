using Marina.Services.ApplicationCore.DomainModels.HumanResources;
using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HRFoodReservation;

public class HRFoodMealPlanBm : BusinessMapper<HRFoodReservationModel, HRFoodReservationViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HRFoodMealPlanBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        _logger = logger;
        _dbConnection = dbConnection;
        _currentCompanyId = currentCompanyId;
        _currentUserId = currentUserId;
    }
    //********************************************************************************************************************
    /// <summary>
    /// تبدیل ویومدل آبجکت به مدل متناظر
    /// </summary>
    /// <param name="viewModel">ویومدل</param>
    /// <returns></returns>
    public override SysResult ToModel(HRFoodReservationViewModel viewModel)
    {
        try
        {
            var model = new HRFoodReservationModel
            {
                FoodMealPlanId = viewModel.FoodMealPlanId,
                ActorId = viewModel.ActorId,
                PersonnelNo = viewModel.PersonnelNo,
                CreationDate = DateTime.Now
            };

            return Result.Success(Messages.ModelMappedSuccess, model);
        }
        catch (Exception e)
        {
            return Result.ErrorOfException(e);
        }
    }
    //********************************************************************************************************************
    /// <summary>
    /// تبدیل ویومدل آبجکت به مدل متناظر
    /// </summary>
    /// <param name="viewModel">ویومدل</param>
    /// <returns></returns>
    public override SysResult ToModels(IEnumerable<HRFoodReservationViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new HRFoodReservationModel
            {
                FoodMealPlanId = item.FoodMealPlanId,
                ActorId = item.ActorId,
                PersonnelNo = item.PersonnelNo,
                CreationDate = item.CreationDate
            }).ToList();

            return Result.Success(Messages.ModelMappedSuccess, models);
        }
        catch (Exception e)
        {
            return Result.ErrorOfException(e);
        }
    }
    //********************************************************************************************************************
}