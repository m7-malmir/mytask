using System.Data;
using System.Text;
using Marina.Services.ApplicationCore.DomainModels.PricingModels;
using Marina.Services.Infrastructure.Data.Repositories.Pricing;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRPricing;

public class PRPricingBc : BusinessCore<
                                    PRPricingKeyViewModel,
                                    PRPricingViewModel,
                                    PRPricingFullViewModel,
                                    PRPricingBm,
                                    PRPricingModel,
                                    PRPricingRepository,
                                    PRPricingResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly PRPricingRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;

    //********************************************************************************************************************
    public PRPricingBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new PRPricingRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(
                GeneralEnums.LogType.Error,
                "Constructor",
                nameof(PRPricingBc),
                $"Exception in constructor of {nameof(PRPricingBc)} class",
                ex);

            throw new Exception($"Exception in constructor of {nameof(PRPricingBc)}. LogID: {logId}", ex);
        }
    }

    //********************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append(@"
            SELECT 
                P.Id,
                P.PricingNo,
                P.CreatorId,
                P.CreatedDate,
                P.ProcessStatus,
                P.RejectStatus
            FROM ZJM.PR_Pricing AS P
        ");

        return SelectByQueryWithConfig(config, query);
    }

    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<PRPricingKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;

        if (viewModel == null)
            return Result.Error("Passed KeyViewModel in DataRequestConfig is null");

        StringBuilder query = new();

        query.Append($@"
            SELECT 
                P.Id,
                P.PricingNo,
                P.CreatorId,
                P.CreatedDate,
                P.ProcessStatus,
                P.RejectStatus
            FROM ZJM.PR_Pricing AS P
            WHERE P.Id = {viewModel.Id}
        ");

        return _repository.SelectByQuery(query.ToString());
    }

    //********************************************************************************************************************
    public override SysResult Update(PRPricingFullViewModel viewModel)
    {
        var updateValues = new
        {
            viewModel.PricingNo,
            viewModel.CreatorId,
            viewModel.CreatedDate,
            viewModel.ProcessStatus,
            viewModel.RejectStatus
        };

        var predicate = "Id = @Id";
        var predicateParameters = new { viewModel.Id };

        return _repository.Update(updateValues, predicate, predicateParameters);
    }

    //********************************************************************************************************************
    public override SysResult Delete(PRPricingKeyViewModel viewModel)
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
                    P.Id,
                    P.PricingNo,
                    P.CreatorId,
                    P.CreatedDate,
                    P.ProcessStatus,
                    P.RejectStatus
                FROM ZJM.PR_Pricing AS P
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(
                GeneralEnums.LogType.Error,
                nameof(GetAll),
                nameof(PRPricingBc),
                $"Exception in {nameof(GetAll)} method of {nameof(PRPricingBc)}",
                ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}
