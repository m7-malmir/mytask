using Dapper;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEFocusArea;

public class SEFocusAreaBr : BusinessRule<SEFocusAreaKeyViewModel, SEFocusAreaViewModel, SEFocusAreaFullViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEFocusAreaBc _businessCore;
    private IDbConnection? _dbConnection;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public SEFocusAreaBr(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        _logger = logger;
        _dbConnection = dbConnection;
        _currentCompanyId = currentCompanyId;
        _currentUserId = currentUserId;

        _businessCore = new SEFocusAreaBc(logger, currentCompanyId, currentUserId, dbConnection);
    }
    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات افزودن
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult AddPrecondition(SEFocusAreaViewModel viewModel)
    {
        try
        {
            var bc = new SEFocusAreaBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);

            var predicate = "VisionId = @VisionId AND FocusAreaCode = @FocusAreaCode";
            var predicateParameters = new
            {
                viewModel.VisionId,
                viewModel.FocusAreaCode
            };

            var result = bc.Select(predicate, predicateParameters);

            if (!result.Successed)
            {
                return result;
            }

            if (result.Value == null)
            {
                return Result.Error("Unable to locate the specified focus area.");
            }

            var focusAreaResultViewModels = (IEnumerable<SEFocusAreaResultViewModel>) result.Value;

            if (focusAreaResultViewModels.Any())
            {
                return Result.Error($"The focus area {viewModel.FocusAreaCode} has already been registered for this vision.");
            }

            return Result.Success(Messages.Continue);
        }
        catch (Exception ex)
        {
            return Result.Error($"An error occurred while checking the prerequisites for adding the focus area: {ex.Message}");
        }
    }

    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات بروزرسانی تغییرات انجام شده
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult UpdatePrecondition(SEFocusAreaFullViewModel viewModel)
    {
        try
        {
            var bc = new SEFocusAreaBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);

            var predicate = "VisionId = @VisionId AND FocusAreaCode = @FocusAreaCode AND Id <> @Id";
            var predicateParameters = new
            {
                viewModel.Id,
                viewModel.VisionId,
                viewModel.FocusAreaCode
            };

            var result = bc.Select(predicate, predicateParameters);

            if (!result.Successed)
            {
                return result;
            }

            if (result.Value == null)
            {
                return Result.Error("Unable to locate the specified focus area.");
            }

            var focusAreaResultViewModels = (IEnumerable<SEFocusAreaResultViewModel>)result.Value;

            if (focusAreaResultViewModels.Any())
            {
                return Result.Error($"The focus area {viewModel.FocusAreaCode} has already been registered for this vision.");
            }

            return Result.Success(Messages.Continue);
        }
        catch (Exception ex)
        {
            return Result.Error($"An error occurred while checking the prerequisites for adding the focus area: {ex.Message}");
        }
    }

    //********************************************************************************************************************
    /// <summary>
    /// بررسی پیش شرط های لازم برای ادامه عملیات حذف
    /// </summary>
    /// <param name="viewModel">ویومدل آبجکت موردنظر</param>
    /// <returns></returns>
    public override SysResult DeletePrecondition(SEFocusAreaKeyViewModel viewModel)
    {
        return Result.Success(Messages.Continue);
    }
    //********************************************************************************************************************
}