using Marina.Services.ApplicationCore.DomainModels.GenralTable;
using Marina.ViewModels.GeneralTableViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.GeneralTable.GTMetricUnit;

public class GTMetricUnitBm : BusinessMapper<GTMetricUnitModel, GTMetricUnitViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;

    //********************************************************************************************************************
    public GTMetricUnitBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        _logger = logger;
        _dbConnection = dbConnection;
    }
    //********************************************************************************************************************
    /// <summary>
    /// تبدیل ویومدل آبجکت به مدل متناظر
    /// </summary>
    /// <param name="viewModel">ویومدل</param>
    /// <returns></returns>
    public override SysResult ToModel(GTMetricUnitViewModel viewModel)
    {
        try
        {
            var model = new GTMetricUnitModel
            {
                MetricUnitTitleFA = viewModel.MetricUnitTitleFA,
                MetricUnitTitleEN = viewModel.MetricUnitTitleEN,
                Description = viewModel.Description
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
    public override SysResult ToModels(IEnumerable<GTMetricUnitViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new GTMetricUnitModel
            {
                MetricUnitTitleFA = item.MetricUnitTitleFA,
                MetricUnitTitleEN = item.MetricUnitTitleEN,
                Description = item.Description
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