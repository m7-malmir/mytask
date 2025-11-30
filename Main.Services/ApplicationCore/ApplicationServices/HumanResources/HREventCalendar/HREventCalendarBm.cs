using Marina.Services.ApplicationCore.DomainModels.HumanResources;
using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HREventCalendar;

public class HREventCalendarBm : BusinessMapper<HREventCalendarModel, HREventCalendarViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HREventCalendarBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
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
    public override SysResult ToModel(HREventCalendarViewModel viewModel)
    {
        try
        {
            var model = new HREventCalendarModel
            {
                EventShamsiDate = viewModel.EventShamsiDate,
                EventTitleEN = viewModel.EventTitleEN,
                EventTitleFA = viewModel.EventTitleFA
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
    public override SysResult ToModels(IEnumerable<HREventCalendarViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new HREventCalendarModel
            {
                EventShamsiDate = item.EventShamsiDate,
                EventTitleEN = item.EventTitleEN,
                EventTitleFA = item.EventTitleFA
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