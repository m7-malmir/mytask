using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HREventCalendar;

public class HREventCalendarBr : BusinessRule<HREventCalendarKeyViewModel, HREventCalendarViewModel, HREventCalendarFullViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly HREventCalendarBc _businessCore;
    private IDbConnection? _dbConnection;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HREventCalendarBr(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        _logger = logger;
        _dbConnection = dbConnection;
        _currentCompanyId = currentCompanyId;
        _currentUserId = currentUserId;

        _businessCore = new HREventCalendarBc(logger, currentCompanyId, currentUserId, dbConnection);
    }
    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات افزودن
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult AddPrecondition(HREventCalendarViewModel viewModel)
    {
        return Result.Success(Messages.Continue);
    }
    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات بروزرسانی تغییرات انجام شده
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult UpdatePrecondition(HREventCalendarFullViewModel viewModel)
    {
        return Result.Success(Messages.Continue);
    }
    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات حذف
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult DeletePrecondition(HREventCalendarKeyViewModel viewModel)
    {
        return Result.Success(Messages.Continue);
    }
    //********************************************************************************************************************
}