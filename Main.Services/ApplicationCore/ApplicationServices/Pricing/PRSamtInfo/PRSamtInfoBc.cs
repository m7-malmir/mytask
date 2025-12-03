using Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRSamtInfo;
using Marina.Services.ApplicationCore.DomainModels.PricingModels;
using Marina.Services.Infrastructure.Data.Repositories.Pricing;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRSamtInfo;

public class PRSamtInfoBc : BusinessCore<
                                PRSamtInfoKeyViewModel,
                                PRSamtInfoViewModel,
                                PRSamtInfoFullViewModel,
                                PRSamtInfoBm,
                                PRSamtInfoModel,
                                PRSamtInfoRepository,
                                PRSamtInfoResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly PRSamtInfoRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;

    //********************************************************************************************************************
    public PRSamtInfoBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new PRSamtInfoRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(PRSamtInfoBc),
                                        $"Exception in constructor of {nameof(PRSamtInfoBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(PRSamtInfoBc)}.\n LogID: {logId}";
            throw new Exception(message, ex);
        }
    }

    //********************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append(@"
            SELECT 
                S.Id,
                S.SamtGroupNo,
                S.SamtGroupName,
                S.SamtGroupPercent
            FROM ZJM.PR_SamtInfo AS S
        ");

        return SelectByQueryWithConfig(config, query);
    }

    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<PRSamtInfoKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;

        if (viewModel == null)
            return Result.Error("Passed KeyViewModel in DataRequestConfig is Null");

        StringBuilder query = new();

        query.Append($@"
            SELECT 
                S.Id,
                S.SamtGroupNo,
                S.SamtGroupName,
                S.SamtGroupPercent,
                S.CreatedDate,
                S.UserCreator
            FROM ZJM.PR_SamtInfo AS S
            WHERE S.Id = {viewModel.Id}
        ");

        return _repository.SelectByQuery(query.ToString());
    }

    //********************************************************************************************************************
    public override SysResult Update(PRSamtInfoFullViewModel viewModel)
    {
        var updateValues = new
        {
            viewModel.SamtGroupNo,
            viewModel.SamtGroupName,
            viewModel.SamtGroupPercent,
            viewModel.UserCreator
        };

        var predicate = "Id = @Id";
        var predicateParameters = new { viewModel.Id };

        return _repository.Update(updateValues, predicate, predicateParameters);
    }

    //********************************************************************************************************************
    public override SysResult Delete(PRSamtInfoKeyViewModel viewModel)
    {
        var predicate = "Id = @Id";
        var predicateParameters = new { viewModel.Id };

        return _repository.Delete(predicate, predicateParameters);
    }

    //********************************************************************************************************************
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append(@"
                SELECT 
                    S.Id,
                    S.SamtGroupNo,
                    S.SamtGroupName,
                    S.SamtGroupPercent
                FROM ZJM.PR_SamtInfo AS S
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        nameof(GetAll),
                                        nameof(PRSamtInfoBc),
                                        $"Exception in {nameof(GetAll)} Method of {nameof(PRSamtInfoBc)}",
                                        ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}
