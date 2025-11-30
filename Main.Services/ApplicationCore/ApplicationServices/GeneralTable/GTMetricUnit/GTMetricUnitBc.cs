using Marina.Services.ApplicationCore.DomainModels.GenralTable;
using Marina.Services.Infrastructure.Data.Repositories.GeneralTables;
using Marina.ViewModels.GeneralTableViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.GeneralTable.GTMetricUnit;

public class GTMetricUnitBc : BusinessCore<GTMetricUnitKeyViewModel,
                                        GTMetricUnitViewModel,
                                        GTMetricUnitFullViewModel,
                                        GTMetricUnitBm,
                                        GTMetricUnitModel,
                                        GTMetricUnitRepository,
                                        GTMetricUnitResultViewModel
                                       >
{
    private readonly Serilog.ILogger _logger;
    private readonly GTMetricUnitRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    public GTMetricUnitBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection) 
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new GTMetricUnitRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(GTMetricUnitBc),
                                        $"Exception in constructor of {nameof(GTMetricUnitBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(GTMetricUnitBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //*******************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append($@" 
                SELECT [Id]
                      ,[MetricUnitTitleFA]
                      ,[MetricUnitTitleEN]
                      ,[Description]
                FROM [Bpms_Product].[ZJM].[GT_MetricUnit]
        ");

        return SelectByQueryWithConfig(config, query);
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<GTMetricUnitKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;
        StringBuilder query = new();

        query.Append($@" 
                SELECT [Id]
                      ,[MetricUnitTitleFA]
                      ,[MetricUnitTitleEN]
                      ,[Description]
                FROM [Bpms_Product].[ZJM].[GT_MetricUnit] = {viewModel.Id}
        ");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public override SysResult Update(GTMetricUnitFullViewModel viewModel)
    {
        var updateValues = new
        {
            //viewModel.Id,
            viewModel.MetricUnitTitleFA,
            viewModel.MetricUnitTitleEN,
            viewModel.Description
        };

        var predicate = "Id = @Id";
        var predicateParameters = new
        {
            viewModel.Id
        };

        var result = _repository.Update(updateValues, predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
    public override SysResult Delete(GTMetricUnitKeyViewModel viewModel)
    {
        var predicate = "Id = @Id";
        var predicateParameters = new
        {
            viewModel.Id
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
                SELECT [Id]
                      ,[MetricUnitTitleFA]
                      ,[MetricUnitTitleEN]
                      ,[Description]
                FROM [Bpms_Product].[ZJM].[GT_MetricUnit]
        ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(GTMetricUnitBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(GTMetricUnitBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}
