using Marina.ViewModels.AttachedFileViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.AttachedFile;

public class AFAttachedFileBr : BusinessRule<AFAttachedFileKeyViewModel,AFAttachedFileViewModel, AFAttachedFileFullViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly AFAttachedFileBc _businessCore;
    private IDbConnection? _dbConnection;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public AFAttachedFileBr(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        _logger = logger;
        _dbConnection = dbConnection;
        _currentCompanyId = currentCompanyId;
        _currentUserId = currentUserId;

        _businessCore = new AFAttachedFileBc(logger, currentCompanyId, currentUserId, dbConnection);
    }
    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات افزودن
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult AddPrecondition(AFAttachedFileViewModel viewModel)
    {
        return Result.Success(Messages.Continue);
    }
    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات بروزرسانی تغییرات انجام شده
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult UpdatePrecondition(AFAttachedFileFullViewModel viewModel)
    {
        return Result.Success(Messages.Continue);
    }
    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات حذف
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult DeletePrecondition(AFAttachedFileKeyViewModel viewModel)
    {
        return Result.Success(Messages.Continue);
    }
    //********************************************************************************************************************
}